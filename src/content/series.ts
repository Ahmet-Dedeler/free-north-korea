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
  'rest-of-country': { en: 'Rest of the country', ko: '그 밖의 지역', ja: 'その他の地域', zh: '其他地区' },
  'this-year': { en: 'This year', ko: '올해', ja: '今年', zh: '今年' },
  'ten-year-average': { en: 'Average of the 10 years before', ko: '직전 10년 평균', ja: '直前10年の平均', zh: '此前10年平均' },
};

/**
 * Title and one plain sentence per series. Keys are series ids.
 * `note` translates the series' note from series.json, which the build scripts (scripts/series/*.ts) write in English.
 * The English `note` is that text as a template: `{name}` stands for a part the build fills in (a year, a date), and
 * each translation repeats the same `{name}`s. If the built note stops matching the English template, pages show the
 * English note instead (see `seriesNote`) and `npm run lint` fails until the template and translations are updated.
 */
export const SERIES_TEXT: Record<string, Record<Lang, { title: string; sub: string; note?: string }>> = {
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
    en: { title: 'Price of one US dollar in North Korean markets', sub: 'Market exchange rate in won, not the official rate. Surveyed about every two weeks.', note: 'Prices before the November 2009 currency reform were in old won; we divided them by 100 so the line is continuous.' },
    ko: { title: '북한 시장의 달러 환율', sub: '공식 환율이 아닌 시장 환율(원). 약 2주마다 조사.', note: '2009년 11월 화폐개혁 이전 가격은 구 원화 기준이어서, 선이 이어지도록 100으로 나누었다.' },
    ja: { title: '北朝鮮の市場での1ドルの値段', sub: '公式レートではなく市場の為替レート（ウォン）。約2週間ごとに調査。', note: '2009年11月の通貨改革より前の価格は旧ウォン建てなので、線がつながるよう100で割った。' },
    zh: { title: '朝鲜市场上一美元的价格', sub: '以朝鲜圆计的市场汇率，不是官方汇率。大约每两周调查一次。', note: '2009年11月货币改革之前的价格以旧朝鲜圆计，我们将其除以100，使曲线保持连续。' },
  },
  'rice-price': {
    en: { title: 'Price of rice in North Korean markets', sub: 'Won per kilogram of rice. Surveyed about every two weeks.', note: 'Prices before the November 2009 currency reform were in old won; we divided them by 100 so the line is continuous.' },
    ko: { title: '북한 시장의 쌀값', sub: '쌀 1kg당 가격(원). 약 2주마다 조사.', note: '2009년 11월 화폐개혁 이전 가격은 구 원화 기준이어서, 선이 이어지도록 100으로 나누었다.' },
    ja: { title: '北朝鮮の市場での米の値段', sub: '米1kgあたりの価格（ウォン）。約2週間ごとに調査。', note: '2009年11月の通貨改革より前の価格は旧ウォン建てなので、線がつながるよう100で割った。' },
    zh: { title: '朝鲜市场上的大米价格', sub: '每公斤大米的价格（朝鲜圆）。大约每两周调查一次。', note: '2009年11月货币改革之前的价格以旧朝鲜圆计，我们将其除以100，使曲线保持连续。' },
  },
  'defector-arrivals': {
    en: { title: 'North Koreans reaching South Korea', sub: 'People who escaped and arrived in South Korea each year, by sex.', note: 'Counted when people reach South Korea, which can be years after they left North Korea. 2002 onward; earlier years are only published as multi-year totals.' },
    ko: { title: '한국에 입국한 북한이탈주민', sub: '해마다 한국에 도착한 탈북민 수, 성별.', note: '한국에 도착한 때를 기준으로 센다. 북한을 떠난 지 몇 년 뒤일 수도 있다. 2002년부터이며, 그 이전 연도는 여러 해를 합친 수치로만 공개되어 있다.' },
    ja: { title: '韓国にたどり着いた脱北者', sub: '毎年韓国に到着した脱北者の数（男女別）。', note: '韓国に到着した時点で数える。北朝鮮を出てから何年も後のこともある。2002年以降。それ以前の年は複数年の合計しか公表されていない。' },
    zh: { title: '抵达韩国的朝鲜人', sub: '每年逃出并抵达韩国的人数，按性别分列。', note: '按抵达韩国的时间统计，可能是离开朝鲜数年之后。数据从2002年开始；更早的年份只公布了多年合计数。' },
  },
  'humanitarian-aid': {
    en: { title: 'Humanitarian funding for North Korea', sub: 'Aid money reported to the UN each year, in millions of US dollars.', note: 'Money reported to the UN as received for humanitarian work in North Korea, by the year it was meant for. {year} is the year so far.' },
    ko: { title: '대북 인도적 지원 자금', sub: '해마다 유엔에 보고된 지원 자금(백만 달러).', note: '북한에서의 인도적 활동을 위해 받은 것으로 유엔에 보고된 자금. 그 돈이 쓰일 연도별로 집계. {year}년은 올해 지금까지의 수치.' },
    ja: { title: '北朝鮮への人道支援資金', sub: '毎年国連に報告された支援資金（百万ドル）。', note: '北朝鮮での人道支援活動のために受け取ったと国連に報告された資金を、充てられた年ごとに集計。{year}年は年初から現在までの数字。' },
    zh: { title: '对朝人道主义援助资金', sub: '每年向联合国报告的援助资金，单位为百万美元。', note: '向联合国报告的、为在朝鲜开展人道主义工作而收到的资金，按资金所属年份统计。{year}年为年初至今的数字。' },
  },
  'missile-launches': {
    en: { title: 'Missiles launched each year', sub: 'Every missile counts once, so a salvo of four is four.', note: 'Each missile counts once, so a salvo of four is four. Medium range includes intermediate-range and hypersonic glide missiles; "other" is submarine-launched missiles, satellite launches and unknown types. {year} runs to {date}.' },
    ko: { title: '연도별 미사일 발사', sub: '미사일 한 발을 한 번으로 센다. 네 발을 한꺼번에 쏘면 4.', note: '미사일 한 발을 한 번으로 센다. 네 발을 한꺼번에 쏘면 4. 준중거리에는 중거리 미사일과 극초음속 활공 미사일이 포함된다. ‘기타’는 잠수함발사 미사일, 위성 발사, 종류 미상이다. {year}년은 {date}까지.' },
    ja: { title: '年ごとのミサイル発射', sub: 'ミサイル1発を1回と数える。4発同時なら4。', note: 'ミサイル1発を1回と数える。4発同時なら4。準中距離には中距離ミサイルと極超音速滑空ミサイルを含む。「その他」は潜水艦発射ミサイル、衛星打ち上げ、種類不明のもの。{year}年は{date}まで。' },
    zh: { title: '每年发射的导弹', sub: '每枚导弹计一次，齐射四枚就算四次。', note: '每枚导弹计一次，齐射四枚就算四次。中程包括中远程导弹和高超音速滑翔导弹；“其他”指潜射导弹、卫星发射和类型不明的导弹。{year}年的数据截至{date}。' },
  },
  'night-lights': {
    en: {
      title: 'North Korea at night',
      sub: 'Total light seen from space each year. It doubled from 2022 to 2025, while Seoul and rural South Korea stayed level in the same data.',
      note: "Sum of each year's average radiance (nW/cm²/sr) over every VIIRS pixel in North Korea, after EOG masks background noise, fires and other short-lived light. Pyongyang is the Pyongyang province of the UN OCHA boundaries. The product changed version in {seam}. From 2022 to 2025 North Korea's total rose 130%, while in the same data Seoul rose 3%, rural Gangwon (South Korea) 7% and Dandong (China) 28%, so the rise is not a change in processing.",
    },
    ko: { title: '밤의 북한', sub: '해마다 우주에서 본 불빛의 총량. 2022~2025년에 두 배가 되었고, 같은 자료에서 서울과 한국 농촌은 거의 그대로였다.', note: 'EOG가 배경 잡음, 화재, 그 밖의 일시적인 빛을 걸러낸 뒤, 북한 안의 모든 VIIRS 픽셀에서 그해 평균 복사휘도(nW/cm²/sr)를 더한 값. 평양은 UN OCHA 경계의 평양시(도급 행정구역)이다. {seam}년에 자료 버전이 바뀌었다. 2022~2025년 북한 전체는 130% 늘었지만, 같은 자료에서 서울은 3%, 강원도(한국) 농촌은 7%, 단둥(중국)은 28% 늘었으므로 이 증가는 처리 방식이 바뀐 탓이 아니다.' },
    ja: { title: '夜の北朝鮮', sub: '毎年宇宙から見た光の総量。2022〜2025年に2倍になった。同じデータでソウルと韓国の農村はほぼ横ばいだった。', note: 'EOGが背景ノイズ、火災、その他の一時的な光を取り除いた後、北朝鮮内のすべてのVIIRSピクセルについてその年の平均放射輝度（nW/cm²/sr）を合計した値。平壌はUN OCHAの境界による平壌市（道レベルの行政区域）。{seam}年にデータのバージョンが変わった。2022〜2025年に北朝鮮全体は130%増えたが、同じデータでソウルは3%、江原道（韓国）の農村部は7%、丹東（中国）は28%の増加にとどまったので、この増加は処理方法の変化によるものではない。' },
    zh: { title: '夜晚的朝鲜', sub: '每年从太空看到的灯光总量。2022至2025年翻了一番，而同一数据中首尔和韩国农村基本持平。', note: '在EOG去除背景噪声、火灾和其他短暂光源之后，朝鲜境内每个VIIRS像素当年平均辐亮度（nW/cm²/sr）的总和。平壤指UN OCHA边界中的平壤市（省级行政区）。数据产品在{seam}年更换了版本。2022至2025年，朝鲜总量增长130%，而同一数据中首尔增长3%，韩国江原道农村增长7%，中国丹东增长28%，因此这一增长并非处理方法变化所致。' },
  },
  'crop-greenness': {
    en: {
      title: 'How green the fields are',
      sub: 'Greenness of North Korea’s cropland from May to September each year, seen from space. Drought and flood years show as dips.',
      note: 'Mean NDVI from May to September over cropland (MODIS land cover of 2020, croplands and cropland mosaic), from 16-day MODIS composites with snow and cloud removed. Low years match reported droughts and floods: the springs of 2001, 2012, 2014 and 2015, the summers of 2007 and 2020. Greenness is not harvest.',
    },
    ko: {
      title: '들판은 얼마나 푸른가',
      sub: '해마다 5~9월 우주에서 본 북한 농경지의 녹색 정도. 가뭄과 홍수가 든 해는 움푹 꺼져 보인다.',
      note: '농경지(2020년 MODIS 토지피복의 농경지와 농경지 혼합지) 위의 5~9월 평균 NDVI. 눈과 구름을 걸러낸 16일 단위 MODIS 합성 영상에서 계산했다. 낮은 해는 보도된 가뭄과 홍수와 일치한다. 2001, 2012, 2014, 2015년의 봄, 2007년과 2020년의 여름. 녹색 정도는 수확량이 아니다.',
    },
    ja: {
      title: '畑はどれだけ緑か',
      sub: '毎年5〜9月に宇宙から見た北朝鮮の農地の緑の濃さ。干ばつや洪水の年はくぼんで見える。',
      note: '農地（2020年のMODIS土地被覆の農地と農地モザイク）の5〜9月の平均NDVI。雪と雲を除いた16日ごとのMODIS合成画像から計算した。低い年は報じられた干ばつや洪水と一致する。2001、2012、2014、2015年の春、2007年と2020年の夏。緑の濃さは収穫量ではない。',
    },
    zh: {
      title: '田野有多绿',
      sub: '每年5至9月从太空看到的朝鲜农田绿度。干旱和洪水年份会出现下凹。',
      note: '农田（2020年MODIS土地覆盖中的农田和农田混合区）5至9月的平均NDVI，来自去除积雪和云层的16天MODIS合成影像。低值年份与报道的干旱和洪水相符：2001、2012、2014和2015年的春季，2007年和2020年的夏季。绿度不等于收成。',
    },
  },
  'crop-greenness-season': {
    en: {
      title: 'This season’s fields',
      sub: 'Greenness of North Korea’s cropland every 16 days this year, against the average of the 10 years before.',
      note: 'Mean NDVI over cropland, every 16 days from April. The average is {from}-{to}, the same 16 days of each year. The latest composite starts {date}.',
    },
    ko: {
      title: '올해의 들판',
      sub: '올해 16일마다 본 북한 농경지의 녹색 정도와 직전 10년 평균.',
      note: '농경지 위의 평균 NDVI, 4월부터 16일마다. 평균은 {from}~{to}년 같은 16일 기간의 값이다. 가장 최근 합성 영상은 {date}에 시작한다.',
    },
    ja: {
      title: '今シーズンの畑',
      sub: '今年16日ごとに見た北朝鮮の農地の緑の濃さと、直前10年の平均。',
      note: '農地の平均NDVI、4月から16日ごと。平均は{from}〜{to}年の同じ16日間の値。最新の合成画像は{date}に始まる。',
    },
    zh: {
      title: '本季的田野',
      sub: '今年每16天看到的朝鲜农田绿度，与此前10年平均相比。',
      note: '农田平均NDVI，从4月起每16天一次。平均值为{from}至{to}年同一16天期间的值。最新合成影像始于{date}。',
    },
  },
  'un-sanctions-listings': {
    en: { title: 'New names on the UN sanctions list', sub: 'People and organisations added to the UN Security Council’s North Korea list each year.', note: 'By the date each name was added. Russia and China have blocked new listings since 2018.' },
    ko: { title: '유엔 제재 명단 신규 지정', sub: '해마다 유엔 안보리 대북 제재 명단에 오른 개인과 기관.', note: '각 이름이 추가된 날짜 기준. 2018년 이후 러시아와 중국이 신규 지정을 막고 있다.' },
    ja: { title: '国連制裁リストへの新規指定', sub: '毎年、国連安保理の北朝鮮制裁リストに加えられた個人と団体。', note: '各名前が加えられた日付で集計。2018年以降、ロシアと中国が新たな指定を阻んでいる。' },
    zh: { title: '联合国制裁名单新增名称', sub: '每年新增到联合国安理会朝鲜制裁名单上的个人和机构。', note: '按每个名称被列入的日期统计。自2018年以来，俄罗斯和中国一直阻止新增列名。' },
  },
};

