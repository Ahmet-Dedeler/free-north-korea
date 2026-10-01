// Builds data/entities/{people,orgs}.json from the research dossier (docs/research/leadership.json),
// re-checking everything we can against primary sources instead of trusting the research agent:
//   1. Wikidata: confirms each QID is really that person, takes birth/death dates at their real precision
//      (no fake "-01-01" days), gender, and a photo.
//   2. Wikimedia Commons: photos are kept only if freely licensed; downloaded to public/img/people/.
//   3. Sanctions: matched by name (+ birth year) against the live US Treasury OFAC SDN list and the UN 1718
//      consolidated list. The agent's own sanction claims are discarded.
//   4. Every source link is fetched; dead ones are flagged (link_ok: false).
// Writes data/entities/build-report.json with everything it changed or dropped.
//   node scripts/build-entities.ts [--no-links] [--no-images]
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';

const UA = 'free-north-korea entity builder (+https://github.com/Ahmet-Dedeler/free-north-korea)';
const NO_LINKS = process.argv.includes('--no-links');
const NO_IMAGES = process.argv.includes('--no-images');
const OUT = 'data/entities/';
const report: Record<string, unknown[]> = { qidMismatch: [], datesFixed: [], images: [], sanctions: [], deadLinks: [], notes: [] };

type Any = Record<string, any>; // research JSON is loosely typed; we normalise it below
const src = JSON.parse(readFileSync('docs/research/leadership.json', 'utf8')) as { people: Any[]; orgs: Any[] };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z]/g, '');

async function getJson(url: string) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

// ---------- 1. Wikidata ----------
type WdTime = { time: string; precision: number };
function wdDate(t?: WdTime): string | null {
  if (!t) return null;
  const m = t.time.match(/^([+-])(\d{4})-(\d\d)-(\d\d)/);
  if (!m) return null;
  const [, , y, mo, d] = m;
  return t.precision >= 11 ? `${y}-${mo}-${d}` : t.precision === 10 ? `${y}-${mo}` : y;
}
const claim = (e: Any, p: string) => e.claims?.[p]?.find((c: Any) => c.rank !== 'deprecated')?.mainsnak?.datavalue?.value;

/**
 * Resolve each person's Wikidata QID ourselves (the research agent's QIDs were mostly wrong).
 * Search by English and Korean name, then accept only a human (P31=Q5) with North or South Korean
 * citizenship (or a "North Korean" description) whose label/alias matches the name.
 * Results are cached in data/entities/qids.json so a human can review or pin them (set a value by hand to override).
 */
const QID_CACHE = OUT + 'qids.json';
const qidCache: Record<string, string | null> = existsSync(QID_CACHE) ? JSON.parse(readFileSync(QID_CACHE, 'utf8')) : {};
const KOREAS = new Set(['Q423', 'Q884', 'Q18097', 'Q28233', 'Q170042']);
const wd: Record<string, Any> = {};
async function entities(ids: string[]) {
  const need = ids.filter((i) => !wd[i]);
  for (let i = 0; i < need.length; i += 50) {
    const r = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels|aliases|claims|descriptions|sitelinks&sitefilter=enwiki&languages=en|ko&ids=${need.slice(i, i + 50).join('|')}`);
    Object.assign(wd, r.entities);
  }
}
const isMatch = (e: Any, p: Any) => {
  const claims = (prop: string) => (e.claims?.[prop] ?? []).map((c: Any) => c.mainsnak?.datavalue?.value?.id);
  if (!claims('P31').includes('Q5')) return false;
  const desc = e.descriptions?.en?.value ?? '';
  // common Korean names collide with athletes and entertainers; none of our people are those
  if (/actress|actor|singer|footballer|gymnast|taekwondo|badminton|runner|athlete|swimmer|boxer|religious|poet|painter|K-pop/i.test(desc)) return false;
  const defector = (p.tags ?? []).includes('defector');
  const korean = claims('P27').includes('Q423') || /north korea|DPRK|kim il.?sung|kim jong/i.test(desc) || (defector && claims('P27').some((q: string) => KOREAS.has(q)));
  const names = [e.labels?.en?.value, e.labels?.ko?.value, ...(e.aliases?.en ?? []).map((a: Any) => a.value), ...(e.aliases?.ko ?? []).map((a: Any) => a.value)]
    .filter(Boolean)
    .map(norm);
  const mine = [p.name_en, p.name_ko, ...(p.aliases ?? [])].filter(Boolean).map(norm);
  const ko = p.name_ko && [e.labels?.ko?.value, ...(e.aliases?.ko ?? []).map((a: Any) => a.value)].includes(p.name_ko);
  return korean && (names.some((n: string) => n && mine.includes(n)) || ko);
};
for (const p of src.people) {
  if (p.id in qidCache) continue;
  const found = new Set<string>();
  for (const [q, lang] of [[p.name_en, 'en'], [p.name_en.replace(/ (\w+) (\w+)$/, ' $1-$2'), 'en'], [p.name_ko, 'ko']] as const) {
    if (!q) continue;
    const r = await getJson(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&type=item&limit=7&language=${lang}&search=${encodeURIComponent(q)}`);
    for (const h of r.search ?? []) found.add(h.id);
  }
  await entities([...found]);
  qidCache[p.id] = [...found].find((id) => wd[id] && isMatch(wd[id], p)) ?? null;
}
writeFileSync(QID_CACHE, JSON.stringify(qidCache, null, 1) + '\n');
await entities(Object.values(qidCache).filter(Boolean) as string[]);

