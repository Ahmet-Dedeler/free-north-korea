# Research Report: Satellite & Gridded Earth Observation Track

**Track Scope:** Open satellite, climate, and gridded remote sensing sources computed per DPRK province and county over time (Our World in Data style). Covers nighttime lights (NASA Black Marble, VIIRS VNL, World Bank Light Every Night / Space2Stats), precipitation and agro-climatology (WFP VAM, CHIRPS, MODIS NDVI), forest loss and land cover (Hansen Global Forest Change v1.13, MODIS MCD12Q1), demographics (WorldPop, Kontur H3), urban infrastructure (GHSL built-up surface 1975–2025), air quality (ACAG surface PM2.5, TROPOMI NO2), and active fires (NASA FIRMS).

---

## 1. Top 10 Series Ranked by Value

| Rank | Series ID | Title & Publisher | Latest Data Point | Freq / Coverage | Value | Why It Matters |
|---|---|---|---|---|:---:|---|
| **1** | `viirs-ntl-annual-sum-lights` | **VIIRS Annual Sum of Night Lights by Province**<br>*(World Bank / NASA / NOAA / Space2Stats)* | **2024:** Pyongyang: 15,569.6 nW; S. Hamgyong: 43,845.0 nW; Jagang: 41,554.4 nW; N. Hamgyong: 40,637.1 nW | Annual<br>(2012–2024) | **5/5** | Empirical proxy for electricity supply and economic activity. Reveals the stark divergence under Kim Jong Un: Pyongyang lights grew **+51.3%** (2012–2024), while North Hamgyong fell **-15.1%** and Kangwon fell **-13.0%**. |
| **2** | `viirs-ntl-border-contrast-dandong-sinuiju` | **Yalu River Border Luminosity: Dandong (CHN) vs Sinuiju (DPRK)**<br>*(Computed via World Bank Space2Stats)* | **2024:** Dandong City: 24,976.9 nW vs Sinuiju core: ~1,850 nW (China side **~13.5× brighter**) | Annual<br>(2012–2024) | **5/5** | Replaces anecdotal night photos with a dated, reproducible time-series chart of the border divide across the Sino-Korean Friendship Bridge. |
| **3** | `wfp-vam-dekadal-rainfall` | **WFP VAM Subnational Dekadal Rainfall (CHIRPS)**<br>*(World Food Programme VAM / HDX)* | **2026-09-21 (Dekad 27):** S. Pyongan: 75.7 mm (208% of norm); 3-month: 1,377 mm (200% of norm) | Every 10 days<br>(1981–2026) | **5/5** | Automated, machine-readable CSV updated every dekad on HDX. Captures the catastrophic summer 2026 Yalu River floods where 3-month rainfall exceeded 200% of normal across all western provinces. |
| **4** | `wfp-vam-dekadal-ndvi` | **WFP VAM Subnational Vegetation Condition Index (MODIS NDVI)**<br>*(World Food Programme VAM / HDX)* | **2026-09-11 (Dekad 26):** S. Hwanghae: 0.781 (111.6% of norm); Pyongyang: 0.727; Jagang: 0.857 | Every 10 days<br>(2002–2026) | **5/5** | Directly measures crop photosynthetic health across all 11 provinces and 179 counties. Crucial early-warning indicator for cereal harvest failures. |
| **5** | `hansen-gfc-tree-cover-loss` | **Hansen Global Forest Change Annual Tree Cover Loss**<br>*(UMD GLAD / Google / USGS / NASA)* | **2025:** Cumulative 2001–2025 loss: ~300,000 ha (6.0% of DPRK 2000 forest baseline) | Annual<br>(2001–2025) | **5/5** | 30m resolution global benchmark (v1.13). Quantifies widespread hillside deforestation that stripped watersheds and aggravated recurring monsoon flash floods. |
| **6** | `ghsl-ghs-built-s-surface-area` | **GHSL Multitemporal Built-Up Surface Area (R2023A)**<br>*(European Commission JRC / World Bank Space2Stats)* | **2025:** Pyongyang: 64.3 km²; N. Hamgyong: 59.3 km²; S. Pyongan: 50.2 km²; S. Hamgyong: 49.2 km² | 5-year multi-epoch<br>(1975–2025) | **5/5** | Measures 50 years of physical concrete and building expansion. Pyongyang expanded +116% from 29.8 km² (1975) to 64.3 km² (2025). |
| **7** | `acag-surface-pm25-annual` | **ACAG Satellite-Derived Surface PM2.5 Concentration**<br>*(ACAG, Washington University in St. Louis / van Donkelaar)* | **2023:** V6.GL.02 dataset (~1 km grid, calibrated via CNN against ground monitors) | Annual<br>(1998–2023) | **5/5** | Gold standard used by the Global Burden of Disease. DPRK has **zero** public ground air-quality stations, making satellite aerosol retrieval the sole empirical window into air pollution. |
| **8** | `acag-surface-no2-annual` | **High-Resolution Surface Nitrogen Dioxide (TROPOMI & OMI)**<br>*(ACAG / Cooper et al. / Yan et al., Nature & Sci Data)* | **2023:** 0.01° global surface NO2 grid (Zenodo record 19740022 / Cooper Nature 2022) | Annual<br>(2005–2023) | **5/5** | Direct physical tracer for thermal power plants, heavy chemical industries (Hungnam, Chongjin, Suncheon), and fossil fuel combustion. |
| **9** | `firms-viirs-active-fire-counts` | **NASA FIRMS VIIRS 375m Active Fire Detections**<br>*(NASA ESDIS / FIRMS)* | **2026-10-04 (Past 7 days):** 24 active fire detections in DPRK (S. Pyongan: 19, S. Hwanghae: 2, N. Hwanghae: 2) | Weekly / Daily<br>(2012–2026) | **5/5** | Daily updated open CSVs. Tracks seasonal agricultural burning (spring slash-and-burn, autumn stubble burns) and uncontained wildfires across mountain provinces. |
| **10** | `kontur-population-h3-density` | **Kontur Population 400m H3 Hexagonal Density**<br>*(Kontur / HDX)* | **2023-11:** 3.31 MB GeoPackage for DPRK (H3 resolution 8 hexagons) | Irregular<br>(2022–2023) | **5/5** | High-precision settlement modeling combining GHSL, Facebook HRSL, and OSM to locate exactly where populations cluster around markets, railways, and facilities. |

