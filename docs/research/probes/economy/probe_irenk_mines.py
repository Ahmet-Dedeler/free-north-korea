#!/usr/bin/env python3
"""
Probe: I-RENK (북한지하자원넷) North Korean Mines Database
Endpoint: https://irenk.sonosa.or.kr/index.html?menuno=71
Publisher: 남북교류협력지원협회 (SONOSA) & 한국광해광업공단 (KOMIR)
"""
import urllib.request
from bs4 import BeautifulSoup

def main():
    url = "https://irenk.sonosa.or.kr/index.html?menuno=71"
    print(f"Fetching I-RENK mine database: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        soup = BeautifulSoup(resp.read(), "html.parser")
        tables = soup.find_all("table")
        if len(tables) >= 3:
            summary_row = [c.get_text().strip() for c in tables[1].find_all("tr")[1].find_all("td")]
            print(f"Mine Totals: Total {summary_row[0]} (Metallic: {summary_row[1]}, Non-metallic: {summary_row[2]}, Coal: {summary_row[3]})")

            rows = tables[2].find_all("tr")
            print(f"Total Mines Listed: {len(rows)-1}")
            print("\nSample Mine Records:")
            for r in rows[1:6]:
                cols = [c.get_text().strip() for c in r.find_all(["td", "th"])]
                print(f"  - {cols[0]} ({cols[1] if cols[1] else 'No alias'}) | Location: {cols[2]} | Primary: {cols[3]} | Sub: {cols[4]} | Secondary: {cols[5]}")

if __name__ == "__main__":
    main()
