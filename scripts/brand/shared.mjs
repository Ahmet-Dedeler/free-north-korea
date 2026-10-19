/**
 * Shared pieces for the social banners (scripts/build-x-banner.mjs, scripts/build-youtube-banner.mjs).
 *
 * Everything here reads the site's own sources, so a banner can never claim a number or a domain the
 * site does not: the launch count comes from the missile dataset, the watched sites and image count
 * from the Sentinel-2 manifest, the domain from src/site/config.ts. The logo is the white star on a
 * blue disc from src/site/brand.ts.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const BRAND_DIR = path.join(ROOT, 'docs/brand');

export const read = (p) => readFileSync(path.join(ROOT, p), 'utf8');
export const readJson = (p) => JSON.parse(read(p));

/** The logo: a white star on a blue disc. Blue for freedom (src/site/brand.ts). */
export const BRAND_BLUE = '#1d4ed8';
export const STAR = 'M12 6.2l1.6 3.9 4.2.3-3.2 2.7 1 4.1L12 15l-3.6 2.2 1-4.1-3.2-2.7 4.2-.3z';

/** The site's own numbers, so a banner is never stale. */
export function siteFacts() {
  const tests = readJson('public/data/test.en.json');
  const launches = tests.timeBins.reduce((n, b) => n + b.data.length, 0);

  const sentinel = readJson('data/sentinel.json');
  const watchedSites = sentinel.sites.length;
  const images = sentinel.sites.reduce((n, s) => n + (s.images?.length ?? 0), 0);

  const siteUrl = read('src/site/config.ts').match(/SITE_URL\s*=\s*'([^']+)'/)[1];
  const host = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return { launches, watchedSites, images, host, sentinel };
}

/** The newest Sentinel-2 chip for a site, as { id, name, date, file }. */
export function latestChip(sentinel, id) {
  const site = sentinel.sites.find((s) => s.id === id);
  if (!site) throw new Error(`no Sentinel site with id ${id}`);
  const image = [...site.images].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  return { id: site.id, name: site.name, category: site.category, date: image.date, file: `public/img/sentinel/${site.id}/${image.date}.jpg` };
}

/** North Korea outline, lifted from the old profile picture. */
export function northKoreaPath() {
  const pfp = read('docs/brand/liberatenorthkorea-pfp.svg');
  return pfp.match(/<path d="([^"]+)"/)[1];
}

/** The outline's own bounding box, so it can be placed exactly. */
export const NK_BBOX = { x: 172.18, y: 145.25, w: 656.78, h: 704.89 };

/** Anton, self-hosted by next/font at build time. */
export function antonFontFile() {
  if (!read('src/app/layout.tsx').includes('next/font/google')) throw new Error('Anton import not found in src/app/layout.tsx');
  const dir = path.join(ROOT, '.next/static/chunks');
  if (!existsSync(dir)) throw new Error('no build found: run `npm run build` before building a banner');
  let css = '';
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.css')) continue;
    const c = readFileSync(path.join(dir, f), 'utf8');
    if (c.includes('font-family:Anton')) {
      css = c;
      break;
    }
  }
  if (!css) throw new Error('no built CSS with Anton found in .next/static/chunks: run `npm run build` first');
  return path.join(ROOT, '.next/static/media', pickLatinFont(css));
}

/** The latin subset, not the latin-ext one: the banners are all ASCII. */
function pickLatinFont(css) {
  const blocks = css.split('@font-face').filter((b) => b.includes('font-family:Anton'));
  for (const b of blocks) {
    if (/unicode-range:[^;]*(U\+0000-00FF|U\+\?\?)/.test(b)) {
      const m = b.match(/url\(\.\.\/media\/([^)]+\.woff2)\)/);
      if (m) return m[1];
    }
  }
  const any = css.match(/font-family:Anton[^}]*?url\(\.\.\/media\/([^)]+\.woff2)\)/);
  if (!any) throw new Error('Anton woff2 not found in the built CSS');
  return any[1];
}

/** lucide icons, drawn inline. */
export const ICON_ROCKET = [
  ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }],
  ['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09' }],
  ['path', { d: 'M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z' }],
  ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05' }],
];
export const ICON_SAT = [
  ['path', { d: 'm13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5' }],
  ['path', { d: 'M16.5 7.5 19 5' }],
  ['path', { d: 'm17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5' }],
  ['path', { d: 'M9 21a6 6 0 0 0-6-6' }],
  ['path', { d: 'M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z' }],
];

export const icon = (nodes, size, color) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${nodes
    .map(([tag, a]) => `<${tag} d="${a.d}"/>`)
    .join('')}</svg>`;

/** Deterministic star field, so a rebuild gives the same file. */
export function starField(width, height, count, seed = 20261019) {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const x = (rnd() * width).toFixed(1);
    const y = (rnd() * height).toFixed(1);
    const r = (rnd() * 1.3 + 0.3).toFixed(2);
    const o = (rnd() * 0.5 + 0.12).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#9fc0ff" opacity="${o}"/>`;
  }).join('');
}

/** Quantise a PNG in place: a night gradient costs a lot in 24-bit PNG. */
export function compress(file) {
  try {
    execFileSync('pngquant', ['--quality=85-100', '--speed', '1', '--force', '--output', file, file], { stdio: 'ignore' });
  } catch {
    console.log('pngquant not found, keeping the full-size PNG');
  }
}

function existsSync(p) {
  try {
    readdirSync(p);
    return true;
  } catch {
    return false;
  }
}
