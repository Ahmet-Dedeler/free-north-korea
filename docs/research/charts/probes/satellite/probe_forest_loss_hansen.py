#!/usr/bin/env python3
"""
Probe script: Hansen Global Forest Change v1.13 (2000-2025) Tree Cover Loss.

Checks public Google Cloud Storage tiles covering DPRK for tree cover loss (lossyear),
baseline canopy cover (treecover2000), and forest gain.
"""

import json
import os
import urllib.request

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    
    print("--- Probing Hansen Global Forest Change v1.13 (2000-2025) Tiles for DPRK ---")
    base_url = "https://storage.googleapis.com/earthenginepartners-hansen/GFC-2025-v1.13/"
    
    # Tiles covering DPRK: 40N_120E, 50N_120E
    tile_layers = [
        ("lossyear", "40N_120E", "Year of gross tree cover loss (values 1-25 = 2001-2025)"),
        ("lossyear", "50N_120E", "Year of gross tree cover loss (northern DPRK border)"),
        ("treecover2000", "40N_120E", "Tree canopy cover in year 2000 (0-100%)"),
        ("gain", "40N_120E", "Forest gain over 2000-2012 (1 = gain)"),
        ("datamask", "40N_120E", "Land/water mask")
    ]
    
    verified_tiles = []
    for layer, tile_id, desc in tile_layers:
        fname = f"Hansen_GFC-2025-v1.13_{layer}_{tile_id}.tif"
        url = f"{base_url}{fname}"
        
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}, method="HEAD")
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            size_mb = round(int(resp.headers.get("Content-Length", 0)) / (1024 * 1024), 2)
            modified = resp.headers.get("Last-Modified")
            accept_ranges = resp.headers.get("Accept-Ranges")
            
            verified_tiles.append({
                "layer": layer,
                "tile_id": tile_id,
                "filename": fname,
                "url": url,
                "size_mb": size_mb,
                "accept_ranges": accept_ranges,
                "last_modified": modified,
                "description": desc
            })
            print(f"  {fname:50s} | HTTP {status} | Size: {size_mb:6.2f} MB | Modified: {modified}")

    out_dir = os.path.join(repo_root, "docs/research/charts/samples/satellite")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "hansen_gfc_tiles.json")
    with open(out_file, "w") as f:
        json.dump({"version": "v1.13 (2000-2025)", "tiles": verified_tiles}, f, indent=2)
    print(f"\nSaved sample to {out_file}")

if __name__ == "__main__":
    main()
