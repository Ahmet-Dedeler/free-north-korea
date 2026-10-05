#!/usr/bin/env python3
"""
Probe script: Nighttime lights (VIIRS) and GHSL built-up area for DPRK provinces
via World Bank Space2Stats API (https://space2stats.ds.io).

Extracts annual sum-of-lights (2012-2024), built-up surface area (1975-2025),
and population (2020) for all 11 DPRK provinces using public/layers/provinces.geojson,
and compares with South Korea (Seoul) and Chinese border (Dandong).
"""

import json
import os
import sys
import time
import requests

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    prov_path = os.path.join(repo_root, "public/layers/provinces.geojson")
    
    if not os.path.exists(prov_path):
        print(f"Error: {prov_path} not found")
        sys.exit(1)
        
    with open(prov_path) as f:
        provinces = json.load(f)
        
    fields = [
        "sum_viirs_ntl_2012", "sum_viirs_ntl_2015", "sum_viirs_ntl_2018",
        "sum_viirs_ntl_2021", "sum_viirs_ntl_2024",
        "sum_built_area_m_1975", "sum_built_area_m_2000", "sum_built_area_m_2025",
        "sum_pop_2020"
    ]
    
    print(f"--- Probing Space2Stats API for {len(provinces['features'])} DPRK Provinces ---")
    results = {}
    
    for feat in provinces["features"]:
        pcode = feat["properties"]["pcode"]
        name = feat["properties"]["name"]
        
        payload = {
            "aoi": feat,
            "spatial_join_method": "centroid",
            "fields": fields,
            "aggregation_type": "sum"
        }
        
        t0 = time.time()
        resp = requests.post("https://space2stats.ds.io/aggregate", json=payload, timeout=30)
        dur = time.time() - t0
        
        if resp.status_code == 200:
            data = resp.json()
            results[pcode] = {
                "name": name,
                "pcode": pcode,
                "ntl_2012": round(data.get("sum_viirs_ntl_2012", 0), 2),
                "ntl_2024": round(data.get("sum_viirs_ntl_2024", 0), 2),
                "ntl_change_pct": round(
                    ((data.get("sum_viirs_ntl_2024", 0) - data.get("sum_viirs_ntl_2012", 0)) /
                     (data.get("sum_viirs_ntl_2012", 1) or 1)) * 100, 1
                ),
                "built_1975_km2": round(data.get("sum_built_area_m_1975", 0) / 1e6, 2),
                "built_2025_km2": round(data.get("sum_built_area_m_2025", 0) / 1e6, 2),
                "pop_2020": int(data.get("sum_pop_2020", 0))
            }
            print(f"  [{pcode}] {name:16s} ({dur:.2f}s) | NTL 2012->2024: {results[pcode]['ntl_2012']:9.1f} -> {results[pcode]['ntl_2024']:9.1f} ({results[pcode]['ntl_change_pct']:+6.1f}%) | Built 2025: {results[pcode]['built_2025_km2']:5.1f} km2")
        else:
            print(f"  [{pcode}] {name} Failed: HTTP {resp.status_code}")
            
    # Comparative benchmarks: Seoul and Dandong
    print("\n--- Comparative Benchmarks ---")
    comparisons = [
        ("Seoul Metro (ROK)", [[[126.8, 37.4], [127.2, 37.4], [127.2, 37.7], [126.8, 37.7], [126.8, 37.4]]]),
        ("Dandong Border City (CHN)", [[[124.2, 39.9], [124.6, 39.9], [124.6, 40.2], [124.2, 40.2], [124.2, 39.9]]])
    ]
    
    comp_results = {}
    for cname, coords in comparisons:
        feat = {
            "type": "Feature",
            "geometry": {"type": "Polygon", "coordinates": coords},
            "properties": {"name": cname}
        }
        resp = requests.post("https://space2stats.ds.io/aggregate", json={
            "aoi": feat,
            "spatial_join_method": "centroid",
            "fields": ["sum_viirs_ntl_2012", "sum_viirs_ntl_2024", "sum_pop_2020"],
            "aggregation_type": "sum"
        }, timeout=30)
        if resp.status_code == 200:
            cdata = resp.json()
            comp_results[cname] = {
                "ntl_2012": round(cdata.get("sum_viirs_ntl_2012", 0), 2),
                "ntl_2024": round(cdata.get("sum_viirs_ntl_2024", 0), 2)
            }
            print(f"  {cname:25s} | NTL 2012->2024: {comp_results[cname]['ntl_2012']:9.1f} -> {comp_results[cname]['ntl_2024']:9.1f}")

    # Save verified sample output
    out_dir = os.path.join(repo_root, "docs/research/charts/samples/satellite")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "space2stats_dprk_provinces.json")
    with open(out_file, "w") as f:
        json.dump({"provinces": results, "comparisons": comp_results}, f, indent=2)
    print(f"\nSaved sample to {out_file}")

if __name__ == "__main__":
    main()
