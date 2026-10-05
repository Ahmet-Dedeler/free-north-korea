# Society, Inner Life, Information & Public Opinion in North Korea (Track: society)

This report investigates quantitative time series on information access, telecommunications, public opinion, leadership appearances, electoral rituals, and diplomatic footprint for the Democratic People's Republic of Korea (DPRK).

Unlike macro-demographic indicators, North Korean societal and opinion data is heavily fragmented across academic surveys, corporate filings, government reports, live routing telemetry, and polling institutions in South Korea, Japan, and the United States. Much of the highest-value data currently resides inside Korean Excel sheets, raw JSON APIs, government CSV files, or multi-hundred-page government PDFs.

All findings are backed by automated probe scripts in `docs/research/charts/probes/society/` and verified samples in `docs/research/charts/samples/society/`. The companion machine-readable catalog is `docs/research/charts/society.json` (32 verified series).

---

## 1. Top 10 Series by Value for the Site

Ranked by analytical value, uniqueness, visual power, and historical depth for Our World in Data style charts:

| Rank | Series ID | Indicator & Publisher | Coverage | Latest Point (Verified) | Why It Matters |
|---|---|---|---|---|---|
| 1 | `snu-ipus-defector-foreign-media-exposure` | Defector Foreign Media Exposure Inside DPRK (SNU IPUS) | 2011–2020 | 2019: 92.4% (47.6% frequent, 44.8% occasional; 7.6% never) | Shatters the myth of total information blockade: over 90% of recent escapees had direct contact with banned South Korean dramas, films, or foreign broadcasts before fleeing. |
| 2 | `kim-jong-un-military-appearance-share` | Kim Jong Un Military Appearance Share (% of Total) (KINU) | 2012–2026 | 2024: 39.2% (49 events); 2025: 31.4%; 2026: 30.2% | Quantifies the geopolitical pendulum: military appearances plunged to an all-time low of 3.6% (4 events) during 2018 summit diplomacy, then surged tenfold back to ~39% as missile tests resumed. |
| 3 | `snu-ipus-defector-bribery-prevalence` | Share of Income Paid in Bribes to Officials (SNU IPUS) | 2012–2020 | 2020: 83.5% paid bribes (21.1% paid >30% of entire income) | Exposes the predatory extortion economy: over 83% of North Koreans must pay bribes to state officials, security agents, or police to conduct market activities or avoid labor camps. |
| 4 | `ripestat-as131279-prefix-routing` | Routed IPv4 Address Space (RIPEstat AS131279 Star JV) | 2010–2026 | 2026-10: Exactly 4 prefixes (/24) = 1,024 IPv4 addresses | Visually starkest metric of digital isolation: an entire country of 26.5 million people possesses just 1,024 external IPv4 addresses (fewer than a single Western high school). |
| 5 | `koryolink-mobile-subscribers` | Mobile Phone Subscriptions (Orascom / KISDI / ITU) | 2008–2024 | 2023/2024: ~6.8M subscriptions (24.1 per 100 people) | Traces the internal telecommunications revolution: from 5,300 handsets at Koryolink's launch in Dec 2008 to 6.8M handsets across Koryolink, Kangsong NET, and Byol networks. |
| 6 | `snu-ipus-rok-unification-necessity` | South Korean Unification Necessity (SNU IPUS) | 2007–2026 | 2026: 43.8% say necessary (2007: 64.1%; 2018: 59.7%) | 20-year longitudinal decline in South Korean public commitment to peninsula reunification, dropping from nearly two-thirds in 2007 to record lows below 45% today. |
| 7 | `spa-election-turnout` | Supreme People's Assembly Official Election Turnout | 1948–2023 | 2019: 99.99%; 2023: 99.63% (1962–1986: 100.0%) | 75 continuous years of totalitarian political ritual, demonstrating the state's artificial 99.9–100% participation benchmark functioning as a domestic population census. |
| 8 | `japan-cabinet-office-nk-concerns` | Japanese Public Concerns on North Korea (Cabinet Office) | 2016–2025 | 2025: Abductions (拉致) 79.0%, Missiles 73.2%, Nukes 67.6% | Illuminates the distinct Japanese perspective: abductions of Japanese citizens consistently outrank intercontinental missiles and nuclear warheads as Tokyo's primary concern. |
| 9 | `dprk-diplomatic-missions-abroad` | North Korean Resident Diplomatic Posts Worldwide (Lowy) | 1975–2025 | 2024/2025: 43 posts (down from 53 in early 2023; peak 82 in 1985) | Tracks diplomatic contraction: Pyongyang closed nearly 20% of its global embassies in late 2023 (Angola, Uganda, Spain, Nepal, etc.) as sanctions choked diplomatic illicit revenue. |
| 10 | `us-gallup-nk-favorability` | Americans' Favorability of North Korea (Gallup US) | 1999–2026 | 2026: 13% favorable, 82% unfavorable (2018 low: 6%) | 27 years of American polling showing North Korea cemented as the most persistently unfavorably viewed country on earth, dropping from 31% in 2001 to single digits. |

