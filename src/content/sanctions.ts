/**
 * Content for /sanctions (and /ko/sanctions, /ja/sanctions, /zh/sanctions).
 *
 * The lists themselves (who is sanctioned) come from data/sanctions.json, built by scripts/build-sanctions.ts from
 * the live UN, US (OFAC), UK (FCDO), EU and Japanese (Ministry of Finance) files, with `targets` saying which entries
 * on different lists are the same person, company or ship. This file holds what a list can't say: which resolution
 * did what, and the page text in each language. Names and listing reasons stay in English because that is the
 * official text.
 */
import raw from '../../data/sanctions.json';
import type { Lang } from '@/site/seo';

export interface UnEntry {
  ref: string;
  name: string;
  aliases: string[];
  listed: string;
  role?: string;
  note?: string;
}
export type OfacKind = 'individual' | 'entity' | 'vessel' | 'aircraft';
export interface OfacEntry {
  id: string;
  name: string;
  kind: OfacKind;
  programs: string[];
  title?: string;
}

/** The five lists, in the order the page shows them. */
export type ListKey = 'UN' | 'US' | 'UK' | 'EU' | 'JP';
export const LIST_KEYS: ListKey[] = ['UN', 'US', 'UK', 'EU', 'JP'];
export const NATIONAL_KEYS = ['UK', 'EU', 'JP'] as const;
export type NationalKey = (typeof NATIONAL_KEYS)[number];
/** How two entries on different lists were tied together (see scripts/sanctions/match.ts). */
export type MatchMethod = 'un-ref' | 'imo' | 'swift' | 'passport' | 'name-dob' | 'name-address' | 'name-date' | 'name-un';
export const MATCH_METHODS: MatchMethod[] = ['un-ref', 'imo', 'swift', 'passport', 'name-dob', 'name-address', 'name-date', 'name-un'];

/** One entry on the UK, EU or Japanese list, as that list writes it. */
export interface NationalEntry {
  id: string;
  name: string;
  aliases: string[];
  kind: 'individual' | 'entity' | 'vessel';
  listed: string;
  un?: string;
  unBasis?: boolean;
}
export interface NationalList {
  /** Day we downloaded it. A list whose download failed keeps last week's copy, and this date says so. */
  fetched: string;
  /** The list's own date, when the file gives one. */
  published: string | null;
  file: string;
  entries: NationalEntry[];
}
/** One sanctioned person, company, ship or aircraft, and every list that names it. */
export interface Target {
  name: string;
  kind: OfacKind;
  un?: string;
  on: Partial<Record<ListKey, string[]>>;
  how: Partial<Record<ListKey, MatchMethod>>;
  /** Lists with a same-name entry that nothing else confirms. */
  maybe?: ListKey[];
}

export const SANCTIONS = raw as unknown as {
  /** Day the lists were downloaded. Shown on the page next to every count. */
  fetched: string;
  sources: Record<'un' | 'ofac' | 'uk' | 'eu' | 'jp', string>;
  un: { generated: string | null; individuals: UnEntry[]; entities: UnEntry[] };
  ofac: OfacEntry[];
  national: Record<'uk' | 'eu' | 'jp', NationalList>;
  targets: Target[];
};
export const NATIONAL: Record<NationalKey, NationalList> = { UK: SANCTIONS.national.uk, EU: SANCTIONS.national.eu, JP: SANCTIONS.national.jp };

export const SANCTIONS_PATHS = { en: '/sanctions', ko: '/ko/sanctions', ja: '/ja/sanctions', zh: '/zh/sanctions' } as const;

type L = Record<Lang, string>;

/** Who keeps each list, and where to read it. Names follow local usage in each language. */
export const LISTS: Record<ListKey, { short: L; name: L; publisher: L; page: string; creator: string }> = {
  UN: {
    short: { en: 'UN', ko: '유엔', ja: '国連', zh: '联合国' },
    name: { en: 'UN Security Council', ko: '유엔 안전보장이사회', ja: '国連安全保障理事会', zh: '联合国安理会' },
    publisher: { en: '1718 Committee consolidated list', ko: '1718 제재위원회 통합 명단', ja: '1718委員会の統合リスト', zh: '1718委员会综合名单' },
    page: 'https://main.un.org/securitycouncil/en/sanctions/1718/materials',
    creator: 'UN Security Council 1718 Committee',
  },
  US: {
    short: { en: 'US', ko: '미국', ja: '米国', zh: '美国' },
    name: { en: 'United States', ko: '미국', ja: '米国', zh: '美国' },
    publisher: { en: 'Treasury OFAC, SDN list', ko: '재무부 해외자산통제실(OFAC) SDN 명단', ja: '財務省外国資産管理局（OFAC）SDNリスト', zh: '财政部海外资产控制办公室（OFAC）SDN名单' },
    page: 'https://ofac.treasury.gov/sanctions-programs-and-country-information/north-korea-sanctions',
    creator: 'US Treasury OFAC',
  },
  UK: {
    short: { en: 'UK', ko: '영국', ja: '英国', zh: '英国' },
    name: { en: 'United Kingdom', ko: '영국', ja: '英国', zh: '英国' },
    publisher: { en: 'FCDO, UK Sanctions List', ko: '영국 외교부(FCDO) 제재 명단', ja: '英国外務・英連邦・開発省（FCDO）制裁リスト', zh: '英国外交、联邦和发展事务部（FCDO）制裁名单' },
    page: 'https://www.gov.uk/government/publications/the-uk-sanctions-list',
    creator: 'UK Foreign, Commonwealth & Development Office',
  },
  EU: {
    short: { en: 'EU', ko: 'EU', ja: 'EU', zh: '欧盟' },
    name: { en: 'European Union', ko: '유럽연합', ja: '欧州連合', zh: '欧盟' },
    publisher: { en: 'European Commission, consolidated financial sanctions list', ko: '유럽연합 집행위원회 금융제재 통합 명단', ja: '欧州委員会の金融制裁統合リスト', zh: '欧盟委员会金融制裁综合名单' },
    page: 'https://data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions',
    creator: 'European Commission',
  },
  JP: {
    short: { en: 'Japan', ko: '일본', ja: '日本', zh: '日本' },
    name: { en: 'Japan', ko: '일본', ja: '日本', zh: '日本' },
    publisher: { en: 'Ministry of Finance, asset-freeze list', ko: '재무성 자산동결 대상자 명단', ja: '財務省 資産凍結等対象者一覧', zh: '财务省资产冻结对象名单' },
    page: 'https://www.mof.go.jp/policy/international_policy/gaitame_kawase/gaitame/economic_sanctions/list.html',
    creator: 'Japan Ministry of Finance',
  },
};