/** Escapes a string for use inside a RegExp. */
const reEscape = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * The series note in the reader's language: matches the built English note against the English template in
 * SERIES_TEXT, then fills the translation with the same values. Undefined when there is no translation or the
 * built note no longer matches the template (the page then shows the English note).
 */
export function seriesNote(id: string, lang: Lang, note: string | undefined): string | undefined {
  const text = SERIES_TEXT[id];
  const tpl = text?.en.note;
  const tr = text?.[lang].note;
  if (!note || !tpl || !tr) return undefined;
  const names: string[] = [];
  const re = new RegExp(
    '^' + tpl.split(/(\{\w+\})/).map((part) => (/^\{\w+\}$/.test(part) ? (names.push(part.slice(1, -1)), '(.+?)') : reEscape(part))).join('') + '$',
  );
  const m = note.match(re);
  if (!m) return undefined;
  return tr.replace(/\{(\w+)\}/g, (all, name: string) => (names.includes(name) ? m[names.indexOf(name) + 1] : all));
}

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
    series: ['crop-greenness-season', 'crop-greenness', 'life-expectancy', 'child-mortality', 'calories', 'undernourishment', 'height-men', 'height-women', 'cereal-yield'],
  },
  {
    id: 'economy',
    title: { en: 'Money and energy', ko: '경제와 에너지', ja: '経済とエネルギー', zh: '经济与能源' },
    series: ['gdp-per-capita', 'night-lights', 'electricity-per-person', 'energy-per-person', 'electricity-access', 'co2-per-person', 'mobile-phones'],
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
  'sum of lights': { en: 'sum of lights', ko: '불빛 합계', ja: '光の合計', zh: '灯光总量' },
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
