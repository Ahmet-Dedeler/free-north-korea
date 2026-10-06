/**
 * Text for /places and /places/[slug] in English, Korean, Japanese and Simplified Chinese.
 * English place names stay in the data. This file translates category labels, status lines, notes
 * and the page chrome. English notes for curated places are taken from PLACES so they cannot drift.
 * Missile-base notes are the CSIS summaries, after the same decode as places-data.ts.
 */
import { PLACE_CATEGORIES, PLACES, type PlaceCategory } from './places';
import type { Lang, Languages } from '@/site/seo';

export const PLACES_PATHS = { en: '/places', ko: '/ko/places', ja: '/ja/places', zh: '/zh/places' } as const;

export function placeLanguages(slug: string): Languages {
  return {
    en: `/places/${slug}`,
    ko: `/ko/places/${slug}`,
    ja: `/ja/places/${slug}`,
    zh: `/zh/places/${slug}`,
  };
}

/** Prefix a site path. /map and the missile explorer stay unprefixed; /missiles/list does not. */
export function placeHref(lang: Lang, path: string): string {
  if (lang === 'en') return path;
  if (path === '/missiles' || path.startsWith('/missiles#') || path.startsWith('/map')) return path;
  return `/${lang}${path}`;
}

type CatText = { label: string; hint: string };
type Copy = { status?: string; note: string };

const EN_CATS = Object.fromEntries(PLACE_CATEGORIES.map((c) => [c.id, { label: c.label, hint: c.hint }])) as Record<PlaceCategory, CatText>;

export const PLACE_CATEGORY_TEXT: Record<Lang, Record<PlaceCategory, CatText>> = {
  en: EN_CATS,
  ko: {
    camp: { label: '수용소', hint: '정치범수용소(관리소)와 교화소' },
    nuclear: { label: '핵', hint: '원자로, 농축, 실험장, 우라늄' },
    missile: { label: '미사일·우주', hint: '발사장, 시험장, 잠수함 기지' },
    regime: { label: '체제', hint: '평양에 있는 권력의 자리와 상징' },
    border: { label: '국경·월경', hint: '사람들이 중국으로 넘는 곳, 그리고 비무장지대' },
    economy: { label: '경제', hint: '광산, 구역, 과시용 사업' },
    route: { label: '탈북 경로', hint: '자유까지 가는 보통의 3,000마일 길' },
  },
  ja: {
    camp: { label: '収容所', hint: '政治犯収容所（管理所）と刑務所（教化所）' },
    nuclear: { label: '核', hint: '原子炉、濃縮、実験場、ウラン' },
    missile: { label: 'ミサイル・宇宙', hint: '発射場、試験場、潜水艦基地' },
    regime: { label: '体制', hint: '平壌にある権力の座と象徴' },
    border: { label: '国境・越境', hint: '人が中国へ越える地点と、非武装地帯' },
    economy: { label: '経済', hint: '鉱山、区域、見せるための事業' },
    route: { label: '脱出ルート', hint: '自由までの、ふつうの3,000マイルの道' },
  },
  zh: {
    camp: { label: '集中营', hint: '政治犯集中营（管理所）和监狱（教化所）' },
    nuclear: { label: '核', hint: '反应堆、浓缩、试验场、铀' },
    missile: { label: '导弹与航天', hint: '发射场、试验场、潜艇基地' },
    regime: { label: '政权', hint: '平壤的权力所在与象征' },
    border: { label: '边境与越境', hint: '人们进入中国的地点，以及非军事区' },
    economy: { label: '经济', hint: '矿山、园区和样板工程' },
    route: { label: '脱北路线', hint: '通向自由的通常3,000英里路线' },
  },
};

export const PLACES_TEXT: Record<
  Lang,
  {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    h1: string;
    lede: string;
    openMap: string;
    mapLabel: string;
    mapAria: string;
    dossierTitle: (name: string) => string;
    dossierDescription: (name: string, category: string, note: string) => string;
    keySites: string;
    status: string;
    province: (name: string) => string;
    county: (name: string) => string;
    csisReport: string;
    openOnMap: string;
    military: string;
    readMore: string;
    source: string;
    moreSites: (label: string) => string;
    locationAria: (name: string) => string;
    ogKickerFallback: string;
    ogTitleFallback: string;
  }
