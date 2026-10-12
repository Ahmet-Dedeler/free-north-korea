/**
 * Text for the intel map (/map, /ko/map, /ja/map, /zh/map) in every language. The map data itself (county names,
 * point names, NKDB facility types, CSIS notes) comes from the GeoJSON in English and is shown as published, marked
 * lang="en"; the dossier each point links to has the translated write-up. Province names and rights labels reuse the
 * tables in countiesI18n.ts.
 */
import type { Lang } from '@/site/seo';
import type { LayerDef, LayerId, Overlay, Shade } from '@/map/config';
import { NUM_LOCALE } from './countiesI18n';
import manifest from './layers.json';

/** Month the radar overlay shows (latest whole month in public/layers/radar.geojson), in the reader's language. */
const radarMonth = (locale: string) => {
  const m = (manifest.layers as Record<string, { sources: { updated: string | null }[] }>).radar?.sources[0]?.updated;
  return m ? new Date(`${m}-01T00:00:00Z`).toLocaleDateString(locale, { timeZone: 'UTC', year: 'numeric', month: 'short' }) : '';
};

export const MAP_PATHS = { en: '/map', ko: '/ko/map', ja: '/ja/map', zh: '/zh/map' } as const satisfies Record<Lang, string>;

type Group = LayerDef['group'];

export interface MapText {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lede: (incidents: string) => string;
  search: string;
  countySub: (province: string) => string;
  shadeBy: string;
  groups: Record<Group, string>;
  layers: Record<LayerId, { label: string; hint: string }>;
  shades: Record<Shade, { label: string; hint: string }>;
  /** Hover text for a county's value under the current shading. */
  tips: Partial<Record<Shade, (v: number) => string>>;
  mayBeOutdated: string;
  note: (homesWithheld: number, built: string) => string;
  sourcesLink: string;
  close: string;
  // county panel
  county: string;
  countyDossier: string;
  peopleYear: string;
  perKm2: string;
  urban: string;
  censusLabel: string;
  abuses: string;
  recordedBy: (n: string) => string;
  noAbuses: string;
  more: (n: number) => string;
  ochaSource: string;
  censusSource: string;
  nkdbSource: string;
  source: string;
  sources: string;
  // point panel
  prisoners: string;
  abusesHere: string;
  stalls: string;
  marketArea: string;
  stallFees: string;
  runBy: string;
  kmFromBorder: (km: string) => string;
  published: (date: string) => string;
  approx: string;
  unconfirmed: string;
  campDossier: string;
  siteDossier: string;
  readMore: string;
  csisReport: string;
  // basemap switch (bottom-left thumbnail, like Google Maps)
  // "Latest" section of the sidebar (content/mapLatest.ts)
  latestTitle: string;
  latestSat: (date: string) => string;
  latestMore: string;
  latestQuakeAria: (title: string) => string;
  baseMap: string;
  baseSat: string;
  baseAria: string;
  layersAria: string;
  overlaysTitle: string;
  /** Whole-country satellite measurements drawn over the map, in the Layers menu next to the basemap switch. */
  overlays: Record<Overlay, { label: string; sub: string; hint: string }>;
  // place photo at the top of a point panel
  photoSentinel: string;
  photoLatest: string;
  photoEsri: string;
  photoScrub: string;
  photoCompare: string;
  photoNoClear: string;
  photoAlt: (name: string, date: string) => string;
  photoEsriAlt: (name: string) => string;
  // ports (point layer from Global Fishing Watch port visits)
  portKicker: string;
  /** "Nampo" or "near Chongjin"; `fallback` is the English name the layer carries (coordinates when unnamed). */
  portName: (port: string, near: boolean, fallback: string) => string;
  portTip: (visits: number, foreign: number) => string;
  portVisits: string;
  portShips: string;
  portForeign: string;
  portFlags: string;
  portNkShips: string;
  portNoFlag: string;
  // night lights (yearly, per county) and the time pill
  lightsTip: (year: number, share: number | null) => string;
  timeLabel: string;
  /** Key line in the time pill while night lights are on. */
  lightsScale: string;
  timePlay: string;
  timePause: string;
  lightsTitle: string;
  lightsSparkAria: (from: number, to: number) => string;
  litArea: (km2: string, pct: string) => string;
  lightsNoData: string;
  lightsSeam: (year: number) => string;
  lightsSource: string;
  portLink: string;
  portNote: string;
}

