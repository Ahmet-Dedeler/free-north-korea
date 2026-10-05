#!/usr/bin/env python3
"""
Probe script: Test OWID grapher charts for North Korea (PRK) data.
Fetches metadata and checks whether PRK has non-empty data in the CSV.
"""
import urllib.request
import urllib.error
import json
import csv
import io
import sys

CANDIDATE_SLUGS = [
    # Demography & Health
    "life-expectancy",
    "child-mortality-igme",
    "infant-mortality",
    "maternal-mortality",
    "crude-birth-rate",
    "crude-death-rate",
    "children-per-woman-un",
    "median-age",
    "population",
    "reported-cases-of-measles",
    "tuberculosis-incidence-gbd",
    "tuberculosis-incidence",
    "prevalence-of-undernourishment",
    "share-of-children-younger-than-5-who-are-stunted",
    "share-of-children-with-wasting",
    
    # Energy, Climate & Environment
    "annual-co2-emissions-per-country",
    "co-emissions-per-capita",
    "total-ghg-emissions",
    "electricity-prod-source-stacked",
    "electricity-generation",
    "per-capita-electricity-generation",
    "fossil-fuels-per-capita",
    "share-electricity-renewables",
    "air-pollution-deaths-rate-gbd",
    "primary-energy-cons",
    
    # Agriculture & Food
    "cereal-yields",
    "cereal-crop-production",
    "daily-per-capita-caloric-supply",
    "daily-per-capita-protein-supply",
    "per-capita-meat-consumption",
    
    # Democracy, Human Rights & Conflict
    "electoral-democracy-index",
    "liberal-democracy-index",
    "human-rights-score-vdem",
    "freedom-of-expression-vdem",
    "civil-liberties-score-vdem",
    "political-corruption-index",
    "freedom-house-score",
    "press-freedom-index-rsf",
    "democracy-index-eiu",
    "number-of-nuclear-weapons-tests",
    "military-expenditure-share-gdp",
    
    # Technology & Economy
    "mobile-cellular-subscriptions-by-country",
    "broadband-penetration-by-country",
    "share-of-individuals-using-the-internet",
    "gdp-per-capita-maddison",
    "gdp-per-capita-world-bank",
    "merchandise-exports",
    "forest-area-km"
]

def check_slug(slug):
    url_csv = f"https://ourworldindata.org/grapher/{slug}.csv?country=PRK"
    url_meta = f"https://ourworldindata.org/grapher/{slug}.metadata.json"
    
    try:
        req = urllib.request.Request(url_meta, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            meta = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"slug": slug, "error": f"meta error: {e}"}

    try:
        req = urllib.request.Request(url_csv, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            csv_text = resp.read().decode("utf-8")
    except Exception as e:
        return {"slug": slug, "error": f"csv error: {e}"}

    reader = csv.reader(io.StringIO(csv_text))
    rows = list(reader)
    if not rows:
        return {"slug": slug, "error": "empty csv"}
    
    header = rows[0]
    prk_rows = []
    for r in rows[1:]:
        if len(r) >= 3 and (r[1] == "PRK" or "North Korea" in r[0]):
            prk_rows.append(r)
            
    if not prk_rows:
        return {"slug": slug, "has_prk": False, "title": meta.get("chart", {}).get("title", slug)}
    
    years = [int(r[2]) for r in prk_rows if r[2].isdigit()]
    min_year = min(years) if years else None
    max_year = max(years) if years else None
    
    latest_row = [r for r in prk_rows if r[2] == str(max_year)][0] if max_year else None
    latest_val = latest_row[3] if latest_row and len(latest_row) > 3 else "N/A"
    
    title = meta.get("chart", {}).get("title", slug)
    cols = meta.get("columns", {})
    first_col = list(cols.values())[0] if cols else {}
    unit = first_col.get("unit", first_col.get("shortUnit", ""))
    citation = meta.get("chart", {}).get("citation", first_col.get("citationShort", ""))
    
    return {
        "slug": slug,
        "has_prk": True,
        "title": title,
        "min_year": min_year,
        "max_year": max_year,
        "latest_value": f"{max_year}: {latest_val} {unit}".strip(),
        "unit": unit,
        "citation": citation,
        "rows_count": len(prk_rows)
    }

if __name__ == "__main__":
    print(f"Testing {len(CANDIDATE_SLUGS)} slugs...")
    results = []
    for slug in CANDIDATE_SLUGS:
        res = check_slug(slug)
        if res.get("has_prk"):
            print(f"[FOUND] {res['slug']}: {res['title']} ({res['min_year']}-{res['max_year']}) -> {res['latest_value']}")
            results.append(res)
        elif res.get("has_prk") is False:
            print(f"[NO PRK] {res['slug']}: {res['title']}")
        else:
            print(f"[ERROR] {res.get('slug')}: {res.get('error')}")

    with open("docs/research/charts/samples/global/owid_tested.json", "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nTotal OWID charts with PRK found: {len(results)}")
