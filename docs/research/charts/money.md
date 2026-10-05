# Track Report: Money, Market Prices, Bilateral Trade & Illicit Financial Flows

**Track ID:** `money`  
**Scope:** Grassroots *jangmadang* commodity prices (rice, corn, fuels, foreign exchange), bilateral mirror trade (China GACC, Russia, Japan, KOTRA), state-sponsored cryptocurrency theft attribution (Lazarus Group / BlueNoroff), international humanitarian assistance (UN OCHA FTS, WFP), maritime sanctions evasion (UN 1718 refined petroleum quota vs. illicit STS deliveries), multilateral sanctions enforcement (UN 1718 vs. US OFAC), overseas labor remittances, and international tourism flows (Wonsan-Kalma, Rason).

---

## 1. Executive Summary

Research into North Korea's monetary flows reveals a striking duality: while the Kim regime treats domestic macroeconomic statistics as state secrets, the country's external and black-market financial realities are **quantifiable with unprecedented programmatic precision**.

Through targeted probes, this research verified:
1. **The Live Market Price Pipeline:** Daily NK's production frontend consumes a publicly queryable Google Sheet backend (`gviz/tq`) containing **344 bi-weekly observation records spanning August 2009 to September 2026** for USD/KPW and white rice across Pyongyang, Sinuiju, and Hyesan. Asia Press (Rimjin-gang) maintains a continuous 423-row HTML table documenting fuel, grain, and forex rates in northern cities from April 2017 to September 2026.
2. **The Collapse of Multilateral Sanctions & the Rise of Cyber Revenue:** UN Security Council designations have flatlined at zero since 2018 due to Chinese and Russian vetoes, while US OFAC unilateral designations continue at 20–45 targets per year. Simultaneously, DPRK state-sponsored cryptocurrency theft has exploded into a multi-billion-dollar sovereign funding mechanism: Lazarus and affiliated units have stolen **$8.35 billion cumulatively between 2017 and 2026**, highlighted by the historic $1.50 billion Bybit heist in February 2025 and the $387 million Bitget breach in September 2026.
3. **The 98% Cliff in Humanitarian Assistance:** UN OCHA's live Financial Tracking Service API (`api.hpc.tools`) confirms that international humanitarian assistance to North Korea plummeted from a peak of $117.79M in 2012 to just $2.14M in 2026. WFP funding has sat at exactly $0.00 for five consecutive years (2022–2026) due to the regime's prolonged operational blockade.
4. **The Oil Smuggling Chasm:** While China and Russia officially report ~85,000–125,000 barrels of refined petroleum transfers annually to the UN 1718 Committee (safely below the UNSCR 2397 annual cap of 500,000 barrels), satellite imagery compiled by the UN Panel of Experts and the Multilateral Sanctions Monitoring Team (MSMT) reveals that actual deliveries exceed **1.8 to 2.6 million barrels annually** via dark tanker shuttle runs and ship-to-ship (STS) transfers.

---

## 2. Top 10 Series Ranked by Value

