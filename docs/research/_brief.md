# Research brief (shared by all tracks)

Project: an open-source, map-first "Palantir for helping free North Korea" (Next.js site in this repo, live at
https://free-north-korea.vercel.app). We want every piece of public intel on North Korea that is raw, scattered,
badly presented, abandoned, or only available in Korean/Japanese, so we can scrape it, normalise it and show it on
maps, charts and timelines. Well-run things (e.g. Liberty in North Korea) we just link to. Unmaintained or unexplored
things we rebuild. Example of what we already did: nagix/nk-missile-tests data → our /missiles map.

## Your job
Research ONLY your track (below). Go deep: English, Korean (한국어) and Japanese (日本語) searches, government portals,
NGO sites, academic datasets, GitHub, HDX, Kaggle, archive.org, Google Earth KML/KMZ files, Google My Maps,
ArcGIS/Esri story maps, Wikipedia/Wikidata. Look inside sites: open network requests / JS bundles for hidden JSON APIs,
check for /api/, .geojson, .kml, .csv, .xlsx, sitemap.xml. ACTUALLY FETCH endpoints (curl) to verify they work and see
the real format, record counts and latest dates. Don't guess. If you can't verify, say so.

For every source also determine maintenance: last update date (from data, changelog, Last-Modified header, GitHub
commits, page dates) and whether it's active / sporadic / stale / dead, and whether the source moved or changed.

Do NOT modify anything outside docs/research/. Do not write app code. Small probe scripts are fine in
docs/research/probes/<track>/ (keep them; they become our scrapers). Never download huge files (>200 MB); just record
their size and URL. Be polite to servers (no hammering, small samples).

## Output (both files, in docs/research/)
1. `<track>.json`: an array of objects with exactly these keys:
   id (kebab-case), name, publisher, url, language (en|ko|ja|other), category, description (1-2 sentences),
   has_geo (true if records have coordinates or map to admin areas), geo_detail (point / polygon / admin-level / none),
   format (e.g. json-api, geojson, kml, csv, xlsx, pdf-tables, html), access (download | api | scrape | manual | none),
   endpoint (exact URL(s) or request shape you verified, else null), record_count (number or null),
   coverage (time span + area), last_updated (YYYY-MM-DD or YYYY-MM or null), last_updated_evidence (how you know),
   maintenance (active | sporadic | stale | dead | unknown), update_cadence, license (terms if stated, else "unstated"),
   presentation (how it's currently shown and why it's bad/good), value (1-5 for our map-first site),
   build_idea (what we'd make from it), verified (true only if you fetched real data), notes.
2. `<track>.md`: a short human report: top 10 sources ranked by value, what's raw/unexplored and worth building first,
   gaps where no data exists, and any legal/safety concerns (never publish info that could identify witnesses or
   people inside North Korea).

Aim for 20-40 sources in your track, quality over padding.
