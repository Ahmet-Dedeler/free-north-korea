/**
 * Kim Watch (/kim-watch, /ko/kim-watch, /ja/kim-watch, /zh/kim-watch): Kim Jong Un's public appearances as KCNA,
 * North Korea's state news agency, reported them.
 *
 * The records come from data/kimwatch.json, built by scripts/build-kimwatch.ts from KCNA's own website. Everything
 * here is the regime's account: the page says so next to every number, and nothing is presented as verified.
 * This file holds the numbers the page shows (all computed from the records) and the page text in each language.
 */
import raw from '../../data/kimwatch.json';
import type { Lang } from '@/site/seo';

export type Kind = 'military' | 'economy' | 'party' | 'diplomacy' | 'commemoration' | 'public' | 'message' | 'none';

export interface KimRecord {
  id: string;
  url: string;
  reportDate: string;
  title: string;
  titleKo?: string;
  eventDate: string;
  eventDateEnd?: string;
  eventDateFrom: 'text' | 'same-day' | 'report';
  appearance: boolean;
  remote?: boolean;
  kind: Kind;
  speech: boolean;
  subject: string;
  region?: string;
  companions: string[];
  present: string[];
  daughter: boolean;
  wife: boolean;
}

export interface KimMessage {
  id: string;
  url: string;
  date: string;
  title: string;
  direction: 'received' | 'sent';
}

export const KIM_WATCH = raw as unknown as {
  fetched: string;
  oldestListed?: string;
  coverage: { from: string; to: string };
  lastAppearance?: { date: string; id: string; title: string };
  records: KimRecord[];
  messages: KimMessage[];
};

export const KIM_WATCH_PATHS = { en: '/kim-watch', ko: '/ko/kim-watch', ja: '/ja/kim-watch', zh: '/zh/kim-watch' } as const;

/** KCNA's own listing of his activities, the source of every record. Not linked from the Korean page (blocked in South Korea). */
export const KCNA_CATEGORY_URL = 'http://www.kcna.kp/en/article/list/b0721b9f23054ddc7fe56c2811a12715';
export const KIM_WATCH_DATA_URL = 'https://github.com/Ahmet-Dedeler/free-north-korea/blob/main/data/kimwatch.json';
export const KIM_WATCH_RAW_URL = 'https://raw.githubusercontent.com/Ahmet-Dedeler/free-north-korea/main/data/kimwatch.json';

// ---------- numbers ----------

const DAY = 86_400_000;
const addDays = (iso: string, n: number) => new Date(Date.parse(iso + 'T00:00:00Z') + n * DAY).toISOString().slice(0, 10);
export const daysBetween = (from: string, to: string) => Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / DAY);

/** Today in UTC, as YYYY-MM-DD. Pages are static, so this is the day the site was built. */
export const buildDay = () => new Date().toISOString().slice(0, 10);

/** Days since the last appearance KCNA reported, counted on `today` (the build day by default). */
export function daysSinceLastSeen(today = buildDay()) {
  const last = KIM_WATCH.lastAppearance;
  return last ? Math.max(0, daysBetween(last.date, today)) : null;
}

/** Order used to break ties when a day had several kinds of activity, and for legends. */
export const KINDS: Exclude<Kind, 'message' | 'none'>[] = ['military', 'economy', 'party', 'diplomacy', 'commemoration', 'public'];

export interface AppearanceDay {
  date: string;
  /** What he did most that day (ties go to the earlier kind in KINDS). */
  kind: (typeof KINDS)[number];
  reports: KimRecord[];
  companions: string[];
  regions: string[];
  daughter: boolean;
  wife: boolean;
  /** True when no report gave the day and the publication date stands in for it. */
  approx: boolean;
}

/** Every day with at least one reported appearance, newest first. A report covering several days counts on each. */
export function appearanceDays(records = KIM_WATCH.records): AppearanceDay[] {
  const byDay = new Map<string, KimRecord[]>();
  for (const r of records) {
    if (!r.appearance) continue;
    const end = r.eventDateEnd ?? r.eventDate;
    for (let d = r.eventDate; d <= end; d = addDays(d, 1)) byDay.set(d, [...(byDay.get(d) ?? []), r]);
  }
  return [...byDay.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, reports]) => {
      const counts = new Map<string, number>();
      for (const r of reports) if (r.kind !== 'message' && r.kind !== 'none') counts.set(r.kind, (counts.get(r.kind) ?? 0) + 1);
      const kind = [...KINDS].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0) || KINDS.indexOf(a) - KINDS.indexOf(b))[0];
      return {
        date,
        kind,
        reports,
        companions: [...new Set(reports.flatMap((r) => [...r.companions, ...r.present]))],
        regions: [...new Set(reports.flatMap((r) => (r.region ? [r.region] : [])))],
        daughter: reports.some((r) => r.daughter),
        wife: reports.some((r) => r.wife),
        approx: reports.every((r) => r.eventDateFrom === 'report'),
      };
    });
}

