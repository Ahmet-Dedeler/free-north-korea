// Prints the Camp Watch target list as JSON for scripts/sentinel/build.py.
//   node scripts/sentinel/targets.ts
//
// One target per place in src/content/places.ts with category camp, nuclear or missile. Camps are matched by name to
// the camp dossier points in public/layers/camps.geojson and keyed by the dossier slug (kwanliso-14), because map ids
// collide (camp-14 on the map is the I-gol facility). Other places are keyed by their places.ts id, which is also
// their /places/<slug>.
import { readFileSync } from 'node:fs';
import { campSlug } from '../../src/content/mapSlugs.ts';
import { PLACES } from '../../src/content/places.ts';
import { CHIP_M_DEFAULT, CHIP_M_KWANLISO, CHIP_M_OVERRIDE, OUT_PX, SAT_CATEGORIES } from '../../src/content/satWatchSites.ts';

type Feature = { geometry: { coordinates: [number, number] }; properties: { id: string; name: string; kind: string } };
const camps: Feature[] = JSON.parse(readFileSync('public/layers/camps.geojson', 'utf8')).features;
const norm = (s: string) => s.toLowerCase().replace(/kyo-?hwa-?so/g, 'kyohwaso').replace(/[^a-z0-9]/g, '');

const targets = PLACES.filter((p) => (SAT_CATEGORIES as readonly string[]).includes(p.category)).map((p) => {
  if (p.category !== 'camp') {
    return { id: p.id, name: p.name, category: p.category, lat: p.lat, lon: p.lon, sizeM: CHIP_M_OVERRIDE[p.id] ?? CHIP_M_DEFAULT, outPx: OUT_PX };
  }
  const f = camps.find((c) => norm(c.properties.name) === norm(p.name));
  if (!f) throw new Error(`No camp dossier point named like "${p.name}" in camps.geojson`);
  const [lon, lat] = f.geometry.coordinates;
  const kwanliso = f.properties.kind.includes('kwanliso');
  return {
    id: campSlug(f.properties.id),
    name: p.name,
    category: p.category,
    lat,
    lon,
    sizeM: CHIP_M_OVERRIDE[p.id] ?? (kwanliso ? CHIP_M_KWANLISO : CHIP_M_DEFAULT),
    outPx: OUT_PX,
    // The atlas point in places.ts, kept so the build can report how far it is from the dossier point.
    atlas: { id: p.id, lat: p.lat, lon: p.lon },
  };
});

process.stdout.write(JSON.stringify(targets, null, 2) + '\n');
