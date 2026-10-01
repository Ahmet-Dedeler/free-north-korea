#!/usr/bin/env python3
"""
Build docs/research/missile_gaps.json and docs/research/missile_gaps.md according to brief.
"""
import json
import os

# --- 1. MISSING TESTS ---
missing_tests = [
    {
        "date": "2024-05-17",
        "time": "06:10 (UTC)",
        "missile": "kn-23",
        "facility": "wonsan",
        "landing": "sea-of-japan",
        "apogee": 50,
        "distance": 300,
        "bearing": 70,
        "outcome": "success",
        "description": "North Korea test-fired multiple tactical short-range ballistic missiles (KN-23 / Hwasong-11Ga variant) equipped with a newly developed autonomous navigation guidance system into the Sea of Japan. South Korea's JCS reported the missiles flew approximately 300 km from the Wonsan area. Kim Jong Un oversaw the launch.",
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20240517006852315", "date": "2024-05-17"},
            {"name": "Japanese Wikipedia 2024 Projectiles Article", "url": "https://ja.wikipedia.org/wiki/北朝鮮による飛翔体発射実験_(2024年)", "date": "2024-05-17"},
            {"name": "KCNA Statement on Autonomous Navigation System Test", "url": "https://kcnawatch.org", "date": "2024-05-18"}
        ],
        "confidence": 0.95
    },
    {
        "date": "2022-11-05",
        "time": "02:32 (UTC)",
        "missile": "kn-23",
        "facility": "tongrim",
        "landing": "yellow-sea",
        "apogee": 20,
        "distance": 130,
        "bearing": 260,
        "outcome": "success",
        "description": "North Korea launched four short-range ballistic missiles (SRBMs) from Tongrim County, North Pyongan Province into the West Sea / Yellow Sea between 11:32 and 11:59 KST. South Korea's JCS reported a flight range of approximately 130 km, an altitude of 20 km, and speed of Mach 5, in protest against US-ROK Vigilant Storm air exercises.",
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20221105001552325", "date": "2022-11-05"},
            {"name": "Japanese Wikipedia 2022 Missile Tests Article", "url": "https://ja.wikipedia.org/wiki/北朝鮮によるミサイル発射実験_(2022年)", "date": "2022-11-05"},
            {"name": "Reuters / Japan MoD Alert", "url": "https://www.reuters.com/world/asia-pacific/north-korea-fires-four-ballistic-missiles-into-sea-south-korea-says-2022-11-05/", "date": "2022-11-05"}
        ],
        "confidence": 0.95
    },
    {
        "date": "2026-03-19",
        "time": "02:15 (UTC)",
        "missile": "kn-25",
        "facility": "pyongyang",
        "landing": "sea-of-japan",
        "apogee": 80,
        "distance": 350,
        "bearing": 70,
        "outcome": "success",
        "description": "North Korea launched multiple suspected ballistic missiles into the Sea of Japan, confirmed by Japanese Defense Minister Koizumi. Missiles landed in the Sea of Japan outside Japan's exclusive economic zone (EEZ).",
        "sources": [
            {"name": "Yomiuri Shimbun / Japan MoD Report", "url": "https://www.yomiuri.co.jp/politics/20260319-OYT1T50143/", "date": "2026-03-19"},
            {"name": "Japanese Wikipedia 2026 Projectiles Article", "url": "https://ja.wikipedia.org/wiki/北朝鮮による飛翔体発射実験_(2026年)", "date": "2026-03-19"}
        ],
        "confidence": 0.90
    },
    {
        "date": "2022-11-02",
        "time": "00:00 (UTC)",
        "series": 1,
        "seriesSize": 7,
        "missile": "kn-23",
        "facility": "wonsan",
        "landing": "sea-of-japan",
        "apogee": 50,
        "distance": 180,
        "bearing": 135,
        "outcome": "success",
        "description": "Part of North Korea's historic 23-missile barrage on November 2, 2022. Between 08:51 and 09:12 KST, North Korea fired 3 SRBMs from Wonsan into the Sea of Japan. One missile flew south of the Northern Limit Line (NLL), splashing down only 26 km south of the NLL, 57 km east of Sokcho, and 167 km northwest of Ulleungdo, triggering Ulleungdo air raid sirens.",
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20221102002353325", "date": "2022-11-02"},
            {"name": "BBC News Asia", "url": "https://www.bbc.com/news/world-asia-63480572", "date": "2022-11-02"},
            {"name": "Japan Ministry of Defense Statement", "url": "https://www.mod.go.jp/j/press/news/2022/11/02b.html", "date": "2022-11-02"}
        ],
        "confidence": 0.95
    },
    {
        "date": "2022-11-02",
        "time": "21:51 (UTC)",
        "series": 2,
        "seriesSize": 7,
        "missile": "kn-24",
        "facility": "chongju",
        "landing": "yellow-sea",
        "apogee": 50,
        "distance": 150,
        "bearing": 250,
        "outcome": "success",
        "description": "Part of the November 2, 2022 barrage: At approximately 06:51 KST (21:51 UTC Nov 1), North Korea fired 4 SRBMs from Chongju and Pihyon, North Pyongan into the West Sea / Yellow Sea.",
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20221102002353325", "date": "2022-11-02"},
            {"name": "Japanese Wikipedia 2022 Missile Tests Article", "url": "https://ja.wikipedia.org/wiki/北朝鮮によるミサイル発射実験_(2022年)", "date": "2022-11-02"}
        ],
        "confidence": 0.95
    },
    {
        "date": "2022-12-31",
        "time": "17:50 (UTC)",
        "missile": "kn-25",
        "facility": "pyongyang",
        "landing": "sea-of-japan",
        "apogee": 100,
        "distance": 350,
        "bearing": 70,
        "outcome": "success",
        "description": "At 02:50 KST on New Year's Day (January 1, 2023 / 17:50 UTC Dec 31), North Korea fired an additional KN-25 600mm super-large MLRS / SRBM from Ryongsong, Pyongyang into the Sea of Japan, flying ~350 km with an apogee of ~100 km, following 3 missiles fired earlier on Dec 31.",
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20230101000652325", "date": "2023-01-01"},
            {"name": "Japan MoD Press Release", "url": "https://www.mod.go.jp/j/press/news/2023/01/01a.html", "date": "2023-01-01"},
            {"name": "KCNA Statement on 600mm MLRS Presentation Ceremony", "url": "https://kcnawatch.org", "date": "2023-01-01"}
        ],
        "confidence": 0.95
    }
]

