// /sanctions/ships: ships on the North Korea sanctions lists as Global Fishing Watch sees them in AIS, and monthly
// satellite radar counts in North Korea's waters. Data: data/ships.json (scripts/build-ships.ts, weekly). Text for
// every language lives here; components/ShipsPage.tsx renders all four routes.
import raw from '../../data/ships.json';
import type { Lang } from '@/site/seo';
import type { ListKey } from '@/content/sanctions';

export interface ShipVisit {
  start: string;
  end: string;
  port: string;
  country: string;
  confidence: number;
  as: string;
  flag: string | null;
}
export interface Ship {
  name: string;
  imo: string;
  lists: ListKey[];
  un?: string;
  ais: {
    name: string;
    flag: string | null;
    mmsi: string;
    first: string;
    last: string;
  }[];
  lastSeen: string | null;
  visits: ShipVisit[];
  /** Every port call in the archive (since 2012), and how many were outside North Korea. */
  history: { visits: number; foreign: number; since: string | null };
  radarMonths: string[];
}
export interface NkPort {
  /** Anchorage name; with `near`, the nearest named port; "" when there is none within 40 km. */
  port: string;
  near: boolean;
  portId: string;
  lat: number;
  lon: number;
  visits: number;
  vessels: number;
  flags: Record<string, number>;
}
export interface ForeignCaller {
  name: string;
  mmsi: string;
  flag: string | null;
  vtype: string;
  first: string;
  last: string;
  visits: number;
  /** "NAMPO", "~NAMPO" (an anchorage near Nampo) or "@39.9,124.3" (no named port within 40 km) → visits. */
  ports: Record<string, number>;
  listedImo?: string;
}
export interface RadarMonth {
  month: string;
  detections: number;
  matched: number;
  flags: Record<string, number>;
  passes: number;
}

export const SHIPS = raw as unknown as {
  fetched: string;
  attribution: string;
  sanctionsFetched: string;
  window: { from: string; to: string };
  radarThrough: string;
  listedImos: number;
  resolved: number;
  ships: Ship[];
  radar: RadarMonth[];
  radarYears: {
    year: string;
    detections: number;
    matched: number;
    passes: number;
    months: number;
  }[];
  ports: {
    visits: number;
    vessels: number;
    foreignVisits: number;
    list: NkPort[];
    foreign: ForeignCaller[];
  };
};

export const SHIPS_PATHS = {
  en: '/sanctions/ships',
  ko: '/ko/sanctions/ships',
  ja: '/ja/sanctions/ships',
  zh: '/zh/sanctions/ships',
} as const;
export const SHIPS_DATA_URL = 'https://github.com/Ahmet-Dedeler/free-north-korea/blob/main/data/ships.json';
export const SHIPS_RAW_URL = 'https://raw.githubusercontent.com/Ahmet-Dedeler/free-north-korea/main/data/ships.json';
export const GFW_URL = 'https://globalfishingwatch.org/';

export const SHIP_SOURCES = [
  {
    name: 'Global Fishing Watch: APIs (vessel identity, port visits, SAR vessel detections)',
    url: 'https://globalfishingwatch.org/our-apis/',
    note: 'CC BY-NC 4.0',
  },
  {
    name: 'Global Fishing Watch: API license and rate limits',
    url: 'https://globalfishingwatch.org/our-apis/documentation/docs/license-rate-limits.md',
    note: 'Terms',
  },
  {
    name: 'Park et al., "Illuminating dark fishing fleets in North Korea", Science Advances (2020)',
    url: 'https://doi.org/10.1126/sciadv.abb1197',
    note: 'Peer-reviewed',
  },
  {
    name: 'Paolo et al., "Satellite mapping reveals extensive industrial activity at sea", Nature (2024)',
    url: 'https://doi.org/10.1038/s41586-023-06825-8',
    note: 'How the radar detections are made',
  },
  {
    name: 'Microsoft Planetary Computer: Sentinel-1 catalog (passes per month)',
    url: 'https://planetarycomputer.microsoft.com/dataset/sentinel-1-rtc',
    note: 'Copernicus data',
  },
  {
    name: 'Ship data built by this site (JSON)',
    url: SHIPS_DATA_URL,
    note: 'GitHub',
  },
];

