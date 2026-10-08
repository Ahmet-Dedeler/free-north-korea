// Fixed-rule parser for KCNA reports on Kim Jong Un (used by scripts/build-kimwatch.ts). No model involved: KCNA
// writes these reports from a small set of formulas ("Kim Jong Un ... inspected X on May 7", "He was accompanied by
// A, B and C", "Present there were ..."), so plain patterns read them reliably. Every rule below was checked against
// the full year of reports in data/raw/kcna/.
import type { Article, ListItem } from './kcna.ts';
import { KCNA } from './kcna.ts';

export type Kind = 'military' | 'economy' | 'party' | 'diplomacy' | 'commemoration' | 'public' | 'message' | 'none';

export interface KimRecord {
  /** KCNA article id (the hash in the URL). */
  id: string;
  url: string;
  /** Day KCNA published the report, YYYY-MM-DD (Pyongyang time). */
  reportDate: string;
  title: string;
  /** KCNA's Korean headline for the same report, when the Korean edition listed it. */
  titleKo?: string;
  /** Day the event happened. From the text when it gives one, else see eventDateFrom. */
  eventDate: string;
  /** Last day, for reports that cover several days ("from September 16 to 18"). */
  eventDateEnd?: string;
  /** 'text': the report names the day. 'same-day': taken from another report published the same day about him. 'report': not stated, publication date used. */
  eventDateFrom: 'text' | 'same-day' | 'report';
  /** The report says he was there in person. False for reports about events he wasn't described at (a test KCNA credits to the Missile Administration, a letter he sent). */
  appearance: boolean;
  kind: Kind;
  /** He followed it on a screen ("observed the test-fire on TV"). Not counted as an appearance. */
  remote?: boolean;
  /** The report is the text of a speech he gave. */
  speech: boolean;
  /** What the headline says he did or where, with the honorific prefix removed. As KCNA wrote it. */
  subject: string;
  /** Province or special city, when the report names a place we can place. As KCNA spells it. */
  region?: string;
  /** People KCNA names as accompanying him. */
  companions: string[];
  /** People KCNA names as present or greeting him at the event (not travelling with him). */
  present: string[];
  /** The text mentions his daughter. KCNA usually shows her in photos without a word in the text. */
  daughter: boolean;
  /** The text mentions his wife, Ri Sol Ju. */
  wife: boolean;
}

export interface KimMessage {
  id: string;
  url: string;
  date: string;
  title: string;
  /** received: letters, greetings, flower baskets sent to him. sent: messages, wreaths, gifts he sent. */
  direction: 'received' | 'sent';
}

export interface KimWatchData {
  /** Day the KCNA listings were last fetched. */
  fetched: string;
  /** Oldest item KCNA's own listings still showed on that day. */
  oldestListed?: string;
  /** First and last report in the data. */
  coverage: { from: string; to: string };
  lastAppearance?: { date: string; id: string; title: string };
  records: KimRecord[];
  messages: KimMessage[];
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_RE = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan\\.|Feb\\.|Mar\\.|Apr\\.|Jun\\.|Jul\\.|Aug\\.|Sept?\\.|Oct\\.|Nov\\.|Dec\\.)';
const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const articleUrl = (id: string) => `${KCNA}/en/article/detail/${id}`;
const addDays = (iso: string, n: number) => new Date(Date.parse(iso + 'T00:00:00Z') + n * 86_400_000).toISOString().slice(0, 10);
const dayDiff = (a: string, b: string) => Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000);

/** Splits on sentence ends but not inside "C.C., WPK" or "Oct. 9" (next character must be a capital or a quote). */
const sentences = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-Z"“'‘])/);

