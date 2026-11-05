# Planet layer of Camp Watch

PlanetScope images of the same squares as our Sentinel-2 images: 8 camps and 9 nuclear and missile sites, at 3.5 to 3.7 m
per pixel against Sentinel-2's 10 m. Shown above the Sentinel-2 block on dossiers (`PlanetWatch` in
`components/SatWatch.tsx`) and behind the "Sharper images" button in the map panel (`PlanetViewer` in `map/Photo.tsx`).

## Permission

Publishing was cleared between lawyers on both sides, per Ahmet, 2026-11-05. Credit `Imagery © Planet Labs PBC` wherever
an image is shown.

## API

- Base `https://ai.planet.com/api`. Every call sends `Authorization: Bearer <pat>` and `X-User-Id: <uid>`.
- `GET /tiles/planetscope/:date/:z/:x/:y`. `date` is `YYYY-MM` (monthly mosaic) or `YYYY-MM-DD` (one day, z10 and up).
  The response headers `X-Pv-Resolved-Mosaic` and `X-Pv-Source-Cadence` say what was served.
- Tokens are `PV_PAT_2..4` and `PV_UID_2..4` in `.env.local` only. Account 1 is overdrawn and not used.

## What was measured

| Fact | Value |
| --- | --- |
| Cost of a tile | About 1 credit at any zoom (0.9 to 1.04). A tile with no imagery costs nothing |
| `/searches` | **Never call it.** Four searches cost about 11,850 credits |
| Useful maximum zoom | z15. z16 only upsamples it (r=0.985 at Sohae, 2025-07-09) |
| Monthly mosaics | Back to at least 2016-06, up to the last full month |
| Daily images | Not available for the last 30 days on these accounts |

## How dates are chosen

No searches, so dates come from free data.

1. **History:** the monthly mosaic of October each year since 2016, so the season matches (September or November if
   October fails).
2. **Recent composites:** every 2nd of the last 12 months at weapons sites, every 3rd (three at most) at camps.
3. **Single days:** one per 2 months (weapons sites) or 3 months (camps) over the last 24 months, from days our Sentinel-2
   run measured as clear inside the square (`data/sentinel/scl-cache.json`).

## How frames are checked

1. **z12 preview, at most 4 credits.** Coverage at least 99.5%, little bright colourless pixel area beyond what the
   2025-10 composite of the same square has (coasts and shipyards are bright all year), and correlation with that
   composite (0.6 for a day, 0.5 for a composite) and with the same day's Sentinel-2 chip (0.7) where there is one.
2. **Full image of a day:** a test for straight no-data seams between Planet's strips, which previews hide.
3. **A person reads the contact sheets** in `$PLANET_CACHE/sheets/<id>.jpg`. The checks above are not enough: on the
   first full run they let through 15 frames out of 346 (clouds, seams, haze, missing corners). Anything found goes in
   `scripts/planet/rejected.json` with the reason. That removes it from the site and from the disk, and the next run tries
   that slot's next candidate.

Colours are left as Planet serves them. Balancing a day against a composite was tried and looked false, so only the
composites compare cleanly. The page says this.

## Re-running

```bash
uv run scripts/planet/build.py --plan
```

`--plan` spends nothing. Then:

```bash
uv run scripts/planet/build.py --max-credits 1500
```

- Runs by hand, not in the weekly Action, because the tokens are in `.env.local` only. A new month costs about 1,100
  credits for all sites.
- `--max-credits` defaults to 500. An account stops being used below 300 credits, and the richest account pays.
- Paid tiles are kept lossless in `$PLANET_CACHE` (default `~/Code/free-north-korea-ops/planet`) and never fetched twice.
  Frames already published are skipped, so a re-run only pays for what is new.
- The client refuses any path except tiles, balance and health.

## Output

- `public/img/planet/<id>/<date>.webp`, and `<date>-768.webp` for phones.
- `data/planet.json`: the manifest the site reads.
- `data/planet/probes.json`: preview numbers for every candidate, so a re-run does not pay for them again.

## Results

First full run, 2026-11-05: 17 sites, 336 frames (234 monthly composites, 102 single days), 143 MB including the
phone copies. It spent about 19,600 credits on the full run and on replacing rejected frames, plus the previews and
Sohae before that. About 6,330 credits are left across accounts 2, 3 and 4 (2,110 each). Slots with no good candidate
stay empty, which is why sites have different frame counts: Camp 16 has 1 single day, Kusong has 10.

Night lights, crop greenness and ship radar gain nothing from Planet, so they stay as they are. Sentinel-2 stays the
monthly record: it is free, its colours are comparable, and it runs in the weekly Action.
