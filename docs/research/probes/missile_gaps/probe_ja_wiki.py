#!/usr/bin/env python3
"""
Probe Japanese Wikipedia year-by-year articles for North Korean missile launches.
"""
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import json

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

results = {}

for y in years:
    candidates = [
        f"北朝鮮による飛翔体発射実験_({y}年)",
        f"北朝鮮によるミサイル発射実験_({y}年)",
        f"北朝鮮による飛翔体発射実験_{y}年",
        f"北朝鮮によるミサイル発射実験_{y}年",
    ]
    found = False
    for title in candidates:
        url = "https://ja.wikipedia.org/wiki/" + urllib.parse.quote(title)
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                if r.status == 200:
                    html = r.read().decode("utf-8", errors="ignore")
                    soup = BeautifulSoup(html, "html.parser")
                    tables = soup.find_all("table", class_="wikitable")
                    print(f"Year {y}: Found {title} ({len(tables)} wikitables)")
                    results[y] = {"title": title, "url": url, "table_count": len(tables)}
                    found = True
                    # Let's inspect first wikitable
                    if tables:
                        t = tables[0]
                        rows = t.find_all("tr")
                        headers = [th.get_text(strip=True) for th in rows[0].find_all(["th", "td"])]
                        print(f"  Rows: {len(rows)}, Headers: {headers[:8]}")
                    break
        except Exception as e:
            continue
    if not found:
        print(f"Year {y}: No dedicated article found")

with open("docs/research/probes/missile_gaps/ja_wiki_results.json", "w") as f:
    json.dump(results, f, indent=2)