export interface ShipsText {
  metaTitle: string;
  metaDescription: string;
  datasetDescription: string;
  eyebrow: string;
  h1: string;
  lede: (listed: number) => string;
  readTitle: string;
  read: string[];
  tiles: {
    listed: string;
    broadcasting: string;
    abroad: string;
    radar: string;
    dark: string;
  };
  tileNote: {
    listed: string;
    broadcasting: string;
    abroad: string;
    radar: string;
    dark: (month: string) => string;
  };
  abroadTitle: string;
  abroadHint: string;
  col: {
    ship: string;
    lists: string;
    as: string;
    port: string;
    dates: string;
    imo: string;
    lastSeen: string;
    visits: string;
    radar: string;
  };
  abroadNone: string;
  radarTitle: string;
  radarHint: string;
  key: { dark: string; matched: string };
  partial: string;
  passes: string;
  detectionsIn: (n: number, passes: number) => string;
  caveatTitle: string;
  caveat: string[];
  flagsTitle: string;
  flagsHint: string;
  seenTitle: string;
  seenHint: string;
  allTitle: string;
  allHint: string;
  noAis: string;
  abroadShort: string;
  otherName: string;
  visitsN: (n: number) => string;
  asOf: string;
  unknownPort: string;
  attribution: string;
  portsTitle: string;
  portsHint: string;
  portsTiles: { visits: string; vessels: string; foreign: string };
  foreignTitle: string;
  foreignHint: string;
  busiestTitle: string;
  near: (port: string) => string;
  col2: {
    vessel: string;
    flag: string;
    type: string;
    ports: string;
    history: string;
  };
  vtype: Record<string, string>;
  historyTitle: string;
  historyHint: string;
  perDay: string;
  sinceShort: (year: string) => string;
  back: string;
  dataLink: string;
  sources: string;
}

