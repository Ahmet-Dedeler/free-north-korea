# Research Report: Human Rights, People & Security Time Series (Track: Rights)

This report evaluates chartable, time-series data covering North Korean human rights violations, escapee demographics, forced repatriations from China, detention systems, United Nations voting alignments, security incidents, Russian battlefield deployments, and defense spending.

The accompanying structured catalog is compiled in [`docs/research/charts/rights.json`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/rights.json) (34 verified time series), supported by extraction and verification scripts in [`docs/research/charts/probes/rights/`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/probes/rights/) and clean sample datasets in [`docs/research/charts/samples/rights/`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/samples/rights/).

---

## 1. Top 10 Series by Value

| Rank | Series ID | Publisher | Unit / Scope | Latest Data Point | Why It Matters |
|---|---|---|---|---|---|
| **1** | `mou-defector-arrivals-annual-total` | Ministry of Unification (통일부) | Persons / year | **2025: 223 persons**<br>**2026-H1: 63 persons**<br>(Cumulative: 34,575) | The fundamental barometer of border permeability, famine pressure, and regime control. Reflects a 92% collapse from peak (2009: 2,914) to post-COVID era. |
| **2** | `mou-defector-arrivals-by-gender` | Ministry of Unification (통일부) | Persons & % female | **2025: 88.8% female**<br>**2026-H1: 93.7% female**<br>(59 female / 4 male) | Documents the complete gender inversion of defection: pre-2002 was majority male; post-2002 became overwhelmingly female as women gained mobility via informal markets (*jangmadang*). |
| **3** | `nkpd-violations-annual-timeline` | Korea Future (NKPD) | Documented violations | **2019: 60 cases**<br>**Total: 9,149 violations**<br>(Peak 2004: 1,339) | Direct machine extraction from NKPD Uwazi API documenting 30 years of prison abuse across all 9 provinces. |
| **4** | `nkpd-right-to-life-violations-annual` | Korea Future (NKPD) | Documented executions & lethal abuse | **Total: 210 cases**<br>(Peak 2005: 32; 2011: 18; 2017: 5) | Year-by-year verified lethal abuse and execution cases in detention facilities, showing major crackdowns on market trading and cross-border escape. |
| **5** | `nkdb-forced-repatriations-china-annual` | NKDB (북한인권정보센터) | Refoulement cases | **2026: 8,245 cases**<br>(Post-COVID: 1,076+ via HRW) | The inverse filter to South Korean arrivals: thousands intercepted in China and refouled into North Korean detention camps. |
| **6** | `kwanliso-prisoner-population-historical-estimates` | UN COI / HRNK / KINU / State Dept | Estimated inmates | **2026: 80,000–120,000**<br>(across 4 active camps) | Tracks the consolidation of North Korea's gulag from ~200,000 across 14 camps in the 1990s down to 4 operational camps today (Camps 14, 16, 18, 25). |
| **7** | `unga-dprk-resolution-voting-history` | UN General Assembly / Harvard Dataverse | Member state roll-call votes | **2025: Consensus**<br>(A/RES/80/220)<br>Recorded: 2005–2015 | Measures global diplomatic alignment: transition from contentious recorded votes (100+ Yes vs 20 No) to routine annual consensus adoption. |
| **8** | `mou-separated-families-survivors-vs-deceased` | Ministry of Unification (이산가족통합시스템) | Registered applicants | **2026-07: 134,819 total**<br>Deceased: 101,672 (75.4%)<br>Living: 33,147 (24.6%) | The humanitarian demographic cliff: >67% of remaining separated family survivors are aged 80+, with ~3,100 passing away annually without meeting kin. |
| **9** | `kpa-russia-troops-deployed-estimates` | ROK NIS / Ukraine GUR / Pentagon | Estimated deployed troops | **2026-09: 8,000+ active**<br>(10,000 staging;<br>~6,000+ casualties; 2 POWs) | The first major foreign combat deployment of KPA forces since the Vietnam War, fighting in Russia's Kursk sector. |
| **10** | `csis-beyond-parallel-provocations-annual` | CSIS Beyond Parallel | Documented provocation events | **2026: 27 events**<br>(through 2026-10-03)<br>2024 peak: 71 events | 68-year comprehensive time series (1958–2026; 504 events) tracking shifts from DMZ commando raids to ballistic missiles and electronic warfare. |

