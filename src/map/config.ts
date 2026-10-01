/**
 * Layers on the intel map (/map). Point/line layers load their GeoJSON from public/layers/ (built by
 * scripts/build-layers.ts) the first time they're switched on. Counts and sources come from src/content/layers.json.
 */
import manifest from '../content/layers.json';

export type LayerId = 'camps' | 'detention' | 'china-detention' | 'missile-bases' | 'sites' | 'markets' | 'escape-route';

export interface LayerDef {
  id: LayerId;
  label: string;
  group: 'Human rights' | 'Military' | 'Economy' | 'Escape';
  color: string;
  hint: string;
  on: boolean;
  /** Circle radius in px at zoom 6 / zoom 10. */
  size: [number, number];
}

export const LAYERS: LayerDef[] = [
  { id: 'camps', label: 'Prison camps', group: 'Human rights', color: '#dc2626', hint: 'Political prison camps (kwanliso) and long-term prisons (kyohwaso)', on: true, size: [6, 11] },
  { id: 'detention', label: 'Detention & security offices', group: 'Human rights', color: '#f97316', hint: 'Holding centres, interrogation, labour training camps, secret police offices', on: true, size: [3.5, 7] },
  { id: 'china-detention', label: 'Chinese detention (repatriation)', group: 'Human rights', color: '#be185d', hint: 'Where China holds escapees before sending them back', on: false, size: [5, 8] },
  { id: 'missile-bases', label: 'Missile operating bases', group: 'Military', color: '#7c3aed', hint: 'Undeclared bases found by CSIS from satellite imagery', on: true, size: [6, 10] },
  { id: 'sites', label: 'Nuclear, launch & key sites', group: 'Military', color: '#0ea5e9', hint: 'Yongbyon, Punggye-ri, Sohae, Pyongyang landmarks, border crossings', on: true, size: [5, 9] },
  { id: 'markets', label: 'Markets (jangmadang)', group: 'Economy', color: '#16a34a', hint: 'Official markets, sized by number of stalls (CSIS, 2018)', on: false, size: [2.5, 9] },
  { id: 'escape-route', label: 'Escape route', group: 'Escape', color: '#22c55e', hint: 'The usual 3,000-mile route through China to Southeast Asia', on: false, size: [4, 6] },
];

export type Shade = 'none' | 'incidents' | 'density' | 'population' | 'markets' | 'detention' | 'lights';

export const SHADES: { id: Shade; label: string; hint: string; unit?: string; stops?: number[] }[] = [
  { id: 'incidents', label: 'Documented abuses', hint: 'Human rights violations recorded by NKDB, per county', stops: [0, 5, 20, 60, 150, 300] },
  { id: 'density', label: 'Population density', hint: 'People per km² (2008 census)', unit: '/km²', stops: [0, 50, 100, 250, 500, 2000] },
  { id: 'population', label: 'Population', hint: 'People per county (2008 census)', stops: [0, 50_000, 100_000, 200_000, 400_000, 1_000_000] },
  { id: 'detention', label: 'Detention facilities', hint: 'Known detention and security facilities per county', stops: [0, 1, 2, 4, 8, 15] },
  { id: 'markets', label: 'Markets', hint: 'Official markets per county', stops: [0, 1, 2, 4, 8, 15] },
  { id: 'lights', label: 'Night lights (NASA)', hint: 'Black Marble satellite composite, 2016. Electricity is a rough proxy for wealth.' },
  { id: 'none', label: 'Nothing', hint: 'Plain map' },
];

/** First bucket (zero / lowest) is transparent so empty counties don't read as data. */
export const SHADE_COLORS = ['rgba(0,0,0,0)', '#fdd49e', '#fc8d59', '#e34a33', '#b30000', '#7f0000'];

export const MANIFEST = manifest as {
  built: string;
  totals: { population2008: number; incidents: number; incidentsMapped: number; homesWithheld: number };
  layers: Record<string, { count: number; sources: { name: string; url: string; updated: string | null }[] }>;
};

export const NIGHT_LIGHTS = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png';