> = {
  en: {
    metaTitle: 'Key Sites & Strategic Facilities in North Korea',
    metaDescription:
      'Comprehensive directory of North Korea\u2019s strategic installations: nuclear complexes, undeclared missile operating bases, border crossing points, regime monuments, and economic zones.',
    eyebrow: 'Strategic geography',
    h1: 'Key sites in North Korea',
    lede: 'Where the bombs are made, where the missiles launch from, where power sits and where people cross the border.',
    openMap: 'Open the intel map',
    mapLabel: 'strategic sites',
    mapAria: 'Location of strategic sites in North Korea',
    dossierTitle: (name) => `${name}: North Korea Strategic Site Dossier`,
    dossierDescription: (name, category, note) => `${name} (${category}): ${note}`,
    keySites: 'Key sites',
    status: 'status',
    province: (name) => `${name} province`,
    county: (name) => `${name} county`,
    csisReport: 'CSIS report',
    openOnMap: 'Open on the intel map',
    military: 'North Korea\u2019s military',
    readMore: 'Read more',
    source: 'Source',
    moreSites: (label) => `More ${label.toLowerCase()} sites`,
    locationAria: (name) => `Location of ${name} in North Korea`,
    ogKickerFallback: 'Key site',
    ogTitleFallback: 'North Korea key sites',
  },
  ko: {
    metaTitle: '북한의 주요 시설과 전략 거점',
    metaDescription:
      '북한의 전략 시설 목록입니다. 핵 단지, 미신고 미사일 작전 기지, 국경 통과 지점, 체제 기념물, 경제 구역을 담습니다.',
    eyebrow: '전략 지리',
    h1: '북한의 주요 시설',
    lede: '폭탄을 만드는 곳, 미사일을 쏘는 곳, 권력이 있는 곳, 사람들이 국경을 넘는 곳입니다.',
    openMap: '정보 지도 열기',
    mapLabel: '전략 시설',
    mapAria: '북한의 전략 시설 위치',
    dossierTitle: (name) => `${name}: 북한 전략 시설 자료`,
    dossierDescription: (name, category, note) => `${name} (${category}): ${note}`,
    keySites: '주요 시설',
    status: '상태',
    province: (name) => `${name} 도`,
    county: (name) => `${name} 군`,
    csisReport: 'CSIS 보고서',
    openOnMap: '정보 지도에서 열기',
    military: '북한의 군사',
    readMore: '더 읽기',
    source: '출처',
    moreSites: (label) => `다른 ${label} 시설`,
    locationAria: (name) => `북한에서 ${name}의 위치`,
    ogKickerFallback: '주요 시설',
    ogTitleFallback: '북한의 주요 시설',
  },
  ja: {
    metaTitle: '北朝鮮の主要施設と戦略拠点',
    metaDescription:
      '北朝鮮の戦略施設の一覧です。核施設、未申告のミサイル運用基地、国境の通過地点、体制の記念物、経済区域をまとめています。',
    eyebrow: '戦略地理',
    h1: '北朝鮮の主要施設',
    lede: '爆弾を作る場所、ミサイルを撃つ場所、権力が座る場所、人が国境を越える場所です。',
    openMap: '情報地図を開く',
    mapLabel: '戦略施設',
    mapAria: '北朝鮮の戦略施設の位置',
    dossierTitle: (name) => `${name}: 北朝鮮の戦略施設`,
    dossierDescription: (name, category, note) => `${name} (${category}): ${note}`,
    keySites: '主要施設',
    status: '状態',
    province: (name) => `${name}道`,
    county: (name) => `${name}郡`,
    csisReport: 'CSISの報告',
    openOnMap: '情報地図で開く',
    military: '北朝鮮の軍事',
    readMore: '続きを読む',
    source: '出典',
    moreSites: (label) => `ほかの${label}の施設`,
    locationAria: (name) => `北朝鮮における${name}の位置`,
    ogKickerFallback: '主要施設',
    ogTitleFallback: '北朝鮮の主要施設',
  },
  zh: {
    metaTitle: '朝鲜的主要设施与战略地点',
    metaDescription: '朝鲜战略设施目录：核设施、未申报的导弹作战基地、边境过境点、政权纪念物和经济区。',
    eyebrow: '战略地理',
    h1: '朝鲜的主要设施',
    lede: '造炸弹的地方，发射导弹的地方，权力所在的地方，人们越境的地方。',
    openMap: '打开情报地图',
    mapLabel: '战略设施',
    mapAria: '朝鲜战略设施的位置',
    dossierTitle: (name) => `${name}：朝鲜战略设施档案`,
    dossierDescription: (name, category, note) => `${name} (${category}): ${note}`,
    keySites: '主要设施',
    status: '状态',
    province: (name) => `${name}道`,
    county: (name) => `${name}郡`,
    csisReport: 'CSIS报告',
    openOnMap: '在情报地图上打开',
    military: '朝鲜的军事',
    readMore: '继续阅读',
    source: '来源',
    moreSites: (label) => `更多${label}设施`,
    locationAria: (name) => `${name}在朝鲜的位置`,
    ogKickerFallback: '主要地点',
    ogTitleFallback: '朝鲜的主要设施',
  },
};

