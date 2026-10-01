import { chromium } from 'playwright-core';
import fs from 'fs';

async function testDataJson() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.visualatlas.org/en', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Test various SvelteKit data routes and API routes from within browser
  const results = await page.evaluate(async () => {
    const urls = [
      '/en/density/__data.json',
      '/en/theme/__data.json',
      '/en/forced-repatriation/__data.json',
      '/en/incidents/__data.json',
      '/en/statistics/__data.json',
      '/en/api/posts/pool'
    ];
    const out = {};
    for (const u of urls) {
      try {
        const res = await fetch(u);
        out[u] = {
          status: res.status,
          contentType: res.headers.get('content-type'),
          textSample: (await res.text()).slice(0, 1000)
        };
      } catch (e) {
        out[u] = { error: e.message };
      }
    }
    return out;
  });

  fs.writeFileSync('docs/research/probes/camps/visualatlas_data_endpoints.json', JSON.stringify(results, null, 2));
  console.log('Results written to visualatlas_data_endpoints.json');
  await browser.close();
}

testDataJson().catch(console.error);
