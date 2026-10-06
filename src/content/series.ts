/**
 * Text for the chart datasets (data/series/series.json, built by scripts/build-series.ts) in every language the site has:
 * series titles and one-line explanations, entity names, chart UI labels, and the topic groups on /data.
 * Numbers never live here; they come from the built file.
 */
import type { Lang } from '@/site/seo';

type T = Record<Lang, string>;

/** Display names for the entity keys used in series.json. */
export const ENTITY_LABEL: Record<string, T> = {
  PRK: { en: 'North Korea', ko: '북한', ja: '北朝鮮', zh: '朝鲜' },
  KOR: { en: 'South Korea', ko: '한국', ja: '韓国', zh: '韩国' },
  CHN: { en: 'China', ko: '중국', ja: '中国', zh: '中国' },
  JPN: { en: 'Japan', ko: '일본', ja: '日本', zh: '日本' },
  WLD: { en: 'World', ko: '세계', ja: '世界', zh: '世界' },
  pyongyang: { en: 'Pyongyang', ko: '평양', ja: '平壌', zh: '平壤' },
  sinuiju: { en: 'Sinuiju', ko: '신의주', ja: '新義州', zh: '新义州' },
  hyesan: { en: 'Hyesan', ko: '혜산', ja: '恵山', zh: '惠山' },
  women: { en: 'Women', ko: '여성', ja: '女性', zh: '女性' },
  men: { en: 'Men', ko: '남성', ja: '男性', zh: '男性' },
  short: { en: 'Short range', ko: '단거리', ja: '短距離', zh: '短程' },
  medium: { en: 'Medium and intermediate range', ko: '준중거리·중거리', ja: '準中距離・中距離', zh: '中程和中远程' },
  icbm: { en: 'ICBM', ko: 'ICBM', ja: 'ICBM', zh: '洲际弹道导弹' },
  other: { en: 'Other', ko: '기타', ja: 'その他', zh: '其他' },
  people: { en: 'People', ko: '개인', ja: '個人', zh: '个人' },
  entities: { en: 'Organisations', ko: '기관', ja: '団体', zh: '机构' },
};

