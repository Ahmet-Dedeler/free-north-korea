#!/usr/bin/env python3
"""
Probe: Geofabrik Daily North Korea OpenStreetMap Extract
Page: https://download.geofabrik.de/asia/north-korea.html
"""
import urllib.request
from bs4 import BeautifulSoup

def main():
    url = "https://download.geofabrik.de/asia/north-korea.html"
    print(f"Fetching Geofabrik page: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        soup = BeautifulSoup(resp.read(), "html.parser")
        print(f"Title: {soup.title.string.strip() if soup.title else 'N/A'}")
        
        links = soup.find_all("a", href=True)
        print("\nAvailable DPRK OSM Downloads:")
        for l in links:
            href = l["href"]
            if any(href.endswith(ext) for ext in [".osm.pbf", ".shp.zip", ".osm.bz2"]):
                full_url = urllib.parse.urljoin(url, href)
                print(f"  - {l.get_text().strip()}: {full_url}")

if __name__ == "__main__":
    import urllib.parse
    main()
