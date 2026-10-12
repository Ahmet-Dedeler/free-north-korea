/**
 * Layers on the intel map (/map). Point/line layers load their GeoJSON from public/layers/ (built by
 * scripts/build-layers.ts) the first time they're switched on. Counts and sources come from src/content/layers.json.
 */
import manifest from '../content/layers.json';

export type LayerId = 'camps' | 'detention' | 'china-detention' | 'missile-bases' | 'sites' | 'markets' | 'ports' | 'escape-route';

/** Labels and hints for layers and shadings, in every language, live in src/content/mapI18n.ts. */
export interface LayerDef {
  id: LayerId;
  group: 'Human rights' | 'Military' | 'Economy' | 'Escape';
  color: string;
  on: boolean;
  /** Circle radius in px at zoom 6 / zoom 10. */
  size: [number, number];
}

export const LAYERS: LayerDef[] = [
  { id: 'camps', group: 'Human rights', color: '#dc2626', on: true, size: [6, 11] },
  { id: 'detention', group: 'Human rights', color: '#f97316', on: true, size: [3.5, 7] },
  { id: 'china-detention', group: 'Human rights', color: '#be185d', on: false, size: [5, 8] },
  { id: 'missile-bases', group: 'Military', color: '#7c3aed', on: true, size: [6, 10] },
  { id: 'sites', group: 'Military', color: '#0ea5e9', on: true, size: [5, 9] },
  { id: 'markets', group: 'Economy', color: '#16a34a', on: false, size: [2.5, 9] },
  // North Korean anchorages where Global Fishing Watch saw ships stop (scripts/build-ships.ts), sized by visits
  { id: 'ports', group: 'Economy', color: '#0f766e', on: true, size: [5, 9] },
  { id: 'escape-route', group: 'Escape', color: '#22c55e', on: false, size: [4, 6] },
];

export type Shade = 'none' | 'incidents' | 'density' | 'population' | 'markets' | 'detention';

export const SHADES: { id: Shade; stops?: number[] }[] = [
  { id: 'incidents', stops: [0, 5, 20, 60, 150, 300] },
  { id: 'density', stops: [0, 50, 100, 250, 500, 2000] },
  { id: 'population', stops: [0, 50_000, 100_000, 200_000, 400_000, 1_000_000] },
  { id: 'detention', stops: [0, 1, 2, 4, 8, 15] },
  { id: 'markets', stops: [0, 1, 2, 4, 8, 15] },
  { id: 'none' },
];

/** First swatch is only for zero, so an empty county stays blank. Any positive value takes a colour. */
export const SHADE_COLORS = ['rgba(0,0,0,0)', '#fdd49e', '#fc8d59', '#e34a33', '#b30000', '#7f0000'];

export const MANIFEST = manifest as {
  built: string;
  totals: { population2008: number; incidents: number; incidentsMapped: number; homesWithheld: number };
  layers: Record<string, { count: number; sources: { name: string; url: string; updated: string | null }[] }>;
};

/**
 * Overlays: measurements of the whole country from satellites, drawn over everything except points and labels.
 * They live in the Layers menu by the basemap switch (BasemapSwitch.tsx), not in the sidebar, so the sidebar stays
 * about places. New time series (yearly night lights, radar ship density, crop health) belong here too.
 */
export type Overlay = 'lights' | 'radar';

/** `time`: the overlay has a time axis, so the shared time pill (TimePill.tsx) shows while it's on. */
export const OVERLAYS: { id: Overlay; thumb: string; time?: 'year' }[] = [
  // yearly night lights per county (public/layers/lights-years.json); the thumb is NASA's Black Marble over Korea
  { id: 'lights', thumb: '/img/map/thumb-lights.png', time: 'year' },
  // vessels satellite radar saw in North Korea's waters that sent no AIS, per 0.1° square, latest whole month
  { id: 'radar', thumb: '/img/map/thumb-radar.png' },
];

/**
 * Radar dots: one hue, magenta, sized by vessels without AIS per 0.1° square. The county shading already uses yellow
 * to dark red, so the overlay must not read as more of the same scale. The legend (BasemapSwitch.tsx) uses
 * RADAR_LEGEND as its sample counts.
 */
export const RADAR_COLOR = '#c026d3';
export const RADAR_LEGEND = [1, 20, 200];

/**
 * Night lights: counties shaded by the share of their area that is lit (litShare), dark to warm glow, the same glow
 * as the legend key. The scale is steep at the bottom: outside the cities most counties have under 2% lit.
 */
export const LIGHTS_STOPS: [number, string][] = [
  [0, '#05070d'],
  [0.005, '#1d1a16'],
  [0.02, '#4a3a1c'],
  [0.08, '#a67c33'],
  [0.3, '#ffd27f'],
];
