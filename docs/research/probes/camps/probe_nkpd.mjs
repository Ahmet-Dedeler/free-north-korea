import { chromium } from 'playwright-core';
import fs from 'fs';

async function probeNkpd() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  const responses = [];

  page.on('request', req => {
    if (req.url().includes('nkpd.io') || req.url().includes('api')) {
      requests.push({
        method: req.method(),
        url: req.url(),
        postData: req.postData()
      });
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('api') || url.includes('graphql') || url.includes('json') || url.includes('facilities') || url.includes('search')) {
      let body = '';
      try { body = (await res.text()).slice(0, 1000); } catch(e) {}
      responses.push({
        status: res.status(),
        url,
        body
      });
    }
  });

  console.log('Navigating to https://nkpd.io ...');
  await page.goto('https://nkpd.io', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  const title = await page.title();
  console.log('Title:', title);

  const pageSummary = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a')).map(a => ({ href: a.href, text: a.innerText.trim() }));
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim());
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    return { links, headings, buttons };
  });

  fs.writeFileSync('docs/research/probes/camps/nkpd_home.json', JSON.stringify({
    title,
    pageSummary,
    requests: requests.slice(0, 50),
    responses: responses.slice(0, 50)
  }, null, 2));

  console.log('Saved nkpd_home.json');
  await browser.close();
}

probeNkpd().catch(console.error);
