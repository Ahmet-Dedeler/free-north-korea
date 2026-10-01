// Builds the map's data layers from data/raw/* (see scripts/scrape/) into public/layers/*.geojson,
// plus src/content/layers.json (the manifest the map UI reads: counts, sources, dates).
//   node scripts/build-layers.ts
//
// Safety rules (from docs/research/camps.md):
//   - Never publish NKDB points that are a person's home ("The victim's house", "A chinese's house").
//   - Violation sites that aren't facilities (markets, fields, schools, riverbanks: often execution sites) are only
//     counted per county, never pinned, so they can't be used to find and destroy evidence.
//   - No free-text incident narratives (they can contain surnames); only counts by right violated.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { PLACES, ESCAPE_ROUTE } from '../src/content/places.ts';

type Any = Record<string, any>;
type Pt = [number, number];
const read = (f: string) => JSON.parse(readFileSync(f, 'utf8'));
const OUT = 'public/layers/';
mkdirSync(OUT, { recursive: true });

// ---------- geometry helpers ----------
function inRing(pt: Pt, ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function inGeom(pt: Pt, g: Any) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return polys.some((poly: number[][][]) => inRing(pt, poly[0]) && !poly.slice(1).some((h) => inRing(pt, h)));
}
const km = (a: Pt, b: Pt) => {
  const r = Math.PI / 180;
  const x = (b[0] - a[0]) * r * Math.cos(((a[1] + b[1]) / 2) * r);
  const y = (b[1] - a[1]) * r;
  return Math.sqrt(x * x + y * y) * 6371;
};
const point = (lon: number, lat: number, properties: Any) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [lon, lat] }, properties });
const fc = (features: Any[]) => ({ type: 'FeatureCollection', features });
const write = (name: string, data: Any) => writeFileSync(OUT + name + '.geojson', JSON.stringify(data));

// ---------- counties ----------
const admin2 = read('data/raw/admin/admin2.geojson');
const admin1 = read('data/raw/admin/admin1.geojson');
const pop = read('data/raw/admin/population.json');
const num = (v: unknown) => (v === undefined || v === null || v === '' ? null : Number(String(v).replace(/[^\d.]/g, '')) || null);
const popBy = new Map<string, Any>(pop.counties.map((c: Any) => [c.ADM2_PCODE, c]));
const counties = admin2.features.map((f: Any) => {
  const p = f.properties;
  const c = popBy.get(p.adm2_pcode);
  return {
    f,
    pcode: p.adm2_pcode,
    name: p.adm2_name,
    province: p.adm1_name,
    area: Math.round(p.area_sqkm),
    pop: num(c?.T_TL),
    urban: num(c?.U_TL),
    rural: num(c?.R_TL),
    male: num(c?.M_TL),
    female: num(c?.F_TL),
    markets: 0,
    detention: 0,
    incidents: 0,
    rights: {} as Record<string, number>,
    decades: {} as Record<string, number>,
  };
});
const countyOf = (lon: number, lat: number) => counties.find((c: Any) => inGeom([lon, lat], c.f.geometry)) ?? null;

// ---------- NKDB Visual Atlas: classify locations ----------
const va = read('data/raw/visualatlas/locations.json') as Any[];
const vaInc = read('data/raw/visualatlas/incidents.json');
const HOME = /house|home|residence/i;
const FACILITY = /\b(MPS|MSS|PSBDC|prison|camp|holding|detention|police station|labou?r training|re-?education|kyohwaso|kwanliso|defen[cs]e security|interrogation|bowibu|anjeonbu|correctional)\b/i;
const incidentsAt = new Map<string, Any[]>();
for (const i of vaInc.incidents) for (const s of i.location) incidentsAt.set(s, [...(incidentsAt.get(s) ?? []), i]);
const rightsLabel = vaInc.labels.rights as Record<string, string>;
const decadeLabel = vaInc.labels.decade as Record<string, string>;
// only top-level rights (the label starts with "Right" / "Rights")
const topRight = (slugs: string[]) => slugs.map((s) => rightsLabel[s]?.trim()).find((l) => l && /^(right|reproductive)/i.test(l)) ?? null;

