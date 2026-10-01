# Missile data gap check brief

Our /missiles map uses public/data/test.en.json, missile.en.json and facility.en.json (copied from
github.com/nagix/nk-missile-tests, based on the CNS North Korea Missile Test Database). Read them.

Goal: find what this dataset is missing or has wrong/unknown, and fill it from other sources, especially neighbours:
- Japan Ministry of Defense (防衛省・自衛隊) launch announcements: they publish time, number, range, apogee, impact
  area (inside/outside EEZ) for each launch, plus a PDF list of all launches. Japanese PM office/Cabinet secretariat too.
- South Korea Joint Chiefs of Staff (합동참모본부) announcements via Yonhap/KBS/news (발사 시각, 비행거리, 고도, 발사 장소).
- KCNA's own claims (missile name, purpose), US INDOPACOM statements, UN Security Council letters.
- CSIS Missile Threat, Wikipedia (en/ko/ja "List of North Korean missile tests" / 북한의 미사일 발사 목록 /
  北朝鮮のミサイル発射の一覧), NK News, 38 North.
- Cruise missile and artillery/MLRS launches the CNS database excludes (note them separately, they're still useful).

## Output (docs/research/)
1. `missile_gaps.json`: { "missing_tests": [...], "field_fixes": [...], "excluded_launches": [...], "sources": [...] }
   - missing_tests: launches 2017-2026 absent from test.en.json; same field names as test.en.json where possible plus
     sources [{name,url,date}] and confidence.
   - field_fixes: {date, test_index or match key, field, current_value, proposed_value, sources[], confidence} for
     unknown/'na' apogee, distance, missile type, landing area, launch site, time, outcome.
   - excluded_launches: cruise missiles, MLRS, satellite attempts etc not in the dataset.
   - sources: each source checked with url, language, format, how to scrape, last_updated, maintenance status.
2. `missile_gaps.md`: summary with counts, the best ongoing source to keep the dataset current (and how to automate
   it), and disagreements between Japan/ROK/US figures.
Verify by actually fetching pages. Probe/scraper scripts go in docs/research/probes/missile_gaps/. Touch nothing else.
