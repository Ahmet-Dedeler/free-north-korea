/**
 * Text for /north-korea-vs-south-korea in all three languages. Numbers are filled in from data/series at build
 * time (see TwoKoreasPage), so the text never goes stale when a source updates. Only historical facts that don't
 * change (dates of the war, the famine) are written out.
 */
import type { Lang } from '@/site/seo';

/** Formatted numbers the text uses; built in TwoKoreasPage from the series. */
export type Nums = Record<string, string>;

type Section = { id: string; h2: string; body: (n: Nums) => string[] };

type Text = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  nightCaption: string;
  vs: { life: string; gdp: string; power: string; kids: string };
  times: (x: string) => string;
  timesNorth: (x: string) => string;
  shorter: (x: string) => string;
  bands: { division: string; war: string; famine: string; covid: string; democracy: string };
  sections: Section[];
  moreTitle: string;
  moreHint: string;
  caveatTitle: string;
  caveat: string[];
  faqTitle: string;
  faq: (n: Nums) => { q: string; a: string }[];
  dataTitle: string;
  dataBody: string;
  dataCta: string;
  githubCta: string;
  readNext: string;
};

export const TWO_KOREAS_PATHS = { en: '/north-korea-vs-south-korea', ko: '/ko/north-korea-vs-south-korea', ja: '/ja/north-korea-vs-south-korea' } as const;

