/**
 * Text for the event wire in every language: the seismic block on /military, the "reported by Japan's Ministry of
 * Defense" block on /missiles/list and the EventFeed component. Data and grouping are in events.ts.
 * USGS labels are translated word for word (the English label is kept in a tooltip). MOD's launch areas are
 * translated from a short list of the phrases it uses; anything else is shown in MOD's Japanese.
 */
import type { Bound, CountNote, Eez, Landing, Weapon } from '@/content/events';
import type { Lang } from '@/site/seo';

export const EVENT_LOCALE: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-CN' };

/** Formats an ISO instant as a date (and time) in UTC, or in Japan time with tz 'Asia/Tokyo'. */
export function formatWhen(iso: string, lang: Lang, opts: { time?: boolean; tz?: 'UTC' | 'Asia/Tokyo' } = {}) {
  const { time = true, tz = 'UTC' } = opts;
  const d = new Date(iso);
  const date = d.toLocaleDateString(EVENT_LOCALE[lang], { timeZone: tz, day: 'numeric', month: 'short', year: 'numeric' });
  if (!time) return date;
  const hm = d.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
  return `${date} ${hm} ${tz === 'UTC' ? 'UTC' : EVENT_TEXT[lang].jst}`;
}

/** MOD's usual launch-area phrases (after NFKC normalisation), translated. Keys are MOD's Japanese. */
const AREAS: Record<string, Record<Exclude<Lang, 'ja'>, string>> = {
  北朝鮮東岸付近: { en: "near North Korea's east coast", ko: '북한 동해안 부근', zh: '朝鲜东海岸附近' },
  北朝鮮西岸付近: { en: "near North Korea's west coast", ko: '북한 서해안 부근', zh: '朝鲜西海岸附近' },
  北朝鮮内陸部: { en: 'inland North Korea', ko: '북한 내륙', zh: '朝鲜内陆' },
  北朝鮮: { en: 'North Korea', ko: '북한', zh: '朝鲜' },
  朝鮮半島東岸付近: { en: 'near the east coast of the Korean Peninsula', ko: '한반도 동해안 부근', zh: '朝鲜半岛东海岸附近' },
  朝鮮半島西岸付近: { en: 'near the west coast of the Korean Peninsula', ko: '한반도 서해안 부근', zh: '朝鲜半岛西海岸附近' },
  平壌近郊: { en: 'near Pyongyang', ko: '평양 근교', zh: '平壤近郊' },
  平壌付近: { en: 'near Pyongyang', ko: '평양 부근', zh: '平壤附近' },
  北朝鮮平壌近郊: { en: 'near Pyongyang', ko: '평양 근교', zh: '平壤近郊' },
  北朝鮮の内陸部: { en: 'inland North Korea', ko: '북한 내륙', zh: '朝鲜内陆' },
  北朝鮮西岸: { en: "North Korea's west coast", ko: '북한 서해안', zh: '朝鲜西海岸' },
  北朝鮮東岸: { en: "North Korea's east coast", ko: '북한 동해안', zh: '朝鲜东海岸' },
  '北朝鮮北西部沿岸地域の東倉里(トンチャンリ)地区': { en: 'Tongchang-ri, on the northwest coast', ko: '서북부 해안 동창리 지구', zh: '西北部沿海的东仓里地区' },
  '北朝鮮西岸の東倉里(トンチャンリ)付近': { en: 'near Tongchang-ri, on the west coast', ko: '서해안 동창리 부근', zh: '西海岸东仓里附近' },
  '北朝鮮の東岸の宣徳(ソンドク)付近': { en: 'near Sondok, on the east coast', ko: '동해안 선덕 부근', zh: '东海岸宣德附近' },
  朝鮮半島東部の新浦付近: { en: 'near Sinpo, on the east coast', ko: '동해안 신포 부근', zh: '东部新浦附近' },
};

/** Launch area in the page language, or null when MOD's phrase isn't in the list (then show `areaJa` as Japanese). */
export function areaText(areaJa: string | null, lang: Lang): string | null {
  if (!areaJa) return null;
  if (lang === 'ja') return areaJa;
  return AREAS[areaJa]?.[lang] ?? null;
}

