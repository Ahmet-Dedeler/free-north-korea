# Research Report: Human Rights & Detention Geography (Track: Camps)

## 1. Executive Summary

This research track investigated the complete geography of North Korea's penal and human rights violation apparatus:
- **Political Prison Camps (*Kwan-li-so*)**: Administered primarily by the Ministry of State Security (국가보위성, MSS), with Camp 18 administered by the Ministry of Social Security (사회안전성, MPS). These lifetime internment colonies operate under guilt-by-association (*yeonjwaje*). Four remain operational today (Camp 14 Kaechon, Camp 16 Hwasong, Camp 18 Kaechon/Bukchang, Camp 25 Chongjin), while Camp 15 (Yodok) was largely dismantled around 2019–2020 and Camp 22 (Hoeryong) was closed in 2012.
- **Correctional Facilities (*Kyo-hwa-so*)**: Administered by the MPS, these are numbered long-term forced labor prisons for common, economic, and political criminals sentenced to fixed or life terms (e.g. No. 1 Kaechon, No. 4 Kangdong, No. 11 Chungsan, No. 12 Chongori, No. 77 Danchon).
- **Detention & Holding Centres (*Jip-gyeol-so*)**: Provincial-level holding camps detaining individuals intercepted while traveling without domestic travel permits or refugees forcibly repatriated from China awaiting formal investigation and trial.
- **Labor Training Camps (*Rodong-danryeon-dae*)**: City- and county-level short-term forced labor camps (sentences up to 1 year) for ideological, economic, or social misdemeanors.
- **Pre-trial Detention Cells (*Kuryujang*) & Police Waiting Rooms (*Daekisil*)**: Interrogation holding cells located at every local MPS and MSS department and municipal sub-station (*bun-ju-so*).
- **Execution and Burial Sites**: Public and clandestine execution sites (riverbeds, hillsides, airfields, sports grounds) and mass burial grounds documented by defector testimonies.
- **Forced Repatriation Pipeline**: Chinese border detention centers (Tumen, Hunchun, Longjing, Dandong) through border crossing points into North Korean intake centers.

Through automated probe scripts in `docs/research/probes/camps/`, we investigated 28 primary sources across English, Korean (한국어), and Japanese (日本語), verifying active API endpoints, reverse-engineering hidden datasets, extracting geographic coordinates, and evaluating maintenance status.

---

## 2. Top 10 Sources Ranked by Value

| Rank | Source ID | Name | Publisher | Record Count | Format & Access | Value (1–5) | Key Contribution to Our Map |
|---|---|---|---|---|---|---|---|
| **1** | `nkdb-visual-atlas-locations` | **NKDB Visual Atlas: Geolocated Points** | NKDB | 419 | JSON API / SvelteKit devalue | **5** | 419 precise GPS coordinates covering detention facilities, MPS/MSS offices, execution grounds, and China repatriation sites. |
| **2** | `korea-future-nkpd-facilities` | **NKPD: Penal Facilities Database** | Korea Future (HURIDOCS) | 245 | JSON REST API (Uwazi) | **5** | 245 documented facilities across all 9 provinces; 103 with verified GPS coordinates and MPS/MSS organizational breakdown. |
| **3** | `nkdb-visual-atlas-incidents` | **NKDB Visual Atlas: Incidents Pool API** | NKDB | 3,636 | POST JSON API (`/api/posts/pool`) | **5** | 3,636 verified human rights violations linked by slug to specific locations, detailing rights violated, decade, and perpetrator body. |
| **4** | `hrnk-prison-camp-kml` | **HRNK Prison Camp Location Map** | HRNK | 24 | KML (Google My Maps) | **5** | Authoritative ground-truth coordinates and operational status (active vs closed) for 24 major Kwan-li-so and Kyo-hwa-so. |
| **5** | `hrnk-satellite-camp-reports` | **HRNK Satellite Imagery Report Series** | HRNK / Bermudez et al. | 14 reports | PDF tables & annotated plates | **5** | High-resolution satellite imagery chronologies (2003–2024), guard tower distributions, fence perimeters, and coal mine shafts. |
| **6** | `curtis-melvin-nk-uncovered` | **North Korea Uncovered KMZ** | Curtis Melvin (38 North) | 10,000+ | Google Earth KMZ | **5** | Complete camp boundary polygons, internal security perimeters, interrogation centers, and mining pits for major camps. |
| **7** | `tjwg-mapping-fate-of-dead` | **TJWG: Mapping the Fate of the Dead** | Transitional Justice Working Group | 365 sites | PDF GIS analysis | **4** | 318 public execution sites and 47 burial/cremation locations documented from 610 defector testimonies. |
| **8** | `kinu-white-paper-human-rights` | **KINU: White Paper on Human Rights** | Korea Institute for National Unification | 30 facilities | PDF tables & official monographs | **5** | Canonical South Korean research authority on active vs closed camp statuses (confirming closure of Camp 15 and 22). |
| **9** | `rok-mou-human-rights-report` | **ROK MOU North Korea Human Rights Report** | Ministry of Unification (북한인권기록센터) | 1,600+ testimonies | PDF / KOGL Type 1 | **5** | Official ROK government taxonomy of multi-tier detention facilities and recent Kim Jong-un era legal crackdowns. |
| **10** | `wikipedia-dprk-concentration-camps` | **Wikipedia / Wikidata DPRK Camp Gazetteer** | Wikimedia Foundation | 23 articles | MediaWiki API / SPARQL | **4** | Universal baseline encyclopedic reference; 11 camps geocoded, revealing 12 camps missing coordinates that our site can resolve. |

