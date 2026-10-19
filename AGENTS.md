# AGENTS.md

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + MapLibre GL v6. Every page is statically generated; there is
no backend. Goal of the site: be the open-source hub for understanding North Korea and helping its people, and rank for
searches like "how can North Korea be freed". SEO matters, so content must stay server-rendered.

The site is published in four languages: English (root), Korean (`/ko`), Japanese (`/ja`) and Simplified Chinese
(`/zh`, hreflang `zh-Hans`). See "Languages" below
before adding any page or article.

## Layout

- `src/app/`: routes. Each content page exports `metadata` via `pageMeta()` (`src/site/seo.ts`) for canonical, hreflang
  and OG tags. `sitemap.ts` and `robots.ts` generate `/sitemap.xml` and `/robots.txt`; new top-level pages must be added
  to `sitemap.ts`.
- `src/content/`: all facts live here as typed data, not in components.
  - `articles/*.tsx`: the /learn explainers (SEO pages). Register new ones in `articles/index.ts`; route, sitemap and
    FAQ JSON-LD follow automatically. FAQ answers are plain strings because they go into JSON-LD.
  - `translations/{ko,ja,zh}.ts`: the Korean, Japanese and Chinese articles (`articles/<lang>/`) and hub text.
    `translations/index.ts` maps each page to its versions in other languages (`articleLanguages`, `HUB_PATHS`).
  - `orgs.ts` (directory, with `status`), `library.ts`, `places.ts` (atlas points + escape route).
  - `sanctions.ts`: text for /sanctions in every language plus the UN resolution timeline. The lists themselves
    are `data/sanctions.json` (built, never hand-edited).
- `src/map/`: the intel map (`/map`, `/ko/map`, `/ja/map`, `/zh/map`): `config.ts` (layers, county shading), `IntelMap.tsx`
  (MapLibre; basemap labels in the reader's language where OSM has them), `Explorer.tsx` (sidebar, search), `Detail.tsx`
  (county and point panels; on phones a bottom sheet), `Photo.tsx` (the picture at the top of a point panel: our own
  Sentinel-2 image with a 24-month scrubber for Camp Watch sites, from `mapSatIndex()` passed in by the route, else an
  Esri aerial labelled as undated; clicking it opens `SatViewer.tsx`, a full-screen pan/zoom viewer that keeps the
  month strip, and Close-up flies the map in on the spot in satellite mode, because Sentinel-2's 10 m stays soft at any
  zoom), `BasemapSwitch.tsx` (bottom-left Map/Satellite thumbnail plus a Layers menu of
  satellite overlays, `OVERLAYS` in `config.ts`), `Latest.tsx` (top of the sidebar: the latest launches and quakes from
  the event wire within 120 days and the newest Camp Watch images as thumbnails, built on the server by
  `content/mapLatest.ts`; quakes fly the map to a pulsing marker, launches link to `/missiles/list`). The map should feel like Google Maps, not a GIS tool: the sidebar is
  for places and county shading; whole-country measurements (night lights, radar, crops) go in the Layers menu, and
  depth goes in the click panel rather than in more toggles. Colour rule: points carry the colour (one hue per layer,
  `LAYERS` in `config.ts`); county shading is a neutral slate ramp per theme (`SHADE_RAMP`), never the hues of the dots;
  chrome (chips, Latest, panels) stays neutral, with the accent only for the chosen option and the main action. The
  sidebar shows, rather than tells: layers are chips whose mark is the map's own marker with the layer's glyph inside (`map/LayerGlyph.tsx`: our own solid marks on one 24px grid, not a stock icon set; the
  chip is the legend)
  with a count (an outdated layer shows its year), sources sit in the tooltip and on `/sources`. Every word of UI is in `content/mapI18n.ts`; the GeoJSON's own text
  (point names, NKDB types, notes) stays English with `lang="en"`, and each point links to its translated dossier.
  Deep links: `/map#county=KP0205`, `/map#camps=camp-3`, `&b=sat` for the satellite basemap (same hashes under
  `/ko/map` etc.). Map links to county pages use `countySlug()` from `content/mapSlugs.ts` (`/counties/pakchon`); a
  county code is no page. County pages have a "Seen from space" panel (night lights per year) and a Satellite view link.
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
  table tab, linear/log, CSV, copy link, share). Titles, units and entity names in every language live in
  `src/content/series.ts`, and so do the chart notes: the build scripts write each series' `note` in English, and
  `SERIES_TEXT` holds it as a template (`{year}` for parts the build fills in) with its translations. When you change a
  note in `scripts/series/`, update the template and translations; `npm run lint` fails until they match
  (`scripts/check-series-notes.ts`), and until then pages show the English note.
  Entity colours are fixed (North Korea red, South Korea blue, China green, world grey dashed) and were checked for colour blindness; don't add Japan next to South Korea (the pair fails in dark mode).
  Pages: `/north-korea-vs-south-korea` (`components/TwoKoreasPage.tsx`, text in `content/twoKoreas.ts`, numbers in
  the text come from the data), `/data` and `/data/<id>` (`components/DataPage.tsx`).
  Visual style is Visual Capitalist, not dashboard: Anton display type (`.display`, `--display`), vivid entity colours,
  written callouts on charts (`notes`), the gap between the two Koreas shaded (`gap`), hatched stacks. Poster pictures
  that aren't line charts live in `src/charts/Infographics.tsx` (tale of the tape, year stripes, people to scale);
  `components/Reveal.tsx` adds the grow-in. Country colours are only for countries; other series use the `--s1..4` slots.
