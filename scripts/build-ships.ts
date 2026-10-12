// Builds data/ships.json (behind /sanctions/ships) from Global Fishing Watch (GFW), keeping everything it fetches in
// a permanent archive first (data/archive/gfw, see data/archive/README.md). GFW serves a moving window and can
// reprocess its data; the archive is our own dated record, and the page is built from it.
//   node scripts/build-ships.ts              weekly run: refreshes the last few months
//   node scripts/build-ships.ts --backfill   also fetches everything back to 2012 (port visits) and 2017 (radar)
// Needs GFW_API_TOKEN (read from .env.local when not set). The first run on an empty archive backfills by itself.
//
// What we fetch, and what we keep:
// - Vessel identity (`public-global-vessel-identity`) for every IMO number on a North Korea sanctions list
//   (data/sanctions.json: US, UK, EU, Japan). Only records that broadcast the listed IMO itself: AIS is
//   self-reported, and a record with the same MMSI but no IMO could be another ship. → gfw/identities
// - Port visits (`public-global-port-visits-events`, confidence 3-4 on GFW's 1-4 scale) of those ships anywhere,
//   and of every vessel at a North Korean anchorage. → gfw/port-visits/<start year>.jsonl
// - SAR presence (`public-global-sar-presence`): Sentinel-1 radar vessel detections in North Korea's EEZ (8328),
//   matched to AIS where GFW can, at its LOW (0.1°) grid. Monthly totals, the 0.1° grid counts, and the matched
//   vessels per month. The fine grid is never stored: most of its cells are single detections.
//   → gfw/sar-months, gfw/sar-grid/<year>.jsonl, gfw/sar-vessels/<year>.jsonl
// - Sentinel-1 passes per month over the same waters, from the Microsoft Planetary Computer catalog (no key).
//
// GFW's license (https://globalfishingwatch.org/our-apis/documentation/docs/license-rate-limits.md) is CC BY-NC 4.0
// with attribution on every page and file that uses the data. Quota is 50,000 requests a day per user; a weekly
// run makes about 250, a full backfill about 400.
//
// Refuses to write the page file if fewer than half the listed IMO numbers resolve (a failed or truncated answer).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { mergeArchive, readArchive } from './archive.ts';

const OUT = 'data/ships.json';
const API = 'https://gateway.api.globalfishingwatch.org/v3';
const NK_EEZ = 8328;
/** Months the page shows in its tables and monthly chart. */
const MONTHS = 12;
/** Port visits and radar months this recent are refetched every run: GFW keeps filling them in for weeks. */
const REFRESH_DAYS = 120;
const VISITS_FROM = '2012-01-01';
const SAR_FROM = '2017-01-01';
const BACKFILL = process.argv.includes('--backfill');

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

// ---------- archive records ----------
interface IdentityRec {
  gfwId: string;
  imo: string;
  name: string;
  flag: string | null;
  mmsi: string;
  first: string;
  last: string;
}
interface VisitRec {
  /** mmsi|anchorage|start hour: GFW can change its event ids when it reprocesses, so they are not the key. */
  key: string;
  gfwId: string;
  vesselId: string;
  mmsi: string;
  name: string;
  flag: string | null;
  /** GFW's vessel type ("cargo", "fishing", "gear", "other", ...). */
  vtype: string;
  /** Set when the visit was fetched for a listed ship: the listed IMO number. */
  imo?: string;
  start: string;
  end: string;
  port: string;
  portId: string;
  /** ISO 3166 alpha-3 of the anchorage. */
  country: string;
  lat: number;
  lon: number;
  confidence: number;
  hours: number;
}
interface SarMonthRec {
  month: string;
  detections: number;
  matched: number;
  flags: Record<string, number>;
  passes: number;
}
interface SarCellRec {
  month: string;
  lat: number;
  lon: number;
  detections: number;
  matched: number;
}
interface SarVesselRec {
  month: string;
  vesselId: string;
  imo: string;
  mmsi: string;
  name: string;
  flag: string;
  vtype: string;
  detections: number;
}

