#!/usr/bin/env python3
"""
Probe Japanese abductee datasets:
1. Specific Missing Persons Investigation Commission (特定失踪者問題調査会 - Soseikai / chosa-kai.jp):
   - Investigates ~470+ Japanese citizens suspected of being abducted to North Korea (特定失踪者)
   - Detailed records including disappearance date, place (prefecture, city/coastline), age, photo, circumstances.
2. Cabinet Secretariat Headquarters for the Abduction Issue (内閣官房 拉致問題対策本部 - rachi.go.jp):
   - Official 17 government-recognized abductees (政府認定拉致被害者)
   - 12 major abduction incident cases with dates, coastal locations, perpetrator identities
3. National Police Agency (警察庁 - npa.go.jp):
   - 拉致容疑事案 (Criminal abduction cases) and DPRK agents wanted internationally by ICPO.
"""
import urllib.request
import urllib.parse
import json
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def probe_abductees():
    targets = [
        ("https://www.chosa-kai.jp/", "Soseikai Homepage"),
        ("https://www.chosa-kai.jp/archives/missing_persons", "Soseikai Missing Persons Archive"),
        ("https://www.rachi.go.jp/", "Cabinet Secretariat Rachi Main"),
        ("https://www.rachi.go.jp/jp/ratimondai/higaisya.html", "Rachi Abductees List"),
        ("https://www.rachi.go.jp/jp/ratimondai/jian.html", "Rachi Incidents List"),
        ("https://www.npa.go.jp/bureau/security/keibi1/abduct/suspect.html", "NPA Abduction Suspects")
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
                results[label] = {
                    "url": url,
                    "status": code,
                    "length": len(body),
                    "title": title
                }
        except Exception as e:
            print(f"[ERR] {label} -> {url}: {e}")
            results[label] = {"url": url, "error": str(e)}

    with open("docs/research/probes/korean_japanese/abductees_probe_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    probe_abductees()
