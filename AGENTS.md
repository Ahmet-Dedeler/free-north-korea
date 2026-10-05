# AGENTS.md

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + MapLibre GL v6. Every page is statically generated; there is
no backend. Goal of the site: be the open-source hub for understanding North Korea and helping its people, and rank for
searches like "how can North Korea be freed". SEO matters, so content must stay server-rendered.

The site is published in three languages: English (root), Korean (`/ko`) and Japanese (`/ja`). See "Languages" below
before adding any page or article.

## Layout

- `src/app/`: routes. Each content page exports `metadata` via `pageMeta()` (`src/site/seo.ts`) for canonical, hreflang
  and OG tags. `sitemap.ts` and `robots.ts` generate `/sitemap.xml` and `/robots.txt`; new top-level pages must be added
  to `sitemap.ts`.
- `src/content/`: all facts live here as typed data, not in components.
  - `articles/*.tsx`: the /learn explainers (SEO pages). Register new ones in `articles/index.ts`; route, sitemap and
    FAQ JSON-LD follow automatically. FAQ answers are plain strings because they go into JSON-LD.
  - `translations/ko.ts`, `translations/ja.ts`: the Korean and Japanese articles and hub text.
    `translations/index.ts` maps each page to its versions in other languages (`articleLanguages`, `HUB_PATHS`).
  - `orgs.ts` (directory, with `status`), `library.ts`, `places.ts` (atlas points + escape route).
  - `sanctions.ts`: text for /sanctions in all three languages plus the UN resolution timeline. The lists themselves
    are `data/sanctions.json` (built, never hand-edited).
- `src/map/`: the intel map (`/map`): `config.ts` (layers, county shading), `IntelMap.tsx` (MapLibre), `Explorer.tsx`
  (sidebar, search), `Detail.tsx` (county and point panels). Deep links: `/map#county=KP0205`, `/map#camps=camp-3`.
- `src/entities/` + `src/app/people/`: people graph, profiles, hover cards (`PersonLink`), JSON at `/api/people`.
  `/kim-family-tree` shows the family as it is now (Kim Jong Un's living relatives; the dead only where they connect
  living people), laid out by `src/entities/familyTree.ts` and sized to fit the page. The one-line "now" status per
  person, with its source, lives in `src/content/kimFamilyNow.ts`. Deep link: `#kim-yo-jong`.
- `src/missiles/`: the missile test explorer (redesign of nagix/nk-missile-tests). `data.ts` turns
  `public/data/*.en.json` (verbatim from upstream; keep them untouched so updates can be copied straight over) into the
  dataset: `loadDataset()` in the browser, `buildDataset()` on the server. `meta.ts` holds missile class/outcome
  colours. Selection uses feature-state plus `*-selected` filter layers.
  `/missiles/list` is the same data as a plain server-rendered table (the map itself has nothing a crawler can read).
- Charts (Our World in Data style): `data/series/series.json` holds every chart dataset (plus one CSV per series in
  `data/series/csv/`, so the data is usable straight from GitHub). `src/charts/data.ts` reads it and `chartProps()`
  trims a series to what one chart shows; `src/charts/ChartView.tsx` is the one chart frame (hover, legend toggles,
  table tab, linear/log, CSV, copy link, share). Titles, units and entity names in three languages live in
  `src/content/series.ts`. Entity colours are fixed (North Korea red, South Korea blue, China green, world grey
  dashed) and were checked for colour blindness; don't add Japan next to South Korea (the pair fails in dark mode).
  Pages: `/north-korea-vs-south-korea` (`components/TwoKoreasPage.tsx`, text in `content/twoKoreas.ts`, numbers in
  the text come from the data), `/data` and `/data/<id>` (`components/DataPage.tsx`).
- `/sanctions`: everyone on the UN 1718 list and the US Treasury (OFAC) North Korea programs. One component
  (`components/SanctionsPage.tsx`) renders all three language routes.
