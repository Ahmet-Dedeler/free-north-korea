import json

def extract_locations(filename):
    with open(filename) as f:
        raw = json.load(f)

    all_locs = []
    for node_idx, node in enumerate(raw.get('nodes', [])):
        if not node or 'data' not in node:
            continue
        data = node['data']
        for item in data:
            if isinstance(item, dict) and 'slug' in item and 'label' in item and 'map' in item:
                slug_idx = item['slug']
                label_idx = item['label']
                map_idx = item['map']
                count_idx = item.get('count')

                slug = data[slug_idx] if isinstance(slug_idx, int) and slug_idx < len(data) else None
                label = data[label_idx] if isinstance(label_idx, int) and label_idx < len(data) else None
                map_raw = data[map_idx] if isinstance(map_idx, int) and map_idx < len(data) else None
                count = data[count_idx] if isinstance(count_idx, int) and count_idx < len(data) else None

                map_obj = None
                if isinstance(map_raw, str):
                    try:
                        map_obj = json.loads(map_raw)
                    except:
                        pass
                elif isinstance(map_raw, dict):
                    map_obj = map_raw

                if slug and label and map_obj:
                    markers = map_obj.get('markers', [])
                    lat = markers[0].get('lat') if markers else map_obj.get('center', {}).get('lat')
                    lng = markers[0].get('lng') if markers else map_obj.get('center', {}).get('lng')
                    all_locs.append({
                        'slug': slug,
                        'label': label,
                        'count': count,
                        'lat': lat,
                        'lng': lng,
                        'map_meta': map_obj
                    })
    return all_locs

density_locs = extract_locations('docs/research/probes/camps/visualatlas_density_data.json')
repatriation_locs = extract_locations('docs/research/probes/camps/visualatlas_forced-repatriation_data.json')
theme_locs = extract_locations('docs/research/probes/camps/visualatlas_theme_data.json')

print(f"Density locations: {len(density_locs)}")
print(f"Forced repatriation locations: {len(repatriation_locs)}")
print(f"Theme locations: {len(theme_locs)}")

# Deduplicate by slug
combined = {}
for loc in density_locs + repatriation_locs + theme_locs:
    slug = loc['slug']
    if slug not in combined:
        combined[slug] = loc

print(f"Total unique locations across Visual Atlas: {len(combined)}")

# Save to probes/camps/visualatlas_parsed_locations.json
with open('docs/research/probes/camps/visualatlas_parsed_locations.json', 'w') as f:
    json.dump(list(combined.values()), f, indent=2)

print("Saved to docs/research/probes/camps/visualatlas_parsed_locations.json")
