/**
 * Camp Watch: our own dated Sentinel-2 images of prison camps and nuclear/missile sites.
 * Images and data/sentinel.json are made by scripts/sentinel/build.py (see that file for how cloud is judged).
 * This file holds the reader-facing text in every language and the server-side loader for the manifest.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Lang } from '@/site/seo';

export interface SatImage {
  /** Capture date (UTC), YYYY-MM-DD. */
  date: string;
  datetime: string;
  /** Sentinel-2 L2A scene id, e.g. S2C_52SCJ_20261006_0_L2A. */
  scene: string;
  /** Percent of the chip covered by cloud or cloud shadow (SCL 3, 8, 9, 10). */
  cloud: number;
  snow: number;
  nodata: number;
  /** Ground size of one published pixel in metres. */
  pixelM: number;
  sizePx: number;
  epsg: number;
  /** [west, south, east, north] in degrees. */
  bbox: [number, number, number, number];
  /** STAC item URL of the scene. */
  src: string;
  /** YYYY-MM when this image is the clearest of its month, null when it is only the latest. */
  month: string | null;
}

export interface SatSite {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  sizeM: number;
  tile: string;
  latest: string | null;
  checked: string;
  images: SatImage[];
}

interface Manifest {
  built: string;
  sites: SatSite[];
}

let cached: Manifest | null = null;

function manifest(): Manifest {
  if (cached) return cached;
  try {
    cached = JSON.parse(readFileSync(path.join(process.cwd(), 'data/sentinel.json'), 'utf8')) as Manifest;
  } catch {
    cached = { built: '', sites: [] };
  }
  return cached;
}

export const satBuilt = () => manifest().built;

/** The Camp Watch entry for a camp slug (kwanliso-15) or a places.ts id (yongbyon), if it has any image. */
export function getSatSite(id: string): SatSite | undefined {
  const s = manifest().sites.find((x) => x.id === id);
  return s && s.images.length > 0 && s.latest ? s : undefined;
}

/** Sites with the newest latest image first. */
export function latestSatSites(limit = 4): SatSite[] {
  return manifest()
    .sites.filter((s) => s.latest && s.images.length > 0)
    .sort((a, b) => (b.latest! > a.latest! ? 1 : b.latest! < a.latest! ? -1 : a.name.localeCompare(b.name)))
    .slice(0, limit);
}

/** Dossier path of a site: camps live under /camps, everything else under /places. */
export const satSitePath = (s: Pick<SatSite, 'id' | 'category'>) => (s.category === 'camp' ? `/camps/${s.id}` : `/places/${s.id}`);

export const imgSrc = (siteId: string, date: string) => `/img/sentinel/${siteId}/${date}.jpg`;

