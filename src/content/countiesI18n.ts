/**
 * Text for /counties and /counties/[slug] in every language the site has.
 * The GeoJSON (public/layers/counties.geojson) has no Korean, Japanese or Chinese name field, so county proper
 * names stay as published (Anak, Pyongyang, Unjong Dist.). Province names and every surrounding word are translated.
 * Numbers, the 2008 census year and pcodes are the same in every language.
 */
import type { Lang } from '@/site/seo';

export const COUNTIES_PATHS = {
  en: '/counties',
  ko: '/ko/counties',
  ja: '/ja/counties',
  zh: '/zh/counties',
} as const satisfies Record<Lang, string>;

export function countyLanguages(slug: string): Record<Lang, string> {
  return {
    en: `/counties/${slug}`,
    ko: `/ko/counties/${slug}`,
    ja: `/ja/counties/${slug}`,
    zh: `/zh/counties/${slug}`,
  };
}

/** Prefix a content path for `lang`. The intel map stays at /map. */
export function sitePath(lang: Lang, path: string) {
  if (path === '/map' || path.startsWith('/map#') || path.startsWith('/map?')) return path;
  if (lang === 'en') return path;
  if (path === '/') return `/${lang}`;
  return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
}

export const NUM_LOCALE: Record<Lang, string> = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-CN' };

export function formatCount(n: number, lang: Lang) {
  return n.toLocaleString(NUM_LOCALE[lang]);
}

/**
 * Province strings as they appear on each county. `en` is the GeoJSON value.
 * Korean uses South Korean names (Ryanggang is 양강도; the North Korean spelling is 량강도).
 */
export const PROVINCE_NAME: Record<string, Record<Lang, string>> = {
  Jagang: { en: 'Jagang', ko: '자강도', ja: '慈江道', zh: '慈江道' },
  Kangwon: { en: 'Kangwon', ko: '강원도', ja: '江原道', zh: '江原道' },
  Nampo: { en: 'Nampo', ko: '남포시', ja: '南浦市', zh: '南浦市' },
  'North Hamgyong': { en: 'North Hamgyong', ko: '함경북도', ja: '咸鏡北道', zh: '咸镜北道' },
  'North Hwanghae': { en: 'North Hwanghae', ko: '황해북도', ja: '黄海北道', zh: '黄海北道' },
  'North Pyongan': { en: 'North Pyongan', ko: '평안북도', ja: '平安北道', zh: '平安北道' },
  Pyongyang: { en: 'Pyongyang', ko: '평양시', ja: '平壌市', zh: '平壤市' },
  Ryanggang: { en: 'Ryanggang', ko: '양강도', ja: '両江道', zh: '两江道' },
  'South Hamgyong': { en: 'South Hamgyong', ko: '함경남도', ja: '咸鏡南道', zh: '咸镜南道' },
  'South Hwanghae': { en: 'South Hwanghae', ko: '황해남도', ja: '黄海南道', zh: '黄海南道' },
  'South Pyongan': { en: 'South Pyongan', ko: '평안남도', ja: '平安南道', zh: '平安南道' },
};

export function provinceName(name: string, lang: Lang) {
  return PROVINCE_NAME[name]?.[lang] ?? name;
}

/**
 * NKDB rights labels, keyed by the raw GeoJSON string. Values are the phrase the page shows after it strips a
 * leading "Right(s) to/of (the)".
 */
