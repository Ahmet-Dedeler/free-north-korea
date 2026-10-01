#!/usr/bin/env python3
import urllib.request
import re
from bs4 import BeautifulSoup

bases = [
    ("Sinpung-dong", "https://beyondparallel.csis.org/undeclared-north-korea-sinpung-dong-missile-operating-base/"),
    ("Yongnim", "https://beyondparallel.csis.org/undeclared-north-korea-the-yongnim-missile-operating-base/"),
    ("Hoejung-ni", "https://beyondparallel.csis.org/undeclared-north-korea-hoejung-ni-missile-operating-base/"),
    ("Yusang-ni", "https://beyondparallel.csis.org/undeclared-north-korea-the-yusang-ni-missile-operating-base/"),
    ("Kal-gol", "https://beyondparallel.csis.org/undeclared-north-korea-the-kal-gol-missile-operating-base/"),
    ("Kumchon-ni", "https://beyondparallel.csis.org/undeclared-north-korea-the-kumchon-ni-missile-operating-base/"),
    ("Sangnam-ni", "https://beyondparallel.csis.org/undeclared-north-korea-sangnam-ni-missile-operating-base/"),
    ("Sino-ri", "https://beyondparallel.csis.org/undeclared-north-korea-the-sino-ri-missile-operating-base-and-strategic-force-facilities/"),
    ("Sakkanmol", "https://beyondparallel.csis.org/undeclared-north-korea-sakkanmol-missile-operating-base/"),
    ("Yeongjeo-dong", "https://beyondparallel.csis.org/undeclared-north-korea-the-yeongjeo-dong-missile-operating-base-and-the-hoe-jung-ni-missile-base/")
]

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}

for name, url in bases:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            text = resp.read().decode('utf-8', errors='replace')
            soup = BeautifulSoup(text, 'html.parser')
            # Look for coordinates pattern like XX° XX' XX" N, or decimal degrees, or "coordinates"
            body_text = soup.get_text()
            coords = re.findall(r'(\d{1,2}°\s*\d{1,2}[\'′]\s*(?:\d{1,2}(?:\.\d+)?[\"″])?\s*[NS][,\s]+\d{1,3}°\s*\d{1,2}[\'′]\s*(?:\d{1,2}(?:\.\d+)?[\"″])?\s*[EW])', body_text)
            if not coords:
                coords = re.findall(r'(\d{2}\.\d{3,7}°?\s*[NS][,\s]+\d{2,3}\.\d{3,7}°?\s*[EW])', body_text)
            print(f"[{name}] {url}")
            print(f"  Coords found: {coords[:3]}")
    except Exception as e:
        print(f"[{name}] Error: {e}")
