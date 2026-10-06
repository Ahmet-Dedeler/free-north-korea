/**
 * Text for /organizations. English summaries, notes, help labels, categories, status and kind stay in orgs.ts
 * (lang === 'en', and the other pages that import them). This file is the page chrome in every language, plus
 * Korean, Japanese and Chinese overlays keyed by org id.
 */
import { ORGS, STATUS_LABEL, type Org, type OrgCategory, type OrgKind, type OrgStatus } from './orgs';
import type { Lang } from '@/site/seo';

export const ORG_PATHS = { en: '/organizations', ko: '/ko/organizations', ja: '/ja/organizations', zh: '/zh/organizations' } as const;

export function orgHref(lang: Lang, id: string) {
  return `${ORG_PATHS[lang]}#${id}`;
}

/** English comes from orgs.ts. Other languages use the overlay, falling back to English if a row is missing. */
export function orgSummary(org: Org, lang: Lang) {
  if (lang === 'en') return org.summary;
  return ORG_LABELS[lang].orgs[org.id]?.summary ?? org.summary;
}

export function orgStatusLabel(org: Org, lang: Lang) {
  if (lang === 'en') return STATUS_LABEL[org.status];
  return ORG_LABELS[lang].status[org.status];
}

export function orgHelpLabel(org: Org, index: number, lang: Lang) {
  const en = org.help[index]?.label;
  if (!en || lang === 'en') return en;
  return ORG_LABELS[lang].orgs[org.id]?.help[index] ?? en;
}

export type OrgPageText = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: (count: number, checked: string) => string;
  /** Question, then the link, then closing punctuation. English and Korean keep a trailing space. */
  footerBefore: string;
  footerLink: string;
  footerAfter: string;
  all: string;
  filterLabel: string;
  founded: (year: number) => string;
  website: string;
  /** `siteLang` is the English word stored on the org, currently only "Korean". */
  websiteIn: (siteLang: string) => string;
};

export type OrgOverlay = {
  summary: string;
  note?: string;
  /** Same order and length as `help` in orgs.ts. */
  help: string[];
};

export type OrgLabels = {
  categories: Record<OrgCategory, { label: string; hint: string }>;
  status: Record<OrgStatus, string>;
  kind: Record<OrgKind, string>;
  orgs: Record<string, OrgOverlay>;
};

function copy(summary: string, extra?: { note?: string; help?: string[] }): OrgOverlay {
  return { summary, ...(extra?.note ? { note: extra.note } : {}), help: extra?.help ?? [] };
}

const koSiteLang = (siteLang: string) => (siteLang === 'Korean' ? '한국어' : siteLang);
const jaSiteLang = (siteLang: string) => (siteLang === 'Korean' ? '韓国語' : siteLang);
const zhSiteLang = (siteLang: string) => (siteLang === 'Korean' ? '韩语' : siteLang);

