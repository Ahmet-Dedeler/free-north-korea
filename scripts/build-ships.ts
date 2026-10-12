// Builds data/ships.json: every ship on a North Korea sanctions list (data/sanctions.json, UN/US/UK/EU/Japan), as
// Global Fishing Watch (GFW) sees it in AIS, plus monthly counts of vessels that satellite radar finds in North
// Korea's waters (its exclusive economic zone, EEZ). Behind /sanctions/ships.
//   node scripts/build-ships.ts            (needs GFW_API_TOKEN; read from .env.local when not set)
//
// What GFW gives us, and what we keep:
// - Vessel identity (`public-global-vessel-identity`): the names, flags and MMSI numbers a ship has broadcast over
//   AIS, with first and last transmission dates. AIS is self-reported, so we only keep records that broadcast the
//   listed IMO number itself. A record with the same MMSI but no IMO could be another ship, and is left out.
// - Port visits (`public-global-port-visits-events`) of the last 12 months, confidence 3 and 4 only (GFW's scale
//   runs 1-4; 4 means the ship was seen entering, stopping and leaving).
// - SAR presence (`public-global-sar-presence`): Sentinel-1 radar detections of vessels, which GFW matches to AIS
//   where it can. Monthly totals for EEZ 8328 (North Korea), how many matched a broadcasting ship, the flags those
//   ships broadcast, and any listed ship among them. Single detections are never published, only counts.
//
// GFW's license (https://globalfishingwatch.org/our-apis/documentation/docs/license-rate-limits.md) is CC BY-NC 4.0
// with attribution on every page and file that uses the data; `attribution` below goes into the file and onto the
// page. Quota is 50,000 requests a day per user; one run makes about 250. One account only (the terms forbid more).
//
// Refuses to write if fewer than 80% of the listed IMO numbers resolve (a failed or truncated answer) and keeps the
// previous file. Rewrites only when the data changed or the last download is over 7 days old.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const OUT = 'data/ships.json';
const API = 'https://gateway.api.globalfishingwatch.org/v3';
const NK_EEZ = 8328;
const MONTHS = 12;

if (!process.env.GFW_API_TOKEN && existsSync('.env.local'))
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^GFW_API_TOKEN=(.+)$/);
    if (m) process.env.GFW_API_TOKEN = m[1].trim();
  }
const TOKEN = process.env.GFW_API_TOKEN;
if (!TOKEN) throw new Error('GFW_API_TOKEN is not set');

type ListKey = 'UN' | 'US' | 'UK' | 'EU' | 'JP';
interface Target {
  name: string;
  kind: string;
  un?: string;
  on: Partial<Record<ListKey, string[]>>;
  imo?: string[];
}

/** One AIS identity record GFW holds for a listed ship (only records that broadcast the listed IMO). */
interface Identity {
  name: string;
  flag: string | null;
  mmsi: string;
  first: string;
  last: string;
}
interface PortVisit {
  start: string;
  end: string;
  port: string;
  /** ISO 3166 alpha-3 of the port, as GFW gives it. */
  country: string;
  confidence: number;
  /** Name and flag the ship broadcast on this visit. Shown with every visit: an IMO number can be mistyped or
   *  borrowed, so a visit under an unrelated name is a lead, not proof. */
  as: string;
  flag: string | null;
}
export interface Ship {
  name: string;
  imo: string;
  lists: ListKey[];
  un?: string;
  /** Empty when GFW has no AIS record that carries this IMO number. */
  ais: Identity[];
  /** Latest AIS transmission over all identities, ISO date. */
  lastSeen: string | null;
  visits: PortVisit[];
  /** Months (YYYY-MM) in which satellite radar detected this ship inside North Korea's EEZ. */
  radarMonths: string[];
}
export interface RadarMonth {
  month: string;
  /** Vessel detections in the EEZ that month (Sentinel-1, GFW's SAR pipeline). */
  detections: number;
  /** Detections GFW matched to a ship broadcasting AIS. */
  matched: number;
  /** Matched detections by the flag the ship broadcast. */
  flags: Record<string, number>;
  /** Days with a Sentinel-1 pass over the area (Planetary Computer catalog). More passes, more detections. */
  passes: number;
}

async function get(path: string, init?: RequestInit, tries = 4): Promise<any> {
  for (let i = 1; ; i++) {
    const r = await fetch(API + path, {
      ...init,
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...init?.headers },
    });
    if (r.ok) return r.json();
    if (i >= tries || (r.status < 500 && r.status !== 429)) throw new Error(`${r.status} ${path.slice(0, 80)}: ${(await r.text()).slice(0, 200)}`);
    await new Promise((res) => setTimeout(res, 2000 * i));
  }
}

