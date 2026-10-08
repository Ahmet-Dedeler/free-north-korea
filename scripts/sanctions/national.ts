// Parsers for the national and regional sanctions lists shown on /sanctions next to the UN and US lists.
// Each one reads a government's own machine-readable file, keeps only its North Korea regime, and returns entries
// in one shape. Every parser checks its own result and throws if the list looks truncated, so build-sanctions.ts
// can keep last week's copy instead of publishing a half-empty list.
import { addressKey, attr, clean, dmy, fetchText, orgKey, parseCsv, passportNumbers, personKey, personName, swiftCodes, tag, tags, tidyName } from './lib.ts';

export type Kind = 'individual' | 'entity' | 'vessel' | 'aircraft';

/** One entry on a national list, as that list writes it. */
export interface ListEntry {
  /** The list's own identifier (UK "DPR0001", EU "EU.4071.70", Japan "015-000001"). */
  id: string;
  name: string;
  aliases: string[];
  kind: Kind;
  /** Day this government listed them. */
  listed: string;
  /** UN reference number, when the list cites one. */
  un?: string;
  /** The list itself says this listing carries out a UN Security Council designation. */
  unBasis?: boolean;
  /** Identifiers used only to match the same target across lists. */
  dob?: string[];
  passports?: string[];
  imo?: string[];
  swift?: string[];
  /** Street addresses of companies and ships, reduced to word sets (see addressKey in lib.ts). */
  addr?: string[];
}

export interface NationalList {
  /** Day we downloaded it. */
  fetched: string;
  /** The list's own date (generation or publication), when it gives one. */
  published: string | null;
  /** The file we read. */
  file: string;
  entries: ListEntry[];
}

const addrs = (list: string[]) => [...new Set(list.map(addressKey).filter(Boolean))];
const today = () => new Date().toISOString().slice(0, 10);
const opt = <T>(k: string, v: T[] | undefined) => (v && v.length ? { [k]: v } : {});
const byListed = (a: ListEntry, b: ListEntry) => a.listed.localeCompare(b.listed) || a.id.localeCompare(b.id);

function mustHave(list: string, entries: ListEntry[], min: Partial<Record<Kind, number>>) {
  for (const [k, n] of Object.entries(min)) {
    const got = entries.filter((e) => e.kind === k).length;
    if (got < n!) throw new Error(`${list}: only ${got} ${k} entries (expected at least ${n}); list looks truncated`);
  }
}

// ---------- UK: FCDO "UK Sanctions List" ----------
// Since 28 January 2026 the FCDO list is the only UK sanctions list (OFSI's Consolidated List closed). The XML holds
// every UK regime; we keep "The Democratic People's Republic of Korea (Sanctions) (EU Exit) Regulations 2019".
export const UK_URL = 'https://sanctionslist.fcdo.gov.uk/docs/UK-Sanctions-List.xml';
export const UK_PAGE = 'https://www.gov.uk/government/publications/the-uk-sanctions-list';