// ---------- 3. Sanctions lists ----------
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') (cur += '"'), i++;
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') row.push(cur), (cur = '');
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur), rows.push(row), (row = []), (cur = '');
    } else cur += c;
  }
  if (cur || row.length) row.push(cur), rows.push(row);
  return rows;
}

const fetchText = async (url: string) => (await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(60_000) })).text();
const [sdnCsv, altCsv, unXml] = await Promise.all([
  fetchText('https://www.treasury.gov/ofac/downloads/sdn.csv'),
  fetchText('https://www.treasury.gov/ofac/downloads/alt.csv'),
  fetchText('https://scsanctions.un.org/resources/xml/en/consolidated.xml'),
]);

type Listing = { list: 'OFAC' | 'UN'; id: string; names: string[]; year: string | null; date: string | null; source_url: string; individual: boolean };
const listings: Listing[] = [];

// OFAC: "KIM, Jong Un" → also try "Jong Un KIM". Only DPRK programs.
const sdn = parseCsv(sdnCsv).filter((r) => r.length > 3 && /DPRK/.test(r[3]));
const alts = new Map<string, string[]>();
for (const r of parseCsv(altCsv)) if (r[3]) alts.set(r[0], [...(alts.get(r[0]) ?? []), r[3]]);
for (const r of sdn) {
  const [id, name, type, , , , , , , , , remarks] = r;
  const variants = [name, ...(alts.get(id) ?? [])].flatMap((n) => {
    const [last, first] = n.split(',').map((s) => s.trim());
    return first ? [`${last} ${first}`, `${first} ${last}`] : [n];
  });
  listings.push({
    list: 'OFAC',
    id,
    names: variants.map(norm),
    year: remarks?.match(/DOB[^;]*?(\d{4})/)?.[1] ?? null,
    date: null,
    source_url: `https://sanctionssearch.ofac.treas.gov/Details.aspx?id=${id}`,
    individual: type === 'individual',
  });
}

