#!/usr/bin/env python3
"""
Probe script for OpenStreetMap (Overpass API), geoBoundaries (William & Mary),
and Justin Elliot Meyers DPRK Administrative Boundaries shapefile.
"""
import urllib.request
import urllib.parse
import json
import ssl

def probe_overpass_admin():
    print("--- Probing OpenStreetMap Overpass API for DPRK Admin Boundaries ---")
    query = """[out:json][timeout:15];
relation["boundary"="administrative"]["admin_level"="4"]["ISO3166-1"!="KR"](37.5,124.0,43.1,131.0);
out tags;"""
    url = "https://overpass-api.de/api/interpreter"
    data = urllib.parse.urlencode({'data': query}).encode('utf-8')
    headers = {
        'User-Agent': 'AntigravityResearch/1.0 (North Korea Population Track)',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    req = urllib.request.Request(url, data=data, headers=headers)
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            elements = res.get('elements', [])
            print(f"Total admin_level 4 relations found: {len(elements)}")
            for e in elements[:5]:
                t = e.get('tags', {})
                print(f"  - {t.get('name:en', t.get('name'))} ({t.get('name:ko', t.get('name'))})")
    except Exception as e:
        print(f"Overpass query notice: {e}")

def probe_geoboundaries():
    print("\n--- Probing geoBoundaries API for PRK ---")
    for level in ['ADM1', 'ADM2']:
        url = f"https://www.geoboundaries.org/api/current/gbOpen/PRK/{level}/"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        ctx = ssl.create_default_context()
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                print(f"{level}: Year={data.get('boundaryYearRepresented')}, Type={data.get('boundaryType')}")
                print(f"  GeoJSON URL: {data.get('gjDownloadURL')}")
        except Exception as e:
            print(f"geoBoundaries {level} error: {e}")

def probe_justin_meyers():
    print("\n--- Probing Justin Elliot Meyers DPRK Shapefile Repository ---")
    url = "https://api.github.com/repos/justinelliotmeyers/official_DPRK_administrative_boundary_shapefile"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"Repo: {data.get('full_name')} | Size: {data.get('size')} KB | Pushed: {data.get('pushed_at')}")
            print("  Admin2 DBF URL: https://raw.githubusercontent.com/justinelliotmeyers/official_DPRK_administrative_boundary_shapefile/master/northkoreaadmin2_master.dbf")
    except Exception as e:
        print(f"Justin Meyers probe error: {e}")

if __name__ == '__main__':
    probe_overpass_admin()
    probe_geoboundaries()
    probe_justin_meyers()
