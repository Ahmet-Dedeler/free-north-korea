/**
 * Text and metadata for the home page (/, /ko, /ja, /zh) in every published language.
 */
import type { Lang } from '@/site/seo';
import { HUB_PATHS } from '@/content/translations';

export const HOME_PATHS = HUB_PATHS;

export interface HomeModuleText {
  title: string;
  text: string;
}

export interface QuickActText {
  kicker: string;
  title: string;
  desc: string;
  cta: string;
}

export interface HomeText {
  metaTitle: string;
  metaDescription: string;
  headline: {
    line1: string;
    line2: string;
    beforePill: string;
    afterPill: string;
  };
  heroSub: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroProof: (count: number) => string;
  heroProofNewest: (name: string, date: string) => string;
  mapLabel: string;
  mapAriaLabel: string;
  mapOpenAria: string;
  mapOpen: string;
  mapLegendKey: string;
  legendCamps: string;
  ticker: {
    campsMapped: (n: number) => string;
    launchesSince1984: (n: number) => string;
    watchedFromSpace: (n: number) => string;
    orgsDoingWork: (n: number) => string;
    booksAndFilms: (n: number) => string;
    languages: string;
  };
  quickActsHeading: string;
  quickActsAll: string;
  quickActs: [QuickActText, QuickActText, QuickActText];
  scaleKicker: string;
  scaleBigLabel: string;
  scaleBigNote: string;
  scaleStats: {
    population: { label: string; source: string };
    arrivals: (year: number | string) => { label: string; source: string };
    nukes: { label: string; source: string };
    missiles: { label: string; source: string };
  };
  scalePhotoCaption: string;
  exploreHeading: string;
  modules: [
    HomeModuleText, // People
    { title: string; text: (count: number) => string }, // Missiles
    HomeModuleText, // Military
    HomeModuleText, // Organizations
    HomeModuleText, // Library
  ];
  questionsHeading: string;
  questionsAll: string;
  wallHeading: string;
  wallBody: string;
  wallCtaPrimary: string;
  wallCtaSecondary: string;
  wallCredit: string;
  buildBold: string;
  buildText: string;
  buildCta: string;
}