// UN 1718 committee: references start with KPi (individuals) / KPe (entities).
const tag = (block: string, t: string) => block.match(new RegExp(`<${t}>([^<]*)</${t}>`))?.[1]?.trim() ?? '';
for (const [kind, re] of [
  ['i', /<INDIVIDUAL>([\s\S]*?)<\/INDIVIDUAL>/g],
  ['e', /<ENTITY>([\s\S]*?)<\/ENTITY>/g],
] as const) {
  for (const m of unXml.matchAll(re)) {
    const b = m[1];
    const ref = tag(b, 'REFERENCE_NUMBER');
    if (!ref.startsWith('KP')) continue;
    const full = [tag(b, 'FIRST_NAME'), tag(b, 'SECOND_NAME'), tag(b, 'THIRD_NAME')].filter(Boolean).join(' ');
    const aliasNames = [...b.matchAll(/<ALIAS_NAME>([^<]*)<\/ALIAS_NAME>/g)].map((a) => a[1]);
    listings.push({
      list: 'UN',
      id: ref,
      names: [full, ...aliasNames].filter(Boolean).map(norm),
      year: b.match(/<YEAR>(\d{4})<\/YEAR>/)?.[1] ?? b.match(/<DATE>(\d{4})/)?.[1] ?? null,
      date: tag(b, 'LISTED_ON') || null,
      source_url: 'https://main.un.org/securitycouncil/en/sanctions/1718/materials',
      individual: kind === 'i',
    });
  }
}

function sanctionsFor(names: string[], birthYear: string | null, individual: boolean) {
  const keys = new Set(names.filter(Boolean).map(norm).filter((k) => k.length > 5));
  return listings
    .filter((l) => l.individual === individual && l.names.some((n) => keys.has(n)))
    // a same-name listing with a different birth year is someone else
    .filter((l) => !individual || !l.year || !birthYear || Math.abs(+l.year - +birthYear) <= 1)
    .map((l) => ({ list: l.list, id: l.id, date: l.date, source_url: l.source_url }));
}

// ---------- 2. Commons images ----------
const FREE = /^(cc[ -]?by|cc0|cc[ -]?by-sa|public domain|pd|gfdl|attribution|kogl)/i;
async function commonsImage(file: string, dest: string) {
  const r = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=360&titles=File:${encodeURIComponent(file)}`,
  );
  const page = Object.values(r.query.pages)[0] as Any;
  const info = page.imageinfo?.[0];
  if (!info) throw new Error('missing on Commons');
  const lic = info.extmetadata?.LicenseShortName?.value ?? '';
  if (!FREE.test(lic)) throw new Error(`non-free license "${lic}"`);
  const artist = (info.extmetadata?.Artist?.value ?? '').replace(/<[^>]+>/g, '').trim();
  const res = await fetch(info.thumburl ?? info.url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  mkdirSync('public/img/people', { recursive: true });
  writeFileSync(`public${dest}`, Buffer.from(await res.arrayBuffer()));
  return { src: dest, credit: artist ? `${artist} / Wikimedia Commons` : 'Wikimedia Commons', license: lic, sourceUrl: info.descriptionurl };
}

// ---------- Wikidata/Wikipedia enrichment ----------
// Labels for everything our people point at (positions, places, ranks, causes of death).
const refQ = new Set<string>();
const REF_PROPS = ['P39', 'P19', 'P20', 'P509', 'P410'];
for (const q of Object.values(qidCache)) {
  const e = q && wd[q];
  if (!e) continue;
  for (const prop of REF_PROPS) for (const c of e.claims?.[prop] ?? []) if (c.mainsnak?.datavalue?.value?.id) refQ.add(c.mainsnak.datavalue.value.id);
}
const refLabel: Record<string, string> = {};
{
  const ids = [...refQ];
  for (let i = 0; i < ids.length; i += 50) {
    const r = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels&languages=en&ids=${ids.slice(i, i + 50).join('|')}`);
    for (const [id, e] of Object.entries(r.entities as Any)) if ((e as Any).labels?.en) refLabel[id] = (e as Any).labels.en.value;
  }
}
const qidToId = new Map(Object.entries(qidCache).filter(([, q]) => q).map(([id, q]) => [q as string, id]));
const enTitle = (e: Any | null) => e?.sitelinks?.enwiki?.title as string | undefined;