export const RIGHTS_LABEL: Record<string, Record<Lang, string>> = {
  'Right to Life': { en: 'Life', ko: '생명', ja: '生命', zh: '生命' },
  'Right to Individual Liberty & Dignity': {
    en: 'Individual Liberty & Dignity',
    ko: '개인의 자유와 존엄',
    ja: '個人の自由と尊厳',
    zh: '个人自由与尊严',
  },
  'Right to Survival': { en: 'Survival', ko: '생존', ja: '生存', zh: '生存' },
  'Right to Freedom of Belief & Expression': {
    en: 'Freedom of Belief & Expression',
    ko: '신념과 표현의 자유',
    ja: '信条と表現の自由',
    zh: '信仰与表达自由',
  },
  'Rights of the Accused, Detained, or Convicted': {
    en: 'Accused, Detained, or Convicted',
    ko: '피의자, 구금자, 수형자',
    ja: '被疑者、被拘禁者、受刑者',
    zh: '被指控者、被拘押者或被定罪者',
  },
  'Right to Freedom of Movement & Residence': {
    en: 'Freedom of Movement & Residence',
    ko: '이동과 거주의 자유',
    ja: '移動と居住の自由',
    zh: '迁徙与居住自由',
  },
  'Reproductive Rights': { en: 'Reproductive Rights', ko: '재생산권', ja: '生殖に関する権利', zh: '生育权利' },
  'Right to Education': { en: 'Education', ko: '교육', ja: '教育', zh: '教育' },
};

function cleanRights(label: string) {
  return label.replace(/^Rights? (to|of) (the )?/i, '').replace(/^./, (c) => c.toUpperCase());
}

export function rightsLabel(raw: string, lang: Lang) {
  return RIGHTS_LABEL[raw]?.[lang] ?? cleanRights(raw);
}

/** "The 1990s" → ’90s / 90년대 / 90年代. Same shortening the English page already uses. */
export function decadeShort(key: string, lang: Lang) {
  const stripped = key.replace(/^The /, '');
  const m = stripped.match(/^(\d{4})s$/);
  if (!m) return stripped;
  const yy = m[1].slice(2);
  if (lang === 'ko') return `${yy}년대`;
  if (lang === 'ja' || lang === 'zh') return `${yy}年代`;
  return `\u2019${yy}s`;
}

export function decadeTitle(key: string, value: number, lang: Lang) {
  if (lang === 'en') return `${key}: ${value}`;
  const m = key.match(/^The (\d{4})s$/);
  const label = m ? (lang === 'ko' ? `${m[1]}년대` : `${m[1]}年代`) : key;
  return lang === 'zh' ? `${label}：${value}` : `${label}: ${value}`;
}

type MetricId = 'incidents' | 'detention' | 'density' | 'markets';

type Text = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  peopleCensus: string;
  million: (n: string) => string;
  documentedAbuses: string;
  nkdb: string;
  detentionSites: string;
  officialMarkets: string;
  censusAsOf: string;
  sourcesLead: string;
  ochaShort: string;
  ochaLong: string;
  censusSource: string;
  nkdbSource: string;
  caveat: string;
  metrics: Record<MetricId, { label: string; unit: string }>;
  mapAria: (label: string) => string;
  hoverHint: string;
  tipPeople: (n: string) => string;
  tipAbuses: (n: number) => string;
  tipDetention: (n: number) => string;
  tipMarkets: (n: number) => string;
  colourBy: string;
  mapMetric: string;
  top5: string;
  search: string;
  countOf: (shown: number, total: number) => string;
  colCounty: string;
  colProvince: string;
  colPop: string;
  colPerKm: string;
  colAbuses: string;
  colDetention: string;
  colMarkets: string;
  dossierTitle: (name: string, province: string) => string;
  dossierDescription: (name: string, province: string, pop: number | null, incidents: number, detention: number, markets: number) => string;
  jsonLdDescription: (province: string, pop: number | null) => string;
  crumb: string;
  kind: (isCity: boolean, province: string) => string;
  people: string;
  censusNote: string;
  km2: string;
  densityNote: (n: number) => string;
  urban: string;
  openMap: string;
  compare: string;
  rightsHeading: string;
  rightsEmpty: string;
  whenHeading: string;
  sexHeading: string;
  womenAria: (pct: number) => string;
  womenRest: (pct: number) => string;
  menRest: string;
  campsHeading: string;
  placesHeading: string;
  elsewhere: (province: string) => string;
  sourcesHeading: string;
};

