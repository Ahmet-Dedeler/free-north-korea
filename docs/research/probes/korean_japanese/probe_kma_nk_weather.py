#!/usr/bin/env python3
"""
Probe Korea Meteorological Administration (기상청 KMA - weather.go.kr and data.kma.go.kr):
- KMA operates official daily/monthly monitoring for 27 World Meteorological Organization (WMO)
  surface weather stations across North Korea.
- Tests weather.go.kr North Korea weather page and data endpoints.
"""
import urllib.request
import urllib.parse
import json
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def probe_kma():
    targets = [
        ("https://www.weather.go.kr/w/wnk/n-korea.do", "KMA North Korea Main Weather"),
        ("https://www.weather.go.kr/w/wnk/n-korea-map.do", "KMA North Korea Weather Map"),
        ("https://data.kma.go.kr/data/grd/selectGrdRltmList.do?pgmNo=161", "KMA Open Data Portal NK Grd"),
        ("https://www.weather.go.kr/weather/special/special_northkorea_01.jsp", "KMA NK Special Old")
    ]
    results = {}
    for url, label in targets:
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                code = resp.getcode()
                body = resp.read()
                text = body.decode('utf-8', errors='replace')
                title_m = re.search(r'<title>([^<]+)</title>', text, re.I)
                title = title_m.group(1).strip() if title_m else ""
                print(f"[{code}] {label} ({len(body)} bytes) - Title: {title}")
                
                # Check for station names or weather values
                stations = re.findall(r'(평양|신의주|함흥|청진|원산|강계|혜산|삼지연|개성|해주)', text)
                print(f"   Station mentions count: {len(stations)}")
                
                results[label] = {
                    "url": url,
                    "status": code,
                    "length": len(body),
                    "title": title,
                    "stations_count": len(stations)
                }
        except Exception as e:
            print(f"[ERR] {label} -> {url}: {e}")
            results[label] = {"url": url, "error": str(e)}

    with open("docs/research/probes/korean_japanese/kma_probe_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    probe_kma()
