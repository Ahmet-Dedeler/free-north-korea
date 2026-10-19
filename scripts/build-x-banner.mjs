/**
 * Builds the X (Twitter) banner in the current brand: a white star on a blue disc, the site's own navy
 * night background, and the real domain from src/site/config.ts. The numbers in the data line are read
 * from our own data files (public/data/test.en.json, data/sentinel.json) so the banner never drifts from
 * the site. The North Korea outline is taken from docs/brand/liberatenorthkorea-pfp.svg.
 *
 *   node scripts/build-x-banner.mjs
 *
 * Writes docs/brand/x-banner-1500x500.png and docs/brand/x-banner-3000x1000.png.
 */
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs/brand');
mkdirSync(out, { recursive: true });

const read = (p) => readFileSync(path.join(root, p), 'utf8');
const readJson = (p) => JSON.parse(read(p));

/** The site's own numbers, so the banner is never stale. */
const tests = readJson('public/data/test.en.json');
const launches = tests.timeBins.reduce((n, b) => n + b.data.length, 0);

const sentinel = readJson('data/sentinel.json');
const watchedSites = sentinel.sites.length;
const images = sentinel.sites.reduce((n, s) => n + (s.images?.length ?? 0), 0);

const siteUrl = read('src/site/config.ts').match(/SITE_URL\s*=\s*'([^']+)'/)[1];
const host = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** North Korea outline, lifted from the old profile picture. */
const pfp = read('docs/brand/liberatenorthkorea-pfp.svg');
const mapPath = pfp.match(/<path d="([^"]+)"/)[1];

/** Anton, self-hosted by next/font at build time. */
const anton = read('src/app/layout.tsx').match(/next\/font\/google/);
if (!anton) throw new Error('Anton import not found in src/app/layout.tsx');
const fontFile = readdirFonts();

function readdirFonts() {
  const media = path.join(root, '.next/static/media');
  const css = findCss();
  const m = css.match(/font-family:Anton[^}]*?url\(\.\.\/media\/([^)]+\.woff2)\)/);
  if (!m) throw new Error('Anton woff2 not found in .next/static/media (run a build first)');
  return path.join(media, pickLatinFont(css));
}

function findCss() {
  const dir = path.join(root, '.next/static/chunks');
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.css')) continue;
    const css = readFileSync(path.join(dir, f), 'utf8');
    if (css.includes('font-family:Anton')) return css;
  }
  throw new Error('no built CSS with Anton found in .next/static/chunks');
}

/** The latin subset, not the latin-ext one: the banner is all ASCII. */
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

const BRAND_BLUE = '#1d4ed8';
const STAR = 'M12 6.2l1.6 3.9 4.2.3-3.2 2.7 1 4.1L12 15l-3.6 2.2 1-4.1-3.2-2.7 4.2-.3z';

const ICON_ROCKET = [
  ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }],
  ['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09' }],
  ['path', { d: 'M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z' }],
  ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05' }],
];
const ICON_SAT = [
  ['path', { d: 'm13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5' }],
  ['path', { d: 'M16.5 7.5 19 5' }],
  ['path', { d: 'm17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5' }],
  ['path', { d: 'M9 21a6 6 0 0 0-6-6' }],
  ['path', { d: 'M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z' }],
];

