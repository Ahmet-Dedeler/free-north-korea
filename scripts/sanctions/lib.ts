// Shared helpers for scripts/build-sanctions.ts and the per-list parsers in scripts/sanctions/.
// No dependencies: the official files are XML and CSV, and the regex readers below are enough for them.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const UA = 'free-north-korea sanctions builder (+https://github.com/Ahmet-Dedeler/free-north-korea)';

/**
 * Downloads a file as text. Set SANCTIONS_CACHE=<dir> to keep the downloads on disk and reuse them on the next run
 * (handy while working on the parsers; the weekly Action never sets it, so it always reads the live files).
 */
export async function fetchText(url: string): Promise<string> {
  const cache = process.env.SANCTIONS_CACHE;
  const file = cache ? `${cache}/${url.replace(/[^a-z0-9.]+/gi, '_').slice(-120)}` : '';
  if (file && existsSync(file)) return readFileSync(file, 'utf8');
  const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(300_000) });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const text = await res.text();
  if (file) {
    mkdirSync(cache!, { recursive: true });
    writeFileSync(file, text);
  }
  return text;
}

export function parseCsv(text: string): string[][] {
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

export const unescapeXml = (s: string) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, '&');
export const clean = (s: string) => unescapeXml(s).replace(/\s+/g, ' ').trim();
/** Text of the first <t>…</t> in a block. */
export const tag = (block: string, t: string) => clean(block.match(new RegExp(`<${t}>([^<]*)</${t}>`))?.[1] ?? '');
/** Text of every <t>…</t> in a block. */
export const tags = (block: string, t: string) => [...block.matchAll(new RegExp(`<${t}>([^<]*)</${t}>`, 'g'))].map((m) => clean(m[1])).filter(Boolean);
/** Value of an attribute inside one start tag. */
export const attr = (startTag: string, a: string) => unescapeXml(startTag.match(new RegExp(`(?:^|\\s)${a}="([^"]*)"`))?.[1] ?? '');

export const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s\-(/])([a-z])/g, (_, a, b) => a + b.toUpperCase());
/** Title-case a name only when the list wrote it all in capitals. */
export const tidyName = (s: string) => (s === s.toUpperCase() && /[A-Z]/.test(s) ? titleCase(s) : s).replace(/\s+/g, ' ').trim();
/** People's names: also "CHOE Chan Il" (family name in capitals, as the EU writes it) → "Choe Chan Il". */
export const personName = (s: string) => tidyName(s.replace(/\b[A-Z]{2,}\b/g, (w) => titleCase(w)));

const MONTHS: Record<string, string> = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
const pad = (n: string) => n.padStart(2, '0');

/** "14/03/1970" → "1970-03-14", "dd/mm/1970" → "1970". */
export function dmy(s: string): string {
  const m = s.trim().match(/^(\d{1,2}|dd)\/(\d{1,2}|mm)\/(\d{4})$/i);
  if (!m) return '';
  return /\d/.test(m[1]) && /\d/.test(m[2]) ? `${m[3]}-${pad(m[2])}-${pad(m[1])}` : m[3];
}

/** Every date of birth in OFAC remark text: "DOB 28 Sep 1937" → "1937-09-28", "DOB circa 1947" → "1947". */
export function ofacDobs(remarks: string): string[] {
  const out: string[] = [];
  for (const m of remarks.matchAll(/DOB ([^;]+)/g)) {
    const d = m[1].match(/(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})/);
    if (d && MONTHS[d[2].toLowerCase()]) out.push(`${d[3]}-${MONTHS[d[2].toLowerCase()]}-${pad(d[1])}`);
    else if (/^(circa )?\d{4}$/.test(m[1].trim())) out.push(m[1].trim().slice(-4));
  }
  return out;
}

/** Passport numbers reduced to their digits ("PS472220097" and "472220097" are the same document). */
export const passportNumbers = (text: string) => [...new Set([...text.matchAll(/\b[A-Z]{0,2}(\d{7,10})\b/g)].map((m) => m[1]))];
/** SWIFT/BIC codes, cut to the 8-character institution code. */
export const swiftCodes = (text: string) => [...new Set([...text.matchAll(/SWIFT(?:\s*\/\s*BIC)?(?:\s*(?:code|:))*\s*([A-Z]{6}[A-Z0-9]{2})/g)].map((m) => m[1]))];

/**
 * Name key for comparing people across lists: lower case, accents and punctuation dropped, split into syllables and
 * sorted, so "Ri Je-Son", "RI Je Son" and "Je Son Ri" (given name first) all give the same key.
 */
export const personKey = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’'`.,()]/g, '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .sort()
    .join(' ');
/** Name key for companies, agencies and ships: same clean-up, word order kept, a trailing "(KKBC)" dropped. */
export const orgKey = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
/** Looser company key: also drops words like "corporation", "company" and "limited". Only used to check that a
 * cited UN number belongs to the entry citing it, never to match on its own. */
export const orgCore = (s: string) =>
  orgKey(s)
    .split(' ')
    .filter((w) => !/^(the|of|and|co|corp|corporation|company|ltd|limited|inc|llc|group|general|jv|joint|venture)$/.test(w))
    .join(' ');

/** Street address reduced to a sorted set of words, so "Saemul 1-Dong" and "1 Saemul - Dong" agree. Empty if too vague. */
export function addressKey(s: string): string {
  const words = [...new Set(orgKey(s).split(' ').filter(Boolean))].sort();
  const key = words.join(' ');
  return words.length >= 2 && key.length >= 10 ? key : '';
}