/** CSIS Beyond Parallel summaries. English is the decoded geojson text, including the curly apostrophe in base-4. */
const BASE_EN: Record<string, Copy> = {
  'base-0': {
    status: 'Active (CSIS Beyond Parallel)',
    note: 'Approximately 27 kilometers from the China-North Korean border, the Sinpung-dong Missile Operating Base is an undeclared North Korean missile base.',
  },
  'base-1': {
    status: 'Active (CSIS Beyond Parallel)',
    note: 'Located 242 kilometers north of the demilitarized zone and only 65 kilometers from the Chinese border, the Yongnim Missile Operating Base is an undeclared ballistic missile operating ICBM base in Chagang Province.',
  },
  'base-2': {
    status: 'Active (CSIS Beyond Parallel)',
    note: 'Located 338-kilometers north of the demilitarized zone and only 25-kilometers from the Chinese border in Chagang Province, the Hoejung-ni missile operating base will, according to informed sources, likely house a regiment-sized unit equipped with intercontinental ballistic missiles (ICBM).',
  },
  'base-3': {
    status: 'Active (CSIS Beyond Parallel)',
    note: "Located 150 kilometers north of the DMZ, North Korea's Yusang-ni missile operating base is one of the more recently constructed Strategic Force missile operating bases. There has been almost no open source information about this base until this study.",
  },
  'base-4': {
    status: 'Active (CSIS Beyond Parallel)',
    note: 'Located approximately 52 kilometers north of the DMZ and 125 kilometers north of Seoul, the Kal-gol missile operating base is one of the most developed of North Korea\u2019s approximately 15-20 undeclared ballistic missile facilities. This base likely houses a reinforced brigade-sized unit equipped with 500-kilometer-range Hwasong-6 (Scud C) short-range ballistic missiles (SRBM) or Hwasong-9 (Scud-ER) medium-range ballistic missiles (MRBM).',
  },
  'base-5': {
    status: 'Active (CSIS Beyond Parallel)',
    note: 'New CSIS Beyond Parallel imagery shows the undeclared Kumchon-ni missile operating base. This is the first comprehensive public description of the base. During wartime, it is reportedly tasked with striking southern Japan and, to a lesser degree, throughout South Korea.',
  },
  'base-6': {
    status: 'Active (CSIS Beyond Parallel)',
    note: 'Located 250 kilometers north of the DMZ, Sangnam-ni missile operating base is an operational missile base that houses a battalion- or regiment-sized unit equipped with Hwasong-10 (Musudan) intermediate-range ballistic missiles (IRBM). Multiple flight failures of the Musudan missile in 2016 could have also led the KPA Strategic Force to abandon the system and replace it with the more successful Hwasong-12 IRBM.',
  },
  'base-7': {
    status: 'Active (CSIS Beyond Parallel)',
    note: 'Located 212 kilometers north of the DMZ, Sino-ri is an operational missile base that houses a regiment-sized unit equipped with Nodong-1/-2 medium-range ballistic missiles (MRBM). It is one of the oldest of approximately 20 undeclared missile operating bases and is reported to serve as the headquarters of the Strategic Rocket Forces Nodong missile brigade. It may have also played a role in development of the newest generation Pukkuksong-2 (KN-15) ballistic missile first tested or unveiled by North Korea on February 12, 2017.',
  },
  'base-8': {
    status: 'Active (CSIS Beyond Parallel)',
    note: 'Sakkanmol is an undeclared North Korean operational missile base for short-range ballistic missiles (SRBMs) and is one of approximately 20 undeclared missile sites and one of the closest to the demilitarized zone (DMZ) and Seoul, giving it the shortest flight time. Sakkanmol currently houses a unit equipped with SRBMs but could easily accommodate more capable medium-range ballistic missiles (MRBMs).',
  },
};

const EN_COPY: Record<string, Copy> = {};
for (const p of PLACES) EN_COPY[p.id] = p.status ? { status: p.status, note: p.note } : { note: p.note };
Object.assign(EN_COPY, BASE_EN);

const ACTIVE = {
  ko: '운용 중 (CSIS Beyond Parallel)',
  ja: '運用中 (CSIS Beyond Parallel)',
  zh: '在用 (CSIS Beyond Parallel)',
} as const;

