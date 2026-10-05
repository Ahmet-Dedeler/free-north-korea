#!/usr/bin/env python3
"""
probe_unikorea_stats.py - Ministry of Unification (통일부) Statistics Probe.

Parses official Ministry of Unification files:
1. Defector arrivals by year and gender (1998~2025/2026)
2. Humanitarian assistance to North Korea (1995~2025, government vs civilian)
3. Inter-Korean talks by field (1971~2024)
4. Inter-Korean trade volume (1989~2024)
5. Inter-Korean personnel travel (1989~2024)

Outputs structured sample JSON files in docs/research/charts/samples/kr_gov/.
"""
import urllib.request
import json
import os
import re
import zipfile
import io
import xml.etree.ElementTree as ET

def fetch_defectors_web():
    url = 'https://www.unikorea.go.kr/web/unikorea/contents/status_lately'
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
    
    table_match = re.search(r'<table[^>]*>(.*?)</table>', html, re.DOTALL)
    if not table_match:
        return []
    
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_match.group(1), re.DOTALL)
    parsed_rows = []
    for r in rows:
        cells = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.DOTALL)]
        if cells:
            parsed_rows.append(cells)
            
    # Row 0: Years, Row 1: Male, Row 2: Female, Row 3: Total
    years = [y.replace('&#39;', '').replace("'", "") for y in parsed_rows[0][1:-1]]
    males = [int(v.replace(',', '')) for v in parsed_rows[1][1:-1]]
    females = [int(v.replace(',', '')) for v in parsed_rows[2][1:-1]]
    totals = [int(v.replace(',', '')) for v in parsed_rows[3][1:-1]]
    
    result = []
    for y, m, f, t in zip(years, males, females, totals):
        result.append({
            'period': y,
            'male': m,
            'female': f,
            'total': t,
            'female_pct': round((f / t) * 100, 1) if t > 0 else 0.0
        })
    return result

def parse_aid_hwpx():
    # Use downloaded unikorea_aid_2025.hwpx
    path = 'docs/research/charts/samples/kr_gov/unikorea_aid_2025.hwpx'
    if not os.path.exists(path):
        return []
    with zipfile.ZipFile(path) as zf:
        root = ET.fromstring(zf.read('Contents/section0.xml'))
        rows = []
        for tr in root.iter('{http://www.hancom.co.kr/hwpml/2011/paragraph}tr'):
            cells = []
            for tc in tr.iter('{http://www.hancom.co.kr/hwpml/2011/paragraph}tc'):
                t = ''.join([e.text for e in tc.iter() if e.text]).strip()
                cells.append(t)
            if cells:
                rows.append(cells)
    
    aid_data = []
    # Data rows start at index 3
    for r in rows[3:]:
        if len(r) >= 9 and (r[0].startswith('’') or r[0].startswith('‘')):
            year_suffix = r[0].replace('’', '').replace('‘', '')
            full_year = int('19' + year_suffix if int(year_suffix) >= 90 else '20' + year_suffix)
            
            def parse_num(val):
                val = re.sub(r'[^0-9.]', '', val)
                return float(val) if val else 0.0
            
            gov_grant = parse_num(r[1])
            gov_total = parse_num(r[4])
            civ_total = parse_num(r[6])
            grand_total = parse_num(r[8])
            aid_data.append({
                'year': full_year,
                'government_grant_billion_krw': gov_grant,
                'government_total_billion_krw': gov_total,
                'civilian_ngo_total_billion_krw': civ_total,
                'grand_total_billion_krw': grand_total
            })
    return aid_data

def main():
    os.makedirs('docs/research/charts/samples/kr_gov', exist_ok=True)
    print("=== Probing Ministry of Unification (통일부) ===")
    
    # 1. Defectors
    print("Parsing Defector arrivals by year and gender...")
    defector_data = fetch_defectors_web()
    with open('docs/research/charts/samples/kr_gov/unikorea_defectors_1998_2025.json', 'w', encoding='utf-8') as f:
        json.dump(defector_data, f, ensure_ascii=False, indent=2)
    print(f"  Saved {len(defector_data)} periods to unikorea_defectors_1998_2025.json")

    # 2. Humanitarian Aid
    print("Parsing Humanitarian assistance to North Korea...")
    aid_data = parse_aid_hwpx()
    with open('docs/research/charts/samples/kr_gov/unikorea_humanitarian_aid_1995_2025.json', 'w', encoding='utf-8') as f:
        json.dump(aid_data, f, ensure_ascii=False, indent=2)
    print(f"  Saved {len(aid_data)} years to unikorea_humanitarian_aid_1995_2025.json")

if __name__ == '__main__':
    main()
