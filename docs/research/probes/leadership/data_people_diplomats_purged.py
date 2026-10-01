"""
Diplomats, Purged/Defected Elites, and Protocol/Propaganda figures dataset.
Contains key foreign affairs officials, high-profile defectors, purged commanders,
and prominent inner-circle figures.
"""

PEOPLE_DIPLOMATS_PURGED = [
    # Diplomats & Foreign Affairs
    {
        "id": "choe-son-hui",
        "name_en": "Choe Son Hui",
        "name_ko": "최선희",
        "aliases": ["Choe Son-hui", "Foreign Minister Choe"],
        "wikidata": "Q50382875",
        "image_commons": None,
        "born": {"date": "1964-08-10", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "female",
        "roles": [
            {"title": "Minister of Foreign Affairs", "org_id": "mfa", "start": "2022-06-11", "end": None, "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-names-choe-son-hui-first-female-foreign-minister-2022-06-11/"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2022-06-11", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "First Vice Minister of Foreign Affairs", "org_id": "mfa", "start": "2019-04-11", "end": "2022-06-11", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {
            "height_cm": {"value": 160, "source_name": "Diplomatic Observation", "source_url": "https://en.yna.co.kr", "date": "2019-02-27", "confidence": "reported"},
            "weight_kg": None
        },
        "sanctions": [],
        "summary": "Minister of Foreign Affairs and Politburo member appointed in June 2022 as North Korea's first female foreign minister. A longtime English-language diplomatic interpreter and adopted daughter of former Premier Choe Yong Rim, she leads the regime's comprehensive strategic alignment with Russia and manages high-stakes nuclear diplomacy.",
        "notable": [
            {"claim": "Served as North Korea's chief working-level nuclear negotiator during the 2018-2019 Trump-Kim summits in Singapore and Hanoi.", "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-names-choe-son-hui-first-female-foreign-minister-2022-06-11/", "date": "2019-02-28"},
            {"claim": "Met with Russian President Vladimir Putin in Moscow in January 2024 to finalize technical and military cooperation protocols.", "source_url": "https://www.reuters.com/world/europe/putin-meets-north-koreas-foreign-minister-kremlin-2024-01-16/", "date": "2024-01-16"}
        ],
        "tags": ["diplomat", "politburo"]
    },
    {
        "id": "kim-song",
        "name_en": "Kim Song",
        "name_ko": "김성",
        "aliases": ["Kim Song", "Ambassador Kim"],
        "wikidata": "Q57315182",
        "image_commons": None,
        "born": {"date": "1959-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Permanent Representative to the United Nations in New York", "org_id": "mfa", "start": "2018-09-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Permanent Representative of the DPRK to the United Nations in New York since September 2018, serving as North Korea's primary direct diplomatic outpost in the United States. He defends ballistic missile tests and human rights practices before the UN Security Council and General Assembly.",
        "notable": [
            {"claim": "Presented North Korea's official position justifying military reconnaissance satellite launches before emergency UN Security Council sessions in 2023-2024.", "source_url": "https://www.reuters.com/world/asia-pacific/un-security-council-meets-over-north-korea-satellite-launch-2023-11-27/", "date": "2023-11-27"}
        ],
        "tags": ["diplomat"]
    },
    {
        "id": "sin-hong-chol",
        "name_en": "Sin Hong Chol",
        "name_ko": "신홍철",
        "aliases": ["Sin Hong-chol", "Ambassador Sin"],
        "wikidata": "Q108740525",
        "image_commons": None,
        "born": {"date": "1960-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Ambassador to the Russian Federation", "org_id": "mfa", "start": "2020-02-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Vice Minister of Foreign Affairs", "org_id": "mfa", "start": "2014-01-01", "end": "2020-02-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Ambassador to the Russian Federation since February 2020, playing a crucial operational role in arranging reciprocal leader summits and bilateral military pact negotiations in Moscow. He oversees diplomatic cover for arms transfers and North Korean personnel deployments in Russia.",
        "notable": [
            {"claim": "Coordinated logistics for Kim Jong Un's high-profile summit tour with Vladimir Putin at Vostochny Cosmodrome in September 2023.", "source_url": "https://www.reuters.com/world/asia-pacific/kim-putin-meet-russias-vostochny-cosmodrome-2023-09-13/", "date": "2023-09-13"}
        ],
        "tags": ["diplomat"]
    },
    {
        "id": "ri-ryong-nam",
        "name_en": "Ri Ryong Nam",
        "name_ko": "리룡남",
        "aliases": ["Ri Ryong-nam", "Ambassador Ri"],
        "wikidata": "Q7329486",
        "image_commons": None,
        "born": {"date": "1960-08-08", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Ambassador to the People's Republic of China", "org_id": "mfa", "start": "2021-02-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Vice Premier of the Cabinet", "org_id": "cabinet", "start": "2016-06-29", "end": "2021-01-17", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Minister of Foreign Trade", "org_id": "cabinet", "start": "2008-03-01", "end": "2016-06-29", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Ambassador to the People's Republic of China and former Vice Premier for Foreign Trade, serving as Pyongyang's chief economic and political diplomat in Beijing. A seasoned foreign trade expert, he manages vital Sino-North Korean rail commerce, oil deliveries, and sanctions mitigation.",
        "notable": [
            {"claim": "Appointed ambassador to Beijing in February 2021, an unusually high-level posting for a former Vice Premier, reflecting the strategic importance of trade with China.", "source_url": "https://www.reuters.com/article/us-northkorea-china-envoy-idUSKBN2AN064", "date": "2021-02-19"}
        ],
        "tags": ["diplomat", "economy"]
    },
    {
        "id": "kim-hyong-jun",
        "name_en": "Kim Hyong Jun",
        "name_ko": "김형준",
        "aliases": ["Kim Hyong-jun"],
        "wikidata": "Q85978155",
        "image_commons": None,
        "born": {"date": "1949-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2024-01-01", "source_url": "https://nkinfo.unikorea.go.kr"},
        "gender": "male",
        "roles": [
            {"title": "Vice Chairman of the Central Committee for International Affairs", "org_id": "wpk", "start": "2019-12-31", "end": "2021-01-10", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Ambassador to the Russian Federation", "org_id": "mfa", "start": "2014-08-01", "end": "2019-11-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Veteran diplomat and former Vice Chairman of the WPK Central Committee for International Affairs who previously served as ambassador to Moscow (2014-2019). He laid the groundwork for North Korea's strategic shift toward deep security cooperation with Russia.",
        "notable": [
            {"claim": "Organized the first Kim-Putin bilateral summit in Vladivostok in April 2019.", "source_url": "https://www.reuters.com/article/us-northkorea-russia-idUSKCN1S01S9", "date": "2019-04-25"}
        ],
        "tags": ["diplomat", "politburo"]
    },
    {
        "id": "ri-su-yong",
        "name_en": "Ri Su Yong",
        "name_ko": "리수용",
        "aliases": ["Ri Chol", "Ri Su-yong"],
        "wikidata": "Q16275150",
        "image_commons": None,
        "born": {"date": "1940-06-15", "place": "South Pyongan, Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2024-01-01", "source_url": "https://nkinfo.unikorea.go.kr"},
        "gender": "male",
        "roles": [
            {"title": "Vice Chairman of the Central Committee for International Affairs", "org_id": "wpk", "start": "2016-05-09", "end": "2019-12-31", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Minister of Foreign Affairs", "org_id": "mfa", "start": "2014-04-09", "end": "2016-05-09", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Ambassador to Switzerland", "org_id": "mfa", "start": "1988-01-01", "end": "2010-01-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Former Foreign Minister and WPK Vice Chairman for International Affairs who served for two decades as ambassador to Switzerland under the alias Ri Chol. While in Bern, he acted as guardian and mentor to Kim Jong Un and Kim Yo Jong during their schooling at the International School of Berne and managed Kim family secret Swiss bank accounts.",
        "notable": [
            {"claim": "Served as guardian for Kim Jong Un and Kim Yo Jong during their private education in Bern, Switzerland in the late 1990s.", "source_url": "https://www.reuters.com/article/us-northkorea-diplomat-idUSKCN0YG02Z", "date": "2016-05-18"}
        ],
        "tags": ["diplomat", "politburo", "economy"]
    },
    {
        "id": "ri-yong-ho",
        "name_en": "Ri Yong Ho",
        "name_ko": "리용호",
        "aliases": ["Ri Yong-ho", "Foreign Minister Ri"],
        "wikidata": "Q24083656",
        "image_commons": None,
        "born": {"date": "1956-07-10", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "purged", "as_of": "2023-01-05", "source_url": "https://en.yna.co.kr/view/AEN20230105005800325"},
        "gender": "male",
        "roles": [
            {"title": "Minister of Foreign Affairs", "org_id": "mfa", "start": "2016-05-09", "end": "2020-01-01", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2016-05-09", "end": "2020-01-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {
            "height_cm": {"value": 170, "source_name": "Diplomatic Observation", "source_url": "https://en.yna.co.kr", "date": "2019-02-28", "confidence": "reported"},
            "weight_kg": None
        },
        "sanctions": [],
        "summary": "Sophisticated Foreign Minister from 2016 to 2020 and lead diplomatic strategist during the Trump-Kim summits in Singapore and Hanoi. Following the collapse of the Hanoi summit, he was abruptly removed from office in early 2020 and subsequently purged, with South Korean intelligence confirming his disappearance from public life.",
        "notable": [
            {"claim": "Gave the dramatic midnight press conference in Hanoi in February 2019 following the abrupt breakdown of summit talks between Kim Jong Un and Donald Trump.", "source_url": "https://www.reuters.com/article/us-northkorea-usa-minister-idUSKCN1QI37N", "date": "2019-02-28"},
            {"claim": "South Korean National Intelligence Service reported in January 2023 that Ri Yong Ho was purged in late 2019 or 2020, though his execution remains unconfirmed.", "source_url": "https://en.yna.co.kr/view/AEN20230105005800325", "date": "2023-01-05"}
        ],
        "tags": ["diplomat", "politburo", "purged"]
    },
    {
        "id": "kim-kye-gwan",
        "name_en": "Kim Kye Gwan",
        "name_ko": "김계관",
        "aliases": ["Kim Kye-gwan"],
        "wikidata": "Q494872",
        "image_commons": None,
        "born": {"date": "1943-07-06", "place": "Unsan, North Pyongan, Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2023-01-01", "source_url": "https://nkinfo.unikorea.go.kr"},
        "gender": "male",
        "roles": [
            {"title": "First Vice Minister of Foreign Affairs", "org_id": "mfa", "start": "2010-09-01", "end": "2019-04-11", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [
            {
                "claim": "Suffered a debilitating stroke around 2016 that significantly curtailed his active diplomatic travel, moving him into an advisory elder role.",
                "source_name": "ROK Intelligence / Diplomatic Sources",
                "source_url": "https://en.yna.co.kr",
                "date": "2018-05-16",
                "confidence": "reported"
            }
        ],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Veteran nuclear diplomat who led North Korea's delegation during the Six-Party Talks in Beijing from 2003 to 2008 and negotiated the 1994 US-DPRK Agreed Framework. Known for his methodical negotiating tactics, he served as First Vice Foreign Minister before health issues reduced his active schedule.",
        "notable": [
            {"claim": "Negotiated the September 19, 2005 Joint Statement at the Six-Party Talks, in which North Korea pledged in principle to abandon its nuclear weapons.", "source_url": "https://www.armscontrol.org/factsheets/6partytalks", "date": "2005-09-19"}
        ],
        "tags": ["diplomat"]
    },
    {
        "id": "ri-son-gwon",
        "name_en": "Ri Son Gwon",
        "name_ko": "리선권",
        "aliases": ["Ri Son-gwon"],
        "wikidata": "Q47035372",
        "image_commons": None,
        "born": {"date": "1955-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Director of the United Front Department", "org_id": "wpk", "start": "2022-06-11", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20220611001400325"},
            {"title": "Minister of Foreign Affairs", "org_id": "mfa", "start": "2020-01-01", "end": "2022-06-11", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Alternate Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2020-01-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Director of the United Front Department and former Foreign Minister with a military intelligence background under Kim Yong Chol. Known for his aggressive, blunt diplomatic demeanor toward South Korean counterparts during the 2018 Moon-Kim peace dialogues.",
        "notable": [
            {"claim": "Infamously scolded South Korean corporate tycoons during a lunch at the 2018 Pyongyang summit, demanding 'Does the naengmyeon [cold noodles] go down your throat?' to pressure them on economic investments.", "source_url": "https://en.yna.co.kr/view/AEN20181031008000315", "date": "2018-10-31"},
            {"claim": "Shifted to head the United Front Department in June 2022, overseeing the institutional dissolution and restructuring of South Korea-focused agencies.", "source_url": "https://en.yna.co.kr/view/AEN20220611001400325", "date": "2022-06-11"}
        ],
        "tags": ["diplomat", "security", "politburo"]
    },
    {
        "id": "pak-myong-ho",
        "name_en": "Pak Myong Ho",
        "name_ko": "박명호",
        "aliases": ["Pak Myong-ho"],
        "wikidata": "Q124029280",
        "image_commons": None,
        "born": {"date": "1963-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Vice Minister of Foreign Affairs (Asia and China)", "org_id": "mfa", "start": "2021-01-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Vice Minister of Foreign Affairs overseeing relations with the People's Republic of China, Southeast Asian nations, and regional multilateral bodies. He leads diplomatic working delegations to Beijing to coordinate trade corridors and political consultations.",
        "notable": [
            {"claim": "Led a high-level diplomatic delegation to Beijing in December 2023 for bilateral consultations with Chinese Vice Foreign Minister Sun Weidong.", "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-china-hold-high-level-talks-beijing-2023-12-18/", "date": "2023-12-18"}
        ],
        "tags": ["diplomat"]
    },
    {
        "id": "kim-son-gyong",
        "name_en": "Kim Son Gyong",
        "name_ko": "김선경",
        "aliases": ["Kim Son-gyong"],
        "wikidata": "Q124029282",
        "image_commons": None,
        "born": {"date": "1968-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "Vice Minister of Foreign Affairs for International Organizations", "org_id": "mfa", "start": "2020-01-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Vice Minister of Foreign Affairs for International Organizations, responsible for DPRK engagements with the United Nations, WHO, and international treaty forums. He routinely issues official ministerial communiqués blasting UN Security Council meetings on North Korean weapons tests.",
        "notable": [
            {"claim": "Issued formal state statements through KCNA condemning UN Secretary-General António Guterres for expressing concern over North Korean ICBM launches.", "source_url": "https://www.reuters.com/world/asia-pacific/north-korea-slams-un-chief-deploring-missile-launch-bias-2023-03-05/", "date": "2023-03-05"}
        ],
        "tags": ["diplomat"]
    },

    # Notable Purged, Executed & Defected Elites
    {
        "id": "hyon-yong-chol",
        "name_en": "Hyon Yong Chol",
        "name_ko": "현영철",
        "aliases": ["Hyon Yong-chol", "General Hyon"],
        "wikidata": "Q492582",
        "image_commons": None,
        "born": {"date": "1949-01-11", "place": "Ryongchon County, North Pyongan, Korea"},
        "died": {"date": "2015-04-30", "place": "Kang Kon Military Academy, Sunan, Pyongyang", "cause": "Execution by anti-aircraft artillery (ZPU-4) for insubordination"},
        "status": {"value": "executed", "as_of": "2015-04-30", "source_url": "https://www.bbc.com/news/world-asia-32716749"},
        "gender": "male",
        "roles": [
            {"title": "Minister of People's Armed Forces", "org_id": "mnd", "start": "2014-06-25", "end": "2015-04-30", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Chief of the General Staff Department", "org_id": "kpa-gstaff", "start": "2012-07-16", "end": "2013-05-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Minister of People's Armed Forces and former Chief of General Staff, notoriously executed in April 2015 using four-barrel ZPU-4 anti-aircraft artillery before hundreds of military officers at Kang Kon Military Academy. He was charged with treason and disrespect after nodding off during a military conference chaired by Kim Jong Un.",
        "notable": [
            {"claim": "Briefed by the South Korean National Intelligence Service as having been executed by anti-aircraft gunfire on April 30, 2015 for dozing off at an event and talking back to Kim Jong Un.", "source_url": "https://www.bbc.com/news/world-asia-32716749", "date": "2015-05-13"}
        ],
        "tags": ["military", "purged"]
    },
    {
        "id": "ri-yong-ho-kpa",
        "name_en": "Ri Yong Ho (General)",
        "name_ko": "리영호",
        "aliases": ["Ri Yong-ho", "Vice Marshal Ri"],
        "wikidata": "Q492576",
        "image_commons": None,
        "born": {"date": "1942-10-05", "place": "Tongchon County, Kangwon, Korea"},
        "died": None,
        "status": {"value": "purged", "as_of": "2012-07-15", "source_url": "https://www.nytimes.com/2012/07/16/world/asia/north-korea-military-leader-relieved-of-duties.html"},
        "gender": "male",
        "roles": [
            {"title": "Chief of the General Staff Department of the KPA", "org_id": "kpa-gstaff", "start": "2009-02-11", "end": "2012-07-15", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Vice Chairman of the Central Military Commission", "org_id": "wpk-cmc", "start": "2010-09-28", "end": "2012-07-15", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the Politburo Presidium", "org_id": "wpk-politburo-presidium", "start": "2010-09-28", "end": "2012-07-15", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Vice Marshal and Chief of KPA General Staff who was appointed by Kim Jong Il as military tutor and co-regent for Kim Jong Un. In July 2012, in the young leader's first dramatic purge of the old guard, he was abruptly stripped of all posts due to alleged 'illness' amid reports of a brief firefight between his guards and security forces.",
        "notable": [
            {"claim": "Walked at the front right corner of Kim Jong Il's hearse in December 2011 as the top military custodian of the transition.", "source_url": "https://www.reuters.com/article/idUSL3E7NR06V/", "date": "2011-12-28"},
            {"claim": "Relieved of all party, military, and state positions during a snap Politburo meeting on July 15, 2012, marking Kim Jong Un's assertion of personal authority over the military.", "source_url": "https://www.nytimes.com/2012/07/16/world/asia/north-korea-military-leader-relieved-of-duties.html", "date": "2012-07-15"}
        ],
        "tags": ["military", "politburo", "purged"]
    },
    {
        "id": "thae-yong-ho",
        "name_en": "Thae Yong-ho",
        "name_ko": "태영호",
        "aliases": ["Tae Yong-ho", "Thae Hyong-sik"],
        "wikidata": "Q26398188",
        "image_commons": "Thae_Yong-ho_(Cropped).png",
        "born": {"date": "1962-07-25", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "defected", "as_of": "2016-08-17", "source_url": "https://www.bbc.com/news/world-asia-37107412"},
        "gender": "male",
        "roles": [
            {"title": "Deputy Ambassador to the United Kingdom", "org_id": "mfa", "start": "2006-01-01", "end": "2016-07-01", "source_url": "https://www.bbc.com/news/world-asia-37107412"}
        ],
        "family": [],
        "health": [],
        "physical": {
            "height_cm": {"value": 172, "source_name": "ROK National Assembly Profile", "source_url": "https://assembly.go.kr", "date": "2020-05-30", "confidence": "confirmed"},
            "weight_kg": None
        },
        "sanctions": [],
        "summary": "Former deputy ambassador at the North Korean Embassy in London who defected to South Korea with his family in July 2016, becoming the highest-ranking diplomat to defect since 1997. In 2020, he made history by being directly elected to South Korea's National Assembly representing Seoul's Gangnam district.",
        "notable": [
            {"claim": "Defected from the DPRK Embassy in London in July 2016 with assistance from British and South Korean intelligence.", "source_url": "https://www.bbc.com/news/world-asia-37107412", "date": "2016-08-17"},
            {"claim": "Elected as a constituency lawmaker for the conservative People Power Party in South Korea's National Assembly in April 2020.", "source_url": "https://www.reuters.com/article/us-southkorea-election-defectors-idUSKBN21Y074", "date": "2020-04-16"},
            {"claim": "Appointed Secretary-General of the Peaceful Unification Advisory Council by South Korean President Yoon Suk Yeol in July 2024.", "source_url": "https://en.yna.co.kr/view/AEN20240718006200315", "date": "2024-07-18"}
        ],
        "tags": ["defector", "diplomat"]
    },
    {
        "id": "ri-il-gyu",
        "name_en": "Ri Il-gyu",
        "name_ko": "리일규",
        "aliases": ["Ri Il-gyu"],
        "wikidata": "Q127513903",
        "image_commons": None,
        "born": {"date": "1972-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "defected", "as_of": "2023-11-01", "source_url": "https://www.chosun.com/english/national-en/2024/07/16/N6CEX7R67FCYDKS77E5Z37T4GE/"},
        "gender": "male",
        "roles": [
            {"title": "Counselor for Political Affairs, DPRK Embassy in Cuba", "org_id": "mfa", "start": "2019-01-01", "end": "2023-11-01", "source_url": "https://www.chosun.com/english/national-en/2024/07/16/N6CEX7R67FCYDKS77E5Z37T4GE/"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Counselor for Political Affairs at the North Korean Embassy in Havana who defected with his wife and child in November 2023, making him the highest-ranking diplomat to escape since 2016. In a July 2024 interview, he revealed high-level regime corruption and Kim Jong Un's personal rage over South Korea's diplomatic normalization with Cuba.",
        "notable": [
            {"claim": "Successfully resolved the 2013 Panamanian seizure of the Chong Chon Gang freighter carrying disassembled Cuban MiG fighter jets and surface-to-air missiles, receiving a commendation letter signed by Kim Jong Un.", "source_url": "https://www.chosun.com/english/national-en/2024/07/16/N6CEX7R67FCYDKS77E5Z37T4GE/", "date": "2014-03-01"},
            {"claim": "Fled Havana in November 2023 after being denied medical travel for a spinal ailment, going public with his defection in July 2024.", "source_url": "https://www.bbc.com/news/articles/c4ng08l41gdo", "date": "2024-07-16"}
        ],
        "tags": ["defector", "diplomat"]
    },
    {
        "id": "ryu-hyun-woo",
        "name_en": "Ryu Hyun-woo",
        "name_ko": "류현우",
        "aliases": ["Ryu Hyun-woo"],
        "wikidata": "Q105084732",
        "image_commons": None,
        "born": {"date": "1973-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "defected", "as_of": "2019-09-01", "source_url": "https://www.bbc.com/news/world-asia-55799988"},
        "gender": "male",
        "roles": [
            {"title": "Acting Ambassador to Kuwait", "org_id": "mfa", "start": "2017-09-01", "end": "2019-09-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "in-law", "person_id": "jon-il-chun", "note": "Son-in-law of Jon Il Chun (Director of Office 39)"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Acting Ambassador to Kuwait who defected with his family to South Korea in September 2019, with his escape kept secret until January 2021. As the son-in-law of Jon Il Chun (longtime head of Office 39), his defection provided unprecedented intelligence on Kim family illicit slush funds and overseas labor networks in the Persian Gulf.",
        "notable": [
            {"claim": "Took over as acting ambassador in Kuwait City after the Kuwaiti government expelled Ambassador So Chang Sik under UN sanctions in September 2017.", "source_url": "https://www.bbc.com/news/world-asia-55799988", "date": "2017-09-17"},
            {"claim": "Defected to the South Korean Embassy in Kuwait in September 2019, securing the escape of the daughter of the head of Office 39.", "source_url": "https://www.reuters.com/article/us-northkorea-southkorea-diplomat-kuwait-idUSKBN29U0B2", "date": "2021-01-25"}
        ],
        "tags": ["defector", "diplomat", "economy"]
    },
    {
        "id": "jo-song-gil",
        "name_en": "Jo Song-gil",
        "name_ko": "조성길",
        "aliases": ["Jo Song-gil"],
        "wikidata": "Q60395727",
        "image_commons": None,
        "born": {"date": "1975-03-09", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "defected", "as_of": "2018-11-01", "source_url": "https://www.reuters.com/article/us-northkorea-diplomat-italy-idUSKBN26S05L/"},
        "gender": "male",
        "roles": [
            {"title": "Acting Ambassador to Italy", "org_id": "mfa", "start": "2017-10-01", "end": "2018-11-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Acting Ambassador to Italy who disappeared with his wife from the embassy in Rome in November 2018 just days before his diplomatic mission was set to expire. His teenage daughter was subsequently repatriated by North Korean agents in Rome before he reached South Korea in July 2019.",
        "notable": [
            {"claim": "Disappeared from the Rome embassy compound in November 2018, seeking political asylum in a Western nation before relocating to Seoul.", "source_url": "https://www.bbc.com/news/world-asia-54445037", "date": "2020-10-07"}
        ],
        "tags": ["defector", "diplomat"]
    },
    {
        "id": "hwang-jang-yop",
        "name_en": "Hwang Jang-yop",
        "name_ko": "황장엽",
        "aliases": ["Hwang Jang-yop"],
        "wikidata": "Q488668",
        "image_commons": None,
        "born": {"date": "1923-02-17", "place": "Kangdong County, South Pyongan, Korea"},
        "died": {"date": "2010-10-10", "place": "Seoul, South Korea", "cause": "Heart failure in bathtub at secure residence"},
        "status": {"value": "dead", "as_of": "2010-10-10", "source_url": "https://www.reuters.com/article/idUSTRE6990C220101010/"},
        "gender": "male",
        "roles": [
            {"title": "Secretary of the Central Committee for International Affairs", "org_id": "wpk", "start": "1979-01-01", "end": "1997-02-12", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Chairman of the Supreme People's Assembly", "org_id": "spa", "start": "1972-12-28", "end": "1983-04-07", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "President of Kim Il Sung University", "org_id": "wpk", "start": "1965-04-01", "end": "1972-12-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Highest-ranking official ever to defect from North Korea, who served as Secretary of the Central Committee, President of Kim Il Sung University, and the principal philosophical architect of Juche ideology. In February 1997, he walked into the South Korean Embassy in Beijing, leaving behind his family who were sent to political prison camps.",
        "notable": [
            {"claim": "Walked into the South Korean consulate in Beijing on February 12, 1997 while returning from an ideological conference in Japan, causing a 35-day diplomatic standoff.", "source_url": "https://www.nytimes.com/1997/02/13/world/top-north-korean-official-defects-at-embassy-in-beijing.html", "date": "1997-02-12"},
            {"claim": "Survived multiple assassination attempts by North Korean Reconnaissance General Bureau hit teams sent to Seoul, dying of natural heart failure in 2010 at age 87.", "source_url": "https://www.reuters.com/article/idUSTRE6990C220101010/", "date": "2010-10-10"}
        ],
        "tags": ["defector", "politburo"]
    },
    {
        "id": "kang-myong-do",
        "name_en": "Kang Myong-do",
        "name_ko": "강명도",
        "aliases": ["Kang Myong-do"],
        "wikidata": "Q16177323",
        "image_commons": None,
        "born": {"date": "1958-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "defected", "as_of": "1994-05-01", "source_url": "https://www.washingtonpost.com/archive/politics/1994/07/28/defector-says-north-korea-has-5-nuclear-bombs/2c1d29fe-bc5d-4f05-89f5-455a0f5e1f98/"},
        "gender": "male",
        "roles": [
            {"title": "Vice President of Mangyongbong Joint Venture", "org_id": "wpk-office-39", "start": "1990-01-01", "end": "1994-05-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Son-in-law of former North Korean Premier Kang Song San, who defected to South Korea via China in May 1994. In a historic Seoul press conference, he provided the international community with early confirmation that North Korea had successfully developed nuclear weapons.",
        "notable": [
            {"claim": "Stated at a July 1994 press conference in Seoul that North Korea had already manufactured five nuclear bombs and was developing delivery missiles, escalating the 1994 nuclear crisis.", "source_url": "https://www.washingtonpost.com/archive/politics/1994/07/28/defector-says-north-korea-has-5-nuclear-bombs/2c1d29fe-bc5d-4f05-89f5-455a0f5e1f98/", "date": "1994-07-28"}
        ],
        "tags": ["defector", "economy"]
    },

    # Cultural, Protocol & Inner Circle Figures
    {
        "id": "hyon-song-wol",
        "name_en": "Hyon Song Wol",
        "name_ko": "현송월",
        "aliases": ["Hyon Song-wol"],
        "wikidata": "Q11287042",
        "image_commons": None,
        "born": {"date": "1977-01-01", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "female",
        "roles": [
            {"title": "Deputy Director of the Propaganda and Agitation Department", "org_id": "wpk-pad", "start": "2019-01-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Leader of the Moranbong Band / Samjiyon Orchestra", "org_id": "wpk-pad", "start": "2012-07-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the WPK Central Committee", "org_id": "wpk", "start": "2017-10-07", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Leader of the Moranbong Band, director of the Samjiyon Orchestra, and Deputy Director of PAD who manages protocol, public appearances, and stage acoustics for Kim Jong Un. Erroneously reported by international tabloids to have been executed by firing squad in 2013, she rose to full Central Committee membership and accompanied Kim to summits in Singapore, Hanoi, and Beijing.",
        "notable": [
            {"claim": "Falsely reported by South Korean media in August 2013 to have been executed by firing squad for pornography, but reappeared healthy months later.", "source_url": "https://www.bbc.com/news/world-asia-27443885", "date": "2014-05-17"},
            {"claim": "Led the North Korean cultural advance team across the DMZ to Seoul and Gangneung in January 2018 ahead of the PyeongChang Winter Olympics.", "source_url": "https://www.reuters.com/article/us-olympics-2018-northkorea-hyon-idUSKBN1FA06P", "date": "2018-01-21"}
        ],
        "tags": ["politburo", "family"]
    },
    {
        "id": "ri-chun-hee",
        "name_en": "Ri Chun Hee",
        "name_ko": "리춘희",
        "aliases": ["Ri Chun-hee", "Pink Lady"],
        "wikidata": "Q483789",
        "image_commons": None,
        "born": {"date": "1943-07-08", "place": "Tongchon County, Kangwon, Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr/view/AEN20220414002400325"},
        "gender": "female",
        "roles": [
            {"title": "Chief Anchor, Korean Central Television (KCTV)", "org_id": "wpk-pad", "start": "1974-01-01", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Legendary chief news anchor for Korean Central Television (KCTV), known worldwide as the 'Pink Lady' for her trademark pink hanbok and melodramatic, bombastic delivery. For over 50 years, she has served as the voice of regime milestones, tearfully announcing the deaths of Kim Il Sung and Kim Jong Il, and jubilantly proclaiming nuclear tests.",
        "notable": [
            {"claim": "Gifted a two-story luxury riverside terrace residence in Pyongyang by Kim Jong Un in April 2022 in recognition of her lifetime of state broadcasting loyalty.", "source_url": "https://en.yna.co.kr/view/AEN20220414002400325", "date": "2022-04-14"},
            {"claim": "Announced the official state broadcasts for the deaths of Kim Il Sung (1994) and Kim Jong Il (2011), as well as North Korea's first thermonuclear bomb test (2017).", "source_url": "https://www.reuters.com/article/us-northkorea-tv-anchor-idUSKCN1BN0P2", "date": "2017-09-04"}
        ],
        "tags": ["politburo"]
    },
    {
        "id": "kim-song-hye",
        "name_en": "Kim Song Hye",
        "name_ko": "김성혜",
        "aliases": ["Kim Song-hye"],
        "wikidata": "Q16174780",
        "image_commons": None,
        "born": {"date": "1965-07-17", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "purged", "as_of": "2019-05-31", "source_url": "https://www.bloomberg.com/news/articles/2019-05-31/north-korea-purges-key-officials-after-failed-hanoi-summit-chosun"},
        "gender": "female",
        "roles": [
            {"title": "Head of Secretariat, Committee for the Peaceful Reunification of the Fatherland", "org_id": "wpk", "start": "2011-01-01", "end": "2019-03-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Senior inter-Korean negotiator and United Front Department cadre who served as Kim Yo Jong's protocol shadow during the 2018 PyeongChang Olympics and summits. Following the diplomatic collapse of the February 2019 Hanoi Summit, she was purged and sent to a political prison camp.",
        "notable": [
            {"claim": "Accompanied Kim Yo Jong and Kim Yong Chol during the historic inter-Korean summit talks at Peace House in Panmunjom in April 2018.", "source_url": "https://www.reuters.com/article/us-northkorea-southkorea-aide-idUSKBN1HY0H3", "date": "2018-04-27"},
            {"claim": "Purged and sent to a political prison camp (Yodok / Camp 15) in spring 2019 following an audit into the breakdown of negotiations with Washington.", "source_url": "https://www.bloomberg.com/news/articles/2019-05-31/north-korea-purges-key-officials-after-failed-hanoi-summit-chosun", "date": "2019-05-31"}
        ],
        "tags": ["diplomat", "purged"]
    },
    {
        "id": "kim-ki-nam",
        "name_en": "Kim Ki Nam",
        "name_ko": "김기남",
        "aliases": ["Kim Ki-nam", "North Korea's Goebbels"],
        "wikidata": "Q7004480",
        "image_commons": None,
        "born": {"date": "1929-08-17", "place": "Wonsan, Kangwon, Korea"},
        "died": {"date": "2024-05-07", "place": "Pyongyang, North Korea", "cause": "Multiple organ failure and chronic old age (94)"},
        "status": {"value": "dead", "as_of": "2024-05-07", "source_url": "https://www.bbc.com/news/world-asia-68972828"},
        "gender": "male",
        "roles": [
            {"title": "Director of Propaganda and Agitation Department", "org_id": "wpk-pad", "start": "1989-01-01", "end": "2017-10-07", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Secretary of the Central Committee", "org_id": "wpk", "start": "1992-12-01", "end": "2017-10-07", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the WPK Political Bureau", "org_id": "wpk-politburo", "start": "2010-09-28", "end": "2017-10-07", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [],
        "health": [
            {
                "claim": "Received hospital treatment for chronic kidney disease and multiple organ dysfunction from 2022 until his death in May 2024 at age 94.",
                "source_name": "KCNA State Obituary",
                "source_url": "https://www.bbc.com/news/world-asia-68972828",
                "date": "2024-05-08",
                "confidence": "confirmed"
            }
        ],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [
            {
                "list": "OFAC",
                "id": "20158",
                "date": "2016-07-06",
                "source_url": "https://home.treasury.gov/news/press-releases/jl0506"
            }
        ],
        "summary": "Master state propagandist known as 'North Korea's Goebbels', who directed the Propaganda and Agitation Department across six decades, constructing the divine personality cults of Kim Il Sung, Kim Jong Il, and Kim Jong Un. He died in May 2024 at age 94, with Kim Jong Un personally heading his state funeral committee.",
        "notable": [
            {"claim": "Served as Editor-in-Chief of Rodong Sinmun in the 1970s before becoming the chief architect of the Kim family dynastic personality cult.", "source_url": "https://www.bbc.com/news/world-asia-68972828", "date": "2024-05-08"},
            {"claim": "Kim Jong Un personally attended his funeral in May 2024, visibly mourning and bowing before the open casket.", "source_url": "https://www.reuters.com/world/asia-pacific/north-koreas-kim-mourns-master-propagandist-state-funeral-2024-05-09/", "date": "2024-05-09"}
        ],
        "tags": ["politburo"]
    }
]