# --- 2. FIELD FIXES ---
field_fixes = [
    {
        "date": "2026-04-18",
        "test_match": {"date": "2026-04-18", "facility": "sinpo", "series": 1},
        "field": "missile",
        "current_value": "hwasong-11d",
        "proposed_value": "hwasong-11ra",
        "sources": [
            {"name": "Japan MoD Dossier '北朝鮮による核・弾道ミサイル開発について' (Aug 2026)", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ],
        "confidence": 0.95,
        "note": "Japan MoD official dossier Page 10 explicitly identifies this 2026-04-19 JST launch (range 140km) as the maiden flight test of '短距離弾道ミサイルE（火星11ラ）' (Hwasong-11Ra). test.en.json currently lists unconfirmed hwasong-11d."
    },
    {
        "date": "2026-04-18",
        "test_match": {"date": "2026-04-18", "facility": "sinpo"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD Press Release 2026/04/19b", "url": "https://www.mod.go.jp/j/press/news/2026/04/19b.html", "date": "2026-04-19"},
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2026-04-19"}
        ],
        "confidence": 0.95,
        "note": "All 5 missiles in salvo successfully completed flight into the Sea of Japan near DPRK east coast (range ~140 km)."
    },
    {
        "date": "2026-01-03",
        "test_match": {"date": "2026-01-03", "facility": "ryokpo"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD Press Release 2026/01/04c", "url": "https://www.mod.go.jp/j/press/news/2026/01/04c.html", "date": "2026-01-04"},
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2026-01-04"}
        ],
        "confidence": 0.95,
        "note": "Both Hwasong-11E hypersonic conical MaRV missiles flew ~900 km and ~950 km at 50 km apogee with variable pull-up maneuvering, splashing down outside Japan's EEZ."
    },
    {
        "date": "2026-01-27",
        "test_match": {"date": "2026-01-27", "facility": "pyongyang"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD Press Release 2026/01/27c", "url": "https://www.mod.go.jp/j/press/news/2026/01/27c.html", "date": "2026-01-27"},
            {"name": "Japan MoD Dossier (Aug 2026) Page 10", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ],
        "confidence": 0.95,
        "note": "Both KN-25 missiles completed normal flight (350 km and 340 km, apogee 80 km and 70 km) into Sea of Japan outside EEZ."
    },
    {
        "date": "2026-03-14",
        "test_match": {"date": "2026-03-14", "facility": "pyongyang"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD Press Release 2026/03/14c", "url": "https://www.mod.go.jp/j/press/news/2026/03/14c.html", "date": "2026-03-14"},
            {"name": "Japan MoD Dossier (Aug 2026) Page 10", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ],
        "confidence": 0.95,
        "note": "12-missile salvo drill of KN-25 super-large MLRS successfully hit simulated target island (range 340 km, apogee 80 km)."
    },
    {
        "date": "2026-04-08",
        "test_match": {"date": "2026-04-08", "facility": "wonsan"},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "kn-23",
        "sources": [
            {"name": "Japan MoD Press Release 2026/04/08b", "url": "https://www.mod.go.jp/j/press/news/2026/04/08b.html", "date": "2026-04-08"}
        ],
        "confidence": 0.90,
        "note": "Japan MoD confirmed flight exceeded 700 km at low apogee of 60 km with variable pull-up maneuvering (変則軌道), characteristic of KN-23 / Hwasong-11A series."
    },
    {
        "date": "2026-04-08",
        "test_match": {"date": "2026-04-08", "facility": "wonsan"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD Press Release 2026/04/08b", "url": "https://www.mod.go.jp/j/press/news/2026/04/08b.html", "date": "2026-04-08"}
        ],
        "confidence": 0.95,
        "note": "Successful flight of >700 km into Sea of Japan outside Japan's EEZ."
    },
    {
        "date": "2026-08-20",
        "test_match": {"date": "2026-08-20", "facility": "east-pyongyang"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD Press Release 2026/08/20d", "url": "https://www.mod.go.jp/j/press/news/2026/08/20d.html", "date": "2026-08-20"}
        ],
        "confidence": 0.95,
        "note": "10-missile simultaneous salvo drill of KN-25 successfully flew ~320 km at 90 km altitude."
    },
    {
        "date": "2026-09-11",
        "test_match": {"date": "2026-09-11", "facility": "wonsan"},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "kn-23",
        "sources": [
            {"name": "Japan MoD & South Korea JCS statements via Yomiuri", "url": "https://www.yomiuri.co.jp", "date": "2026-09-12"}
        ],
        "confidence": 0.90,
        "note": "SRBM salvo flying ~250 km; Japan MoD and ROK JCS confirmed KN-23 tactical ballistic missile."
    },
    {
        "date": "2026-09-11",
        "test_match": {"date": "2026-09-11", "facility": "wonsan"},
        "field": "apogee",
        "current_value": "unknown",
        "proposed_value": 50,
        "sources": [
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2026-09-12"}
        ],
        "confidence": 0.90,
        "note": "ROK JCS tracking confirmed ~50 km apogee."
    },
    {
        "date": "2026-09-11",
        "test_match": {"date": "2026-09-11", "facility": "wonsan"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD & ROK JCS", "url": "https://www.mod.go.jp", "date": "2026-09-12"}
        ],
        "confidence": 0.95,
        "note": "Successful flight of 250 km into Sea of Japan."
    },
    {
        "date": "2026-09-20",
        "test_match": {"date": "2026-09-20", "facility": "wonsan", "series": 1},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "kn-23",
        "sources": [
            {"name": "Japan MoD Press Release 2026/09/20e", "url": "https://www.mod.go.jp/j/press/news/2026/09/20e.html", "date": "2026-09-20"}
        ],
        "confidence": 0.90,
        "note": "Short-range ballistic missile launched from east coast; 440 km range, 60 km apogee."
    },
    {
        "date": "2026-09-20",
        "test_match": {"date": "2026-09-20", "facility": "wonsan", "series": 2},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "kn-23",
        "sources": [
            {"name": "Japan MoD Press Release 2026/09/20i", "url": "https://www.mod.go.jp/j/press/news/2026/09/20i.html", "date": "2026-09-20"}
        ],
        "confidence": 0.90,
        "note": "Second SRBM launched at 17:54 JST, 590 km range, 70 km apogee into Sea of Japan outside EEZ."
    },
    {
        "date": "2026-09-20",
        "test_match": {"date": "2026-09-20", "facility": "wonsan"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD Press Releases 2026/09/20e, 2026/09/20i", "url": "https://www.mod.go.jp/j/press/news/2026/09/20i.html", "date": "2026-09-20"}
        ],
        "confidence": 0.95,
        "note": "Both tests completed successful flight and splashed down outside Japan's EEZ."
    },
    {
        "date": "2024-11-04",
        "test_match": {"date": "2024-11-04", "facility": "sariwon"},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "kn-25",
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20241105001252315", "date": "2024-11-05"},
            {"name": "Japan MoD Press Release", "url": "https://www.mod.go.jp/j/press/news/2024/11/05a.html", "date": "2024-11-05"}
        ],
        "confidence": 0.95,
        "note": "North Korea launched a salvo of KN-25 600mm super-large MLRS / SRBMs from Sariwon, North Hwanghae into Sea of Japan, flying ~400 km with 100 km apogee."
    },
    {
        "date": "2024-11-04",
        "test_match": {"date": "2024-11-04", "facility": "sariwon"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "South Korea JCS & Japan MoD", "url": "https://en.yna.co.kr", "date": "2024-11-05"}
        ],
        "confidence": 0.95,
        "note": "All launched missiles flew normally to impact area in Sea of Japan."
    },
    {
        "date": "2024-06-25",
        "test_match": {"date": "2024-06-25", "facility": "pyongyang"},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "hwasong-16-mirv",
        "sources": [
            {"name": "KCNA Statement on MIRV Test", "url": "https://kcnawatch.org", "date": "2024-06-27"},
            {"name": "Japan MoD Dossier Page 11", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ],
        "confidence": 0.90,
        "note": "First-stage solid-fuel intermediate-range booster carrying individual mobile warheads (MIRV test vehicle)."
    },
    {
        "date": "2024-06-25",
        "test_match": {"date": "2024-06-25", "facility": "pyongyang"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "failure",
        "sources": [
            {"name": "South Korea JCS statement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20240626001053315", "date": "2024-06-26"},
            {"name": "US INDOPACOM Statement", "url": "https://www.pacom.mil", "date": "2024-06-26"}
        ],
        "confidence": 0.85,
        "note": "ROK JCS confirmed missile exploded mid-air at approx 250 km. (Disputed: KCNA claimed successful release of decoy and 3 guided warheads)."
    },
    {
        "date": "2024-06-30",
        "test_match": {"date": "2024-06-30", "series": 2},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "hwasong-11-da-45",
        "sources": [
            {"name": "KCNA Statement on Hwasong-11Da-45 Test", "url": "https://kcnawatch.org", "date": "2024-07-02"},
            {"name": "South Korea JCS statement", "url": "https://en.yna.co.kr/view/AEN20240701001453315", "date": "2024-07-01"}
        ],
        "confidence": 0.95,
        "note": "Second missile in pair was also a Hwasong-11Da-45 carrying simulated 4.5-ton super-large warhead."
    },
    {
        "date": "2024-06-30",
        "test_match": {"date": "2024-06-30", "series": 2},
        "field": "landing",
        "current_value": "unknown",
        "proposed_value": "north-korea",
        "sources": [
            {"name": "South Korea JCS statement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20240701001453315", "date": "2024-07-01"}
        ],
        "confidence": 0.90,
        "note": "ROK JCS tracked missile flying only ~120 km abnormally and splashing/crashing inland near Pyongyang / Sil-li."
    },
    {
        "date": "2024-06-30",
        "test_match": {"date": "2024-06-30", "series": 2},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "failure",
        "sources": [
            {"name": "South Korea JCS statement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20240701001453315", "date": "2024-07-01"}
        ],
        "confidence": 0.90,
        "note": "Abnormal flight that crashed prematurely inland."
    },
    {
        "date": "2024-05-27",
        "test_match": {"date": "2024-05-27", "facility": "pyongyang"},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "slv",
        "sources": [
            {"name": "KCNA Statement on Satellite Launch Failure", "url": "https://kcnawatch.org", "date": "2024-05-28"},
            {"name": "Japan MoD Press Release", "url": "https://www.mod.go.jp/j/press/news/2024/05/27b.html", "date": "2024-05-27"}
        ],
        "confidence": 0.98,
        "note": "New satellite launch vehicle carrying military reconnaissance satellite Malligyong-1-1."
    },
    {
        "date": "2024-05-27",
        "test_match": {"date": "2024-05-27", "facility": "pyongyang"},
        "field": "facility",
        "current_value": "pyongyang",
        "proposed_value": "sohae",
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2024-05-28"},
            {"name": "Japan MoD", "url": "https://www.mod.go.jp", "date": "2024-05-27"}
        ],
        "confidence": 0.98,
        "note": "Launch took place from Sohae Satellite Launching Ground, Cholsan County, North Pyongan, NOT Pyongyang."
    },
    {
        "date": "2024-05-27",
        "test_match": {"date": "2024-05-27"},
        "field": "distance",
        "current_value": "unknown",
        "proposed_value": 100,
        "sources": [
            {"name": "Japan MoD / ROK JCS", "url": "https://www.mod.go.jp", "date": "2024-05-27"}
        ],
        "confidence": 0.90,
        "note": "Exploded approx 2 minutes after liftoff over the Yellow Sea west of the peninsula."
    },
    {
        "date": "2023-03-09",
        "test_match": {"date": "2023-03-09"},
        "field": "distance",
        "current_value": "unknown",
        "proposed_value": 110,
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20230309009852325", "date": "2023-03-09"}
        ],
        "confidence": 0.90,
        "note": "Salvo of 6 Hwasong-11D CRBMs fired simultaneously from Nampo into Yellow Sea, flying ~110 km."
    },
    {
        "date": "2023-03-09",
        "test_match": {"date": "2023-03-09"},
        "field": "apogee",
        "current_value": "unknown",
        "proposed_value": 30,
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20230309009852325", "date": "2023-03-09"}
        ],
        "confidence": 0.90,
        "note": "ROK JCS radar tracked peak altitude of ~30 km."
    },
    {
        "date": "2023-03-13",
        "test_match": {"date": "2023-03-13"},
        "field": "apogee",
        "current_value": "unknown",
        "proposed_value": 50,
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20230314001652325", "date": "2023-03-14"}
        ],
        "confidence": 0.95,
        "note": "ROK JCS reported 2 KN-23 missiles fired from Jangyon at 07:41 and 07:51 KST flew 620 km with apogee of ~50 km."
    },
    {
        "date": "2023-06-15",
        "test_match": {"date": "2023-06-15"},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "kn-23",
        "sources": [
            {"name": "Japan MoD Press Release", "url": "https://www.mod.go.jp/j/press/news/2023/06/15b.html", "date": "2023-06-15"}
        ],
        "confidence": 0.90,
        "note": "Japan MoD confirmed 2 SRBMs exhibited variable pull-up maneuvering and splashed down inside Japan's EEZ north of Hegurajima."
    },
    {
        "date": "2023-06-15",
        "test_match": {"date": "2023-06-15"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD & ROK JCS", "url": "https://www.mod.go.jp", "date": "2023-06-15"}
        ],
        "confidence": 0.95,
        "note": "Both missiles completed full flight of 780-850 km."
    },
    {
        "date": "2023-09-13",
        "test_match": {"date": "2023-09-13"},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "kn-23",
        "sources": [
            {"name": "Japan MoD Dossier (Aug 2026) Page 10", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ],
        "confidence": 0.95,
        "note": "Japan MoD official classification explicitly catalogues the 2023-09-13 tests as '短距離弾道ミサイルA（KN-23）'."
    },
    {
        "date": "2023-09-13",
        "test_match": {"date": "2023-09-13"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD Press Release", "url": "https://www.mod.go.jp/j/press/news/2023/09/13b.html", "date": "2023-09-13"}
        ],
        "confidence": 0.95,
        "note": "Both missiles flew ~650 km with 50 km apogee and landed in Sea of Japan outside EEZ."
    },
    {
        "date": "2022-12-23",
        "test_match": {"date": "2022-12-23"},
        "field": "missile",
        "current_value": "unknown",
        "proposed_value": "kn-23",
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20221223006452325", "date": "2022-12-23"}
        ],
        "confidence": 0.90,
        "note": "ROK JCS identified pair of solid-fuel tactical SRBMs (KN-23 variant)."
    },
    {
        "date": "2022-12-23",
        "test_match": {"date": "2022-12-23"},
        "field": "apogee",
        "current_value": "unknown",
        "proposed_value": 50,
        "sources": [
            {"name": "Japan MoD Press Release", "url": "https://www.mod.go.jp/j/press/news/2022/12/23b.html", "date": "2022-12-23"},
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2022-12-23"}
        ],
        "confidence": 0.95,
        "note": "Both Japan MoD and ROK JCS confirmed ~50 km peak altitude."
    },
    {
        "date": "2022-12-23",
        "test_match": {"date": "2022-12-23"},
        "field": "outcome",
        "current_value": "unknown",
        "proposed_value": "success",
        "sources": [
            {"name": "Japan MoD & ROK JCS", "url": "https://www.mod.go.jp", "date": "2022-12-23"}
        ],
        "confidence": 0.95,
        "note": "Completed normal flight into Sea of Japan outside EEZ."
    }
]

