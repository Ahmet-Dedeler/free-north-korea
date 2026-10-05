#!/usr/bin/env python3
"""
Probe script: ACAG Satellite-Derived Surface PM2.5 and High-Resolution NO2 Datasets.

Probes Zenodo API for ACAG global surface NO2 (2005-2023 at 0.01 deg resolution,
doi:10.5281/zenodo.19740022) and TROPOMI fine-scale NO2 records.
"""

import json
import os
import subprocess

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    
    print("--- Probing ACAG / Zenodo Satellite Air Quality Records ---")
    
    # 1. TROPOMI NO2 record 5484305 (Cooper et al., Nature 2022)
    zenodo_records = [
        ("5484305", "Cooper et al. TROPOMI-inferred ground-level NO2 (1km)"),
        ("5424752", "Cooper et al. Long-term OMI & TROPOMI NO2 (2005-2019)")
    ]
    
    results = []
    user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    
    for rec_id, desc in zenodo_records:
        api_url = f"https://zenodo.org/api/records/{rec_id}"
        print(f"Querying Zenodo record {rec_id} ({desc})...")
        try:
            cmd = ["curl", "-s", "--compressed", "-A", user_agent, api_url]
            out = subprocess.check_output(cmd)
            data = json.loads(out)
            metadata = data.get("metadata", {})
            files = data.get("files", [])
            
            rec_info = {
                "record_id": rec_id,
                "title": metadata.get("title"),
                "publication_date": metadata.get("publication_date"),
                "doi": metadata.get("doi"),
                "license": metadata.get("license", {}).get("id") if isinstance(metadata.get("license"), dict) else metadata.get("license"),
                "file_count": len(files),
                "files": [
                    {"key": f.get("key"), "size_mb": round(f.get("size", 0)/(1024*1024), 2), "url": f.get("links", {}).get("self")}
                    for f in files[:5]
                ]
            }
            results.append(rec_info)
            print(f"  Title: {metadata.get('title')}")
            print(f"  DOI:   {metadata.get('doi')} | Date: {metadata.get('publication_date')} | Files: {len(files)}")
        except Exception as e:
            print(f"  Error querying record {rec_id}: {e}")

    out_dir = os.path.join(repo_root, "docs/research/charts/samples/satellite")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "acag_air_quality.json")
    with open(out_file, "w") as f:
        json.dump({"records": results}, f, indent=2)
    print(f"\nSaved sample to {out_file}")

if __name__ == "__main__":
    main()
