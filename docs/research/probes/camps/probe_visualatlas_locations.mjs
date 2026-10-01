import { chromium } from 'playwright-core';
import fs from 'fs';

async function extractAllLocations() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Loading /en/density ...');
  await page.goto('https://www.visualatlas.org/en/density', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);

  // Extract from DOM markers and find MapLibre instance if possible
  const results = await page.evaluate(() => {
    const rawLocations = [];
    const markers = document.querySelectorAll('.maplibregl-marker');
    markers.forEach(m => {
      const a = m.querySelector('a');
      if (a) {
        const href = a.getAttribute('href') || '';
        const text = m.innerText.trim();
        const parts = text.split('\n');
        const name = parts[0] || '';
        const count = parts[1] || '';
        rawLocations.push({
          href,
          slug: href.replace('/en/incidents?location=', ''),
          name,
          count: parseInt(count, 10) || 0,
          transform: m.getAttribute('style')
        });
      }
    });

    // Also look inside the page scripts / JS bundle for the full location dataset
    return {
      locationsCount: rawLocations.length,
      sampleLocations: rawLocations.slice(0, 20),
      allLocations: rawLocations
    };
  });

  console.log(`Extracted ${results.locationsCount} location markers.`);
  fs.writeFileSync('docs/research/probes/camps/visualatlas_locations.json', JSON.stringify(results, null, 2));

  // Now let's find the JS file that defines the locations and coordinates!
  // In SvelteKit, the page data is loaded in `_app/immutable/nodes/40.Y1ZJ89zs.js` or similar, or a data route!
  await browser.close();
}

extractAllLocations().catch(console.error);
