// Downloads images for library items (covers / posters) and organizations (logos) into public/img/,
// and writes src/content/media.json mapping each item to its local file plus where it came from.
// Re-run any time: existing files are kept unless --force is passed.
//   node scripts/fetch-media.ts [--force]
//
// Covers: Open Library (book search → cover id). Film posters: the Wikipedia page image.
// Logos: the organization's own site (apple-touch-icon, then og:image, then favicon).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { imageSize } from 'image-size';
import { SHELVES } from '../src/content/library.ts';
import { ORGS } from '../src/content/orgs.ts';
import { PLACES } from '../src/content/places.ts';

const FORCE = process.argv.includes('--force');
const UA = 'free-north-korea media fetcher (+https://github.com/Ahmet-Dedeler/free-north-korea)';
const OUT = 'src/content/media.json';
const MIN_PX = 96;
type Media = { src: string; credit: string; sourceUrl: string };
const media: Record<string, Media> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function download(url: string, dest: string, minPx = MIN_PX) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const type = res.headers.get('content-type') ?? '';
  if (!type.startsWith('image/')) throw new Error(`not an image (${type}) ${url}`);
  const ext = type.includes('png') ? 'png' : type.includes('svg') ? 'svg' : type.includes('webp') ? 'webp' : type.includes('icon') ? 'ico' : 'jpg';
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 600) throw new Error(`too small (${buf.length}B) ${url}`);
  if (ext !== 'svg') {
    // reject favicons and placeholder covers: anything this small looks bad on a card
    const { width = 0, height = 0 } = imageSize(buf);
    if (Math.min(width, height) < minPx) throw new Error(`too small (${width}x${height}) ${url}`);
  }
  const file = `${dest}.${ext}`;
  mkdirSync('public' + file.slice(0, file.lastIndexOf('/')), { recursive: true });
  writeFileSync('public' + file, buf);
  return file;
}

