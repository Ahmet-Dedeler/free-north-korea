#!/usr/bin/env python3
"""
Probe Yonhap News (연합뉴스) for South Korean JCS missile announcements.
"""
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import json

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def search_yonhap_en(query):
    url = f"https://en.yna.co.kr/search/index?query={urllib.parse.quote(query)}"
    print(f"Searching Yonhap EN: {url}")
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        html = r.read().decode("utf-8", errors="ignore")
        soup = BeautifulSoup(html, "html.parser")
        articles = []
        # Find articles in search result
        for div in soup.find_all("div"):
            classes = div.get("class", [])
            if any("item-box" in c or "contents" in c for c in classes):
                a = div.find("a", href=True)
                if a and a.get_text(strip=True):
                    title = a.get_text(strip=True)
                    href = a["href"]
                    date_span = div.find("span", class_="date")
                    date_str = date_span.get_text(strip=True) if date_span else ""
                    articles.append({"title": title, "url": href, "date": date_str})
        return articles

def search_yonhap_ko(query):
    url = f"https://www.yna.co.kr/search/index?query={urllib.parse.quote(query)}"
    print(f"Searching Yonhap KO: {url}")
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        html = r.read().decode("utf-8", errors="ignore")
        soup = BeautifulSoup(html, "html.parser")
        articles = []
        for div in soup.find_all("div"):
            classes = div.get("class", [])
            if any("news-con" in c or "item-box" in c for c in classes):
                a = div.find("a", href=True)
                if a and a.get_text(strip=True):
                    title = a.get_text(strip=True)
                    href = a["href"]
                    date_span = div.find("span", class_="txt-time") or div.find("span", class_="date")
                    date_str = date_span.get_text(strip=True) if date_span else ""
                    articles.append({"title": title, "url": href, "date": date_str})
        return articles

if __name__ == "__main__":
    en_arts = search_yonhap_en("North Korea ballistic missile JCS")
    print(f"Found {len(en_arts)} EN articles:")
    for a in en_arts[:5]:
        print(" ", a)
        
    ko_arts = search_yonhap_ko("합참 북한 탄도미사일")
    print(f"Found {len(ko_arts)} KO articles:")
    for a in ko_arts[:5]:
        print(" ", a)
