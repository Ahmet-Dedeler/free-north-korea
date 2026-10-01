// MapLibre v6 loads its web worker (an ES module plus a shared chunk) from a URL at runtime.
// Bundlers can't see that URL, so we copy both files into public/ and point setWorkerUrl() at them.
import { copyFileSync, mkdirSync } from 'node:fs';

const from = 'node_modules/maplibre-gl/dist/';
const to = 'public/maplibre/';
mkdirSync(to, { recursive: true });
for (const f of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) copyFileSync(from + f, to + f);