export async function uk(): Promise<NationalList> {
  const xml = await fetchText(UK_URL);
  const entries: ListEntry[] = [];
  for (const m of xml.matchAll(/<Designation>([\s\S]*?)<\/Designation>/g)) {
    const b = m[1];
    if (!/<RegimeName>[^<]*Democratic People(&apos;|')s Republic of Korea/.test(b)) continue;
    const kindRaw = tag(b, 'IndividualEntityShip');
    const kind: Kind = kindRaw === 'Individual' ? 'individual' : kindRaw === 'Ship' ? 'vessel' : 'entity';
    const names = [...b.matchAll(/<Name>([\s\S]*?)<\/Name>/g)].map((n) => {
      const parts = ['Name6', 'Name1', 'Name2', 'Name3', 'Name4', 'Name5'].map((t) => tag(n[1], t)).filter(Boolean);
      const name = parts.join(' ');
      return { name: kind === 'individual' ? personName(name) : tidyName(name), type: tag(n[1], 'NameType').toLowerCase() };
    });
    const primary = names.find((n) => n.type === 'primary name') ?? names[0];
    if (!primary) continue;
    const un = tag(b, 'UNReferenceNumber');
    const text = tag(b, 'OtherInformation');
    entries.push({
      id: tag(b, 'UniqueID'),
      name: primary.name,
      aliases: [...new Set(names.filter((n) => n !== primary).map((n) => n.name))].filter((n) => n !== primary.name).slice(0, 6),
      kind,
      listed: dmy(tag(b, 'DateDesignated')),
      ...(un && { un }),
      ...(tag(b, 'DesignationSource') === 'UN' && { unBasis: true }),
      ...opt('dob', tags(b, 'DOB').map(dmy).filter(Boolean)),
      ...opt('passports', passportNumbers(tags(b, 'PassportNumber').join(' '))),
      ...opt('imo', kind === 'vessel' ? tags(b, 'IMONumber').map((n) => n.replace(/\D/g, '')).filter((n) => n.length === 7) : []),
      ...opt('swift', swiftCodes(text)),
      ...opt('addr', kind === 'individual' ? [] : addrs([...b.matchAll(/<Address>([\s\S]*?)<\/Address>/g)].map((a) => ['AddressLine1', 'AddressLine2', 'AddressLine3', 'AddressLine4'].map((t) => tag(a[1], t)).join(' ')))),
    });
  }
  mustHave('UK', entries, { individual: 80, entity: 50, vessel: 10 });
  return { fetched: today(), published: dmy(tag(xml, 'DateGenerated')) || null, file: UK_URL, entries: entries.sort(byListed) };
}

// ---------- EU: Financial Sanctions Files (FSF) consolidated list ----------
// The European Commission's consolidated list of everyone under an EU asset freeze, as XML. We keep entries whose
// legal basis is the PRK programme (Council Regulation (EU) 2017/1509 and its amendments).
export const EU_URL = 'https://webgate.ec.europa.eu/fsd/fsf/public/files/xmlFullSanctionsList_1_1/content?token=dG9rZW4tMjAxNw';
export const EU_PAGE = 'https://data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions';

export async function eu(): Promise<NationalList> {
  const xml = await fetchText(EU_URL);
  const entries: ListEntry[] = [];
  for (const m of xml.matchAll(/<sanctionEntity ([^>]*)>([\s\S]*?)<\/sanctionEntity>/g)) {
    const [, head, b] = m;
    if (!/<regulation [^>]*programme="PRK"/.test(b)) continue;
    const kind: Kind = /<subjectType code="person"/.test(b) ? 'individual' : 'entity';
    const aliases = [...b.matchAll(/<nameAlias [^>]*>/g)].map((a) => {
      const first = attr(a[0], 'firstName');
      const last = attr(a[0], 'lastName');
      // family name first, as Korean names are written and as the UN and UK lists show them
      const name = kind === 'individual' && first && last ? [last, first, attr(a[0], 'middleName')].filter(Boolean).join(' ') : attr(a[0], 'wholeName');
      // nameLanguage says which language the name itself is in ("KO" for Hangul, "LT" for a Lithuanian translation)
      const english = ['', 'EN'].includes(attr(a[0], 'nameLanguage').toUpperCase()) && /^[\p{Script=Latin}\p{N}\p{P}\p{Zs}]+$/u.test(name);
      return { name: kind === 'individual' ? personName(name) : tidyName(name), strong: attr(a[0], 'strong') !== 'false', english };
    });
    const primary = aliases.find((a) => a.strong && a.english) ?? aliases.find((a) => a.english) ?? aliases[0];
    if (!primary) continue;
    const pubDates = [...b.matchAll(/publicationDate="(\d{4}-\d{2}-\d{2})"/g)].map((d) => d[1]).sort();
    const listed = attr(head, 'designationDate') || pubDates[0] || '';
    const ids = [...b.matchAll(/<identification [^>]*>/g)].map((i) => ({ type: attr(i[0], 'identificationTypeCode'), number: attr(i[0], 'number') }));
    const dob = [...b.matchAll(/<birthdate [^>]*>/g)].map((d) => attr(d[0], 'birthdate') || attr(d[0], 'year')).filter(Boolean);
    const remarks = [...b.matchAll(/<remark>([\s\S]*?)<\/remark>/g)].map((r) => clean(r[1])).join(' ');
    const un = attr(head, 'unitedNationId');
    entries.push({
      id: attr(head, 'euReferenceNumber') || attr(head, 'logicalId'),
      name: primary.name,
      aliases: [...new Set(aliases.filter((a) => a.english).map((a) => a.name))].filter((n) => n !== primary.name).slice(0, 6),
      kind,
      listed,
      ...(un && { un }),
      // "UNLI-<date>" in a remark is the EU's note of the UN listing date
      ...((un || /\bUNLI-/.test(remarks)) && { unBasis: true }),
      ...opt('dob', [...new Set(dob)]),
      ...opt('passports', passportNumbers(ids.filter((i) => i.type === 'passport').map((i) => i.number).join(' '))),
      ...opt('imo', ids.filter((i) => i.type === 'imo').map((i) => i.number.replace(/\D/g, '')).filter((n) => n.length === 7)),
      ...opt('swift', [...new Set(ids.filter((i) => i.type === 'swiftbic').map((i) => i.number.slice(0, 8)).concat(swiftCodes(remarks)))]),
      ...opt('addr', kind === 'individual' ? [] : addrs([...b.matchAll(/<address [^>]*>/g)].map((a) => attr(a[0], 'street')))),
    });
  }
  mustHave('EU', entries, { individual: 80, entity: 50 });
  const generated = xml.match(/<export [^>]*generationDate="(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
  return { fetched: today(), published: generated, file: EU_URL, entries: entries.sort(byListed) };
}

// ---------- Japan: Ministry of Finance list of asset-freeze targets ----------
// MOF publishes everyone under a Japanese asset freeze as one CSV (資産凍結等対象者一覧), renamed with each update,
// so we read its current name from the list page. 区分 (category) numbers 13 to 17 are the North Korea measures:
//   13  UNSCR 1695 (missile and WMD programmes)            14/15  UNSCR 1718 and later: entities / individuals
//   16/17  Japan's own measures in step with the US and EU: entities / individuals
// Categories 13 to 15 carry out UN designations; 16 and 17 are Japan's own.
export const JP_PAGE = 'https://www.mof.go.jp/policy/international_policy/gaitame_kawase/gaitame/economic_sanctions/list.html';
const JP_UN = new Set(['13', '14', '15']);
const JP_ALL = new Set(['13', '14', '15', '16', '17']);
/** One known entry per category: if MOF renumbers its categories, the build fails instead of mislabelling them. */
const JP_CANARY: Record<string, string> = {
  '14': 'korea mining development trading corporation',
  '15': 'yun ho jin',
  '16': 'foreign trade bank',
  '17': 'paek se bong',
};

const jpDate = (s: string) => {
  const m = s.match(/(\d{4})[./](\d{1,2})[./](\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : (s.match(/(\d{4})年/)?.[1] ?? '');
};

export async function jp(): Promise<NationalList> {
  const page = await fetchText(JP_PAGE);
  const href = page.match(/href="\.\/(shisantouketsu(\d{8})\.csv)"/);
  if (!href) throw new Error('Japan: no CSV link on the MOF list page');
  const file = new URL(href[1], JP_PAGE).href;
  const rows = parseCsv((await fetchText(file)).replace(/^﻿/, ''));
  const head = rows[0];
  const col = (name: string) => {
    const i = head.indexOf(name);
    if (i < 0) throw new Error(`Japan: CSV has no column ${name}`);
    return i;
  };
  const C = {
    cat: col('区分'), no: col('番号'), date: col('告示日付'), kind: col('個人・団体'), name: col('氏名（英語）'), alias: col('別名・別称（英語）'),
    former: col('旧称（英語）'), addr: col('住所・所在地（都市その他の情報）（英語）'), dob: col('生年月日'), passport: col('旅券番号'), un: col('国連参照番号'), other: col('その他の情報'),
  };
  const entries: ListEntry[] = [];
  const seen = new Map<string, ListEntry>();
  for (const r of rows.slice(1)) {
    if (!JP_ALL.has(r[C.cat])) continue;
    const kind: Kind = r[C.kind] === '個人' ? 'individual' : 'entity';
    const name = tidyName(r[C.name]);
    if (!name) continue;
    const dob = r[C.dob].split(/[;；]/).map(jpDate).filter(Boolean);
    const e: ListEntry = {
      id: r[C.no],
      name,
      aliases: [...new Set([r[C.alias], r[C.former]].flatMap((s) => s.split(/[;；]/)).map((s) => tidyName(s)).filter(Boolean))].slice(0, 6),
      kind,
      listed: jpDate(r[C.date].split(/\s/)[0]),
      ...(r[C.un] && { un: r[C.un].trim() }),
      ...(JP_UN.has(r[C.cat]) && { unBasis: true }),
      ...opt('dob', dob),
      ...opt('passports', passportNumbers(r[C.passport])),
      ...opt('swift', swiftCodes(r[C.other])),
      ...opt('addr', kind === 'individual' ? [] : addrs(r[C.addr].split(/[;；]/))),
    };
    // Some entities sit in two categories (UNSCR 1695 and 1718); MOF lists them twice, we count them once.
    const key = `${kind} ${kind === 'individual' ? personKey(name) : orgKey(name)} ${dob.join()}`;
    const prev = seen.get(key);
    if (prev) {
      if (e.unBasis) prev.unBasis = true;
      continue;
    }
    seen.set(key, e);
    entries.push(e);
  }
  for (const [cat, key] of Object.entries(JP_CANARY)) {
    const hit = rows.some((r) => r[C.cat] === cat && (cat === '15' || cat === '17' ? personKey(r[C.name]) === personKey(key) : orgKey(r[C.name]) === key));
    if (!hit) throw new Error(`Japan: category ${cat} no longer holds "${key}"; MOF may have renumbered its categories`);
  }
  mustHave('Japan', entries, { individual: 100, entity: 100 });
  const d = href[2];
  return { fetched: today(), published: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, file, entries: entries.sort(byListed) };
}