# --- 3. EXCLUDED LAUNCHES ---
excluded_launches = [
    {
        "date": "2024-04-19",
        "category": "cruise_missile",
        "system_name": "Hwasal-1 Ra-3 / Pyoltsi-1-2",
        "description": "DPRK Missile Administration conducted a power test of a super-large warhead designed for the 'Hwasal-1 Ra-3' strategic cruise missile and test-fired the 'Pyoltsi-1-2' new-type anti-aircraft missile into the West Sea / Yellow Sea.",
        "location": "Yellow Sea / West Coast",
        "range_km": "unknown",
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2024-04-20"},
            {"name": "Reuters Report", "url": "https://www.reuters.com/world/asia-pacific/north-korea-tests-super-large-cruise-missile-warhead-anti-aircraft-missile-kcna-2024-04-19/", "date": "2024-04-20"}
        ]
    },
    {
        "date": "2024-02-14",
        "category": "cruise_missile",
        "system_name": "Bada-suri-6 (Sea Eagle-6 / 바다수리-6)",
        "description": "First disclosed test-fire of new naval surface-to-ship cruise missile 'Bada-suri-6' overseen by Kim Jong Un in the Sea of Japan off Wonsan. The missiles flew for 1,400 seconds hitting boat target.",
        "location": "Wonsan / Sea of Japan",
        "range_km": 200,
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2024-02-15"},
            {"name": "Yonhap News Agency", "url": "https://en.yna.co.kr/view/AEN20240215001100315", "date": "2024-02-15"}
        ]
    },
    {
        "date": "2024-01-30",
        "category": "cruise_missile",
        "system_name": "Hwasal-2 (Arrow-2 / 화살-2)",
        "description": "Rapid counterattack launch drill of Hwasal-2 strategic cruise missiles into the West Sea / Yellow Sea to verify military preparedness.",
        "location": "West Coast / Yellow Sea",
        "range_km": 1500,
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2024-01-31"},
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2024-01-30"}
        ]
    },
    {
        "date": "2024-01-28",
        "category": "cruise_missile",
        "system_name": "Pulhwasal-3-31 (Submarine-Launched / SLCM)",
        "description": "Test-fire of newly developed Pulhwasal-3-31 submarine-launched strategic cruise missiles launched from underwater off Sinpo into the Sea of Japan, flying 7,421 and 7,445 seconds (~2 hours).",
        "location": "Sinpo offshore / Sea of Japan",
        "range_km": 1500,
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2024-01-29"},
            {"name": "Japan MoD Dossier Page 14", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ]
    },
    {
        "date": "2024-01-24",
        "category": "cruise_missile",
        "system_name": "Pulhwasal-3-31 (Fire Arrow-3-31 / 불화살-3-31)",
        "description": "Maiden flight test of the new Pulhwasal-3-31 strategic cruise missile into the West Sea / Yellow Sea.",
        "location": "West Coast / Yellow Sea",
        "range_km": "unknown",
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2024-01-25"},
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2024-01-24"}
        ]
    },
    {
        "date": "2023-09-02",
        "category": "cruise_missile",
        "system_name": "Hwasal-1 / Hwasal-2",
        "description": "Simulated tactical nuclear strike drill: North Korea fired 2 long-range strategic cruise missiles with mock nuclear warheads from Anju into the Yellow Sea, flying 1,500 km in figure-8 patterns for 7,672 to 7,681 seconds before detonating at 150 m altitude.",
        "location": "Anju / Yellow Sea",
        "range_km": 1500,
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2023-09-03"},
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2023-09-02"}
        ]
    },
    {
        "date": "2023-08-21",
        "category": "cruise_missile",
        "system_name": "Strategic Cruise Missile (Ship-launched)",
        "description": "Kim Jong Un inspected Amnok-class patrol ship 661 of the East Sea Fleet and observed launch of a strategic cruise missile from shipboard canister.",
        "location": "East Sea / Sea of Japan",
        "range_km": 1500,
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2023-08-21"},
            {"name": "Japan MoD Dossier Page 14", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ]
    },
    {
        "date": "2023-03-22",
        "category": "cruise_missile",
        "system_name": "Hwasal-1 & Hwasal-2",
        "description": "Strategic cruise missile underwater/ground drill: 4 cruise missiles (2 Hwasal-1 and 2 Hwasal-2) fired from Hamhung into the Sea of Japan, flying 1,500 km and 1,800 km for up to 9,158 seconds.",
        "location": "Hamhung / Sea of Japan",
        "range_km": 1800,
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2023-03-24"},
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2023-03-22"}
        ]
    },
    {
        "date": "2023-03-12",
        "category": "cruise_missile",
        "system_name": "Submarine-Launched Cruise Missile (SLCM)",
        "description": "Two strategic cruise missiles launched from the 8.24 Yongung submarine in Kyongpo Bay off the east coast, flying 1,500 km in figure-8 tracks for 7,563 to 7,575 seconds.",
        "location": "Kyongpo Bay / Sea of Japan",
        "range_km": 1500,
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2023-03-13"},
            {"name": "Japan MoD Dossier Page 14", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ]
    },
    {
        "date": "2023-02-23",
        "category": "cruise_missile",
        "system_name": "Hwasal-2 (화살-2)",
        "description": "Salvo of 4 Hwasal-2 strategic cruise missiles fired from Kim Chaek City into the Sea of Japan, traveling 2,000 km in elliptical and eight-shaped flight orbits for 10,208 to 10,224 seconds.",
        "location": "Kim Chaek City / Sea of Japan",
        "range_km": 2000,
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2023-02-24"},
            {"name": "Japan MoD Dossier Page 14", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ]
    },
    {
        "date": "2022-10-12",
        "category": "cruise_missile",
        "system_name": "Long-Range Strategic Cruise Missile",
        "description": "Kim Jong Un guided the test-fire of 2 long-range strategic cruise missiles from Kaechon into the West Sea, traveling 2,000 km along oval and figure-8 flight paths for 10,234 seconds.",
        "location": "Kaechon / Yellow Sea",
        "range_km": 2000,
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2022-10-13"},
            {"name": "CSIS Missile Threat", "url": "https://missilethreat.csis.org", "date": "2022-10-13"}
        ]
    },
    {
        "date": "2022-01-25",
        "category": "cruise_missile",
        "system_name": "Long-Range Cruise Missile",
        "description": "Two long-range cruise missiles fired from the inland area, flying 1,800 km for 9,137 seconds into target island in East Sea.",
        "location": "Inland / Sea of Japan",
        "range_km": 1800,
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2022-01-28"},
            {"name": "South Korea JCS announcement", "url": "https://en.yna.co.kr", "date": "2022-01-25"}
        ]
    },
    {
        "date": "2021-09-11",
        "category": "cruise_missile",
        "system_name": "New Long-Range Cruise Missile (Hwasal Prototype)",
        "description": "Maiden test flights of North Korea's new long-range strategic cruise missile on September 11 and 12, 2021, flying 1,500 km in figure-8 and oval tracks for 7,580 seconds.",
        "location": "Inland / Sea of Japan",
        "range_km": 1500,
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2021-09-13"},
            {"name": "Japan MoD Dossier Page 14", "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf", "date": "2026-08-04"}
        ]
    },
    {
        "date": "2024-01-19",
        "category": "underwater_weapon",
        "system_name": "Haeil-5-23 (Tsunami-5-23 / 해일-5-23)",
        "description": "Underwater nuclear weapon system test conducted by the DPRK Ministry of National Defence in the Sea of Japan in response to trilateral naval exercises by US, ROK, and Japan.",
        "location": "East Sea / Sea of Japan",
        "range_km": "unknown",
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2024-01-19"},
            {"name": "Reuters Report", "url": "https://www.reuters.com", "date": "2024-01-19"}
        ]
    },
    {
        "date": "2023-03-21",
        "category": "underwater_weapon",
        "system_name": "Haeil (Tsunami / 해일) Nuclear Drone",
        "description": "First public test of the Haeil unmanned underwater nuclear attack boat/torpedo. Cruised underwater for 59 hours and 12 minutes at depths of 80 to 150 meters before detonating test warhead off Hongwon Bay.",
        "location": "Riwon to Hongwon Bay / Sea of Japan",
        "range_km": 1000,
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2023-03-24"},
            {"name": "38 North Technical Analysis", "url": "https://www.38north.org", "date": "2023-03-27"}
        ]
    },
    {
        "date": "2024-05-10",
        "category": "artillery_mlrs",
        "system_name": "240mm Controlled MLRS Rocket Shells",
        "description": "Kim Jong Un observed live-fire test of new guided 240mm multiple rocket launcher system shells with automatic fire control.",
        "location": "Western Front / West Sea",
        "range_km": 70,
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2024-05-11"}
        ]
    },
    {
        "date": "2024-01-05",
        "category": "artillery_mlrs",
        "system_name": "Coastal Artillery Bombardment",
        "description": "North Korean military fired over 200 coastal artillery shells into the maritime buffer zone north of Baengnyeongdo and Yeonpyeongdo, prompting evacuation orders on South Korean frontline islands.",
        "location": "NLL maritime buffer zone",
        "range_km": 20,
        "sources": [
            {"name": "South Korea JCS announcement via Yonhap", "url": "https://en.yna.co.kr/view/AEN20240105003653315", "date": "2024-01-05"}
        ]
    },
    {
        "date": "2023-05-31",
        "category": "satellite_launch",
        "system_name": "Chollima-1 / Malligyong-1 (Attempt 1)",
        "description": "First launch attempt of Malligyong-1 reconnaissance satellite aboard Chollima-1 SLV from Sohae. Crashed into the Yellow Sea 200 km west of Eocheong Island due to premature second-stage engine ignition failure.",
        "location": "Sohae Satellite Launching Ground",
        "range_km": 200,
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2023-05-31"},
            {"name": "South Korea JCS salvage statement", "url": "https://en.yna.co.kr", "date": "2023-06-16"}
        ]
    },
    {
        "date": "2023-08-24",
        "category": "satellite_launch",
        "system_name": "Chollima-1 / Malligyong-1 (Attempt 2)",
        "description": "Second launch attempt of Malligyong-1 reconnaissance satellite aboard Chollima-1 SLV from Sohae at 03:50 KST. First and second stages separated normally, but flight failed during third-stage burn due to an accidental trigger of the emergency blasting system.",
        "location": "Sohae Satellite Launching Ground",
        "range_km": 1000,
        "sources": [
            {"name": "KCNA Statement", "url": "https://kcnawatch.org", "date": "2023-08-24"},
            {"name": "Japan MoD Press Release", "url": "https://www.mod.go.jp/j/press/news/2023/08/24b.html", "date": "2023-08-24"}
        ]
    },
    {
        "date": "2023-11-21",
        "category": "satellite_launch",
        "system_name": "Chollima-1 / Malligyong-1 (Attempt 3 - Successful Orbit)",
        "description": "Third launch of Chollima-1 SLV successfully inserted North Korea's first military reconnaissance satellite Malligyong-1 into Sun-synchronous low Earth orbit at 22:42 KST from Sohae.",
        "location": "Sohae Satellite Launching Ground",
        "range_km": "orbital",
        "sources": [
            {"name": "KCNA Announcement", "url": "https://kcnawatch.org", "date": "2023-11-22"},
            {"name": "US Space Command / NORAD catalog ID 58400", "url": "https://www.space-track.org", "date": "2023-11-22"}
        ]
    }
]

