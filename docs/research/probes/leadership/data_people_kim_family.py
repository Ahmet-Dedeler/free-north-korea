"""
Kim family dataset for North Korean leadership graph.
Contains 22 Kim dynasty figures, living and dead, with fully sourced relationships and claims.
"""

PEOPLE_KIM_FAMILY = [
    {
        "id": "kim-il-sung",
        "name_en": "Kim Il Sung",
        "name_ko": "김일성",
        "aliases": ["Kim Song-ju", "Great Leader", "Eternal President"],
        "wikidata": "Q41117",
        "image_commons": "Kim_Il-sung_in_1950.jpg",
        "born": {"date": "1912-04-15", "place": "Mangyongdae, Pyongyang, Korea"},
        "died": {"date": "1994-07-08", "place": "Mount Myohyang, North Korea", "cause": "Sudden heart attack / acute myocardial infarction"},
        "status": {"value": "dead", "as_of": "1994-07-08", "source_url": "https://www.latimes.com/archives/la-xpm-1994-07-09-mn-13540-story.html"},
        "gender": "male",
        "roles": [
            {"title": "General Secretary of the Workers' Party of Korea", "org_id": "wpk", "start": "1949-06-24", "end": "1994-07-08", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "President of the Democratic People's Republic of Korea", "org_id": "spa", "start": "1972-12-28", "end": "1994-07-08", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "father", "person_id": "kim-hyong-jik", "note": "Anti-Japanese nationalist activist"},
            {"relation": "mother", "person_id": "kang-pan-sok", "note": "Early communist activist reverenced as Mother of Korea"},
            {"relation": "spouse", "person_id": "kim-jong-suk", "note": "First wife, mother of Kim Jong Il"},
            {"relation": "spouse", "person_id": "kim-song-ae", "note": "Second wife, sidelined during succession"},
            {"relation": "child", "person_id": "kim-jong-il", "note": "Eldest son and chosen successor"},
            {"relation": "child", "person_id": "kim-man-il", "note": "Second son with Kim Jong Suk; drowned in childhood"},
            {"relation": "child", "person_id": "kim-kyong-hui", "note": "Daughter with Kim Jong Suk"},
            {"relation": "child", "person_id": "kim-pyong-il", "note": "Son with Kim Song Ae; long-serving ambassador abroad"},
            {"relation": "sibling", "person_id": "kim-yong-ju", "note": "Younger brother, former OGD director and Vice Premier"}
        ],
        "health": [
            {
                "claim": "Suffered from an inoperable, tennis-ball-sized calcinosis benign tumor on the right rear of his neck, requiring state photographers to shoot him strictly from the left front angle.",
                "source_name": "Los Angeles Times / Associated Press",
                "source_url": "https://www.latimes.com/archives/la-xpm-1994-07-09-mn-13540-story.html",
                "date": "1994-07-09",
                "confidence": "confirmed"
            },
            {
                "claim": "Died of a massive acute myocardial infarction following high stress and exhaustion at his Mount Myohyang villa during preparations for an inter-Korean summit with Kim Young-sam.",
                "source_name": "KCNA / ROK Ministry of Unification",
                "source_url": "https://nkinfo.unikorea.go.kr",
                "date": "1994-07-09",
                "confidence": "confirmed"
            }
        ],
        "physical": {
            "height_cm": {"value": 173, "source_name": "Soviet Military Medical Archives", "source_url": "https://www.wilsoncenter.org", "date": "1945-09-01", "confidence": "reported"},
            "weight_kg": {"value": 85, "source_name": "Official Medical Records Summary", "source_url": "https://nkinfo.unikorea.go.kr", "date": "1990-01-01", "confidence": "reported"}
        },
        "sanctions": [],
        "summary": "The founding dictator of the Democratic People's Republic of Korea who established the monolithic Kim dynastic state and formulated the state ideology of Juche. Posthumously designated 'Eternal President' of the republic, his revolutionary mythology remains the legal foundation of regime legitimacy.",
        "notable": [
            {"claim": "Launched the Korean War on June 25, 1950 by ordering the invasion of South Korea with Soviet military backing.", "source_url": "https://www.wilsoncenter.org/collection/korean-war", "date": "1950-06-25"},
            {"claim": "Purged all domestic rival factions (Soviet, Yanan, and domestic communist factions) following the 1956 August Incident to establish monolithic family rule.", "source_url": "https://www.wilsoncenter.org/publication/the-august-1956-plenum-and-the-roots-north-korean-unilateralism", "date": "1956-08-30"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kim-hyong-jik",
        "name_en": "Kim Hyong Jik",
        "name_ko": "김형직",
        "aliases": ["Kim Hyong-jik"],
        "wikidata": "Q484251",
        "image_commons": None,
        "born": {"date": "1894-07-10", "place": "Mangyongdae, Pyongyang, Korea"},
        "died": {"date": "1926-06-05", "place": "Jilin, Republic of China", "cause": "Severe frostbite and respiratory disease"},
        "status": {"value": "dead", "as_of": "1926-06-05", "source_url": "https://nkinfo.unikorea.go.kr"},
        "gender": "male",
        "roles": [],
        "family": [
            {"relation": "spouse", "person_id": "kang-pan-sok", "note": "Wife, mother of Kim Il Sung"},
            {"relation": "child", "person_id": "kim-il-sung", "note": "Eldest son, founder of DPRK"},
            {"relation": "child", "person_id": "kim-yong-ju", "note": "Third son, former head of OGD"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "The father of Kim Il Sung and early anti-Japanese independence campaigner reverenced in state mythology as an indomitable revolutionary. His pedigree is canonized as the generational origin of the Mount Paektu bloodline.",
        "notable": [
            {"claim": "Founded the Korean National Association in 1917 to campaign against Japanese colonial occupation.", "source_url": "https://nkinfo.unikorea.go.kr", "date": "1917-03-23"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kang-pan-sok",
        "name_en": "Kang Pan Sok",
        "name_ko": "강반석",
        "aliases": ["Mother of Korea"],
        "wikidata": "Q465545",
        "image_commons": None,
        "born": {"date": "1892-04-21", "place": "Chilgol, Pyongyang, Korea"},
        "died": {"date": "1932-07-31", "place": "Antu County, Jilin, Republic of China", "cause": "Illness"},
        "status": {"value": "dead", "as_of": "1932-07-31", "source_url": "https://nkinfo.unikorea.go.kr"},
        "gender": "female",
        "roles": [],
        "family": [
            {"relation": "spouse", "person_id": "kim-hyong-jik", "note": "Husband"},
            {"relation": "child", "person_id": "kim-il-sung", "note": "Eldest son"},
            {"relation": "child", "person_id": "kim-yong-ju", "note": "Son"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Mother of Kim Il Sung, venerated in North Korean state hagiography as the 'Mother of Korea' and model communist matriarch. Her Presbyterian Christian family roots in Chilgol were expunged from domestic propaganda to serve revolutionary dynastic mythmaking.",
        "notable": [
            {"claim": "Established the Anti-Japanese Women's Association in northeast China in 1926.", "source_url": "https://nkinfo.unikorea.go.kr", "date": "1926-12-26"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kim-jong-suk",
        "name_en": "Kim Jong Suk",
        "name_ko": "김정숙",
        "aliases": ["Heroine of the Anti-Japanese War", "Mother of Kim Jong Il"],
        "wikidata": "Q272449",
        "image_commons": None,
        "born": {"date": "1917-12-24", "place": "Hoeryong, North Hamgyong, Korea"},
        "died": {"date": "1949-09-22", "place": "Pyongyang, North Korea", "cause": "Complications during childbirth (stillbirth)"},
        "status": {"value": "dead", "as_of": "1949-09-22", "source_url": "https://nkinfo.unikorea.go.kr"},
        "gender": "female",
        "roles": [],
        "family": [
            {"relation": "spouse", "person_id": "kim-il-sung", "note": "Husband, married in Soviet Far East"},
            {"relation": "child", "person_id": "kim-jong-il", "note": "Eldest son, born in Soviet camp near Khabarovsk"},
            {"relation": "child", "person_id": "kim-man-il", "note": "Second son, drowned in 1947"},
            {"relation": "child", "person_id": "kim-kyong-hui", "note": "Daughter, married Jang Song Thaek"}
        ],
        "health": [
            {
                "claim": "Died in Pyongyang at age 31 during an emergency stillbirth delivery.",
                "source_name": "ROK Ministry of Unification",
                "source_url": "https://nkinfo.unikorea.go.kr",
                "date": "1949-09-22",
                "confidence": "confirmed"
            }
        ],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "First wife of Kim Il Sung and mother of Kim Jong Il, elevated to the 'Three Generals of Mount Paektu' alongside her husband and son. Her guerrilla legacy is canonized as the absolute standard of revolutionary loyalty and female sacrifice.",
        "notable": [
            {"claim": "Served as a guerrilla fighter in the 88th Separate Reconnaissance Brigade of the Soviet Red Army during World War II.", "source_url": "https://www.wilsoncenter.org", "date": "1942-08-01"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kim-song-ae",
        "name_en": "Kim Song Ae",
        "name_ko": "김성애",
        "aliases": ["Kim Song-ae"],
        "wikidata": "Q461937",
        "image_commons": None,
        "born": {"date": "1924-12-29", "place": "Kangso, South Pyongan, Korea"},
        "died": {"date": "2014-01-01", "place": "Kanggye, Jagang Province, North Korea", "cause": "Natural causes in internal exile"},
        "status": {"value": "dead", "as_of": "2018-12-12", "source_url": "https://en.yna.co.kr/view/AEN20181212006700315"},
        "gender": "female",
        "roles": [
            {"title": "Chairwoman of the Democratic Women's Union of Korea", "org_id": "wpk", "start": "1971-10-01", "end": "1998-04-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "spouse", "person_id": "kim-il-sung", "note": "Second official wife of Kim Il Sung"},
            {"relation": "child", "person_id": "kim-pyong-il", "note": "Son, sent into diplomatic exile"},
            {"relation": "in-law", "person_id": "kim-jong-il", "note": "Stepmother and political adversary in succession battle"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Second official wife of Kim Il Sung who attempted to position her biological son Kim Pyong Il as dynastic successor. After losing the power struggle to Kim Jong Il in the 1970s, she was systematically purged from public life and placed under internal surveillance.",
        "notable": [
            {"claim": "Appeared alongside Jimmy Carter during his 1994 diplomatic visit to Pyongyang, her final prominent public engagement.", "source_url": "https://www.reuters.com/article/us-northkorea-kim-song-ae-idUSKBN1OB0M8", "date": "1994-06-16"}
        ],
        "tags": ["family", "purged"]
    },
    {
        "id": "kim-jong-il",
        "name_en": "Kim Jong Il",
        "name_ko": "김정일",
        "aliases": ["Dear Leader", "Eternal General Secretary", "Yuri Irsenovich Kim"],
        "wikidata": "Q10665",
        "image_commons": "Vladimir_Putin_with_Kim_Jong-Il-2_(cropped)_(3).jpg",
        "born": {"date": "1941-02-16", "place": "Vyatskoye, Khabarovsk Krai, Soviet Union (officially Mount Paektu)", "note": "Soviet birth record name: Yuri Irsenovich Kim"},
        "died": {"date": "2011-12-17", "place": "Pyongyang, North Korea (on board special armored train)", "cause": "Acute myocardial infarction accompanied by cardiogenic shock"},
        "status": {"value": "dead", "as_of": "2011-12-17", "source_url": "https://www.reuters.com/article/world/north-korean-leader-kim-jong-il-dies-state-tv-idUSTRE7BH04N/"},
        "gender": "male",
        "roles": [
            {"title": "General Secretary of the Workers' Party of Korea", "org_id": "wpk", "start": "1997-10-08", "end": "2011-12-17", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Chairman of the National Defence Commission", "org_id": "sac", "start": "1993-04-09", "end": "2011-12-17", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "father", "person_id": "kim-il-sung", "note": "Father, regime founder"},
            {"relation": "mother", "person_id": "kim-jong-suk", "note": "Mother, revolutionary heroine"},
            {"relation": "sibling", "person_id": "kim-kyong-hui", "note": "Sister, core inner circle supporter"},
            {"relation": "half-sibling", "person_id": "kim-pyong-il", "note": "Half-brother and succession rival"},
            {"relation": "spouse", "person_id": "song-hye-rim", "note": "First major consort, mother of Kim Jong Nam"},
            {"relation": "spouse", "person_id": "ko-yong-hui", "note": "Consort, mother of Kim Jong Chol, Kim Jong Un, and Kim Yo Jong"},
            {"relation": "spouse", "person_id": "kim-ok", "note": "Longtime personal secretary and final consort"},
            {"relation": "child", "person_id": "kim-jong-nam", "note": "Eldest son, bypassed and assassinated"},
            {"relation": "child", "person_id": "kim-jong-chol", "note": "Second son, bypassed for leadership"},
            {"relation": "child", "person_id": "kim-jong-un", "note": "Third son and chosen successor"},
            {"relation": "child", "person_id": "kim-yo-jong", "note": "Daughter, key regime leader"},
            {"relation": "child", "person_id": "kim-sol-song", "note": "Daughter with Kim Yong Suk"}
        ],
        "health": [
            {
                "claim": "Suffered a debilitating stroke / cerebral hemorrhage in August 2008 that paralyzed his left side and precipitated the accelerated succession plan for Kim Jong Un.",
                "source_name": "Dr. François-Xavier Roux / Reuters",
                "source_url": "https://www.reuters.com/article/world/french-doctor-confirms-treated-kim-jong-il-for-stroke-idUSTRE4BB5L9/",
                "date": "2008-12-12",
                "confidence": "confirmed"
            },
            {
                "claim": "Suffered from long-term chronic diabetes, severe hypertension, and arteriosclerosis exacerbated by heavy cognac consumption and tobacco smoking.",
                "source_name": "National Intelligence Service (NIS) / JoongAng Ilbo",
                "source_url": "https://koreajoongangdaily.joins.com",
                "date": "2011-12-20",
                "confidence": "reported"
            },
            {
                "claim": "Died of an acute myocardial infarction complicated by cardiogenic shock on his train during an inspection tour.",
                "source_name": "KCNA State Announcement",
                "source_url": "https://www.reuters.com/article/world/north-korean-leader-kim-jong-il-dies-state-tv-idUSTRE7BH04N/",
                "date": "2011-12-19",
                "confidence": "confirmed"
            }
        ],
        "physical": {
            "height_cm": {"value": 160, "source_name": "US Intelligence Estimate / NIS", "source_url": "https://www.bbc.com/news/world-asia-16239693", "date": "2000-06-15", "confidence": "reported"},
            "weight_kg": {"value": 85, "source_name": "Medical Assessment Prior to 2008 Stroke", "source_url": "https://nkinfo.unikorea.go.kr", "date": "2007-01-01", "confidence": "reported"}
        },
        "sanctions": [],
        "summary": "Second dynastic leader of North Korea who ruled from 1994 to 2011, establishing Songun (Military-First) politics during the devastating Great Famine and conducting the country's first nuclear tests in 2006 and 2009. His institutional pivot toward the National Defence Commission consolidated autocratic command outside formal party organs.",
        "notable": [
            {"claim": "Conducted North Korea's first underground nuclear test on October 9, 2006 at Punggye-ri.", "source_url": "https://www.armscontrol.org/factsheets/dprkchron", "date": "2006-10-09"},
            {"claim": "Held the historic first Inter-Korean Summit in Pyongyang with South Korean President Kim Dae-jung in June 2000.", "source_url": "https://www.usip.org/publications/2000/06/first-inter-korean-summit", "date": "2000-06-15"}
        ],
        "tags": ["family", "politburo", "military"]
    },
    {
        "id": "song-hye-rim",
        "name_en": "Song Hye Rim",
        "name_ko": "성혜림",
        "aliases": ["Song Hye-rim"],
        "wikidata": "Q448833",
        "image_commons": None,
        "born": {"date": "1937-01-24", "place": "Changnyeong, South Gyeongsang, Korea"},
        "died": {"date": "2002-05-18", "place": "Moscow, Russian Federation", "cause": "Chronic illness and depression in exile"},
        "status": {"value": "dead", "as_of": "2002-05-18", "source_url": "https://www.theguardian.com/world/2002/may/25/northkorea"},
        "gender": "female",
        "roles": [],
        "family": [
            {"relation": "spouse", "person_id": "kim-jong-il", "note": "Partner / consort, forced into secret relationship"},
            {"relation": "child", "person_id": "kim-jong-nam", "note": "Son, raised in seclusion"}
        ],
        "health": [
            {
                "claim": "Suffered from severe chronic nervous breakdown, clinical depression, and diabetes, treated in Moscow elite clinics from the 1980s until her death.",
                "source_name": "The Guardian / South Korean Press",
                "source_url": "https://www.theguardian.com/world/2002/may/25/northkorea",
                "date": "2002-05-25",
                "confidence": "reported"
            }
        ],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Celebrated North Korean actress who became the secret consort of Kim Jong Il and gave birth to his eldest son, Kim Jong Nam. Kept hidden to avoid the disapproval of Kim Il Sung, she was exiled to Moscow, where she died in isolation.",
        "notable": [
            {"claim": "Fled to Moscow in the late 1970s for psychiatric treatment after being displaced by Kim Jong Il's subsequent relationships.", "source_url": "https://www.theguardian.com/world/2002/may/25/northkorea", "date": "1980-01-01"}
        ],
        "tags": ["family"]
    },
    {
        "id": "ko-yong-hui",
        "name_en": "Ko Yong Hui",
        "name_ko": "고용희",
        "aliases": ["Ko Young-hee", "Respected Mother", "Ko Sun-hui"],
        "wikidata": "Q263732",
        "image_commons": None,
        "born": {"date": "1952-06-26", "place": "Osaka, Japan"},
        "died": {"date": "2004-05-24", "place": "Paris, France", "cause": "Breast cancer and heart failure"},
        "status": {"value": "dead", "as_of": "2004-05-24", "source_url": "https://www.reuters.com/article/us-northkorea-leader-mother-idUSBRE85A04X20120611"},
        "gender": "female",
        "roles": [],
        "family": [
            {"relation": "spouse", "person_id": "kim-jong-il", "note": "Consort and dominant matriarch of the current line"},
            {"relation": "child", "person_id": "kim-jong-chol", "note": "Elder son"},
            {"relation": "child", "person_id": "kim-jong-un", "note": "Younger son and Supreme Leader"},
            {"relation": "child", "person_id": "kim-yo-jong", "note": "Daughter, vice director of PAD"}
        ],
        "health": [
            {
                "claim": "Diagnosed with advanced breast cancer in the late 1990s; received specialized chemotherapy treatment in Paris before succumbing in May 2004.",
                "source_name": "Mainichi Shimbun / Reuters",
                "source_url": "https://www.reuters.com/article/us-northkorea-leader-mother-idUSBRE85A04X20120611",
                "date": "2004-08-27",
                "confidence": "confirmed"
            }
        ],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Zainichi Korean dancer born in Osaka who became the favored consort of Kim Jong Il and biological mother to Kim Jong Un, Kim Yo Jong, and Kim Jong Chol. Her Japanese origin and lower songbun classification remain state secrets strictly concealed within domestic propaganda.",
        "notable": [
            {"claim": "Arrived in North Korea in the early 1960s under the mass repatriation program for ethnic Koreans in Japan.", "source_url": "https://www.reuters.com/article/us-northkorea-leader-mother-idUSBRE85A04X20120611", "date": "1962-05-01"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kim-ok",
        "name_en": "Kim Ok",
        "name_ko": "김옥",
        "aliases": ["Kim Ok"],
        "wikidata": "Q489370",
        "image_commons": None,
        "born": {"date": "1964-08-28", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "purged", "as_of": "2016-07-26", "source_url": "https://en.yna.co.kr/view/AEN20160726002600315"},
        "gender": "female",
        "roles": [
            {"title": "Personal Secretary to National Defence Commission Chairman", "org_id": "sac", "start": "1980-01-01", "end": "2011-12-17", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "spouse", "person_id": "kim-jong-il", "note": "Fourth consort / de facto wife following Ko Yong Hui's death"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Longtime personal secretary and de facto fourth wife of Kim Jong Il who exercised immense gatekeeper power over access to the leader from 2004 to 2011. Following Kim Jong Un's accession, she and her family were systematically purged and sent to a labor camp.",
        "notable": [
            {"claim": "Accompanied Special Envoy Jo Myong Rok to the White House in October 2000 to meet President Bill Clinton under diplomatic cover.", "source_url": "https://www.nknews.org/2016/07/kim-jong-ils-last-mistress-purged-by-kim-jong-un-rfa/", "date": "2000-10-10"},
            {"claim": "Sent to a political prison / labor re-education camp around 2016 along with her relatives to eliminate rival patronage networks.", "source_url": "https://en.yna.co.kr/view/AEN20160726002600315", "date": "2016-07-26"}
        ],
        "tags": ["family", "purged"]
    },
    {
        "id": "kim-jong-un",
        "name_en": "Kim Jong Un",
        "name_ko": "김정은",
        "aliases": ["Supreme Leader", "General Secretary", "Kim Jong-eun"],
        "wikidata": "Q56226",
        "image_commons": "Kim_Jong-un_and_Vladimir_Putin_(2023-09-13)_12_(cropped_2).jpg",
        "born": {"date": "1984-01-08", "place": "Pyongyang, North Korea", "note": "US OFAC records list Jan 8, 1984; state propaganda claims 1982"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "male",
        "roles": [
            {"title": "General Secretary of the Workers' Party of Korea", "org_id": "wpk", "start": "2021-01-10", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "President of the State Affairs Commission", "org_id": "sac", "start": "2016-06-29", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "President of Politburo Presidium", "org_id": "wpk-politburo-presidium", "start": "2012-04-11", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "President of Central Military Commission", "org_id": "wpk-cmc", "start": "2012-04-11", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "father", "person_id": "kim-jong-il", "note": "Father, second supreme leader"},
            {"relation": "mother", "person_id": "ko-yong-hui", "note": "Mother, consort from Japan"},
            {"relation": "spouse", "person_id": "ri-sol-ju", "note": "First Lady, married circa 2009"},
            {"relation": "child", "person_id": "kim-ju-ae", "note": "Daughter and prominent public heir presumptive"},
            {"relation": "sibling", "person_id": "kim-yo-jong", "note": "Sister, core regime gatekeeper and adviser"},
            {"relation": "sibling", "person_id": "kim-jong-chol", "note": "Older brother, non-political"},
            {"relation": "half-sibling", "person_id": "kim-jong-nam", "note": "Older half-brother, assassinated 2017"},
            {"relation": "half-sibling", "person_id": "kim-sol-song", "note": "Older half-sister"},
            {"relation": "uncle", "person_id": "jang-song-thaek", "note": "Uncle-in-law, executed Dec 2013"},
            {"relation": "aunt", "person_id": "kim-kyong-hui", "note": "Paternal aunt, surviving elder"}
        ],
        "health": [
            {
                "claim": "South Korean National Intelligence Service (NIS) assessed in July 2024 that Kim Jong Un's weight reached approximately 140 kg, placing him at severe risk of cardiovascular disease, with symptoms of insomnia and high blood pressure.",
                "source_name": "National Intelligence Service (NIS) / Yonhap News",
                "source_url": "https://en.yna.co.kr/view/AEN20240729005400315",
                "date": "2024-07-29",
                "confidence": "reported"
            },
            {
                "claim": "Underwent surgery in autumn 2014 to remove a cyst from his right ankle (tarsal tunnel syndrome) caused by obesity and acute gout, causing a 40-day public disappearance.",
                "source_name": "National Intelligence Service (NIS) / The Guardian",
                "source_url": "https://www.theguardian.com/world/2014/oct/28/kim-jong-un-had-cyst-removed-from-ankle-south-korean-intelligence-says",
                "date": "2014-10-28",
                "confidence": "reported"
            },
            {
                "claim": "Heavily consumes alcohol and imported cigarettes, showing high genetic predisposition to myocardial infarction (the fatal cause of death for both his father and grandfather).",
                "source_name": "National Intelligence Service (NIS) Parliamentary Briefing",
                "source_url": "https://www.bbc.com/news/world-asia-65766861",
                "date": "2023-05-31",
                "confidence": "reported"
            }
        ],
        "physical": {
            "height_cm": {"value": 170, "source_name": "NIS Intelligence Assessment", "source_url": "https://en.yna.co.kr/view/AEN20240729005400315", "date": "2024-07-29", "confidence": "reported"},
            "weight_kg": {"value": 140, "source_name": "NIS Intelligence Briefing", "source_url": "https://en.yna.co.kr/view/AEN20240729005400315", "date": "2024-07-29", "confidence": "reported"}
        },
        "sanctions": [
            {
                "list": "OFAC",
                "id": "20157",
                "date": "2016-07-06",
                "source_url": "https://home.treasury.gov/news/press-releases/jl0506"
            },
            {
                "list": "EU",
                "id": "EU-DPRK-001",
                "date": "2016-12-12",
                "source_url": "https://eur-lex.europa.eu"
            },
            {
                "list": "KR",
                "id": "ROK-MOU-001",
                "date": "2016-03-08",
                "source_url": "https://www.unikorea.go.kr"
            }
        ],
        "summary": "Supreme Leader of North Korea since December 2011, wielding monolithic dictatorial authority across the party, armed forces, and nuclear arsenal. He accelerated ICBM and tactical nuclear development while radically shifting state doctrine in 2024 to declare South Korea an immutable hostile foreign state.",
        "notable": [
            {"claim": "Ordered the public execution of his uncle and de facto regent Jang Song Thaek on treason charges in December 2013.", "source_url": "https://www.nytimes.com/2013/12/13/world/asia/north-korea-says-uncles-execution-cleared-a-faction.html", "date": "2013-12-12"},
            {"claim": "Authorized the assassination of his half-brother Kim Jong Nam using VX nerve agent at Kuala Lumpur International Airport in February 2017.", "source_url": "https://www.justice.gov/opa/pr/north-korean-national-extradited-united-states-money-laundering-charges", "date": "2017-02-13"},
            {"claim": "Signed a mutual defense treaty with Russian President Vladimir Putin in Pyongyang in June 2024, providing artillery ammunition and troops to Russia.", "source_url": "https://www.reuters.com/world/asia-pacific/putin-kim-sign-partnership-agreement-pledge-mutual-aid-against-aggression-2024-06-19/", "date": "2024-06-19"}
        ],
        "tags": ["family", "politburo", "military", "missile"]
    },
    {
        "id": "ri-sol-ju",
        "name_en": "Ri Sol Ju",
        "name_ko": "리설주",
        "aliases": ["Respected First Lady", "Ri Sol-ju"],
        "wikidata": "Q272719",
        "image_commons": "Ri_Sol-ju_(April_27,_2018).png",
        "born": {"date": "1989-09-28", "place": "Chongjin, North Hamgyong, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "female",
        "roles": [
            {"title": "First Lady of the Democratic People's Republic of Korea", "org_id": "sac", "start": "2018-04-15", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "spouse", "person_id": "kim-jong-un", "note": "Husband, Supreme Leader"},
            {"relation": "child", "person_id": "kim-ju-ae", "note": "Daughter"}
        ],
        "health": [
            {
                "claim": "Absences from public view in 2010, 2013, and 2017 were assessed by the NIS as coinciding with childbirth pregnancies.",
                "source_name": "National Intelligence Service (NIS) / Yonhap News",
                "source_url": "https://en.yna.co.kr/view/AEN20170829007400315",
                "date": "2017-08-29",
                "confidence": "reported"
            }
        ],
        "physical": {
            "height_cm": {"value": 164, "source_name": "NIS Estimate", "source_url": "https://nkinfo.unikorea.go.kr", "date": "2012-07-25", "confidence": "reported"},
            "weight_kg": None
        },
        "sanctions": [],
        "summary": "First Lady of North Korea and former vocalist with the Unhasu Orchestra, officially elevated with the unprecedented title of 'Respected First Lady' in 2018. She plays a symbolic public diplomacy role and softens regime presentation at state banquets and missile test viewings.",
        "notable": [
            {"claim": "Visited South Korea in 2005 as a member of North Korea's cheerleading squad for the Asian Athletics Championships in Incheon.", "source_url": "https://www.bbc.com/news/world-asia-19008272", "date": "2005-09-01"},
            {"claim": "Granted the title 'Respected First Lady' by state media in April 2018, the first time in over 40 years that designation was used.", "source_url": "https://www.straitstimes.com/asia/east-asia/north-korea-gives-kim-jong-uns-wife-ri-sol-ju-new-title-of-first-lady", "date": "2018-04-19"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kim-ju-ae",
        "name_en": "Kim Ju Ae",
        "name_ko": "김주애",
        "aliases": ["Respected Daughter", "Beloved Child", "Hyang-do (Guide)"],
        "wikidata": "Q14864448",
        "image_commons": None,
        "born": {"date": "2013-02-19", "place": "Pyongyang, North Korea", "note": "Birth confirmed by Dennis Rodman following his 2013 visit"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr/view/AEN20240729005400315"},
        "gender": "female",
        "roles": [],
        "family": [
            {"relation": "father", "person_id": "kim-jong-un", "note": "Father, Supreme Leader"},
            {"relation": "mother", "person_id": "ri-sol-ju", "note": "Mother, First Lady"},
            {"relation": "aunt", "person_id": "kim-yo-jong", "note": "Aunt, PAD Vice Director"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Daughter of Kim Jong Un, publicly introduced in November 2022 and widely assessed by South Korea's National Intelligence Service as the regime's heir presumptive. She accompanies her father to strategic missile launches, military parades, and economic groundbreakings.",
        "notable": [
            {"claim": "Made her public debut on November 18, 2022 inspecting the launch of a Hwasong-17 intercontinental ballistic missile.", "source_url": "https://www.reuters.com/world/asia-pacific/north-koreas-kim-reveals-daughter-public-first-time-icbm-launch-2022-11-19/", "date": "2022-11-19"},
            {"claim": "Referred to by state media in March 2024 with the honorific term 'hyangdo' (guide/beacon), an ideological term reserved exclusively for supreme leaders and designated successors.", "source_url": "https://en.yna.co.kr/view/AEN20240318005300315", "date": "2024-03-18"}
        ],
        "tags": ["family", "missile"]
    },
    {
        "id": "kim-yo-jong",
        "name_en": "Kim Yo Jong",
        "name_ko": "김여정",
        "aliases": ["Kim Yo-jong", "Vice Department Director"],
        "wikidata": "Q498833",
        "image_commons": None,
        "born": {"date": "1987-09-26", "place": "Pyongyang, North Korea", "note": "MOU nkinfo confirms 1987; US OFAC designation records list 1989"},
        "died": None,
        "status": {"value": "alive", "as_of": "2026-09-01", "source_url": "https://en.yna.co.kr"},
        "gender": "female",
        "roles": [
            {"title": "Vice Department Director of Propaganda and Agitation Department", "org_id": "wpk-pad", "start": "2014-11-27", "end": None, "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Member of the State Affairs Commission", "org_id": "sac", "start": "2021-09-29", "end": None, "source_url": "https://en.yna.co.kr/view/AEN20210930002100325"}
        ],
        "family": [
            {"relation": "father", "person_id": "kim-jong-il", "note": "Father, former leader"},
            {"relation": "mother", "person_id": "ko-yong-hui", "note": "Mother"},
            {"relation": "sibling", "person_id": "kim-jong-un", "note": "Brother, Supreme Leader"},
            {"relation": "sibling", "person_id": "kim-jong-chol", "note": "Older brother"},
            {"relation": "half-sibling", "person_id": "kim-jong-nam", "note": "Half-brother, deceased"}
        ],
        "health": [],
        "physical": {
            "height_cm": {"value": 162, "source_name": "NIS Estimate", "source_url": "https://nkinfo.unikorea.go.kr", "date": "2018-02-10", "confidence": "reported"},
            "weight_kg": None
        },
        "sanctions": [
            {
                "list": "OFAC",
                "id": "21444",
                "date": "2017-01-11",
                "source_url": "https://home.treasury.gov/news/press-releases/as0004"
            },
            {
                "list": "EU",
                "id": "EU-DPRK-012",
                "date": "2017-04-06",
                "source_url": "https://eur-lex.europa.eu"
            }
        ],
        "summary": "Younger sister and closest trusted confidante of Kim Jong Un, serving as Vice Director of the Propaganda and Agitation Department and State Affairs Commission member. She acts as the primary rhetorical attack dog against Seoul and Washington, issuing authoritative foreign policy threats.",
        "notable": [
            {"claim": "Served as special envoy to the 2018 PyeongChang Winter Olympics, becoming the first direct member of the Kim family to visit South Korea since the Korean War.", "source_url": "https://www.reuters.com/article/us-olympics-2018-northkorea-kimyojong-idUSKBN1FT04Z", "date": "2018-02-09"},
            {"claim": "Ordered the demolition of the Inter-Korean Liaison Office in Kaesong on June 16, 2020 after issuing warnings in state media.", "source_url": "https://www.bbc.com/news/world-asia-53060620", "date": "2020-06-16"}
        ],
        "tags": ["family", "politburo", "security"]
    },
    {
        "id": "kim-jong-chol",
        "name_en": "Kim Jong Chol",
        "name_ko": "김정철",
        "aliases": ["Kim Jong-chul"],
        "wikidata": "Q385795",
        "image_commons": None,
        "born": {"date": "1981-09-25", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2024-01-01", "source_url": "https://nkinfo.unikorea.go.kr"},
        "gender": "male",
        "roles": [],
        "family": [
            {"relation": "father", "person_id": "kim-jong-il", "note": "Father"},
            {"relation": "mother", "person_id": "ko-yong-hui", "note": "Mother"},
            {"relation": "sibling", "person_id": "kim-jong-un", "note": "Younger brother, Supreme Leader"},
            {"relation": "sibling", "person_id": "kim-yo-jong", "note": "Sister"},
            {"relation": "half-sibling", "person_id": "kim-jong-nam", "note": "Half-brother"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Elder full brother of Kim Jong Un, famously bypassed for succession by Kim Jong Il for being 'too effeminate and weak'. He lives a quiet, supervised life in Pyongyang with no political portfolio, known internationally for his passion for Eric Clapton concerts.",
        "notable": [
            {"claim": "Filmed by international media attending Eric Clapton rock concerts in Singapore (2011) and London Royal Albert Hall (2015).", "source_url": "https://www.bbc.com/news/world-asia-32846467", "date": "2015-05-22"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kim-jong-nam",
        "name_en": "Kim Jong Nam",
        "name_ko": "김정남",
        "aliases": ["Kim Chol", "Kim Jong-nam"],
        "wikidata": "Q313367",
        "image_commons": None,
        "born": {"date": "1971-05-10", "place": "Pyongyang, North Korea"},
        "died": {"date": "2017-02-13", "place": "Kuala Lumpur International Airport, Malaysia", "cause": "Chemical weapon assassination (VX nerve agent exposure)"},
        "status": {"value": "executed", "as_of": "2017-02-13", "source_url": "https://www.reuters.com/article/us-northkorea-malaysia-kim-idUSKBN16307T"},
        "gender": "male",
        "roles": [],
        "family": [
            {"relation": "father", "person_id": "kim-jong-il", "note": "Father"},
            {"relation": "mother", "person_id": "song-hye-rim", "note": "Mother, actress who died in Moscow"},
            {"relation": "half-sibling", "person_id": "kim-jong-un", "note": "Half-brother and architect of his assassination"},
            {"relation": "child", "person_id": "kim-han-sol", "note": "Son, in protective exile"}
        ],
        "health": [
            {
                "claim": "Assassinated via dermal exposure to VX nerve agent smeared on his face by two recruited operatives directed by RGB intelligence handlers.",
                "source_name": "Malaysian Government Forensic Autopsy Report",
                "source_url": "https://www.reuters.com/article/us-northkorea-malaysia-kim-idUSKBN16307T",
                "date": "2017-02-24",
                "confidence": "confirmed"
            }
        ],
        "physical": {
            "height_cm": {"value": 172, "source_name": "Malaysian Autopsy Record", "source_url": "https://www.reuters.com/article/us-northkorea-malaysia-kim-idUSKBN16307T", "date": "2017-02-24", "confidence": "confirmed"},
            "weight_kg": {"value": 96, "source_name": "Malaysian Autopsy Record", "source_url": "https://www.reuters.com/article/us-northkorea-malaysia-kim-idUSKBN16307T", "date": "2017-02-24", "confidence": "confirmed"}
        },
        "sanctions": [],
        "summary": "Eldest son of Kim Jong Il and onetime heir apparent, disqualified from power after a humiliating 2001 arrest at Tokyo Narita Airport using a forged Dominican passport. He lived under Chinese security protection in Macau until his state-sponsored VX nerve agent assassination in 2017.",
        "notable": [
            {"claim": "Detained at Tokyo Narita Airport in May 2001 attempting to visit Tokyo Disneyland on a fraudulent passport, precipitating his loss of succession favor.", "source_url": "https://www.theguardian.com/world/2001/may/04/japan", "date": "2001-05-04"},
            {"claim": "Met with US Central Intelligence Agency (CIA) contacts in Southeast Asia prior to his assassination, according to Malaysian court testimony.", "source_url": "https://www.wsj.com/articles/north-korean-leader-s-slain-half-brother-was-a-cia-informant-11560203008", "date": "2019-06-10"}
        ],
        "tags": ["family", "purged"]
    },
    {
        "id": "kim-han-sol",
        "name_en": "Kim Han Sol",
        "name_ko": "김한솔",
        "aliases": ["Kim Han-sol"],
        "wikidata": "Q6408719",
        "image_commons": None,
        "born": {"date": "1995-06-16", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2024-01-01", "source_url": "https://www.newyorker.com/magazine/2020/11/23/the-underground-movement-trying-to-topple-the-north-korean-regime"},
        "gender": "male",
        "roles": [],
        "family": [
            {"relation": "father", "person_id": "kim-jong-nam", "note": "Assassinated in Malaysia"},
            {"relation": "uncle", "person_id": "kim-jong-un", "note": "Half-uncle, Supreme Leader"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Eldest son of the assassinated Kim Jong Nam, representing a direct male bloodline descendant of Kim Il Sung. Following his father's murder in 2017, he was evacuated by the dissident group Free Joseon (Cheollima Civil Defense) and remains under undisclosed international protection.",
        "notable": [
            {"claim": "Openly criticized Kim Jong Un as a 'dictator' during a televised interview with former Finnish Defense Minister Elisabeth Rehn in 2012.", "source_url": "https://www.bbc.com/news/world-asia-20003058", "date": "2012-10-19"},
            {"claim": "Released a video proof of life in March 2017 following his evacuation from Macau by Free Joseon.", "source_url": "https://www.newyorker.com/magazine/2020/11/23/the-underground-movement-trying-to-topple-the-north-korean-regime", "date": "2017-03-08"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kim-sol-song",
        "name_en": "Kim Sol Song",
        "name_ko": "김설송",
        "aliases": ["Kim Sul-song"],
        "wikidata": "Q494877",
        "image_commons": None,
        "born": {"date": "1974-12-30", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2023-01-01", "source_url": "https://nkleadershipwatch.wordpress.com"},
        "gender": "female",
        "roles": [
            {"title": "Senior Staff Director in Central Committee Secretariat", "org_id": "wpk", "start": "1998-01-01", "end": None, "source_url": "https://nkleadershipwatch.wordpress.com"}
        ],
        "family": [
            {"relation": "father", "person_id": "kim-jong-il", "note": "Father"},
            {"relation": "half-sibling", "person_id": "kim-jong-un", "note": "Half-brother, Supreme Leader"},
            {"relation": "half-sibling", "person_id": "kim-yo-jong", "note": "Half-sister"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Eldest daughter of Kim Jong Il by Kim Yong Suk, described by intelligence sources as an astute behind-the-scenes administrator managing Kim family affairs and documentation. She operates entirely away from public state media cameras, providing organizational stability to the core household.",
        "notable": [
            {"claim": "Served as head of security and itinerary scheduling for Kim Jong Il during the 2000s.", "source_url": "https://nkleadershipwatch.wordpress.com", "date": "2006-01-01"}
        ],
        "tags": ["family"]
    },
    {
        "id": "kim-kyong-hui",
        "name_en": "Kim Kyong Hui",
        "name_ko": "김경희",
        "aliases": ["Kim Kyong-hui"],
        "wikidata": "Q268593",
        "image_commons": None,
        "born": {"date": "1946-05-30", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2024-01-01", "source_url": "https://en.yna.co.kr/view/AEN20200126000700325"},
        "gender": "female",
        "roles": [
            {"title": "Director of Light Industry Department", "org_id": "wpk", "start": "1988-01-01", "end": "2013-12-12", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "KPA General", "org_id": "mnd", "start": "2010-09-27", "end": "2013-12-12", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "father", "person_id": "kim-il-sung", "note": "Father"},
            {"relation": "mother", "person_id": "kim-jong-suk", "note": "Mother"},
            {"relation": "sibling", "person_id": "kim-jong-il", "note": "Full brother, former Supreme Leader"},
            {"relation": "spouse", "person_id": "jang-song-thaek", "note": "Husband, executed Dec 2013"},
            {"relation": "nephew", "person_id": "kim-jong-un", "note": "Nephew, Supreme Leader"}
        ],
        "health": [
            {
                "claim": "Suffered from chronic alcoholism, clinical depression, and cardiovascular disease following the 2006 suicide of her daughter Jang Kum-song in Paris.",
                "source_name": "Chosun Ilbo / NIS Reports",
                "source_url": "https://english.chosun.com",
                "date": "2014-01-06",
                "confidence": "reported"
            }
        ],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Only full sister of Kim Jong Il and powerful aunt of Kim Jong Un, who served for decades as Director of Light Industry and four-star general. Spared execution when her husband Jang Song Thaek was eliminated in 2013, she vanished for six years before reappearing at a Lunar New Year concert in 2020.",
        "notable": [
            {"claim": "Promoted to four-star KPA General alongside Kim Jong Un at the September 2010 Party Conference.", "source_url": "https://www.reuters.com/article/us-korea-north-promotion-idUSTRE68Q3U520100927", "date": "2010-09-27"},
            {"claim": "Reappeared publicly on January 25, 2020 at the Samjiyon Theater in Pyongyang, dispelling rumors that she had been poisoned or executed.", "source_url": "https://en.yna.co.kr/view/AEN20200126000700325", "date": "2020-01-26"}
        ],
        "tags": ["family", "politburo"]
    },
    {
        "id": "jang-song-thaek",
        "name_en": "Jang Song Thaek",
        "name_ko": "장성택",
        "aliases": ["Chang Sung-taek"],
        "wikidata": "Q312521",
        "image_commons": None,
        "born": {"date": "1946-01-22", "place": "Kangwon Province, Korea"},
        "died": {"date": "2013-12-12", "place": "Ministry of State Security headquarters, Pyongyang", "cause": "Execution by firing squad following special military tribunal"},
        "status": {"value": "executed", "as_of": "2013-12-12", "source_url": "https://www.nytimes.com/2013/12/13/world/asia/north-korea-says-uncles-execution-cleared-a-faction.html"},
        "gender": "male",
        "roles": [
            {"title": "Vice Chairman of the National Defence Commission", "org_id": "sac", "start": "2010-06-07", "end": "2013-12-08", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Director of Administration Department", "org_id": "wpk", "start": "2007-10-01", "end": "2013-12-08", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "spouse", "person_id": "kim-kyong-hui", "note": "Wife, sister of Kim Jong Il"},
            {"relation": "nephew", "person_id": "kim-jong-un", "note": "Nephew-in-law and executor"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Uncle-in-law to Kim Jong Un and primary regime regent during the 2011-2013 succession transition, who commanded massive commercial and mining networks with China. In December 2013, he was arrested during a live Politburo meeting and executed as 'traitor for all ages' in the most violent high-level purge of the Kim Jong Un era.",
        "notable": [
            {"claim": "Arrested by uniformed security officers in front of cameras during an expanded Politburo meeting on December 8, 2013.", "source_url": "https://www.bbc.com/news/world-asia-25301884", "date": "2013-12-08"},
            {"claim": "Executed on December 12, 2013 following a special military tribunal of the Ministry of State Security on charges of attempting to overthrow the state.", "source_url": "https://www.nytimes.com/2013/12/13/world/asia/north-korea-says-uncles-execution-cleared-a-faction.html", "date": "2013-12-12"}
        ],
        "tags": ["family", "politburo", "purged", "economy"]
    },
    {
        "id": "kim-pyong-il",
        "name_en": "Kim Pyong Il",
        "name_ko": "김평일",
        "aliases": ["Kim Pyong-il"],
        "wikidata": "Q494851",
        "image_commons": None,
        "born": {"date": "1954-08-10", "place": "Pyongyang, North Korea"},
        "died": None,
        "status": {"value": "alive", "as_of": "2024-01-01", "source_url": "https://en.yna.co.kr/view/AEN20191130001500325"},
        "gender": "male",
        "roles": [
            {"title": "Ambassador to the Czech Republic", "org_id": "mfa", "start": "2015-01-01", "end": "2019-11-01", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Ambassador to Poland", "org_id": "mfa", "start": "1998-01-01", "end": "2015-01-01", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "father", "person_id": "kim-il-sung", "note": "Father, regime founder"},
            {"relation": "mother", "person_id": "kim-song-ae", "note": "Mother, second wife"},
            {"relation": "half-sibling", "person_id": "kim-jong-il", "note": "Older half-brother and victor in succession struggle"},
            {"relation": "nephew", "person_id": "kim-jong-un", "note": "Half-nephew, Supreme Leader"}
        ],
        "health": [],
        "physical": {
            "height_cm": {"value": 174, "source_name": "Diplomatic Observation", "source_url": "https://en.yna.co.kr", "date": "2015-01-01", "confidence": "reported"},
            "weight_kg": None
        },
        "sanctions": [],
        "summary": "Half-brother of Kim Jong Il who physically resembled Kim Il Sung and was once seen as a prime succession candidate. After losing the power contest in the 1970s, he spent four decades in diplomatic exile as ambassador to Hungary, Bulgaria, Finland, Poland, and Czechia before being recalled to Pyongyang in 2019 under strict domestic watch.",
        "notable": [
            {"claim": "Recalled to Pyongyang in November 2019 after 31 continuous years abroad as an ambassador, ending his external postings.", "source_url": "https://en.yna.co.kr/view/AEN20191130001500325", "date": "2019-11-30"}
        ],
        "tags": ["family", "diplomat"]
    },
    {
        "id": "kim-yong-ju",
        "name_en": "Kim Yong Ju",
        "name_ko": "김영주",
        "aliases": ["Kim Yong-ju"],
        "wikidata": "Q494870",
        "image_commons": None,
        "born": {"date": "1920-09-21", "place": "Mangyongdae, Pyongyang, Korea"},
        "died": {"date": "2021-12-14", "place": "Pyongyang, North Korea", "cause": "Natural causes / extreme old age (101)"},
        "status": {"value": "dead", "as_of": "2021-12-14", "source_url": "https://en.yna.co.kr/view/AEN20211215001700325"},
        "gender": "male",
        "roles": [
            {"title": "Director of Organization and Guidance Department", "org_id": "wpk-ogd", "start": "1960-01-01", "end": "1974-02-01", "source_url": "https://nkinfo.unikorea.go.kr"},
            {"title": "Honorary Vice Chairman of SPA Standing Committee", "org_id": "spa", "start": "1998-09-05", "end": "2021-12-14", "source_url": "https://nkinfo.unikorea.go.kr"}
        ],
        "family": [
            {"relation": "father", "person_id": "kim-hyong-jik", "note": "Father"},
            {"relation": "mother", "person_id": "kang-pan-sok", "note": "Mother"},
            {"relation": "sibling", "person_id": "kim-il-sung", "note": "Older brother, regime founder"},
            {"relation": "nephew", "person_id": "kim-jong-il", "note": "Nephew and succession rival"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Younger brother of Kim Il Sung and architect of the Ten Principles for the Establishment of a Monolithic Ideological System. As head of OGD in the 1960s, he was heir apparent until his nephew Kim Jong Il outmaneuvered him in 1974, leading to two decades of internal exile in Chagang Province before his rehabilitation as an elder statesman.",
        "notable": [
            {"claim": "Formulated the 1974 'Ten Principles for the Establishment of a Monolithic Ideological System', the supreme totalitarian code governing North Korean society.", "source_url": "https://www.hrnk.org", "date": "1974-04-14"},
            {"claim": "Co-signed the July 4, 1972 South-North Joint Communiqué with South Korean KCIA Director Lee Hu-rak.", "source_url": "https://www.usip.org", "date": "1972-07-04"}
        ],
        "tags": ["family", "politburo", "purged"]
    },
    {
        "id": "kim-man-il",
        "name_en": "Kim Man Il",
        "name_ko": "김만일",
        "aliases": ["Shura Kim", "Aleksandr Kim"],
        "wikidata": "Q494857",
        "image_commons": None,
        "born": {"date": "1944-01-01", "place": "Vyatskoye, Khabarovsk Krai, Soviet Union"},
        "died": {"date": "1947-07-01", "place": "Pyongyang, North Korea", "cause": "Accidental drowning in garden pond"},
        "status": {"value": "dead", "as_of": "1947-07-01", "source_url": "https://nkinfo.unikorea.go.kr"},
        "gender": "male",
        "roles": [],
        "family": [
            {"relation": "father", "person_id": "kim-il-sung", "note": "Father"},
            {"relation": "mother", "person_id": "kim-jong-suk", "note": "Mother"},
            {"relation": "sibling", "person_id": "kim-jong-il", "note": "Older brother"}
        ],
        "health": [],
        "physical": {"height_cm": None, "weight_kg": None},
        "sanctions": [],
        "summary": "Second son of Kim Il Sung and Kim Jong Suk, born in the Soviet Far East and known by his Russian childhood nickname Shura. His accidental drowning in a swimming pond in Pyongyang in 1947 left Kim Jong Il as the sole surviving male heir of Kim Jong Suk.",
        "notable": [
            {"claim": "Drowned in a garden pond at Kim Il Sung's official residence in Pyongyang in the summer of 1947.", "source_url": "https://nkinfo.unikorea.go.kr", "date": "1947-07-01"}
        ],
        "tags": ["family"]
    }
]