/** Title and one plain sentence per series. Keys are series ids. */
export const SERIES_TEXT: Record<string, Record<Lang, { title: string; sub: string }>> = {
  'life-expectancy': {
    en: { title: 'Life expectancy', sub: 'How many years a baby born that year would live on average.' },
    ko: { title: '기대수명', sub: '그해 태어난 아기가 평균적으로 살 것으로 예상되는 햇수.' },
    ja: { title: '平均寿命', sub: 'その年に生まれた赤ちゃんが平均で何年生きるか。' },
    zh: { title: '预期寿命', sub: '当年出生的婴儿平均能活多少年。' },
  },
  'child-mortality': {
    en: { title: 'Children who die before age five', sub: 'Share of newborns who do not reach their fifth birthday.' },
    ko: { title: '5세 미만 사망률', sub: '다섯 번째 생일을 맞지 못하고 숨지는 아이의 비율.' },
    ja: { title: '5歳未満で亡くなる子ども', sub: '5歳の誕生日を迎えられない子どもの割合。' },
    zh: { title: '五岁前夭折的儿童', sub: '活不到五岁生日的新生儿所占比例。' },
  },
  'gdp-per-capita': {
    en: { title: 'GDP per person', sub: 'Average yearly income per person, adjusted for prices and inflation (2011 international dollars).' },
    ko: { title: '1인당 GDP', sub: '물가와 인플레이션을 반영한 1인당 연평균 소득 (2011년 국제달러).' },
    ja: { title: '1人あたりGDP', sub: '物価とインフレを調整した1人あたりの年間平均所得（2011年国際ドル）。' },
    zh: { title: '人均GDP', sub: '按物价和通胀调整后的人均年收入（2011年国际元）。' },
  },
  'height-men': {
    en: { title: 'Average height of men', sub: 'Adult height by the year they were born.' },
    ko: { title: '남성 평균 키', sub: '태어난 해별 성인 평균 키.' },
    ja: { title: '男性の平均身長', sub: '生まれた年別の成人の平均身長。' },
    zh: { title: '男性平均身高', sub: '按出生年份统计的成年人平均身高。' },
  },
  'height-women': {
    en: { title: 'Average height of women', sub: 'Adult height by the year they were born.' },
    ko: { title: '여성 평균 키', sub: '태어난 해별 성인 평균 키.' },
    ja: { title: '女性の平均身長', sub: '生まれた年別の成人の平均身長。' },
    zh: { title: '女性平均身高', sub: '按出生年份统计的成年人平均身高。' },
  },
  'electricity-per-person': {
    en: { title: 'Electricity per person', sub: 'Electricity generated in a year, divided by the population.' },
    ko: { title: '1인당 전력', sub: '한 해 발전량을 인구로 나눈 값.' },
    ja: { title: '1人あたり電力', sub: '1年間の発電量を人口で割った値。' },
    zh: { title: '人均发电量', sub: '一年的发电量除以人口。' },
  },
  'energy-per-person': {
    en: { title: 'Energy use per person', sub: 'All energy used in a year (power, heat, transport), divided by the population.' },
    ko: { title: '1인당 에너지 사용량', sub: '한 해 사용한 모든 에너지(전기, 난방, 수송)를 인구로 나눈 값.' },
    ja: { title: '1人あたりエネルギー使用量', sub: '1年間に使ったすべてのエネルギー（電気、暖房、輸送）を人口で割った値。' },
    zh: { title: '人均能源消耗', sub: '一年消耗的全部能源（电力、取暖、交通）除以人口。' },
  },
  'electricity-access': {
    en: { title: 'Access to electricity', sub: 'Share of people who have electricity at home.' },
    ko: { title: '전기 보급률', sub: '집에 전기가 들어오는 사람의 비율.' },
    ja: { title: '電気が使える人の割合', sub: '家で電気を使える人の割合。' },
    zh: { title: '通电率', sub: '家里有电的人所占比例。' },
  },
  'mobile-phones': {
    en: { title: 'Mobile phone subscriptions', sub: 'Subscriptions per 100 people. Above 100 means some people have more than one.' },
    ko: { title: '휴대전화 가입 건수', sub: '인구 100명당 가입 건수. 100을 넘으면 두 대 이상 쓰는 사람이 있다는 뜻.' },
    ja: { title: '携帯電話の契約数', sub: '人口100人あたりの契約数。100を超えると複数台持つ人がいるということ。' },
    zh: { title: '手机用户数', sub: '每百人的手机签约数。超过100表示有人不止一部。' },
  },
  fertility: {
    en: { title: 'Children per woman', sub: 'Average number of children a woman has over her life, at that year’s rates.' },
    ko: { title: '합계출산율', sub: '그해 출산율이 유지될 때 여성 한 명이 평생 낳는 평균 자녀 수.' },
    ja: { title: '合計特殊出生率', sub: 'その年の出生率が続いた場合に、女性1人が生涯に産む子どもの平均数。' },
    zh: { title: '每名妇女生育子女数', sub: '按当年生育率计算，一名妇女一生平均生育的子女数。' },
  },
  population: {
    en: { title: 'Population', sub: 'People living in the country.' },
    ko: { title: '인구', sub: '그 나라에 사는 사람의 수.' },
    ja: { title: '人口', sub: 'その国に住む人の数。' },
    zh: { title: '人口', sub: '住在这个国家的人数。' },
  },
  calories: {
    en: { title: 'Food per person per day', sub: 'Calories available per person per day. Around 2,100 kcal is the usual minimum.' },
    ko: { title: '1인당 하루 식량 공급량', sub: '1인당 하루에 공급되는 열량. 보통 2,100kcal 정도가 최소 기준.' },
    ja: { title: '1人1日あたりの食料供給量', sub: '1人1日あたりに供給されるカロリー。一般に約2,100kcalが最低ライン。' },
    zh: { title: '人均每日食物', sub: '每人每天可获得的热量。一般认为约2,100千卡是最低标准。' },
  },
  undernourishment: {
    en: { title: 'Undernourished people', sub: 'Share of people who regularly do not get enough calories.' },
    ko: { title: '영양부족 인구 비율', sub: '필요한 열량을 꾸준히 얻지 못하는 사람의 비율.' },
    ja: { title: '栄養不足の人の割合', sub: '必要なカロリーを継続的にとれていない人の割合。' },
    zh: { title: '营养不足人口', sub: '长期吃不够热量的人所占比例。' },
  },
  'cereal-yield': {
    en: { title: 'Cereal yield', sub: 'Tonnes of grain harvested per hectare of farmland.' },
    ko: { title: '곡물 단위수확량', sub: '농경지 1헥타르당 수확한 곡물(톤).' },
    ja: { title: '穀物の単収', sub: '農地1ヘクタールあたりの穀物収穫量（トン）。' },
    zh: { title: '谷物单产', sub: '每公顷耕地收获的谷物（吨）。' },
  },
  'co2-per-person': {
    en: { title: 'CO₂ emissions per person', sub: 'Tonnes of carbon dioxide from fuel and industry, per person. A rough measure of how much industry runs.' },
    ko: { title: '1인당 CO₂ 배출량', sub: '연료와 산업에서 나온 1인당 이산화탄소(톤). 산업이 얼마나 돌아가는지 보여주는 대략적인 지표.' },
    ja: { title: '1人あたりCO₂排出量', sub: '燃料と産業から出る1人あたりの二酸化炭素（トン）。産業がどれだけ動いているかの目安。' },
    zh: { title: '人均二氧化碳排放', sub: '燃料和工业排放的人均二氧化碳（吨）。大致反映工业开工的程度。' },
  },
  'armed-forces': {
    en: { title: 'Soldiers', sub: 'Active armed forces personnel.' },
    ko: { title: '군 병력', sub: '현역 군인 수.' },
    ja: { title: '兵力', sub: '現役の兵士の数。' },
    zh: { title: '兵力', sub: '现役军人人数。' },
  },
  democracy: {
    en: { title: 'Democracy score', sub: 'V-Dem electoral democracy index: 0 is none, 1 is full. Free elections, free press, right to organise.' },
    ko: { title: '민주주의 점수', sub: 'V-Dem 선거민주주의 지수. 0은 전혀 없음, 1은 완전. 자유선거, 언론자유, 결사의 자유.' },
    ja: { title: '民主主義スコア', sub: 'V-Dem選挙民主主義指数。0は全くない、1は完全。自由選挙、報道の自由、結社の自由。' },
    zh: { title: '民主指数', sub: 'V-Dem选举民主指数：0表示完全没有，1表示完全民主。包括自由选举、新闻自由、结社权。' },
  },
  'civil-liberties': {
    en: { title: 'Civil liberties score', sub: 'V-Dem index: 0 is none, 1 is full. Freedom from state violence, free speech, freedom of movement and religion.' },
    ko: { title: '시민적 자유 점수', sub: 'V-Dem 지수. 0은 전혀 없음, 1은 완전. 국가 폭력으로부터의 자유, 표현·이동·종교의 자유.' },
    ja: { title: '市民的自由スコア', sub: 'V-Dem指数。0は全くない、1は完全。国家暴力からの自由、言論・移動・信教の自由。' },
    zh: { title: '公民自由指数', sub: 'V-Dem指数：0表示完全没有，1表示完全。包括免受国家暴力、言论自由、迁徙自由和宗教自由。' },
  },
  'nuclear-warheads': {
    en: { title: 'Nuclear warheads', sub: 'Estimated warheads in North Korea’s stockpile. Nobody outside knows the exact number.' },
    ko: { title: '핵탄두', sub: '북한이 보유한 것으로 추정되는 핵탄두 수. 정확한 수는 외부에서 아무도 모른다.' },
    ja: { title: '核弾頭', sub: '北朝鮮が保有すると推定される核弾頭の数。正確な数は外部の誰にも分からない。' },
    zh: { title: '核弹头', sub: '估计朝鲜储存的核弹头数量。外界没有人知道确切数字。' },
  },
  'won-per-dollar': {
    en: { title: 'Price of one US dollar in North Korean markets', sub: 'Market exchange rate in won, not the official rate. Surveyed about every two weeks.' },
    ko: { title: '북한 시장의 달러 환율', sub: '공식 환율이 아닌 시장 환율(원). 약 2주마다 조사.' },
    ja: { title: '北朝鮮の市場での1ドルの値段', sub: '公式レートではなく市場の為替レート（ウォン）。約2週間ごとに調査。' },
    zh: { title: '朝鲜市场上一美元的价格', sub: '以朝鲜圆计的市场汇率，不是官方汇率。大约每两周调查一次。' },
  },
  'rice-price': {
    en: { title: 'Price of rice in North Korean markets', sub: 'Won per kilogram of rice. Surveyed about every two weeks.' },
    ko: { title: '북한 시장의 쌀값', sub: '쌀 1kg당 가격(원). 약 2주마다 조사.' },
    ja: { title: '北朝鮮の市場での米の値段', sub: '米1kgあたりの価格（ウォン）。約2週間ごとに調査。' },
    zh: { title: '朝鲜市场上的大米价格', sub: '每公斤大米的价格（朝鲜圆）。大约每两周调查一次。' },
  },
  'defector-arrivals': {
    en: { title: 'North Koreans reaching South Korea', sub: 'People who escaped and arrived in South Korea each year, by sex.' },
    ko: { title: '한국에 입국한 북한이탈주민', sub: '해마다 한국에 도착한 탈북민 수, 성별.' },
    ja: { title: '韓国にたどり着いた脱北者', sub: '毎年韓国に到着した脱北者の数（男女別）。' },
    zh: { title: '抵达韩国的朝鲜人', sub: '每年逃出并抵达韩国的人数，按性别分列。' },
  },
  'humanitarian-aid': {
    en: { title: 'Humanitarian funding for North Korea', sub: 'Aid money reported to the UN each year, in millions of US dollars.' },
    ko: { title: '대북 인도적 지원 자금', sub: '해마다 유엔에 보고된 지원 자금(백만 달러).' },
    ja: { title: '北朝鮮への人道支援資金', sub: '毎年国連に報告された支援資金（百万ドル）。' },
    zh: { title: '对朝人道主义援助资金', sub: '每年向联合国报告的援助资金，单位为百万美元。' },
  },
  'missile-launches': {
    en: { title: 'Missiles launched each year', sub: 'Every missile counts once, so a salvo of four is four.' },
    ko: { title: '연도별 미사일 발사', sub: '미사일 한 발을 한 번으로 센다. 네 발을 한꺼번에 쏘면 4.' },
    ja: { title: '年ごとのミサイル発射', sub: 'ミサイル1発を1回と数える。4発同時なら4。' },
    zh: { title: '每年发射的导弹', sub: '每枚导弹计一次，齐射四枚就算四次。' },
  },
  'un-sanctions-listings': {
    en: { title: 'New names on the UN sanctions list', sub: 'People and organisations added to the UN Security Council’s North Korea list each year.' },
    ko: { title: '유엔 제재 명단 신규 지정', sub: '해마다 유엔 안보리 대북 제재 명단에 오른 개인과 기관.' },
    ja: { title: '国連制裁リストへの新規指定', sub: '毎年、国連安保理の北朝鮮制裁リストに加えられた個人と団体。' },
    zh: { title: '联合国制裁名单新增名称', sub: '每年新增到联合国安理会朝鲜制裁名单上的个人和机构。' },
  },
};

