#!/usr/bin/env python3
"""
Probe script for WorldPop gridded population & age/sex rasters,
and NASA GIBS VIIRS Black Marble nighttime lights WMTS tile service.
"""
import urllib.request
import json
import ssl

def probe_worldpop():
    print("--- Probing WorldPop Datasets for North Korea (PRK) ---")
    
    # 1. 2020 100m Constrained BSGM GeoTIFF
    url_pop = "https://data.worldpop.org/GIS/Population/Global_2000_2020_Constrained/2020/BSGM/PRK/prk_ppp_2020_constrained.tif"
    req = urllib.request.Request(url_pop, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
    with urllib.request.urlopen(req, timeout=15) as resp:
        print(f"2020 100m Constrained GeoTIFF: HTTP {resp.status}, Size={resp.headers.get('Content-Length')} bytes, Modified={resp.headers.get('Last-Modified')}")
        print(f"  URL: {url_pop}")

    # 2. 2020 Age/Sex Structures
    url_age = "https://data.worldpop.org/GIS/AgeSex_structures/Global_2000_2020_Constrained/2020/PRK/prk_f_0_2020_constrained.tif"
    req = urllib.request.Request(url_age, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
    with urllib.request.urlopen(req, timeout=15) as resp:
        print(f"2020 Age 0 Female GeoTIFF: HTTP {resp.status}, Size={resp.headers.get('Content-Length')} bytes, Modified={resp.headers.get('Last-Modified')}")
        print(f"  URL: {url_age}")

def probe_nasa_gibs():
    print("\n--- Probing NASA GIBS VIIRS Black Marble WMTS Tiles ---")
    tile_url = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/6/25/54.png"
    req = urllib.request.Request(tile_url, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
    with urllib.request.urlopen(req, timeout=15) as resp:
        print(f"NASA GIBS Tile (z=6, y=25, x=54 over Korea): HTTP {resp.status}")
        print(f"  Content-Type: {resp.headers.get('Content-Type')}, Size={resp.headers.get('Content-Length')} bytes")
        print(f"  Layer: {resp.headers.get('layer-identifier-request')}")
        print(f"  WMTS URL Pattern: https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/{{time}}/GoogleMapsCompatible_Level8/{{z}}/{{y}}/{{x}}.png")

if __name__ == '__main__':
    probe_worldpop()
    probe_nasa_gibs()