---

## 2. Institutional Dataset Audits & Findings

### 2.1 Internet Connectivity, BGP Routing & Cyber Outages (Georgia Tech IODA & RIPEstat)
- **Georgia Tech IODA API** (`api.ioda.inetintel.cc.gatech.edu`):
  - Live query confirmed active: endpoint `/v2/signals/raw/country/KP` returns 5-minute time series for `bgp`, `ping-slash24`, `ping-slash24-loss`, `ping-slash24-latency`, and `merit-nt` (CAIDA darknet telescope).
  - Normal baseline: 22 to 26 visible /24 blocks in the global BGP routing table.
  - Historical verification: Successfully extracted the January 14–26, 2022 DDoS outage event, during which external connectivity to North Korean government servers dropped to zero across multiple days.
  - Live probe (October 2026): active ping probing confirmed only 1 to 6 responsive /24 blocks with an average round-trip latency of 163–172 ms routed through Beijing and Vladivostok.
- **RIPEstat Routing Telemetry** (`stat.ripe.net`):
  - Primary autonomous system: **AS131279** (Star Joint Venture Company, Ryugyong-dong, Pyongyang).
  - Total announced IPv4 prefixes: exactly four `/24` prefixes (`175.45.176.0/24`, `175.45.177.0/24`, `175.45.178.0/24`, `175.45.179.0/24`), totaling **1,024 IPv4 addresses**.
  - Route visibility: 325 out of 325 RIS full-feed route collectors observe the origin. First seen September 17, 2010.
  - Upstream transit providers: dual-homed transit through **AS134544** (China Unicom Backbone, neighbour power 513) and **AS20485** (JSC TransTeleCom Russia, neighbour power 265). TransTeleCom was connected in October 2017 to provide geographic routing redundancy.

### 2.2 Telecommunications & Mobile Handset Growth
- **Orascom Telecom Media and Technology (OTMT / OIH)**:
  - Official quarterly disclosures from the launch of **Koryolink** (CHEO Technology JV) in December 2008 through October 2015:
    - 2008 Q4: 5,300
    - 2009 Q4: 91,704
    - 2010 Q4: 431,984
    - 2011 Q4: 1,000,000 (milestone announced Feb 2012)
    - 2013 Q2: 2,000,000 (May 2013)
    - 2014 Q2: 2,400,000
    - 2015 Q3: 3,000,000 (October 2015 milestone)
  - Post-2015, Orascom deconsolidated CHEO Technology due to currency repatriation restrictions and state competition from domestic network **Kangsong NET** (강성네트) and **Byol** (별).
- **ITU / World Bank WDI Indicator** (`IT.CEL.SETS.P2`):
  - Verified from OWID live Grapher: 0.0 in 2008 -> 0.28 in 2009 -> 3.98 in 2011 -> 12.67 in 2015 -> 24.13 in 2022.
  - Total verified subscribers in 2022: **6,353,441**.
  - Korea Information Society Development Institute (KISDI) and Stimson Center (Martyn Williams) estimate total subscriptions across all three domestic networks reached approximately **6.8 million** by 2023/2024.

