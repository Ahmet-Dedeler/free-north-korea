# Peer review, round 2: combining the data sources, and a permanent archive (2026-10-12)

The test calls behind every number here were made on 2026-10-12. Raw responses stayed in the session scratchpad.

## What the test calls settled

**Earth Engine** (project for-cli21221, user token from gcloud)

- Night lights for one month, averaged over each of the 179 counties in `public/layers/counties.geojson` (`reduceRegions`
  on `NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG`), took 2.4 s. 21 months × 179 counties in one call took 6.9 s. No batch export
  is needed.
- Two hard limits:
  - "Collection query aborted after accumulating over 5000 elements": 32 months × 179 counties failed. Chunk the work
    to 24 months per call or fewer.
  - "Too many concurrent aggregations" (HTTP 429) when two calls overlapped. Run Earth Engine jobs one at a time.
- Newest data in Earth Engine:

  | Dataset | Newest |
  |---|---|
  | VCMSLCFG monthly lights | 2026-08 |
  | VNP46A2 daily Black Marble | 2026-10-08 |
  | MOD13Q1 NDVI | 2026-09-14 |
  | S5P NO2 | 2026-10-02 |
  | CHIRPS rainfall | 2026-08-31 |
  | FIRMS fires | 2026-10-11 |
  | S1_GRD radar | 2026-10-11 |
  | Satellite embeddings | 2025 |

  Yearly night lights: `NOAA/VIIRS/DNB/ANNUAL_V21` covers 2013 to 2021 and `ANNUAL_V22` covers 2022 to 2025.
  `GOOGLE/Research/open-buildings-temporal/v1` has nothing over North Korea.
- **Monthly night lights per county are mostly noise.** 139 of 179 counties average under 0.5 nW/cm²/sr.
  - The national sum of county means swings between 75.7 and 111.2 from month to month (2024-01 to 2026-08), with no
    trend.
  - Cloud-free observations per pixel fall to 2.4 in July 2026.
- A scheduled Action can't use a gcloud user token, which lasts one hour. It needs a service account in for-cli21221
  registered for Earth Engine, with its JSON key stored as a GitHub secret.

**GFW**

- Port-visit history for a listed ship reaches back to 2012:

  | Ship | IMO | Visits since 2012 | Where |
  |---|---|---|---|
  | ANSAN1 | 7303803 | 96 | 41 PRK, 40 RUS, 14 CHN |
  | Hua Fu / PUK DAE BONG | 9020003 | 287 | 99 KOR, 80 CHN, 57 VNM, 5 IRN, … |

  One call per ship (limit 1000) is enough.
- **Port visits at North Korean anchorages, all vessels** (EEZ 8328, 2025-10 to 2026-10; the box also takes in Dandong,
  so filter on anchorage flag = PRK). 735 visits at confidence 3 or higher by 285 vessels; 676 of them PRK-flagged.
  - Russian cargo ships GEFEST (Nampo approaches, 2026-04 and 05) and ORION (2026-04).
  - RICH SUN (Comoros flag) at Nampo, 2026-02.
  - PALLADA (Russia) at Wonsan, 2026-08.
  - Noise: fishing-gear buoys with fake MMSIs ("LIAOYINGYU25899-294%" broadcasting as Norway, "5109-12-99%" as Monaco)
    and placeholder MMSIs (234567899, 213000000). Filter out vessel type `gear` and invalid MMSIs.
- **SAR grid:**
  - `spatial-resolution=LOW` is 0.1° cells: 509 cells for 2026-09 in the EEZ (unmatched detections only). Safe to map.
  - `HIGH` is 0.01° cells: 8,119 cells, 5,399 of them holding a single detection. That is effectively individual
    detections, so never publish it.
- **SAR history:** the dataset starts in 2017 (2016 returns empty). Yearly detections in the EEZ, with Sentinel-1
  scenes over the EEZ box from the Planetary Computer `sentinel-1-grd` collection:

  | Year | Detections | Scenes | Per scene | No AIS |
  |---|---|---|---|---|
  | 2017 | 78,539 | 754 | 104 | 99.5% |
  | 2019 | 97,038 | 874 | 111 | 99.3% |
  | 2021 | 24,010 | 873 | 28 | 97.9% |
  | 2023 | 19,278 | 240 | 80 | 98.5% |
  | 2025 | 28,622 | 806 | 36 | 98.8% |

  2021 had the same number of scenes as 2019 but a quarter of the vessels. It is a real, dated, measured series, but
  scene footprints differ, so label it "per scene" rather than as a vessel count.
- AIS presence by flag inside the EEZ goes back to 2013 (`public-global-presence`, yearly report works).

## Ranked plan (usefulness vs effort)

1. **Archive first** (low effort). Every week we wait, more port visits fall out of the 12-month window. Layout below.
2. **"Ships in North Korean ports"** (low effort; extend build-ships.ts). All port visits at PRK anchorages, foreign
   flags first, with names and flags as broadcast, filtered as above. It goes on /sanctions/ships, and on /map as a
   **Ports** layer: one point per anchorage with visit counts by flag and month. It answers "who still sails to North
   Korea", and journalists can check it.
3. **Radar series for /data plus a map layer** (low effort).
   - Yearly and monthly SAR detections per Sentinel-1 scene in the EEZ, 2017 to now, with the share without AIS.
   - AIS presence hours by flag in the EEZ, 2013 to now (Chinese ships in North Korean waters).
   - On /map: the monthly 0.1° grid of "radar-detected vessels with no AIS", aggregated only.