- `/sanctions`: everyone on the UN 1718 list and the US Treasury (OFAC) North Korea programs, plus the UK, EU and
  Japan lists, with entries matched across lists (`targets`). One component
  (`components/SanctionsPage.tsx`) renders every language route.
- `/sanctions/ships`: every listed ship with an IMO number as Global Fishing Watch sees it (identities broadcast
  under that IMO, port calls since 2012, months seen by radar in North Korea's EEZ), who calls at North Korean
  ports (last 12 months, foreign flags listed), and Sentinel-1 radar counts with the share sending no AIS, monthly
  and by year since 2017. `scripts/build-ships.ts` archives everything it fetches in `data/archive/gfw`, then
  builds `data/ships.json` from the archive (weekly), text in `content/ships.ts`, `components/ShipsPage.tsx`. AIS is
  self-reported: always show the name and flag a ship broadcast, call a match a lead, and never publish single
  radar detections or the fine radar grid. GFW terms: non-commercial, "Powered by Global Fishing Watch" on every page
  and file using the data. APIs, keys and limits:
  `docs/research/data-apis.md`. The same run writes two map layers: `public/layers/ports.geojson` (Ports, a point
  layer) and `public/layers/radar.geojson` (the "Ships seen by radar" overlay: 0.1° squares, latest whole month,
  vessels with no AIS only; the map draws one dot per square at its centre, sized by count, and dims the county
  shading while it's on), plus their entries in `src/content/layers.json` (build-layers.ts keeps them). The port
  panel's bars are foreign flags only; "no flag broadcast" is not foreign, and North Korea's own ships get one line.
- Night lights on `/map`: the "Night lights" overlay shades counties by the share of their area lit at night, one year
  at a time (2013-2025), with one shared time pill (`map/TimePill.tsx`, deep link `#y=2019`) for any overlay with a
  time axis, and a sparkline in the county panel. `uv run scripts/ee/night_lights.py` (Google Earth Engine, annual
  VIIRS composites from EOG) writes `public/layers/lights-years.json` and `data/archive/ee/night-lights`; run it by
  hand when EOG publishes a new year. V2.1 → V2.2 in 2022 is a seam and the panel says so. Never monthly per county:
  outside the cities North Korea sits at the sensor's noise floor.
  While it's on, the map switches to its dark basemap whatever the device theme, so unlit reads as dark (on a light
  map a dark county reads as "more"). The scale keeps under 2% lit near black; the glow is for cities. Its legend
  sits inside the time pill, not with the bottom-left legend pills.
- Crop greenness: `uv run scripts/ee/crops.py` (Earth Engine; MODIS NDVI every 16 days over a fixed 2020 cropland
  mask, per province and nationally, since 2001) writes `public/layers/crops.json` and `data/archive/ee/crops`. Shown
  on `/data/crop-greenness` (May-September mean each year) and `/data/crop-greenness-season` (this season against the
  10 years before it, not the whole record: springs since 2021 are greener than any before). Greenness is not
  harvest; say so wherever it appears. Run it every couple of weeks in the growing season. On `/map` the "Crop health"
  overlay shades provinces by one 16-day composite against its 10-year base (brown below, green above, ±15%), with
  the time pill in 16-day steps (deep link `#d=2026-08-13`) and the province's line in the county panel. Night lights
  and crop health both fill the land, so switching one on switches the other off. County shading is hidden under crop health
  (two scales in one colour) and dimmed under the radar dots (`fillOpacity()` in `IntelMap.tsx`).
- `data/archive/`: our permanent record of data a source only serves for a while (GFW now; more to come). Append
  and update in place through `scripts/archive.ts`, never delete. One cleaned record per line,
  `<source>/<kind>/<partition>.jsonl`, sorted; each source documented in `data/archive/README.md` with its license.
  Never import it from `src/` (`npm run lint` checks); write a summary into `data/` for pages. Store our computed
  numbers, never imagery or raw API dumps.
- Event wire (measured events within hours): `src/content/events.ts` reads `data/seismic.json` (USGS catalog, box
  around North Korea) and `data/launch-reports.json` (Japan Ministry of Defense launch PDFs); text in
  `src/content/eventsI18n.ts`. Shown by `components/SeismicBlock.tsx` (/military), `components/LaunchReports.tsx`
  (/missiles/list: MOD launches newer than the CNS dataset, flagged "not yet in the database") and the reusable
  `components/EventFeed.tsx`. Labels and numbers are the agency's own (USGS `type`, MOD estimates); never relabel.
- `/kim-watch`: Kim Jong Un's public appearances as KCNA reports them (`scripts/build-kimwatch.ts` → `data/kimwatch.json`,
  text in `content/kimWatch.ts`). Regime-reported, so always labelled as KCNA's claim. KCNA's listings only reach back 12
  months, so the job must keep running or old reports are lost. kcna.kp is blocked in South Korea: never link it from
  `/ko`. "Days since" is recounted in the browser by `components/LiveDays.tsx`.
