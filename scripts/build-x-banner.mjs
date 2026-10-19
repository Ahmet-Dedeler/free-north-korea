/**
 * Builds the X (Twitter) banner in the current brand: a white star on a blue disc, the site's own navy
 * night background, and the real domain from src/site/config.ts. The numbers in the data line are read
 * from our own data files (public/data/test.en.json, data/sentinel.json) so the banner never drifts from
 * the site. The North Korea outline is taken from docs/brand/liberatenorthkorea-pfp.svg.
 *
 *   npm run brand:banner
 *
 * Writes docs/brand/x-banner-1500x500.png and docs/brand/x-banner-3000x1000.png.
 */
import { chromium } from 'playwright-core';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { writeFileSync } from 'node:fs';
import {
  BRAND_BLUE,
  BRAND_DIR,
  STAR,
  ICON_ROCKET,
  ICON_SAT,
  antonFontFile,
  compress,
  icon,
  northKoreaPath,
  siteFacts,
  starField,
} from './brand/shared.mjs';

const { launches, watchedSites, images, host } = siteFacts();
const mapPath = northKoreaPath();
const fontFile = antonFontFile();

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
  <svg class="stars" width="1500" height="500" xmlns="http://www.w3.org/2000/svg">${starField(1500, 500, 90)}</svg>
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
  const file = path.join(BRAND_DIR, s.file);
  await page.screenshot({ path: file });
  await page.close();
  compress(file);
  console.log('wrote', path.join('docs/brand', s.file));
}
await browser.close();
console.log(`launches=${launches} watchedSites=${watchedSites} images=${images} host=${host}`);
