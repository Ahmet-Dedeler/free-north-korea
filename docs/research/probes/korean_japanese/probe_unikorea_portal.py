#!/usr/bin/env python3
"""
Probe Ministry of Unification North Korea Information Portal (nkinfo.unikorea.go.kr)
and Unification Ministry main portal (unikorea.go.kr).
Tests endpoints for:
- Regional information (북한지역정보 / 행정구역)
- Key figures (인물정보)
- Defector statistics (북한이탈주민 통계)
- North Korea Terminology Dictionary (북한용어사전)
"""
import urllib.request
import urllib.parse
import json
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def probe_url(url, desc=""):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            code = resp.getcode()
            headers = dict(resp.info())
            body = resp.read()
            text = body.decode('utf-8', errors='replace')
            print(f"[{code}] {desc} ({len(body)} bytes) -> {url}")
            return {"status": code, "length": len(body), "headers": headers, "text": text}
    except Exception as e:
        print(f"[ERR] {desc} -> {url}: {e}")
        return {"status": "error", "error": str(e)}

def test_nkinfo():
    endpoints = [
        # Regional info: 행정구역
        ("https://nkinfo.unikorea.go.kr/nkp/overview/nkOverview.do", "NK Info Overview"),
        ("https://nkinfo.unikorea.go.kr/nkp/theme/getAreaOverView.do", "NK Info Area Overview"),
        ("https://nkinfo.unikorea.go.kr/nkp/theme/viewArea.do", "NK Info View Area"),
        # Figures: 북한인물정보
        ("https://nkinfo.unikorea.go.kr/nkp/theme/nkFigure.do", "NK Info Figures"),
        # Terminology: 북한용어사전
        ("https://nkinfo.unikorea.go.kr/nkp/term/wordList.do", "NK Info Terminology"),
        # Defector statistics on Unikorea
        ("https://www.unikorea.go.kr/unikorea/business/NKDefectorsPolicy/status/status/", "Unikorea Defector Status"),
        # Human rights report
        ("https://www.unikorea.go.kr/unikorea/business/NKHumanRights/report/", "Unikorea Human Rights Reports")
    ]
    
    results = {}
    for url, desc in endpoints:
        res = probe_url(url, desc)
        results[desc] = {
            "url": url,
            "status": res["status"],
            "length": res.get("length", 0)
        }
        if res.get("text"):
            # Sample snippet or title
            title_m = re.search(r'<title>([^<]+)</title>', res["text"], re.I)
            title = title_m.group(1).strip() if title_m else ""
            results[desc]["title"] = title
            print(f"    Page title: {title}")
            
    with open("docs/research/probes/korean_japanese/unikorea_probe_summary.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    test_nkinfo()
