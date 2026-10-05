#!/usr/bin/env python3
"""
Probe script: WFP VAM Subnational Dekadal Rainfall (CHIRPS) and NDVI (MODIS) for DPRK
from Humanitarian Data Exchange (HDX).

Extracts rainfall and vegetation index for DPRK provinces, verifies the latest 2026 dekad,
anomaly indices (rfq, viq), and saves verified sample.
"""

import csv
import io
import json
import os
import urllib.request

def fetch_csv_rows(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        content = resp.read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(content))
        return list(reader)

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    
    print("--- Probing WFP VAM Subnational Rainfall & NDVI on HDX ---")
    
    # 1. Rainfall 5YTD URL
    rf_url = "https://data.humdata.org/dataset/3212d9bf-51b1-4f52-bbc8-82aa392b8857/resource/40f285ff-54b2-4544-80a5-d1a79eb70935/download/prk-rainfall-subnat-5ytd.csv"
    print(f"Fetching rainfall: {rf_url}")
    rf_rows = fetch_csv_rows(rf_url)
    print(f"  Total rainfall rows: {len(rf_rows)}")
    
    # 2. NDVI 5YTD URL
    ndvi_url = "https://data.humdata.org/dataset/84d7386b-d9a8-4fb4-b374-9429e335a9c8/resource/090d39d3-0d87-48a9-ad3d-1d7aea2ebdc8/download/prk-ndvi-subnat-5ytd.csv"
    print(f"Fetching NDVI: {ndvi_url}")
    ndvi_rows = fetch_csv_rows(ndvi_url)
    print(f"  Total NDVI rows: {len(ndvi_rows)}")
    
    # Find latest dates
    latest_rf_date = max(r["date"] for r in rf_rows)
    latest_ndvi_date = max(r["date"] for r in ndvi_rows)
    
    print(f"\nLatest Rainfall Dekad: {latest_rf_date}")
    print(f"Latest NDVI Dekad:     {latest_ndvi_date}")
    
    # Filter to admin level 1 (provinces) for the latest dekad
    latest_rf_prov = [r for r in rf_rows if r["date"] == latest_rf_date and r["adm_level"] == "1"]
    latest_ndvi_prov = [r for r in ndvi_rows if r["date"] == latest_ndvi_date and r["adm_level"] == "1"]
    
    print(f"\n--- Latest Rainfall by Province (Dekad {latest_rf_date}) ---")
    rf_summary = {}
    for r in sorted(latest_rf_prov, key=lambda x: x["PCODE"]):
        pcode = r["PCODE"]
        rfh = float(r["rfh"])
        rfh_avg = float(r["rfh_avg"])
        rfq = float(r["rfq"])
        r3h = float(r["r3h"]) if r.get("r3h") else None
        r3q = float(r["r3q"]) if r.get("r3q") else None
        rf_summary[pcode] = {
            "pcode": pcode,
            "dekad_rf_mm": rfh,
            "dekad_rf_norm_mm": rfh_avg,
            "dekad_anomaly_pct": rfq,
            "season_3m_rf_mm": r3h,
            "season_3m_anomaly_pct": r3q,
            "version": r.get("version")
        }
        print(f"  {pcode}: {rfh:5.1f} mm (normal {rfh_avg:5.1f} mm, {rfq:5.1f}% of normal) | 3-month: {r3h:6.1f} mm ({r3q:5.1f}%)")
        
    print(f"\n--- Latest NDVI by Province (Dekad {latest_ndvi_date}) ---")
    ndvi_summary = {}
    for r in sorted(latest_ndvi_prov, key=lambda x: x["PCODE"]):
        pcode = r["PCODE"]
        vim = float(r["vim"])
        vim_avg = float(r["vim_avg"])
        viq = float(r["viq"])
        ndvi_summary[pcode] = {
            "pcode": pcode,
            "ndvi": vim,
            "ndvi_norm": vim_avg,
            "ndvi_anomaly_pct": viq
        }
        print(f"  {pcode}: NDVI {vim:.3f} (normal {vim_avg:.3f}, {viq:5.1f}% of normal)")

    # Save verified sample output
    out_dir = os.path.join(repo_root, "docs/research/charts/samples/satellite")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "wfp_rainfall_ndvi_2026.json")
    with open(out_file, "w") as f:
        json.dump({
            "latest_rainfall_dekad": latest_rf_date,
            "latest_ndvi_dekad": latest_ndvi_date,
            "rainfall_by_province": rf_summary,
            "ndvi_by_province": ndvi_summary
        }, f, indent=2)
    print(f"\nSaved sample to {out_file}")

if __name__ == "__main__":
    main()
