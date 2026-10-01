# Korean and Japanese Sources Research Report

Track: `korean_japanese`  
Scope: Primary Korean- and Japanese-language datasets, government portals, undercover reporting networks, and geospatial databases on North Korea.

---

## 1. Top 10 Sources Ranked by Value

| Rank | Source ID | Publisher | Language | Value | Records | Description |
|---|---|---|:---:|:---:|:---:|---|
| 1 | `unikorea-nkmap-api` | 통일부 북한정보포털 | ko | 5 | 304,598 | Hidden REST API (`searchNKMapFastApi.do`) with 304,598 geocoded facilities, factories, mines, stations, and landmarks across DPRK with EPSG:5186 coordinates and sectoral metadata. |
| 2 | `asiapress-rimjingang-market-prices` | アジアプレス (Asia Press) | ko / ja | 5 | 120+ | Bi-weekly/monthly undercover street price series (rice, corn, fuel, USD/KPW and CNY/KPW exchange rates) inside Hyesan, Chongjin, Pyongsong, and Musan. |
| 3 | `soseikai-missing-persons-database` | 特定失踪者問題調査会 | ja | 5 | 276 | Detailed investigative profiles of suspected Japanese citizens abducted to North Korea with geocodable coastal disappearance points, dates, ages, and narratives. |
| 4 | `japan-mod-missile-announcements` | 防衛省・自衛隊 (Japan MOD) | ja | 5 | 280+ | Real-time military launch announcements with exact launch times, inland DPRK launch county, apogee altitude, flight range, and splashdown bearing/EEZ coordinates. |
| 5 | `data-go-kr-defector-origins` | 통일부 / 남북하나재단 | ko | 5 | 18 | Defector demographics by pre-defection origin province (2008–2026), occupation, and education, documenting that 58%+ originate from North Hamgyong Province. |
| 6 | `unikorea-defector-statistics` | 통일부 (Ministry of Unification) | ko | 5 | 29 | Complete 1998–2026 time series of escapees arriving in South Korea (34,000+ total), broken down by gender, age groups, and annual/monthly arrivals. |
| 7 | `kosis-bukhan-statistics` | 국가데이터처 (Statistics Korea) | ko | 5 | 140+ | Centralized macro-statistical database covering Bank of Korea DPRK GDP estimates, agricultural harvest figures, trade volume, and population projections. |
| 8 | `kinu-human-rights-whitepaper` | 통일연구원 (KINU) | ko | 5 | 30 | Annual white papers (1996–2025/2026) with extensive statistical annexes on political prison camps (kwanliso), detention centers (kyohwaso), and execution cases. |
| 9 | `mou-nk-human-rights-report` | 통일부 북한인권기록센터 | ko | 5 | 3 | Official government reports based on 1,600+ verified defector testimonies documenting public trial sites, forced repatriation processing centers, and state surveillance. |
| 10 | `ngii-nk-spatial-platform` | 국토지리정보원 (NGII) | ko | 5 | 350+ | Official 1:25,000 and 1:50,000 digital topographic vector maps, satellite orthophotos, and road/rail network layers produced from South Korean national satellites. |

---

## 2. What Is Raw, Unexplored, and Worth Building First

English-speaking North Korea OSINT has largely relied on satellite imagery interpretation, Google Earth KML files, and translated state media. The primary Korean- and Japanese-language sources surveyed here contain massive structured data that has never been integrated into an interactive English-language platform.

### Priority 1: Unikorea NKMap Vector Gazetteer (304,598 Points)
* **The Finding:** The Ministry of Unification operates a web GIS portal (`nkinfo.unikorea.go.kr/NKMap/`) driven by a hidden backend REST endpoint:
  ```
  https://nkinfo.unikorea.go.kr/nkp/search/searchNKMapFastApi.do?q=*&page=1&size=100
  ```
* **Why it matters:** It returns 304,598 geocoded items with coordinates in Korea 2000 Central Belt (EPSG:5186), administrative address hierarchies, and industrial classifications. This includes 2,042 industrial factories, 1,669 railway stations, 752 non-ferrous mines, 364 coal mines, and 622 schools.
* **What to build:** Batch-convert the EPSG:5186 coordinates to WGS84 (EPSG:4326) using Transverse Mercator formulas verified in `docs/research/probes/korean_japanese/probe_nkmap_api.py`. Integrate these points into our MapLibre Atlas as an instant search layer, enabling users to click any factory or collective farm across all 9 provinces.

### Priority 2: Asia Press Underground Market Price & Hyperinflation Tracker
* **The Finding:** Jiro Ishimaru and the Asia Press Osaka network maintain undercover reporting partners inside Hyesan, Chongjin, Musan, and Pyongsong. They publish bi-weekly and monthly street prices for basic grains (rice, corn), meat (pork), fuel (diesel, gasoline), and black-market foreign currency exchange rates (USD/KPW and CNY/KPW).
* **Why it matters:** North Korea's official exchange rate (~100 KPW per USD) is fictional. Street rates exceed 15,000 to 20,000 KPW per USD. The rice-to-corn price ratio is the primary indicator of regional famine and rationing failure.
* **What to build:** An interactive North Korean Market Tracker page showing price charts over time and comparing purchasing power between border cities and Pyongyang.

