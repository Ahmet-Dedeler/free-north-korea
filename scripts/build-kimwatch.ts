// Builds data/kimwatch.json for /kim-watch: every Kim Jong Un activity KCNA (North Korean state media) reported, with
// what each report says about where he went, who was with him and whether his daughter was there.
//
//   node scripts/build-kimwatch.ts               # fetch new KCNA items, then rebuild data/kimwatch.json
//   node scripts/build-kimwatch.ts --offline     # rebuild from the cache only (no network)
//   node scripts/build-kimwatch.ts --no-search   # skip the slow site search (letters/greetings stay as they were)
//   node scripts/build-kimwatch.ts --fetch-only  # fill the cache, don't rebuild
//   KIMWATCH_CONCURRENCY=2 node scripts/build-kimwatch.ts
//
// How it works:
//   1. Lists KCNA's own category for his activities (one POST returns all of it) and searches the site for
//      "Kim Jong Un" to catch letters, greetings and flower baskets, which KCNA files elsewhere.
//   2. Downloads the text of every activity article not in the cache yet. Only the headline and paragraphs are kept,
//      sharded by month in data/raw/kcna/articles/<YYYY-MM>.json, so a re-run only fetches what is new.
//   3. Parses each report with fixed rules (scripts/kimwatch/parse.ts): no model involved.
//   4. KCNA's listings only reach back one year, so items that dropped off the site stay in the cache and in the
//      output. Run it at least every few months or the gap can't be filled.
//
// Everything here is what North Korean state media reported. Nothing is independently verified, and the page says so.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { ACTIVITY_CATEGORY, KCNA, KcnaClient, pool, type Article, type ListItem } from './kimwatch/kcna.ts';
import { buildDataset } from './kimwatch/parse.ts';

const args = new Set(process.argv.slice(2));
const OFFLINE = args.has('--offline');
const FETCH_ONLY = args.has('--fetch-only');
const NO_SEARCH = args.has('--no-search');
const CONCURRENCY = Number(process.env.KIMWATCH_CONCURRENCY ?? 3);

const RAW = 'data/raw/kcna';
const ARTICLES = `${RAW}/articles`;
const LISTING = `${RAW}/listing.json`;
const OUT = 'data/kimwatch.json';

interface Listing {
  /** Last time each list was fetched. */
  categoryFetched?: string;
  searchFetched?: string;
  /** Oldest item the site still listed on the last fetch: shows how far back the live archive reaches. */
  oldestListed?: string;
  /** Items in the activity category. Kept after the site drops them. */
  category: ListItem[];
  /** Search hits for "Kim Jong Un" outside the category (letters, greetings, editorials). Kept after the site drops them. */
  search: ListItem[];
  /** KCNA's own Korean headline for each activity report (the Korean site uses the same article ids). */
  titlesKo?: Record<string, string>;
}

const readJson = <T,>(file: string, fallback: T): T => (existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : fallback);
const writeJson = (file: string, data: unknown) => writeFileSync(file, JSON.stringify(data, null, 1) + '\n');
const today = () => new Date().toISOString().slice(0, 10);

