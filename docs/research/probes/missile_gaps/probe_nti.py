#!/usr/bin/env python3
"""
Probe NTI / CNS North Korea Missile Test Database page and download the excel file if available.
"""
import urllib.request
import re
from bs4 import BeautifulSoup

URL = "https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

req = urllib.request.Request(URL, headers=HEADERS)
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        print(f"NTI Status: {resp.status}, Length: {len(html)}")
        soup = BeautifulSoup(html, "html.parser")
        print("Title:", soup.title.string if soup.title else "No title")
        
        # Look for xlsx or download links
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if any(ext in href.lower() for ext in [".xlsx", ".xls", ".csv", "download"]):
                print("  Download link:", a.get_text(strip=True), "->", href)
except Exception as e:
    print("Error:", e)
