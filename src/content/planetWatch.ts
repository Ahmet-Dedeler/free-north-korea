/**
 * Camp Watch, sharper layer: PlanetScope images of the same squares as the Sentinel-2 images in satWatch.ts.
 * Images and data/planet.json are made by scripts/planet/build.py (see that file for how dates are chosen).
 * This file holds the reader-facing text in every language and the server-side loader for the manifest.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Lang } from '@/site/seo';
import { PLANET_CREDIT, planetDayLabel, planetFrameLabel, planetSrc, planetSrcSet, type PlanetFrame } from './satLabels';

export { PLANET_CREDIT, planetDayLabel, planetFrameLabel, planetSrc, planetSrcSet };

export interface PlanetImage extends PlanetFrame {
  /** Planet's own name for what it served: daily_2025-07-09 or global_monthly_2025_10_mosaic. */
  mosaic: string | null;
  sizePx: number;
  /** Share of the square with imagery, 0 to 1. */
  valid: number;
  /** Agreement of a preview with the same day's Sentinel-2 chip (daily images that have one). */
  corr: number | null;
  /** Percent cloud in the square that day, as Sentinel-2 measured it. Daily images only. */
  s2Cloud: number | null;
  s2Scene: string | null;
  bytes: number;
}

export interface PlanetSite {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  sizeM: number;
  /** Ground size of one published pixel in metres. */
  pixelM: number;
  bbox: [number, number, number, number];
  checked: string;
  images: PlanetImage[];
}

interface Manifest {
  built: string;
  sites: PlanetSite[];
}

let cached: Manifest | null = null;

function manifest(): Manifest {
  if (cached) return cached;
  try {
    cached = JSON.parse(readFileSync(path.join(process.cwd(), 'data/planet.json'), 'utf8')) as Manifest;
  } catch {
    cached = { built: '', sites: [] };
  }
  return cached;
}

/** The Planet entry for a camp slug (kwanliso-15) or a places.ts id (yongbyon), if it has at least two images. */
export function getPlanetSite(id: string): PlanetSite | undefined {
  const s = manifest().sites.find((x) => x.id === id);
  return s && s.images.length > 1 ? s : undefined;
}

type PlanetText = {
  title: string;
  intro: (km: string, px: string, year: string) => string;
  how: string;
  captured: string;
  latest: string;
  before: string;
  after: string;
  pickMonthly: string;
  pickDaily: string;
  composite: string;
  sameDay: (pct: number) => string;
  source: string;
  compareAria: string;
  alt: (name: string, date: string, km: string) => string;
  creditNote: string;
  full: { open: string; close: string; zoomIn: string; zoomOut: string };
};