/**
 * The UN Security Council resolutions that built the sanctions regime. Summaries follow the 1718 Committee's own
 * resolutions page; the triggering tests match the dates on /military and /missiles.
 */
export const RESOLUTIONS: { no: number; date: string; trigger: L; did: L }[] = [
  {
    no: 1718,
    date: '2006-10-14',
    trigger: { en: 'First nuclear test', ko: '1차 핵실험', ja: '第1回核実験', zh: '第一次核试验' },
    did: {
      en: 'Arms embargo, asset freezes, travel bans and a ban on luxury goods. Sets up the sanctions committee.',
      ko: '무기 금수, 자산 동결, 여행 금지, 사치품 금수. 제재위원회 설치.',
      ja: '武器禁輸、資産凍結、渡航禁止、ぜいたく品の禁輸。制裁委員会を設置。',
      zh: '武器禁运、冻结资产、旅行禁令、禁止奢侈品。设立制裁委员会。',
    },
  },
  {
    no: 1874,
    date: '2009-06-12',
    trigger: { en: 'Second nuclear test', ko: '2차 핵실험', ja: '第2回核実験', zh: '第二次核试验' },
    did: {
      en: 'Embargo widened to nearly all arms. Creates the Panel of Experts that investigates violations.',
      ko: '거의 모든 무기로 금수 확대. 위반을 조사하는 전문가 패널 설치.',
      ja: '禁輸をほぼすべての武器に拡大。違反を調査する専門家パネルを設置。',
      zh: '禁运扩大到几乎所有武器。设立调查违规行为的专家小组。',
    },
  },
  {
    no: 2094,
    date: '2013-03-07',
    trigger: { en: 'Third nuclear test', ko: '3차 핵실험', ja: '第3回核実験', zh: '第三次核试验' },
    did: {
      en: 'Targeted financial sanctions and a longer list of banned weapons items and luxury goods.',
      ko: '표적 금융 제재, 금지 무기 품목과 사치품 목록 확대.',
      ja: '対象を絞った金融制裁。禁止される兵器関連品目とぜいたく品のリストを拡大。',
      zh: '定向金融制裁，扩大禁运武器物项和奢侈品清单。',
    },
  },
  {
    no: 2270,
    date: '2016-03-02',
    trigger: { en: 'Fourth nuclear test', ko: '4차 핵실험', ja: '第4回核実験', zh: '第四次核试验' },
    did: {
      en: 'All cargo to and from North Korea must be inspected. First limits on coal, iron and gold exports.',
      ko: '북한을 오가는 모든 화물 검색 의무화. 석탄, 철, 금 수출에 대한 첫 제한.',
      ja: '北朝鮮を出入りするすべての貨物の検査を義務化。石炭、鉄、金の輸出に初の制限。',
      zh: '所有进出朝鲜的货物必须接受检查。首次限制煤、铁和黄金出口。',
    },
  },
  {
    no: 2321,
    date: '2016-11-30',
    trigger: { en: 'Fifth nuclear test', ko: '5차 핵실험', ja: '第5回核実験', zh: '第五次核试验' },
    did: {
      en: 'Caps coal exports. Bans exports of copper, nickel, silver, zinc and statues.',
      ko: '석탄 수출 상한 설정. 구리, 니켈, 은, 아연, 조형물 수출 금지.',
      ja: '石炭輸出に上限。銅、ニッケル、銀、亜鉛、彫像の輸出を禁止。',
      zh: '为煤炭出口设上限。禁止出口铜、镍、银、锌和雕像。',
    },
  },
  {
    no: 2371,
    date: '2017-08-05',
    trigger: { en: 'Two ICBM tests in July 2017', ko: '2017년 7월 ICBM 두 차례 발사', ja: '2017年7月のICBM発射2回', zh: '2017年7月两次洲际弹道导弹试射' },
    did: {
      en: 'Full ban on exports of coal, iron, iron ore, lead and seafood. No additional workers may be hired abroad.',
      ko: '석탄, 철, 철광석, 납, 수산물 수출 전면 금지. 해외 노동자 신규 고용 금지.',
      ja: '石炭、鉄、鉄鉱石、鉛、海産物の輸出を全面禁止。海外での労働者の新規雇用を禁止。',
      zh: '全面禁止出口煤、铁、铁矿石、铅和海产品。不得在海外新增雇用朝鲜劳工。',
    },
  },
  {
    no: 2375,
    date: '2017-09-11',
    trigger: { en: 'Sixth nuclear test', ko: '6차 핵실험', ja: '第6回核実験', zh: '第六次核试验' },
    did: {
      en: 'Bans textile exports, limits refined petroleum and crude oil, bans joint ventures and new work permits.',
      ko: '섬유 수출 금지, 정제유와 원유 공급 제한, 합작 사업과 신규 노동 허가 금지.',
      ja: '繊維製品の輸出を禁止。石油精製品と原油の供給を制限。合弁事業と新規の就労許可を禁止。',
      zh: '禁止纺织品出口，限制成品油和原油供应，禁止合资企业和新的工作许可。',
    },
  },
  {
    no: 2397,
    date: '2017-12-22',
    trigger: { en: 'Hwasong-15 ICBM test', ko: '화성-15형 ICBM 발사', ja: '火星15型ICBMの発射', zh: '试射“火星-15”洲际弹道导弹' },
    did: {
      en: 'Refined petroleum capped at 500,000 barrels a year and crude oil at 4 million. All workers abroad to be sent home within 24 months. Bans exports of food, machinery and wood.',
      ko: '정제유 연 50만 배럴, 원유 연 400만 배럴로 제한. 해외 노동자 24개월 내 전원 송환. 식품, 기계, 목재 수출 금지.',
      ja: '石油精製品を年50万バレル、原油を年400万バレルに制限。海外労働者を24か月以内に全員送還。食品、機械、木材の輸出を禁止。',
      zh: '成品油每年上限50万桶，原油400万桶。海外劳工须在24个月内全部遣返。禁止出口食品、机械和木材。',
    },
  },
];

