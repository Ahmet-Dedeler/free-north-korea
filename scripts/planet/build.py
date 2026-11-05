# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "numpy>=2.0",
#   "pillow>=11.0",
# ]
# ///
"""
Camp Watch, sharper layer: PlanetScope images of the sites in data/sentinel.json, from ai.planet.com tiles.

    uv run scripts/planet/build.py --plan                      # what it would fetch and cost, spends nothing
    uv run scripts/planet/build.py --probe-only --max-credits 2000   # pick the dates, cheap previews only
    uv run scripts/planet/build.py --max-credits 25000 [id ...]      # fetch and publish

Planet's searches cost thousands of credits each and once emptied an account in minutes, so this client only knows
three endpoints (tiles, balance, health) and refuses anything else. A tile costs about 1 credit at any zoom.

How dates are chosen without a search:
  1. History: the monthly mosaic of October each year (same season, so leaves and snow cancel out), back to 2016,
     plus recent months: every 2nd of the last 12 at weapons sites, every 3rd at camps. Daily tiles have a 30-day delay
     on these accounts, mosaics do not.
  2. Recent: one daily image per 2 months (weapons sites) or per 3 months (camps), for the last 24 months. Candidates
     are the days our own Sentinel-2 run measured as clear inside this exact square (data/sentinel/scl-cache.json).
     Both satellites pass within about two hours of each other, so a clear Sentinel-2 day is very likely clear here.
  3. Every candidate is checked with a z12 preview (at most 4 credits, against about 40-100 for the full square):
     coverage (a swath edge leaves holes), the share of bright colourless pixels (cloud, snow), and correlation with the
     same square's cloud-free composite and the same day's Sentinel-2 chip (cloud and haze lower both).
     Only then are the z15 tiles fetched. z16 costs 4x and only upsamples (r=0.985 against z15 at Sohae, 2025-07-09).
  4. The full image of a daily frame is tested for straight no-data seams, which z12 previews hide. Then a person looks
     at the contact sheets: anything that got through goes in scripts/planet/rejected.json with the reason, which also
     removes it from the site. A re-run then tries that slot's next candidate. Frames already published cost nothing.

Outputs:
  public/img/planet/<id>/<date>.webp        published square at native z15, 3.5 to 3.7 m per pixel
  public/img/planet/<id>/<date>-768.webp    smaller copy for panels and phones
  data/planet.json                          manifest the site reads
  data/planet/probes.json                   every preview result, so a re-run never pays for the same check
  $PLANET_CACHE (default ~/Code/free-north-korea-ops/planet)
      tiles/<z>/<date>/<x>_<y>.png          lossless originals: what we paid for, never fetched twice
      sheets/<id>.jpg                       preview contact sheets for checking by eye

Accounts: PV_PAT_n / PV_UID_n in .env.local, n = 2, 3, 4 (account 1 is overdrawn). The richest account pays for each
tile. A run stops at --max-credits, when every account is at FLOOR, or if a tile starts costing more than MAX_TILE_COST.
"""

from __future__ import annotations

import argparse
import datetime as dt
import io
import json
import math
import os
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
API = "https://ai.planet.com/api"
ACCOUNTS = ("2", "3", "4")
# Never let an account go below this: keeps some credits for look-ups, and overdrawing is what hurt account 1.
FLOOR = 300.0
# Measured 1.00-1.04 per tile. Anything well above means the pricing changed under us: stop and look.
MAX_TILE_COST = 1.5
WORKERS = 8

SENTINEL = ROOT / "data/sentinel.json"
SCL_CACHE = ROOT / "data/sentinel/scl-cache.json"
MANIFEST = ROOT / "data/planet.json"
PROBES = ROOT / "data/planet/probes.json"
REJECTED = Path(__file__).parent / "rejected.json"
IMG = ROOT / "public/img/planet"
SENTINEL_IMG = ROOT / "public/img/sentinel"
CACHE = Path(os.environ.get("PLANET_CACHE", Path.home() / "Code/free-north-korea-ops/planet"))

