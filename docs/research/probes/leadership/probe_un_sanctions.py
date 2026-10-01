#!/usr/bin/env python3
"""
Probe script to parse UN Security Council 1718 Sanctions List
for DPRK individuals and entities.
"""

import json
import os
import urllib.request
import xml.etree.ElementTree as ET

UN_URL = "https://scsanctions.un.org/resources/xml/en/consolidated.xml"

def fetch_un_sanctions():
    req = urllib.request.Request(UN_URL, headers={"User-Agent": "FreeNorthKoreaBot/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        xml_data = r.read()
    return xml_data

def parse_un_sanctions(xml_data):
    root = ET.fromstring(xml_data)
    dprk_individuals = []
    dprk_entities = []

    # Individuals
    for ind in root.findall(".//INDIVIDUAL"):
        un_list_type = ind.findtext("UN_LIST_TYPE", "")
        if "DPRK" in un_list_type or ind.findtext(".//NATIONALITY/VALUE", "") == "Democratic People's Republic of Korea":
            dataid = ind.findtext("DATAID", "")
            first_name = ind.findtext("FIRST_NAME", "")
            second_name = ind.findtext("SECOND_NAME", "")
            third_name = ind.findtext("THIRD_NAME", "")
            full_name = " ".join(part for part in [first_name, second_name, third_name] if part).strip()
            designation_date = ind.findtext(".//LISTED_ON", "")
            comments = ind.findtext("COMMENTS1", "")
            aliases = [a.findtext("ALIAS_NAME") for a in ind.findall(".//INDIVIDUAL_ALIAS") if a.findtext("ALIAS_NAME")]
            dprk_individuals.append({
                "dataid": dataid,
                "name": full_name,
                "designation_date": designation_date,
                "aliases": aliases,
                "comments": comments
            })

    # Entities
    for ent in root.findall(".//ENTITY"):
        un_list_type = ent.findtext("UN_LIST_TYPE", "")
        if "DPRK" in un_list_type:
            dataid = ent.findtext("DATAID", "")
            first_name = ent.findtext("FIRST_NAME", "")
            designation_date = ent.findtext(".//LISTED_ON", "")
            comments = ent.findtext("COMMENTS1", "")
            aliases = [a.findtext("ALIAS_NAME") for a in ent.findall(".//ENTITY_ALIAS") if a.findtext("ALIAS_NAME")]
            dprk_entities.append({
                "dataid": dataid,
                "name": first_name,
                "designation_date": designation_date,
                "aliases": aliases,
                "comments": comments
            })

    return {"individuals": dprk_individuals, "entities": dprk_entities}

def main():
    print("Fetching UN Consolidated Sanctions List...")
    xml_data = fetch_un_sanctions()
    parsed = parse_un_sanctions(xml_data)
    print(f"Found {len(parsed['individuals'])} DPRK individuals and {len(parsed['entities'])} DPRK entities.")
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(out_dir, "un_1718_sanctions.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(parsed, f, indent=2, ensure_ascii=False)
    print(f"Saved to {out_file}")

if __name__ == "__main__":
    main()
