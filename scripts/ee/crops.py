# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "earthengine-api>=1.4",
# ]
# ///
"""
Crop greenness per province, every 16 days since 2001: MODIS NDVI over cropland, from Google Earth Engine.

    uv run scripts/ee/crops.py              refresh the current and previous year
    uv run scripts/ee/crops.py --backfill   every year from 2001

Writes
  data/archive/ee/crops/<year>.jsonl   one line per province (or "KP", the whole country) and 16-day composite
  public/layers/crops.json             what the site reads: this season against the 10 years before it, and the
                                       growing-season mean of every year

How
  NDVI     MOD13Q1 v6.1 (Terra, 250 m, 16-day composites), band NDVI scaled by 1/10000. Pixels flagged snow or cloud
           in SummaryQA (2, 3) are dropped.
  Cropland MCD12Q1 v6.1 land cover of 2020, IGBP classes 12 (croplands) and 14 (cropland/natural mosaic). One fixed
           mask for every year, so a change in the number is a change in the fields, not in the mask.
  Per province, the mean NDVI of its cropland pixels, and how many km² of cropland had a clear view (`clearKm2`).

Checked against known bad seasons (May-June mean, national): 2001 -9%, 2012 -4.5%, 2014 -5.6%, 2015 -8.1% against
the 2001-2025 average, the spring droughts reported in those years; and July-August 2007 -4.2% and 2020 -3.9%, the
flood years. Springs since 2021 are greener than any before (+6% to +14%), so the site compares a season with the 10
years before it, not with the whole record.

Greenness is not harvest: it says how green the fields look from space, not how much grain they give.

Auth and project: as scripts/ee/night_lights.py (EE_PROJECT, default for-cli21221).
"""

import json
import os
import subprocess
import sys
from datetime import date
from pathlib import Path

import ee

ROOT = Path(__file__).resolve().parents[2]
PROVINCES = ROOT / "public/layers/provinces.geojson"
OUT = ROOT / "public/layers/crops.json"
ARCHIVE = ROOT / "data/archive/ee/crops"
PROJECT = os.environ.get("EE_PROJECT", "for-cli21221")
FIRST = 2001
BASE_YEARS = 10
# growing season for the yearly mean: May to September composites
SEASON = (5, 9)


def init():
    key = os.environ.get("EE_SERVICE_ACCOUNT_KEY")
    if key:
        info = json.loads(key)
        ee.Initialize(ee.ServiceAccountCredentials(info["client_email"], key_data=key), project=PROJECT)
        return
    from google.oauth2.credentials import Credentials

    account = os.environ.get("EE_ACCOUNT", "ahmetdedelerr@gmail.com")
    token = subprocess.check_output(["gcloud", "auth", "print-access-token", f"--account={account}"]).decode().strip()
    ee.Initialize(Credentials(token), project=PROJECT)


def read_archive():
    rows = {}
    if ARCHIVE.exists():
        for f in sorted(ARCHIVE.glob("*.jsonl")):
            for line in f.read_text().splitlines():
                r = json.loads(line)
                rows[(r["pcode"], r["date"])] = r
    return rows


def fetch_year(year, fc, crop):
    col = (
        ee.ImageCollection("MODIS/061/MOD13Q1")
        .filterDate(f"{year}-01-01", f"{year + 1}-01-01")
        .filter(ee.Filter.calendarRange(4, 10, "month"))
    )

    def per_image(img):
        qa = img.select("SummaryQA")
        ok = crop.And(qa.lt(2))
        ndvi = img.select("NDVI").divide(10000).updateMask(ok).rename("ndvi")
        clear = ok.multiply(ee.Image.pixelArea()).divide(1e6).rename("clear")
        stats = ndvi.addBands(clear).reduceRegions(
            collection=fc,
            reducer=ee.Reducer.mean().combine(ee.Reducer.sum(), sharedInputs=True),
            scale=250,
        )
        d = img.date().format("YYYY-MM-dd")
        return stats.map(lambda f: f.set("date", d))

    feats = col.map(per_image).flatten().getInfo()["features"]
    out = []
    for f in feats:
        p = f["properties"]
        v = p.get("ndvi_mean")
        out.append(
            {
                "pcode": p["pcode"],
                "date": p["date"],
                "ndvi": round(v, 4) if v is not None else None,
                "clearKm2": round(p.get("clear_sum") or 0, 1),
            }
        )
    return out