ZOOM = 15
PROBE_ZOOM = 12
HISTORY_MONTH = 10
HISTORY_FROM = 2016
RECENT_MONTHS = 24
# Daily tiles from the last 30 days are not served on these accounts.
DAILY_DELAY_DAYS = 31
WEAPONS_STEP = 2
CAMP_STEP = 3
WEAPONS_RECENT_STEP = 2
CAMP_RECENT_STEP = 3
MAX_CANDIDATES = 6
# Candidate days: cloud inside the square, from Sentinel-2's scene classification, percent.
MAX_S2_CLOUD = 5.0
MAX_S2_SNOW = 25.0
# Thresholds for a z12 preview, tuned by eye on the contact sheets of all 17 sites (2026-11-05): these reject the
# cloudy days a clear Sentinel-2 day can still hide on Planet's slightly different pass, and snow-covered ones.
MIN_VALID = 0.995
MAX_WHITE_DAILY = 0.008
MAX_WHITE_MONTHLY = 0.02
MIN_CORR_MOSAIC = 0.6
# A composite this far from the reference is hiding cloud or a smear: every one below it failed by eye, and river ice
# (Kangson 2026-02, 0.57) and flood water (Kangson 2026-08, 0.56) stay above it.
MIN_CORR_MONTHLY = 0.5
# A straight no-data seam in a daily image: near-black pixels on one line, at least this long as a share of the square,
# making up at least this share of all near-black pixels (shadows are near-black too, but are not on one line).
SEAM_BLACK = 8
SEAM_MIN_LENGTH = 0.1
SEAM_MIN_SHARE = 0.085
MIN_CORR_S2 = 0.7
# A daily candidate this close to the reference composite is taken without looking at the others.
GOOD_CORR = 0.85
# Cloud-free composite of each square, the yardstick for the daily previews.
REFERENCE_MOSAIC = "2025-10"
WEBP_QUALITY = 74
THUMB_PX = 768
CREDIT = "Imagery © Planet Labs PBC"


# ---------------------------------------------------------------------------------------------------------------------
# Client: tiles, balance and health only. There is deliberately no way to call /searches or /deep_research_jobs here.
# ---------------------------------------------------------------------------------------------------------------------


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    for line in (ROOT / ".env.local").read_text().splitlines():
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k] = v.strip().strip('"')
    return env


class OutOfBudget(Exception):
    pass


