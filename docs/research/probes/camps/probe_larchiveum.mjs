import { chromium } from 'playwright-core';
import fs from 'fs';

async function probeLarchiveum() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to https://www.nkhrlarchiveum.org ...');
  await page.goto('https://www.nkhrlarchiveum.org', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const title = await page.title();
  console.log('Title:', title);

  const pageData = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a')).map(a => ({ href: a.href, text: a.innerText.trim() })).filter(l => l.text);
    const text = document.body.innerText.slice(0, 3000);
    return { links, text };
  });

  fs.writeFileSync('docs/research/probes/camps/larchiveum_home.json', JSON.stringify({
    title,
    pageData
  }, null, 2));

  console.log('Saved larchiveum_home.json');
  await browser.close();
}

probeLarchiveum().catch(console.error);
