#!/usr/bin/env python3
"""
Probe CSIS Missile Threat database for DPRK launches.
"""
import urllib.request
import re
from bs4 import BeautifulSoup
import json

URL = "https://missilethreat.csis.org/north-korea-missile-launches-1984-present/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

req = urllib.request.Request(URL, headers=HEADERS)
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        print(f"CSIS Status: {resp.status}, Length: {len(html)}")
        
        # Look for table data, API URLs, or data endpoints
        endpoints = re.findall(r'https?://[^\s"\']+(?:\.csv|\.json|api[^\s"\']*)', html)
        print("Data endpoints found:", set(endpoints))
        
        soup = BeautifulSoup(html, "html.parser")
        tables = soup.find_all("table")
        print(f"Found {len(tables)} tables")
        for i, t in enumerate(tables):
            rows = t.find_all("tr")
            print(f"  Table {i}: {len(rows)} rows")
            if rows:
                headers = [th.get_text(strip=True) for th in rows[0].find_all(["th", "td"])]
                print(f"    Headers: {headers}")
                if len(rows) > 1:
                    print(f"    Sample row 1: {[td.get_text(strip=True) for td in rows[1].find_all(['td', 'th'])]}")

except Exception as e:
    print(f"Error fetching {URL}: {e}")
