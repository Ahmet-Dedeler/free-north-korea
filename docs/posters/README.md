# Posters

Shareable data illustrations (1200×1500, rendered at 2×) made with
[vivid-charts](https://github.com/Ahmet-Dedeler/vivid-charts). `build.mjs` writes each spec straight from
`data/series/series.json`, so every number matches the site's charts and sources.

| file | story | data |
|---|---|---|
| `missiles.png` | 326 of 357 missiles were fired under Kim Jong Un | CNS missile test database |
| `defectors.png` | Arrivals in the South fell from 2,914 (2009) to 63 (2021); 75% women | Ministry of Unification |
| `divergence.png` | The North was richer in 1940; South Korea is now 26× richer | Maddison Project 2023 |
| `aid.png` | UN-reported humanitarian funding down 99% from the 2002 peak | UN OCHA FTS |

Rebuild after a data refresh:

```bash
node docs/posters/build.mjs
for f in missiles defectors divergence aid; do npx vivid-charts render docs/posters/$f.json -o docs/posters/$f.png --scale 2; done
```