const EN: ShipsText = {
  metaTitle: 'Sanctioned North Korea ships: where they are now',
  metaDescription:
    'Every ship on the US, UK, EU and Japanese North Korea sanctions lists, tracked through its own AIS signal: what it broadcasts, when it was last heard, which foreign ports it called at, and what satellite radar sees in North Korean waters. Updated weekly.',
  datasetDescription:
    'Ships on the North Korea sanctions lists of the United States, United Kingdom, European Union and Japan, matched by IMO number to Global Fishing Watch AIS identity records and port visits for the last 12 months, plus monthly Sentinel-1 radar vessel detections in North Korea’s exclusive economic zone and how many of them were broadcasting AIS.',
  eyebrow: 'Sanctions · Ships',
  h1: 'Sanctioned ships, as their own signals show them',
  lede: (n) =>
    `${n} ships on the North Korea sanctions lists have an IMO number, the hull number that stays with a ship when its name changes. Many still sail. This page shows what they broadcast, which ports they called at, and what satellite radar sees in North Korea’s waters. Rebuilt every week.`,
  readTitle: 'How to read this page',
  read: [
    'AIS is the radio beacon ships use to say who and where they are. The ship sends it itself, so a name, flag or even an IMO number can be false or mistyped. We only keep broadcasts that carry the listed IMO number, and we show the name and flag used each time. A match is a lead, not proof.',
    'Each national list applies where that government has jurisdiction. A US or UK listing does not by itself close a port in China or Russia. The UN Security Council’s 1718 Committee also designates ships; its vessel list is not in this table yet.',
    'Port visits are Global Fishing Watch’s own, kept only at confidence 3 or 4 on its scale of 1 to 4.',
  ],
  tiles: {
    listed: 'listed ships with an IMO number',
    broadcasting: 'broadcast AIS in the last 12 months',
    abroad: 'called at a port outside North Korea',
    radar: 'seen by satellite radar in North Korean waters',
    dark: 'of ships radar saw in North Korean waters sent no AIS',
  },
  tileNote: {
    listed: 'US, UK, EU and Japanese lists',
    broadcasting: 'under the listed IMO number',
    abroad: 'last 12 months; see the names they used',
    radar: 'last 12 months, by IMO number',
    dark: (m) => `in ${m}`,
  },
  abroadTitle: 'Port calls outside North Korea',
  abroadHint:
    'Last 12 months, one row per ship and the name it used, newest first. "Other name" marks a broadcast name that differs from the listed one: a rename, or another vessel using the same IMO number.',
  col: {
    ship: 'Listed ship',
    lists: 'Lists',
    as: 'Broadcast as',
    port: 'Port',
    dates: 'Dates',
    imo: 'IMO',
    lastSeen: 'Last AIS signal',
    visits: 'Port calls',
    radar: 'Seen by radar',
  },
  abroadNone: 'No port calls outside North Korea in the last 12 months.',
  radarTitle: 'Satellite radar in North Korea’s waters',
  radarHint:
    'Sentinel-1 radar sees ships through cloud and at night. Global Fishing Watch finds the vessels in each image and checks which were broadcasting AIS at the time. Counts per month in North Korea’s exclusive economic zone.',
  key: { dark: 'no AIS', matched: 'broadcasting AIS' },
  partial: 'month so far',
  passes: 'Days with a radar pass',
  detectionsIn: (n, p) => `${n.toLocaleString('en')} detections, ${p} days with a radar pass`,
  caveatTitle: 'What "no AIS" means',
  caveat: [
    'Most vessels that send no AIS signal here are fishing boats, many of them Chinese (Park et al., 2020). A dark ship is not a sanctions case by itself.',
    'The detector misses most boats under 15 metres and anything within about 1 km of shore, so North Korea’s ports and its small wooden boats are not counted. More radar passes in a month also means more detections.',
  ],
  flagsTitle: 'Flags broadcast by ships radar saw',
  flagsHint: 'Only detections matched to a ship broadcasting AIS, last 12 months. A flag in AIS is what the ship claims.',
  seenTitle: 'Listed ships seen by radar in North Korean waters',
  seenHint: 'Radar detections Global Fishing Watch matched to a ship broadcasting the listed IMO number.',
  allTitle: 'Every listed ship',
  allHint: 'Sorted by the last AIS signal under the listed IMO number. Ships with no record may be scrapped, renamed without their IMO, or silent.',
  noAis: 'no AIS record',
  abroadShort: 'abroad',
  otherName: 'other name',
  visitsN: (n) => (n === 1 ? '1 visit' : `${n} visits`),
  asOf: 'Data to',
  unknownPort: 'anchorage',
  attribution: 'Powered by Global Fishing Watch',
  portsTitle: 'Who calls at North Korean ports',
  portsHint:
    'Every vessel Global Fishing Watch saw stop at a North Korean anchorage in the last 12 months, at confidence 3 or 4. Fishing-gear buoys and placeholder MMSI numbers are left out. Most ships near North Korea send no AIS at all, so these are the ones that did, not all traffic.',
  portsTiles: {
    visits: 'port visits',
    vessels: 'vessels',
    foreign: 'visits by foreign-flagged vessels',
  },
  foreignTitle: 'Foreign-flagged vessels',
  foreignHint: 'Newest first, with the name and flag each one broadcast.',
  busiestTitle: 'Busiest anchorages',
  near: (p) => `near ${p}`,
  col2: {
    vessel: 'Vessel',
    flag: 'Flag',
    type: 'Type',
    ports: 'Where',
    history: 'Port calls since 2012',
  },
  vtype: {
    cargo: 'cargo',
    fishing: 'fishing',
    tanker: 'tanker',
    carrier: 'carrier',
    other: 'other',
    na: 'unknown',
  },
  historyTitle: 'Radar since 2017',
  historyHint:
    'Vessels detected in North Korea’s waters per day with a radar pass, by year. Detections fell to about a quarter in 2020 to 2022, the years North Korea kept its border closed over Covid-19.',
  perDay: 'per radar day',
  sinceShort: (y) => `since ${y}`,
  back: 'All North Korea sanctions lists',
  dataLink: 'Download the data (JSON)',
  sources: 'Sources',
};