### Priority 3: Coastal Abduction Geography (Soseikai & Cabinet Secretariat)
* **The Finding:** Soseikai (特定失踪者問題調査会) tracks 276 public case dossiers of suspected abductees, and the Cabinet Secretariat tracks the 17 recognized victims across 12 operations. Every single profile contains specific Japanese coastal points (prefecture, town, beach).
* **Why it matters:** In English literature, Japanese abductees are discussed as diplomatic talking points rather than an operational military/intelligence campaign. Mapping these locations reveals specific geographic clusters along the Sea of Japan coast (Niigata, Fukui, Ishikawa, Tottori, Akita) and radar blind spots exploited by DPRK infiltration craft.
* **What to build:** A dedicated map layer depicting the Japanese coastline, abduction dates, suspect identities (Sin Kwang-su, ICPO red notices), and maritime landing vectors.

### Priority 4: Defector Origin Choropleth Map
* **The Finding:** Data from the Ministry of Unification and Korea Hana Foundation proves that over 58% of all defectors in South Korea originate from North Hamgyong Province, ~16% from Ryanggang Province, and ~9% from South Hamgyong Province, while inland provinces (Jagang, North Pyongan) and southern provinces each account for under 2%.
* **Why it matters:** English media frequently treats defector testimony as representative of all North Korea. A choropleth map clarifies that our window into everyday life is primarily concentrated along the Tumen and Yalu river border cities (Hoeryong, Musan, Onsong, Hyesan).
* **What to build:** A county-level choropleth map on the site showing defector origin density.

### Priority 5: Chongryon (ウリハッキョ) Institutional Directory in Japan
* **The Finding:** Chongryon publishes an exact directory of all 60+ pro-Pyongyang ethnic Korean schools (ウリハッキョ) and 47 prefectural headquarters across Japan with postal codes and street addresses.
* **Why it matters:** This diaspora network served as the logistical base for the 1959–1984 Repatriation Project (sending 93,340 people from Niigata to Chongjin) and illicit technology transfers.
* **What to build:** A diaspora map layer in Japan displaying schools, Korea University in Kodaira, and historical departure points in Niigata Port.

---

## 3. Gaps Where No Data Exists

1. **Inland Defection Geography:** Defection data is heavily skewed toward border counties with Chinese mobile carrier coverage. Almost zero granular statistical data exists for provinces like Jagang, South Hwanghae, or Kangwon, where border escape is virtually impossible.
2. **Current Military Deployment Coordinates in South Korean Portals:** South Korean Ministry of Defense (국방부) and Joint Chiefs of Staff (합참) maintain detailed geocoded orders of battle for KPA corps and artillery along the DMZ, but these remain classified military secrets. Only top-level summaries appear in biennial Defense White Papers (국방백서).
3. **Real-Time Market Prices Outside Border Zones:** While Asia Press provides regular coverage for Hyesan, Chongjin, and Pyongsong, rural southern regions (Hwanghae crop belts) lack independent reporting pipelines.
4. **Zainichi Repatriation Fate Registers:** While departure statistics from Niigata Port (93,340 people) are well-documented by Niigata City and the Japan Red Cross, North Korea has never released complete internal relocation records or detention lists for returnees sent to Kwanliso camps (such as Camp 15 Yodok).

---

## 4. Legal, Ethical, and Safety Concerns

1. **Protecting Undercover Reporters and Informants:** Asia Press operates an undercover network inside North Korea using smuggled Chinese mobile phones. Never scrape, reverse-engineer, or attempt to unmask communication methods, SIM registration data, or specific transmission times that could endanger sources inside North Korea.
2. **Protecting Defectors' Families Remaining in North Korea:** Official defector survey microdata released by the South Korean government (such as the Korea Hana Foundation survey) is deliberately aggregated to provincial or broad demographic levels. When mapping defector accounts or testimony, never publish names, specific work units, or detailed escape routes that would allow the Ministry of State Security (보위부) to identify and punish family members remaining in the country.
3. **Japanese Abductee Privacy:** Specific missing persons records published by Soseikai (特定失踪者問題調査会) contain names, birth dates, and family narratives provided with consent to aid public investigation. When indexing these records, retain factual case details while respecting family privacy regarding ongoing police investigations.
4. **South Korean Spatial Information Security Laws:** South Korea's Act on the Establishment and Management of Spatial Data restricts the export of high-resolution domestic spatial data. However, data covering North Korean territory released by the Ministry of Unification (NKMap) and NGII under Open Government License Type 1 (공공누리 제1유형) is officially intended for public and research use.
