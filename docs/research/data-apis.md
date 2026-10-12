# Free satellite and ship data: what we have access to (checked 2026-10-12)

Keys live in `.env.local` (gitignored) and, for the weekly Action, in GitHub secrets. Never in the repo. The peer
review with test calls and quoted license clauses is in `peer-api-review.md`.

## Accounts and keys

| Source | Account | Key | Limits | Terms |
|---|---|---|---|---|
| Global Fishing Watch API v3 | pathetic370@gmail.com | `GFW_API_TOKEN` (valid to 2036) | 50,000 requests/day, 1.5M/month per user, shared by all of that user's tokens. Headers `x-ratelimit-*` show usage. 4Wings reports: 366 days max per request | CC BY-NC 4.0, non-commercial only. "Powered by Global Fishing Watch" link on every page and file that uses it. One account per organisation: no extra accounts from friends (clause 2.B). Token must not reach the browser |
| NASA Earthdata (LAADS, Black Marble night lights) | pathetic370 | `EARTHDATA_TOKEN` (user token, expires 2026-12-11; regenerate at urs.earthdata.nasa.gov → Generate Token) | No published hard limit | NASA data is open (CC0 unless marked). Cite the dataset |
| Google Earth Engine | ahmetdedelerr@gmail.com, Cloud project `for-cli21221` | gcloud login (`gcloud auth print-access-token --account=ahmetdedelerr@gmail.com`, header `x-goog-user-project: for-cli21221`) | Non-commercial tier: 150 EECU-hours/month since 2026-04-27 (1,000 with a billing account attached, still free). Interactive calls time out after about 5 minutes; heavy jobs need batch exports | Free for non-commercial use; publishing derived results is allowed |
| Microsoft Planetary Computer | none | anonymous SAS token from `/api/sas/v1/token/<collection>`, about 1 hour | none published | Sentinel-1 RTC: CC BY 4.0 (Copernicus) |
| Element84 Earth Search | none | none | none published | Copernicus / USGS terms. Sentinel-1 GRD there sits in a requester-pays bucket, so use Planetary Computer for radar |

## What each one exposes, for North Korea

- **GFW**
  - Vessel identity: every name, flag and MMSI broadcast under an IMO number. 105 of our 111 listed IMOs resolve.
  - Port visits: confidence 1-4, anchorage name and country.
  - Encounters: fishing, carrier, bunker and support pairs only, so no tanker-to-tanker transfers.
  - AIS gaps: a prototype, only gaps of 12 h or more starting 50 nm or more offshore. Zero events near Korea.
  - SAR vessel detections: Sentinel-1, matched to AIS where possible, about 3 days behind. Only vessels over about
    15 m are detected reliably, and nothing within about 1 km of shore is counted.
- **Earth Engine**: everything below is in its catalog, current to this week:
  - Sentinel-1 GRD
  - Sentinel-2
  - Landsat 5-9 back to 1984
  - Dynamic World land cover (Sentinel-2, near real time)
  - VIIRS daily (`NASA/VIIRS/002/VNP46A2`) and monthly night lights
  - AlphaEarth satellite embeddings (`GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL`, yearly to 2025)

  The computing runs on Google's servers.
- **Sentinel-1 passes over North Korea** are now from S-1C and S-1D: Nampo gets a pass on about 19 of every 90 days,
  Wonsan about 10.

## Built so far

- `data/archive/gfw` (see `data/archive/README.md`): everything `scripts/build-ships.ts` fetches, kept for good.
  The first backfill (2026-10-12) took about 8 minutes and about 400 requests:
  - 310 identity records
  - 35,594 port visits since 2012
  - 118 radar months since 2017

  It came to 20 MB. A weekly run refreshes the last 120 days of visits and the last 3 months of radar.
- `/sanctions/ships`, built from the archive. Shows:
  - listed ships, the identities they broadcast, and port calls since 2012
  - who calls at North Korean ports (last 12 months, foreign flags listed)
  - radar counts per month and per year since 2017, with the share that sent no AIS
- Yearly night lights per county, 2013-2025 (`scripts/ee/night_lights.py`, about a minute in Earth Engine, free tier):
  - National sum of lights 14,960 (2013) → 23,241 (2022) → 53,368 (2025); lit area 3,105 → 7,002 km².
  - Control areas in the same data are steady over 2022-2025: Seoul +3%, rural Gangwon (South Korea) +7%, Dandong
    +28%. North Korea's rise isn't a processing change.
  - Pyongyang is 28-34% of all the light.
- Findings worth a follow-up:
  - Radar detections per pass day in North Korea's waters fell from 344 (2019) to 81-88 (2020-2022), then
    rose to 208 (2026).
  - Russian cargo ships GEFEST and ORION called near Nampo in April-May 2026.
  - PUK DAE BONG (UN "Hua Fu") has 278 foreign port calls since 2012.

## Ideas checked and parked

- **Our own radar ship detector**: GFW already publishes this. Our one test, a CFAR-style threshold at Nampo, timed
  out in Earth Engine's interactive mode. It would only add value inside ports, where GFW skips the 1 km band near
  shore. That makes it a port-occupancy count (ships alongside at Nampo, Chongjin, Rajin each month) and needs batch
  exports.
- **Night lights per county**: aggregate, open data, cheap in Earth Engine. North Korea sits near the sensor's noise
  floor outside Pyongyang, so show it with that caveat.
- **Camp finder** (embedding similarity, then agent triage): internal leads only, never published unverified.
- **Radar coherence at nuclear sites**: needs SLC data and InSAR processing, which C-band does poorly over snow and
  vegetation.
