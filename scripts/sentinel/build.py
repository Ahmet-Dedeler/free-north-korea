# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "rasterio>=1.4",
#   "numpy>=2.0",
#   "pillow>=11.0",
# ]
# ///
"""
Camp Watch: dated Sentinel-2 true-colour chips of North Korea's prison camps and nuclear/missile sites.

    uv run scripts/sentinel/build.py              # all targets
    uv run scripts/sentinel/build.py yongbyon     # one or more target ids

What it does, per target from `node scripts/sentinel/targets.ts`:
  1. Locks the target to one Sentinel-2 MGRS tile (same pixel grid every time, so images line up month to month).
  2. Lists Sentinel-2 L2A scenes of that tile for the last 24 months from Element84 Earth Search (STAC, no key).
  3. Judges cloud from the SCL (scene classification) band INSIDE the chip only, with small windowed HTTP range
     reads of the cloud-optimised GeoTIFFs. The tile-wide eo:cloud_cover is only used to order and pre-filter.
  4. Keeps the latest clear chip plus the clearest chip of each month (if one is clear enough), reading only the
     chip window from the true-colour (TCI) COG, and writes JPEGs to public/img/sentinel/<id>/<YYYY-MM-DD>.jpg.
  5. Scores change between consecutive monthly chips and year over year (for humans, never shown on the site).

Outputs:
  data/sentinel.json                       manifest the site reads (dates, scene ids, chip cloud %, bbox, scores)
  data/sentinel/scl-cache.json             chip cloud results per scene, so re-runs only read new scenes
  data/sentinel/masks/<id>/<date>.png      clear-pixel masks used for change scores (not published)
  docs/watch/sentinel-changes.md           change scores for human review
  public/img/sentinel/<id>/<date>.jpg      the images

Incremental: scenes already in the cache are not read again, months that already have a cloud-free chip are not
searched again, and a target that fails keeps its previous images and manifest entry.
Contains modified Copernicus Sentinel data.
"""

from __future__ import annotations

import datetime as dt
import json
import math
import os
import subprocess
import sys
import threading
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

# GDAL settings for fast, small range reads of public COGs over HTTPS. Must be set before rasterio opens anything.
os.environ.update(
    {
        "GDAL_DISABLE_READDIR_ON_OPEN": "EMPTY_DIR",
        "CPL_VSIL_CURL_ALLOWED_EXTENSIONS": ".tif",
        "GDAL_HTTP_MERGE_CONSECUTIVE_RANGES": "YES",
        "GDAL_HTTP_MULTIPLEX": "YES",
        "GDAL_HTTP_VERSION": "2",
        "GDAL_HTTP_MAX_RETRY": "4",
        "GDAL_HTTP_RETRY_DELAY": "2",
        "GDAL_HTTP_TIMEOUT": "60",
        "VSI_CACHE": "TRUE",
        "AWS_NO_SIGN_REQUEST": "YES",
    }
)

import numpy as np  # noqa: E402
import rasterio  # noqa: E402
import rasterio.errors  # noqa: E402
from PIL import Image  # noqa: E402
from rasterio.warp import transform as warp_transform  # noqa: E402
from rasterio.windows import Window  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
STAC = "https://earth-search.aws.element84.com/v1"
COLLECTION = "sentinel-2-l2a"
COG_BASE = "https://sentinel-cogs.s3.us-west-2.amazonaws.com/"

MANIFEST = ROOT / "data/sentinel.json"
CACHE = ROOT / "data/sentinel/scl-cache.json"
MASKS = ROOT / "data/sentinel/masks"
IMG = ROOT / "public/img/sentinel"
REPORT = ROOT / "docs/watch/sentinel-changes.md"

