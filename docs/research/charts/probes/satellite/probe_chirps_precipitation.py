#!/usr/bin/env python3
"""
Probe script: UCSB Climate Hazards Center (CHC) CHIRPS 2.0 Precipitation.

Checks availability of annual (1981-2024) and monthly (1981-2026) global 0.05 deg
rainfall GeoTIFFs, confirming exact download URLs and latest update timestamps.
"""

import json
import os
import re
import urllib.request

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    
    print("--- Probing UCSB CHC CHIRPS 2.0 Dataset Availability ---")
    
    # 1. Annual directory
    annual_dir_url = "https://data.chc.ucsb.edu/products/CHIRPS-2.0/global_annual/tifs/"
    req = urllib.request.Request(annual_dir_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        annual_html = resp.read().decode("utf-8")
        
    annual_files = re.findall(r'href="(chirps-v2\.0\.(\d{4})\.tif)"', annual_html)
    years = [int(y) for _, y in annual_files]
    latest_annual_year = max(years)
    latest_annual_file = f"chirps-v2.0.{latest_annual_year}.tif"
    latest_annual_url = f"{annual_dir_url}{latest_annual_file}"
    
    print(f"Annual Series Range: {min(years)} - {latest_annual_year} ({len(years)} years)")
    print(f"Latest Annual File:  {latest_annual_file} ({latest_annual_url})")
    
    # Check HEAD for latest annual file
    head_req = urllib.request.Request(latest_annual_url, headers={"User-Agent": "Mozilla/5.0"}, method="HEAD")
    with urllib.request.urlopen(head_req, timeout=30) as resp:
        annual_size_mb = round(int(resp.headers.get("Content-Length", 0)) / (1024 * 1024), 2)
        annual_modified = resp.headers.get("Last-Modified")
        print(f"  HTTP {resp.status} | Size: {annual_size_mb} MB | Modified: {annual_modified}")

    # 2. Monthly directory
    monthly_dir_url = "https://data.chc.ucsb.edu/products/CHIRPS-2.0/global_monthly/tifs/"
    req_m = urllib.request.Request(monthly_dir_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req_m, timeout=30) as resp:
        monthly_html = resp.read().decode("utf-8")
        
    monthly_files = re.findall(r'href="(chirps-v2\.0\.(\d{4})\.(\d{2})\.tif\.gz)"', monthly_html)
    months = [f"{y}-{m}" for _, y, m in monthly_files]
    latest_month = max(months)
    latest_monthly_file = f"chirps-v2.0.{latest_month.replace('-', '.')}.tif.gz"
    latest_monthly_url = f"{monthly_dir_url}{latest_monthly_file}"
    
    print(f"\nMonthly Series Range: {min(months)} - {latest_month} ({len(months)} months)")
    print(f"Latest Monthly File:  {latest_monthly_file} ({latest_monthly_url})")
    
    head_req_m = urllib.request.Request(latest_monthly_url, headers={"User-Agent": "Mozilla/5.0"}, method="HEAD")
    with urllib.request.urlopen(head_req_m, timeout=30) as resp:
        monthly_size_mb = round(int(resp.headers.get("Content-Length", 0)) / (1024 * 1024), 2)
        monthly_modified = resp.headers.get("Last-Modified")
        print(f"  HTTP {resp.status} | Size: {monthly_size_mb} MB | Modified: {monthly_modified}")

    # Save verified sample output
    out_dir = os.path.join(repo_root, "docs/research/charts/samples/satellite")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "chirps_availability.json")
    with open(out_file, "w") as f:
        json.dump({
            "annual": {
                "start_year": min(years),
                "latest_year": latest_annual_year,
                "latest_url": latest_annual_url,
                "size_mb": annual_size_mb,
                "last_modified": annual_modified
            },
            "monthly": {
                "start_month": min(months),
                "latest_month": latest_month,
                "latest_url": latest_monthly_url,
                "size_mb": monthly_size_mb,
                "last_modified": monthly_modified
            }
        }, f, indent=2)
    print(f"\nSaved sample to {out_file}")

if __name__ == "__main__":
    main()