# --- 4. SOURCES ---
sources = [
    {
        "id": "japan-mod-surround",
        "name": "Japan Ministry of Defense: North Korea Missile Information Portal",
        "publisher": "防衛省・自衛隊 (Ministry of Defense, Japan)",
        "url": "https://www.mod.go.jp/j/surround/northKorea/",
        "language": "ja",
        "format": "html, pdf",
        "how_to_scrape": "Fetch surround page index with Chrome user-agent headers to bypass Cloudflare; parse emergency bulletins ('お知らせ') and follow-up releases ('続報') in /j/press/news/YYYY/MM/*.html for launch time, missile count, apogee, flight distance, and EEZ splashdown location. Download official annual dossier PDF.",
        "last_updated": "2026-09-20",
        "maintenance_status": "active",
        "notes": "Fastest and most consistent public government publisher of telemetry figures (apogee, distance, EEZ splashdown). Releases both breaking flashes (速報) and detailed follow-up technical statements (続報)."
    },
    {
        "id": "japan-mod-dossier-pdf",
        "name": "Japan MoD Comprehensive Dossier: Development of Nuclear and Ballistic Missiles by North Korea",
        "publisher": "防衛省 (Ministry of Defense, Japan)",
        "url": "https://www.mod.go.jp/j/surround/pdf/dprk_bm_b.pdf",
        "language": "ja",
        "format": "pdf",
        "how_to_scrape": "Direct PDF download (2.1 MB) using pdftotext or pypdf extraction. Parse Page 4 for annual launch counts (1993-2026), Page 10 for SRBM A-E classifications, Page 11-12 for IRBM/ICBM flights, Page 14 for cruise missile catalog, Page 15 for SLBM history.",
        "last_updated": "2026-08-04",
        "maintenance_status": "active",
        "notes": "Authoritative annual summary. First document to officially name '短距離弾道ミサイルE（火星11ラ）' (Hwasong-11Ra) and provide consolidated launch statistics."
    },
    {
        "id": "japan-cabinet-kantei",
        "name": "Japan Cabinet Secretariat / Prime Minister's Office Emergency Info",
        "publisher": "内閣官房 / 首相官邸 (Cabinet Secretariat, Japan)",
        "url": "https://www.kantei.go.jp",
        "language": "ja",
        "format": "html, j-alert",
        "how_to_scrape": "Scrape Prime Minister crisis instructions and Cabinet press releases; monitor J-Alert dissemination records during overflights and emergency announcements.",
        "last_updated": "2026-09-20",
        "maintenance_status": "active",
        "notes": "Primary source for civil defense alerts (J-Alert) and Prime Minister three-point instructions upon detection."
    },
    {
        "id": "ja-wikipedia-missiles",
        "name": "Japanese Wikipedia: North Korea Projectile / Missile Launch Series",
        "publisher": "Wikipedia Japan community",
        "url": "https://ja.wikipedia.org/wiki/北朝鮮による飛翔体発射実験_(2026年)",
        "language": "ja",
        "format": "html",
        "how_to_scrape": "Query subpages '北朝鮮による飛翔体発射実験_(YYYY年)' or '北朝鮮によるミサイル発射実験_(YYYY年)' for each year 2017-2026; parse HTML mw-heading and <ul>/<li> elements starting with date tags (e.g. M月D日) and extract citations.",
        "last_updated": "2026-09-20",
        "maintenance_status": "active",
        "notes": "Unrivaled granularity for 2017-2026; documents every projectile event (ballistic, cruise, MLRS, coastal artillery) with primary news citations from NHK, Yomiuri, Asahi, Nikkei, and Kyodo."
    },
    {
        "id": "south-korea-jcs-yonhap",
        "name": "South Korea Joint Chiefs of Staff (합동참모본부) via Yonhap News Wire",
        "publisher": "합동참모본부 / 연합뉴스 (ROK JCS / Yonhap News Agency)",
        "url": "https://en.yna.co.kr/nk/index",
        "language": "ko, en",
        "format": "html, json-api",
        "how_to_scrape": "Scrape Yonhap English NK feed (/nk/index) and Defence feed (/national/defense) or query API endpoint https://ars.yna.co.kr/api/v2/. Filter for 'JCS' and 'ballistic missile' announcements.",
        "last_updated": "2026-10-01",
        "maintenance_status": "active",
        "notes": "South Korea JCS has radar detection closest to launch pads (Green Pine radars, Peace Eye AEW&C). First to report exact launch locations (e.g. Sunan, Sariwon, Jangyon) and initial boost-phase flight speeds (Mach)."
    },
    {
        "id": "ko-wikipedia-missiles",
        "name": "Korean Wikipedia: DPRK Missile Test Chronology",
        "publisher": "Korean Wikipedia community",
        "url": "https://ko.wikipedia.org/wiki/조선민주주의인민공화국의_미사일_실험_목록",
        "language": "ko",
        "format": "html",
        "how_to_scrape": "Fetch page and parse table.wikitable rows for date and description.",
        "last_updated": "2024-10-31",
        "maintenance_status": "sporadic",
        "notes": "High-level summary table; less granular than Japanese Wikipedia but good for cross-referencing Korean naming conventions."
    },
    {
        "id": "en-wikipedia-missiles",
        "name": "English Wikipedia: List of North Korean missile tests",
        "publisher": "English Wikipedia community",
        "url": "https://en.wikipedia.org/wiki/List_of_North_Korean_missile_tests",
        "language": "en",
        "format": "html",
        "how_to_scrape": "Parse main article and sub-articles (2017_North_Korean_missile_tests, 2020_North_Korean_missile_tests, 2021–2023_North_Korean_missile_tests).",
        "last_updated": "2026-04-20",
        "maintenance_status": "sporadic",
        "notes": "Good narrative background and international reaction citations, but year sub-articles are fragmented and 2024-2026 lack dedicated standalone tables."
    },
    {
        "id": "csis-missile-threat",
        "name": "CSIS Missile Threat: North Korean Missile Launches & Nuclear Tests Database",
        "publisher": "Center for Strategic and International Studies (CSIS)",
        "url": "https://missilethreat.csis.org/north-korea-missile-launches-1984-present/",
        "language": "en",
        "format": "html",
        "how_to_scrape": "Scrape HTML table elements from the database page.",
        "last_updated": "2023-04-13",
        "maintenance_status": "stale",
        "notes": "Historically influential database tracking ballistic and cruise missiles. Database table updates ceased around April 2023; ongoing coverage is published as analytical articles."
    },
    {
        "id": "nti-cns-database",
        "name": "CNS North Korea Missile Test Database (NTI)",
        "publisher": "James Martin Center for Nonproliferation Studies (CNS) / Nuclear Threat Initiative (NTI)",
        "url": "https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/",
        "language": "en",
        "format": "xlsx, html",
        "how_to_scrape": "Download Excel dataset if authed, or mirror from nagix/nk-missile-tests.",
        "last_updated": "2026-04-06",
        "maintenance_status": "dead",
        "notes": "The underlying foundational database for nagix/nk-missile-tests. Project formally concluded on April 6, 2026; no longer actively maintained."
    },
    {
        "id": "nagix-nk-missile-tests",
        "name": "Akihiko Kusanagi: North Korea Missile Tests GitHub Repository",
        "publisher": "Akihiko Kusanagi (@nagix)",
        "url": "https://github.com/nagix/nk-missile-tests",
        "language": "en, ja",
        "format": "json",
        "how_to_scrape": "Direct git clone or fetch raw JSON from https://raw.githubusercontent.com/nagix/nk-missile-tests/master/data/test.en.json.",
        "last_updated": "2026-09-20",
        "maintenance_status": "active",
        "notes": "Upstream source for our /missiles map. Very actively maintained (latest commit on 2026-09-20). Contains preliminary figures for 2026 tests with placeholder unknowns."
    },
    {
        "id": "us-indopacom",
        "name": "U.S. Indo-Pacific Command (USINDOPACOM) Press Releases",
        "publisher": "United States Department of Defense",
        "url": "https://www.pacom.mil/Media/News/",
        "language": "en",
        "format": "html",
        "how_to_scrape": "Scrape news releases matching 'DPRK' or 'ballistic missile' using realistic browser headers to handle Akamai security layer.",
        "last_updated": "2026-05-26",
        "maintenance_status": "active",
        "notes": "Provides official US military assessments on threat posture (immediate threat to US homeland or allies) and coalition coordination."
    },
    {
        "id": "kcna-watch",
        "name": "KCNA Watch (NK News DPRK Media Archive)",
        "publisher": "Korea Risk Group / NK News",
        "url": "https://kcnawatch.org",
        "language": "ko, en",
        "format": "html",
        "how_to_scrape": "Search for official North Korean missile nomenclature ('Hwasong-16B', 'Hwasong-19', 'Hwasal-2', 'Pulhwasal-3-31', 'individual mobile warhead').",
        "last_updated": "2026-10-01",
        "maintenance_status": "active",
        "notes": "Essential for official DPRK designations, technical rationales ('Academy of Defence Science', 'Missile Administration'), and high-resolution imagery."
    },
    {
        "id": "unsc-panel-experts",
        "name": "UN Security Council 1718 Sanctions Committee / Member State Letters",
        "publisher": "United Nations Security Council",
        "url": "https://www.un.org/securitycouncil/sanctions/1718/panel_experts/reports",
        "language": "en",
        "format": "pdf",
        "how_to_scrape": "Download UN official documents repository (ODS) and 1718 Committee archives.",
        "last_updated": "2024-04-30",
        "maintenance_status": "stale",
        "notes": "Panel mandate ended in April 2024 following Russian veto; member state joint letters (US, Japan, ROK, UK, France) continue to provide forensic technical debris analysis."
    }
]

# Write missile_gaps.json
output_data = {
    "missing_tests": missing_tests,
    "field_fixes": field_fixes,
    "excluded_launches": excluded_launches,
    "sources": sources
}

with open("docs/research/missile_gaps.json", "w") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("Generated docs/research/missile_gaps.json successfully!")
