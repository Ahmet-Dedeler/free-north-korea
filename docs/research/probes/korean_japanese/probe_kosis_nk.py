#!/usr/bin/env python3
"""
Probe KOSIS (kosis.kr/bukhan/) - Statistics Korea's North Korea Statistics Portal.
Tests the portal endpoints, navigation tree, and data categories:
- 인구 (Population: census 1993, 2008, 2014, annual estimates)
- 행정구역 (Administrative districts)
- 농림어업 (Agriculture/Fisheries: crop production, fertilizer)
- 광공업 (Mining/Manufacturing: coal, iron ore, cement, electricity)
- 보건·사회보장 (Health/Social security: mortality, birth rate, life expectancy)
- 국민계정 (National accounts: Bank of Korea NK GNI, GDP growth rate)
- 무역 (Trade: KOTRA NK exports/imports by partner and HS code)
"""
import urllib.request
import urllib.parse
import json
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def probe_kosis():
    urls = [
        ("https://kosis.kr/bukhan/", "KOSIS Bukhan Main"),
        ("https://kosis.kr/bukhan/bukhanGeneral/bukhanGeneralList.do", "KOSIS Bukhan General List"),
        ("https://kosis.kr/bukhan/statisticsList/statisticsListIndex.do", "KOSIS Statistics List Index"),
        ("https://kosis.kr/openapi/statisticsData.do", "KOSIS OpenAPI Endpoint")
    ]
    results = {}
    for url, label in urls:
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                code = resp.getcode()
                body = resp.read()
                text = body.decode('utf-8', errors='replace')
                print(f"[{code}] {label}: {len(body)} bytes")
                results[label] = {
                    "url": url,
                    "status": code,
                    "length": len(body),
                    "title": re.search(r'<title>([^<]+)</title>', text, re.I).group(1).strip() if re.search(r'<title>([^<]+)</title>', text, re.I) else ""
                }
        except Exception as e:
            print(f"[ERR] {label}: {e}")
            results[label] = {"url": url, "error": str(e)}

    with open("docs/research/probes/korean_japanese/kosis_probe_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    probe_kosis()