- `/watch`: the hub for what we measure or count on a schedule, sorted by how a number is known (measured, counted,
  reported by the regime). `components/WatchPage.tsx` only reuses the feature blocks (EventFeed, LatestImagery,
  sanctions counts, KimLastSeen); text in `content/watch.ts`. Prefer measured and counted data over regime claims.
- Camp Watch: our own dated Sentinel-2 images of the camps and nuclear/missile sites in `places.ts`, published at
  Sentinel-2's native 10 m per pixel (512 px for 5.12 km chips, 768 px for 7.68 km ones; `OUT_PX` in `satWatchSites.ts`).
  `components/SatWatch.tsx` (latest image, month strip, before/after slider, scale bar, Copernicus credit) sits on
  camp and place dossiers; `LatestImagery` from the same file is the "newest images" strip for a hub page. Text in
  `content/satWatch.ts`, chip sizes in `content/satWatchSites.ts`. Only show what the pixels show: change scores
  (`docs/watch/sentinel-changes.md`) are for humans and never go on the site.
- Links to a known brand or service (GitHub, YouTube, X, an org) get its mark before the name: `simple-icons` through
  `components/SocialIcon.tsx` (`SocialIcon`, `GithubIcon`), org logos through `orgLogo()`. A small ask (contribute,
  follow, read more) is one quiet line with the mark and a link, not a boxed callout with a heading and a button; the
  home page's "Build this with us" row is the pattern.