export const ORG_PAGE: Record<Lang, OrgPageText> = {
  en: {
    metaTitle: 'North Korea Human Rights Organizations (2026 Directory)',
    metaDescription:
      "Organizations and people helping North Koreans in 2026: refugee rescue, USB and radio into North Korea, documentation, resettlement, freezing the regime's stolen crypto and research, with status and how to help each.",
    eyebrow: 'Directory',
    h1: 'Who is helping North Koreans',
    lede: (count, checked) =>
      `${count} groups and people doing rescue, information, documentation, resettlement, research, and cutting off the regime's stolen crypto. Not only nonprofits: a lone investigator who freezes Lazarus money counts too. Several lost US funding in 2025, so we mark that too. Status was last checked ${checked}. This isn't an endorsement or an audit, so do your own reading before giving big amounts.`,
    footerBefore: 'Missing a group, or is something out of date? ',
    footerLink: 'Tell us on GitHub',
    footerAfter: '.',
    all: 'All',
    filterLabel: 'Filter by focus',
    founded: (year) => `since ${year}`,
    website: 'Website',
    websiteIn: (siteLang) => `Website (${siteLang})`,
  },
  ko: {
    metaTitle: '북한 인권 단체 (2026년 목록)',
    metaDescription:
      '2026년 북한 사람들을 돕는 단체와 개인. 탈북민 구출, 북한으로 들어가는 USB와 라디오, 기록, 정착, 정권이 훔친 암호화폐 동결, 연구. 각 단체의 상태와 돕는 방법.',
    eyebrow: '목록',
    h1: '북한 사람들을 돕는 이들은 누구인가',
    lede: (count, checked) =>
      `${count}개 단체와 개인이 구출, 정보, 기록, 정착, 연구, 그리고 정권이 훔친 암호화폐를 끊는 일을 합니다. 비영리단체만 있는 것은 아닙니다. 라자루스의 돈을 동결하는 조사자 한 명도 포함합니다. 2025년에 미국 자금을 잃은 곳이 여러 곳입니다. 그것도 표시합니다. 상태를 마지막으로 확인한 날은 ${checked}입니다. 여기에 올렸다고 해서 추천도 아니고 실사도 아닙니다. 큰돈을 주기 전에 직접 읽어 주세요.`,
    footerBefore: '빠진 단체가 있거나, 내용이 오래됐나요? ',
    footerLink: 'GitHub에 알려 주세요',
    footerAfter: '.',
    all: '전체',
    filterLabel: '분야로 거르기',
    founded: (year) => `${year}년부터`,
    website: '웹사이트',
    websiteIn: (siteLang) => `웹사이트 (${koSiteLang(siteLang)})`,
  },
  ja: {
    metaTitle: '北朝鮮の人権団体（2026年の一覧）',
    metaDescription:
      '2026年に北朝鮮の人々を助けている団体と個人。難民の救出、北朝鮮へ入れるUSBとラジオ、記録、定住支援、政権が盗んだ暗号資産の凍結、調査。それぞれの状態と助け方。',
    eyebrow: '一覧',
    h1: '北朝鮮の人々を助けているのは誰か',
    lede: (count, checked) =>
      `${count}の団体と個人が、救出、情報、記録、定住、調査、そして政権が盗んだ暗号資産を断つ仕事をしています。非営利団体だけではありません。ラザルスの金を凍結する一人の調査者も数に入っています。2025年に米国の資金を失ったところがいくつかあるので、それも表示しています。状態を最後に確認した日は${checked}です。ここに載せたことは推薦ではなく、監査でもありません。大きな額を出す前に、自分で読んでください。`,
    footerBefore: '載っていない団体がある、または内容が古いですか？',
    footerLink: 'GitHubで教えてください',
    footerAfter: '。',
    all: 'すべて',
    filterLabel: '分野で絞り込む',
    founded: (year) => `${year}年から`,
    website: 'サイト',
    websiteIn: (siteLang) => `サイト（${jaSiteLang(siteLang)}）`,
  },
  zh: {
    metaTitle: '朝鲜人权组织（2026年名录）',
    metaDescription:
      '2026年帮助朝鲜人的团体和个人：救援难民，把U盘和广播送进朝鲜，记录，安置，冻结政权盗取的加密货币，以及研究。每家的状态和帮忙的办法。',
    eyebrow: '名录',
    h1: '谁在帮助朝鲜人',
    lede: (count, checked) =>
      `${count}个团体和个人在做救援、信息、记录、安置、研究，以及切断政权盗取的加密货币。不只是非营利组织。一个能冻结拉撒路资金的个人调查者也算在内。有几家在2025年失去了美国资金，这一点也标了出来。状态最后核对的日期是${checked}。列在这里不是背书，也不是审计。拿出大笔钱之前，请自己先读一读。`,
    footerBefore: '有遗漏的团体，或者有内容过时了吗？',
    footerLink: '请在GitHub上告诉我们',
    footerAfter: '。',
    all: '全部',
    filterLabel: '按领域筛选',
    founded: (year) => `${year}年起`,
    website: '网站',
    websiteIn: (siteLang) => `网站（${zhSiteLang(siteLang)}）`,
  },
};