const KO: ShipsText = {
  metaTitle: '대북 제재 선박: 지금 어디에 있나',
  metaDescription:
    '미국·영국·EU·일본의 대북 제재 명단에 오른 모든 선박을 선박 자체의 AIS 신호로 추적합니다. 어떤 이름으로 송신하는지, 마지막 신호가 언제인지, 어느 외국 항구에 들렀는지, 북한 수역에서 위성 레이더가 무엇을 보는지. 매주 갱신.',
  datasetDescription:
    '미국, 영국, 유럽연합, 일본의 대북 제재 명단에 오른 선박을 IMO 번호로 Global Fishing Watch의 AIS 식별 기록 및 최근 12개월 입항 기록과 대조한 데이터와, 북한 배타적 경제수역의 월별 Sentinel-1 레이더 선박 탐지 수 및 그중 AIS를 송신한 선박 수.',
  eyebrow: '제재 · 선박',
  h1: '제재 선박, 스스로 보내는 신호로 본 모습',
  lede: (n) =>
    `대북 제재 명단의 선박 중 ${n}척은 IMO 번호가 있습니다. 이름이 바뀌어도 선체에 남는 번호입니다. 상당수는 아직 운항합니다. 이 페이지는 이 선박들이 무엇을 송신하는지, 어느 항구에 들렀는지, 북한 수역에서 위성 레이더가 무엇을 보는지 보여 줍니다. 매주 새로 만듭니다.`,
  readTitle: '이 페이지를 읽는 법',
  read: [
    'AIS는 선박이 자기 정체와 위치를 알리는 무선 신호입니다. 선박이 직접 보내므로 이름, 국적, 심지어 IMO 번호도 거짓이거나 잘못 입력될 수 있습니다. 명단의 IMO 번호를 담은 송신만 남기고, 매번 사용한 이름과 국적을 함께 보여 줍니다. 일치는 단서이지 증거가 아닙니다.',
    '각국 명단은 그 정부의 관할 범위에서 적용됩니다. 미국이나 영국의 지정만으로 중국이나 러시아의 항구가 닫히지는 않습니다. 유엔 안보리 1718 위원회도 선박을 지정하지만, 그 선박 목록은 아직 이 표에 없습니다.',
    '입항 기록은 Global Fishing Watch의 것으로, 1~4 척도에서 신뢰도 3 또는 4인 것만 남겼습니다.',
  ],
  tiles: {
    listed: 'IMO 번호가 있는 제재 선박',
    broadcasting: '최근 12개월 AIS 송신',
    abroad: '북한 밖 항구 입항',
    radar: '북한 수역에서 위성 레이더에 포착',
    dark: '북한 수역에서 레이더에 잡힌 선박 중 AIS 미송신',
  },
  tileNote: {
    listed: '미국·영국·EU·일본 명단',
    broadcasting: '명단의 IMO 번호로',
    abroad: '최근 12개월, 사용한 이름 참고',
    radar: '최근 12개월, IMO 번호 기준',
    dark: (m) => `${m} 기준`,
  },
  abroadTitle: '북한 밖 항구 입항',
  abroadHint:
    '최근 12개월, 선박과 사용한 이름별로 한 줄, 최신순. "다른 이름"은 송신 이름이 명단의 이름과 다르다는 표시입니다. 개명했거나, 다른 선박이 같은 IMO 번호를 쓰는 경우입니다.',
  col: {
    ship: '제재 선박',
    lists: '명단',
    as: '송신 이름',
    port: '항구',
    dates: '날짜',
    imo: 'IMO',
    lastSeen: '마지막 AIS 신호',
    visits: '입항',
    radar: '레이더 포착',
  },
  abroadNone: '최근 12개월 동안 북한 밖 항구 입항 기록이 없습니다.',
  radarTitle: '북한 수역의 위성 레이더',
  radarHint:
    'Sentinel-1 레이더는 구름을 뚫고 밤에도 선박을 봅니다. Global Fishing Watch가 영상마다 선박을 찾고, 그 시각 AIS를 송신하던 선박인지 확인합니다. 북한 배타적 경제수역의 월별 수치입니다.',
  key: { dark: 'AIS 없음', matched: 'AIS 송신' },
  partial: '이번 달 현재까지',
  passes: '레이더 통과 일수',
  detectionsIn: (n, p) => `탐지 ${n.toLocaleString('ko')}건, 레이더 통과 ${p}일`,
  caveatTitle: '"AIS 없음"의 뜻',
  caveat: [
    '이 수역에서 AIS를 보내지 않는 선박은 대부분 어선이며, 중국 어선이 많습니다(Park 외, 2020). 신호를 끈 선박이라고 해서 그 자체로 제재 위반은 아닙니다.',
    '탐지기는 15m 미만 선박 대부분과 해안 약 1km 이내를 놓칩니다. 따라서 북한의 항구와 소형 목선은 세지 않습니다. 한 달에 레이더 통과가 많을수록 탐지도 늘어납니다.',
  ],
  flagsTitle: '레이더에 잡힌 선박이 송신한 국적',
  flagsHint: 'AIS를 송신하던 선박과 대조된 탐지만, 최근 12개월. AIS의 국적은 선박이 주장하는 것입니다.',
  seenTitle: '북한 수역에서 레이더에 잡힌 제재 선박',
  seenHint: 'Global Fishing Watch가 명단의 IMO 번호를 송신하던 선박과 대조한 레이더 탐지.',
  allTitle: '제재 선박 전체',
  allHint: '명단의 IMO 번호로 보낸 마지막 AIS 신호 순. 기록이 없는 선박은 해체되었거나, IMO 없이 이름을 바꿨거나, 신호를 끈 것일 수 있습니다.',
  noAis: 'AIS 기록 없음',
  abroadShort: '해외',
  otherName: '다른 이름',
  visitsN: (n) => `입항 ${n}회`,
  asOf: '데이터 기준',
  unknownPort: '정박지',
  attribution: 'Powered by Global Fishing Watch',
  portsTitle: '북한 항구에 들어오는 선박',
  portsHint:
    'Global Fishing Watch가 최근 12개월 동안 북한 정박지에 머문 것으로 본 모든 선박입니다(신뢰도 3 또는 4). 어구 부표와 임시 MMSI 번호는 뺐습니다. 북한 근처 선박 대부분은 AIS를 아예 보내지 않으므로, 이는 전체 통항이 아니라 신호를 보낸 선박입니다.',
  portsTiles: {
    visits: '입항',
    vessels: '선박',
    foreign: '외국 국적 선박의 입항',
  },
  foreignTitle: '외국 국적 선박',
  foreignHint: '최신순, 각 선박이 송신한 이름과 국적.',
  busiestTitle: '가장 붐비는 정박지',
  near: (p) => `${p} 인근`,
  col2: {
    vessel: '선박',
    flag: '국적',
    type: '종류',
    ports: '위치',
    history: '2012년 이후 입항',
  },
  vtype: {
    cargo: '화물선',
    fishing: '어선',
    tanker: '유조선',
    carrier: '운반선',
    other: '기타',
    na: '미상',
  },
  historyTitle: '2017년 이후 레이더',
  historyHint: '북한 수역에서 레이더가 지나간 날 하루 평균 탐지된 선박 수, 연도별. 북한이 코로나19로 국경을 닫았던 2020~2022년에는 탐지가 약 4분의 1로 줄었습니다.',
  perDay: '레이더 통과일 평균',
  sinceShort: (y) => `${y}년 이후`,
  back: '대북 제재 명단 전체',
  dataLink: '데이터 내려받기 (JSON)',
  sources: '출처',
};