export const TWO_KOREAS: Record<Lang, Text> = {
  en: {
    metaTitle: 'North Korea vs South Korea: the same people, 80 years apart (charts)',
    metaDescription:
      'Life expectancy, income, food, electricity, height and freedom in North and South Korea since 1945, in charts built from UN, World Bank, FAO and V-Dem data.',
    eyebrow: 'Data · North vs South',
    h1: 'North Korea vs South Korea',
    lede: 'Same people, same language, same food. In 1945 the peninsula was cut in two along the 38th parallel, and for a while the two halves were roughly even (in 1990 people in both lived about 70 years). Then they split apart. These charts show how far.',
    nightCaption: 'The Korean peninsula at night. The bright blob is Seoul, the single dot up north is Pyongyang.',
    vs: { life: 'Life expectancy', gdp: 'Income per person', power: 'Electricity per person', kids: 'Children who die before 5' },
    times: (x) => `${x}× more in the South`,
    timesNorth: (x) => `${x}× higher in the North`,
    shorter: (x) => `${x} years shorter in the North`,
    bands: { division: 'Division', war: 'Korean War', famine: 'Famine', covid: 'Border closed', democracy: 'South becomes a democracy' },
    sections: [
      {
        id: 'money',
        h2: 'Before the split, the north was the richer half',
        body: (n) => [
          `Japan built its factories, mines and dams in the north, so in 1940 the northern half made about $${n.gdp40P} per person and the south about $${n.gdp40K}. That flipped fast after the war.`,
          `By ${n.gdpYear} the South was at $${n.gdpK} and the North at $${n.gdpP}, about ${n.gdpRatio} times less. Nobody has real numbers for North Korea between 1944 and 1989 (it publishes almost nothing), which is why its line has a hole.`,
        ],
      },
      {
        id: 'life',
        h2: 'Neck and neck until the famine',
        body: (n) => [
          `In 1990 a baby in the North could expect to live ${n.le90P} years, in the South ${n.le90K}. Basically the same. Then the Soviet Union collapsed, the aid stopped, floods hit, and the famine of the mid 1990s killed somewhere between several hundred thousand and a few million people.`,
          `The UN estimate drops to ${n.leFamine} years in 1995. Today it is ${n.leP} years in the North and ${n.leK} in the South, so people in the North die about ${n.leGap} years earlier. (The flat stretch after 1995 is how the UN models the crisis years. Nobody knows the real year-by-year path.)`,
        ],
      },
      {
        id: 'kids',
        h2: 'Children paid for the famine first',
        body: (n) => [
          `In 1990 about ${n.cm90}% of children in the North died before turning five. By 1996 it was ${n.cm96}%, one in ten.`,
          `It has come down a lot since then, to ${n.cmP}% in ${n.cmYear}. That is still about ${n.cmRatio} times the South's rate (${n.cmK}%).`,
        ],
      },
      {
        id: 'energy',
        h2: 'The lights went out and never came back',
        body: (n) => [
          `North Korea used more energy per person in 1980 (${n.en80P} kWh) than it does now (${n.enP} kWh). It is one of very few countries that went backwards. The South went from ${n.en80K} to ${n.enK} kWh over the same years.`,
          `That is the photo above. About ${n.accP}% of North Koreans have electricity at home, and even for them it is often a few hours a day.`,
        ],
      },
      {
        id: 'freedom',
        h2: 'The South was a dictatorship too, then it changed',
        body: (n) => [
          `People forget this, but South Korea was run by military strongmen until 1987. Then mass protests forced free elections and its democracy score jumped from ${n.dem86K} to ${n.dem88K} in two years.`,
          `North Korea's score has sat near zero for 80 years (${n.demP} in ${n.demYear}, on a 0 to 1 scale). Same people, different system. That is probably the most important chart here.`,
        ],
      },
    ],
    moreTitle: 'More comparisons',
    moreHint: 'Hover or tap a chart to see the numbers, click a country to hide it. Every chart has a full page with a table and a CSV.',
    caveatTitle: 'How much can you trust North Korea numbers?',
    caveat: [
      'Less than for almost any other country. North Korea stopped publishing most statistics decades ago, so most of these are estimates by outsiders (the UN, the Bank of Korea, FAO), built from satellite images, trade data, defector interviews and the two censuses the regime allowed (1993 and 2008).',
      'So read them as the best guess available, not as exact counts. Where an estimate is especially shaky we say so under the chart. Every chart links to its source.',
    ],
    faqTitle: 'Quick answers',
    faq: (n) => [
      {
        q: 'How much richer is South Korea than North Korea?',
        a: `About ${n.gdpRatio} times per person. In ${n.gdpYear} GDP per person was about $${n.gdpK} in South Korea and $${n.gdpP} in North Korea (Maddison Project estimates, 2011 dollars).`,
      },
      {
        q: 'Do South Koreans live longer than North Koreans?',
        a: `Yes, about ${n.leGap} years longer. UN estimates for ${n.leYear} are ${n.leK} years in South Korea and ${n.leP} in North Korea. In 1990 the two were almost equal, around 70 years.`,
      },
      {
        q: 'Were North and South Korea ever equal?',
        a: `Roughly, yes. In 1940 the industrial north was richer per person than the south, and in 1990 life expectancy was about the same in both. The big gaps opened after the 1990s famine and as the South industrialised and became a democracy.`,
      },
      {
        q: 'Are North Koreans shorter than South Koreans?',
        a: `On average, yes. Men born in 1930 in both Koreas were about the same height (${n.hm30P} cm vs ${n.hm30K} cm), but men born in 1996 average ${n.hmP} cm in the North and ${n.hmK} cm in the South, according to NCD-RisC estimates. Studies of defectors measured bigger gaps for children who grew up during the famine.`,
      },
    ],
    dataTitle: 'Use the data',
    dataBody: 'Every number here is in our open dataset, updated weekly, with the original source on each series. Download it, check it, build on it.',
    dataCta: 'All charts and data',
    githubCta: 'Data on GitHub',
    readNext: 'Read next',
  },

  ko: {
    metaTitle: '북한 vs 한국: 같은 민족, 80년의 차이 (차트)',
    metaDescription: '1945년 이후 남북한의 기대수명, 소득, 식량, 전력, 키, 자유를 유엔, 세계은행, FAO, V-Dem 자료로 만든 차트로 비교합니다.',
    eyebrow: '데이터 · 남북 비교',
    h1: '북한 vs 한국',
    lede: '같은 민족, 같은 말, 같은 음식. 1945년 한반도는 38선을 따라 둘로 나뉘었고, 한동안은 남북이 대체로 비슷했습니다 (1990년에는 양쪽 모두 기대수명이 약 70세였습니다). 그 뒤로 둘은 갈라졌습니다. 이 차트들이 얼마나 벌어졌는지 보여줍니다.',
    nightCaption: '밤의 한반도. 밝게 빛나는 곳이 서울, 북쪽의 점 하나가 평양입니다.',
    vs: { life: '기대수명', gdp: '1인당 소득', power: '1인당 전력', kids: '5세 미만 사망률' },
    times: (x) => `한국이 ${x}배`,
    timesNorth: (x) => `북한이 ${x}배 높음`,
    shorter: (x) => `북한이 ${x}년 짧음`,
    bands: { division: '분단', war: '한국전쟁', famine: '대기근', covid: '국경 봉쇄', democracy: '한국 민주화' },
    sections: [
      {
        id: 'money',
        h2: '분단 전에는 북쪽이 더 잘살았다',
        body: (n) => [
          `일제는 공장, 광산, 댐을 주로 북쪽에 지었습니다. 그래서 1940년 1인당 소득은 북쪽이 약 ${n.gdp40P}달러, 남쪽이 약 ${n.gdp40K}달러였습니다. 전쟁 뒤 이 관계는 빠르게 뒤집혔습니다.`,
          `${n.gdpYear}년 한국은 ${n.gdpK}달러, 북한은 ${n.gdpP}달러로 약 ${n.gdpRatio}배 차이입니다. 1944~1989년 북한의 실제 수치는 아무도 모릅니다 (북한은 통계를 거의 공개하지 않습니다). 그래서 북한 선에 빈 구간이 있습니다.`,
        ],
      },
      {
        id: 'life',
        h2: '대기근 전까지는 막상막하',
        body: (n) => [
          `1990년 북한에서 태어난 아기의 기대수명은 ${n.le90P}세, 한국은 ${n.le90K}세였습니다. 사실상 같았습니다. 그러다 소련이 무너지고 원조가 끊기고 홍수가 겹치면서, 1990년대 중반 대기근으로 수십만에서 수백만 명이 숨졌습니다.`,
          `유엔 추정치는 1995년 ${n.leFamine}세까지 떨어집니다. 지금은 북한 ${n.leP}세, 한국 ${n.leK}세로, 북한 사람들은 약 ${n.leGap}년 일찍 죽습니다. (1995년 이후의 평평한 구간은 유엔이 위기 시기를 모델링한 방식입니다. 실제 해마다의 변화는 아무도 모릅니다.)`,
        ],
      },
      {
        id: 'kids',
        h2: '기근의 대가를 가장 먼저 치른 건 아이들',
        body: (n) => [
          `1990년 북한 아이의 약 ${n.cm90}%가 다섯 살이 되기 전에 숨졌습니다. 1996년에는 ${n.cm96}%, 열 명 중 한 명이었습니다.`,
          `그 뒤로 많이 줄어 ${n.cmYear}년에는 ${n.cmP}%입니다. 그래도 한국(${n.cmK}%)의 약 ${n.cmRatio}배입니다.`,
        ],
      },
      {
        id: 'energy',
        h2: '꺼진 불은 다시 켜지지 않았다',
        body: (n) => [
          `북한의 1인당 에너지 사용량은 1980년(${n.en80P}kWh)이 지금(${n.enP}kWh)보다 많았습니다. 거꾸로 간 몇 안 되는 나라입니다. 같은 기간 한국은 ${n.en80K}kWh에서 ${n.enK}kWh로 늘었습니다.`,
          `위의 사진이 그 결과입니다. 집에 전기가 들어오는 북한 주민은 약 ${n.accP}%이고, 그마저도 하루 몇 시간뿐인 경우가 많습니다.`,
        ],
      },
      {
        id: 'freedom',
        h2: '한국도 독재였다, 그리고 바뀌었다',
        body: (n) => [
          `잊기 쉽지만 한국은 1987년까지 군사정권이었습니다. 대규모 시위가 직선제를 끌어냈고, 민주주의 점수는 2년 만에 ${n.dem86K}에서 ${n.dem88K}로 뛰었습니다.`,
          `북한의 점수는 80년 동안 0 근처에 머물러 있습니다 (${n.demYear}년 ${n.demP}, 0~1 척도). 같은 민족, 다른 체제. 아마 여기서 가장 중요한 차트일 겁니다.`,
        ],
      },
    ],
    moreTitle: '더 많은 비교',
    moreHint: '차트에 마우스를 올리거나 탭하면 수치가 보이고, 나라 이름을 누르면 숨길 수 있습니다. 모든 차트에는 표와 CSV가 있는 전체 페이지가 있습니다.',
    caveatTitle: '북한 통계는 얼마나 믿을 수 있나?',
    caveat: [
      '거의 어느 나라보다도 덜 믿을 만합니다. 북한은 수십 년 전부터 대부분의 통계 공개를 멈췄습니다. 그래서 이 수치 대부분은 외부(유엔, 한국은행, FAO)의 추정치로, 위성사진, 무역 자료, 탈북민 인터뷰, 북한이 허용한 두 번의 인구조사(1993년, 2008년)를 바탕으로 합니다.',
      '그러니 정확한 집계가 아니라 현재 가능한 최선의 추정으로 읽어 주세요. 추정이 특히 불확실한 곳은 차트 아래에 적어 두었습니다. 모든 차트는 출처로 연결됩니다.',
    ],
    faqTitle: '짧은 답',
    faq: (n) => [
      {
        q: '한국은 북한보다 얼마나 잘사나요?',
        a: `1인당 약 ${n.gdpRatio}배입니다. ${n.gdpYear}년 1인당 GDP는 한국 약 ${n.gdpK}달러, 북한 ${n.gdpP}달러였습니다 (매디슨 프로젝트 추정, 2011년 달러 기준).`,
      },
      {
        q: '한국 사람이 북한 사람보다 오래 사나요?',
        a: `네, 약 ${n.leGap}년 더 오래 삽니다. ${n.leYear}년 유엔 추정치는 한국 ${n.leK}세, 북한 ${n.leP}세입니다. 1990년에는 둘 다 약 70세로 거의 같았습니다.`,
      },
      {
        q: '남북한이 비슷했던 적이 있나요?',
        a: '대체로 그렇습니다. 1940년에는 공업 지대였던 북쪽이 1인당 소득에서 남쪽보다 앞섰고, 1990년에는 기대수명이 거의 같았습니다. 큰 격차는 1990년대 대기근 이후, 그리고 한국이 산업화와 민주화를 이루면서 벌어졌습니다.',
      },
      {
        q: '북한 사람은 한국 사람보다 키가 작나요?',
        a: `평균적으로 그렇습니다. NCD-RisC 추정에 따르면 1930년생 남성은 남북 모두 키가 비슷했지만(${n.hm30P}cm 대 ${n.hm30K}cm), 1996년생 남성은 북한 ${n.hmP}cm, 한국 ${n.hmK}cm입니다. 탈북민을 대상으로 한 연구에서는 기근 시기에 자란 아이들에게서 더 큰 차이가 측정되었습니다.`,
      },
    ],
    dataTitle: '데이터 쓰기',
    dataBody: '여기 나온 모든 수치는 매주 갱신되는 공개 데이터셋에 있고, 시리즈마다 원 출처가 달려 있습니다. 내려받고, 확인하고, 활용해 주세요.',
    dataCta: '모든 차트와 데이터',
    githubCta: 'GitHub의 데이터',
    readNext: '다음 읽을거리',
  },

  ja: {
    metaTitle: '北朝鮮と韓国の比較：同じ民族、80年の差（グラフ）',
    metaDescription: '1945年以降の南北朝鮮の平均寿命、所得、食料、電力、身長、自由を、国連・世界銀行・FAO・V-Demのデータから作ったグラフで比べます。',
    eyebrow: 'データ · 南北比較',
    h1: '北朝鮮と韓国',
    lede: '同じ民族、同じ言葉、同じ食べ物。1945年、朝鮮半島は38度線で二つに分けられ、しばらくは南北がだいたい同じくらいでした（1990年には両方とも平均寿命が約70歳）。そこから二つは引き離されていきます。どれだけ離れたかをグラフで見ていきます。',
    nightCaption: '夜の朝鮮半島。明るく光っているのがソウル、北にある一つの点が平壌です。',
    vs: { life: '平均寿命', gdp: '1人あたり所得', power: '1人あたり電力', kids: '5歳未満で亡くなる子ども' },
    times: (x) => `韓国が${x}倍`,
    timesNorth: (x) => `北朝鮮が${x}倍高い`,
    shorter: (x) => `北朝鮮が${x}年短い`,
    bands: { division: '分断', war: '朝鮮戦争', famine: '大飢饉', covid: '国境封鎖', democracy: '韓国の民主化' },
    sections: [
      {
        id: 'money',
        h2: '分断前は北の方が豊かだった',
        body: (n) => [
          `日本は工場、鉱山、ダムを主に北側に作りました。そのため1940年の1人あたり所得は北側が約${n.gdp40P}ドル、南側が約${n.gdp40K}ドルでした。戦争の後、これはすぐに逆転します。`,
          `${n.gdpYear}年には韓国が${n.gdpK}ドル、北朝鮮が${n.gdpP}ドルで、約${n.gdpRatio}倍の差です。1944〜1989年の北朝鮮の本当の数字は誰にも分かりません（北朝鮮は統計をほとんど公表しません）。だから北朝鮮の線には空白があります。`,
        ],
      },
      {
        id: 'life',
        h2: '大飢饉までは互角だった',
        body: (n) => [
          `1990年、北朝鮮で生まれた赤ちゃんの平均寿命は${n.le90P}歳、韓国は${n.le90K}歳。ほぼ同じでした。その後ソ連が崩壊して援助が止まり、洪水も重なって、1990年代半ばの大飢饉で数十万から数百万人が亡くなりました。`,
          `国連の推計は1995年に${n.leFamine}歳まで落ちます。今は北朝鮮${n.leP}歳、韓国${n.leK}歳で、北朝鮮の人は約${n.leGap}年早く亡くなります。（1995年以降の平らな部分は、国連が危機の時期をモデル化した結果です。実際の年ごとの変化は誰にも分かりません。）`,
        ],
      },
      {
        id: 'kids',
        h2: '飢饉の代償を最初に払ったのは子どもたち',
        body: (n) => [
          `1990年、北朝鮮の子どもの約${n.cm90}%が5歳になる前に亡くなっていました。1996年には${n.cm96}%、10人に1人です。`,
          `その後大きく下がり、${n.cmYear}年には${n.cmP}%。それでも韓国（${n.cmK}%）の約${n.cmRatio}倍です。`,
        ],
      },
      {
        id: 'energy',
        h2: '消えた明かりは戻らなかった',
        body: (n) => [
          `北朝鮮の1人あたりエネルギー使用量は、1980年（${n.en80P}kWh）の方が今（${n.enP}kWh）より多かったのです。逆戻りした数少ない国の一つです。同じ期間に韓国は${n.en80K}kWhから${n.enK}kWhに増えました。`,
          `その結果が上の写真です。家で電気が使える北朝鮮の人は約${n.accP}%で、それも1日数時間だけということがよくあります。`,
        ],
      },
      {
        id: 'freedom',
        h2: '韓国も独裁だった、そして変わった',
        body: (n) => [
          `忘れられがちですが、韓国は1987年まで軍事政権でした。大規模なデモが直接選挙を勝ち取り、民主主義スコアは2年で${n.dem86K}から${n.dem88K}に跳ね上がりました。`,
          `北朝鮮のスコアは80年間ずっとゼロ近くです（${n.demYear}年は${n.demP}、0〜1の尺度）。同じ民族、違う体制。おそらくここで一番大事なグラフです。`,
        ],
      },
    ],
    moreTitle: 'ほかの比較',
    moreHint: 'グラフにカーソルを合わせるかタップすると数字が出ます。国名を押すと隠せます。どのグラフにも表とCSVのある個別ページがあります。',
    caveatTitle: '北朝鮮の数字はどこまで信用できる？',
    caveat: [
      'ほぼどの国よりも信用できません。北朝鮮は何十年も前からほとんどの統計の公表をやめています。そのため数字の多くは外部（国連、韓国銀行、FAO）の推計で、衛星画像、貿易データ、脱北者への聞き取り、北朝鮮が認めた2回の国勢調査（1993年と2008年）をもとにしています。',
      'なので正確な集計ではなく、今ある中で一番ましな推計として読んでください。推計が特に不確かなところはグラフの下に書いています。どのグラフも出典にリンクしています。',
    ],
    faqTitle: '短い答え',
    faq: (n) => [
      {
        q: '韓国は北朝鮮よりどれくらい豊か？',
        a: `1人あたりで約${n.gdpRatio}倍です。${n.gdpYear}年の1人あたりGDPは韓国が約${n.gdpK}ドル、北朝鮮が${n.gdpP}ドルでした（マディソン・プロジェクトの推計、2011年ドル）。`,
      },
      {
        q: '韓国の人は北朝鮮の人より長生き？',
        a: `はい、約${n.leGap}年長生きです。${n.leYear}年の国連推計は韓国${n.leK}歳、北朝鮮${n.leP}歳です。1990年には両方とも約70歳でほぼ同じでした。`,
      },
      {
        q: '南北朝鮮が同じくらいだった時期はある？',
        a: 'だいたい、あります。1940年には工業地帯だった北側の方が1人あたり所得で南側より上で、1990年には平均寿命がほぼ同じでした。大きな差が開いたのは、1990年代の大飢饉の後、そして韓国が工業化と民主化を進めてからです。',
      },
      {
        q: '北朝鮮の人は韓国の人より背が低い？',
        a: `平均では低いです。NCD-RisCの推計では、1930年生まれの男性は南北でほぼ同じ身長でした（${n.hm30P}cm対${n.hm30K}cm）が、1996年生まれの男性は北朝鮮${n.hmP}cm、韓国${n.hmK}cmです。脱北者を対象にした研究では、飢饉の時期に育った子どもでもっと大きな差が測定されています。`,
      },
    ],
    dataTitle: 'データを使う',
    dataBody: 'ここにある数字はすべて、毎週更新されるオープンデータセットに入っていて、シリーズごとに元の出典が付いています。ダウンロードして、確かめて、活用してください。',
    dataCta: 'すべてのグラフとデータ',
    githubCta: 'GitHubのデータ',
    readNext: '次に読む',
  },
};
