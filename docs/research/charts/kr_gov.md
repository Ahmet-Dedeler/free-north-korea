# Research Report: South Korean Government Statistics on North Korea (`kr_gov`)

**Track:** `kr_gov`  
**Scope:** South Korean government administrative, statistical, intelligence, and central bank datasets on the DPRK.  
**Primary Agencies:** Statistics Korea (KOSIS), Bank of Korea (BOK), Ministry of Unification (MOU), KOTRA, Rural Development Administration (RDA), Korea Energy Economics Institute (KEEI), Ministry of National Defense (MND), Korea Institute for National Unification (KINU), data.go.kr.  
**Cataloged Series:** 31 series across macroeconomics, demographics, humanitarian aid, diplomacy, trade, agriculture, energy, and military force.  
**Data File:** [`docs/research/charts/kr_gov.json`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/kr_gov.json)  
**Probe Scripts:** [`docs/research/charts/probes/kr_gov/`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/probes/kr_gov/)  
**Sample Datasets:** [`docs/research/charts/samples/kr_gov/`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/samples/kr_gov/)  

---

## 1. Top 10 Series by Value

| Rank | Series ID | Publisher | Indicator & Scope | Frequency & Latest Period | Latest Value | Opportunity |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `bok-nk-gdp-growth-rate` | Bank of Korea (BOK) | Real GDP Growth Rate (1990–2025) | Annual (2025) | **+3.5%** (2024: +3.7%, 2023: +3.1%, 2022: -0.2%, 2020: -4.5%) | Pull (ECOS API) |
| **2** | `mou-reunion-applicants-alive-vs-deceased` | Ministry of Unification | Separated Families: Registered vs Living vs Deceased (1988–2026.08) | Monthly (2026-08) | **134,843** registered, **32,948** alive (24.4%), **101,895** deceased (**75.6%**; -199 survivors/month) | Scrape & Centralize (trapped in monthly HWP) |
| **3** | `mou-defector-arrivals-annual` | Ministry of Unification | Defector Arrivals in ROK by Year & Gender (1998–2025.12) | Annual / Quarterly (2025) | **223** persons (Male: 25, Female: 198, **88.8% female**); Cumulative: **34,537** | Scrape & Centralize (HTML table on MOU site) |
| **4** | `bok-nk-market-exchange-rate-usd` | Bank of Korea (BOK) | Pyongyang Market Street Exchange Rate (2015Q1–2025Q4) | Quarterly (2025Q4) | **37,550 KPW/USD** (up from 8,100 won in 2023Q1; 4.6x currency collapse) | Pull (ECOS API) |
| **5** | `kotra-nk-trade-china-share` | KOTRA / KOSIS | DPRK External Trade China Dependency Share (2000–2025) | Annual (2025) | **98.2%** of all legal external trade with China (Total trade: $3.13B, Deficit: $2.19B) | Pull / Scrape (KOSIS `DT_1ZGA97`) |
| **6** | `mou-inter-korean-trade-volume` | Ministry of Unification | Inter-Korean Trade Volume & Balance (1989–2024) | Annual (2024) | **$0.00M** (2015 peak: **$2,714.5M**; post-Kaesong shutdown total collapse) | Scrape & Centralize (MOU Excel download) |
| **7** | `mou-humanitarian-aid-annual` | Ministry of Unification | ROK Humanitarian Assistance to North Korea (1995–2025) | Annual (2025) | **0 KRW** in 2024–2025 (Cumulative 1995–2025: **3,344.4 billion KRW** / ~$3.34B USD) | Scrape & Centralize (trapped in HWPX/PDF) |
| **8** | `rda-nk-food-crop-production` | Rural Development Admin | DPRK Crop Harvest Estimates: Rice, Corn, Tubers (1990–2025) | Annual (2025) | **490만 톤** (4.90M tonnes; Rice: 225만, Corn: 152만; Deficit: ~60-80만 tonnes) | Scrape & Centralize (RDA Dec press releases) |
| **9** | `kosis-nk-electricity-generation` | KOSIS / KEEI | Electricity Generation: Hydro vs Thermal (1980–2024) | Annual (2024) | **254억 kWh** (Hydro: 158억 kWh / 62.2%, Thermal: 96억 kWh; South Korea: 5,880억 kWh, ~23x) | Pull / Scrape (KOSIS `DT_1ZGA74`) |
| **10** | `mnd-kpa-standing-forces` | Ministry of National Defense | Korean People's Army (KPA) Active Standing Forces (2000–2024) | Biennial (2022) | **1,280,000** standing troops (Army: 1.10M, Navy: 60k, Air: 120k, Strategic: 10k; Reserve: 7.62M) | Scrape & Centralize (MND Defense White Paper) |

