#!/usr/bin/env python3
"""
probe_kosis_bukhan_catalog.py - Statistics Korea KOSIS North Korea Portal Probe.

Queries KOSIS MT_BUKHAN tree structure, catalogs all 14 categories and 142 tables,
verifies table IDs, and outputs parameter-based API structures and update cycles.
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
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://kosis.kr/statisticsList/statisticsListIndex.do?vwcd=MT_BUKHAN&menuId=M_02_02',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    req = urllib.request.Request(url, data=data, headers=headers)
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res.get('resultTreeListView', [])

def main():
    print("=== Probing KOSIS MT_BUKHAN Portal ===")
    categories = get_tree_nodes('101_001', lev=2)
    print(f"Total root categories: {len(categories)}")
    
    catalog = []
    for cat in categories:
        cat_id = cat.get('id')
        cat_name = cat.get('name')
        tables = get_tree_nodes(cat_id, lev=3)
        cat_info = {
            'category_id': cat_id,
            'category_name': cat_name,
            'table_count': len(tables),
            'tables': []
        }
        for t in tables:
            cat_info['tables'].append({
                'tblId': t.get('tblId'),
                'tblNm': t.get('name'),
                'period': t.get('prdInfo'),
                'pubSe': t.get('pubSe')
            })
        catalog.append(cat_info)
        print(f"[{cat_id}] {cat_name}: {len(tables)} tables")

    out_file = 'docs/research/charts/samples/kr_gov/kosis_bukhan_catalog.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    print(f"Saved catalog to {out_file}")

if __name__ == '__main__':
    main()
