/**
 * Text for /missiles/list in every language the site has. Counts and years are filled in from the CNS dataset
 * at build time (see MissileListPage). Missile names, launch sites and landing regions stay in English: they are
 * the published names from public/data/*.en.json.
 */
import type { MissileType, Outcome } from '@/missiles/data';
import type { Lang } from '@/site/seo';

export const MISSILE_LIST_PATHS = {
  en: '/missiles/list',
  ko: '/ko/missiles/list',
  ja: '/ja/missiles/list',
  zh: '/zh/missiles/list',
} as const;

/** Date (and number) locale per language. English dates stay en-GB, matching the old list page. */
export const MISSILE_LIST_LOCALE: Record<Lang, string> = {
  en: 'en-GB',
  ko: 'ko-KR',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

/** Same order as TYPES in missiles/meta.ts. Labels live here so that file can stay shared with the map. */
export const MISSILE_TYPE_IDS: MissileType[] = ['SRBM', 'MRBM', 'IRBM', 'ICBM', 'SLBM', 'HGV', 'SLV', 'Unknown'];

type TypeLabel = { label: string; hint: string };

interface MissileListText {
  metaTitle: (minYear: number, maxYear: number) => string;
  metaDescription: (count: number, minYear: number, maxYear: number) => string;
  eyebrowLink: string;
  eyebrowRest: string;
  h1: (minYear: number, maxYear: number) => string;
  lede: (count: number) => string;
  stats: { tests: string; icbm: string; succeeded: string; succeededNote: string; latest: string };
  dataRunsTo: string;
  /** Pieces around the two English source links: before, between, after, then the caveat sentence. */
  source: { before: string; between: string; after: string; note: string };
  openMap: string;
  jumpToYear: string;
  yearCount: (n: number) => string;
  columns: { date: string; missile: string; site: string; distance: string; apogee: string; landed: string; outcome: string };
  outcomes: Record<Outcome, string>;
  types: Record<MissileType, TypeLabel>;
  /** Shown where distance, apogee or landing region is missing. */
  empty: string;
  datasetName: (minYear: number, maxYear: number) => string;
  datasetDescription: (count: number) => string;
}

export const MISSILE_LIST_TEXT: Record<Lang, MissileListText> = {
  en: {
    metaTitle: (min, max) => `List of North Korean Missile Tests (${min}–${max})`,
    metaDescription: (count, min, max) =>
      `All ${count} known North Korean ballistic missile and space launch tests from ${min} to ${max} in one table: date, missile, launch site, distance, altitude and outcome.`,
    eyebrowLink: 'Missile tests',
    eyebrowRest: 'Full list',
    h1: (min, max) => `Every North Korean missile test, ${min}–${max}`,
    lede: (count) =>
      `All ${count} known ballistic missile and space launch tests in one table, newest first. Click a date to see the flight path on the map.`,
    stats: {
      tests: 'tests',
      icbm: 'ICBM tests',
      succeeded: 'succeeded',
      succeededNote: 'of tests with a known outcome',
      latest: 'latest test in the data',
    },
    dataRunsTo: 'Data runs to',
    source: {
      before: 'Source: ',
      between: ' via ',
      after: '. ',
      note: 'A launch after that date may not be listed yet.',
    },
    openMap: 'Open the interactive map',
    jumpToYear: 'Jump to year',
    yearCount: (n) => `${n} ${n === 1 ? 'test' : 'tests'}`,
    columns: { date: 'Date', missile: 'Missile', site: 'Launch site', distance: 'Distance', apogee: 'Apogee', landed: 'Landed', outcome: 'Outcome' },
    outcomes: { success: 'Success', failure: 'Failure', unknown: 'Unknown' },
    types: {
      SRBM: { label: 'SRBM', hint: 'Short range, under 1,000 km' },
      MRBM: { label: 'MRBM', hint: 'Medium range, 1,000–3,000 km' },
      IRBM: { label: 'IRBM', hint: 'Intermediate range, 3,000–5,500 km' },
      ICBM: { label: 'ICBM', hint: 'Intercontinental, over 5,500 km' },
      SLBM: { label: 'SLBM', hint: 'Launched from a submarine' },
      HGV: { label: 'HGV', hint: 'Hypersonic glide vehicle' },
      SLV: { label: 'Space launch', hint: 'Satellite launch vehicle' },
      Unknown: { label: 'Unidentified', hint: 'Missile type not publicly identified' },
    },
    empty: '—',
    datasetName: (min, max) => `North Korean missile tests, ${min}–${max}`,
    datasetDescription: (count) =>
      `Every known North Korean ballistic missile and space launch test: ${count} tests with date, missile, launch site, distance, apogee and outcome.`,
  },
  ko: {
    metaTitle: (min, max) => `북한 미사일 시험발사 목록 (${min}–${max})`,
    metaDescription: (count, min, max) =>
      `${min}년부터 ${max}년까지 알려진 북한의 탄도미사일 및 우주 발사 시험 ${count}건을 한 표에 모았습니다. 날짜, 미사일, 발사 장소, 비행 거리, 고도, 결과를 담습니다.`,
    eyebrowLink: '미사일 시험',
    eyebrowRest: '전체 목록',
    h1: (min, max) => `북한 미사일 시험발사 전부, ${min}–${max}`,
    lede: (count) =>
      `알려진 탄도미사일 및 우주 발사 시험 ${count}건을 최신순으로 한 표에 모았습니다. 날짜를 누르면 지도에서 비행 경로를 볼 수 있습니다.`,
    stats: {
      tests: '시험',
      icbm: 'ICBM 시험',
      succeeded: '성공',
      succeededNote: '결과가 알려진 시험 가운데',
      latest: '자료에 있는 가장 최근 시험',
    },
    dataRunsTo: '자료 마지막 날짜',
    source: {
      before: '출처: ',
      between: ' (',
      after: ' 경유). ',
      note: '그 날짜 이후의 발사는 아직 목록에 없을 수 있습니다.',
    },
    openMap: '대화형 지도 열기',
    jumpToYear: '연도로 이동',
    yearCount: (n) => `${n}건`,
    columns: { date: '날짜', missile: '미사일', site: '발사 장소', distance: '비행 거리', apogee: '최고 고도', landed: '낙하', outcome: '결과' },
    outcomes: { success: '성공', failure: '실패', unknown: '미상' },
    types: {
      SRBM: { label: 'SRBM', hint: '단거리, 1,000km 미만' },
      MRBM: { label: 'MRBM', hint: '준중거리, 1,000–3,000km' },
      IRBM: { label: 'IRBM', hint: '중거리, 3,000–5,500km' },
      ICBM: { label: 'ICBM', hint: '대륙간, 5,500km 초과' },
      SLBM: { label: 'SLBM', hint: '잠수함에서 발사' },
      HGV: { label: 'HGV', hint: '극초음속 활공체' },
      SLV: { label: '우주 발사', hint: '위성 발사체' },
      Unknown: { label: '미확인', hint: '미사일 종류가 공개되어 있지 않습니다' },
    },
    empty: '없음',
    datasetName: (min, max) => `북한 미사일 시험발사, ${min}–${max}`,
    datasetDescription: (count) =>
      `알려진 북한의 탄도미사일 및 우주 발사 시험 전부: 날짜, 미사일, 발사 장소, 비행 거리, 최고 고도, 결과를 담은 ${count}건.`,
  },
  ja: {
    metaTitle: (min, max) => `北朝鮮のミサイル発射試験一覧（${min}–${max}）`,
    metaDescription: (count, min, max) =>
      `${min}年から${max}年の、知られている北朝鮮の弾道ミサイルおよび宇宙発射の試験${count}件を、1つの表にまとめています。日付、ミサイル、発射地点、飛翔距離、高度、結果を掲載しています。`,
    eyebrowLink: 'ミサイル発射試験',
    eyebrowRest: '全件一覧',
    h1: (min, max) => `北朝鮮のミサイル発射試験のすべて、${min}–${max}`,
    lede: (count) =>
      `知られている弾道ミサイルおよび宇宙発射の試験${count}件を、新しい順に1つの表にまとめています。日付をクリックすると、地図で飛行経路を見られます。`,
    stats: {
      tests: '試験',
      icbm: 'ICBM試験',
      succeeded: '成功',
      succeededNote: '結果が分かっている試験のうち',
      latest: 'データにある最新の試験',
    },
    dataRunsTo: 'データの最終日',
    source: {
      before: '出典：',
      between: '（',
      after: ' 経由）。',
      note: 'その日より後の発射は、まだ載っていない場合があります。',
    },
    openMap: '操作できる地図を開く',
    jumpToYear: '年へ移動',
    yearCount: (n) => `${n}件`,
    columns: { date: '日付', missile: 'ミサイル', site: '発射地点', distance: '飛翔距離', apogee: '最高高度', landed: '落下', outcome: '結果' },
    outcomes: { success: '成功', failure: '失敗', unknown: '不明' },
    types: {
      SRBM: { label: 'SRBM', hint: '短距離、1,000km未満' },
      MRBM: { label: 'MRBM', hint: '準中距離、1,000–3,000km' },
      IRBM: { label: 'IRBM', hint: '中距離、3,000–5,500km' },
      ICBM: { label: 'ICBM', hint: '大陸間、5,500km超' },
      SLBM: { label: 'SLBM', hint: '潜水艦から発射' },
      HGV: { label: 'HGV', hint: '極超音速滑空体' },
      SLV: { label: '宇宙発射', hint: '衛星打ち上げロケット' },
      Unknown: { label: '未確認', hint: 'ミサイルの種類は公表されていません' },
    },
    empty: 'なし',
    datasetName: (min, max) => `北朝鮮のミサイル発射試験、${min}–${max}`,
    datasetDescription: (count) =>
      `知られている北朝鮮の弾道ミサイルおよび宇宙発射の試験のすべて：日付、ミサイル、発射地点、飛翔距離、最高高度、結果を含む${count}件。`,
  },
  zh: {
    metaTitle: (min, max) => `朝鲜导弹试射列表（${min}–${max}）`,
    metaDescription: (count, min, max) =>
      `${min}年至${max}年已知的全部${count}次朝鲜弹道导弹和航天发射试验，列在一张表里：日期、导弹、发射场、飞行距离、高度和结果。`,
    eyebrowLink: '导弹试射',
    eyebrowRest: '完整列表',
    h1: (min, max) => `朝鲜的全部导弹试射，${min}–${max}`,
    lede: (count) =>
      `已知的全部${count}次弹道导弹和航天发射试验，按从新到旧列在一张表里。点击日期，可在地图上查看飞行轨迹。`,
    stats: {
      tests: '试射',
      icbm: 'ICBM试射',
      succeeded: '成功',
      succeededNote: '在结果已知的试射中',
      latest: '数据中的最近一次试射',
    },
    dataRunsTo: '数据截至',
    source: {
      before: '来源：',
      between: '，经由 ',
      after: '。',
      note: '该日期之后的发射可能尚未列入。',
    },
    openMap: '打开交互地图',
    jumpToYear: '跳转到年份',
    yearCount: (n) => `${n}次`,
    columns: { date: '日期', missile: '导弹', site: '发射场', distance: '飞行距离', apogee: '远地点', landed: '落点', outcome: '结果' },
    outcomes: { success: '成功', failure: '失败', unknown: '未知' },
    types: {
      SRBM: { label: 'SRBM', hint: '近程，不足1,000公里' },
      MRBM: { label: 'MRBM', hint: '中程，1,000–3,000公里' },
      IRBM: { label: 'IRBM', hint: '中远程，3,000–5,500公里' },
      ICBM: { label: 'ICBM', hint: '洲际，超过5,500公里' },
      SLBM: { label: 'SLBM', hint: '从潜艇发射' },
      HGV: { label: 'HGV', hint: '高超声速滑翔飞行器' },
      SLV: { label: '航天发射', hint: '卫星运载火箭' },
      Unknown: { label: '未识别', hint: '导弹类型未公开' },
    },
    empty: '无',
    datasetName: (min, max) => `朝鲜导弹试射，${min}–${max}`,
    datasetDescription: (count) =>
      `已知的全部朝鲜弹道导弹和航天发射试验：${count}次，含日期、导弹、发射场、飞行距离、远地点和结果。`,
  },
};
