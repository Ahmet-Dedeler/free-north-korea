#!/usr/bin/env python3
"""
Probe: RUSI / Korea Risk Group DPRK Reports Sanctions-Evasion Database
Endpoint: https://dprk-reports.org/api
OpenAPI: https://dprk-reports.org/.well-known/openapi.json
"""
import urllib.request
import json

def main():
    stats_url = "https://dprk-reports.org/api/stats"
    print(f"Fetching database stats: {stats_url}")
    req = urllib.request.Request(stats_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        stats = json.loads(resp.read().decode("utf-8"))
        print(f"Total Entities: {stats.get('totalEntities'):,}")
        print(f"Total Edges: {stats.get('totalEdges'):,}")
        print(f"Entity breakdown: {stats.get('bySchema')}")

    search_url = "https://dprk-reports.org/api/search?type=Vessel&limit=3"
    print(f"\nSearching vessels: {search_url}")
    with urllib.request.urlopen(urllib.request.Request(search_url, headers={"User-Agent": "Mozilla/5.0"})) as resp:
        results = json.loads(resp.read().decode("utf-8"))
        print(f"Total Vessels in Database: {results.get('total')}")
        for v in results.get("results", []):
            p = v.get("properties", {})
            print(f"  - Vessel: {p.get('name', ['?'])[0]} | IMO: {p.get('imoNumber', ['?'])[0]} | Flag: {p.get('flag', ['?'])[0]} | Sanctioned: {v.get('sanctioned')}")

if __name__ == "__main__":
    main()
