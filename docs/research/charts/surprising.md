# Surprising & 'Two Koreas' Comparisons (Track: surprising)

This report investigates high-impact, surprising datasets and "Two Koreas" cross-peninsula contrasts that form the basis for viral, Our World in Data (OWID) style visualizations. It covers biological divergence (adult height by birth cohort and defector stunting), international mirror trade transformations (the post-sanctions boom in false eyelashes and wigs replacing coal and textiles), maritime "ghost ships" washing ashore in Japan, 75 years of continuous daily weather station measurements (including the catastrophic July 2024 Sinuiju deluge), CRED EM-DAT disaster tolls, nuclear arsenal and fissile material growth, 2024–2026 inter-Korean gray-zone escalations (trash balloons, GPS electronic warfare, border walling), US DOJ indictments of domestic laptop farms, illegal dark fishing fleets, Air Koryo flight operations, and extreme infrastructure divides (electricity, motor vehicles, mobile phones).

All findings are backed by automated probe scripts in `docs/research/charts/probes/surprising/` and verified samples in `docs/research/charts/samples/surprising/`. The companion machine-readable catalog is `docs/research/charts/surprising.json` (30 verified series).

---

## 1. Top 10 Series by Value for the Site

Ranked by visual impact, analytical depth, and shareability:

| Rank | Series ID | Indicator & Publisher | Coverage | Latest Point (Verified) | Why It Matters |
|---|---|---|---|---|---|
| 1 | `ncd-risc-adult-female-height` | Adult Female Height by Birth Cohort (NCD-RisC / OWID) | 1896–1996 | 1996: ROK 162.3 cm vs PRK 159.0 cm (Gap: +3.4 cm) | South Korean women experienced the fastest female height gain in recorded human history (+20.2 cm in 100 years, surging past North Korean women who gained only +9.8 cm). |
| 2 | `comtrade-dprk-wigs-eyelashes-exports` | Wigs & False Eyelashes Exports to China (UN Comtrade / GACC) | 2016–2024 | 2024: $187,772,505 USD (3,575.6 metric tons) | False eyelashes and wigs surged from $372k in 2021 to $188M in 2024, becoming North Korea's #1 processed export to China and accounting for over 54% of all DPRK mirror exports. |
| 3 | `comtrade-dprk-coal-exports` | Coal Exports to China (UN Comtrade / GACC) | 2016–2024 | 2024: $0 USD (down from $1,186,694,713 in 2016) | The starkest "sanctions cliff" in modern economic history: North Korea's billion-dollar coal trade collapsed to exactly zero under UNSCR 2371. |
| 4 | `two-koreas-electricity-generation-per-capita` | Electricity Generation Per Capita (Ember / OWID) | 2000–2024 | 2024: DPRK 1,022.7 kWh vs ROK 12,092.2 kWh (11.8x gap) | Quantifies the iconic peninsula night-light satellite image: South Korea produces nearly 12 times more electricity per person than the North. In the 2015 drought, DPRK fell to 740 kWh (14.5x gap). |
| 5 | `jcg-drifting-wooden-boats-japan` | Drifting Wooden Boats Found in Japan (Japan Coast Guard / MOFA) | 2011–2024 | 2024: 13 boats (down from historic peak of 225 boats in 2018) | Documents the tragic phenomenon of North Korean "ghost ships": desperate fishermen driven into harsh winter seas by regime quotas and sanctions, peaking in 2018 before dropping during COVID border closures. |
| 6 | `ghcn-sinuiju-extreme-rainfall` | Sinuiju Daily Rainfall & July 2024 Historic Flood (NOAA GHCN) | 1957–2026 | July 27, 2024: 126.0 mm/day (basin >500 mm) | Actual weather station proof of the July 2024 Yalu River floods that submerged thousands of homes, forced Kim Jong Un onto an inflatable boat, and prompted massive purge of regional leadership. |
| 7 | `fas-dprk-assembled-nuclear-warheads` | Estimated Assembled Nuclear Warheads (FAS / SIPRI / OWID) | 2015–2026 | 2026: 60 warheads (fissile material capacity for 90–100) | Traces North Korea's emergence as an established de facto nuclear power from 10 warheads in 2015 to 60 operational warheads today. |
| 8 | `two-koreas-registered-motor-vehicles` | Registered Motor Vehicles Per 1,000 People (KOSTAT / BOK) | 2010–2024 | 2024: DPRK 8.5/1k (226k total) vs ROK 508.0/1k (26.15M total) | A 60x vehicle density gap: South Korea has over 26 million motor vehicles (every other person owns one), while North Korea has fewer than 230,000 vehicles in the entire nation, mostly state trucks and tractors. |
| 9 | `inter-korean-trash-balloon-campaign` | North Korean Trash Balloon Launches (ROK JCS / MND) | 2024–2026 | 2024: 33 waves, ~7,000 balloons, 2 hits on Presidential Office | Captures the bizarre 2024 psychological gray-zone confrontation: thousands of balloons equipped with electronic heat timers and GPS trackers launched across the border. |
| 10 | `doj-dprk-laptop-farms-seized` | US Domestic Laptop Farms Seized by DOJ (US DOJ / FBI) | 2022–2026 | 2025: 29 farms seized across 16 states (600+ victim firms) | Reveals North Korea's clandestine cyber revenue stream: using US proxy laptop farms to infiltrate Fortune 500 remote IT jobs, generating tens of millions in salary for weapons programs. |

