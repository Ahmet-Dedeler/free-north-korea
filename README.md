# North Korea missile tests: a clearer explorer

**Live: https://free-north-korea.vercel.app**

A redesign of [nagix/nk-missile-tests](https://github.com/nagix/nk-missile-tests). Same data (the CNS North Korea
Missile Test Database, 357 tests from 1984 to 2026), with a UI you can actually read:

- **Light map** (MapLibre + OpenFreeMap Positron, English labels). You can zoom out to a globe.
- **Flight paths coloured by missile class** (SRBM → ICBM, space launches, unidentified). Failed tests are dashed.
  You can switch the colours to success/failure/unknown.
- **Sidebar**: headline stats, search, type/outcome filter chips with counts, and every test listed by year.
- **Timeline histogram**: click a year or drag across a range. The bars stay visible when they're outside the range,
  so you keep the context.
- **Detail card**: date and time, launch site, splashdown area, range, apogee, a to-scale side view of the flight
  (so lofted ICBM shots read as lofted), the full description, and ←/→ to step through tests.
- **Shareable links**: `#test=2022-03-24-hwasong-15`.
- Works on phones: map on top, list below, details in a bottom sheet.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/ (relative base, works on GitHub Pages)
```

## Data

`public/data/*.en.json` are copied as-is from upstream. `src/data.ts` normalises them: numbers stored as strings,
the `unknown`/`na` sentinels, estimated impact points from bearing + distance, and glide/MaRV legs. To update, copy
fresh `data/*.en.json` from upstream.

Flight paths are estimates (launch site + reported bearing + reported distance), not tracks. Tests with no public
distance have no path.

`upstream/` is a local clone of the original repo for reference. It's gitignored.

## License

Apache 2.0, like upstream. Data © James Martin Center for Nonproliferation Studies / NTI.
