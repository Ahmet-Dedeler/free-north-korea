#!/usr/bin/env python3
"""
Probe script for Ministry of Unification North Korea Information Portal (nkinfo.unikorea.go.kr).
Tests NKMap FastAPI search endpoint, verifies parameter requirements,
and extracts North Korean geographic locations, coordinates, and facility attributes.
"""
import urllib.request
import urllib.parse
import json
import ssl

def search_nkmap(query):
    url = f"https://nkinfo.unikorea.go.kr/nkp/search/nkmapSearchFastApi.do?q={urllib.parse.quote(query)}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://nkinfo.unikorea.go.kr/NKMap/'
    }
    req = urllib.request.Request(url, headers=headers)
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

if __name__ == '__main__':
    queries = ['평양', '신의주', '혜산', '삼지연', '원산']
    print("--- Testing nkinfo NKMap FastAPI Endpoint ---")
    
    for q in queries:
        try:
            res = search_nkmap(q)
            items = res.get('items', [])
            total = res.get('total', 0)
            print(f"\nQuery '{q}': total matches={total} (showing {len(items)} items)")
            for item in items[:2]:
                title = item.get('data_ttl')
                addr = item.get('addr')
                category = item.get('ctgry_nm')
                x = item.get('x_crdnt')
                y = item.get('y_crdnt')
                attrbs = item.get('attrbs', [])
                print(f"  - [{category}] {title} ({addr})")
                print(f"    Coords: X={x}, Y={y}")
                for a in attrbs[:2]:
                    print(f"    Attr: {a.get('attrb_nm')}: {a.get('attrb_val')}")
        except Exception as e:
            print(f"Query '{q}' failed: {e}")
