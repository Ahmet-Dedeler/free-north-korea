import { chromium } from 'playwright-core';
import fs from 'fs';

async function fetchFullDataJsons() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.visualatlas.org/en', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const targets = ['density', 'theme', 'forced-repatriation', 'incidents', 'statistics'];

  for (const t of targets) {
    console.log(`Fetching __data.json for ${t}...`);
    const data = await page.evaluate(async (slug) => {
      const res = await fetch(`/en/${slug}/__data.json`);
      return await res.text();
    }, t);
    fs.writeFileSync(`docs/research/probes/camps/visualatlas_${t}_data.json`, data);
    console.log(`Saved ${t} (${data.length} bytes)`);
  }

  await browser.close();
}

fetchFullDataJsons().catch(console.error);
