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
- `src/map/`: the intel map (`/map`): `config.ts` (layers, county shading), `IntelMap.tsx` (MapLibre), `Explorer.tsx`
  (sidebar, search), `Detail.tsx` (county and point panels). Deep links: `/map#county=KP0205`, `/map#camps=camp-3`.
- `src/entities/` + `src/app/people/`: people graph, profiles, hover cards (`PersonLink`), JSON at `/api/people`.
  `/kim-family-tree` shows the family as it is now (Kim Jong Un's living relatives; the dead only where they connect
  living people), laid out by `src/entities/familyTree.ts` and sized to fit the page. The one-line "now" status per
  person, with its source, lives in `src/content/kimFamilyNow.ts`. Deep link: `#kim-yo-jong`.
- `src/missiles/`: the missile test explorer (redesign of nagix/nk-missile-tests). `data.ts` loads
  `public/data/*.en.json` (verbatim from upstream; keep them untouched so updates can be copied straight over).
  `meta.ts` holds missile class/outcome colours. Selection uses feature-state plus `*-selected` filter layers.
- Content pages are visual, not text walls. Reuse the building blocks before writing paragraphs:
  `components/Visual.tsx` (StatTile, icon chips, SourceCards), `SatView` (Esri satellite tiles, no map lib), `Locator`
  (server SVG of NK from `site/geo.ts`), `HoverLinks` (OrgLink/PlaceLink hover previews, like PersonLink), `ArticleBlocks`
  (in-article visuals), `CampCard`/`PlaceCard`. Icons come from `lucide-react`, brand marks from `simple-icons`. Their CSS
  lives in `src/app/visual.css`. Images go through `src/content/media.ts` (lookups into media.json) and are downloaded by
  `scripts/fetch-media.ts`, never hotlinked (satellite tiles are the exception).
- `src/components/SiteChrome.tsx`: top bar + footer. `/map` and `/missiles` are full-screen "app" pages (no footer).

## Data pipeline (map-first; content pages are secondary)

1. `docs/research/<track>.json|md`: what sources exist (camps, population, military, economy, korean_japanese,
   leadership, missile_gaps), found by research agents. Treat agent claims as leads, not facts: they invented many
   URLs and Wikidata IDs. Probe scripts live in `docs/research/probes/`.
2. `scripts/scrape/*.ts` → `data/raw/<source>/`: `sources.ts` (nkpd, hrnk, markets, missile-bases, admin,
   provocations) and `visualatlas.ts` (needs headless Chrome via playwright-core; Visual Atlas sits behind Vercel's
   bot checkpoint).
3. `scripts/build-layers.ts` → `public/layers/*.geojson` + `src/content/layers.json` (manifest the map reads).
4. `scripts/build-entities.ts` → `data/entities/{people,orgs}.json`: resolves Wikidata QIDs itself
   (`data/entities/qids.json`, editable to pin), takes dates/family/positions from Wikidata, photos only with free
   licenses, sanctions from the live OFAC SDN and UN 1718 lists, and drops any claim whose source page doesn't load
   and contain the claim's numbers/words. Hand-checked claims go in `data/entities/curated.json`.
5. `scripts/build-registry.ts` + `scripts/check-sources.mjs` (weekly GitHub Action): every source watched for
   changes/moves/deaths → `data/sources/{registry,state,changes}.json`, shown on `/sources`.
6. `scripts/fetch-media.ts`: book covers, film posters, org logos → `public/img/`, credits in `src/content/media.json`.

Run order after a scrape: `node scripts/build-layers.ts && node scripts/build-entities.ts`.

## Safety rules (non-negotiable)

- Never publish NKDB points that are someone's home, or exact execution/burial sites: these only count per county.
- No incident narratives (they contain surnames); only counts by right violated. Link to NKDB for details.
- People data: every health/physical/notable claim must have a source that was checked. Rumors are labelled.

## Rules

- Facts: every number needs a source in the page or article `sources`. Bump `REVIEWED` in `src/site/config.ts` (and an
  article's `updated`) when you re-check facts. Atlas coordinates come from Wikipedia unless marked `approx`.
- Writing: plain, direct, concrete numbers, no em dashes, no marketing voice.
- MapLibre: import as `import * as maplibregl`. Map components are loaded with `next/dynamic` and `ssr: false`
  (MapLibre touches `window` at import). The worker is copied to `public/maplibre/` by
  `scripts/copy-maplibre-worker.mjs` (runs on predev/prebuild) and set with `setWorkerUrl`.
- Basemap: OpenFreeMap `positron` / `dark` (free, no key). Labels switched to `name:en` on `style.load`; our layers are
  re-added on every `style.load` because `setStyle` drops them.
- Theme: follows device preference (`prefers-color-scheme`). `src/theme.ts` (context provider). The inline script in
  `src/app/layout.tsx` sets `<html data-theme>` before paint so server and client match and avoid flashes. CSS colours are
  tokens in `globals.css` with dark overrides; don't hardcode hex values in components.
- Internal links use `next/link`; external links use `<Ext>` (new tab, noopener).
- `upstream/` is a reference clone and is gitignored. Don't edit it.
- Headless screenshots: the desktop app's browser pane can't capture while hidden, so use playwright-core with
  `channel: 'chrome'` plus `--use-angle=swiftshader`, and wait around 10 seconds for the tiles to load.
