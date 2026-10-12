import type { FeatureCollection } from 'geojson';
import type { LayerId } from './config';

/** Everything the intel map loads from public/layers/. */
export type Data = Record<LayerId | 'counties' | 'provinces' | 'radar', FeatureCollection>;

/** The ground under our layers: the calm vector map, or Esri's satellite imagery with the map's labels on top. */
export type Basemap = 'map' | 'satellite';

export type Selection = { kind: 'county'; id: string } | { kind: 'point'; layer: LayerId; id: string };

export const FILES: (keyof Data)[] = ['counties', 'provinces', 'camps', 'detention', 'china-detention', 'missile-bases', 'sites', 'markets', 'ports', 'escape-route', 'radar'];

export async function loadData(): Promise<Data> {
  const entries = await Promise.all(FILES.map(async (f) => [f, await (await fetch(`/layers/${f}.geojson`)).json()] as const));
  return Object.fromEntries(entries) as Data;
}
