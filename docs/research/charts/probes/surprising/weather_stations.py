#!/usr/bin/env python3
"""
Probe NOAA GHCN-Daily records for North Korean WMO Weather Stations
Stations:
- KNM00047035: Sinuiju (Site of historic July 2024 Yalu River floods)
- KNM00047058: Pyongyang Intl / Sunan
- KNM00047055: Wonsan (East Coast)
- KNM00047069: Haeju (Southwest)
- KNM00047014: Chunggang (Inland Far North)
- KNM00047025: Kimchaek / Songjin (Northeast Coast)
"""

import urllib.request
import os
import json

STATIONS = {
    'KNM00047035': {'name': 'Sinuiju', 'lat': 40.1000, 'lon': 124.3830, 'elev': 7.0},
    'KNM00047058': {'name': 'Pyongyang Intl', 'lat': 39.2240, 'lon': 125.6700, 'elev': 35.7},
    'KNM00047055': {'name': 'Wonsan', 'lat': 39.1830, 'lon': 127.4330, 'elev': 36.0},
    'KNM00047069': {'name': 'Haeju', 'lat': 38.0330, 'lon': 125.7000, 'elev': 81.0},
    'KNM00047014': {'name': 'Chunggang', 'lat': 41.7830, 'lon': 126.8830, 'elev': 331.0},
    'KNM00047025': {'name': 'Kimchaek', 'lat': 40.6670, 'lon': 129.2000, 'elev': 23.0},
}

def parse_ghcn_dly(content):
    records = []
    lines = content.strip().split('\n')
    for line in lines:
        if len(line) < 21:
            continue
        station = line[0:11]
        year = int(line[11:15])
        month = int(line[15:17])
        element = line[17:21] # PRCP, TMAX, TMIN, TAVG
        
        # Parse 31 days
        day_vals = []
        for d in range(31):
            offset = 21 + d * 8
            if offset + 5 <= len(line):
                val_str = line[offset:offset+5].strip()
                if val_str != '-9999' and val_str != '':
                    day_vals.append((d + 1, int(val_str)))
                else:
                    day_vals.append((d + 1, None))
        records.append({
            'station': station,
            'year': year,
            'month': month,
            'element': element,
            'days': day_vals
        })
    return records

results = {}

for stn_id, info in STATIONS.items():
    url = f"https://www.ncei.noaa.gov/pub/data/ghcn/daily/all/{stn_id}.dly"
    print(f"Fetching {stn_id} ({info['name']})...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            records = parse_ghcn_dly(content)
            
            # Analyze annual temperatures and annual precipitation
            annual_data = {}
            july_2024_prcp = []
            
            for r in records:
                y = r['year']
                elem = r['element']
                if y not in annual_data:
                    annual_data[y] = {'tavg_sum': 0, 'tavg_cnt': 0, 'prcp_sum': 0, 'prcp_cnt': 0, 'max_daily_prcp': 0}
                
                if elem == 'TAVG':
                    for d, v in r['days']:
                        if v is not None:
                            annual_data[y]['tavg_sum'] += v / 10.0 # tenths of deg C
                            annual_data[y]['tavg_cnt'] += 1
                elif elem == 'PRCP':
                    for d, v in r['days']:
                        if v is not None:
                            prcp_mm = v / 10.0 # tenths of mm
                            annual_data[y]['prcp_sum'] += prcp_mm
                            annual_data[y]['prcp_cnt'] += 1
                            if prcp_mm > annual_data[y]['max_daily_prcp']:
                                annual_data[y]['max_daily_prcp'] = prcp_mm
                            if y == 2024 and r['month'] == 7:
                                july_2024_prcp.append({'day': d, 'prcp_mm': prcp_mm})
            
            # Filter years with sufficient data
            clean_annual = {}
            for y, d in sorted(annual_data.items()):
                tavg = round(d['tavg_sum'] / d['tavg_cnt'], 2) if d['tavg_cnt'] > 200 else None
                prcp = round(d['prcp_sum'], 1) if d['prcp_cnt'] > 200 else None
                if tavg is not None or prcp is not None or y >= 2020:
                    clean_annual[y] = {
                        'tavg_c': tavg,
                        'prcp_mm': prcp,
                        'max_daily_prcp_mm': round(d['max_daily_prcp'], 1),
                        'coverage_days': max(d['tavg_cnt'], d['prcp_cnt'])
                    }
            
            results[stn_id] = {
                'name': info['name'],
                'lat': info['lat'],
                'lon': info['lon'],
                'elev_m': info['elev'],
                'first_year': min(annual_data.keys()) if annual_data else None,
                'last_year': max(annual_data.keys()) if annual_data else None,
                'july_2024_daily_prcp': july_2024_prcp,
                'annual': clean_annual
            }
            print(f"  Processed {info['name']}: {len(clean_annual)} years of data (range: {min(annual_data.keys())}-{max(annual_data.keys())})")
    except Exception as e:
        print(f"  Failed {stn_id}: {e}")

# Save sample output
sample_dir = os.path.join(os.path.dirname(__file__), '../../samples/surprising')
os.makedirs(sample_dir, exist_ok=True)
sample_file = os.path.join(sample_dir, 'noaa_ghcn_dprk_weather.json')
with open(sample_file, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
print(f"\nSaved verified weather data to {sample_file}")
