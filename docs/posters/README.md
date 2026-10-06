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
| `kims.png` | Missiles by ruler, faces sized by count: Kim Jong Un 326, Kim Jong Il 16, Kim Il Sung 15 | CNS missile test database |
| `rice.png` | Rice in Pyongyang 8× since Jan 2024, because the won fell 8.3× against the dollar | Daily NK market survey |
| `camps.png` | 80,000 to 120,000 people in political prison camps, one figure per 1,000 | UN Commission of Inquiry (2014) |
| `army.png` | 1 in 18 North Koreans is a soldier; 1 in 91 in the South | IISS Military Balance via OWID |

Photos in `img/` are from Wikimedia Commons (CC0, public domain, CC BY-SA 3.0); each poster credits its photo
in the footer. Leader portraits come from `public/img/people/` (licenses in `data/entities/people.json`).
After rendering, the PNGs are reduced to 256 colours with Pillow to keep them under a few MB.

Rebuild after a data refresh:

```bash
node docs/posters/build.mjs
for f in missiles defectors divergence aid kims rice camps army; do npx vivid-charts render docs/posters/$f.json -o docs/posters/$f.png --scale 2; done
```
