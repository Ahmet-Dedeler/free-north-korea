#!/usr/bin/env python3
"""
Probe script: WorldPop Gridded Population (2000-2020) and Kontur H3 400m Density for DPRK.

Queries WorldPop REST API for annual population rasters and HDX for Kontur Population.
"""

import json
import os
import urllib.request

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    
    print("--- Probing WorldPop & Kontur Population Datasets for DPRK ---")
    
    # 1. WorldPop REST API
    wp_api = "https://hub.worldpop.org/rest/data/pop/wpgp?iso3=PRK"
    print(f"Querying WorldPop REST API: {wp_api}")
    req_wp = urllib.request.Request(wp_api, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req_wp, timeout=30) as resp:
        wp_data = json.loads(resp.read().decode("utf-8"))
        
    wp_series = []
    for item in wp_data.get("data", []):
        title = item.get("title")
        files = item.get("files", [])
        # Extract year from title, e.g. "The spatial distribution of population in 2020, North Korea"
        year = None
        for word in title.split():
            clean = word.strip(",")
            if clean.isdigit() and len(clean) == 4:
                year = int(clean)
                break
        wp_series.append({
            "year": year,
            "title": title,
            "url": files[0] if files else None
        })
        
    wp_series.sort(key=lambda x: x["year"] or 0)
    print(f"WorldPop annual rasters available: {len(wp_series)} years ({wp_series[0]['year']} - {wp_series[-1]['year']})")
    print(f"  Latest WorldPop 2020 URL: {wp_series[-1]['url']}")

    # 2. Kontur Population on HDX
    kontur_api = "https://data.humdata.org/api/3/action/package_show?id=kontur-population-democratic-people-s-republic-of-korea"
    print(f"\nQuerying Kontur Population HDX package...")
    req_k = urllib.request.Request(kontur_api, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req_k, timeout=30) as resp:
        k_data = json.loads(resp.read().decode("utf-8"))
        
    resources = k_data.get("result", {}).get("resources", [])
    kontur_files = []
    for r in resources:
        size_mb = round(float(r.get("size", 0)) / (1024 * 1024), 2) if r.get("size") else None
        kontur_files.append({
            "name": r.get("name"),
            "url": r.get("url"),
            "format": r.get("format"),
            "size_mb": size_mb,
            "last_modified": r.get("last_modified")
        })
        print(f"  Resource: {r.get('name')} | Format: {r.get('format')} | Size: {size_mb} MB | Modified: {r.get('last_modified')}")

    out_dir = os.path.join(repo_root, "docs/research/charts/samples/satellite")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "worldpop_kontur.json")
    with open(out_file, "w") as f:
        json.dump({
            "worldpop_years": len(wp_series),
            "worldpop_range": f"{wp_series[0]['year']}-{wp_series[-1]['year']}",
            "worldpop_series": wp_series,
            "kontur_resources": kontur_files
        }, f, indent=2)
    print(f"\nSaved sample to {out_file}")

if __name__ == "__main__":
    main()
