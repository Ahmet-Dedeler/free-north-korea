#!/usr/bin/env python3
"""
Probe script for WHO Global Health Observatory (GHO) API,
UNICEF MICS 2017 DPRK Survey Report, and FAO GIEWS Country Brief.
"""
import urllib.request
import json
import ssl

def probe_who_gho():
    print("--- Probing WHO Global Health Observatory API for DPRK (PRK) ---")
    url = "https://ghoapi.azureedge.net/api/WHOSIS_000001?$filter=SpatialDim%20eq%20'PRK'"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        values = data.get('value', [])
        print(f"Total Life Expectancy records for PRK: {len(values)}")
        for v in values[:3]:
            print(f"  Year {v.get('TimeDim')}: {v.get('Dim1')} = {v.get('NumericValue')} (Value: {v.get('Value')})")

def probe_unicef_mics():
    print("\n--- Probing UNICEF MICS 2017 DPRK Findings Report ---")
    url = "https://www.unicef.org/dprk/media/156/file/MICS.pdf"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
    with urllib.request.urlopen(req, timeout=15) as resp:
        print(f"UNICEF DPRK MICS 2017 Report: HTTP {resp.status}")
        print(f"  Content-Length: {resp.headers.get('Content-Length')} bytes (~4.1 MB)")
        print(f"  Content-Type: {resp.headers.get('Content-Type')}")

def probe_fao_giews():
    print("\n--- Probing FAO GIEWS Country Brief: DPRK ---")
    url = "https://www.fao.org/giews/countrybrief/country.jsp?code=PRK"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', 'ignore')
        print(f"FAO GIEWS DPRK Brief: HTTP {resp.status}, HTML size: {len(html)} bytes")
        for line in html.splitlines():
            if 'Reference Date:' in line:
                print(f"  {line.strip()[:100]}")
                break

if __name__ == '__main__':
    probe_who_gho()
    probe_unicef_mics()
    probe_fao_giews()
