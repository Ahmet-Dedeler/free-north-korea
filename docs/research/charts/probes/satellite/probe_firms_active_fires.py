#!/usr/bin/env python3
"""
Probe script: NASA FIRMS VIIRS Active Fire Detections for DPRK.

Fetches the 7-day active fire CSV for Asia from NASA FIRMS,
spatially joins with DPRK provinces from public/layers/provinces.geojson,
and computes fire counts and total Fire Radiative Power (FRP, MW) per province.
"""

import csv
import io
import json
import os
import urllib.request
from shapely.geometry import Point, shape

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    prov_path = os.path.join(repo_root, "public/layers/provinces.geojson")
    
    with open(prov_path) as f:
        prov_geojson = json.load(f)
        
    provinces = [
        (f["properties"]["name"], f["properties"]["pcode"], shape(f["geometry"]))
        for f in prov_geojson["features"]
    ]
    
    url = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_Russia_Asia_7d.csv"
    print(f"Fetching FIRMS 7-day active fire detections: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        reader = csv.DictReader(io.StringIO(resp.read().decode("utf-8")))
        rows = list(reader)
        
    print(f"Total fire detections in Asia table: {len(rows)}")
    
    prov_stats = {
        pcode: {"name": name, "pcode": pcode, "fire_count": 0, "total_frp_mw": 0.0, "dates": set()}
        for name, pcode, _ in provinces
    }
    
    dprk_total_fires = 0
    dprk_total_frp = 0.0
    
    for row in rows:
        lat = float(row["latitude"])
        lon = float(row["longitude"])
        # Bounding box filter for DPRK: 37.5 <= lat <= 43.1, 124.0 <= lon <= 131.0
        if 37.5 <= lat <= 43.1 and 124.0 <= lon <= 131.0:
            pt = Point(lon, lat)
            for name, pcode, poly in provinces:
                if poly.contains(pt):
                    frp = float(row.get("frp", 0.0))
                    prov_stats[pcode]["fire_count"] += 1
                    prov_stats[pcode]["total_frp_mw"] += frp
                    prov_stats[pcode]["dates"].add(row["acq_date"])
                    dprk_total_fires += 1
                    dprk_total_frp += frp
                    break
                    
    print(f"\n--- DPRK 7-Day Active Fires (Total: {dprk_total_fires} fires, {dprk_total_frp:.1f} MW FRP) ---")
    output_data = {}
    for pcode, data in sorted(prov_stats.items(), key=lambda x: -x[1]["fire_count"]):
        dates_list = sorted(list(data["dates"]))
        output_data[pcode] = {
            "name": data["name"],
            "pcode": data["pcode"],
            "fire_count": data["fire_count"],
            "total_frp_mw": round(data["total_frp_mw"], 2),
            "dates": dates_list
        }
        print(f"  [{pcode}] {data['name']:16s}: {data['fire_count']:2d} fires | FRP: {data['total_frp_mw']:6.2f} MW | Dates: {dates_list}")
        
    out_dir = os.path.join(repo_root, "docs/research/charts/samples/satellite")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "firms_active_fires_7d.json")
    with open(out_file, "w") as f:
        json.dump({
            "source": "NASA FIRMS Suomi-NPP VIIRS C2 375m",
            "dprk_total_fires": dprk_total_fires,
            "dprk_total_frp_mw": round(dprk_total_frp, 2),
            "provinces": output_data
        }, f, indent=2)
    print(f"\nSaved sample to {out_file}")

if __name__ == "__main__":
    main()
