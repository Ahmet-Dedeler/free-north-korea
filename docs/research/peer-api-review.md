# Peer review: free satellite/AIS APIs for the site (2026-10-12)

Reviewer notes for the lead. Test calls were made on 2026-10-12 with the GFW token in `.env.local`. Raw responses
were kept in the session scratchpad, not in the repo.

## Terms and limits (pages loaded)

**Global Fishing Watch API v3**, https://globalfishingwatch.org/our-apis/documentation/docs/license-rate-limits.md

- Non-commercial only, under CC BY-NC 4.0 (1.C). A volunteer site that takes no money fits.
- Attribution on every page or graphic that uses the data (3.A.1): "Powered by Global Fishing Watch." linked to
  globalfishingwatch.org, or the long form with the dataset name/version, date range and access date. 3.B: anyone
  downstream must keep that attribution, so our CSV/JSON downloads must carry it too.
- Limits: 50,000 requests/day and 1,500,000/month per user, shared across all of that user's tokens (at most 5).
  The response headers confirm `x-ratelimit-daily-limit-requests: 50000`.
- **Multiple accounts: not allowed.** 2.B(4): when you register you warrant that "no other application or registration
  for this organization or entity exists". 2.G: "You may only use the API token issued to you". A friend's account used
  for this project breaks both clauses. It also gains nothing: the v1 below needs a few hundred requests a week.
- 2.B(1): you also warrant you apply for "an organization or entity that supports the sustainable use of ocean
  resources". That is a stretch for this site. 2.E forbids "derivative products from the API". That clause seems aimed
  at cloning the API, but it sits awkwardly next to CC BY-NC. It is worth one email to support@globalfishingwatch.org
  describing the use (they ask for usage reports anyway, 1.D and 2.I).
- 2.G: the token must never reach the browser. It stays in GitHub Actions secrets and the site only gets built JSON.
- 4Wings reports cover at most 366 days per request (seen as a 422 error).

**Earth Engine**: https://earthengine.google.com/noncommercial/ and
https://developers.google.com/earth-engine/guides/noncommercial_tiers. Individuals and nonprofits may use it free for
non-commercial work. The page does not cover publishing derived results; it only bans being paid for them. Since
2026-04-27, non-commercial projects have monthly quotas: Community 150 EECU-hours, Contributor 1,000 (needs a billing
account, no charge). Fine for occasional jobs, tight for weekly national-scale runs.

**NASA Earthdata**: https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance.
NASA-mission data is CC0 unless marked otherwise. Cite the dataset and credit NASA.

**Planetary Computer**: STAC `sentinel-1-rtc` says `license: CC-BY-4.0` (Catalyst/Copernicus terms, attribution
required). The anonymous SAS token lasts about 1 hour (`msft:expiry`). I found no published rate limit.

## What the GFW data shows for Korea (test calls)

1. **Sanctioned ships are on AIS, under their own names.** `data/sanctions.json` has 53 "IMO" values, but 15 of them
   (5xxxxxx) are IMO *company* numbers written in UN entity notes, not ships. Fix this in the build. All 38 ship IMOs
   resolve in `public-global-vessel-identity`. Several broadcast as PRK-flagged within the last two weeks: PUK DAE BONG
   (UN "Hua Fu", IMO 9020003) on 2026-10-06, ANSAN1 on 10-04, CHON MA SAN on 10-03, PAEK YANG SAN on 10-02 and
   SONG WON2 on 09-27.
2. **Port visits by UN-listed ships at Chinese ports in 2026** (all confidence 4, the highest): ANSAN1 at Shanghai on
   2026-09-21 to 24; KUMJINGANG3 at Fuzhou, Quanzhou and Xiamen on 08-05 to 10, then Shanghai on 08-25; CHON MA SAN at
   Fuzhou on 03-03 to 10. This is the strongest single finding of this review.
3. **Encounters do not cover tanker-to-tanker transfers.** The allowed `encounter-types` are fishing, carrier, bunker
   and support pairs plus NON_FISHING. `NON_FISHING-NON_FISHING` over lon 119-132, lat 30-43 for 2026 returned 0
   events. All 500 sampled encounters in the Korea box were fishing-fishing. Sanctioned vessels: 0 encounters since 2020.
4. **AIS gaps are useless here.** `public-global-gaps-events` is labelled a prototype and counts only gaps of 12 hours
   or more that start at least 50 nm from shore. Results: 0 events in the Korea box for Aug to Oct 2026, and 0 for the
   sanctioned vessels since 2020. The Insights API also returns `coverage: null` for them.
5. **SAR is well covered, and nearly all of it is dark.** Sentinel-1 scenes over Korea Bay (Planetary Computer STAC)
   run 8 to 18 a month, now from S-1A, 1C and 1D. GFW SAR detections inside the North Korean EEZ (region 8328) match
   AIS for only 0.6 to 3.2% of vessels each month. For 2026-09: 12,447 detections, 99.4% unmatched. The Nampo
   approaches alone had 4,858 that month. The newest daily SAR data was 2026-10-09 (about 3 days old); events end
   2026-10-08.
6. AIS presence in the NK EEZ from 2025-10 to 2026-10: 2,730 Chinese-flagged vessel IDs and 280 PRK-flagged ones.

## Recommendation: one v1

**"Sanctioned ships, as AIS shows them"**: a translated page (`/sanctions/ships`, linked from `/sanctions` and `/watch`)
built weekly by `scripts/build-ships.ts` → `data/ships.json`. It has two parts.

- For each of the 38 listed ship IMOs: which lists name it (already in `targets`), the AIS identity as broadcast (name,
  flag, MMSI), when it was last seen, and port visits for the last 12 months at confidence 3 or 4, with each port's
  country. Flag visits to ports outside the DPRK, and show the date next to each one. Quote the UN resolution text on
  port entry from the resolution itself (I did not load it).
- One measured number per month: "share of radar-detected vessels in North Korean waters that broadcast no AIS".
  Show it next to the detection count and the number of Sentinel-1 scenes. Publish counts only, never single
  detections.

Cost: about 38 vessel calls plus a handful of events and 4Wings calls a week, far under quota. It is "measured, not
claimed", useful to journalists (Lloyd's List covers the same beat), SEO-friendly ("North Korea sanctioned ships"), and
legally plain: we join two official sources and say what each says.

## Objections to the lead's ideas

- "Dark Fleet" as framed (STS transfers, AIS gaps) is not available from GFW: see points 3 and 4. Inferring STS
  transfers from our own SAR pairs would mean publishing guesses about named ships.
- An unmatched SAR detection is not a sanctions case. Most are Chinese and North Korean fishing boats (Park et al.
  2020, Sci. Adv., doi:10.1126/sciadv.abb1197). The detector misses most vessels under 15 m and skips everything within
  1 km of shore, so the ports themselves and North Korea's small wooden boats are invisible.
- Identity: AIS is self-reported. KUMJINGANG3's IMO used to belong to "WAN HENG 11" (Belize), and CHON MA SAN shows a
  second identity on MMSI 111122000, which is not a valid ship MMSI. Say "broadcast as" every time.
- Our own CV model: not worth it. GFW's SAR detections (pipeline v4) already arrive about 3 days late, AIS-matched, for
  free.
- Camp finder: fine for internal leads only, and false positives are expensive. SAR coherence at nuclear sites needs
  SLC data and InSAR processing, which C-band handles poorly over snow and vegetation. The Landsat 40-year history
  (30 m pixels) only works for whole large camps. Night lights by county: NK is near the sensor noise floor. It is a
  reasonable v2 because it is aggregate and NASA data is CC0.