class Pool:
    """The accounts, what they have left, and what this run has spent."""

    def __init__(self, max_credits: float):
        env = load_env()
        self.headers = {
            a: {"Authorization": f"Bearer {env[f'PV_PAT_{a}']}", "X-User-Id": env[f"PV_UID_{a}"], "User-Agent": "free-north-korea-camp-watch/1.0"}
            for a in ACCOUNTS
            if f"PV_PAT_{a}" in env
        }
        self.lock = threading.Lock()
        self.max_credits = max_credits
        self.balance = {a: self._balance(a) for a in self.headers}
        self.start = dict(self.balance)
        self.paid = 0  # tiles charged this run
        self.since_check = 0
        print("balances", {a: round(b, 1) for a, b in self.balance.items()}, flush=True)

    def _request(self, account: str, path: str):
        if not (path.startswith("/tiles/planetscope/") or path in ("/credit_balance", "/health")):
            raise ValueError(f"refusing to call {path}: this client only reads tiles")
        return urllib.request.Request(API + path, headers=self.headers[account])

    def _balance(self, account: str) -> float:
        with urllib.request.urlopen(self._request(account, "/credit_balance"), timeout=30) as r:
            return float(json.load(r)["balance"])

    def spent(self) -> float:
        return sum(self.start[a] - self.balance[a] for a in self.balance)

    def choose(self) -> str:
        with self.lock:
            if self.paid >= self.max_credits or self.spent() >= self.max_credits:
                raise OutOfBudget(f"--max-credits {self.max_credits:.0f} reached")
            a = max(self.balance, key=lambda k: self.balance[k])
            if self.balance[a] <= FLOOR:
                raise OutOfBudget(f"all accounts at or below the floor of {FLOOR:.0f}")
            # Keep a running estimate between real balance checks.
            self.balance[a] -= 1.01
            self.paid += 1
            self.since_check += 1
            check = self.since_check >= 200
            if check:
                self.since_check = 0
        if check:
            self.recheck()
        return a

    def recheck(self):
        """Read the real balances and stop the run if tiles have become more expensive than measured."""
        fresh = {a: self._balance(a) for a in self.headers}
        with self.lock:
            self.balance = fresh
            per_tile = self.spent() / max(self.paid, 1)
            print(f"  [credits] {self.paid} tiles, spent {self.spent():.0f}, {per_tile:.2f} per tile, left {sum(fresh.values()):.0f}", flush=True)
            if self.paid >= 50 and per_tile > MAX_TILE_COST:
                raise OutOfBudget(f"a tile now costs {per_tile:.2f} credits, above {MAX_TILE_COST}: stopping")

    def tile(self, date: str, z: int, x: int, y: int) -> tuple[Path | None, str | None]:
        """A tile from the disk cache, or paid for once. Returns (path, resolved mosaic); path None if no imagery."""
        d = CACHE / f"tiles/{z}/{date}"
        p, none, meta = d / f"{x}_{y}.png", d / f"{x}_{y}.none", d / f"{x}_{y}.mosaic"
        if p.exists():
            return p, meta.read_text() if meta.exists() else None
        if none.exists():
            return None, None
        for attempt in range(6):
            account = self.choose()
            try:
                with urllib.request.urlopen(self._request(account, f"/tiles/planetscope/{date}/{z}/{x}/{y}"), timeout=90) as r:
                    body, mosaic, cadence = r.read(), r.headers.get("X-Pv-Resolved-Mosaic"), r.headers.get("X-Pv-Source-Cadence")
                    status = r.status
                if status == 204 or not body:
                    d.mkdir(parents=True, exist_ok=True)
                    none.write_text("")
                    return None, None
                # A day with no imagery must not silently come back as that month's mosaic.
                if len(date) == 10 and cadence and cadence != "daily":
                    d.mkdir(parents=True, exist_ok=True)
                    none.write_text(cadence)
                    return None, None
                d.mkdir(parents=True, exist_ok=True)
                tmp = p.with_suffix(".tmp")
                tmp.write_bytes(body)
                tmp.rename(p)
                if mosaic:
                    meta.write_text(mosaic)
                return p, mosaic
            except urllib.error.HTTPError as e:
                detail = e.read()[:240].decode(errors="replace")
                if e.code == 404 or (e.code == 400 and "not available" in detail.lower()):
                    d.mkdir(parents=True, exist_ok=True)
                    none.write_text(detail)
                    return None, None
                if e.code == 429:
                    time.sleep(float(e.headers.get("Retry-After") or 5))
                    continue
                if e.code == 403 and "credits" in detail.lower():
                    with self.lock:
                        self.balance[account] = 0
                    continue
                if e.code >= 500:
                    time.sleep(2 * (attempt + 1))
                    continue
                raise RuntimeError(f"tile {date}/{z}/{x}/{y}: HTTP {e.code} {detail}") from e
            except (urllib.error.URLError, TimeoutError):
                time.sleep(2 * (attempt + 1))
        raise RuntimeError(f"tile {date}/{z}/{x}/{y}: gave up after retries")


# ---------------------------------------------------------------------------------------------------------------------
# Geometry: chips are centred on the same point as the Sentinel-2 chip and cover the same ground, on Planet's grid.
# ---------------------------------------------------------------------------------------------------------------------


def pixel_xy(lat: float, lon: float, z: int) -> tuple[float, float]:
    scale = 256 * 2**z
    return (lon + 180) / 360 * scale, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * scale


def metres_per_pixel(lat: float, z: int) -> float:
    return 156543.03392804097 / 2**z * math.cos(math.radians(lat))


def chip_window(site: dict, z: int) -> tuple[int, int, int]:
    """Top-left pixel and side length of the site's square at zoom z."""
    side = int(round(site["sizeM"] / metres_per_pixel(site["lat"], z)))
    cx, cy = pixel_xy(site["lat"], site["lon"], z)
    return int(round(cx - side / 2)), int(round(cy - side / 2)), side