---

## 2. Which Ones to Compute and Centralize Ourselves (and Why)

### A. Nighttime Lights: The Zero-Download World Bank Space2Stats Pipeline
* **The Problem:** Raw VIIRS nighttime lights files (EOG VNL v2.2 or NASA Black Marble VNP46A4) are multi-gigabyte rasters (2–10 GB per year). Downloading 2012–2025 global rasters to do zonal statistics locally is slow, bandwidth-heavy, and fragile. Furthermore, EOG requires openid login.
* **Our Solution:** We identified and verified the **World Bank DECAT Space2Stats API** (`https://space2stats.ds.io/aggregate`). This API computes zonal statistics on the fly from the *Light Every Night* AWS Open Data repository. By sending DPRK province boundaries from `public/layers/provinces.geojson`, we pull exact sum-of-lights (`sum_viirs_ntl_2012` through `sum_viirs_ntl_2024`), built-up surface area (`sum_built_area_m_1975` to `2030`), and population in **under 5 seconds total**.
* **Key Finding:** Under Kim Jong Un, total nighttime luminosity shifted dramatically toward the capital:
  * **Pyongyang:** +51.3% (10,292 nW in 2012 → 15,570 nW in 2024).
  * **Outer Provinces:** North Hamgyong (-15.1%), Kangwon (-13.0%), South Hwanghae (-14.1%), Nampo (-11.3%), North Hwanghae (-11.4%), South Hamgyong (-9.4%), South Pyongan (-7.7%).
  * **Comparison:** Seoul Metropolitan Area alone (292,085 nW) is **18.7× brighter** than the entire capital city of Pyongyang. The Chinese border city of Dandong (24,977 nW) is **1.6× brighter** than Pyongyang and over **13× brighter** than adjacent Sinuiju.

### B. WFP VAM Dekadal Rainfall & NDVI: The Live Crisis Pipeline
* **The Opportunity:** The UN World Food Programme Vulnerability Analysis and Mapping (VAM) team maintains automated dekadal CSVs on HDX (`prk-rainfall-subnat-5ytd.csv` and `prk-ndvi-subnat-5ytd.csv`).
* **Freshness:** Updated on **October 5, 2026** (today). Contains data through **September 21, 2026** (Rainfall) and **September 11, 2026** (NDVI) for all 11 provinces and 179 counties.
* **Why We Centralize:** While WFP hosts raw CSVs, no public website turns these dekadal numbers into interactive, county-level time-series charts showing cumulative flood surges or historical drought comparisons back to 1981.

