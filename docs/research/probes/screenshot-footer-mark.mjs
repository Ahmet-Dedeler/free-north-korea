// One-off: screenshot the footer-mark line (home page footer) at desktop width, dark + light.
import { chromium } from 'playwright-core';

const url = 'http://localhost:3000/';
const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--use-angle=swiftshader'],
});
for (const theme of ['dark', 'light']) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme,
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  const mark = page.locator('.footer-mark');
  await mark.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await mark.screenshot({ path: `docs/watch/footer-mark-${theme}.png` });
  // also full-width viewport bottom to judge fit
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `docs/watch/footer-bottom-${theme}.png` });
  await page.close();
}
await browser.close();
console.log('done');
