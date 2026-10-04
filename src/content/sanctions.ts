/**
 * Content for /sanctions (and /ko/sanctions, /ja/sanctions).
 *
 * The lists themselves (who is sanctioned) come from data/sanctions.json, built by scripts/build-sanctions.ts from
 * the live UN and OFAC files. This file holds what a list can't say: which resolution did what, and the page text
 * in each language. Names and listing reasons stay in English because that is the official text.
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

export const SANCTIONS = raw as unknown as {
  /** Day the lists were downloaded. Shown on the page next to every count. */
  fetched: string;
  un: { generated: string | null; individuals: UnEntry[]; entities: UnEntry[] };
  ofac: OfacEntry[];
};

export const SANCTIONS_PATHS = { en: '/sanctions', ko: '/ko/sanctions', ja: '/ja/sanctions' } as const;

type L = Record<Lang, string>;

/**
 * The UN Security Council resolutions that built the sanctions regime. Summaries follow the 1718 Committee's own
 * resolutions page; the triggering tests match the dates on /military and /missiles.
 */
export const RESOLUTIONS: { no: number; date: string; trigger: L; did: L }[] = [
  {
    no: 1718,
    date: '2006-10-14',
    trigger: { en: 'First nuclear test', ko: '1차 핵실험', ja: '第1回核実験' },
    did: {
      en: 'Arms embargo, asset freezes, travel bans and a ban on luxury goods. Sets up the sanctions committee.',
      ko: '무기 금수, 자산 동결, 여행 금지, 사치품 금수. 제재위원회 설치.',
      ja: '武器禁輸、資産凍結、渡航禁止、ぜいたく品の禁輸。制裁委員会を設置。',
    },
  },
  {
    no: 1874,
    date: '2009-06-12',
    trigger: { en: 'Second nuclear test', ko: '2차 핵실험', ja: '第2回核実験' },
    did: {
      en: 'Embargo widened to nearly all arms. Creates the Panel of Experts that investigates violations.',
      ko: '거의 모든 무기로 금수 확대. 위반을 조사하는 전문가 패널 설치.',
      ja: '禁輸をほぼすべての武器に拡大。違反を調査する専門家パネルを設置。',
    },
  },
  {
    no: 2094,
    date: '2013-03-07',
    trigger: { en: 'Third nuclear test', ko: '3차 핵실험', ja: '第3回核実験' },
    did: {
      en: 'Targeted financial sanctions and a longer list of banned weapons items and luxury goods.',
      ko: '표적 금융 제재, 금지 무기 품목과 사치품 목록 확대.',
      ja: '対象を絞った金融制裁。禁止される兵器関連品目とぜいたく品のリストを拡大。',
    },
  },
  {
    no: 2270,
    date: '2016-03-02',
    trigger: { en: 'Fourth nuclear test', ko: '4차 핵실험', ja: '第4回核実験' },
    did: {
      en: 'All cargo to and from North Korea must be inspected. First limits on coal, iron and gold exports.',
      ko: '북한을 오가는 모든 화물 검색 의무화. 석탄, 철, 금 수출에 대한 첫 제한.',
      ja: '北朝鮮を出入りするすべての貨物の検査を義務化。石炭、鉄、金の輸出に初の制限。',
    },
  },
  {
    no: 2321,
    date: '2016-11-30',
    trigger: { en: 'Fifth nuclear test', ko: '5차 핵실험', ja: '第5回核実験' },
    did: {
      en: 'Caps coal exports. Bans exports of copper, nickel, silver, zinc and statues.',
      ko: '석탄 수출 상한 설정. 구리, 니켈, 은, 아연, 조형물 수출 금지.',
      ja: '石炭輸出に上限。銅、ニッケル、銀、亜鉛、彫像の輸出を禁止。',
    },
  },
  {
    no: 2371,
    date: '2017-08-05',
    trigger: { en: 'Two ICBM tests in July 2017', ko: '2017년 7월 ICBM 두 차례 발사', ja: '2017年7月のICBM発射2回' },
    did: {
      en: 'Full ban on exports of coal, iron, iron ore, lead and seafood. No additional workers may be hired abroad.',
      ko: '석탄, 철, 철광석, 납, 수산물 수출 전면 금지. 해외 노동자 신규 고용 금지.',
      ja: '石炭、鉄、鉄鉱石、鉛、海産物の輸出を全面禁止。海外での労働者の新規雇用を禁止。',
    },
  },
  {
    no: 2375,
    date: '2017-09-11',
    trigger: { en: 'Sixth nuclear test', ko: '6차 핵실험', ja: '第6回核実験' },
    did: {
      en: 'Bans textile exports, limits refined petroleum and crude oil, bans joint ventures and new work permits.',
      ko: '섬유 수출 금지, 정제유와 원유 공급 제한, 합작 사업과 신규 노동 허가 금지.',
      ja: '繊維製品の輸出を禁止。石油精製品と原油の供給を制限。合弁事業と新規の就労許可を禁止。',
    },
  },
  {
    no: 2397,
    date: '2017-12-22',
    trigger: { en: 'Hwasong-15 ICBM test', ko: '화성-15형 ICBM 발사', ja: '火星15型ICBMの発射' },
    did: {
      en: 'Refined petroleum capped at 500,000 barrels a year and crude oil at 4 million. All workers abroad to be sent home within 24 months. Bans exports of food, machinery and wood.',
      ko: '정제유 연 50만 배럴, 원유 연 400만 배럴로 제한. 해외 노동자 24개월 내 전원 송환. 식품, 기계, 목재 수출 금지.',
      ja: '石油精製品を年50万バレル、原油を年400万バレルに制限。海外労働者を24か月以内に全員送還。食品、機械、木材の輸出を禁止。',
    },
  },
];

