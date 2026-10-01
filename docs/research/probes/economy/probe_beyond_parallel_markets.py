#!/usr/bin/env python3
"""
Probe: CSIS Beyond Parallel 436 Markets Dataset
Source: Carto SQL API used by Beyond Parallel interactive market map
Endpoint: https://csis.carto.com/api/v2/sql
"""
import urllib.request
import urllib.parse
import json

API_KEY = "xb32vxt3qQmJKxxxze77nw"
BASE_URL = "https://csis.carto.com/api/v2/sql"

def main():
    # 1. Count total markets
    q_count = "SELECT count(*) FROM dprkmarkets_by_geocoordinates"
    url_count = f"{BASE_URL}?q={urllib.parse.quote(q_count)}&api_key={API_KEY}"
    req = urllib.request.Request(url_count, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        total = res["rows"][0]["count"]
        print(f"[Beyond Parallel] Total markets in DB: {total}")

    # 2. Count geocoded markets
    q_geo = "SELECT count(*) FROM dprkmarkets_by_geocoordinates WHERE the_geom IS NOT NULL"
    url_geo = f"{BASE_URL}?q={urllib.parse.quote(q_geo)}&api_key={API_KEY}"
    with urllib.request.urlopen(urllib.request.Request(url_geo, headers={"User-Agent": "Mozilla/5.0"})) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        geocoded = res["rows"][0]["count"]
        print(f"[Beyond Parallel] Markets with exact coordinates: {geocoded}")

    # 3. Sample market records
    q_sample = "SELECT cartodb_id, name, latitude, longitude, area_m2_, no_of_stalls, estimated_revenue_usd FROM dprkmarkets_by_geocoordinates WHERE the_geom IS NOT NULL LIMIT 3"
    url_sample = f"{BASE_URL}?q={urllib.parse.quote(q_sample)}&api_key={API_KEY}"
    with urllib.request.urlopen(urllib.request.Request(url_sample, headers={"User-Agent": "Mozilla/5.0"})) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print("[Beyond Parallel] Sample market records:")
        for r in res["rows"]:
            print(f"  - ID {r['cartodb_id']}: {r['name']} @ ({r['latitude']}, {r['longitude']}) | Area: {r['area_m2_']} m2 | Stalls: {r['no_of_stalls']} | Est Rev: ${r['estimated_revenue_usd']}")

if __name__ == "__main__":
    main()
