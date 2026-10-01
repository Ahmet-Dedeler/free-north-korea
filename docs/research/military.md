# Military, Nuclear & Missile Intelligence Research Report

> **Track ID**: `military`  
> **Repository Dataset**: `docs/research/military.json` (30 structured, verified sources)  
> **Probe Scripts**: `docs/research/probes/military/`  
> **Review Date**: 2026-10-01  

---

## 1. Executive Summary & Upstream Missile Data Assessment

### Nagix vs CNS Database vs Japan MOD & South Korea JCS (2025–2026 Launches)

A primary directive of this research track was auditing whether `nagix/nk-missile-tests` and the James Martin Center for Nonproliferation Studies (CNS) database are up to date against the Japan Ministry of Defense (防衛省) and South Korea Joint Chiefs of Staff (합참) announcements for 2025–2026.

```
                    ┌────────────────────────────┐
                    │  North Korean Missile Test │
                    │     (Launch detected)      │
                    └──────────────┬─────────────┘
                                   │ Radar telemetry (T+30m)
            ┌──────────────────────┴──────────────────────┐
            ▼                                             ▼
  ┌──────────────────────┐                      ┌──────────────────────┐
  │   Japan MOD (防衛省)  │                      │   ROK JCS (합참)     │
  │  Launch time (JST),  │                      │ Launch origin, count,│
  │  apogee, dist, EEZ   │                      │ azimuth, apogee      │
  └──────────┬───────────┘                      └──────────┬───────────┘
             │                                             │
             │ Same-day ingestion (preliminary figures)    │
             ▼                                             │
  ┌────────────────────────────────────────────────────────┴───┐
  │                 nagix/nk-missile-tests                     │
  │  • Updated within hours of launch (latest: 2026-09-20)     │
  │  • Captures tactical tests (KN-25 salvoes, Hwasong-11D)    │
  │  • 11 tests in 2025, 43 tests in 2026 (357 total)         │
  └────────────────────────────┬───────────────────────────────┘
                               │ Multi-month retrospective lag
                               ▼
  ┌────────────────────────────────────────────────────────────┐
  │              CNS / NTI Missile Test Database               │
  │  • Filtered threshold: Range >= 300 km, Payload >= 500 kg  │
  │  • Excludes tactical rocket artillery and cruise missiles  │
  │  • Authoritative technical telemetry, but lagging          │
  └────────────────────────────────────────────────────────────┘
```

#### Key Findings:
1. **`nagix/nk-missile-tests` is remarkably current and actively maintained**:
   - Upstream commit history confirms commits within hours of each event. Commit `94f591e` on `2026-09-20T12:39:00Z` added the two Wonsan launches that occurred earlier that afternoon.
   - The dataset contains **11 launches in 2025** and **43 launches in 2026** (a total of 357 launches from 1984 to September 20, 2026).
   - Our local repository file `public/data/test.en.json` already contains this full 2026 dataset up to the September 20 launches.
2. **CNS Database on NTI has a strict strategic filter and a reporting lag**:
   - The CNS/NTI database explicitly filters for missiles with a payload of at least 500 kg and range of at least 300 km. It intentionally omits tactical short-range systems like 600mm super-large multiple rocket launchers (KN-25) and cruise missiles (Hwasal-1/2), which make up a massive portion of recent 2025–2026 testing.
   - CNS updates quarterly or semi-annually, trailing real-time defense reporting by 2 to 6 months.
3. **Japan MOD and South Korea JCS provide the real-time ground truth**:
   - **Japan MOD** provides immediate JST launch times, estimated apogee, flight distance, and exact splashdown coordinates relative to Japan's Exclusive Economic Zone (EEZ).
   - **South Korea JCS** provides the launch origin facility (e.g. Sunan, Wonsan, Ryokpo, Chunghwa) and flight azimuth.
   - **Recommendation**: Continue using `nagix/nk-missile-tests` as our primary ingestion feed, but build an automated GitHub Action that scrapes MOD and JCS announcements to populate launch entries instantly upon alert, later backfilling weapon designations from KCNA photographs.

---

## 2. Top 10 Sources Ranked by Value

