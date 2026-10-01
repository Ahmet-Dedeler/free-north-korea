#!/usr/bin/env python3
"""
Probe script to query Wikidata for North Korean leadership figures.
Fetches QIDs, names (EN/KO), birth/death dates, places, family relations,
Commons images, heights, weights, and positions.
"""

import json
import os
import sys
import time
import urllib.parse
import urllib.request

# Primary target list of key North Korean leadership figures to probe
TARGET_PEOPLE = [
    # Kim Family
    {"id": "kim-il-sung", "qid": "Q41117", "name_en": "Kim Il Sung", "name_ko": "김일성"},
    {"id": "kim-jong-suk", "qid": "Q272449", "name_en": "Kim Jong Suk", "name_ko": "김정숙"},
    {"id": "kim-song-ae", "qid": "Q461937", "name_en": "Kim Song Ae", "name_ko": "김성애"},
    {"id": "kim-jong-il", "qid": "Q10665", "name_en": "Kim Jong Il", "name_ko": "김정일"},
    {"id": "song-hye-rim", "qid": "Q448833", "name_en": "Song Hye Rim", "name_ko": "성혜림"},
    {"id": "ko-yong-hui", "qid": "Q266567", "name_en": "Ko Yong Hui", "name_ko": "고용희"},
    {"id": "kim-ok", "qid": "Q489370", "name_en": "Kim Ok", "name_ko": "김옥"},
    {"id": "kim-jong-un", "qid": "Q56226", "name_en": "Kim Jong Un", "name_ko": "김정은"},
    {"id": "ri-sol-ju", "qid": "Q272719", "name_en": "Ri Sol Ju", "name_ko": "리설주"},
    {"id": "kim-ju-ae", "qid": "Q115272635", "name_en": "Kim Ju Ae", "name_ko": "김주애"},
    {"id": "kim-yo-jong", "qid": "Q498833", "name_en": "Kim Yo Jong", "name_ko": "김여정"},
    {"id": "kim-jong-chol", "qid": "Q494165", "name_en": "Kim Jong Chol", "name_ko": "김정철"},
    {"id": "kim-jong-nam", "qid": "Q313367", "name_en": "Kim Jong Nam", "name_ko": "김정남"},
    {"id": "kim-han-sol", "qid": "Q6408719", "name_en": "Kim Han Sol", "name_ko": "김한솔"},
    {"id": "kim-sol-song", "qid": "Q494877", "name_en": "Kim Sol Song", "name_ko": "김설송"},
    {"id": "kim-kyong-hui", "qid": "Q268593", "name_en": "Kim Kyong Hui", "name_ko": "김경희"},
    {"id": "jang-song-thaek", "qid": "Q312521", "name_en": "Jang Song Thaek", "name_ko": "장성택"},
    {"id": "kim-pyong-il", "qid": "Q494851", "name_en": "Kim Pyong Il", "name_ko": "김평일"},
    {"id": "kim-yong-ju", "qid": "Q494870", "name_en": "Kim Yong Ju", "name_ko": "김영주"},
    {"id": "kim-man-il", "qid": "Q494857", "name_en": "Kim Man Il", "name_ko": "김만일"},

    # Top Politburo & State Leadership (Current & Recent)
    {"id": "kim-tok-hun", "qid": "Q85978153", "name_en": "Kim Tok Hun", "name_ko": "김덕훈"},
    {"id": "jo-yong-won", "qid": "Q104771569", "name_en": "Jo Yong Won", "name_ko": "조용원"},
    {"id": "choe-ryong-hae", "qid": "Q496924", "name_en": "Choe Ryong Hae", "name_ko": "최룡해"},
    {"id": "ri-pyong-chol", "qid": "Q43078715", "name_en": "Ri Pyong Chol", "name_ko": "리병철"},
    {"id": "pak-jong-chon", "qid": "Q67936746", "name_en": "Pak Jong Chon", "name_ko": "박정천"},
    {"id": "ri-yong-gil", "qid": "Q15088267", "name_en": "Ri Yong Gil", "name_ko": "리영길"},
    {"id": "kang-sun-nam", "qid": "Q116030999", "name_en": "Kang Sun Nam", "name_ko": "강순남"},
    {"id": "no-kwang-chol", "qid": "Q21824967", "name_en": "No Kwang Chol", "name_ko": "노광철"},
    {"id": "jong-kyong-thaek", "qid": "Q47035368", "name_en": "Jong Kyong Thaek", "name_ko": "정경택"},
    {"id": "kim-jae-ryong", "qid": "Q63098363", "name_en": "Kim Jae Ryong", "name_ko": "김재룡"},
    {"id": "ri-il-hwan", "qid": "Q16091484", "name_en": "Ri Il Hwan", "name_ko": "리일환"},
    {"id": "o-su-yong", "qid": "Q12607997", "name_en": "O Su Yong", "name_ko": "오수용"},
    {"id": "pak-thae-song", "qid": "Q20651717", "name_en": "Pak Thae Song", "name_ko": "박태성"},
    {"id": "jon-hyon-chol", "qid": "Q112671560", "name_en": "Jon Hyon Chol", "name_ko": "전현철"},
    {"id": "pak-jong-gun", "qid": "Q107119253", "name_en": "Pak Jong Gun", "name_ko": "박정근"},
    {"id": "ri-hi-yong", "qid": "Q108740520", "name_en": "Ri Hi Yong", "name_ko": "리히용"},
    {"id": "kim-hyong-sik", "qid": "Q108740522", "name_en": "Kim Hyong Sik", "name_ko": "김형식"},
    {"id": "ju-chang-il", "qid": "Q112671563", "name_en": "Ju Chang Il", "name_ko": "주창일"},
    {"id": "han-kwang-sang", "qid": "Q18605273", "name_en": "Han Kwang Sang", "name_ko": "한광상"},
    {"id": "kim-ki-nam", "qid": "Q7004480", "name_en": "Kim Ki Nam", "name_ko": "김기남"},
    {"id": "yang-hyong-sop", "qid": "Q494541", "name_en": "Yang Hyong Sop", "name_ko": "양형섭"},
    {"id": "choe-thae-bok", "qid": "Q710899", "name_en": "Choe Thae Bok", "name_ko": "최태복"},

    # Security, Police & Intelligence
    {"id": "ri-chang-dae", "qid": "Q112671565", "name_en": "Ri Chang Dae", "name_ko": "리창대"},
    {"id": "ri-tae-sop", "qid": "Q85978151", "name_en": "Ri Tae Sop", "name_ko": "리태섭"},
    {"id": "pang-tu-sop", "qid": "Q112671568", "name_en": "Pang Tu Sop", "name_ko": "방두섭"},
    {"id": "ri-chang-ho", "qid": "Q124029272", "name_en": "Ri Chang Ho", "name_ko": "리창호"},
    {"id": "rim-kwang-il", "qid": "Q85978152", "name_en": "Rim Kwang Il", "name_ko": "림광일"},
    {"id": "kim-yong-chol", "qid": "Q6409605", "name_en": "Kim Yong Chol", "name_ko": "김영철"},
    {"id": "kim-won-hong", "qid": "Q3196836", "name_en": "Kim Won Hong", "name_ko": "김원홍"},

    # Missile, Nuclear & Defense Science
    {"id": "jang-chang-ha", "qid": "Q64093863", "name_en": "Jang Chang Ha", "name_ko": "장창하"},
    {"id": "kim-jong-sik", "qid": "Q23682703", "name_en": "Kim Jong Sik", "name_ko": "김정식"},
    {"id": "hong-sung-mu", "qid": "Q24856015", "name_en": "Hong Sung Mu", "name_ko": "홍승무"},
    {"id": "jo-chun-ryong", "qid": "Q17050017", "name_en": "Jo Chun Ryong", "name_ko": "조춘룡"},
    {"id": "yu-jin", "qid": "Q108740523", "name_en": "Yu Jin", "name_ko": "유진"},
    {"id": "jon-il-ho", "qid": "Q64093867", "name_en": "Jon Il Ho", "name_ko": "전일호"},
    {"id": "pak-to-chun", "qid": "Q7125345", "name_en": "Pak To Chun", "name_ko": "박도춘"},

    # Cyber Operatives & Intelligence Links
    {"id": "park-jin-hyok", "qid": "Q56525167", "name_en": "Park Jin Hyok", "name_ko": "박진혁"},

    # Economy, Office 39 & Illicit Finance
    {"id": "jon-il-chun", "qid": "Q6259461", "name_en": "Jon Il Chun", "name_ko": "전일춘"},
    {"id": "pak-nam-gi", "qid": "Q707834", "name_en": "Pak Nam Gi", "name_ko": "박남기"},

    # Foreign Affairs & Diplomats
    {"id": "choe-son-hui", "qid": "Q50382875", "name_en": "Choe Son Hui", "name_ko": "최선희"},
    {"id": "kim-song", "qid": "Q57315182", "name_en": "Kim Song", "name_ko": "김성"},
    {"id": "sin-hong-chol", "qid": "Q108740525", "name_en": "Sin Hong Chol", "name_ko": "신홍철"},
    {"id": "ri-ryong-nam", "qid": "Q7329486", "name_en": "Ri Ryong Nam", "name_ko": "리룡남"},
    {"id": "kim-hyong-jun", "qid": "Q85978155", "name_en": "Kim Hyong Jun", "name_ko": "김형준"},
    {"id": "ri-su-yong", "qid": "Q16275150", "name_en": "Ri Su Yong", "name_ko": "리수용"},
    {"id": "ri-yong-ho", "qid": "Q24083656", "name_en": "Ri Yong Ho", "name_ko": "리용호"},
    {"id": "kim-kye-gwan", "qid": "Q494872", "name_en": "Kim Kye Gwan", "name_ko": "김계관"},
    {"id": "ri-son-gwon", "qid": "Q47035372", "name_en": "Ri Son Gwon", "name_ko": "리선권"},

    # Purged / Executed Elites
    {"id": "hyon-yong-chol", "qid": "Q492582", "name_en": "Hyon Yong Chol", "name_ko": "현영철"},
    {"id": "ri-yong-ho-kpa", "qid": "Q492576", "name_en": "Ri Yong Ho", "name_ko": "리영호"},

    # Defectors
    {"id": "thae-yong-ho", "qid": "Q26398188", "name_en": "Thae Yong-ho", "name_ko": "태영호"},
    {"id": "ri-il-gyu", "qid": "Q127513903", "name_en": "Ri Il-gyu", "name_ko": "리일규"},
    {"id": "ryu-hyun-woo", "qid": "Q105077189", "name_en": "Ryu Hyun-woo", "name_ko": "류현우"},
    {"id": "jo-song-gil", "qid": "Q60395727", "name_en": "Jo Song-gil", "name_ko": "조성길"},
    {"id": "hwang-jang-yop", "qid": "Q488668", "name_en": "Hwang Jang-yop", "name_ko": "황장엽"},
    {"id": "kang-myong-do", "qid": "Q11290372", "name_en": "Kang Myong-do", "name_ko": "강명도"},

    # Inner Circle / Cultural / Protocol
    {"id": "hyon-song-wol", "qid": "Q11287042", "name_en": "Hyon Song Wol", "name_ko": "현송월"},
    {"id": "kim-song-hye", "qid": "Q16174780", "name_en": "Kim Song Hye", "name_ko": "김성혜"},
    {"id": "ri-chun-hee", "qid": "Q483789", "name_en": "Ri Chun Hee", "name_ko": "리춘희"},

    # Additional key figures mentioned in brief
    {"id": "choe-sang-gon", "qid": "Q108740527", "name_en": "Choe Sang Gon", "name_ko": "최상건"},
    {"id": "sin-ryong-man", "qid": "Q124029278", "name_en": "Sin Ryong Man", "name_ko": "신룡만"},
]