export const PLANET_TEXT: Record<Lang, PlanetText> = {
  en: {
    title: 'Sharper view',
    intro: (km, px, year) =>
      `Images of this ${km} km square from Planet’s PlanetScope satellites, going back to ${year}. One pixel is about ${px} m, almost three times sharper than the Sentinel-2 images below: single large buildings and new construction show up, people do not.`,
    how: 'Monthly images are Planet’s composites of that month’s pictures: every October so the season matches, plus recent months. Daily images are from days when Sentinel-2 measured this square as clear. Colours differ between days because we leave them as Planet serves them. We do not mark or interpret anything in the pictures.',
    captured: 'Newest',
    latest: 'Latest',
    before: 'Before',
    after: 'After',
    pickMonthly: 'Monthly composites: pick one to compare',
    pickDaily: 'Single days: pick one to compare',
    composite: 'Composite of one month, no single capture date',
    sameDay: (pct) => `Cloud in this square that day, measured by Sentinel-2: ${pct}%`,
    source: 'Planet source',
    compareAria: 'Slide to compare the two dates',
    alt: (name, date, km) => `PlanetScope satellite image of ${name}, ${km} km across, ${date}`,
    creditNote: '',
    full: { open: 'See full size', close: 'Close', zoomIn: 'Zoom in', zoomOut: 'Zoom out' },
  },
  ko: {
    title: '더 선명한 영상',
    intro: (km, px, year) =>
      `플래닛의 플래닛스코프 위성으로 찍은 이 ${km}km 구역의 영상으로, ${year}년까지 거슬러 올라갑니다. 한 픽셀은 약 ${px}m로 아래 센티넬-2 영상보다 세 배 가까이 선명합니다. 큰 건물 하나하나와 새 공사는 보이지만 사람은 보이지 않습니다.`,
    how: '월별 영상은 그 달의 영상을 플래닛이 합성한 것으로, 계절을 맞추기 위해 해마다 10월 것을 고르고 최근 몇 달을 더했습니다. 일별 영상은 센티넬-2가 이 구역을 맑다고 측정한 날의 것입니다. 색은 플래닛이 제공한 그대로 두었기 때문에 날마다 다릅니다. 영상 속 어떤 것도 표시하거나 해석하지 않았습니다.',
    captured: '최신',
    latest: '최신',
    before: '이전',
    after: '이후',
    pickMonthly: '월별 합성 영상: 비교할 영상을 고르세요',
    pickDaily: '하루 영상: 비교할 영상을 고르세요',
    composite: '한 달의 합성 영상으로, 촬영일이 하나가 아닙니다',
    sameDay: (pct) => `그날 이 구역의 구름(센티넬-2 측정): ${pct}%`,
    source: '플래닛 자료',
    compareAria: '밀어서 두 날짜를 비교',
    alt: (name, date, km) => `${name}의 플래닛스코프 위성 영상, 가로 ${km}km, ${date}`,
    creditNote: '저작권 표기는 원문(영어) 그대로 둡니다.',
    full: { open: '원본 크기로 보기', close: '닫기', zoomIn: '확대', zoomOut: '축소' },
  },
  ja: {
    title: 'より鮮明な画像',
    intro: (km, px, year) =>
      `プラネット社のプラネットスコープ衛星によるこの${km}km四方の画像で、${year}年までさかのぼれます。1ピクセルは約${px}mで、下のセンチネル2の画像より3倍近く鮮明です。大きな建物の一つ一つや新しい工事は見えますが、人は見えません。`,
    how: '月ごとの画像はその月の画像をプラネット社が合成したもので、季節をそろえるため毎年10月のものを選び、最近の数か月分を加えています。日ごとの画像は、センチネル2がこの範囲を晴れと測定した日のものです。色はプラネット社の提供のままにしているため、日によって異なります。画像の中の何かに印を付けたり、解釈したりはしていません。',
    captured: '最新',
    latest: '最新',
    before: '前',
    after: '後',
    pickMonthly: '月ごとの合成画像: 比べるものを選んでください',
    pickDaily: '1日ごとの画像: 比べるものを選んでください',
    composite: '1か月分の合成画像で、撮影日は1日に特定できません',
    sameDay: (pct) => `その日のこの範囲の雲（センチネル2による測定）: ${pct}%`,
    source: 'プラネット社のデータ',
    compareAria: 'スライドして2つの日付を比べる',
    alt: (name, date, km) => `${name}のプラネットスコープ衛星画像、幅${km}km、${date}`,
    creditNote: 'クレジット表記は原文（英語）のままです。',
    full: { open: '原寸で見る', close: '閉じる', zoomIn: '拡大', zoomOut: '縮小' },
  },
  zh: {
    title: '更清晰的图像',
    intro: (km, px, year) =>
      `这是 Planet 公司 PlanetScope 卫星拍摄的这片${km}公里见方区域的图像，最早可追溯到${year}年。每个像素约${px}米，比下方的哨兵2号图像清晰近三倍：能看清单栋大型建筑和新的施工，但看不到人。`,
    how: '月度图像是 Planet 用当月图像合成的，为了季节一致，每年都选10月，并加上最近几个月。单日图像来自哨兵2号测得这片区域晴朗的日子。颜色保持 Planet 提供的原样，所以每天不同。我们没有在图像中标注或解读任何内容。',
    captured: '最新',
    latest: '最新',
    before: '之前',
    after: '之后',
    pickMonthly: '月度合成图像：选择一张进行对比',
    pickDaily: '单日图像：选择一张进行对比',
    composite: '一个月的合成图像，没有单一的拍摄日期',
    sameDay: (pct) => `当天该区域云量（哨兵2号测得）：${pct}%`,
    source: 'Planet 数据',
    compareAria: '滑动对比两个日期',
    alt: (name, date, km) => `${name}的 PlanetScope 卫星图像，宽${km}公里，${date}`,
    creditNote: '版权声明保留英文原文。',
    full: { open: '查看原图', close: '关闭', zoomIn: '放大', zoomOut: '缩小' },
  },
};
