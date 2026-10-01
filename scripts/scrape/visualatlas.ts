// NKDB Visual Atlas (visualatlas.org): geolocated human rights violation sites and the incidents behind them.
// The site sits behind Vercel's bot checkpoint, so we drive a real headless Chrome and call its own endpoints
// from inside the page:
//   POST /en/api/posts/pool?page=N {"keys":["incidents"]} → incidents, 8 per page (3,600+ total)
//   GET  /en/<view>/__data.json                      → SvelteKit page data with the location markers (devalue format)
// Output: data/raw/visualatlas/{incidents,locations}.json  (raw, unfiltered; safety filtering happens in build-layers)
//   node scripts/scrape/visualatlas.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const OUT = 'data/raw/visualatlas/';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.goto('https://www.visualatlas.org/en', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000); // let the checkpoint cookie settle

// Incidents come 8 per page (?page=N). We keep only structured fields (rights, perpetrator, decade, location)
// and never the free-text narrative, which can contain victims' surnames. Details stay on NKDB's site.
type Sel = { selected?: { items: { slug: string }[] }; objets?: { items: { slug: string; fields: { title: { value: string } } }[] } };
const labels: Record<string, Record<string, string>> = { rights: {}, perpetrator: {}, decade: {}, location: {} };
const incidents: { id: string; rights: string[]; perpetrator: string[]; decade: string[]; location: string[] }[] = [];
for (let n = 1; ; n++) {
  const items = (await page.evaluate(async (n) => {
    const res = await fetch(`/en/api/posts/pool?page=${n}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ keys: ['incidents'], creatable: false, admin: false }),
    });
    return (await res.json()).data?.items ?? [];
  }, n)) as { fields: Record<string, Sel & { value?: string }> }[];
  if (!items.length) break;
  for (const it of items) {
    const row = { id: it.fields.incidentId?.value ?? '', rights: [] as string[], perpetrator: [] as string[], decade: [] as string[], location: [] as string[] };
    for (const k of ['rights', 'perpetrator', 'decade', 'location'] as const) {
      const f = it.fields[k];
      row[k] = f?.selected?.items.map((i) => i.slug) ?? [];
      for (const o of f?.objets?.items ?? []) if (o.fields?.title?.value) labels[k][o.slug] = o.fields.title.value;
    }
    incidents.push(row);
  }
  if (n % 50 === 0) console.log(`  page ${n}: ${incidents.length} incidents`);
  await page.waitForTimeout(150); // be polite
}

const views = ['density', 'forced-repatriation', 'theme'];
const pages: Record<string, unknown> = {};
for (const v of views) pages[v] = await page.evaluate(async (v) => (await fetch(`/en/${v}/__data.json`)).json(), v);
await browser.close();

/**
 * SvelteKit's devalue format: each node's `data` is a flat array where objects hold indexes into that array.
 * We look for objects shaped like {slug, label, map, count} and resolve their fields.
 */
type Loc = { slug: string; label: string; count: number | null; lat: number; lng: number; view: string };
const locs = new Map<string, Loc>();
for (const [view, raw] of Object.entries(pages)) {
  for (const node of (raw as { nodes?: { data?: unknown[] }[] }).nodes ?? []) {
    const data = node?.data;
    if (!Array.isArray(data)) continue;
    for (const item of data) {
      if (!item || typeof item !== 'object' || !('slug' in item) || !('map' in item) || !('label' in item)) continue;
      const it = item as Record<string, number>;
      const slug = data[it.slug] as string;
      const label = data[it.label] as string;
      let map = data[it.map] as unknown;
      if (typeof map === 'string') {
        try {
          map = JSON.parse(map);
        } catch {
          continue;
        }
      }
      const m = map as { markers?: { lat: number; lng: number }[]; center?: { lat: number; lng: number } };
      const pt = m?.markers?.[0] ?? m?.center;
      if (!slug || !pt || locs.has(slug)) continue;
      locs.set(slug, { slug, label, count: typeof it.count === 'number' ? ((data[it.count] as number) ?? null) : null, lat: pt.lat, lng: pt.lng, view });
    }
  }
}

writeFileSync(OUT + 'incidents.json', JSON.stringify({ scrapedAt: new Date().toISOString(), labels, incidents }));
writeFileSync(OUT + 'locations.json', JSON.stringify([...locs.values()], null, 1));
console.log(`visualatlas: ${locs.size} locations, ${incidents.length} incidents`);