def fetch_wikidata_entity(qid):
    url = f"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "FreeNorthKoreaBot/1.0 (https://github.com/Ahmet-Dedeler/free-north-korea; ahmet@agentmail.to)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode())
            return data["entities"][qid]
    except Exception as e:
        print(f"Error fetching {qid}: {e}", file=sys.stderr)
        return None

def parse_entity(entity, fallback_meta):
    qid = entity.get("id")
    claims = entity.get("claims", {})
    labels = entity.get("labels", {})
    aliases = entity.get("aliases", {})
    descriptions = entity.get("descriptions", {})

    # Names
    name_en = labels.get("en", {}).get("value") or fallback_meta.get("name_en")
    name_ko = labels.get("ko", {}).get("value") or fallback_meta.get("name_ko")

    alias_list = []
    if "en" in aliases:
        alias_list.extend([a["value"] for a in aliases["en"]])
    if "ko" in aliases:
        alias_list.extend([a["value"] for a in aliases["ko"]])

    # Dates
    born_date = None
    born_place = None
    if "P569" in claims:  # date of birth
        try:
            born_date = claims["P569"][0]["mainsnak"]["datavalue"]["value"]["time"]
            if born_date.startswith("+"):
                born_date = born_date[1:11]
        except Exception:
            pass

    died_date = None
    died_place = None
    died_cause = None
    if "P570" in claims:  # date of death
        try:
            died_date = claims["P570"][0]["mainsnak"]["datavalue"]["value"]["time"]
            if died_date.startswith("+"):
                died_date = died_date[1:11]
        except Exception:
            pass

    # Image
    image_commons = None
    if "P18" in claims:
        try:
            image_commons = claims["P18"][0]["mainsnak"]["datavalue"]["value"]
        except Exception:
            pass

    # Physical (Height / Weight)
    height_cm = None
    if "P2048" in claims:
        try:
            val = claims["P2048"][0]["mainsnak"]["datavalue"]["value"]["amount"]
            # Usually in meters or cm
            unit = claims["P2048"][0]["mainsnak"]["datavalue"]["value"]["unit"]
            num = float(val)
            if "Q11573" in unit:  # meter
                num = num * 100
            height_cm = round(num)
        except Exception:
            pass

    weight_kg = None
    if "P2067" in claims:
        try:
            val = claims["P2067"][0]["mainsnak"]["datavalue"]["value"]["amount"]
            weight_kg = round(float(val))
        except Exception:
            pass

    # Family QIDs
    father_qid = None
    if "P22" in claims:
        try:
            father_qid = claims["P22"][0]["mainsnak"]["datavalue"]["value"]["id"]
        except Exception:
            pass

    mother_qid = None
    if "P25" in claims:
        try:
            mother_qid = claims["P25"][0]["mainsnak"]["datavalue"]["value"]["id"]
        except Exception:
            pass

    spouse_qids = []
    if "P26" in claims:
        for s in claims["P26"]:
            try:
                spouse_qids.append(s["mainsnak"]["datavalue"]["value"]["id"])
            except Exception:
                pass

    children_qids = []
    if "P40" in claims:
        for c in claims["P40"]:
            try:
                children_qids.append(c["mainsnak"]["datavalue"]["value"]["id"])
            except Exception:
                pass

    sibling_qids = []
    if "P3373" in claims:
        for s in claims["P3373"]:
            try:
                sibling_qids.append(s["mainsnak"]["datavalue"]["value"]["id"])
            except Exception:
                pass

    # Gender
    gender = "male"
    if "P21" in claims:
        try:
            gid = claims["P21"][0]["mainsnak"]["datavalue"]["value"]["id"]
            if gid == "Q6581072":
                gender = "female"
            elif gid == "Q6581097":
                gender = "male"
        except Exception:
            pass

    return {
        "id": fallback_meta["id"],
        "wikidata": qid,
        "name_en": name_en,
        "name_ko": name_ko,
        "aliases": list(dict.fromkeys(alias_list)),
        "gender": gender,
        "born_date": born_date,
        "died_date": died_date,
        "image_commons": image_commons,
        "height_cm": height_cm,
        "weight_kg": weight_kg,
        "father_qid": father_qid,
        "mother_qid": mother_qid,
        "spouse_qids": spouse_qids,
        "children_qids": children_qids,
        "sibling_qids": sibling_qids,
    }

def main():
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(out_dir, "wikidata_dump.json")
    results = []

    print(f"Querying Wikidata for {len(TARGET_PEOPLE)} figures...")
    for idx, p in enumerate(TARGET_PEOPLE):
        qid = p.get("qid")
        print(f"[{idx+1}/{len(TARGET_PEOPLE)}] Fetching {p['id']} ({qid})...")
        if qid:
            raw = fetch_wikidata_entity(qid)
            if raw:
                parsed = parse_entity(raw, p)
                results.append(parsed)
            else:
                results.append({
                    "id": p["id"],
                    "wikidata": qid,
                    "name_en": p["name_en"],
                    "name_ko": p["name_ko"],
                    "aliases": [],
                    "gender": "male",
                })
        time.sleep(0.15)  # Be polite to Wikidata API

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved {len(results)} records to {out_file}")

if __name__ == "__main__":
    main()