const icon = (nodes, size, color) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${nodes
    .map(([tag, a]) => `<${tag} d="${a.d}"/>`)
    .join('')}</svg>`;

/** Deterministic star field, so a rebuild gives the same file. */
function stars(seed = 20261019) {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: 90 }, () => {
    const x = (rnd() * 1500).toFixed(1);
    const y = (rnd() * 500).toFixed(1);
    const r = (rnd() * 1.3 + 0.3).toFixed(2);
    const o = (rnd() * 0.5 + 0.12).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#9fc0ff" opacity="${o}"/>`;
  }).join('');
}

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Anton'; src: url('file://${fontFile}') format('woff2'); font-weight: 400; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1500px; height: 500px; overflow: hidden; }
  body {
    font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
    background: #05070f;
    position: relative;
  }
  .glow {
    position: absolute; inset: 0;
    background:
      radial-gradient(900px 520px at 82% 42%, rgba(29,78,216,.55), rgba(29,78,216,0) 70%),
      radial-gradient(700px 480px at 8% 108%, rgba(56,104,240,.20), rgba(56,104,240,0) 70%),
      linear-gradient(115deg, #05070f 0%, #081026 55%, #050912 100%);
  }
  .stars { position: absolute; inset: 0; opacity: .5; }
  .left { position: absolute; left: 84px; top: 0; height: 500px; width: 1000px; }
  /* X overlays the profile picture on the banner's bottom-left, so that corner stays empty. */
  .brand { position: absolute; left: 0; top: 34px; display: flex; align-items: center; gap: 11px; }
  .brand .mark { width: 26px; height: 26px; border-radius: 50%; background: ${BRAND_BLUE};
    display: flex; align-items: center; justify-content: center; box-shadow: 0 0 18px rgba(29,78,216,.6); }
  .brand .mark svg { width: 20px; height: 20px; }
  .brand .name { font-family: 'Anton', sans-serif; font-size: 23px; letter-spacing: .11em; color: #7aa2ff; }
  .eyebrow {
    position: absolute; left: 0; top: 98px; font-size: 17px; font-weight: 700; letter-spacing: .28em;
    color: #7aa2ff; text-transform: uppercase; display: flex; align-items: center; gap: 13px;
  }
  .eyebrow .dot { width: 9px; height: 9px; border-radius: 50%; background: ${BRAND_BLUE}; box-shadow: 0 0 14px #4d8bff; }
  h1 {
    position: absolute; left: 0; top: 130px; font-family: 'Anton', sans-serif; font-weight: 400; font-size: 78px;
    line-height: .96; letter-spacing: .005em; display: flex; gap: 15px; white-space: nowrap;
  }
  h1 .free { color: #ffffff; }
  h1 .rest { background: linear-gradient(96deg, #a8c6ff 0%, ${BRAND_BLUE} 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .tag { position: absolute; left: 0; top: 220px; font-size: 25px; color: #c3cfe2; font-weight: 500; }
  .data { position: absolute; left: 0; top: 262px; display: flex; gap: 20px; align-items: center; }
  .stat { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
  .stat b { font-size: 24px; font-weight: 700; color: #ffffff; font-variant-numeric: tabular-nums; }
  .stat span { font-size: 17px; color: #93a3bd; }
  .sep { width: 1px; height: 26px; background: #1d2b4a; }
  .right { position: absolute; right: 0; top: 0; height: 500px; width: 520px; }
  .map { position: absolute; right: 96px; top: 50%; transform: translateY(-50%); opacity: .42; }
  .disc { position: absolute; right: 30px; top: 44px; width: 196px; height: 196px; border-radius: 50%;
    background: ${BRAND_BLUE}; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 7px rgba(29,78,216,.18), 0 22px 60px rgba(0,0,0,.55); }
  .disc svg { width: 162px; height: 162px; }
  .ring { position: absolute; right: 4px; top: 18px; width: 248px; height: 248px;
    border-radius: 50%; border: 1px solid rgba(122,162,255,.3); }
</style></head>
<body>
  <div class="glow"></div>
  <svg class="stars" width="1500" height="500" xmlns="http://www.w3.org/2000/svg">${stars()}</svg>
  <div class="left">
    <div class="brand">
      <span class="mark"><svg viewBox="0 0 24 24"><path d="${STAR}" fill="#ffffff"/></svg></span>
      <span class="name">${host.toUpperCase()}</span>
    </div>
    <div class="eyebrow"><span class="dot"></span>Open source intelligence on North Korea</div>
    <h1><span class="free">FREE</span><span class="rest">NORTH KOREA</span></h1>
    <div class="tag">Maps, data and ways to help. In 4 languages.</div>
    <div class="data">
      <div class="stat">${icon(ICON_ROCKET, 34, '#7aa2ff')}<b>${launches}</b><span>missile launches since 1984</span></div>
      <div class="sep"></div>
      <div class="stat">${icon(ICON_SAT, 34, '#7aa2ff')}<b>${watchedSites}</b><span>sites watched from space</span></div>
      <div class="sep"></div>
      <div class="stat"><b>${images}</b><span>Sentinel-2 images</span></div>
    </div>
  </div>
  <div class="right">
    <div class="ring"></div>
    <svg class="map" width="300" height="315" viewBox="160 133 682 717" xmlns="http://www.w3.org/2000/svg">
      <path d="${mapPath}" fill="none" stroke="#6f9dff" stroke-width="6" stroke-linejoin="round"/>
    </svg>
    <div class="disc">
      <svg viewBox="0 0 24 24"><path d="${STAR}" fill="#ffffff"/></svg>
    </div>
  </div>
</body></html>`;

const tmpHtml = path.join(tmpdir(), 'x-banner.html');
writeFileSync(tmpHtml, html);

const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader', '--font-render-hinting=none'] });
const shots = [
  { file: 'x-banner-1500x500.png', width: 1500, height: 500, scale: 1 },
  { file: 'x-banner-3000x1000.png', width: 1500, height: 500, scale: 2 },
];
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.scale });
  await page.goto('file://' + tmpHtml);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(out, s.file) });
  await page.close();
  // Quantise in place, so a rebuild gives the same bytes: the night gradient costs a lot in 24-bit PNG.
  try {
    execFileSync('pngquant', ['--quality=85-100', '--speed', '1', '--force', '--output', path.join(out, s.file), path.join(out, s.file)], { stdio: 'ignore' });
  } catch {
    console.log('pngquant not found, keeping the full-size PNG');
  }
  console.log('wrote', path.join('docs/brand', s.file));
}
await browser.close();
console.log(`launches=${launches} watchedSites=${watchedSites} images=${images} host=${host}`);