// ---------- helpers ----------
async function get(path: string, init?: RequestInit, tries = 4): Promise<any> {
  for (let i = 1; ; i++) {
    const r = await fetch(API + path, {
      ...init,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    if (r.ok) return r.json();
    if (i >= tries || (r.status < 500 && r.status !== 429)) throw new Error(`${r.status} ${path.slice(0, 80)}: ${(await r.text()).slice(0, 200)}`);
    await new Promise((res) => setTimeout(res, 2000 * i));
  }
}
async function inBatches<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += n) await Promise.all(items.slice(i, i + n).map(fn));
}

const day = (s?: string | null) => (s ? s.slice(0, 10) : '');
const iso = (d: Date) => d.toISOString().slice(0, 10);
const today = new Date();
const END = iso(today);
const REFRESH_FROM = iso(new Date(today.getTime() - REFRESH_DAYS * 864e5));
// The page window: 11 whole months plus the current one.
const START = iso(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - (MONTHS - 1), 1)));
const clean = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();

function visitRec(e: any, imo?: string): VisitRec | null {
  const pv = e.port_visit ?? {};
  const a = pv.intermediateAnchorage ?? pv.startAnchorage ?? {};
  const confidence = Number(pv.confidence);
  if (confidence < 3) return null;
  const v = e.vessel ?? {};
  return {
    key: `${v.ssvid ?? ''}|${a.anchorageId ?? a.id ?? ''}|${(e.start ?? '').slice(0, 13)}`,
    gfwId: e.id,
    vesselId: v.id ?? '',
    mmsi: v.ssvid ?? '',
    name: clean(v.name),
    flag: v.flag ?? null,
    vtype: v.type ?? '',
    ...(imo && { imo }),
    start: (e.start ?? '').slice(0, 16),
    end: (e.end ?? '').slice(0, 16),
    port: clean(a.name),
    portId: a.id ?? a.anchorageId ?? '',
    country: a.flag ?? '',
    lat: Math.round((a.lat ?? e.position?.lat ?? 0) * 1e4) / 1e4,
    lon: Math.round((a.lon ?? e.position?.lon ?? 0) * 1e4) / 1e4,
    confidence,
    hours: Math.round((pv.durationHrs ?? 0) * 10) / 10,
  };
}

const sanctions = JSON.parse(readFileSync('data/sanctions.json', 'utf8')) as {
  fetched: string;
  targets: Target[];
};
const listed = sanctions.targets.filter((t) => t.kind === 'vessel' && t.imo?.length).flatMap((t) => t.imo!.map((imo) => ({ t, imo })));

// ================= 1. fetch into the archive =================

// ---------- identities of listed ships ----------
const identities: IdentityRec[] = [];
await inBatches(listed, 4, async ({ imo }) => {
  const q = new URLSearchParams({
    where: `imo="${imo}"`,
    'datasets[0]': 'public-global-vessel-identity:latest',
  });
  const res = await get(`/vessels/search?${q}`);
  for (const r of (res.entries ?? []).flatMap((e: any) => e.selfReportedInfo ?? []))
    if (r.imo === imo)
      identities.push({
        gfwId: r.id,
        imo,
        name: clean(r.shipname),
        flag: r.flag ?? null,
        mmsi: r.ssvid ?? '',
        first: day(r.transmissionDateFrom),
        last: day(r.transmissionDateTo),
      });
});
const resolved = new Set(identities.map((i) => i.imo)).size;
if (resolved < listed.length * 0.5) throw new Error(`only ${resolved} of ${listed.length} listed IMO numbers found in GFW; refusing to continue`);
const idStats = mergeArchive('gfw/identities', identities, {
  key: (r) => r.gfwId,
  partition: () => 'identities',
  order: (a, b) => a.imo.localeCompare(b.imo) || a.first.localeCompare(b.first) || a.gfwId.localeCompare(b.gfwId),
});