- Home (`app/page.tsx`, `app/{ko,ja,zh}/page.tsx`, rendered by `components/HomePage.tsx`, text in `content/home.ts`): the look is a 2026 Framer non-profit site, not a 2010 portal. Light bands alternate with
  full-bleed "night" bands (`.night` + `.bleed`: deep navy `--night` with white type, in `globals.css`; no extra
  accent colour: a yellow one was tried and read as too loud): the hero (all-white headline with a photo of a crowd of
  North Koreans set into it (`page:north-koreans`, `.h1-pill.crowd`),
  our newest satellite chips as a "watched from space" row, the map card), a quiet ticker of counts from the data, the
  scale band (one giant number, four smaller, the night photo in an arch) and a closing "Ten minutes is enough to
  start" banner. Section heads are title left, "see all" pill right
  (`.band-head`). On the home page the top bar wears the hero's navy until you scroll (`over-night` in `SiteChrome.tsx`). The
  map tours its own dots (`components/HomeMapTour.tsx`): every 6 s the next dot gets a card with our newest Sentinel-2
  chip (Camp Watch sites first) or an Esri aerial labelled undated, its kind and one line from its note. Hover or focus
  holds it and shows that dot; reduced motion stops it. The card is placed inside the map box clear of its dot (no
  pause button, nothing over the key or the Open button, which sit in a row under the map); on phones it docks under
  the map.
- Footer (every content page, `SiteChrome.tsx`): a navy card with the brand, languages, link columns (Explore split in
  two), the review note, GitHub and Take action, and the name set huge and faint as the last line.
- Language switchers (header menu, footer, article "read in" links, the hub chips in `components/HubLangs.tsx`) show a
  flag before each language name: `components/Flag.tsx` (country-flag-icons SVGs; English is the US flag, Chinese the
  mainland flag). A new switcher uses it too.
