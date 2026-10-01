#!/usr/bin/env python3
"""
Probe GitHub for Korean and Japanese open-source projects, datasets, and GIS repos
concerning North Korea:
- North Korea administrative boundaries GeoJSON / TopoJSON
- North Korean language corpora and NLP tools (문화어 맞춤법, 토크나이저)
- Scrapers for North Korean state media (Rodong Sinmun, KCNA, Voice of Korea)
- Satellite imagery processing & datasets on North Korea
"""
import urllib.request
import urllib.parse
import json

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'application/vnd.github.v3+json'
}

QUERIES = [
    '북한 행정구역',
    '북한 지도',
    '북한 geojson',
    '로동신문',
    '조선중앙통신',
    'north korea language:jupyter',
    '北朝鮮 地図',
    '拉致被害者'
]

def probe_github():
    all_repos = {}
    for q in QUERIES:
        query_enc = urllib.parse.quote(q)
        url = f"https://api.github.com/search/repositories?q={query_enc}&sort=stars&order=desc&per_page=10"
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                total = data.get('total_count', 0)
                items = data.get('items', [])
                print(f"Query '{q}': {total} repos found")
                for it in items:
                    repo_id = it['full_name']
                    if repo_id not in all_repos:
                        all_repos[repo_id] = {
                            "name": it['name'],
                            "full_name": repo_id,
                            "url": it['html_url'],
                            "description": it.get('description') or "",
                            "stars": it['stargazers_count'],
                            "forks": it['forks_count'],
                            "language": it.get('language'),
                            "created_at": it['created_at'],
                            "updated_at": it['updated_at'],
                            "pushed_at": it['pushed_at']
                        }
        except Exception as e:
            print(f"Error querying '{q}': {e}")
            
    print(f"\nTotal unique repos collected: {len(all_repos)}")
    for r in sorted(all_repos.values(), key=lambda x: x['stars'], reverse=True)[:20]:
        print(f"[{r['stars']}★] {r['full_name']} ({r['language']}) - {r['description'][:90]}")
        print(f"     URL: {r['url']} | Pushed: {r['pushed_at']}")
        
    with open("docs/research/probes/korean_japanese/github_korean_results.json", "w", encoding="utf-8") as f:
        json.dump(all_repos, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    probe_github()
