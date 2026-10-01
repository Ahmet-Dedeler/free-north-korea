#!/usr/bin/env python3
"""
Probe and extract North Korean missile tests from English, Korean, and Japanese Wikipedia.
"""
import urllib.request
import re
from bs4 import BeautifulSoup
import json

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", errors="ignore")

def probe_en_wikipedia():
    url = "https://en.wikipedia.org/wiki/List_of_North_Korean_missile_tests"
    print(f"Fetching English Wikipedia: {url}")
    html = fetch(url)
    soup = BeautifulSoup(html, "html.parser")
    tables = soup.find_all("table", class_="wikitable")
    print(f"Found {len(tables)} wikitables on EN Wikipedia")
    
    results = []
    for i, t in enumerate(tables):
        headers = [th.get_text(strip=True) for th in t.find_all("th")]
        # look for tables containing Date, Missile, Outcome/Result
        header_str = " | ".join(headers).lower()
        if "date" in header_str and ("missile" in header_str or "type" in header_str):
            rows = t.find_all("tr")[1:]
            print(f"  Table {i} has {len(rows)} rows. Headers: {headers[:6]}")
            # parse rows
            for tr in rows:
                tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                if len(tds) >= 4:
                    results.append({"table": i, "data": tds})
    return {"count": len(results), "rows": results}

def probe_ja_wikipedia():
    url = "https://ja.wikipedia.org/wiki/%E5%8C%97%E6%9C%9D%E9%AE%AE%E3%81%AE%E3%83%9F%E3%82%95%E3%82%A4%E3%83%AB%E7%99%BA%E8%88%84%E3%81%AE%E4%B8%80%E8%A6%A7"
    print(f"Fetching Japanese Wikipedia: {url}")
    try:
        html = fetch(url)
        soup = BeautifulSoup(html, "html.parser")
        tables = soup.find_all("table", class_="wikitable")
        print(f"Found {len(tables)} wikitables on JA Wikipedia")
        results = []
        for i, t in enumerate(tables):
            headers = [th.get_text(strip=True) for th in t.find_all("th")]
            header_str = " | ".join(headers)
            if any(k in header_str for k in ["発射日時", "ミサイル", "日付", "結果"]):
                rows = t.find_all("tr")[1:]
                print(f"  JA Table {i} has {len(rows)} rows. Headers: {headers[:6]}")
                for tr in rows:
                    tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                    if len(tds) >= 3:
                        results.append({"table": i, "data": tds})
        return {"count": len(results), "rows": results}
    except Exception as e:
        print(f"Error fetching JA wiki: {e}")
        return {"error": str(e)}

def probe_ko_wikipedia():
    url = "https://ko.wikipedia.org/wiki/%EB%B6%81%ED%95%9C%EC%9D%98_%EB%AF%B8%EC%82%AC%EC%9D%BC_%EB%B0%9C%EC%82%AC_%EB%AA%A9%EB%A1%9D"
    print(f"Fetching Korean Wikipedia: {url}")
    try:
        html = fetch(url)
        soup = BeautifulSoup(html, "html.parser")
        tables = soup.find_all("table", class_="wikitable")
        print(f"Found {len(tables)} wikitables on KO Wikipedia")
        results = []
        for i, t in enumerate(tables):
            headers = [th.get_text(strip=True) for th in t.find_all("th")]
            header_str = " | ".join(headers)
            if any(k in header_str for k in ["일자", "미사일", "발사", "결과"]):
                rows = t.find_all("tr")[1:]
                print(f"  KO Table {i} has {len(rows)} rows. Headers: {headers[:6]}")
                for tr in rows:
                    tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                    if len(tds) >= 3:
                        results.append({"table": i, "data": tds})
        return {"count": len(results), "rows": results}
    except Exception as e:
        print(f"Error fetching KO wiki: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    en = probe_en_wikipedia()
    ja = probe_ja_wikipedia()
    ko = probe_ko_wikipedia()
    summary = {
        "en_count": en.get("count", 0),
        "ja_count": ja.get("count", 0),
        "ko_count": ko.get("count", 0)
    }
    print("Summary:", summary)
    with open("docs/research/probes/missile_gaps/wiki_summary.json", "w") as f:
        json.dump({"summary": summary, "en_sample": en.get("rows", [])[:5], "ja_sample": ja.get("rows", [])[:5], "ko_sample": ko.get("rows", [])[:5]}, f, indent=2)
