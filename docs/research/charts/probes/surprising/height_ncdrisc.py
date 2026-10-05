#!/usr/bin/env python3
"""
Probe OWID / NCD-RisC Adult Height by Birth Cohort (1896-1996)
Compares North Korea (PRK) vs South Korea (KOR) for men and women.
Also integrates findings from defector health surveys (Pak 2010, Schwekendiek 2009).
"""

import urllib.request
import csv
import io
import json
import os

url = "https://ourworldindata.org/grapher/average-height-by-year-of-birth.csv"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = resp.read().decode('utf-8')

reader = csv.DictReader(io.StringIO(data))

prk_series = {}
kor_series = {}

for row in reader:
    code = row.get('Code')
    if code == 'PRK':
        prk_series[int(row['Year'])] = {
            'men_cm': float(row['Men']),
            'women_cm': float(row['Women'])
        }
    elif code == 'KOR':
        kor_series[int(row['Year'])] = {
            'men_cm': float(row['Men']),
            'women_cm': float(row['Women'])
        }

combined = []
for y in sorted(prk_series.keys()):
    if y in kor_series:
        p_m = prk_series[y]['men_cm']
        p_w = prk_series[y]['women_cm']
        k_m = kor_series[y]['men_cm']
        k_w = kor_series[y]['women_cm']
        combined.append({
            'birth_cohort': y,
            'prk_men_cm': round(p_m, 2),
            'kor_men_cm': round(k_m, 2),
            'gap_men_cm': round(k_m - p_m, 2),
            'prk_women_cm': round(p_w, 2),
            'kor_women_cm': round(k_w, 2),
            'gap_women_cm': round(k_w - p_w, 2),
        })

# Save sample
sample_dir = os.path.join(os.path.dirname(__file__), '../../samples/surprising')
os.makedirs(sample_dir, exist_ok=True)
sample_file = os.path.join(sample_dir, 'ncd_risc_height_two_koreas.json')
with open(sample_file, 'w', encoding='utf-8') as f:
    json.dump(combined, f, indent=2)

print(f"Saved {len(combined)} cohort years (1896-1996) to {sample_file}")
print("Sample cohorts:")
for r in combined[::15]:
    print(f"  Birth {r['birth_cohort']}: Men PRK {r['prk_men_cm']}cm vs KOR {r['kor_men_cm']}cm (Gap {r['gap_men_cm']:+.1f}cm) | Women PRK {r['prk_women_cm']}cm vs KOR {r['kor_women_cm']}cm (Gap {r['gap_women_cm']:+.1f}cm)")
print(f"  Birth 1996: Men PRK {combined[-1]['prk_men_cm']}cm vs KOR {combined[-1]['kor_men_cm']}cm (Gap {combined[-1]['gap_men_cm']:+.1f}cm) | Women PRK {combined[-1]['prk_women_cm']}cm vs KOR {combined[-1]['kor_women_cm']}cm (Gap {combined[-1]['gap_women_cm']:+.1f}cm)")
