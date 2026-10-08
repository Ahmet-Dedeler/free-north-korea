// Builds data/launch-reports.json: Japan's Ministry of Defense (MOD, 防衛省) reports on North Korean missile launches,
// read from the ministry's own PDFs. Part of the event wire (see AGENTS.md).
//   node scripts/build-launch-reports.ts              # daily: RSS + press index + the last 3 days
//   node scripts/build-launch-reports.ts --backfill   # once: also every launch day in public/data/test.en.json since 2020
//   node scripts/build-launch-reports.ts --reparse    # read the PDFs already in the file again after a parser change
//
// How the MOD site works (checked Oct 2026):
// - Each launch gets a run of press items titled 北朝鮮のミサイル等関連情報: 速報 (flash), ミサイル落下推定情報 (estimated
//   impact) and 続報 (follow-up, the one with numbers). Only the 続報 has a printable PDF next to it
//   (/j/press/news/YYYY/MM/DDx.pdf). The HTML pages and the per-year indexes sit behind a Cloudflare bot check, so
//   we read the PDFs, which are served directly.
// - /j/press/news/index.html (current calendar year) and /j/rss/news.xml (about six weeks) load without the check,
//   but both can lag the PDFs by a few days (the 2026-10-03 report reached the RSS two days later). So we also
//   try the PDF names for the last three days in Japan (letters a-l), which finds a report within hours.
// - PDFs from 2021 on are still online; 2019 and earlier are gone (404). Before 2026 we only find a report if the
//   launch is in the CNS dataset (--backfill tries those days), so older MOD-only reports can be missing.
//
// Every number is MOD's own estimate as printed (约/約 "about"). Nothing is inferred: a field MOD didn't state is null.
// Reports already in the file are kept even when they drop off the RSS and the index.
// The file is rewritten only when a report was added or the last write is over 7 days old.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const OUT = 'data/launch-reports.json';
const BASE = 'https://www.mod.go.jp';
const UA = 'free-north-korea event wire (+https://github.com/Ahmet-Dedeler/free-north-korea)';
const LETTERS = 'abcdefghijkl'.split('');
const BACKFILL = process.argv.includes('--backfill');
/** --reparse: read every PDF already in the file again (after a parser change). */
const REPARSE = process.argv.includes('--reparse');

/** 'satellite' is MOD's 衛星打ち上げを目的とする弾道ミサイル技術を使用した発射 (a satellite launch using ballistic missile technology). */
type Weapon = 'icbm-class' | 'ballistic' | 'possible-ballistic' | 'satellite' | 'other';
/** Where MOD says it came down. 'near-east-coast' is MOD's 朝鮮半島東岸付近 / 北朝鮮東岸付近 ("near the east coast"). */
type Landing = 'sea-of-japan' | 'yellow-sea' | 'pacific' | 'near-east-coast' | null;
/** 'none-seen' is MOD's "no flight into Japan's territory or EEZ has been confirmed" (飛来は確認されておらず). */
type Eez = 'inside' | 'outside' | 'none-seen' | null;
type Bound = 'over' | 'at least' | null;

interface Report {
  /** "2026-10-03d": the PDF's date and letter. */
  id: string;
  /** The PDF (MOD's printable version of the press release). */
  url: string;
  /** The same release as a web page (behind a bot check, but readable in a browser). */
  htmlUrl: string;
  /** Date printed at the top of the release, in Japan. */
  published: string;
  /** Launch time(s) MOD gives, Japan time (UTC+9): "HH:MM", or "HH" when MOD only gives the hour (6時台). */
  timesJst: string[];
  /** First launch time as ISO with offset, Japan time, and the same moment in UTC. */
  launchJst: string;
  launchUtc: string;
  /** How exact launchJst is: MOD gives minutes, an hour (6時台), or only the day. */
  precision: 'minute' | 'hour' | 'day';
  /** How many missiles, as MOD states it. null when it doesn't give a number. */
  count: number | null;
  /** "at least" (少なくとも), "total" (合計), "multiple" (複数, no number) or "exact". */
  countNote: 'at least' | 'total' | 'multiple' | 'exact' | null;
  weapon: Weapon;
  /** Estimated distance flown, km, in the order MOD lists them. */
  rangeKm: number[];
  /** Set when MOD gives a lower bound instead of "about": 'over' (を超えて) or 'at least' (少なくとも, 以上). */
  rangeBound: Bound;
  /** Estimated highest altitude, km. */
  apogeeKm: number[];
  apogeeBound: Bound;
  /** Flight time in minutes, when MOD gives it (ICBM-class launches). */
  flightMinutes: number | null;
  landing: Landing;
  eez: Eez;
  /** MOD's own words (Japanese) for launch area, landing and direction, so nothing is lost in our fields. */
  areaJa: string | null;
  landingJa: string | null;
  directionJa: string | null;
  /** Paragraph 1 of the release, verbatim apart from whitespace. */
  textJa: string;
  /** Day we downloaded it (UTC). */
  fetched: string;
}

