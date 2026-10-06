/**
 * Text for /military in every language the site has. Missile names (Hwasong, KN, Pukguksong, Hwasal) stay in
 * English. Numbers match the English page. Empty nuclear-test notes mean that test has no caption.
 */
import type { MissileType } from '@/missiles/data';
import type { Lang } from '@/site/seo';

export const MILITARY_PATHS = { en: '/military', ko: '/ko/military', ja: '/ja/military', zh: '/zh/military' } as const;

/** The six nuclear tests, all at Punggye-ri. Dates per CTBTO / Wikipedia. */
export const NUKE_TEST_DATES = ['2006-10-09', '2009-05-25', '2013-02-12', '2016-01-06', '2016-09-09', '2017-09-03'] as const;

export const CITY_POINTS = [
  { id: 'seoul', at: [37.5665, 126.978] },
  { id: 'tokyo', at: [35.6762, 139.6503] },
  { id: 'guam', at: [13.4443, 144.7937] },
  { id: 'honolulu', at: [21.3069, -157.8583] },
  { id: 'losAngeles', at: [34.0522, -118.2437] },
  { id: 'washington', at: [38.9072, -77.0369] },
] as const;

export type CityId = (typeof CITY_POINTS)[number]['id'];

/** `range` in km: [shortest, longest]. A null max means the bar stays open ("reaches the whole US"). */
export const MISSILE_SPECS = [
  { id: 'icbm-solid', type: 'ICBM' as const, names: ['Hwasong-18', 'Hwasong-19'] as const, range: [13000, null] as const },
  { id: 'icbm-liquid', type: 'ICBM' as const, names: ['Hwasong-15', 'Hwasong-17'] as const, range: [13000, 13000] as const },
  { id: 'irbm', type: 'HGV' as const, names: ['Hwasong-12', 'Hwasong-16B'] as const, range: [4500, 4500] as const },
  { id: 'slbm', type: 'SLBM' as const, names: ['Pukguksong series'] as const, range: [1000, 2000] as const },
  { id: 'cruise', type: 'Cruise' as const, names: ['Hwasal-1', 'Hwasal-2'] as const, range: [1500, 2000] as const },
  { id: 'srbm', type: 'SRBM' as const, names: ['Hwasong-11 (KN-23/24)', 'KN-25'] as const, range: [300, 800] as const },
] as const;

export type MissileClassId = (typeof MISSILE_SPECS)[number]['id'];

export const MILITARY_SOURCE_URLS = [
  'https://www.sipri.org/media/press-release/2026/increasing-focus-nuclear-weapons-amid-heightened-escalation-risks-new-sipri-yearbook-out-now',
  'https://www.iiss.org/publications/the-military-balance/',
  'https://kyivindependent.com/nearly-11-000-north-korean-troops-stationed-in-russias-kursk-oblast-at-start-of-2026-media-reports/',
  'https://kyivindependent.com/north-korean-troops-took-over-7-000-casualties-in-russias-kursk-oblast-hur-claims/',
  'https://missilethreat.csis.org/country/dprk/',
  'https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/',
  'https://en.wikipedia.org/wiki/List_of_nuclear_weapons_tests_of_North_Korea',
] as const;

type MissileClassText = { cls: string; label: string; note: string };
type SourceNames = readonly [string, string, string, string, string, string, string];
type NukeNotes = readonly [string, string, string, string, string, string];

interface MilitaryText {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  values: {
    warheads: string;
    fissile: string;
    active: string;
    toRussia: string;
    reserves: string;
    service: string;
    seoul: string;
    killed: string;
    casualties: string;
    stolen: string;
  };
  tiles: {
    warheads: string;
    warheadsNote: string;
    fissile: string;
    fissileNote: string;
    activeDuty: string;
    activeDutyNote: string;
    toRussia: string;
    toRussiaNote: string;
  };
  nuclear: {
    title: string;
    body: string;
    aria: string;
    assembled: string;
    more: string;
    notes: NukeNotes;
  };
  missiles: {
    title: string;
    body: string;
    caption: string;
    /** Unit after a formatted distance, including the leading space when the language wants one. */
    km: string;
    testsSince: (n: number) => string;
    testsSource: string;
    explore: string;
    yearTitle: (year: number, n: number) => string;
    classes: Record<MissileClassId, MissileClassText>;
    types: Record<MissileType, string>;
  };
  cities: Record<CityId, string>;
  conventional: {
    title: string;
    active: string;
    activeNote: string;
    reserves: string;
    reservesNote: string;
    service: string;
    seoul: string;
    whyTitle: string;
    whyBody: string;
  };
  ukraine: {
    title: string;
    body: string;
    sends: string;
    troops: string;
    troopsNote: string;
    shells: string;
    missiles: string;
    missilesNote: string;
    receives: string;
    money: string;
    food: string;
    oil: string;
    tech: string;
    techNote: string;
    killed: string;
    killedNote: string;
    casualties: string;
    casualtiesNote: string;
    drones: string;
  };
  cyber: {
    title: string;
    stolenBefore: string;
    stolenAfter: string;
    beforeLazarus: string;
    afterLazarus: string;
    itWorkers: string;
    afterIt: string;
  };
  why: { title: string; body: string; cta: string };
  sourcesTitle: string;
  sourceNames: SourceNames;
  reviewed: (date: string) => string;
}