---

## 3. What is Raw, Unexplored & Worth Building First

### A. The NKDB Visual Atlas Reverse-Engineering Breakthrough
The prompt noted that `visualatlas.org` has a `POST /en/api/posts/pool` JSON API. Our probes revealed several critical insights:
1. **API Protocol**: Direct POST requests to `/en/api/posts/pool` require a payload shaped as `{"keys": ["incidents"], "creatable": false, "admin": false}` or `{"keys": ["glossary"], ...}`.
   - Requesting `glossary` returns 770 terminology records with legal and historical definitions.
   - Requesting `incidents` returns **3,636 documented human rights violations** with victim harm narratives, perpetrator body, decade, and location references.
2. **Hidden Geographic Layer**: Case data itself references taxonomy slugs (e.g. `pyeongannamdo-jeungsangun-jibgyeolso-cujeong`), but the actual geographic coordinates are serialized inside SvelteKit's `/en/density/__data.json`.
3. **Extraction**: Our probe script (`extract_visualatlas_locations.py`) successfully deserialized the devalue payload, extracting **419 unique locations with exact latitudes and longitudes**, facility labels, confirmation status ("Unconfirmed" vs confirmed), and incident density counts.
4. **Content Breakdown**:
   - 62 Prisons / Concentration Camps (*Kwanliso* / *Kyohwaso*)
   - 52 Ministry of Social Security (*MPS / Boanseo*) police facilities
   - 44 Ministry of State Security (*MSS / Bowibu*) secret police branches
   - 17 Holding Camps (*Jip-gyeol-so*)
   - 11 Chinese Border Detention Facilities (e.g. Hunchun, Longjing, Tumen)
   - 62 Witness/Victim residence checkpoints and 171 other security/execution sites.

### B. Korea Future's North Korean Prison Database (NKPD)
The prompt referenced `nkpd.org`, but our DNS and network probe revealed that `nkpd.org` was an abandoned landing page, whereas the real active platform is hosted at **`https://nkpd.io`**, built by **Korea Future** using the open-source **Uwazi** platform (developed by HURIDOCS).
- Querying `https://nkpd.io/api/search?types=["5ffd3802a52dd767e173941b"]&limit=300` returned **245 documented penal facilities**.
- **103 facilities contain precise GPS coordinates (`lat`, `lon`)**, administrative province, managing agency (MPS vs MSS), and facility category (Daekisil, Jipkyolso, Kuryujang, Rodong Kyoyangdae/Danryondae).
- Korea Future also host interactive **3D spatial architectural reconstructions** of Onsong County MPS Detention Centre and North Hamgyong MPS Holding Centre.

### C. Resolving Wikipedia's Coordinate Gaps
Our MediaWiki probe (`probe_wikipedia_coords.py`) examined all 23 articles in `Category:Concentration_camps_in_North_Korea`.
- **11 have coordinates**: Camp 14, Camp 15, Camp 16, Camp 18, Camp 22, Camp 25, Kyohwaso 1 (Kaechon), Kyohwaso 4 (Kangdong), Kyohwaso 12 (Chongori), Kyohwaso 3 (Sinuiju).
- **12 are missing coordinates**: Chungsan (Kyohwaso 11), Hamhung (Kyohwaso 9), Kanggye (Kyohwaso 7), Onsong (Camp 12), Oro (Kyohwaso 22), Ryongdam (Kyohwaso 8), Sariwon (Kyohwaso 6), Sunghori (Camp 49), Taehung, Tanchon (Kyohwaso 77), Tongrim (Kyohwaso 2), Wonsan (Kyohwaso 88).
- **Immediate Rebuild Value**: Every single one of these 12 missing facilities is geocoded in our HRNK KML and NKPD datasets. We can immediately display them on our map and upstream the coordinates to Wikidata.

### D. Proposed Multi-Layer Rebuild Architecture
For our Next.js `/atlas` map, we should build a dedicated **"Detention & Human Rights"** filter group with 5 distinct toggle layers:
1. **Tier 1: Kwan-li-so (Political Prison Camps)**: Polygons from Curtis Melvin's KML and HRNK reports, with operational status badges:
   - *Operational*: Camp 14 (Kaechon), Camp 16 (Hwasong), Camp 18 (Bukchang), Camp 25 (Chongjin).
   - *Closed / Repurposed*: Camp 15 (Yodok, dismantled ~2020), Camp 22 (Hoeryong, closed 2012).