export const PLACE_COPY: Record<Lang, Record<string, Copy>> = {
  en: EN_COPY,
  ko: {
    'camp-14': {
      status: '가동 중',
      note: '수감자가 절대 나가지 못하는 완전통제구역입니다. 신동혁(『14호 수용소 탈출』)은 이곳에서 태어났다고 말합니다.',
    },
    'camp-15': {
      status: '폐쇄 또는 축소 보고, 이견 있음',
      note: '일부 수감자가 풀려난 "혁명화 구역"이 있어서, 초기 수용소 증언의 대부분이 여기서 나옵니다. 강철환(『평양의 수족관』)은 어린 시절 이곳에 수감됐습니다.',
    },
    'camp-16': {
      status: '가동 중',
      note: '알려진 정치범수용소 가운데 가장 큽니다. 풍계리 핵실험장에서 몇 km 떨어져 있습니다. 수감자는 수만 명으로 추정됩니다.',
    },
    'camp-18': {
      status: '폐쇄 또는 통합 보고',
      note: '14호 수용소에서 강 건너에 있는 광산 수용소입니다. 2000년대에 폐쇄되거나 통합됐다는 보고가 있지만, 일부가 아직 쓰일 수 있습니다.',
    },
    'camp-22': {
      status: '2012년쯤 폐쇄',
      note: '한때 가장 큰 수용소 중 하나였습니다. 2012년쯤 폐쇄됐습니다. 수감자들이 그 뒤 어떻게 됐는지는 알려지지 않았습니다.',
    },
    'camp-25': {
      status: '가동 중, 2010년대에 확장',
      note: '청진 외곽의 정치범수용소입니다. 2010년대 위성 사진에서 새 초소와 건물이 확인됐습니다.',
    },
    'kyohwaso-1': {
      status: '가동 중',
      note: '범죄로 유죄 판결을 받은 사람을 가두는 교화소입니다. 생존자들은 강제 노동과 높은 사망률을 증언합니다.',
    },
    'kyohwaso-12': {
      status: '가동 중',
      note: '탈북했다가 중국에서 강제로 송환된 사람이 많이 수감돼 있습니다. 증언은 굶주림과 학대, 특히 여성에 대한 학대를 전합니다.',
    },
    yongbyon: {
      status: '가동 중',
      note: '핵 프로그램의 중심입니다. 플루토늄을 만드는 원자로, 재처리 시설, 우라늄 농축 시설이 있습니다.',
    },
    kangson: {
      status: '가동 중',
      note: '평양 근처의 비밀 우라늄 농축 시설로 의심됩니다. 김정은은 2024년, 드문 공개 촬영에서 농축 시설을 방문했습니다.',
    },
    'punggye-ri': {
      status: '복구됨, 7차 실험 가능',
      note: '여섯 차례의 핵실험(2006-2017)이 모두 여기서 이뤄졌습니다. 2018년 카메라 앞에서 갱도를 폭파한 뒤 다시 고쳤습니다.',
    },
    pyongsan: {
      status: '가동 중',
      note: '우라늄 광석을 캐서 농축 프로그램의 원료인 옐로케이크로 가공합니다.',
    },
    sohae: {
      status: '가동 중, 확장 중',
      note: '주된 우주 발사장이고, 로켓 엔진 시험에도 쓰입니다. 2023년 정찰위성 만리경-1호를 발사했습니다.',
    },
    tonghae: {
      status: '대부분 유휴',
      note: '동해안의 발사장으로, 초기 장거리 로켓 시험(1998, 2006, 2009)에 쓰였습니다.',
    },
    sinpo: {
      status: '가동 중',
      note: '잠수함 기지이자 조선소입니다. 잠수함발사탄도미사일 북극성(Pukguksong)을 만들고 시험합니다.',
    },
    kusong: {
      status: '가동 중',
      note: '내륙의 미사일 시험장으로, 화성-12형과 다른 발사에 쓰입니다.',
    },
    sunan: {
      status: '가동 중',
      note: '평양 국제공항이 대륙간탄도미사일 발사대도 겸합니다. 화성-15형과 화성-17형 여러 발이 여기서 발사됐습니다.',
    },
    kumsusan: {
      note: '김일성과 김정일의 시신을 방부 처리해 안치한 영묘입니다.',
    },
    'kim-il-sung-square': {
      note: '열병식이 열리는 광장입니다. 새 미사일이 여기서 처음 공개되는 일이 많습니다.',
    },
    ryugyong: {
      note: '1987년에 짓기 시작한 105층 피라미드입니다. 아직 문을 열지 않았습니다. 체제가 무엇을 우선하는지를 보여주는 상징입니다.',
    },
    hyesan: {
      note: '압록강 변의 국경 도시로, 중국 장백 맞은편에 있습니다. 오랫동안 큰 밀수와 월경 지점이었고, 지금은 울타리가 촘촘합니다.',
    },
    musan: {
      note: '두만강 변의 광산 군으로, 사람들이 흔히 넘던 지역입니다. 잘 알려진 탈북자 여러 명이 여기 출신입니다.',
    },
    hoeryong: {
      note: '두만강 변의 국경 도시입니다. 이곳은 강이 좁아서, 2020년 이후 새 울타리가 생기기 전까지 자주 넘던 지점이었습니다.',
    },
    sinuiju: {
      note: '압록강의 조중우의교입니다. 중국과의 합법 무역 대부분이 여기를 지나고, 밀반입되는 매체도 많이 지납니다.',
    },
    jsa: {
      note: '비무장지대 안의 정전 마을입니다. 2017년 한 군인이 총격을 받으며 여기를 넘었습니다.',
    },
    'musan-mine': {
      note: '아시아에서 가장 큰 노천 철광산 중 하나입니다. 제재 전에는 중국으로의 광석 수출이 외화의 큰 출처였습니다.',
    },
    'kaesong-ic': {
      status: '2016년 이후 폐쇄',
      note: '한국 기업이 북한 노동자 5만 명이 넘게 고용하던 공동 구역입니다. 2016년에 문을 닫았습니다. 북한은 2020년 근처의 연락사무소를 폭파했습니다.',
    },
    kalma: {
      status: '2025년 개장',
      note: '김정은이 여러 해 밀어붙인 해안 휴양지입니다. 2025년에 문을 열었고, 손님은 주로 러시아 관광객입니다. 미사일을 자주 쏘는 곳과도 가깝습니다.',
    },
    rason: {
      note: '북한이 중국, 러시아와 동시에 맞닿은 자유무역지대입니다. 러시아로 가는 철도와 도로가 여기를 지납니다.',
    },
    'base-0': {
      status: ACTIVE.ko,
      note: '북중 국경에서 약 27km 떨어진 신풍동(Sinpung-dong) 미사일 작전 기지는 북한이 신고하지 않은 미사일 기지입니다.',
    },
    'base-1': {
      status: ACTIVE.ko,
      note: '비무장지대 북쪽 242km, 중국 국경에서 65km 떨어진 용림(Yongnim) 미사일 작전 기지는 자강도의 미신고 탄도미사일 운용 ICBM 기지입니다.',
    },
    'base-2': {
      status: ACTIVE.ko,
      note: '자강도에 있고, 비무장지대 북쪽 338km, 중국 국경에서 25km 떨어진 회중리(Hoejung-ni) 미사일 작전 기지는, 정통한 소식통에 따르면 대륙간탄도미사일(ICBM)을 갖춘 연대급 부대를 둘 가능성이 큽니다.',
    },
    'base-3': {
      status: ACTIVE.ko,
      note: 'DMZ 북쪽 150km에 있는 북한의 유상리(Yusang-ni) 미사일 작전 기지는 비교적 최근에 지어진 전략군 미사일 작전 기지 중 하나입니다. 이 연구가 나오기 전까지 이 기지에 대한 공개 정보는 거의 없었습니다.',
    },
    'base-4': {
      status: ACTIVE.ko,
      note: 'DMZ 북쪽 약 52km, 서울 북쪽 125km에 있는 칼골(Kal-gol) 미사일 작전 기지는 북한의 미신고 탄도미사일 시설 약 15-20곳 가운데 가장 잘 갖춰진 곳 중 하나입니다. 이 기지는 사거리 500km의 화성-6형(Scud C) 단거리탄도미사일(SRBM) 또는 화성-9형(Scud-ER) 중거리탄도미사일(MRBM)을 갖춘 증강 여단급 부대를 두고 있을 가능성이 큽니다.',
    },
    'base-5': {
      status: ACTIVE.ko,
      note: 'CSIS Beyond Parallel의 새 영상은 미신고 금천리(Kumchon-ni) 미사일 작전 기지를 보여 줍니다. 이 기지에 대한 첫 종합 공개 설명입니다. 전시에는 일본 남부를 타격하고, 그보다 적게 한국 전역을 타격하는 임무가 있다고 전해집니다.',
    },
    'base-6': {
      status: ACTIVE.ko,
      note: 'DMZ 북쪽 250km의 상남리(Sangnam-ni) 미사일 작전 기지는 운용 중인 기지로, 화성-10형(무수단) 중거리탄도미사일(IRBM)을 갖춘 대대 또는 연대급 부대가 있습니다. 2016년 무수단의 여러 차례 비행 실패로, 조선인민군 전략군이 이 체계를 버리고 더 성공한 화성-12형 IRBM으로 바꿨을 수도 있습니다.',
    },
    'base-7': {
      status: ACTIVE.ko,
      note: 'DMZ 북쪽 212km의 시노리(Sino-ri)는 운용 중인 미사일 기지로, 노동-1/-2형 중거리탄도미사일(MRBM)을 갖춘 연대급 부대가 있습니다. 미신고 미사일 작전 기지 약 20곳 가운데 가장 오래된 곳 중 하나이고, 전략로켓군 노동 미사일 여단의 본부가 있는 곳으로 전해집니다. 북한이 2017년 2월 12일 처음 시험하거나 공개한 최신 세대 북극성-2형(Pukkuksong-2, KN-15) 탄도미사일 개발에도 역할을 했을 수 있습니다.',
    },
    'base-8': {
      status: ACTIVE.ko,
      note: '삭간몰(Sakkanmol)은 단거리탄도미사일(SRBM)을 위한, 북한이 신고하지 않은 운용 중 미사일 기지입니다. 미신고 미사일 시설 약 20곳 중 하나이고, 비무장지대(DMZ)와 서울에 가장 가까운 곳 중 하나라 비행 시간이 가장 짧습니다. 지금은 SRBM을 갖춘 부대가 있지만, 성능이 더 높은 중거리탄도미사일(MRBM)도 쉽게 둘 수 있습니다.',
    },
  },
  ja: {
    'camp-14': {
      status: '稼働中',
      note: '収容者が決して釈放されない完全統制区域です。シン・ドンヒョク（『14号収容所からの脱出』）は、ここで生まれたと言っています。',
    },
    'camp-15': {
      status: '閉鎖または縮小との報告、異論あり',
      note: '一部の収容者が釈放された「革命化区域」があったため、初期の収容所証言のほとんどがここから出ています。カン・チョルファン（『平壌の水槽』）は子どものころここに収容されていました。',
    },
    'camp-16': {
      status: '稼働中',
      note: '知られている政治犯収容所のなかで最大です。豊渓里の核実験場から数kmの場所にあります。収容者は数万人と推定されています。',
    },
    'camp-18': {
      status: '閉鎖または統合との報告',
      note: '14号収容所の川向こうにある鉱山の収容所です。2000年代に閉鎖または統合されたという報告がありますが、一部は今も使われている可能性があります。',
    },
    'camp-22': {
      status: '2012年頃に閉鎖',
      note: 'かつて最大級の収容所の一つでした。2012年頃に閉鎖されました。収容者がその後どうなったかは分かっていません。',
    },
    'camp-25': {
      status: '稼働中、2010年代に拡張',
      note: '清津の外れにある政治犯収容所です。2010年代の衛星画像には、新しい監視所と建物が写っていました。',
    },
    'kyohwaso-1': {
      status: '稼働中',
      note: '犯罪で有罪になった人を入れる再教育の刑務所です。生存者は強制労働と高い死亡率を証言しています。',
    },
    'kyohwaso-12': {
      status: '稼働中',
      note: '脱出したあと中国から強制送還された人が多く収容されています。証言は飢餓と虐待、特に女性への虐待を伝えています。',
    },
    yongbyon: {
      status: '稼働中',
      note: '核計画の中心です。プルトニウムを作る原子炉、再処理施設、ウラン濃縮施設があります。',
    },
    kangson: {
      status: '稼働中',
      note: '平壌の近くにあると疑われる秘密のウラン濃縮施設です。金正恩は2024年、珍しい公開の写真撮影で濃縮施設を訪れました。',
    },
    'punggye-ri': {
      status: '修復済み、7回目の実験が可能',
      note: '6回の核実験（2006-2017年）はすべてここで行われました。2018年にカメラの前で坑道を爆破したあと、修復されました。',
    },
    pyongsan: {
      status: '稼働中',
      note: 'ウラン鉱石を採掘し、濃縮計画の原料であるイエローケーキに加工します。',
    },
    sohae: {
      status: '稼働中、拡張中',
      note: '主要な宇宙発射場で、ロケットエンジンの試験にも使われます。2023年に偵察衛星の万里鏡1号を打ち上げました。',
    },
    tonghae: {
      status: 'ほぼ休止',
      note: '東海岸の発射場で、初期の長距離ロケット試験（1998年、2006年、2009年）に使われました。',
    },
    sinpo: {
      status: '稼働中',
      note: '潜水艦基地であり造船所です。潜水艦発射弾道ミサイルの北極星（Pukguksong）を製造し、試験しています。',
    },
    kusong: {
      status: '稼働中',
      note: '内陸のミサイル試験場で、火星12やほかの発射に使われます。',
    },
    sunan: {
      status: '稼働中',
      note: '平壌の国際空港が大陸間弾道ミサイルの発射台を兼ねています。火星15と火星17がここから複数回発射されました。',
    },
    kumsusan: {
      note: '金日成と金正日の遺体を防腐処理して安置している霊廟です。',
    },
    'kim-il-sung-square': {
      note: '軍事パレードが行われる広場です。新しいミサイルがここで初めて公開されることがよくあります。',
    },
    ryugyong: {
      note: '1987年に着工した105階建てのピラミッドです。今も開業していません。体制が何を優先するかを示す象徴です。',
    },
    hyesan: {
      note: '鴨緑江沿いの国境の都市で、中国の長白の対岸にあります。長いあいだ大きな密輸と越境の地点でしたが、今はフェンスが厳重です。',
    },
    musan: {
      note: '豆満江沿いの鉱山の郡で、人がよく越えていた地域です。よく知られた脱出者の何人かがここ出身です。',
    },
    hoeryong: {
      note: '豆満江沿いの国境の都市です。ここでは川幅が狭いため、2020年以降に新しいフェンスができるまで、よく越えていた地点でした。',
    },
    sinuiju: {
      note: '鴨緑江に架かる中朝友誼橋です。中国との合法な貿易のほとんどがここを通り、密輸されるメディアも多く通ります。',
    },
    jsa: {
      note: '非武装地帯にある休戦の村です。2017年、一人の兵士が銃撃を受けながらここを越えて脱出しました。',
    },
    'musan-mine': {
      note: 'アジアで最大級の露天掘り鉄鉱山の一つです。制裁の前は、中国への鉱石輸出が外貨の大きな源でした。',
    },
    'kaesong-ic': {
      status: '2016年から閉鎖',
      note: '韓国の企業が北朝鮮の労働者5万人超を雇っていた共同区域です。2016年に閉鎖されました。北朝鮮は2020年、近くの連絡事務所を爆破しました。',
    },
    kalma: {
      status: '2025年開業',
      note: '金正恩が何年も進めてきた海岸のリゾートです。2025年に開業し、主にロシア人の観光客を迎えています。ミサイルをよく撃つ場所の近くでもあります。',
    },
    rason: {
      note: '北朝鮮が中国とロシアの両方と接する自由貿易地区です。ロシアへ続く鉄道と道路がここを通ります。',
    },
    'base-0': {
      status: ACTIVE.ja,
      note: '中朝国境から約27キロにあるシンプンドン（Sinpung-dong）ミサイル運用基地は、北朝鮮が申告していないミサイル基地です。',
    },
    'base-1': {
      status: ACTIVE.ja,
      note: '非武装地帯の北242キロ、中国国境からわずか65キロにあるヨンニム（Yongnim）ミサイル運用基地は、慈江道にある未申告の弾道ミサイル運用ICBM基地です。',
    },
    'base-2': {
      status: ACTIVE.ja,
      note: '慈江道にあり、非武装地帯の北338キロ、中国国境からわずか25キロのフェジュンニ（Hoejung-ni）ミサイル運用基地は、事情に通じた情報源によれば、大陸間弾道ミサイル（ICBM）を装備した連隊規模の部隊を置く可能性が高いとされます。',
    },
    'base-3': {
      status: ACTIVE.ja,
      note: 'DMZの北150キロにある北朝鮮のユサンニ（Yusang-ni）ミサイル運用基地は、比較的新しく造られた戦略軍のミサイル運用基地の一つです。この調査が出るまで、この基地についての公開情報はほとんどありませんでした。',
    },
    'base-4': {
      status: ACTIVE.ja,
      note: 'DMZの北約52キロ、ソウルの北125キロにあるカルゴル（Kal-gol）ミサイル運用基地は、北朝鮮の未申告弾道ミサイル施設およそ15-20か所のなかでも、特に整備が進んだ一つです。この基地には、射程500キロの火星6（Scud C）短距離弾道ミサイル（SRBM）、または火星9（Scud-ER）中距離弾道ミサイル（MRBM）を装備した強化旅団規模の部隊が置かれている可能性が高いです。',
    },
    'base-5': {
      status: ACTIVE.ja,
      note: 'CSIS Beyond Parallelの新しい画像は、未申告のクムチョンニ（Kumchon-ni）ミサイル運用基地を示しています。この基地についての、初めての包括的な公開説明です。戦時には日本南部を攻撃し、それよりは程度が低く韓国全域も攻撃する任務を負っていると伝えられています。',
    },
    'base-6': {
      status: ACTIVE.ja,
      note: 'DMZの北250キロにあるサンナムニ（Sangnam-ni）ミサイル運用基地は運用中の基地で、火星10（ムスダン）中距離弾道ミサイル（IRBM）を装備した大隊または連隊規模の部隊が置かれています。2016年にムスダンが何度も飛行に失敗したことで、朝鮮人民軍戦略軍がこの体系を捨て、より成功した火星12 IRBMに替えた可能性もあります。',
    },
    'base-7': {
      status: ACTIVE.ja,
      note: 'DMZの北212キロにあるシノリ（Sino-ri）は運用中のミサイル基地で、ノドン1/-2中距離弾道ミサイル（MRBM）を装備した連隊規模の部隊が置かれています。未申告のミサイル運用基地およそ20か所のうち古い方の一つで、戦略ロケット軍ノドン・ミサイル旅団の司令部だと伝えられています。北朝鮮が2017年2月12日に初めて試験した、または公開した最新世代の北極星2（Pukkuksong-2、KN-15）弾道ミサイルの開発にも関わった可能性があります。',
    },
    'base-8': {
      status: ACTIVE.ja,
      note: 'サッカンモル（Sakkanmol）は短距離弾道ミサイル（SRBM）のための、北朝鮮が申告していない運用中のミサイル基地です。未申告のミサイル施設およそ20か所の一つで、非武装地帯（DMZ）とソウルに最も近い部類にあり、その分、飛行時間が最も短くなります。今はSRBMを装備した部隊が置かれていますが、より性能の高い中距離弾道ミサイル（MRBM）も容易に置けます。',
    },
  },
  zh: {
    'camp-14': {
      status: '运转中',
      note: '这里是囚犯永不释放的完全控制区。申东赫（《逃离14号劳改营》）说自己出生在这里。',
    },
    'camp-15': {
      status: '据报已关闭或缩小，仍有争议',
      note: '这里有过“革命化区”，一部分囚犯从那里获释，所以早期的集中营证词大多来自这里。姜哲焕（《平壤水族馆》）小时候被关在这里。',
    },
    'camp-16': {
      status: '运转中',
      note: '已知最大的政治犯集中营，距丰溪里核试验场只有几公里。估计关押数万人。',
    },
    'camp-18': {
      status: '据报已关闭或合并',
      note: '14号营对岸的矿山集中营。有报告称它在2000年代关闭或并入别处，但部分区域可能仍在使用。',
    },
    'camp-22': {
      status: '约2012年关闭',
      note: '曾是最大的集中营之一。约2012年关闭。囚犯后来怎样，无人知晓。',
    },
    'camp-25': {
      status: '运转中，2010年代有扩建',
      note: '清津边缘的政治犯集中营。2010年代的卫星图像显示新建了岗哨和建筑。',
    },
    'kyohwaso-1': {
      status: '运转中',
      note: '关押已定罪者的再教育监狱。幸存者讲述强迫劳动和很高的死亡率。',
    },
    'kyohwaso-12': {
      status: '运转中',
      note: '关押许多逃出后被中国强制遣返的人。证词描述了饥饿和虐待，尤其是对女性的虐待。',
    },
    yongbyon: {
      status: '运转中',
      note: '核计划的核心：生产钚的反应堆、一座后处理厂，以及一座铀浓缩厂房。',
    },
    kangson: {
      status: '运转中',
      note: '平壤附近疑似秘密铀浓缩厂。金正恩在2024年一次罕见的公开拍照中视察了一处浓缩设施。',
    },
    'punggye-ri': {
      status: '已修复，可进行第7次试验',
      note: '六次核试验（2006-2017）都在这里进行。2018年在镜头前炸毁坑道，后来又修复了。',
    },
    pyongsan: {
      status: '运转中',
      note: '开采铀矿并加工成黄饼，也就是浓缩计划的原料。',
    },
    sohae: {
      status: '运转中，仍在扩建',
      note: '主要航天发射场，也用于火箭发动机试验。2023年发射了侦察卫星万里镜-1号。',
    },
    tonghae: {
      status: '基本闲置',
      note: '东海岸发射场，用于早期远程火箭试验（1998、2006、2009）。',
    },
    sinpo: {
      status: '运转中',
      note: '潜艇基地和船厂，建造并试验潜射弹道导弹北极星（Pukguksong）。',
    },
    kusong: {
      status: '运转中',
      note: '内陆导弹试验场，用于火星-12和其他发射。',
    },
    sunan: {
      status: '运转中',
      note: '平壤国际机场兼作洲际弹道导弹发射场。多枚火星-15和火星-17从这里发射。',
    },
    kumsusan: {
      note: '安放经过防腐处理的金日成和金正日遗体的陵墓。',
    },
    'kim-il-sung-square': {
      note: '举行阅兵的广场，新导弹常常在这里首次亮相。',
    },
    ryugyong: {
      note: '1987年开工的105层金字塔，至今没有开业。它是这个政权优先事项的象征。',
    },
    hyesan: {
      note: '鸭绿江边的边境城市，对岸是中国长白。长期以来是重要的走私和越境点，现在铁丝网很密。',
    },
    musan: {
      note: '图们江边的矿业郡，是人们常越境的地区。好几位知名脱北者来自这里。',
    },
    hoeryong: {
      note: '图们江边的边境城市。这里江面窄，2020年后新栅栏竖起之前，是经常越境的地点。',
    },
    sinuiju: {
      note: '鸭绿江上的中朝友谊桥。与中国的大部分合法贸易从这里经过，大量走私媒介也从这里进入。',
    },
    jsa: {
      note: '非军事区里的停战村。2017年，一名士兵在枪火中从这里逃了过去。',
    },
    'musan-mine': {
      note: '亚洲最大的露天铁矿之一。制裁之前，向中国出口矿石是硬通货的一大来源。',
    },
    'kaesong-ic': {
      status: '2016年起关闭',
      note: '韩国企业雇用超过5万名朝鲜工人的共同园区。2016年关闭。朝鲜在2020年炸毁了附近的联络办公室。',
    },
    kalma: {
      status: '2025年开放',
      note: '金正恩推动多年的海滨度假区，2025年开放，主要接待俄罗斯游客。也靠近一处常用的导弹发射区。',
    },
    rason: {
      note: '朝鲜同时与中国和俄罗斯接壤的自由贸易区。通往俄罗斯的铁路和公路从这里经过。',
    },
    'base-0': {
      status: ACTIVE.zh,
      note: '距中朝边境约27公里的新丰洞（Sinpung-dong）导弹作战基地，是朝鲜未申报的导弹基地。',
    },
    'base-1': {
      status: ACTIVE.zh,
      note: '龙林（Yongnim）导弹作战基地位于非军事区以北242公里、距中国边境仅65公里，是慈江道一处未申报的弹道导弹作战ICBM基地。',
    },
    'base-2': {
      status: ACTIVE.zh,
      note: '会中里（Hoejung-ni）导弹作战基地位于慈江道，在非军事区以北338公里、距中国边境仅25公里。据知情来源称，这里很可能驻有装备洲际弹道导弹（ICBM）的团级部队。',
    },
    'base-3': {
      status: ACTIVE.zh,
      note: '朝鲜的榆上里（Yusang-ni）导弹作战基地位于DMZ以北150公里，是战略军较晚建成的导弹作战基地之一。在这项研究之前，关于该基地的公开信息几乎没有。',
    },
    'base-4': {
      status: ACTIVE.zh,
      note: '卡尔谷（Kal-gol）导弹作战基地位于DMZ以北约52公里、首尔以北125公里，是朝鲜大约15-20处未申报弹道导弹设施中建设最完备的之一。该基地很可能驻有加强旅级部队，装备射程500公里的火星-6（Scud C）短程弹道导弹（SRBM），或火星-9（Scud-ER）中程弹道导弹（MRBM）。',
    },
    'base-5': {
      status: ACTIVE.zh,
      note: 'CSIS Beyond Parallel的新图像展示了未申报的金川里（Kumchon-ni）导弹作战基地。这是对该基地第一次全面的公开描述。据称，战时它的任务是打击日本南部，并在较小程度上打击韩国各地。',
    },
    'base-6': {
      status: ACTIVE.zh,
      note: '上南里（Sangnam-ni）导弹作战基地位于DMZ以北250公里，是一处正在使用的导弹基地，驻有装备火星-10（舞水端）中程弹道导弹（IRBM）的营级或团级部队。2016年舞水端多次飞行失败，也可能使朝鲜人民军战略军放弃该系统，换上更成功的火星-12 IRBM。',
    },
    'base-7': {
      status: ACTIVE.zh,
      note: 'Sino-ri位于DMZ以北212公里，是一处正在使用的导弹基地，驻有装备劳动-1/-2中程弹道导弹（MRBM）的团级部队。它是大约20处未申报导弹作战基地中最老的之一，据称是战略火箭军劳动导弹旅的司令部。它也可能参与了朝鲜于2017年2月12日首次试射或公开的新一代北极星-2（Pukkuksong-2，KN-15）弹道导弹的研制。',
    },
    'base-8': {
      status: ACTIVE.zh,
      note: 'Sakkanmol是朝鲜一处未申报、正在使用的短程弹道导弹（SRBM）基地，也是大约20处未申报导弹设施之一，并且是离非军事区（DMZ）和首尔最近的之一，因此飞行时间最短。Sakkanmol目前驻有装备SRBM的部队，但也能轻易容纳性能更高的中程弹道导弹（MRBM）。',
    },
  },
};

for (const lang of ['ko', 'ja', 'zh'] as const) {
  for (const id of Object.keys(EN_COPY)) {
    const row = PLACE_COPY[lang][id];
    if (!row?.note) throw new Error(`placesI18n: missing ${lang} note for ${id}`);
    if (EN_COPY[id].status && !row.status) throw new Error(`placesI18n: missing ${lang} status for ${id}`);
  }
}

export function placeFields(
  lang: Lang,
  place: { id: string; category: PlaceCategory; categoryLabel: string; status?: string; note: string },
): { categoryLabel: string; status?: string; note: string } {
  if (lang === 'en') return { categoryLabel: place.categoryLabel, status: place.status, note: place.note };
  const copy = PLACE_COPY[lang][place.id];
  return {
    categoryLabel: PLACE_CATEGORY_TEXT[lang][place.category].label,
    status: copy?.status ?? place.status,
    note: copy?.note ?? place.note,
  };
}
