#!/usr/bin/env python3
"""
Probe US INDOPACOM press releases for DPRK missile launches.
"""
import urllib.request
import re
from bs4 import BeautifulSoup
import json

URL = "https://www.pacom.mil/Media/News/"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

try:
    req = urllib.request.Request(URL, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        soup = BeautifulSoup(r.read().decode("utf-8", errors="ignore"), "html.parser")
        items = []
        for a in soup.find_all("a", href=True):
            text = a.get_text(strip=True)
            if "DPRK" in text or "Missile" in text or "Ballistic" in text:
                items.append({"title": text, "url": a["href"]})
        print(f"Found {len(items)} DPRK/missile items on INDOPACOM:")
        for item in items[:10]:
            print(f"  {item['title']} -> {item['url']}")
except Exception as e:
    print("Error:", e)