export const COUNTIES_TEXT: Record<Lang, Text> = {
  en: {
    metaTitle: 'All 179 North Korea Counties: Demographics, Abuses & Facilities',
    metaDescription:
      'County-by-county atlas of North Korea: 2008 census demographics, documented human rights violations (NKDB), detention facilities, and markets across all 179 counties and cities.',
    eyebrow: 'Demographics · Local intel',
    h1: 'All 179 counties and cities',
    lede: 'Every county in North Korea with its 2008 census population, abuses documented by NKDB, detention sites and official markets.',
    peopleCensus: 'people (2008 census)',
    million: (n) => `${n}M`,
    documentedAbuses: 'documented abuses',
    nkdb: 'NKDB',
    detentionSites: 'detention sites',
    officialMarkets: 'official markets',
    censusAsOf: 'Population from the census of',
    sourcesLead: 'Sources: ',
    ochaShort: 'UN OCHA boundaries',
    ochaLong: 'UN OCHA administrative boundaries',
    censusSource: '2008 census (UNFPA)',
    nkdbSource: 'NKDB Visual Atlas',
    caveat: 'Few documented abuses usually means few escapees from that county, not fewer abuses.',
    metrics: {
      incidents: { label: 'Documented abuses', unit: 'abuses' },
      detention: { label: 'Detention sites', unit: 'sites' },
      density: { label: 'Population density', unit: 'people/km²' },
      markets: { label: 'Markets', unit: 'markets' },
    },
    mapAria: (label) => `Map of North Korean counties by ${label.toLowerCase()}`,
    hoverHint: 'Hover a county',
    tipPeople: (n) => `${n} people`,
    tipAbuses: (n) => `${n} abuses`,
    tipDetention: (n) => `${n} detention`,
    tipMarkets: (n) => `${n} markets`,
    colourBy: 'Colour by',
    mapMetric: 'Map metric',
    top5: 'Top 5',
    search: 'Find a county or city',
    countOf: (shown, total) => `${shown} of ${total}`,
    colCounty: 'County / city',
    colProvince: 'Province',
    colPop: 'Population',
    colPerKm: 'Per km²',
    colAbuses: 'Abuses',
    colDetention: 'Detention',
    colMarkets: 'Markets',
    dossierTitle: (name, province) => `${name} (${province}): North Korea County Demographics & Abuses`,
    dossierDescription: (name, province, pop, incidents, detention, markets) =>
      `${name} in ${province}: population ${pop == null ? 'unknown' : pop.toLocaleString('en-US')}, ${incidents} documented human rights abuses, ${detention} detention facilities, and ${markets} official markets.`,
    jsonLdDescription: (province, pop) => `Administrative division in ${province}, DPRK. Population: ${pop ?? 'N/A'}.`,
    crumb: 'Counties',
    kind: (isCity, province) => `${isCity ? 'City' : 'County'} in ${province}`,
    people: 'people',
    censusNote: '2008 census, may be outdated',
    km2: 'km²',
    densityNote: (n) => `${n} people per km²`,
    urban: 'live in towns',
    openMap: 'Open on the intel map',
    compare: 'Compare all 179 counties',
    rightsHeading: 'Abuses by right violated',
    rightsEmpty: 'None recorded yet. In a closed country that usually means no witnesses from here have escaped, not that nothing happened.',
    whenHeading: 'When they happened',
    sexHeading: 'Women and men',
    womenAria: (pct) => `${pct}% women`,
    womenRest: (pct) => ` women (${pct}%)`,
    menRest: ' men',
    campsHeading: 'Prison camps here',
    placesHeading: 'Key sites here',
    elsewhere: (province) => `Elsewhere in ${province}`,
    sourcesHeading: 'Sources',
  },
  ko: {
    metaTitle: '북한 179개 시·군: 인구, 인권 침해, 시설',
    metaDescription:
      '북한 시·군별 지도입니다. 2008년 인구 총조사, NKDB가 기록한 인권 침해, 구금 시설, 공식 시장을 179개 시·군 전체에서 보여 줍니다.',
    eyebrow: '인구 · 지역 정보',
    h1: '179개 시·군 전체',
    lede: '북한의 모든 시·군입니다. 2008년 인구 총조사 인구, NKDB가 기록한 인권 침해, 구금 시설, 공식 시장을 함께 보여 줍니다.',
    peopleCensus: '인구 (2008년 총조사)',
    million: (n) => `${n}백만`,
    documentedAbuses: '기록된 인권 침해',
    nkdb: 'NKDB',
    detentionSites: '구금 시설',
    officialMarkets: '공식 시장',
    censusAsOf: '인구 총조사 연도',
    sourcesLead: '출처: ',
    ochaShort: '유엔 OCHA 경계',
    ochaLong: '유엔 OCHA 행정 경계',
    censusSource: '2008년 인구 총조사 (UNFPA)',
    nkdbSource: 'NKDB 비주얼 아틀라스',
    caveat: '기록된 인권 침해가 적은 것은 보통 그 군 출신 탈북민이 적다는 뜻이며, 침해가 더 적다는 뜻이 아닙니다.',
    metrics: {
      incidents: { label: '기록된 인권 침해', unit: '건' },
      detention: { label: '구금 시설', unit: '곳' },
      density: { label: '인구 밀도', unit: '명/km²' },
      markets: { label: '시장', unit: '곳' },
    },
    mapAria: (label) => `${label} 기준 북한 시·군 지도`,
    hoverHint: '시·군 위에 커서를 올리면 수치가 나옵니다.',
    tipPeople: (n) => `${n}명`,
    tipAbuses: (n) => `침해 ${n}건`,
    tipDetention: (n) => `구금 ${n}곳`,
    tipMarkets: (n) => `시장 ${n}곳`,
    colourBy: '색 기준',
    mapMetric: '지도 지표',
    top5: '상위 5',
    search: '시·군 찾기',
    countOf: (shown, total) => `${total}개 중 ${shown}개`,
    colCounty: '시·군',
    colProvince: '시·도',
    colPop: '인구',
    colPerKm: 'km²당',
    colAbuses: '침해',
    colDetention: '구금',
    colMarkets: '시장',
    dossierTitle: (name, province) => `${name} (${province}): 북한 시·군 인구와 인권 침해`,
    dossierDescription: (name, province, pop, incidents, detention, markets) =>
      `${province}의 ${name}입니다. 인구는 ${pop == null ? '알 수 없음' : `${pop.toLocaleString('ko-KR')}명`}, 기록된 인권 침해는 ${incidents}건, 구금 시설은 ${detention}곳, 공식 시장은 ${markets}곳입니다.`,
    jsonLdDescription: (province, pop) => `북한 ${province}의 행정 구역입니다. 인구: ${pop ?? '알 수 없음'}.`,
    crumb: '시·군',
    kind: (isCity, province) => `${province}의 ${isCity ? '시' : '군'}`,
    people: '인구',
    censusNote: '2008년 총조사, 최신 정보가 아닐 수 있음',
    km2: 'km²',
    densityNote: (n) => `km²당 ${n}명`,
    urban: '도시 거주',
    openMap: '인텔 지도에서 열기',
    compare: '179개 시·군 비교',
    rightsHeading: '침해된 권리별',
    rightsEmpty: '아직 기록된 것이 없습니다. 닫힌 나라에서는 보통 여기서 탈북한 목격자가 없다는 뜻이며, 아무 일도 없었다는 뜻이 아닙니다.',
    whenHeading: '일어난 시기',
    sexHeading: '여성과 남성',
    womenAria: (pct) => `여성 ${pct}%`,
    womenRest: (pct) => `명 (여성 ${pct}%)`,
    menRest: '명 (남성)',
    campsHeading: '이 지역의 수용소',
    placesHeading: '이 지역의 주요 장소',
    elsewhere: (province) => `${province}의 다른 시·군`,
    sourcesHeading: '출처',
  },
  ja: {
    metaTitle: '北朝鮮の179の市・郡：人口、人権侵害、施設',
    metaDescription:
      '北朝鮮の市・郡ごとの地図です。2008年の国勢調査、NKDBが記録した人権侵害、拘束施設、公式市場を、179の市と郡すべてで示します。',
    eyebrow: '人口 · 地域の情報',
    h1: '179の市と郡',
    lede: '北朝鮮のすべての市・郡です。2008年の国勢調査の人口、NKDBが記録した人権侵害、拘束施設、公式市場を示します。',
    peopleCensus: '人口（2008年国勢調査）',
    million: (n) => `${n}百万`,
    documentedAbuses: '記録された人権侵害',
    nkdb: 'NKDB',
    detentionSites: '拘束施設',
    officialMarkets: '公式市場',
    censusAsOf: '国勢調査の年',
    sourcesLead: '出典: ',
    ochaShort: '国連OCHAの境界',
    ochaLong: '国連OCHAの行政境界',
    censusSource: '2008年国勢調査（UNFPA）',
    nkdbSource: 'NKDBビジュアル・アトラス',
    caveat: '記録された人権侵害が少ないのは、普通はその郡出身の脱北者が少ないという意味であり、侵害が少ないという意味ではありません。',
    metrics: {
      incidents: { label: '記録された人権侵害', unit: '件' },
      detention: { label: '拘束施設', unit: 'か所' },
      density: { label: '人口密度', unit: '人/km²' },
      markets: { label: '市場', unit: 'か所' },
    },
    mapAria: (label) => `${label}で色分けした北朝鮮の市・郡の地図`,
    hoverHint: '市・郡にカーソルを合わせてください',
    tipPeople: (n) => `${n}人`,
    tipAbuses: (n) => `侵害${n}件`,
    tipDetention: (n) => `拘束${n}か所`,
    tipMarkets: (n) => `市場${n}か所`,
    colourBy: '色分け',
    mapMetric: '地図の指標',
    top5: '上位5',
    search: '市・郡を探す',
    countOf: (shown, total) => `${total}件中${shown}件`,
    colCounty: '市・郡',
    colProvince: '道・市',
    colPop: '人口',
    colPerKm: '1km²あたり',
    colAbuses: '侵害',
    colDetention: '拘束',
    colMarkets: '市場',
    dossierTitle: (name, province) => `${name}（${province}）：北朝鮮の市・郡の人口と人権侵害`,
    dossierDescription: (name, province, pop, incidents, detention, markets) =>
      `${province}の${name}です。人口は${pop == null ? '不明' : `${pop.toLocaleString('ja-JP')}人`}、記録された人権侵害は${incidents}件、拘束施設は${detention}か所、公式市場は${markets}か所です。`,
    jsonLdDescription: (province, pop) => `北朝鮮、${province}の行政区域です。人口: ${pop ?? '不明'}。`,
    crumb: '市・郡',
    kind: (isCity, province) => `${province}の${isCity ? '市' : '郡'}`,
    people: '人口',
    censusNote: '2008年の国勢調査、古い可能性があります',
    km2: 'km²',
    densityNote: (n) => `1km²あたり${n}人`,
    urban: '都市部に居住',
    openMap: 'インテルマップで開く',
    compare: '179の市・郡を比べる',
    rightsHeading: '侵害された権利別',
    rightsEmpty: 'まだ記録がありません。閉ざされた国では、これは普通、ここから脱出した目撃者がいないという意味であり、何も起きなかったという意味ではありません。',
    whenHeading: '起きた時期',
    sexHeading: '女性と男性',
    womenAria: (pct) => `女性${pct}%`,
    womenRest: (pct) => `人（女性 ${pct}%）`,
    menRest: '人（男性）',
    campsHeading: 'ここにある収容所',
    placesHeading: 'ここにある主な地点',
    elsewhere: (province) => `${province}の他の市・郡`,
    sourcesHeading: '出典',
  },
  zh: {
    metaTitle: '朝鲜179个市、郡：人口、人权侵害与设施',
    metaDescription: '朝鲜各市、郡的地图。列出2008年人口普查、NKDB记录的人权侵害、拘押设施和官方市场，覆盖全部179个市和郡。',
    eyebrow: '人口 · 地方资料',
    h1: '全部179个市和郡',
    lede: '朝鲜的每一个市和郡。包含2008年人口普查的人口、NKDB记录的人权侵害、拘押设施和官方市场。',
    peopleCensus: '人口（2008年普查）',
    million: (n) => `${n}百万`,
    documentedAbuses: '记录在案的人权侵害',
    nkdb: 'NKDB',
    detentionSites: '拘押设施',
    officialMarkets: '官方市场',
    censusAsOf: '人口普查年份',
    sourcesLead: '来源：',
    ochaShort: '联合国OCHA边界',
    ochaLong: '联合国OCHA行政边界',
    censusSource: '2008年人口普查（UNFPA）',
    nkdbSource: 'NKDB视觉地图集',
    caveat: '记录在案的人权侵害较少，通常意味着该郡的脱北者较少，而不是侵害本身更少。',
    metrics: {
      incidents: { label: '记录在案的人权侵害', unit: '起' },
      detention: { label: '拘押设施', unit: '处' },
      density: { label: '人口密度', unit: '人/km²' },
      markets: { label: '市场', unit: '处' },
    },
    mapAria: (label) => `按${label}着色的朝鲜市、郡地图`,
    hoverHint: '将鼠标悬停在市或郡上',
    tipPeople: (n) => `${n}人`,
    tipAbuses: (n) => `侵害${n}起`,
    tipDetention: (n) => `拘押${n}处`,
    tipMarkets: (n) => `市场${n}处`,
    colourBy: '着色依据',
    mapMetric: '地图指标',
    top5: '前5',
    search: '查找市或郡',
    countOf: (shown, total) => `${total}个中的${shown}个`,
    colCounty: '市、郡',
    colProvince: '道、市',
    colPop: '人口',
    colPerKm: '每km²',
    colAbuses: '侵害',
    colDetention: '拘押',
    colMarkets: '市场',
    dossierTitle: (name, province) => `${name}（${province}）：朝鲜市、郡的人口与人权侵害`,
    dossierDescription: (name, province, pop, incidents, detention, markets) =>
      `${name}位于${province}。人口${pop == null ? '不详' : pop.toLocaleString('zh-CN')}，记录在案的人权侵害${incidents}起，拘押设施${detention}处，官方市场${markets}处。`,
    jsonLdDescription: (province, pop) => `朝鲜${province}的行政区。人口：${pop ?? '不详'}。`,
    crumb: '市、郡',
    kind: (isCity, province) => `${province}的${isCity ? '市' : '郡'}`,
    people: '人口',
    censusNote: '2008年普查，可能已过时',
    km2: 'km²',
    densityNote: (n) => `每平方公里${n}人`,
    urban: '住在城镇',
    openMap: '在情报地图中打开',
    compare: '比较全部179个市和郡',
    rightsHeading: '按被侵害的权利',
    rightsEmpty: '目前还没有记录。在一个封闭的国家，这通常意味着没有从这里逃出的目击者，而不是什么都没发生。',
    whenHeading: '发生时间',
    sexHeading: '女性与男性',
    womenAria: (pct) => `女性${pct}%`,
    womenRest: (pct) => `人（女性${pct}%）`,
    menRest: '人（男性）',
    campsHeading: '当地的收容所',
    placesHeading: '当地的主要地点',
    elsewhere: (province) => `${province}的其他市、郡`,
    sourcesHeading: '来源',
  },
};
