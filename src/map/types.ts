import type { FeatureCollection } from 'geojson';
import type { LayerId } from './config';

/** Yearly night lights per county (public/layers/lights-years.json, scripts/ee/night_lights.py). */
export interface Lights {
  built: string;
  source: { name: string; url: string; license: string; seam: number };
  years: number[];
  counties: Record<string, { sum: (number | null)[]; litKm2: (number | null)[]; litShare: (number | null)[] }>;
  KP: { sum: number[]; pyongyangShare: (number | null)[] };
}

/** Crop greenness per province this season, every 16 days (public/layers/crops.json, scripts/ee/crops.py). */
export interface Crops {
  built: string;
  year: number;
  baseYears: [number, number];
  latest: string | null;
  years: number[];
  provinces: Record<
    string,
    {
      name: string;
      cropKm2: number | null;
      season: { date: string; ndvi: number; base: number | null; baseMin: number | null; baseMax: number | null; anomaly: number | null }[];
      yearly: (number | null)[];
    }
  >;
}

/** Everything the intel map loads from public/layers/. */
export type Data = Record<LayerId | 'counties' | 'provinces' | 'radar', FeatureCollection> & { lights: Lights; crops: Crops };

/** The ground under our layers: the calm vector map, or Esri's satellite imagery with the map's labels on top. */
export type Basemap = 'map' | 'satellite';

export type Selection = { kind: 'county'; id: string } | { kind: 'point'; layer: LayerId; id: string };

export const FILES: (LayerId | 'counties' | 'provinces' | 'radar')[] = ['counties', 'provinces', 'camps', 'detention', 'china-detention', 'missile-bases', 'sites', 'markets', 'ports', 'escape-route', 'radar'];

export async function loadData(): Promise<Data> {
  const [entries, lights, crops] = await Promise.all([
    Promise.all(FILES.map(async (f) => [f, await (await fetch(`/layers/${f}.geojson`)).json()] as const)),
    fetch('/layers/lights-years.json').then((r) => r.json() as Promise<Lights>),
    fetch('/layers/crops.json').then((r) => r.json() as Promise<Crops>),
  ]);
  const data = { ...Object.fromEntries(entries), lights, crops } as Data;
  // Crop greenness goes onto the province features as crop0 … cropN: the % against the 10-year base of each 16-day
  // composite this season, so the time pill changes it with one paint property, like the night lights.
  for (const f of data.provinces.features) {
    const c = crops.provinces[f.properties?.pcode];
    if (c) c.season.forEach((s, i) => (f.properties![`crop${i}`] = s.anomaly));
  }
  // Night lights go onto the county features as lit2013 … lit2025 (share of the county that is lit), so the map
  // changes year with one paint property and never swaps sources.
  for (const f of data.counties.features) {
    const c = lights.counties[f.properties?.pcode];
    if (c) lights.years.forEach((y, i) => (f.properties![`lit${y}`] = c.litShare[i]));
  }
  return data;
}

/** A spot to fly to without selecting anything: a quake from Latest (with a pulsing ring) or a satellite close-up. */
export type Focus = { center: [number, number]; zoom?: number; ping?: boolean };