| Rank | Source ID | Name | Publisher | Format | Access | Value | Why It Matters for Our Site |
|:---:|:---|:---|:---|:---:|:---:|:---:|:---|
| **1** | `csis-beyond-parallel-missile-bases` | Undeclared Missile Operating Bases | CSIS Beyond Parallel | HTML | Scrape | **5/5** | High-precision decimal coordinates for ~15–20 undeclared Strategic Rocket Force bases (headquarters, drive-through checkout buildings, underground bunker portals). Completely missing from our current atlas. |
| **2** | `nagix-nk-missile-tests` | North Korea Missile Test Dataset | Akihiko Kusanagi (nagix) | JSON | Download | **5/5** | Powers our `/missiles` explorer. Ingests same-day Japan MOD/JCS telemetry; includes full 2025–2026 launches through September 2026. |
| **3** | `csis-beyond-parallel-provocations` | NK Provocations Database (1958–Present) | CSIS / Dan Stiles (mirror) | JSON/CSV | Download | **5/5** | 501 events updated daily via GitHub Actions. Covers missile tests, nuclear detonations, DMZ landmines, drone incursions, cyberattacks, and maritime clashes. |
| **4** | `access-dprk-bogle` | AccessDPRK Mapping Project | Jacob Bogle | KML/KMZ | Download | **5/5** | Over 60,000 geolocated points. Most complete spatial survey of airfields, naval berths, radar sites, SAM rings, and DMZ bunker networks. |
| **5** | `rusi-dprk-russia-maritime-transfers` | DPRK-Russia Munitions Transfers | RUSI OSINT Programme | HTML / Reports | Scrape | **5/5** | Satellite tracking of Russian cargo vessels (*Angara*, *Maria*) moving millions of artillery shells from Rajin to Dunai/Vostochny. Critical modern geopolitical tracking. |
| **6** | `kpa-corps-order-of-battle` | KPA Corps Headquarters & Order of Battle | ROK MND / namu.wiki | JSON / Wiki | Scrape | **5/5** | Command locations and operational sectors for all 13 KPA Corps (DMZ frontline corps, mechanized strike corps, 11th Storm Corps, Strategic Rocket Force). |
| **7** | `stimson-38-north-imagery` | 38 North Satellite Imagery Archive | Henry L. Stimson Center | HTML / RSS | Scrape | **5/5** | Longitudinal commercial satellite imagery analyzing operations at Yongbyon (ELWR, 5MWe reactor), Sohae launch pad, Sinpo shipyard, and Punggye-ri test tunnels. |
| **8** | `car-missile-wreckage-ukraine` | Field Forensics of DPRK Missiles in Ukraine | Conflict Armament Research | PDF / Web | Download | **5/5** | Physical component-level teardowns of recovered KN-23/KN-24 debris. Catalogs >290 foreign electronics, counterfeit microchips, and 2021–2024 manufacturing dates. |
| **9** | `kpaaf-airbases-dataset` | KPA Air Force Airbases & Underground Shelters | FAS / SpottingMode | HTML / JSON | Scrape | **5/5** | 78 military airfields with runway coordinates, mountain tunnel hangars, and fighter/bomber division assignments. |
| **10** | `openstreetmap-dprk-military` | OSM DPRK Military Polygons & Runways | OpenStreetMap / Overpass | GeoJSON | API | **5/5** | Direct, license-free vector polygons for airfields, runways, barracks, and military administrative boundaries ready for MapLibre rendering. |

---

## 3. Raw, Unexplored & High-Value Intel to Build First

### A. CSIS Undeclared Missile Operating Bases Layer

Our current atlas (`src/content/places.ts`) has only 29 generic locations and lacks the secret operating bases where North Korea stores and readies mobile ballistic missiles for launch. CSIS Beyond Parallel has systematically identified ~15–20 undeclared bases.

We have extracted and verified coordinates for the primary facilities:

| Base Name | Province | Type / Unit | Coordinates (Lat, Lon) | Key Features |
|:---|:---|:---|:---|:---|
| **Sinpung-dong** (신풍동) | North Pyongan | ICBM Brigade (Hwasong-15/-18) | `40.316252, 125.276505` | HQ, 2 drive-through checkout shelters (`40.327571, 125.297224`), 2 UGF entrances (`40.330859, 125.299040`). Published Aug 2025. |
| **Hoejung-ni** (회정리) | Chagang | ICBM Base (25 km from China) | `41.369883, 126.913631` | Deep underground drive-through facility (`41.384978, 126.906453`), large checkout facility. |
| **Yongnim** (용림) | Chagang | IRBM/ICBM Base | `40.483324, 126.501814` | High-altitude mountain valley, hardened bunkers, heavy TEL revetments. |
| **Yusang-ni** (유상리) | South Pyongan | ICBM Base (Hwasong-14/-15) | `39.449886, 126.259682` | Near Pyongyang; primary strategic first-strike facility, expanded motor pools. |
| **Sino-ri** (신오리) | North Pyongan | Nodong-1 MRBM Brigade HQ | `39.644929, 125.355288` | Historical Strategic Rocket Force headquarters; hardened vehicle sheds. |
| **Sakkanmol** (삭간몰) | North Hwanghae | Forward SRBM Base (Scud-B/C) | `38.584698, 126.107945` | Forward base 85 km north of DMZ targeting Seoul and US bases in South Korea. |
| **Kal-gol** (갈골) | North Hwanghae | SRBM / Nodong Base | `38.682288, 126.722600` | Mountainous valley forward base, hardened underground tunnels. |
| **Kumchon-ni** (금천리) | Kangwon | Nodong MRBM Base | `38.966111, 127.594722` | Eastern forward base targeting Tokyo and Japanese ports. |
| **Sangnam-ni** (상남리) | South Hamgyong | IRBM Base (Musudan/Hwasong-10) | `40.838977, 128.541650` | Isolated mountainous plateau facility. |
| **Yeongjeo-dong** (영저동) | Ryanggang | Hardened Underground Base | `41.401100, 126.903000` | Earliest known underground missile base, predecessor to Hoejung-ni. |