const day = (s?: string | null) => (s ? s.slice(0, 10) : '');
const today = new Date();
// From the first day of the month 11 months back: 11 whole months plus the current one, so no month is cut in
// half at the start, and the span stays under the 366 days a GFW report allows.
const START = day(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - (MONTHS - 1), 1)).toISOString());
const END = day(today.toISOString());

const sanctions = JSON.parse(readFileSync('data/sanctions.json', 'utf8')) as { fetched: string; targets: Target[] };
const listed = sanctions.targets
  .filter((t) => t.kind === 'vessel' && t.imo?.length)
  .flatMap((t) => t.imo!.map((imo) => ({ t, imo })));

// ---------- identities and port visits, one listed IMO at a time ----------
const ships: Ship[] = [];
let resolved = 0;
async function lookUp({ t, imo }: (typeof listed)[number]) {
  const q = new URLSearchParams({ where: `imo="${imo}"`, 'datasets[0]': 'public-global-vessel-identity:latest' });
  const res = await get(`/vessels/search?${q}`);
  const recs = (res.entries ?? []).flatMap((e: any) => e.selfReportedInfo ?? []).filter((r: any) => r.imo === imo);
  if (recs.length) resolved++;
  const ais: Identity[] = recs
    .map((r: any) => ({ name: r.shipname ?? '', flag: r.flag ?? null, mmsi: r.ssvid ?? '', first: day(r.transmissionDateFrom), last: day(r.transmissionDateTo), id: r.id }))
    .sort((a: Identity, b: Identity) => b.last.localeCompare(a.last));

  const visits: PortVisit[] = [];
  if (ais.length) {
    const p = new URLSearchParams({ 'datasets[0]': 'public-global-port-visits-events:latest', 'start-date': START, 'end-date': END, limit: '200', offset: '0' });
    ais.forEach((a: any, i: number) => p.set(`vessels[${i}]`, a.id));
    const ev = await get(`/events?${p}`);
    for (const e of ev.entries ?? []) {
      const pv = e.port_visit ?? {};
      const a = pv.intermediateAnchorage ?? pv.startAnchorage ?? {};
      const confidence = Number(pv.confidence);
      // A visit that started before our window (a ship sitting in Nampo for years) still counts if it ends inside it.
      if (confidence < 3 || day(e.end) < START) continue;
      visits.push({ start: day(e.start), end: day(e.end), port: a.name ?? '', country: a.flag ?? '', confidence, as: (e.vessel?.name ?? '').replace(/\s+/g, ' ').trim(), flag: e.vessel?.flag ?? null });
    }
    visits.sort((a, b) => b.start.localeCompare(a.start));
  }
  ships.push({
    name: t.name,
    imo,
    lists: (Object.keys(t.on) as ListKey[]).sort(),
    ...(t.un && { un: t.un }),
    ais: ais.map(({ id: _id, ...a }: any) => a),
    lastSeen: ais[0]?.last || null,
    visits,
    radarMonths: [],
  });
}
// Four at a time: well inside GFW's quota, and a run takes about a minute instead of four.
for (let i = 0; i < listed.length; i += 4) await Promise.all(listed.slice(i, i + 4).map(lookUp));
if (resolved < listed.length * 0.5)
  // Ships deregistered for years have no AIS at all, so not every IMO resolves; the guard catches a dead API.
  throw new Error(`only ${resolved} of ${listed.length} listed IMO numbers found in GFW; refusing to overwrite`);
const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;
if (old && resolved < old.resolved * 0.8) throw new Error(`only ${resolved} IMO numbers resolved (was ${old.resolved}); refusing to overwrite`);