/** Copernicus Browser view of the same place and day, so anyone can check the image against the source. */
export function copernicusUrl(lat: number, lon: number, date: string) {
  const q = new URLSearchParams({
    zoom: '13',
    lat: lat.toFixed(5),
    lng: lon.toFixed(5),
    themeId: 'DEFAULT-THEME',
    datasetId: 'S2_L2A_CDAS',
    fromTime: `${date}T00:00:00.000Z`,
    toTime: `${date}T23:59:59.999Z`,
    layerId: '1_TRUE_COLOR',
  });
  return `https://browser.dataspace.copernicus.eu/?${q}`;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-10-06" as a day in each language. Done by hand so server and browser print the same string. */
export function dayLabel(lang: Lang, date: string) {
  const [y, m, d] = date.split('-').map(Number);
  if (lang === 'en') return `${d} ${MONTHS_EN[m - 1]} ${y}`;
  if (lang === 'ko') return `${y}년 ${m}월 ${d}일`;
  return `${y}年${m}月${d}日`;
}

/** "2026-10" as a short month label for the month strip. */
export function monthLabel(lang: Lang, month: string) {
  const [y, m] = month.split('-').map(Number);
  if (lang === 'en') return `${MONTHS_EN[m - 1]} ${String(y).slice(2)}`;
  if (lang === 'ko') return `${String(y).slice(2)}.${m}월`;
  return `${String(y).slice(2)}年${m}月`;
}

type SatText = {
  title: string;
  intro: (km: string, px: number) => string;
  how: string;
  captured: string;
  latest: string;
  before: string;
  after: string;
  pickMonth: string;
  noClear: string;
  compareAria: string;
  cloud: (pct: number) => string;
  pixel: (m: number) => string;
  ring: string;
  alt: (name: string, date: string, km: string) => string;
  scene: string;
  openCopernicus: string;
  creditNote: string;
  km: (n: number) => string;
  latestTitle: string;
  latestIntro: string;
  updated: string;
};

/** 7.68 → "7.7", 5 → "5". */
export const fmtKm = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export const SAT_TEXT: Record<Lang, SatText> = {
  en: {
    title: 'Satellite watch',
    intro: (km, px) =>
      `Our own images of this ${km} km square from the European Copernicus Sentinel-2 satellites: the newest clear picture, and the clearest one from each of the last 24 months. One pixel is ${px} m, enough to see roads, fields, ponds and large buildings, not people.`,
    how: 'We pick each image by measuring cloud inside this square from the satellite’s own scene classification. Months with no clear image are left out. We do not mark or interpret anything in the pictures.',
    captured: 'Captured',
    latest: 'Latest',
    before: 'Before',
    after: 'After',
    pickMonth: 'Pick a month to compare with the latest image',
    noClear: 'no clear image',
    compareAria: 'Slide to compare the two dates',
    cloud: (pct) => `Cloud in this square: ${pct}%`,
    pixel: (m) => `${m} m per pixel`,
    ring: 'The ring marks the point on our map.',
    alt: (name, date, km) => `Sentinel-2 satellite image of ${name}, ${km} km across, captured ${date}`,
    scene: 'Scene',
    openCopernicus: 'Open this day in Copernicus Browser',
    creditNote: '',
    km: (n) => `${fmtKm(n)} km`,
    latestTitle: 'Latest satellite images',
    latestIntro: 'Fresh Sentinel-2 images of prison camps and weapons sites, newest first.',
    updated: 'Captured',
  },
  ko: {
    title: '위성 감시',
    intro: (km, px) =>
      `유럽 코페르니쿠스 센티넬-2 위성 자료로 저희가 직접 만든 이 ${km}km 구역의 영상입니다. 가장 최근의 맑은 영상과 지난 24개월 동안 달마다 가장 맑은 영상을 보여 줍니다. 한 픽셀은 ${px}m로, 도로와 밭, 저수지, 큰 건물은 보이지만 사람은 보이지 않습니다.`,
    how: '영상은 위성 자체의 장면 분류 자료로 이 구역 안의 구름을 측정해 고릅니다. 맑은 영상이 없는 달은 뺐습니다. 영상 속 어떤 것도 표시하거나 해석하지 않았습니다.',
    captured: '촬영일',
    latest: '최신',
    before: '이전',
    after: '이후',
    pickMonth: '최신 영상과 비교할 달을 고르세요',
    noClear: '맑은 영상 없음',
    compareAria: '밀어서 두 날짜를 비교',
    cloud: (pct) => `이 구역의 구름: ${pct}%`,
    pixel: (m) => `픽셀당 ${m}m`,
    ring: '원은 지도에 표시한 지점입니다.',
    alt: (name, date, km) => `${name}의 센티넬-2 위성 영상, 가로 ${km}km, ${date} 촬영`,
    scene: '장면',
    openCopernicus: '코페르니쿠스 브라우저에서 이 날짜 열기',
    creditNote: '저작권 표기는 원문(영어) 그대로 둡니다.',
    km: (n) => `${fmtKm(n)}km`,
    latestTitle: '최신 위성 영상',
    latestIntro: '수용소와 무기 시설의 최신 센티넬-2 영상입니다. 최근 것부터 보여 줍니다.',
    updated: '촬영일',
  },
  ja: {
    title: '衛星ウォッチ',
    intro: (km, px) =>
      `欧州のコペルニクス計画のセンチネル2衛星のデータから私たちが作った、この${km}km四方の画像です。最新の晴れた画像と、過去24か月の各月で最も雲の少ない画像を載せています。1ピクセルは${px}mで、道路や畑、池、大きな建物は見えますが、人は見えません。`,
    how: '画像は、衛星自身のシーン分類データでこの範囲内の雲を測って選んでいます。晴れた画像がない月は載せていません。画像の中の何かに印を付けたり、解釈したりはしていません。',
    captured: '撮影日',
    latest: '最新',
    before: '前',
    after: '後',
    pickMonth: '最新の画像と比べる月を選んでください',
    noClear: '晴れた画像なし',
    compareAria: 'スライドして2つの日付を比べる',
    cloud: (pct) => `この範囲の雲: ${pct}%`,
    pixel: (m) => `1ピクセル${m}m`,
    ring: '円は地図上の地点を示します。',
    alt: (name, date, km) => `${name}のセンチネル2衛星画像、幅${km}km、${date}撮影`,
    scene: 'シーン',
    openCopernicus: 'この日をコペルニクス・ブラウザで開く',
    creditNote: 'クレジット表記は原文（英語）のままです。',
    km: (n) => `${fmtKm(n)}km`,
    latestTitle: '最新の衛星画像',
    latestIntro: '収容所と兵器関連施設の最新のセンチネル2画像です。新しい順に並べています。',
    updated: '撮影日',
  },
  zh: {
    title: '卫星观察',
    intro: (km, px) =>
      `这是我们用欧洲哥白尼计划哨兵2号卫星数据自己制作的这片${km}公里见方区域的图像：最新的一张晴空图像，以及过去24个月中每个月最清晰的一张。每个像素为${px}米，能看清道路、农田、水塘和大型建筑，但看不到人。`,
    how: '我们用卫星自带的场景分类数据测量这片区域内的云量来挑选图像。没有晴空图像的月份不列出。我们没有在图像中标注或解读任何内容。',
    captured: '拍摄于',
    latest: '最新',
    before: '之前',
    after: '之后',
    pickMonth: '选择一个月份与最新图像对比',
    noClear: '无晴空图像',
    compareAria: '滑动对比两个日期',
    cloud: (pct) => `该区域云量：${pct}%`,
    pixel: (m) => `每像素${m}米`,
    ring: '圆圈是我们地图上的位置。',
    alt: (name, date, km) => `${name}的哨兵2号卫星图像，宽${km}公里，拍摄于${date}`,
    scene: '场景',
    openCopernicus: '在哥白尼浏览器中打开这一天',
    creditNote: '版权声明保留英文原文。',
    km: (n) => `${fmtKm(n)}公里`,
    latestTitle: '最新卫星图像',
    latestIntro: '政治犯收容所和武器设施的最新哨兵2号图像，按时间从新到旧排列。',
    updated: '拍摄于',
  },
};

/** Required attribution for Copernicus Sentinel data. Kept in English in every language. */
export const satCredit = (years: string) => `Contains modified Copernicus Sentinel data ${years}`;