export const SANCTION_SOURCES = [
  { name: 'UN Security Council consolidated sanctions list', url: 'https://main.un.org/securitycouncil/en/sanctions/1718/materials' },
  { name: 'UN 1718 Committee: resolutions', url: 'https://main.un.org/securitycouncil/en/sanctions/1718/resolutions' },
  { name: 'US Treasury OFAC: North Korea sanctions', url: 'https://ofac.treasury.gov/sanctions-programs-and-country-information/north-korea-sanctions' },
  { name: 'UK Sanctions List (FCDO)', url: 'https://www.gov.uk/government/publications/the-uk-sanctions-list' },
  { name: 'EU consolidated financial sanctions list', url: 'https://data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions' },
  { name: 'Japan Ministry of Finance: asset-freeze targets (経済制裁措置及び対象者リスト)', url: 'https://www.mof.go.jp/policy/international_policy/gaitame_kawase/gaitame/economic_sanctions/list.html' },
  { name: 'UN: China and Russia veto new sanctions (26 May 2022)', url: 'https://press.un.org/en/2022/sc14911.doc.htm' },
  { name: 'UN: Russia vetoes Panel of Experts renewal (28 March 2024)', url: 'https://press.un.org/en/2024/sc15648.doc.htm' },
  { name: 'Multilateral Sanctions Monitoring Team', url: 'https://msmt.info/' },
];

export interface SanctionsText {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  /** Shown on the translated pages: the lists are official English text. */
  englishNote?: string;
  tiles: { unPeople: string; unEntities: string; us: string; lastUn: string; lastUnNote: string };
  fetched: string;
  byYearTitle: string;
  byYearHint: string;
  stalledTitle: string;
  stalled: string[];
  resolutionsTitle: string;
  resolutionsHint: string;
  after: string;
  profiledTitle: string;
  profiledHint: string;
  unPeopleTitle: string;
  unEntitiesTitle: string;
  unHint: string;
  col: { name: string; role: string; listed: string; ref: string; why: string };
  usTitle: string;
  usHint: string;
  kinds: Record<OfacKind, string>;
  usLookup: string;
  sources: string;
  listsTitle: string;
  listsHint: string;
  listsCol: { list: string; people: string; entities: string; ships: string; total: string; dated: string; fetched: string };
  /** What each list counts, in one line. */
  listNotes: Record<'US' | 'UK' | 'EU' | 'JP', string>;
  /** Shown when a list's download failed and the page uses an earlier copy. */
  kept: string;
  overlapTitle: string;
  overlapHint: string;
  coverTitle: (n: number) => string;
  confirmed: string;
  sameName: string;
  allFive: (n: number) => string;
  beyondTitle: string;
  beyondTiles: { total: string; multi: string; solo: string; maybe: string };
  soloTitle: string;
  soloHint: string;
  methodsTitle: string;
  methodsHint: string;
  methods: Record<MatchMethod, string>;
  /** Short labels for the same methods, used in the tables. */
  methodShort: Record<MatchMethod, string>;
  caveat: string;
  alsoOn: string;
  tableTitle: string;
  tableHint: string;
  filters: { all: string; multi: string; solo: string };
  tcol: { name: string; lists: string; how: string };
  maybeMark: string;
}

