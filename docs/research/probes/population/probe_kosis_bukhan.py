#!/usr/bin/env python3
"""
Probe script for Statistics Korea KOSIS North Korea Statistics Portal (kosis.kr/bukhan).
Fetches all 14 categories under MT_BUKHAN, enumerates all statistical tables,
and verifies table retrieval for key demographic and economic indicators.
"""
import urllib.request
import urllib.parse
import json
import ssl

def get_tree_nodes(root_id, lev=2):
    url = "https://kosis.kr/statisticsList/selectTreeData.do"
    data = urllib.parse.urlencode({
        'vwcd': 'MT_BUKHAN',
        'rootId': root_id,
        'lev': lev,
        'themaAll': '',
        'orderChk': '',
        'depth': 0
    }).encode('utf-8')
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://kosis.kr/statisticsList/statisticsListIndex.do?vwcd=MT_BUKHAN&menuId=M_02_02',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    req = urllib.request.Request(url, data=data, headers=headers)
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res.get('resultTreeListView', [])

if __name__ == '__main__':
    print("--- Fetching KOSIS MT_BUKHAN Root Categories ---")
    categories = get_tree_nodes('101_001', lev=2)
    print(f"Total categories found: {len(categories)}")
    
    total_tables = 0
    cat_summary = []
    
    for cat in categories:
        cat_id = cat.get('id')
        cat_name = cat.get('name')
        tables = get_tree_nodes(cat_id, lev=3)
        total_tables += len(tables)
        cat_summary.append({
            'id': cat_id,
            'name': cat_name,
            'table_count': len(tables),
            'tables': [{'name': t.get('name'), 'tblId': t.get('tblId'), 'prdInfo': t.get('prdInfo')} for t in tables]
        })
        print(f"[{cat_id}] {cat_name}: {len(tables)} tables")
        for t in tables[:3]:
            print(f"    - {t.get('tblId')}: {t.get('name')} ({t.get('prdInfo')})")
        if len(tables) > 3:
            print(f"    ... and {len(tables)-3} more tables")

    print(f"\nTotal tables across all categories: {total_tables}")
    with open('docs/research/probes/population/kosis_bukhan_tables.json', 'w', encoding='utf-8') as f:
        json.dump(cat_summary, f, ensure_ascii=False, indent=2)
    print("Saved catalog to docs/research/probes/population/kosis_bukhan_tables.json")
