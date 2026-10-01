/** Where scripts/copy-maplibre-worker.mjs puts MapLibre's worker (see that file for why). */
export const MAPLIBRE_WORKER_URL = '/maplibre/maplibre-gl-worker.mjs';

/** Free, keyless vector tiles from OpenFreeMap: calm light / dark basemaps that let the data pop. */
export const STYLE_URL = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const;