interface EventText {
  jst: string;
  utc: string;
  km: (n: number) => string;
  /** USGS event types, translated. Unknown types are shown as USGS writes them. */
  usgsTypes: Record<string, string>;
  seismic: {
    title: string;
    body: (tests: number) => string;
    nearTitle: (n: number, km: number) => string;
    columns: { date: string; label: string; magnitude: string; distance: string; place: string; link: string };
    fromSite: (km: string) => string;
    open: string;
    allTitle: (n: number, since: number) => string;
    allNote: string;
    fetched: string;
    sourceBefore: string;
  };
  launches: {
    title: string;
    body: string;
    notYet: string;
    upToDate: string;
    columns: { time: string; missiles: string; distance: string; apogee: string; landed: string; report: string };
    report: string;
    alsoReports: (n: number) => string;
    checked: string;
    datasetLast: string;
  };
  /** Empty string when MOD gives no count at all. */
  count: (n: number | null, note: CountNote | null) => string;
  weapon: Record<Weapon, string>;
  landing: Record<Landing, string>;
  eez: Record<Eez, string>;
  /** A distance MOD gives as a lower bound. */
  bound: (km: string, bound: Bound) => string;
  feed: {
    title: string;
    note: string;
    quake: (label: string, mag: string) => string;
    /** `range` comes ready-made from `about` or `bound`. */
    launch: (count: string, weapon: string, range: string | null) => string;
    about: (km: string) => string;
    by: { usgs: string; mod: string };
    source: string;
  };
}

