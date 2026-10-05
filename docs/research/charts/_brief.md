# Research brief: chartable data (Our World in Data style)

Project: free-north-korea (Next.js site in this repo, live at https://free-north-korea.vercel.app), an open-source hub
for understanding North Korea. Earlier research (docs/research/*.md) was map-first. This round is chart-first: we want
Our World in Data style charts (time series, comparisons with South Korea / China / world, rankings) built from real,
dated, cited data. Read docs/research/_brief.md and data/sources/registry.json first so you don't repeat known sources,
but DO re-check known sources for time-series value and freshness.

## Principles
- If a source already publishes a series well (clean CSV/API, maintained), we just pull it. Note the exact pull URL.
- If data exists but is badly kept (numbers buried in PDFs/HWP/press releases/news articles, scattered across years,
  abandoned, Korean/Japanese only), that's our chance: we scrape and publish the clean, centralized dataset ourselves.
  Say exactly how we'd extract it.
- We want the LATEST data. For each series give the most recent data point you actually saw (year/month + value) and
  how often it updates. 2025 and 2026 numbers matter most.
- Search in English, Korean (한국어) and Japanese (日本語). Government sites (go.kr, go.jp, .gov, un.org), NGOs,
  academic datasets, GitHub, HDX, Kaggle, archive.org.
- ACTUALLY FETCH (curl) endpoints/files to confirm they work, their format, year range and latest value. Earlier agents
  invented URLs and IDs; anything you didn't fetch must have verified=false. If a site blocks curl, say so.
- Be polite: small samples, no hammering, never download files > 200 MB (record size + URL).

## Where to write
ONLY inside docs/research/charts/. Probe scripts go in docs/research/charts/probes/<track>/ (they become our scrapers).
Small verified samples (CSV/JSON < 1 MB) may go in docs/research/charts/samples/<track>/. Do not touch anything else in
the repo (another agent is editing app code right now). No git commands that change state.

## Output
1. `docs/research/charts/<track>.json`: array of SERIES (not just sites), each object with keys:
   id (kebab-case), title, publisher, url (human page), pull (exact machine URL / API request / scrape target, or null),
   language (en|ko|ja|other), unit, frequency (annual|monthly|weekly|irregular|snapshot), coverage_start,
   coverage_end (latest period present), latest_value (string, e.g. "2025: 224 people"), geo (national | province |
   county | point), compare (which other countries/series it can be shown next to, e.g. "ROK, China, world"),
   format (csv|json-api|xlsx|hwp|pdf-tables|html|news-text), access (download|api|scrape|manual), maintenance
   (active|sporadic|stale|dead), license, presentation (how it's shown today, why good/bad), opportunity
   (pull | scrape-and-centralize | compute-ourselves), chart_idea (one concrete OWID-style chart), value (1-5),
   verified (true only if you fetched real data), notes.
2. `docs/research/charts/<track>.md`: short report: top 10 series by value with their latest point, which ones we
   should scrape/centralize ourselves because nobody keeps them well, gaps where no data exists, and safety concerns
   (never publish anything that could identify witnesses or people inside North Korea).

Aim for 20-40 series, quality over padding. Finish by printing a 10-line summary.
