#!/usr/bin/env python3
"""
Probe script to parse US Treasury OFAC SDN List for DPRK targets.
Filters entries with DPRK-related sanctions programs (DPRK, DPRK2, DPRK3, DPRK4, CYBER2, etc.)
or remarks referencing North Korea / DPRK.
"""

import json
import os
import urllib.request
import xml.etree.ElementTree as ET

OFAC_URL = "https://www.treasury.gov/ofac/downloads/sdn.xml"

def fetch_and_parse():
    print("Downloading OFAC SDN XML...")
    req = urllib.request.Request(OFAC_URL, headers={"User-Agent": "FreeNorthKoreaBot/1.0"})
    
    with urllib.request.urlopen(req, timeout=90) as resp:
        tree = ET.parse(resp)
        root = tree.getroot()

    # Detect namespace
    ns = ""
    if root.tag.startswith("{"):
        ns = root.tag.split("}")[0] + "}"

    dprk_people = []
    dprk_orgs = []

    for entry in root.findall(f"{ns}sdnEntry"):
        uid = entry.findtext(f"{ns}uid")
        first_name = entry.findtext(f"{ns}firstName") or ""
        last_name = entry.findtext(f"{ns}lastName") or ""
        sdn_type = entry.findtext(f"{ns}sdnType")
        remarks = entry.findtext(f"{ns}remarks") or ""

        programs = [p.text for p in entry.findall(f"{ns}programList/{ns}program") if p.text]
        is_dprk = any("DPRK" in p for p in programs) or "CYBER2" in programs or "North Korea" in remarks or "DPRK" in remarks

        if not is_dprk:
            continue

        aliases = []
        for aka in entry.findall(f"{ns}akaList/{ns}aka"):
            afirst = aka.findtext(f"{ns}firstName") or ""
            alast = aka.findtext(f"{ns}lastName") or ""
            name = f"{afirst} {alast}".strip()
            if name:
                aliases.append(name)

        full_name = f"{first_name} {last_name}".strip()
        record = {
            "uid": uid,
            "name": full_name,
            "type": sdn_type,
            "programs": programs,
            "aliases": aliases,
            "remarks": remarks
        }

        if sdn_type == "Individual":
            dprk_people.append(record)
        else:
            dprk_orgs.append(record)

    return {"people": dprk_people, "orgs": dprk_orgs}

def main():
    data = fetch_and_parse()
    print(f"Found {len(data['people'])} OFAC DPRK individuals and {len(data['orgs'])} OFAC DPRK entities.")
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(out_dir, "ofac_dprk_sanctions.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved to {out_file}")

if __name__ == "__main__":
    main()
