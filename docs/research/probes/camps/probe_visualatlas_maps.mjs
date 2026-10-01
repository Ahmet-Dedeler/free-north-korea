import { chromium } from 'playwright-core';
import fs from 'fs';

async function probeMaps() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allUrls = [];
  const mapDataUrls = [];

  page.on('response', async res => {
    const url = res.url();
    const ctype = res.headers()['content-type'] || '';
    allUrls.push({ url, status: res.status(), ctype });
    if (url.includes('geojson') || url.includes('tile') || url.includes('mapbox') || url.includes('carto') ||
        url.includes('vector') || url.includes('data') || url.includes('json') || url.includes('arcgis') ||
        url.includes('atlas') || url.includes('coordinates') || url.includes('repatriation')) {
      mapDataUrls.push({
        url,
        status: res.status(),
        ctype,
        size: (await res.body().catch(() => Buffer.from(''))).length
      });
    }
  });

  console.log('Navigating to /en/theme ...');
  await page.goto('https://www.visualatlas.org/en/theme', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);

  console.log('Navigating to /en/density ...');
  await page.goto('https://www.visualatlas.org/en/density', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);

  console.log('Navigating to /en/forced-repatriation ...');
  await page.goto('https://www.visualatlas.org/en/forced-repatriation', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);

  // Check window object, MapLibre / Mapbox / DeckGL / Leaflet instances
  const mapInfo = await page.evaluate(() => {
    const info = {};
    if (window.maplibregl) info.hasMapLibre = true;
    if (window.mapboxgl) info.hasMapbox = true;
    // Check Leaflet
    if (window.L) info.hasLeaflet = true;
    // Check DeckGL
    if (window.deck) info.hasDeck = true;

    // Check SVG or canvas elements
    info.canvasCount = document.querySelectorAll('canvas').length;
    info.svgCount = document.querySelectorAll('svg').length;
    
    // Check any global data objects
    info.globalKeys = Object.keys(window).filter(k => !k.startsWith('__') && !k.startsWith('webkit'));
    return info;
  });

  fs.writeFileSync('docs/research/probes/camps/visualatlas_maps.json', JSON.stringify({
    mapInfo,
    mapDataUrls,
    sampleAllUrls: allUrls.slice(0, 100)
  }, null, 2));

  console.log(`Recorded ${mapDataUrls.length} map data URLs.`);
  await browser.close();
}

probeMaps().catch(console.error);
