import { chromium } from 'playwright-core';
import fs from 'fs';

const pagesToVisit = [
  'https://www.visualatlas.org/en',
  'https://www.visualatlas.org/en/forced-repatriation',
  'https://www.visualatlas.org/en/theme',
  'https://www.visualatlas.org/en/density',
  'https://www.visualatlas.org/en/statistics',
  'https://www.visualatlas.org/en/incidents',
  'https://www.visualatlas.org/en/faq'
];

async function deepProbe() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const apiCalls = new Map();

  page.on('request', req => {
    const url = req.url();
    if (url.includes('/api/')) {
      const key = `${req.method()} ${url} -> ${req.postData() || ''}`;
      if (!apiCalls.has(key)) {
        apiCalls.set(key, {
          method: req.method(),
          url: url,
          postData: req.postData(),
          response: null
        });
      }
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('/api/')) {
      try {
        const text = await res.text();
        for (const [key, call] of apiCalls.entries()) {
          if (call.url === url && call.response === null) {
            let parsed = null;
            try { parsed = JSON.parse(text); } catch(e) {}
            call.response = {
              status: res.status(),
              length: text.length,
              sample: parsed || text.slice(0, 500)
            };
            break;
          }
        }
      } catch (e) {}
    }
  });

  for (const targetUrl of pagesToVisit) {
    console.log(`Visiting ${targetUrl}...`);
    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(4000);
    } catch (e) {
      console.error(`Error loading ${targetUrl}:`, e.message);
    }
  }

  // Also explore the JS files to find all keys accepted by /api/posts/pool
  const jsKeys = await page.evaluate(async () => {
    // Check if we can test keys on /en/api/posts/pool
    const candidateKeys = [
      'glossary', 'incident', 'incidents', 'case', 'cases', 'facility', 'facilities',
      'camp', 'camps', 'victim', 'victims', 'perpetrator', 'perpetrators',
      'repatriation', 'forced-repatriation', 'theme', 'density', 'statistics',
      'post', 'posts', 'place', 'places', 'prison', 'prisons'
    ];
    const results = {};
    for (const k of candidateKeys) {
      try {
        const r = await fetch('/en/api/posts/pool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keys: [k], creatable: false, admin: false })
        });
        const d = await r.json();
        results[k] = {
          status: r.status,
          success: !d.error,
          error: d.error,
          itemCount: d.data?.items ? d.data.items.length : (d.data?.total || null),
          total: d.data?.total ?? null,
          fields: d.data?.schema?.fields ? Object.keys(d.data.schema.fields) : null,
          sampleItem: d.data?.items?.[0] || null
        };
      } catch (err) {
        results[k] = { error: err.message };
      }
    }
    return results;
  });

  const out = {
    recordedApiCalls: Array.from(apiCalls.values()),
    candidateKeyResults: jsKeys
  };

  fs.writeFileSync('docs/research/probes/camps/visualatlas_deep.json', JSON.stringify(out, null, 2));
  console.log('Saved deep probe results to docs/research/probes/camps/visualatlas_deep.json');

  await browser.close();
}

deepProbe().catch(console.error);