export const ORG_LABELS: Record<Exclude<Lang, 'en'>, OrgLabels> = {
  ko: {
    categories: {
      rescue: { label: '구출', hint: '중국에 있는 사람들을 안전한 곳으로 데려옵니다' },
      information: { label: '정보 반입', hint: '라디오, USB, 미디어를 북한으로 보냅니다' },
      documentation: { label: '기록', hint: '훗날의 정의를 위해 인권 침해를 기록합니다' },
      resettlement: { label: '정착', hint: '탈북민을 위한 교육과 지원' },
      money: { label: '자금 차단', hint: '정권이 훔친 암호화폐를 추적하고 동결합니다' },
      research: { label: '연구', hint: '분석, 위성영상, 데이터' },
      news: { label: '뉴스', hint: '북한을 다루고, 북한 안에서 전하는 보도' },
      advocacy: { label: '옹호', hint: '각국 정부와 유엔에 압력을 넣습니다' },
    },
    status: {
      active: '활동 중',
      'at-risk': '활동 중, 자금 타격',
      paused: '중단',
      unclear: '상태 불명',
    },
    kind: { individual: '개인', company: '회사' },
    orgs: {
      'liberty-in-north-korea': copy(
        '중국에 있는 탈북민을 동남아시아의 안전한 곳으로 구출하는 비용을 댑니다. 정착을 돕고, 그들의 이야기를 전하며 캠페인도 합니다.',
        {
          note: '지금까지 구출 1,400건 이상, 2025년에 17건입니다. 한 건에 약 3,000달러입니다.',
          help: ['구출에 기부하기', '모금 시작하기'],
        },
      ),
      'flash-drives-for-freedom': copy(
        '쓰던 USB를 모아 영화, 한국어 위키백과, 뉴스를 담고, 협력 단체를 통해 북한으로 들여보냅니다.',
        {
          note: '2026년에도 계속하고 있습니다. 기부했거나 기부를 약속한 USB가 140,000개 이상입니다.',
          help: ['쓰던 USB 보내기'],
        },
      ),
      'unification-media-group': copy('북한 안의 청취자를 위한 라디오 방송과 미디어를 만듭니다. 상당 부분을 탈북민이 만듭니다.', {
        note: '2025년 7월 자유아시아방송(RFA) 한국어 서비스가 문을 닫은 뒤 남은 몇 안 되는 방송사 중 하나입니다. 2025년 미국 지원금 삭감의 영향을 받았습니다.',
      }),
      'daily-nk': copy('북한 내부 취재원 네트워크의 뉴스입니다. 시장 물가, 단속, 처형, 일상을 전합니다.', {
        note: '2025년 미국 자금 삭감 이후 위험에 놓인 단체로 휴먼라이츠워치(HRW)가 이름을 올렸습니다.',
      }),
      nkdb: copy('탈북민을 인터뷰하고, 북한 인권 침해에 관한 가장 큰 데이터베이스와 교도소 데이터베이스를 유지합니다.', {
        note: '2025년 미국 지원금 삭감의 영향을 받았습니다.',
      }),
      tjwg: copy('처형지와 매장지를 지도로 만들고, 훗날의 책임 규명과 전환기 정의를 위한 증거를 쌓습니다.'),
      'korea-future': copy('북한 형벌 제도 안의 인권 침해를 사건마다 기록하고, 피해자와 가해자를 특정합니다.'),
      hrnk: copy('연구와 옹호를 합니다. 표준 자료는 수용소별 위성영상 보고서와 『The Hidden Gulag』입니다.', {
        help: ['보고서'],
      }),
      nkhr: copy('가장 오래된 북한 인권 단체 가운데 하나입니다. 옹호, 교육, 탈북민 지원을 합니다.', {
        note: '2026년에 30년이 되었습니다.',
      }),
      pscore: copy('탈북민이 세웠습니다. 한국에 사는 탈북민을 위한 교육 프로그램과 일대일 학습 지도를 하고, 옹호 활동도 합니다.', {
        help: ['학습 지도자로 자원하기'],
      }),
      fsi: copy(
        '탈북민에게 영어 자원교사와 발표 지도자를 연결합니다. 탈북민이 교사를 직접 고릅니다. 지금까지 탈북민 600명 이상, 자원봉사자 1,200명 이상입니다.',
        { help: ['가르치기로 자원하기', '기부하기'] },
      ),
      'crossing-borders': copy('중국에 숨어 있는 탈북민, 특히 여성과 어린이, 그리고 그곳에서 북한 어머니에게 태어난 아이를 돌봅니다.'),
      durihana: copy('북한 주민이 중국을 거쳐 탈출하도록 도와 온 기독교 단체입니다. 서울에서 어린 탈북민을 위한 학교도 운영합니다.'),
      nauh: copy('지성호가 세운, 탈북민이 이끄는 단체입니다. 구출 지원, 정보 활동, 옹호를 합니다.'),
      'nk-watch': copy('전직 수용소 경비원 안명철이 세웠습니다. 수용소 생존자의 증언을 모으고, 유엔에 사건을 제기합니다.'),
      'nk-freedom-coalition': copy('북한자유주간을 여는 단체들의 연합입니다. 난민과 인권 문제로 미국 정부에 로비합니다.'),
      'ohchr-seoul': copy(
        '2014년 유엔 북한인권조사위원회 이후 설치된 유엔 현장 사무소입니다. 탈북민을 인터뷰하고, 책임 규명을 위한 중심 기록을 보관합니다.',
      ),
      '38-north': copy('북한을 분석합니다. 핵과 미사일 시설의 상업 위성영상으로 가장 알려져 있습니다. DPRK 디지털 아틀라스를 운영합니다.', {
        help: ['DPRK 디지털 아틀라스'],
      }),
      'beyond-parallel': copy('미사일 기지, 수용소, 경제의 위성영상과 데이터를 다루고, 북한 안에 있는 사람들을 대상으로 설문을 합니다.'),
      'nk-news': copy(
        '북한을 다루는 독립 언론입니다. NK Pro는 유료 연구 도구(선박 추적, 조선중앙통신(KCNA) 아카이브, 지도부 추적)를 더합니다.',
      ),
      hrw: copy('연례 국가 보고서와 캠페인을 냅니다. 중국에서 북한으로의 강제송환도 다룹니다.', { help: ['북한 페이지'] }),
      zachxbt: copy(
        '가명으로 활동하는 블록체인 조사자입니다. 도난 암호화폐를 추적하고, 2025년 15억 달러 바이비트 해킹의 범인으로 라자루스를 지목했으며, 북한 자금이 세탁되기 전에 거래소와 스테이블코인 발행사가 그 돈을 동결하게 합니다.',
        {
          note: '2022년 이후 북한과 연결된 7,500만 달러가 넘는 금액을 동결하는 데 기여했습니다. 2025년에는 라자루스 세탁 조직에 잠입했고, 그 일로 약 442,000 USDT가 동결되었습니다.',
          help: ['조사 읽기', '7,500만 달러 수치'],
        },
      ),
      tayvano: copy(
        '2016년부터 북한 해커를 추적해 온 보안 연구자입니다. 라자루스와 자매 조직의 소행으로 여겨지는 모든 탈취의 공개 목록을 유지하고, 암호화폐 프로젝트에 고용된 북한 IT 노동자를 드러냅니다.',
        {
          note: '2016년부터 2026년 9월 비트겟 3억 5,000만 달러 탈취까지, 사건 295건 이상과 도난 암호화폐 69억 달러 이상이 기록되어 있습니다.',
          help: ['라자루스 탈취 목록'],
        },
      ),
      seal: copy(
        '자원봉사자인 보안 연구자들입니다. SEAL 911은 해킹을 당하고 있는 사람이면 누구나 쓸 수 있는 무료 24시간 연중무휴 핫라인입니다. 안내서는 기업이 북한 IT 노동자를 알아보고 막는 방법을 알려 줍니다.',
        { help: ['북한 IT 노동자 알아보기'] },
      ),
      'lazarus-bounty': copy(
        '라자루스가 거래소 바이비트에서 15억 달러를 훔친 뒤 바이비트가 개설한 현상금 사이트입니다. 훔친 돈을 추적해 동결시키면, 동결된 금액의 10%를 받습니다.',
        { note: '내놓은 현상금은 최대 1억 4,000만 달러입니다.', help: ['도난 자금 추적하기'] },
      ),
      'leaflet-groups': copy('탈북민이 이끄는 단체들입니다. 풍선에 전단, USB, 달러, 쌀을 실어 국경 너머로 보냈습니다.', {
        note: '2025년, 한국 정부가 중지를 요청하고 풍선 살포 금지를 집행한 뒤 대부분 멈췄습니다.',
        help: ['멈춘 이유'],
      }),
    },
  },
  ja: {
    categories: {
      rescue: { label: '救出', hint: '中国にいる人を安全な場所へ連れ出します' },
      information: { label: '情報搬入', hint: 'ラジオ、USB、メディアを北朝鮮へ送り込みます' },
      documentation: { label: '記録', hint: '将来の正義のために人権侵害を記録します' },
      resettlement: { label: '定住支援', hint: '脱北者への教育と支援' },
      money: { label: '資金を断つ', hint: '政権が盗んだ暗号資産を追跡し、凍結します' },
      research: { label: '調査', hint: '分析、衛星画像、データ' },
      news: { label: '報道', hint: '北朝鮮について、そして内部からの報道' },
      advocacy: { label: '働きかけ', hint: '各国政府と国連への圧力' },
    },
    status: {
      active: '活動中',
      'at-risk': '活動中、資金に打撃',
      paused: '休止',
      unclear: '状況不明',
    },
    kind: { individual: '個人', company: '会社' },
    orgs: {
      'liberty-in-north-korea': copy(
        '中国にいる北朝鮮の難民を東南アジアの安全な場所へ救出する費用を出します。定住を支え、本人たちの話を伝え、キャンペーンもしています。',
        {
          note: 'これまでに救出1,400件以上、2025年は17件です。1件あたり約3,000ドルです。',
          help: ['救出に寄付する', '募金を始める'],
        },
      ),
      'flash-drives-for-freedom': copy(
        '使用済みのUSBを集め、映画、韓国語版ウィキペディア、ニュースを入れて、協力団体を通じて北朝鮮へ送り込みます。',
        {
          note: '2026年も続いています。寄付された、または寄付を約束されたUSBは140,000本以上です。',
          help: ['古いUSBを送る'],
        },
      ),
      'unification-media-group': copy('北朝鮮国内の聴取者向けにラジオ放送とメディアを作ります。かなりの部分を脱北者が作っています。', {
        note: '2025年7月に自由アジア放送（RFA）の韓国語放送が終わったあと、残っている数少ない放送局の一つです。2025年の米国助成金削減の影響を受けています。',
      }),
      'daily-nk': copy('北朝鮮内部の情報源ネットワークからのニュースです。市場価格、取り締まり、処刑、日常生活を伝えます。', {
        note: '2025年の米国資金削減のあと、危険にさらされた団体としてヒューマン・ライツ・ウォッチ（HRW）が名を挙げました。',
      }),
      nkdb: copy('脱北者に聞き取りをし、北朝鮮の人権侵害について最大のデータベースと、刑務所のデータベースを維持しています。', {
        note: '2025年の米国助成金削減の影響を受けています。',
      }),
      tjwg: copy('処刑地と埋葬地を地図にし、将来の責任追及と移行期正義のための証拠を積み上げています。'),
      'korea-future': copy('北朝鮮の刑罰制度の中の侵害を一件ずつ記録し、被害者と加害者を特定しています。'),
      hrnk: copy('調査と働きかけをしています。標準的な資料は、収容所ごとの衛星画像報告と『The Hidden Gulag』です。', {
        help: ['報告書'],
      }),
      nkhr: copy('最も古い北朝鮮人権団体の一つです。働きかけ、教育、脱北者への支援をしています。', {
        note: '2026年に30年を迎えました。',
      }),
      pscore: copy('脱北者が設立しました。韓国にいる脱北者のための教育プログラムと一対一の学習支援をし、働きかけもしています。', {
        help: ['学習の支援者として参加する'],
      }),
      fsi: copy(
        '脱北者を、ボランティアの英語講師と話し方の指導者に結び付けます。講師は脱北者自身が選びます。これまでに脱北者600人以上、ボランティア1,200人以上です。',
        { help: ['教える側として参加する', '寄付する'] },
      ),
      'crossing-borders': copy(
        '中国に隠れている北朝鮮の難民、特に女性と子ども、そこで北朝鮮人の母親から生まれた子どもを支えています。',
      ),
      durihana: copy('北朝鮮の人が中国経由で脱出するのを助けてきたキリスト教の団体です。ソウルで若い脱北者のための学校も運営しています。'),
      nauh: copy('チ・ソンホが設立し、脱北者が率いる団体です。救出の支援、情報活動、働きかけをしています。'),
      'nk-watch': copy('元収容所看守のアン・ミョンチョルが設立しました。収容所の生存者から証言を集め、国連に案件を出しています。'),
      'nk-freedom-coalition': copy('北朝鮮自由週間を開く団体の連合です。難民と人権について米国政府にロビー活動をしています。'),
      'ohchr-seoul': copy(
        '2014年の国連北朝鮮人権調査委員会のあと設置された国連の現地事務所です。脱北者に聞き取りをし、責任追及のための中心的な記録を保管しています。',
      ),
      '38-north': copy('北朝鮮を分析しています。核・ミサイル施設の商用衛星画像で最も知られています。DPRKデジタルアトラスを運営しています。', {
        help: ['DPRKデジタルアトラス'],
      }),
      'beyond-parallel': copy('ミサイル基地、収容所、経済の衛星画像とデータを扱い、北朝鮮の中にいる人への調査もしています。'),
      'nk-news': copy(
        '北朝鮮を扱う独立した報道です。NK Proは有料の調査ツール（船舶追跡、朝鮮中央通信（KCNA）のアーカイブ、指導部の追跡）を加えています。',
      ),
      hrw: copy('年次の国別報告とキャンペーンを出しています。中国から北朝鮮への強制送還も扱っています。', {
        help: ['北朝鮮のページ'],
      }),
      zachxbt: copy(
        '仮名で活動するブロックチェーン調査者です。盗まれた暗号資産を追跡し、2025年にBybitから15億ドルが盗まれた事件の犯人をラザルスだと名指しし、洗浄される前に取引所とステーブルコインの発行体が北朝鮮の資金を凍結するようにしています。',
        {
          note: '2022年以降、北朝鮮に結び付く7,500万ドル超を凍結するのを助けてきました。2025年にはラザルスの洗浄グループに潜入し、その結果約442,000 USDTが凍結されました。',
          help: ['調査を読む', '7,500万ドルの数字'],
        },
      ),
      tayvano: copy(
        '2016年から北朝鮮のハッカーを追っているセキュリティ研究者です。ラザルスとその姉妹組織の犯行とされるすべての強奪の公開リストを維持し、暗号資産のプロジェクトに雇われた北朝鮮のIT労働者を暴いています。',
        {
          note: '2016年から2026年9月のBitgetでの3億5,000万ドルの盗難まで、295件以上の事件と69億ドル以上の盗まれた暗号資産が記録されています。',
          help: ['ラザルスの強奪リスト'],
        },
      ),
      seal: copy(
        'ボランティアのセキュリティ研究者です。SEAL 911は、ハッキングされている人なら誰でも使える無料のホットラインで、24時間、年中無休です。手引きは、企業が北朝鮮のIT労働者を見分け、止める方法を教えています。',
        { help: ['北朝鮮のIT労働者を見分ける'] },
      ),
      'lazarus-bounty': copy(
        '取引所Bybitが、ラザルスに15億ドルを盗まれたあとに開いた報奨金サイトです。盗まれた金を追跡して凍結させると、凍結された額の10%を受け取れます。',
        { note: '用意されている報奨金は最大1億4,000万ドルです。', help: ['盗まれた資金を追う'] },
      ),
      'leaflet-groups': copy('脱北者が率いる複数の団体です。ビラ、USB、ドル、米を風船に載せて国境の向こうへ飛ばしていました。', {
        note: '2025年、韓国政府が中止を求め、風船を飛ばす禁止を執行したあと、ほとんど止まりました。',
        help: ['止まった理由'],
      }),
    },
  },
  zh: {
    categories: {
      rescue: { label: '救援', hint: '把人从中国带到安全的地方' },
      information: { label: '信息送入', hint: '把广播、U盘和媒体送进朝鲜' },
      documentation: { label: '记录', hint: '为将来的正义记录人权侵害' },
      resettlement: { label: '安置', hint: '为脱北者提供教育和支持' },
      money: { label: '切断资金', hint: '追踪并冻结政权盗取的加密货币' },
      research: { label: '研究', hint: '分析、卫星图像、数据' },
      news: { label: '新闻', hint: '报道朝鲜，也报道来自朝鲜内部的消息' },
      advocacy: { label: '倡导', hint: '向各国政府和联合国施压' },
    },
    status: {
      active: '仍在活动',
      'at-risk': '仍在活动，资金受冲击',
      paused: '暂停',
      unclear: '状态不明',
    },
    kind: { individual: '个人', company: '公司' },
    orgs: {
      'liberty-in-north-korea': copy(
        '出资把在中国的朝鲜难民救到东南亚的安全地方，再帮助他们安置。也讲述他们的经历，并做倡导活动。',
        {
          note: '迄今救援1,400次以上，2025年17次。每次约3,000美元。',
          help: ['为救援捐款', '发起筹款'],
        },
      ),
      'flash-drives-for-freedom': copy('收集用过的U盘，装上电影、韩语维基百科和新闻，再通过合作团体送进朝鲜。', {
        note: '2026年仍在进行。已捐赠或已承诺的U盘在140,000个以上。',
        help: ['寄出旧U盘'],
      }),
      'unification-media-group': copy('制作面向朝鲜境内听众的广播和媒体，其中很大一部分由脱北者制作。', {
        note: '自由亚洲电台（RFA）韩语部于2025年7月停播之后，还在播出的少数广播机构之一。受到2025年美国拨款削减的影响。',
      }),
      'daily-nk': copy('来自朝鲜境内消息来源网络的新闻：市场价格、打击、处决、日常生活。', {
        note: '人权观察（HRW）把它列为2025年美国资助削减后处境危险的团体之一。',
      }),
      nkdb: copy('访谈脱北者，维护最大的一份朝鲜人权侵害数据库，以及一份监狱数据库。', {
        note: '受到2025年美国拨款削减的影响。',
      }),
      tjwg: copy('把处决地点和埋葬地点做成地图，为将来的追责和过渡司法积累证据。'),
      'korea-future': copy('按个案记录朝鲜刑罚体系中的侵害，并查明受害者和加害者。'),
      hrnk: copy('做研究和倡导。各劳改营的卫星图像报告和《The Hidden Gulag》是这一领域的标准资料。', {
        help: ['报告'],
      }),
      nkhr: copy('最早的朝鲜人权团体之一。做倡导、教育和对脱北者的支持。', { note: '2026年满30年。' }),
      pscore: copy('由脱北者创立。为在韩国的朝鲜人办教育项目和一对一辅导，并做倡导。', { help: ['报名做辅导'] }),
      fsi: copy('为脱北者配对志愿英语教师和演讲教练。难民自己选老师。迄今有600名以上的难民、1,200名以上的志愿者。', {
        help: ['报名去教课', '捐款'],
      }),
      'crossing-borders': copy('照料藏在中国的朝鲜难民，尤其是妇女和儿童，包括在当地由朝鲜母亲生下的孩子。'),
      durihana: copy('基督教团体，帮助朝鲜人经中国逃出，并在首尔为年轻脱北者办一所学校。'),
      nauh: copy('由池成虎创立、脱北者领导的团体。做救援支持、信息工作和倡导。'),
      'nk-watch': copy('由前劳改营看守安明哲创立。收集劳改营幸存者的证词，并向联合国提交案件。'),
      'nk-freedom-coalition': copy('举办朝鲜自由周的团体联盟。就难民和人权问题游说美国政府。'),
      'ohchr-seoul': copy('2014年联合国朝鲜人权调查委员会之后设立的联合国外地办事处。访谈脱北者，并为追责保存一份核心记录。'),
      '38-north': copy('分析朝鲜，最出名的是核设施和导弹设施的商业卫星图像。运营DPRK数字地图集。', {
        help: ['DPRK数字地图集'],
      }),
      'beyond-parallel': copy('关于导弹基地、劳改营和经济的卫星图像与数据，以及对朝鲜境内居民的调查。'),
      'nk-news': copy('报道朝鲜的独立新闻。NK Pro另有付费研究工具（船舶追踪、朝中社（KCNA）档案、领导人追踪）。'),
      hrw: copy('发布年度国别报告和倡导活动，包括中国把人强制遣返回朝鲜。', { help: ['朝鲜页面'] }),
      zachxbt: copy(
        '使用化名、在区块链上做调查的人。追踪被盗的加密货币，在2025年Bybit 15亿美元被盗案中指认拉撒路为作案者，并促使交易所和稳定币发行方在朝鲜资金被洗钱之前将其冻结。',
        {
          note: '自2022年以来，帮助冻结了与朝鲜有关的超过7,500万美元。2025年他潜入一个拉撒路洗钱团伙，约442,000 USDT因此被冻结。',
          help: ['阅读他的调查', '7,500万美元这个数字'],
        },
      ),
      tayvano: copy(
        '自2016年起追踪朝鲜黑客的安全研究员。维护一份公开清单，列出归为拉撒路及其姐妹单位所为的每一笔劫案，并揭露被加密项目聘用的朝鲜IT人员。',
        {
          note: '从2016年到2026年9月Bitget被盗3.5亿美元，记录在案的有295起以上的事件，被盗加密货币在69亿美元以上。',
          help: ['拉撒路劫案清单'],
        },
      ),
      seal: copy(
        '志愿安全研究员。SEAL 911是一条免费的全天候热线，正在遭到黑客攻击的人都可以用。他们的指南教公司如何识别并阻止朝鲜IT人员。',
        { help: ['识别朝鲜IT人员'] },
      ),
      'lazarus-bounty': copy(
        '拉撒路从Bybit盗走15亿美元之后，Bybit开设的赏金网站。谁追踪被盗资金并使其被冻结，就拿到被冻结金额的10%。',
        { note: '悬赏最高1.4亿美元。', help: ['追查被盗资金'] },
      ),
      'leaflet-groups': copy('由脱北者领导的团体，用气球把传单、U盘、美元和大米放飞过边境。', {
        note: '2025年韩国要求这些团体停止，并执行了放飞禁令，之后大多已经停下。',
        help: ['他们为什么停了'],
      }),
    },
  },
};

for (const lang of ['ko', 'ja', 'zh'] as const) {
  const pack = ORG_LABELS[lang];
  for (const org of ORGS) {
    const row = pack.orgs[org.id];
    if (!row) throw new Error(`orgsI18n: missing ${lang} overlay for ${org.id}`);
    if (row.help.length !== org.help.length) {
      throw new Error(`orgsI18n: ${lang} ${org.id} has ${row.help.length} help labels, English has ${org.help.length}`);
    }
    if (Boolean(org.note) !== Boolean(row.note)) throw new Error(`orgsI18n: ${lang} ${org.id} note does not match English`);
    if (row.help.some((label) => label.trim() === '')) throw new Error(`orgsI18n: ${lang} ${org.id} has an empty help label`);
  }
}
