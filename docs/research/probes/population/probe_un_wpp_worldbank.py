#!/usr/bin/env python3
"""
Probe script for UN World Population Prospects (WPP 2024), UN Data Portal API,
and World Bank World Development Indicators (WDI) API for North Korea (PRK).
"""
import urllib.request
import json
import ssl

def probe_world_bank():
    url = "https://api.worldbank.org/v2/country/PRK/indicator/SP.POP.TOTL?format=json&date=2015:2025"
    print("\n--- World Bank WDI Population for PRK ---")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        records = data[1]
        for r in records[:5]:
            print(f"Year {r['date']}: {r['value']:,} ({r['indicator']['value']})")

def probe_un_dataportal():
    url = "https://population.un.org/dataportalapi/api/v1/locations/408"
    print("\n--- UN Data Portal Location 408 (PRK) ---")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Location: {data[0].get('name')} | ISO3: {data[0].get('iso3')} | Lat/Lon: {data[0].get('latitude')}, {data[0].get('longitude')}")

def probe_un_wpp_github():
    url = "https://raw.githubusercontent.com/PPgp/wpp2024/main/data/UNlocations.txt"
    print("\n--- UN WPP 2024 Locations Entry ---")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        for line in resp.read().decode('utf-8').splitlines():
            if 'Dem. People\'s Republic of Korea' in line:
                parts = line.split('\t')
                print(f"Found in WPP2024: Name='{parts[0]}', Code={parts[1]}, Subregion={parts[3]}, Region={parts[5]}")

if __name__ == '__main__':
    probe_world_bank()
    probe_un_dataportal()
    probe_un_wpp_github()