// ---------- satellite radar in North Korea's EEZ ----------
// The 4Wings report allows at most 366 days per request; 12 months fits in one.
const sarQ = new URLSearchParams({
  'spatial-resolution': 'LOW',
  'temporal-resolution': 'MONTHLY',
  'datasets[0]': 'public-global-sar-presence:latest',
  'date-range': `${START},${END}`,
  format: 'JSON',
});
const sar = await get(`/4wings/report?${sarQ}`, { method: 'POST', body: JSON.stringify({ region: { dataset: 'public-eez-areas', id: NK_EEZ } }) });
const rows: any[] = Object.values(sar.entries?.[0] ?? {})[0] as any[] ?? [];
const byMonth = new Map<string, RadarMonth>();
const byImo = new Map(ships.map((s) => [s.imo, s]));
let newest = '';
for (const r of rows) {
  const m: RadarMonth = byMonth.get(r.date) ?? { month: r.date, detections: 0, matched: 0, flags: {}, passes: 0 };
  m.detections += r.detections ?? 0;
  if (r.vesselId) {
    m.matched += r.detections ?? 0;
    const f = r.flag || 'unknown';
    m.flags[f] = (m.flags[f] ?? 0) + (r.detections ?? 0);
    const s = r.imo && byImo.get(r.imo);
    if (s && !s.radarMonths.includes(r.date)) s.radarMonths.push(r.date);
  }
  if (r.exitTimestamp > newest) newest = r.exitTimestamp;
  byMonth.set(r.date, m);
}
for (const s of ships) s.radarMonths.sort();

// Sentinel-1 passes per month over a box around North Korea's waters, from the Planetary Computer STAC (no key).
// A rough measure of how often the radar looked; GFW's own scene list isn't public.
const EEZ_BOX = [123.6, 37.6, 132.0, 42.9];
const passDays = new Map<string, Set<string>>();
for (let next: string | null = 'https://planetarycomputer.microsoft.com/api/stac/v1/search', body: any = {
  collections: ['sentinel-1-rtc'], bbox: EEZ_BOX, datetime: `${START}T00:00:00Z/${END}T23:59:59Z`, limit: 1000, fields: { include: ['properties.datetime'] },
}; next; ) {
  const r: Response = await fetch(next, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`Planetary Computer ${r.status}`);
  const page: any = await r.json();
  for (const f of page.features ?? []) {
    const d = day(f.properties?.datetime);
    if (!passDays.has(d.slice(0, 7))) passDays.set(d.slice(0, 7), new Set());
    passDays.get(d.slice(0, 7))!.add(d);
  }
  const link: any = (page.links ?? []).find((l: any) => l.rel === 'next');
  next = link?.href ?? null;
  body = link?.body ?? null;
}
for (const m of byMonth.values()) m.passes = passDays.get(m.month)?.size ?? 0;
const radar = [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month));
if (!radar.length) throw new Error('no SAR rows for the North Korean EEZ; refusing to overwrite');

const data = {
  sanctionsFetched: sanctions.fetched,
  window: { from: START, to: END },
  /** Newest radar detection in the report: GFW's SAR data runs a few days behind. */
  radarThrough: day(newest),
  listedImos: listed.length,
  resolved,
  ships: ships.sort((a, b) => (b.lastSeen ?? '').localeCompare(a.lastSeen ?? '') || a.name.localeCompare(b.name)),
  radar,
};
const same = old && JSON.stringify({ ...old, fetched: 0, _doc: 0, attribution: 0, sources: 0 }) === JSON.stringify({ ...data, fetched: 0, _doc: 0, attribution: 0, sources: 0 });
const fresh = old && (Date.now() - Date.parse(old.fetched)) / 864e5 < 7;
if (same && fresh) {
  console.log('ships: no change');
} else {
  const out = {
    _doc: 'Built by scripts/build-ships.ts from the Global Fishing Watch API and data/sanctions.json. Do not edit by hand.',
    fetched: END,
    attribution: 'Powered by Global Fishing Watch (globalfishingwatch.org). Data: GFW vessel identity v4, port visits v4 and SAR vessel detections, CC BY-NC 4.0.',
    sources: {
      gfw: 'https://globalfishingwatch.org/our-apis/',
      license: 'https://globalfishingwatch.org/our-apis/documentation/docs/license-rate-limits.md',
    },
    ...data,
  };
  writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
}
const seen = ships.filter((s) => s.lastSeen && s.lastSeen >= START);
const abroad = ships.filter((s) => s.visits.some((v) => v.country && v.country !== 'PRK'));
console.log(`ships: ${listed.length} listed IMOs, ${resolved} in GFW, ${seen.length} broadcast in the last ${MONTHS} months, ${abroad.length} visited a port outside North Korea`);
console.log(`radar: ${radar.map((m) => `${m.month} ${m.detections}/${m.matched}`).join(', ')}; through ${data.radarThrough}`);
console.log(`listed ships seen by radar in the EEZ: ${ships.filter((s) => s.radarMonths.length).map((s) => s.name).join(', ') || 'none'}`);
