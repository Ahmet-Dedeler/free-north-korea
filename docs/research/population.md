# Research Report: Population, Administrative Geography & Living Conditions

**Track ID:** `population`  
**Dataset Catalog:** [`population.json`](file:///Users/ahmet/Code/free-north-korea/docs/research/population.json) (38 verified sources)  
**Probe Scripts:** [`docs/research/probes/population/`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/)

---

## 1. Executive Summary & Scope

This research track investigates all accessible, scattered, unmaintained, and foreign-language datasets covering North Korea's people, administrative boundaries, living conditions, and regional statistics. The primary objective is to equip our open-source, map-first platform with the empirical assets required to construct **county-level and provincial choropleths**: population counts, settlement densities, nighttime light / electricity emission proxies, food security and drought anomalies, public health realities, and macroeconomic baselines.

Over 40 potential repositories across English, Korean (한국어), and Japanese (日本語) were investigated and systematically probed with automated Python/curl scripts. Thirty-eight high-value data sources have been cataloged with verified endpoints, real schema footprints, and record counts.

---

## 2. Top 10 Sources Ranked by Value

| Rank | Source ID | Name | Publisher | Value | Format | Key Endpoint / Link |
|---|---|---|---|---|---|---|
| **1** | `hdx-ocha-cod-ab-prk` & `hdx-ocha-cod-ps-prk` | Subnational Administrative Boundaries (COD-AB) & 2008 Population Statistics (COD-PS) | OCHA ROAP / HDX | **5/5** | GeoJSON, CSV | [COD-AB GeoJSON](https://data.humdata.org/dataset/0cd9579f-ca75-4af4-88e1-9c5fa0bbb7ab/resource/3481e99e-bf95-45d1-a057-46c7b2d46726/download/prk_admin_boundaries.geojson.zip) / [COD-PS CSV](https://data.humdata.org/dataset/0b26b6ed-8bcb-4c9a-9c69-ba3df48162c4/resource/f21a15b9-2ccb-4917-985f-1ab64c379526/download/prk_pop_adm2_v2.csv) |
| **2** | `mou-nkinfo-nkmap-fastapi` | NKMap GIS & FastAPI Point of Interest Search Backend | ROK Ministry of Unification (통일부 북한정보포털) | **5/5** | JSON REST API | `https://nkinfo.unikorea.go.kr/nkp/search/nkmapSearchFastApi.do?q=평양` |
| **3** | `nasa-gibs-black-marble-wmts` | VIIRS Black Marble Nighttime Lights WMTS Tile Service | NASA ESDIS / GIBS | **5/5** | Raster WMTS Tiles | `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png` |
| **4** | `kontur-population-h3-dprk` | Population Density for 400m H3 Hexagons | Kontur / HDX | **5/5** | GeoPackage | [Kontur H3 Geopackage](https://geodata-eu-central-1-kontur-public.s3.amazonaws.com/kontur_datasets/kontur_population_KP_20231101.gpkg.gz) |
| **5** | `justin-meyers-dprk-boundaries` | DPRK Official Administrative Boundaries with Korean UFID & Hangul Names | Justin Elliot Meyers | **5/5** | Shapefile / DBF | [DBF Table](https://raw.githubusercontent.com/justinelliotmeyers/official_DPRK_administrative_boundary_shapefile/master/northkoreaadmin2_master.dbf) |
| **6** | `worldpop-prk-100m-constrained` & `worldpop-prk-age-sex-rasters` | 100m Constrained Settlement Population & 5-Year Age/Sex Cohort Rasters | WorldPop (Univ. of Southampton) | **5/5** | GeoTIFF | [WorldPop Constrained GeoTIFF](https://data.worldpop.org/GIS/Population/Global_2000_2020_Constrained/2020/BSGM/PRK/prk_ppp_2020_constrained.tif) |
| **7** | `kosis-bukhan-population-territory` | KOSIS North Korea Statistics Portal (북한통계: 142 Thematic Tables) | Statistics Korea (통계청) | **5/5** | JSON-API / Web Tables | `https://kosis.kr/statisticsList/selectTreeData.do` (`vwcd=MT_BUKHAN`) |
| **8** | `wfp-vam-subnational-rainfall` & `wfp-vam-subnational-ndvi` | Subnational Dekadal Rainfall & NDVI Vegetation Anomalies | WFP VAM / HDX | **5/5** | CSV | [WFP Dekadal Rainfall CSV](https://data.humdata.org/dataset/3212d9bf-51b1-4f52-bbc8-82aa392b8857/resource/40f285ff-54b2-4544-80a5-d1a79eb70935/download/prk-rainfall-subnat-5ytd.csv) |
| **9** | `unicef-mics-2017-dprk` | Multiple Indicator Cluster Survey 2017 (MICS6) Survey Findings Report | UNICEF & DPRK CBS | **5/5** | PDF Tables | [UNICEF DPRK MICS PDF](https://www.unicef.org/dprk/media/156/file/MICS.pdf) |
| **10** | `mou-data-go-kr-defectors-origin` | Defectors by DPRK Origin Province (북한이탈주민 재북 출신지역별 현황) | ROK Ministry of Unification / Data.go.kr | **5/5** | CSV / PDF | [Data.go.kr File 15106194](https://www.data.go.kr/data/15106194/fileData.do) |

### Analysis of Top 10 Sources

1. **HDX / OCHA COD-AB & COD-PS (`hdx-ocha-cod-ab-prk`, `hdx-ocha-cod-ps-prk`)**  
   *Why it ranks #1:* This is the operational backbone for all subnational mapping in North Korea. COD-AB supplies 179 Admin 2 county/city polygons with standardized P-codes (`KP01`, `KP0101`, etc.), and COD-PS supplies the corresponding 2008 field census demographic table (Total, Male, Female, Urban, Rural). They join 1-to-1 cleanly, enabling immediate county-level choropleths.
2. **Ministry of Unification NKMap FastAPI Backend (`mou-nkinfo-nkmap-fastapi`)**  
   *Why it ranks #2:* Hidden behind the Unification Ministry's newly launched VWorld-powered single-page application (`https://nkinfo.unikorea.go.kr/NKMap/`), this live JSON endpoint (`/nkp/search/nkmapSearchFastApi.do?q=...`) provides coordinates (Korean Central Belt TM/GRS80) and rich descriptive dossiers for over 2,500 North Korean facilities—hospitals, factories, department stores, theaters, schools, and administrative borders. It is live, fast, and completely unindexed in Western OSINT tools.
3. **NASA GIBS VIIRS Black Marble WMTS (`nasa-gibs-black-marble-wmts`)**  
   *Why it ranks #3:* Free, public, keyless, and instantly embeddable into MapLibre GL as a standard raster tile layer (`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/...`). It allows users to toggle night lights on and off to observe the infamous darkness of North Korea compared to South Korea and China, providing an undeniable visual proxy for electrical infrastructure.
4. **Kontur Population 400m H3 Hexagons (`kontur-population-h3-dprk`)**  
   *Why it ranks #4:* Fuses Global Human Settlement Layer (GHSL), Facebook High Resolution Settlement Layer, Microsoft Building Footprints, and OpenStreetMap into uniform ~400m vector H3 hexagons. The entire DPRK dataset is a compact 3.5 MB GeoPackage that can be transformed into vector tiles (`.pbf`) for 3D hexagonal population density bar extrusions.
5. **Justin Elliot Meyers DPRK Administrative Shapefiles (`justin-meyers-dprk-boundaries`)**  
   *Why it ranks #5:* While UN COD-AB collapses Pyongyang into a single administrative unit, Meyers' shapefile preserves 218 polygons that disaggregate Pyongyang into its individual municipal districts (*낙랑구역, 만경대구역, 보통강구역, 대동강구역, etc.*) and Nampo into its constituent guyok. Essential for high-resolution capital city mapping.
6. **WorldPop 100m Constrained Rasters & Age/Sex Cohorts (`worldpop-prk-100m-constrained`, `worldpop-prk-age-sex-rasters`)**  
   *Why it ranks #6:* Provides a 6 MB 100m constrained settlement population raster for North Korea (2020) and 36 individual age-sex cohort rasters (males and females in 5-year buckets up to 80+). Running zonal statistics across our county polygons produces modern modeled age pyramids and dependency ratios for every county in the country.
7. **Statistics Korea KOSIS North Korea Statistics Portal (`kosis-bukhan-population-territory`)**  
   *Why it ranks #7:* The most comprehensive official collection of North Korean statistics in the world. Our probe systematically extracted all 14 categories and 142 individual statistical tables covering population projections to 2070, Bank of Korea GDP estimates (1990-2024), grain output (1965-2025), energy production, and jangmadang market price indexes (`DT_1ZGG7`).
8. **WFP VAM Dekadal Rainfall & NDVI Indicators (`wfp-vam-subnational-rainfall`, `wfp-vam-subnational-ndvi`)**  
   *Why it ranks #8:* Active, dekad-by-dekad (every 10 days) satellite rainfall (CHIRPS) and vegetation health (MODIS NDVI) indicators aggregated to the exact P-codes of North Korea's counties. Provides an automated feed for mapping agricultural drought and famine vulnerability in near real time.
9. **UNICEF MICS 2017 Survey Findings Report (`unicef-mics-2017-dprk`)**  
   *Why it ranks #9:* The most recent on-the-ground public health survey in North Korea, covering 8,500 households across all 11 provinces. Contains authoritative provincial tables on child stunting (19.1% national; over 32% in Ryanggang vs. 10% in Pyongyang), wasting, maternal mortality, and access to piped water.
10. **Ministry of Unification Defector Origins Dataset (`mou-data-go-kr-defectors-origin`)**  
    *Why it ranks #10:* Official quarterly ROK government dataset documenting the home provinces of over 34,000 defectors. Reveals that roughly 70% originate from North Hamgyong and 15% from Ryanggang, highlighting the geographical bias of defector testimonies and cross-border escape corridors along the Tumen and Yalu rivers.

---

## 3. What Is Raw, Unexplored & Worth Building First

### A. The County-Level Demographic & Nighttime Light Choropleth
* **The Opportunity:** Currently, no website presents an interactive, bilingual (Korean/English) county-level choropleth map of North Korea. Most media outlets show a single country silhouette or province boundaries.
* **The Recipe:** 
  1. Take OCHA COD-AB GeoJSON (179 units) and Meyers' shapefile (218 units).
  2. Join `cod-ps-prk` 2008 census population counts (Total, Male, Female, Urban, Rural).
  3. Overlay zonal statistics from WorldPop 2020 100m constrained population rasters.
  4. Layer NASA GIBS Black Marble raster tiles underneath.
* **Result:** Users can click any county (e.g., *Samjiyon, Kim Jong Suk, Hyesan, Hoeryong*) and view total population, urban-to-rural ratio, estimated 2020 settlement density, and nighttime illumination levels.

### B. Unification Ministry NKMap Facility Scraper & Reprojection
* **The Opportunity:** The Ministry of Unification operates an undocumented FastAPI endpoint (`/nkp/search/nkmapSearchFastApi.do`) with structured data for thousands of landmarks, industrial facilities, power plants, cooperative farms, and schools.
* **The Recipe:** 
  1. Use our probe script [`probe_nkinfo_portal.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/probe_nkinfo_portal.py) as a scraper.
  2. Iterate through North Korea's 179 county names and major industrial sectors.
  3. Convert coordinates from Korean Central Belt GRS80 (EPSG:5186) to WGS84 (EPSG:4326).
* **Result:** Populate our site's Atlas with hundreds of authenticated, officially verified North Korean facilities that Western maps have never indexed.

### C. Live Agricultural Stress & Drought Vulnerability Monitor
* **The Opportunity:** WFP VAM publishes dekadal rainfall and NDVI anomaly CSVs every 10 days on HDX, mapped directly to P-codes.
* **The Recipe:** 
  1. Build a lightweight scheduled GitHub Action or prebuild script that fetches `prk-rainfall-subnat-5ytd.csv` and `prk-ndvi-subnat-5ytd.csv`.
  2. Color counties by their vegetation anomaly index (`viq`): green for healthy crops, yellow for moderate stress, deep red for drought.
* **Result:** A live, dynamic food vulnerability map that updates automatically throughout the North Korean growing season (April to October).

### D. Provincial Health & Malnutrition Inequality Map
* **The Opportunity:** UNICEF MICS 2017 data is locked away in a 246-page PDF. 
* **The Recipe:** Digitize the provincial tables for child stunting, acute wasting, and access to clean piped water.
* **Result:** A visual map demonstrating the severe living standard disparity between Pyongyang (elite access, low stunting) and the northeastern mountainous provinces (high stunting, lack of clean water).

---

## 4. Gaps Where No Data Exists

1. **No Ground Census Conducted Since 2008**  
   The planned 2018-2019 UNFPA-supported census was canceled after preparations stalled over international sanctions, financial transfer obstacles, and North Korea's subsequent COVID-19 isolation. While DPRK authorities claimed to have conducted an internal headcount in 2019, no microdata or verified county breakdowns were ever published. All post-2008 population counts are projections (UN WPP, Statistics Korea, WorldPop).
2. **Sub-County (Eup/Myeon/Ri) Population Counts**  
   Neither the 1993 nor the 2008 census published population numbers below the county/city (ADM2) level. To estimate populations for individual villages (*ri*), researchers must rely entirely on gridded dasymetric modeling (WorldPop / Kontur).
3. **County-Level Age and Sex Pyramids from Official Census**  
   The 2008 census report only published 5-year age cohorts at the national and provincial (ADM1) levels; county-level tables were restricted to broad gender and urban/rural counts.
4. **Real-Time Mortality & Epidemiological Surveillance**  
   Following the complete withdrawal of UN and foreign NGO personnel in 2020-2021, on-the-ground epidemiological tracking ceased. WHO and UNICEF data from 2021 onward rely on statistical model projections rather than clinic-level reporting.
5. **Real Local Market Prices & Incomes**  
   Official state portals do not publish jangmadang market prices, private household income, or food distribution quotas. These must be inferred from defector interviews or clandestine network reporting (Daily NK, Asia Press/Rimjin-gang).

---

## 5. Legal, Safety & Privacy Guidelines

* **Defector Privacy & Witness Protection:** Data on North Korean defectors (from the Ministry of Unification or NGOs) must **strictly remain aggregated at the provincial or broad annual level**. Under no circumstances should individual escape timelines, crossing points, or hometown villages be published in conjunction with defector narratives, as state security organs in North Korea routinely target family members who remain behind.
* **In-Country Witness Security:** When integrating facility descriptions or regional profiles, never attribute conditions to named internal contacts or unpublished testimonies.
* **Licensing Adherence:** 
  * UN COD-AB, COD-PS, and WFP VAM datasets are released under **CC BY-IGO** and require standard UN attribution.
  * OpenStreetMap data is licensed under the **Open Database License (ODbL 1.0)**; any transformed vector tiles must retain the OSM copyright notice.
  * NASA GIBS tiles are **US Government Public Domain**.
  * GADM boundaries are restricted to non-commercial academic use; for our fully open-source Next.js site, **OCHA COD-AB, geoBoundaries, and OSM are the preferred vector backbones**.

---

## 6. Directory of Created Artifacts & Probes

* **JSON Catalog:** [`docs/research/population.json`](file:///Users/ahmet/Code/free-north-korea/docs/research/population.json) (38 entries, verified)
* **KOSIS Table Index:** [`docs/research/probes/population/kosis_bukhan_tables.json`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/kosis_bukhan_tables.json) (142 tables cataloged)
* **2008 Census Excel Baseline:** [`docs/research/probes/population/prk_pop.xls`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/prk_pop.xls) (HDX tabular baseline)
* **Probes:**
  * [`probe_hdx_admin_pop.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/probe_hdx_admin_pop.py) – Verifies HDX CKAN API, boundary GeoJSONs, and WFP VAM datasets.
  * [`probe_kosis_bukhan.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/probe_kosis_bukhan.py) – Recursively traverses KOSIS `MT_BUKHAN` tree and enumerates all tables.
  * [`probe_nkinfo_portal.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/probe_nkinfo_portal.py) – Tests live Unification Ministry NKMap search and coordinate extraction.
  * [`probe_un_wpp_worldbank.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/probe_un_wpp_worldbank.py) – Queries UN Data Portal API and World Bank WDI API.
  * [`probe_worldpop_nightlights.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/probe_worldpop_nightlights.py) – Verifies WorldPop 100m GeoTIFFs and NASA GIBS WMTS tiles.
  * [`probe_osm_geoboundaries.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/probe_osm_geoboundaries.py) – Queries OSM Overpass API, geoBoundaries, and Justin Meyers repo.
  * [`probe_health_food.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/population/probe_health_food.py) – Queries WHO GHO API, UNICEF MICS PDF, and FAO GIEWS Country Brief.