def chip_tiles(site: dict, z: int) -> list[tuple[int, int]]:
    x0, y0, side = chip_window(site, z)
    return [(x, y) for y in range(y0 // 256, (y0 + side - 1) // 256 + 1) for x in range(x0 // 256, (x0 + side - 1) // 256 + 1)]


def bbox(site: dict, z: int) -> list[float]:
    x0, y0, side = chip_window(site, z)
    scale = 256 * 2**z

    def lat_of(py: float) -> float:
        return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * py / scale))))

    return [round(x0 / scale * 360 - 180, 5), round(lat_of(y0 + side), 5), round((x0 + side) / scale * 360 - 180, 5), round(lat_of(y0), 5)]


def stitch(pool: Pool, site: dict, date: str, z: int) -> tuple[Image.Image, str | None]:
    """The site's square for one date as RGBA (alpha 0 where there is no imagery), plus the resolved mosaic name."""
    x0, y0, side = chip_window(site, z)
    tiles = chip_tiles(site, z)
    with ThreadPoolExecutor(WORKERS) as ex:
        got = list(ex.map(lambda t: pool.tile(date, z, t[0], t[1]), tiles))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    mosaic = None
    for (x, y), (path, m) in zip(tiles, got):
        if path is None:
            continue
        mosaic = mosaic or m
        canvas.paste(Image.open(path).convert("RGBA"), (x * 256 - x0, y * 256 - y0))
    return canvas, mosaic


# ---------------------------------------------------------------------------------------------------------------------
# Choosing dates
# ---------------------------------------------------------------------------------------------------------------------


def months_back(last: dt.date, n: int) -> list[str]:
    out = []
    y, m = last.year, last.month
    for _ in range(n):
        out.append(f"{y}-{m:02d}")
        m -= 1
        if m == 0:
            y, m = y - 1, 12
    return out


def plan_site(site: dict, scl: dict, today: dt.date, rejected: dict) -> list[dict]:
    """The frames we want for one site: each one a list of candidate dates, best first. Rejected dates never appear."""
    frames: list[dict] = []
    no = rejected.get(site["id"], {})
    last_full = (today.replace(day=1) - dt.timedelta(days=1)).strftime("%Y-%m")
    for y in range(HISTORY_FROM, today.year + 1):
        d = f"{y}-{HISTORY_MONTH:02d}"
        if d <= last_full:
            # If October is cloudy or snowy, September or November keep the season closest.
            cands = [d, f"{y}-09", f"{y}-11"] if f"{y}-11" <= last_full else [d, f"{y}-09"]
            frames.append({"slot": d, "kind": "monthly", "candidates": [c for c in cands if c not in no]})
    # Recent months as composites too: unlike the daily images their colours match, so the slider shows real change.
    recent = months_back(dt.date.fromisoformat(last_full + "-01"), 12)
    picks = recent[:: WEAPONS_RECENT_STEP] if site["category"] in ("nuclear", "missile") else recent[:: CAMP_RECENT_STEP][:3]
    for d in picks:
        if d not in [f["slot"] for f in frames] and d not in no:
            frames.append({"slot": d, "kind": "monthly", "candidates": [d]})

    cutoff = (today - dt.timedelta(days=DAILY_DELAY_DAYS)).isoformat()
    step = WEAPONS_STEP if site["category"] in ("nuclear", "missile") else CAMP_STEP
    published = {im["date"] for im in site["images"]}
    days: dict[str, dict] = {}
    for scene, s in scl.get(site["id"], {}).items():
        if s.get("cloud") is None or s["date"] > cutoff or s["date"] in no:
            continue
        if s["cloud"] <= MAX_S2_CLOUD and (s.get("snow") or 0) <= MAX_S2_SNOW and (s.get("nodata") or 0) <= 0.5:
            cur = days.get(s["date"])
            if cur is None or s["cloud"] < cur["cloud"]:
                days[s["date"]] = {"date": s["date"], "cloud": s["cloud"], "snow": s.get("snow") or 0, "scene": scene}
    months = months_back(dt.date.fromisoformat(cutoff), RECENT_MONTHS)[::-1]
    for i in range(0, len(months) - step + 1, step):
        window = set(months[i : i + step])
        cands = [d for d in days.values() if d["date"][:7] in window]
        # Days with a published chip first, because only those can be checked against Sentinel-2. Then least cloud/snow.
        cands.sort(key=lambda d: (d["date"] not in published, d["cloud"] + d["snow"] / 5, d["date"]))
        if cands:
            frames.append({"slot": months[i], "kind": "daily", "candidates": [c["date"] for c in cands[: MAX_CANDIDATES]], "s2": {c["date"]: c for c in cands[: MAX_CANDIDATES]}})
    return frames


