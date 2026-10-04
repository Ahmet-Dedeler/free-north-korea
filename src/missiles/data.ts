/**
 * Data loading + derivation.
 *
 * Source files in public/data are copied verbatim from nagix/nk-missile-tests
 * (CNS North Korea Missile Test Database + CelesTrak). We normalise the messy
 * bits here (numbers stored as strings, "unknown"/"na" sentinels) and compute
 * landing points + flight paths so the UI never has to think about them.
 */

export type Outcome = 'success' | 'failure' | 'unknown';

export type MissileType =
  | 'SRBM'
  | 'MRBM'
  | 'IRBM'
  | 'ICBM'
  | 'SLBM'
  | 'HGV'
  | 'SLV'
  | 'Unknown';

interface RawGlide {
  distance: number;
  'maneuvering-distance'?: number;
  bearing?: number;
}

interface RawTest {
  date: string;
  time: string;
  series?: number;
  missile: string;
  facility: string;
  landing: string;
  apogee: number | string;
  distance: number | string;
  bearing: number;
  outcome: Outcome;
  description: string;
  glide?: RawGlide[];
}

interface RawMissile {
  name: string;
  type: MissileType;
  maneuver?: 'pullup' | 'glide';
}

interface RawFacility {
  name: string;
  lat: number;
  lon: number;
}

export interface Facility extends RawFacility {
  id: string;
}

export interface Missile extends RawMissile {
  id: string;
}

export interface Test {
  id: string; // stable slug, used in the URL hash
  date: string; // YYYY-MM-DD
  year: number;
  time: string | null; // "21:13 UTC" or null when unknown
  /** "2 of 3" style position within a same-day salvo, if any */
  series: number | null;
  seriesSize: number;
  missile: Missile;
  facility: Facility;
  landingRegion: string | null; // human readable
  apogeeKm: number | null;
  distanceKm: number | null;
  bearing: number;
  outcome: Outcome;
  description: string;
  /** [lon, lat] polyline from launch to impact; null when range is unknown */
  path: [number, number][] | null;
  landing: [number, number] | null;
}

export interface Dataset {
  tests: Test[]; // sorted newest first
  facilities: Facility[];
  missiles: Missile[];
  minYear: number;
  maxYear: number;
}

const LANDING_LABELS: Record<string, string> = {
  'sea-of-japan': 'Sea of Japan / East Sea',
  'yellow-sea': 'Yellow Sea / West Sea',
  'pacific-ocean': 'Pacific Ocean',
  'north-korea': 'Inside North Korea',
};

const EARTH_RADIUS_KM = 6378.137;
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function num(v: number | string | undefined): number | null {
  if (v === undefined || v === 'unknown' || v === 'na' || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Great-circle destination from a start point, bearing (deg) and distance (km). */
export function destination(lat: number, lon: number, bearing: number, km: number): [number, number] {
  const phi1 = toRad(lat);
  const l1 = toRad(lon);
  const a = toRad(bearing);
  const d = km / EARTH_RADIUS_KM;
  const phi2 = Math.asin(Math.sin(phi1) * Math.cos(d) + Math.cos(phi1) * Math.sin(d) * Math.cos(a));
  const l2 = l1 + Math.atan2(Math.sin(a) * Math.sin(d) * Math.cos(phi1), Math.cos(d) - Math.sin(phi1) * Math.sin(phi2));
  return [((toDeg(l2) + 540) % 360) - 180, toDeg(phi2)];
}

/** Sample a great-circle segment so it renders as a smooth curve on the map. */
function segment(lat: number, lon: number, bearing: number, km: number, steps = 24): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 1; i <= steps; i++) pts.push(destination(lat, lon, bearing, (km * i) / steps));
  return pts;
}

/**
 * Flight path on the ground. Straight ballistic shots are one great-circle leg.
 * Glide/MaRV tests carry extra legs with a turn in between (ported from the
 * original visualize.js logic).
 */
