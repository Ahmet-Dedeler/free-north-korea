#!/usr/bin/env python3
"""
Probe: UN Security Council Consolidated Sanctions List XML
Endpoint: https://scsanctions.un.org/resources/xml/en/consolidated.xml
Focus: 1718 DPRK Sanctions Committee entries
"""
import urllib.request
import xml.etree.ElementTree as ET

def main():
    url = "https://scsanctions.un.org/resources/xml/en/consolidated.xml"
    print(f"Fetching UN Sanctions XML: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        tree = ET.parse(resp)
        root = tree.getroot()

        individuals = root.findall(".//INDIVIDUAL")
        entities = root.findall(".//ENTITY")

        dprk_ind = [i for i in individuals if "DPRK" in i.findtext("UN_LIST_TYPE", "")]
        dprk_ent = [e for e in entities if "DPRK" in e.findtext("UN_LIST_TYPE", "")]

        print(f"Total Consolidated: {len(individuals)} individuals, {len(entities)} entities")
        print(f"DPRK (1718 Committee): {len(dprk_ind)} individuals, {len(dprk_ent)} entities")

        if dprk_ent:
            sample = dprk_ent[0]
            print(f"Sample Entity: {sample.findtext('FIRST_NAME')} | Listed: {sample.findtext('LISTED_ON')}")
            print(f"Aliases: {[a.findtext('ALIAS_NAME') for a in sample.findall('.//ENTITY_ALIAS')]}")

if __name__ == "__main__":
    main()
