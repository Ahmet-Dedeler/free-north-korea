#!/usr/bin/env python3
"""
Probe Yonhap News North Korea section.
"""
import urllib.request
from bs4 import BeautifulSoup
import json

URL = "https://en.yna.co.kr/nk/index"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

req = urllib.request.Request(URL, headers=HEADERS)
with urllib.request.urlopen(req, timeout=15) as r:
    soup = BeautifulSoup(r.read().decode("utf-8", errors="ignore"), "html.parser")
    articles = []
    for a in soup.find_all("a", href=True):
        if "/view/" in a["href"]:
            title = a.get_text(strip=True)
            if title and len(title) > 10:
                articles.append({"title": title, "url": a["href"]})
    print(f"Found {len(articles)} articles on {URL}:")
    for art in articles[:15]:
        print(f"  {art['title']} -> {art['url']}")
