"""
Politburo, Central Military Commission, and Top Military Command leadership dataset.
Contains key political and military leaders governing the DPRK as of 2024-2026.
"""

PEOPLE_POLITBURO_MILITARY = [
    {
        "id": "pak-thae-song",
        "name_en": "Pak Thae Song",
        "name_ko": "박태성",
        "aliases": ["Pak Thae-song", "Premier Pak"],
        "wikidata": "Q16905281",
        "image_commons": None,
        "born": {"date": "1955-09-14", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr/view/AEN20241230000800315"},
        "gender": "male",
        "roles": [
            {"title": "Premier of the Cabinet of the DPRK", "org_id": "cabinet", "start": "2024-12-29", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20241230000800315"},
            {"title": "Member of the Politburo Presidium", "org_id": "wpk-politburo-presidium", "start": "2024-12-29", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20241230000800315"},
            {"title": "Secretary of the Central Committee", "org_id": "wpk", "start": "2021-01-10", "end": "2024-12-29", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Premier of the Cabinet and Politburo Presidium member appointed in late December 2024, succeeding Kim Tok Hun as the head of civilian government. He manages the national economy, industrial production quotas, and the five-year economic plan under direct party guidance.",
        "notable": [
            {"claim": "Elected Premier of the Cabinet at the 11th Plenary Meeting of the 8th Central Committee on December 29, 2024.", "source_url": "https://en.yna.co.kr/view/AEN20241230000800315", "date": "2024-12-30"},
            {"claim": "Led a delegation of North Korean scientists and regional cadres to Beijing and Shenzhen in 2018 to inspect Chinese high-tech facilities.", "source_url": "https://www.reuters.com/article/us-northkorea-china-delegation-idUSKCN1IG05F", "date": "2018-05-15"}
        ],
        "tags": ["politburo", "economy"]
    },
    {
        "id": "kim-tok-hun",
        "name_en": "Kim Tok Hun",
        "name_ko": "김덕훈",
        "aliases": ["Kim Tok-hun"],
        "wikidata": "Q85978153",
        "image_commons": None,
        "born": {"date": "1961-01-01", "place": "North Hamgyong, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "First Vice Premier of the Cabinet", "org_id": "cabinet", "start": "2024-12-29", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the Politburo Presidium", "org_id": "wpk-politburo-presidium", "start": "2020-08-13", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20200814001300325"},
            {"title": "Premier of the Cabinet", "org_id": "cabinet", "start": "2020-08-13", "end": "2024-12-29", "source_url": "https://en.yna.co.kr/view/AEN20200814001300325"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Member of the Politburo Presidium and First Vice Premier of the Cabinet, who previously served for over four years as Premier (2020-2024). A key technocrat in economic mobilization and heavy industry, he retained his standing on the Presidium despite being publicly reprimanded by Kim Jong Un during the 2023 Ansok tideland flooding disaster.",
        "notable": [
            {"claim": "Publicly denounced by Kim Jong Un in August 2023 for 'irresponsibility' following the flooding of the Ansok tideland, yet remarkably survived and kept his Presidium seat.", "source_url": "https://www.reuters.com/world/asia-pacific/north-koreas-kim-slams-premier-over-flooding-disaster-kcna-2023-08-21/", "date": "2023-08-21"}
        ],
        "tags": ["politburo", "economy"]
    },
    {
        "id": "jo-yong-won",
        "name_en": "Jo Yong Won",
        "name_ko": "조용원",
        "aliases": ["Cho Yong-won"],
        "wikidata": "Q104771569",
        "image_commons": None,
        "born": {"date": "1957-10-24", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Secretary for Organizational Affairs of the WPK Central Committee", "org_id": "wpk-ogd", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the Politburo Presidium", "org_id": "wpk-politburo-presidium", "start": "2021-01-10", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20210111000600325"},
            {"title": "Member of the Central Military Commission", "org_id": "wpk-cmc", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {
            "height_cm": {"value": 168, "source_name": "ROK Intelligence Assessment", "source_url": "https://en.yna.co.kr", "date": "2021-01-01", "confidence": "reported"},
            "weight_kg": None
        },
        "sanctions": [
            {
                "list": "OFAC",
                "id": "21445",
                "date": "2017-01-11",
                "source_url": "https://home.treasury.gov/news/press-releases/as0004"
            }
        ],
        "summary": "WPK Secretary for Organizational Affairs and Politburo Presidium member, widely regarded as Kim Jong Un's primary bureaucratic enforcer and alter ego. He commands the party apparatus and accompanies the Supreme Leader on nearly all strategic field guidance inspections.",
        "notable": [
            {"claim": "Accompanied Kim Jong Un on more public inspections than any other official during 2016-2023, solidifying his status as the leader's shadow gatekeeper.", "source_url": "https://www.nknews.org/2021/01/the-rise-of-jo-yong-won-north-koreas-new-number-two-and-master-bureaucrat/", "date": "2021-01-12"}
        ],
        "tags": ["politburo", "security"]
    },
    {
        "id": "choe-ryong-hae",
        "name_en": "Choe Ryong Hae",
        "name_ko": "최룡해",
        "aliases": ["Choi Ryong-hae"],
        "wikidata": "Q496924",
        "image_commons": "18th_Summit_of_Non-Aligned_Movement_gets_underway_in_Baku_005_(cropped).jpg",
        "born": {"date": "1950-01-15", "place": "Sinchon County, South Hwanghae, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Chairman of the Standing Committee of the Supreme People's Assembly", "org_id": "spa", "start": "2019-04-11", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "First Vice President of the State Affairs Commission", "org_id": "sac", "start": "2019-04-11", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the Politburo Presidium", "org_id": "wpk-politburo-presidium", "start": "2012-04-11", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {
            "height_cm": {"value": 169, "source_name": "Diplomatic Observation", "source_url": "https://en.yna.co.kr", "date": "2019-10-25", "confidence": "reported"},
            "weight_kg": None
        },
        "sanctions": [
            {
                "list": "OFAC",
                "id": "23213",
                "date": "2018-12-10",
                "source_url": "https://home.treasury.gov/news/press-releases/sm568"
            }
        ],
        "summary": "First Vice President of the State Affairs Commission, Chairman of the SPA Standing Committee, and veteran Politburo Presidium member who serves as nominal constitutional head of state for foreign diplomatic protocols. Son of revolutionary guerrilla hero Choe Hyon, his partisan pedigree provides unassailable dynastic loyalty shielding him through multiple past demotions.",
        "notable": [
            {"claim": "Served as special envoy of Kim Jong Un to Beijing in May 2013 to deliver a personal letter to Chinese President Xi Jinping following North Korea's third nuclear test.", "source_url": "https://www.reuters.com/article/us-northkorea-china-choe-idUSBRE94M06620130523", "date": "2013-05-24"},
            {"claim": "Sanctioned by the US Department of the Treasury in December 2018 for severe human rights violations and state censorship.", "source_url": "https://home.treasury.gov/news/press-releases/sm568", "date": "2018-12-10"}
        ],
        "tags": ["politburo", "military"]
    },
    {
        "id": "ri-pyong-chol",
        "name_en": "Ri Pyong Chol",
        "name_ko": "리병철",
        "aliases": ["Ri Pyong-chol", "Marshal Ri"],
        "wikidata": "Q43078715",
        "image_commons": None,
        "born": {"date": "1948-01-01", "place": "North Hamgyong, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Marshal of the Korean People's Army", "org_id": "mnd", "start": "2020-10-05", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Vice Chairman of the Central Military Commission", "org_id": "wpk-cmc", "start": "2020-05-24", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the Politburo Presidium", "org_id": "wpk-politburo-presidium", "start": "2020-08-13", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [
            {
                "list": "UN",
                "id": "6908587",
                "date": "2017-06-02",
                "source_url": "https://scsanctions.un.org/resources/xml/en/consolidated.xml"
            },
            {
                "list": "OFAC",
                "id": "23215",
                "date": "2017-12-26",
                "source_url": "https://home.treasury.gov/news/press-releases/sm0242"
            }
        ],
        "summary": "Marshal of the KPA, Vice Chairman of the Central Military Commission, and Politburo Presidium member who serves as the paramount military-industrial supervisor of North Korea's nuclear and ICBM development. Known as the chief architect of the missile program, he frequently stands beside Kim Jong Un during strategic rocket launches.",
        "notable": [
            {"claim": "Promoted to Marshal of the KPA in October 2020 in recognition of his decisive contributions to missile and nuclear warhead development.", "source_url": "https://en.yna.co.kr/view/AEN20201006001000325", "date": "2020-10-06"},
            {"claim": "Demoted temporarily from the Politburo Presidium in June 2021 over an unspecified 'grave incident' in anti-epidemic quarantine before being fully reinstated in April 2022.", "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-reinstates-top-missile-official-ri-pyong-chol-leadership-2022-04-15/", "date": "2022-04-15"}
        ],
        "tags": ["politburo", "military", "missile"]
    },
    {
        "id": "pak-jong-chon",
        "name_en": "Pak Jong Chon",
        "name_ko": "박정천",
        "aliases": ["Pak Jong-chon", "Marshal Pak"],
        "wikidata": "Q67936746",
        "image_commons": None,
        "born": {"date": "1960-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Vice Chairman of the Central Military Commission", "org_id": "wpk-cmc", "start": "2023-12-30", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20240101001200325"},
            {"title": "Secretary of the Central Committee", "org_id": "wpk", "start": "2023-12-30", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Chief of the General Staff Department", "org_id": "kpa-gstaff", "start": "2019-09-06", "end": "2021-09-07", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [
            {
                "list": "OFAC",
                "id": "52117",
                "date": "2022-12-01",
                "source_url": "https://home.treasury.gov/news/press-releases/jy1136"
            }
        ],
        "summary": "Marshal of the KPA, Vice Chairman of the Central Military Commission, and former Chief of General Staff who spearheaded the modernization of North Korea's tactical artillery, short-range ballistic missiles, and multi-launch rocket systems. He commands operational planning for conventional and tactical nuclear battlefield strikes.",
        "notable": [
            {"claim": "Oversaw the development and field deployment of super-large 600mm multiple rocket launch systems (KN-25) capable of tactical nuclear delivery.", "source_url": "https://www.csis.org/analysis/north-koreas-super-large-multiple-rocket-launcher", "date": "2023-01-01"},
            {"claim": "Replaced at the end of 2022 as vice chairman of the CMC, then dramatically returned to the position at the Central Committee plenum in December 2023.", "source_url": "https://en.yna.co.kr/view/AEN20240101001200325", "date": "2024-01-01"}
        ],
        "tags": ["politburo", "military", "missile"]
    },
    {
        "id": "ri-yong-gil",
        "name_en": "Ri Yong Gil",
        "name_ko": "리영길",
        "aliases": ["Ri Yong-gil", "General Ri"],
        "wikidata": "Q15088267",
        "image_commons": None,
        "born": {"date": "1955-04-14", "place": "Kangwon Province, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Chief of the General Staff Department of the KPA", "org_id": "kpa-gstaff", "start": "2023-08-09", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20230810001000325"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Minister of National Defence", "org_id": "mnd", "start": "2021-06-29", "end": "2022-12-31", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [
            {
                "list": "OFAC",
                "id": "33936",
                "date": "2021-12-10",
                "source_url": "https://home.treasury.gov/news/press-releases/jy0526"
            },
            {
                "list": "EU",
                "id": "EU-DPRK-031",
                "date": "2021-03-22",
                "source_url": "https://eur-lex.europa.eu"
            }
        ],
        "summary": "Chief of the General Staff of the Korean People's Army and Politburo member, responsible for wartime operational command and frontline combat formations. Erroneously reported by South Korean intelligence to have been executed in 2016, he staged an extraordinary political resurgence to become Defence Minister and top military commander.",
        "notable": [
            {"claim": "Reported executed in early 2016 by South Korean news citing intelligence sources, only to reappear alive months later at the 7th Party Congress.", "source_url": "https://www.bbc.com/news/world-asia-36259079", "date": "2016-05-10"},
            {"claim": "Appointed Chief of the General Staff Department in August 2023 as Kim Jong Un ordered accelerated war preparations against South Korea.", "source_url": "https://www.reuters.com/world/asia-pacific/north-koreas-kim-replaces-top-general-calls-war-preparations-2023-08-09/", "date": "2023-08-09"}
        ],
        "tags": ["politburo", "military"]
    },
    {
        "id": "kang-sun-nam",
        "name_en": "Kang Sun Nam",
        "name_ko": "강순남",
        "aliases": ["Kang Sun-nam"],
        "wikidata": "Q116030999",
        "image_commons": None,
        "born": {"date": "1960-01-01", "place": "South Pyongan, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Minister of National Defence", "org_id": "mnd", "start": "2022-12-31", "end": "2024-10-08", "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-names-new-defence-minister-revises-constitution-2024-10-09/"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2022-12-31", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "General and Politburo member who served as Minister of National Defence from December 2022 until October 2024. He played a pivotal role in negotiating military cooperation agreements with Russian Defense Minister Sergei Shoigu and oversaw North Korea's initial munitions shipments to Moscow.",
        "notable": [
            {"claim": "Hosted Russian Defense Minister Sergei Shoigu in Pyongyang in July 2023 for the 70th anniversary of the Korean War armistice, opening large-scale defense supply lines.", "source_url": "https://www.reuters.com/world/asia-pacific/shoigu-says-russia-north-korea-cooperation-fully-meets-security-interests-2023-07-27/", "date": "2023-07-27"},
            {"claim": "Replaced as Minister of National Defence by No Kwang Chol at the 11th Session of the 14th Supreme People's Assembly in October 2024.", "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-names-new-defence-minister-revises-constitution-2024-10-09/", "date": "2024-10-09"}
        ],
        "tags": ["politburo", "military"]
    },
    {
        "id": "no-kwang-chol",
        "name_en": "No Kwang Chol",
        "name_ko": "노광철",
        "aliases": ["Ro Kwang-chol"],
        "wikidata": "Q21824967",
        "image_commons": None,
        "born": {"date": "1956-01-01", "place": "South Pyongan, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Minister of National Defence", "org_id": "mnd", "start": "2024-10-08", "end": None, "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-names-new-defence-minister-revises-constitution-2024-10-09/"},
            {"title": "Minister of People's Armed Forces", "org_id": "mnd", "start": "2018-06-01", "end": "2019-12-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [
            {
                "list": "OFAC",
                "id": "52116",
                "date": "2022-12-01",
                "source_url": "https://home.treasury.gov/news/press-releases/jy1136"
            }
        ],
        "summary": "Minister of National Defence re-appointed to the post in October 2024, having previously held the position during the 2018-2019 Singapore and Hanoi summits. He oversees administrative armed forces command and defense industrial logistics during a period of expanding military alignment with Russia.",
        "notable": [
            {"claim": "Accompanied Kim Jong Un to the June 2018 Singapore Summit with US President Donald Trump, visibly saluting Trump in an encounter captured by international media.", "source_url": "https://www.reuters.com/article/us-northkorea-usa-salute-idUSKBN1JA2O7", "date": "2018-06-14"},
            {"claim": "Re-appointed Minister of National Defence at the 11th Session of the 14th Supreme People's Assembly in October 2024.", "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-names-new-defence-minister-revises-constitution-2024-10-09/", "date": "2024-10-09"}
        ],
        "tags": ["politburo", "military"]
    },
    {
        "id": "jong-kyong-thaek",
        "name_en": "Jong Kyong Thaek",
        "name_ko": "정경택",
        "aliases": ["Jong Kyong-thaek"],
        "wikidata": "Q47035368",
        "image_commons": None,
        "born": {"date": "1959-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Director of the KPA General Political Bureau", "org_id": "kpa-gpb", "start": "2022-06-11", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20220611001400325"},
            {"title": "Minister of State Security", "org_id": "mss", "start": "2017-10-07", "end": "2022-06-11", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2019-04-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [
            {
                "list": "OFAC",
                "id": "23212",
                "date": "2018-12-10",
                "source_url": "https://home.treasury.gov/news/press-releases/sm568"
            },
            {
                "list": "EU",
                "id": "EU-DPRK-032",
                "date": "2021-03-22",
                "source_url": "https://eur-lex.europa.eu"
            }
        ],
        "summary": "Director of the KPA General Political Bureau and former Minister of State Security, making him one of the most powerful political surveillance figures in North Korea. Having supervised the secret police for five years, he now ensures ideological loyalty and purge enforcement across the entire military.",
        "notable": [
            {"claim": "Appointed Director of the KPA General Political Bureau in June 2022, completing his transition from secret police chief to senior military commissar.", "source_url": "https://en.yna.co.kr/view/AEN20220611001400325", "date": "2022-06-11"},
            {"claim": "Sanctioned by the US Treasury in December 2018 for supervising arbitrary detention, torture, and extrajudicial killings as head of the Ministry of State Security.", "source_url": "https://home.treasury.gov/news/press-releases/sm568", "date": "2018-12-10"}
        ],
        "tags": ["politburo", "military", "security"]
    },
    {
        "id": "kim-jae-ryong",
        "name_en": "Kim Jae Ryong",
        "name_ko": "김재룡",
        "aliases": ["Kim Jae-ryong"],
        "wikidata": "Q56818689",
        "image_commons": None,
        "born": {"date": "1959-01-01", "place": "Chagang Province, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Director of the Organization and Guidance Department", "org_id": "wpk-ogd", "start": "2022-06-11", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20220611001400325"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2019-04-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Premier of the Cabinet", "org_id": "cabinet", "start": "2019-04-11", "end": "2020-08-13", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Director of the powerful Organization and Guidance Department (OGD) and former Premier of the Cabinet, who previously built his power base supervising the underground defense-industrial complex of Chagang Province. He oversees cadre loyalty evaluations and party personnel assignments.",
        "notable": [
            {"claim": "Served as Chief Secretary of the Chagang Provincial Party Committee, the secretive mountainous region housing North Korea's underground missile and munitions plants.", "source_url": "https://www.38north.org/2019/04/nkleadership041219/", "date": "2019-04-12"},
            {"claim": "Appointed Director of OGD at the Fifth Plenary Meeting of the 8th Central Committee in June 2022.", "source_url": "https://en.yna.co.kr/view/AEN20220611001400325", "date": "2022-06-11"}
        ],
        "tags": ["politburo", "security"]
    },
    {
        "id": "ri-il-hwan",
        "name_en": "Ri Il Hwan",
        "name_ko": "리일환",
        "aliases": ["Ri Il-hwan"],
        "wikidata": "Q16091484",
        "image_commons": None,
        "born": {"date": "1960-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Secretary of the Central Committee for Propaganda", "org_id": "wpk", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2019-12-31", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Secretary of the WPK Central Committee and Politburo member directing ideological indoctrination, youth loyalty, and anti-capitalist cultural crackdowns. He coordinates state campaigns to suppress South Korean media, slang, and cultural influences under the Anti-Reactionary Thought Law.",
        "notable": [
            {"claim": "Supervised nationwide enforcement of the Law on Rejecting Reactionary Ideology and Culture enacted in late 2020.", "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-passes-law-toughen-crackdown-k-pop-foreign-culture-2021-01-15/", "date": "2021-01-15"}
        ],
        "tags": ["politburo"]
    },
    {
        "id": "o-su-yong",
        "name_en": "O Su Yong",
        "name_ko": "오수용",
        "aliases": ["O Su-yong"],
        "wikidata": "Q12607997",
        "image_commons": None,
        "born": {"date": "1944-01-01", "place": "North Hamgyong, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Secretary of the Central Committee for Economic Affairs", "org_id": "wpk", "start": "2023-06-18", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20230619001300325"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2023-06-18", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20230619001300325"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "WPK Central Committee Secretary for Economic Affairs and Politburo member who acts as the primary economic policy coordinator between the Party and Cabinet. A veteran technocrat in heavy industry and electronics, he was returned to lead economic policy in 2023 after previous stints under both Kim Jong Il and Kim Jong Un.",
        "notable": [
            {"claim": "Reappointed Director of the Economic Affairs Department at the Eighth Plenary Meeting in June 2023 to tackle systemic agricultural and manufacturing bottlenecks.", "source_url": "https://en.yna.co.kr/view/AEN20230619001300325", "date": "2023-06-19"}
        ],
        "tags": ["politburo", "economy"]
    },
    {
        "id": "jon-hyon-chol",
        "name_en": "Jon Hyon Chol",
        "name_ko": "전현철",
        "aliases": ["Jon Hyon-chol"],
        "wikidata": "Q112671560",
        "image_commons": None,
        "born": {"date": "1965-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Vice Premier of the Cabinet", "org_id": "cabinet", "start": "2022-06-11", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20220611001400325"},
            {"title": "Alternate Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2022-06-11", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Vice Premier of the Cabinet and Politburo alternate member responsible for managing heavy industrial production and metal fabrication. A rising economic manager, he coordinates state resource allocation to defense-critical factories.",
        "notable": [
            {"claim": "Elected Alternate Member of the Politburo and promoted to Vice Premier in June 2022.", "source_url": "https://en.yna.co.kr/view/AEN20220611001400325", "date": "2022-06-11"}
        ],
        "tags": ["politburo", "economy"]
    },
    {
        "id": "pak-jong-gun",
        "name_en": "Pak Jong Gun",
        "name_ko": "박정근",
        "aliases": ["Pak Jong-gun"],
        "wikidata": "Q107119253",
        "image_commons": None,
        "born": {"date": "1962-01-01", "place": "North Hamgyong, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Vice Premier and Chairman of the State Planning Commission", "org_id": "cabinet", "start": "2021-01-17", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2021-12-31", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20220101001500325"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Vice Premier of the Cabinet and Chairman of the State Planning Commission, holding direct control over the formulation of North Korea's central state economic plans, grain distributions, and industrial material quotas. Elevated to full Politburo membership in late 2021, he is the key architect of central economic planning targets.",
        "notable": [
            {"claim": "Promoted to full Politburo membership at the Fourth Plenary Meeting of the 8th Central Committee in December 2021.", "source_url": "https://en.yna.co.kr/view/AEN20220101001500325", "date": "2022-01-01"}
        ],
        "tags": ["politburo", "economy"]
    },
    {
        "id": "ri-hi-yong",
        "name_en": "Ri Hi Yong",
        "name_ko": "리히용",
        "aliases": ["Ri Hi-yong"],
        "wikidata": "Q108740520",
        "image_commons": None,
        "born": {"date": "1960-01-01", "place": "North Hamgyong, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "First Vice Director of the Organization and Guidance Department", "org_id": "wpk-ogd", "start": "2023-12-30", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Alternate Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "First Vice Director of the Organization and Guidance Department and former Chief Secretary of North Hamgyong Provincial Party Committee. He exercises day-to-day managerial supervision over cadre performance monitoring and provincial governance.",
        "notable": [
            {"claim": "Served as a key point man for reconstruction after major typhoons damaged northeastern mining regions in 2020.", "source_url": "https://www.nknews.org/2020/09/north-korean-party-congress-personnel/", "date": "2020-09-08"}
        ],
        "tags": ["politburo", "security"]
    },
    {
        "id": "kim-hyong-sik",
        "name_en": "Kim Hyong Sik",
        "name_ko": "김형식",
        "aliases": ["Kim Hyong-sik"],
        "wikidata": "Q108740522",
        "image_commons": None,
        "born": {"date": "1958-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Director of the Legal Affairs Department", "org_id": "wpk", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Alternate Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Director of the Legal Affairs Department of the Central Committee and Politburo alternate member, overseeing the regime's judicial bodies, state prosecutor's offices, and legal codes. He drafted harsh internal security laws targeting foreign media and cultural imports.",
        "notable": [
            {"claim": "Elected head of the newly revived Legal Affairs Department at the 8th Party Congress in January 2021 to tighten legal control over the populace.", "source_url": "https://en.yna.co.kr/view/AEN20210111000600325", "date": "2021-01-11"}
        ],
        "tags": ["politburo", "security"]
    },
    {
        "id": "ju-chang-il",
        "name_en": "Ju Chang Il",
        "name_ko": "주창일",
        "aliases": ["Ju Chang-il"],
        "wikidata": "Q112671563",
        "image_commons": None,
        "born": {"date": "1960-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Director of the Propaganda and Agitation Department", "org_id": "wpk-pad", "start": "2022-06-11", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20220611001400325"},
            {"title": "Member of the WPK Central Committee", "org_id": "wpk", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Director of the Propaganda and Agitation Department (PAD) appointed in June 2022, overseeing the institutional management of KCTV broadcasts, Rodong Sinmun editorials, and ideological mobilization drives. He operates under the immediate political direction of Kim Yo Jong.",
        "notable": [
            {"claim": "Appointed Director of PAD at the Fifth Plenary Meeting of the 8th Central Committee in June 2022.", "source_url": "https://en.yna.co.kr/view/AEN20220611001400325", "date": "2022-06-11"}
        ],
        "tags": ["politburo"]
    },
    {
        "id": "choe-thae-bok",
        "name_en": "Choe Thae Bok",
        "name_ko": "최태복",
        "aliases": ["Choe Thae-bok"],
        "wikidata": "Q710899",
        "image_commons": None,
        "born": {"date": "1930-12-01", "place": "Nampo, South Pyongan, Korea"},
        "died": {"date": "2024-01-20", "place": "Pyongyang, North Korea", "cause": "Natural causes / old age (93)"},
        "status": {"value": "dead", "as_of": "2024-01-20", "source_url": "https://en.yna.co.kr/view/AEN20240121001100325"},
        "gender": "male",
        "roles": [
            {"title": "Chairman of the Supreme People's Assembly", "org_id": "spa", "start": "1998-09-05", "end": "2019-04-11", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the Politburo", "org_id": "wpk-politburo", "start": "1990-05-23", "end": "2019-04-11", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Longest-serving Chairman of the Supreme People's Assembly in North Korean history, who held the legislative speaker's chair for over 20 consecutive years (1998-2019). A key education and science bureaucrat, he was one of the core senior figures who walked alongside Kim Jong Il's hearse in 2011.",
        "notable": [
            {"claim": "Served as one of the seven high-ranking officials alongside Kim Jong Un escorting Kim Jong Il's hearse in December 2011.", "source_url": "https://www.reuters.com/article/idUSL3E7NR06V/", "date": "2011-12-28"},
            {"claim": "Passed away on January 20, 2024 at age 93, with Kim Jong Un personally visiting his bier to pay respects.", "source_url": "https://en.yna.co.kr/view/AEN20240121001100325", "date": "2024-01-21"}
        ],
        "tags": ["politburo"]
    },
    {
        "id": "yang-hyong-sop",
        "name_en": "Yang Hyong Sop",
        "name_ko": "양형섭",
        "aliases": ["Yang Hyong-sop"],
        "wikidata": "Q494541",
        "image_commons": None,
        "born": {"date": "1925-10-01", "place": "Hamhung, South Hamgyong, Korea"},
        "died": {"date": "2022-05-13", "place": "Pyongyang, North Korea", "cause": "Natural causes / old age (96)"},
        "status": {"value": "dead", "as_of": "2022-05-13", "source_url": "https://en.yna.co.kr/view/AEN20220515000700325"},
        "gender": "male",
        "roles": [
            {"title": "Vice Chairman of the SPA Standing Committee", "org_id": "spa", "start": "1998-09-05", "end": "2019-04-11", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the Politburo", "org_id": "wpk-politburo", "start": "2010-09-28", "end": "2019-04-11", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Longtime Vice Chairman of the Supreme People's Assembly Standing Committee and Politburo member who served as an ideological drafter for Kim Il Sung and Kim Jong Il. Married to Kim Il Sung's cousin Kim Sin-suk, his familial ties secured him decades at the highest tiers of state representation.",
        "notable": [
            {"claim": "Served as President of the Academy of Social Sciences and drafted key philosophical treatises interpreting Juche ideology.", "source_url": "https://nkinfo.unikorea.go.kr", "date": "1980-01-01"},
            {"claim": "Served as a hearse escort during Kim Jong Il's state funeral procession in December 2011.", "source_url": "https://www.reuters.com/article/idUSL3E7NR06V/", "date": "2011-12-28"}
        ],
        "tags": ["politburo"]
    }
]