/** Labels for the chart frame. */
export const CHART_UI: Record<Lang, Record<string, string>> = {
  en: {
    chart: 'Chart',
    linear: 'Linear',
    log: 'Log',
    table: 'Table',
    source: 'Source',
    fetched: 'Data downloaded',
    updated: 'source updated',
    csv: 'Download CSV',
    copy: 'Copy link',
    copied: 'Copied',
    share: 'Share',
    open: 'Open full chart',
    year: 'Year',
    date: 'Date',
    total: 'Total',
    note: 'Note',
    pointSources: 'Recent years not yet in the official file',
    noData: 'no data',
    github: 'Data on GitHub',
    json: 'JSON',
  },
  ko: {
    chart: '차트',
    linear: '선형',
    log: '로그',
    table: '표',
    source: '출처',
    fetched: '데이터 내려받은 날',
    updated: '출처 갱신',
    csv: 'CSV 내려받기',
    copy: '링크 복사',
    copied: '복사됨',
    share: '공유',
    open: '차트 크게 보기',
    year: '연도',
    date: '날짜',
    total: '합계',
    note: '참고',
    pointSources: '공식 파일에 아직 없는 최근 연도',
    noData: '자료 없음',
    github: 'GitHub의 데이터',
    json: 'JSON',
  },
  ja: {
    chart: 'グラフ',
    linear: '線形',
    log: '対数',
    table: '表',
    source: '出典',
    fetched: 'データ取得日',
    updated: '出典の更新',
    csv: 'CSVをダウンロード',
    copy: 'リンクをコピー',
    copied: 'コピーしました',
    share: '共有',
    open: 'グラフを大きく見る',
    year: '年',
    date: '日付',
    total: '合計',
    note: '注',
    pointSources: '公式ファイルにまだない最近の年',
    noData: 'データなし',
    github: 'GitHubのデータ',
    json: 'JSON',
  },
  zh: {
    chart: '图表',
    linear: '线性',
    log: '对数',
    table: '表格',
    source: '来源',
    fetched: '数据下载日期',
    updated: '来源更新于',
    csv: '下载CSV',
    copy: '复制链接',
    copied: '已复制',
    share: '分享',
    open: '查看完整图表',
    year: '年份',
    date: '日期',
    total: '合计',
    note: '注',
    pointSources: '官方文件中尚未收录的近年数据',
    noData: '无数据',
    github: 'GitHub上的数据',
    json: 'JSON',
  },
};