function mergeItems(old: ListItem[], fresh: ListItem[]) {
  const byId = new Map(old.map((i) => [i.id, i]));
  for (const i of fresh) byId.set(i.id, i);
  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

function loadArticles(): Map<string, Article> {
  const map = new Map<string, Article>();
  if (!existsSync(ARTICLES)) return map;
  for (const f of readdirSync(ARTICLES).filter((f) => f.endsWith('.json')).sort()) {
    for (const a of Object.values(readJson<Record<string, Article>>(`${ARTICLES}/${f}`, {}))) map.set(a.id, a);
  }
  return map;
}

function saveArticles(map: Map<string, Article>) {
  mkdirSync(ARTICLES, { recursive: true });
  const shards = new Map<string, Record<string, Article>>();
  for (const a of [...map.values()].sort((x, y) => x.date.localeCompare(y.date) || x.id.localeCompare(y.id))) {
    const key = a.date.slice(0, 7);
    if (!shards.has(key)) shards.set(key, {});
    shards.get(key)![a.id] = a;
  }
  for (const [key, shard] of shards) writeJson(`${ARTICLES}/${key}.json`, shard);
}

const started = Date.now();
mkdirSync(RAW, { recursive: true });
const listing = readJson<Listing>(LISTING, { category: [], search: [] });
const articles = loadArticles();

if (!OFFLINE) {
  const kcna = new KcnaClient();
  console.log(`KCNA: opening session at ${KCNA}`);
  await kcna.open();

  const cat = await kcna.category(ACTIVITY_CATEGORY);
  if (cat.length < 50) throw new Error(`KCNA category returned only ${cat.length} items; refusing to continue`);
  console.log(`category: ${cat.length} items, ${cat.at(-1)?.date} to ${cat[0]?.date}`);
  listing.category = mergeItems(listing.category, cat);
  listing.categoryFetched = today();
  listing.oldestListed = cat.at(-1)?.date;
  writeJson(LISTING, listing);

  // The Korean edition lists the same reports under the same ids, with KCNA's original Korean headlines. The Korean
  // page shows those instead of linking to kcna.kp, which is blocked in South Korea.
  try {
    const kp = new KcnaClient('kp');
    await kp.open();
    const ko = await kp.category(ACTIVITY_CATEGORY);
    listing.titlesKo = { ...listing.titlesKo, ...Object.fromEntries(ko.map((i) => [i.id, i.title])) };
    console.log(`Korean headlines: ${ko.length}`);
    writeJson(LISTING, listing);
  } catch (e) {
    console.warn(`Korean listing failed, keeping cached headlines: ${(e as Error).message}`);
  }

  if (!NO_SEARCH) {
    try {
      const hits = await kcna.search('Kim Jong Un');
      const inCategory = new Set(listing.category.map((i) => i.id));
      const outside = hits.filter((h) => !inCategory.has(h.id));
      console.log(`search: ${hits.length} hits, ${outside.length} outside the category`);
      if (hits.length > 100) {
        listing.search = mergeItems(listing.search, outside);
        listing.searchFetched = today();
        writeJson(LISTING, listing);
      }
    } catch (e) {
      // the search is slow and sometimes times out; the previous hits stay in the cache
      console.warn(`search failed, keeping the cached hits: ${(e as Error).message}`);
    }
  }

  const todo = listing.category.filter((i) => !articles.has(i.id));
  console.log(`articles: ${articles.size} cached, ${todo.length} to fetch (concurrency ${CONCURRENCY})`);
  let done = 0;
  const { errors } = await pool(todo, CONCURRENCY, async (item) => {
    const a = await kcna.article(item);
    articles.set(a.id, a);
    done++;
    if (done % 10 === 0 || done === todo.length) {
      saveArticles(articles);
      console.log(`  ${done}/${todo.length} (${Math.round((Date.now() - started) / 1000)} s)`);
    }
  });
  saveArticles(articles);
  for (const e of errors) console.warn(`  failed ${e.item.id} ${e.item.title}: ${(e.error as Error).message}`);
}

if (!FETCH_ONLY) {
  const data = buildDataset({
    category: listing.category,
    search: listing.search,
    articles,
    titlesKo: listing.titlesKo ?? {},
    fetched: listing.categoryFetched ?? today(),
    oldestListed: listing.oldestListed,
  });
  writeJson(OUT, data);
  console.log(
    `${OUT}: ${data.records.length} reports (${data.records.filter((r) => r.appearance).length} public appearances), ` +
      `${data.messages.length} letters/messages, latest appearance ${data.lastAppearance?.date ?? 'none'}`,
  );
}
console.log(`done in ${Math.round((Date.now() - started) / 1000)} s`);