const vaFacilities: Any[] = [];
let droppedHomes = 0;
for (const l of va) {
  const inc = incidentsAt.get(l.slug) ?? [];
  const county = countyOf(l.lng, l.lat);
  if (county) {
    county.incidents += inc.length;
    for (const i of inc) {
      const r = topRight(i.rights);
      if (r) county.rights[r] = (county.rights[r] ?? 0) + 1;
      const d = decadeLabel[i.decade[0]];
      if (d) county.decades[d] = (county.decades[d] ?? 0) + 1;
    }
  }
  if (HOME.test(l.label)) {
    droppedHomes++;
    continue;
  }
  if (!FACILITY.test(l.label) || /unknown/i.test(l.label)) continue; // aggregated only
  vaFacilities.push({ ...l, incidents: inc.length, inChina: !county });
}

// ---------- detention facilities: Korea Future (NKPD) + NKDB, de-duplicated ----------
const nkpd = read('data/raw/nkpd/facilities.json');
const TYPE_MAP: [RegExp, string][] = [
  [/political prison/i, 'Political prison camp'],
  [/re-?education|kyohwaso|prison/i, 'Prison (kyohwaso)'],
  [/holding/i, 'Holding centre'],
  [/labou?r training/i, 'Labour training camp'],
  [/detention|waiting room|interrogation/i, 'Detention / interrogation'],
  [/office|MPS|MSS|police/i, 'Security office'],
];
const typeOf = (s: string) => TYPE_MAP.find(([re]) => re.test(s))?.[1] ?? 'Other facility';
const agencyOf = (s: string) => (/MSS|state security|bowibu|defen[cs]e security/i.test(s) ? 'Ministry of State Security' : /MPS|people'?s security|social security|police/i.test(s) ? 'Ministry of Social Security (police)' : null);

const detention: Any[] = [];
for (const f of nkpd.facilities.filter((f: Any) => f.lat)) {
  detention.push({
    name: f.name,
    type: typeOf(`${f.type} ${f.name}`),
    agency: f.agency ?? agencyOf(f.name),
    province: f.province,
    status: f.status && f.status !== 'Unknown' ? f.status : null,
    lon: f.lon,
    lat: f.lat,
    incidents: 0,
    sources: [{ name: 'Korea Future (NKPD)', url: f.url }],
  });
}
for (const v of vaFacilities.filter((v) => !v.inChina)) {
  const name = v.label.replace(/\s*\((Unconfirmed|Confirmed)\)\s*$/i, '').trim();
  const type = typeOf(name);
  // same kind of facility within 1.5 km is almost certainly the same place
  const dup = detention.find((d) => d.type === type && km([d.lon, d.lat], [v.lng, v.lat]) < 1.5);
  const src = { name: 'NKDB Visual Atlas', url: 'https://www.visualatlas.org/en/density' };
  if (dup) {
    dup.incidents += v.incidents;
    dup.sources.push(src);
  } else {
    detention.push({ name, type, agency: agencyOf(name), province: null, status: null, confirmed: !/unconfirmed/i.test(v.label), lon: v.lng, lat: v.lat, incidents: v.incidents, sources: [src] });
  }
}
// political prison camps live in their own layer
const camps = read('data/raw/hrnk/camps.json').camps as Any[];
const curatedCamps = PLACES.filter((p) => p.category === 'camp');
const campNo = (s: string) => s.match(/(?:Camp|No\.)\s*(\d+)/i)?.[1] ?? null;
const campFeatures = camps.map((c, i) => {
  const [name, province] = c.name.split('\n').map((x: string) => x.replace(/\u00a0/g, ' ').trim());
  // match our curated entry by camp number (Camp 14 / No. 12), not by distance: camps 14 and 18 are 3 km apart
  const no = campNo(name);
  const near = curatedCamps.find((p) => no && campNo(p.name) === no && /kyo-?hwa-?so/i.test(name) === /kyohwaso/i.test(p.name));
  const desc = c.description.replace(/\s+/g, ' ').trim();
  const prisoners = desc.match(/Estimated # of Prisoners:\s*([\d,]+)/i)?.[1]?.replace(/,/g, '');
  // HRNK descriptions start with "Place, Province, coordinates." then the useful part
  const text = desc
    .replace(/^.*?\d{2,3}[.°][^A-Z]*?(?:E|\d)\.?\s+/, '')
    .replace(/Estimated # of Prisoners:\s*[\w,]+/i, '')
    .trim();
  const closed = /closed|dismantl|abolish|emptied/i.test(desc) || /closed/i.test(near?.status ?? '');
  const kind = /kyo-?hwa-?so|prison\b/i.test(name) ? 'Prison (kyohwaso)' : 'Political prison camp (kwanliso)';
  return point(c.lon, c.lat, {
    id: `camp-${i}`,
    name: near?.name ?? name,
    province: province ?? null,
    kind,
    prisoners: prisoners ? Number(prisoners) : null,
    status: near?.status ?? (closed ? 'Reported closed' : 'Operating (per HRNK)'),
    note: near?.note ?? (text.slice(0, 500) || null),
    sources: JSON.stringify([{ name: 'HRNK prison camp map', url: 'https://www.hrnk.org/' }, ...(near?.source ? [{ name: near.source.label, url: near.source.url }] : [])]),
    more: near?.more ?? '/learn/north-korea-prison-camps',
  });
});
const detentionFeatures = detention
  .filter((d) => !(['Political prison camp', 'Prison (kyohwaso)'].includes(d.type) && campFeatures.some((c) => km(c.geometry.coordinates as Pt, [d.lon, d.lat]) < 3)))
  .map((d, i) => point(d.lon, d.lat, { id: `det-${i}`, ...d, lon: undefined, lat: undefined, sources: JSON.stringify(d.sources) }));
for (const d of detention) {
  const c = countyOf(d.lon, d.lat);
  if (c) c.detention++;
}
const chinaDetention = vaFacilities
  .filter((v) => v.inChina)
  .map((v, i) =>
    point(v.lng, v.lat, {
      id: `cn-${i}`,
      name: v.label.replace(/\s*\((Unconfirmed|Confirmed)\)\s*$/i, '').replace(/PSBDC/g, 'Public Security Bureau detention centre'),
      incidents: v.incidents,
      sources: JSON.stringify([{ name: 'NKDB Visual Atlas', url: 'https://www.visualatlas.org/en/forced-repatriation' }]),
    }),
  );

// ---------- markets ----------
const markets = read('data/raw/markets/markets.json').markets as Any[];
for (const m of markets) {
  const c = countyOf(m.lon, m.lat);
  if (c) c.markets++;
}
const marketFeatures = markets.map((m) => point(m.lon, m.lat, { id: `mkt-${m.id}`, ...m, lon: undefined, lat: undefined }));

// ---------- missile bases + curated sites ----------
const bases = read('data/raw/missile-bases/bases.json').bases as Any[];
const baseFeatures = bases.map((b, i) => point(b.lon, b.lat, { id: `base-${i}`, name: b.name, published: b.published, summary: b.summary, url: b.url }));
const siteFeatures = PLACES.filter((p) => p.category !== 'camp').map((p) =>
  point(p.lon, p.lat, { id: p.id, name: p.name, category: p.category, status: p.status ?? null, note: p.note, approx: Boolean(p.approx), source: p.source ? JSON.stringify(p.source) : null, more: p.more ?? null }),
);

// tag every point with its county so the map can list what's inside a county
for (const f of [...campFeatures, ...detentionFeatures, ...marketFeatures, ...baseFeatures, ...siteFeatures] as Any[]) {
  const [lon, lat] = f.geometry.coordinates;
  f.properties.county = countyOf(lon, lat)?.pcode ?? null;
}

// ---------- write ----------
const countyFeatures = counties.map((c: Any) => ({
  type: 'Feature',
  geometry: c.f.geometry,
  properties: {
    pcode: c.pcode,
    name: c.name,
    province: c.province,
    area: c.area,
    pop: c.pop,
    urban: c.urban,
    rural: c.rural,
    male: c.male,
    female: c.female,
    density: c.pop && c.area ? Math.round(c.pop / c.area) : null,
    markets: c.markets,
    detention: c.detention,
    incidents: c.incidents,
    rights: JSON.stringify(Object.entries(c.rights).sort((a, b) => (b[1] as number) - (a[1] as number))),
    decades: JSON.stringify(c.decades),
  },
}));
write('counties', fc(countyFeatures));
write('provinces', fc(admin1.features.map((f: Any) => ({ ...f, properties: { name: f.properties.adm1_name, pcode: f.properties.adm1_pcode } }))));
write('camps', fc(campFeatures));
write('detention', fc(detentionFeatures));
write('china-detention', fc(chinaDetention));
write('markets', fc(marketFeatures));
write('missile-bases', fc(baseFeatures));
write('sites', fc(siteFeatures));
write(
  'escape-route',
  fc([
    { type: 'Feature', properties: { kind: 'land' }, geometry: { type: 'LineString', coordinates: ESCAPE_ROUTE.slice(0, -1).map((w) => [w.lon, w.lat]) } },
    { type: 'Feature', properties: { kind: 'air' }, geometry: { type: 'LineString', coordinates: ESCAPE_ROUTE.slice(-2).map((w) => [w.lon, w.lat]) } },
    ...ESCAPE_ROUTE.map((w, i) => point(w.lon, w.lat, { name: `${i + 1}. ${w.name}`, note: w.note })),
  ]),
);

const date = (s: string) => s?.slice(0, 10) ?? null;
const manifest = {
  built: new Date().toISOString().slice(0, 10),
  totals: {
    population2008: counties.reduce((n: number, c: Any) => n + (c.pop ?? 0), 0),
    incidents: vaInc.incidents.length,
    incidentsMapped: counties.reduce((n: number, c: Any) => n + c.incidents, 0),
    homesWithheld: droppedHomes,
  },
  layers: {
    counties: { count: counties.length, sources: [{ name: 'UN OCHA COD-AB boundaries', url: 'https://data.humdata.org/dataset/cod-ab-prk', updated: '2026-08-14' }, { name: '2008 DPRK census via OCHA COD-PS', url: 'https://data.humdata.org/dataset/cod-ps-prk', updated: date(pop.scrapedAt) }] },
    camps: { count: campFeatures.length, sources: [{ name: 'HRNK prison camp location map', url: 'https://www.hrnk.org/', updated: date(read('data/raw/hrnk/camps.json').scrapedAt) }] },
    detention: {
      count: detentionFeatures.length,
      sources: [
        { name: 'Korea Future, North Korean Prison Database', url: 'https://nkpd.io', updated: date(nkpd.scrapedAt) },
        { name: 'NKDB Visual Atlas', url: 'https://www.visualatlas.org', updated: date(vaInc.scrapedAt) },
      ],
    },
    'china-detention': { count: chinaDetention.length, sources: [{ name: 'NKDB Visual Atlas (forced repatriation)', url: 'https://www.visualatlas.org/en/forced-repatriation', updated: date(vaInc.scrapedAt) }] },
    markets: { count: marketFeatures.length, sources: [{ name: 'CSIS Beyond Parallel market study (2018)', url: 'https://beyondparallel.csis.org/markets-in-north-korea/', updated: '2018-08' }] },
    'missile-bases': { count: baseFeatures.length, sources: [{ name: 'CSIS Beyond Parallel, Undeclared North Korea', url: 'https://beyondparallel.csis.org/', updated: date(read('data/raw/missile-bases/bases.json').scrapedAt) }] },
    sites: { count: siteFeatures.length, sources: [{ name: 'Curated, Wikipedia coordinates', url: 'https://github.com/Ahmet-Dedeler/free-north-korea/blob/main/src/content/places.ts', updated: null }] },
  },
};
writeFileSync('src/content/layers.json', JSON.stringify(manifest, null, 1) + '\n');
console.log(
  `counties ${counties.length} (pop ${manifest.totals.population2008.toLocaleString()}), camps ${campFeatures.length}, detention ${detentionFeatures.length}, ` +
    `china ${chinaDetention.length}, markets ${marketFeatures.length}, bases ${baseFeatures.length}, sites ${siteFeatures.length}; ` +
    `incidents mapped ${manifest.totals.incidentsMapped}/${vaInc.incidents.length}, homes withheld ${droppedHomes}`,
);
