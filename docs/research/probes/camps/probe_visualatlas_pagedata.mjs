import { chromium } from 'playwright-core';
import fs from 'fs';

async function extractPageData() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {};

  const pages = [
    { name: 'density', url: 'https://www.visualatlas.org/en/density' },
    { name: 'theme', url: 'https://www.visualatlas.org/en/theme' },
    { name: 'repatriation', url: 'https://www.visualatlas.org/en/forced-repatriation' }
  ];

  for (const p of pages) {
    console.log(`Loading ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    const pageData = await page.evaluate(() => {
      // Look for sveltekit data scripts
      const scripts = Array.from(document.querySelectorAll('script')).map(s => ({
        type: s.type,
        src: s.src,
        text: s.innerHTML ? s.innerHTML.slice(0, 300) : ''
      }));

      // Check if there are GeoJSON or feature collections in the DOM or window
      let geoDataFound = null;
      // Search window properties
      for (const k of Object.keys(window)) {
        try {
          const val = window[k];
          if (val && typeof val === 'object' && (val.type === 'FeatureCollection' || val.features || val.coordinates)) {
            geoDataFound = { windowKey: k, sample: JSON.stringify(val).slice(0, 500) };
          }
        } catch(e) {}
      }

      // Find any geo markers or map points on the page
      const markers = document.querySelectorAll('.maplibregl-marker, .mapboxgl-marker, .marker');
      
      // Look for administrative boundaries or data tables
      const tables = Array.from(document.querySelectorAll('table')).map(t => t.innerText.slice(0, 200));

      return {
        scriptsCount: scripts.length,
        scriptsSample: scripts.slice(0, 10),
        geoDataFound,
        markerCount: markers.length,
        tables
      };
    });

    results[p.name] = pageData;
  }

  fs.writeFileSync('docs/research/probes/camps/visualatlas_pagedata.json', JSON.stringify(results, null, 2));
  console.log('Saved visualatlas_pagedata.json');
  await browser.close();
}

extractPageData().catch(console.error);
