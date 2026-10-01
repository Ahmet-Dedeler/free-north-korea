#!/usr/bin/env python3
"""
Cross-compare public/data/test.en.json against scraped sources:
- Find missing launch dates in 2017-2026.
- Find field fixes for tests where apogee, distance, missile, landing, facility, time, or outcome is 'unknown'/'na' or conflicting.
- Identify excluded launches (cruise missiles, artillery/MLRS, satellite launch attempts).
"""
import json
import re
from datetime import datetime

# 1. Load test.en.json
with open("public/data/test.en.json") as f:
    raw_tests = json.load(f)

flat_tests = []
for b in raw_tests["timeBins"]:
    for t in b["data"]:
        flat_tests.append(t)

print(f"Total tests in test.en.json: {len(flat_tests)}")

# Map tests by date
tests_by_date = {}
for i, t in enumerate(flat_tests):
    d = t["date"]
    if d not in tests_by_date:
        tests_by_date[d] = []
    tests_by_date[d].append((i, t))

# 2. Load JA wiki scraped events
with open("docs/research/probes/missile_gaps/ja_wiki_events.json") as f:
    ja_events = json.load(f)

print(f"Total JA wiki events: {len(ja_events)}")

# Check which dates in JA wiki are NOT in test.en.json
missing_dates = []
excluded_candidates = []

for ev in ja_events:
    d = ev["date"]
    txt = ev["raw_text"]
    
    # Check if this is cruise missile, artillery, satellite or ballistic
    is_cruise = any(k in txt for k in ["巡航ミサイル", "巡航"])
    is_artillery = any(k in txt for k in ["放射砲", "砲弾", "射撃", "ロケット弾"]) and not any(k in txt for k in ["弾道ミサイル", "超大型放射砲", "KN-25"])
    is_satellite = any(k in txt for k in ["衛星", "千里馬", "ロケット"]) and "弾道ミサイル" not in txt
    
    if d not in tests_by_date:
        # Check UTC offset (sometimes launch is KST/JST evening, so UTC is same day, or KST morning so UTC is previous day)
        # Check d - 1 day
        try:
            dt = datetime.strptime(d, "%Y-%m-%d")
            prev_d = (dt.replace(day=dt.day-1) if dt.day > 1 else dt).strftime("%Y-%m-%d") # simplified
            # exact prev day
            prev_d = datetime.fromordinal(dt.toordinal() - 1).strftime("%Y-%m-%d")
            next_d = datetime.fromordinal(dt.toordinal() + 1).strftime("%Y-%m-%d")
        except Exception:
            prev_d, next_d = None, None
            
        matched_date = None
        if prev_d and prev_d in tests_by_date:
            matched_date = prev_d
        elif next_d and next_d in tests_by_date:
            matched_date = next_d
            
        if not matched_date:
            if is_cruise or is_artillery or is_satellite:
                excluded_candidates.append({
                    "date": d,
                    "type": "cruise" if is_cruise else "artillery" if is_artillery else "satellite",
                    "text": txt[:250]
                })
            else:
                missing_dates.append({
                    "date": d,
                    "text": txt[:250],
                    "raw": ev
                })

print(f"Missing dates found: {len(missing_dates)}")
for m in missing_dates:
    print(f"  MISSING: {m['date']} -> {m['text'][:120]}")

print(f"\nExcluded launch candidates found: {len(excluded_candidates)}")
for ec in excluded_candidates[:15]:
    print(f"  EXCLUDED ({ec['type']}): {ec['date']} -> {ec['text'][:100]}")
