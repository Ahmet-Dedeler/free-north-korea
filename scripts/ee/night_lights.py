# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "earthengine-api>=1.4",
# ]
# ///
"""
Night lights per county and year, from the annual VIIRS night-time lights composites (Earth Observation Group,
Colorado School of Mines; in Google Earth Engine as NOAA/VIIRS/DNB/ANNUAL_V21 for 2013-2021 and ANNUAL_V22 for
2022 onwards).

    uv run scripts/ee/night_lights.py

Writes
  public/layers/lights-years.json             what the map reads (the "Night lights" overlay and the county panel)
  data/archive/ee/night-lights/annual.jsonl   one line per county and year, our permanent record

Per county and year:
  sum       sum of radiance (nW/cm²/sr) over the county's pixels, band `average_masked`: EOG's annual average with
            background noise, fires and other short-lived light removed. The usual "sum of lights" measure.
  litKm2    area of pixels with any light left after that masking, km²
  litShare  litKm2 / county area (from the OCHA boundaries in public/layers/counties.geojson). The map shades by
            this: on the sum alone, big rural counties would outrank small towns.
A year is null for a county when no cloud-free observation covered it (cf_cvg = 0), never 0.

The national row "KP" has the total sum and Pyongyang's share of it.

V2.1 and V2.2 are the same method, but EOG changed the processing between them, so 2021 → 2022 is a seam and the
page says so. Most of North Korea outside its cities is near the sensor's noise floor; that's why we publish
yearly values per county and not monthly ones (docs/research/peer-data-plan.md).

Auth: a service-account key in EE_SERVICE_ACCOUNT_KEY (JSON, for GitHub Actions) or, locally, the gcloud login of
the account in EE_ACCOUNT (default ahmetdedelerr@gmail.com). Project: EE_PROJECT (default earth-thing-free). Annual
composites come out once a year, so this runs by hand when EOG publishes a new year, not weekly.
"""

import json
import os
import subprocess
import sys
from datetime import date
from pathlib import Path

import ee

ROOT = Path(__file__).resolve().parents[2]
COUNTIES = ROOT / "public/layers/counties.geojson"
OUT = ROOT / "public/layers/lights-years.json"
ARCHIVE = ROOT / "data/archive/ee/night-lights/annual.jsonl"
PROJECT = os.environ.get("EE_PROJECT", "earth-thing-free")
# VIIRS day/night band pixels are 15 arc-seconds, about 463 m at the equator.
SCALE = 463.83
SOURCES = [("NOAA/VIIRS/DNB/ANNUAL_V21", range(2013, 2022)), ("NOAA/VIIRS/DNB/ANNUAL_V22", range(2022, 2100))]


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


def main():
    init()
    geo = json.loads(COUNTIES.read_text())
    area = {f["properties"]["pcode"]: f["properties"]["area"] for f in geo["features"]}
    province = {f["properties"]["pcode"]: f["properties"]["province"] for f in geo["features"]}
    fc = ee.FeatureCollection([ee.Feature(f["geometry"], {"pcode": f["properties"]["pcode"]}) for f in geo["features"]])

    rows = []
    for cid, years in SOURCES:
        col = ee.ImageCollection(cid)
        have = col.aggregate_array("system:time_start").map(lambda t: ee.Date(t).get("year")).getInfo()
        for year in [y for y in years if y in have]:
            img = col.filter(ee.Filter.calendarRange(year, year, "year")).first()
            rad = img.select("average_masked").unmask(0)
            lit = rad.gt(0).multiply(ee.Image.pixelArea()).divide(1e6).rename("lit")
            cvg = img.select("cf_cvg").rename("cvg")
            stats = (
                rad.rename("sum")
                .addBands(lit)
                .reduceRegions(collection=fc, reducer=ee.Reducer.sum(), scale=SCALE)
            )
            cov = cvg.reduceRegions(collection=fc, reducer=ee.Reducer.mean(), scale=SCALE)
            got = {f["properties"]["pcode"]: f["properties"] for f in stats.getInfo()["features"]}
            cv = {f["properties"]["pcode"]: f["properties"].get("mean") for f in cov.getInfo()["features"]}
            for pcode, p in sorted(got.items()):
                clean = (cv.get(pcode) or 0) > 0
                lit_km2 = round(p["lit"], 2) if clean else None
                rows.append(
                    {
                        "pcode": pcode,
                        "year": year,
                        "sum": round(p["sum"], 1) if clean else None,
                        "litKm2": lit_km2,
                        "litShare": round(lit_km2 / area[pcode], 5) if clean and area.get(pcode) else None,
                        "dataset": cid,
                    }
                )
            print(f"{year}: {len(got)} counties", file=sys.stderr)

    if len({r["pcode"] for r in rows}) < 150:
        raise SystemExit("too few counties came back; refusing to write")
    years = sorted({r["year"] for r in rows})
    by = {(r["pcode"], r["year"]): r for r in rows}
    counties = {
        pcode: {k: [by.get((pcode, y), {}).get(k) for y in years] for k in ("sum", "litKm2", "litShare")} for pcode in sorted(area)
    }
    total = [round(sum(by[(p, y)]["sum"] or 0 for p in area if (p, y) in by), 1) for y in years]
    pyong = [round(sum(by[(p, y)]["sum"] or 0 for p in area if (p, y) in by and province[p] == "Pyongyang"), 1) for y in years]
    out = {
        "_doc": "Built by scripts/ee/night_lights.py from the annual VIIRS night-time lights (EOG) in Google Earth Engine. Do not edit by hand.",
        "built": date.today().isoformat(),
        "source": {
            "name": "Annual VIIRS Night-time Lights (VNL V2.1 2013-2021, V2.2 from 2022), Earth Observation Group, Payne Institute, Colorado School of Mines",
            "url": "https://eogdata.mines.edu/products/vnl/",
            "license": "CC BY 4.0",
            "seam": 2022,
        },
        "years": years,
        "counties": counties,
        "KP": {"sum": total, "pyongyangShare": [round(p / t, 4) if t else None for p, t in zip(pyong, total)]},
    }
    OUT.write_text(json.dumps(out, separators=(",", ":")) + "\n")
    ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    old = {}
    if ARCHIVE.exists():
        for line in ARCHIVE.read_text().splitlines():
            r = json.loads(line)
            old[(r["pcode"], r["year"])] = r
    lines = []
    for r in sorted(rows, key=lambda r: (r["year"], r["pcode"])):
        prev = old.get((r["pcode"], r["year"]))
        same = prev and all(prev.get(k) == r[k] for k in r)
        lines.append(json.dumps({**r, "firstFetched": prev["firstFetched"] if prev else today, "updated": prev["updated"] if same else today}))
    ARCHIVE.write_text("\n".join(lines) + "\n")
    print(f"night lights: {len(area)} counties × {len(years)} years ({years[0]}-{years[-1]}); national sum {total[0]} → {total[-1]}; Pyongyang share {out['KP']['pyongyangShare'][-1]}")


if __name__ == "__main__":
    main()