// ---------- port visits of listed ships, anywhere ----------
const archivedVisits = readArchive<VisitRec>('gfw/port-visits');
const imosWithHistory = new Set(archivedVisits.flatMap((v) => (v.imo ? [v.imo] : [])));
const listedVisits: VisitRec[] = [];
const idsByImo = new Map<string, string[]>();
for (const i of identities) idsByImo.set(i.imo, [...(idsByImo.get(i.imo) ?? []), i.gfwId]);
await inBatches([...idsByImo], 4, async ([imo, ids]) => {
  // A ship we have no history for gets all of it once; after that, only the recent months.
  const from = BACKFILL || !imosWithHistory.has(imo) ? VISITS_FROM : REFRESH_FROM;
  for (let offset: number | null = 0; offset !== null;) {
    const p = new URLSearchParams({
      'datasets[0]': 'public-global-port-visits-events:latest',
      'start-date': from,
      'end-date': END,
      limit: '500',
      offset: String(offset),
    });
    ids.forEach((id, i) => p.set(`vessels[${i}]`, id));
    const ev = await get(`/events?${p}`);
    for (const e of ev.entries ?? []) {
      const v = visitRec(e, imo);
      if (v) listedVisits.push(v);
    }
    offset = ev.nextOffset ?? null;
  }
});

