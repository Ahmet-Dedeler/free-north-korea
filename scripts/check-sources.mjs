// Source watcher: checks every upstream source in data/sources/registry.json and records when it changes,
// moves or dies. Runs weekly in GitHub Actions (.github/workflows/check-sources.yml) and can be run locally:
//   node scripts/check-sources.mjs            # check everything
//   node scripts/check-sources.mjs nkdb-visual-atlas   # check one source
//
// Each registry entry has a `watch` describing how to fingerprint it:
//   { "type": "github", "repo": "owner/name" }           latest commit on the default branch
//   { "type": "content", "url": "...", "method"?, "body"?, "headers"? }   sha256 of the response body (data files, APIs)
//   { "type": "headers", "url": "..." }                  ETag / Last-Modified / Content-Length (HTML pages, big files)
//   { "type": "count", "url": "...", "method"?, "body"?, "path": "a.b" }  number of items at a JSON path (APIs whose
//                                                         payload has volatile fields but a stable record count)
// Results go to data/sources/state.json (latest fingerprint per source) and data/sources/changes.json (append-only log).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DIR = 'data/sources/';
const registry = JSON.parse(readFileSync(DIR + 'registry.json', 'utf8'));
const state = existsSync(DIR + 'state.json') ? JSON.parse(readFileSync(DIR + 'state.json', 'utf8')) : {};
const changes = existsSync(DIR + 'changes.json') ? JSON.parse(readFileSync(DIR + 'changes.json', 'utf8')) : [];
const only = process.argv[2];
const now = new Date().toISOString();
const UA = 'free-north-korea source watcher (+https://github.com/Ahmet-Dedeler/free-north-korea)';

const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);

async function get(w) {
  const res = await fetch(w.url, {
    method: w.method ?? 'GET',
    headers: { 'user-agent': UA, ...(w.body ? { 'content-type': 'application/json' } : {}), ...(w.headers ?? {}) },
    body: w.body ? JSON.stringify(w.body) : undefined,
    redirect: 'follow',
    signal: AbortSignal.timeout(30_000),
  });
  return res;
}

/** Returns { status, fingerprint, detail } for one watch spec. */
async function check(w) {
  if (w.type === 'github') {
    const headers = { 'user-agent': UA, accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${w.repo}/commits?per_page=1`, { headers });
    if (!res.ok) return { status: res.status, fingerprint: null, detail: `GitHub API ${res.status}` };
    const [c] = await res.json();
    return { status: 200, fingerprint: c.sha.slice(0, 12), detail: `last commit ${c.commit.committer.date.slice(0, 10)}: ${c.commit.message.split('\n')[0].slice(0, 80)}`, upstreamDate: c.commit.committer.date.slice(0, 10) };
  }
  const res = await get(w);
  // Drop the query string: download redirects are often pre-signed S3 URLs with temporary credentials in them
  // (GitHub flags those as leaked secrets), and they change on every request anyway.
  const finalUrl = res.url.split('?')[0];
  const moved = res.redirected ? ` (redirected to ${finalUrl})` : '';
  if (!res.ok) return { status: res.status, fingerprint: null, detail: `HTTP ${res.status}${moved}` };
  if (w.type === 'headers') {
    const h = ['etag', 'last-modified', 'content-length'].map((k) => res.headers.get(k)).filter(Boolean);
    await res.body?.cancel();
    const lm = res.headers.get('last-modified');
    // Pages without cache headers can't tell us when they change, but we still know they're up (and if they move).
    return {
      status: res.status,
      fingerprint: h.length ? sha(h.join('|')) : `up:${finalUrl}`,
      detail: (lm ? `last-modified ${lm}` : 'reachable, no change signal') + moved,
      upstreamDate: lm ? new Date(lm).toISOString().slice(0, 10) : undefined,
    };
  }
  const text = await res.text();
  if (w.type === 'count') {
    let v = JSON.parse(text);
    for (const k of w.path.split('.').filter(Boolean)) v = v?.[k];
    const n = Array.isArray(v) ? v.length : v !== '' && v !== null && Number.isFinite(Number(v)) ? Number(v) : null;
    return { status: res.status, fingerprint: n === null ? null : String(n), detail: `${n} records${moved}` };
  }
  return { status: res.status, fingerprint: sha(text), detail: `${text.length.toLocaleString('en-US')} bytes${moved}` };
}

let changed = 0;
for (const src of registry) {
  if (only && src.id !== only) continue;
  if (!src.watch) continue;
  const attempt = () => check(src.watch).catch((e) => ({ status: 0, fingerprint: null, detail: `error: ${e.message}` }));
  let r = await attempt();
  // One retry after a pause: overloaded APIs (Overpass 504) and flaky DNS often pass the second time.
  if (!r.fingerprint) r = (await new Promise((ok) => setTimeout(ok, 5000)), await attempt());
  const prev = state[src.id];
  // Some sites block datacenter IPs for a week (403 on the GitHub runner while they load fine from home). A source
  // is only called broken after two failed weeks in a row; the first miss keeps last week's fingerprint.
  const failStreak = r.fingerprint ? 0 : (prev?.failStreak ?? 0) + 1;
  if (!r.fingerprint && prev?.fingerprint && failStreak < 2) {
    r = { ...r, fingerprint: prev.fingerprint, detail: `${r.detail} (first miss, rechecked next week)`, upstreamDate: prev.upstreamDate };
  }
  const kind = !prev ? 'first-check' : prev.fingerprint !== r.fingerprint ? (r.fingerprint ? (prev.fingerprint ? 'changed' : 'recovered') : 'broken') : null;
  state[src.id] = {
    checkedAt: now,
    status: r.status,
    fingerprint: r.fingerprint,
    detail: r.detail,
    upstreamDate: r.upstreamDate ?? prev?.upstreamDate ?? null,
    changedAt: kind && kind !== 'first-check' ? now : (prev?.changedAt ?? null),
    ok: Boolean(r.fingerprint),
    ...(failStreak ? { failStreak } : {}),
  };
  if (kind && kind !== 'first-check') {
    changes.unshift({ id: src.id, at: now, kind, detail: r.detail });
    changed++;
  }
  console.log(`${(kind ?? 'same').padEnd(11)} ${src.id}: ${r.detail}`);
}

writeFileSync(DIR + 'state.json', JSON.stringify(state, null, 2) + '\n');
writeFileSync(DIR + 'changes.json', JSON.stringify(changes.slice(0, 1000), null, 2) + '\n');
console.log(`\n${changed} change(s) recorded.`);