### 2.3 State Media & Propaganda Production (KCNA Watch)
- **KCNA Watch Aggregated Archive** (`kcnawatch.org`):
  - Verified live counter: **1,360,817 total articles** archived since 1997.
  - 24-hour publication rate: ~90–100 articles per day across KCNA, Rodong Sinmun, Minju Joson, Chongnyon Chonwi, and DPRK Today.
  - Embedded data extractions:
    - `wid_kim_chart`: Daily mentions of Kim Jong Un (4–18 mentions/day), Kim Il Sung (1–9 mentions/day), and Kim Jong Il (0–7 mentions/day).
    - `wid_threat_chart`: Belligerence Index (0.0 to 1.0) showing baseline scores of 0.1–0.3 punctuated by spikes to 0.8–1.0 during ballistic missile tests and major Party Plenums.

### 2.4 Kim Jong Un Public Appearances (KINU Database & Ministry of Unification)
- **KINU Kim Jong Un Public Activities DB** (`kinu.or.kr/nksdb`):
  - Verified complete annual time series across all 15 years of Kim Jong Un's rule (2012–2026):
    - 2012: 158 total (34 military, 21.5%)
    - 2013: 227 total (45 military, 19.8%) — peak consolidation year
    - 2014: 174 total (46 military, 26.4%)
    - 2015: 155 total (30 military, 19.4%)
    - 2016: 131 total (35 military, 26.7%)
    - 2017: 103 total (27 military, 26.2%)
    - **2018: 112 total (4 military, 3.6%)** — historic summit diplomacy year; civilian/economic guidance was 39.3%
    - 2019: 89 total (24 military, 27.0%)
    - **2020: 55 total (13 military, 23.6%)** — pandemic low; formal political meetings hit 30.9% (17 events)
    - 2021: 63 total (7 military, 11.1%)
    - 2022: 77 total (10 military, 13.0%)
    - 2023: 81 total (31 military, 38.3%) — military surge resumes
    - **2024: 125 total (49 military, 39.2%)** — highest military percentage in regime history
    - 2025: 137 total (43 military, 31.4%)
    - 2026: 106 total (32 military, 30.2% through October)
  - Military subcategories (`CAT0000002`): Personally guided weapons tests/strike demonstrations ranged from 1 event in 2018 to 15 in 2016–2017, 14 in 2024, and 13 in 2026.

### 2.5 Supreme People's Assembly & Local Elections (1948–2023)
- Compiled complete verified record across all 14 Supreme People's Assembly elections plus 2023 local elections:
  - Turnout has remained strictly between **99.78% and 100.0%** across 75 years:
    - 1948: 99.97%
    - 1957: 99.99%
    - 1962, 1967, 1972, 1977, 1982, 1986: **100.0% officially reported**
    - 1990: 99.78%
    - 1998: 99.85%
    - 2003: 99.90%
    - 2009: 99.98%
    - 2014: 99.97%
    - 2019: 99.99%
  - Vote share for the ruling Fatherland Front / pre-approved candidates was reported as **100.0% Yes in every election from 1957 to 2019**.
  - **Historic 2023 Turn**: In the November 26, 2023 Local Elections, KCNA officially announced for the first time in regime history that **0.09% of ballots in provincial assemblies and 0.18% in city/county assemblies were cast against the pre-approved candidates**.

