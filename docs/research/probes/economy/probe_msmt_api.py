#!/usr/bin/env python3
"""
Probe: Multilateral Sanctions Monitoring Team (MSMT) API
Base: https://msmt.info
Endpoints:
  - Reports list: /api/post/list?cateSn=1&page=1&size=8&kw=
  - Detail: /api/post/detail?sn=<sn>
"""
import urllib.request
import json

def main():
    list_url = "https://msmt.info/api/post/list?cateSn=1&page=1&size=8&kw="
    print(f"Fetching MSMT Reports: {list_url}")
    req = urllib.request.Request(list_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        items = res.get("item", {}).get("content", [])
        print(f"Retrieved {len(items)} MSMT reports:")
        for item in items:
            print(f"  - [{item.get('createdAt')[:10]}] SN {item.get('sn')}: {item.get('title')}")

        if items:
            latest_sn = items[0]["sn"]
            detail_url = f"https://msmt.info/api/post/detail?sn={latest_sn}"
            print(f"\nFetching detail for SN {latest_sn}...")
            with urllib.request.urlopen(urllib.request.Request(detail_url, headers={"User-Agent": "Mozilla/5.0"})) as d_resp:
                detail = json.loads(d_resp.read().decode("utf-8")).get("item", {})
                print(f"Title: {detail.get('title')}")
                for f in detail.get("files", []):
                    print(f"  Attachment: {f.get('name')} ({f.get('size'):,} bytes)")
                    print(f"  Direct Link: https://msmt.info{f.get('fileUri')}")

if __name__ == "__main__":
    main()