### C. NASA FIRMS Active Fires: Daily Point-in-Polygon
* **The Pipeline:** NASA FIRMS publishes 24-hour, 48-hour, and 7-day CSVs of all active fires detected by Suomi-NPP VIIRS, NOAA-20, and NOAA-21 without authentication (`https://firms.modaps.eosdis.nasa.gov/data/active_fire/`).
* **Our Probe:** `probe_firms_active_fires.py` performs a spatial join between the FIRMS Asia CSV and `public/layers/provinces.geojson` in 2 seconds, extracting fire counts and total Fire Radiative Power (MW) by province.

### D. Hansen Global Forest Change v1.13: Deforestation & Reforestation
* **The Pipeline:** Tile `40N_120E` and `50N_120E` on Google Cloud Storage (`https://storage.googleapis.com/earthenginepartners-hansen/GFC-2025-v1.13/`) are publicly accessible (22–28 MB).
* **Why It Matters:** Enables tracking the progress of Kim Jong Un's 2015–2025 "Forest Recovery Campaign", revealing whether tree loss actually decelerated after 2015.

---

## 3. Data Gaps Where No Open Data Exists

1. **In-Situ Ground Weather & Hydrological Telemetry:** North Korea operates weather stations, but only shares a handful of synoptic reports over the WMO GTS. County-level river stream gauges and flood crest measurements are treated as state secrets.
2. **Public High-Resolution Commercial Imagery Time-Series:** Sub-meter imagery of construction, missile launch sites, and flood damage (Maxar, PlanetScope, Airbus Pleiades) is proprietary and locked behind paywalls. We rely on public 10m–30m instruments (Sentinel-2, Landsat, MODIS, VIIRS).
3. **Internal Power Grid Production & Transmission:** Night lights reflect electricity usage at night, but daytime industrial consumption, hydro reservoir turbine output, and coal supply are unmetered from space.
4. **Independent Census and Birth/Death Counts Post-2008:** Gridded population models (WorldPop, Kontur) must extrapolate from the 2008 UN Census; the planned 2018–2019 UNFPA census was canceled by Pyongyang.

---

## 4. Safety & Ethical Considerations

* **Macro Resolution Eliminates Identification Risk:** All satellite and gridded datasets analyzed in this track operate at provincial, county, or aggregated raster grid scale (400m to 5 km). None contain personal data, names, or individual identities.
* **No Tactical Refugee / Escape Route Coordinates:** While geographic boundaries are used for provinces and counties, we strictly adhere to project safety rules: never publish coordinates of informal border crossings, hiding locations, or active human escape corridors.
* **Public Domain / Open Data Compliance:** All selected data sources are openly licensed (CC-BY 4.0, CC-BY-IGO, CC0, or NASA/ESA public domain).

---

## 5. Working Probe Scripts & Verified Samples Summary

All 6 probe scripts are located in `docs/research/charts/probes/satellite/` and verified with working live pulls:
1. `probe_nightlights_space2stats.py`: Successfully queried Space2Stats API for 11 DPRK provinces + Seoul + Dandong.
2. `probe_wfp_rainfall_ndvi.py`: Extracted latest 2026-09-21 rainfall and 2026-09-11 NDVI for all provinces and counties.
3. `probe_firms_active_fires.py`: Spatially joined 39,855 Asian fire detections to DPRK provinces (found 24 fires for early October 2026).
4. `probe_modis_landcover_cmr.py`: Verified 4 annual tiles covering DPRK in NASA CMR for 2001–2024.
5. `probe_chirps_precipitation.py`: Verified 44 years of annual (1981–2024) and 548 months of monthly (1981–2026-08) CHIRPS GeoTIFFs on UCSB CHC.
6. `probe_forest_loss_hansen.py`: Verified Hansen GFC v1.13 (2000–2025) tiles on Google Cloud Storage.
7. `probe_worldpop_kontur.py`: Verified WorldPop 2000–2020 annual rasters via REST API and Kontur 400m H3 GeoPackage on HDX.

All verified samples (< 1 MB) are stored in `docs/research/charts/samples/satellite/`.
Full series specifications (32 series) are structured in `docs/research/charts/satellite.json`.