**Build Idea**: Add these bases to `src/content/places.ts` and create a dedicated "Missile Bases" filter in `/atlas` with detailed layout pins (HQ, checkout facility, underground portals).

---

### B. Korean People's Army (KPA) Frontline Order of Battle & DMZ Artillery

North Korea deploys roughly 70% of its ground combat power and artillery south of the Pyongyang-Wonsan line.

#### 1. KPA Corps Headquarters
- **1st Corps** (강원도 금강군, `38.6983, 127.9150`): Eastern DMZ frontline; covers Goseong/Sokcho axis.
- **2nd Corps** (황해북도 평산군/금천군, `38.3183, 126.4383`): Western DMZ frontline / Kaesong corridor; primary invasion route toward Seoul.
- **4th Corps** (황해도 해주, `38.0406, 125.7144`): West Sea NLL sector; controls coastal guns, Silkworm/Kumsong anti-ship batteries, and hovercraft bases.
- **5th Corps** (강원도 평강군, `38.4061, 127.2847`): Central DMZ frontline (Iron Triangle / Cheorwon corridor); highest concentration of 240mm MRLs.
- **11th Corps / Storm Corps** (평안남도 덕천, `39.7547, 126.0153`): Elite special operations command (~10,000–12,000 personnel); actively deployed in Kursk Oblast, Russia (2024–2026).
- **820th Tank Corps** (황해북도 사리원, `38.5078, 125.7544`): Armored breakout force (Pokpung-ho, Chonma-ho, M2024 tanks).
- **Strategic Rocket Force Command** (평안남도 성천 백원 / 평양 사동, `39.2483, 126.2167`): Operational command over all ballistic missile brigades and undeclared bases.

#### 2. Hardened Artillery Sites (HARTs) & DMZ Fortifications
- Over **800–1,000 hardened artillery caves** line the northern slopes of the DMZ, housing 170mm Koksan self-propelled guns (range ~60 km) and 240mm multiple rocket launchers (range ~65 km) capable of striking the Greater Seoul Metropolitan Area without leaving bunker protection.
- In mid-2026, satellite analysts identified **21 new elongated drive-through shelters** constructed south of Kaesong, roughly 50 km northwest of Seoul.

---

### C. Russia-DPRK Munitions Pipeline & Troop Deployment

The strategic partnership established in late 2023 between Pyongyang and Moscow created a massive military logistics corridor:

```
  ┌────────────────────────────────────────────────────────┐
  │                 NORTH KOREAN SOURCING                  │
  │ • Ryongsong Machine Complex (Feb 11 Plant, Hamhung)    │
  │ • Kanggye General Tractor Plant (Ammunition)           │
  └──────────────────────────┬─────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            │ Maritime Route                  │ Rail Route
            ▼                                 ▼
  ┌───────────────────────┐         ┌───────────────────────┐
  │ Rajin Port (Pier 1)   │         │ Tumangang Rail Yard   │
  │ Containers loaded     │         │ Cross-border trains   │
  └──────────┬────────────┘         └─────────┬─────────────┘
             │                                │
             │ Sea of Japan / East Sea        │ Khasan Bridge
             ▼                                ▼
  ┌───────────────────────┐         ┌───────────────────────┐
  │ Russian Naval Ports   │         │ Trans-Siberian Rail   │
  │ Dunai & Vostochny     │────────►│ 10,000 km transit     │
  └───────────────────────┘         └─────────┬─────────────┘
                                              │
                                              ▼
                                    ┌───────────────────────┐
                                    │ Forward Munitions Hub │
                                    │ Tikhoretsk (Krasnodar)│
                                    │ Mozdok (North Ossetia)│
                                    └─────────┬─────────────┘
                                              │
                                              ▼
                                    ┌───────────────────────┐
                                    │ Ukraine Frontline     │
                                    │ KN-23/KN-24 strikes   │
                                    │ 11th Corps in Kursk   │
                                    └───────────────────────┘
```

