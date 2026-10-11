# Contributing to Free North Korea

Thank you for your interest in contributing. Free North Korea is an open-source hub for understanding North Korea and supporting human rights through verified open data, maps, and research.

Every page is statically generated (Next.js 16 App Router, Turbopack, TypeScript, MapLibre GL). There is no backend.

## Safety and ethics rules (non-negotiable)

Because North Korean defectors, families, and networks face extreme risks, the following safety rules are strictly enforced:

1. **No personal incident narratives:** Never include individual surnames or personally identifying details of escapees. Summarize rights violations by county or metric. Link to primary documentation sources (such as NKDB) for aggregate research.
2. **No private coordinates:** Never publish coordinates of private homes, shelters, escape waypoints, or exact execution/burial sites. These are mapped strictly at county-level aggregate resolution.
3. **Verified sources only:** Every number, coordinate, and biographical claim must cite a reliable, publicly verifiable source. Label unconfirmed reports or rumors explicitly.
4. **No secrets or private tokens:** Never commit API keys or private credentials.

## Where things live

- **Facts and content:** `src/content/`. Most non-code contributions are small edits here:
  - `src/content/orgs.ts`: Directory of active rescue, research, and advocacy organizations.
  - `src/content/library.ts`: Books, memoirs, documentaries, and research papers.
  - `src/content/places.ts`: Geocoded points of interest and escape route landmarks.
  - `src/content/articles/*.tsx`: Explainer articles for `/learn`.
- **Translations:** `src/content/translations/` (`ko.ts` for Korean, `ja.ts` for Japanese, `zh.ts` for Chinese).
- **Map:** `src/map/` (MapLibre GL implementation, layer styles, deep links).
- **Missile explorer:** `src/missiles/` (CNS missile launch database visualization).
- **Sanctions:** `data/sanctions.json` (built weekly from the official UN 1718, US OFAC, UK, EU and Japan lists; do not edit by hand).
- **Charts and data:** `data/series/` (built weekly by `scripts/build-series.ts`; hand-checked numbers go in `data/series/curated/` with their source URL).

## Multilingual requirements

Content visible to readers is published in English, Korean (`/ko`), Japanese (`/ja`) and Simplified Chinese (`/zh`).

- A new `/learn` article needs a file with the same slug in `src/content/articles/ko/`, `ja/` and `zh/` (listed in each folder's `index.ts`). When you change facts in an English article, change every translation too.
- A new page is one shared component that takes `lang`, with its text in a `Record<Lang, …>` in `src/content/`, and four thin routes (`/x`, `/ko/x`, `/ja/x`, `/zh/x`). `/sanctions` is the model.
- Chinese uses mainland terms (朝鲜 / 韩国).
- Proper names should match established local usage (for example, 국민통일방송 or 自由アジア放送).
- `npm run lint` fails if an English article is missing its Korean, Japanese or Chinese version.

## Development setup

Requirements: Node.js 22.18+ (the build scripts run `.ts` files with plain `node`) and npm.

```bash
# Clone the repository
git clone https://github.com/Ahmet-Dedeler/free-north-korea.git
cd free-north-korea

# Install dependencies
npm install

# Start the local development server (http://localhost:3000)
npm run dev

# Run linting (oxlint, TypeScript type checks, translation checks)
npm run lint

# Build static output
npm run build

# Check structured data (JSON-LD) on every built page
npm run check:schema
```

## How to contribute

1. **Pick or open an issue:** Browse [open issues](https://github.com/Ahmet-Dedeler/free-north-korea/issues) to find something to work on. If proposing a new feature or substantial data addition, open an issue first.
2. **Create a branch:** Work on a descriptive branch (`git checkout -b feature/add-rescue-org`).
3. **Verify locally:** Ensure `npm run lint`, `npm run build` and then `npm run check:schema` pass without errors.
4. **Update the docs:** If your change adds or changes something the README, LEARN.md, CONTRIBUTING.md, AGENTS.md, `docs/**/*.md` or the site's own text describes (a feature, a count, a data source), update them in the same PR.
5. **Submit a Pull Request:** Open a PR against `main` explaining what was changed and citing your sources.
