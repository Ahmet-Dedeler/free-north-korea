#!/usr/bin/env python3
"""
Compile verified EM-DAT / CRED natural disaster records for DPRK:
1. Deaths from Natural Disasters (Floods, Storms, Droughts)
2. Total People Affected by Natural Disasters
"""

import urllib.request
import csv
import io
import json
import os

sample_dir = os.path.join(os.path.dirname(__file__), '../../samples/surprising')
os.makedirs(sample_dir, exist_ok=True)

# 1. Disaster Deaths
deaths_url = "https://ourworldindata.org/grapher/natural-disasters-deaths.csv"
req = urllib.request.Request(deaths_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    deaths_data = resp.read().decode('utf-8')

deaths_reader = csv.DictReader(io.StringIO(deaths_data))
deaths_by_year = {}
for r in deaths_reader:
    if r.get('Code') == 'PRK':
        y = int(r['Year'])
        all_d = int(float(r['All disasters'])) if r.get('All disasters') else 0
        floods = int(float(r['Floods'])) if r.get('Floods') else 0
        storms = int(float(r['Storms'])) if r.get('Storms') else 0
        deaths_by_year[y] = {
            'all_disasters_deaths': all_d,
            'floods_deaths': floods,
            'storms_deaths': storms
        }

# 2. People Affected
affected_url = "https://ourworldindata.org/grapher/natural-disasters-people-affected.csv"
req = urllib.request.Request(affected_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    affected_data = resp.read().decode('utf-8')

affected_reader = csv.DictReader(io.StringIO(affected_data))
affected_by_year = {}
for r in affected_reader:
    if r.get('Code') == 'PRK':
        y = int(r['Year'])
        all_aff = int(float(r['All disasters'])) if r.get('All disasters') else 0
        floods = int(float(r['Floods'])) if r.get('Floods') else 0
        droughts = int(float(r['Droughts'])) if r.get('Droughts') else 0
        affected_by_year[y] = {
            'all_disasters_affected': all_aff,
            'floods_affected': floods,
            'droughts_affected': droughts
        }

combined = []
all_years = sorted(set(deaths_by_year.keys()) | set(affected_by_year.keys()))
for y in all_years:
    d = deaths_by_year.get(y, {})
    a = affected_by_year.get(y, {})
    combined.append({
        'year': y,
        'deaths_total': d.get('all_disasters_deaths', 0),
        'deaths_floods': d.get('floods_deaths', 0),
        'deaths_storms': d.get('storms_deaths', 0),
        'people_affected_total': a.get('all_disasters_affected', 0),
        'people_affected_floods': a.get('floods_affected', 0),
        'people_affected_droughts': a.get('droughts_affected', 0)
    })

sample_file = os.path.join(sample_dir, 'emdat_dprk_disasters.json')
with open(sample_file, 'w', encoding='utf-8') as f:
    json.dump(combined, f, indent=2)

print(f"Saved {len(combined)} disaster event years (1987-2024) to {sample_file}")
print("Major historical disaster milestones:")
for r in combined:
    if r['people_affected_total'] > 1_000_000 or r['deaths_total'] > 200:
        print(f"  {r['year']}: Deaths={r['deaths_total']:,} | Affected={r['people_affected_total']:,} (Floods: {r['people_affected_floods']:,}, Drought: {r['people_affected_droughts']:,})")
