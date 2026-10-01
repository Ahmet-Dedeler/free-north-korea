import { chromium } from 'playwright-core';
import fs from 'fs';

async function extractMarkers() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Loading /en/density ...');
  await page.goto('https://www.visualatlas.org/en/density', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);

  const markerData = await page.evaluate(() => {
    // Look at the markers
    const markers = Array.from(document.querySelectorAll('.maplibregl-marker, .mapboxgl-marker, [class*="marker"]'));
    return markers.map(m => {
      // get transform style or style.left / top
      const style = m.getAttribute('style') || '';
      const text = m.innerText.trim();
      const title = m.getAttribute('title') || '';
      const innerHTML = m.innerHTML;
      const classList = Array.from(m.classList);
      return {
        style,
        text,
        title,
        classList,
        innerHTML: innerHTML.slice(0, 150)
      };
    });
  });

  console.log(`Found ${markerData.length} markers.`);
  fs.writeFileSync('docs/research/probes/camps/visualatlas_density_markers.json', JSON.stringify(markerData.slice(0, 50), null, 2));

  // Now inspect the SvelteKit internal state / store to find the actual array of 419 data points with their lat/lng!
  const dataFromJs = await page.evaluate(() => {
    // Check if any element has __svelte or similar, or check script tags for JSON data
    // Let's search all scripts or DOM attributes
    const scriptTexts = Array.from(document.querySelectorAll('script')).map(s => s.text);
    // Find any JSON array of objects with lat/lng or x/y or coordinates
    return {
      scriptSnippets: scriptTexts.map(s => s.slice(0, 200))
    };
  });

  console.log('Sample markers:', JSON.stringify(markerData.slice(0, 5), null, 2));
  await browser.close();
}

extractMarkers().catch(console.error);
