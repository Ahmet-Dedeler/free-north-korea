// Builds data/sanctions.json for /sanctions from the official lists, fetched live:
//   - UN Security Council consolidated list, 1718 Committee entries only (reference numbers KPi.* / KPe.*)
//   - US Treasury OFAC SDN list: entries under any DPRK program (DPRK, DPRK2, DPRK3, DPRK4, DPRK-NKSPEA), plus
//     entries OFAC lists under its non-proliferation program (NPWMD) with its own note that the North Korea Sanctions
//     Regulations apply ("Secondary sanctions risk: North Korea Sanctions Regulations"). Without those, the UN's
//     Tanchon Commercial Bank or Korea Ryonbong would look absent from the US list.
//   - UK Sanctions List (FCDO), DPRK regime; EU consolidated financial sanctions list, PRK programme; Japan's
//     Ministry of Finance asset-freeze list, North Korea categories (parsers in scripts/sanctions/national.ts)
// Nothing is typed in by hand: names, dates and reasons are exactly what the lists say. `fetched` records the day,
// and the page shows it next to the data so readers can tell how old it is.
//
// The UN and US lists are the core of the page: if either fails, the build stops and nothing is written. A national
// list that fails (download error, or a parse that looks truncated) keeps the copy from the previous run, with that
// copy's own `fetched` date, so the page never shows a half-empty list.
//
// Then scripts/sanctions/match.ts works out which entries on different lists are the same target (`targets`).
//   node scripts/build-sanctions.ts
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { addressKey, clean, fetchText, ofacDobs, parseCsv, passportNumbers, swiftCodes, tag, titleCase } from './sanctions/lib.ts';
import { matchLists, METHODS, type ListKey, type Rec } from './sanctions/match.ts';
import { EU_PAGE, JP_PAGE, UK_PAGE, eu, jp, uk, type NationalList } from './sanctions/national.ts';

const FILE = 'data/sanctions.json';
const UN_URL = 'https://scsanctions.un.org/resources/xml/en/consolidated.xml';
const OFAC_URL = 'https://www.treasury.gov/ofac/downloads/sdn.csv';
/** Addresses, and the end of remarks longer than the 1,000 characters sdn.csv holds. Used for matching only. */
const OFAC_ADD_URL = 'https://www.treasury.gov/ofac/downloads/add.csv';
const OFAC_COMMENTS_URL = 'https://www.treasury.gov/ofac/downloads/sdn_comments.csv';
const previous = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};

const [unXml, sdnCsv, addCsv, commentsCsv] = await Promise.all([UN_URL, OFAC_URL, OFAC_ADD_URL, OFAC_COMMENTS_URL].map(fetchText));

// ---------- UN 1718 ----------
interface UnEntry {
  ref: string;
  name: string;
  aliases: string[];
  /** Day the Security Council or its committee listed them. */
  listed: string;
  /** Job title as the UN records it (individuals only). */
  role?: string;
  /** The UN's own reason for the listing. */
  note?: string;
}