- Content pages are visual, not text walls. Reuse the building blocks before writing paragraphs:
  `components/Visual.tsx` (StatTile, icon chips, SourceCards), `AsOf` (date a number is from), `SatView` (Esri satellite
  tiles, no map lib), `Locator` (server SVG of NK from `site/geo.ts`), `HoverLinks` (OrgLink/PlaceLink hover previews,
  like PersonLink), `ArticleBlocks` (in-article visuals), `CampCard`/`PlaceCard`. Icons come from `lucide-react` (the map's layer marks are our own, `map/LayerGlyph.tsx`), brand
  marks from `simple-icons`. Their CSS lives in `src/app/visual.css`. Images go through `src/content/media.ts` (lookups
  into media.json) and are downloaded by `scripts/fetch-media.ts`, never hotlinked (satellite tiles are the exception).
- `src/components/SiteChrome.tsx`: top bar + footer. `/map` (in every language) and `/missiles` are full-screen "app" pages (no footer).
  The top nav is full (Watch was the last addition); link new pages from the footer and from related pages instead of
  adding a nav item. Header and footer text live in `content/chrome.ts` in every language; `localize()` points their
  links at the reader's language, and the language menu (globe button) goes to the same page via the page's hreflang
  links. Below 1080px the nav moves behind a hamburger button into a panel under the bar; below 560px Take action moves
  into that panel too. Check the header at 375px wide after touching it: most visitors from social media are on phones.
  Nav items with no version in the reader's language get a small "EN" tag.
- Logo (`src/site/brand.ts`, copied in `public/favicon.svg`): a white star on a blue disc. Blue stands for freedom.
  It used to be the same star on a red disc, which is the emblem on North Korea's own flag, so at a glance the site
  looked pro-regime. Keep the logo blue: no red stars, red discs or other regime colours in branding. Red stays only
  where it means danger (camps, the Take action button, North Korea's colour in charts).
- Who is behind it: `/about` (`components/AboutPage.tsx`, text in `content/about.ts`). The site speaks as a group
  ("we"): volunteers and contributors, no company, government or NGO, no money taken. The /learn explainers carry one
  byline, `AUTHOR_NAME` in `site/config.ts` (also the Article JSON-LD author), and may say "I". No faces, photos or
  personal bios of the people behind the site: it is about the people of North Korea, and North Korean state hackers
  target people who work on North Korea. Save North Korea (savenorthkorea.org) is not Liberty in North Korea
  (libertyinnorthkorea.org); keep that clear wherever the two could be confused.
- `/learn` and `/ko/learn`, `/ja/learn`, `/zh/learn` list each language's articles (`components/LearnIndex.tsx`).
- Accessibility: small grey text uses `--ink-3`, tuned to pass WCAG AA (4.5:1) in both themes; don't lighten it.
- Agents and LLM tools (`src/site/agents.ts` explains it all): robots.txt has a Content-Signal line (search, ai-input
  and ai-train all `yes`), every page has a Markdown version (`/x.md`, or `/x` with `Accept: text/markdown`, rewritten in
  `next.config.ts` to `app/md/[[...path]]`, which converts the built HTML with `site/markdown.ts`), `/llms.txt` and
  `/llms-full.txt`, `/.well-known/api-catalog` + `/openapi.json` for the people API, and `Link` headers on every
  response. New top-level pages go in the `PAGES` list of `app/llms.txt/route.ts`. Keep `openapi.json` in step with
  `Person`. Check with `curl -X POST https://isitagentready.com/api/scan -d '{"url":"https://savenorthkorea.org"}'`.

## Languages (non-negotiable)

Anything a reader can see ships in English, Korean, Japanese and Chinese. A page or article is not done until all four
exist.

- **Articles.** A new `/learn` article needs a file with the same `slug` in `articles/ko/`, `articles/ja/` and
  `articles/zh/` (listed in each folder's `index.ts`) in the same change. `npm run lint` fails if one is missing (`scripts/check-translations.mjs`).
  When you edit facts in an English article, update every translation too. An article may exist in only one language
  when it is written for that audience (the Japanese abductees piece).
- **Pages.** Build new pages the way `/sanctions` is built: one shared component that takes `lang`, text in a
  `Record<Lang, …>` in `src/content/`, and thin routes (`/x`, `/ko/x`, `/ja/x`, `/zh/x`). Don't fork the JSX per language.
  Every page is translated except the missile explorer (`/missiles`; its table `/missiles/list` is translated). When you
  touch it in a meaningful way, move it to this pattern and translate it.
- **hreflang.** Every translated route passes `lang` and `languages` to `pageMeta()`, listing all versions including
  itself, and gets the same `alternates` in `sitemap.ts`. All versions must list the same set.
- **Translate, don't summarize.** Same facts, same numbers, same sources as the English. Proper names follow local
  usage (국민통일방송, 自由アジア放送, 自由亚洲电台). Chinese uses mainland terms: 朝鲜 / 韩国. Official text such as sanctions listings stays in English, with a line saying so.
- The root layout owns `<html lang="en">`; `/ko`, `/ja` and `/zh` set `lang` on a wrapper in their `layout.tsx`
  (`zh-Hans` for Chinese; `LANG_TAG` in `site/seo.ts` maps `Lang` to hreflang/`inLanguage` codes). Put
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
   program, plus the UK, EU and Japan lists (`scripts/sanctions/national.ts`; a failing national list keeps its last
   copy), straight from the official files, with the download date in `fetched`. Refuses to write if a list looks
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
8. `scripts/build-seismic.ts` + `scripts/build-launch-reports.ts` (`.github/workflows/event-wire.yml`, every 3 hours)
   → `data/seismic.json`, `data/launch-reports.json`. MOD's HTML pages and year indexes sit behind a Cloudflare
   check; the script reads `/j/rss/news.xml`, `/j/press/news/index.html` and the 続報 PDFs, and also tries the PDF names
   of the last three days because the RSS lags. `--backfill` probes launch days from the CNS dataset (PDFs exist from
   2020 on). Both files are rewritten only when something changed or their date is a week old.
9. `scripts/fetch-media.ts`: book covers, film posters, org logos → `public/img/`, credits in `src/content/media.json`.
10. `uv run scripts/sentinel/build.py [id ...]` → `public/img/sentinel/<id>/<date>.jpg`, `data/sentinel.json`,
   `docs/watch/sentinel-changes.md`. Sentinel-2 L2A from Element84 Earth Search (no key), windowed COG reads only,
   cloud judged from the SCL band inside each chip. Incremental (`data/sentinel/scl-cache.json`); a failed site keeps
   its images. Targets come from `node scripts/sentinel/targets.ts`.

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
- Writing: plain, direct, concrete numbers, no em dashes, no marketing voice. Same in Korean, Japanese and Chinese.
- Analytics: PostHog, initialised in `src/instrumentation-client.ts` from `NEXT_PUBLIC_POSTHOG_KEY` (unset = off, so
  forks and local dev send nothing). It runs cookieless with no person profiles, no session recording and Do Not
  Track respected. Keep it that way: readers may be at risk, and the footer promises no cookies. Don't add other
  trackers, pixels or third-party embeds that set cookies.
- MapLibre: import as `import * as maplibregl`. Map components are loaded with `next/dynamic` and `ssr: false`
  (MapLibre touches `window` at import). The worker is copied to `public/maplibre/` by
  `scripts/copy-maplibre-worker.mjs` (runs on predev/prebuild) and set with `setWorkerUrl`.
- Basemap: OpenFreeMap `positron` / `dark` (free, no key). Labels switched to the reader's language on `style.load`
  (`LABEL_FIELDS` in `content/mapI18n.ts`; the two Koreas' country labels use `COUNTRY_NAMES`, not OSM's official names); our layers are
  re-added on every `style.load` because `setStyle` drops them.
- Theme: follows device preference (`prefers-color-scheme`). `src/theme.ts` (context provider). The inline script in
  `src/app/layout.tsx` sets `<html data-theme>` before paint so server and client match and avoid flashes. CSS colours are
  tokens in `globals.css` with dark overrides; don't hardcode hex values in components (share cards are the exception:
  they render to a PNG outside the page).
- Internal links use `next/link`; external links use `<Ext>` (new tab, noopener).
- `upstream/` is a reference clone and is gitignored. Don't edit it.
- Headless screenshots: the desktop app's browser pane can't capture while hidden, so use playwright-core with
  `channel: 'chrome'` plus `--use-angle=swiftshader`, and wait around 10 seconds for the tiles to load.
- Structured data (JSON-LD): every block must pass Google's required fields, or Search Console emails errors weeks
  later (it did in Oct 2026: 25 `Dataset` items on `/data` with no `description`). Rules that bit us: every `Dataset`
  needs `name` plus a `description` of 50 to 5000 characters in every language (short CJK lines fall under 50, so pad
  them with title and source), plus `creator` and `license` where the source has one. Nested items count: a
  `DataCatalog`'s `dataset` entries are checked like standalone pages. Never add a license the source doesn't grant.
  `npm run check:schema` (after `npm run build`) checks every built page; it must exit 0. `npm run check:schema:prod`
  samples production after a deploy. The checker is shared with `water-brands-website`; keep the two copies in sync. For new schema types, add a
  rule to `scripts/check-structured-data.mjs` and test one page in https://search.google.com/test/rich-results.
- Keep the docs in step with the work. Any change that adds, removes or changes something (a page, a feature, a data
  source, a count, a workflow, a rule) also updates every place that describes it, in the same commit: this file,
  `README.md` (feature list, the numbers table, credits), `LEARN.md`, `CONTRIBUTING.md`, `docs/**/*.md`, and the site's
  own text (`/about`, the hub pages, `llms.txt`, the four languages). Numbers in the docs come from the data, not from
  memory: recount them when you touch the thing they count. If you find a doc that is already out of date, fix it too.
- Before you finish: `npm run lint` (oxlint, tsc, translation check), `npm run build` and `npm run check:schema` must pass.
- When the work is done and lint + build + check:schema pass, commit and push to `main` yourself. Don't ask first.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