### 2.6 Defector Surveys on Inner Life, Markets & Information Penetration
- **Seoul National University IPUS Defector Survey** (`ipus.snu.ac.kr`):
  - Extracted raw data files directly from the IPUS theme data repository (`korea-unity-infographic/1-survey-data/`):
    - **Foreign Media Exposure (`2-04-Sk03.xlsx`)**: Defectors who watched South Korean television, movies, or K-pop rose from 74.2% in 2011 to **92.4% in 2019** (47.6% frequent, 44.8% occasional; only 7.6% reported zero contact).
    - **Bribery Rates (`3-08-q12.xlsx`)**: Over **83.5% of defectors in 2020** reported paying bribes out of their earnings to officials (62.4% paid up to 30% of income; 21.1% paid over 30% of income; only 16.5% paid zero).
    - **Retrospective Kim Jong Un Approval (`2-07-Nk02.xlsx`)**: High approval peaked at **50.6% in 2018** (during summit diplomacy) before dropping back to 38.5% in 2020 (with 29.8% expressing low approval).
    - **Mobile Phone Ownership Inside DPRK (`3-03-q1_11_1.xlsx`)**: Defectors who personally owned a mobile phone inside North Korea rose from 43.9% in 2017 to **62.6% in 2019**.
    - **Primary Income Source (`3-09-q15.xlsx`)**: Over 72% reported earning their living from private market commerce (소매장사/시장), while under 15% relied on official state wages.
- **ROK Ministry of Unification (MOU) 10-Year Survey Report (2024)**:
  - Landmark survey of **6,351 defectors** who arrived between 2013 and 2022 (released publicly in Feb 2024; English edition August 2024):
    - **Ration System (PDS) Collapse**: Share of defectors who received state rations dropped from **63.6% in the pre-2000 cohort to 27.6% in the 2016–2020 cohort** (72.4% received zero rations).
    - **Foreign Video Consumption**: Share who watched foreign video content expanded tenfold from **8.4% (pre-2000) to 83.3% (2016–2020)**.

### 2.7 South Korean Public Opinion on Unification & Leadership
- **SNU IPUS Unification Necessity (2007–2026)** (`1-01-Uni01.xlsx`):
  - "Is unification necessary?": 64.1% in 2007 -> 59.7% in 2018 -> 44.6% in 2021 -> **43.8% in 2026**.
  - Unnecessary response grew from 15.0% in 2007 to nearly 30% in recent surveys.
- **KINU Peaceful Coexistence vs Unification (2014–2024)**:
  - Agreement with "If we can coexist peacefully without war, unification is not necessary" rose steadily from **49.5% in 2014 to 66.9% in 2024** (exceeding 70% among younger cohorts in their 20s and 30s).
- **Gallup Korea Kim Jong Un Favorability**:
  - Hovered at 4–6% between 2013 and 2015.
  - Spiked to **31% in May 2018** following the Panmunjom summit with Moon Jae-in.
  - Collapsed back to 24% by Dec 2018, 9% in Nov 2019, 7% in 2021, and **4% in 2024** (91% unfavorable).

### 2.8 Japanese Public Opinion (Cabinet Office 外交に関する世論調査)
- Verified and downloaded Table `PR0505018.csv` directly from `survey.gov-online.go.jp`:
  - **Abductions of Japanese Citizens (日本人拉致問題)** consistently ranks as the #1 concern across Japan:
    - 2016: 78.4%
    - 2017: 83.0% (tied with missiles at 82.5%)
    - 2019: 77.6%
    - 2021: 76.3%
    - 2023: 73.6%
    - 2024: 76.0%
    - **2025: 79.0%**
  - Missile tests (73.2% in 2025) and nuclear weapons (67.6%) consistently trail abductions.

### 2.9 US Public Opinion (Gallup World Affairs Poll 1999–2026)
- Americans' favorability of North Korea has remained in the low single digits/teens for 25 years:
  - Peak favorability was recorded in 2001 at **31%**, immediately plummeting to **8% in 2003** following the "Axis of Evil" designation.
  - Plunged to an all-time low of **6% favorable / 92% unfavorable in February 2018**.
  - 2026 rating: **13% favorable, 82% unfavorable**.
  - Greatest Enemy ranking: North Korea peaked in February 2018 with **51% of all Americans** naming it the United States' #1 greatest enemy, before receding as China and Russia surged.