export const HOME_TEXT: Record<Lang, HomeText> = {
  en: {
    metaTitle: 'Save North Korea: understand North Korea, help its people',
    metaDescription:
      'An open-source hub on North Korea: a map of prison camps and nuclear sites, military capability, every missile test, a library, and the organizations helping North Koreans, with clear ways to act.',
    headline: {
      line1: 'Understand',
      line2: 'North Korea.',
      beforePill: 'Help free its',
      afterPill: 'people.',
    },
    heroSub:
      'The map, the military picture, the history and the groups doing the work, plus clear things you can do today. The regime survives on keeping its people in the dark and everyone else uninterested. This site is for fixing both.',
    heroCtaPrimary: 'What can I do?',
    heroCtaSecondary: 'How could North Korea be freed?',
    heroProof: (count) => `${count} camps and weapons sites watched from space`,
    heroProofNewest: (name, date) => `Newest image: ${name}, ${date}`,
    mapLabel: 'camps and key sites',
    mapAriaLabel: "Map of North Korea's prison camps and key sites",
    mapOpenAria: 'Open the intel map',
    mapOpen: 'Open the intel map',
    mapLegendKey: 'Map key',
    legendCamps: 'Prison camps',
    ticker: {
      campsMapped: (n) => `${n} prison camps and prisons mapped`,
      launchesSince1984: (n) => `${n} missile launches since 1984`,
      watchedFromSpace: (n) => `${n} sites watched from space`,
      orgsDoingWork: (n) => `${n} organizations doing the work`,
      booksAndFilms: (n) => `${n} books, films and reports`,
      languages: 'English, 한국어, 日本語, 中文',
    },
    quickActsHeading: 'Do something in the next 10 minutes',
    quickActsAll: 'All the ways to help',
    quickActs: [
      {
        kicker: 'Free',
        title: 'Mail your old USB drives',
        desc: 'They get wiped, loaded with films and news, and smuggled into North Korea. 140,000+ so far.',
        cta: 'Flash Drives for Freedom',
      },
      {
        kicker: '$3,000 = one person',
        title: 'Fund a rescue',
        desc: 'Liberty in North Korea has brought 1,400+ people from China to safety. Any amount counts toward the next one.',
        cta: 'Donate to LiNK',
      },
      {
        kicker: 'Context',
        title: 'Know what changed in 2025',
        desc: 'Radio Free Asia’s Korean service closed and many groups lost funding. The pipeline into the country is at its weakest in years.',
        cta: 'Read the explainer',
      },
    ],
    scaleKicker: 'The scale of it',
    scaleBigLabel: 'people held in political prison camps',
    scaleBigNote: 'UN inquiry, 2014. Still the most-cited estimate',
    scaleStats: {
      population: {
        label: 'people living under the Kim regime',
        source: 'UN estimate',
      },
      arrivals: (year) => ({
        label: `escapees reached South Korea in ${year}`,
        source: 'Unification Ministry',
      }),
      nukes: {
        label: 'assembled nuclear warheads',
        source: 'SIPRI, Jan 2026',
      },
      missiles: {
        label: 'missile and space launches since 1984',
        source: 'CNS missile test database',
      },
    },
    scalePhotoCaption: 'The peninsula at night. North Korea is the dark half.',
    exploreHeading: 'Explore',
    modules: [
      {
        title: 'People',
        text: 'The Kim family tree and the officials who run the country, with sources and sanctions.',
      },
      {
        title: 'Missile tests',
        text: (count) => `All ${count} missile and space launches since 1984, with flight paths.`,
      },
      {
        title: 'Military',
        text: 'Nukes, missiles, artillery, cyber theft, and the war in Ukraine.',
      },
      {
        title: 'Organizations',
        text: 'Who is doing the work in 2026 and how to help each one.',
      },
      {
        title: 'Library',
        text: 'Escapee memoirs, documentaries, UN reports and open data.',
      },
    ],
    questionsHeading: 'Questions people ask',
    questionsAll: 'All explainers',
    wallHeading: 'Ten minutes is enough to start.',
    wallBody: 'Mail a USB drive, fund a rescue, write to your representative. Every way to help, what it costs and who does the work.',
    wallCtaPrimary: 'What can I do?',
    wallCtaSecondary: 'Groups doing the work',
    wallCredit: 'North Korean farmers, 2009.',
    buildBold: 'Build this with us.',
    buildText: 'Everything here is open source. If you can code, map, translate Korean or spot a wrong fact, you can help.',
    buildCta: 'Contribute on GitHub',
  },
  ko: {
    metaTitle: '북한 구원 (Save North Korea) | 북한 인권과 자유를 위한 오픈소스 정보 허브',
    metaDescription:
      '2,600만 북한 주민의 자유를 위한 오픈소스 인텔리전스 허브: 정치범수용소 지도, 탈북 경로, 미사일 발사 기록, 북한 핵심 인사 관계도, 탈북민 구출 및 지원 단체 안내.',
    headline: {
      line1: '북한을',
      line2: '이해하고.',
      beforePill: '주민들의',
      afterPill: '자유를 돕습니다.',
    },
    heroSub:
      '인텔 지도, 군사력 분석, 체제의 역사, 현장에서 활동하는 단체들, 그리고 오늘 바로 실천할 수 있는 일들을 정리했습니다. 북한 정권은 주민을 어둠 속에 가두고 세계를 무관심하게 만듦으로써 유지됩니다. 이 사이트는 그 두 가지를 깨뜨리기 위한 오픈소스 허브입니다.',
    heroCtaPrimary: '내가 할 수 있는 일',
    heroCtaSecondary: '북한은 어떻게 자유로워질 수 있는가?',
    heroProof: (count) => `우주에서 감시하는 ${count}개 수용소와 군사 시설`,
    heroProofNewest: (name, date) => `최신 위성 사진: ${name}, ${date}`,
    mapLabel: '수용소 및 주요 시설',
    mapAriaLabel: '북한 정치범수용소 및 주요 전략 시설 지도',
    mapOpenAria: '인텔 지도 열기',
    mapOpen: '인텔 지도 열기',
    mapLegendKey: '지도 범례',
    legendCamps: '정치범수용소',
    ticker: {
      campsMapped: (n) => `${n}개 정치범수용소 및 교도소 지도화`,
      launchesSince1984: (n) => `1984년 이후 미사일 발사 ${n}회`,
      watchedFromSpace: (n) => `우주에서 감시하는 ${n}개 시설`,
      orgsDoingWork: (n) => `현장에서 활동하는 ${n}개 단체`,
      booksAndFilms: (n) => `${n}권의 도서, 다큐멘터리 및 보고서`,
      languages: 'English, 한국어, 日本語, 中文',
    },
    quickActsHeading: '앞으로 10분 동안 할 수 있는 일',
    quickActsAll: '모든 실천 방법 보기',
    quickActs: [
      {
        kicker: '무료',
        title: '안 쓰는 USB 드라이브 보내기',
        desc: '데이터를 지우고 한국 영화, 위키백과, 뉴스를 담아 북한으로 들여보냅니다. 지금까지 14만 개 이상 전달되었습니다.',
        cta: 'Flash Drives for Freedom',
      },
      {
        kicker: '3,000달러 = 1명의 자유',
        title: '탈북민 구출 후원하기',
        desc: 'LiNK(Liberty in North Korea)는 중국에서 1,400명 이상의 탈북민을 안전한 곳으로 구출했습니다. 어떤 금액이든 다음 구출에 보탬이 됩니다.',
        cta: 'LiNK에 기부하기',
      },
      {
        kicker: '배경',
        title: '2025년에 무엇이 바뀌었는지 알아보기',
        desc: '자유아시아방송(RFA) 한국어 서비스가 중단되었고 여러 인권 단체의 자금이 끊겼습니다. 대북 정보 유입 통로는 수년 만에 가장 취약해졌습니다.',
        cta: '해설 읽기',
      },
    ],
    scaleKicker: '현실의 규모',
    scaleBigLabel: '정치범수용소에 갇힌 사람들의 수',
    scaleBigNote: '2014년 유엔 조사위원회(COI) 추정치. 현재도 가장 널리 인용되는 기준',
    scaleStats: {
      population: {
        label: '김정은 정권 치하에 사는 북한 주민',
        source: '유엔 추계',
      },
      arrivals: (year) => ({
        label: `${year}년에 한국에 입국한 탈북민`,
        source: '대한민국 통일부',
      }),
      nukes: {
        label: '조립 완료된 핵탄두 추정치',
        source: 'SIPRI, 2026년 1월',
      },
      missiles: {
        label: '1984년 이후 미사일 및 우주 발사 횟수',
        source: 'CNS 미사일 실험 데이터베이스',
      },
    },
    scalePhotoCaption: '밤에 우주에서 본 한반도. 어두운 절반이 북한입니다.',
    exploreHeading: '둘러보기',
    modules: [
      {
        title: '주요 인물',
        text: '김씨 일가 가계도와 국가를 운영하는 핵심 관료들, 출처와 제재 명단.',
      },
      {
        title: '미사일 실험',
        text: (count) => `1984년 이후 감행된 ${count}회의 미사일 및 우주 발사 궤적 전수 데이터.`,
      },
      {
        title: '군사력',
        text: '핵무기, 미사일, 장사정포, 사이버 탈취, 그리고 우크라이나 파병.',
      },
      {
        title: '지원 단체',
        text: '2026년 현재 현장에서 활동하는 단체들과 각각을 돕는 방법.',
      },
      {
        title: '도서관',
        text: '탈북민 회고록, 다큐멘터리, 유엔 보고서, 연구용 오픈 데이터.',
      },
    ],
    questionsHeading: '사람들이 가장 많이 묻는 질문',
    questionsAll: '전체 해설 보기',
    wallHeading: '시작하는 데는 10분이면 충분합니다.',
    wallBody: 'USB 드라이브를 보내거나, 구출을 후원하거나, 대표자에게 편지를 쓰세요. 도울 수 있는 모든 방법과 비용, 일하는 사람들을 정리했습니다.',
    wallCtaPrimary: '내가 할 수 있는 일',
    wallCtaSecondary: '현장에서 일하는 단체들',
    wallCredit: '북한 농민들, 2009년.',
    buildBold: '함께 만들어 가요.',
    buildText: '이곳의 모든 것은 오픈소스입니다. 코딩, 지도 제작, 번역이 가능하시거나 잘못된 사실을 발견하셨다면 기여하실 수 있습니다.',
    buildCta: 'GitHub에서 기여하기',
  },
  ja: {
    metaTitle: '北朝鮮を救う (Save North Korea) | 北朝鮮の現実を知り、自由を拓くためのオープンソース情報ハブ',
    metaDescription:
      '2600万人の北朝鮮住民の自由のためのオープンソース・インテリジェンス・ハブ：政治犯収容所マップ、脱出ルート、ミサイル発射記録、権力中枢の相関図、脱北者支援団体の案内。',
    headline: {
      line1: '北朝鮮を',
      line2: '理解し、',
      beforePill: 'その人々の',
      afterPill: '自由のために。',
    },
    heroSub:
      '軍事・人権地図、軍事力の実態、歴史、現場で活動する団体、そして今日できる具体的なアクション。体制は自国民を暗闇に閉じ込め、世界を無関心に保つことで生き延びています。このサイトは、その両方を変えるためのものです。',
    heroCtaPrimary: '自分にできること',
    heroCtaSecondary: '北朝鮮はどうすれば解放されるか？',
    heroProof: (count) => `宇宙から監視する${count}か所の収容所と軍事拠点`,
    heroProofNewest: (name, date) => `最新画像：${name}、${date}`,
    mapLabel: '収容所と主要拠点',
    mapAriaLabel: '北朝鮮の政治犯収容所および主要軍事拠点マップ',
    mapOpenAria: 'インテル地図を開く',
    mapOpen: 'インテル地図を開く',
    mapLegendKey: '地図の凡例',
    legendCamps: '政治犯収容所',
    ticker: {
      campsMapped: (n) => `${n}か所の収容所・刑務所を地図化`,
      launchesSince1984: (n) => `1984年以降のミサイル発射${n}回`,
      watchedFromSpace: (n) => `宇宙から監視する${n}か所の重要施設`,
      orgsDoingWork: (n) => `現場で活動する${n}の支援団体`,
      booksAndFilms: (n) => `${n}点の書籍・映像・報告書`,
      languages: 'English, 한국어, 日本語, 中文',
    },
    quickActsHeading: '次の10分でできること',
    quickActsAll: 'すべての支援方法を見る',
    quickActs: [
      {
        kicker: '無料',
        title: '使わなくなったUSBメモリを送る',
        desc: 'データを消去し、映画やニュース、ウィキペディアを入れて北朝鮮国内へ運び込みます。これまでに14万本以上。',
        cta: 'Flash Drives for Freedom',
      },
      {
        kicker: '3,000ドル ＝ 1人の命',
        title: '脱北者の救出を支援する',
        desc: 'LiNK（Liberty in North Korea）は中国から1,400人以上の脱北者を安全な場所へ救出しました。少額でも次の1人を救う力になります。',
        cta: 'LiNKへ寄付',
      },
      {
        kicker: '背景',
        title: '2025年に何が変わったかを知る',
        desc: 'ラジオ・フリー・アジア（RFA）朝鮮語放送が停止し、多くの団体が資金難に直面しています。国内への情報ルートはここ数年で最も脆弱です。',
        cta: '解説を読む',
      },
    ],
    scaleKicker: '実態の規模',
    scaleBigLabel: '政治犯収容所に囚われている人々の数',
    scaleBigNote: '2014年国連調査委員会報告。今なお最も引用される推計',
    scaleStats: {
      population: {
        label: '金正恩体制下で暮らす人々',
        source: '国連推計',
      },
      arrivals: (year) => ({
        label: `${year}年に韓国へたどり着いた脱北者`,
        source: '韓国統一部',
      }),
      nukes: {
        label: '組み立て済みの推定核弾頭数',
        source: 'SIPRI、2026年1月',
      },
      missiles: {
        label: '1984年以降のミサイル・宇宙発射回数',
        source: 'CNSミサイル実験データベース',
      },
    },
    scalePhotoCaption: '夜の朝鮮半島。漆黒の北半分が北朝鮮です。',
    exploreHeading: '探求する',
    modules: [
      {
        title: '主要人物',
        text: '金一族の家系図と国を動かす幹部たち。出処付き経歴と制裁指定状況。',
      },
      {
        title: 'ミサイル実験',
        text: (count) => `1984年以降の全${count}回に及ぶ発射実験と飛行軌道データ。`,
      },
      {
        title: '軍事力',
        text: '核、ミサイル、長射程砲、サイバー攻撃、そしてウクライナ戦争への関与。',
      },
      {
        title: '支援団体',
        text: '2026年の今、現場で活動を続ける団体の一覧とそれぞれの支援方法。',
      },
      {
        title: 'ライブラリ',
        text: '脱北者の手記、ドキュメンタリー、国連報告書、オープンデータ。',
      },
    ],
    questionsHeading: 'よくある疑問・深層解説',
    questionsAll: 'すべての解説を見る',
    wallHeading: '始めるのに、10分あれば十分です。',
    wallBody: 'USBメモリを送る、救出活動に寄付する、意見を届ける。あらゆる支援方法、必要な費用、活動する団体をまとめています。',
    wallCtaPrimary: '自分にできること',
    wallCtaSecondary: '活動中の団体一覧',
    wallCredit: '北朝鮮の農民たち、2009年。',
    buildBold: 'このプロジェクトを共に創る。',
    buildText: 'すべてのデータとコードはオープンソースです。開発、地図作成、翻訳、または誤りの指摘など、どなたでも参加できます。',
    buildCta: 'GitHubで貢献する',
  },
  zh: {
    metaTitle: '拯救朝鲜 (Save North Korea) | 了解朝鲜现实、帮助其人民获得自由的开源情报中心',
    metaDescription:
      '为2600万朝鲜居民争取自由的开源情报中心：政治犯收容所地图、脱北路线、导弹试射记录、核心精英图谱以及脱北者援助机构指南。',
    headline: {
      line1: '认识',
      line2: '真实的朝鲜。',
      beforePill: '帮助人民',
      afterPill: '重获自由。',
    },
    heroSub:
      '情报地图、军事实态、历史背景、一线实干的团体，以及你今天就能采取的行动。这个政权赖以维系的根基，是对内封锁信息、对外让世界漠不关心。这个网站正是为了改变这两点而建立。',
    heroCtaPrimary: '我能做些什么？',
    heroCtaSecondary: '朝鲜如何才能走向自由？',
    heroProof: (count) => `自太空监测的${count}处集中营与军事设施`,
    heroProofNewest: (name, date) => `最新图像：${name}，${date}`,
    mapLabel: '集中营与战略据点',
    mapAriaLabel: '朝鲜政治犯收容所及主要军事设施地图',
    mapOpenAria: '打开情报地图',
    mapOpen: '打开情报地图',
    mapLegendKey: '地图图例',
    legendCamps: '政治犯收容所',
    ticker: {
      campsMapped: (n) => `${n}处政治犯收容所与监狱已收录地图`,
      launchesSince1984: (n) => `1984年以来导弹发射${n}次`,
      watchedFromSpace: (n) => `自太空监测的${n}处重点设施`,
      orgsDoingWork: (n) => `一线实干的${n}家援助机构`,
      booksAndFilms: (n) => `${n}部著作、纪录片与调查报告`,
      languages: 'English, 한국어, 日本語, 中文',
    },
    quickActsHeading: '接下来10分钟里能做的事',
    quickActsAll: '所有行动方式',
    quickActs: [
      {
        kicker: '免费',
        title: '寄出闲置的U盘',
        desc: '清除原有数据后装入影视、韩语维基百科和新闻，送入朝鲜境内。迄今已累计转交14万个以上。',
        cta: 'Flash Drives for Freedom',
      },
      {
        kicker: '3,000美元 ＝ 拯救一个人',
        title: '资助一次营救',
        desc: 'LiNK（Liberty in North Korea）已将1,400多名朝鲜难民从中国护送至安全地带。任何金额的捐助都能为下一位难民提供帮助。',
        cta: '向LiNK捐款',
      },
      {
        kicker: '背景',
        title: '了解2025年的重大变化',
        desc: '自由亚洲电台（RFA）韩语部停播，多家非营利机构失去资助。向朝鲜境内传递信息的渠道处于近年最困难的境地。',
        cta: '阅读解读',
      },
    ],
    scaleKicker: '严酷的规模',
    scaleBigLabel: '被关押在政治犯收容所中的人数',
    scaleBigNote: '2014年联合国调查委员会推算。目前仍是最常被引用的基准',
    scaleStats: {
      population: {
        label: '在金正恩政权统治下生活的朝鲜人民',
        source: '联合国估算',
      },
      arrivals: (year) => ({
        label: `${year}年抵达韩国的脱北者人数`,
        source: '韩国统一部',
      }),
      nukes: {
        label: '已组装的核弹头估计数量',
        source: '斯德哥尔摩国际和平研究所（SIPRI），2026年1月',
      },
      missiles: {
        label: '1984年以来的导弹与太空发射总数',
        source: 'CNS导弹试射数据库',
      },
    },
    scalePhotoCaption: '夜晚从太空俯瞰朝鲜半岛。漆黑的一半是朝鲜。',
    exploreHeading: '探索',
    modules: [
      {
        title: '核心人物',
        text: '金氏家族谱系与政权核心官员名录，附带权威来源与制裁记录。',
      },
      {
        title: '导弹试射',
        text: (count) => `1984年以来全部${count}次导弹与航天发射记录，附带飞行轨迹。`,
      },
      {
        title: '军事力量',
        text: '核武、导弹、炮兵、网络盗窃，以及在乌克兰战场的部署实态。',
      },
      {
        title: '援助机构',
        text: '2026年仍在开展实际救助工作的机构名录及参与支持方式。',
      },
      {
        title: '资料库',
        text: '脱北者回忆录、纪录片、联合国调查报告与研究用开放数据。',
      },
    ],
    questionsHeading: '人们常问的问题',
    questionsAll: '阅读全部解读',
    wallHeading: '行动起来，十分钟就足够。',
    wallBody: '寄出U盘、资助一次救援、向代表呼吁。这里汇集了所有参与方式、所需成本以及一线机构。',
    wallCtaPrimary: '我能做些什么？',
    wallCtaSecondary: '一线实干的团体',
    wallCredit: '朝鲜农民，2009年。',
    buildBold: '与我们共同建设。',
    buildText: '这里的全部内容均开源。如果您擅长编程、制图、翻译，或发现了需要更正的客观事实，随时欢迎您的加入。',
    buildCta: '在 GitHub 上参与贡献',
  },
};
