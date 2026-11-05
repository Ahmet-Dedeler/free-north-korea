#!/usr/bin/env node
/**
 * Tells Bing, Yandex, Naver and Seznam which URLs to crawl, through IndexNow (https://www.indexnow.org). Google doesn't
 * take part. Run it by hand after a change to many pages, once the deploy is live:
 *
 *   node scripts/indexnow.mjs            every URL in the live sitemap
 *   node scripts/indexnow.mjs /map /act  only these paths
 *
 * The key is public by design: it is the file at /<key>.txt, which proves we control the host.
 */
const HOST = 'savenorthkorea.org';
const KEY = 'd7a5e8c1b4f943e2a091c6e87f123456';

const paths = process.argv.slice(2);
const urls = paths.length
  ? paths.map((p) => `https://${HOST}${p}`)
  : [...(await (await fetch(`https://${HOST}/sitemap.xml`)).text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

// the protocol allows 10,000 URLs per request
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);
if (!res.ok) process.exit(1);