2. **Tier 2: Kyo-hwa-so (Correctional Prisons / Reeducation Camps)**: Point markers for all numbered labor prisons (No. 1 to No. 88) with managing department and primary forced labor industry (coal mining, textile manufacturing, cement production).
3. **Tier 3: Jip-gyeol-so & Rodong-danryeon-dae (Holding & Labor Training Camps)**: The 103 geocoded facilities from NKPD and 17 holding camps from Visual Atlas.
4. **Tier 4: Execution & Burial Sites**: County-level heatmaps and cluster points based on TJWG's 318 public execution sites, contextualized by Kim Jong-un era policy shifts.
5. **Tier 5: The Escape & Repatriation Pipeline**: Chinese detention and border handover points (Tumen, Dandong, Hunchun, Nanping) connected by directional vector arcs to North Korean border intake centers in Sinuiju, Onsong, Musan, and Hoeryong.

---

## 4. Gaps Where No Data Exists

1. **Small-Scale Municipal Detention (*Daekisil*) Outside Border Provinces**:
   - Both NKDB and Korea Future datasets exhibit a strong geographical concentration in North Hamgyong and Ryanggang provinces because the vast majority of defectors who escape across the Tumen/Yalu rivers originate from border areas.
   - Municipal waiting rooms and labor training centers in South Hwanghae, Kangwon, and interior Chagang province remain under-documented.
2. **Real-Time Internal Camp Populations**:
   - Total Kwanliso population estimates range between 80,000 and 120,000, but camp-specific prisoner headcounts have not been directly updated since defector guards and former prisoners who escaped prior to 2018.
3. **COVID-19 Quarantine Detention Camps**:
   - Daily NK and Asia Press reported that the regime built temporary, high-mortality quarantine isolation holding camps along the northern border during 2020–2023. These temporary facilities lack confirmed satellite boundary polygons.
4. **Precise Boundary Polygons for Minor Kyohwaso**:
   - While major camps (Camp 14, 15, 16, 25) have extensive satellite perimeter polygons traced by HRNK and Curtis Melvin, smaller Kyohwaso (such as No. 7 Kanggye, No. 8 Yongdam, No. 22 Oro) only have single centroid coordinates.

---

## 5. Legal, Safety & Ethical Concerns

1. **Witness and Survivor Anonymity**:
   - **Absolute Requirement**: Under no circumstances should our database publish identifiable personal details, survivor real names, or current living arrangements of witnesses and escapees.
   - When importing records from NKDB or Korea Future, use only anonymized case IDs (e.g. `E10-I-3834`, `warkjhkzbguac26boh3ja7rg`) or public legal case numbers.
   - NKDB Visual Atlas explicitly categorizes 62 points as "The victim's house" (e.g. `hamgyeongbugdo-onseonggun-pihaejayi-jib-cujeong`). These points represent approximate village coordinates from defector testimony; they should be grouped under generic neighborhood markers without linking to named families to prevent retribution against relatives remaining in North Korea.
2. **Preserving Forensic Integrity of Execution and Burial Sites (TJWG Protocol)**:
   - TJWG intentionally withholds precise GPS coordinates of mass burial sites and execution grounds from public digital downloads. If exact GPS pins for unexcavated mass graves are published online, the DPRK regime has a track record of exhuming human remains, destroying evidence, or redeveloping sites into agricultural terraces before international forensic accountability mechanisms can inspect them.
   - **Our Implementation Rule**: Aggregate execution and burial sites to the county/district level (*gun* / *si*) or display them as density clusters rather than pinpoint meters.
3. **Data Verification & Dual-Sourcing**:
   - North Korean facility numbering changes periodically (e.g. Camp 18 being transferred between MSS and MPS; Camp 22 merging with Camp 12 before closure; Camp 77 versus Camp 22 designations in Danchon/Oro).
   - Our database must clearly distinguish **Confirmed** (satellite-verified + multiple defector testimonies) from **Unconfirmed Probable** facilities.

---

## 6. Probe Scripts and Verifications Reference

All probe scripts and extracted datasets are maintained in `docs/research/probes/camps/`:
- `probe_visualatlas_deep.mjs`: Tests `/en/api/posts/pool` API keys and records all SPA network calls.
- `probe_visualatlas_datajson.mjs` & `probe_save_datajson.mjs`: Fetches SvelteKit data payloads for `/en/density`, `/en/theme`, `/en/forced-repatriation`, `/en/incidents`.
- `extract_visualatlas_locations.py`: Deserializes devalue payloads into clean JSON (`visualatlas_parsed_locations.json`, 419 records).
- `probe_nkpd_api.mjs`: Queries Uwazi REST API on `nkpd.io`, extracting 245 facilities (`nkpd_facilities.json`, 103 with GPS).
- `hrnk_camps.kml`: Extracted from HRNK Google My Maps (24 camps with GPS).
- `probe_wikipedia_coords.py`: Queries MediaWiki API for 23 concentration camp articles (`wikipedia_camp_coordinates.json`).
- `generate_camps_json.py`: Compiles and validates `docs/research/camps.json` with 28 structured records.
