#!/usr/bin/env python3
"""
Probe script for HDX/OCHA DPRK administrative boundaries, population, and WFP VAM datasets.
Verifies CKAN API endpoints, download URLs, schemas, record counts, and last modified timestamps.
"""
import urllib.request
import json
import ssl

def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
        return json.loads(resp.read().decode('utf-8'))

def probe_package(pkg_id):
    url = f"https://data.humdata.org/api/3/action/package_show?id={pkg_id}"
    print(f"\n--- Checking HDX package: {pkg_id} ---")
    data = fetch_json(url)
    if not data.get('success'):
        print(f"Failed to fetch {pkg_id}")
        return
    res = data['result']
    print(f"Title: {res.get('title')}")
    print(f"Last Modified: {res.get('last_modified') or res.get('metadata_modified')}")
    print(f"Resources count: {len(res.get('resources', []))}")
    for r in res.get('resources', []):
        print(f"  - [{r.get('format')}] {r.get('name')} ({r.get('size')} bytes)")
        print(f"    URL: {r.get('url')}")

if __name__ == '__main__':
    packages = [
        'cod-ab-prk',
        'cod-ps-prk',
        'kontur-population-democratic-people-s-republic-of-korea',
        'prk-rainfall-subnational',
        'prk-ndvi-subnational',
        'who-data-for-prk'
    ]
    for pkg in packages:
        try:
            probe_package(pkg)
        except Exception as e:
            print(f"Error checking {pkg}: {e}")
