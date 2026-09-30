# AGENTS.md

Vite + React + TypeScript + MapLibre GL v6. It's a static site, with no backend.

- `src/data.ts`: loads `public/data/*.en.json` (verbatim from nagix/nk-missile-tests) and derives the paths. Keep the
  raw JSON untouched so upstream updates can be copied straight over.
- `src/meta.ts`: missile class and outcome colours and labels. Change colours here only.
- `src/MapView.tsx`: imperative MapLibre map. Selection works through feature-state `dim` plus `*-selected` filter layers.
- `src/Timeline.tsx`: year histogram and range brush. `src/Detail.tsx`: detail card and the to-scale profile SVG.
- MapLibre v6 has no default export (`import * as maplibregl`). Its worker is imported with `?worker&url` and passed to `setWorkerUrl` (without that, prod builds 404 on the worker), and maplibre-gl must stay in `optimizeDeps.exclude`, or its
  module worker fails to load under Vite.
- Basemap: OpenFreeMap Positron (free, no key). Labels are switched to `name:en` on `style.load`.
- `upstream/` is a reference clone and is gitignored. Don't edit it.
- Theme: `src/theme.ts` writes the effective theme to `<html data-theme>`, and `index.html` sets it before first paint.
  CSS colours are tokens in `:root` with dark overrides; don't hardcode hex values in components. The map swaps
  between OpenFreeMap `positron` and `dark` with `setStyle`, and `setupLayers()` re-adds our layers on every
  `style.load` using `PALETTE[theme]`.
- Headless screenshots: the desktop app's browser pane can't capture while hidden, so use playwright-core with
  `channel: 'chrome'` plus `--use-angle=swiftshader`, and wait around 10 seconds for the tiles to load.
