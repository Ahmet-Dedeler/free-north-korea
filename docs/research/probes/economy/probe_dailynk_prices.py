#!/usr/bin/env python3
"""
Probe: Daily NK Ground-Truth Market Price Survey (WP-JSON API)
Endpoints:
  - English: https://www.dailynk.com/english/wp-json/wp/v2/posts
  - Korean:  https://www.dailynk.com/wp-json/wp/v2/posts
"""
import urllib.request
import urllib.parse
import json
import re

def probe_endpoint(lang, url):
    print(f"\n--- Daily NK {lang} Price Probe ---")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        posts = json.loads(resp.read().decode("utf-8"))
        print(f"Retrieved {len(posts)} recent price posts.")
        for p in posts[:2]:
            print(f"ID: {p['id']} | Date: {p['date']}")
            print(f"Title: {p['title']['rendered']}")
            print(f"Link: {p['link']}")
            clean_text = re.sub(r'<[^>]+>', ' ', p['content']['rendered'])
            clean_text = ' '.join(clean_text.split())
            print(f"Snippet: {clean_text[:250]}...\n")

if __name__ == "__main__":
    # English query for market indicators
    en_url = "https://www.dailynk.com/english/wp-json/wp/v2/posts?search=market%20prices%20fell&per_page=2"
    probe_endpoint("English", en_url)

    # Korean query for market grain prices
    ko_url = f"https://www.dailynk.com/wp-json/wp/v2/posts?search={urllib.parse.quote('시장물가')}&per_page=2"
    probe_endpoint("Korean", ko_url)
