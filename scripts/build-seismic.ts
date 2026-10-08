// Builds data/seismic.json: every seismic event the US Geological Survey (USGS) has in its catalog (ComCat) for a box
// around North Korea, straight from the USGS FDSN event service. Part of the event wire (see AGENTS.md).
//   node scripts/build-seismic.ts
//
// What we keep is what USGS publishes: its own event type ("nuclear explosion", "collapse", "earthquake", ...),
// magnitude and magnitude type, origin time, place text and event page. We never relabel an event: if USGS calls
// it an earthquake, the site shows "earthquake". The only thing we add is the distance from the Punggye-ri test site,
// computed from USGS's coordinates.
//
// The file is rewritten only when the events changed, or when the last download is over 7 days old (so the date on
// the page is never more than a week behind). That keeps the 3-hourly Action from committing when nothing happened.
// It refuses to write if USGS returns fewer than 90% of the events we already have (a truncated or failed answer).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const OUT = 'data/seismic.json';
const UA = 'free-north-korea event wire (+https://github.com/Ahmet-Dedeler/free-north-korea)';

/** North Korea is roughly 37.7-43.0 N, 124.2-130.7 E. The box adds a margin, so it also catches some events in
 *  China, Russia, South Korea and the sea; `place` (USGS's text) says where each one is. */
const BOX = { minlatitude: 37.5, maxlatitude: 43.1, minlongitude: 124.0, maxlongitude: 131.0 };
/** Punggye-ri nuclear test site, same coordinates as src/content/places.ts (Wikipedia). */
const TEST_SITE = { name: 'Punggye-ri', lat: 41.2781, lon: 129.0875 };

const params = new URLSearchParams({
  format: 'geojson',
  starttime: '1900-01-01',
  orderby: 'time',
  ...Object.fromEntries(Object.entries(BOX).map(([k, v]) => [k, String(v)])),
});
const QUERY_URL = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`;

interface SeismicEvent {
  /** USGS event id, e.g. "us2000aert". */
  id: string;
  /** Origin time, ISO 8601 UTC. */
  time: string;
  mag: number | null;
  /** Magnitude type as USGS gives it (mb, mb_lg, ml, mw, ...). */
  magType: string | null;
  /** USGS's own event type, verbatim. */
  type: string;
  /** USGS's place text, verbatim (it writes some Korean names with a "?" where a vowel mark was lost). */
  place: string;
  lat: number;
  lon: number;
  depthKm: number | null;
  /** "reviewed" (checked by a USGS seismologist) or "automatic". */
  status: string;
  /** USGS event page. */
  url: string;
  /** Great-circle distance from the Punggye-ri test site, km, from USGS's coordinates. */
  kmFromTestSite: number;
}

interface UsgsFeature {
  id: string;
  properties: { mag: number | null; magType: string | null; type: string; place: string | null; time: number; status: string; url: string; title: string };
  geometry: { coordinates: [number, number, number | null] };
}

function km(lat1: number, lon1: number, lat2: number, lon2: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** USGS's query service has short outages (500/502); try three times, a minute apart, before giving up. */
async function fetchUsgs(tries = 3): Promise<Response> {
  for (let i = 1; ; i++) {
    const res = await fetch(QUERY_URL, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(60_000) }).catch((e: Error) => e);
    if (res instanceof Response && res.ok) return res;
    const why = res instanceof Response ? `HTTP ${res.status}` : res.message;
    if (i >= tries) throw new Error(`USGS: ${why}`);
    console.warn(`USGS: ${why}, retrying in 60 s`);
    await new Promise((ok) => setTimeout(ok, 60_000));
  }
}

const res = await fetchUsgs();
const geo = (await res.json()) as { features: UsgsFeature[]; metadata: { count: number; status: number } };
if (!Array.isArray(geo.features)) throw new Error('USGS: no features array');

const events: SeismicEvent[] = geo.features
  .map((f) => {
    const [lon, lat, depth] = f.geometry.coordinates;
    const p = f.properties;
    return {
      id: f.id,
      time: new Date(p.time).toISOString(),
      mag: p.mag,
      magType: p.magType,
      type: p.type,
      place: p.place ?? '',
      lat,
      lon,
      depthKm: depth,
      status: p.status,
      url: p.url,
      kmFromTestSite: Math.round(km(TEST_SITE.lat, TEST_SITE.lon, lat, lon) * 10) / 10,
    };
  })
  .sort((a, b) => b.time.localeCompare(a.time));

const previous = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, 'utf8')) as { fetched: string; events: SeismicEvent[] }) : null;
if (previous && events.length < previous.events.length * 0.9) {
  throw new Error(`USGS returned ${events.length} events, we have ${previous.events.length}; refusing to shrink`);
}
if (!events.some((e) => e.type === 'nuclear explosion')) throw new Error('USGS answer has no nuclear explosion events; looks wrong');

const now = new Date();
const changed = !previous || JSON.stringify(previous.events) !== JSON.stringify(events);
const ageDays = previous ? (now.getTime() - new Date(previous.fetched).getTime()) / 86_400_000 : Infinity;
if (!changed && ageDays < 7) {
  console.log(`seismic: ${events.length} events, unchanged since ${previous!.fetched}`);
} else {
  const out = {
    fetched: now.toISOString().replace(/\.\d+Z$/, 'Z'),
    source: { name: 'USGS Earthquake Catalog (ComCat)', publisher: 'U.S. Geological Survey', url: 'https://earthquake.usgs.gov/earthquakes/search/', query: QUERY_URL },
    box: BOX,
    testSite: TEST_SITE,
    events,
  };
  writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  const counts: Record<string, number> = {};
  for (const e of events) counts[e.type] = (counts[e.type] ?? 0) + 1;
  const types = Object.entries(counts).map(([t, n]) => `${n} ${t}`);
  console.log(`seismic: wrote ${events.length} events (${types.join(', ')})${changed ? '' : ' (date refresh only)'}`);
}
