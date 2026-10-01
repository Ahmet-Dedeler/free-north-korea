#!/usr/bin/env python3
"""
Probe Asia Press (アジアプレス / Rimjin-gang 림진강) for North Korea undercover market price datasets
and inside-DPRK reporting:
- Rice, corn, pork prices (Hyesan, Pyongsong, Chongjin, Musan)
- Foreign currency black market exchange rates (USD/KPW, CNY/KPW)
- Fuel prices (gasoline, diesel)
- Food ration distribution and famine alerts
"""
import urllib.request
import urllib.parse
import json
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def probe_asiapress():
    urls = [
        ("https://www.asiapress.org/korean/", "Asia Press Korean Main"),
        ("https://www.asiapress.org/korean/market-price/", "Asia Press Market Price Korean"),
        ("https://www.asiapress.org/apn/dprk/", "Asia Press Japanese DPRK Main"),
        ("https://www.asiapress.org/apn/dprk/market-price/", "Asia Press Market Price Japanese"),
        ("https://www.asiapress.org/korean/category/nk-economy/", "Asia Press NK Economy"),
        ("https://www.asiapress.org/korean/feed/", "Asia Press Korean RSS Feed")
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
                
                # Check for table or price indicators
                has_tables = "<table" in text
                price_mentions = len(re.findall(r'(쌀|옥수수|환율|휘발유|디젤|米|トウモロコシ|為替|ウォン)', text))
                
                results[label] = {
                    "url": url,
                    "status": code,
                    "length": len(body),
                    "title": title,
                    "has_tables": has_tables,
                    "price_terms_count": price_mentions
                }
        except Exception as e:
            print(f"[ERR] {label} -> {url}: {e}")
            results[label] = {"url": url, "error": str(e)}

    with open("docs/research/probes/korean_japanese/asiapress_probe_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    probe_asiapress()