async function json(url: string) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function bookCover(title: string, by: string) {
  const author = by.split(/[&,]/)[0].trim();
  const q = new URLSearchParams({ title, author, limit: '5', fields: 'key,title,cover_i' });
  const r = await json(`https://openlibrary.org/search.json?${q}`);
  const doc = r.docs?.find((d: { cover_i?: number }) => d.cover_i);
  if (!doc) throw new Error('no cover on Open Library');
  return { url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`, sourceUrl: `https://openlibrary.org${doc.key}`, credit: 'Cover via Open Library' };
}

async function wikiImage(pageUrl: string) {
  // Film posters are non-free, so the page-image API hides them. Read the infobox image from the wikitext instead.
  const title = decodeURIComponent(pageUrl.split('/wiki/')[1]);
  const r = await json(`https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=wikitext&section=0&page=${encodeURIComponent(title)}`);
  const file = (r.parse.wikitext['*'] as string).match(/\|\s*(?:image|logo|cover)\s*=\s*(?:\[\[(?:File|Image):)?([^|\]\n]+\.(?:jpe?g|png|webp|svg))/i)?.[1]?.trim();
  if (!file) throw new Error('no infobox image');
  const info = await json(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=400&titles=File:${encodeURIComponent(file)}`);
  const page = Object.values(info.query.pages)[0] as { imageinfo?: { thumburl?: string; url: string }[] };
  const img = page.imageinfo?.[0];
  if (!img) throw new Error('image not found');
  return { url: img.thumburl ?? img.url, sourceUrl: pageUrl, credit: 'Poster via Wikipedia (non-free, used for identification)' };
}

/** First-edition cover from the book's Wikipedia infobox (consistent English editions). */
async function wikiBookCover(title: string, by: string) {
  const author = by.split(/[&,]/)[0].trim().split(' ').pop();
  const r = await json(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srlimit=3&srsearch=${encodeURIComponent(`"${title}" ${author} book`)}`);
  for (const hit of r.query.search as { title: string }[]) {
    if (!hit.title.toLowerCase().includes(title.toLowerCase().split(':')[0].slice(0, 12))) continue;
    try {
      return await wikiImage(`https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}`);
    } catch {
      /* no infobox image on this hit */
    }
  }
  throw new Error('no Wikipedia cover');
}

/** Last resort: free-text Open Library search (handles pseudonyms and subtitles the field search misses). */
async function bookCoverLoose(title: string, by: string) {
  const author = by.split(/[&,(]/)[0].trim().split(' ').pop();
  const r = await json(`https://openlibrary.org/search.json?limit=5&fields=key,title,cover_i&q=${encodeURIComponent(`${title.split(':')[0]} ${author}`)}`);
  const want = title.toLowerCase().split(':')[0].slice(0, 12);
  const doc = r.docs?.find((d: { cover_i?: number; title: string }) => d.cover_i && d.title.toLowerCase().includes(want));
  if (!doc) throw new Error('no cover on Open Library');
  return { url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`, sourceUrl: `https://openlibrary.org${doc.key}`, credit: 'Cover via Open Library' };
}

/** Candidate logo URLs for a site. `iconsOnly` skips og:image, which is usually a photo, not a mark. */
async function siteLogo(site: string, iconsOnly = false) {
  const res = await fetch(site, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
  const html = await res.text();
  const base = res.url;
  const pick = (re: RegExp) => html.match(re)?.[1];
  const candidates = [
    pick(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]*href=["']([^"']+)/i) ?? pick(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["'][^"']*apple-touch-icon/i),
    iconsOnly ? undefined : (pick(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)/i) ?? pick(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i)),
    pick(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)/i) ?? pick(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i),
    '/favicon.ico',
  ].filter(Boolean) as string[];
  return candidates.map((c) => new URL(c.replace(/&amp;/g, '&'), base).href);
}

const jobs: { key: string; dest: string; minPx?: number; run: () => Promise<{ url: string; sourceUrl: string; credit: string }[]> }[] = [];

for (const shelf of SHELVES) {
  for (const it of shelf.items) {
    const key = `library:${slug(it.title)}`;
    if (shelf.id === 'memoir' || shelf.id === 'nonfiction')
      jobs.push({
        key,
        dest: `/img/library/${slug(it.title)}`,
        run: async () => {
          const out = [];
          for (const f of [wikiBookCover, bookCover, bookCoverLoose]) {
            try {
              out.push(await f(it.title, it.by));
            } catch {
              /* next source */
            }
          }
          return out;
        },
      });
    else if (shelf.id === 'film' && it.url.includes('wikipedia.org/wiki/')) jobs.push({ key, dest: `/img/library/${slug(it.title)}`, run: async () => [await wikiImage(it.url)] });
  }
}
// Publisher icons for reports, regime sources and datasets: one per host, shown next to the title.
// Also every host cited by camp/site dossiers and the /sources registry.
const registry = JSON.parse(readFileSync('data/sources/registry.json', 'utf8')) as { url: string }[];
const camps = JSON.parse(readFileSync('public/layers/camps.geojson', 'utf8')).features.flatMap((f: { properties: { sources?: string } }) => JSON.parse(f.properties.sources || '[]')) as { url: string }[];
const hostOf = (u: string) => {
  try {
    return new URL(u).hostname;
  } catch {
    return null;
  }
};
const hosts = new Set(
  [
    ...SHELVES.filter((s) => !['memoir', 'nonfiction', 'film'].includes(s.id)).flatMap((s) => s.items.map((i) => i.url)),
    ...PLACES.flatMap((p) => (p.source ? [p.source.url] : [])),
    ...camps.map((c) => c.url),
    ...registry.map((r) => r.url),
  ]
    .map(hostOf)
    .filter((h): h is string => !!h),
);
for (const host of hosts)
  jobs.push({ key: `host:${host}`, dest: `/img/hosts/${slug(host)}`, minPx: 32, run: async () => (await siteLogo(`https://${host}`, true)).map((url) => ({ url, sourceUrl: `https://${host}`, credit: `Icon from ${host}` })) });

// Photos for strategic sites: the Wikipedia article's lead image, free licenses only (pageimages defaults to free).
async function wikiLeadPhoto(pageUrl: string) {
  const title = decodeURIComponent(pageUrl.split('/wiki/')[1]);
  const r = await json(`https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&piprop=thumbnail|name&pithumbsize=960&pilicense=free&titles=${encodeURIComponent(title)}`);
  const page = Object.values(r.query.pages)[0] as { thumbnail?: { source: string }; pageimage?: string };
  if (!page.thumbnail) throw new Error('no free lead image');
  // Lead images are sometimes locator maps (DPRK2006_* series) or photos of a different place; the satellite view covers those.
  if (/map|DPRK2006_|locat|Dandong/i.test(page.pageimage ?? '')) throw new Error(`lead image is not a photo of the site (${page.pageimage})`);
  return { url: page.thumbnail.source, sourceUrl: `https://commons.wikimedia.org/wiki/File:${page.pageimage}`, credit: 'Photo via Wikimedia Commons' };
}
for (const p of PLACES)
  if (p.category !== 'camp' && p.source?.url.includes('wikipedia.org/wiki/'))
    jobs.push({ key: `place:${p.id}`, dest: `/img/places/${p.id}`, minPx: 200, run: async () => [await wikiLeadPhoto(p.source!.url)] });

// Article heroes: a free Wikipedia lead photo that fits each explainer (camps uses a satellite view instead).
const ARTICLE_PHOTOS: Record<string, string> = {
  'how-can-north-korea-be-freed': 'Fall_of_the_Berlin_Wall',
  'is-it-possible-to-free-north-korea': 'Pyongyang',
  'how-to-help-north-koreans': 'Korean_Demilitarized_Zone',
  'how-north-koreans-escape': 'Tumen_River',
  'information-into-north-korea': 'Notel',
};
for (const [slugId, page] of Object.entries(ARTICLE_PHOTOS))
  jobs.push({ key: `article:${slugId}`, dest: `/img/articles/${slugId}`, minPx: 300, run: async () => [await wikiLeadPhoto(`https://en.wikipedia.org/wiki/${page}`)] });

// The Korean peninsula at night (NASA Black Marble 2016 composite, public domain), cut from NASA GIBS WMS.
const GIBS_NIGHT =
  'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=VIIRS_Black_Marble&CRS=EPSG:4326&BBOX=33.0,124.0,43.2,131.0&WIDTH=840&HEIGHT=1224&FORMAT=image/jpeg';
jobs.push({
  key: 'page:korea-at-night',
  dest: '/img/pages/korea-at-night',
  minPx: 300,
  run: async () => [{ url: GIBS_NIGHT, sourceUrl: 'https://earthobservatory.nasa.gov/features/NightLights', credit: 'NASA Earth Observatory, Black Marble 2016 (public domain)' }],
});

/** Hand-picked images where automatic lookup picks the wrong thing (e.g. a foreign edition). */
const OVERRIDES: Record<string, { url: string; sourceUrl: string; credit: string }> = {
  'library:escape-from-camp-14': {
    url: 'https://covers.openlibrary.org/b/isbn/9780670023325-L.jpg',
    sourceUrl: 'https://openlibrary.org/isbn/9780670023325',
    credit: 'Cover via Open Library (Viking, 2012)',
  },
  // the automatic picks were French editions or a blank library binding
  'library:a-thousand-miles-to-freedom': { url: 'https://covers.openlibrary.org/b/id/9345569-M.jpg', sourceUrl: 'https://openlibrary.org/search?q=A+Thousand+Miles+to+Freedom', credit: 'Cover via Open Library (St. Martin’s, 2015)' },
  'library:this-is-paradise-my-north-korean-childhood': { url: 'https://covers.openlibrary.org/b/id/2406011-M.jpg', sourceUrl: 'https://openlibrary.org/isbn/9780349118659', credit: 'Cover via Open Library (Abacus)' },
  'library:long-road-home-testimony-of-a-north-korean-camp-survivor': { url: 'https://covers.openlibrary.org/b/id/8880404-M.jpg', sourceUrl: 'https://openlibrary.org/isbn/9780231147477', credit: 'Cover via Open Library (Columbia UP, 2009)' },
};

/** Wikipedia articles whose infobox logo beats the org's own site icon. */
const ORG_WIKI: Record<string, string> = {
  hrw: 'Human_Rights_Watch',
  'ohchr-seoul': 'Office_of_the_United_Nations_High_Commissioner_for_Human_Rights',
  '38-north': '38_North',
  'nk-news': 'NK_News',
  'daily-nk': 'Daily_NK',
  'liberty-in-north-korea': 'Liberty_in_North_Korea',
  hrnk: 'Committee_for_Human_Rights_in_North_Korea',
  nkdb: 'Database_Center_for_North_Korean_Human_Rights',
};
for (const o of ORGS) {
  if (o.id === 'leaflet-groups') continue;
  const site = new URL(o.url).origin;
  jobs.push({
    key: `org:${o.id}`,
    dest: `/img/orgs/${o.id}`,
    run: async () => {
      const out = [];
      if (ORG_WIKI[o.id]) {
        try {
          const w = await wikiImage(`https://en.wikipedia.org/wiki/${ORG_WIKI[o.id]}`);
          out.push({ ...w, credit: 'Logo via Wikipedia' });
        } catch {
          /* fall back to the site */
        }
      }
      try {
        out.push(...(await siteLogo(site)).map((url) => ({ url, sourceUrl: site, credit: `Logo from ${new URL(site).hostname}` })));
      } catch {
        /* site unreachable */
      }
      return out;
    },
  });
}

for (const job of jobs) {
  if (media[job.key] && !FORCE && existsSync('public' + media[job.key].src)) continue;
  try {
    const options = OVERRIDES[job.key] ? [OVERRIDES[job.key]] : await job.run();
    let saved: string | null = null;
    for (const o of options) {
      try {
        saved = await download(o.url, job.dest, job.minPx);
        media[job.key] = { src: saved, credit: o.credit, sourceUrl: o.sourceUrl };
        break;
      } catch {
        /* try the next candidate */
      }
    }
    console.log(saved ? `ok   ${job.key} → ${saved}` : `miss ${job.key}: no usable image`);
  } catch (e) {
    console.log(`miss ${job.key}: ${(e as Error).message}`);
  }
}
writeFileSync(OUT, JSON.stringify(media, null, 2) + '\n');