- Content pages are visual, not text walls. Reuse the building blocks before writing paragraphs:
  `components/Visual.tsx` (StatTile, icon chips, SourceCards), `AsOf` (date a number is from), `SatView` (Esri satellite
  tiles, no map lib), `Locator` (server SVG of NK from `site/geo.ts`), `HoverLinks` (OrgLink/PlaceLink hover previews,
  like PersonLink), `ArticleBlocks` (in-article visuals), `CampCard`/`PlaceCard`. Icons come from `lucide-react`, brand
  marks from `simple-icons`. Their CSS lives in `src/app/visual.css`. Images go through `src/content/media.ts` (lookups
  into media.json) and are downloaded by `scripts/fetch-media.ts`, never hotlinked (satellite tiles are the exception).
- `src/components/SiteChrome.tsx`: top bar + footer. `/map` and `/missiles` are full-screen "app" pages (no footer).
  The top nav is full; link new pages from the footer and from related pages instead of adding a nav item.

## Languages (non-negotiable)

Anything a reader can see ships in English, Korean and Japanese. A page or article is not done until all three exist.

- **Articles.** A new `/learn` article needs an entry with the same `slug` in `translations/ko.ts` and
  `translations/ja.ts` in the same change. `npm run lint` fails if one is missing (`scripts/check-translations.mjs`).
  When you edit facts in an English article, update both translations too. An article may exist in only one language
  when it is written for that audience (the Japanese abductees piece).
- **Pages.** Build new pages the way `/sanctions` is built: one shared component that takes `lang`, text in a
  `Record<Lang, …>` in `src/content/`, and three thin routes (`/x`, `/ko/x`, `/ja/x`). Don't fork the JSX per language.
  Older pages (`/act`, `/organizations`, `/military`, `/camps`, `/people`, `/library` and the rest) are still English
  only. When you touch one in a meaningful way, move it to this pattern and translate it.
- **hreflang.** Every translated route passes `lang` and `languages` to `pageMeta()`, listing all versions including
  itself, and gets the same `alternates` in `sitemap.ts`. All versions must list the same set.
- **Translate, don't summarize.** Same facts, same numbers, same sources as the English. Proper names follow local
  usage (국민통일방송, 自由アジア放送). Official text such as sanctions listings stays in English, with a line saying so.
- The root layout owns `<html lang="en">`; `/ko` and `/ja` set `lang` on a wrapper in their `layout.tsx`. Put
  `lang="en"` on English blocks inside translated pages.

## SEO

- `pageMeta()` sets canonical, hreflang, Open Graph and Twitter tags. Never hand-roll these in a page.
- Share cards: `ogCard()` in `src/site/og.tsx`. A route gets its own card by adding an `opengraph-image.tsx` next to
  the page and passing `image: '<path>/opengraph-image'` to `pageMeta()`. In dynamic segments also export
  `generateStaticParams` from the image file so the cards are prerendered. Articles, camps, places, people and
  sanctions have one; everything else uses the site card.
- Structured data goes through `jsonLd()`. Articles emit Article + FAQPage, data pages emit Dataset, dossiers emit Place.
- A page whose content only appears after JavaScript runs (a map, an explorer) needs a server-rendered sibling with the
  same facts, linked both ways. Don't hide text in the app page for crawlers.

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
5. `scripts/build-sanctions.ts` → `data/sanctions.json`: the full UN 1718 list and every OFAC entry under a DPRK
   program, straight from the official files, with the download date in `fetched`. Refuses to write if a list looks
   truncated. Also runs in the weekly Action.
6. `scripts/build-registry.ts` + `scripts/check-sources.mjs` (weekly GitHub Action): every source watched for
   changes/moves/deaths → `data/sources/{registry,state,changes}.json`, shown on `/sources`.
