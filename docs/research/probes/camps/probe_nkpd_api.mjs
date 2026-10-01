import { chromium } from 'playwright-core';
import fs from 'fs';

async function probeNkpdApi() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  console.log('Navigating to https://nkpd.io/en/page/bdkqwxwh7ar/penal-facilities ...');
  await page.goto('https://nkpd.io/en/page/bdkqwxwh7ar/penal-facilities', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const penalFacilitiesPage = await page.evaluate(() => {
    return {
      bodyText: document.body.innerText.slice(0, 2000),
      links: Array.from(document.querySelectorAll('a')).map(a => ({ href: a.href, text: a.innerText.trim() })).filter(l => l.text)
    };
  });

  // Now test Uwazi REST APIs
  const apiResults = await page.evaluate(async () => {
    const endpoints = [
      '/api/templates',
      '/api/settings',
      '/api/thesauris',
      '/api/search?limit=10',
      '/api/search?types=["penal_facility"]&limit=10'
    ];
    const out = {};
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep);
        const data = await res.json();
        out[ep] = {
          status: res.status,
          isArray: Array.isArray(data),
          count: Array.isArray(data) ? data.length : (data.rows ? data.rows.length : (data.totalRows || null)),
          totalRows: data.totalRows || null,
          sample: Array.isArray(data) ? data.slice(0, 3) : (data.rows ? data.rows.slice(0, 2) : data)
        };
      } catch (e) {
        out[ep] = { error: e.message };
      }
    }
    return out;
  });

  fs.writeFileSync('docs/research/probes/camps/nkpd_api.json', JSON.stringify({
    penalFacilitiesPage,
    apiResults
  }, null, 2));

  console.log('Saved nkpd_api.json');
  await browser.close();
}

probeNkpdApi().catch(console.error);