const JA: ShipsText = {
  metaTitle: '対北朝鮮制裁の船舶：今どこにいるか',
  metaDescription:
    '米国・英国・EU・日本の対北朝鮮制裁リストに載るすべての船舶を、船自身のAIS信号で追跡。どの名前で発信しているか、最後の信号はいつか、どの外国の港に寄ったか、北朝鮮の水域で衛星レーダーが何を捉えているか。毎週更新。',
  datasetDescription:
    '米国、英国、欧州連合、日本の対北朝鮮制裁リストに載る船舶を、IMO番号でGlobal Fishing WatchのAIS識別記録と直近12か月の寄港記録に照合したデータ。あわせて北朝鮮の排他的経済水域における月別のSentinel-1レーダー船舶検出数と、そのうちAISを発信していた数。',
  eyebrow: '制裁 · 船舶',
  h1: '制裁対象の船舶、自らの信号が示す姿',
  lede: (n) =>
    `対北朝鮮制裁リストの船舶のうち${n}隻にIMO番号があります。船名が変わっても船体に残る番号です。多くは今も航行しています。このページでは、これらの船が何を発信しているか、どの港に寄ったか、北朝鮮の水域で衛星レーダーが何を捉えているかを示します。毎週作り直します。`,
  readTitle: 'このページの読み方',
  read: [
    'AISは船が自分の名前と位置を知らせる無線信号です。船自身が送るため、船名、旗国、IMO番号でさえ偽りや入力ミスがありえます。リストのIMO番号を含む発信だけを残し、そのつど使われた船名と旗国を示します。一致は手がかりであって、証拠ではありません。',
    '各国のリストは、その政府の管轄の及ぶ範囲で効力を持ちます。米国や英国の指定だけで、中国やロシアの港が閉ざされるわけではありません。国連安保理の1718委員会も船舶を指定していますが、その船舶リストはまだこの表に入っていません。',
    '寄港記録はGlobal Fishing Watchのもので、1〜4の尺度で信頼度3または4のものだけを残しています。',
  ],
  tiles: {
    listed: 'IMO番号のある制裁船舶',
    broadcasting: '直近12か月にAISを発信',
    abroad: '北朝鮮国外の港に寄港',
    radar: '北朝鮮の水域で衛星レーダーが捕捉',
    dark: '北朝鮮の水域でレーダーが捉えた船のうちAISなし',
  },
  tileNote: {
    listed: '米国・英国・EU・日本のリスト',
    broadcasting: 'リストのIMO番号で',
    abroad: '直近12か月、使われた船名に注意',
    radar: '直近12か月、IMO番号で照合',
    dark: (m) => `${m}`,
  },
  abroadTitle: '北朝鮮国外への寄港',
  abroadHint: '直近12か月、船と使われた船名ごとに1行、新しい順。「別名」は発信名がリストの船名と違うことを示します。改名したか、別の船が同じIMO番号を使っている場合です。',
  col: {
    ship: '制裁船舶',
    lists: 'リスト',
    as: '発信名',
    port: '港',
    dates: '日付',
    imo: 'IMO',
    lastSeen: '最後のAIS信号',
    visits: '寄港',
    radar: 'レーダー捕捉',
  },
  abroadNone: '直近12か月、北朝鮮国外への寄港記録はありません。',
  radarTitle: '北朝鮮の水域の衛星レーダー',
  radarHint:
    'Sentinel-1のレーダーは雲を通して、夜でも船を捉えます。Global Fishing Watchが画像ごとに船を見つけ、その時刻にAISを発信していた船かどうかを確かめます。北朝鮮の排他的経済水域の月別の数です。',
  key: { dark: 'AISなし', matched: 'AIS発信' },
  partial: '今月分（途中）',
  passes: 'レーダー通過日数',
  detectionsIn: (n, p) => `検出 ${n.toLocaleString('ja')}件、レーダー通過 ${p}日`,
  caveatTitle: '「AISなし」の意味',
  caveat: [
    'この水域でAISを送らない船の大半は漁船で、中国の漁船が多くを占めます（Park他、2020年）。信号のない船がそれだけで制裁違反というわけではありません。',
    '検出器は全長15m未満の船の大半と、岸から約1km以内を見逃します。そのため北朝鮮の港や小型の木造船は数えられていません。月のレーダー通過が多いほど、検出も増えます。',
  ],
  flagsTitle: 'レーダーが捉えた船が発信した旗国',
  flagsHint: 'AISを発信していた船と照合された検出のみ、直近12か月。AISの旗国は船の自己申告です。',
  seenTitle: '北朝鮮の水域でレーダーに捉えられた制裁船舶',
  seenHint: 'Global Fishing Watchが、リストのIMO番号を発信していた船と照合したレーダー検出。',
  allTitle: '制裁船舶の一覧',
  allHint: 'リストのIMO番号で送られた最後のAIS信号の順。記録のない船は、解体された、IMOなしで改名した、または信号を止めている可能性があります。',
  noAis: 'AIS記録なし',
  abroadShort: '国外',
  otherName: '別名',
  visitsN: (n) => `寄港${n}回`,
  asOf: 'データ時点',
  unknownPort: '錨地',
  attribution: 'Powered by Global Fishing Watch',
  portsTitle: '北朝鮮の港に入る船',
  portsHint:
    'Global Fishing Watchが直近12か月に北朝鮮の錨地に停泊したと判断したすべての船です（信頼度3または4）。漁具のブイと仮のMMSI番号は除いています。北朝鮮近くの船の多くはAISをまったく送らないため、これは全体の交通量ではなく、信号を送った船です。',
  portsTiles: { visits: '寄港', vessels: '隻', foreign: '外国籍船の寄港' },
  foreignTitle: '外国籍の船',
  foreignHint: '新しい順。各船が発信した船名と旗国。',
  busiestTitle: '寄港の多い錨地',
  near: (p) => `${p}付近`,
  col2: {
    vessel: '船',
    flag: '旗国',
    type: '種類',
    ports: '場所',
    history: '2012年以降の寄港',
  },
  vtype: {
    cargo: '貨物船',
    fishing: '漁船',
    tanker: 'タンカー',
    carrier: '運搬船',
    other: 'その他',
    na: '不明',
  },
  historyTitle: '2017年以降のレーダー',
  historyHint: '北朝鮮の水域で、レーダーが通過した日1日あたりに検出された船の数、年別。北朝鮮が新型コロナで国境を閉じていた2020〜2022年には、検出が約4分の1に減りました。',
  perDay: 'レーダー通過日あたり',
  sinceShort: (y) => `${y}年以降`,
  back: '対北朝鮮制裁リストの全体',
  dataLink: 'データをダウンロード（JSON）',
  sources: '出典',
};

