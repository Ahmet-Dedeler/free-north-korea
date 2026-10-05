# Global Datasets on North Korea (Track: global)

This report audits global statistical and index datasets covering the Democratic People's Republic of Korea (DPRK / PRK). It verifies which international organizations publish real time series for North Korea, the exact pull endpoints, coverage spans, latest data points, comparability with South Korea (ROK), China, Japan, and the world, and identifies major statistical black holes.

All findings are backed by automated probes in `docs/research/charts/probes/global/` and sample extractions in `docs/research/charts/samples/global/`. The companion machine-readable catalog is `docs/research/charts/global.json` (41 verified series).

---

## 1. Top 10 Series by Value for the Site

Ranked by analytical value, historical depth, and visual impact for Our World in Data style charts:

| Rank | Series ID | Indicator & Publisher | Coverage | Latest Point (Verified) | Why It Matters |
|---|---|---|---|---|---|
| 1 | `maddison-gdp-per-capita` | Real GDP Per Capita PPP (Maddison Project / GGDC) | 1820-2022 | 2022: $1,568.85 (2011 int-$) | Quantifies the Great Korean Economic Divergence: parity in 1950 (~$855 vs $860) to a 28x prosperity gap in 2022 ($1,569 vs $44,000+). |
| 2 | `un-wpp-life-expectancy` | Life Expectancy at Birth (UN WPP 2024 / OWID) | 1950-2024 | 2024: 73.7 years (F: 76.1, M: 71.3) | A 10.7-year longevity gap across the DMZ (ROK is 84.4 years). Clearly displays the 1990s famine crash from 69.3 in 1991 to 60.8 in 1995. |
| 3 | `faostat-cereal-production` | Total Cereal Production (FAOSTAT QCL) | 1961-2024 | 2024: 4,885,461 tonnes | 64-year harvest series showing the 1996 famine collapse (2.61M tonnes, down 60%) and the structural ~4.9M tonne ceiling vs 5.5M tonne national need. |
| 4 | `who-tb-incidence-notifications` | Tuberculosis Notification Rate (WHO Global TB) | 2000-2024 | 2024: 269 per 100k (~71,280 cases) | North Korea suffers one of the highest TB burdens in Asia (7x higher than South Korea at 39/100k; 30x higher than Japan at 9/100k). |
| 5 | `walk-free-modern-slavery` | Modern Slavery Prevalence (Walk Free GSI) | 2014-2023 | 2023: 104.6 per 1,000 (Rank #1 globally) | 2.69 million people trapped in state-imposed forced labor. DPRK ranks #1 in the world; government response rating is -1/100 (lowest on earth). |
| 6 | `un-igme-child-mortality` | Under-5 Child Mortality Rate (UN IGME / OWID) | 1950-2024 | 2024: 16.7 per 1,000 live births | More than 6x higher than South Korea (2.6 per 1,000) and Japan (2.3). Captures the catastrophic 1995 famine peak at 108.0 per 1,000. |
| 7 | `unicef-jme-child-stunting` | Child Stunting Under 5 (UNICEF/WHO/WB JME) | 1998-2024 | 2024: 16.6% (~300,000 children) | Tracks biological recovery from the 1998 famine peak (62.3% stunted) to 16.6% today, alongside deep urban-rural nutrition inequalities. |
| 8 | `owid-electricity-generation` | Annual Electricity Generation (Energy Inst / OWID) | 2000-2024 | 2024: 27.1 TWh (1,023 kWh/capita) | Visualizes the Korean Peninsula at night: South Korea produces 615 TWh (23 times more electricity than North Korea with only twice the population). |
| 9 | `itu-mobile-cellular-subscriptions` | Mobile Cellular Subscriptions (ITU / WB) | 1980-2023 | 2022/2023: 6,353,441 (~24-27 per 100) | Traces the internal communication revolution from zero in 2008 to >6.3M domestic mobile phones today, juxtaposed against 0.0% global internet. |
| 10 | `vdem-electoral-democracy` | Electoral Democracy Index (V-Dem Institute) | 1945-2025 | 2025: 0.083 / 1.0 (Bottom 3 globally) | 80 continuous years of quantitative governance measurement showing total absence of competitive political rights since 1948. |

---

## 2. Institutional Dataset Audits

Every institution requested in the brief was probed and verified.

### 2.1 Our World in Data (OWID) Grapher
- **Coverage for PRK**: OWID contains over 30 grapher charts with confirmed DPRK (PRK) time series.
- **Machine pull URL format**: `https://ourworldindata.org/grapher/<slug>.csv?country=PRK~KOR~CHN~JPN~OWID_WRL` and `https://ourworldindata.org/grapher/<slug>.metadata.json`.
- **Verified active slugs**:
  - Demography: `life-expectancy` (1908-2024), `child-mortality-igme` (1950-2024), `infant-mortality` (1950-2024), `maternal-mortality` (1985-2023), `children-per-woman-un` (1950-2024), `median-age` (1950-2100), `crude-birth-rate` (1950-2024), `crude-death-rate` (1950-2024), `population` (0-2024).
  - Energy & Climate: `electricity-generation` (2000-2024), `per-capita-electricity-generation` (2000-2024), `share-electricity-renewables` (2000-2024), `annual-co2-emissions-per-country` (1905-2024), `co-emissions-per-capita` (1905-2024), `total-ghg-emissions` (1850-2024), `fossil-fuels-per-capita` (1980-2024), `primary-energy-cons` (1980-2024).
  - Food & Agriculture: `daily-per-capita-caloric-supply` (1961-2018), `daily-per-capita-protein-supply` (1961-2018), `prevalence-of-undernourishment` (2001-2019), `forest-area-km` (1990-2025).
  - Governance & Peace: `electoral-democracy-index` (1789-2025), `liberal-democracy-index` (1789-2025), `political-corruption-index` (1945-2025), `number-of-nuclear-weapons-tests` (1945-2024), `ti-corruption-perception-index` (2012-2024), `press-freedom-index-rsf` (2013-2021).
  - Technology & Economy: `mobile-cellular-subscriptions-by-country` (1980-2023), `share-of-individuals-using-the-internet` (1990-2024), `gdp-per-capita-maddison` (1820-2022).
- **Comparisons**: Direct, instant side-by-side with South Korea (`KOR`), China (`CHN`), Japan (`JPN`), and World (`OWID_WRL`).

### 2.2 UN World Population Prospects (WPP 2024)
- **Status**: Published in July 2024 (revised December 2024). DPRK Location ID is `408`.
- **Bulk download endpoint**: `https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz` (16.5 MB gzip, contains all countries 1950-2101).
- **API Note**: The UN Data Portal API (`dataportalapi/api/v1`) now requires token authentication (returns HTTP 401 for anonymous access). The direct S3/Azure gzip bulk download works anonymously with HTTP 200.
- **Verified 2024 DPRK values vs neighbors**:
  - Population: PRK 26.50M (2024), ROK 51.72M, CHN 1,419.3M, JPN 123.8M, World 8,162.0M.
  - Life expectancy: PRK 73.7 years, ROK 84.4 years (10.7-year gap), CHN 78.0 years, JPN 84.9 years, World 73.3 years.
  - Total fertility rate: PRK 1.78, ROK 0.73, CHN 1.01, JPN 1.22, World 2.25.
  - Under-5 mortality: PRK 16.7/1,000, ROK 2.6/1,000, CHN 8.0/1,000, JPN 2.3/1,000, World 36.0/1,000.
  - Median age: PRK 36.3 years, ROK 45.0 years, CHN 39.6 years, JPN 49.4 years, World 30.6 years.
- **Projections to 2050**: North Korea's population peaks around 2036 at 26.74M and gently declines to 25.79M by 2050. South Korea falls steeply from 51.72M to 45.14M by 2050 with median age reaching 56.7 years.

### 2.3 World Bank World Development Indicators (WDI)
- **Which indicators actually have PRK data**:
  - Demographic & Health: `SP.POP.TOTL` (2025: 26,571,036), `SP.DYN.LE00.IN` (2024: 73.7), `SP.DYN.TFRT.IN` (2024: 1.78), `SP.DYN.CBRT.IN` (2024: 12.86), `SP.DYN.CDRT.IN` (2024: 9.86), `SP.DYN.IMRT.IN` (2024: 13.3), `SH.DYN.MORT` (2024: 16.7), `SH.STA.MMRT` (2023: 66.9).
  - Infrastructure & Energy: `EG.ELC.ACCS.ZS` (2024: 61.4% electricity access), `EN.ATM.CO2E.PC` (2024: 2.36 tonnes).
  - Technology: `IT.CEL.SETS.P2` (2022: 24.3/100; total: 6.35M), `IT.NET.USER.ZS` (2024: 0.0%).
  - Aid: `DT.ODA.ALLD.CD` (2022: $23.4 million).
- **Indicators with NO PRK data**:
  - World Bank publishes ZERO estimates for North Korean GDP (`NY.GDP.MKTP.CD`), GDP per capita (`NY.GDP.PCAP.CD`), Trade/Exports (`NE.EXP.GNFS.CD`), or Foreign Direct Investment (`BX.KLT.DINV.CD.WD`). All economic national account indicators return null.

### 2.4 FAOSTAT (UN Food and Agriculture Organization)
- **Status**: DPRK Area Code is `116`.
- **API vs Bulk Warning**: The interactive API at `fenixservices.fao.org` is unstable (returns HTTP 521 origin down). The bulk normalized zips at `https://bulks-faostat.fao.org/production/` are fully accessible and updated.
- **Crop Production (`Production_Crops_Livestock_E_All_Data_(Normalized).zip`)**:
  - 64 continuous annual points (1961-2024).
  - 2024 harvest: Primary cereals 4,885,461 t (Rice: 2,250,000 t; Maize: 2,300,000 t; Potatoes: 413,319 t; Soybeans: 180,000 t).
  - Historical comparison: 1989 (6.47M t) -> 1993 (9.14M t claimed) -> 1996 (2.61M t crash) -> 2005 (4.65M t) -> 2024 (4.89M t).
- **Food Security (`Food_Security_Data_E_All_Data_(Normalized).zip`)**:
  - Stunting in children under 5: 16.6% in 2024 (down from 62.3% in 1998).
  - Anemia in women of reproductive age (15-49): 27.5% in 2023 (1.7 million women).
  - Safe drinking water access: 67% in 2023. Basic sanitation: 85% in 2023.
  - Value of food imports as % of merchandise exports: 136% in 2022-2024.
  - Prevalence of undernourishment: 47.6% (2017-2019 average; post-2019 data paused).
  - Caloric supply: 1,981 kcal/capita/day in 2018 (vs 2,403 kcal requirement).

### 2.5 WHO Global Health Observatory (GHO) & Tuberculosis Programme
- **Tuberculosis**: Verified via WHO Global TB Programme CSV (`https://extranet.who.int/tme/generateCSV.asp?ds=estimates`). DPRK reports continuous annual case notification and incidence rates from 2000 to 2024.
  - 2024 notification rate: 269 per 100k (~71,280 new cases). Peak was 441 per 100k in 2015.
  - Regional comparison: South Korea is 39/100k, China is 52/100k, Japan is 9/100k.
- **Immunization (WUENIC)**: WHO GHO API (`https://ghoapi.azureedge.net/api/WHS4_100?$filter=SpatialDim%20eq%20'PRK'`) reports 99.0% coverage for DTP3, MCV1 (measles), HepB3, and BCG up to 2025.
  - Caveat: Must be displayed with a caveat note; humanitarian observers reported severe stockouts in 2021 when zero vaccines entered the country due to quarantine border sealing.
- **Maternal mortality**: 66.9 per 100,000 live births in 2023 (WHOSIS/MDG series).

### 2.6 UNICEF / WHO / World Bank Joint Child Malnutrition Estimates (JME)
- **Source**: Multiple Indicator Cluster Surveys (MICS) conducted with UNICEF and DPRK Central Bureau of Statistics.
- **Years**: 1998, 2000, 2002, 2004, 2009, 2012, 2017, and modelled estimates through 2024.
- **Latest values (2024)**:
  - Child stunting (<5): 16.6% (1998 famine peak: 62.3%).
  - Child wasting (<5): 2.5% (1998 famine peak: 15.6%).
  - Child overweight (<5): 3.3%.
- **Comparability**: Directly comparable to South Korea (stunting 1.5%), China (4.7%), Japan (1.5%), and World average (22.3%).

### 2.7 UN IGME (Child Mortality Estimation)
- **Status**: Harmonized estimates covering 1950 to 2024.
- **Latest 2024**: Under-5 mortality: 16.7 per 1,000 live births; Infant mortality: 13.3 per 1,000; Neonatal mortality: 8.9 per 1,000.
- **Pull**: Fully integrated into OWID `child-mortality-igme` and UN IGME portal.

### 2.8 ILO (International Labour Organization)
- **Membership status**: North Korea is NOT a member of the ILO (one of only 6 UN member states that never joined).
- **Data availability**: ILOSTAT publishes NO administrative labor data, inspection records, wage series, or strike data for DPRK.
- **Modelled series only**: ILOSTAT provides synthetic estimates derived from UN WPP demographic models:
  - Labor force (15+): ~13.9 million in 2024.
  - Labor force participation rate: ~70.5%.
  - Modeled unemployment: 2.7% (a theoretical modeling convention, not an empirical rate).

### 2.9 ITU (International Telecommunication Union)
- **Membership status**: DPRK is a member state and submits telecommunication reports.
- **Coverage**: 1960 to 2023.
- **Latest values**:
  - Mobile cellular subscriptions: 6.35 million in 2022 (approx 24.3 to 27.0 per 100 people).
  - Internet users: 0.0% (officially reported as negligible / <0.1%).
  - Fixed telephone lines: ~1.18 million (~4.5 per 100 people).
- **Comparison**: Mobile penetration in South Korea is 148 per 100, China 120 per 100, Japan 160 per 100. Internet penetration in South Korea is 98.2%, Japan 93.3%, China 76.4%, World 67.0% vs North Korea 0.0%.

### 2.10 IMF (International Monetary Fund)
- **Membership status**: North Korea is NOT a member of the International Monetary Fund, World Bank, or Asian Development Bank.
- **Data availability**: NONE. The IMF World Economic Outlook (WEO) database does not cover North Korea. There are no Article IV staff reports, no balance of payments accounting, and no official GDP growth estimates.

### 2.11 UNESCO Institute for Statistics (UIS)
- **Data availability**: Only unverified state-reported administrative claims.
- **Claims**: 100% adult literacy (reported continuously since the 1980s); 100% gross primary school enrollment (12-year compulsory education); pupil-teacher ratio primary ~23.
- **Comparability**: Not meaningfully comparable to international literacy benchmarks because DPRK figures are political assertions without standard testing (e.g. PIRLS/PISA).

### 2.12 Maddison Project Database (GGDC)
- **Status**: The premier academic dataset for long-run economic history.
- **Coverage for DPRK**: 1820 to 2022.
- **Latest point**: 2022: $1,568.85 (in 2011 international-$ PPP).
- **Comparison**: South Korea in 2022 was $44,000+; China was $18,000+; Japan was $41,000+; World average was $16,000+.
- **Pull**: Available directly via OWID `gdp-per-capita-maddison`.

### 2.13 Penn World Table (PWT)
- **Status**: PWT 10.01 EXCLUDES North Korea entirely.
- **Why**: PWT requires benchmark price data from the World Bank's International Comparison Program (ICP). Because North Korea has never participated in ICP price surveys and publishes no national accounts, PWT excludes the DPRK.

### 2.14 Varieties of Democracy (V-Dem Institute)
- **Coverage**: 1945 to 2025 (v14/v15 release). DPRK country code `PRK` (id 111).
- **Latest 2025 scores**:
  - Electoral Democracy Index (v2x_polyarchy): 0.083 / 1.0 (bottom 3 globally; ROK 0.82, JPN 0.81, CHN 0.07).
  - Liberal Democracy Index (v2x_libdem): 0.014 / 1.0 (ROK 0.78, JPN 0.76, CHN 0.02).
  - Political Corruption Index (v2x_corr): 0.67 / 1.0 (ROK 0.16, JPN 0.14, CHN 0.58).
  - Civil Liberties Index: 0.038 / 1.0. Freedom of Expression: 0.045 / 1.0.

### 2.15 Freedom House (Freedom in the World)
- **Coverage**: 1973 to 2024 annual.
- **Latest 2024 score**: 3/100 (Political Rights: 0/40, Civil Liberties: 3/60, Status: Not Free).
- **Comparison**: South Korea 83/100 (Free), Japan 96/100 (Free), China 9/100 (Not Free).
- **Pull**: Downloadable Excel from Freedom House.

### 2.16 Reporters Without Borders (RSF World Press Freedom Index)
- **Coverage**: 2002 to 2024 annual.
- **Latest 2024 score/rank**: Score 12.72/100, Rank 177/180 (only Eritrea at 180, Syria at 179, and Afghanistan at 178 score lower).
- **Comparison**: South Korea Rank 62 (Score 64.8), Japan Rank 70 (62.1), China Rank 172 (14.8).

### 2.17 Economist Intelligence Unit (EIU) Democracy Index
- **Coverage**: 2006 to 2024 annual.
- **Latest 2023/2024 score/rank**: Score 1.08/10, Rank 165/167 (Authoritarian category; Electoral process 0.00, Functioning of government 2.50, Political participation 1.67, Political culture 1.25, Civil liberties 0.00). Only Myanmar (0.85) and Afghanistan (0.26) rank lower.
- **Comparison**: South Korea 8.09/10 (Full Democracy, Rank 24), Japan 8.40/10 (Rank 16), China 2.12/10 (Rank 148).

### 2.18 Open Doors World Watch List
- **Coverage**: 1993 to 2026 annual.
- **Latest 2025/2026 score/rank**: Score 98/100, Rank #1 in the world (Extreme Persecution).
- **Track record**: North Korea has ranked #1 in the world for 23 consecutive years (briefly overtaken by Afghanistan in 2022).

### 2.19 Walk Free Global Slavery Index (GSI)
- **Coverage**: 2014, 2016, 2018, 2023 editions.
- **Latest 2023 score/rank**: Prevalence of 104.6 per 1,000 population (over 10% of the population, ~2,696,000 individuals).
- **Global standing**: Rank #1 in the entire world. Government response rating is -1/100 (worst on earth, indicating the state itself is the primary perpetrator of forced labor).

### 2.20 Fund for Peace Fragile States Index (FSI)
- **Coverage**: 2006 to 2024 annual across 179 countries.
- **Latest 2024 score/rank**: Score 99.5/120, Rank 22/179 (Alert category).
- **Comparison**: South Korea 31.5 (Rank 159, Very Sustainable), Japan 30.5 (Rank 161), China 68.4 (Rank 94).
- **Sub-indicators**: DPRK scores 9.5/10 in Human Rights, 9.3/10 in State Legitimacy, 9.0/10 in Security Apparatus, and 9.8/10 in External Intervention.

### 2.21 Global Hunger Index (GHI)
- **Coverage**: 2000, 2008, 2015, 2024.
- **Latest 2024 score**: Score 24.8 (Serious hunger category, Rank ~100/127).
- **Pillars**: Combines undernourishment (45.5%), child stunting (16.8%), child wasting (2.3%), and child mortality (1.7%).
- **Comparison**: South Korea <5 (Low), Japan <5 (Low), China <5 (Low). DPRK is the only country in East Asia in the Serious bracket.

### 2.22 Human Freedom Index (Cato Institute & Fraser Institute)
- **Status**: The Human Freedom Index OMITS North Korea from its overall index rankings.
- **Why**: The Economic Freedom of the World (EFW) sub-index requires property rights, judicial independence, sound money, and trade openness data, none of which exist for the DPRK. The report notes North Korea qualitatively as the unmeasured bottom anchor of world freedom.

### 2.23 Transparency International Corruption Perceptions Index (CPI)
- **Coverage**: 2012 to 2024 annual.
- **Latest 2024 score/rank**: Score 15/100, Rank ~172/180.
- **Comparison**: South Korea 63/100 (Rank 32), Japan 73/100 (Rank 16), China 42/100 (Rank 76), Denmark 90/100 (Rank 1).
- **Pull**: Directly accessible via OWID `ti-corruption-perception-index`.

---

## 3. What We Should Scrape and Centralize Ourselves

While OWID and the UN publish demography and governance well, several critical global series are poorly maintained or fragmented:

1. **FAOSTAT Normalized Harvest Series**: The FAOSTAT API frequently 521s and times out. We should scrape and store the annual grain production series (Rice, Maize, Wheat, Potatoes, Soybeans) in clean JSON so readers can inspect 64 years of harvest data without touching FAO's 33 MB bulk files.
2. **WHO Global TB Notification & Resistance Series**: WHO hosts this inside a legacy ASP endpoint (`extranet.who.int/tme/generateCSV.asp?ds=estimates`). We should cache the DPRK TB notification rate (2000-2024) and drug resistance figures directly in our data pipeline.
3. **Walk Free Global Slavery Breakdown**: Walk Free buries its country data inside multi-megabyte Excel workbooks across separate edition years (2014, 2016, 2018, 2023). Centralizing the four editions into a single time series showing North Korea's persistent #1 global rank is a high-impact visual opportunity.
4. **Fund for Peace 12 Fragility Pillars**: FSI publishes separate Excel files for each year (2006 to 2024). We should concatenate the 19 annual files into a clean multi-dimensional time series tracking North Korea's 12 sub-scores (Human Rights, Security Apparatus, Factional Elites, etc.).
5. **Open Doors 30-Year Persecution Series**: Currently scattered across annual PDF reports and web articles. Creating a unified 1993-2026 table showing North Korea's 23 consecutive years as #1 would be unique on the web.

---

## 4. Gaps Where No Real Global Data Exists

Honest research must document where international data is an illusion:

1. **Real GDP and Economic Growth Accounts**: The IMF, World Bank, and UN have no independent national accounts for North Korea. All global GDP figures (including Maddison Project) are models built upon estimates by South Korea's Bank of Korea (BOK), which computes DPRK GDP from physical volume proxies.
2. **Inflation and Consumer Prices**: No international organization publishes a North Korean CPI (Consumer Price Index). Market price series exist only through defector NGO surveys and Daily NK market reporting.
3. **Labor Inspection and Fair Wages**: ILO has zero inspection access; all ILOSTAT figures for DPRK are purely mathematical demographic models.
4. **Independent Education and Literacy Data**: UNESCO merely reproduces the regime's claim of 100% literacy without standard international testing verification.
5. **Post-2019 Food Balance Sheets**: FAO undernourishment estimates (PoU) stopped after 2019 because the regime ceased submitting agricultural balance sheets during the pandemic.

---

## 5. Safety and Ethics Rules

When visualizing global data on North Korea:
- **No Individual Witness Identification**: Macro time series and national indices present no risk to individual defectors or sources inside North Korea.
- **Contextualize State-Reported Numbers**: Never display DPRK government health assertions (e.g. "99% vaccination coverage in 2021" or "0% poverty") without prominent editorial notes explaining the lack of independent verification and verified border quarantine stockouts.
- **Distinguish Estimates from Census Counts**: The 1993 and 2008 UNFPA censuses are the only modern nationwide headcounts. All intermediate years in UN WPP and World Bank datasets are demographic cohort-component projections.

---

## 6. Summary of Findings

1. **41 time series** across 23 global institutions were audited, tested with automated probes, and cataloged in `docs/research/charts/global.json`.
2. **Our World in Data (OWID)** maintains over 30 charts with verified DPRK data, pullable directly via CSV and metadata endpoints.
3. **UN WPP 2024** provides unbroken annual demographic data from 1950 to 2100, revealing a 10.7-year life expectancy gap between North and South Korea (73.7 vs 84.4 years in 2024).
4. **World Bank WDI** has extensive demographic, health, and electricity access data (61.4% in 2024), but completely excludes DPRK GDP, trade, and national accounts.
5. **FAOSTAT bulk downloads** reveal 64 continuous years of grain production: 2024 total cereal harvest was 4.89M tonnes, well below the 5.5M tonne national minimum requirement.
6. **WHO Global TB Programme** tracks North Korea's severe tuberculosis epidemic (269 cases per 100,000 in 2024, or ~71,000 cases/year, 7x higher than South Korea).
7. **Maddison Project Database** demonstrates a 28x real GDP per capita divergence between North Korea ($1,569) and South Korea ($44,000+) between 1950 and 2022.
8. **Walk Free Global Slavery Index** ranks North Korea #1 in the world, with 104.6 per 1,000 people (~2.7 million individuals) trapped in state-imposed forced labor.
9. **Penn World Table, IMF WEO, and Human Freedom Index** completely omit North Korea due to the total absence of ICP price surveys, official national accounts, or economic freedom metrics.
10. **Global governance indices** (V-Dem, Freedom House, RSF, EIU, TI CPI, Open Doors) uniformly rank North Korea in the bottom 1 to 3 nations on earth across democracy, press freedom, corruption, and human rights.