MONTHS = 24
# A month is shown only if its best chip has at most this much cloud + cloud shadow inside the chip (percent).
MAX_MONTH_CLOUD = 5.0
# The "latest" image must be at least this clear.
MAX_LATEST_CLOUD = 2.0
# Chips with more no-data than this (swath edge) are skipped.
MAX_NODATA = 0.5
# Scenes cloudier than this tile-wide are never worth reading.
MAX_TILE_CLOUD = 70.0
# Read at most this many uncached scenes per month and for the latest search (bounds runtime on cloudy months).
MAX_READS_PER_MONTH = 6
MAX_READS_LATEST = 12
JPEG_QUALITY = 70
# One fixed tone curve for every image (no per-image stretch, so months stay comparable). Sentinel-2 TCI is dark over
# forest; a gamma of 0.85 lifts shadows a little without clipping highlights.
GAMMA = 0.85
TONE = np.array([round(255 * (i / 255) ** GAMMA) for i in range(256)], dtype=np.uint8)
WORKERS = 6

# SCL classes (Sen2Cor): 0 no data, 1 saturated/defective, 2 dark/topographic shadow, 3 cloud shadow, 4 vegetation,
# 5 bare soil, 6 water, 7 unclassified, 8 cloud medium prob., 9 cloud high prob., 10 thin cirrus, 11 snow/ice.
CLOUD = (3, 8, 9, 10)
NOT_CLEAR = (0, 1, 3, 8, 9, 10, 11)

lock = threading.Lock()


def log(*a):
    with lock:
        print(*a, flush=True)


def http_json(url: str, body: dict | None = None, tries: int = 4) -> dict:
    for i in range(tries):
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(body).encode() if body is not None else None,
                headers={"Content-Type": "application/json", "User-Agent": "free-north-korea camp-watch"},
                method="POST" if body is not None else "GET",
            )
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception:
            if i == tries - 1:
                raise
            time.sleep(2 * (i + 1))
    raise RuntimeError("unreachable")


def load_json(p: Path, default):
    try:
        return json.loads(p.read_text())
    except FileNotFoundError:
        return default


def write_json(p: Path, data) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
    tmp.replace(p)


# ---------------------------------------------------------------- geometry


