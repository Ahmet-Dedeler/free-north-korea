#!/usr/bin/env python3
"""
Probe script: Fetch and analyze CSIS Beyond Parallel provocations database
via the stiles/north-korea-provocations automated mirror.
"""
import urllib.request
import json
from collections import Counter

URL = "https://raw.githubusercontent.com/stiles/north-korea-provocations/main/data/processed/north_korea_provocations_1958_present.json"

def main():
    print(f"Fetching: {URL}")
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    
    print(f"Total events: {len(data)}")
    types = Counter(x.get("type", "Unknown") for x in data)
    print("\nEvent breakdown by type:")
    for t, cnt in types.most_common():
        print(f"  {t}: {cnt}")
    
    years = Counter(x.get("year", "Unknown") for x in data)
    print("\nEvents in recent years:")
    for yr in sorted(years.keys())[-7:]:
        print(f"  {yr}: {years[yr]} events")
    
    print("\nLatest 3 events recorded:")
    for ev in data[:3]:
        print(f"  [{ev.get('date')}] {ev.get('type')} - {ev.get('event')}")
        print(f"    Desc: {ev.get('description')[:120]}...")
        print(f"    Source: {ev.get('resources')}")

if __name__ == "__main__":
    main()
