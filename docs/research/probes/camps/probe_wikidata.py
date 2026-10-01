import urllib.request
import urllib.parse
import json

sparql_query = """
SELECT ?item ?itemLabel ?itemDescription ?coord ?instanceOfLabel WHERE {
  ?item wdt:P17 wd:Q423. # country North Korea
  ?item wdt:P31 ?instanceOf.
  VALUES ?instanceOf {
    wd:Q1035108   # concentration camp
    wd:Q8588      # prison
    wd:Q1195610   # labor camp
    wd:Q2278453   # internment camp
    wd:Q6450654   # kwan-li-so
    wd:Q12583151  # political prison camp
    wd:Q27938     # prison camp
    wd:Q15058335  # forced labor camp
  }
  OPTIONAL { ?item wdt:P625 ?coord. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,ko,ja". }
}
"""

url = "https://query.wikidata.org/sparql?query=" + urllib.parse.quote(sparql_query) + "&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'FreeNorthKoreaBot/1.0 (https://free-north-korea.vercel.app)'})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        bindings = data.get('results', {}).get('bindings', [])
        print(f"Wikidata results count: {len(bindings)}")
        results = []
        for b in bindings:
            item_url = b.get('item', {}).get('value')
            label = b.get('itemLabel', {}).get('value')
            desc = b.get('itemDescription', {}).get('value')
            coord = b.get('coord', {}).get('value')
            inst = b.get('instanceOfLabel', {}).get('value')
            results.append({
                'wikidata_id': item_url.split('/')[-1] if item_url else None,
                'label': label,
                'description': desc,
                'instance_of': inst,
                'coord': coord
            })
            print(f"  {label} ({inst}): {coord}")

        with open('docs/research/probes/camps/wikidata_camps.json', 'w') as f:
            json.dump(results, f, indent=2)
        print("Saved to docs/research/probes/camps/wikidata_camps.json")
except Exception as e:
    print("Error querying Wikidata:", e)
