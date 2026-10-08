// Builds data/sources/registry.json from the research files (docs/research/*.json), so every source the research
// found gets watched by scripts/check-sources.mjs. Hand-written entries already in the registry (with a `watch`
// we chose on purpose) are kept as they are.
//   node scripts/build-registry.ts
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

type Any = Record<string, any>;
const FILE = 'data/sources/registry.json';
const existing: Any[] = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : [];
const manual = new Map(existing.filter((e) => e.manual).map((e) => [e.id, e]));

/** Which of our pages/layers use a source (by research id). */
const USED_BY: Record<string, string[]> = {
  'nagix-nk-missile-tests': ['/missiles'],
  'nkdb-visual-atlas-locations': ['/map'],
  'nkdb-visual-atlas-incidents': ['/map'],
  'korea-future-nkpd-facilities': ['/map'],
  'hrnk-prison-camp-kml': ['/map'],
  'csis-beyond-parallel-markets': ['/map'],
  'csis-beyond-parallel-missile-bases': ['/map'],
  'csis-beyond-parallel-provocations': ['/military'],
  'hdx-ocha-cod-ab-prk': ['/map'],
  'hdx-ocha-cod-ps-prk': ['/map'],
  'nasa-gibs-black-marble-wmts': ['/map'],
  'us-ofac-sdn-dprk': ['/people'],
  'un-sc-1718-sanctions-list': ['/people'],
};

/** Watch specs chosen by hand. Overpass: count elements instead of hashing the response (its `osm3s.timestamp`
 * changes on every call, and the full military query times out on the busy public server). */
const overpass = (q: string) => ({
  type: 'count',
  url: 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(`[out:json][timeout:90];area["ISO3166-1"="KP"][admin_level=2]->.a;${q}out count;`),
  path: 'elements.0.tags.total',
});
const WATCH: Record<string, Any> = {
  'openstreetmap-dprk-military': overpass('nwr["military"](area.a);'),
  'openstreetmap-overpass-dprk': overpass('rel(area.a)["boundary"="administrative"]["admin_level"="6"];'),
};

/** Pick a cheap way to notice changes: GitHub commits, file hash for data files, cache headers for pages. */
function watchFor(s: Any) {
  const gh = String(s.url ?? '').match(/github\.com\/([^/]+\/[^/#?]+)/) ?? String(s.endpoint ?? '').match(/raw\.githubusercontent\.com\/([^/]+\/[^/]+)/);
  if (gh) return { type: 'github', repo: gh[1].replace(/\.git$/, '') };
  const ep = String(s.endpoint ?? '');
  const direct = /^https?:\/\/\S+$/.test(ep) && !/[{}]|\s|POST /.test(ep);
  if (direct && /json|csv|xml|kml|geojson/.test(s.format ?? '') && !/\.(zip|pbf|tif)/.test(ep)) return { type: 'content', url: ep };
  if (/^https?:\/\//.test(s.url ?? '')) return { type: 'headers', url: s.url };
  return null;
}

const out = new Map<string, Any>();
for (const f of readdirSync('docs/research').filter((f) => f.endsWith('.json') && !f.startsWith('_') && f !== 'leadership.json' && f !== 'missile_gaps.json')) {
  const track = f.replace('.json', '');
  for (const s of JSON.parse(readFileSync(`docs/research/${f}`, 'utf8')) as Any[]) {
    if (out.has(s.id)) continue;
    out.set(s.id, {
      id: s.id,
      name: s.name,
      publisher: s.publisher,
      url: s.url,
      track,
      language: s.language,
      category: s.category,
      description: s.description,
      format: s.format,
      access: s.access,
      has_geo: s.has_geo,
      // the research agent's assessment, dated; the watcher's own observations live in state.json
      research: { last_updated: s.last_updated, maintenance: s.maintenance, cadence: s.update_cadence, value: s.value, checked: '2026-10-01' },
      build_idea: s.build_idea,
      usedBy: USED_BY[s.id] ?? [],
      watch: WATCH[s.id] ?? watchFor(s),
    });
  }
}
for (const [id, e] of manual) out.set(id, e);
const list = [...out.values()].sort((a, b) => (b.usedBy.length - a.usedBy.length) || ((b.research?.value ?? 0) - (a.research?.value ?? 0)));
writeFileSync(FILE, JSON.stringify(list, null, 1) + '\n');
console.log(`${list.length} sources (${list.filter((s) => s.watch).length} watched, ${list.filter((s) => s.usedBy.length).length} used on the site)`);