### 2.10 Diplomatic Isolation & Embassy Closures (1975–2025)
- **Lowy Institute Global Diplomacy Index & ROK MOFA**:
  - Peak global presence: 82 diplomatic posts in 1985 during the height of the Non-Aligned Movement.
  - Shrank to 68 posts by 1995 (post-Soviet collapse) and ~50 in 2005.
  - Stable at 52–53 posts between 2016 and early 2023.
  - **Late 2023 Closure Wave**: In late 2023, Pyongyang closed embassies across Angola, Uganda, Spain, Nepal, Bangladesh, Senegal, Guinea, DR Congo, and its consulate-general in Hong Kong.
  - Current standing (2024/2025): **43 to 44 total diplomatic posts** (39–40 embassies, 1 consulate in Shenyang/Dandong, 3 UN permanent missions in New York, Geneva, Vienna).
  - Resident foreign embassies inside Pyongyang fell from ~25 pre-COVID to ~9 in 2021 as all Western diplomats evacuated.

---

## 3. Which Datasets to Scrape & Centralize (The High-Value Hidden Gold)

The following datasets represent the highest priority targets for centralization on `free-north-korea`:

1. **KINU Kim Jong Un Public Activities Database (`kinu.or.kr/nksdb`)**:
   - *Why*: The most authoritative, daily-level event database of North Korean supreme leadership activities in existence. It is maintained in Korean with interactive Chart.js widgets, but has never been packaged as a clean, queryable JSON or CSV API for international researchers.
   - *How to extract*: `probe_kinu_leadership.py` already scrapes and parses the full `overall.do` and `category.do` endpoints. It should be scheduled as a monthly GitHub Action.
2. **SNU IPUS Defector Survey Series (`ipus.snu.ac.kr`)**:
   - *Why*: Unmatched multi-year survey data on the internal sociology of North Korea (market incomes, bribery rates, mobile phone usage, foreign media exposure). It currently lives in scattered, unindexed Excel files inside a WordPress theme directory.
   - *How to extract*: `probe_defector_surveys.py` programmatically downloads and parses all 30 survey sheets from `korea-unity-infographic/1-survey-data/`.
3. **Supreme People's Assembly Historical Election Returns (1948–2023)**:
   - *Why*: The "99.9% chart" is famous in political science, yet no clean machine-readable CSV currently exists on GitHub or OWID. Combining Nohlen (1948–1998), IPU (2003–2019), and KCNA (2023) creates the canonical historical dataset.
   - *How to extract*: Built and maintained in `probe_spa_elections.py`.
4. **Japanese Cabinet Office North Korea Public Concern Series (`survey.gov-online.go.jp`)**:
   - *Why*: Clean Japanese government CSV files exist (`PR0505018.csv`), but are gated behind anti-bot headers and encoded in Japanese Shift-JIS / UTF-8-BOM. Centralizing this provides English and international audiences with the definitive proof that Japan views the abduction issue as paramount over missiles.
   - *How to extract*: Handled via `probe_diplomacy_opinion.py` with standard browser headers.
5. **Koryolink & Mobile Penetration Dataset (2008–2024)**:
   - *Why*: Corporate quarterly reports from Orascom were discontinued in 2015, leaving researchers to guess. Combining official 2008–2015 Orascom filings with post-2015 KISDI and ITU data produces a single unified timeline.
   - *How to extract*: Maintained in `probe_koryolink_mobile.py`.

---

## 4. Data Gaps & Statistical Black Holes

1. **Intra-Country Public Opinion Inside North Korea**:
   - There is no independent polling inside North Korea. All public opinion regarding life inside the country must be inferred from defector surveys (SNU IPUS, KINU, MOU).
   - *Defector sample bias*: Defectors are disproportionately from North Hamgyong and Ryanggang border provinces, have higher female representation (~70–80%), and represent individuals who chose or were forced to leave. They cannot be treated as a pure random sample of Pyongyang elites or southern rural populations.
