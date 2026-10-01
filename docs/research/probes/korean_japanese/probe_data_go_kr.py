#!/usr/bin/env python3
"""
Probe data.go.kr (대한민국 공공데이터포털) for North Korea ("북한") datasets.
"""
import urllib.request
import urllib.parse
import re
import json

def search_data_go_kr(keyword="북한", max_pages=3):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    results = []
    
    for page in range(1, max_pages + 1):
        query = urllib.parse.quote(keyword)
        url = f"https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword={query}&dataType=DATA&curPage={page}&perPage=40"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                html = resp.read().decode('utf-8', errors='replace')
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break
            
        # Extract items: pattern <a href="(/data/\d+/[^"]+)">...<span class="apply-result-summary">
        item_blocks = re.findall(
            r'<a href="(/data/(\d+)/([^"]+))">\s*(.*?)\s*</a>\s*</div>\s*<span class="apply-result-summary">\s*(.*?)\s*</span>.*?'
            r'<strong>제공기관</strong>\s*([^<\n]+).*?'
            r'<strong>수정일</strong>\s*([0-9\-]+)',
            html,
            re.DOTALL
        )
        
        print(f"Page {page}: found {len(item_blocks)} datasets")
        for href, ds_id, ds_type, raw_title, raw_desc, org, mod_date in item_blocks:
            title = re.sub(r'<[^>]+>', '', raw_title).strip()
            title = ' '.join(title.split())
            desc = re.sub(r'<[^>]+>', '', raw_desc).strip()
            desc = ' '.join(desc.split())
            org = org.strip()
            mod_date = mod_date.strip()
            
            results.append({
                "id": f"data-go-kr-{ds_id}",
                "title": title,
                "dataset_id": ds_id,
                "url": f"https://www.data.go.kr{href}",
                "publisher": org,
                "modified": mod_date,
                "type": ds_type,
                "description": desc
            })
            
    return results

if __name__ == "__main__":
    datasets = search_data_go_kr("북한", max_pages=3)
    print(f"\nTotal datasets found: {len(datasets)}")
    for d in datasets:
        print(f"[{d['publisher']}] {d['title']} (Updated: {d['modified']}) - {d['url']}")
        print(f"   Desc: {d['description'][:120]}...\n")
    
    with open("docs/research/probes/korean_japanese/data_go_kr_results.json", "w", encoding="utf-8") as f:
        json.dump(datasets, f, ensure_ascii=False, indent=2)
