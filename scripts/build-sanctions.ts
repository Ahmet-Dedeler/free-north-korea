// Builds data/sanctions.json for /sanctions from the two official lists, fetched live:
//   - UN Security Council consolidated list, 1718 Committee entries only (reference numbers KPi.* / KPe.*)
//   - US Treasury OFAC SDN list, entries under any DPRK program (DPRK, DPRK2, DPRK3, DPRK4, DPRK-NKSPEA)
// Nothing is typed in by hand: names, dates and reasons are exactly what the lists say. `fetched` records the day,
// and the page shows it next to the data so readers can tell how old it is.
//   node scripts/build-sanctions.ts
import { writeFileSync } from 'node:fs';

const UA = 'free-north-korea sanctions builder (+https://github.com/Ahmet-Dedeler/free-north-korea)';
const UN_URL = 'https://scsanctions.un.org/resources/xml/en/consolidated.xml';
const OFAC_URL = 'https://www.treasury.gov/ofac/downloads/sdn.csv';

const fetchText = async (url: string) => {
  const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(300_000) });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.text();
};

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

const [unXml, sdnCsv] = await Promise.all([fetchText(UN_URL), fetchText(OFAC_URL)]);

// ---------- UN 1718 ----------
const unescape = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const clean = (s: string) => unescape(s).replace(/\s+/g, ' ').trim();
const tag = (block: string, t: string) => clean(block.match(new RegExp(`<${t}>([^<]*)</${t}>`))?.[1] ?? '');
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s\-(/])([a-z])/g, (_, a, b) => a + b.toUpperCase());

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
const ofac: OfacEntry[] = parseCsv(sdnCsv)
  .filter((r) => r.length > 3 && /DPRK/.test(r[3]))
  .map((r) => {
    const kind = (val(r[2]) || 'entity') as OfacKind;
    // "KIM, Yong Chol" → "Kim Yong Chol" (family name first, as Korean names are written)
    const raw = val(r[1]);
    const [last, first] = raw.split(',').map((s) => s.trim());
    const name = kind === 'individual' && first ? `${titleCase(last)} ${first}` : titleCase(raw);
    const title = val(r[4]);
    return { id: val(r[0]), name, kind, programs: val(r[3]).split('] [').map((p) => p.trim()), ...(title && { title }) };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
if (ofac.length < 300) throw new Error('OFAC list looks truncated; refusing to overwrite');

const out = {
  _doc: 'Built by scripts/build-sanctions.ts from the live UN and OFAC lists. Do not edit by hand.',
  fetched: new Date().toISOString().slice(0, 10),
  sources: { un: UN_URL, ofac: OFAC_URL },
  un,
  ofac,
};
writeFileSync('data/sanctions.json', JSON.stringify(out, null, 1) + '\n');

const kinds = ofac.reduce<Record<string, number>>((n, e) => ((n[e.kind] = (n[e.kind] ?? 0) + 1), n), {});
console.log(`UN 1718: ${un.individuals.length} individuals, ${un.entities.length} entities (list generated ${un.generated})`);
console.log(`OFAC DPRK programs: ${ofac.length}`, kinds);
