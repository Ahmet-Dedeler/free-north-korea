# Learning Free North Korea

This guide explains the architecture, design choices, and data workflows behind Free North Korea. It is written for students and developers interested in open-source intelligence (OSINT), web-based GIS (geospatial information systems), and high-performance multilingual web architecture.

---

## 1. System Architecture

Free North Korea is built as a **100% statically generated web application (SSG)** using:
- **Next.js 16 (App Router + Turbopack)**
- **React 19 & TypeScript**
- **MapLibre GL v6** for interactive vector cartography
- **OpenFreeMap** for basemaps (open-source, open-data, no API keys or telemetry)

### Why 100% Static?
1. **Security:** There is no database or backend server to attack or breach.
2. **Speed & Reliability:** Static HTML, GeoJSON, and JSON bundles can be cached globally on edge CDNs (such as Vercel).
3. **SEO:** Search crawlers receive pre-rendered HTML containing complete articles, structured data (`Article`, `FAQPage`, `Dataset`), and metadata.

---

## 2. Geospatial & Mapping Pipeline

Interactive mapping is central to the project (`/map` and `/missiles`).

### Basemaps
Rather than relying on proprietary tile providers that require API keys and enforce rate limits, the map uses **OpenFreeMap** (`positron` and `dark` styles) based on OpenStreetMap data. 
- MapLibre GL is dynamically imported with `{ ssr: false }` because it depends on the browser's `window` object and WebGL context.
- The MapLibre web worker is copied locally to `public/maplibre/` during prebuild to avoid third-party script dependencies.

### Custom Layers & Data
- Administrative boundaries (provinces, counties) and facilities (camps, missile bases, nuclear sites) are stored in GeoJSON format under `public/layers/`.
- Counties can be shaded by documented abuses, population, density, detention sites, markets or NASA night lights, drawn on top of the vector basemap. Deep links such as `/map#county=KP0205` or `/map#camps=camp-3` open a county or point directly.
- High-resolution satellite snapshots (`src/components/SatView.tsx`) render directly via tile coordinates without requiring full GIS map instances.

---

## 3. Data Ingestion & Sanitization

All verified facts live in typed structures under `src/content/` and `data/`.

### Missile Test Explorer
- Data is sourced from the James Martin Center for Nonproliferation Studies (CNS) North Korea Missile Test Database.
- Raw launch records are parsed on the server (`buildDataset()`) and in the browser (`loadDataset()`) in `src/missiles/data.ts`.
- Trajectories, launch sites, apogees, and outcomes are mapped dynamically using spherical geometry approximations.

### Sanctions Pipeline
- `scripts/build-sanctions.ts` downloads the official lists: the United Nations 1718 Sanctions Committee entries, the US Treasury OFAC DPRK programs, and the UK, EU and Japan lists. `scripts/sanctions/match.ts` then works out which entries on different lists are the same target.
- The script refuses to write if the UN or US list looks truncated; a national list that fails keeps its previous copy. Output goes to `data/sanctions.json` with the download date, and a weekly GitHub Action reruns it.

### Scheduled Data Jobs
Two GitHub Actions keep the site current without a backend. Each job commits only when its data changed, and every
file carries the date it was fetched so the page can show how old it is.
- **Every 3 hours** (`event-wire.yml`): USGS earthquake readings around North Korea (`data/seismic.json`), Japan
  Ministry of Defense missile launch reports (`data/launch-reports.json`) and KCNA's reports of Kim Jong Un's public
  appearances (`data/kimwatch.json`, always labelled as the regime's claim).
- **Weekly** (`check-sources.yml`): every cited source checked for changes or dead links (`/sources`), the sanctions
  lists, new missile tests, the chart datasets (`data/series/`), Sentinel-2 satellite images of the camps and
  nuclear/missile sites (`public/img/sentinel/`), and a full Kim Watch refresh.

### Ethical Data Handling
- **Aggregation:** Victims' homes and exact execution or burial sites are never pinned. They only count toward their county's total, and incident narratives (which contain surnames) are left out, to protect defectors and the families still in North Korea.
- **Verification:** Every data point requires verification against published records, satellite imagery, or documentation before inclusion.

---

## 4. Multilingual Architecture & Internationalization (i18n)

The site is served simultaneously in four languages:
- **English:** `/`
- **Korean:** `/ko/`
- **Japanese:** `/ja/`
- **Simplified Chinese:** `/zh/`

### How It Works:
1. **Shared Layout & Components:** Pages share visual components that accept a `lang` property and read from typed translation records (`src/content/translations/`).
2. **Automated Linting:** `scripts/check-translations.mjs` runs as part of `npm run lint` and fails if an English article lacks its Korean, Japanese or Chinese file.
3. **Hreflang & Canonical Links:** `src/site/seo.ts` dynamically generates alternating language tags for search engines, ensuring search parity worldwide.

---

## 5. Getting Started as a Contributor

To explore the codebase:
1. Review `src/map/IntelMap.tsx` to see how MapLibre GL is initialized and controlled with React refs.
2. Check `src/content/articles/` to see how research articles, source citations, and FAQ schemas are defined.
3. Check `scripts/build-layers.ts` to see how raw geographic data is transformed into optimized GeoJSON layers.
