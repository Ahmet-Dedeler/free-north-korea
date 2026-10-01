#!/usr/bin/env python3
"""
Probe KCNA Watch (kcnawatch.org) for official North Korean missile announcements.
"""
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import json

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

def search_kcna(query):
    url = f"https://kcnawatch.org/?s={urllib.parse.quote(query)}"
    print(f"Searching KCNA Watch: {url}")
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        html = r.read().decode("utf-8", errors="ignore")
        soup = BeautifulSoup(html, "html.parser")
        articles = []
        for h3 in soup.find_all(["h2", "h3"]):
            a = h3.find("a", href=True)
            if a and a.get_text(strip=True):
                articles.append({"title": a.get_text(strip=True), "url": a["href"]})
        return articles

if __name__ == "__main__":
    arts = search_kcna("missile test-fire")
    print(f"Found {len(arts)} articles:")
    for a in arts[:10]:
        print(" ", a)