const today = new Date().toISOString().slice(0, 10);

async function get(url: string): Promise<Response | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(60_000) });
      if (res.status === 404) return null;
      if (res.ok) return res;
      if (res.status === 403) return null; // bot check: nothing we can read
    } catch {
      // network hiccup: retry
    }
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  return null;
}

const work = mkdtempSync(join(tmpdir(), 'mod-'));
function pdfText(buf: ArrayBuffer): string {
  const file = join(work, 'r.pdf');
  writeFileSync(file, Buffer.from(buf));
  return execFileSync('pdftotext', ['-enc', 'UTF-8', file, '-'], { encoding: 'utf8' });
}

const num = (s: string) => Number(s.replace(/,/g, ''));
const pad = (n: number | string) => String(n).padStart(2, '0');

/** Reads one MOD release. Returns null when it is not a launch report (most PDFs on the site aren't). */
function parse(id: string, raw: string): Omit<Report, 'url' | 'htmlUrl' | 'fetched'> | null {
  // NFKC turns full-width digits, letters and brackets into ASCII; Japanese text needs no spaces, so drop them.
  // Circled numbers (①②) mark one missile each; NFKC would turn ① into a bare "1" and glue it to the next time.
  const flat = raw
    .replace(/[\u2460-\u2473]/g, (c) => `[${c.charCodeAt(0) - 0x245f}]`)
    .normalize('NFKC')
    .replace(/\s+/g, '');
  const head = flat.match(/令和(\d+|元)年(\d+)月(\d+)日/);
  if (!head) return null;
  const year = 2018 + (head[1] === '元' ? 1 : Number(head[1]));
  const published = `${year}-${pad(head[2])}-${pad(head[3])}`;
  // paragraph 1, from "1." to "2." (the rest is the government's response, not the launch)
  const p1 = flat.match(/(?<![\d,])1\.(?!\d)(.*?)(?:(?<![\d,])2\.(?!\d)|$)/)?.[1];
  if (!p1 || !/北朝鮮/.test(p1) || !/発射/.test(p1) || !/ミサイル/.test(p1)) return null;
  if (/ことを受け/.test(p1)) return null; // "after North Korea launched..., the SDF sent aircraft": not a launch report
  // A time is a launch time when 発射 (launch) follows it in the same sentence with no 落下 (impact) in between:
  // "11時23分頃、...に落下" is an impact time. "6時台" / "10時頃" only give the hour.
  const times: string[] = [];
  for (const sentence of p1.split(/(?<=。)/)) {
    // "7時10分から14分頃にかけて" (a window) counts as its start
    for (const m of sentence.matchAll(/(\d{1,2})時(?:(\d{1,2})分(?:頃|から)|台|頃)/g)) {
      const rest = sentence.slice(m.index! + m[0].length);
      const at = rest.search(/発射/);
      if (at >= 0 && !/落下/.test(rest.slice(0, at))) times.push(m[2] ? `${pad(m[1])}:${pad(m[2])}` : pad(m[1]));
    }
  }
  // "7時台から8時台" plus itemised minutes: keep the minutes, unless the window starts in an hour before the first
  // exact time ("8時台から9時台", then only "9時20分頃" given): then the launch is only known to the hour.
  const exact = times.filter((t) => t.includes(':'));
  const hours = times.filter((t) => !t.includes(':'));
  const earlyHour = exact.length && hours.length && hours.some((h) => h < exact[0].slice(0, 2)) ? hours.sort()[0] : null;
  const launchTimes = earlyHour ? [earlyHour, ...exact] : exact.length ? exact : times;
  // The launch day: the release date, unless MOD says 昨日 (yesterday) or names the day ("12月17日22時37分頃",
  // "27日22時43分頃") in the first sentence because the launch was late the night before.
  const firstSentence = p1.split('。')[0];
  const named = firstSentence.match(/(?:(\d{1,2})月)?(\d{1,2})日(?=\d{1,2}時)/);
  let day = published;
  if (named) {
    const [y, m] = [Number(published.slice(0, 4)), named[1] ? Number(named[1]) : Number(published.slice(5, 7))];
    const d = Number(named[2]);
    // a day after the release date can only be last month (or last year)
    const date = new Date(Date.UTC(y, m - 1, d));
    if (date.toISOString().slice(0, 10) > published) date.setUTCMonth(date.getUTCMonth() - 1);
    day = date.toISOString().slice(0, 10);
  } else if (/昨日/.test(firstSentence)) day = new Date(Date.parse(published + 'T00:00:00Z') - 86_400_000).toISOString().slice(0, 10);
  const first = launchTimes[0];
  const precision = !first ? 'day' : first.includes(':') ? 'minute' : 'hour';
  const launchJst = `${day}T${!first ? '00:00' : first.includes(':') ? first : `${first}:00`}:00+09:00`;

  const area =
    [...('、' + p1).matchAll(/[、]([^、。]{2,30}?)から/g)].map((m) => m[1].replace(/^(北朝鮮[はが]|本日|昨日)/, '')).find((a) => !/時/.test(a) && /付近|近郊|内陸|岸|北朝鮮|平壌|地域|一帯/.test(a)) ?? null;
  const countM = p1.match(/(少なくとも|合計)?(\d+)発|(複数)(?:発|の)/);
  const count = countM?.[2] ? Number(countM[2]) : null;
  const countNote = !countM ? null : countM[3] ? 'multiple' : countM[1] === '少なくとも' ? 'at least' : countM[1] === '合計' ? 'total' : 'exact';
  const weapon: Weapon = /衛星/.test(p1)
    ? 'satellite'
    : /ICBM級/.test(p1) ? 'icbm-class' : /弾道ミサイルの可能性/.test(p1) ? 'possible-ballistic' : /弾道ミサイル/.test(p1) ? 'ballistic' : 'other';

  const apogees = [...p1.matchAll(/最高高度(?:は)?約?([\d,]+)km(?:程度)?(以上|を超え)?/g)];
  const apogeeKm = apogees.map((m) => num(m[1]));
  const ranges = [...p1.matchAll(/飛翔距離は約?([\d,]+)km|(少なくとも)?約([\d,]+)km(?:程度)?(を超えて)?(?:を)?飛翔/g)];
  const rangeKm = ranges.map((m) => num(m[1] ?? m[3]));
  const flight = p1.match(/約(\d+)分(?:間)?飛翔/);
  const landingJa =
    p1.match(/落下したのは、?(.+?)(?:であると|と)推定/)?.[1] ??
    p1.match(/([^、。]+?)に落下した(?:もの)?(?:と|であると)推定/)?.[1]?.replace(/^.*?ミサイルは、?/, '') ??
    null;
  const landingText = landingJa ?? p1;
  const eez: Eez = /(EEZ\)?|経済水域)内/.test(landingText)
    ? 'inside'
    : /(EEZ\)?|経済水域)外/.test(landingText)
      ? 'outside'
      : /飛来は確認されて(?:おらず|いません)/.test(p1)
        ? 'none-seen'
        : null;
  const landing: Landing = /日本海/.test(landingText)
    ? 'sea-of-japan'
    : /黄海/.test(landingText)
      ? 'yellow-sea'
      : /太平洋/.test(landingText)
        ? 'pacific'
        : /(朝鮮半島|北朝鮮)東岸付近/.test(landingText)
          ? 'near-east-coast'
          : null;
  const directionJa = p1.match(/([東西南北]{1,3})方向/)?.[1] ?? null;
  // paragraph 1 as printed (full-width characters kept), with line breaks and layout spaces removed
  const textJa = (raw.match(/[1１][.．]\s*([\s\S]*?)(?:\n\s*[2２][.．]|$)/)?.[1] ?? p1).replace(/\s+/g, '');

  return {
    id,
    published,
    timesJst: launchTimes,
    launchJst,
    launchUtc: new Date(launchJst).toISOString().replace(/\.\d+Z$/, 'Z'),
    precision,
    count,
    countNote,
    weapon,
    rangeKm,
    rangeBound: ranges.some((m) => m[4]) ? 'over' : ranges.some((m) => m[2]) ? 'at least' : null,
    apogeeKm,
    apogeeBound: apogees.some((m) => m[2] === 'を超え') ? 'over' : apogees.some((m) => m[2] === '以上') ? 'at least' : null,
    flightMinutes: flight ? Number(flight[1]) : null,
    landing,
    eez,
    areaJa: area,
    landingJa,
    directionJa,
    textJa,
  };
}