function buildPath(t: RawTest, f: RawFacility, distance: number, isGlide: boolean): [number, number][] {
  const path: [number, number][] = [[f.lon, f.lat]];
  if (!isGlide || !t.glide) {
    path.push(...segment(f.lat, f.lon, t.bearing, distance, 32));
    return path;
  }
  let [lon, lat] = [f.lon, f.lat];
  let bearing = t.bearing;
  t.glide.forEach((g, i) => {
    const leg = segment(lat, lon, bearing, g.distance);
    path.push(...leg);
    [lon, lat] = leg[leg.length - 1];
    if (i === t.glide!.length - 1 || g.bearing === undefined) return;
    // lateral manoeuvre: arc from old bearing to the new one
    const turnSteps = 8;
    const m = g['maneuvering-distance'] ?? 0;
    for (let s = 1; s <= turnSteps; s++) {
      const b = bearing + ((g.bearing - bearing) * s) / turnSteps;
      [lon, lat] = destination(lat, lon, b, m / turnSteps);
      path.push([lon, lat]);
    }
    bearing = g.bearing;
  });
  return path;
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json() as Promise<T>;
}

type RawTests = { timeBins: { year: number; data: RawTest[] }[] };
type RawMissiles = Record<string, RawMissile>;
type RawFacilities = { facilities: Record<string, RawFacility> };

/** Fetches the three upstream files in the browser (the /missiles map). */
export async function loadDataset(): Promise<Dataset> {
  const base = '/data/';
  const [testsRaw, missilesRaw, facilitiesRaw] = await Promise.all([
    getJSON<RawTests>(base + 'test.en.json'),
    getJSON<RawMissiles>(base + 'missile.en.json'),
    getJSON<RawFacilities>(base + 'facility.en.json'),
  ]);
  return buildDataset(testsRaw, missilesRaw, facilitiesRaw);
}

/** Pure: turns the raw upstream JSON into the dataset. Server pages import the JSON and call this directly. */
export function buildDataset(testsRaw: RawTests, missilesRaw: RawMissiles, facilitiesRaw: RawFacilities): Dataset {
  const missiles = new Map(Object.entries(missilesRaw).map(([id, m]) => [id, { id, ...m }]));
  const facilities = new Map(Object.entries(facilitiesRaw.facilities).map(([id, f]) => [id, { id, ...f }]));

  const flat = testsRaw.timeBins.flatMap((b) => b.data);

  // how many tests share a date, so we can say "2 of 3"
  const perDate = new Map<string, number>();
  flat.forEach((t) => perDate.set(t.date, (perDate.get(t.date) ?? 0) + 1));

  const seenIds = new Map<string, number>();
  const tests: Test[] = flat.map((t) => {
    const missile = missiles.get(t.missile) ?? missiles.get('unknown')!;
    const facility = facilities.get(t.facility) ?? facilities.get('unknown')!;
    const distanceKm = num(t.distance);
    const isGlide = missile.maneuver === 'glide' && !!t.glide;
    const path = distanceKm && distanceKm > 0 ? buildPath(t, facility, distanceKm, isGlide) : null;

    let id = `${t.date}-${t.missile}`;
    const n = (seenIds.get(id) ?? 0) + 1;
    seenIds.set(id, n);
    if (n > 1) id += `-${n}`;

    const time = t.time && t.time !== 'unknown' ? t.time.replace(/\s*\(UTC\)/, ' UTC') : null;

    return {
      id,
      date: t.date,
      year: Number(t.date.slice(0, 4)),
      time,
      series: t.series ?? null,
      seriesSize: perDate.get(t.date) ?? 1,
      missile,
      facility,
      landingRegion: LANDING_LABELS[t.landing] ?? null,
      apogeeKm: num(t.apogee),
      distanceKm,
      bearing: t.bearing,
      outcome: t.outcome,
      description: t.description,
      path,
      landing: path ? path[path.length - 1] : null,
    };
  });

  tests.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (b.series ?? 0) - (a.series ?? 0)));

  const years = tests.map((t) => t.year);
  return {
    tests,
    facilities: [...facilities.values()].filter((f) => f.id !== 'unknown'),
    missiles: [...missiles.values()],
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
  };
}