def correlate(a: Image.Image, b: Image.Image) -> float:
    x = np.asarray(a.convert("RGB").convert("L").resize((64, 64), Image.BOX), float).ravel()
    y = np.asarray(b.convert("RGB").convert("L").resize((64, 64), Image.BOX), float).ravel()
    if x.std() < 1 or y.std() < 1:
        return 0.0
    return round(float(np.corrcoef(x, y)[0, 1]), 3)


def white_share(im: Image.Image) -> float:
    arr = np.asarray(im, float)
    rgb, alpha = arr[..., :3], arr[..., 3] > 0
    lum = rgb.mean(axis=2)
    sat = (rgb.max(axis=2) - rgb.min(axis=2)) / np.maximum(rgb.max(axis=2), 1)
    return round(float(((lum > 150) & (sat < 0.18) & alpha).mean()), 4)


def probe(pool: Pool, site: dict, date: str, probes: dict) -> dict:
    """Quality numbers from a z12 preview. Previews are cached on disk, so recomputing these costs nothing."""
    key = f"{site['id']}|{date}"
    if key in probes and "whiteExtra" in probes[key]:
        return probes[key]
    im, mosaic = stitch(pool, site, date, PROBE_ZOOM)
    alpha = np.asarray(im)[..., 3] > 0
    valid = float(alpha.mean())
    ref_s2 = SENTINEL_IMG / site["id"] / f"{date}.jpg"
    reference, _ = stitch(pool, site, REFERENCE_MOSAIC, PROBE_ZOOM)
    res = {
        "date": date,
        "valid": round(valid, 4),
        # Bright and colourless pixels beyond what the composite has anyway (concrete, shipyards): cloud, or snow.
        "white": white_share(im),
        "whiteExtra": round(white_share(im) - white_share(reference), 4),
        # Same square, cloud-free composite: terrain still lines up across seasons, cloud and haze break it.
        "corrMosaic": correlate(im, reference) if valid > 0.2 else None,
        # Same day's Sentinel-2 chip, where we published one.
        "corr": correlate(im, Image.open(ref_s2)) if valid > 0.2 and ref_s2.exists() else None,
        "mosaic": mosaic,
    }
    probes[key] = res
    return res


def probe_passes(p: dict, kind: str) -> bool:
    if p["valid"] < MIN_VALID:
        return False
    if kind == "monthly":
        return p["whiteExtra"] <= MAX_WHITE_MONTHLY and (p["corrMosaic"] or 0) >= MIN_CORR_MONTHLY
    if p["whiteExtra"] > MAX_WHITE_DAILY or (p["corrMosaic"] or 0) < MIN_CORR_MOSAIC:
        return False
    return p["corr"] is None or p["corr"] >= MIN_CORR_S2


def choose(pool: Pool, site: dict, frame: dict, probes: dict) -> dict | None:
    """Preview the candidates until one is clearly good; otherwise take the best that passes."""
    best = None
    for date in frame["candidates"]:
        p = probe(pool, site, date, probes)
        if not probe_passes(p, frame["kind"]):
            continue
        if frame["kind"] == "monthly" or (p["corrMosaic"] or 0) >= GOOD_CORR:
            return p
        if best is None or (p["corrMosaic"] or 0) > (best["corrMosaic"] or 0):
            best = p
    return best


# ---------------------------------------------------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------------------------------------------------


