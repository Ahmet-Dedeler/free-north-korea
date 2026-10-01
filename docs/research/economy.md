# Track Report: Economy, Trade, Sanctions & Infrastructure

Track ID: `economy`  
Scope: Markets (*jangmadang*), food and consumer commodity prices over time, bilateral trade, sanctions lists, UN Panel of Experts & MSMT reports, maritime sanctions evasion, crypto theft attribution (Lazarus Group), OpenStreetMap infrastructure (rail, power, mines, ports), mining sites, special economic zones, and the "Regional Development 20×10" (지방발전 20×10) factories.

---

## 1. Executive Summary

North Korea's economy operates on three divergent planes:
1. **The State Centrally Planned Economy**: State-owned enterprises, ration distribution (*baegup*), and the "Second Economy" (the military-industrial complex).
2. **The Grassroots Private Market Economy (*Jangmadang*)**: A nationwide network of over 436 officially sanctioned physical markets and thousands of informal alley stalls (*golmokjang*), where >70% of North Korean households source food, clothing, consumer goods, and foreign currency (RMB and USD).
3. **The Illicit External Sanctions-Evasion & Cyber Economy**: Coal and refined petroleum ship-to-ship (STS) smuggling, dark fishing fleet licensing, arms exports to Russia, overseas forced labor remittance, and state-sponsored cryptocurrency theft (Lazarus Group / TraderTraitor) generating hundreds of millions of dollars annually to fund weapons of mass destruction (WMD) programs.

While the regime treats economic data as state secrets, our track research revealed that open-source intelligence on North Korea's economy is **vastly more quantitative and programmatic than commonly assumed**. We verified open SQL backends containing exact geographic coordinates for 421 markets, live WordPress REST APIs publishing bi-weekly staple grain prices from inside North Korea, an OpenAPI-compliant sanctions-evasion database of 26,187 entities and 753 ships, an active successor monitoring API (the Multilateral Sanctions Monitoring Team, MSMT) formed after Russia's UN veto, daily updated OpenStreetMap spatial extracts, and a South Korean government database of 112 mineral extraction sites.

---

## 2. Top 10 Sources Ranked by Value

