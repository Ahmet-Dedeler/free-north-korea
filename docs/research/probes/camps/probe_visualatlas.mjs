import { chromium } from 'playwright-core';
import fs from 'fs';

async function probe() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  const requests = [];
  const responses = [];

  page.on('request', req => {
    if (req.url().includes('api') || req.url().includes('visualatlas') || req.url().includes('posts')) {
      requests.push({
        url: req.url(),
        method: req.method(),
        postData: req.postData()
      });
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('api') || url.includes('posts') || url.includes('pool')) {
      let body = '';
      try {
        body = await res.text();
      } catch (e) {
        body = `[error reading body: ${e.message}]`;
      }
      responses.push({
        url,
        status: res.status(),
        headers: res.headers(),
        bodySnippet: body.slice(0, 1000),
        fullBodyLength: body.length
      });
    }
  });

  console.log('Navigating to https://visualatlas.org ...');
  try {
    const res = await page.goto('https://visualatlas.org', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded, status:', res?.status());
  } catch (err) {
    console.log('Navigation warning:', err.message);
  }

  // Wait 8 seconds to allow challenge or SPA data to load
  await page.waitForTimeout(8000);

  const title = await page.title();
  const currentUrl = page.url();
  console.log('Title:', title);
  console.log('Current URL:', currentUrl);

  const cookies = await context.cookies();
  console.log('Cookies acquired:', cookies.map(c => `${c.name}=${c.value.slice(0, 15)}...`));

  fs.writeFileSync('docs/research/probes/camps/visualatlas_network.json', JSON.stringify({
    requests,
    responses,
    title,
    currentUrl,
    cookies
  }, null, 2));

  console.log(`Recorded ${requests.length} requests and ${responses.length} responses.`);

  // Let's also check if we can evaluate page content or APIs from page context
  const evalData = await page.evaluate(async () => {
    const results = {};
    try {
      // Test fetching /en/api/posts/pool from within the authenticated browser context
      const res = await fetch('/en/api/posts/pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      results.postsPoolStatus = res.status;
      results.postsPoolHeaders = Object.fromEntries(res.headers.entries());
      const json = await res.json();
      results.postsPoolSample = json;
    } catch (e) {
      results.postsPoolError = e.message;
    }
    return results;
  });

  console.log('Page eval data:', JSON.stringify(evalData, null, 2).slice(0, 500));
  fs.writeFileSync('docs/research/probes/camps/visualatlas_eval.json', JSON.stringify(evalData, null, 2));

  await browser.close();
}

probe().catch(console.error);