---

## 2. Infrastructure & Government Portals Architecture

### 2.1. Statistics Korea KOSIS North Korea Portal (`kosis.kr/bukhan`)
- **Portal Scope:** The `MT_BUKHAN` tree contains **14 domestic categories** with **142 statistical tables**, plus international agency mirror tables (UN, World Bank, FAO, UNICEF, WHO), DPRK 1993/2008 population censuses, and demographic projections through 2070.
- **KOSIS OpenAPI Architecture:**
  - Base Endpoint: `https://kosis.kr/openapi/Param/statisticsParameterData.do` (or `statisticsData.do`)
  - Parameters: `method=getList`, `apiKey={KEY}`, `orgId=101`, `tblId={tblId}`, `itmId=ALL`, `objL1=ALL`, `prdSe=Y`, `startPrdDe={start}`, `endPrdDe={end}`, `format=json`, `jsonVD=Y`.
  - Categories:
    1. `영토/인구` (18 tables): `DT_1ZGA21` (인구, 2008~2070), `DT_1ZGA23` (성별/성비), `DT_1ZGA01_008` (연령계층별).
    2. `보건` (10 tables): `DT_1ZGAB1` (기대수명, 2008~2070), `DT_1ZGA284` (영아사망률).
    3. `교육` (4 tables): `DT_1ZGAC2` (교육기관 수), `DT_1ZGAC3` (학생 수).
    4. `농림수산업` (18 tables): `DT_1ZGA55` (식량작물 생산량, 1965~2025), `DT_1ZGA56` (주요 식량작물), `DT_1ZGA532` (시도별 벼 재배면적).
    5. `광업 및 제조업` (14 tables): `DT_1ZGA61` (석탄 생산량, 1965~2024), `DT_1ZGA6B` (조강 생산량), `DT_1ZGA65` (화학비료), `DT_1ZGA66` (시멘트).
    6. `국민계정` (10 tables): `DT_1ZGA31` (경제성장률, 1990~2024), `DT_1ZGA37` (국민총소득).
    7. `대외무역` (11 tables): `DT_1ZGA91` (무역총액, 1990~2025), `DT_1ZGA96` (주요국별 수출입), `DT_1ZGA97` (대중국 교역비중).
    8. `교통/물류` (8 tables): `DT_1ZGA81` (철도 총연장, 1965~2024), `DT_1ZGA82` (전철화율), `DT_1ZGA84` (도로 총연장), `DT_1ZGA88` (선박 보유톤수).
    9. `남북한 교류` (17 tables): `DT_1ZGAA52` (회담 개최), `DT_1ZGAA103` (인적왕래), `DT_1ZGAA42` (탈북민 입국), `DT_1ZGAA41` (이산가족).
    10. `남북한 교역` (10 tables): `DT_1ZGAA6` (교역 현황 월별 1989.01~2024.12), `DT_1ZGAA` (개성공단).
    11. `환경` (3 tables): `DT_1ZGA13` (기온), `DT_1ZGA14` (강수량).
    12. `에너지` (7 tables): `DT_1ZGA74` (발전 전력량, 1980~2024), `DT_1ZGA71` (1차에너지 공급), `DT_1ZGA75` (원유수입량).
    13. `수교국 및 국제기구` (6 tables): `DT_1ZGAA10` (수교 현황), `DT_1ZGAA11` (국제기구 가입).
    14. `기타` (6 tables): `DT_1ZGAB12` (남북 군사력, 2008~2022), `DT_1ZGAE21` (이동전화 가입자, 2000~2024).
  - *Firewall / WAF note:* Automated raw POST requests to internal web endpoints like `/statHtml/html.do` trigger KOSIS WAF IP blocks (`비정상적인 서비스 이용으로 접근이 차단되었습니다`). Scraping must either use the official free OpenAPI key or headless browser emulation with standard headers.

