#!/usr/bin/env python3
"""
Probe Japanese Ministry of Defense (MOD 防衛省) and Coast Guard (海上保安庁):
1. Japan MOD: 北朝鮮のミサイル等関連情報 (North Korea missile launch announcements)
   - Every single launch event has a press release detailing exact launch time, county/airbase in DPRK, apogee, flight distance, and splash zone coordinates/bearing from Japan.
2. Japan Coast Guard: 北朝鮮からと思われる木造船等の漂流・漂着状況 (Wooden boat arrivals / ghost ships)
   - Sea of Japan coast drift incidents, boat counts, bodies recovered by year and prefecture (Hokkaido, Aomori, Akita, Yamagata, Niigata, Ishikawa, Fukui, Kyoto, Tottori, Shimane, Yamaguchi).
"""
import urllib.request
import urllib.parse
import json
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def probe_defense():
    targets = [
        ("https://www.mod.go.jp/j/press/news/index.html", "MOD Press Releases Index"),
        ("https://www.mod.go.jp/j/approach/surround/northkorea/index.html", "MOD North Korea Portal"),
        ("https://www.kaiho.mlit.go.jp/", "Coast Guard Main"),
        ("https://www.kaiho.mlit.go.jp/doc/press.html", "Coast Guard Press")
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
                
                # Check for missile or wooden boat links
                links = re.findall(r'href=[\"\']([^\"\']+)[\"\']', text)
                nk_links = [l for l in links if any(k in l for k in ['northkorea', 'missile', 'danmitsu', 'mokuzousen', 'hyouryu'])]
                print(f"   Matched {len(nk_links)} DPRK links")
                for nl in list(dict.fromkeys(nk_links))[:5]:
                    print(f"     - {nl}")
                    
                results[label] = {
                    "url": url,
                    "status": code,
                    "length": len(body),
                    "title": title,
                    "nk_links": nk_links[:10]
                }
        except Exception as e:
            print(f"[ERR] {label} -> {url}: {e}")
            results[label] = {"url": url, "error": str(e)}

    with open("docs/research/probes/korean_japanese/japan_defense_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    probe_defense()