export const SANCTIONS_TEXT: Record<Lang, SanctionsText> = {
  en: {
    metaTitle: 'North Korea Sanctions List: Who Is Sanctioned and Why',
    metaDescription:
      'Every person, company and ship sanctioned over North Korea by the UN Security Council, the US, the UK, the EU and Japan: when they were listed, why, and who is on which list.',
    eyebrow: 'Money · Sanctions',
    h1: 'Who is sanctioned over North Korea',
    lede: 'The UN Security Council list binds every country. The United States, the United Kingdom, the European Union and Japan add their own names on top, mostly ships, banks and middlemen that help the regime get around the UN list. Here is everyone on all five lists, and who is on which.',
    tiles: {
      unPeople: 'people on the UN list',
      unEntities: 'companies and agencies on the UN list',
      us: 'names on the US list',
      lastUn: 'last time the UN added anyone',
      lastUnNote: 'nothing since',
    },
    fetched: 'Lists downloaded',
    byYearTitle: 'UN listings by year',
    byYearHint: 'People and entities added to the UN list each year.',
    stalledTitle: 'Why the UN list stopped growing',
    stalled: [
      'New UN sanctions need all five permanent Security Council members to agree. On 26 May 2022 China and Russia vetoed a resolution that would have tightened sanctions after an ICBM launch.',
      'On 28 March 2024 Russia vetoed the yearly renewal of the Panel of Experts, the UN team that had investigated sanctions violations since 2009. The sanctions still apply, but the UN no longer has anyone checking.',
      'A group of governments now publishes its own reports through the Multilateral Sanctions Monitoring Team, outside the UN.',
    ],
    resolutionsTitle: 'What each UN resolution banned',
    resolutionsHint: 'Each round followed a nuclear or long-range missile test.',
    after: 'After',
    profiledTitle: 'Sanctioned people and organizations we profile',
    profiledHint: 'Matched by name and birth year against both lists.',
    unPeopleTitle: 'UN list: people',
    unEntitiesTitle: 'UN list: companies and agencies',
    unHint: 'Asset freeze, and a travel ban for people. Reasons are the UN’s own wording.',
    col: { name: 'Name', role: 'Role', listed: 'Listed', ref: 'UN ref', why: 'Why' },
    usTitle: 'US Treasury list (OFAC)',
    usHint: 'Everyone on the Specially Designated Nationals list under a North Korea program, plus non-proliferation listings that OFAC marks as covered by its North Korea Sanctions Regulations. Americans may not deal with them, and foreign banks that do risk losing access to the US dollar system.',
    kinds: { individual: 'People', entity: 'Companies and agencies', vessel: 'Ships', aircraft: 'Aircraft' },
    usLookup: 'Each name links to its OFAC record.',
    sources: 'Sources',
    listsTitle: 'Five official lists',
    listsHint: 'Entries under each list’s North Korea measures, counted from the official files. Each government keeps its own list, so the same person can appear on several.',
    listsCol: { list: 'List', people: 'People', entities: 'Companies and agencies', ships: 'Ships and aircraft', total: 'Total', dated: 'List dated', fetched: 'Downloaded' },
    listNotes: {
      US: 'Entries under the US North Korea programs, plus entries under the US non-proliferation program that OFAC marks as covered by its North Korea Sanctions Regulations.',
      UK: 'Everyone under the UK’s North Korea regulations (2019), which carry out the UN list and add the UK’s own listings.',
      EU: 'Everyone under Council Regulation (EU) 2017/1509, which carries out the UN list and adds the EU’s own listings.',
      JP: 'Japan’s North Korea asset freezes, both those carrying out UN resolutions and Japan’s own (Ministry of Finance categories 13 to 17). An entry listed under two of them is counted once. Japan publishes names in Japanese and English; this page uses the English.',
    },
    kept: 'kept from an earlier download',
    overlapTitle: 'Who is on which list',
    overlapHint:
      'The lists share no ID system, so we matched the entries ourselves. Two entries count as the same target only when something beyond the name agrees: a UN reference number, an IMO number, a SWIFT code, a passport number, or the name plus a birth date, an address or the UN listing date. A matching name with nothing else to back it is shown as “same name only” and never counted as the same target.',
    coverTitle: (n) => `How many of the ${n} UN-listed targets each government also lists`,
    confirmed: 'confirmed',
    sameName: 'same name only',
    allFive: (n) => `${n} targets are on all five lists.`,
    beyondTitle: 'Beyond the UN list',
    beyondTiles: {
      total: 'targets on a national list but not the UN one',
      multi: 'of them on two or more lists',
      solo: 'listed by one government only',
      maybe: 'with a same-name entry on another list we could not confirm',
    },
    soloTitle: 'Listed by one government only',
    soloHint: 'Not on the UN list, and no entry of the same name on any other list.',
    methodsTitle: 'How the matches were made',
    methodsHint: 'Entries tied to another list by each method. Where several apply, the strongest one counts.',
    methods: {
      'un-ref': 'The national list cites the UN reference number',
      imo: 'Same IMO ship or company number',
      swift: 'Same SWIFT bank code',
      passport: 'Same passport number',
      'name-dob': 'Same name and date of birth',
      'name-address': 'Same name and street address',
      'name-date': 'Same name, listed on the day the UN listed it',
      'name-un': 'Same name, and the list says it carries out the UN listing',
    },
    methodShort: { 'un-ref': 'UN number', imo: 'IMO number', swift: 'SWIFT code', passport: 'passport', 'name-dob': 'name + birth date', 'name-address': 'name + address', 'name-date': 'name + UN listing day', 'name-un': 'name + UN basis' },
    caveat:
      'A target missing from a list here may still be on it under a spelling we could not tie to the others: the EU writes Yongbyon Nuclear Scientific Research Centre, the UK Yongbyon Nuclear Research Centre. The lists also make mistakes. The EU file gives Kim Tong-Ho the UN number of Kim Kyong Ok, so we only trust a cited UN number when the name or a document agrees.',
    alsoOn: 'Also listed by',
    tableTitle: 'Everyone beyond the UN list',
    tableHint: 'One row per target, with the lists that name it. Pick a list to see only its entries.',
    filters: { all: 'All', multi: 'On two or more lists', solo: 'One government only' },
    tcol: { name: 'Name', lists: 'Lists', how: 'Matched by' },
    maybeMark: 'same name on this list, not confirmed',
  },
  ko: {
    metaTitle: '대북 제재 명단: 누가, 왜 제재를 받고 있는가',
    metaDescription:
      '유엔 안전보장이사회, 미국, 영국, EU, 일본이 북한과 관련해 제재한 모든 개인, 기관, 선박의 명단과 지정 일자, 사유, 그리고 누가 어느 명단에 올라 있는지.',
    eyebrow: '자금 · 제재',
    h1: '대북 제재 대상은 누구인가',
    lede: '유엔 안전보장이사회 명단은 모든 국가에 구속력이 있습니다. 미국, 영국, 유럽연합, 일본은 여기에 자체 지정 대상을 더합니다. 대부분 유엔 제재를 피하도록 돕는 선박, 은행, 중개인입니다. 다섯 명단에 오른 모든 대상과, 누가 어느 명단에 있는지 정리했습니다.',
    englishNote: '이름과 지정 사유는 공식 명단의 영어 원문을 그대로 실었습니다.',
    tiles: {
      unPeople: '유엔 명단의 개인',
      unEntities: '유엔 명단의 기관·기업',
      us: '미국 명단의 대상',
      lastUn: '유엔의 마지막 추가 지정',
      lastUnNote: '이후 추가 없음',
    },
    fetched: '명단 내려받은 날짜',
    byYearTitle: '연도별 유엔 제재 지정',
    byYearHint: '해마다 유엔 명단에 추가된 개인과 기관의 수.',
    stalledTitle: '유엔 명단이 더 늘지 않는 이유',
    stalled: [
      '새로운 유엔 제재에는 안보리 상임이사국 5개국 모두의 동의가 필요합니다. 2022년 5월 26일 중국과 러시아는 ICBM 발사 이후 제재를 강화하려던 결의안에 거부권을 행사했습니다.',
      '2024년 3월 28일 러시아는 2009년부터 제재 위반을 조사해 온 유엔 전문가 패널의 임기 연장안에 거부권을 행사했습니다. 제재는 여전히 유효하지만, 유엔 안에서 이행을 감시하는 조직은 사라졌습니다.',
      '현재는 여러 나라 정부가 유엔 밖에서 다국적제재모니터링팀(MSMT)을 통해 자체 보고서를 내고 있습니다.',
    ],
    resolutionsTitle: '각 유엔 결의가 금지한 것',
    resolutionsHint: '모든 결의는 핵실험이나 장거리 미사일 발사 뒤에 채택되었습니다.',
    after: '계기:',
    profiledTitle: '이 사이트에 프로필이 있는 제재 대상',
    profiledHint: '두 명단과 이름, 출생 연도를 대조해 확인했습니다.',
    unPeopleTitle: '유엔 명단: 개인',
    unEntitiesTitle: '유엔 명단: 기관·기업',
    unHint: '자산 동결 대상이며, 개인은 여행 금지 대상이기도 합니다. 사유는 유엔의 원문입니다.',
    col: { name: '이름', role: '직책', listed: '지정일', ref: '유엔 번호', why: '사유' },
    usTitle: '미국 재무부 명단 (OFAC)',
    usHint: '북한 관련 프로그램으로 특별지정제재대상(SDN)에 오른 모든 대상과, 비확산 프로그램 대상 중 OFAC가 북한 제재 규정 적용 대상으로 표시한 항목입니다. 미국인은 이들과 거래할 수 없고, 거래하는 외국 은행은 달러 결제망에서 배제될 위험이 있습니다.',
    kinds: { individual: '개인', entity: '기관·기업', vessel: '선박', aircraft: '항공기' },
    usLookup: '이름을 누르면 OFAC 원문 기록으로 이동합니다.',
    sources: '출처',
    listsTitle: '공식 명단 다섯 개',
    listsHint: '각 명단의 대북 제재 조치에 오른 항목 수를 공식 파일에서 셌습니다. 정부마다 명단을 따로 관리하기 때문에 같은 사람이 여러 명단에 오를 수 있습니다.',
    listsCol: { list: '명단', people: '개인', entities: '기관·기업', ships: '선박·항공기', total: '합계', dated: '명단 기준일', fetched: '내려받은 날짜' },
    listNotes: {
      US: '미국의 북한 관련 프로그램 대상에, 비확산 프로그램 대상 중 OFAC가 북한 제재 규정 적용 대상으로 표시한 항목을 더했습니다.',
      UK: '영국의 2019년 북한 제재 규정에 따른 모든 대상입니다. 유엔 명단을 이행하고 영국 독자 지정을 더한 명단입니다.',
      EU: 'EU 이사회 규정 2017/1509에 따른 모든 대상입니다. 유엔 명단을 이행하고 EU 독자 지정을 더한 명단입니다.',
      JP: '유엔 결의를 이행하는 조치와 일본 독자 조치를 합친 일본의 대북 자산동결 대상입니다(재무성 분류 13~17). 두 조치에 모두 오른 항목은 한 번만 셌습니다. 일본은 이름을 일본어와 영어로 공표하며, 이 페이지는 영어 표기를 씁니다.',
    },
    kept: '이전에 내려받은 사본 사용',
    overlapTitle: '누가 어느 명단에 올라 있나',
    overlapHint:
      '명단끼리 공통 식별번호가 없어서 직접 대조했습니다. 이름 외의 정보가 일치할 때만 같은 대상으로 봅니다. 유엔 참조번호, IMO 번호, SWIFT 코드, 여권 번호, 또는 이름과 함께 생년월일, 주소, 유엔 지정일이 일치하는 경우입니다. 이름만 같고 다른 근거가 없으면 ‘이름만 일치’로 표시하며 같은 대상으로 세지 않습니다.',
    coverTitle: (n) => `유엔 명단의 ${n}개 대상 가운데 각 정부도 지정한 수`,
    confirmed: '확인됨',
    sameName: '이름만 일치',
    allFive: (n) => `${n}개 대상은 다섯 명단 모두에 올라 있습니다.`,
    beyondTitle: '유엔 명단 밖의 대상',
    beyondTiles: {
      total: '유엔 명단에는 없고 각국 명단에 있는 대상',
      multi: '그중 두 개 이상의 명단에 있는 대상',
      solo: '한 정부만 지정한 대상',
      maybe: '다른 명단에 이름이 같은 항목이 있으나 확인하지 못한 대상',
    },
    soloTitle: '한 정부만 지정한 대상',
    soloHint: '유엔 명단에 없고, 다른 어느 명단에도 이름이 같은 항목이 없습니다.',
    methodsTitle: '대조 방법',
    methodsHint: '각 방법으로 다른 명단과 연결된 항목 수입니다. 여러 방법이 해당하면 가장 확실한 방법으로 셉니다.',
    methods: {
      'un-ref': '각국 명단에 유엔 참조번호가 적혀 있음',
      imo: 'IMO 선박·회사 번호가 같음',
      swift: 'SWIFT 은행 코드가 같음',
      passport: '여권 번호가 같음',
      'name-dob': '이름과 생년월일이 같음',
      'name-address': '이름과 주소가 같음',
      'name-date': '이름이 같고 유엔과 같은 날 지정됨',
      'name-un': '이름이 같고 명단에 유엔 지정 이행이라고 적혀 있음',
    },
    methodShort: { 'un-ref': '유엔 번호', imo: 'IMO 번호', swift: 'SWIFT 코드', passport: '여권', 'name-dob': '이름+생년월일', 'name-address': '이름+주소', 'name-date': '이름+유엔 지정일', 'name-un': '이름+유엔 이행' },
    caveat:
      '여기서 어떤 명단에 없다고 나와도, 다른 표기로 올라 있어 연결하지 못했을 수 있습니다. EU는 Yongbyon Nuclear Scientific Research Centre, 영국은 Yongbyon Nuclear Research Centre라고 씁니다. 명단 자체의 오류도 있습니다. EU 파일은 Kim Tong-Ho에게 Kim Kyong Ok의 유엔 번호를 붙여 두었습니다. 그래서 명단에 적힌 유엔 번호는 이름이나 문서 정보도 맞을 때만 씁니다.',
    alsoOn: '함께 지정한 곳',
    tableTitle: '유엔 명단 밖의 모든 대상',
    tableHint: '한 줄이 한 대상이며, 그 대상을 지정한 명단을 함께 보여 줍니다. 명단을 고르면 그 명단의 항목만 보입니다.',
    filters: { all: '전체', multi: '두 개 이상 명단', solo: '한 정부만' },
    tcol: { name: '이름', lists: '명단', how: '대조 근거' },
    maybeMark: '이 명단에 이름이 같은 항목이 있으나 확인되지 않음',
  },
  ja: {
    metaTitle: '対北朝鮮制裁リスト：誰が、なぜ制裁されているのか',
    metaDescription:
      '国連安全保障理事会、米国、英国、EU、日本が北朝鮮に関連して制裁対象としたすべての個人、団体、船舶の一覧。指定日と理由、誰がどのリストに載っているかを掲載。',
    eyebrow: '資金 · 制裁',
    h1: '北朝鮮に関して制裁されているのは誰か',
    lede: '国連安全保障理事会のリストはすべての国を拘束します。米国、英国、欧州連合、日本はそれぞれ独自の指定を加えています。多くは国連制裁の回避を助ける船舶、銀行、仲介者です。5つのリストに載っているすべての対象と、誰がどのリストに載っているかをまとめました。',
    englishNote: '氏名と指定理由は公式リストの英語原文をそのまま掲載しています。',
    tiles: {
      unPeople: '国連リストの個人',
      unEntities: '国連リストの団体・企業',
      us: '米国リストの対象',
      lastUn: '国連による最後の追加指定',
      lastUnNote: 'それ以降の追加なし',
    },
    fetched: 'リスト取得日',
    byYearTitle: '国連制裁指定の年別件数',
    byYearHint: '各年に国連リストへ追加された個人と団体の数。',
    stalledTitle: '国連リストが増えなくなった理由',
    stalled: [
      '新たな国連制裁には安保理常任理事国5か国すべての同意が必要です。2022年5月26日、中国とロシアはICBM発射を受けて制裁を強化する決議案に拒否権を行使しました。',
      '2024年3月28日、ロシアは2009年から制裁違反を調査してきた国連専門家パネルの任期延長に拒否権を行使しました。制裁自体は有効ですが、国連には履行を監視する組織がなくなりました。',
      '現在は複数の国の政府が、国連の外で多国間制裁監視チーム（MSMT）を通じて独自の報告書を公表しています。',
    ],
    resolutionsTitle: '各国連決議が禁止したもの',
    resolutionsHint: 'いずれの決議も核実験または長距離ミサイル発射の後に採択されました。',
    after: 'きっかけ：',
    profiledTitle: '当サイトにプロフィールがある制裁対象',
    profiledHint: '両リストと氏名・生年を照合して確認しています。',
    unPeopleTitle: '国連リスト：個人',
    unEntitiesTitle: '国連リスト：団体・企業',
    unHint: '資産凍結の対象で、個人は渡航禁止の対象でもあります。理由は国連の原文です。',
    col: { name: '名前', role: '役職', listed: '指定日', ref: '国連番号', why: '理由' },
    usTitle: '米国財務省リスト（OFAC）',
    usHint: '北朝鮮関連プログラムで特別指定国民（SDN）リストに載っているすべての対象と、不拡散プログラムの対象のうちOFACが北朝鮮制裁規則の適用対象と明記したものです。米国人は取引を禁じられ、取引した外国の銀行はドル決済網から締め出されるおそれがあります。',
    kinds: { individual: '個人', entity: '団体・企業', vessel: '船舶', aircraft: '航空機' },
    usLookup: '名前をクリックするとOFACの記録が開きます。',
    sources: '出典',
    listsTitle: '5つの公式リスト',
    listsHint: '各リストの北朝鮮関連措置の対象数を、公式ファイルから数えました。政府ごとにリストを作っているため、同じ人物が複数のリストに載ることがあります。',
    listsCol: { list: 'リスト', people: '個人', entities: '団体・企業', ships: '船舶・航空機', total: '合計', dated: 'リストの日付', fetched: '取得日' },
    listNotes: {
      US: '米国の北朝鮮関連プログラムの対象に、不拡散プログラムの対象のうちOFACが北朝鮮制裁規則の適用対象と明記したものを加えています。',
      UK: '英国の2019年北朝鮮制裁規則に基づくすべての対象です。国連リストを履行し、英国独自の指定を加えています。',
      EU: 'EU理事会規則2017/1509に基づくすべての対象です。国連リストを履行し、EU独自の指定を加えています。',
      JP: '国連決議に基づく措置と日本独自の措置を合わせた、北朝鮮関連の資産凍結対象です（財務省の区分13〜17）。両方に載っている対象は1回だけ数えています。日本は氏名を日本語と英語で公表しており、このページでは英語表記を使っています。',
    },
    kept: '以前の取得分を使用',
    overlapTitle: '誰がどのリストに載っているか',
    overlapHint:
      'リスト間に共通の識別番号がないため、当サイトで照合しました。名前以外の情報も一致した場合にだけ同じ対象とみなします。国連参照番号、IMO番号、SWIFTコード、旅券番号、または名前に加えて生年月日、住所、国連の指定日が一致する場合です。名前だけが一致し、ほかに裏付けがないものは「名前のみ一致」と表示し、同じ対象としては数えません。',
    coverTitle: (n) => `国連リストの${n}件の対象のうち、各政府も指定している数`,
    confirmed: '確認済み',
    sameName: '名前のみ一致',
    allFive: (n) => `${n}件の対象は5つのリストすべてに載っています。`,
    beyondTitle: '国連リスト以外の対象',
    beyondTiles: {
      total: '国連リストにはなく各国のリストにある対象',
      multi: 'うち2つ以上のリストにある対象',
      solo: '1つの政府だけが指定している対象',
      maybe: '別のリストに同名の項目があるが確認できなかった対象',
    },
    soloTitle: '1つの政府だけが指定している対象',
    soloHint: '国連リストになく、ほかのどのリストにも同名の項目がありません。',
    methodsTitle: '照合の方法',
    methodsHint: '各方法で別のリストと結び付いた項目の数です。複数の方法が当てはまる場合は、最も確実な方法で数えています。',
    methods: {
      'un-ref': '各国のリストに国連参照番号が記載されている',
      imo: 'IMO船舶・会社番号が同じ',
      swift: 'SWIFT銀行コードが同じ',
      passport: '旅券番号が同じ',
      'name-dob': '名前と生年月日が同じ',
      'name-address': '名前と住所が同じ',
      'name-date': '名前が同じで、国連と同じ日に指定',
      'name-un': '名前が同じで、リストに国連指定の履行と記載',
    },
    methodShort: { 'un-ref': '国連番号', imo: 'IMO番号', swift: 'SWIFTコード', passport: '旅券', 'name-dob': '名前+生年月日', 'name-address': '名前+住所', 'name-date': '名前+国連指定日', 'name-un': '名前+国連の履行' },
    caveat:
      'ここであるリストに載っていないと表示されても、別の表記で載っているため結び付けられなかった可能性があります。EUはYongbyon Nuclear Scientific Research Centre、英国はYongbyon Nuclear Research Centreと書いています。リスト自体の誤りもあります。EUのファイルはKim Tong-HoにKim Kyong Okの国連番号を付けています。そのため、記載された国連番号は名前か文書の情報も一致する場合にだけ使っています。',
    alsoOn: 'ほかに指定しているリスト',
    tableTitle: '国連リスト以外のすべての対象',
    tableHint: '1行が1つの対象で、その対象を載せているリストを示します。リストを選ぶと、そのリストの項目だけが表示されます。',
    filters: { all: 'すべて', multi: '2つ以上のリスト', solo: '1つの政府のみ' },
    tcol: { name: '名前', lists: 'リスト', how: '照合の根拠' },
    maybeMark: 'このリストに同名の項目があるが未確認',
  },
  zh: {
    metaTitle: '对朝制裁名单：谁被制裁，为什么',
    metaDescription:
      '联合国安理会、美国、英国、欧盟和日本因朝鲜问题制裁的所有个人、公司和船只，列入时间和理由，以及谁在哪份名单上。',
    eyebrow: '资金 · 制裁',
    h1: '因朝鲜问题被制裁的是谁',
    lede: '联合国安理会的名单对所有国家都有约束力。美国、英国、欧盟和日本又各自加上自己的对象，大多是帮助朝鲜政权绕过联合国制裁的船只、银行和中间人。这里列出五份名单上的所有对象，以及谁在哪份名单上。',
    englishNote: '姓名和列名理由照录官方名单的英文原文。',
    tiles: {
      unPeople: '联合国名单上的个人',
      unEntities: '联合国名单上的公司和机构',
      us: '美国名单上的对象',
      lastUn: '联合国最近一次新增',
      lastUnNote: '此后再无新增',
    },
    fetched: '名单下载日期',
    byYearTitle: '联合国历年列名',
    byYearHint: '每年新增到联合国名单上的个人和实体数量。',
    stalledTitle: '联合国名单为什么不再增加',
    stalled: [
      '新的联合国制裁需要安理会五个常任理事国全部同意。2022年5月26日，在朝鲜试射洲际弹道导弹之后，中国和俄罗斯否决了一项加强制裁的决议草案。',
      '2024年3月28日，俄罗斯否决了专家小组的年度延期。这个联合国小组自2009年起一直调查违反制裁的行为。制裁仍然有效，但联合国内部已经没有人负责核查。',
      '现在由一些国家政府在联合国之外，通过多边制裁监测小组（MSMT）发布自己的报告。',
    ],
    resolutionsTitle: '每项联合国决议禁止了什么',
    resolutionsHint: '每一轮制裁都紧跟在一次核试验或远程导弹试射之后。',
    after: '起因：',
    profiledTitle: '本站有资料页的被制裁人员和机构',
    profiledHint: '按姓名和出生年份与两份名单核对。',
    unPeopleTitle: '联合国名单：个人',
    unEntitiesTitle: '联合国名单：公司和机构',
    unHint: '冻结资产，个人还受旅行禁令限制。理由为联合国原文。',
    col: { name: '名称', role: '职务', listed: '列名日期', ref: '联合国编号', why: '理由' },
    usTitle: '美国财政部名单（OFAC）',
    usHint: '在朝鲜相关项目下列入特别指定国民（SDN）名单的所有对象，以及OFAC注明适用《朝鲜制裁条例》的防扩散项目对象。美国人不得与其交易，与其往来的外国银行可能被切断美元结算渠道。',
    kinds: { individual: '个人', entity: '公司和机构', vessel: '船只', aircraft: '飞机' },
    usLookup: '点击名称可查看OFAC原始记录。',
    sources: '来源',
    listsTitle: '五份官方名单',
    listsHint: '按官方文件统计各名单中朝鲜相关措施下的条目数。每个政府各自维护名单，所以同一个人可能出现在几份名单上。',
    listsCol: { list: '名单', people: '个人', entities: '公司和机构', ships: '船只和飞机', total: '合计', dated: '名单日期', fetched: '下载日期' },
    listNotes: {
      US: '包括美国朝鲜相关项目下的条目，以及OFAC注明适用《朝鲜制裁条例》的防扩散项目条目。',
      UK: '英国2019年朝鲜制裁条例下的所有对象。该名单执行联合国名单，并加上英国自己的列名。',
      EU: '欧盟理事会第2017/1509号条例下的所有对象。该名单执行联合国名单，并加上欧盟自己的列名。',
      JP: '日本对朝鲜的资产冻结对象，包括执行联合国决议的措施和日本自己的措施（财务省分类13至17）。同时列在两类措施下的对象只计一次。日本用日文和英文公布姓名，本页使用英文写法。',
    },
    kept: '沿用上一次下载的版本',
    overlapTitle: '谁在哪份名单上',
    overlapHint:
      '各名单没有共同的编号体系，所以由本站自行比对。只有名字之外的信息也一致时，两个条目才算同一对象：联合国编号、IMO编号、SWIFT代码、护照号码，或者名字加上出生日期、地址或联合国列名日期。只有名字相同、没有其他依据的，标为“仅名字相同”，不算作同一对象。',
    coverTitle: (n) => `联合国名单上的${n}个对象中，各国政府也列入的数量`,
    confirmed: '已确认',
    sameName: '仅名字相同',
    allFive: (n) => `有${n}个对象同时出现在全部五份名单上。`,
    beyondTitle: '联合国名单之外',
    beyondTiles: {
      total: '不在联合国名单上、但在某国名单上的对象',
      multi: '其中出现在两份以上名单上的',
      solo: '只有一个政府列入的',
      maybe: '在另一份名单上有同名条目但无法确认的',
    },
    soloTitle: '只有一个政府列入的对象',
    soloHint: '不在联合国名单上，其他名单上也没有同名条目。',
    methodsTitle: '比对方法',
    methodsHint: '通过每种方法与其他名单对上的条目数。几种方法都适用时，按最可靠的一种计算。',
    methods: {
      'un-ref': '该国名单注明了联合国编号',
      imo: 'IMO船舶或公司编号相同',
      swift: 'SWIFT银行代码相同',
      passport: '护照号码相同',
      'name-dob': '名字和出生日期相同',
      'name-address': '名字和地址相同',
      'name-date': '名字相同，且与联合国同一天列名',
      'name-un': '名字相同，且名单注明是执行联合国列名',
    },
    methodShort: { 'un-ref': '联合国编号', imo: 'IMO编号', swift: 'SWIFT代码', passport: '护照', 'name-dob': '名字+出生日期', 'name-address': '名字+地址', 'name-date': '名字+联合国列名日', 'name-un': '名字+执行联合国' },
    caveat:
      '某个对象在这里显示不在某份名单上，也可能是以另一种拼写列入、我们没能对上。例如欧盟写作Yongbyon Nuclear Scientific Research Centre，英国写作Yongbyon Nuclear Research Centre。名单本身也有错误：欧盟文件把Kim Kyong Ok的联合国编号标在了Kim Tong-Ho名下。因此，只有名字或证件信息也一致时，我们才采用名单引用的联合国编号。',
    alsoOn: '其他列入方',
    tableTitle: '联合国名单之外的所有对象',
    tableHint: '每行是一个对象，并列出列入它的名单。选择一份名单，只显示该名单的条目。',
    filters: { all: '全部', multi: '两份以上名单', solo: '仅一个政府' },
    tcol: { name: '名称', lists: '名单', how: '比对依据' },
    maybeMark: '该名单上有同名条目，但未确认',
  },
};
