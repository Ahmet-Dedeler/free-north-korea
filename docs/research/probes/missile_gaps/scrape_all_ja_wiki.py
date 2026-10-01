#!/usr/bin/env python3
"""
Scrape all North Korean launch events from Japanese Wikipedia yearly articles (2017-2026).
"""
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import re
import json

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read().decode("utf-8", errors="ignore")

years = [2017, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
all_events = []

for y in years:
    candidates = [
        f"北朝鮮による飛翔体発射実験_({y}年)",
        f"北朝鮮によるミサイル発射実験_({y}年)",
    ]
    html = None
    for cand in candidates:
        try:
            url = "https://ja.wikipedia.org/wiki/" + urllib.parse.quote(cand)
            html = fetch(url)
            break
        except Exception:
            continue
    if not html:
        print(f"Failed to fetch JA wiki for {y}")
        continue
    
    soup = BeautifulSoup(html, "html.parser")
    parser_output = soup.find("div", class_="mw-parser-output")
    if not parser_output:
        continue
    
    # In ja.wikipedia, items are in <li> inside <ul> under month sections
    for li in parser_output.find_all("li"):
        text = li.get_text(strip=True)
        # Check if line starts with M月D日 or similar date pattern
        m = re.match(r"^(\d{1,2})月(\d{1,2})日", text)
        if m:
            month, day = int(m.group(1)), int(m.group(2))
            date_str = f"{y}-{month:02d}-{day:02d}"
            # Extract citations if any
            citations = []
            for a in li.find_all("a", href=True):
                if a.get("title") and ("防衛省" in a["title"] or "ニュース" in a["title"]):
                    citations.append({"title": a.get_text(strip=True), "href": a["href"]})
            all_events.append({
                "year": y,
                "date": date_str,
                "raw_text": text,
                "citations": citations
            })

print(f"Total events scraped from JA wiki: {len(all_events)}")
with open("docs/research/probes/missile_gaps/ja_wiki_events.json", "w") as f:
    json.dump(all_events, f, ensure_ascii=False, indent=2)

# Print summary by year
by_year = {}
for e in all_events:
    by_year[e["year"]] = by_year.get(e["year"], 0) + 1
for y, cnt in sorted(by_year.items()):
    print(f"  {y}: {cnt} events")