/** "Pyongyang, October 10 (KCNA) -- " opens every report; it names the newsroom, not the event. */
const stripDateline = (p: string) => p.replace(/^[A-Z][\w\s,.'-]*?\(KCNA\)\s*--\s*/, '');

const monthIndex = (m: string) => MONTHS.indexOf(m.slice(0, 3).toLowerCase());

/** Builds a date in the report's year, stepping back a year when the month is after the report's month (a Dec 28 event in a Jan 2 report). */
function dateIn(report: string, month: number, day: number) {
  let y = +report.slice(0, 4);
  if (month + 1 > +report.slice(5, 7)) y--;
  return `${y}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Event day as the text gives it. Looks in the first two paragraphs, then (for reports that open with a long tribute)
 * in the narration up to paragraph ten, stopping where a quoted speech starts. Rejects any day after the report or more
 * than two weeks before it, so history mentioned in passing never counts.
 */
export function eventDates(reportDate: string, paragraphs: string[]): { start: string; end?: string } | null {
  const plain = paragraphs.map(stripDateline);
  const speechAt = plain.findIndex((p) => /full text of (?:his|the) speech|^Comrades,|^Dear comrade/i.test(p));
  const later = plain.slice(2, speechAt >= 2 ? Math.min(speechAt, 10) : 10);
  return datesIn(reportDate, plain.slice(0, 2).join(' ')) ?? (later.length ? datesIn(reportDate, later.join(' ')) : null);
}

function datesIn(reportDate: string, text: string): { start: string; end?: string } | null {
  const ok = (d: string) => dayDiff(reportDate, d) >= 0 && dayDiff(reportDate, d) <= 14;

  // "from September 16 to 18", "from Dec. 9 to 11", "from June 20 to 22"
  const range = text.match(new RegExp(`from ${MONTH_RE} (\\d{1,2}) to (?:${MONTH_RE} )?(\\d{1,2})\\b`));
  if (range) {
    const m1 = monthIndex(range[1]);
    const m2 = range[3] ? monthIndex(range[3]) : m1;
    const start = dateIn(reportDate, m1, +range[2]);
    const end = dateIn(reportDate, m2, +range[4]);
    if (ok(start) && ok(end) && end >= start) return { start, end };
  }
  // "on October 12", "on Oct. 9", "on the evening of June 8", "At dawn of October 3", "on March 3 and 4"
  const on = text.match(new RegExp(`\\b(?:on|of) (?:the (?:morning|afternoon|evening|night) of )?${MONTH_RE} (\\d{1,2})(?: and (\\d{1,2}))?\\b`));
  if (on) {
    const m = monthIndex(on[1]);
    const start = dateIn(reportDate, m, +on[2]);
    const end = on[3] ? dateIn(reportDate, m, +on[3]) : undefined;
    if (ok(start)) return end && ok(end) && end > start ? { start, end } : { start };
  }
  // "Friday met", "on Tuesday": the latest such weekday on or before the report date
  const wd = text.match(/\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/);
  if (wd) {
    const target = WEEKDAYS.indexOf(wd[1].toLowerCase());
    for (let back = 0; back < 7; back++) {
      const d = addDays(reportDate, -back);
      if (new Date(d + 'T00:00:00Z').getUTCDay() === target) return { start: d };
    }
  }
  return null;
}

// ---------- presence ----------

/** Verbs KCNA uses when he is somewhere in person. "sent", "received a letter" and "under the guidance of" are not here on purpose. */
const PRESENCE =
  /\b(visited|inspected|oversaw|overseeing|supervised|observed|watched|enjoyed|attended|met|had talks|held talks|hosted|guided|gave (?:field|on-site) guidance|gave on the spot guidance|(?:made|delivered|continued|started) (?:his |an? )?(?:[\w-]+ ){0,3}(?:speech|address|report|conclusion)|gave an assessment|appeared|arrived|planted|voted|convened|presided|went (?:around|round)|learned|acquainted himself|had (?:a )?photos?(?: session)?|toured|looked round|took the (?:tribune|platform)|paid (?:a |high )?(?:congratulatory |condolatory )?(?:visit|tribute)|paid silent tribute|congratulated|awarded|conferred|saw off|welcomed|greeted|came out|came to|was present|went to|sat together|dug|cut the tape|reviewed)\b/;

/** Watching on a screen is reported too ("observed the test-fire on TV"). That is not being there. */
const REMOTE = /\b(?:on TV|on television|by video|via video|video link|through a monitor)\b/i;

/** A sentence that has him (by name or "He") doing something in person. */
function presentInText(paragraphs: string[]): boolean {
  for (const s of sentences(paragraphs.map(stripDateline).join(' '))) {
    const i = s.search(/Kim Jong Un\b|^He\b|^Comrade General Secretary\b/);
    if (i < 0) continue;
    // ignore "at the invitation of Comrade Kim Jong Un" and "under the leadership of Kim Jong Un"
    const head = s.slice(Math.max(0, i - 40), i);
    if (/(invitation|leadership|guidance|care|letter|message|name) of (?:the )?(?:respected )?(?:Comrade )?$/i.test(head)) continue;
    if (PRESENCE.test(s.slice(i))) return true;
  }
  return false;
}

// ---------- kind ----------

const KIND_RULES: [Kind, RegExp][] = [
  ['diplomacy', /\b(talks|premier|president of (?!state affairs)|foreign minister|\bFM\b|delegation|embassy|ambassador|Xi Jinping|Putin|Lukashenko|To Lam|Medvedev|State Duma|Russian|Chinese|Vietnam|Belarus|Lao|banquet in welcome|luncheon|state visit)/i],
  // shows, sport and photo sessions before "military": a football match between two arms agencies is still a match
  ['public', /\b(photo session|photos taken|football|circus|concert|gymnastics|swimming|art performance|artistic performance|grand performance)/i],
  ['party', /\b(congress|plenary|plenum|politburo|political bureau|supreme people's assembly|\bSPA\b|session of|joint meeting|enlarged meeting|meeting of (?:the )?(?:ninth|eighth)|workshop|conference)/i],
  ['military', /\b(missile|drill|test|weapon|munitions|destroyer|submarine|army(?!-people)|KPA|military|defence|defense|artillery|firing|tank|sniper|special operations|navy|air force|corps|combat|nuclear|engine|shooting|parade|commanding officers|warship|mortar|rocket|launcher|MRLS)/i],
  ['party', /\b(meeting|election|elected|cabinet|central committee|ministry|court|prosecutor|security|cadres)/i],
  ['economy', /\b(factory|farm|construction|hospital|inaugurat|complex|power station|street|flats|greenhouse|mine|mill|plant|project|tourist|hotel|regional|livestock|cement|machine|enterprise|shipyard|holiday camp)/i],
  ['commemoration', /\b(Kumsusan|cemetery|martyrs|tower|bier|funeral|memorial|monument|tribute|liberation|anniversary)/i],
  ['public', /./],
];

function kindOf(title: string, first: string): Kind {
  for (const [k, re] of KIND_RULES) if (re.test(title)) return k;
  for (const [k, re] of KIND_RULES) if (re.test(first)) return k;
  return 'public';
}

// ---------- names ----------

/**
 * Korean surnames as KCNA romanizes them. Wang and Cai are left out on purpose: in these reports they are Chinese
 * officials (Wang Yi, Wang Yajun), and we only want North Koreans in the companion counts.
 */
const SURNAMES =
  'Kim|Ri|Pak|Choe|Jo|Jong|Kang|O|Yu|Han|Hyon|Ju|Jang|Yang|Rim|Sin|No|Ro|Hong|Pang|Jon|Thae|Kye|So|Mun|Ryu|Song|Chae|Cha|Ko|Hwang|Paek|Ryom|Kwon|Chon|Yun|Ok|Chang|Om|Son|An|Nam|Min|Yon|Ma|Sim|Tong|Ji|Kil|Ha|Pyon|Ham|Pae|Kwak|Sok|Tae|Cho|Ryo|Myong|Yom|Kong|Pu|Ra|Mo|Wi|Kye';
const NAME_RE = new RegExp(`\\b(?:${SURNAMES})(?: [A-Z][a-z]{1,5}){1,2}\\b`, 'g');
/** Capitalised words that can follow a surname but aren't given names. */
const NOT_GIVEN = new Set(['Party', 'Air', 'Navy', 'Day', 'Hall', 'Street', 'Square', 'Korea', 'Army', 'Corps', 'Union', 'Youth', 'Song', 'Sung']);
/** The founders and buildings named after them. */
const NOT_PEOPLE = /^(Kim Il Sung|Kim Jong Il|Kim Jong Un|Kim Jong Suk|Kim Chaek|Kim Hyong Jik)$/;

function namesIn(sentence: string): string[] {
  const out: string[] = [];
  for (const m of sentence.matchAll(NAME_RE)) {
    const parts = m[0].split(' ');
    // "Kim Il Sung University": the match ends at "Sung", the next word gives it away
    const after = sentence.slice((m.index ?? 0) + m[0].length).match(/^ ([A-Z][a-z]+)/)?.[1];
    // warships are named after people: "the destroyer Kang Kon", "Choe Hyon-class"
    if (/(?:destroyer|Destroyer|warship|ship) $/.test(sentence.slice(0, m.index ?? 0)) || sentence.slice((m.index ?? 0) + m[0].length).startsWith('-class')) continue;
    if (after && /^(University|Square|Stadium|Mill|Factory|Street|Hall|Prize|Order|Medal|Institute|Bridge|School|Shipyard|Complex|Plant|Mine|Socialist|Youth)$/.test(after)) continue;
    if (parts.slice(1).some((p) => NOT_GIVEN.has(p) && parts.length === 2)) continue;
    const name = parts.join(' ');
    if (NOT_PEOPLE.test(name)) continue;
    if (/^Kim Jong Un/.test(name)) continue;
    if (!out.includes(name)) out.push(name);
  }
  return out;
}

const ACCOMPANY = /^(?:The respected |Respected )?(?:Comrade )?(?:Kim Jong Un|He) was accompanied by|^(?:Also )?Accompanying him (?:were|was)\b/;
const PRESENT = /^(?:Also )?Present (?:there|at [^,]{3,80}?) (?:were|was)\b(?! on invitation)|^Present there were\b|(?:Kim Jong Un|He) was (?:courteously |warmly )?greeted (?:on the spot )?by\b/;

/** Splits companions and people present out of the report. Only sentences built on KCNA's fixed formulas are read. */
function people(paragraphs: string[]) {
  const companions: string[] = [];
  const present: string[] = [];
  for (const s of sentences(paragraphs.map(stripDateline).join(' '))) {
    // speeches and editorials quote people; only read narration sentences of the formula kind
    const into = ACCOMPANY.test(s) ? companions : PRESENT.test(s) ? present : null;
    if (!into) continue;
    for (const n of namesIn(s)) if (!into.includes(n)) into.push(n);
  }
  return { companions, present: present.filter((n) => !companions.includes(n)) };
}

// ---------- places ----------

/**
 * Places KCNA names, mapped to the province or special city they are in (English spellings as KCNA writes them).
 * Only places we are sure of; anything else stays "not stated". First match in the headline wins, then the first
 * paragraph.
 */
const GAZETTEER: [RegExp, string][] = [
  [/\b(Sinuiju|Unjon|Samgwang|Kusong|Jongju|Phihyon|Sohae)\b/, 'North Phyongan'],
  [/\b(Sunchon|Chonsong|Hoechang|Unsan|Kaechon|Anju|Phyongsong|Mundok)\b/, 'South Phyongan'],
  [/\b(Ragwon|Hamhung|Sinpho|Jongphyong|Hamju|Hungnam|Tanchon|Ryongsong Machine Complex)\b/, 'South Hamgyong'],
  [/\b(Chongjin|Kimchaek|Orang|Kyongsong|Hoeryong)\b/, 'North Hamgyong'],
  [/\b(Wonsan|Kalma|Hoeyang|Tongchon|Kosong|Munchon)\b/, 'Kangwon'],
  [/\b(Samjiyon|Hyesan|Kapsan)\b/, 'Ryanggang'],
  [/\b(Kanggye|Manpho|Huichon)\b/, 'Jagang'],
  [/\b(Haeju|Unnyul|Jangyon|Sinchon|Kangryong|Ongjin)\b/, 'South Hwanghae'],
  [/\b(Sariwon|Songrim|Hwangju|Unpha)\b/, 'North Hwanghae'],
  [/\b(Nampho|Ryonggang)\b/, 'Nampho'],
  [/\b(Kaesong)\b/, 'Kaesong'],
  [/\b(Rason|Rajin|Sonbong)\b/, 'Rason'],
  [
    /\b(Pyongyang|Kumsusan|Mansudae|Mokran|Hwasong (?:area|Area|district)|Kangdong|Saeppyol Street|Mt Taesong|Liberation Tower|Friendship Tower|Kim Il Sung Square|Kim Il Sung University|May Day Stadium|Sunan|Mangyongdae|Changjon|Ice Rink|Central Cadres Training School|Memorial Museum of Combat Feats|headquarters building of the Party Central Committee|Mirim)\b/,
    'Pyongyang',
  ],
];

function regionOf(title: string, first: string): string | undefined {
  for (const text of [title, stripDateline(first)]) {
    let best: { at: number; region: string } | undefined;
    for (const [re, region] of GAZETTEER) {
      const m = text.match(re);
      if (m && (best === undefined || (m.index ?? 0) < best.at)) best = { at: m.index ?? 0, region };
    }
    if (best) return best.region;
  }
  return undefined;
}

// ---------- headlines ----------

/** "Respected Comrade Kim Jong Un Inspects Destroyer Choe Hyon" → "Inspects Destroyer Choe Hyon". */
export function subjectOf(title: string) {
  return title
    .replace(/^(?:Respected |Respected Fatherly |Fatherly )?(?:Comrade |Marshal )?(?:General Secretary )?Kim Jong Un(?:'s)? /, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const SPEECH_TITLE = /(?:^|\s)(?:Speech|Address|Concluding Speech|Opening Address|Closing Address|Congratulatory Speech|Policy Speech)\b.*\bKim Jong Un|Kim Jong Un's (?:[\w-]+ ){0,2}(?:Speech|Address)\b/;

/** Headline of a search hit outside the activity category → letter/greeting direction, or null when it isn't one. */
export function messageDirection(title: string): KimMessage['direction'] | null {
  if (/Kim Jong Un (?:Receives?|Gets)\b/.test(title)) return 'received';
  if (/^(?:Congratulatory )?(?:Letters?|Messages?|Message of Thanks|Messages and Letters) (?:of [\w\s]+ )?to (?:Respected )?(?:Comrade |Marshal |Fatherly Marshal )*Kim Jong Un/.test(title)) return 'received';
  if (/Kim Jong Un Sends?\b/.test(title)) return 'sent';
  return null;
}

/** A search hit outside the activity category that reads like an appearance (rare; KCNA files nearly all of them in the category). */
export const looksLikeAppearance = (title: string) =>
  /Kim Jong Un (?:Visits|Inspects|Oversees|Observes|Watches|Enjoys|Attends|Meets|Guides|Gives Field Guidance|Has Talks|Hosts|Makes Speech|Has Photo)/.test(title);

// ---------- build ----------

export function parseArticle(a: Article): KimRecord {
  const first = a.paragraphs[0] ?? '';
  const speech = SPEECH_TITLE.test(a.title);
  const sent = /Kim Jong Un Sends?\b/.test(a.title);
  // a speech text is only published when he gave it in person; letters he sends are not appearances
  const remote = !sent && sentences(a.paragraphs.join(' ')).some((s) => /Kim Jong Un|^He\b/.test(s) && REMOTE.test(s));
  const appearance = !sent && !remote && (speech || presentInText(a.paragraphs));
  const dates = eventDates(a.date, a.paragraphs);
  const text = a.paragraphs.join(' ');
  const { companions, present } = appearance ? people(a.paragraphs) : { companions: [], present: [] };
  return {
    id: a.id,
    url: articleUrl(a.id),
    reportDate: a.date,
    title: a.title,
    eventDate: dates?.start ?? a.date,
    ...(dates?.end && { eventDateEnd: dates.end }),
    eventDateFrom: dates ? 'text' : 'report',
    appearance,
    kind: sent ? 'message' : appearance || remote ? kindOf(a.title, first) : 'none',
    ...(remote && { remote }),
    speech,
    subject: subjectOf(a.title),
    ...(regionOf(a.title, first) && { region: regionOf(a.title, first) }),
    companions,
    present,
    // "his daughter", "his dear daughter", "his beloved daughter", "the respected daughter"
    daughter: appearance && /\b(?:his|respected|beloved) (?:[\w-]+ )?daughter\b/i.test(text),
    wife: appearance && /\b(?:his wife|Ri Sol Ju)\b/.test(text),
  };
}

export function buildDataset(input: {
  category: ListItem[];
  search: ListItem[];
  articles: Map<string, Article>;
  titlesKo: Record<string, string>;
  fetched: string;
  oldestListed?: string;
}): KimWatchData {
  const records: KimRecord[] = [];
  const seen = new Set<string>();
  for (const item of [...input.category, ...input.search.filter((s) => looksLikeAppearance(s.title))]) {
    const a = input.articles.get(item.id);
    if (!a || seen.has(item.id)) continue;
    seen.add(item.id);
    const r = parseArticle(a);
    if (input.titlesKo[item.id]) r.titleKo = input.titlesKo[item.id];
    records.push(r);
  }

  // Speech texts usually give no day. When another report from the same day names one, use it:
  // KCNA publishes the speech and the event report together.
  const byReport = new Map<string, KimRecord[]>();
  for (const r of records) byReport.set(r.reportDate, [...(byReport.get(r.reportDate) ?? []), r]);
  for (const r of records) {
    if (r.eventDateFrom !== 'report' || !r.appearance || !r.speech) continue;
    const days = (byReport.get(r.reportDate) ?? []).filter((o) => o.appearance && o.eventDateFrom === 'text').map((o) => o.eventDate);
    if (!days.length) continue;
    const counts = new Map<string, number>();
    for (const d of days) counts.set(d, (counts.get(d) ?? 0) + 1);
    r.eventDate = [...counts].sort((x, y) => y[1] - x[1] || y[0].localeCompare(x[0]))[0][0];
    r.eventDateFrom = 'same-day';
  }

  records.sort((x, y) => y.eventDate.localeCompare(x.eventDate) || y.reportDate.localeCompare(x.reportDate) || x.id.localeCompare(y.id));

  const messages: KimMessage[] = [];
  for (const s of input.search) {
    const direction = messageDirection(s.title);
    if (direction) messages.push({ id: s.id, url: articleUrl(s.id), date: s.date, title: s.title, direction });
  }
  // the category holds a few letters too ("Sends Letter of Congratulations to National Symphony Orchestra")
  for (const r of records) if (r.kind === 'message') messages.push({ id: r.id, url: r.url, date: r.reportDate, title: r.title, direction: 'sent' });
  messages.sort((x, y) => y.date.localeCompare(x.date) || x.id.localeCompare(y.id));

  const last = records.find((r) => r.appearance);
  const allDates = [...records.map((r) => r.reportDate), ...messages.map((m) => m.date)].sort();
  return {
    fetched: input.fetched,
    ...(input.oldestListed && { oldestListed: input.oldestListed }),
    coverage: { from: allDates[0] ?? input.fetched, to: allDates.at(-1) ?? input.fetched },
    ...(last && { lastAppearance: { date: last.eventDateEnd ?? last.eventDate, id: last.id, title: last.title } }),
    records,
    messages,
  };
}
