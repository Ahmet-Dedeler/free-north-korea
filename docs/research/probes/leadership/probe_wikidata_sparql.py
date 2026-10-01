#!/usr/bin/env python3
"""
SPARQL probe script for North Korean leadership and political entities.
Queries Wikidata SPARQL endpoint for Kim family genealogy, North Korean Politburo members,
and sanctioned DPRK entities.
"""

import json
import os
import urllib.parse
import urllib.request

SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"

SPARQL_QUERIES = {
    "kim_dynasty": """
    SELECT ?person ?personLabel ?birthDate ?deathDate ?father ?mother ?spouse ?child ?sibling ?image ?height ?mass WHERE {
      VALUES ?person {
        wd:Q41117 wd:Q272449 wd:Q461937 wd:Q10665 wd:Q448833 wd:Q266567 wd:Q489370
        wd:Q56226 wd:Q272719 wd:Q115272635 wd:Q498833 wd:Q494165 wd:Q313367 wd:Q6408719
        wd:Q494877 wd:Q268593 wd:Q312521 wd:Q494851 wd:Q494870 wd:Q494857
      }
      OPTIONAL { ?person wdt:P569 ?birthDate . }
      OPTIONAL { ?person wdt:P570 ?deathDate . }
      OPTIONAL { ?person wdt:P22 ?father . }
      OPTIONAL { ?person wdt:P25 ?mother . }
      OPTIONAL { ?person wdt:P26 ?spouse . }
      OPTIONAL { ?person wdt:P40 ?child . }
      OPTIONAL { ?person wdt:P3373 ?sibling . }
      OPTIONAL { ?person wdt:P18 ?image . }
      OPTIONAL { ?person wdt:P2048 ?height . }
      OPTIONAL { ?person wdt:P2067 ?mass . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,ko". }
    }
    """,
    "politburo_members": """
    SELECT ?person ?personLabel ?party ?position ?positionLabel ?startDate ?endDate WHERE {
      VALUES ?person {
        wd:Q56226 wd:Q85978153 wd:Q104771569 wd:Q496924 wd:Q43078715 wd:Q67936746
        wd:Q15088267 wd:Q116030999 wd:Q21824967 wd:Q47035368 wd:Q63098363 wd:Q16091484
        wd:Q12607997 wd:Q20651717 wd:Q112671560 wd:Q107119253 wd:Q108740520 wd:Q108740522
        wd:Q112671563 wd:Q18605273 wd:Q50382875 wd:Q112671565 wd:Q85978151 wd:Q112671568
      }
      OPTIONAL { ?person p:P39 ?statement .
                 ?statement ps:P39 ?position .
                 OPTIONAL { ?statement pq:P580 ?startDate . }
                 OPTIONAL { ?statement pq:P582 ?endDate . }
               }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,ko". }
    }
    """,
    "orgs_dprk": """
    SELECT ?org ?orgLabel ?inception ?head ?headLabel WHERE {
      VALUES ?org {
        wd:Q49886 wd:Q10854483 wd:Q718501 wd:Q49889 wd:Q6854191 wd:Q112671580 wd:Q489397 wd:Q6431718
      }
      OPTIONAL { ?org wdt:P571 ?inception . }
      OPTIONAL { ?org wdt:P488 ?head . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,ko". }
    }
    """
}

def run_query(name, query):
    url = f"{SPARQL_ENDPOINT}?query={urllib.parse.quote(query)}&format=json"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "FreeNorthKoreaBot/1.0 (https://github.com/Ahmet-Dedeler/free-north-korea; ahmet@agentmail.to)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data["results"]["bindings"]
    except Exception as e:
        print(f"Error querying {name}: {e}")
        return []

def main():
    out_dir = os.path.dirname(os.path.abspath(__file__))
    all_results = {}
    for name, query in SPARQL_QUERIES.items():
        print(f"Executing SPARQL query '{name}'...")
        res = run_query(name, query)
        all_results[name] = res
        print(f"-> Got {len(res)} bindings.")

    out_file = os.path.join(out_dir, "wikidata_sparql_dump.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"Saved SPARQL dump to {out_file}")

if __name__ == "__main__":
    main()