---

## 2. What We Should Scrape & Centralize (The Trapped & Abandoned Datasets)

Most English-language commentary relies on recurring quotes from secondary news articles. Crucial primary data remains trapped behind language barriers, domestic government firewalls, or dynamic frontend payloads:

### Priority 1: Korea Future NKPD Uwazi API (9,149 Violations & 245 Facilities)
* **The Finding:** Korea Future hosts its database on an open Uwazi instance (`https://nkpd.io/api/search`). While the web UI presents only high-level filters, the backend REST endpoints expose complete faceted aggregations by year (1989–2022), right violated, managing agency (MPS vs MSS), and facility ID.
* **Extraction:** Our probe script (`docs/research/charts/probes/rights/probe_rights_series.py`) verified that querying `/api/search?types=["601be9522b96d407e30b6825"]&allAggregations=true` instantly delivers the complete breakdown of 9,149 violations across 11 rights categories.
* **Rebuild Action:** Extract and publish the full annual cross-tabulation table (Right to Health: 1,995; Torture: 1,622; Expression: 1,576; Conscience: 1,091; Liberty: 901; Forced Labour: 680; SGBV: 469; Fair Trial: 348; Life/Executions: 210) into our public API.

### Priority 2: Ministry of Unification Defector & Demographics Pipeline
* **The Finding:** `unikorea.go.kr` blocks automated scrapers and international IP addresses (returning HTTP 403 Forbidden). However, the Ministry regularly registers its underlying statistical tables on the South Korean National Open Data Portal (`data.go.kr`, dataset `15106185`, modified September 30, 2026).
* **Extraction:** Automated extraction via `data.go.kr` allows us to bypass the `unikorea.go.kr` WAF and pull verified annual and monthly series: gender breakdown, origin province distribution (North Hamgyong ~58%, Ryanggang ~16%), and pre-defection occupations.
* **Rebuild Action:** Maintain an automated synchronization pipeline that updates `samples/rights/mou_defector_arrivals_annual.csv` whenever `data.go.kr` posts quarterly revisions.

### Priority 3: Japanese Abductee & Tokutei Shissōsha (特定失踪者) Coastal Profiles
* **The Finding:** Soseikai (特定失踪者問題調査会) maintains 276 comprehensive investigative profiles on `chosa-kai.jp/archives/missing`. Every single profile contains specific Japanese coastal points (prefecture, beach, town), exact disappearance dates, victim age, and abduction circumstances.
* **Extraction:** A simple HTML scraper cleanly parses all 276 records, geocodes the coastal locations, and extracts the disappearance timeline (peaking heavily between 1972 and 1985 along the Sea of Japan coast).
* **Rebuild Action:** Publish an interactive timeline and map layer integrating Soseikai's 276 cases with the Cabinet Secretariat's 17 official cases and NPA's 11 wanted operatives.

### Priority 4: UN General Assembly Roll-Call Voting Data (Voeten / Harvard Dataverse)
* **The Finding:** The UN Digital Library sits behind AWS WAF challenges (`x-amzn-waf-action: challenge`). However, the complete history of roll-call votes is archived in the Erik Voeten / Harvard Dataverse dataset (`doi:10.7910/DVN/LEJUQZ`).
* **Rebuild Action:** Pull the roll-call records for all 21 DPRK human rights resolutions (2005–2025) and generate an interactive globe showing voting blocs (Western/allied sponsors vs DPRK/China/Russia/Cuba opposition vs Non-Aligned abstentions).

---

## 3. Missile & Nuclear Baseline Freshness Audit (2025–2026)

