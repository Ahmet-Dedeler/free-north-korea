#!/usr/bin/env python3
"""
Probe: US Treasury OFAC Specially Designated Nationals (SDN) DPRK Entries
Official: https://www.treasury.gov/ofac/downloads/sdn.xml
OpenSanctions Mirror: https://data.opensanctions.org/datasets/latest/us_ofac_sdn/targets.nested.json
"""
import urllib.request
import json

def main():
    print("Checking US OFAC SDN official endpoint...")
    req = urllib.request.Request("https://www.treasury.gov/ofac/downloads/sdn.xml", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"Official OFAC Status: {resp.status} OK | Size: {int(resp.headers.get('Content-Length', 0)):,} bytes")

    print("\nFetching DPRK entities from OpenSanctions OFAC mirror...")
    mirror_url = "https://data.opensanctions.org/datasets/latest/us_ofac_sdn/targets.nested.json"
    req_m = urllib.request.Request(mirror_url, headers={"User-Agent": "Mozilla/5.0"})
    dprk_targets = []
    with urllib.request.urlopen(req_m, timeout=20) as resp:
        # Read streaming lines
        for _ in range(5000):
            line = resp.readline()
            if not line:
                break
            target = json.loads(line.decode("utf-8"))
            props = target.get("properties", {})
            countries = props.get("country", [])
            topics = props.get("topics", [])
            sanctions = props.get("sanctions", [])
            # Check DPRK connection
            if "kp" in countries or any("dprk" in str(s).lower() for s in sanctions):
                dprk_targets.append(target)
                if len(dprk_targets) >= 3:
                    break

    print(f"Sample DPRK entries in OFAC mirror:")
    for t in dprk_targets:
        print(f"  - [{t.get('schema')}] {t.get('caption')} | Countries: {t.get('properties', {}).get('country')}")

if __name__ == "__main__":
    main()