/** Identifiers for matching against the other lists. Used here only, not written to the file. */
const unRecs: Rec[] = [];
function unEntries(kind: 'INDIVIDUAL' | 'ENTITY'): UnEntry[] {
  const out: UnEntry[] = [];
  for (const m of unXml.matchAll(new RegExp(`<${kind}>([\\s\\S]*?)</${kind}>`, 'g'))) {
    const b = m[1];
    const ref = tag(b, 'REFERENCE_NUMBER');
    if (!ref.startsWith('KP')) continue;
    const name = ['FIRST_NAME', 'SECOND_NAME', 'THIRD_NAME', 'FOURTH_NAME'].map((t) => tag(b, t)).filter(Boolean).join(' ');
    const aliases = [...b.matchAll(/<ALIAS_NAME>([^<]+)<\/ALIAS_NAME>/g)].map((a) => clean(a[1])).filter(Boolean);
    const role = clean(b.match(/<DESIGNATION>\s*<VALUE>([^<]*)<\/VALUE>/)?.[1] ?? '');
    const note = tag(b, 'COMMENTS1');
    out.push({
      ref,
      // the list writes names in capitals; title case reads better and matches how the rest of the site writes them
      name: titleCase(name),
      aliases: [...new Set(aliases)].slice(0, 6),
      listed: tag(b, 'LISTED_ON'),
      ...(role && { role }),
      ...(note && { note }),
    });
    const docs = [...b.matchAll(/<INDIVIDUAL_DOCUMENT>([\s\S]*?)<\/INDIVIDUAL_DOCUMENT>/g)].filter((d) => /passport/i.test(tag(d[1], 'TYPE_OF_DOCUMENT')));
    unRecs.push({
      list: 'UN',
      id: ref,
      name: titleCase(name),
      names: [name, ...aliases],
      kind: kind === 'INDIVIDUAL' ? 'individual' : 'entity',
      listed: tag(b, 'LISTED_ON'),
      addr: [...b.matchAll(/<ENTITY_ADDRESS>([\s\S]*?)<\/ENTITY_ADDRESS>/g)].map((a) => addressKey(tag(a[1], 'STREET'))).filter(Boolean),
      dob: [...b.matchAll(/<INDIVIDUAL_DATE_OF_BIRTH>([\s\S]*?)<\/INDIVIDUAL_DATE_OF_BIRTH>/g)].map((d) => tag(d[1], 'DATE') || tag(d[1], 'YEAR')).filter(Boolean),
      passports: passportNumbers(docs.map((d) => tag(d[1], 'NUMBER')).join(' ')),
      swift: swiftCodes(clean(b.replace(/<[^>]+>/g, ' '))),
    });
  }
  return out.sort((a, b) => a.listed.localeCompare(b.listed) || a.ref.localeCompare(b.ref));
}