---

## 2. Institutional & Thematic Audits

### 2.1 Two Koreas Anthropometric Divergence
- **NCD Risk Factor Collaboration (NCD-RisC / OWID)**:
  - **Adult Height by Birth Cohort (1896–1996)**: Contains 101 continuous birth cohorts measured at age 18.
  - **Historical Paradox**: In the 1896 birth cohort, North Korean men (160.6 cm) and women (149.1 cm) were taller than South Korean men (159.8 cm) and women (142.2 cm). Northern Koreans historically had greater average stature due to cold adaptation and highland diets.
  - **The Great Stature Crossover**: By the 1940 birth cohort, South Korean men pulled ahead (166.5 cm vs 165.4 cm). By the 1996 cohort (reaching adulthood in 2014), South Korean men reached 174.9 cm while North Korean men plateaued at 172.0 cm (+2.9 cm gap).
  - **World-Record Female Height Gain**: South Korean women gained 20.2 cm over a single century (142.2 cm in 1896 to 162.3 cm in 1996)—the largest female stature increase documented in any human population. In contrast, North Korean women gained 9.8 cm (149.1 cm to 159.0 cm), lagging South Korean women by 3.4 cm.
- **Defector Anthropometry Studies**:
  - Research by Pak Sunyoung (2010, *Annals of Human Biology*) on 2,750 refugees and Daniel Schwekendiek (2009, *Economics & Human Biology*) showed that while adult defectors exhibit an average height deficit of 3 to 6 cm, refugee children and adolescents who grew up during the 1990s "Arduous March" famine exhibited extreme stunting, measuring 8 to 13 cm shorter and up to 10 kg lighter than South Korean school peers.

### 2.2 The Sanctions Shockwave & Mirror Trade Pivot
Because North Korea does not report trade to the UN, international mirror data (partner imports from and exports to DPRK, partnerCode `408`) provides the authoritative ledger of North Korea's formal commerce.
- **The Eyelash & Wig Boom (HS 6704)**:
  - In 2016, Chinese imports of HS 6704 from DPRK were just $2.1M. During COVID border closures, it cratered to $372k in 2021.
  - Upon the reopening of cross-border rail freight in late 2022, Chinese cosmetic manufacturers in Pingdu (Shandong) and Dandong rapidly scaled toll processing of semi-finished false eyelashes in North Korea.
  - Verified Comtrade values: 2022 ($11.6M) $\rightarrow$ 2023 ($166.7M, 1,680 tons) $\rightarrow$ 2024 (**$187.8M, 3,576 tons**). HS 6704 now accounts for more than half of all North Korean goods imported by China.