export const SANCTION_SOURCES = [
  { name: 'UN Security Council consolidated sanctions list', url: 'https://main.un.org/securitycouncil/en/sanctions/1718/materials' },
  { name: 'UN 1718 Committee: resolutions', url: 'https://main.un.org/securitycouncil/en/sanctions/1718/resolutions' },
  { name: 'US Treasury OFAC: North Korea sanctions', url: 'https://ofac.treasury.gov/sanctions-programs-and-country-information/north-korea-sanctions' },
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
}

export const SANCTIONS_TEXT: Record<Lang, SanctionsText> = {
  en: {
    metaTitle: 'North Korea Sanctions List: Who Is Sanctioned and Why',
    metaDescription:
      'Every person, company and ship sanctioned over North Korea by the UN Security Council and the US Treasury, when they were listed and why, plus what each UN resolution banned.',
    eyebrow: 'Money · Sanctions',
    h1: 'Who is sanctioned over North Korea',
    lede: 'Two lists matter most. The UN Security Council list binds every country. The US Treasury list is longer, because it also reaches the ships, banks and hackers that help the regime get around the UN one.',
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
    usHint: 'Everyone on the Specially Designated Nationals list under a North Korea program. Americans may not deal with them, and foreign banks that do risk losing access to the US dollar system.',
    kinds: { individual: 'People', entity: 'Companies and agencies', vessel: 'Ships', aircraft: 'Aircraft' },
    usLookup: 'Each name links to its OFAC record.',
    sources: 'Sources',
  },
  ko: {
    metaTitle: '대북 제재 명단: 누가, 왜 제재를 받고 있는가',
    metaDescription:
      '유엔 안전보장이사회와 미국 재무부가 북한과 관련해 제재한 모든 개인, 기관, 선박의 명단과 지정 일자, 사유, 그리고 각 유엔 결의가 금지한 내용.',
    eyebrow: '자금 · 제재',
    h1: '대북 제재 대상은 누구인가',
    lede: '가장 중요한 명단은 두 가지입니다. 유엔 안전보장이사회 명단은 모든 국가에 구속력이 있습니다. 미국 재무부 명단은 더 깁니다. 유엔 제재를 피하도록 돕는 선박, 은행, 해커까지 포함하기 때문입니다.',
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
    usHint: '북한 관련 프로그램으로 특별지정제재대상(SDN)에 오른 모든 대상입니다. 미국인은 이들과 거래할 수 없고, 거래하는 외국 은행은 달러 결제망에서 배제될 위험이 있습니다.',
    kinds: { individual: '개인', entity: '기관·기업', vessel: '선박', aircraft: '항공기' },
    usLookup: '이름을 누르면 OFAC 원문 기록으로 이동합니다.',
    sources: '출처',
  },
  ja: {
    metaTitle: '対北朝鮮制裁リスト：誰が、なぜ制裁されているのか',
    metaDescription:
      '国連安全保障理事会と米国財務省が北朝鮮に関連して制裁対象としたすべての個人、団体、船舶の一覧。指定日と理由、各国連決議が禁止した内容も掲載。',
    eyebrow: '資金 · 制裁',
    h1: '北朝鮮に関して制裁されているのは誰か',
    lede: '重要なリストは2つあります。国連安全保障理事会のリストはすべての国を拘束します。米国財務省のリストはそれより長くなっています。国連制裁の回避を助ける船舶、銀行、ハッカーも対象にしているためです。',
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
    usHint: '北朝鮮関連プログラムで特別指定国民（SDN）リストに載っているすべての対象です。米国人は取引を禁じられ、取引した外国の銀行はドル決済網から締め出されるおそれがあります。',
    kinds: { individual: '個人', entity: '団体・企業', vessel: '船舶', aircraft: '航空機' },
    usLookup: '名前をクリックするとOFACの記録が開きます。',
    sources: '出典',
  },
};