We audited the repository's baseline missile dataset ([`public/data/test.en.json`](file:///Users/ahmet/Code/free-north-korea/public/data/test.en.json), derived from `nagix/nk-missile-tests` and CNS/NTI) against official announcements from the Japan Ministry of Defense (防衛省) and the South Korea Joint Chiefs of Staff (합참):

1. **Current Baseline State:**
   - Contains **357 flight tests** from 1984 through September 20, 2026.
   - For **2025**: Records 11 events across 7 dates (2025-01-06, 2025-01-14, 2025-03-10, 2025-05-07, 2025-05-08, 2025-10-21, 2025-11-07).
   - For **2026**: Records 43 events across 13 dates, concluding on `2026-09-20` (Wonsan salvo).

2. **Identified Missing Launches & Freshness Gaps:**
   - **2026-10-03 Short-Range Ballistic Missile (SRBM) Launch:** Launched into the Sea of Japan, confirmed by ROK JCS and CSIS Beyond Parallel. Absent from `test.en.json`.
   - **2026-03-19 Multiple Ballistic Missile Salvo:** Emergency press briefing by Japanese Defense Minister Koizumi confirmed multiple SRBMs flying ~350 km (apogee ~80 km). Absent from `test.en.json`.
   - **2024-05-17 Autonomous Navigation Guidance System Test:** Multi-missile tactical launch from Wonsan supervised by Kim Jong Un; reported by ROK JCS. Absent from `test.en.json`.
   - **Cruise Missiles Excluded by Design:** The CNS/NTI database strictly tracks ballistic missiles. Over 20 strategic cruise missile tests (`Hwasal-1`, `Hwasal-2`, `Pulhwasal-3-31`), anti-ship cruise missiles (`Bada-suri-6`), and underwater drone tests (`Haeil`) are omitted from `public/data/test.en.json`.

3. **Nuclear Tests:**
   - 6 underground tests confirmed at Punggye-ri Nuclear Test Facility (2006, 2009, 2013, 2016-Jan, 2016-Sep, 2017).
   - Explosive yields progressed exponentially from 0.7–2 kt (2006) to 100–250 kt (2017 thermonuclear test). No nuclear tests have been conducted since September 2017.

---

## 4. Gaps Where No Data Exists

1. **Internal Detention Facility Population Logs:** Neither North Korea nor satellite OSINT can provide real-time prisoner census figures for Kwanliso or Kyohwaso. Current estimates (80,000–120,000) are modeled based on perimeter capacity, barracks count, and mortality estimations.
2. **Inland Defection Numbers:** Over 74% of all defectors come from North Hamgyong and Ryanggang provinces due to Chinese river borders and mobile connectivity. Internal escapes from southern/inland provinces (Kangwon, South Hwanghae, Jagang) are statistically negligible in defector registries, leaving those regions unrepresented.
3. **Verified KPA Casualties in Russia:** While ROK NIS and Ukraine GUR cite ~6,000+ casualties and the Pentagon confirms heavy front-line involvement in Kursk, North Korea and Russia release no casualty figures or personnel manifests.
4. **Disaggregated Defense Procurement Budget:** North Korea's official budget statement lists defense spending as a single percentage (~15.8% in 2026). Nuclear weapons R&D, missile mass production, and foreign arms transfers (to Russia) are completely excluded from state budgets and run through the Second Economic Committee.

---

## 5. Safety, Ethical & Anti-Identification Rules

In accordance with the repository's non-negotiable safety policies:
* **No Individual Names or Surnames from Defector Testimonies:** Incident narratives and court filings must never identify victims or witnesses who have relatives remaining inside North Korea.
* **No Point Geocoding for Private Homes or Graves:** Under NKDB guidelines, execution sites and home residences are only aggregated to county levels on public maps to prevent collective retaliation (*yeonjwaje*).
* **Undercover Communication Security:** Underlying datasets from Asia Press or defector extraction networks must never be probed in a manner that reveals transmission times, carrier frequencies, or Chinese SIM patterns.
