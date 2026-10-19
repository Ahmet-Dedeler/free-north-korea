/**
 * Builds the YouTube channel banner.
 *
 * YouTube crops one 2560x1440 file differently per device: TV shows all of it, desktop a 2560x423
 * strip, mobile only the centred 1546x423 safe area. So every word that matters sits inside that
 * safe area, and the rest of the canvas is atmosphere. The channel avatar and the social link icons
 * sit over the corners, so those stay empty too.
 *
 * The numbers come from our own data files (see scripts/brand/shared.mjs), the domain from
 * src/site/config.ts and the logo from src/site/brand.ts, so the banner cannot drift from the site.
 *
 *   npm run brand:youtube
 *
 * Writes docs/brand/youtube-banner-2560x1440.png and a set of crop previews under docs/brand/crops/.
 */
import { chromium } from 'playwright-core';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  BRAND_BLUE,
  BRAND_DIR,
  NK_BBOX,
  ROOT,
  STAR,
  ICON_ROCKET,
  ICON_SAT,
  antonFontFile,
  compress,
  icon,
  latestChip,
  northKoreaPath,
  siteFacts,
  starField,
} from './brand/shared.mjs';

const W = 2560;
const H = 1440;
/** The area every device shows: centred 1546x423. */
const SAFE = { x: (W - 1546) / 2, y: (H - 423) / 2, w: 1546, h: 423 };

const { launches, watchedSites, images, host, sentinel } = siteFacts();
const mapPath = northKoreaPath();
const fontFile = antonFontFile();

/** A real Sentinel-2 chip of our own, used as the texture behind the banner. */
const chip = latestChip(sentinel, 'yongbyon');
const chipUrl = 'file://' + path.join(ROOT, chip.file);