// Wikipedia: the intro (for the summary) and the full plain text (to check the research agent's roles/family/status).
const wikiIntro: Record<string, string> = {};
const wikiText: Record<string, string> = {};
for (const q of Object.values(qidCache)) {
  const t = q && enTitle(wd[q]);
  if (!t) continue;
  const r = await getJson(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext=1&redirects=1&titles=${encodeURIComponent(t)}`);
  const text = (Object.values(r.query.pages)[0] as Any)?.extract ?? '';
  wikiText[q as string] = text.toLowerCase();
  // first two sentences of the intro, skipping pronunciation clutter in parentheses
  const intro = text.split('\n')[0].replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  wikiIntro[q as string] = (intro.match(/[^.!?]+[.!?]+/g) ?? [intro]).slice(0, 2).join('').trim();
}

/** Positions held (P39) with start/end qualifiers. */
function wdRoles(e: Any | null) {
  return (e?.claims?.P39 ?? [])
    .filter((c: Any) => c.rank !== 'deprecated' && c.mainsnak?.datavalue?.value?.id)
    .map((c: Any) => ({
      title: refLabel[c.mainsnak.datavalue.value.id] ?? null,
      org_id: null,
      start: wdDate(c.qualifiers?.P580?.[0]?.datavalue?.value),
      end: wdDate(c.qualifiers?.P582?.[0]?.datavalue?.value),
      source_url: `https://www.wikidata.org/wiki/${e?.id}`,
    }))
    .filter((r: Any) => r.title);
}

/** Family from Wikidata, limited to people in our graph. */
function wdFamily(e: Any | null) {
  const out: Any[] = [];
  const rel: [string, string][] = [['P22', 'father'], ['P25', 'mother'], ['P26', 'spouse'], ['P40', 'child'], ['P3373', 'sibling']];
  for (const [prop, relation] of rel) {
    for (const c of e?.claims?.[prop] ?? []) {
      const id = qidToId.get(c.mainsnak?.datavalue?.value?.id);
      if (id) out.push({ relation, person_id: id, note: null });
    }
  }
  return out;
}