4. **Crop condition** (medium effort; harvest season now).
   - Data: `MODIS/061/MOD13Q1` NDVI on a cropland mask (ESA WorldCover class 40). The value is the anomaly against
     2001 to 2025 for the same 16-day period, per province, with counties where the signal is clean.
   - Shows up as a /map shade and a /data chart, linked from the food and famine content.
   - It is measured and dated, refreshes every 16 days, and is what FAO-style crop watch does.
5. **Night lights, yearly** (low effort).
   - Data: VNL V21 + V22, 2013 to 2025. Per county: sum of radiance and lit area (pixels above 1 nW).
   - Replaces today's undated 2016 Black Marble tile shading with a dated county shade (year picker), plus a /data
     chart of Pyongyang's share of the country's light.
   - Monthly only for Pyongyang and roughly 10 lit cities.
6. **Fires** (`FIRMS` in Earth Engine): monthly fire counts per county, which show spring field burning and DMZ fires.
   Cheap; medium value.
7. **Event-wire link** (cheap): when a USGS or MOD event lands near a `places.ts` site, show the nearest site and its
   latest Camp Watch chip next to the event.
8. Later: Sentinel-5P NO2 at power plants and industrial complexes (yearly), CHIRPS rainfall and flood anomalies, the
   lead's harbour radar index.

## Archive

- **Layout:** `data/archive/<source>/<YYYY>/<YYYY-MM>.jsonl`, keyed by event start month. One normalised record per
  line, sorted by key, so git diffs stay small.
  - Sources: `gfw-port-visits/`, `gfw-sar-grid/`, `gfw-sar-monthly.csv`, `ee-lights/`, `ee-ndvi/`.
  - Each source gets a `README.md` with schema, source, license and attribution text.
- **Store normalised records, not raw API responses.** Raw responses are 10 to 50 times larger, carry GFW's internal
  ids, and copy the "product" more than the facts.
  - A port-visit record: `{key, gfw_id, ds:"port-visits:v4.0", imo?, mmsi, name, flag, vtype, start, end, anchorage,
    anchorage_flag, lat, lon, confidence, first_fetched, last_fetched}`.
  - For Earth Engine, store our computed numbers with the dataset id and version and the reducer and scale used. Never
    store imagery.
- **Dedupe key:** don't trust the GFW event id alone. Ids changed when GFW reprocessed with a new pipeline version.
  - Key = `mmsi|anchorage|start rounded to the hour`, and keep `gfw_id` as a field.
  - Upsert: a visit still in progress gets a later `end`. Never delete. A record the API stops returning gets
    `gone: <date>`.
- **Revisions:** recent SAR and lights months grow as data arrives. Write a month as final only once it is 45 days old;
  before that, keep it in the live file, not the archive.
- **Size:** about 0.5 MB a year for visits at North Korean ports, 0.3 MB for the SAR grid, and little for the rest.
  Budget 50 MB in total; `.git` is 98 MB today.
- **Keeping archives out of the site bundle:** nothing under `src/` may import `data/archive/**`. Enforce it with a grep
  in `npm run lint`. Pages read the small live files only.
- **Backfill:**
  - Port visits per listed ship, 2012 to now: about 38 calls.
  - North Korean anchorages, all vessels: one region query per year, paged, about 30 calls.
  - SAR monthly by year, 2017 to now: about 10 calls; the 0.1° grid about 10 more.
  - Under 200 GFW requests in all.
- **License:**
  - CC BY-NC 4.0 lets us copy and redistribute non-commercially with attribution.
  - The public repo puts the downstream user under the same license, so each README must state "CC BY-NC 4.0, Powered
    by Global Fishing Watch" (terms 3.B require us to pass attribution on).
  - Normalised records rather than raw dumps keep the data clean, compact, and fast to query.
  - NASA data is CC0. Copernicus data (Sentinel-1, Sentinel-2, S5P) is free and open with attribution. Check each
    Earth Engine dataset's own terms in its catalog entry before publishing its numbers.

## Rate limits and paid tiers

- GFW: no need. The whole backfill plus weekly runs is under 1% of 50,000 a day.
- Earth Engine: we have two projects (`for-cli21221` and `earth-thing-free`) with 150 EECU-hours each, and can use whichever when quota runs low. Contributor tier (1,000 EECU-hours) is also an option for heavier runs.
- NASA Earthdata: the token expires 2026-12-11. Earth Engine already holds VIIRS, so Earthdata is only needed for the
  Black Marble VNP46A3 and A4 products. Either renew it or drop it.

## Disagreements with the lead's picks

- **(a) Ships layer on /map:** yes, but as ports (anchorage points with counts) plus the SAR grid. Not "ships' last
  positions": the API gives positions only at events, and listed ships mostly sit in Chinese and Russian ports that are
  off the map.
- **(b) Monthly county night lights:** no, as shown above. Do yearly per county, and monthly only for the cities that
  are actually lit.
- **(c) Our own harbour radar counts:** GFW skips everything within 1 km of shore, so the gap is real. But the costs are
  high:
  - Piers, cranes and breakwaters flood harbour radar with clutter.
  - Ships moored side by side merge into one blob at 10 m.
  - Nampo's inner port lies up the Taedong behind the West Sea Barrage.
  - Every number would need checking against Sentinel-2 chips.

  GFW port visits already show 128 Nampo-named visits in 12 months. If we do it, build a simple index (bright-pixel area
  inside a hand-drawn water polygon minus a median static-clutter mask), keep it internal first, and run it
  interactively in chunks; it doesn't need a batch export.