/** How series are grouped on /data. */
export const TOPICS: { id: string; title: T; series: string[] }[] = [
  {
    id: 'inside',
    title: { en: 'Inside North Korea today', ko: '오늘의 북한 내부', ja: '今の北朝鮮の内側', zh: '今天的朝鲜内部' },
    series: ['won-per-dollar', 'rice-price', 'defector-arrivals', 'humanitarian-aid'],
  },
  {
    id: 'health',
    title: { en: 'Health and food', ko: '건강과 식량', ja: '健康と食料', zh: '健康与粮食' },
    series: ['life-expectancy', 'child-mortality', 'calories', 'undernourishment', 'height-men', 'height-women', 'cereal-yield'],
  },
  {
    id: 'economy',
    title: { en: 'Money and energy', ko: '경제와 에너지', ja: '経済とエネルギー', zh: '经济与能源' },
    series: ['gdp-per-capita', 'electricity-per-person', 'energy-per-person', 'electricity-access', 'co2-per-person', 'mobile-phones'],
  },
  {
    id: 'people',
    title: { en: 'People', ko: '인구', ja: '人口', zh: '人口' },
    series: ['population', 'fertility'],
  },
  {
    id: 'power',
    title: { en: 'Freedom and weapons', ko: '자유와 무기', ja: '自由と兵器', zh: '自由与武器' },
    series: ['democracy', 'civil-liberties', 'missile-launches', 'nuclear-warheads', 'armed-forces', 'un-sanctions-listings'],
  },
];