export const EVENT_TEXT: Record<Lang, EventText> = {
  en: {
    jst: 'Japan time',
    utc: 'UTC',
    km: (n) => `${n.toLocaleString('en-GB')} km`,
    usgsTypes: {
      'nuclear explosion': 'nuclear explosion',
      collapse: 'collapse',
      earthquake: 'earthquake',
      explosion: 'explosion',
      'quarry blast': 'quarry blast',
      'other event': 'other event',
    },
    seismic: {
      title: 'What the seismometers recorded',
      body: (tests) =>
        `Seismometers around the world pick up every nuclear test. The US Geological Survey (USGS) lists ${tests} events at Punggye-ri as "nuclear explosion", including the first three tests in 2006, 2009 and 2013. The labels below are USGS's own; the distance from the test site is worked out from its coordinates.`,
      nearTitle: (n, km) => `${n} events within ${km} km of the Punggye-ri test site`,
      columns: { date: 'Date (UTC)', label: 'USGS label', magnitude: 'Magnitude', distance: 'From the test site', place: 'Place (as USGS writes it)', link: 'USGS page' },
      fromSite: (km) => `${km} from Punggye-ri`,
      open: 'Open',
      allTitle: (n, since) => `All ${n} events USGS lists in and around North Korea since ${since}`,
      allNote:
        'The search box (37.5 to 43.1°N, 124 to 131°E) also covers parts of China, Russia, South Korea and the sea. USGS writes some Korean place names with a "?" where a letter was lost; they are shown as USGS has them.',
      fetched: 'USGS catalog downloaded',
      sourceBefore: 'Source: ',
    },
    launches: {
      title: "Reported by Japan's Ministry of Defense",
      body: "Japan's Ministry of Defense announces each North Korean ballistic missile launch it tracks, usually within hours. The table below comes from the CNS database, which can be a few days behind. Launches the ministry has reported since the last test in that database are listed here first. Numbers are the ministry's estimates.",
      notYet: 'Not yet in the database',
      upToDate: "Every launch in the ministry's reports so far is already in the table below. The latest reports:",
      columns: { time: 'Launch', missiles: 'Missiles', distance: 'Distance', apogee: 'Apogee', landed: 'Came down', report: 'Report' },
      report: 'PDF (Japanese)',
      alsoReports: (n) => `${n} earlier release${n === 1 ? '' : 's'}`,
      checked: 'Ministry reports checked',
      datasetLast: 'Last test in the database',
    },
    count: (n, note) =>
      n == null && note == null ? '' : note === 'multiple' || n == null ? 'several' : note === 'at least' ? `at least ${n}` : note === 'total' ? `${n} in total` : String(n),
    weapon: { 'icbm-class': 'ICBM-class ballistic missile', ballistic: 'ballistic missile', 'possible-ballistic': 'possible ballistic missile', satellite: 'satellite launch using ballistic missile technology', other: 'missile' },
    landing: { 'sea-of-japan': 'Sea of Japan', 'yellow-sea': 'Yellow Sea', pacific: 'Pacific Ocean', 'near-east-coast': 'near the east coast of the Korean Peninsula' },
    eez: { inside: "inside Japan's EEZ", outside: "outside Japan's EEZ", 'none-seen': "no entry into Japan's EEZ seen" },
    bound: (km, b) => (b === 'over' ? `over ${km}` : b === 'at least' ? `at least ${km}` : km),
    feed: {
      title: 'Latest measured events',
      note: 'Only measured events: seismic readings (USGS) and radar-tracked launches (Japan Ministry of Defense). Checked every few hours.',
      quake: (label, mag) => `Magnitude ${mag} ${label}`,
      about: (km) => `about ${km}`,
      launch: (count, weapon, range) => [`${weapon[0].toUpperCase()}${weapon.slice(1)}${/launch/.test(weapon) ? '' : ' launch'}`, count, range].filter(Boolean).join(', '),
      by: { usgs: 'Measured by USGS seismometers', mod: "Tracked by Japan's Ministry of Defense" },
      source: 'Source',
    },
  },
  ko: {
    jst: '일본 시각',
    utc: 'UTC',
    km: (n) => `${n.toLocaleString('ko-KR')}km`,
    usgsTypes: {
      'nuclear explosion': '핵폭발',
      collapse: '붕괴',
      earthquake: '지진',
      explosion: '폭발',
      'quarry blast': '채석 발파',
      'other event': '기타',
    },
    seismic: {
      title: '지진계에 기록된 것',
      body: (tests) =>
        `세계 곳곳의 지진계는 핵실험을 빠짐없이 잡아냅니다. 미국 지질조사국(USGS)은 풍계리에서 일어난 ${tests}건을 "핵폭발"(nuclear explosion)로 분류하며, 2006년, 2009년, 2013년의 첫 세 차례 실험도 여기에 포함됩니다. 아래 분류는 USGS의 것이고, 실험장과의 거리는 USGS 좌표로 계산했습니다.`,
      nearTitle: (n, km) => `풍계리 핵실험장 반경 ${km}km 안의 ${n}건`,
      columns: { date: '날짜(UTC)', label: 'USGS 분류', magnitude: '규모', distance: '실험장과의 거리', place: '위치(USGS 표기)', link: 'USGS 페이지' },
      fromSite: (km) => `풍계리에서 ${km}`,
      open: '열기',
      allTitle: (n, since) => `${since}년 이후 USGS가 북한과 그 주변에 기록한 ${n}건 전체`,
      allNote:
        '검색 범위(북위 37.5~43.1도, 동경 124~131도)에는 중국, 러시아, 한국 일부와 바다도 들어갑니다. USGS는 일부 한국어 지명의 글자 하나를 "?"로 적는데, USGS 표기 그대로 보여줍니다.',
      fetched: 'USGS 목록 내려받은 날',
      sourceBefore: '출처: ',
    },
    launches: {
      title: '일본 방위성 발표',
      body: '일본 방위성은 추적한 북한 탄도미사일 발사를 보통 몇 시간 안에 발표합니다. 아래 표는 며칠 늦을 수 있는 CNS 데이터베이스에서 가져온 것입니다. 그 데이터베이스의 마지막 시험 이후 방위성이 발표한 발사는 여기에 먼저 싣습니다. 수치는 방위성의 추정치입니다.',
      notYet: '아직 데이터베이스에 없음',
      upToDate: '지금까지 방위성이 발표한 발사는 모두 아래 표에 있습니다. 최근 발표:',
      columns: { time: '발사', missiles: '발수', distance: '비행 거리', apogee: '최고 고도', landed: '낙하 지점', report: '발표문' },
      report: 'PDF(일본어)',
      alsoReports: (n) => `앞선 발표 ${n}건`,
      checked: '방위성 발표 확인',
      datasetLast: '데이터베이스의 마지막 시험',
    },
    count: (n, note) => (n == null && note == null ? '' : note === 'multiple' || n == null ? '여러 발' : note === 'at least' ? `최소 ${n}발` : note === 'total' ? `모두 ${n}발` : `${n}발`),
    weapon: { 'icbm-class': 'ICBM급 탄도미사일', ballistic: '탄도미사일', 'possible-ballistic': '탄도미사일 가능성', satellite: '탄도미사일 기술을 쓴 위성 발사', other: '미사일' },
    landing: { 'sea-of-japan': '동해', 'yellow-sea': '서해', pacific: '태평양', 'near-east-coast': '한반도 동해안 부근' },
    eez: { inside: '일본 EEZ 안', outside: '일본 EEZ 밖', 'none-seen': '일본 EEZ 진입 확인 안 됨' },
    bound: (km, b) => (b === 'over' ? `${km} 초과` : b === 'at least' ? `최소 ${km}` : km),
    feed: {
      title: '최근 측정된 사건',
      note: '측정된 사건만 싣습니다: 지진 관측(USGS)과 레이더로 추적한 발사(일본 방위성). 몇 시간마다 확인합니다.',
      quake: (label, mag) => `규모 ${mag} ${label}`,
      about: (km) => `약 ${km}`,
      launch: (count, weapon, range) => [/발사/.test(weapon) ? weapon : `${weapon} 발사`, count, range].filter(Boolean).join(', '),
      by: { usgs: 'USGS 지진계 관측', mod: '일본 방위성 추적' },
      source: '출처',
    },
  },
  ja: {
    jst: '日本時間',
    utc: 'UTC',
    km: (n) => `${n.toLocaleString('ja-JP')}km`,
    usgsTypes: {
      'nuclear explosion': '核爆発',
      collapse: '崩落',
      earthquake: '地震',
      explosion: '爆発',
      'quarry blast': '採石発破',
      'other event': 'その他',
    },
    seismic: {
      title: '地震計が記録したもの',
      body: (tests) =>
        `世界中の地震計は核実験を必ずとらえます。米国地質調査所（USGS）は豊渓里（プンゲリ）の${tests}件を「核爆発」（nuclear explosion）に分類しており、2006年、2009年、2013年の最初の3回も含まれます。下の分類はUSGSのもので、実験場からの距離はUSGSの座標から計算しました。`,
      nearTitle: (n, km) => `豊渓里核実験場から${km}km以内の${n}件`,
      columns: { date: '日付（UTC）', label: 'USGSの分類', magnitude: 'マグニチュード', distance: '実験場からの距離', place: '場所（USGSの表記）', link: 'USGSのページ' },
      fromSite: (km) => `豊渓里から${km}`,
      open: '開く',
      allTitle: (n, since) => `${since}年以降にUSGSが北朝鮮とその周辺で記録した${n}件すべて`,
      allNote:
        '検索範囲（北緯37.5～43.1度、東経124～131度）には中国、ロシア、韓国の一部と海も入ります。USGSは一部の朝鮮語の地名で文字を「?」と書いていますが、USGSの表記のまま載せています。',
      fetched: 'USGSのカタログ取得日',
      sourceBefore: '出典：',
    },
    launches: {
      title: '防衛省の発表',
      body: '防衛省は、探知した北朝鮮の弾道ミサイル発射を多くの場合数時間以内に発表します。下の表は数日遅れることがあるCNSのデータベースによるものです。そのデータベースの最後の発射以降に防衛省が発表した発射を、ここに先に載せます。数値は防衛省の推定です。',
      notYet: 'データベース未収録',
      upToDate: 'これまでに防衛省が発表した発射は、すべて下の表に入っています。最近の発表：',
      columns: { time: '発射', missiles: '発数', distance: '飛翔距離', apogee: '最高高度', landed: '落下', report: '発表' },
      report: 'PDF',
      alsoReports: (n) => `先行する発表${n}件`,
      checked: '防衛省の発表を確認',
      datasetLast: 'データベースの最後の発射',
    },
    count: (n, note) => (n == null && note == null ? '' : note === 'multiple' || n == null ? '複数発' : note === 'at least' ? `少なくとも${n}発` : note === 'total' ? `合計${n}発` : `${n}発`),
    weapon: { 'icbm-class': 'ICBM級弾道ミサイル', ballistic: '弾道ミサイル', 'possible-ballistic': '弾道ミサイルの可能性', satellite: '弾道ミサイル技術を使用した衛星打ち上げ', other: 'ミサイル' },
    landing: { 'sea-of-japan': '日本海', 'yellow-sea': '黄海', pacific: '太平洋', 'near-east-coast': '朝鮮半島東岸付近' },
    eez: { inside: '日本のEEZ内', outside: '日本のEEZ外', 'none-seen': '日本のEEZへの飛来は確認されず' },
    bound: (km, b) => (b === 'over' ? `${km}超` : b === 'at least' ? `${km}以上` : km),
    feed: {
      title: '最近観測された出来事',
      note: '観測されたものだけを載せます：地震の観測（USGS）とレーダーで探知した発射（防衛省）。数時間ごとに確認しています。',
      quake: (label, mag) => `マグニチュード${mag}の${label}`,
      about: (km) => `約${km}`,
      launch: (count, weapon, range) => [/打ち上げ/.test(weapon) ? weapon : `${weapon}の発射`, count, range].filter(Boolean).join('、'),
      by: { usgs: 'USGSの地震計で観測', mod: '防衛省が探知' },
      source: '出典',
    },
  },
  zh: {
    jst: '日本时间',
    utc: 'UTC',
    km: (n) => `${n.toLocaleString('zh-CN')} 公里`,
    usgsTypes: {
      'nuclear explosion': '核爆炸',
      collapse: '塌陷',
      earthquake: '地震',
      explosion: '爆炸',
      'quarry blast': '采石爆破',
      'other event': '其他',
    },
    seismic: {
      title: '地震仪记录到的事件',
      body: (tests) =>
        `世界各地的地震仪都能捕捉到核试验。美国地质调查局（USGS）把丰溪里的 ${tests} 次事件列为"核爆炸"（nuclear explosion），其中包括 2006 年、2009 年和 2013 年的前三次试验。下面的分类是 USGS 自己的，与试验场的距离根据 USGS 的坐标计算。`,
      nearTitle: (n, km) => `丰溪里核试验场 ${km} 公里内的 ${n} 次事件`,
      columns: { date: '日期（UTC）', label: 'USGS 分类', magnitude: '震级', distance: '距试验场', place: '地点（USGS 原文）', link: 'USGS 页面' },
      fromSite: (km) => `距丰溪里 ${km}`,
      open: '打开',
      allTitle: (n, since) => `${since} 年以来 USGS 在朝鲜及周边记录的全部 ${n} 次事件`,
      allNote:
        '搜索范围（北纬 37.5 至 43.1 度，东经 124 至 131 度）也包括中国、俄罗斯、韩国的部分地区和海域。USGS 把部分朝鲜地名中的一个字母写成"?"，这里照 USGS 原文显示。',
      fetched: 'USGS 目录下载日期',
      sourceBefore: '来源：',
    },
    launches: {
      title: '日本防卫省的通报',
      body: '日本防卫省通常在几小时内通报其追踪到的朝鲜弹道导弹发射。下表来自 CNS 数据库，可能晚几天。自该数据库最后一次试射以来防卫省通报的发射，先列在这里。数字是防卫省的估计。',
      notYet: '尚未收入数据库',
      upToDate: '到目前为止防卫省通报的发射都已在下表中。最近的通报：',
      columns: { time: '发射', missiles: '数量', distance: '飞行距离', apogee: '最高高度', landed: '落点', report: '通报' },
      report: 'PDF（日文）',
      alsoReports: (n) => `之前的通报 ${n} 份`,
      checked: '防卫省通报核对时间',
      datasetLast: '数据库中的最后一次试射',
    },
    count: (n, note) => (n == null && note == null ? '' : note === 'multiple' || n == null ? '多枚' : note === 'at least' ? `至少 ${n} 枚` : note === 'total' ? `共 ${n} 枚` : `${n} 枚`),
    weapon: { 'icbm-class': 'ICBM 级弹道导弹', ballistic: '弹道导弹', 'possible-ballistic': '可能是弹道导弹', satellite: '使用弹道导弹技术的卫星发射', other: '导弹' },
    landing: { 'sea-of-japan': '日本海', 'yellow-sea': '黄海', pacific: '太平洋', 'near-east-coast': '朝鲜半岛东海岸附近' },
    eez: { inside: '日本专属经济区内', outside: '日本专属经济区外', 'none-seen': '未发现进入日本专属经济区' },
    bound: (km, b) => (b === 'over' ? `超过 ${km}` : b === 'at least' ? `至少 ${km}` : km),
    feed: {
      title: '最近测得的事件',
      note: '只收录测得的事件：地震观测（USGS）和雷达追踪到的发射（日本防卫省）。每隔几小时核对一次。',
      quake: (label, mag) => `${mag} 级${label}`,
      about: (km) => `约 ${km}`,
      launch: (count, weapon, range) => [/发射/.test(weapon) ? weapon : `${weapon}发射`, count, range].filter(Boolean).join('，'),
      by: { usgs: 'USGS 地震仪测得', mod: '日本防卫省追踪' },
      source: '来源',
    },
  },
};
