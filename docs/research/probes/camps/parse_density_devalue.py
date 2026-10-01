import json

def parse_devalue(node_data):
    # node_data is a list
    # indices reference items in node_data
    # Let's inspect what's inside
    return node_data

with open('docs/research/probes/camps/visualatlas_density_data.json') as f:
    raw = json.load(f)

node3 = raw['nodes'][3]
data = node3['data']
print(f"Total elements in node 3 data: {len(data)}")

# Let's find strings and objects
strings = [x for x in data if isinstance(x, str)]
print(f"Total strings: {len(strings)}")
print("Sample strings:", strings[:40])

# Look for location names or coordinates
for i, item in enumerate(data[:100]):
    print(f"[{i}]: {repr(item)}")
