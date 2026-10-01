#!/usr/bin/env python3
"""
Probe: UN Comtrade Public Preview API
Endpoint: https://comtradeapi.un.org/public/v1/preview/C/A/HS
Focus: Reporter 156 (China), Partner 408 (DPRK)
"""
import urllib.request
import json

def main():
    url = "https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=156&period=2023&partnerCode=408"
    print(f"Fetching UN Comtrade: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        rows = data.get("data", [])
        print(f"Retrieved {len(rows)} annual commodity flow records.")
        # Print top 3 export records by value
        exports = [r for r in rows if r.get("flowCode") == "X"]
        exports_sorted = sorted(exports, key=lambda x: x.get("primaryValue", 0), reverse=True)
        print("Top 3 China exports to DPRK (2023):")
        for r in exports_sorted[:3]:
            print(f"  - HS Chapter {r.get('cmdCode')}: ${r.get('primaryValue'):,.0f} USD (Weight: {r.get('netWgt')} kg)")

if __name__ == "__main__":
    main()
