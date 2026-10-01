#!/usr/bin/env python3
"""
Probe: Tayvano / Lazarus & BlueNoroff Research Dataset
Repo: https://github.com/tayvano/lazarus-bluenoroff-research
API: GitHub Contents API
"""
import urllib.request
import json
import re

def main():
    url = "https://api.github.com/repos/tayvano/lazarus-bluenoroff-research/contents/hacks-and-thefts"
    print(f"Fetching incident list from GitHub: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        files = json.loads(resp.read().decode("utf-8"))
        print(f"Total documented heist records: {len(files)}")
        
        # Pick the 3 latest 2026 files
        latest_2026 = [f for f in files if "2026" in f["name"]]
        print(f"Recorded incidents in 2026 alone: {len(latest_2026)}")
        for f in latest_2026[-3:]:
            download_url = f["download_url"]
            with urllib.request.urlopen(urllib.request.Request(download_url, headers={"User-Agent": "Mozilla/5.0"})) as r:
                content = r.read().decode("utf-8")
                date = re.search(r"Date::\s*(.+)", content)
                amt = re.search(r"Amount Stolen::\s*(.+)", content)
                addrs = re.findall(r"(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{38,59})", content)
                print(f"  Incident File: {f['name']}")
                print(f"    Date: {date.group(1).strip() if date else 'N/A'}")
                print(f"    Stolen: {amt.group(1).strip() if amt else 'N/A'}")
                print(f"    Crypto Addresses Identified: {len(addrs)} (Sample: {addrs[0] if addrs else 'None'})")

if __name__ == "__main__":
    main()