// ---------- port visits at North Korean anchorages, every vessel ----------
// The EEZ query also returns Dandong (China) and other ports near the border, so only anchorages GFW puts in
// North Korea are kept.
const nkVisits: VisitRec[] = [];
const hasNk = archivedVisits.some((v) => v.country === 'PRK' && !v.imo);
const nkFrom = BACKFILL || !hasNk ? VISITS_FROM : REFRESH_FROM;
for (let y = +nkFrom.slice(0, 4); y <= today.getUTCFullYear(); y++) {
  const from = y === +nkFrom.slice(0, 4) ? nkFrom : `${y}-01-01`;
  const to = y === today.getUTCFullYear() ? END : `${y}-12-31`;
  for (let offset: number | null = 0; offset !== null;) {
    const body = {
      datasets: ['public-global-port-visits-events:latest'],
      startDate: from,
      endDate: to,
      confidences: ['3', '4'],
      region: { dataset: 'public-eez-areas', id: NK_EEZ },
    };
    const ev = await get(`/events?limit=1000&offset=${offset}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    for (const e of ev.entries ?? []) {
      const v = visitRec(e);
      if (v && v.country === 'PRK') nkVisits.push(v);
    }
    offset = ev.nextOffset ?? null;
  }
}
const visitStats = mergeArchive('gfw/port-visits', [...nkVisits, ...listedVisits], {
  key: (r) => r.key,
  partition: (r) => r.start.slice(0, 4),
  order: (a, b) => a.start.localeCompare(b.start) || a.key.localeCompare(b.key),
});

// ---------- satellite radar in North Korea's EEZ ----------
const archivedMonths = readArchive<SarMonthRec>('gfw/sar-months');
const sarFrom = BACKFILL || !archivedMonths.length ? SAR_FROM : iso(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 3, 1)));
const months = new Map<string, SarMonthRec>();
const cells = new Map<string, SarCellRec>();
const vessels = new Map<string, SarVesselRec>();
let radarThrough = '';
// A 4Wings report covers at most 366 days, so the range goes in calendar-year pieces.
for (let y = +sarFrom.slice(0, 4); y <= today.getUTCFullYear(); y++) {
  const from = y === +sarFrom.slice(0, 4) ? sarFrom : `${y}-01-01`;
  const to = y === today.getUTCFullYear() ? END : `${y + 1}-01-01`;
  const q = new URLSearchParams({
    'spatial-resolution': 'LOW',
    'temporal-resolution': 'MONTHLY',
    'datasets[0]': 'public-global-sar-presence:latest',
    'date-range': `${from},${to}`,
    format: 'JSON',
  });
  const sar = await get(`/4wings/report?${q}`, {
    method: 'POST',
    body: JSON.stringify({
      region: { dataset: 'public-eez-areas', id: NK_EEZ },
    }),
  });
  const rows: any[] = (Object.values(sar.entries?.[0] ?? {})[0] as any[]) ?? [];
  for (const r of rows) {
    const n = r.detections ?? 0;
    const m: SarMonthRec = months.get(r.date) ?? {
      month: r.date,
      detections: 0,
      matched: 0,
      flags: {},
      passes: 0,
    };
    const ck = `${r.date}|${r.lat}|${r.lon}`;
    const c = cells.get(ck) ?? {
      month: r.date,
      lat: Math.round(r.lat * 10) / 10,
      lon: Math.round(r.lon * 10) / 10,
      detections: 0,
      matched: 0,
    };
    m.detections += n;
    c.detections += n;
    if (r.vesselId) {
      m.matched += n;
      c.matched += n;
      const f = r.flag || 'unknown';
      m.flags[f] = (m.flags[f] ?? 0) + n;
      const vk = `${r.date}|${r.vesselId}`;
      const v = vessels.get(vk) ?? {
        month: r.date,
        vesselId: r.vesselId,
        imo: r.imo ?? '',
        mmsi: r.mmsi ?? '',
        name: clean(r.shipName),
        flag: r.flag ?? '',
        vtype: (r.vesselType ?? '').toLowerCase(),
        detections: 0,
      };
      v.detections += n;
      vessels.set(vk, v);
    }
    if ((r.exitTimestamp ?? '') > radarThrough) radarThrough = r.exitTimestamp;
    months.set(r.date, m);
    cells.set(ck, c);
  }
}
if (!months.size) throw new Error('no SAR rows for the North Korean EEZ; refusing to continue');

// Sentinel-1 passes per month over a box around North Korea's waters (Planetary Computer STAC, no key). A rough
// measure of how often the radar looked; GFW's own scene list isn't public. More passes, more detections.
const EEZ_BOX = [123.6, 37.6, 132.0, 42.9];
const passDays = new Map<string, Set<string>>();
for (
  let next: string | null = 'https://planetarycomputer.microsoft.com/api/stac/v1/search',
    body: any = {
      collections: ['sentinel-1-rtc'],
      bbox: EEZ_BOX,
      datetime: `${sarFrom}T00:00:00Z/${END}T23:59:59Z`,
      limit: 1000,
      fields: { include: ['properties.datetime'] },
    };
  next;
) {
  const r: Response = await fetch(next, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Planetary Computer ${r.status}`);
  const page: any = await r.json();
  for (const f of page.features ?? []) {
    const d = day(f.properties?.datetime);
    (passDays.get(d.slice(0, 7)) ?? passDays.set(d.slice(0, 7), new Set()).get(d.slice(0, 7))!).add(d);
  }
  const link: any = (page.links ?? []).find((l: any) => l.rel === 'next');
  next = link?.href ?? null;
  body = link?.body ?? null;
}
for (const m of months.values()) m.passes = passDays.get(m.month)?.size ?? 0;

const byMonthKey = (a: { month: string }, b: { month: string }) => a.month.localeCompare(b.month);
const sarStats = mergeArchive('gfw/sar-months', [...months.values()], {
  key: (r) => r.month,
  partition: () => 'sar-months',
  order: byMonthKey,
});
mergeArchive('gfw/sar-grid', [...cells.values()], {
  key: (r) => `${r.month}|${r.lat}|${r.lon}`,
  partition: (r) => r.month.slice(0, 4),
  order: (a, b) => byMonthKey(a, b) || a.lat - b.lat || a.lon - b.lon,
});
mergeArchive('gfw/sar-vessels', [...vessels.values()], {
  key: (r) => `${r.month}|${r.vesselId}`,
  partition: (r) => r.month.slice(0, 4),
  order: (a, b) => byMonthKey(a, b) || a.vesselId.localeCompare(b.vesselId),
});

// ================= 2. build the page file from the archive =================
const allIds = readArchive<IdentityRec>('gfw/identities');
const allVisits = readArchive<VisitRec>('gfw/port-visits');
const allMonths = readArchive<SarMonthRec>('gfw/sar-months').sort(byMonthKey);
const allSarVessels = readArchive<SarVesselRec>('gfw/sar-vessels');
const isForeign = (v: VisitRec) => v.country && v.country !== 'PRK';

const ships = listed.map(({ t, imo }) => {
  const ais = allIds
    .filter((i) => i.imo === imo)
    .sort((a, b) => b.last.localeCompare(a.last))
    .map(({ name, flag, mmsi, first, last }) => ({
      name,
      flag,
      mmsi,
      first,
      last,
    }));
  const mine = allVisits.filter((v) => v.imo === imo).sort((a, b) => b.start.localeCompare(a.start));
  return {
    name: t.name,
    imo,
    lists: (Object.keys(t.on) as ListKey[]).sort(),
    ...(t.un && { un: t.un }),
    ais,
    lastSeen: ais[0]?.last || null,
    // A visit that began before the window (a ship sitting in Nampo for years) counts if it ends inside it.
    visits: mine
      .filter((v) => day(v.end) >= START)
      .map((v) => ({
        start: day(v.start),
        end: day(v.end),
        port: v.port,
        country: v.country,
        confidence: v.confidence,
        as: v.name,
        flag: v.flag,
      })),
    history: {
      visits: mine.length,
      foreign: mine.filter(isForeign).length,
      since: mine.length ? day(mine.at(-1)!.start) : null,
    },
    radarMonths: [...new Set(allSarVessels.filter((v) => v.imo === imo && v.month >= START.slice(0, 7)).map((v) => v.month))].sort(),
  };
});

// Every vessel at a North Korean anchorage in the window. AIS has junk: fishing gear buoys that broadcast made-up
// names, and placeholder MMSI numbers. A real ship's MMSI is 9 digits starting with a country code (2-7).
const PLACEHOLDER = /^(\d)\1{8}$|^123456789$|^234567899$|^213000000$/;
const realShip = (v: VisitRec) => v.vtype !== 'gear' && /^[2-7]\d{8}$/.test(v.mmsi) && !PLACEHOLDER.test(v.mmsi);
const listedMmsi = new Map(allIds.map((i) => [i.mmsi, i.imo]));
// Many North Korean anchorages have no name in GFW ("" or "PRK-14"). They get the nearest named port instead
// ("near NAMPO"), from every named North Korean anchorage in the archive.
const unnamed = (n: string) => !n || /^PRK-/.test(n);
const named = new Map<string, { port: string; lat: number; lon: number }>();
// Port towns GFW leaves unnamed, at their Wikipedia coordinates (checked 2026-10-12). GFW's own names win.
const PORT_TOWNS: [string, number, number][] = [
  ['CHONGJIN', 41.7669, 129.7233],
  ['RASON', 42.3444, 130.3844],
  ['HAMHUNG', 39.9167, 127.5333],
  ['KIMCHAEK', 40.6672, 129.2006],
  ['SINPO', 40.0347, 128.1856],
  ['SINUIJU', 40.1, 124.4],
  ['SONGRIM', 38.7542, 125.645],
  ['HAEJU', 38.0333, 125.7167],
  ['WONSAN', 39.1475, 127.4461],
  ['NAMPO', 38.7356, 125.4089],
];
for (const [port, lat, lon] of PORT_TOWNS) named.set(port, { port, lat, lon });
for (const v of allVisits) if (v.country === 'PRK' && !unnamed(v.port)) named.set(v.port, { port: v.port, lat: v.lat, lon: v.lon });
const km = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => Math.hypot((a.lat - b.lat) * 111, (a.lon - b.lon) * 111 * Math.cos((a.lat * Math.PI) / 180));
function portLabel(v: { port: string; lat: number; lon: number }) {
  if (!unnamed(v.port)) return { port: v.port, near: false };
  const n = [...named.values()].sort((a, b) => km(a, v) - km(b, v))[0];
  return n && km(n, v) < 40 ? { port: n.port, near: true } : { port: '', near: false };
}
const inNk = allVisits.filter((v) => v.country === 'PRK' && !v.imo && day(v.end) >= START && realShip(v));
const portMap = new Map<
  string,
  {
    port: string;
    near: boolean;
    portId: string;
    lat: number;
    lon: number;
    visits: number;
    vessels: Set<string>;
    flags: Record<string, number>;
  }
>();
for (const v of inNk) {
  const p = portMap.get(v.portId) ?? {
    ...portLabel(v),
    portId: v.portId,
    lat: v.lat,
    lon: v.lon,
    visits: 0,
    vessels: new Set(),
    flags: {},
  };
  p.visits++;
  p.vessels.add(v.mmsi);
  const f = v.flag ?? 'unknown';
  p.flags[f] = (p.flags[f] ?? 0) + 1;
  portMap.set(v.portId, p);
}
const foreignMap = new Map<
  string,
  {
    name: string;
    mmsi: string;
    flag: string | null;
    vtype: string;
    first: string;
    last: string;
    visits: number;
    ports: Record<string, number>;
    listedImo?: string;
  }
>();
for (const v of inNk) {
  if (!v.flag || v.flag === 'PRK') continue;
  const k = `${v.mmsi}|${v.name}|${v.flag}`;
  const g = foreignMap.get(k) ?? {
    name: v.name,
    mmsi: v.mmsi,
    flag: v.flag,
    vtype: v.vtype,
    first: day(v.start),
    last: day(v.end),
    visits: 0,
    ports: {},
    ...(listedMmsi.has(v.mmsi) && { listedImo: listedMmsi.get(v.mmsi) }),
  };
  g.visits++;
  const l = portLabel(v);
  // "NAMPO", "~NAMPO" (an anchorage near Nampo) or "@39.8,124.2" (no named port within 40 km).
  const pk = l.port ? (l.near ? `~${l.port}` : l.port) : `@${v.lat.toFixed(1)},${v.lon.toFixed(1)}`;
  g.ports[pk] = (g.ports[pk] ?? 0) + 1;
  if (day(v.start) < g.first) g.first = day(v.start);
  if (day(v.end) > g.last) g.last = day(v.end);
  foreignMap.set(k, g);
}

// Radar by year since 2017: detections per day with a pass, so years with more passes don't look busier.
const years = new Map<
  string,
  {
    year: string;
    detections: number;
    matched: number;
    passes: number;
    months: number;
  }
>();
for (const m of allMonths) {
  const y = years.get(m.month.slice(0, 4)) ?? {
    year: m.month.slice(0, 4),
    detections: 0,
    matched: 0,
    passes: 0,
    months: 0,
  };
  y.detections += m.detections;
  y.matched += m.matched;
  y.passes += m.passes;
  y.months++;
  years.set(y.year, y);
}

const data = {
  sanctionsFetched: sanctions.fetched,
  window: { from: START, to: END },
  /** Newest radar detection: GFW's SAR data runs a few days behind. */
  radarThrough: day(radarThrough),
  listedImos: listed.length,
  resolved,
  ships: ships.sort((a, b) => (b.lastSeen ?? '').localeCompare(a.lastSeen ?? '') || a.name.localeCompare(b.name)),
  radar: allMonths.filter((m) => m.month >= START.slice(0, 7)),
  radarYears: [...years.values()].sort((a, b) => a.year.localeCompare(b.year)),
  ports: {
    visits: inNk.length,
    vessels: new Set(inNk.map((v) => v.mmsi)).size,
    foreignVisits: inNk.filter((v) => v.flag && v.flag !== 'PRK').length,
    list: [...portMap.values()].map(({ vessels: vs, ...p }) => ({ ...p, vessels: vs.size })).sort((a, b) => b.visits - a.visits),
    foreign: [...foreignMap.values()].sort((a, b) => b.last.localeCompare(a.last)),
  },
};
const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;
const strip = (o: any) => JSON.stringify({ ...o, fetched: 0, _doc: 0, attribution: 0, sources: 0 });
if (old && strip(old) === strip(data) && (Date.now() - Date.parse(old.fetched)) / 864e5 < 7) {
  console.log('ships: no change');
} else {
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        _doc: 'Built by scripts/build-ships.ts from the archive in data/archive/gfw (Global Fishing Watch API) and data/sanctions.json. Do not edit by hand.',
        fetched: END,
        attribution: 'Powered by Global Fishing Watch (globalfishingwatch.org). Data: GFW vessel identity v4, port visits v4 and SAR vessel detections, CC BY-NC 4.0.',
        sources: {
          gfw: 'https://globalfishingwatch.org/our-apis/',
          license: 'https://globalfishingwatch.org/our-apis/documentation/docs/license-rate-limits.md',
        },
        ...data,
      },
      null,
      1,
    ) + '\n',
  );
}
console.log(
  `archive: identities ${idStats.total} (+${idStats.added}), port visits ${visitStats.total} (+${visitStats.added}, ${visitStats.changed} changed), radar months ${sarStats.total} (+${sarStats.added})`,
);
console.log(
  `ships: ${listed.length} listed IMOs, ${resolved} in GFW, ${ships.filter((s) => s.visits.some((v) => v.country && v.country !== 'PRK')).length} called abroad in the window`,
);
console.log(`North Korean ports in the window: ${data.ports.visits} visits by ${data.ports.vessels} vessels, ${data.ports.foreignVisits} by foreign-flagged ones`);
console.log(`radar by year: ${data.radarYears.map((y) => `${y.year} ${Math.round(y.detections / Math.max(y.passes, 1))}/day`).join(', ')}`);