def utm_epsg(lon: float, lat: float) -> int:
    return (32600 if lat >= 0 else 32700) + int((lon + 180) // 6) + 1


def chip_bounds(t: dict, epsg: int) -> tuple[float, float, float, float]:
    """Chip bounds in the tile's UTM CRS, snapped to the 20 m grid so the 10 m TCI and 20 m SCL windows line up."""
    xs, ys = warp_transform("EPSG:4326", f"EPSG:{epsg}", [t["lon"]], [t["lat"]])
    half = t["sizeM"] / 2
    x0 = round((xs[0] - half) / 20) * 20
    y1 = round((ys[0] + half) / 20) * 20
    return x0, y1 - t["sizeM"], x0 + t["sizeM"], y1


def bbox_lonlat(b, epsg: int) -> list[float]:
    xs, ys = warp_transform(f"EPSG:{epsg}", "EPSG:4326", [b[0], b[2], b[0], b[2]], [b[1], b[1], b[3], b[3]])
    return [round(min(xs), 5), round(min(ys), 5), round(max(xs), 5), round(max(ys), 5)]


# ---------------------------------------------------------------- STAC


def search(body: dict) -> list[dict]:
    """POST search with paging. Returns slim feature dicts."""
    out, url, payload = [], f"{STAC}/search", dict(body)
    while True:
        d = http_json(url, payload)
        out += d.get("features", [])
        nxt = next((l for l in d.get("links", []) if l.get("rel") == "next"), None)
        if not nxt:
            return out
        url = nxt["href"]
        payload = nxt.get("body", payload)


FIELDS = {
    "include": [
        "id",
        "bbox",
        "properties.datetime",
        "properties.eo:cloud_cover",
        "properties.grid:code",
        "properties.proj:epsg",
        "properties.proj:code",
        "properties.earthsearch:s3_path",
        "properties.s2:nodata_pixel_percentage",
    ],
    "exclude": ["assets", "links", "geometry"],
}


def item_epsg(it: dict) -> int:
    p = it["properties"]
    if p.get("proj:epsg"):
        return int(p["proj:epsg"])
    return int(str(p["proj:code"]).split(":")[1])


def tile_origin(it: dict) -> tuple[float, float]:
    """MGRS tiles are 109.8 km squares; the item's s3 path has no origin, so derive it from the TCI header once."""
    with rasterio.open(href(it, "TCI")) as ds:
        return ds.transform.c, ds.transform.f


def href(it: dict, band: str) -> str:
    s3 = it["properties"]["earthsearch:s3_path"]
    return COG_BASE + s3.removeprefix("s3://sentinel-cogs/") + f"/{band}.tif"


def pick_tile(t: dict) -> str:
    """Pick the MGRS tile whose interior holds the chip with the widest margin, preferring the target's own UTM zone."""
    since = (dt.date.today() - dt.timedelta(days=40)).isoformat()
    items = search(
        {
            "collections": [COLLECTION],
            "intersects": {"type": "Point", "coordinates": [t["lon"], t["lat"]]},
            "datetime": f"{since}T00:00:00Z/..",
            "limit": 100,
            "fields": FIELDS,
        }
    )
    by_tile: dict[str, dict] = {}
    for it in items:
        by_tile.setdefault(it["properties"]["grid:code"], it)
    best, best_score = None, -1e18
    for code, it in by_tile.items():
        epsg = item_epsg(it)
        x0, y0 = tile_origin(it)
        b = chip_bounds(t, epsg)
        margin = min(b[0] - x0, (x0 + 109800) - b[2], b[1] - (y0 - 109800), y0 - b[3])
        score = margin + (50000 if epsg == utm_epsg(t["lon"], t["lat"]) else 0)
        if margin > 0 and score > best_score:
            best, best_score = code, score
    if not best:
        raise RuntimeError(f"no tile holds the whole chip for {t['id']}")
    return best


# ---------------------------------------------------------------- reading chips


def retry(fn):
    """COG range reads over the internet sometimes fail; try a few times before giving up on a scene."""

    def wrapped(*a, **kw):
        for i in range(4):
            try:
                return fn(*a, **kw)
            except rasterio.errors.RasterioIOError:
                if i == 3:
                    raise
                time.sleep(3 * (i + 1))

    return wrapped


@retry
def read_scl(it: dict, t: dict) -> dict:
    """Chip-level cloud, snow and no-data percentages from the 20 m SCL band, plus the clear mask."""
    epsg = item_epsg(it)
    b = chip_bounds(t, epsg)
    with rasterio.open(href(it, "SCL")) as ds:
        win = ds.window(*b)
        win = Window(round(win.col_off), round(win.row_off), round(win.width), round(win.height))
        scl = ds.read(1, window=win)
    n = scl.size
    pct = lambda cls: round(float(np.isin(scl, cls).sum()) * 100 / n, 2)  # noqa: E731
    return {
        "cloud": pct(CLOUD),
        "snow": pct((11,)),
        "nodata": pct((0, 1)),
        "mask": ~np.isin(scl, NOT_CLEAR),
    }


@retry
def read_tci(it: dict, t: dict) -> tuple[np.ndarray, float]:
    """True-colour chip as uint8 HxWx3, resampled to the published size. Returns (pixels, metres per pixel)."""
    epsg = item_epsg(it)
    b = chip_bounds(t, epsg)
    native = round(t["sizeM"] / 10)
    out = min(t["outPx"], native)
    with rasterio.open(href(it, "TCI")) as ds:
        win = ds.window(*b)
        win = Window(round(win.col_off), round(win.row_off), native, native)
        arr = ds.read(window=win)
    img = TONE[np.moveaxis(arr, 0, -1)]
    if out != native:
        img = np.asarray(Image.fromarray(img).resize((out, out), Image.Resampling.LANCZOS))
    return img, t["sizeM"] / out


def save_jpeg(img: np.ndarray, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(img).save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True, subsampling="4:2:0")


def save_mask(mask: np.ndarray, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(mask.astype(np.uint8) * 255).convert("1").save(path, optimize=True)


# ---------------------------------------------------------------- change scores


def change_score(site: str, a: str, b: str) -> dict | None:
    """
    How different two chips are, on pixels that are clear (no cloud, shadow, snow, no-data) in both.
    Each band is normalised to zero mean and unit spread within the shared clear pixels first, so overall brightness
    and haze shifts mostly cancel; what remains is a change in the pattern (new clearing, buildings, water, crops,
    seasonal vegetation). `score` is the mean absolute normalised difference, `changed` the share of clear pixels
    whose summed difference exceeds 3 (a large local change).
    """
    try:
        ma = np.asarray(Image.open(MASKS / site / f"{a}.png").convert("L")) > 0
        mb = np.asarray(Image.open(MASKS / site / f"{b}.png").convert("L")) > 0
        ia = Image.open(IMG / site / f"{a}.jpg").convert("RGB")
        ib = Image.open(IMG / site / f"{b}.jpg").convert("RGB")
    except FileNotFoundError:
        return None
    size = ma.shape[::-1]
    pa = np.asarray(ia.resize(size, Image.Resampling.BOX), dtype=np.float32)
    pb = np.asarray(ib.resize(size, Image.Resampling.BOX), dtype=np.float32)
    clear = ma & mb
    if clear.mean() < 0.3:
        return {"from": a, "to": b, "clear": round(float(clear.mean()) * 100, 1), "score": None, "changed": None}
    da, db = pa[clear], pb[clear]
    za = (da - da.mean(0)) / (da.std(0) + 1e-6)
    zb = (db - db.mean(0)) / (db.std(0) + 1e-6)
    diff = np.abs(za - zb)
    return {
        "from": a,
        "to": b,
        "clear": round(float(clear.mean()) * 100, 1),
        "score": round(float(diff.mean()), 3),
        "changed": round(float((diff.sum(1) > 3).mean()) * 100, 2),
    }


# ---------------------------------------------------------------- per target


def month_key(date: str) -> str:
    return date[:7]


def build_target(t: dict, prev: dict | None, cache: dict) -> dict:
    today = dt.date.today()
    # The current month and the 23 before it.
    mi = today.year * 12 + today.month - 1 - (MONTHS - 1)
    first_month = dt.date(mi // 12, mi % 12 + 1, 1)
    tile = (prev or {}).get("tile") or pick_tile(t)

    items = search(
        {
            "collections": [COLLECTION],
            "intersects": {"type": "Point", "coordinates": [t["lon"], t["lat"]]},
            "datetime": f"{first_month.isoformat()}T00:00:00Z/..",
            "query": {"grid:code": {"eq": tile}, "eo:cloud_cover": {"lt": MAX_TILE_CLOUD}},
            "limit": 200,
            "fields": FIELDS,
        }
    )
    # Same tile and date can appear twice (reprocessed: _0_ and _1_ ids). Keep the newest processing.
    by_key: dict[str, dict] = {}
    for it in items:
        k = it["id"].rsplit("_", 2)[0]  # S2B_52SCJ_20261001
        if k not in by_key or it["id"] > by_key[k]["id"]:
            by_key[k] = it
    items = sorted(by_key.values(), key=lambda it: it["properties"]["datetime"])
    item_by_id = {it["id"]: it for it in items}
    log(f"{t['id']}: tile {tile}, {len(items)} scenes under {MAX_TILE_CLOUD:.0f}% tile cloud since {first_month}")
    if not items:
        raise RuntimeError("no scenes found")

    site_cache: dict = cache.setdefault(t["id"], {})
    masks: dict[str, np.ndarray] = {}
    reads = 0

    def judge(it: dict) -> dict:
        nonlocal reads
        if it["id"] in site_cache:
            r = site_cache[it["id"]]
            # A scene whose true-colour file is broken on the server can never be shown.
            return {**r, "cloud": 100.0} if r.get("bad") else r
        try:
            r = read_scl(it, t)
        except rasterio.errors.RasterioIOError as e:
            # A scene whose file will not read is treated as unusable (not cached, so a later run tries again).
            log(f"{t['id']}: {it['id']} SCL unreadable ({e}), skipped")
            return {"cloud": 100.0, "snow": 0.0, "nodata": 100.0, "date": it["properties"]["datetime"][:10]}
        reads += 1
        masks[it["id"]] = r.pop("mask")
        r["date"] = it["properties"]["datetime"][:10]
        r["tileCloud"] = round(float(it["properties"]["eo:cloud_cover"]), 2)
        site_cache[it["id"]] = r
        return r

    def rank(r: dict) -> tuple:
        # Lower is better: cloud and shadow first (snow counts a little, it hides the ground), then the newer date.
        return (r["cloud"] + 3 * r["nodata"] + 0.05 * r["snow"], -int(r["date"].replace("-", "")))

    def usable(r: dict, max_cloud: float) -> bool:
        return r["cloud"] <= max_cloud and r["nodata"] <= MAX_NODATA

    # ---- monthly picks
    prev_months = {im["month"]: im for im in (prev or {}).get("images", []) if im.get("month")}
    picks: dict[str, tuple[dict, dict]] = {}
    months = sorted({month_key(it["properties"]["datetime"]) for it in items})
    for m in months:
        cands = sorted(
            (it for it in items if month_key(it["properties"]["datetime"]) == m),
            key=lambda it: it["properties"]["eo:cloud_cover"],
        )
        old = prev_months.get(m)
        best: tuple[dict, dict] | None = None
        if old and old["scene"] in item_by_id:
            best = (item_by_id[old["scene"]], {k: old[k] for k in ("cloud", "snow", "nodata", "date")})
        if best and best[1]["cloud"] == 0 and best[1]["nodata"] == 0:
            picks[m] = best
            continue
        fresh = 0
        for it in cands:
            if best and best[1]["cloud"] == 0 and best[1]["nodata"] == 0 and best[1]["snow"] == 0:
                break
            cached = it["id"] in site_cache
            if not cached and fresh >= MAX_READS_PER_MONTH:
                continue
            r = judge(it)
            fresh += 0 if cached else 1
            if r["nodata"] <= MAX_NODATA and (best is None or rank(r) < rank(best[1])):
                best = (it, r)
        if best and usable(best[1], MAX_MONTH_CLOUD):
            picks[m] = best

    # ---- latest clear image (newest first)
    latest: tuple[dict, dict] | None = None
    fresh = 0
    for it in reversed(items):
        cached = it["id"] in site_cache
        if not cached and fresh >= MAX_READS_LATEST:
            continue
        r = judge(it)
        fresh += 0 if cached else 1
        if usable(r, MAX_LATEST_CLOUD):
            latest = (it, r)
            break
    if latest is None and (prev or {}).get("latest"):
        old = next((im for im in prev["images"] if im["date"] == prev["latest"]), None)
        if old and old["scene"] in item_by_id:
            latest = (item_by_id[old["scene"]], old)

    # The latest image stands in for its month when it is at least as clear, so a month never needs two files.
    if latest:
        m = latest[1]["date"][:7]
        if m not in picks or rank(latest[1]) <= rank(picks[m][1]):
            picks[m] = latest

    # ---- write images
    wanted: dict[str, tuple[dict, dict, str | None]] = {}
    for m, (it, r) in picks.items():
        wanted[r["date"]] = (it, r, m)
    if latest and latest[1]["date"] not in wanted:
        wanted[latest[1]["date"]] = (latest[0], latest[1], None)

    prev_by_date = {im["date"]: im for im in (prev or {}).get("images", [])}
    images = []
    fetched = 0
    for date in sorted(wanted):
        it, r, m = wanted[date]
        jpg = IMG / t["id"] / f"{date}.jpg"
        old = prev_by_date.get(date)
        if old and old["scene"] == it["id"] and jpg.exists():
            entry = dict(old)
        else:
            try:
                img, px = read_tci(it, t)
            except rasterio.errors.RasterioIOError as e:
                log(f"{t['id']}: {it['id']} TCI unreadable ({e}), skipped")
                if it["id"] in site_cache:
                    site_cache[it["id"]]["bad"] = True  # the next run picks another scene for this month
                continue
            if (img.max(axis=2) == 0).mean() * 100 > MAX_NODATA:
                log(f"{t['id']}: {date} TCI has no-data, skipped")
                continue
            save_jpeg(img, jpg)
            mask = masks.get(it["id"])
            if mask is None:
                try:
                    mask = read_scl(it, t)["mask"]
                except rasterio.errors.RasterioIOError:
                    mask = None  # no change score for this image, the picture itself is fine
            if mask is not None:
                save_mask(mask, MASKS / t["id"] / f"{date}.png")
            fetched += 1
            epsg = item_epsg(it)
            entry = {
                "date": date,
                "datetime": it["properties"]["datetime"],
                "scene": it["id"],
                "cloud": r["cloud"],
                "snow": r["snow"],
                "nodata": r["nodata"],
                "pixelM": px,
                "sizePx": img.shape[1],
                "epsg": epsg,
                "bbox": bbox_lonlat(chip_bounds(t, epsg), epsg),
                "src": f"{STAC}/collections/{COLLECTION}/items/{it['id']}",
            }
        entry["month"] = m
        entry.pop("latest", None)
        images.append(entry)

    # Remove files that are no longer referenced (older than the window or replaced by a clearer chip).
    keep = {im["date"] for im in images}
    for d in (IMG / t["id"], MASKS / t["id"]):
        if d.exists():
            for f in d.iterdir():
                if f.stem not in keep:
                    f.unlink()

    monthly = [im for im in images if im.get("month")]
    changes = []
    for a, b in zip(monthly, monthly[1:]):
        c = change_score(t["id"], a["date"], b["date"])
        if c:
            changes.append({**c, "kind": "month"})
    by_month = {im["month"]: im for im in monthly}
    for im in monthly:
        y, mo = im["month"].split("-")
        ago = by_month.get(f"{int(y) - 1}-{mo}")
        if ago:
            c = change_score(t["id"], ago["date"], im["date"])
            if c:
                changes.append({**c, "kind": "year"})

    log(f"{t['id']}: {len(monthly)} months, latest {latest[1]['date'] if latest else 'none'}, {reads} SCL reads, {fetched} new images")
    return {
        "id": t["id"],
        "name": t["name"],
        "category": t["category"],
        "lat": t["lat"],
        "lon": t["lon"],
        "sizeM": t["sizeM"],
        "tile": tile,
        "latest": latest[1]["date"] if latest else None,
        "checked": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%MZ"),
        "images": images,
        "changes": changes,
        **({"atlas": t["atlas"]} if t.get("atlas") else {}),
    }


# ---------------------------------------------------------------- report


def km_between(a: dict, b: dict) -> float:
    r = math.pi / 180
    x = (b["lon"] - a["lon"]) * r * math.cos((a["lat"] + b["lat"]) / 2 * r)
    y = (b["lat"] - a["lat"]) * r
    return math.hypot(x, y) * 6371


def write_report(manifest: dict) -> None:
    lines = [
        "# Sentinel-2 change scores (for human review)",
        "",
        f"Built {manifest['built']} by `scripts/sentinel/build.py`. Nothing on this page is shown on the site.",
        "",
        "How to read it: each row compares two cloud-free chips of the same place on the same pixel grid, using only",
        "pixels that are clear in both. Bands are normalised first, so haze and overall brightness mostly cancel.",
        "`score` is the mean absolute normalised difference (0 means identical; around 0.3 to 0.6 is normal between",
        "seasons), `changed` is the share of clear pixels with a large local difference.",
        "",
        "Seasons dominate month-to-month scores: leaf-out in April and May, rice paddies flooding in May and June,",
        "harvest in September and October, and snow from December to March (snow pixels are masked, but the light",
        "and shadows are very different). Year-over-year rows compare the same month a year apart, which cancels most",
        "of that, so they are the better place to look for building, clearing or digging. A high score is a reason to",
        "open the two images side by side, never a finding on its own.",
        "",
    ]
    for s in manifest["sites"]:
        lines += [f"## {s['name']} (`{s['id']}`)", ""]
        if s.get("atlas"):
            lines.append(f"Atlas point `{s['atlas']['id']}` in places.ts is {km_between(s, s['atlas']):.1f} km from the dossier point used here.")
            lines.append("")
        rows = [c for c in s.get("changes", []) if c.get("score") is not None]
        if not rows:
            lines += ["No comparable pairs yet.", ""]
            continue
        top = sorted((c for c in rows if c["kind"] == "year"), key=lambda c: -c["score"])[:3]
        if top:
            lines.append("Highest year-over-year: " + ", ".join(f"{c['from']} → {c['to']} ({c['score']})" for c in top))
            lines.append("")
        lines += ["| kind | from | to | clear % | score | changed % |", "| --- | --- | --- | --- | --- | --- |"]
        for c in sorted(rows, key=lambda c: (c["kind"], c["to"])):
            lines.append(f"| {c['kind']} | {c['from']} | {c['to']} | {c['clear']} | {c['score']} | {c['changed']} |")
        lines.append("")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines))


# ---------------------------------------------------------------- main


def main() -> int:
    started = time.time()
    all_targets = json.loads(subprocess.check_output(["node", "scripts/sentinel/targets.ts"], cwd=ROOT))
    ids = [t["id"] for t in all_targets]
    only = set(sys.argv[1:])
    targets = [t for t in all_targets if not only or t["id"] in only]
    old = load_json(MANIFEST, {"sites": []})
    prev = {s["id"]: s for s in old.get("sites", [])}
    cache = load_json(CACHE, {})
    results: dict[str, dict] = {}
    failed: list[str] = []

    def flush(final: bool = False) -> dict:
        """Write the manifest and cache. Called after every site, so an interrupted run loses at most one site."""
        sites = [results.get(i) or prev[i] for i in ids if i in results or i in prev]
        manifest = {
            "built": dt.date.today().isoformat() if final or not old.get("built") else old["built"],
            "source": "Copernicus Sentinel-2 L2A via Element84 Earth Search (https://earth-search.aws.element84.com/v1)",
            "credit": "Contains modified Copernicus Sentinel data",
            "rules": {
                "months": MONTHS,
                "maxMonthCloud": MAX_MONTH_CLOUD,
                "maxLatestCloud": MAX_LATEST_CLOUD,
                "cloudClasses": "SCL 3, 8, 9, 10 inside the chip",
            },
            "sites": sites,
        }
        # Drop cache entries older than the window so the file does not grow forever.
        cutoff = (dt.date.today() - dt.timedelta(days=31 * (MONTHS + 1))).isoformat()
        slim = {k: {sid: r for sid, r in dict(v).items() if r.get("date", "9") >= cutoff} for k, v in list(cache.items()) if k in ids}
        write_json(MANIFEST, manifest)
        write_json(CACHE, slim)
        return manifest

    def run(t: dict):
        try:
            r = build_target(t, prev.get(t["id"]), cache)
            with lock:
                results[t["id"]] = r
                flush()
        except Exception as e:  # keep the previous entry
            log(f"{t['id']}: FAILED {type(e).__name__}: {e}")
            failed.append(t["id"])

    with ThreadPoolExecutor(WORKERS) as pool:
        list(pool.map(run, targets))

    manifest = flush(final=True)
    write_report(manifest)
    n = sum(len(s["images"]) for s in manifest["sites"])
    mb = sum(f.stat().st_size for f in IMG.rglob("*.jpg")) / 1e6 if IMG.exists() else 0
    log(f"done in {time.time() - started:.0f}s: {len(manifest['sites'])} sites, {n} images, {mb:.1f} MB, failed: {failed or 'none'}")
    return 1 if failed and not results else 0


if __name__ == "__main__":
    sys.exit(main())