export const DATA_PATHS = { en: '/data', ko: '/ko/data', ja: '/ja/data', zh: '/zh/data' } as const;
export const dataPath = (lang: Lang, id?: string) => DATA_PATHS[lang] + (id ? `/${id}` : '');

/** Units as they appear in series.json, translated. Anything missing shows as-is. */
export const UNIT_LABEL: Record<string, T> = {
  years: { en: 'years', ko: '년', ja: '年', zh: '年' },
  '%': { en: '%', ko: '%', ja: '%', zh: '%' },
  'international $ (2011 prices)': { en: 'international $ (2011 prices)', ko: '국제달러 (2011년 가격)', ja: '国際ドル（2011年価格）', zh: '国际元（2011年价格）' },
  cm: { en: 'cm', ko: 'cm', ja: 'cm', zh: '厘米' },
  kWh: { en: 'kWh', ko: 'kWh', ja: 'kWh', zh: '千瓦时' },
  'per 100 people': { en: 'per 100 people', ko: '100명당', ja: '100人あたり', zh: '每百人' },
  'births per woman': { en: 'births per woman', ko: '여성 1명당 출생아 수', ja: '女性1人あたりの出生数', zh: '每名妇女生育数' },
  people: { en: 'people', ko: '명', ja: '人', zh: '人' },
  kcal: { en: 'kcal', ko: 'kcal', ja: 'kcal', zh: '千卡' },
  'tonnes per hectare': { en: 'tonnes per hectare', ko: '헥타르당 톤', ja: 'ヘクタールあたりトン', zh: '吨/公顷' },
  tonnes: { en: 'tonnes', ko: '톤', ja: 'トン', zh: '吨' },
  'index, 0 to 1': { en: 'index, 0 to 1', ko: '지수 (0~1)', ja: '指数（0〜1）', zh: '指数（0到1）' },
  warheads: { en: 'warheads', ko: '개', ja: '発', zh: '枚' },
  'won per US$': { en: 'won per US$', ko: '원/달러', ja: 'ウォン/ドル', zh: '朝鲜圆/美元' },
  'won per kg': { en: 'won per kg', ko: '원/kg', ja: 'ウォン/kg', zh: '朝鲜圆/公斤' },
  'US$ million': { en: 'US$ million', ko: '백만 달러', ja: '百万ドル', zh: '百万美元' },
  missiles: { en: 'missiles', ko: '발', ja: '発', zh: '枚' },
  listings: { en: 'listings', ko: '건', ja: '件', zh: '项' },
};