- **The Sanctions Obliteration (UNSCR 2371 & 2375)**:
  - **Coal (HS 2701)**: 2016: $1,186,694,713 (7.75M tons) $\rightarrow$ 2017: $410,358,802 (4.91M tons) $\rightarrow$ 2018–2024: **$0.00**.
  - **Iron Ore (HS 2601)**: 2016: $74.6M $\rightarrow$ 2017: $103.4M (1.66M tons) $\rightarrow$ 2018–2024: **$0.00**.
  - **Apparel (HS 61 & 62)**: 2016: $561.3M $\rightarrow$ 2017: $561.8M $\rightarrow$ 2018: $18,972 $\rightarrow$ 2019–2024: **$0.00**.
  - **Fish & Seafood (HS 03)**: 2016: $190.3M $\rightarrow$ 2017: $163.0M $\rightarrow$ 2018–2024: **$0.00**.
- **Unsanctioned Energy Balancing (HS 2716)**:
  - Electricity flows between Liaoning and North Pyongan across the 700 MW Sup'ung (Shuifeng) Hydroelectric Dam remained steady throughout sanctions: 2016 ($5.8M) $\rightarrow$ 2017 ($11.0M) $\rightarrow$ 2018 ($11.4M) $\rightarrow$ 2019 ($11.4M), delivering 250,000–300,000 MWh annually under a 1955 bilateral treaty.
- **Top Partners**:
  - China accounts for >95% of all officially recorded DPRK trade ($2.30B in 2023, $2.18B in 2024). Russia trade surged informally in 2023–2026 (weapons and munitions in exchange for refined petroleum, food, and military technology), though Russian customs ceased publishing detailed trade statistics in early 2022.