/** The outline's own box, so the shape is placed exactly and can bleed off the canvas. */
const NK = NK_BBOX;
const nkWidth = 1180;
const nkHeight = (nkWidth * NK.h) / NK.w;
const nkViewBox = `${NK.x - 14} ${NK.y - 14} ${NK.w + 28} ${NK.h + 28}`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Anton'; src: url('file://${fontFile}') format('woff2'); font-weight: 400; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  body { font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif; background: #05070f; position: relative; }

  /* Our own Sentinel-2 chip, blurred into texture: it reads as ground seen from orbit, not a photo. */
  .orbit {
    position: absolute; inset: -6%;
    background: url('${chipUrl}') center / cover no-repeat;
    filter: grayscale(1) blur(5px) contrast(1.9) brightness(1.15);
    opacity: .85;
  }
  .wash {
    position: absolute; inset: 0;
    background:
      radial-gradient(1500px 900px at 74% 44%, rgba(29,78,216,.5), rgba(29,78,216,0) 68%),
      radial-gradient(1200px 800px at 12% 96%, rgba(37,99,235,.26), rgba(37,99,235,0) 70%),
      linear-gradient(180deg, rgba(5,7,15,.9) 0%, rgba(6,12,32,.72) 46%, rgba(5,7,15,.92) 100%);
  }
  .stars { position: absolute; inset: 0; opacity: .45; }

  /* The country, large and quiet, bleeding off the right edge. */
  .outline { position: absolute; right: -190px; top: 50%; transform: translateY(-50%); opacity: .17; }

  /* Everything below sits inside the 1546x423 safe area, with room to spare at both ends. */
  .band { position: absolute; left: ${SAFE.x}px; top: ${SAFE.y}px; width: ${SAFE.w}px; height: ${SAFE.h}px; padding: 0 34px; }

  /* The channel avatar lands on the banner's bottom-left in the YouTube app, so the disc sits high. */
  .disc { position: absolute; left: 34px; top: 50%; transform: translateY(-58%); width: 250px; height: 250px;
    border-radius: 50%; background: ${BRAND_BLUE}; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 11px rgba(29,78,216,.15), 0 30px 90px rgba(0,0,0,.6); }
  .disc svg { width: 204px; height: 204px; }

  .copy { position: absolute; left: 344px; top: 0; bottom: 0; right: 34px;
    display: flex; flex-direction: column; justify-content: center; }
  .url { display: flex; align-items: center; gap: 13px; font-family: 'Anton', sans-serif; font-size: 31px;
    letter-spacing: .12em; color: #7aa2ff; }
  .url .dot { width: 10px; height: 10px; border-radius: 50%; background: ${BRAND_BLUE}; box-shadow: 0 0 16px #4d8bff; }
  h1 { margin-top: 12px; font-family: 'Anton', sans-serif; font-weight: 400; font-size: 104px; line-height: .94;
    letter-spacing: .004em; display: flex; gap: 18px; white-space: nowrap; }
  h1 .free { color: #ffffff; }
  h1 .rest { background: linear-gradient(96deg, #b6d0ff 0%, ${BRAND_BLUE} 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .tag { margin-top: 15px; font-size: 34px; color: #c8d3e6; font-weight: 500; }
  .data { margin-top: 20px; display: flex; gap: 24px; align-items: center; }
  .stat { display: flex; align-items: center; gap: 10px; white-space: nowrap; }
  .stat b { font-size: 30px; font-weight: 700; color: #ffffff; font-variant-numeric: tabular-nums; }
  .stat span { font-size: 24px; color: #9aa9c2; }
  .sep { width: 1px; height: 32px; background: #22304e; }
</style></head>
<body>
  <div class="orbit"></div>
  <div class="wash"></div>
  <svg class="stars" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${starField(W, H, 150)}</svg>
  <svg class="outline" width="${nkWidth}" height="${nkHeight}" viewBox="${nkViewBox}" xmlns="http://www.w3.org/2000/svg">
    <path d="${mapPath}" fill="none" stroke="#6f9dff" stroke-width="3" stroke-linejoin="round"/>
  </svg>

  <div class="band">
    <div class="disc">
      <svg viewBox="0 0 24 24"><path d="${STAR}" fill="#ffffff"/></svg>
    </div>
    <div class="copy">
      <div class="url"><span class="dot"></span>${host.toUpperCase()}</div>
      <h1><span class="free">FREE</span><span class="rest">NORTH KOREA</span></h1>
      <div class="tag">Maps, data and ways to help. In 4 languages.</div>
      <div class="data">
        <div class="stat">${icon(ICON_ROCKET, 40, '#7aa2ff')}<b>${launches}</b><span>launches since 1984</span></div>
        <div class="sep"></div>
        <div class="stat">${icon(ICON_SAT, 40, '#7aa2ff')}<b>${watchedSites}</b><span>sites watched from space</span></div>
        <div class="sep"></div>
        <div class="stat"><b>${images}</b><span>Sentinel-2 images</span></div>
      </div>
    </div>
  </div>
</body></html>`;

const tmpHtml = path.join(tmpdir(), 'youtube-banner.html');
writeFileSync(tmpHtml, html);

const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto('file://' + tmpHtml);
await page.waitForTimeout(2000);
const file = path.join(BRAND_DIR, 'youtube-banner-2560x1440.png');
await page.screenshot({ path: file });
await page.close();
compress(file);
console.log('wrote docs/brand/youtube-banner-2560x1440.png');

/**
 * Crop previews, so the banner can be checked against what each device actually shows.
 *
 * YouTube crops server-side with fcrop64=1,00005a57ffffa5a8, which is y 508 to y 932 of the source:
 * the full 2560 wide band, never a horizontal crop. A phone browser gets that whole band scaled
 * down to 374px, which is why the copy has to be big. The app is tighter, so the 1546x423 safe area
 * is the conservative zone everything important sits in.
 */
const cropDir = path.join(BRAND_DIR, 'crops');
mkdirSync(cropDir, { recursive: true });
const crops = [
  { name: 'tv-2560x1440.png', x: 0, y: 0, w: W, h: H },
  { name: 'desktop-2560x423.png', x: 0, y: SAFE.y, w: W, h: 423 },
  { name: 'app-safe-1546x423.png', x: SAFE.x, y: SAFE.y, w: 1546, h: 423 },
  { name: 'phone-374x62.png', x: 0, y: SAFE.y, w: W, h: 423, scale: 374 / W },
];
for (const c of crops) {
  const p = await browser.newPage({ viewport: { width: Math.round(c.w * (c.scale ?? 1)), height: Math.round(c.h * (c.scale ?? 1)) } });
  // A file:// page, so the banner image loads: setContent has an opaque origin and cannot read it.
  const cropHtml = path.join(tmpdir(), `yt-crop-${c.name}.html`);
  writeFileSync(
    cropHtml,
    `<body style="margin:0;overflow:hidden"><img src="file://${file}" style="position:absolute;left:${-c.x * (c.scale ?? 1)}px;top:${-c.y * (c.scale ?? 1)}px;width:${W * (c.scale ?? 1)}px"></body>`,
  );
  await p.goto('file://' + cropHtml);
  await p.waitForTimeout(700);
  const cropFile = path.join(cropDir, c.name);
  await p.screenshot({ path: cropFile });
  await p.close();
  compress(cropFile);
  console.log('wrote', path.join('docs/brand/crops', c.name));
}

await browser.close();

/** The channel avatar: the same star, 800px square, which is what YouTube asks for. */
const pfp = path.join(BRAND_DIR, 'youtube-pfp-800.png');
try {
  execFileSync('rsvg-convert', ['-w', '800', '-h', '800', path.join(ROOT, 'public/favicon.svg'), '-o', pfp], { stdio: 'ignore' });
  console.log('wrote docs/brand/youtube-pfp-800.png');
} catch {
  console.log('rsvg-convert not found, skipping the profile picture');
}

console.log(`launches=${launches} watchedSites=${watchedSites} images=${images} host=${host} chip=${chip.id}@${chip.date}`);
