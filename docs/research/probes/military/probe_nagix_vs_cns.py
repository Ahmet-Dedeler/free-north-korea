#!/usr/bin/env python3
"""
Probe script: Compare nagix/nk-missile-tests with recent 2025-2026 launches,
examining data coverage, cadence, and reporting differences.
"""
import urllib.request
import json
import os

def test_nagix_repo():
    print("=== PROBING NAGIX REPO COMMITS ===")
    url = "https://api.github.com/repos/nagix/nk-missile-tests/commits?per_page=10"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            commits = json.loads(resp.read().decode())
            print(f"Fetched {len(commits)} recent commits:")
            for c in commits[:5]:
                dt = c["commit"]["committer"]["date"]
                msg = c["commit"]["message"].splitlines()[0]
                print(f"  [{dt}] {msg}")
    except Exception as e:
        print(f"Error fetching nagix commits: {e}")

def inspect_local_missile_data():
    local_path = "public/data/test.en.json"
    if not os.path.exists(local_path):
        print(f"{local_path} not found")
        return
    with open(local_path) as f:
        d = json.load(f)
    tb = d.get("timeBins", [])
    print(f"\n=== LOCAL DATA SUMMARY: {len(tb)} years ===")
    total = 0
    by_year = {}
    for b in tb:
        yr = b["year"]
        cnt = len(b.get("data", []))
        total += cnt
        by_year[yr] = cnt
    print(f"Total recorded missile launches: {total}")
    print("Recent years count:")
    for yr in sorted(by_year.keys())[-7:]:
        print(f"  {yr}: {by_year[yr]} tests")

if __name__ == "__main__":
    test_nagix_repo()
    inspect_local_missile_data()
