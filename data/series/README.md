# Chart datasets

Clean, dated time series about North Korea, rebuilt every week by `scripts/build-series.ts` and shown on
[liberatenorthkorea.org/data](https://liberatenorthkorea.org/data). Each CSV is tidy: `entity,time,value`.
Country entities use ISO codes (PRK North Korea, KOR South Korea, CHN China, JPN Japan, WLD world).

Please credit the original source listed for each series, plus this project if our processing helped.

| Series | Unit | Latest | Source | Fetched |
| --- | --- | --- | --- | --- |
| [Armed forces personnel](csv/armed-forces.csv) | people | 2020 | [The Military Balance - International Institute for Strategic Studies, via World Bank (2026), via Our World in Data](https://ourworldindata.org/grapher/armed-forces-personnel) | 2026-10-05 |
| [Food available per person per day](csv/calories.csv) | kcal | 2023 | [Food and Agriculture Organization of the United Nations (2025) and other sources, via Our World in Data](https://ourworldindata.org/grapher/daily-per-capita-caloric-supply) | 2026-10-05 |
| [Cereal yield](csv/cereal-yield.csv) | tonnes per hectare | 2024 | [Food and Agriculture Organization of the United Nations (2025), via Our World in Data](https://ourworldindata.org/grapher/cereal-yield) | 2026-10-05 |
| [Children who die before their fifth birthday](csv/child-mortality.csv) | % | 2024 | [United Nations Inter-agency Group for Child Mortality Estimation (2025), via Our World in Data](https://ourworldindata.org/grapher/child-mortality-igme) | 2026-10-05 |
| [Civil liberties index (V-Dem)](csv/civil-liberties.csv) | index, 0 to 1 | 2025 | [V-Dem (2026), via Our World in Data](https://ourworldindata.org/grapher/human-rights-index-vdem) | 2026-10-05 |
| [CO₂ emissions per person](csv/co2-per-person.csv) | tonnes | 2024 | [Global Carbon Budget (2025); Population based on various sources (2024), via Our World in Data](https://ourworldindata.org/grapher/co-emissions-per-capita) | 2026-10-05 |
| [North Koreans arriving in South Korea each year, by sex](csv/defector-arrivals.csv) | people | 2025 | [Ministry of Unification (South Korea), 북한이탈주민 주요 현황](https://www.data.go.kr/data/15106185/fileData.do) | 2026-10-05 |
| [Electoral democracy index (V-Dem)](csv/democracy.csv) | index, 0 to 1 | 2025 | [V-Dem (2026), via Our World in Data](https://ourworldindata.org/grapher/electoral-democracy-index) | 2026-10-05 |
| [People with access to electricity](csv/electricity-access.csv) | % | 2024 | [Data compiled from multiple sources by the World Bank, via Our World in Data](https://ourworldindata.org/grapher/share-of-the-population-with-access-to-electricity) | 2026-10-05 |
| [Electricity generated per person](csv/electricity-per-person.csv) | kWh | 2025 | [Ember (2026) and other sources, via Our World in Data](https://ourworldindata.org/grapher/per-capita-electricity-generation) | 2026-10-05 |
| [Energy used per person](csv/energy-per-person.csv) | kWh | 2025 | [Energy Institute – Statistical Review of World Energy (2026) and other sources, via Our World in Data](https://ourworldindata.org/grapher/per-capita-energy-use) | 2026-10-05 |
| [Children per woman](csv/fertility.csv) | births per woman | 2023 | [UN, World Population Prospects (2024), via Our World in Data](https://ourworldindata.org/grapher/children-per-woman-un) | 2026-10-05 |
| [GDP per person](csv/gdp-per-capita.csv) | international $ (2011 prices) | 2022 | [Bolt and van Zanden – Maddison Project Database 2023, via Our World in Data](https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database) | 2026-10-05 |
| [Average height of men, by year of birth](csv/height-men.csv) | cm | 1996 | [NCD Risk Factor Collaboration (2016), via Our World in Data](https://ourworldindata.org/grapher/average-height-of-men) | 2026-10-05 |
| [Average height of women, by year of birth](csv/height-women.csv) | cm | 1996 | [NCD Risk Factor Collaboration (2016), via Our World in Data](https://ourworldindata.org/grapher/average-height-of-women) | 2026-10-05 |
| [Humanitarian funding for North Korea](csv/humanitarian-aid.csv) | US$ million | 2026 | [UN OCHA Financial Tracking Service](https://fts.unocha.org/countries/115/summary/2025) | 2026-10-05 |
| [Life expectancy at birth](csv/life-expectancy.csv) | years | 2023 | [Riley (2005); Zijdeman et al. (2015); HMD (2025); UN WPP (2024), via Our World in Data](https://ourworldindata.org/grapher/life-expectancy) | 2026-10-05 |
| [Missiles launched by North Korea each year](csv/missile-launches.csv) | missiles | 2026 | [CNS North Korea Missile Test Database, via nagix/nk-missile-tests](https://github.com/nagix/nk-missile-tests) | 2026-10-05 |
| [Mobile phone subscriptions per 100 people](csv/mobile-phones.csv) | per 100 people | 2025 | [International Telecommunication Union (ITU), via World Bank (2026), via Our World in Data](https://ourworldindata.org/grapher/mobile-cellular-subscriptions-per-100-people) | 2026-10-05 |
| [Estimated nuclear warheads](csv/nuclear-warheads.csv) | warheads | 2026 | [Federation of American Scientists (2026), via Our World in Data](https://ourworldindata.org/grapher/nuclear-warhead-stockpiles) | 2026-10-05 |
| [Population](csv/population.csv) | people | 2023 | [HYDE (2023); Gapminder (2022); UN WPP (2024), via Our World in Data](https://ourworldindata.org/grapher/population) | 2026-10-05 |
| [Market price of rice](csv/rice-price.csv) | won per kg | 2026-09-27 | [Daily NK market price survey](https://www.dailynk.com/english/category/market-indicators/) | 2026-10-05 |
| [People and organisations added to the UN sanctions list on North Korea](csv/un-sanctions-listings.csv) | listings | 2026 | [UN Security Council 1718 Committee consolidated list](https://www.un.org/securitycouncil/sanctions/1718) | 2026-10-05 |
| [Share of people who are undernourished](csv/undernourishment.csv) | % | 2024 | [Food and Agriculture Organization of the United Nations (2025), via Our World in Data](https://ourworldindata.org/grapher/prevalence-of-undernourishment) | 2026-10-05 |
| [Market exchange rate: North Korean won per US dollar](csv/won-per-dollar.csv) | won per US$ | 2026-09-27 | [Daily NK market price survey](https://www.dailynk.com/english/category/market-indicators/) | 2026-10-05 |
