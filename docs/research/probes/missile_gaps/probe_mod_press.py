#!/usr/bin/env python3
"""
Scrape and parse Japan Ministry of Defense press releases for DPRK missile launches.
"""
import urllib.request
import re
from bs4 import BeautifulSoup
import json

BASE_URL = "https://www.mod.go.jp"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read().decode("utf-8", errors="ignore")

# Check surround page links
surround_html = fetch(f"{BASE_URL}/j/surround/northKorea/")
soup = BeautifulSoup(surround_html, "html.parser")

releases = []
for a in soup.find_all("a", href=True):
    text = a.get_text(strip=True)
    href = a["href"]
    if "press/news" in href:
        full_url = urllib.parse.urljoin(f"{BASE_URL}/j/surround/northKorea/", href)
        releases.append((text, full_url))

print(f"Found {len(releases)} direct press releases on surround page:")
for title, url in releases:
    print(f"  {title}: {url}")
    # Fetch first couple to see structure
    try:
        content = fetch(url)
        c_soup = BeautifulSoup(content, "html.parser")
        main = c_soup.find("div", id="main") or c_soup.find("body")
        text_content = main.get_text() if main else ""
        lines = [l.strip() for l in text_content.splitlines() if l.strip()][:15]
        print("    Preview:", " // ".join(lines[:5]))
    except Exception as e:
        print("    Error:", e)
