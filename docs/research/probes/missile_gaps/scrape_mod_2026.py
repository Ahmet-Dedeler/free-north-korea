#!/usr/bin/env python3
"""
Scrape all 2026 Japan MoD press releases for North Korean missile launches.
Extract: release date, time, launch count, missile type, apogee, flight distance, landing location, EEZ relation.
"""
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import re
import json

BASE_URL = "https://www.mod.go.jp"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read().decode("utf-8", errors="ignore")

# Find all news releases on surround page
html = fetch(f"{BASE_URL}/j/surround/northKorea/")
soup = BeautifulSoup(html, "html.parser")

links = []
for a in soup.find_all("a", href=True):
    href = a["href"]
    if "press/news/2026" in href:
        full_url = urllib.parse.urljoin(f"{BASE_URL}/j/surround/northKorea/", href)
        title = a.get_text(strip=True)
        links.append((title, full_url))

print(f"Found {len(links)} 2026 press release links on MoD surround page.")

results = []
for title, url in links:
    # Only scrape 続報 (follow-up) or お知らせ when no follow-up
    # Actually scrape all to see details
    try:
        page_html = fetch(url)
        psoup = BeautifulSoup(page_html, "html.parser")
        main = psoup.find("div", id="main") or psoup.find("body")
        text = main.get_text() if main else ""
        
        # Clean text
        clean_text = " ".join([l.strip() for l in text.splitlines() if l.strip()])
        
        # Extract patterns
        # Date & time: e.g. ９月２０日 ... １７時５４分頃
        # Distance: 約(\d+)km or 約([０-９]+)ｋｍ
        # Apogee: 最高高度約([０-９]+)ｋｍ or 最高高度約(\d+)km
        
        results.append({
            "title": title,
            "url": url,
            "text": clean_text[:600]
        })
    except Exception as e:
        print(f"Error fetching {url}: {e}")

with open("docs/research/probes/missile_gaps/mod_2026_scraped.json", "w") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Successfully saved {len(results)} releases to mod_2026_scraped.json")
