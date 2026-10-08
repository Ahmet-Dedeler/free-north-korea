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
- County shading and status badges are rendered dynamically on top of the vector basemap.
- High-resolution satellite snapshots (`src/components/SatView.tsx`) render directly via tile coordinates without requiring full GIS map instances.

---

## 3. Data Ingestion & Sanitization

All verified facts live in typed structures under `src/content/` and `data/`.

### Missile Test Explorer
- Data is sourced from the James Martin Center for Nonproliferation Studies (CNS) North Korea Missile Test Database.
- Raw launch records are parsed on the server (`buildDataset()`) and in the browser (`loadDataset()`) in `src/missiles/data.ts`.
- Trajectories, launch sites, apogees, and outcomes are mapped dynamically using spherical geometry approximations.

### Sanctions Pipeline
- `scripts/build-sanctions.ts` fetches and validates official data feeds from the United Nations 1718 Sanctions Committee and the US Treasury OFAC DPRK sanctions lists.
- Built output is validated to prevent truncation and committed to `data/sanctions.json`.

### Ethical Data Handling
- **Differential privacy / aggregation:** Individual survivor narratives or burial sites are strictly aggregated to county-level statistics to protect living defectors and family members remaining in the DPRK.
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
2. **Automated Linting:** `scripts/check-translations.mjs` checks every article slug in CI. A build fails if an English article lacks corresponding Korean, Japanese or Chinese entries.
3. **Hreflang & Canonical Links:** `src/site/seo.ts` dynamically generates alternating language tags for search engines, ensuring search parity worldwide.

---

## 5. Getting Started as a Contributor

To explore the codebase:
1. Review `src/map/IntelMap.tsx` to see how MapLibre GL is initialized and controlled with React refs.
2. Check `src/content/articles/` to see how research articles, source citations, and FAQ schemas are defined.
3. Check `scripts/build-layers.ts` to see how raw geographic data is transformed into optimized GeoJSON layers.