| Rank | Source ID | Name & Publisher | Format & Access | Records | Key Value for Map-First Site |
|:---:|:---|:---|:---:|:---:|:---|
| **1** | [`csis-beyond-parallel-markets`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **Beyond Parallel 436 Sanctioned Markets Database**<br>*(CSIS)* | `json-api` / `geojson`<br>(Carto SQL API) | 436 | **Highest geospatial value**: Live, open Carto SQL endpoint with 421 exact point geocodes, physical areas ($m^2$), vendor stall counts, distance to China border/Pyongyang, and municipal tax calculations. Ready for direct MapLibre rendering. |
| **2** | [`dailynk-market-indicators`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **Daily NK Bi-Weekly Market Price & Currency Indicators**<br>*(Daily NK)* | `json-api`<br>(WP-JSON API) | 450+ | **Ground-truth price lifeline**: Active bi-weekly field surveys (verified through October 2026) capturing rice, corn, fuel (gasoline/diesel), USD/KPW, and RMB/KPW prices across Pyongyang, Sinuiju, and Hyesan. Accessible via open WP REST API. |
| **3** | [`rusi-dprk-reports-database`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **RUSI / Korea Risk Group DPRK Reports Database**<br>*(RUSI & Korea Risk Group)* | `json-api`<br>(OpenAPI 3.1 REST) | 26,187 entities<br>(753 vessels) | **Master graph of sanctions evasion**: Complete structured compilation of UN Panel of Experts reports (2010–2023) detailing 753 vessels with IMO/MMSI numbers, 2,306 front companies, 2,090 persons, and 58,267 relationships with paragraph citations. |
| **4** | [`msmt-sanctions-monitoring-reports`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **Multilateral Sanctions Monitoring Team (MSMT) Portal**<br>*(11 Member States: US, ROK, JP, UK, FR, etc.)* | `json-api` / `pdf`<br>(REST API) | 14 publications | **Official successor to UN Panel of Experts**: Formed Oct 2024 to bypass Russia's UN veto. Modern REST API (`/api/post/list`) delivering unvarnished multilateral intelligence reports on Russia-DPRK arms transfers, crypto theft, and overseas labor (latest: Sept 16, 2026). |
| **5** | [`geofabrik-north-korea-osm`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **Geofabrik Daily North Korea OSM Extracts**<br>*(Geofabrik & OSM)* | `pbf` / `shp.zip`<br>(Download) | 85,000+ features | **Complete vector infrastructure**: Daily updated 88.1 MB OSM PBF extracts covering the entirety of North Korea's railway grid, train stations, electrical power plants, substations, ports, roads, and mining quarries, with historical daily snapshots back to 2015. |
| **6** | [`irenk-north-korea-mines`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **I-RENK North Korean Mines Database (북한지하자원넷)**<br>*(SONOSA & KOMIR)* | `html` / `tables`<br>(Scrape) | 112 mines | **Definitive mineral geography**: South Korean government registry detailing 112 major mines across DPRK, classified by metal, non-metal, and coal, listing administrative county locations, primary minerals (iron, zinc, magnesite, gold, tungsten), and regional mineral belts. |
| **7** | [`un-comtrade-china-dprk`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **UN Comtrade China-DPRK Bilateral Trade API**<br>*(United Nations Statistics Division)* | `json-api`<br>(REST API) | 15,000+ trade flows | **Macroeconomic mirror trade**: Free public preview API for Reporter 156 (China) and Partner 408 (DPRK) delivering annual and monthly trade values, net kilograms, and HS chapters for >95% of North Korea's legal foreign trade. |
| **8** | [`tayvano-lazarus-research`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **Tayvano / Lazarus & BlueNoroff Research Repository**<br>*(GitHub / Tayvano)* | `markdown` / `json`<br>(GitHub API) | 301 heists | **Tactical cyber theft ledger**: Curated repository cataloging 301 distinct DPRK state-sponsored cryptocurrency thefts from 2017 to 2026, containing exact victim timestamps, stolen amounts, malware IOCs (BeaverTail), and on-chain wallet addresses. |
| **9** | [`opensanctions-dprk-collection`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **OpenSanctions Unified DPRK Sanctions & Maritime Dataset**<br>*(OpenSanctions)* | `json-api`<br>(FollowTheMoney JSON-LD) | 3,500+ targets | **Multi-jurisdictional sanctions sync**: Daily harmonized feed cross-referencing UN 1718, US OFAC SDN, UK FCDO, EU FSD, and Japan MOF/METI designations into unified entities with aliases, IMO numbers, and corporate linkages. |
| **10** | [`regional-development-20x10-factories`](file:///Users/ahmet/Code/free-north-korea/docs/research/economy.json) | **Regional Development 20×10 Factory Tracker (지방발전 20×10)**<br>*(38 North, Daily NK & KCNA)* | `html` / `imagery`<br>(Scrape & OSINT) | 40 counties | **Contemporary economic campaign**: Tracks Kim Jong Un's 10-year policy (2024–2033) building modernized light industry and food processing factories across 20 designated counties per year, combining verified state announcements with before/after commercial satellite imagery. |

---

## 3. Raw, Unexplored & High-Leverage Data to Build First

### A. The Interactive Jangmadang Atlas (Immediate High-Impact Win)
- **Current State**: The CSIS Beyond Parallel 436 markets study from 2018 is famous, but locked in an obsolete Leaflet/Carto embed with clunky UI.
- **The Raw API**: We uncovered the underlying open Carto SQL API (`https://csis.carto.com/api/v2/sql?q=SELECT * FROM dprkmarkets_by_geocoordinates&api_key=xb32vxt3qQmJKxxxze77nw`).
- **What We Build**: Ingest the 421 geocoded point coordinates directly into MapLibre as an Atlas layer. Each point renders with market name (English and Chosongul), surface area ($m^2$), estimated vendor stalls, annual rent paid to municipal authorities, and distance to Pyongyang and the Chinese border. Overlay these points on high-resolution satellite imagery tiles so users can visually inspect the physical market halls and vendor roof grids.

### B. Live Staple Food & Foreign Exchange Price Dashboard
- **Current State**: Daily NK and Asia Press publish periodic field surveys, but they exist solely as narrative news articles with numbers buried inside paragraphs.
- **The Raw API**: Daily NK's WordPress REST API (`/english/wp-json/wp/v2/posts?search=market%20prices` and `/wp-json/wp/v2/posts?tags=797,984`) is open, fast, and structured.
- **What We Build**: A lightweight server-side scraper that parses bi-weekly price points for rice (쌀), corn (옥수수), gasoline (휘발유), diesel (경유), and exchange rates (USD/KPW, RMB/KPW) across Pyongyang, Sinuiju, and Hyesan. We can plot an interactive 10-year time series showing seasonal harvest troughs, sanctions shocks, the 2020 border closure, and the 2026 price spike to 70,000+ KPW per USD.

### C. Sanctions Evasion & Illicit Shipping Network Explorer
- **Current State**: Researchers rely on static 300-page UN Panel PDFs or paywalled NK Pro vessel trackers.
- **The Raw APIs**:
  - `dprk-reports.org` provides an OpenAPI 3.1 REST API with 753 ships, IMO numbers, and ship-to-ship (STS) transfer histories.
  - `msmt.info` provides the fresh 2025–2026 successor monitoring reports and press releases detailing maritime arms shipments to Russia and overseas worker networks.
  - US OFAC SDN XML provides 105 active named DPRK-linked merchant vessels with IMO and flag state history.
- **What We Build**: A dedicated maritime sanctions explorer linking known sanctioned vessels, their historical aliases, IMO numbers, flags of convenience (e.g. Sierra Leone, Belize, Palau, Cambodia), and known interdiction events.

### D. North Korea Mineral Resources & Mine Basin Map
- **Current State**: North Korea's vast mineral wealth (estimated in South Korea at trillions of dollars) is discussed vaguely in policy papers, while the public only knows of Musan (iron) and Komdok (lead/zinc).
- **The Raw Data**: South Korea's official I-RENK portal (`irenk.sonosa.or.kr`) documents 112 specific industrial mines with administrative county locations, primary minerals (metallic: 78, non-metallic: 14, coal: 20), and sub-deposits (rare earths, tungsten, molybdenum, magnesite).
- **What We Build**: Geocode these 112 mines into an interactive natural resources layer on our Atlas, allowing users to filter by commodity (e.g., uranium, rare earths, anthracite, lithium) and see which mining complexes are actively connected to the rail grid via OSM.

### E. The "Regional Development 20×10" (지방발전 20×10) Factory Tracker
- **Current State**: Kim Jong Un's signature economic policy of the 2020s is analyzed only in academic articles.
- **The Raw Data**: We have the verified 20 target counties for the 2024 cohort (Sukchon, Songchon, Kusong, Unsan, Kujang, Kyongsong, Orang, Kumya, Hamju, Usi, Tongsin, Yonthan, Unpha, Jaeryong, Unchon, Ichon, Kosan, Kim Hyong Jik, Onchon, Changphung) and emerging 2025 sites (Kangdong).
- **What We Build**: A dedicated progress tracker on our Atlas mapping the 20 counties each year, linking commercial satellite coordinates of the construction zones, and tracking whether the regime is fulfilling its 10-year rural industrialization promise.

---

## 4. Critical Data Gaps & Information Black Holes

1. **Domestic Inter-Provincial Commerce & Rail Freight**:
   Internal freight movements between provinces, road checkpoints (*109 Sangmu* inspections), and barter trade between state factories are completely absent from international data. We can map the physical rail network via OSM, but freight volume and rolling stock capacity remain obscure.
2. **The "Second Economy" (Military-Industrial Complex)**:
   The Second Economic Committee (제2경제위원회) controls military manufacturing, defense foreign trade, and strategic mineral extraction. Its budgets, revenue flows, and factory facilities are strictly partitioned from the civilian cabinet (내각) and do not appear in KOSIS or UN Comtrade data.
3. **Overland Russia-DPRK Ammunition Logistics**:
   Following the 2023-2024 Kim-Putin summits, massive arms shipments shifted from maritime vessels to the Tumangang-Khasan rail bridge crossing. While satellite analysts observe rail car counts, exact cargo manifests, pricing, and Russian energy/technology compensation remain opaque.
4. **Informal Street & Alley Markets (*Golmokjang*, *Kottjebi* markets)**:
   Beyond Parallel's 436 markets represent *officially sanctioned* municipal market facilities where stall rents are paid to the state. Spontaneous alley markets, pop-up evening markets (*ttattaegi*), and train station vendor clusters are dynamic, unmapped, and highly vulnerable to regime crackdowns.
5. **Private Capital Investors (*Donju*) Asset Holdings**:
   The emerging North Korean entrepreneurial class (*donju*, 돈주) finances real estate construction, private bus fleets, and mining ventures under the cover of state enterprise licenses (*myeongui-daeyeo*). There is no property registry or public corporate disclosure identifying these individuals.

---

## 5. Legal, Ethical & Operational Safety Considerations

> [!CAUTION]
> **Source Protection & Defector Safety**:
> Under no circumstances should individual witness testimonies, defector debrief identifiers, or granular informant location coordinates inside North Korea be published. Market reporters for Daily NK and Asia Press operate at extreme personal risk; detection by the Ministry of State Security (*Bowibu*) carries capital punishment or internment in political prison camps (*kwanliso*).
> 
> **Implementation Rule**: Aggregate all market prices strictly at the municipal level (Pyongyang, Sinuiju, Hyesan) and use published date ranges. Never attempt to attribute prices to a specific stall, phone transmission tower, or individual trader.

> [!WARNING]
> **Sanctions Compliance & Defamation Caution**:
> In tracking sanctions, clearly distinguish between **UN Security Council binding multilateral designations** (voted under Chapter VII), **sovereign legal designations** (US OFAC, UK FCDO, EU FSD, Japan MOF), and **OSINT analytical hypotheses** (C4ADS, independent vessel researchers). Misidentifying a commercial merchant vessel or corporate entity as "sanctioned" carries severe legal liability in maritime trade.

> [!NOTE]
> **Cryptocurrency Attribution Rigor**:
> Blockchain tracing involves heuristic clustering (common input ownership, change address analysis). We must label blockchain wallet addresses with clear attribution confidence tiers:
> - **Tier 1 (Official)**: Addresses explicitly listed in US Department of Justice indictments, FBI public advisories, or OFAC SDN designations.
> - **Tier 2 (Forensic Firm Consensus)**: Addresses verified across multiple independent on-chain analytics firms (Chainalysis, Elliptic, TRM Labs, ZachXBT).
> - **Tier 3 (Heuristic / Intermediate)**: Mixing contract addresses, hop addresses, or unconfirmed deposit addresses.

---

## 6. Probe Scripts Reference & Directory Structure

All verification probe scripts have been authored, validated, and preserved in [`docs/research/probes/economy/`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/):

- [`probe_beyond_parallel_markets.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_beyond_parallel_markets.py): Queries the CSIS Carto SQL API, verifies total record count (436), geocoded point count (421), and extracts sample coordinates and tax metrics.
- [`probe_dailynk_prices.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_dailynk_prices.py): Connects to Daily NK's English and Korean WordPress REST APIs, fetches recent posts, and extracts grain, fuel, and exchange rate prices down to October 2026.
- [`probe_dprk_reports_rusi.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_dprk_reports_rusi.py): Queries `dprk-reports.org` OpenAPI endpoints, verifying 26,187 entities, 753 vessels with IMO numbers, and sample sanctions evasion profiles.
- [`probe_msmt_api.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_msmt_api.py): Connects to the Multilateral Sanctions Monitoring Team (MSMT) REST API at `msmt.info`, listings reports and resolving attachment links (including the Sept 16, 2026 Overseas Labour report).
- [`probe_un_comtrade.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_un_comtrade.py): Queries the UN Comtrade Public Preview API for China (156) and DPRK (408), parsing top export chapters (HS 15 vegetable oils, HS 10 cereals) and trade flows.
- [`probe_un_sanctions.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_un_sanctions.py): Downloads and parses the live UN Security Council Consolidated Sanctions XML, filtering 80 individuals and 75 entities under the 1718 DPRK regime.
- [`probe_ofac_sdn.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_ofac_sdn.py): Validates the US OFAC SDN XML endpoint (29.18 MB, 544 DPRK entries, 105 named vessels) and checks the OpenSanctions mirror.
- [`probe_irenk_mines.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_irenk_mines.py): Scrapes the South Korean I-RENK mine database, verifying the 112 mine records, administrative locations, and primary/secondary mineral deposits.
- [`probe_geofabrik_osm.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_geofabrik_osm.py): Parses Geofabrik's North Korea OSM portal, verifying availability of daily PBF and Shapefile extracts and historical snapshots back to 2015.
- [`probe_lazarus_github.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/probes/economy/probe_lazarus_github.py): Queries Tayvano's GitHub repository, verifying 301 documented cyber heists, 13 incidents in 2026 alone, and on-chain wallet addresses.