export const MAP_TEXT: Record<Lang, MapText> = {
  en: {
    metaTitle: 'North Korea Map: Prison Camps, Detention Sites, Missile Bases',
    metaDescription:
      'Interactive intel map of North Korea: political prison camps, 190+ detention and secret police facilities, missile bases, markets, population and 3,600 documented human rights abuses by county.',
    h1: 'North Korea intel map',
    lede: (n) => `Camps, prisons, secret police offices, missile bases, markets and ${n} documented abuses, on one map. Click any county or point.`,
    search: 'Search a county, camp, base, market…',
    countySub: (p) => `County · ${p}`,
    shadeBy: 'Shade counties by',
    groups: { 'Human rights': 'Human rights', Military: 'Military', Economy: 'Economy', Escape: 'Escape' },
    layers: {
      camps: { label: 'Prison camps', hint: 'Political prison camps (kwanliso) and long-term prisons (kyohwaso)' },
      detention: { label: 'Detention & security offices', hint: 'Holding centres, interrogation, labour training camps, secret police offices' },
      'china-detention': { label: 'Chinese detention (repatriation)', hint: 'Where China holds escapees before sending them back' },
      'missile-bases': { label: 'Missile operating bases', hint: 'Undeclared bases found by CSIS from satellite imagery' },
      sites: { label: 'Nuclear, launch & key sites', hint: 'Yongbyon, Punggye-ri, Sohae, Pyongyang landmarks, border crossings' },
      markets: { label: 'Markets (jangmadang)', hint: 'Official markets, sized by number of stalls (CSIS, 2018)' },
      ports: { label: 'Ports', hint: 'North Korean anchorages where ships stopped in the last 12 months, sized by visits (Global Fishing Watch)' },
      'escape-route': { label: 'Escape route', hint: 'The usual 3,000-mile route through China to Southeast Asia' },
    },
    shades: {
      incidents: { label: 'Documented abuses', hint: 'Human rights violations recorded by NKDB, per county' },
      density: { label: 'Population density', hint: 'People per km² (2008 census)' },
      population: { label: 'Population', hint: 'People per county (2008 census)' },
      detention: { label: 'Detention facilities', hint: 'Known detention and security facilities per county' },
      markets: { label: 'Markets', hint: 'Official markets per county' },
      none: { label: 'Nothing', hint: 'Plain map' },
    },
    tips: {
      incidents: (v) => `${fmt(v, 'en')} ${v === 1 ? 'documented abuse' : 'documented abuses'}`,
      density: (v) => `${fmt(Math.round(v), 'en')} people per km²`,
      population: (v) => `${fmt(v, 'en')} ${v === 1 ? 'person' : 'people'}`,
      detention: (v) => `${fmt(v, 'en')} ${v === 1 ? 'detention facility' : 'detention facilities'}`,
      markets: (v) => `${fmt(v, 'en')} ${v === 1 ? 'market' : 'markets'}`,
    },
    mayBeOutdated: 'may be outdated',
    note: (h, built) =>
      `To protect people still inside, we never pin victims’ homes (${h} withheld) or execution and burial sites. Those only count toward their county. Data rebuilt ${built}.`,
    sourcesLink: 'All sources and when they last changed →',
    close: 'Close',
    county: 'County',
    countyDossier: 'View full county dossier →',
    peopleYear: 'people (2008)',
    perKm2: 'per km²',
    urban: 'urban',
    censusLabel: 'Population from the census of',
    abuses: 'Documented abuses',
    recordedBy: (n) => `${n} recorded by NKDB`,
    noAbuses: 'No abuses recorded here yet. That usually means nobody from here has testified, not that nothing happened.',
    more: (n) => `+${n} more`,
    ochaSource: 'UN OCHA boundaries',
    censusSource: '2008 census',
    nkdbSource: 'NKDB Visual Atlas',
    source: 'Source',
    sources: 'Sources',
    prisoners: 'prisoners (HRNK est.)',
    abusesHere: 'abuses recorded here',
    stalls: 'stalls',
    marketArea: 'm² market area',
    stallFees: 'est. yearly stall fees',
    runBy: 'Run by:',
    kmFromBorder: (km) => `${km} km from the Chinese border`,
    published: (d) => `Report published ${d}`,
    approx: ' (approximate)',
    unconfirmed: ' · location unconfirmed',
    campDossier: 'View full camp dossier →',
    siteDossier: 'View full site details →',
    readMore: 'Read more →',
    csisReport: 'CSIS report',
    latestTitle: 'Latest',
    latestSat: (d) => `New satellite images · ${d}`,
    latestMore: 'Everything we watch →',
    latestQuakeAria: (t) => `Show on the map: ${t}`,
    baseMap: 'Map',
    baseSat: 'Satellite',
    baseAria: 'Switch between map and satellite view',
    layersAria: 'More map layers',
    overlaysTitle: 'Seen from space',
    overlays: {
      lights: { label: 'Night lights', sub: 'EOG VIIRS', hint: 'Share of each county lit at night, one year at a time, 2013 to 2025 (annual VIIRS composites, Earth Observation Group). Electricity is a rough proxy for wealth.' },
      radar: { label: 'Ships seen by radar', sub: `GFW · ${radarMonth('en-GB')}`, hint: 'Ships satellite radar saw that sent no AIS signal, per 10 km square, last whole month. Most are fishing boats.' },
    },
    photoSentinel: 'Sentinel-2',
    photoLatest: 'Latest',
    photoEsri: 'Esri satellite view · capture date not given',
    photoScrub: 'Our own images, one per month. Slide to go back in time.',
    photoCompare: 'Compare dates →',
    photoNoClear: 'no clear image',
    photoAlt: (name, date) => `Sentinel-2 satellite image of ${name}, captured ${date}`,
    photoEsriAlt: (name) => `Satellite view of ${name}`,
    portKicker: 'North Korean port',
    portName: (port, near, fallback) => (port ? (near ? `near ${port}` : port) : fallback),
    portTip: (v, f) => `${v.toLocaleString('en')} visits${f ? `, ${f} by foreign-flagged ships` : ''}`,
    portVisits: 'visits, last 12 months',
    portShips: 'vessels',
    portForeign: 'of them by foreign-flagged ships',
    portFlags: 'Flags the ships broadcast',
    portNkShips: 'North Korean ships',
    portNoFlag: 'no flag broadcast',
    lightsTip: (y, s) => (s == null ? `${y}: no clear data` : `${y}: ${(s * 100).toFixed(s < 0.01 ? 2 : 1)}% lit at night`),
    timeLabel: 'Year',
    lightsScale: 'Share of each county lit at night',
    timePlay: 'Play the years',
    timePause: 'Pause',
    lightsTitle: 'Night lights',
    lightsSparkAria: (a, b) => `Sum of night lights in this county, ${a} to ${b}`,
    litArea: (km2, p) => `Lit area ${km2} km² (${p} of the county)`,
    lightsNoData: 'No cloud-free data this year.',
    lightsSeam: (y) => `The satellite product changed version in ${y}; the line marks the seam.`,
    lightsSource: 'EOG annual VIIRS night lights',
    portLink: 'Who calls at North Korean ports',
    portNote: 'Only ships broadcasting AIS. Most ships near North Korea send none, so this is a floor, not all traffic.',
  },
  ko: {
    metaTitle: '북한 지도: 정치범수용소, 구금 시설, 미사일 기지',
    metaDescription:
      '북한 인터랙티브 정보 지도입니다. 정치범수용소, 190곳이 넘는 구금·보위 시설, 미사일 기지, 시장, 인구, 그리고 시·군별로 기록된 인권 침해 3,600건을 보여 줍니다.',
    h1: '북한 정보 지도',
    lede: (n) => `수용소, 교화소, 보위부 사무소, 미사일 기지, 시장, 그리고 기록된 인권 침해 ${n}건을 한 지도에 담았습니다. 시·군이나 지점을 누르세요.`,
    search: '시·군, 수용소, 기지, 시장 찾기…',
    countySub: (p) => `시·군 · ${p}`,
    shadeBy: '시·군 색 기준',
    groups: { 'Human rights': '인권', Military: '군사', Economy: '경제', Escape: '탈북' },
    layers: {
      camps: { label: '정치범수용소·교화소', hint: '정치범수용소(관리소)와 장기 수감 교화소' },
      detention: { label: '구금·보위 시설', hint: '집결소, 조사 시설, 노동단련대, 보위부 사무소' },
      'china-detention': { label: '중국 구금 시설 (강제 북송)', hint: '중국이 탈북민을 돌려보내기 전에 가두는 곳' },
      'missile-bases': { label: '미사일 운용 기지', hint: 'CSIS가 위성 사진으로 찾아낸 미신고 기지' },
      sites: { label: '핵·발사장·주요 장소', hint: '영변, 풍계리, 서해, 평양의 상징물, 국경 통로' },
      markets: { label: '시장 (장마당)', hint: '공식 시장, 매대 수에 따라 크기 표시 (CSIS, 2018년)' },
      ports: { label: '항구', hint: '최근 12개월 동안 선박이 머문 북한 정박지, 입항 수에 따라 크기 표시 (Global Fishing Watch)' },
      'escape-route': { label: '탈북 경로', hint: '중국을 거쳐 동남아시아로 가는 보통의 3,000마일 길' },
    },
    shades: {
      incidents: { label: '기록된 인권 침해', hint: 'NKDB가 기록한 시·군별 인권 침해' },
      density: { label: '인구 밀도', hint: 'km²당 인구 (2008년 총조사)' },
      population: { label: '인구', hint: '시·군별 인구 (2008년 총조사)' },
      detention: { label: '구금 시설', hint: '시·군별로 알려진 구금·보위 시설' },
      markets: { label: '시장', hint: '시·군별 공식 시장' },
      none: { label: '없음', hint: '기본 지도' },
    },
    tips: {
      incidents: (v) => `침해 ${fmt(v, 'ko')}건`,
      density: (v) => `km²당 ${fmt(Math.round(v), 'ko')}명`,
      population: (v) => `${fmt(v, 'ko')}명`,
      detention: (v) => `구금 시설 ${fmt(v, 'ko')}곳`,
      markets: (v) => `시장 ${fmt(v, 'ko')}곳`,
    },
    mayBeOutdated: '최신 정보가 아닐 수 있음',
    note: (h, built) =>
      `아직 북한에 있는 사람들을 보호하기 위해 피해자의 집(${h}곳 비공개)과 처형·매장 장소는 지도에 찍지 않습니다. 이런 곳은 해당 시·군의 집계에만 들어갑니다. 데이터 갱신: ${built}.`,
    sourcesLink: '모든 출처와 마지막 변경일 →',
    close: '닫기',
    county: '시·군',
    countyDossier: '시·군 상세 페이지 보기 →',
    peopleYear: '인구 (2008년)',
    perKm2: 'km²당',
    urban: '도시 거주',
    censusLabel: '인구 총조사 연도',
    abuses: '기록된 인권 침해',
    recordedBy: (n) => `NKDB 기록 ${n}건`,
    noAbuses: '아직 기록된 침해가 없습니다. 보통 이곳 출신 증언자가 없다는 뜻이며, 아무 일도 없었다는 뜻이 아닙니다.',
    more: (n) => `외 ${n}곳`,
    ochaSource: '유엔 OCHA 경계',
    censusSource: '2008년 인구 총조사',
    nkdbSource: 'NKDB 비주얼 아틀라스',
    source: '출처',
    sources: '출처',
    prisoners: '수감자 (HRNK 추정)',
    abusesHere: '이곳에서 기록된 침해',
    stalls: '매대',
    marketArea: 'm² 시장 면적',
    stallFees: '연간 매대 사용료 추정',
    runBy: '운영 기관:',
    kmFromBorder: (km) => `중국 국경에서 ${km}km`,
    published: (d) => `보고서 발행: ${d}`,
    approx: ' (대략적 위치)',
    unconfirmed: ' · 위치 미확인',
    campDossier: '수용소 상세 페이지 보기 →',
    siteDossier: '장소 상세 페이지 보기 →',
    readMore: '더 읽기 →',
    csisReport: 'CSIS 보고서',
    latestTitle: '최신 소식',
    latestSat: (d) => `새 위성 영상 · ${d}`,
    latestMore: '저희가 지켜보는 모든 것 →',
    latestQuakeAria: (t) => `지도에서 보기: ${t}`,
    baseMap: '지도',
    baseSat: '위성',
    baseAria: '지도와 위성 보기 전환',
    layersAria: '지도 레이어 더 보기',
    overlaysTitle: '우주에서 본 모습',
    overlays: {
      lights: { label: '야간 불빛', sub: 'EOG VIIRS', hint: '시·군 면적 중 밤에 불이 켜진 비율, 연도별 2013~2025년 (VIIRS 연간 합성, Earth Observation Group). 전기는 부의 대략적인 지표입니다.' },
      radar: { label: '레이더에 잡힌 선박', sub: `GFW · ${radarMonth('ko-KR')}`, hint: '위성 레이더에 잡혔지만 AIS 신호를 보내지 않은 선박, 10km 칸별, 지난달 기준. 대부분 어선입니다.' },
    },
    photoSentinel: '센티넬-2',
    photoLatest: '최신',
    photoEsri: 'Esri 위성 보기 · 촬영일 미상',
    photoScrub: '저희가 직접 만든 월별 영상입니다. 밀어서 지난 달을 보세요.',
    photoCompare: '날짜 비교 →',
    photoNoClear: '맑은 영상 없음',
    photoAlt: (name, date) => `${name}의 센티넬-2 위성 영상, ${date} 촬영`,
    photoEsriAlt: (name) => `${name}의 위성 보기`,
    portKicker: '북한 항구',
    portName: (port, near, fallback) => (port ? (near ? `${port} 인근` : port) : fallback),
    portTip: (v, f) => `입항 ${v.toLocaleString('ko')}회${f ? `, 외국 국적 ${f}회` : ''}`,
    portVisits: '입항, 최근 12개월',
    portShips: '선박',
    portForeign: '그중 외국 국적 선박',
    portFlags: '선박이 송신한 국적',
    portNkShips: '북한 선박',
    portNoFlag: '국적 미송신',
    lightsTip: (y, s) => (s == null ? `${y}년: 맑은 자료 없음` : `${y}년: 면적의 ${(s * 100).toFixed(s < 0.01 ? 2 : 1)}%가 밤에 밝음`),
    timeLabel: '연도',
    lightsScale: '시·군 면적 중 밤에 불이 켜진 비율',
    timePlay: '연도 재생',
    timePause: '일시 정지',
    lightsTitle: '야간 불빛',
    lightsSparkAria: (a, b) => `이 시·군의 야간 불빛 합계, ${a}~${b}년`,
    litArea: (km2, p) => `불이 켜진 면적 ${km2}km² (시·군의 ${p})`,
    lightsNoData: '이해에는 구름 없는 자료가 없습니다.',
    lightsSeam: (y) => `${y}년에 위성 자료의 버전이 바뀌었습니다. 세로선이 그 경계입니다.`,
    lightsSource: 'EOG 연간 VIIRS 야간 불빛',
    portLink: '북한 항구에 들어오는 선박',
    portNote: 'AIS를 송신한 선박만 셉니다. 북한 근처 선박 대부분은 신호를 보내지 않으므로, 이는 전체가 아니라 최소치입니다.',
  },
  ja: {
    metaTitle: '北朝鮮地図：政治犯収容所、拘束施設、ミサイル基地',
    metaDescription:
      '北朝鮮のインタラクティブな情報マップです。政治犯収容所、190を超える拘束・保衛施設、ミサイル基地、市場、人口、そして市・郡ごとに記録された3,600件の人権侵害を示します。',
    h1: '北朝鮮 情報マップ',
    lede: (n) => `収容所、刑務所、保衛部の事務所、ミサイル基地、市場、そして記録された${n}件の人権侵害を一つの地図に。市・郡や地点をクリックしてください。`,
    search: '市・郡、収容所、基地、市場を検索…',
    countySub: (p) => `市・郡 · ${p}`,
    shadeBy: '市・郡の色分け',
    groups: { 'Human rights': '人権', Military: '軍事', Economy: '経済', Escape: '脱出' },
    layers: {
      camps: { label: '政治犯収容所・刑務所', hint: '政治犯収容所（管理所）と長期刑務所（教化所）' },
      detention: { label: '拘束・保衛施設', hint: '集結所、取調べ施設、労働鍛錬隊、保衛部の事務所' },
      'china-detention': { label: '中国の拘束施設（強制送還）', hint: '中国が脱北者を送り返す前に拘束する場所' },
      'missile-bases': { label: 'ミサイル運用基地', hint: 'CSISが衛星画像から見つけた未申告の基地' },
      sites: { label: '核・発射場・主要地点', hint: '寧辺、豊渓里、西海、平壌の象徴、国境の通過点' },
      markets: { label: '市場（チャンマダン）', hint: '公式市場、売り台の数で大きさを表示（CSIS、2018年）' },
      ports: { label: '港', hint: '直近12か月に船が停泊した北朝鮮の錨地、寄港数で大きさを表示（Global Fishing Watch）' },
      'escape-route': { label: '脱出ルート', hint: '中国を通って東南アジアへ向かう、ふつうの3,000マイルの道' },
    },
    shades: {
      incidents: { label: '記録された人権侵害', hint: 'NKDBが記録した市・郡ごとの人権侵害' },
      density: { label: '人口密度', hint: '1km²あたりの人口（2008年国勢調査）' },
      population: { label: '人口', hint: '市・郡ごとの人口（2008年国勢調査）' },
      detention: { label: '拘束施設', hint: '市・郡ごとに知られている拘束・保衛施設' },
      markets: { label: '市場', hint: '市・郡ごとの公式市場' },
      none: { label: 'なし', hint: '基本の地図' },
    },
    tips: {
      incidents: (v) => `人権侵害 ${fmt(v, 'ja')}件`,
      density: (v) => `1km²あたり${fmt(Math.round(v), 'ja')}人`,
      population: (v) => `${fmt(v, 'ja')}人`,
      detention: (v) => `拘束施設 ${fmt(v, 'ja')}か所`,
      markets: (v) => `市場 ${fmt(v, 'ja')}か所`,
    },
    mayBeOutdated: '古い可能性があります',
    note: (h, built) =>
      `まだ北朝鮮にいる人々を守るため、被害者の自宅（${h}か所を非公開）や処刑・埋葬の場所は地図に載せません。それらは市・郡の件数にだけ数えます。データ更新：${built}。`,
    sourcesLink: 'すべての出典と最終更新日 →',
    close: '閉じる',
    county: '市・郡',
    countyDossier: '市・郡の詳細ページへ →',
    peopleYear: '人口（2008年）',
    perKm2: '1km²あたり',
    urban: '都市部',
    censusLabel: '国勢調査の年',
    abuses: '記録された人権侵害',
    recordedBy: (n) => `NKDBの記録 ${n}件`,
    noAbuses: 'まだ記録はありません。ふつうは、ここから証言した人がいないという意味で、何も起きなかったという意味ではありません。',
    more: (n) => `ほか${n}か所`,
    ochaSource: '国連OCHAの境界',
    censusSource: '2008年国勢調査',
    nkdbSource: 'NKDBビジュアルアトラス',
    source: '出典',
    sources: '出典',
    prisoners: '収容者（HRNK推定）',
    abusesHere: 'ここで記録された人権侵害',
    stalls: '売り台',
    marketArea: 'm² 市場面積',
    stallFees: '年間の売り台使用料（推定）',
    runBy: '運営：',
    kmFromBorder: (km) => `中国国境から${km}km`,
    published: (d) => `報告書の公表：${d}`,
    approx: '（おおよその位置）',
    unconfirmed: ' · 位置は未確認',
    campDossier: '収容所の詳細ページへ →',
    siteDossier: '地点の詳細ページへ →',
    readMore: '続きを読む →',
    csisReport: 'CSIS報告書',
    latestTitle: '最新',
    latestSat: (d) => `新しい衛星画像・${d}`,
    latestMore: '私たちが見守っているもの一覧 →',
    latestQuakeAria: (t) => `地図で見る：${t}`,
    baseMap: '地図',
    baseSat: '衛星',
    baseAria: '地図と衛星表示を切り替え',
    layersAria: 'その他の地図レイヤー',
    overlaysTitle: '宇宙から見た様子',
    overlays: {
      lights: { label: '夜間の光', sub: 'EOG VIIRS', hint: '郡ごとの面積のうち夜に明るい割合、年ごと、2013〜2025年（VIIRS年間合成、Earth Observation Group）。電気は豊かさのおおまかな目安です。' },
      radar: { label: 'レーダーが捉えた船', sub: `GFW・${radarMonth('ja-JP')}`, hint: '衛星レーダーが捉えたのにAIS信号を送っていなかった船、10km四方ごと、直近の1か月。大半は漁船です。' },
    },
    photoSentinel: 'センチネル2',
    photoLatest: '最新',
    photoEsri: 'Esri衛星画像・撮影日不明',
    photoScrub: '私たちが作った月ごとの画像です。スライドして過去の月を見られます。',
    photoCompare: '日付を比べる →',
    photoNoClear: '晴れた画像なし',
    photoAlt: (name, date) => `${name}のセンチネル2衛星画像、${date}撮影`,
    photoEsriAlt: (name) => `${name}の衛星画像`,
    portKicker: '北朝鮮の港',
    portName: (port, near, fallback) => (port ? (near ? `${port}付近` : port) : fallback),
    portTip: (v, f) => `寄港${v.toLocaleString('ja')}回${f ? `、うち外国籍船${f}回` : ''}`,
    portVisits: '寄港、直近12か月',
    portShips: '隻',
    portForeign: 'うち外国籍船',
    portFlags: '船が発信した旗国',
    portNkShips: '北朝鮮の船',
    portNoFlag: '旗国の発信なし',
    lightsTip: (y, s) => (s == null ? `${y}年：晴れた日のデータなし` : `${y}年：面積の${(s * 100).toFixed(s < 0.01 ? 2 : 1)}%が夜に明るい`),
    timeLabel: '年',
    lightsScale: '郡の面積のうち夜に明るい割合',
    timePlay: '年を再生',
    timePause: '一時停止',
    lightsTitle: '夜間の光',
    lightsSparkAria: (a, b) => `この郡の夜間の光の合計、${a}〜${b}年`,
    litArea: (km2, p) => `明るい面積 ${km2} km²（郡の${p}）`,
    lightsNoData: 'この年は雲のないデータがありません。',
    lightsSeam: (y) => `${y}年に衛星データの版が変わりました。縦線がその境目です。`,
    lightsSource: 'EOG 年間VIIRS夜間光',
    portLink: '北朝鮮の港に入る船',
    portNote: 'AISを発信した船だけです。北朝鮮近くの船の多くは信号を送らないため、全体ではなく最小値です。',
  },
  zh: {
    metaTitle: '朝鲜地图：政治犯集中营、拘押设施、导弹基地',
    metaDescription:
      '朝鲜互动情报地图：政治犯集中营、190多处拘押和保卫部门设施、导弹基地、市场、人口，以及按市郡统计的3,600起有记录的人权侵害。',
    h1: '朝鲜情报地图',
    lede: (n) => `集中营、监狱、保卫部办公室、导弹基地、市场，以及${n}起有记录的人权侵害，都在一张地图上。点击任何市郡或地点。`,
    search: '搜索市郡、集中营、基地、市场…',
    countySub: (p) => `市郡 · ${p}`,
    shadeBy: '市郡着色依据',
    groups: { 'Human rights': '人权', Military: '军事', Economy: '经济', Escape: '脱北' },
    layers: {
      camps: { label: '集中营与监狱', hint: '政治犯集中营（管理所）和长期监狱（教化所）' },
      detention: { label: '拘押与保卫设施', hint: '集结所、审讯设施、劳动锻炼队、保卫部办公室' },
      'china-detention': { label: '中国拘押设施（遣返）', hint: '中国在遣返脱北者之前关押他们的地方' },
      'missile-bases': { label: '导弹作战基地', hint: 'CSIS 通过卫星图像发现的未申报基地' },
      sites: { label: '核设施、发射场与要地', hint: '宁边、丰溪里、西海、平壤地标、边境口岸' },
      markets: { label: '市场（场市）', hint: '官方市场，按摊位数量显示大小（CSIS，2018年）' },
      ports: { label: '港口', hint: '最近12个月有船舶停靠的朝鲜锚地，按停靠次数显示大小（Global Fishing Watch）' },
      'escape-route': { label: '脱北路线', hint: '经中国前往东南亚的通常3,000英里路线' },
    },
    shades: {
      incidents: { label: '有记录的人权侵害', hint: 'NKDB 按市郡记录的人权侵害' },
      density: { label: '人口密度', hint: '每平方公里人口（2008年人口普查）' },
      population: { label: '人口', hint: '各市郡人口（2008年人口普查）' },
      detention: { label: '拘押设施', hint: '各市郡已知的拘押和保卫设施' },
      markets: { label: '市场', hint: '各市郡的官方市场' },
      none: { label: '无', hint: '基础地图' },
    },
    tips: {
      incidents: (v) => `人权侵害${fmt(v, 'zh')}起`,
      density: (v) => `每平方公里${fmt(Math.round(v), 'zh')}人`,
      population: (v) => `${fmt(v, 'zh')}人`,
      detention: (v) => `拘押设施${fmt(v, 'zh')}处`,
      markets: (v) => `市场${fmt(v, 'zh')}处`,
    },
    mayBeOutdated: '可能已过时',
    note: (h, built) =>
      `为保护仍在朝鲜境内的人，我们从不标出受害者的住所（已隐去${h}处）或处决和埋葬地点，这些只计入所在市郡的总数。数据更新于${built}。`,
    sourcesLink: '所有来源及最近变更日期 →',
    close: '关闭',
    county: '市郡',
    countyDossier: '查看市郡详情 →',
    peopleYear: '人口（2008年）',
    perKm2: '每平方公里',
    urban: '城镇人口',
    censusLabel: '人口普查年份',
    abuses: '有记录的人权侵害',
    recordedBy: (n) => `NKDB 记录${n}起`,
    noAbuses: '这里还没有记录。通常意味着没有来自这里的证人作证，而不是什么都没发生。',
    more: (n) => `另有${n}处`,
    ochaSource: '联合国 OCHA 边界',
    censusSource: '2008年人口普查',
    nkdbSource: 'NKDB 视觉地图集',
    source: '来源',
    sources: '来源',
    prisoners: '囚犯（HRNK 估计）',
    abusesHere: '此处记录的侵害',
    stalls: '摊位',
    marketArea: '平方米市场面积',
    stallFees: '估计每年摊位费',
    runBy: '管理机构：',
    kmFromBorder: (km) => `距中国边境${km}公里`,
    published: (d) => `报告发布于${d}`,
    approx: '（大致位置）',
    unconfirmed: ' · 位置未确认',
    campDossier: '查看集中营详情 →',
    siteDossier: '查看地点详情 →',
    readMore: '阅读更多 →',
    csisReport: 'CSIS 报告',
    latestTitle: '最新动态',
    latestSat: (d) => `新卫星图像 · ${d}`,
    latestMore: '我们持续关注的全部内容 →',
    latestQuakeAria: (t) => `在地图上查看：${t}`,
    baseMap: '地图',
    baseSat: '卫星',
    baseAria: '切换地图和卫星视图',
    layersAria: '更多地图图层',
    overlaysTitle: '从太空看',
    overlays: {
      lights: { label: '夜间灯光', sub: 'EOG VIIRS', hint: '各郡夜间有灯光的面积比例，逐年显示，2013至2025年（VIIRS年度合成，Earth Observation Group）。电力是财富的粗略指标。' },
      radar: { label: '雷达发现的船舶', sub: `GFW · ${radarMonth('zh-CN')}`, hint: '卫星雷达发现但没有发送AIS信号的船舶，每10公里方格，最近一个完整月份。大多是渔船。' },
    },
    photoSentinel: '哨兵2号',
    photoLatest: '最新',
    photoEsri: 'Esri卫星图像 · 拍摄日期不详',
    photoScrub: '我们自己制作的每月图像。滑动查看过去的月份。',
    photoCompare: '对比日期 →',
    photoNoClear: '无晴空图像',
    photoAlt: (name, date) => `${name}的哨兵2号卫星图像，拍摄于${date}`,
    photoEsriAlt: (name) => `${name}的卫星图像`,
    portKicker: '朝鲜港口',
    portName: (port, near, fallback) => (port ? (near ? `${port}附近` : port) : fallback),
    portTip: (v, f) => `停靠${v.toLocaleString('zh')}次${f ? `，其中外国船旗${f}次` : ''}`,
    portVisits: '次停靠，最近12个月',
    portShips: '艘船',
    portForeign: '其中外国籍船舶',
    portFlags: '船舶发送的船旗',
    portNkShips: '朝鲜船舶',
    portNoFlag: '未发送船旗',
    lightsTip: (y, s) => (s == null ? `${y}年：无晴空数据` : `${y}年：${(s * 100).toFixed(s < 0.01 ? 2 : 1)}%的面积夜间有灯光`),
    timeLabel: '年份',
    lightsScale: '各郡夜间有灯光的面积比例',
    timePlay: '播放各年',
    timePause: '暂停',
    lightsTitle: '夜间灯光',
    lightsSparkAria: (a, b) => `本郡夜间灯光总量，${a}至${b}年`,
    litArea: (km2, p) => `有灯光的面积 ${km2} 平方公里（占本郡${p}）`,
    lightsNoData: '这一年没有无云数据。',
    lightsSeam: (y) => `卫星数据在${y}年更换了版本，竖线标出分界。`,
    lightsSource: 'EOG 年度VIIRS夜间灯光',
    portLink: '哪些船停靠朝鲜港口',
    portNote: '只统计发送AIS信号的船。朝鲜附近的大多数船不发送信号，因此这是下限，不是全部船舶往来。',
  },
};

function fmt(n: number, lang: Lang) {
  return n.toLocaleString(NUM_LOCALE[lang]);
}

/** Country labels for the two Koreas on the basemap, in the site's own terms (English uses OSM's name:en). */
export const COUNTRY_NAMES: Partial<Record<Lang, { north: string; south: string }>> = {
  ko: { north: '북한', south: '한국' },
  ja: { north: '北朝鮮', south: '韓国' },
  zh: { north: '朝鲜', south: '韩国' },
};

/** Basemap label field per language: the local name where OpenStreetMap has one, else English, else the original. */
export const LABEL_FIELDS: Record<Lang, string[]> = {
  en: ['name:en', 'name_en', 'name:latin', 'name'],
  ko: ['name:ko', 'name', 'name:en'],
  ja: ['name:ja', 'name:en', 'name_en', 'name:latin', 'name'],
  zh: ['name:zh-Hans', 'name:zh', 'name:en', 'name_en', 'name:latin', 'name'],
};