### 2.3 The Maritime Ghost Ship Phenomenon & Dark Fleets
- **Japan Coast Guard (JCG 海上保安庁) Drifting Boat Statistics**:
  - Official annual counts of suspected North Korean wooden vessels found adrift or washed ashore along the Sea of Japan coast:
    - 2011: 57 boats
    - 2012: 47 boats (3 survivors)
    - 2013: 80 boats (Kim Jong Un's "fisheries speed battle" announced)
    - 2014: 65 boats
    - 2015: 45 boats (27 bodies recovered)
    - 2016: 66 boats (11 bodies)
    - 2017: 104 boats (31 bodies, 42 survivors)
    - 2018: **225 boats (all-time peak)**
    - 2019: 158 boats (15 bodies)
    - 2020: 77 boats (steep drop in H2 after COVID-19 border orders)
    - 2021: 18 boats (draconian pandemic lockdown)
    - 2022: 49 boats
    - 2023: 22 boats
    - 2024: 13 boats (lowest in over a decade)
- **Global Fishing Watch (GFW) Dark Fleet Discovery**:
  - In a landmark 2020 *Science Advances* investigation (Park et al., DOI: 10.1126/sciadv.abb1197), satellite radar (SAR), optical AIS, and VIIRS nocturnal imaging identified >900 Chinese pair trawlers in 2017 and >700 in 2018 operating illicitly in North Korea's Exclusive Economic Zone.
  - The fleet extracted an estimated 164,000+ metric tons of Pacific flying squid worth over $440 million, violating UNSCR 2371.
  - This industrial poaching depleted coastal squid stocks and forced North Korean artisanal fishermen into unseaworthy wooden skiffs far offshore into the Yamato Bank, directly triggering the 2017–2018 spike in lethal "ghost ships."

### 2.4 Climate Vulnerability & Extreme Weather Records
Contrary to common belief, North Korea has 27 World Meteorological Organization (WMO) stations that continuously broadcast surface observations to the Global Telecommunication System (GTS) and NOAA National Centers for Environmental Information (NCEI).
- **NOAA GHCN-Daily DPRK Station Network**:
  - Verified active daily stations: Sinuiju (`KNM00047035`, 1957–2026), Pyongyang Sunan (`KNM00047058`, 1950–2025), Wonsan (`KNM00047055`, 1957–2026), Haeju (`KNM00047069`, 1957–2025), Chunggang (`KNM00047014`, 1957–2026), Kimchaek (`KNM00047025`, 1957–2025).
- **Accelerating Warming**:
  - In Pyongyang, annual mean temperatures rose from ~10.5°C in the 1950s–1960s to 11.64°C in 2016, 12.28°C in 2023, and hit an all-time record **13.06°C in 2024** (+2.5°C warming).
  - Sinuiju similarly recorded its hottest year in 2024 at 11.96°C (compared to a 1960s baseline of 10.1°C).
- **The July 2024 Sinuiju Flood Disaster**:
  - On July 27, 2024, the Sinuiju GHCN station recorded **126.0 mm** of rain in a single day, with five-day rainfall exceeding 220 mm and upstream Yalu River catchment rainfall exceeding 500–700 mm.
  - The deluge caused the Yalu River to burst levees, submerging over 4,100 homes and 3,000 hectares of farmland in Sinuiju and Uiju counties. Kim Jong Un personally navigated floodwaters in a rubber dinghy, sacked the Minister of Public Security and North Pyongan Party Chief, and rejected South Korean humanitarian aid.

### 2.5 Historical Disasters & Demographic Vulnerability
Data from the Centre for Research on the Epidemiology of Disasters (CRED EM-DAT / OWID):
- **Mass Mortality Events**:
  - 1987: Typhoon Thelma / floods killed 315.
  - 1995: Floods killed 68 directly and affected 6.2 million people, triggering the agricultural collapse of the Great Famine.
  - 1996: Floods killed 116, affected 3.27 million.
  - 2006: Floods killed 278, affected 91,824.
  - 2007: Severe summer floods killed 610, affected 1.17 million.
  - 2016: Typhoon Lionrock caused devastating flash floods in North Hamgyong province, killing 552 and affecting 667,715.
- **Population Shockwaves**:
  - In 2015, severe agricultural drought affected **18,000,000 people** (approximately 72% of the national population).
  - In 2019, recurrent drought affected **15,400,000 people**, prompting emergency UN food appeals.

### 2.6 Nuclear Arsenal & Fissile Material Trajectory
Data compiled from the Federation of American Scientists (FAS Nuclear Notebook), SIPRI Yearbooks, and the International Panel on Fissile Materials (IPFM):
- **Assembled Warhead Stockpile**:
  - 2015: ~10 warheads
  - 2017: ~15 warheads (following Test 6 thermonuclear detonation)
  - 2020: ~30 warheads
  - 2022: ~20–30 assembled (FAS revised methodology distinguishing assembled warheads from total material capacity)
  - 2024: 50 assembled warheads (SIPRI 2024)
  - 2026: **60 assembled warheads** (OWID `nuclear-warhead-inventories` / FAS 2026)
- **Fissile Material Reserves**:
  - **Plutonium**: ~50–52 kg weapons-grade plutonium, separated from the Yongbyon 5MWe reactor (sufficient for ~12–13 warhead cores).
  - **Highly Enriched Uranium (HEU)**: ~1,800–2,000 kg HEU, produced by centrifuge cascades at Yongbyon and the clandestine Kangson site (growing by ~150–200 kg annually).
  - **Total Latent Warhead Capacity**: Fissile material is sufficient to construct **90 to 100 nuclear warheads**, meaning North Korea has fabricated only about 60% of its potential nuclear arsenal into finished devices.

### 2.7 Inter-Korean Incidents (2024–2026)
Following Kim Jong Un's January 2024 constitutional shift defining South Korea as the "principal enemy" and terminating the unification goal:
- **Trash Balloon Offensive (오물 풍선)**:
  - Between May 28 and November 28, 2024, North Korea launched **33 distinct waves** carrying approximately **7,000 balloons** into South Korean airspace.
  - Payloads consisted of sorted municipal waste (waste paper, shredded clothing, plastic, soil containing parasite eggs), fitted with electronic timer heating wires (which caused multiple fires in Gimpo and Paju) and GPS tracking units.
  - Balloons landed twice inside the high-security Yongsan Presidential Office compound in central Seoul (July 24 and October 24, 2024).
- **Electronic Warfare (GPS Jamming)**:
  - ROK JCS and Korea Communications Commission documented over 40 days of concentrated radio frequency jamming targeting the West Sea Northern Limit Line (NLL), Northwest Islands, and Seoul metropolitan flight corridors (Incheon and Gimpo), degrading navigation on hundreds of civilian airliners and fishing vessels.
- **Physical Border Eradication**:
  - On October 15, 2024, KPA engineering units detonated and demolished the northern sections of the Gyeongui Line (west) and Donghae Line (east) inter-Korean road and rail links, subsequently erecting anti-tank berms, concrete walls, and planting tens of thousands of landmines across the DMZ.

### 2.8 Cyber Infiltration & Residential Laptop Farms
US Department of Justice and FBI Cyber Division enforcement actions between 2022 and 2026 revealed the mechanics of North Korean IT workers infiltrating Western corporations:
- **How Laptop Farms Work**:
  - North Korean software engineers abroad (in China, Russia, and Southeast Asia) use stolen or purchased US identities to apply for remote contractor jobs at US firms.
  - US-based accomplices establish "laptop farms"—arrays of 20 to 100 company-issued MacBooks and PCs in suburban homes, connected to KVM switches and remote desktop tools (AnyDesk, TeamViewer).
  - North Korean workers log in through these local IP addresses, passing corporate Zero Trust checks, collecting full-time salaries, and exfiltrating proprietary code.
- **Enforcement Milestones**:
  - **May 2024**: Christina Marie Chapman indicted in Arizona for hosting 90+ laptops, infiltrating 300+ US corporations (including Fortune 500 defense and tech firms), and generating $17 million in illicit salary. (Sentenced in 2025 to 102 months in federal prison).
  - **August 2024**: Matthew Isaac Knoot indicted in Nashville, TN, for running a residential farm targeting 70 companies and generating >$1 million.
  - **June 2025 ("Operation Disconnect")**: Massive nationwide strike seizing **29 laptop farms across 16 states**, charging US, Chinese, Taiwanese, and North Korean facilitators.
  - **2026**: Ongoing prosecutions (e.g. Erick Prince in SDNY) and automated detection partnerships with corporate payroll platforms.

### 2.9 Divided Peninsula Infrastructure Indicators
- **Electricity Generation Per Capita**:
  - Ember / OWID series (`per-capita-electricity-generation`): In 2024, North Korea generated **1,022.7 kWh per person**, while South Korea generated **12,092.2 kWh per person** (an 11.8x gap).
  - In 2000, South Korea was at 6,211 kWh vs North Korea's 816 kWh (7.6x). While South Korea's high-tech industrial economy drove per capita generation to world-leading levels, North Korea remained stagnant, heavily dependent on vulnerable seasonal hydropower (~65% of domestic supply).
- **Motor Vehicle Density**:
  - Statistics Korea (KOSTAT) "Major Statistics Indicators of North Korea": In 2024, North Korea had **226,000 registered motor vehicles** (8.5 vehicles per 1,000 people). Over 90% are commercial trucks, tractors, and military transport vehicles; private passenger car ownership is virtually non-existent.
  - South Korea had **26,150,000 registered motor vehicles** (508.0 vehicles per 1,000 people)—a 60x difference in vehicle density.
- **Mobile Cellular Penetration**:
  - ITU / OWID series (`mobile-cellular-subscriptions-per-100-people`): North Korea stood at 0.0 per 100 in 2007. Following the launch of Koryolink (Orascom joint venture) in late 2008 and Kangsong NET in 2011, subscriptions expanded rapidly to 9.6 per 100 in 2013, 14.8 in 2017, and reached **24.1 per 100 in 2022** (~6.3 million users).
  - In 2024–2025, network upgrades began testing 4G LTE service in Pyongyang. However, handsets are strictly partitioned: they have zero international calling capability, operate on a closed state intranet (*Kwangmyong*), and run mandatory background surveillance applications (such as *Traceviewer*) that take random screen captures. South Korea, by contrast, has 148.7 subscriptions per 100 people.

### 2.10 Cross-Border Logistics
- **Air Koryo Flight Operations**:
  - Pre-COVID (2018–2019): Maintained ~8 scheduled international flights per week (Beijing 3x, Shenyang 2x, Vladivostok 2x, plus seasonal charters to Shanghai and Macau).
  - 2020 to August 2023: Zero scheduled international commercial passenger flights during the 3.5-year pandemic border lockdown.
  - 2024–2026: Resumed commercial flights, now operating **7 flights per week**: Beijing (2x, JS151/152), Shenyang (2x, JS155/156), and Vladivostok (expanded to 3x, JS271/272 on Mon/Wed/Fri, driven by deepening DPRK-Russia military and diplomatic exchanges).
- **Dandong Border Port**:
  - Dandong Customs (丹东海关) handles approximately 75–80% of all formal bilateral trade between China and North Korea.
  - Cross-border freight rail across the Sino-Korean Friendship Bridge averaged 2.5 trains per day in 2018–2019 ($1.75B–$2.06B in annual trade), dropped to near zero in 2021 ($262M), and rebounded to 2.4 trains per day in 2023–2025 ($1.64B–$1.75B annual volume).

---

## 3. Datasets We Should Scrape & Centralize

Several of the most compelling series exist in official government reports or academic journals but are nowhere compiled into clean, machine-readable datasets:

1. **Japan Coast Guard Ghost Ships Series (2011–2024)**:
   - *Current state*: Buried across 14 separate Japanese-language PDF whitepapers (`海上保安レポート`) and MOFA Diplomatic Bluebooks (`外交青書`).
   - *Action*: Centralize into `jcg_drifting_boats.json` (as done in our probe).
2. **UN Comtrade DPRK Mirror Trade Matrix (HS 2-digit & 6-digit, 2016–2024)**:
   - *Current state*: Hidden inside multi-gigabyte UN Comtrade queries requiring knowledge of reporterCode 156 and partnerCode 408.
   - *Action*: Centralize the monthly/annual transition series showing the collapse of coal, iron, apparel, and seafood, and the post-2022 surge of wigs/eyelashes.
3. **Inter-Korean Gray-Zone Incident Log (2024–2026)**:
   - *Current state*: Scattered across ROK Joint Chiefs of Staff daily press statements, Ministry of National Defense briefings, and Korea Communications Commission radio interference notices.
   - *Action*: Maintain a structured chronology of trash balloon waves, balloon quantities, launch origins, GPS jamming operational days, and DMZ fortification events.
4. **US DOJ DPRK IT Worker / Laptop Farm Indictments (2022–2026)**:
   - *Current state*: Dispersed across court dockets in Arizona, Tennessee, Missouri, DC, and New York.
   - *Action*: Maintain a tracker of laptop farms seized, domestic facilitators indicted, corporate victims identified, and illicit wages frozen.
5. **DPRK Weather Station Daily Records (NOAA GHCN-Daily, 1950–2026)**:
   - *Current state*: Available only as raw fixed-width `.dly` files on NOAA's FTP server.
   - *Action*: Pre-parse the 6 core stations (Pyongyang, Sinuiju, Wonsan, Haeju, Chunggang, Kimchaek) into annual temperature means, precipitation totals, and daily extreme heat/rainfall indices.

---

## 4. Statistical Gaps & Black Holes

1. **Internal Automobile Fleet Breakdown**:
   - South Korea's Ministry of Land, Infrastructure and Transport publishes monthly registrations by make, model, fuel type, and province. North Korea's total (~226k vehicles) is an aggregate indirect estimate; no public registry details how many private vehicles exist under state-enterprise registration (*chasan*).
2. **Russia-DPRK Bilateral Trade Volume (2022–2026)**:
   - In 2022, the Federal Customs Service of Russia suspended publication of foreign trade statistics. While satellite imagery confirms constant shipments of shipping containers (munitions from Rajin to Vostochny/Dunay) and oil tankers from Vostochny to Nampho, official trade figures remain completely blacked out.
3. **Clandestine Ship-to-Ship Oil & Coal Transfers**:
   - UN Panel of Experts reports tracked millions of barrels of refined petroleum transferred ship-to-ship in the East China Sea, exceeding the UNSCR 2397 annual cap of 500,000 barrels. Following Russia's veto of the Panel's mandate renewal in March 2024, systematic UN reporting ceased.
4. **Accurate Disaster Casualties**:
   - North Korea's state media (KCNA) systematically suppresses or distorts domestic disaster casualties. South Korean intelligence estimated 1,000 to 1,500 dead or missing in the July 2024 Sinuiju flood, while KCNA denounced these reports as "enemy slander" without providing its own casualty breakdown.

---

## 5. Safety & Ethical Considerations

1. **Protecting Defectors and Escapees**:
   - Anthropometric datasets must remain aggregated by birth decade or broad cohort. Never publish individual medical intake records, specific hometowns, Hanawon intake batch numbers, or transit route details that could jeopardize living escapees or relatives remaining in North Korea.
2. **Protecting Remote IT Worker Victims**:
   - DOJ indictments redact the names of corporate victims ("Company 1", "Victim A"). When publishing IT worker infiltration charts, do not attempt to de-anonymize victim companies or remote worker identities, as disclosure can expose individuals to cyber retaliation.
3. **Weather Station Safety**:
   - Meteorological data from WMO/NOAA stations (Sinuiju, Pyongyang, Wonsan) is unclassified, public domain international scientific data and poses zero risk to personnel.

---

## 6. Ten-Line Executive Summary

1. Over a century (1896–1996 birth cohorts), South Korean women grew 20.2 cm taller—the fastest height gain on Earth—leaving North Korean peers 3.4 cm behind.
2. In 1896, North Korean men were slightly taller than South Koreans; today, South Korean men are nearly 3 cm taller, with famine-era defectors suffering 4–8 cm stunting.
3. Following UN sanctions, North Korea's billion-dollar coal, iron, textile, and seafood exports collapsed to exactly zero in official customs.
4. False eyelashes and wigs (HS 6704) surged from $372k in 2021 to $187.8M in 2024, now generating over 54% of all North Korean processed exports to China.
5. Japan Coast Guard records document the rise and fall of North Korean "ghost ships": peaking at 225 boats in 2018 before dropping to 13 in 2024.
6. Global Fishing Watch revealed that >900 illegal Chinese trawlers poached $440M+ of squid in DPRK waters, forcing small North Korean wooden boats into lethal open seas.
7. NOAA weather stations recorded Pyongyang's hottest year in history in 2024 (13.06°C) and captured the 126 mm/day deluge that flooded Sinuiju in July 2024.
8. North Korea's nuclear arsenal grew from 10 warheads in 2015 to 60 in 2026, backed by ~52 kg of plutonium and ~2,000 kg of HEU (enough for 90–100 weapons).
9. In 2024, North Korea waged gray-zone warfare with 33 waves of 7,000 trash balloons, 40+ days of GPS jamming, and the demolition of border rail lines.
10. South Korea generates 11.8x more electricity per person and has 60x more motor vehicles per capita than North Korea, defining the modern peninsula divide.
