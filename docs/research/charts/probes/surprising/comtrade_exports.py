#!/usr/bin/env python3
"""
Probe UN Comtrade Mirror Data for DPRK Exports to China (Reporter: 156, Partner: 408)
Queries single years to satisfy Comtrade API v1 preview constraints, with rate-limit retries.
"""

import urllib.request
import urllib.error
import json
import time
import os

COMMODITIES = {
    '6704': 'Wigs & False Eyelashes (HS 6704)',
    '2701': 'Coal (HS 2701)',
    '2601': 'Iron Ore (HS 2601)',
    '61': 'Knitted Apparel (HS 61)',
    '62': 'Woven Apparel (HS 62)',
    '03': 'Fish & Seafood (HS 03)',
    '2716': 'Electricity (HS 2716)',
    'TOTAL': 'Total Imports (All Commodities)'
}

YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]

results = {cmd: {'label': label, 'data': {}} for cmd, label in COMMODITIES.items()}

def fetch_comtrade(cmd, year):
    url = f"https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=156&partnerCode=408&period={year}&cmdCode={cmd}"
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                records = data.get('data', [])
                for r in records:
                    if r.get('flowCode') == 'M':
                        val = r.get('primaryValue', 0.0)
                        qty = r.get('qty', 0.0)
                        return val, qty
                return 0.0, 0.0
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait_time = 3 * (attempt + 1)
                # print(f"    Rate limit 429 for {cmd} {year}, waiting {wait_time}s...")
                time.sleep(wait_time)
            elif e.code == 400:
                return None, None
            else:
                # print(f"    HTTP error {e.code} for {cmd} {year}")
                time.sleep(2)
        except Exception as e:
            time.sleep(2)
    return None, None

print("Starting Comtrade query across years and commodities...")
for cmd, label in COMMODITIES.items():
    print(f"\nProcessing {cmd}: {label}...")
    for yr in YEARS:
        val, qty = fetch_comtrade(cmd, yr)
        if val is not None:
            results[cmd]['data'][yr] = {'val': val, 'qty': qty}
            print(f"  {yr}: ${val:,.0f} (qty: {qty:,.0f})")
        else:
            print(f"  {yr}: [failed/no-data]")
        time.sleep(1.5)

# Save sample output
sample_dir = os.path.join(os.path.dirname(__file__), '../../samples/surprising')
os.makedirs(sample_dir, exist_ok=True)
sample_file = os.path.join(sample_dir, 'comtrade_china_dprk_exports.json')
with open(sample_file, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
print(f"\nSaved verified data to {sample_file}")
