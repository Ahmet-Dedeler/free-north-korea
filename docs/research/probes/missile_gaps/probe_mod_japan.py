#!/usr/bin/env python3
"""
Probe Japan Ministry of Defense (防衛省) announcements for North Korean missile launches.
"""
import urllib.request
import re
from bs4 import BeautifulSoup

URL = "https://www.mod.go.jp/j/surround/northKorea/"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}

req = urllib.request.Request(URL, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        print(f"Status: {resp.status}, Length: {len(html)}")
        soup = BeautifulSoup(html, "html.parser")
        print("Page title:", soup.title.string if soup.title else "No title")
        
        # Look for links containing pdf or missile launch information
        links = []
        for a in soup.find_all("a", href=True):
            text = a.get_text(strip=True)
            href = a["href"]
            if any(k in text for k in ["発射", "ミサイル", "弾道", "一覧", "情報"]) or "pdf" in href.lower():
                links.append((text, href))
                
        print(f"Found {len(links)} relevant links:")
        for text, href in links[:25]:
            print(f"  - [{text}] -> {href}")
            
except Exception as e:
    print(f"Error fetching {URL}: {e}")