### 2.2. Bank of Korea ECOS API (`ecos.bok.or.kr`)
- **API Status:** Outstanding. Verified live queries via the public `sample` test key (10-record pagination) or free developer API key.
- **Dedicated NK Tables:**
  - Table `251Y001` (북한의 경제활동별 국내총생산): Annual 1990–2025. Item `1010400` (경제성장률), `1010200` (명목 GNI), `1010300` (1인당 GNI), `2010100`~`2010203` (산업별 성장률).
  - Table `251Y002` (한국/북한 배율): Official South/North economic ratios (GNI multiple, per capita GNI multiple, trade multiple).
  - Table `252Y001` (북한의 시장물가지수): Quarterly 2006Q1–2025Q4. Item `A110000` (총지수), `A111000` (식료품), `A111100` (곡물).
  - Table `252Y002` (북한의 시장환율): Quarterly 2006Q1–2025Q4. Item `A020` (평양 KPW/USD), `B020` (평양 KPW/CNY).

---

## 3. What is Trapped in HWP / PDF / Press Releases (Our Centralization Opportunity)

The highest-value humanitarian, diplomatic, and human rights datasets published by the South Korean government are locked in formats completely inaccessible to international researchers and automated scrapers:

1. **Separated Families Monthly Bulletins (`reunion.unikorea.go.kr`):**
   - **Format:** Hangul Word Processor (`.hwp`) binary compound files uploaded once a month (`2026년 8월 이산가족 신청 현황(홈페이지).hwp`).
   - **What's Trapped:** Monthly registered applicants, deceased, living survivors, 5-tier age breakdown (90+, 80-89, 70-79, 60-69, <60), gender, relationship, and North Korean home provinces.
   - **Extraction Method:** Demonstrated in [`probe_reunion_hwp.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/probes/kr_gov/probe_reunion_hwp.py). OLE stream decompression of `PrvText` or `BodyText/Section0` yields 100% clean structured plaintext tables in under 50ms.
2. **Ministry of Unification Humanitarian Assistance (`unikorea.go.kr`):**
   - **Format:** `.hwpx` (Zip/XML) and PDF reports (`260223_인도적 대북지원 현황(주요사업 통계 2025까지).hwpx`).
   - **What's Trapped:** 31-year continuous annual breakdown (1995–2025) of South Korean government grants, food loans, civilian NGO support, and multilateral agency channeling (UNICEF, WHO, WFP).
   - **Extraction Method:** Demonstrated in [`probe_unikorea_stats.py`](file:///Users/ahmet/Code/free-north-korea/docs/research/charts/probes/kr_gov/probe_unikorea_stats.py). Unzipping `Contents/section0.xml` extracts the complete table.
3. **Ministry of Unification Defector Demographics & Settlement (`unikorea.go.kr`):**
   - **Format:** Buried multi-table `.xlsx` file (`북한이탈주민정책(2026.6월 기준)_홈페이지게시.xlsx`).
   - **What's Trapped:** Seven distinct sub-tables on a single sheet: age at arrival, education in the DPRK, occupation in the DPRK, origin province, South Korean settlement region, and 17-year economic integration metrics (livelihood recipient rate, unemployment rate).
4. **Rural Development Administration Crop Estimates (`rda.go.kr`):**
   - **Format:** Annual December press releases (`보도자료`) and summary tables.
   - **What's Trapped:** Harvest tonnage by crop (rice, corn, potatoes, soybeans, misc) and provincial crop status.
5. **Ministry of National Defense White Paper (`국방백서`):**
   - **Format:** Biennial 300+ page PDF publications.
   - **What's Trapped:** Force strengths of the Korean People's Army across branches (Army, Navy, Air, Strategic Force), reserve forces, and 12 equipment categories (Tanks, Armored Vehicles, Field Artillery, Multiple Rocket Launchers, Submarines, Combat Aircraft).
6. **KINU North Korea Human Rights White Paper (`북한인권백서`):**
   - **Format:** Annual 400+ page PDF publications.
   - **What's Trapped:** Quantitative survey data from hundreds of in-depth escapee interviews tracking public execution witnessed rates, secret foreign media consumption, mobile phone inspections, and political prison camp awareness.

---

## 4. Key Data Gaps Where No Direct South Korean Gov Data Exists

1. **North Korean Internal Budget & Fiscal Accounts:**
   - The DPRK Supreme People's Assembly (SPA) only announces annual percentage increases (e.g. "budget expenditure increased by 103.4%"), never nominal absolute values. South Korean government figures for DPRK state budget (`DT_1ZGAB11`) end around 2023 and rely on rough conversions of historical percentages.
2. **Illicit & Sanctions-Evasion Trade (Ship-to-Ship Transfers & Arms Deliveries):**
   - KOTRA and KOSIS external trade figures strictly track customs-cleared bilateral trade reported by partner nations (customs mirror statistics). They capture $0 of North Korea's illicit refined petroleum imports via ship-to-ship transfers, coal smuggling to Chinese coastal ports, or artillery shells/missile shipments to Russia post-2023. These require satellite tracking and UN Panel of Experts / Royal United Services Institute (RUSI) data.
3. **Accurate DPRK Domestic Mortality & Fertility:**
   - Since the 2008 UNFPA-assisted DPRK Census, all population, fertility, and mortality numbers published by Statistics Korea (`DT_1ZGA21`, `DT_1ZGA283`, `DT_1ZGAB1`) are demographic model projections, not empirical census counts.
4. **Sub-National County & City Level Economic Data:**
   - South Korean government macroeconomic statistics operate exclusively at the national aggregate level. No official South Korean government time series exists for GDP, income, or trade by North Korean province or county (except for satellite-estimated rice acreage by province in `DT_1ZGA532`).

---

## 5. Safety & Ethical Guidelines

- **Never Publish Witness-Identifiable Microdata:** While the Ministry of Unification publishes aggregate provincial origins and arrival age bands, individual defector arrival dates, exact hometown addresses, or escape trajectories must never be connected or published in a manner that could endanger remaining relatives inside North Korea or facilitate state security targeting.
- **De-Identify Human Rights Survey Snippets:** KINU and MOU human rights testimonies cite witness code numbers (e.g. "탈북민 A씨", "사례번호 2024-042"). Always preserve complete anonymity and cite only aggregate statistical trends.
- **Differentiate Estimates from Hard Facts:** South Korean government statistics on North Korea fall into two distinct epistemological tiers:
  1. *Hard Administrative Records:* Defector arrivals in South Korea, divided family applicant registrations, official inter-Korean talks, and customs-cleared inter-Korean trade. These are 100% verified administrative facts.
  2. *Estimative Models:* GDP growth rates (BOK), crop yields (RDA), KPA troop numbers (MND), and energy balance (KEEI). These are analytical estimates based on intelligence, satellite imagery, and proxy indicators, and must be clearly labeled as such with their publishing methodology cited.

---

## 6. Ten-Line Summary

1. **The South Korean government is the world’s most comprehensive institutional compiler of quantitative North Korea data, maintaining 35+ continuous years of administrative and estimative time series.**
2. **Statistics Korea KOSIS (`kosis.kr/bukhan`, `MT_BUKHAN`) compiles 142 tables across 14 categories, serving as the central clearinghouse for population, industry, infrastructure, and trade.**
3. **The Bank of Korea ECOS API provides live, clean JSON endpoints for DPRK Real GDP Growth (1990–2025: +3.5%), Nominal GNI, and quarterly market exchange rates (Pyongyang KPW/USD: 37,550 in late 2025).**
4. **The Ministry of Unification (MOU) documents 34,537 cumulative defector arrivals (1998–2025), showing a dramatic plunge from 2,914/year in 2009 to 223/year in 2025, with women now comprising 88.8%.**
5. **The Separated Families portal (`reunion.unikorea.go.kr`) documents an urgent humanitarian tragedy: of 134,843 registered applicants, 75.6% (101,895) have died, and two-thirds of survivors are 80 or older.**
6. **Inter-Korean commercial trade completely collapsed from an all-time peak of $2.71 billion in 2015 (Kaesong Industrial Complex) to exactly $0.00 in 2023–2025.**
7. **Official inter-Korean diplomatic and working-level talks fell from 55 rounds in 2007 and 36 rounds in 2018 to zero rounds for six consecutive years (2019–2024).**
8. **South Korean humanitarian aid to the North totaled 3.34 trillion KRW ($3.34B USD) from 1995 to 2025, but was completely reduced to zero under current inter-Korean political gridlock.**
9. **Crucial monthly time series (separated family mortality, humanitarian aid, defector settlement) remain trapped in proprietary `.hwp`/`.hwpx` and PDF files, offering an immediate scraping and centralization opportunity.**
10. **Our World in Data-style visualizations of these datasets provide an unprecedented empirical narrative of the widening economic gap (27.5x per capita GNI), total trade dependence on China (98.2%), and demographic aging.**