7. `scripts/build-series.ts` → `data/series/`: chart datasets. Source groups in `scripts/series/`: `owid.ts` (pulled
   from Our World in Data, which already maintains UN/World Bank/FAO/V-Dem series well), `dailynk.ts` (market prices
   from the Google Sheet behind Daily NK's site), `government.ts` (defector arrivals parsed from the Ministry of
   Unification PDF on data.go.kr with `pdftotext`; UN OCHA FTS aid), `local.ts` (counts from our own missile and
   sanctions data). Each group has a `maxAgeDays`, so the weekly Action only refetches what is due; a failing source
   keeps its previous series. Hand-checked numbers (a year the official file doesn't have yet) go in
   `data/series/curated/` with the URL they came from. Research behind it: `docs/research/charts/`.
8. `scripts/fetch-media.ts`: book covers, film posters, org logos → `public/img/`, credits in `src/content/media.json`.

Run order after a scrape: `node scripts/build-layers.ts && node scripts/build-entities.ts`.

## Safety rules (non-negotiable)

- Never publish NKDB points that are someone's home, or exact execution/burial sites: these only count per county.
- No incident narratives (they contain surnames); only counts by right violated. Link to NKDB for details.
- People data: every health/physical/notable claim must have a source that was checked. Rumors are labelled.
- Secrets never enter the repo: it is public. Keys live in Vercel env vars or `.env.local` (gitignored); document new
  variables in `.env.example` with an empty value.

## Rules

- Facts: every number needs a source in the page or article `sources`. Bump `REVIEWED` in `src/site/config.ts` (and an
  article's `updated`) when you re-check facts. Atlas coordinates come from Wikipedia unless marked `approx`.
  Load the source URL yourself before citing it; if a page sits behind a bot check, open it in a browser.
- Dates on data: wherever the site shows data that was true at one point in time (a census, a survey, an estimate, a
  downloaded list, "latest test"), show the date next to it. Use `<AsOf date="2018-08" />` (`components/AsOf.tsx`), or
  the `note` of a `StatTile` for a single number. `AsOf` adds "may be outdated" by itself once the date is more than
  two years before `REVIEWED`; `isStale()` gives the same answer for custom markup. Built data files carry their own
  date (`fetched`, `built`, `updated`) so the page never has to guess. If you don't know how old a number is, find
  out before publishing it.
- Writing: plain, direct, concrete numbers, no em dashes, no marketing voice. Same in Korean and Japanese.
- Analytics: PostHog, initialised in `src/instrumentation-client.ts` from `NEXT_PUBLIC_POSTHOG_KEY` (unset = off, so
  forks and local dev send nothing). It runs cookieless with no person profiles, no session recording and Do Not
  Track respected. Keep it that way: readers may be at risk, and the footer promises no cookies. Don't add other
  trackers, pixels or third-party embeds that set cookies.
- MapLibre: import as `import * as maplibregl`. Map components are loaded with `next/dynamic` and `ssr: false`
  (MapLibre touches `window` at import). The worker is copied to `public/maplibre/` by
  `scripts/copy-maplibre-worker.mjs` (runs on predev/prebuild) and set with `setWorkerUrl`.
- Basemap: OpenFreeMap `positron` / `dark` (free, no key). Labels switched to `name:en` on `style.load`; our layers are
  re-added on every `style.load` because `setStyle` drops them.
- Theme: follows device preference (`prefers-color-scheme`). `src/theme.ts` (context provider). The inline script in
  `src/app/layout.tsx` sets `<html data-theme>` before paint so server and client match and avoid flashes. CSS colours are
  tokens in `globals.css` with dark overrides; don't hardcode hex values in components (share cards are the exception:
  they render to a PNG outside the page).
- Internal links use `next/link`; external links use `<Ext>` (new tab, noopener).
- `upstream/` is a reference clone and is gitignored. Don't edit it.
- Headless screenshots: the desktop app's browser pane can't capture while hidden, so use playwright-core with
  `channel: 'chrome'` plus `--use-angle=swiftshader`, and wait around 10 seconds for the tiles to load.
- Before you finish: `npm run lint` (oxlint, tsc, translation check) and `npm run build` must pass.
- When the work is done and lint + build pass, commit and push to `main` yourself. Don't ask first.