export const monthsBetween = (from: string, to: string) => {
  const out: string[] = [];
  for (let y = +from.slice(0, 4), m = +from.slice(5, 7); `${y}-${String(m).padStart(2, '0')}` <= to.slice(0, 7); m === 12 ? (y++, (m = 1)) : m++)
    out.push(`${y}-${String(m).padStart(2, '0')}`);
  return out;
};

/** The longest stretch between two reported appearances (days with nothing in between). */
export function longestGap(days: AppearanceDay[]) {
  const sorted = days.map((d) => d.date).sort();
  let best = { days: 0, from: '', to: '' };
  for (let i = 1; i < sorted.length; i++) {
    const gap = daysBetween(sorted[i - 1], sorted[i]) - 1;
    if (gap > best.days) best = { days: gap, from: sorted[i - 1], to: sorted[i] };
  }
  return best;
}

/** People named with him, counted once per day, most frequent first. */
export function topCompanions(days: AppearanceDay[], n = 15) {
  const counts = new Map<string, number>();
  for (const d of days) for (const name of d.companions) counts.set(name, (counts.get(name) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
}

/** Region tally (once per day per region). Days whose reports name no place count under `null`. */
export function regionTally(days: AppearanceDay[]) {
  const counts = new Map<string | null, number>();
  for (const d of days) {
    if (!d.regions.length) counts.set(null, (counts.get(null) ?? 0) + 1);
    for (const r of d.regions) counts.set(r, (counts.get(r) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => (a[0] === null ? 1 : b[0] === null ? -1 : b[1] - a[1]));
}

// ---------- labels ----------

type L = Record<Lang, string>;

export const KIND_LABEL: Record<(typeof KINDS)[number], L> = {
  military: { en: 'Military and weapons', ko: '군사·무기', ja: '軍事・兵器', zh: '军事与武器' },
  economy: { en: 'Economy and construction', ko: '경제·건설', ja: '経済・建設', zh: '经济与建设' },
  party: { en: 'Party and state meetings', ko: '당·국가 회의', ja: '党・国家の会議', zh: '党和国家会议' },
  diplomacy: { en: 'Foreign visitors', ko: '외국 방문단', ja: '外国の訪問団', zh: '外国来访' },
  commemoration: { en: 'Memorials and anniversaries', ko: '참배·기념일', ja: '参拝・記念日', zh: '悼念与纪念日' },
  public: { en: 'Shows, sport and photo sessions', ko: '공연·체육·기념사진', ja: '公演・スポーツ・記念撮影', zh: '演出、体育与合影' },
};

/** Provinces and special cities as KCNA spells them in English, named the way each audience writes them. */
export const REGION_LABEL: Record<string, L> = {
  Pyongyang: { en: 'Pyongyang', ko: '평양', ja: '平壌', zh: '平壤' },
  'South Phyongan': { en: 'South Phyongan', ko: '평안남도', ja: '平安南道', zh: '平安南道' },
  'North Phyongan': { en: 'North Phyongan', ko: '평안북도', ja: '平安北道', zh: '平安北道' },
  'South Hamgyong': { en: 'South Hamgyong', ko: '함경남도', ja: '咸鏡南道', zh: '咸镜南道' },
  'North Hamgyong': { en: 'North Hamgyong', ko: '함경북도', ja: '咸鏡北道', zh: '咸镜北道' },
  Kangwon: { en: 'Kangwon', ko: '강원도', ja: '江原道', zh: '江原道' },
  Ryanggang: { en: 'Ryanggang', ko: '양강도', ja: '両江道', zh: '两江道' },
  Jagang: { en: 'Jagang', ko: '자강도', ja: '慈江道', zh: '慈江道' },
  'South Hwanghae': { en: 'South Hwanghae', ko: '황해남도', ja: '黄海南道', zh: '黄海南道' },
  'North Hwanghae': { en: 'North Hwanghae', ko: '황해북도', ja: '黄海北道', zh: '黄海北道' },
  Nampho: { en: 'Nampho', ko: '남포', ja: '南浦', zh: '南浦' },
  Kaesong: { en: 'Kaesong', ko: '개성', ja: '開城', zh: '开城' },
  Rason: { en: 'Rason', ko: '나선', ja: '羅先', zh: '罗先' },
};

export const LOCALE: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-CN' };

// ---------- page text ----------

export interface KimWatchText {
  metaTitle: string;
  metaDescription: string;
  /** Dataset JSON-LD description: 50 to 5000 characters. */
  datasetDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  sourceTitle: string;
  source: string;
  daysSince: string;
  lastSeen: string;
  counted: (date: string) => string;
  approxNote: string;
  calendarTitle: string;
  calendarHint: string;
  calendarNone: string;
  tiles: { days: string; daysNote: (from: string, to: string) => string; reports: string; reportsNote: string; gap: string; gapNote: (from: string, to: string) => string; letters: string; lettersNote: (r: number, s: number) => string };
  monthTitle: string;
  monthHint: string;
  mixTitle: string;
  mixHint: string;
  whereTitle: string;
  whereHint: string;
  notStated: string;
  whoTitle: string;
  whoHint: string;
  daysUnit: (n: number) => string;
  daughterTitle: string;
  daughter: (n: number, of: number) => string;
  daughterPhotos: string;
  daughterProfile: string;
  wife: (n: number) => string;
  timelineTitle: string;
  timelineHint: string;
  speech: string;
  daughterBadge: string;
  withLabel: string;
  messagesTitle: string;
  messagesHint: string;
  received: string;
  sent: string;
  latestMessages: string;
  methodTitle: string;
  method: (oldest: string) => string[];
  check: string;
  dataLink: string;
  /** Shown on pages that link to kcna.kp. */
  linkNote?: string;
  /** Shown on the Korean page, which cites KCNA by date and headline instead of linking. */
  noLinkNote?: string;
  /** Headlines are KCNA's English text on the ja/zh pages. */
  englishNote?: string;
  kcnaLink: string;
  familyTree: string;
  sources: string;
  lastSeenBlock: { unit: (n: number) => string; label: string; more: string };
}

const fmtShared = {
  en: (n: number) => (n === 1 ? '1 day' : `${n} days`),
  ko: (n: number) => `${n}일`,
  ja: (n: number) => `${n}日`,
  zh: (n: number) => `${n}天`,
};

export const KIM_WATCH_TEXT: Record<Lang, KimWatchText> = {
  en: {
    metaTitle: 'When was Kim Jong Un last seen? Kim Watch',
    metaDescription:
      "Days since Kim Jong Un's last public appearance as reported by KCNA, North Korea's state news agency, and a year of his reported appearances: where he went, who was with him and how often his daughter was mentioned.",
    datasetDescription:
      "Kim Jong Un's public appearances as reported by KCNA (Korean Central News Agency), North Korea's state news agency: one record per KCNA report with the event date, activity type, place as written, people named as accompanying him, and whether the text mentions his daughter or wife. Regime-reported data, not independently verified. Built from KCNA's own website with fixed parsing rules and updated weekly.",
    eyebrow: 'Kim Watch',
    h1: 'When was Kim Jong Un last seen?',
    lede: "A running record of every public appearance by Kim Jong Un that KCNA, North Korea's state news agency, reported. It shows how long he has been out of sight, where he goes and who goes with him.",
    sourceTitle: 'As reported by KCNA (North Korean state media)',
    source:
      'Every number here comes from the regime’s own news agency. Nobody outside North Korea can check these reports. KCNA picks what to publish and when, usually a day after the event, and can leave appearances out. A gap on this page means KCNA reported nothing, not that he was absent.',
    daysSince: 'since his last public appearance reported by KCNA',
    lastSeen: 'Last reported appearance',
    counted: (d) => `Counted from today's date. KCNA last checked ${d}.`,
    approxNote: '* KCNA gave no date; the day it published the report is shown.',
    calendarTitle: 'The year at a glance',
    calendarHint: 'One square per day. Coloured squares are days with a reported appearance, coloured by what he did most that day.',
    calendarNone: 'No reported appearance',
    tiles: {
      days: 'days with a reported public appearance',
      daysNote: (f, t) => `${f} to ${t}`,
      reports: 'KCNA reports on his activities',
      reportsNote: 'Several reports can cover one event (the event, his speech, a banquet).',
      gap: 'longest stretch with no reported appearance',
      gapNote: (f, t) => `Between ${f} and ${t}`,
      letters: 'letters, greetings and flower baskets',
      lettersNote: (r, s) => `${r} received, ${s} sent. Not counted as appearances.`,
    },
    monthTitle: 'Days with a reported appearance, by month',
    monthHint: 'Each day counts once, coloured by what he did most that day. The first and last months are only partly covered.',
    mixTitle: 'What he did',
    mixHint: 'Days with a reported appearance, by the main activity of the day.',
    whereTitle: 'Where he went',
    whereHint: 'Province or city named in the report. KCNA often leaves the place out, above all for weapons tests and arms factories.',
    notStated: 'Place not stated',
    whoTitle: 'Who appears with him',
    whoHint: 'People KCNA named as accompanying him or present at the event, counted once per day. Groups such as "leading officials" are not counted.',
    daysUnit: fmtShared.en,
    daughterTitle: 'How often KCNA mentions his daughter',
    daughter: (n, of) => `KCNA's text mentioned his daughter on ${n} of ${of} days with a reported appearance.`,
    daughterPhotos:
      'She shows up in KCNA photos far more often than in the text, and KCNA does not print her name. Outside reporting, starting with South Korean intelligence, calls her Kim Ju Ae. This record only reads the text, so it undercounts her.',
    daughterProfile: 'Profile: ',
    wife: (n) => `His wife, Ri Sol Ju, is mentioned on ${n === 1 ? '1 day' : `${n} days`}.`,
    timelineTitle: 'Every reported appearance',
    timelineHint: 'Newest first. The date is the day of the event when the report gives it.',
    speech: 'speech',
    daughterBadge: 'daughter mentioned',
    withLabel: 'With',
    messagesTitle: 'Letters, greetings and flower baskets',
    messagesHint: 'KCNA reports these separately. Receiving a letter or sending a message is not a public appearance, so none of these count above.',
    received: 'Received',
    sent: 'Sent',
    latestMessages: 'Latest',
    methodTitle: 'How this is built',
    method: (oldest) => [
      'A script downloads KCNA’s own list of reports on his activities (the section "WPK General Secretary Kim Jong Un’s Revolutionary Activities") and the text of each report. It reads them with fixed rules: the day of the event, whether the text says he was there in person, the people named as accompanying him, the place, and any mention of his daughter or wife. No AI model is involved.',
      `KCNA’s website only lists the last 12 months, so the record starts on ${oldest}. The script runs every week and keeps everything it has already seen, so the record grows from here.`,
      'Speech texts KCNA publishes next to an event report count as part of that event. When he watched something on a screen ("observed the test-fire on TV"), it is not counted as an appearance.',
    ],
    check:
      'Checked by hand: 50 parsed reports were compared with the KCNA text (date, presence, place, names, daughter). The first pass found 6 errors (dates further down the article, one place); after fixing the rules, a fresh sample of 25 matched on every field.',
    dataLink: 'Download the records (JSON)',
    linkNote: 'Links go to kcna.kp, the North Korean government’s news site. It loads over plain HTTP only, can be slow, and is blocked in South Korea.',
    kcnaLink: 'KCNA',
    familyTree: 'The Kim family tree',
    sources: 'Sources',
    lastSeenBlock: {
      unit: (n) => (n === 1 ? 'day' : 'days'),
      label: "since Kim Jong Un's last public appearance reported by KCNA (North Korean state media)",
      more: 'Kim Watch: every reported appearance',
    },
  },
  ko: {
    metaTitle: '김정은은 언제 마지막으로 공개 활동을 했나? 김정은 동향 기록',
    metaDescription:
      '북한 관영 조선중앙통신이 보도한 김정은의 마지막 공개 활동 이후 며칠이 지났는지, 그리고 1년 동안 보도된 공개 활동: 어디에 갔고 누가 동행했으며 딸이 몇 번 언급됐는지 정리했습니다.',
    datasetDescription:
      '북한 관영 조선중앙통신(KCNA)이 보도한 김정은의 공개 활동 기록입니다. 보도 한 건마다 행사 날짜, 활동 유형, 보도에 적힌 장소, 동행자로 언급된 인물, 딸이나 부인이 본문에 언급됐는지를 담았습니다. 북한 정권이 보도한 자료이며 독립적으로 검증되지 않았습니다. 조선중앙통신 웹사이트에서 정해진 규칙으로 추출해 매주 갱신합니다.',
    eyebrow: '김정은 동향 기록',
    h1: '김정은은 언제 마지막으로 공개 활동을 했나?',
    lede: '북한 관영 조선중앙통신이 보도한 김정은의 공개 활동을 모두 모은 기록입니다. 그가 얼마나 오래 모습을 보이지 않았는지, 어디에 가고 누구와 함께 다니는지 보여 줍니다.',
    sourceTitle: '조선중앙통신(북한 관영 매체) 보도 기준',
    source:
      '이 페이지의 모든 숫자는 북한 정권의 통신사가 보도한 내용입니다. 북한 밖에서는 아무도 이 보도를 확인할 수 없습니다. 조선중앙통신은 무엇을 언제 보도할지 스스로 정하며, 보통 행사 다음 날 보도하고, 공개 활동을 빼고 보도하지 않을 수도 있습니다. 이 페이지에서 공백은 조선중앙통신이 아무것도 보도하지 않았다는 뜻이지, 그가 활동하지 않았다는 뜻이 아닙니다.',
    daysSince: '조선중앙통신이 보도한 마지막 공개 활동 이후',
    lastSeen: '마지막으로 보도된 공개 활동',
    counted: (d) => `오늘 날짜 기준으로 계산했습니다. KCNA 마지막 확인: ${d}.`,
    approxNote: '* 보도에 날짜가 없어 보도일을 표시했습니다.',
    calendarTitle: '한눈에 보는 1년',
    calendarHint: '한 칸이 하루입니다. 색칠된 칸은 공개 활동이 보도된 날이며, 그날 가장 많이 한 활동의 색입니다.',
    calendarNone: '보도된 공개 활동 없음',
    tiles: {
      days: '공개 활동이 보도된 날',
      daysNote: (f, t) => `${f}~${t}`,
      reports: '그의 활동에 관한 조선중앙통신 보도',
      reportsNote: '한 행사에 보도가 여러 건일 수 있습니다(행사, 연설, 연회).',
      gap: '공개 활동 보도가 없었던 가장 긴 기간',
      gapNote: (f, t) => `${f}와 ${t} 사이`,
      letters: '편지, 축전, 꽃바구니',
      lettersNote: (r, s) => `받은 것 ${r}건, 보낸 것 ${s}건. 공개 활동으로 세지 않습니다.`,
    },
    monthTitle: '월별 공개 활동 보도 일수',
    monthHint: '하루는 한 번만 세며, 그날 가장 많이 한 활동의 색으로 표시합니다. 첫 달과 마지막 달은 일부만 포함됩니다.',
    mixTitle: '무엇을 했나',
    mixHint: '공개 활동이 보도된 날을 그날의 주된 활동별로 나눴습니다.',
    whereTitle: '어디에 갔나',
    whereHint: '보도에 나온 도나 시입니다. 조선중앙통신은 장소를 밝히지 않는 경우가 많으며, 특히 무기 시험과 군수공장이 그렇습니다.',
    notStated: '장소 밝히지 않음',
    whoTitle: '누가 함께 나오나',
    whoHint: '조선중앙통신이 동행하거나 행사에 참석했다고 이름을 밝힌 사람이며, 하루에 한 번만 셉니다. "지도간부들" 같은 집단은 세지 않습니다.',
    daysUnit: fmtShared.ko,
    daughterTitle: '조선중앙통신은 딸을 얼마나 자주 언급하나',
    daughter: (n, of) => `공개 활동이 보도된 ${of}일 중 ${n}일에 조선중앙통신 본문이 그의 딸을 언급했습니다.`,
    daughterPhotos:
      '딸은 본문보다 조선중앙통신 사진에 훨씬 자주 나오며, 조선중앙통신은 이름을 밝히지 않습니다. 한국 국가정보원을 비롯한 외부에서는 김주애라고 부릅니다. 이 기록은 본문만 읽기 때문에 실제보다 적게 셉니다.',
    daughterProfile: '인물 정보: ',
    wife: (n) => `부인 리설주는 ${n}일에 언급됐습니다.`,
    timelineTitle: '보도된 공개 활동 전체',
    timelineHint: '최신순입니다. 날짜는 보도에 나온 행사 날짜입니다. 제목은 조선중앙통신의 조선어 제목 그대로입니다.',
    speech: '연설',
    daughterBadge: '딸 언급',
    withLabel: '동행·참석',
    messagesTitle: '편지, 축전, 꽃바구니',
    messagesHint: '조선중앙통신은 이것들을 따로 보도합니다. 편지를 받거나 축전을 보내는 것은 공개 활동이 아니므로 위의 숫자에 넣지 않았습니다.',
    received: '받음',
    sent: '보냄',
    latestMessages: '최근',
    methodTitle: '어떻게 만들었나',
    method: (oldest) => [
      '스크립트가 조선중앙통신이 직접 만든 그의 활동 보도 목록("경애하는 김정은동지의 혁명활동소식")과 각 보도 본문을 내려받습니다. 그리고 정해진 규칙으로 행사 날짜, 그가 직접 그 자리에 있었다고 본문에 나오는지, 동행자로 언급된 사람, 장소, 딸이나 부인에 대한 언급을 읽어 냅니다. AI 모델은 쓰지 않습니다.',
      `조선중앙통신 웹사이트는 최근 12개월만 목록에 보여 주기 때문에 기록은 ${oldest}부터 시작합니다. 스크립트는 매주 실행되며 이미 본 보도를 모두 보관하므로 기록은 앞으로 계속 늘어납니다.`,
      '행사 보도와 함께 실리는 연설문은 그 행사의 일부로 셉니다. 화면으로 지켜본 경우(예: 시험사격을 텔레비전으로 지켜봤다는 보도)는 공개 활동으로 세지 않습니다.',
    ],
    check:
      '직접 확인: 추출한 보도 50건을 조선중앙통신 본문과 비교했습니다(날짜, 참석 여부, 장소, 이름, 딸). 처음에는 오류 6건(기사 뒷부분에 있는 날짜, 장소 1건)이 나왔고, 규칙을 고친 뒤 새로 고른 25건은 모든 항목이 맞았습니다.',
    dataLink: '기록 내려받기(JSON)',
    noLinkNote:
      'kcna.kp는 한국에서 접속이 차단된 사이트이므로 이 페이지는 링크 대신 날짜와 제목으로 조선중앙통신 보도를 인용합니다. 편지·축전 제목은 조선중앙통신 영문판 제목이라 영어로 둡니다.',
    kcnaLink: '조선중앙통신',
    familyTree: '김씨 일가 가계도',
    sources: '출처',
    lastSeenBlock: {
      unit: () => '일',
      label: '조선중앙통신(북한 관영 매체)이 보도한 김정은의 마지막 공개 활동 이후',
      more: '김정은 동향 기록: 보도된 공개 활동 전체',
    },
  },
  ja: {
    metaTitle: '金正恩が最後に姿を見せたのはいつか 金正恩動向記録',
    metaDescription:
      '北朝鮮の国営朝鮮中央通信が報じた金正恩の最後の公開活動から何日たったか、そして1年分の公開活動の記録。どこへ行き、誰が同行し、娘が何回言及されたか。',
    datasetDescription:
      '北朝鮮の国営通信社、朝鮮中央通信(KCNA)が報じた金正恩の公開活動の記録です。報道1件ごとに、行事の日付、活動の種類、報道に書かれた場所、同行者として名前が出た人物、本文で娘や妻に触れているかを収めています。北朝鮮当局が報じたデータで、独自に検証されたものではありません。朝鮮中央通信のウェブサイトから決まった規則で抽出し、毎週更新します。',
    eyebrow: '金正恩動向記録',
    h1: '金正恩が最後に姿を見せたのはいつか',
    lede: '北朝鮮の国営通信社、朝鮮中央通信が報じた金正恩の公開活動をすべて集めた記録です。どれだけ長く姿を見せていないか、どこへ行き、誰と一緒にいるかがわかります。',
    sourceTitle: '朝鮮中央通信(北朝鮮の国営メディア)の報道による',
    source:
      'このページの数字はすべて、北朝鮮当局の通信社が報じたものです。北朝鮮の外からこれらの報道を確かめることはできません。朝鮮中央通信は何をいつ報じるかを自ら決め、通常は行事の翌日に報じ、公開活動を報じないこともあります。このページの空白は、朝鮮中央通信が何も報じなかったという意味で、本人がいなかったという意味ではありません。',
    daysSince: '朝鮮中央通信が報じた最後の公開活動から',
    lastSeen: '最後に報じられた公開活動',
    counted: (d) => `今日の日付で計算。KCNAの最終確認：${d}。`,
    approxNote: '* 報道に日付がないため、報道日を表示しています。',
    calendarTitle: 'ひと目でわかる1年',
    calendarHint: '1マスが1日です。色のついたマスは公開活動が報じられた日で、その日に最も多かった活動の色です。',
    calendarNone: '公開活動の報道なし',
    tiles: {
      days: '公開活動が報じられた日数',
      daysNote: (f, t) => `${f}〜${t}`,
      reports: '活動に関する朝鮮中央通信の報道',
      reportsNote: '1つの行事に複数の報道があることがあります(行事、演説、宴会)。',
      gap: '公開活動の報道がなかった最長の期間',
      gapNote: (f, t) => `${f}から${t}まで`,
      letters: '手紙、祝電、花かご',
      lettersNote: (r, s) => `受け取り${r}件、送付${s}件。公開活動には数えません。`,
    },
    monthTitle: '月別の公開活動の報道日数',
    monthHint: '1日は1回だけ数え、その日に最も多かった活動の色で示します。最初と最後の月は一部の期間のみです。',
    mixTitle: '何をしたか',
    mixHint: '公開活動が報じられた日を、その日の主な活動ごとに分けました。',
    whereTitle: 'どこへ行ったか',
    whereHint: '報道に出てきた道や市です。朝鮮中央通信は場所を伏せることが多く、とくに兵器の試験や軍需工場がそうです。',
    notStated: '場所の記載なし',
    whoTitle: '誰が一緒に現れるか',
    whoHint: '朝鮮中央通信が同行者や出席者として名前を挙げた人物で、1日1回だけ数えます。「指導幹部」のような集団は数えません。',
    daysUnit: fmtShared.ja,
    daughterTitle: '朝鮮中央通信は娘にどれだけ触れるか',
    daughter: (n, of) => `公開活動が報じられた${of}日のうち、${n}日で朝鮮中央通信の本文が娘に触れました。`,
    daughterPhotos:
      '娘は本文よりも朝鮮中央通信の写真にずっと多く登場し、朝鮮中央通信は名前を出しません。韓国の情報機関をはじめ外部ではキム・ジュエ(金主愛)と呼ばれています。この記録は本文だけを読むため、実際より少なく数えています。',
    daughterProfile: '人物紹介: ',
    wife: (n) => `妻の李雪主(リ・ソルジュ)は${n}日に言及されました。`,
    timelineTitle: '報じられた公開活動のすべて',
    timelineHint: '新しい順です。日付は報道に書かれた行事の日です。見出しは朝鮮中央通信の英語版のままです。',
    speech: '演説',
    daughterBadge: '娘に言及',
    withLabel: '同行・出席',
    messagesTitle: '手紙、祝電、花かご',
    messagesHint: '朝鮮中央通信はこれらを別に報じます。手紙を受け取ったり祝電を送ったりするのは公開活動ではないため、上の数字には含めていません。',
    received: '受け取り',
    sent: '送付',
    latestMessages: '最近のもの',
    methodTitle: 'つくり方',
    method: (oldest) => [
      'スクリプトが、朝鮮中央通信自身による活動報道の一覧(「WPK General Secretary Kim Jong Un’s Revolutionary Activities」)と各報道の本文をダウンロードします。そして決まった規則で、行事の日付、本人がその場にいたと本文にあるか、同行者として名前が出た人物、場所、娘や妻への言及を読み取ります。AIモデルは使っていません。',
      `朝鮮中央通信のウェブサイトは直近12か月分しか一覧に載せないため、記録は${oldest}から始まります。スクリプトは毎週動き、一度見た報道をすべて保存するので、記録はこれから増えていきます。`,
      '行事の報道と一緒に掲載される演説文は、その行事の一部として数えます。画面で見守った場合(試射をテレビで見守ったという報道など)は公開活動に数えません。',
    ],
    check:
      '手作業での確認: 抽出した報道50件を朝鮮中央通信の本文と照合しました(日付、本人の出席、場所、名前、娘)。最初は誤りが6件(記事の後半にある日付、場所1件)見つかり、規則を直した後に新たに選んだ25件はすべての項目が一致しました。',
    dataLink: '記録をダウンロード(JSON)',
    linkNote: 'リンク先は北朝鮮政府のニュースサイトkcna.kpです。HTTPでしか開けず、表示が遅いことがあり、韓国では接続が遮断されています。',
    englishNote: '見出しは朝鮮中央通信の英語版の原文です。',
    kcnaLink: '朝鮮中央通信',
    familyTree: '金一族の家系図',
    sources: '出典',
    lastSeenBlock: {
      unit: () => '日',
      label: '朝鮮中央通信(北朝鮮の国営メディア)が報じた金正恩の最後の公開活動から',
      more: '金正恩動向記録: 報じられた公開活動のすべて',
    },
  },
  zh: {
    metaTitle: '金正恩最后一次露面是什么时候？金正恩动向记录',
    metaDescription:
      '距朝鲜官方朝中社报道的金正恩最后一次公开露面已过去多少天，以及一年来报道的公开活动：他去了哪里、谁陪同他、女儿被提到几次。',
    datasetDescription:
      '朝鲜官方通讯社朝鲜中央通讯社（朝中社，KCNA）报道的金正恩公开活动记录。每条朝中社报道一条记录，包括活动日期、活动类型、报道中写明的地点、被点名陪同的人物，以及正文是否提到他的女儿或妻子。这是朝鲜政权报道的数据，未经独立核实。数据按固定规则从朝中社网站提取，每周更新。',
    eyebrow: '金正恩动向记录',
    h1: '金正恩最后一次露面是什么时候？',
    lede: '这里收录了朝鲜官方通讯社朝中社报道的金正恩每一次公开活动。可以看出他有多久没有露面、去了哪里、谁和他一起出现。',
    sourceTitle: '据朝中社（朝鲜官方媒体）报道',
    source:
      '本页所有数字都来自朝鲜政权自己的通讯社。朝鲜以外没有人能核实这些报道。朝中社自行决定报道什么、何时报道，通常在活动次日报道，也可能不报道某些公开活动。本页上的空白只表示朝中社没有报道，并不表示他没有活动。',
    daysSince: '距朝中社报道的最后一次公开活动',
    lastSeen: '最后一次报道的公开活动',
    counted: (d) => `按今天的日期计算。最后核对朝中社：${d}。`,
    approxNote: '* 报道未给出日期，显示的是发布日期。',
    calendarTitle: '一年概览',
    calendarHint: '每格代表一天。有颜色的格子是有公开活动报道的日子，颜色表示当天最主要的活动。',
    calendarNone: '没有公开活动报道',
    tiles: {
      days: '有公开活动报道的天数',
      daysNote: (f, t) => `${f}至${t}`,
      reports: '朝中社关于他活动的报道',
      reportsNote: '一次活动可能有多篇报道（活动本身、讲话、宴会）。',
      gap: '没有公开活动报道的最长时间',
      gapNote: (f, t) => `${f}至${t}之间`,
      letters: '信件、贺电和花篮',
      lettersNote: (r, s) => `收到${r}件，发出${s}件。不算作公开活动。`,
    },
    monthTitle: '每月有公开活动报道的天数',
    monthHint: '每天只算一次，颜色表示当天最主要的活动。第一个月和最后一个月只覆盖部分日期。',
    mixTitle: '他做了什么',
    mixHint: '按当天的主要活动划分有公开活动报道的日子。',
    whereTitle: '他去了哪里',
    whereHint: '报道中提到的道或市。朝中社经常不写地点，武器试验和军工厂尤其如此。',
    notStated: '未写明地点',
    whoTitle: '谁和他一起出现',
    whoHint: '朝中社点名陪同他或出席活动的人物，每天只算一次。"领导干部"之类的群体不计入。',
    daysUnit: fmtShared.zh,
    daughterTitle: '朝中社多常提到他的女儿',
    daughter: (n, of) => `在${of}个有公开活动报道的日子里，朝中社正文有${n}天提到他的女儿。`,
    daughterPhotos:
      '她出现在朝中社照片中的次数远多于正文，朝中社也不写她的名字。韩国情报机构等外界称她为金主爱。本记录只读正文，因此低估了她出现的次数。',
    daughterProfile: '人物资料：',
    wife: (n) => `他的妻子李雪主有${n}天被提到。`,
    timelineTitle: '所有报道的公开活动',
    timelineHint: '按时间倒序。日期是报道中给出的活动日期。标题保留朝中社英文版原文。',
    speech: '讲话',
    daughterBadge: '提到女儿',
    withLabel: '陪同或出席',
    messagesTitle: '信件、贺电和花篮',
    messagesHint: '朝中社单独报道这些内容。收到信件或发出贺电不是公开活动，因此都没有计入上面的数字。',
    received: '收到',
    sent: '发出',
    latestMessages: '最近',
    methodTitle: '如何制作',
    method: (oldest) => [
      '脚本下载朝中社自己的金正恩活动报道列表（“WPK General Secretary Kim Jong Un’s Revolutionary Activities”）和每篇报道的正文，再按固定规则读取：活动日期、正文是否说明他亲自到场、被点名陪同的人物、地点，以及是否提到他的女儿或妻子。没有使用任何人工智能模型。',
      `朝中社网站只列出最近12个月的报道，因此记录从${oldest}开始。脚本每周运行，并保留已经读取过的所有报道，所以记录会从现在起不断增加。`,
      '与活动报道一起发布的讲话全文算作该活动的一部分。他通过屏幕观看的情况（例如报道称他通过电视观看试射）不算作公开活动。',
    ],
    check:
      '人工核对：把50条提取出的报道与朝中社原文对照（日期、是否到场、地点、人名、女儿）。第一轮发现6处错误（日期写在文章后部、一处地点），修正规则后重新抽取的25条在所有字段上都正确。',
    dataLink: '下载记录（JSON）',
    linkNote: '链接指向朝鲜政府的新闻网站kcna.kp。它只能通过HTTP打开，加载可能很慢，在韩国被屏蔽。',
    englishNote: '标题保留朝中社英文版原文。',
    kcnaLink: '朝中社',
    familyTree: '金氏家族谱',
    sources: '来源',
    lastSeenBlock: {
      unit: () => '天',
      label: '距朝中社（朝鲜官方媒体）报道的金正恩最后一次公开活动',
      more: '金正恩动向记录：所有报道的公开活动',
    },
  },
};
