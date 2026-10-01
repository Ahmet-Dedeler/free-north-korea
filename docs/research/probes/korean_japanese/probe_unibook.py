#!/usr/bin/env python3
"""
Probe National Library of Korea Information Center on North Korea
(국립중앙도서관 북한자료센터 unibook.or.kr):
- 110,000+ North Korean primary publications, textbooks, maps, propaganda, laws, periodicals
- Check search API / catalog endpoints (Rodong Sinmun 로동신문, Minju Choson 민주조선, Kulloja 근로자)
"""
import urllib.request
import urllib.parse
import json
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def probe_unibook():
    urls = [
        ("https://unibook.unikorea.go.kr/", "Unibook Main"),
        ("https://unibook.unikorea.go.kr/lib/search/searchList.do", "Unibook Search List"),
        ("https://unibook.unikorea.go.kr/lib/board/boardList.do", "Unibook Board List"),
        ("https://unibook.unikorea.go.kr/lib/periodical/periodicalList.do", "Unibook Periodical List")
    ]
    results = {}
    for url, label in urls:
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                code = resp.getcode()
                body = resp.read()
                text = body.decode('utf-8', errors='replace')
                title_m = re.search(r'<title>([^<]+)</title>', text, re.I)
                title = title_m.group(1).strip() if title_m else ""
                print(f"[{code}] {label} ({len(body)} bytes) - Title: {title}")
                results[label] = {
                    "url": url,
                    "status": code,
                    "length": len(body),
                    "title": title
                }
        except Exception as e:
            print(f"[ERR] {label} -> {url}: {e}")
            results[label] = {"url": url, "error": str(e)}

    with open("docs/research/probes/korean_japanese/unibook_probe_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    probe_unibook()
