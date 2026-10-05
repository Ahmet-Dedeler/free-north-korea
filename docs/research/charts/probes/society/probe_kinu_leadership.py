#!/usr/bin/env python3
"""
Probe script: Korea Institute for National Unification (KINU) Kim Jong Un Public Activities DB (nksdb).
Scrapes and parses:
1. Annual total public appearances (2012-2026).
2. Category breakdown: Military (군사부문), On-site guidance (현지지도), Political meetings (정치회의), 
   Tributes/Mausoleum (참배), Performance/viewing (관람), Commemorative photos (기념사진), Event attendance (행사참석).
3. Military subcategory breakdown (무기지도/참관, 부대시찰, 훈련∙연습 참관/지도, etc.).
"""

import csv
import json
import os
import re
import urllib.request

SAMPLE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../samples/society"))
os.makedirs(SAMPLE_DIR, exist_ok=True)

HEADERS = {"User-Agent": "free-north-korea-research/1.0"}

def fetch_kinu_leadership():
    print("Fetching KINU Kim Jong Un Public Activities DB (overall & category)...")
    url_cat = "https://www.kinu.or.kr/nksdb/category.do"
    req_cat = urllib.request.Request(url_cat, headers=HEADERS)
    with urllib.request.urlopen(req_cat, timeout=20) as res:
        html_cat = res.read().decode("utf-8", errors="ignore")

    matches_cat = re.findall(r"addLineChartData\('([^']+)',\s*(\d+),\s*(\d+)\);", html_cat)
    cat_data = {}
    for cat, yr, count in matches_cat:
        yr = int(yr)
        count = int(count)
        if yr not in cat_data:
            cat_data[yr] = {}
        cat_data[yr][cat] = count

    # Fetch military subcategories
    url_mil = "https://www.kinu.or.kr/nksdb/category.do?category=CAT0000002"
    req_mil = urllib.request.Request(url_mil, headers=HEADERS)
    with urllib.request.urlopen(req_mil, timeout=20) as res:
        html_mil = res.read().decode("utf-8", errors="ignore")

    matches_mil = re.findall(r"addLineChartData\('([^']+)',\s*(\d+),\s*(\d+)\);", html_mil)
    mil_data = {}
    for subcat, yr, count in matches_mil:
        yr = int(yr)
        count = int(count)
        if yr not in mil_data:
            mil_data[yr] = {}
        mil_data[yr][subcat] = count

    # Compile CSV dataset
    out_csv = os.path.join(SAMPLE_DIR, "kim_jong_un_appearances.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "year", "total_appearances", 
            "military_count", "military_pct",
            "field_guidance_economy_count", "field_guidance_pct",
            "political_meetings_count", "political_meetings_pct",
            "tributes_mausoleum_count", "performance_viewing_count", 
            "commemorative_photo_count", "event_attendance_count",
            "weapons_guidance_tests_count", "military_inspection_count"
        ])
        for yr in sorted(cat_data.keys()):
            counts = cat_data[yr]
            total = sum(counts.values())
            military = counts.get("군사부문", 0)
            guidance = counts.get("현지지도", 0)
            politics = counts.get("정치회의", 0)
            tribute = counts.get("참배", 0)
            viewing = counts.get("관람", 0)
            photo = counts.get("기념사진", 0)
            event = counts.get("행사참석", 0)

            mil_sub = mil_data.get(yr, {})
            weapons = mil_sub.get("무기지도/참관", 0) + mil_sub.get("타격시위", 0)
            inspection = mil_sub.get("부대시찰", 0) + mil_sub.get("군수공업시찰", 0)

            writer.writerow([
                yr, total,
                military, round(military / total * 100, 1) if total else 0,
                guidance, round(guidance / total * 100, 1) if total else 0,
                politics, round(politics / total * 100, 1) if total else 0,
                tribute, viewing, photo, event,
                weapons, inspection
            ])

    print(f"Saved Kim Jong Un appearances dataset to {out_csv}")

    # Also save JSON metadata summary
    summary_json = {
        "source": "Korea Institute for National Unification (KINU) Kim Jong Un Public Activities DB (nksdb)",
        "url": "https://www.kinu.or.kr/nksdb",
        "years": sorted(cat_data.keys()),
        "latest_year": max(cat_data.keys()),
        "latest_year_total": sum(cat_data[max(cat_data.keys())].values()),
        "latest_year_military_pct": round(cat_data[max(cat_data.keys())].get("군사부문", 0) / sum(cat_data[max(cat_data.keys())].values()) * 100, 1)
    }
    with open(os.path.join(SAMPLE_DIR, "kim_jong_un_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary_json, f, indent=2)

if __name__ == "__main__":
    fetch_kinu_leadership()
