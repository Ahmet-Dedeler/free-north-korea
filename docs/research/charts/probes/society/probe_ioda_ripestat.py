#!/usr/bin/env python3
"""
Probe script: Georgia Tech IODA and RIPEstat for North Korea (KP, AS131279).
Extracts:
1. IODA BGP, ping-slash24, and merit-nt signals for KP (recent and historical Jan 2022 DDoS outage).
2. RIPEstat routing status, announced prefixes (1,024 IPv4 addresses), and upstream neighbours (China Unicom AS134544, Russia TransTeleCom AS20485).
"""

import json
import os
import sys
import time
import urllib.request

SAMPLE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../samples/society"))
os.makedirs(SAMPLE_DIR, exist_ok=True)

def fetch_ioda():
    print("Fetching Georgia Tech IODA API for country KP...")
    now = int(time.time())
    # 3 days of recent data
    url_recent = f"https://api.ioda.inetintel.cc.gatech.edu/v2/signals/raw/country/KP?from={now - 86400 * 3}&until={now}"
    # Jan 2022 DDoS outage window (2022-01-14 to 2022-01-27)
    url_outage_2022 = "https://api.ioda.inetintel.cc.gatech.edu/v2/signals/raw/country/KP?from=1642118400&until=1643241600"

    headers = {"User-Agent": "free-north-korea-research/1.0"}
    
    req_recent = urllib.request.Request(url_recent, headers=headers)
    with urllib.request.urlopen(req_recent, timeout=15) as res:
        recent_data = json.loads(res.read().decode("utf-8"))

    req_outage = urllib.request.Request(url_outage_2022, headers=headers)
    with urllib.request.urlopen(req_outage, timeout=15) as res:
        outage_data = json.loads(res.read().decode("utf-8"))

    summary = {
        "entity": "KP",
        "entityName": "North Korea",
        "ioda_datasources_detected": [d["datasource"] for d in recent_data.get("data", [[]])[0]],
        "recent_probe": {
            "from_epoch": now - 86400 * 3,
            "until_epoch": now,
            "signals": {}
        },
        "ddos_outage_jan_2022": {
            "from_epoch": 1642118400,
            "until_epoch": 1643241600,
            "signals": {}
        }
    }

    for d in recent_data.get("data", [[]])[0]:
        ds = d.get("datasource")
        vals = [v for v in d.get("values", []) if v is not None]
        numeric_vals = [v for v in vals if isinstance(v, (int, float))]
        summary["recent_probe"]["signals"][ds] = {
            "step_sec": d.get("step"),
            "non_null_samples": len(vals),
            "latest_value": vals[-1] if vals else None,
            "min": min(numeric_vals) if numeric_vals else None,
            "max": max(numeric_vals) if numeric_vals else None
        }

    for d in outage_data.get("data", [[]])[0]:
        ds = d.get("datasource")
        vals = [v for v in d.get("values", []) if v is not None]
        numeric_vals = [v for v in vals if isinstance(v, (int, float))]
        summary["ddos_outage_jan_2022"]["signals"][ds] = {
            "step_sec": d.get("step"),
            "non_null_samples": len(vals),
            "min": min(numeric_vals) if numeric_vals else None,
            "max": max(numeric_vals) if numeric_vals else None
        }

    out_file = os.path.join(SAMPLE_DIR, "ioda_kp_connectivity.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print(f"Saved IODA sample to {out_file}")
    return summary

def fetch_ripestat():
    print("Fetching RIPEstat API for AS131279...")
    base = "https://stat.ripe.net/data"
    headers = {"User-Agent": "free-north-korea-research/1.0"}

    # Routing status
    req1 = urllib.request.Request(f"{base}/routing-status/data.json?resource=AS131279", headers=headers)
    with urllib.request.urlopen(req1, timeout=15) as res:
        status_data = json.loads(res.read().decode("utf-8")).get("data", {})

    # Announced prefixes
    req2 = urllib.request.Request(f"{base}/announced-prefixes/data.json?resource=AS131279", headers=headers)
    with urllib.request.urlopen(req2, timeout=15) as res:
        prefixes_data = json.loads(res.read().decode("utf-8")).get("data", {})

    # ASN neighbours
    req3 = urllib.request.Request(f"{base}/asn-neighbours/data.json?resource=AS131279", headers=headers)
    with urllib.request.urlopen(req3, timeout=15) as res:
        neighbours_data = json.loads(res.read().decode("utf-8")).get("data", {})

    summary = {
        "resource": "AS131279",
        "description": "Star Joint Venture Company, Ryugyong-dong, Pyongyang, DPRK",
        "first_seen": status_data.get("first_seen"),
        "last_seen": status_data.get("last_seen"),
        "visibility": status_data.get("visibility"),
        "announced_prefixes": [p.get("prefix") for p in prefixes_data.get("prefixes", [])],
        "total_ipv4_addresses": len(prefixes_data.get("prefixes", [])) * 256,
        "transit_providers_upstream": neighbours_data.get("neighbours", [])
    }

    out_file = os.path.join(SAMPLE_DIR, "ripestat_as131279.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print(f"Saved RIPEstat sample to {out_file}")
    return summary

if __name__ == "__main__":
    fetch_ioda()
    fetch_ripestat()
