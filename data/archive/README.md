# data/archive

Our own permanent record of data that its source only serves for a while, or may reprocess. Scripts add to it;
nothing is deleted. Each record is matched on a stable key and updated in place, with `firstFetched` (the day we
first stored it) and `updated` (the day it last changed). Git history keeps every earlier version.

The site never imports these files (`scripts/check-archive-imports.mjs` fails the lint if it does). Build scripts
read the archive and write small summaries into `data/` for the pages. Code: `scripts/archive.ts`.

## gfw/ (Global Fishing Watch)

Powered by Global Fishing Watch (https://globalfishingwatch.org). Licensed CC BY-NC 4.0: free to reuse for
non-commercial purposes with this attribution, which must be passed on. Terms:
https://globalfishingwatch.org/our-apis/documentation/docs/license-rate-limits.md

Written by `scripts/build-ships.ts` (weekly; `--backfill` refetches everything).

| Folder | One line per | Key | Since |
|---|---|---|---|
| `identities/identities.jsonl` | AIS identity record broadcasting the IMO number of a ship on a North Korea sanctions list: `imo, name, flag, mmsi, first, last` (first and last transmission) | GFW record id | as far back as GFW has |
| `port-visits/<year>.jsonl` | Port visit, confidence 3 or 4, of a listed ship anywhere (`imo` set) or of any vessel at a North Korean anchorage: vessel as broadcast, anchorage, `start`, `end`, `hours` | `mmsi\|anchorage\|start hour` (GFW event ids can change when it reprocesses; kept as `gfwId`) | 2012 |
| `sar-months/sar-months.jsonl` | Month of Sentinel-1 radar vessel detections in North Korea's EEZ (8328): total, matched to AIS, matched by flag, days with a radar pass (Planetary Computer catalog) | month | 2017 |
| `sar-grid/<year>.jsonl` | 0.1° cell and month: detections and how many matched AIS. The finer grid is never stored: most of its cells are single detections | month, lat, lon | 2017 |
| `sar-vessels/<year>.jsonl` | Vessel matched to a radar detection in the EEZ in a month, as broadcast | month, GFW vessel id | 2017 |

AIS is self-reported: names, flags and even IMO numbers can be false. Port visits at North Korean anchorages
include fishing-gear buoys and placeholder MMSI numbers; the site filters those, the archive keeps them.

## ee/ (our own computations in Google Earth Engine)

Numbers we computed from satellite data, never imagery. Each line names its dataset.

| File | One line per | Source and license | Written by |
|---|---|---|---|
| `night-lights/annual.jsonl` | county (`pcode`) and year: `sum` of radiance, `litKm2`, `litShare` of the county's area; null when no cloud-free data | Annual VIIRS night-time lights V2.1 (2013-2021) and V2.2 (2022 on), Earth Observation Group, Payne Institute, Colorado School of Mines, https://eogdata.mines.edu/products/vnl/, CC BY 4.0 | `scripts/ee/night_lights.py`, by hand once a year |
| `crops/<year>.jsonl` | province (`pcode`, or `KP` for the whole country) and 16-day composite (`date`, April to October): mean `ndvi` over cropland, `clearKm2` of cropland seen without snow or cloud | MODIS MOD13Q1 v6.1 NDVI over MODIS MCD12Q1 v6.1 cropland of 2020 (NASA LP DAAC, open data) | `scripts/ee/crops.py`; `--backfill` from 2001 |
