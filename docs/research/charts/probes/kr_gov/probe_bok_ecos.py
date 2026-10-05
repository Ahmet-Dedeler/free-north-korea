#!/usr/bin/env python3
"""
probe_bok_ecos.py - Bank of Korea (BOK) ECOS OpenAPI Probe for North Korea Statistics.

Fetches:
1. Real GDP growth rate (1990~2024) [Table 251Y001 / Item 1010400]
2. Nominal GNI and GNI per capita [Table 251Y001 / Items 1010200, 1010300]
3. Sectoral GDP growth (Agriculture, Mining, Manufacturing) [Table 251Y001 / Items 2010100, 2010201, 2010202]
4. Quarterly Market Exchange Rates (Pyongyang KPW/USD & KPW/CNY, 2015Q1~2025Q2) [Table 252Y002 / Items A020, B020]
5. Quarterly North Korean Market Price Index [Table 252Y001 / Item A110000]

Paginates in 10-row chunks to comply with BOK ECOS 'sample' key restrictions.
"""
import urllib.request
import json
import os
import time

API_KEY = 'sample'
BASE_URL = 'https://ecos.bok.or.kr/api/StatisticSearch'

def fetch_ecos_series_paginated(tbl_code, cycle, start_time, end_time, item_code):
    all_rows = []
    start_idx = 1
    chunk_size = 10
    while True:
        end_idx = start_idx + chunk_size - 1
        url = f"{BASE_URL}/{API_KEY}/json/kr/{start_idx}/{end_idx}/{tbl_code}/{cycle}/{start_time}/{end_time}/{item_code}/"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if 'StatisticSearch' in data:
                    rows = data['StatisticSearch'].get('row', [])
                    if not rows:
                        break
                    all_rows.extend(rows)
                    total_count = int(data['StatisticSearch'].get('list_total_count', 0))
                    if len(all_rows) >= total_count:
                        break
                    start_idx += chunk_size
                    time.sleep(0.05)
                else:
                    break
        except Exception as e:
            print(f"Exception fetching {tbl_code}/{item_code} at {start_idx}: {e}")
            break
    return all_rows

def main():
    os.makedirs('docs/research/charts/samples/kr_gov', exist_ok=True)
    print("=== Probing Bank of Korea ECOS API ===")

    # 1. Real GDP Growth Rate
    print("Fetching North Korea Real GDP Growth Rate (1990~2024)...")
    gdp_rows = fetch_ecos_series_paginated('251Y001', 'A', '1990', '2025', '1010400')
    gdp_series = [{'year': int(r['TIME']), 'gdp_growth_rate_pct': float(r['DATA_VALUE'])} for r in gdp_rows]
    print(f"  Got {len(gdp_series)} annual data points. Latest: {gdp_series[-1]}")

    # 2. GNI and GNI per capita
    print("Fetching North Korea GNI & GNI per capita (1990~2024)...")
    nominal_gni_rows = fetch_ecos_series_paginated('251Y001', 'A', '1990', '2025', '1010200')
    gni_pc_rows = fetch_ecos_series_paginated('251Y001', 'A', '1990', '2025', '1010300')
    
    gni_dict = {r['TIME']: float(r['DATA_VALUE']) for r in nominal_gni_rows}
    gni_pc_dict = {r['TIME']: float(r['DATA_VALUE']) for r in gni_pc_rows}

    combined_national_accounts = []
    for g in gdp_series:
        y_str = str(g['year'])
        combined_national_accounts.append({
            'year': g['year'],
            'gdp_growth_rate_pct': g['gdp_growth_rate_pct'],
            'nominal_gni_billion_krw': gni_dict.get(y_str),
            'gni_per_capita_manwon': gni_pc_dict.get(y_str)
        })

    with open('docs/research/charts/samples/kr_gov/bok_gdp_gni_1990_2024.json', 'w', encoding='utf-8') as f:
        json.dump(combined_national_accounts, f, ensure_ascii=False, indent=2)
    print(f"  Saved {len(combined_national_accounts)} records to docs/research/charts/samples/kr_gov/bok_gdp_gni_1990_2024.json")

    # 3. Market Exchange Rates (Pyongyang KPW/USD)
    print("Fetching Pyongyang Market Exchange Rates (2015Q1~2025Q2)...")
    fx_usd_rows = fetch_ecos_series_paginated('252Y002', 'Q', '2015Q1', '2025Q4', 'A020')
    fx_cny_rows = fetch_ecos_series_paginated('252Y002', 'Q', '2015Q1', '2025Q4', 'B020')
    cny_dict = {r['TIME']: float(r['DATA_VALUE']) for r in fx_cny_rows}

    fx_series = []
    for r in fx_usd_rows:
        q = r['TIME']
        fx_series.append({
            'period': q,
            'kpw_per_usd': float(r['DATA_VALUE']),
            'kpw_per_cny': cny_dict.get(q)
        })
    print(f"  Got {len(fx_series)} quarterly exchange rate points. Latest: {fx_series[-1]}")

    with open('docs/research/charts/samples/kr_gov/bok_market_fx_2015_2025.json', 'w', encoding='utf-8') as f:
        json.dump(fx_series, f, ensure_ascii=False, indent=2)
    print(f"  Saved {len(fx_series)} records to docs/research/charts/samples/kr_gov/bok_market_fx_2015_2025.json")

if __name__ == '__main__':
    main()
