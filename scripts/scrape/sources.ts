// Scrapers for the map's upstream sources. Each writes raw-but-trimmed JSON into data/raw/<source>/.
// scripts/build-layers.ts turns these into map layers. Visual Atlas has its own scraper (needs a browser).
//   node scripts/scrape/sources.ts                 # all
//   node scripts/scrape/sources.ts nkpd markets    # some
// Sources (see docs/research/*.json for how each was found and checked):
//   nkpd          Korea Future's North Korean Prison Database (Uwazi API, nkpd.io)
//   hrnk          HRNK prison camp location map (Google My Maps KML)
//   markets       CSIS Beyond Parallel market study (436 markets, CARTO SQL API)
//   missile-bases CSIS Beyond Parallel "Undeclared North Korea" missile operating base reports
//   admin         UN OCHA COD-AB boundaries + COD-PS 2008 census population (HDX)
//   provocations  CSIS provocations database, daily mirror by Matt Stiles (GitHub)
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

const UA = 'free-north-korea data pipeline (+https://github.com/Ahmet-Dedeler/free-north-korea)';
const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

async function get(url: string, ua = UA) {
  const res = await fetch(url, { headers: { 'user-agent': ua }, redirect: 'follow', signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}
function save(source: string, file: string, data: unknown) {
  mkdirSync(`data/raw/${source}`, { recursive: true });
  writeFileSync(`data/raw/${source}/${file}`, JSON.stringify(data, null, 1) + '\n');
}
const meta = (url: string, extra: Record<string, unknown> = {}) => ({ scrapedAt: new Date().toISOString(), url, ...extra });

const SCRAPERS: Record<string, () => Promise<string>> = {
  async nkpd() {
    const url = 'https://nkpd.io/api/search?types=%5B%225ffd3802a52dd767e173941b%22%5D&limit=1000';
    const d = (await (await get(url)).json()) as { rows: any[]; totalRows: number };
    const lab = (m: any, k: string) => m[k]?.[0]?.label?.trim() ?? null;
    const rows = d.rows.map((r) => {
      const g = r.metadata.geolocation_geolocation?.[0]?.value;
      return {
        id: r.sharedId,
        name: r.title.trim(),
        type: lab(r.metadata, 'type_of_penal_facility'),
        affiliation: lab(r.metadata, 'penal_facility_by_organisational_affiliation'),
        agency: lab(r.metadata, 'organisation_in_charge'),
        province: lab(r.metadata, 'province'),
        status: lab(r.metadata, 'penal_facility_status'),
        lat: g?.lat ?? null,
        lon: g?.lon ?? null,
        url: `https://nkpd.io/en/entity/${r.sharedId}`,
        edited: r.editDate ? new Date(r.editDate).toISOString().slice(0, 10) : null,
      };
    });
    save('nkpd', 'facilities.json', { ...meta(url, { total: d.totalRows }), facilities: rows });
    return `${rows.length} facilities, ${rows.filter((r) => r.lat).length} with coordinates`;
  },

  async hrnk() {
    const url = 'https://www.google.com/maps/d/kml?mid=1uo5xseZysdNTIY-I-rTsXUWWYDu5UnGx&forcekml=1';
    const kml = await (await get(url, BROWSER_UA)).text();
    const camps = [...kml.matchAll(/<Placemark>([\s\S]*?)<\/Placemark>/g)].map((m) => {
      const b = m[1];
      const tag = (t: string) =>
        b
          .match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1]
          ?.replace(/<!\[CDATA\[|\]\]>/g, '')
          .trim() ?? '';
      const [lon, lat] = tag('coordinates').split(',').map(Number);
      return { name: tag('name'), description: tag('description').replace(/<br>/g, '\n').replace(/<[^>]+>/g, ''), lat, lon, style: tag('styleUrl') };
    });
    save('hrnk', 'camps.json', { ...meta(url), camps });
    return `${camps.length} camps`;
  },

  async markets() {
    const url = 'https://csis.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20dprkmarkets_by_geocoordinates&api_key=xb32vxt3qQmJKxxxze77nw&format=geojson';
    const d = (await (await get(url)).json()) as { features: any[] };
    const markets = d.features
      .filter((f) => f.geometry)
      .map((f) => {
        const p = f.properties;
        const num = (v: unknown) => (typeof v === 'number' && v > 0 ? v : typeof v === 'string' && /^\d/.test(v) ? Number(v.replace(/,/g, '')) : null);
        return {
          id: p.cartodb_id,
          name: p.name,
          lon: f.geometry.coordinates[0],
          lat: f.geometry.coordinates[1],
          area_m2: num(p.area_m2_),
          stalls: num(p.no_of_stalls),
          revenue_kpw: num(p.estimated_revenue_kpw_),
          revenue_usd: num(p.estimated_revenue_usd),
          km_to_pyongyang: num(p.distance_to_pyongyang_km_),
          km_to_border: num(p.distance_to_border_km_),
        };
      });
    save('markets', 'markets.json', { ...meta('https://beyondparallel.csis.org/markets-in-north-korea/'), markets });
    return `${markets.length} markets`;
  },

  async 'missile-bases'() {
    // One report per base. We take the base's headline coordinate (first point inside North Korea in the text),
    // the report title, date and summary. Imagery stays on CSIS's site (copyright), we link to it.
    const pages = [
      'undeclared-north-korea-sinpung-dong-missile-operating-base',
      'undeclared-north-korea-the-yongnim-missile-operating-base',
      'undeclared-north-korea-hoejung-ni-missile-operating-base',
      'undeclared-north-korea-the-yusang-ni-missile-operating-base',
      'undeclared-north-korea-the-kal-gol-missile-operating-base',
      'undeclared-north-korea-the-kumchon-ni-missile-operating-base',
      'undeclared-north-korea-sangnam-ni-missile-operating-base',
      'undeclared-north-korea-the-sino-ri-missile-operating-base-and-strategic-force-facilities',
      'undeclared-north-korea-sakkanmol-missile-operating-base',
      'undeclared-north-korea-the-yeongjeo-dong-missile-operating-base-and-the-hoe-jung-ni-missile-base',
      'undeclared-north-korea-the-sino-ri-missile-operating-base',
      'undeclared-north-korea-the-chiha-ri-missile-operating-base',
      'undeclared-north-korea-the-sakkanmol-missile-operating-base',
      'undeclared-north-korea-the-kal-gol-missile-operating-base-2',
    ];
    const bases: any[] = [];
    const failed: string[] = [];
    for (const slug of pages) {
      const url = `https://beyondparallel.csis.org/${slug}/`;
      let html: string;
      try {
        html = await (await get(url, BROWSER_UA)).text();
      } catch {
        failed.push(slug);
        continue;
      }
      const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').replace(/&#8217;/g, '’').replace(/\s+/g, ' ');
      const pt = [...text.matchAll(/(\d{2}\.\d{4,})\s*°?\s*N?\s*,?\s*(\d{3}\.\d{4,})\s*°?\s*E?/g)]
        .map((m) => [Number(m[1]), Number(m[2])])
        .find(([la, lo]) => la > 37.6 && la < 43.1 && lo > 124 && lo < 131);
      if (!pt) {
        failed.push(slug);
        continue;
      }
      const og = (p: string) => html.match(new RegExp(`<meta[^>]+property=["']${p}["'][^>]*content=["']([^"']*)`, 'i'))?.[1] ?? null;
      const name = (og('og:title') ?? slug).replace(/^Undeclared North Korea:\s*/i, '').replace(/\s*[-|–].*Beyond Parallel.*$/i, '').trim();
      if (bases.some((b) => Math.abs(b.lat - pt[0]) < 0.01 && Math.abs(b.lon - pt[1]) < 0.01)) continue;
      bases.push({ name, lat: pt[0], lon: pt[1], url, published: og('article:published_time')?.slice(0, 10) ?? null, summary: og('og:description') });
    }
    save('missile-bases', 'bases.json', { ...meta('https://beyondparallel.csis.org/'), bases, failed });
    return `${bases.length} bases (${failed.length} pages missing or without coordinates)`;
  },

  async admin() {
    const ab = 'https://data.humdata.org/dataset/0cd9579f-ca75-4af4-88e1-9c5fa0bbb7ab/resource/3481e99e-bf95-45d1-a057-46c7b2d46726/download/prk_admin_boundaries.geojson.zip';
    const ps = 'https://data.humdata.org/dataset/0b26b6ed-8bcb-4c9a-9c69-ba3df48162c4/resource/f21a15b9-2ccb-4917-985f-1ab64c379526/download/prk_pop_adm2_v2.csv';
    const dir = mkdtempSync(`${tmpdir()}/fnk-admin-`);
    writeFileSync(`${dir}/ab.zip`, Buffer.from(await (await get(ab)).arrayBuffer()));
    execFileSync('unzip', ['-o', '-q', `${dir}/ab.zip`, '-d', dir]);
    // simplify the county polygons for the web (1.6 MB → ~200 KB) and keep only the fields we use
    mkdirSync('data/raw/admin', { recursive: true });
    for (const lvl of ['1', '2']) {
      execFileSync('npx', ['mapshaper', `${dir}/prk_admin${lvl}.geojson`, '-simplify', '8%', 'keep-shapes', '-filter-fields', lvl === '1' ? 'adm1_name,adm1_name1,adm1_pcode,area_sqkm' : 'adm2_name,adm2_name1,adm2_pcode,adm1_name,adm1_pcode,area_sqkm', '-o', `data/raw/admin/admin${lvl}.geojson`, 'precision=0.0001', 'force'], { stdio: 'ignore' });
    }
    const csv = (await (await get(ps)).text()).replace(/^﻿/, '');
    const [head, ...lines] = csv.trim().split(/\r?\n/);
    const cols = head.split(',');
    const pop = lines.map((l) => Object.fromEntries(l.split(',').map((v, i) => [cols[i], /^\d+$/.test(v) ? Number(v) : v])));
    save('admin', 'population.json', { ...meta(ps, { boundaries: ab, note: '2008 DPRK census (UNFPA-supported), civilian population by county' }), counties: pop });
    return `${pop.length} counties with population`;
  },

  async provocations() {
    const url = 'https://raw.githubusercontent.com/stiles/north-korea-provocations/main/data/processed/north_korea_provocations_1958_present.json';
    const events = (await (await get(url)).json()) as any[];
    save('provocations', 'events.json', { ...meta(url, { upstream: 'https://beyondparallel.csis.org/database-north-korean-provocations/' }), events });
    return `${events.length} events, latest ${events.map((e) => e.date).sort().at(-1)}`;
  },
};

const want = process.argv.slice(2);
for (const [name, run] of Object.entries(SCRAPERS)) {
  if (want.length && !want.includes(name)) continue;
  try {
    console.log(`${name.padEnd(14)} ${await run()}`);
  } catch (e) {
    console.log(`${name.padEnd(14)} FAILED: ${(e as Error).message}`);
  }
}

