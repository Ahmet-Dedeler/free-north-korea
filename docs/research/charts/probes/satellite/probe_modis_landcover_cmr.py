#!/usr/bin/env python3
"""
Probe script: NASA CMR API for MODIS MCD12Q1 Land Cover Type Yearly 500m.

Queries NASA CMR to resolve exact tile granules (h27v04, h27v05, h28v04, h28v05)
covering DPRK for land cover time series analysis (2001-2024).
"""

import json
import os
import urllib.request
import urllib.parse

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    
    print("--- Probing NASA CMR for MODIS MCD12Q1 Land Cover Granules ---")
    
    # Bounding box for DPRK: [124, 37, 131, 43]
    cmr_url = (
        "https://cmr.earthdata.nasa.gov/search/granules.json?"
        "short_name=MCD12Q1&bounding_box=124,37,131,43&sort_key=-start_date&page_size=10"
    )
    
    req = urllib.request.Request(cmr_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        
    entries = data.get("feed", {}).get("entry", [])
    print(f"Retrieved {len(entries)} recent granules:")
    
    granules = []
    for g in entries:
        title = g.get("title")
        time_start = g.get("time_start")
        size_mb = round(float(g.get("granule_size", 0)), 2)
        links = [l["href"] for l in g.get("links", []) if "data#" in l.get("rel", "")]
        download_url = links[0] if links else None
        
        granules.append({
            "title": title,
            "year": time_start[:4] if time_start else None,
            "size_mb": size_mb,
            "url": download_url
        })
        print(f"  {title:45s} | Year: {time_start[:4]} | Size: {size_mb:5.2f} MB")
        
    out_dir = os.path.join(repo_root, "docs/research/charts/samples/satellite")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "mcd12q1_granules.json")
    with open(out_file, "w") as f:
        json.dump({"granules": granules}, f, indent=2)
    print(f"\nSaved sample to {out_file}")

if __name__ == "__main__":
    main()