const ZH: ShipsText = {
  metaTitle: '对朝鲜制裁船舶：现在在哪里',
  metaDescription:
    '美国、英国、欧盟和日本对朝制裁名单上的每一艘船，通过船舶自身的AIS信号追踪：以什么名字发信号、最后一次信号是何时、停靠过哪些外国港口，以及卫星雷达在朝鲜水域看到了什么。每周更新。',
  datasetDescription:
    '美国、英国、欧盟和日本对朝制裁名单上的船舶，按IMO编号与Global Fishing Watch的AIS身份记录及最近12个月的港口停靠记录比对；另附朝鲜专属经济区内每月的Sentinel-1雷达船舶探测数，以及其中正在发送AIS信号的数量。',
  eyebrow: '制裁 · 船舶',
  h1: '受制裁船舶：它们自己的信号显示了什么',
  lede: (n) =>
    `对朝制裁名单上有${n}艘船有IMO编号，这是船改名后仍留在船体上的编号。其中许多仍在航行。本页显示这些船发送了什么信号、停靠过哪些港口，以及卫星雷达在朝鲜水域看到了什么。每周重新生成。`,
  readTitle: '如何阅读本页',
  read: [
    'AIS是船舶用来报告身份和位置的无线电信号。信号由船自己发送，因此船名、船旗甚至IMO编号都可能是假的或输错的。我们只保留带有名单上IMO编号的信号，并每次列出所用的船名和船旗。匹配只是线索，不是证据。',
    '各国名单只在该国政府有管辖权的范围内适用。美国或英国的列名本身并不会关闭中国或俄罗斯的港口。联合国安理会1718委员会也指认船舶，但其船舶名单尚未纳入本表。',
    '港口停靠记录来自Global Fishing Watch，只保留其1至4级可信度中3级和4级的记录。',
  ],
  tiles: {
    listed: '有IMO编号的受制裁船舶',
    broadcasting: '最近12个月发送过AIS',
    abroad: '停靠过朝鲜以外的港口',
    radar: '在朝鲜水域被卫星雷达发现',
    dark: '雷达在朝鲜水域发现的船中没有AIS的比例',
  },
  tileNote: {
    listed: '美国、英国、欧盟和日本名单',
    broadcasting: '使用名单上的IMO编号',
    abroad: '最近12个月，请看所用船名',
    radar: '最近12个月，按IMO编号',
    dark: (m) => `${m}`,
  },
  abroadTitle: '在朝鲜以外的港口停靠',
  abroadHint: '最近12个月，每艘船及其所用名称一行，按时间倒序。“其他名称”表示发送的船名与名单上的不同：可能是改名，也可能是另一艘船在使用同一个IMO编号。',
  col: {
    ship: '受制裁船舶',
    lists: '名单',
    as: '发送名称',
    port: '港口',
    dates: '日期',
    imo: 'IMO',
    lastSeen: '最后AIS信号',
    visits: '停靠',
    radar: '雷达发现',
  },
  abroadNone: '最近12个月没有在朝鲜以外港口停靠的记录。',
  radarTitle: '朝鲜水域的卫星雷达',
  radarHint: 'Sentinel-1雷达能穿透云层、在夜间看到船舶。Global Fishing Watch在每幅图像中找出船舶，并核对当时哪些船在发送AIS信号。以下为朝鲜专属经济区内的月度数字。',
  key: { dark: '无AIS', matched: '发送AIS' },
  partial: '本月至今',
  passes: '雷达过境天数',
  detectionsIn: (n, p) => `探测 ${n.toLocaleString('zh')} 次，雷达过境 ${p} 天`,
  caveatTitle: '“无AIS”是什么意思',
  caveat: [
    '在这片水域不发送AIS信号的船大多是渔船，其中许多是中国渔船（Park等，2020）。没有信号的船本身并不等于违反制裁。',
    '探测器会漏掉大多数15米以下的船和离岸约1公里以内的一切，因此朝鲜的港口和小型木船不在统计之内。一个月内雷达过境越多，探测数也越多。',
  ],
  flagsTitle: '雷达发现的船舶所发送的船旗',
  flagsHint: '仅限与正在发送AIS信号的船匹配的探测，最近12个月。AIS中的船旗是船舶自称的。',
  seenTitle: '在朝鲜水域被雷达发现的受制裁船舶',
  seenHint: 'Global Fishing Watch与发送名单IMO编号的船舶匹配的雷达探测。',
  allTitle: '全部受制裁船舶',
  allHint: '按使用名单IMO编号发出的最后AIS信号排序。没有记录的船可能已拆解、改名时未带IMO编号，或已关闭信号。',
  noAis: '无AIS记录',
  abroadShort: '国外',
  otherName: '其他名称',
  visitsN: (n) => `停靠${n}次`,
  asOf: '数据截至',
  unknownPort: '锚地',
  attribution: 'Powered by Global Fishing Watch',
  portsTitle: '哪些船停靠朝鲜港口',
  portsHint:
    'Global Fishing Watch在最近12个月内观测到在朝鲜锚地停靠的所有船舶（可信度3或4）。已剔除渔具浮标和占位MMSI编号。朝鲜附近的大多数船根本不发送AIS信号，因此这里只是发送了信号的船，不是全部船舶往来。',
  portsTiles: {
    visits: '次停靠',
    vessels: '艘船',
    foreign: '外国船旗船舶停靠',
  },
  foreignTitle: '外国船旗船舶',
  foreignHint: '按时间倒序，附各船发送的船名和船旗。',
  busiestTitle: '最繁忙的锚地',
  near: (p) => `${p}附近`,
  col2: {
    vessel: '船舶',
    flag: '船旗',
    type: '类型',
    ports: '地点',
    history: '2012年以来停靠',
  },
  vtype: {
    cargo: '货船',
    fishing: '渔船',
    tanker: '油轮',
    carrier: '运输船',
    other: '其他',
    na: '未知',
  },
  historyTitle: '2017年以来的雷达',
  historyHint: '朝鲜水域内每个雷达过境日平均探测到的船舶数，按年份。2020至2022年朝鲜因新冠疫情关闭边境期间，探测数降到约四分之一。',
  perDay: '每个雷达过境日',
  sinceShort: (y) => `${y}年以来`,
  back: '全部对朝制裁名单',
  dataLink: '下载数据（JSON）',
  sources: '来源',
};

export const SHIPS_TEXT: Record<Lang, ShipsText> = {
  en: EN,
  ko: KO,
  ja: JA,
  zh: ZH,
};