/** True if most of the significant words of `phrase` occur in the person's Wikipedia article. */
const inArticle = (q: string | null, phrase: string, need = 0.6) => {
  const t = q ? wikiText[q] : '';
  if (!t) return false;
  const words = (phrase.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter((w) => !['north', 'korea', 'korean', 'party', 'workers', 'first', 'with'].includes(w));
  return words.length > 0 && words.filter((w) => t.includes(w)).length / words.length >= need;
};

// ---------- build people ----------
const people: Any[] = [];
for (const p of src.people) {
  const qid: string | null = qidCache[p.id] ?? null;
  if (p.wikidata && p.wikidata !== qid) (report.qidMismatch as unknown[]).push({ id: p.id, agentQid: p.wikidata, resolved: qid });
  const ent = qid ? wd[qid] : null;

  // dates: Wikidata precision wins; otherwise strip the agent's fake "-01-01"
  const fix = (agent: string | null | undefined, wdVal: string | null, which: string) => {
    let v = wdVal ?? agent ?? null;
    if (!wdVal && v && /-01-01$/.test(v)) v = v.slice(0, 4);
    if (v !== (agent ?? null)) (report.datesFixed as unknown[]).push({ id: p.id, which, from: agent, to: v });
    return v;
  };
  const born = p.born ? { ...p.born, date: fix(p.born.date, wdDate(claim(ent ?? {}, 'P569')), 'born') } : null;
  const diedWd = wdDate(claim(ent ?? {}, 'P570'));
  const died = p.died || diedWd ? { ...(p.died ?? {}), date: fix(p.died?.date, diedWd, 'died') } : null;
  const genderQ = claim(ent ?? {}, 'P21')?.id;
  const gender = genderQ === 'Q6581097' ? 'male' : genderQ === 'Q6581072' ? 'female' : (p.gender ?? null);

  let image = null;
  if (!NO_IMAGES) {
    const files = [claim(ent ?? {}, 'P18'), p.image_commons].filter(Boolean) as string[];
    for (const f of files) {
      try {
        image = await commonsImage(f.replace(/ /g, '_'), `/img/people/${p.id}.jpg`);
        (report.images as unknown[]).push({ id: p.id, file: f, license: image.license });
        break;
      } catch (err) {
        (report.notes as unknown[]).push({ id: p.id, image: f, rejected: (err as Error).message });
      }
    }
  } else if (existsSync(`public/img/people/${p.id}.jpg`)) {
    const prev = existsSync(OUT + 'people.json') ? (JSON.parse(readFileSync(OUT + 'people.json', 'utf8')) as Any[]).find((x) => x.id === p.id) : null;
    image = prev?.image ?? null;
  }

  const sanctions = sanctionsFor([p.name_en, ...(p.aliases ?? [])], born?.date?.slice(0, 4) ?? null, true);
  if (sanctions.length) (report.sanctions as unknown[]).push({ id: p.id, sanctions: sanctions.map((s) => `${s.list} ${s.id}`) });

  // roles: Wikidata positions first; research roles only if the person's Wikipedia article backs them up
  const roles: Any[] = wdRoles(ent);
  const seen = new Set(roles.map((r) => norm(r.title)));
  const article = qid && enTitle(ent) ? `https://en.wikipedia.org/wiki/${encodeURIComponent(enTitle(ent)!.replace(/ /g, '_'))}` : null;
  // the dossier's role titles are often paraphrased or invented ("President of Politburo Presidium"),
  // so only fall back to them when Wikidata knows almost nothing about this person's positions
  for (const r of roles.length >= 2 ? [] : (p.roles ?? [])) {
    if (seen.has(norm(r.title)) || !inArticle(qid, r.title, 0.75)) continue;
    roles.push({ ...r, source_url: article });
    seen.add(norm(r.title));
  }
  // family: Wikidata links plus research links whose relative is named in the article
  const family: Any[] = wdFamily(ent);
  for (const f of p.family ?? []) {
    if (family.some((x) => x.person_id === f.person_id)) continue;
    const other = src.people.find((x) => x.id === f.person_id);
    if (other && (inArticle(qid, other.name_en, 1) || inArticle(qidCache[other.id], p.name_en, 1))) family.push(f);
  }
  // Wikidata has no "half-sibling"; keep the research label when it says so (e.g. Kim Jong Nam / Kim Jong Un)
  for (const f of family) {
    const r = (p.family ?? []).find((x: Any) => x.person_id === f.person_id);
    if (r?.relation === 'half-sibling' && f.relation === 'sibling') f.relation = 'half-sibling';
    if (r?.note && !f.note) f.note = r.note;
  }
  // status: dead if Wikidata has a death date; "executed"/"purged" only if Wikipedia says so
  let status = p.status ?? null;
  const v = String(status?.value ?? '');
  if (died?.date) status = { value: /execut/.test(v) && inArticle(qid, 'executed', 1) ? 'executed' : 'dead', as_of: died.date, source_url: article };
  else if (/execut|purg/.test(v) && !inArticle(qid, v.includes('execut') ? 'executed' : 'purged', 1)) status = { value: 'unknown', as_of: null, source_url: null };
  const causeQ = claim(ent ?? {}, 'P509')?.id;
  const rankQ = claim(ent ?? {}, 'P410')?.id;
  const placeQ = claim(ent ?? {}, 'P19')?.id;

  people.push({
    id: p.id,
    name_en: p.name_en,
    name_ko: p.name_ko ?? ent?.labels?.ko?.value ?? null,
    aliases: (p.aliases ?? []).filter((a: string) => !/^(supreme leader|general secretary|first lady)$/i.test(a)),
    wikidata: qid,
    wikipedia: article,
    image,
    born: born ? { ...born, place: (placeQ && refLabel[placeQ]) || born.place || null } : null,
    died: died ? { ...died, cause: (causeQ && refLabel[causeQ]) || died.cause || null } : null,
    status,
    gender,
    rank: rankQ && refLabel[rankQ] ? refLabel[rankQ].replace(/^./, (c) => c.toUpperCase()) : null,
    roles,
    family,
    health: p.health ?? [],
    physical: p.physical ?? null,
    sanctions,
    // Wikipedia's intro when we have one (attributed on the page); the research summary only as a fallback
    summary: (qid && wikiIntro[qid]) || p.summary || '',
    summary_source: qid && wikiIntro[qid] ? 'wikipedia' : 'research',
    notable: p.notable ?? [],
    tags: p.tags ?? [],
  });
}

// ---------- family post-processing ----------
{
  const byId = new Map(people.map((p) => [p.id, p]));
  /** Parents of a person, from their own links and from parents who list them as a child. */
  const parents = (id: string) => {
    const set = new Set<string>();
    for (const f of byId.get(id)?.family ?? []) if (f.relation === 'father' || f.relation === 'mother') set.add(f.person_id);
    for (const q of people) if (q.family.some((f: Any) => f.relation === 'child' && f.person_id === id)) set.add(q.id);
    return set;
  };
  for (const p of people) {
    p.family = p.family.filter((f: Any) => f.relation !== 'in-law' && byId.has(f.person_id));
    // Wikidata only says "sibling": it's a half-sibling when they share one parent but a known parent isn't shared
    for (const f of p.family) {
      if (f.relation !== 'sibling' && f.relation !== 'half-sibling') continue;
      const a = parents(p.id);
      const b = parents(f.person_id);
      const shared = [...a].filter((x) => b.has(x));
      if (!shared.length) continue;
      f.relation = [...a, ...b].some((x) => !shared.includes(x)) ? 'half-sibling' : 'sibling';
    }
    // "family" means part of the Kim family graph, so it needs at least one family link
    const linked = p.family.length > 0 || people.some((q) => q.family.some((f: Any) => f.person_id === p.id));
    if (!linked) p.tags = p.tags.filter((t: string) => t !== 'family');
  }
}

const orgs = src.orgs.map((o) => ({
  id: o.id,
  name_en: o.name_en,
  name_ko: o.name_ko ?? null,
  type: o.type ?? null,
  parent_org_id: o.parent_org_id ?? null,
  head_person_id: o.head_person_id ?? null,
  summary: o.summary ?? '',
  sanctions: sanctionsFor([o.name_en, ...(o.aliases ?? [])], null, false),
  source_urls: o.source_urls ?? [],
}));

// ---------- curated claims (hand-checked, data/entities/curated.json) ----------
const curated: Record<string, Any> = existsSync(OUT + 'curated.json') ? JSON.parse(readFileSync(OUT + 'curated.json', 'utf8')) : {};
for (const p of people) {
  const c = curated[p.id];
  if (!c) continue;
  // curated claims were checked by a person, so the automated source check skips them
  const mark = (arr: Any[] = []) => arr.map((x) => ({ ...x, curated: true }));
  p.health = [...mark(c.health), ...p.health];
  p.notable = [...mark(c.notable), ...p.notable];
  if (c.physical) p.physical = { ...(p.physical ?? {}), ...Object.fromEntries(Object.entries(c.physical).map(([k, v]) => [k, { ...(v as Any), curated: true }])) };
}

// ---------- 4. source check ----------
// "The link loads" isn't enough: news sites return 200 for missing articles (soft 404s) and the research agent
// invented some article URLs. A health/notable/physical claim survives only if its source page loads AND mentions
// the person (given name, e.g. "Jong Un" / "Jong-un"). Unverifiable claims are dropped and listed in the report.
if (!NO_LINKS) {
  const pageText = new Map<string, string | null>();
  const urls = new Set<string>();
  for (const p of people) {
    for (const c of [...p.health, ...p.notable, p.physical?.height_cm, p.physical?.weight_kg, ...p.roles, p.status]) if (c?.source_url) urls.add(c.source_url);
  }
  const queue = [...urls];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      for (let u = queue.shift(); u; u = queue.shift()) {
        try {
          const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
          pageText.set(u, r.ok ? (await r.text()).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').toLowerCase() : null);
        } catch {
          pageText.set(u, null);
        }
      }
    }),
  );
  // Sites that block plain fetches (403/429, Cloudflare) get a second chance in a real headless Chrome.
  const blocked = [...urls].filter((u) => !pageText.get(u));
  if (blocked.length) {
    const { chromium } = await import('playwright-core');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36' });
    const page = await ctx.newPage();
    for (const u of blocked) {
      try {
        const res = await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 25_000 });
        await page.waitForTimeout(1500);
        if (res && res.status() < 400) pageText.set(u, (await page.innerText('body')).toLowerCase());
      } catch {
        /* still unreachable */
      }
    }
    await browser.close();
    console.log(`browser retry: ${blocked.filter((u) => pageText.get(u)).length}/${blocked.length} recovered`);
  }
  const STOP = new Set(['because', 'between', 'through', 'without', 'reported', 'according', 'national', 'service', 'intelligence', 'assessed', 'including', 'believed']);
  /** The claim's own evidence must be on the page: any numbers it states, and at least a quarter of its long words. */
  const supports = (u: string, c: Any) => {
    const t = pageText.get(u)!;
    const text = String(c.claim ?? '');
    const nums = [...new Set([...(text.match(/\d+(?:\.\d+)?/g) ?? []), ...(typeof c.value === 'number' ? [String(c.value)] : [])])].filter((n) => n.length >= 2 && !/^(19|20)\d\d$/.test(n));
    if (nums.length && !nums.some((n) => t.includes(n))) return false;
    const words = [...new Set((text.toLowerCase().match(/[a-z]{7,}/g) ?? []).filter((w) => !STOP.has(w)))];
    return words.length === 0 || words.filter((w) => t.includes(w)).length / words.length >= 0.25;
  };
  const mentions = (u: string, p: Any) => {
    const t = pageText.get(u);
    if (!t) return false;
    // a site's homepage proves nothing about a specific claim
    try {
      if (new URL(u).pathname.replace(/\/+$/, '') === '') return false;
    } catch {
      return false;
    }
    // given name without the family name: "Kim Jong Un" → "jongun"; single-token names use the whole name
    const parts = p.name_en.split(/\s+/);
    const given = norm(parts.length > 1 ? parts.slice(1).join('') : p.name_en);
    const flat = norm(t);
    return flat.includes(given) || (p.name_ko && t.includes(p.name_ko));
  };
  const dropped: Any[] = [];
  for (const p of people) {
    const ok = (c: Any) => !c?.source_url || c.curated || (mentions(c.source_url, p) && supports(c.source_url, c));
    const keep = (arr: Any[], kind: string) =>
      arr.filter((c) => {
        if (ok(c)) return true;
        dropped.push({ id: p.id, kind, claim: c.claim, url: c.source_url });
        return false;
      });
    p.health = keep(p.health, 'health');
    p.notable = keep(p.notable, 'notable');
    for (const k of ['height_cm', 'weight_kg']) {
      if (p.physical?.[k] && !ok(p.physical[k])) {
        dropped.push({ id: p.id, kind: k, url: p.physical[k].source_url });
        p.physical[k] = null;
      }
    }
    // roles and status keep their content (they're cross-checked by other sources) but lose links that don't check out
    for (const r of p.roles) if (r.source_url && !ok(r)) r.source_url = null;
    if (p.status?.source_url && !ok(p.status)) p.status.source_url = null;
  }
  report.droppedClaims = dropped;
  const verified = people.reduce((n, p) => n + p.health.length + p.notable.length, 0);
  console.log(`sources: ${urls.size} fetched; kept ${verified} verified claims, dropped ${dropped.length}`);
}

// remove photos of people who no longer have one (e.g. a QID that was corrected)
if (!NO_IMAGES && existsSync('public/img/people')) {
  const keep = new Set(people.map((p) => p.image?.src).filter(Boolean));
  for (const f of readdirSync('public/img/people')) if (!keep.has(`/img/people/${f}`)) unlinkSync(`public/img/people/${f}`);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(OUT + 'people.json', JSON.stringify(people, null, 1) + '\n');
writeFileSync(OUT + 'orgs.json', JSON.stringify(orgs, null, 1) + '\n');
writeFileSync(OUT + 'build-report.json', JSON.stringify(report, null, 1) + '\n');
console.log(
  `people ${people.length}, orgs ${orgs.length}; qid mismatches ${report.qidMismatch.length}, dates fixed ${report.datesFixed.length}, ` +
    `photos ${people.filter((p) => p.image).length}, sanctioned people ${people.filter((p) => p.sanctions.length).length}, ` +
    `sanctioned orgs ${orgs.filter((o) => o.sanctions.length).length}`,
);
