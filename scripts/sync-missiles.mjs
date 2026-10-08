// Copies the missile test data behind /missiles verbatim from nagix/nk-missile-tests (master/data/*.en.json) into
// public/data/. Runs in the weekly Action before build-series.ts, so /missiles, /missiles/list and the
// missile-launches chart pick up new tests without anyone copying files by hand. Run locally the same way:
//   node scripts/sync-missiles.mjs
// A file is only replaced when the download parses as JSON, and test.en.json only when it has at least as many
// tests as our copy (upstream never deletes tests, so fewer means a broken or truncated download).
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://raw.githubusercontent.com/nagix/nk-missile-tests/master/data/';
const FILES = ['dict', 'facility', 'missile', 'satellite', 'test'];
const countTests = (j) => j.timeBins.flatMap((b) => b.data).length;

let updated = 0;
for (const name of FILES) {
  const path = `public/data/${name}.en.json`;
  const res = await fetch(BASE + `${name}.en.json`, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${name}.en.json: HTTP ${res.status}`);
  const text = await res.text();
  const next = JSON.parse(text);
  const current = readFileSync(path, 'utf8');
  if (current === text) continue;
  if (name === 'test') {
    const [before, after] = [countTests(JSON.parse(current)), countTests(next)];
    if (after < before) throw new Error(`test.en.json: upstream has ${after} tests, ours ${before}; refusing to shrink`);
    console.log(`test.en.json: ${before} -> ${after} tests`);
  }
  writeFileSync(path, text);
  updated++;
  console.log(`updated ${path}`);
}
console.log(`${updated} file(s) updated.`);