const previous = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, 'utf8')) as { fetched: string; reports: Report[] }) : null;
const reports = new Map<string, Report>((previous?.reports ?? []).map((r) => [r.id, r]));
const tried = new Set<string>(REPARSE ? [] : reports.keys());

/** "2026/10/03d" → reads that PDF and stores it when it is a launch report. */
async function consider(path: string) {
  const id = path.replace(/\//g, '-');
  if (tried.has(id)) return;
  tried.add(id);
  const url = `${BASE}/j/press/news/${path}.pdf`;
  const res = await get(url);
  if (!res || !/pdf/.test(res.headers.get('content-type') ?? '')) return;
  const parsed = parse(id, pdfText(await res.arrayBuffer()));
  if (!parsed) return;
  reports.set(id, { ...parsed, url, htmlUrl: `${BASE}/j/press/news/${path}.html`, fetched: reports.get(id)?.fetched ?? today });
  console.log(`  + ${id}: ${parsed.launchJst} ${parsed.count ?? '?'}x ${parsed.weapon} range ${parsed.rangeKm.join('/') || '-'} km apogee ${parsed.apogeeKm.join('/') || '-'} km`);
}

const TITLE = /北朝鮮のミサイル/;
const paths = new Set<string>();

// 1. RSS (about six weeks)
const rss = await get(`${BASE}/j/rss/news.xml`);
if (rss) {
  for (const item of (await rss.text()).matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = item[1].match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
    const link = item[1].match(/<link>\s*\/j\/press\/news\/(\d{4}\/\d{2}\/\d{2}[a-z])\.(?:html|pdf)\s*<\/link>/)?.[1];
    if (link && TITLE.test(title) && /続報/.test(title)) paths.add(link);
  }
} else console.warn('RSS did not load');

// 2. Press index (current calendar year): 続報 items with a PDF next to them
const index = await get(`${BASE}/j/press/news/index.html`);
if (index) {
  for (const item of (await index.text()).matchAll(/<div class="news__item">([\s\S]*?)<\/div>/g)) {
    if (!TITLE.test(item[1]) || !/続報/.test(item[1])) continue;
    for (const m of item[1].matchAll(/\/j\/press\/news\/(\d{4}\/\d{2}\/\d{2}[a-z])\.pdf/g)) paths.add(m[1]);
  }
} else console.warn('press index did not load');

// 3. The last three days in Japan, every letter: catches reports the RSS and index haven't listed yet
const days = new Set<string>();
for (let back = 0; back < 3; back++) days.add(new Date(Date.now() + 9 * 3_600_000 - back * 86_400_000).toISOString().slice(0, 10));

// 4. --backfill: launch days in the CNS dataset (its dates are UTC, so also the next day in Japan)
if (BACKFILL) {
  const tests = (JSON.parse(readFileSync('public/data/test.en.json', 'utf8')) as { timeBins: { data: { date: string }[] }[] }).timeBins.flatMap((b) => b.data);
  for (const { date } of tests) {
    if (date < '2020-01-01') continue;
    days.add(date);
    days.add(new Date(Date.parse(date + 'T00:00:00Z') + 86_400_000).toISOString().slice(0, 10));
  }
}
for (const day of days) for (const l of LETTERS) paths.add(`${day.replace(/-/g, '/')}${l}`);

if (REPARSE) for (const id of reports.keys()) paths.add(id.replace(/^(\d{4})-(\d{2})-/, '$1/$2/'));
console.log(`launch reports: ${reports.size} known, checking ${paths.size} PDF names`);
for (const path of [...paths].sort()) await consider(path);
rmSync(work, { recursive: true, force: true });

const list = [...reports.values()].sort((a, b) => b.launchUtc.localeCompare(a.launchUtc) || b.id.localeCompare(a.id));
if (!list.length) throw new Error('no reports at all; MOD site layout may have changed');
const added = list.length - (previous?.reports.length ?? 0);
const ageDays = previous ? (Date.now() - new Date(previous.fetched).getTime()) / 86_400_000 : Infinity;
if (added === 0 && ageDays < 7 && !REPARSE) {
  console.log(`launch reports: ${list.length}, nothing new since ${previous!.fetched}`);
} else {
  const out = {
    fetched: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    source: {
      name: '北朝鮮のミサイル等関連情報 (Ministry of Defense of Japan)',
      publisher: 'Ministry of Defense of Japan (防衛省)',
      url: `${BASE}/j/press/news/index.html`,
    },
    reports: list,
  };
  writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log(`launch reports: wrote ${list.length} (${added} new)`);
}
