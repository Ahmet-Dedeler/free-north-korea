# AGENTS.md

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + MapLibre GL v6. Every page is statically generated; there is
no backend. Goal of the site: be the open-source hub for understanding North Korea and helping its people, and rank for
searches like "how can North Korea be freed". SEO matters, so content must stay server-rendered.

## Layout

- `src/app/`: routes. Each content page exports `metadata` via `pageMeta()` (`src/site/seo.ts`) for canonical/OG tags.
  `sitemap.ts` and `robots.ts` generate `/sitemap.xml` and `/robots.txt`; new top-level pages must be added to `sitemap.ts`.
- `src/content/`: all facts live here as typed data, not in components.
  - `articles/*.tsx`: the /learn explainers (SEO pages). Register new ones in `articles/index.ts`; route, sitemap and
    FAQ JSON-LD follow automatically. FAQ answers are plain strings because they go into JSON-LD.
  - `orgs.ts` (directory, with `status`), `library.ts`, `places.ts` (atlas points + escape route).
- `src/atlas/`: the atlas map (`AtlasMap.tsx`) and its sidebar/detail UI. Deep links: `/atlas#place=<id>`.
- `src/missiles/`: the missile test explorer (redesign of nagix/nk-missile-tests). `data.ts` loads
  `public/data/*.en.json` (verbatim from upstream; keep them untouched so updates can be copied straight over).
  `meta.ts` holds missile class/outcome colours. Selection uses feature-state plus `*-selected` filter layers.
- `src/components/SiteChrome.tsx`: top bar + footer. `/atlas` and `/missiles` are full-screen "app" pages (no footer).

## Rules

- Facts: every number needs a source in the page or article `sources`. Bump `REVIEWED` in `src/site/config.ts` (and an
  article's `updated`) when you re-check facts. Atlas coordinates come from Wikipedia unless marked `approx`.
- Writing: plain, direct, concrete numbers, no em dashes, no marketing voice.
- MapLibre: import as `import * as maplibregl`. Map components are loaded with `next/dynamic` and `ssr: false`
  (MapLibre touches `window` at import). The worker is copied to `public/maplibre/` by
  `scripts/copy-maplibre-worker.mjs` (runs on predev/prebuild) and set with `setWorkerUrl`.
- Basemap: OpenFreeMap `positron` / `dark` (free, no key). Labels switched to `name:en` on `style.load`; our layers are
  re-added on every `style.load` because `setStyle` drops them.
- Theme: `src/theme.ts` (context provider). The inline script in `src/app/layout.tsx` sets `<html data-theme>` before
  paint; React reads the stored preference after hydration so server and client markup match. CSS colours are tokens in
  `globals.css` with dark overrides; don't hardcode hex values in components.
- Internal links use `next/link`; external links use `<Ext>` (new tab, noopener).
- `upstream/` is a reference clone and is gitignored. Don't edit it.
- Headless screenshots: the desktop app's browser pane can't capture while hidden, so use playwright-core with
  `channel: 'chrome'` plus `--use-angle=swiftshader`, and wait around 10 seconds for the tiles to load.