1. **Maritime Shuttle**:
   - Vessels: Russian cargo ships *Angara* (IMO 9179842), *Maria* (IMO 8517839), *Maia-1*, and *Lady R*.
   - Route: Regular dark voyages (AIS disabled) between Rajin (North Korea) and Dunai / Vostochny (Russia), moving over 2.5 million artillery rounds and dozens of ballistic missiles.
2. **Forensic Weapon Identification (Conflict Armament Research)**:
   - Physical wreckage of North Korean Hwasong-11A (KN-23) and Hwasong-11B (KN-24) SRBMs recovered in Kharkiv and Zaporizhzhia reveals over 290 components from Western and Asian electronic manufacturers, with production dates as recent as 2023–2024.
3. **Storm Corps Deployment (Kursk Oblast)**:
   - Approximately 10,000–12,000 soldiers of the KPA 11th Corps were deployed via Vladivostok/Sergeevka to Kursk Oblast, Russia, marking the first major overseas combat deployment of North Korean troops in half a century.

---

## 4. Data Gaps, Censorship & Technical Barriers

| Source / Entity | Technical Barrier | Workaround Strategy |
|:---|:---|:---|
| **Japan Ministry of Defense (`mod.go.jp`)** | Cloudflare Challenge (`cf-mitigated: challenge`) returning HTTP 403 to cURL/automated scripts. | Ingest via Japanese Wikipedia MediaWiki API, open RSS mirrors, or run lightweight Playwright/headless fetchers with real browser headers. |
| **South Korea Joint Chiefs of Staff (`jcs.mil.kr`)** | Server WAF / IP geo-filtering returning HTTP 400 Bad Request to foreign non-browser clients. | Ingest syndicated defense feeds from Yonhap News Agency and ROK government open data portals (`data.go.kr`). |
| **Nuclear Threat Initiative (`nti.org`)** | Cloudflare Challenge on articles and downloads. | Use Kaggle dataset mirrors, CNS academic papers, or cached nonproliferation.org archives. |
| **NKeconWatch / North Korea Uncovered** | Original website blocks automated spiders; KMZ download links broken on live site. | Download preserved V18 KMZ archive from Wayback Machine (`archive.org`) snapshots. |
| **Real-time Mobile TEL Positions** | North Korean road-mobile launchers (TELs) deploy to forested, unpaved locations; precise launch coords are never pre-announced. | Use radar launch origins reported by South Korea JCS to place launch events at nearest known launch facility. |

---

## 5. Legal, Safety & OPSEC Boundaries

1. **Zero Identification of Witnesses or Internal Persons**:
   - Under no circumstances should individual soldier names, defector identities, family locations in North Korea, or local informants be published.
   - All military intelligence compiled must be restricted to state-level facilities, unit designations, published satellite imagery, and weapon system parameters.
2. **Unclassified Open-Source Policy**:
   - All coordinates and telemetry in this track are derived strictly from publicly available commercial satellite imagery (Planet Labs, Maxar, Sentinel), academic research (CSIS, CNS, Stimson Center), declassified government statements (Japan MOD, ROK JCS, US DoD), and forensic field reports (CAR).
   - No classified materials or illicitly accessed networks are utilized.

---

## 6. Probe Scripts in `docs/research/probes/military/`

Five executable Python probe scripts have been developed and verified to support ongoing data ingestion:

1. `probe_nagix_vs_cns.py`: Inspects GitHub commits of `nagix/nk-missile-tests` and analyzes local launch bins in `public/data/test.en.json`. Confirms 357 launches across 23 years, including 11 in 2025 and 43 in 2026.
2. `probe_csis_bases.py`: Scrapes and extracts exact decimal coordinates, UGF portals, and checkout facility coordinates for CSIS Beyond Parallel undeclared missile operating bases.
3. `probe_csis_provocations.py`: Probes the automated mirror of CSIS's North Korea Provocations Database, validating 501 records from 1958 through September 30, 2026.
4. `probe_airbases_naval.py`: Compiles and verifies geographic coordinates and roles for 15 primary KPAAF airbases and 10 KPN naval/submarine facilities.
5. `probe_kpa_order_of_battle.py`: Compiles and validates coordinates, echelons, and tactical roles for all 13 KPA Corps Headquarters across the Korean peninsula.
6. `generate_military_json.py`: Validates all 30 sources against the 24 required JSON schema keys and exports the verified `docs/research/military.json`.