// ================= 3. map layers for /map =================
// public/layers/ports.geojson: one point per North Korean anchorage with visits in the window, and
// public/layers/radar.geojson: the 0.1° radar grid of the latest whole month, vessels that sent no AIS only. The map
// reads them like the layers from scripts/build-layers.ts; their counts and dates go into src/content/layers.json.
const title = (s: string) => s.toLowerCase().replace(/(^|[\s-])\S/g, (c) => c.toUpperCase());
const portsGeo = {
  type: 'FeatureCollection',
  features: data.ports.list.map((p) => ({
    type: 'Feature',
    properties: {
      id: p.portId,
      name: p.port ? (p.near ? `near ${title(p.port)}` : title(p.port)) : `${p.lat.toFixed(1)}°N ${p.lon.toFixed(1)}°E`,
      port: p.port ? title(p.port) : '',
      near: p.near,
      visits: p.visits,
      vessels: p.vessels,
      // foreign = a flag other than North Korea's; ships that broadcast no flag ("unknown") are neither
      foreign: Object.entries(p.flags).filter(([f]) => f !== 'PRK' && f !== 'unknown').reduce((n, [, v]) => n + v, 0),
      flags: JSON.stringify(p.flags),
    },
    geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
  })),
};
const lastWhole = allMonths.filter((m) => m.month < END.slice(0, 7)).at(-1)?.month ?? '';
const grid = readArchive<SarCellRec>('gfw/sar-grid').filter((c) => c.month === lastWhole && c.detections > c.matched);
// GFW gives each 0.1° cell by its south-west corner.
const sq = (lat: number, lon: number) => [[[lon, lat], [lon + 0.1, lat], [lon + 0.1, lat + 0.1], [lon, lat + 0.1], [lon, lat]].map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10])];
const radarGeo = {
  type: 'FeatureCollection',
  features: grid.map((c) => ({ type: 'Feature', properties: { dark: c.detections - c.matched, all: c.detections }, geometry: { type: 'Polygon', coordinates: sq(c.lat, c.lon) } })),
};
const writeIfChanged = (file: string, text: string) => {
  if (!existsSync(file) || readFileSync(file, 'utf8') !== text) writeFileSync(file, text);
};
writeIfChanged('public/layers/ports.geojson', JSON.stringify(portsGeo));
writeIfChanged('public/layers/radar.geojson', JSON.stringify(radarGeo));
const MANIFEST_FILE = 'src/content/layers.json';
const manifest = JSON.parse(readFileSync(MANIFEST_FILE, 'utf8'));
manifest.layers.ports = { count: portsGeo.features.length, sources: [{ name: 'Global Fishing Watch port visits', url: 'https://globalfishingwatch.org/', updated: END }] };
manifest.layers.radar = { count: radarGeo.features.length, sources: [{ name: 'Global Fishing Watch SAR vessel detections', url: 'https://globalfishingwatch.org/', updated: lastWhole }] };
writeIfChanged(MANIFEST_FILE, JSON.stringify(manifest, null, 1) + '\n');
console.log(`map: ${portsGeo.features.length} ports, ${radarGeo.features.length} radar cells (${lastWhole})`);
