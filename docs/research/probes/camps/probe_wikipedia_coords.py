import urllib.request
import urllib.parse
import json

titles = [
  "Chongjin concentration camp",
  "Chongori concentration camp",
  "Chungsan concentration camp",
  "Hamhung concentration camp",
  "Hoeryong concentration camp",
  "Hoeryong reeducation camp",
  "Hwasong concentration camp",
  "Kaechon prison camp",
  "Kaechon internment camp",
  "Kangdong concentration camp",
  "Kanggye concentration camp",
  "Onsong concentration camp",
  "Oro concentration camp",
  "Pukchang concentration camp",
  "Ryongdam concentration camp",
  "Sariwon concentration camp",
  "Sinuiju concentration camp",
  "Sunghori concentration camp",
  "Taehung concentration camp",
  "Tanchon concentration camp",
  "Tongrim concentration camp",
  "Wonsan concentration camp",
  "Yodok concentration camp"
]

# Query coordinates and wikidata item for all titles
url = "https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageprops&titles=" + urllib.parse.quote("|".join(titles)) + "&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'FreeNorthKoreaBot/1.0'})

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

pages = data.get('query', {}).get('pages', {})
print(f"Retrieved {len(pages)} Wikipedia pages.")

camp_records = []
for pid, p in pages.items():
    title = p.get('title')
    coords = p.get('coordinates', [])
    wikibase = p.get('pageprops', {}).get('wikibase_item')
    lat = coords[0].get('lat') if coords else None
    lon = coords[0].get('lon') if coords else None
    print(f"  {title}: lat={lat}, lon={lon} (Wikidata: {wikibase})")
    camp_records.append({
        'title': title,
        'pageid': pid,
        'wikidata_id': wikibase,
        'lat': lat,
        'lon': lon,
        'url': f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
    })

with open('docs/research/probes/camps/wikipedia_camp_coordinates.json', 'w') as f:
    json.dump(camp_records, f, indent=2)

print("Saved to docs/research/probes/camps/wikipedia_camp_coordinates.json")