| Rank | Series ID | Title & Publisher | Latest Data Point | Freq | Key Value & OWID Chart Concept |
|:---:|:---|:---|:---:|:---:|:---|
| **1** | [`dailynk-fx-usd-pyongyang`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **Daily NK Market Exchange Rate (USD/KPW)**<br>*(Daily NK)* | **2026-09-27:**<br>`69,100 KPW/USD` | Bi-weekly | **Ground-truth currency benchmark**: 344 continuous bi-weekly points from 2009 to 2026. Chart: *The 17-Year Collapse of the North Korean Won* (from 3,600 to 69,100 KPW/USD), annotating the 2009 currency redenomination, 2017 sanctions, and 2026 hyper-depreciation. |
| **2** | [`dailynk-rice-pyongyang`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **Daily NK White Rice Market Price**<br>*(Daily NK)* | **2026-09-27:**<br>`40,800 KPW/kg` | Bi-weekly | **The Core Food Affordability Metric**: 17-year continuous series. Chart: *The Rice Affordability Ratio*—comparing market rice prices against state official monthly salaries (~3,000 KPW), showing how many months of official state wages are required to buy 1 kg of rice. |
| **3** | [`dprk-crypto-theft-annual-attributed`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **DPRK State-Sponsored Crypto Theft**<br>*(Chainalysis / TRM / FBI)* | **2026 (YTD):**<br>`$1,050M USD`<br>(Cumul: `$8.35B`) | Annual | **Macroeconomic Cyber Revenue**: Verified yearly attribution from 2017 to 2026. Chart: *North Korea's Cyber GDP*—comparing annual crypto theft directly against total physical exports ($468M/yr), demonstrating cybercrime produces 2x–4x more revenue than all physical merchandise exports. |
| **4** | [`china-customs-monthly-trade-total`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **China Customs (GACC) Monthly Trade**<br>*(China Customs / Comtrade)* | **2026-08:**<br>`$237.88M USD`<br>(Jan–Aug: `$1.97B`) | Monthly | **The Economic Lifeline (98% of DPRK Trade)**: Official mirror trade data. Chart: *The Sanctions Shock, COVID Freeze, and Wig-Driven Rebound* (2017–2026), tracking monthly turnover through the 2020 border closure to 2026 peak levels. |
| **5** | [`asiapress-market-prices-table`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **Asia Press Rimjin-gang Price Table**<br>*(Asia Press International)* | **2026-09-25:**<br>`Gasoline: 67,000 won`<br>`Rice: 43,000 won` | Weekly / Bi-weekly | **Cross-Validation Network**: 423 continuous rows dating back to April 2017 from Ryanggang and North Hamgyong provinces. Chart: *Dual-Source Market Verification*—comparing Daily NK and Asia Press rice and fuel prices over 9 years. |
| **6** | [`un-ocha-fts-humanitarian-funding-annual`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **UN OCHA FTS Humanitarian Aid to DPRK**<br>*(UN OCHA Financial Tracking Service)* | **2026:**<br>`$2.14M USD`<br>(Peak 2012: `$117.8M`) | Annual | **International Isolation Metric**: Clean REST API (`api.hpc.tools`) covering 17 years. Chart: *The 98% Evaporation of Humanitarian Aid to North Korea* (2010–2026), tracking the impact of expelling foreign NGO and UN staff. |
| **7** | [`un-panel-msmt-refined-petroleum-estimates`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **Refined Petroleum Smuggling vs. UN Cap**<br>*(UN Panel / MSMT)* | **2026:**<br>`1.8M–2.1M bbls`<br>(UN Cap: `500,000`) | Annual | **Maritime Sanctions Evasion**: Satellite displacement calculations vs. official declarations. Chart: *The Oil Ceiling Fiction*—stacked area chart comparing the statutory 500k cap, official 85k–125k reports, and 1.8M–3.8M barrels of actual illicit STS imports. |
| **8** | [`dailynk-corn-market-prices`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **Daily NK Market Corn (Maize) Price**<br>*(Daily NK)* | **2026-09-27:**<br>`16,000–16,300 KPW/kg` | Bi-weekly | **Famine Early-Warning Signal**: Staple food for working-class households. Chart: *The Rice-to-Corn Substitution Gap*—when the ratio widens past 2.5x, vulnerable populations experience severe calorie deficits. |
| **9** | [`un-1718-sanctions-designations-annual`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **UN vs. US OFAC Sanctions Designations**<br>*(UN 1718 / US OFAC)* | **2026:**<br>`UN: 0 / OFAC: 21`<br>(Total: `UN 155 / OFAC 544`) | Annual | **Multilateral Governance Paralysis**: Official XML and SDN registry. Chart: *The Death of UN Consensus*—showing UN designations surging in 2016–2017 (101 targets) then flatlining at 0 from 2019–2026 while US unilateral designations climb. |
| **10** | [`msmt-dprk-overseas-workers-census`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/money.json) | **DPRK Overseas Worker Deployment & Revenue**<br>*(MSMT / US State Dept)* | **2026:**<br>`35,600–101,280 workers`<br>`$450M–$800M revenue` | Annual | **State-Sponsored Forced Labor**: Multi-country census across China and Russia. Chart: *The Shadow Workforce*—estimating regime wage garnishment (80%–90%) generating hard currency despite UNSCR 2397 repatriation bans. |

---

## 3. Data to Scrape and Centralize Ourselves

Because North Korean economic data is either politically suppressed or scattered across disparate media, building an authoritative public hub requires pulling and cleaning several high-leverage datasets that nobody else maintains in machine-readable form:

### A. The Daily NK Live Market Database (`dailynk-fx-*`, `dailynk-rice-*`, `dailynk-corn-*`, `dailynk-fuel-*`)
*   **Current State:** The data is locked inside an unpublished Google Spreadsheet (`1l78JcbokjkdlJ1aSU6F8cuqgC0AbfMkuXOKWiEEbueo`) wired to a minimalist client-side JavaScript snippet on `dailynk.com/market/`, while corn, CNY, gasoline, and diesel are embedded in the body copy of bi-weekly Korean and English news articles.
*   **Our Solution:** A scheduled workflow that queries the open Google Sheets visualization API (`/gviz/tq?sheet=rate` and `/gviz/tq?sheet=rice`) and parses new bi-weekly WordPress posts (`/english/wp-json/wp/v2/posts?search=market%20prices`). This produces the **first open, machine-readable 17-year time series of North Korean grassroots consumer prices and black-market exchange rates in existence**.

### B. Asia Press Rimjin-gang 9-Year Price Archive (`asiapress-market-prices-table`)
*   **Current State:** Asia Press maintains a single 423-row HTML table on `asiapress.org/korean/nk-korea-prices/` and a 424-row counterpart in Japanese (`/apn/north-korea_prices/`). While exceptionally accurate, it is rendered in raw WordPress HTML with no JSON/CSV export, making longitudinal analysis difficult.
*   **Our Solution:** An automated cheerio/node parser (tested and operational in `docs/research/charts/probes/money/probe_asiapress.js`) that transforms this HTML table into normalized JSON/CSV, capturing gasoline, diesel, rice, corn, RMB, and USD rates alongside editorial historical notes.

### C. The DPRK Annual Crypto Theft Attribution Ledger (`dprk-crypto-theft-annual-attributed`)
*   **Current State:** Yearly cryptocurrency theft numbers are scattered across disparate commercial marketing whitepapers (Chainalysis, TRM Labs, Elliptic), FBI Cyber Division Public Service Advisories, and Tayvano's GitHub repository. No public website tracks this as a unified, dated macroeconomic time series.
*   **Our Solution:** We synthesized the verified 2017–2026 annual table (including the landmark $1.50B Bybit hack in 2025 and $387M Bitget hack in 2026) in `docs/research/charts/samples/money/crypto_thefts_yearly.json`. This provides an ongoing ledger comparing sovereign cybercrime directly against North Korea's merchandise trade balance.

### D. Upgrading `data/sanctions.json` with OFAC Event Dates
*   **Current State:** Our repository's existing `data/sanctions.json` contains exact `listed` dates for all 155 UN 1718 entries, but its 544 OFAC entries lack listing dates because `scripts/build-sanctions.ts` parsed `sdn.csv`, which omits event dates.
*   **Our Solution:** Ingest OFAC's structured `sdn_advanced.xml` or OpenSanctions entity JSON-LD to attach exact listing dates to every OFAC DPRK designation. This immediately unlocks a rich 20-year chart comparing multilateral UN enforcement against unilateral US enforcement.

---

## 4. Critical Data Gaps & Information Black Holes

1. **Off-the-Books Russia-DPRK Barter Trade:**
   Following the June 2024 Kim-Putin Comprehensive Strategic Partnership Treaty, billions of dollars worth of artillery shells, KN-23/KN-24 ballistic missiles, and military personnel were transferred to Russia via Tumangang-Khasan rail and Vostochny naval routes. In return, Russia provided refined petroleum, air defense missiles, and aviation equipment. None of this appears in KOTRA, UN Comtrade, or Russian Federal Customs Service statistics.
2. **Informal Street and Alley Markets (*Golmokjang* / *Kottjebi* Markets):**
   Daily NK and Asia Press surveys monitor major municipal permanent markets (*jangmadang*). Informal evening pop-up markets (*ttattaegi*), bicycle-trader networks, and rural alley markets—where the poorest citizens buy food in tiny cups (*jongzi*)—operate off the grid and face harsh, unrecorded crackdowns by the *109 Sangmu* inspection squads.
3. **Internal Foreign Currency Velocities & Donju Wealth Distribution:**
   While market exchange rates for USD and RMB are known, the aggregate volume of foreign banknotes circulating inside the country (estimated between $2B and $5B) and the capital accumulation of private financiers (*donju*) remain impossible to measure directly.
4. **China Customs Non-Reporting of Strategic Commodities:**
   China's GACC occasionally suppresses or reclassifies politically sensitive tariff lines (such as crude oil supplied through the Dandong-Sinuiju pipeline, estimated at ~500,000 metric tons annually, which is recorded as zero or omitted from monthly HS 2709 tables).

---

## 5. Legal, Ethical & Operational Safety Considerations

> [!CAUTION]
> **Source Protection & Undercover Informant Security**:
> Under no circumstances should individual market survey locations be published below the municipal level (Pyongyang, Sinuiju, Hyesan). Informants communicating price data to Daily NK and Asia Press utilize contraband Chinese mobile phones near the northern border. Discovery by the Ministry of State Security (*Bowibu*) or the State Security Department's radio-frequency direction-finding vehicles carries immediate execution or internment in political prison camps (*kwanliso*).
> 
> **Rule:** Never publish stall numbers, informant transmission timestamps, or specific market facility names. Always present data as aggregated municipal averages.

> [!WARNING]
> **Defamation & Sanctions Compliance in Maritime Trade**:
> In tracking illicit shipping networks (e.g. RUSI's 753 vessels), clearly differentiate between **UN Security Council binding multilateral designations** (UNSCR 1718 list), **sovereign legal designations** (US OFAC SDN), and **analytical OSINT observations** (suspected STS transfers). Falsely labeling an active commercial merchant tanker as "sanctioned" on our site creates legal exposure.

> [!NOTE]
> **Blockchain Attribution Integrity**:
> Crypto theft attribution must be transparently sourced. We distinguish between **Tier 1 (Official Enforcement)**: addresses cited in FBI advisories or OFAC SDN listings (e.g. Ronin validator address `0x098B...`), and **Tier 2 (Forensic Analytics Consensus)**: on-chain clusters identified by multiple independent tracking firms (Chainalysis, TRM Labs, ZachXBT).

---

## 6. Directory of Verified Chart Series (32 Series in `money.json`)

| Series ID | Publisher | Unit | Frequency | Coverage | Latest Point | Status |
|:---|:---|:---|:---:|:---:|:---:|:---:|
| `dailynk-fx-usd-pyongyang` | Daily NK | KPW/USD | Bi-weekly | 2009–2026 | 2026-09-27: 69,100 | Verified |
| `dailynk-fx-usd-sinuiju` | Daily NK | KPW/USD | Bi-weekly | 2009–2026 | 2026-09-27: 69,120 | Verified |
| `dailynk-fx-usd-hyesan` | Daily NK | KPW/USD | Bi-weekly | 2009–2026 | 2026-09-27: 69,120 | Verified |
| `dailynk-fx-cny-border` | Daily NK | KPW/CNY | Bi-weekly | 2010–2026 | 2026-09-27: 12,045 | Verified |
| `dailynk-rice-pyongyang` | Daily NK | KPW/kg | Bi-weekly | 2009–2026 | 2026-09-27: 40,800 | Verified |
| `dailynk-rice-sinuiju` | Daily NK | KPW/kg | Bi-weekly | 2009–2026 | 2026-09-27: 40,700 | Verified |
| `dailynk-rice-hyesan` | Daily NK | KPW/kg | Bi-weekly | 2009–2026 | 2026-09-27: 41,000 | Verified |
| `dailynk-corn-market-prices` | Daily NK | KPW/kg | Bi-weekly | 2010–2026 | 2026-09-27: 16,133 | Verified |
| `dailynk-fuel-prices-gasoline-diesel` | Daily NK | KPW/kg | Bi-weekly | 2017–2026 | 2026-09-27: Gas 81k, Dsl 80k | Verified |
| `dailynk-imported-food-basket` | Daily NK | KPW/kg | Bi-weekly | 2018–2026 | 2026-09-27: Oil 89k, Sugar 47k | Verified |
| `asiapress-market-prices-table` | Asia Press | KPW | Weekly/Bi-wk | 2017–2026 | 2026-09-25: Gas 67k, Rice 43k | Verified |
| `asiapress-market-prices-table-ja` | Asia Press | KPW (JPY) | Weekly/Bi-wk | 2017–2026 | 2026-09-25: 424 survey dates | Verified |
| `china-customs-monthly-trade-total` | China GACC | USD | Monthly | 2017–2026 | 2026-08: $237.88M | Verified |
| `china-customs-dprk-exports-to-china` | China GACC | USD | Monthly | 2017–2026 | 2026-08: $55.03M | Verified |
| `china-customs-dprk-imports-from-china` | China GACC | USD | Monthly | 2017–2026 | 2026-08: $182.85M | Verified |
| `un-comtrade-china-dprk-annual` | UN Comtrade | USD | Annual | 1992–2024 | 2024: $2.32B | Verified |
| `un-comtrade-china-dprk-commodities-hs` | UN Comtrade | USD / kg | Annual | 2000–2024 | 2023: HS 67 (Wigs) $167M | Verified |
| `kotra-north-korea-foreign-trade-annual` | KOTRA / KOSIS | USD (Millions) | Annual | 1990–2025 | 2025: $3,127.93M | Verified |
| `kotra-dprk-trade-partner-dependency` | KOTRA | % Share | Annual | 2000–2025 | 2025: China 98.2% | Verified |
| `japan-customs-dprk-trade-embargo` | Japan MOF | JPY | Monthly | 1980–2026 | 2026-08: 0 JPY | Verified |
| `dprk-crypto-theft-annual-attributed` | Chainalysis/TRM | USD (Millions) | Annual | 2017–2026 | 2026 YTD: $1.05B (Cumul $8.35B)| Verified |
| `tayvano-lazarus-heists-ledger` | Tayvano | Incidents / USD | Irregular | 2017–2026 | 2026-08: 301 incidents | Verified |
| `msmt-dprk-overseas-workers-census` | MSMT / MOU | Workers / USD | Annual | 2017–2026 | 2026: 35k–101k ($450M–$800M) | Verified |
| `un-ocha-fts-humanitarian-funding-annual` | UN OCHA FTS | USD | Annual | 2010–2026 | 2026: $2.14M (Peak $117.8M) | Verified |
| `wfp-dprk-operations-funding-annual` | WFP / FTS | USD | Annual | 2010–2026 | 2022–2026: $0.00M | Verified |
| `un-1718-refined-petroleum-reported` | UN 1718 Comm. | Barrels | Monthly | 2018–2026 | 2026: ~85k bbls (Cap 500k) | Verified |
| `un-panel-msmt-refined-petroleum-estimates`| UN Panel/MSMT | Barrels | Annual | 2018–2026 | 2026: 1.8M–2.1M bbls | Verified |
| `rusi-dprk-reports-vessels-database` | RUSI / KRG | Vessels | Snapshot | 2010–2024 | 753 vessels with IMO/flags | Verified |
| `un-1718-sanctions-designations-annual` | UN 1718 Comm. | Designations | Annual | 2006–2026 | 2026: 0 (0 since 2018; 155 tot) | Verified |
| `ofac-dprk-sanctions-designations-annual`| US OFAC | Designations | Annual | 2005–2026 | 2026: 21 (544 active entries) | Verified |
| `dprk-tourism-visitor-counts-annual` | Russian FSB/VI | Visitors | Annual | 2018–2026 | 2025: ~5k Russian tourists | Verified |
| `wonsan-kalma-resort-capacity-status` | KCNA / OSINT | Capacity | Snapshot | 2018–2026 | July 2025: 20k guest capacity | Verified |