export const MILITARY_TEXT: Record<Lang, MilitaryText> = {
  en: {
    metaTitle: 'North Korea Military Strength 2026: Nukes, Missiles, Army',
    metaDescription:
      'North Korea’s military in 2026: about 1.28 million active troops, ~60 nuclear warheads, solid-fuel ICBMs, artillery aimed at Seoul, crypto theft and 20,000+ troops sent to Russia.',
    eyebrow: 'Military capability',
    h1: 'North Korea’s military in 2026',
    lede: 'A huge share of a tiny economy goes to the military, and since 2017 that has bought a real nuclear arsenal. All numbers are public estimates, and the sources often disagree.',
    values: {
      warheads: '~60',
      fissile: '~90',
      active: '1.28M',
      toRussia: '20,000+',
      reserves: '~600k',
      service: '~10 yrs',
      seoul: '~25M',
      killed: '~6,000',
      casualties: '7,000+',
      stolen: '$1.5B',
    },
    tiles: {
      warheads: 'nuclear warheads',
      warheadsNote: 'SIPRI, Jan 2026',
      fissile: 'warheads’ worth of fissile material',
      fissileNote: 'SIPRI, Jan 2026',
      activeDuty: 'active-duty troops',
      activeDutyNote: 'IISS Military Balance',
      toRussia: 'troops sent to Russia since 2024',
      toRussiaNote: 'South Korean & Ukrainian intel',
    },
    nuclear: {
      title: 'Nuclear weapons',
      body: 'Six tests between 2006 and 2017, all at Punggye-ri. Plutonium comes from the Yongbyon reactors, enriched uranium from Yongbyon and the covert Kangson site. Since 2023 nuclear status is written into the constitution, and Kim Jong Un has called for "exponential" growth.',
      aria: 'About 60 assembled warheads and material for about 90',
      assembled: '~60 assembled warheads',
      more: 'material for ~30 more',
      notes: ['First test', '', '', 'Claimed H-bomb', '', 'Likely thermonuclear'],
    },
    missiles: {
      title: 'Missiles',
      body: 'Every class from short range to intercontinental. The big shift is solid fuel: those missiles can be hidden and fired in minutes, so they are much harder to destroy before launch.',
      caption: 'Distances are straight-line from Pyongyang. Square-root scale so short-range missiles stay visible.',
      km: ' km',
      testsSince: (n) => `${n} missile tests since 1984`,
      testsSource: 'CNS database',
      explore: 'Explore every test',
      yearTitle: (year, n) => `${year}: ${n} tests`,
      classes: {
        'icbm-solid': {
          cls: 'ICBM, solid fuel',
          label: 'All of the US',
          note: 'Minutes to launch instead of hours. Hwasong-19 first flew in October 2024.',
        },
        'icbm-liquid': {
          cls: 'ICBM, liquid fuel',
          label: '13,000+ km',
          note: 'Hwasong-17 is one of the largest road-mobile missiles in the world.',
        },
        irbm: {
          cls: 'IRBM / hypersonic',
          label: '~4,500 km',
          note: 'Hwasong-16B carries a hypersonic glide vehicle meant to dodge missile defenses.',
        },
        slbm: {
          cls: 'Submarine-launched',
          label: '1,000–2,000+ km',
          note: 'Built and tested at the Sinpo shipyard. Few real submarines to carry them yet.',
        },
        cruise: {
          cls: 'Cruise',
          label: '1,500–2,000 km',
          note: 'Low-altitude cruise missiles, claimed nuclear-capable.',
        },
        srbm: {
          cls: 'Short range',
          label: '300–800 km',
          note: 'Low-flying, maneuvering missiles aimed at South Korea and Japan. Fired at Ukraine by Russia.',
        },
      },
      types: {
        SRBM: 'SRBM',
        MRBM: 'MRBM',
        IRBM: 'IRBM',
        ICBM: 'ICBM',
        SLBM: 'SLBM',
        HGV: 'HGV',
        SLV: 'Space launch',
        Unknown: 'Unidentified',
      },
    },
    cities: {
      seoul: 'Seoul',
      tokyo: 'Tokyo',
      guam: 'Guam',
      honolulu: 'Honolulu',
      losAngeles: 'Los Angeles',
      washington: 'Washington',
    },
    conventional: {
      title: 'Conventional forces',
      active: 'active troops',
      activeNote: 'IISS',
      reserves: 'reserves',
      reservesNote: 'IISS',
      service: 'typical service for men',
      seoul: 'people in Seoul’s metro, in artillery range',
      whyTitle: 'Why there is no military option',
      whyBody:
        'Much of the equipment is Soviet-era, fuel and food are short, and soldiers often work as construction and farm labor. What matters is artillery: thousands of guns and rocket launchers in hardened positions near the DMZ, in range of Seoul. That threat, more than the nukes, is why invasion has never been on the table.',
    },
    ukraine: {
      title: 'The war in Ukraine',
      body: 'Since late 2024 North Korea has sent more than 20,000 troops to Russia, mainly to the Kursk region. A 2024 mutual defense treaty formalized the alliance.',
      sends: 'North Korea sends',
      troops: '20,000+ troops',
      troopsNote: 'mostly to Kursk',
      shells: 'Millions of artillery shells',
      missiles: 'Hwasong-11 missiles',
      missilesNote: 'fired at Ukrainian cities',
      receives: 'Russia gives back',
      money: 'Money',
      food: 'Food',
      oil: 'Oil',
      tech: 'Possibly tech',
      techNote: 'satellites, submarines, air defense',
      killed: 'killed or wounded by early 2026',
      killedNote: 'South Korean intelligence',
      casualties: 'casualties',
      casualtiesNote: 'Ukraine’s HUR',
      drones: 'Its soldiers are also getting real combat experience with drones, which no other army in Asia has.',
    },
    cyber: {
      title: 'Cyber and crypto theft',
      stolenBefore: 'stolen from the ',
      stolenAfter: ' exchange in February 2025, the largest crypto theft ever',
      beforeLazarus: 'Hacking groups often called ',
      afterLazarus: ' steal crypto on a scale no one else does. Thousands of North Korean ',
      itWorkers: 'IT workers',
      afterIt: ' also hold remote jobs at foreign companies under fake identities. UN experts say the money funds the weapons programs.',
    },
    why: {
      title: 'Why this matters for freedom',
      body: 'The weapons are the regime’s insurance against outside pressure, and they cost money that could feed people. Every dollar from crypto theft or arms sales to Russia keeps the elite loyal without reform. Cutting that income is one of the realistic levers.',
      cta: 'How North Korea could be freed →',
    },
    sourcesTitle: 'Sources',
    sourceNames: [
      'SIPRI Yearbook 2026',
      'IISS, The Military Balance',
      'North Korean troops in Kursk, 2026',
      'HUR casualty estimate',
      'CSIS Missile Threat: North Korea',
      'CNS Missile Test Database',
      'Nuclear tests of North Korea',
    ],
    reviewed: (date) => `Last reviewed ${date}.`,
  },

  ko: {
    metaTitle: '2026년 북한 군사력: 핵, 미사일, 군대',
    metaDescription:
      '2026년 북한군: 현역 약 128만 명, 핵탄두 약 60기, 고체연료 ICBM, 서울을 겨냥한 포병, 암호화폐 탈취, 그리고 2024년 이후 러시아에 보낸 병력 2만 명 이상.',
    eyebrow: '군사 능력',
    h1: '2026년 북한의 군사력',
    lede: '작은 경제의 큰 몫이 군으로 들어가고, 2017년 이후 그 돈으로 실제 핵전력을 갖추었습니다. 숫자는 모두 공개된 추정치이며, 출처에 따라 자주 다릅니다.',
    values: {
      warheads: '약 60',
      fissile: '약 90',
      active: '128만',
      toRussia: '2만+',
      reserves: '약 60만',
      service: '약 10년',
      seoul: '약 2,500만',
      killed: '약 6,000',
      casualties: '7,000+',
      stolen: '15억 달러',
    },
    tiles: {
      warheads: '핵탄두',
      warheadsNote: 'SIPRI, 2026년 1월',
      fissile: '탄두 분량의 핵분열성 물질',
      fissileNote: 'SIPRI, 2026년 1월',
      activeDuty: '현역 병력',
      activeDutyNote: 'IISS 밀리터리 밸런스',
      toRussia: '2024년 이후 러시아에 보낸 병력',
      toRussiaNote: '한국·우크라이나 정보기관',
    },
    nuclear: {
      title: '핵무기',
      body: '2006년부터 2017년까지 실험은 여섯 번이고, 모두 풍계리에서 했습니다. 플루토늄은 영변 원자로에서 나오고, 농축 우라늄은 영변과 비밀 시설인 강선에서 나옵니다. 2023년부터 핵보유 지위가 헌법에 들어갔고, 김정은은 "기하급수적" 증강을 요구했습니다.',
      aria: '조립된 탄두 약 60기와 약 90기 분량의 핵물질',
      assembled: '조립된 탄두 약 60기',
      more: '30기를 더 만들 핵물질',
      notes: ['첫 실험', '', '', '수소폭탄 주장', '', '열핵으로 추정'],
    },
    missiles: {
      title: '미사일',
      body: '단거리에서 대륙간까지 모든 종류가 있습니다. 가장 큰 변화는 고체연료입니다. 이런 미사일은 숨겨 두었다가 몇 분 안에 쏠 수 있어서, 발사 전에 파괴하기가 훨씬 어렵습니다.',
      caption: '거리는 평양에서 잰 직선거리입니다. 눈금은 제곱근이라 단거리 미사일도 보이게 했습니다.',
      km: ' km',
      testsSince: (n) => `1984년 이후 미사일 시험 ${n}회`,
      testsSource: 'CNS 데이터베이스',
      explore: '모든 시험 보기',
      yearTitle: (year, n) => `${year}년: 시험 ${n}회`,
      classes: {
        'icbm-solid': {
          cls: '고체연료 ICBM',
          label: '미국 전역',
          note: '발사 준비는 몇 시간이 아니라 몇 분이면 됩니다. Hwasong-19는 2024년 10월에 처음 날았습니다.',
        },
        'icbm-liquid': {
          cls: '액체연료 ICBM',
          label: '13,000km 이상',
          note: 'Hwasong-17은 세계에서 가장 큰 도로 이동식 미사일 가운데 하나입니다.',
        },
        irbm: {
          cls: 'IRBM / 극초음속',
          label: '약 4,500km',
          note: 'Hwasong-16B는 미사일 방어를 피하도록 만든 극초음속 활공체를 탑재합니다.',
        },
        slbm: {
          cls: '잠수함 발사',
          label: '1,000–2,000km 이상',
          note: '신포 조선소에서 만들고 시험했습니다. 이것을 실을 실제 잠수함은 아직 거의 없습니다.',
        },
        cruise: {
          cls: '순항미사일',
          label: '1,500–2,000km',
          note: '저고도로 나는 순항미사일이며, 핵을 실을 수 있다고 주장합니다.',
        },
        srbm: {
          cls: '단거리',
          label: '300–800km',
          note: '한국과 일본을 겨냥해 낮게 날며 기동하는 미사일입니다. 러시아가 우크라이나에 발사했습니다.',
        },
      },
      types: {
        SRBM: 'SRBM',
        MRBM: 'MRBM',
        IRBM: 'IRBM',
        ICBM: 'ICBM',
        SLBM: 'SLBM',
        HGV: 'HGV',
        SLV: '우주 발사',
        Unknown: '미확인',
      },
    },
    cities: {
      seoul: '서울',
      tokyo: '도쿄',
      guam: '괌',
      honolulu: '호놀룰루',
      losAngeles: '로스앤젤레스',
      washington: '워싱턴',
    },
    conventional: {
      title: '재래식 전력',
      active: '현역',
      activeNote: 'IISS',
      reserves: '예비역',
      reservesNote: 'IISS',
      service: '남성의 통상 복무 기간',
      seoul: '포병 사거리 안의 서울 수도권 인구',
      whyTitle: '군사적 선택지가 없는 이유',
      whyBody:
        '장비의 상당수는 소련 시대의 것이고, 연료와 식량이 부족하며, 병사들은 건설과 농사에 동원되는 일이 많습니다. 중요한 것은 포병입니다. 비무장지대 근처의 강화 진지에 포와 로켓포가 수천 문 있고, 서울이 그 사거리 안에 있습니다. 핵보다 이 위협 때문에 침공은 한 번도 선택지에 오른 적이 없습니다.',
    },
    ukraine: {
      title: '우크라이나 전쟁',
      body: '2024년 말부터 북한은 2만 명이 넘는 병력을 러시아에 보냈고, 주로 쿠르스크 지역으로 갔습니다. 2024년 상호방위조약이 이 동맹을 공식화했습니다.',
      sends: '북한이 보내는 것',
      troops: '병력 2만 명 이상',
      troopsNote: '대부분 쿠르스크로',
      shells: '포탄 수백만 발',
      missiles: 'Hwasong-11 미사일',
      missilesNote: '우크라이나 도시에 발사',
      receives: '러시아가 주는 것',
      money: '돈',
      food: '식량',
      oil: '석유',
      tech: '기술일 가능성',
      techNote: '위성, 잠수함, 방공',
      killed: '2026년 초까지 사망 또는 부상',
      killedNote: '한국 정보기관',
      casualties: '사상자',
      casualtiesNote: '우크라이나 HUR',
      drones: '북한 병사들은 드론을 쓰는 실전 경험도 쌓고 있습니다. 아시아의 다른 군대에는 아직 없는 경험입니다.',
    },
    cyber: {
      title: '사이버 공격과 암호화폐 탈취',
      stolenBefore: '2025년 2월 ',
      stolenAfter: ' 거래소에서 도난당한 금액으로, 사상 최대의 암호화폐 탈취입니다.',
      beforeLazarus: '흔히 ',
      afterLazarus: '라고 불리는 해킹 조직은 다른 누구와도 비교가 안 되는 규모로 암호화폐를 훔칩니다. 수천 명의 북한 ',
      itWorkers: 'IT 인력',
      afterIt: '은 가짜 신분으로 외국 회사에서 원격으로 일하기도 합니다. 유엔 전문가들은 이 돈이 무기 프로그램의 자금이 된다고 말합니다.',
    },
    why: {
      title: '이것이 자유에 중요한 이유',
      body: '무기는 외부 압박에 대한 정권의 보험이고, 그 돈이면 사람들을 먹일 수 있습니다. 암호화폐 탈취나 러시아에 무기를 팔아서 들어온 1달러마다, 개혁 없이도 엘리트의 충성이 유지됩니다. 이 수입을 끊는 것이 현실적인 지렛대 가운데 하나입니다.',
      cta: '북한은 어떻게 자유로워질 수 있을까 →',
    },
    sourcesTitle: '출처',
    sourceNames: [
      'SIPRI 연감 2026',
      'IISS, 밀리터리 밸런스',
      '2026년 쿠르스크의 북한군',
      'HUR 사상자 추산',
      'CSIS 미사일 위협: 북한',
      'CNS 미사일 시험 데이터베이스',
      '북한의 핵실험',
    ],
    reviewed: (date) => `마지막 검토 ${date}.`,
  },

  ja: {
    metaTitle: '2026年の北朝鮮の軍事力：核、ミサイル、軍隊',
    metaDescription:
      '2026年の北朝鮮軍。現役約128万人、核弾頭約60発、固体燃料ICBM、ソウルを狙う砲兵、暗号資産の窃取、そして2024年以降にロシアへ送った2万人超の兵力。',
    eyebrow: '軍事能力',
    h1: '2026年の北朝鮮の軍事力',
    lede: '小さな経済の大きな部分が軍事費に回り、2017年以降、その支出で実際の核戦力を手にしました。数字はすべて公開された推計で、出典によってしばしば食い違います。',
    values: {
      warheads: '約60',
      fissile: '約90',
      active: '128万',
      toRussia: '2万+',
      reserves: '約60万',
      service: '約10年',
      seoul: '約2,500万',
      killed: '約6,000',
      casualties: '7,000+',
      stolen: '15億ドル',
    },
    tiles: {
      warheads: '核弾頭',
      warheadsNote: 'SIPRI、2026年1月',
      fissile: '弾頭分の核分裂性物質',
      fissileNote: 'SIPRI、2026年1月',
      activeDuty: '現役兵',
      activeDutyNote: 'IISSミリタリー・バランス',
      toRussia: '2024年以降にロシアへ送った兵',
      toRussiaNote: '韓国・ウクライナの情報機関',
    },
    nuclear: {
      title: '核兵器',
      body: '2006年から2017年までの実験は6回で、すべて豊渓里です。プルトニウムは寧辺の原子炉から、濃縮ウランは寧辺と秘密のカンソン施設から得ています。2023年以降、核保有の地位が憲法に書き込まれ、金正恩は「指数関数的」な増強を求めています。',
      aria: '組み立て済みの弾頭約60発と、約90発分の核物質',
      assembled: '組み立て済み弾頭 約60発',
      more: 'さらに約30発分の核物質',
      notes: ['初の実験', '', '', '水爆と主張', '', '熱核の可能性'],
    },
    missiles: {
      title: 'ミサイル',
      body: '短距離から大陸間まで、すべての種類があります。大きな変化は固体燃料です。これらのミサイルは隠したまま数分で発射できるため、発射前に破壊するのがずっと難しくなっています。',
      caption: '距離は平壌からの直線距離です。目盛りは平方根なので、短距離ミサイルも見えるようにしています。',
      km: ' km',
      testsSince: (n) => `1984年以降のミサイル実験 ${n}回`,
      testsSource: 'CNSデータベース',
      explore: 'すべての実験を見る',
      yearTitle: (year, n) => `${year}年: 実験${n}回`,
      classes: {
        'icbm-solid': {
          cls: '固体燃料ICBM',
          label: '米国全土',
          note: '発射準備は数時間ではなく数分です。Hwasong-19の初飛行は2024年10月です。',
        },
        'icbm-liquid': {
          cls: '液体燃料ICBM',
          label: '13,000km以上',
          note: 'Hwasong-17は、世界最大級の道路移動式ミサイルの一つです。',
        },
        irbm: {
          cls: 'IRBM / 極超音速',
          label: '約4,500km',
          note: 'Hwasong-16Bは、ミサイル防衛をかわすための極超音速滑空体を搭載します。',
        },
        slbm: {
          cls: '潜水艦発射',
          label: '1,000–2,000km以上',
          note: '新浦の造船所で製造し、実験しています。搭載できる実戦的な潜水艦はまだほとんどありません。',
        },
        cruise: {
          cls: '巡航ミサイル',
          label: '1,500–2,000km',
          note: '低空を飛ぶ巡航ミサイルで、核を搭載できると主張しています。',
        },
        srbm: {
          cls: '短距離',
          label: '300–800km',
          note: '韓国と日本を狙い、低空を飛んで機動するミサイルです。ロシアがウクライナへ発射しました。',
        },
      },
      types: {
        SRBM: 'SRBM',
        MRBM: 'MRBM',
        IRBM: 'IRBM',
        ICBM: 'ICBM',
        SLBM: 'SLBM',
        HGV: 'HGV',
        SLV: '宇宙発射',
        Unknown: '未確認',
      },
    },
    cities: {
      seoul: 'ソウル',
      tokyo: '東京',
      guam: 'グアム',
      honolulu: 'ホノルル',
      losAngeles: 'ロサンゼルス',
      washington: 'ワシントン',
    },
    conventional: {
      title: '通常戦力',
      active: '現役',
      activeNote: 'IISS',
      reserves: '予備役',
      reservesNote: 'IISS',
      service: '男性の標準的な兵役',
      seoul: '砲の射程内にいるソウル首都圏の人口',
      whyTitle: '軍事的な選択肢がない理由',
      whyBody:
        '装備の多くはソ連時代のもので、燃料と食料は不足し、兵士は建設や農作業に駆り出されることがよくあります。重要なのは砲兵です。非武装地帯の近くの強化陣地に数千門の火砲とロケット砲があり、ソウルがその射程に入ります。核よりもこの脅威のために、侵攻は一度も選択肢に入ったことがありません。',
    },
    ukraine: {
      title: 'ウクライナでの戦争',
      body: '2024年後半以降、北朝鮮は2万人を超える兵をロシアへ送り、主にクルスク地方に置きました。2024年の相互防衛条約がこの同盟を正式なものとしました。',
      sends: '北朝鮮が送るもの',
      troops: '2万人超の兵',
      troopsNote: '主にクルスクへ',
      shells: '数百万発の砲弾',
      missiles: 'Hwasong-11ミサイル',
      missilesNote: 'ウクライナの都市へ発射',
      receives: 'ロシアが返すもの',
      money: '資金',
      food: '食料',
      oil: '石油',
      tech: '技術の可能性',
      techNote: '衛星、潜水艦、防空',
      killed: '2026年初までに戦死または負傷',
      killedNote: '韓国の情報機関',
      casualties: '死傷者',
      casualtiesNote: 'ウクライナのHUR',
      drones: '北朝鮮の兵士たちはドローンを使った実戦経験も積んでいます。これはアジアの他の軍隊にはまだありません。',
    },
    cyber: {
      title: 'サイバーと暗号資産の窃取',
      stolenBefore: '2025年2月、',
      stolenAfter: '取引所から盗まれた額で、史上最大の暗号資産窃取です。',
      beforeLazarus: '一般に',
      afterLazarus: 'と呼ばれるハッキング集団は、他に類を見ない規模で暗号資産を盗んでいます。数千人の北朝鮮の',
      itWorkers: 'IT労働者',
      afterIt: 'も、偽の身分で外国企業の遠隔勤務に就いています。国連の専門家は、その金が兵器計画の資金になっていると述べています。',
    },
    why: {
      title: 'これが自由にとって重要な理由',
      body: '兵器は外部からの圧力に対する体制の保険であり、その費用は人々を養えたはずの金です。暗号資産の窃取やロシアへの武器売却から入る1ドルごとに、改革なしでエリートの忠誠が保たれます。この収入を断つことが、現実的な手段の一つです。',
      cta: '北朝鮮はどうすれば自由になれるのか →',
    },
    sourcesTitle: '出典',
    sourceNames: [
      'SIPRI年鑑2026',
      'IISS『ミリタリー・バランス』',
      '2026年、クルスクの北朝鮮軍',
      'HURの死傷者推計',
      'CSISミサイル脅威: 北朝鮮',
      'CNSミサイル実験データベース',
      '北朝鮮の核実験',
    ],
    reviewed: (date) => `最終確認 ${date}。`,
  },

  zh: {
    metaTitle: '2026年朝鲜军力：核武器、导弹、军队',
    metaDescription:
      '2026年的朝鲜军队：现役约128万人，核弹头约60枚，固体燃料洲际导弹，瞄准首尔的火炮，加密货币盗窃，以及2024年以来派往俄罗斯的2万多名军人。',
    eyebrow: '军事能力',
    h1: '2026年的朝鲜军队',
    lede: '一个很小的经济体把很大一份花在军队上，2017年以来，这笔钱换成了真正的核武库。这里的数字都是公开估计，不同来源经常对不上。',
    values: {
      warheads: '约60',
      fissile: '约90',
      active: '128万',
      toRussia: '2万+',
      reserves: '约60万',
      service: '约10年',
      seoul: '约2,500万',
      killed: '约6,000',
      casualties: '7,000+',
      stolen: '15亿美元',
    },
    tiles: {
      warheads: '核弹头',
      warheadsNote: 'SIPRI，2026年1月',
      fissile: '弹头当量的裂变材料',
      fissileNote: 'SIPRI，2026年1月',
      activeDuty: '现役军人',
      activeDutyNote: 'IISS《军事平衡》',
      toRussia: '2024年以来派往俄罗斯的军人',
      toRussiaNote: '韩国和乌克兰情报机构',
    },
    nuclear: {
      title: '核武器',
      body: '2006年到2017年进行了六次核试验，全部在丰溪里。钚来自宁边的反应堆，浓缩铀来自宁边和秘密的降仙场址。2023年起，有核国家的地位写进了宪法，金正恩要求“指数级”增长。',
      aria: '约60枚已组装弹头，以及大约90枚的材料',
      assembled: '约60枚已组装弹头',
      more: '还可再造约30枚的材料',
      notes: ['首次试验', '', '', '声称氢弹', '', '很可能是热核'],
    },
    missiles: {
      title: '导弹',
      body: '从短程到洲际，各个类别都有。最大的变化是固体燃料。这些导弹可以藏起来，几分钟内发射，因此在发射前摧毁它们要难得多。',
      caption: '距离是从平壤量起的直线距离。刻度用平方根，这样短程导弹也看得见。',
      km: '公里',
      testsSince: (n) => `1984年以来的导弹试验 ${n}次`,
      testsSource: 'CNS数据库',
      explore: '查看每一次试验',
      yearTitle: (year, n) => `${year}年：${n}次试验`,
      classes: {
        'icbm-solid': {
          cls: '固体燃料洲际导弹',
          label: '美国全境',
          note: '准备发射只要几分钟，不是几小时。Hwasong-19在2024年10月首次飞行。',
        },
        'icbm-liquid': {
          cls: '液体燃料洲际导弹',
          label: '13,000公里以上',
          note: 'Hwasong-17是世界上最大的公路机动导弹之一。',
        },
        irbm: {
          cls: '中远程 / 高超音速',
          label: '约4,500公里',
          note: 'Hwasong-16B携带高超音速滑翔体，用来躲开导弹防御。',
        },
        slbm: {
          cls: '潜射导弹',
          label: '1,000–2,000公里以上',
          note: '在新浦造船厂制造和试验。能携带它们的实战潜艇还很少。',
        },
        cruise: {
          cls: '巡航导弹',
          label: '1,500–2,000公里',
          note: '低空巡航导弹，声称可以携带核弹头。',
        },
        srbm: {
          cls: '短程导弹',
          label: '300–800公里',
          note: '瞄准韩国和日本，低空飞行并机动。俄罗斯曾用它们打击乌克兰。',
        },
      },
      types: {
        SRBM: 'SRBM',
        MRBM: 'MRBM',
        IRBM: 'IRBM',
        ICBM: 'ICBM',
        SLBM: 'SLBM',
        HGV: 'HGV',
        SLV: '航天发射',
        Unknown: '未识别',
      },
    },
    cities: {
      seoul: '首尔',
      tokyo: '东京',
      guam: '关岛',
      honolulu: '火奴鲁鲁',
      losAngeles: '洛杉矶',
      washington: '华盛顿',
    },
    conventional: {
      title: '常规力量',
      active: '现役',
      activeNote: 'IISS',
      reserves: '预备役',
      reservesNote: 'IISS',
      service: '男性通常服役年限',
      seoul: '处在炮兵射程内的首尔都市圈人口',
      whyTitle: '为什么没有军事选项',
      whyBody:
        '装备很大一部分是苏联时期的，燃料和粮食都紧缺，士兵经常被派去施工和务农。真正要紧的是炮兵：非军事区附近的坚固阵地上有数千门火炮和火箭炮，首尔在射程之内。比起核武器，正是这个威胁使得入侵从来都不是选项。',
    },
    ukraine: {
      title: '乌克兰战争',
      body: '2024年末以来，朝鲜向俄罗斯派出了两万多名军人，主要派往库尔斯克地区。2024年的共同防御条约把这个同盟正式定了下来。',
      sends: '朝鲜送出',
      troops: '2万多名军人',
      troopsNote: '大多去库尔斯克',
      shells: '数百万发炮弹',
      missiles: 'Hwasong-11导弹',
      missilesNote: '用于打击乌克兰城市',
      receives: '俄罗斯给回',
      money: '钱',
      food: '粮食',
      oil: '石油',
      tech: '可能还有技术',
      techNote: '卫星、潜艇、防空',
      killed: '到2026年初已死亡或负伤',
      killedNote: '韩国情报机构',
      casualties: '伤亡',
      casualtiesNote: '乌克兰HUR',
      drones: '朝鲜士兵还在获得使用无人机的实战经验，这是亚洲其他军队都没有的。',
    },
    cyber: {
      title: '网络攻击与加密货币盗窃',
      stolenBefore: '2025年2月从',
      stolenAfter: '交易所盗走，是有史以来最大的一笔加密货币盗窃。',
      beforeLazarus: '常被称作',
      afterLazarus: '的黑客组织，以无人能及的规模盗窃加密货币。还有数千名朝鲜',
      itWorkers: 'IT人员',
      afterIt: '用假身份在外国公司远程工作。联合国专家说，这些钱用来给武器计划提供资金。',
    },
    why: {
      title: '这对自由为什么重要',
      body: '这些武器是政权应对外部压力的保险，花的是本来可以用来养活人的钱。从盗窃加密货币或向俄罗斯出售武器得到的每一美元，都让精英不用改革也能继续效忠。切断这笔收入，是现实的办法之一。',
      cta: '朝鲜怎样才能获得自由 →',
    },
    sourcesTitle: '来源',
    sourceNames: [
      'SIPRI年鉴2026',
      'IISS《军事平衡》',
      '2026年库尔斯克的朝鲜军队',
      'HUR伤亡估计',
      'CSIS导弹威胁：朝鲜',
      'CNS导弹试验数据库',
      '朝鲜的核试验',
    ],
    reviewed: (date) => `最近核对 ${date}。`,
  },
};