def main():
    init()
    geo = json.loads(PROVINCES.read_text())
    lc = ee.ImageCollection("MODIS/061/MCD12Q1").filterDate("2020-01-01", "2021-01-01").first().select("LC_Type1")
    crop = lc.eq(12).Or(lc.eq(14))
    feats = [ee.Feature(f["geometry"], {"pcode": f["properties"]["pcode"]}) for f in geo["features"]]
    fc = ee.FeatureCollection(feats + [ee.Feature(ee.FeatureCollection(feats).geometry().dissolve(maxError=250), {"pcode": "KP"})])
    crop_km2 = {
        f["properties"]["pcode"]: round(f["properties"]["sum"] / 1e6)
        for f in crop.multiply(ee.Image.pixelArea()).rename("c").reduceRegions(collection=fc, reducer=ee.Reducer.sum(), scale=250).getInfo()["features"]
    }

    this_year = date.today().year
    rows = read_archive()
    years = range(FIRST, this_year + 1) if "--backfill" in sys.argv or not rows else range(this_year - 1, this_year + 1)
    today = date.today().isoformat()
    for year in years:
        got = fetch_year(year, fc, crop)
        for r in got:
            old = rows.get((r["pcode"], r["date"]))
            same = old and all(old.get(k) == r[k] for k in r)
            rows[(r["pcode"], r["date"])] = {**r, "firstFetched": old["firstFetched"] if old else today, "updated": old["updated"] if same else today}
        print(f"{year}: {len(got)} province-composites", file=sys.stderr)

    if len({k[1][:4] for k in rows}) < 20:
        raise SystemExit("too few years in the archive; run with --backfill")
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    by_year = {}
    for (p, d), r in rows.items():
        by_year.setdefault(d[:4], []).append(r)
    for y, rs in by_year.items():
        (ARCHIVE / f"{y}.jsonl").write_text("\n".join(json.dumps(r) for r in sorted(rs, key=lambda r: (r["date"], r["pcode"]))) + "\n")

    # ----- what the site reads -----
    names = {f["properties"]["pcode"]: f["properties"]["name"] for f in geo["features"]} | {"KP": "North Korea"}
    latest_year = max(int(d[:4]) for _, d in rows)
    base = range(latest_year - BASE_YEARS, latest_year)
    doy = lambda d: d[5:]  # MOD13Q1 composites start on the same day of the year every year (Jan 1 + 16n)

    def series(pcode):
        return {d: r["ndvi"] for (p, d), r in rows.items() if p == pcode and r["ndvi"] is not None}

    provinces = {}
    for pcode in names:
        s = series(pcode)
        current = sorted(d for d in s if d.startswith(str(latest_year)))
        season = []
        for d in current:
            past = [s[f"{y}-{doy(d)}"] for y in base if f"{y}-{doy(d)}" in s]
            avg = sum(past) / len(past) if past else None
            season.append(
                {
                    "date": d,
                    "ndvi": s[d],
                    "base": round(avg, 4) if avg else None,
                    "baseMin": round(min(past), 4) if past else None,
                    "baseMax": round(max(past), 4) if past else None,
                    "anomaly": round((s[d] / avg - 1) * 100, 1) if avg else None,
                }
            )
        yearly = []
        for y in range(FIRST, latest_year + 1):
            vals = [v for d, v in s.items() if d.startswith(str(y)) and SEASON[0] <= int(d[5:7]) <= SEASON[1]]
            yearly.append(round(sum(vals) / len(vals), 4) if vals else None)
        provinces[pcode] = {"name": names[pcode], "cropKm2": crop_km2.get(pcode), "season": season, "yearly": yearly}

    last = provinces["KP"]["season"][-1] if provinces["KP"]["season"] else None
    out = {
        "_doc": "Built by scripts/ee/crops.py from MODIS NDVI over MODIS cropland in Google Earth Engine. Do not edit by hand.",
        "built": today,
        "source": {
            "ndvi": {"name": "MODIS/Terra Vegetation Indices 16-Day L3 Global 250m (MOD13Q1 v6.1), NASA LP DAAC", "url": "https://lpdaac.usgs.gov/products/mod13q1v061/"},
            "cropland": {"name": "MODIS Land Cover Type (MCD12Q1 v6.1), 2020, IGBP classes 12 and 14", "url": "https://lpdaac.usgs.gov/products/mcd12q1v061/"},
            "license": "NASA open data (no restrictions; cite the product)",
        },
        "year": latest_year,
        "baseYears": [base.start, base.stop - 1],
        "seasonMonths": list(SEASON),
        "years": list(range(FIRST, latest_year + 1)),
        "latest": last["date"] if last else None,
        "provinces": provinces,
    }
    OUT.write_text(json.dumps(out, separators=(",", ":")) + "\n")
    print(f"crops: {len(rows)} rows in the archive; {latest_year} through {out['latest']}; national latest anomaly {last['anomaly'] if last else None}%")


if __name__ == "__main__":
    main()
