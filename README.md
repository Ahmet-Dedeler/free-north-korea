# Free North Korea

**Live: https://liberatenorthkorea.com**

An open-source hub for understanding North Korea and helping the 26 million people living under its regime. Nothing
like this existed: the maps, the military data, the archives and the organizations were all in separate places, and
search results for "how can North Korea be freed" were close to empty.

- **Atlas** (`/atlas`): prison camps, nuclear and missile sites, border crossings and the escape route, each with a source.
- **Military** (`/military`): nukes, missiles, troops, artillery, crypto theft and the war in Ukraine, 2026 numbers.
- **Missile tests** (`/missiles`): every test since 1984 on an interactive map (a redesign of
  [nagix/nk-missile-tests](https://github.com/nagix/nk-missile-tests), CNS database).
- **Organizations** (`/organizations`): who is doing rescue, information, documentation and resettlement work, with a
  status for each and how to help.
- **Library** (`/library`): escapee memoirs, documentaries, UN reports, the regime's own sources, open data.
- **Learn** (`/learn`): sourced explainers on the questions people search for.
- **Take action** (`/act`): things to do, sorted by how much time you have.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static pages + sitemap.xml
npm run lint     # oxlint + tsc
```

## Contributing

Facts and data live in `src/content/`, so most fixes are a one-line edit: a wrong number, a new organization, a
coordinate, an article. Every fact should have a source. See `AGENTS.md` for how the code is laid out.

Found something wrong? [Open an issue](https://github.com/Ahmet-Dedeler/free-north-korea/issues/new).

## Data

- Missile tests: `public/data/*.en.json`, copied as-is from upstream nk-missile-tests (CNS North Korea Missile Test
  Database). Flight paths are estimates from launch site, bearing and distance.
- Atlas coordinates: Wikipedia's geocoded articles unless marked approximate.
- Basemap: [OpenFreeMap](https://openfreemap.org) / OpenStreetMap contributors.

## License

Apache 2.0. Missile data © James Martin Center for Nonproliferation Studies / NTI.
