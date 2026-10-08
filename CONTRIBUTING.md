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
- **Sanctions:** `data/sanctions.json` (built weekly from official UN 1718 and US OFAC lists; do not edit by hand).

## Multilingual requirements

Content visible to readers is published in English, Korean (`/ko`), Japanese (`/ja`) and Simplified Chinese (`/zh`).

- When adding or editing an article in `/learn`, matching entries must be updated in `src/content/translations/ko.ts` and `src/content/translations/ja.ts`.
- Proper names should match established local usage (for example, 국민통일방송 or 自由アジア放送).
- Running `npm run lint` will verify translation parity across all three languages.

## Development setup

Requirements: Node.js 20+ and npm.

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
```

## How to contribute

1. **Pick or open an issue:** Browse [open issues](https://github.com/Ahmet-Dedeler/free-north-korea/issues) to find tasks marked `good first issue` or `help wanted`. If proposing a new feature or substantial data addition, open an issue first.
2. **Create a branch:** Work on a descriptive branch (`git checkout -b feature/add-rescue-org`).
3. **Verify locally:** Ensure `npm run lint` and `npm run build` pass without errors.
4. **Submit a Pull Request:** Open a PR against `main` explaining what was changed and citing your sources.