def contact_sheet(pool: Pool, site: dict, rows: list[dict]):
    """All chosen previews of a site in one image, to check by eye before paying for z15."""
    cell = 220
    cols = 8
    n = len(rows)
    sheet = Image.new("RGB", (cols * cell, (n // cols + 1) * (cell + 18)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, p in enumerate(rows):
        im, _ = stitch(pool, site, p["date"], PROBE_ZOOM)  # all cached by now, spends nothing
        bg = Image.new("RGB", im.size, (255, 0, 255))
        bg.paste(im, mask=im.split()[3])
        x, y = (i % cols) * cell, (i // cols) * (cell + 18)
        sheet.paste(bg.resize((cell - 4, cell - 4)), (x, y + 16))
        draw.text((x + 2, y + 2), f"{p['date']} w{p['whiteExtra']:.3f} m{p['corrMosaic']} s{p['corr'] if p['corr'] is not None else '-'}", fill="black")
    out = CACHE / "sheets"
    out.mkdir(parents=True, exist_ok=True)
    sheet.save(out / f"{site['id']}.jpg", quality=85)


def has_seam(rgb: Image.Image) -> bool:
    """True if near-black pixels line up along one straight line: a seam between Planet's strips in a daily image."""
    arr = np.asarray(rgb)
    black = arr.max(2) < SEAM_BLACK
    total = int(black.sum())
    if total == 0:
        return False
    best = 0.0
    for rows, cols in (np.nonzero(black), np.nonzero(black.T)):
        for slope in np.tan(np.radians(np.arange(-35, 35.1, 1))):
            pos = (cols - slope * rows).astype(int)
            counts = np.bincount(pos - pos.min())
            best = max(best, float(np.convolve(counts, np.ones(3), "same").max()))
    return best / black.shape[0] >= SEAM_MIN_LENGTH and best / total >= SEAM_MIN_SHARE


def publish(pool: Pool, site: dict, frame: dict, chosen: dict) -> dict | None:
    date = chosen["date"]
    im, mosaic = stitch(pool, site, date, ZOOM)
    arr = np.asarray(im)
    valid = float((arr[..., 3] > 0).mean())
    if valid < MIN_VALID:
        print(f"  {site['id']} {date}: only {valid:.1%} of the square has imagery at z15, not published", flush=True)
        return None
    # Fixed output with no stretch: what Planet served. Holes (under half a percent) stay black.
    rgb = Image.new("RGB", im.size, (0, 0, 0))
    rgb.paste(im, mask=im.split()[3])
    if frame["kind"] == "daily" and has_seam(rgb):
        print(f"  {site['id']} {date}: no-data seam at z15, not published", flush=True)
        return None
    out = IMG / site["id"]
    out.mkdir(parents=True, exist_ok=True)
    rgb.save(out / f"{date}.webp", quality=WEBP_QUALITY, method=6)
    rgb.resize((THUMB_PX, THUMB_PX), Image.LANCZOS).save(out / f"{date}-{THUMB_PX}.webp", quality=WEBP_QUALITY, method=6)
    s2 = (frame.get("s2") or {}).get(date)
    return {
        "date": date,
        "kind": frame["kind"],
        "mosaic": mosaic or chosen.get("mosaic"),
        "sizePx": im.size[0],
        "valid": round(valid, 4),
        "corr": chosen.get("corr"),
        "corrMosaic": chosen.get("corrMosaic"),
        "s2Cloud": s2["cloud"] if s2 else None,
        "s2Scene": s2["scene"] if s2 else None,
        "bytes": (out / f"{date}.webp").stat().st_size,
    }


def write_manifest(manifest: dict):
    manifest["built"] = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    MANIFEST.write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--plan", action="store_true", help="print what would be fetched and its cost, spend nothing")
    ap.add_argument("--probe-only", action="store_true", help="choose dates with z12 previews and write contact sheets")
    ap.add_argument("--max-credits", type=float, default=500.0, help="stop after spending this many credits (default 500)")
    args = ap.parse_args()

    today = dt.datetime.now(dt.timezone.utc).date()
    sentinel = json.loads(SENTINEL.read_text())
    scl = json.loads(SCL_CACHE.read_text())
    sites = [s for s in sentinel["sites"] if not args.ids or s["id"] in args.ids]
    missing = set(args.ids) - {s["id"] for s in sites}
    if missing:
        sys.exit(f"unknown site ids: {sorted(missing)}")

    rejected = json.loads(REJECTED.read_text()) if REJECTED.exists() else {}
    plans = {s["id"]: plan_site(s, scl, today, rejected) for s in sites}
    total = 0
    for s in sites:
        fr = plans[s["id"]]
        n = len(chip_tiles(s, ZOOM))
        probes_cost = sum(len(chip_tiles(s, PROBE_ZOOM)) for _ in fr)
        total += n * len(fr) + probes_cost
        print(f"{s['id']:24} {s['sizeM'] / 1000:.2f} km  {chip_window(s, ZOOM)[2]} px  {n:3} tiles x {len(fr):2} frames = {n * len(fr):5}  (+{probes_cost} previews at least)")
    print(f"total about {total} credits if nothing is cached yet")
    if args.plan:
        return

    pool = Pool(args.max_credits)
    probes = json.loads(PROBES.read_text()) if PROBES.exists() else {}
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {"sites": []}
    manifest.update(
        {
            "source": "PlanetScope tiles from ai.planet.com (monthly mosaics and daily images)",
            "credit": CREDIT,
            "zoom": ZOOM,
            "rules": f"Monthly mosaics of each October since {HISTORY_FROM} plus recent months; daily images on days Sentinel-2 measured as clear inside the square, checked with a preview for coverage, cloud and snow, and agreement with a cloud-free composite and the same day's Sentinel-2 chip.",
        }
    )
    by_id = {m["id"]: m for m in manifest["sites"]}

    def save_probes():
        PROBES.parent.mkdir(parents=True, exist_ok=True)
        PROBES.write_text(json.dumps(dict(sorted(probes.items())), indent=0) + "\n")

    try:
        for s in sites:
            frames = plans[s["id"]]
            rows, chosen = [], []
            for fr in frames:
                c = choose(pool, s, fr, probes)
                if c is None:
                    print(f"  {s['id']} {fr['slot']}: no candidate passed ({fr['candidates']})", flush=True)
                    continue
                chosen.append((fr, c))
                rows.append(c)
            save_probes()
            contact_sheet(pool, s, rows)
            print(f"{s['id']}: {len(chosen)}/{len(frames)} frames chosen, spent so far {pool.spent():.0f}", flush=True)
            if args.probe_only:
                continue
            entry = by_id.get(s["id"]) or {"id": s["id"], "images": []}
            entry.update(
                {
                    "id": s["id"],
                    "name": s["name"],
                    "category": s["category"],
                    "lat": s["lat"],
                    "lon": s["lon"],
                    "sizeM": s["sizeM"],
                    "pixelM": round(metres_per_pixel(s["lat"], ZOOM), 2),
                    "bbox": bbox(s, ZOOM),
                }
            )
            have = {im["date"]: im for im in entry["images"]}
            # A frame rejected by eye leaves the site and the disk. Its paid tiles stay in the cache.
            for date in rejected.get(s["id"], {}):
                if have.pop(date, None):
                    for name in (f"{date}.webp", f"{date}-{THUMB_PX}.webp"):
                        (IMG / s["id"] / name).unlink(missing_ok=True)
                    print(f"  {s['id']} {date}: removed, {rejected[s['id']][date]}", flush=True)
            for fr, c in chosen:
                if c["date"] in have and (IMG / s["id"] / f"{c['date']}.webp").exists():
                    continue
                im = publish(pool, s, fr, c)
                if im:
                    have[im["date"]] = im
                    print(f"  {s['id']} {im['date']} {im['kind']} {im['bytes'] // 1024} KB valid {im['valid']} white+ {c['whiteExtra']} r {im['corrMosaic']}", flush=True)
            entry["images"] = sorted(have.values(), key=lambda i: i["date"])
            entry["checked"] = today.isoformat()
            by_id[s["id"]] = entry
            order = [x["id"] for x in sentinel["sites"]]
            manifest["sites"] = sorted(by_id.values(), key=lambda m: order.index(m["id"]))
            write_manifest(manifest)
            pool.recheck()
    except OutOfBudget as e:
        print("STOP:", e, flush=True)
    finally:
        save_probes()
        pool.recheck()
        print(f"done: {pool.paid} tiles this run, about {pool.spent():.0f} credits, balances { {a: round(b) for a, b in pool.balance.items()} }", flush=True)


if __name__ == "__main__":
    main()