const un = {
  generated: unXml.match(/dateGenerated="(\d{4}-\d{2}-\d{2})/)?.[1] ?? null,
  individuals: unEntries('INDIVIDUAL'),
  entities: unEntries('ENTITY'),
};
if (un.individuals.length < 50 || un.entities.length < 50) throw new Error('UN list looks truncated; refusing to overwrite');

// ---------- OFAC ----------
type OfacKind = 'individual' | 'entity' | 'vessel' | 'aircraft';
interface OfacEntry {
  id: string;
  name: string;
  kind: OfacKind;
  programs: string[];
  /** Job title, when OFAC gives one. */
  title?: string;
}

const val = (s?: string) => {
  const t = (s ?? '').trim();
  return t === '-0-' ? '' : t;
};
const moreRemarks = new Map(parseCsv(commentsCsv).map((r) => [val(r[0]), r[1] ?? '']));
const ofacAddr = new Map<string, string[]>();
for (const r of parseCsv(addCsv)) {
  const k = addressKey(val(r[2]));
  if (k) ofacAddr.set(val(r[0]), [...(ofacAddr.get(val(r[0])) ?? []), k]);
}
const NKSR = 'North Korea Sanctions Regulations';
const ofacRecs: Rec[] = [];
const ofac: OfacEntry[] = parseCsv(sdnCsv)
  .filter((r) => r.length > 11 && (/DPRK/.test(r[3]) || (/NPWMD/.test(r[3]) && r[11].includes(NKSR))))
  .map((r) => {
    const kind = (val(r[2]) || 'entity') as OfacKind;
    // "KIM, Yong Chol" → "Kim Yong Chol" (family name first, as Korean names are written)
    const raw = val(r[1]);
    const [last, first] = raw.split(',').map((s) => s.trim());
    const name = kind === 'individual' && first ? `${titleCase(last)} ${first}` : titleCase(raw);
    const title = val(r[4]);
    // Remarks hold the aliases, birth dates and ID numbers we match on: "a.k.a. 'KOMID'; DOB 28 Sep 1937; Passport 381420754".
    const remarks = val(r[11]) + (moreRemarks.get(val(r[0])) ?? '');
    ofacRecs.push({
      list: 'US',
      id: val(r[0]),
      name,
      names: [raw, ...[...remarks.matchAll(/[af]\.k\.a\. '([^']+)'/g)].map((m) => m[1])],
      kind,
      dob: ofacDobs(remarks),
      passports: passportNumbers([...remarks.matchAll(/Passport ([A-Z0-9]+)/g)].map((m) => m[1]).join(' ')),
      imo: [...remarks.matchAll(/(?:Vessel Registration Identification|Identification Number) IMO (\d{7})/g)].map((m) => m[1]),
      swift: swiftCodes(remarks),
      addr: kind === 'individual' ? [] : (ofacAddr.get(val(r[0])) ?? []),
    });
    return { id: val(r[0]), name, kind, programs: val(r[3]).split('] [').map((p) => p.trim()), ...(title && { title }) };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
if (ofac.length < 400) throw new Error('OFAC list looks truncated; refusing to overwrite');

// ---------- UK, EU, Japan ----------
const NATIONAL = { uk, eu, jp };
const national = {} as Record<keyof typeof NATIONAL, NationalList>;
for (const [key, build] of Object.entries(NATIONAL) as [keyof typeof NATIONAL, () => Promise<NationalList>][]) {
  try {
    national[key] = await build();
  } catch (e) {
    const old = previous.national?.[key];
    if (!old) throw e;
    console.warn(`${key}: ${(e as Error).message}; keeping the copy fetched ${old.fetched}`);
    national[key] = old;
  }
}

// ---------- who is on which list ----------
const LIST_OF: Record<keyof typeof NATIONAL, ListKey> = { uk: 'UK', eu: 'EU', jp: 'JP' };
const recs: Rec[] = [
  ...unRecs,
  ...ofacRecs,
  ...(Object.keys(national) as (keyof typeof NATIONAL)[]).flatMap((key) =>
    national[key].entries.map((e) => ({ ...e, list: LIST_OF[key], names: [e.name, ...e.aliases] })),
  ),
];
const { targets, warnings } = matchLists(recs);
for (const w of warnings) console.warn(`match: ${w}`);

const out = {
  _doc: 'Built by scripts/build-sanctions.ts from the live UN, US, UK, EU and Japanese lists. Do not edit by hand.',
  fetched: new Date().toISOString().slice(0, 10),
  sources: { un: UN_URL, ofac: OFAC_URL, uk: national.uk.file, eu: national.eu.file, jp: national.jp.file },
  pages: { uk: UK_PAGE, eu: EU_PAGE, jp: JP_PAGE },
  un,
  ofac,
  national,
  targets,
};
writeFileSync(FILE, JSON.stringify(out, null, 1) + '\n');

const kinds = ofac.reduce<Record<string, number>>((n, e) => ((n[e.kind] = (n[e.kind] ?? 0) + 1), n), {});
console.log(`UN 1718: ${un.individuals.length} individuals, ${un.entities.length} entities (list generated ${un.generated})`);
console.log(`OFAC DPRK programs: ${ofac.length}`, kinds);
for (const [k, l] of Object.entries(national)) console.log(`${k}: ${l.entries.length} entries (published ${l.published}, fetched ${l.fetched})`);
const unT = targets.filter((t) => t.un);
for (const l of ['US', 'UK', 'EU', 'JP'] as ListKey[])
  console.log(`UN targets also on ${l}: ${unT.filter((t) => t.on[l]).length} confirmed, ${unT.filter((t) => !t.on[l] && t.maybe?.includes(l)).length} possible`);
const methods = Object.fromEntries(METHODS.map((m) => [m, targets.reduce((n, t) => n + Object.values(t.how).filter((h) => h === m).length, 0)]));
console.log('links by method', methods);
const solo = targets.filter((t) => !t.un && Object.keys(t.on).length === 1 && !t.maybe);
console.log(`targets ${targets.length}; not on the UN list ${targets.length - unT.length}; on one list only ${solo.length}`);