2. **Official Mobile Subscriber Disclosures Post-2015**:
   - Neither Koryolink nor the North Korean Ministry of Posts and Telecommunications releases audited subscriber counts. Data post-2015 relies on ITU estimates and South Korean intelligence/telecom analysis.
3. **Local Election Vote Counts Prior to 2023**:
   - For 75 years, North Korea published only national percentage turnout and 100% Yes votes. Absolute raw ballot numbers by county are state secrets.
4. **Internet Intranet (Kwangmyong) Telemetry**:
   - While global IODA and BGP metrics capture the external Star JV network, the vast majority of North Korean computer users access only the national walled intranet (*Kwangmyong* / 광명망), which is completely air-gapped from the global internet and produces zero external BGP routes or ping signals.

---

## 5. Safety, Ethics & Privacy Rules

In accordance with repo safety rules and humanitarian ethics:
1. **Never Publish Individual Defector Identifiers**:
   - Defector survey data must only ever be displayed as **aggregated statistical percentages** by year or cohort. Never publish individual survey interview IDs, dates of border crossing, defection transit routes, or specific home villages that could allow state security agents (MSS / 보위부) to identify families remaining inside North Korea.
2. **No Incident Narratives with Family Names**:
   - Aggregated trends (e.g. bribery rate, media exposure rate) provide immense analytical value without exposing any human sources.
3. **Transparent Source Labeling**:
   - Clearly label defector surveys as retrospective testimonies of defectors, noting the arrival cohort and sample size (e.g. SNU IPUS annual sample ~100–150; MOU 10-year sample 6,351).

---

## 6. Probe Scripts and Sample Inventory

All automated probe scripts and generated samples have been tested and committed:

### Probes (`docs/research/charts/probes/society/`):
- `probe_ioda_ripestat.py`: Connects to Georgia Tech IODA v2 API and RIPEstat to extract BGP routes, ping latency, and AS131279 prefixes.
- `probe_koryolink_mobile.py`: Compiles Orascom quarterly reports, KISDI estimates, and ITU WDI mobile cellular penetration data.
- `probe_kinu_leadership.py`: Scrapes KINU `nksdb` portal to extract Kim Jong Un's annual public appearances and military/guidance percentages (2012–2026).
- `probe_spa_elections.py`: Compiles Supreme People's Assembly and Local Elections official turnout and vote shares (1948–2023).
- `probe_defector_surveys.py`: Downloads and parses SNU IPUS Excel spreadsheets (`2-04-Sk03.xlsx`, `2-07-Nk02.xlsx`, `3-08-q12.xlsx`, `3-03-q1_11_1.xlsx`, `1-01-Uni01.xlsx`).
- `probe_diplomacy_opinion.py`: Verifies and extracts Japanese Cabinet Office diplomacy surveys, US Gallup ratings, Gallup Korea polls, and Lowy diplomatic post counts.
- `build_society_json.py`: Validates schema and compiles `docs/research/charts/society.json`.

### Verified Samples (`docs/research/charts/samples/society/`):
- `ioda_kp_connectivity.json`: IODA BGP and ping-slash24 signals for KP (recent and Jan 2022 DDoS outage).
- `ripestat_as131279.json`: RIPEstat prefix routing, first/last seen timestamps, and transit neighbours for AS131279.
- `mobile_subscriptions.csv`: Koryolink quarterly subscribers (2008–2015) and annual ITU series (2007–2023).
- `kim_jong_un_appearances.csv`: Full annual event count, military count/pct, economic guidance count/pct, and weapons test count (2012–2026).
- `kim_jong_un_summary.json`: Metadata summary of KINU leadership database.
- `spa_election_results.csv`: Turnout and Yes/No vote percentages across all 15 SPA terms and 2023 local elections.
- `snu_ipus_defector_trends.csv`: Annual defector survey indicators (foreign media exposure, bribery share, phone ownership, Kim approval).
- `international_opinion_diplomacy.json`: Japanese Cabinet Office concerns, US Gallup favorability, Gallup Korea summit rating, and Lowy diplomatic post counts.
