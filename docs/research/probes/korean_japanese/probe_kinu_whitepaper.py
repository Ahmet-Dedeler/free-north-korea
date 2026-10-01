#!/usr/bin/env python3
"""
Probe KINU (Korea Institute for National Unification - 통일연구원) and
Center for North Korean Human Rights Records (북한인권기록센터):
- Annual White Paper on Human Rights in North Korea (북한인권백서, published since 1996)
- Defector testimony database, statistical annexes on penal facilities and executions
- Ministry of Unification North Korea Human Rights Report (북한인권보고서 2023, 2024, 2025)
"""
import urllib.request
import urllib.parse
import json
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def probe_kinu():
    targets = [
        ("https://www.kinu.or.kr/", "KINU Main"),
        ("https://www.kinu.or.kr/www/jsp/prg/reportList.jsp?category=01", "KINU Reports Category 01"),
        ("https://www.kinu.or.kr/kor/module/report/list.do", "KINU Report List DO"),
        ("https://www.kinu.or.kr/kor/index.do", "KINU Kor Index")
    ]
    results = {}
    for url, label in targets:
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                code = resp.getcode()
                body = resp.read()
                text = body.decode('utf-8', errors='replace')
                title_m = re.search(r'<title>([^<]+)</title>', text, re.I)
                title = title_m.group(1).strip() if title_m else ""
                print(f"[{code}] {label} ({len(body)} bytes) - Title: {title}")
                
                # Check for white paper links
                links = re.findall(r'href=[\"\']([^\"\']+)[\"\']', text)
                wp_links = [l for l in links if any(k in l for k in ['white', 'paper', 'report', 'hr', 'human', 'attach', 'file'])]
                results[label] = {
                    "url": url,
                    "status": code,
                    "length": len(body),
                    "title": title,
                    "wp_links": wp_links[:10]
                }
        except Exception as e:
            print(f"[ERR] {label} -> {url}: {e}")
            results[label] = {"url": url, "error": str(e)}

    with open("docs/research/probes/korean_japanese/kinu_probe_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    probe_kinu()
