/** Text for /data (the chart and dataset hub) and /data/<id> (one chart) in every language the site has. */
import type { Lang } from '@/site/seo';

export const DATA_TEXT: Record<
  Lang,
  {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    h1: string;
    lede: string;
    featuredKicker: string;
    featuredTitle: string;
    featuredBody: string;
    tiles: { series: string; built: string; builtNote: string; weekly: string; weeklyNote: string };
    ours: string;
    oursTitle: string;
    chart: string;
    csv: string;
    latestLabel: string;
    citeTitle: string;
    cite: (title: string, url: string, source: string, year: string) => string;
    licenseTitle: string;
    license: string;
    github: string;
    about: string;
    related: string;
    back: string;
    seriesMetaDescription: (title: string, sub: string) => string;
  }
> = {
  en: {
    metaTitle: 'North Korea data and charts: open, dated, updated weekly',
    metaDescription:
      'Free charts and downloadable datasets on North Korea: life expectancy, income, food, market prices, the won exchange rate, defectors, missiles, sanctions and aid. Every series has its source and date.',
    eyebrow: 'Open data',
    h1: 'Charts and data on North Korea',
    lede: 'Every chart on this site, with the data behind it. Where a good source already exists (UN, World Bank, Our World in Data) we pull from it. Where the numbers are stuck in PDFs, spreadsheets or news articles, we pull them out and keep a clean copy here. All of it rebuilds every week on GitHub.',
    featuredKicker: 'Start here',
    featuredTitle: 'North Korea vs South Korea',
    featuredBody: 'Same people, split in 1945. Income, life expectancy, food, electricity, height and freedom, side by side.',
    tiles: {
      series: 'datasets',
      built: 'last rebuilt',
      builtNote: 'Each chart also shows its own date',
      weekly: 'weekly',
      weeklyNote: 'refreshed by a GitHub Action',
    },
    oursTitle: 'Data we keep ourselves',
    ours: 'Nobody else publishes these as clean data: market prices from Daily NK’s survey (2009 to now, from a spreadsheet behind their site), defector arrivals from the Ministry of Unification’s PDF, yearly missile counts from the CNS database, and UN sanctions listings by year.',
    chart: 'Chart',
    csv: 'CSV',
    latestLabel: 'Latest',
    citeTitle: 'How to cite',
    cite: (title, url, source, year) => `Free North Korea (${year}). “${title}”. Data from ${source}. ${url}`,
    licenseTitle: 'License',
    license:
      'Our code and processing are Apache-2.0. Each dataset keeps its original license (shown next to the source). Please credit the original source first, and us if our cleanup saved you time.',
    github: 'All data on GitHub',
    about: 'About this data',
    related: 'Related charts',
    back: 'All charts',
    seriesMetaDescription: (title, sub) => `${title}: ${sub} Interactive chart, table and CSV download, with source and date.`,
  },
  ko: {
    metaTitle: '북한 데이터와 차트: 공개, 날짜 표기, 매주 갱신',
    metaDescription:
      '북한에 관한 무료 차트와 내려받을 수 있는 데이터: 기대수명, 소득, 식량, 시장 물가, 환율, 탈북민, 미사일, 제재, 지원. 모든 시리즈에 출처와 날짜가 있습니다.',
    eyebrow: '공개 데이터',
    h1: '북한 차트와 데이터',
    lede: '이 사이트의 모든 차트와 그 뒤의 데이터입니다. 좋은 출처(유엔, 세계은행, Our World in Data)가 이미 있으면 거기서 가져옵니다. 숫자가 PDF, 스프레드시트, 기사 속에 묻혀 있으면 우리가 꺼내서 깔끔한 사본을 여기에 둡니다. 전부 매주 GitHub에서 다시 만들어집니다.',
    featuredKicker: '여기서 시작',
    featuredTitle: '북한 vs 한국',
    featuredBody: '1945년에 갈라진 같은 민족. 소득, 기대수명, 식량, 전력, 키, 자유를 나란히 봅니다.',
    tiles: {
      series: '개 데이터셋',
      built: '마지막 갱신',
      builtNote: '차트마다 자체 날짜도 표시',
      weekly: '매주',
      weeklyNote: 'GitHub Action으로 갱신',
    },
    oursTitle: '우리가 직접 관리하는 데이터',
    ours: '다른 곳에서는 깔끔한 데이터로 공개하지 않는 것들입니다. 데일리NK 조사의 시장 물가(2009년부터, 사이트 뒤의 스프레드시트에서), 통일부 PDF의 탈북민 입국 통계, CNS 데이터베이스의 연도별 미사일 발사 수, 연도별 유엔 제재 지정.',
    chart: '차트',
    csv: 'CSV',
    latestLabel: '최신',
    citeTitle: '인용 방법',
    cite: (title, url, source, year) => `Free North Korea (${year}). 「${title}」. 자료: ${source}. ${url}`,
    licenseTitle: '라이선스',
    license:
      '코드와 가공은 Apache-2.0입니다. 각 데이터셋은 원래 라이선스를 따릅니다(출처 옆에 표시). 원 출처를 먼저, 그리고 정리 작업이 도움이 되었다면 저희도 밝혀 주세요.',
    github: 'GitHub의 전체 데이터',
    about: '이 데이터에 대해',
    related: '관련 차트',
    back: '전체 차트',
    seriesMetaDescription: (title, sub) => `${title}: ${sub} 인터랙티브 차트, 표, CSV 내려받기, 출처와 날짜 포함.`,
  },
  ja: {
    metaTitle: '北朝鮮のデータとグラフ：オープン、日付付き、毎週更新',
    metaDescription:
      '北朝鮮に関する無料のグラフとダウンロードできるデータ：平均寿命、所得、食料、市場価格、為替レート、脱北者、ミサイル、制裁、支援。すべてのシリーズに出典と日付があります。',
    eyebrow: 'オープンデータ',
    h1: '北朝鮮のグラフとデータ',
    lede: 'このサイトのすべてのグラフと、その元のデータです。良い出典（国連、世界銀行、Our World in Data）がすでにあればそこから取ります。数字がPDFやスプレッドシート、記事の中に埋もれていれば、取り出してきれいなコピーをここに置きます。すべて毎週GitHubで作り直されます。',
    featuredKicker: 'まずはここから',
    featuredTitle: '北朝鮮と韓国',
    featuredBody: '1945年に分けられた同じ民族。所得、平均寿命、食料、電力、身長、自由を並べて見ます。',
    tiles: {
      series: 'のデータセット',
      built: '最終更新',
      builtNote: 'グラフごとにも日付を表示',
      weekly: '毎週',
      weeklyNote: 'GitHub Actionで更新',
    },
    oursTitle: '自分たちで管理しているデータ',
    ours: 'ほかではきれいなデータとして公開されていないものです。デイリーNKの調査による市場価格（2009年から、サイトの裏にあるスプレッドシートから）、統一部のPDFにある脱北者の入国数、CNSデータベースの年別ミサイル発射数、年別の国連制裁指定。',
    chart: 'グラフ',
    csv: 'CSV',
    latestLabel: '最新',
    citeTitle: '引用のしかた',
    cite: (title, url, source, year) => `Free North Korea (${year}). 「${title}」. データ: ${source}. ${url}`,
    licenseTitle: 'ライセンス',
    license:
      'コードと加工はApache-2.0です。各データセットは元のライセンスに従います（出典の横に表示）。まず元の出典を、そして整理が役に立ったなら私たちのことも書いてください。',
    github: 'GitHubのすべてのデータ',
    about: 'このデータについて',
    related: '関連するグラフ',
    back: 'すべてのグラフ',
    seriesMetaDescription: (title, sub) => `${title}：${sub} インタラクティブなグラフ、表、CSVダウンロード、出典と日付付き。`,
  },
  zh: {
    metaTitle: '朝鲜数据与图表：公开、注明日期、每周更新',
    metaDescription:
      '关于朝鲜的免费图表和可下载数据：预期寿命、收入、粮食、市场价格、汇率、脱北者、导弹、制裁和援助。每个数据系列都注明来源和日期。',
    eyebrow: '公开数据',
    h1: '朝鲜图表与数据',
    lede: '本站所有图表，以及图表背后的数据。已经有好的来源（联合国、世界银行、Our World in Data）的，我们直接从那里取。数字埋在PDF、电子表格或新闻报道里的，我们把它们提取出来，在这里保留一份干净的副本。所有数据每周在GitHub上重新生成。',
    featuredKicker: '从这里开始',
    featuredTitle: '朝鲜与韩国',
    featuredBody: '同一个民族，1945年被分开。收入、预期寿命、粮食、电力、身高和自由，并排比较。',
    tiles: {
      series: '个数据集',
      built: '最近更新',
      builtNote: '每张图表也标有自己的日期',
      weekly: '每周',
      weeklyNote: '由GitHub Action自动更新',
    },
    oursTitle: '我们自己维护的数据',
    ours: '这些数据别处没有以干净格式公开：Daily NK调查的市场价格（2009年至今，取自其网站背后的电子表格）、韩国统一部PDF中的脱北者入境人数、CNS数据库的历年导弹发射次数，以及历年联合国制裁指定。',
    chart: '图表',
    csv: 'CSV',
    latestLabel: '最新',
    citeTitle: '引用方式',
    cite: (title, url, source, year) => `Free North Korea (${year}).《${title}》. 数据来源：${source}. ${url}`,
    licenseTitle: '许可协议',
    license:
      '我们的代码和处理流程采用Apache-2.0。每个数据集沿用其原始许可（标在来源旁边）。请先注明原始来源；如果我们的整理帮你省了时间，也请提一下我们。',
    github: 'GitHub上的全部数据',
    about: '关于这组数据',
    related: '相关图表',
    back: '全部图表',
    seriesMetaDescription: (title, sub) => `${title}：${sub} 交互式图表、表格和CSV下载，附来源和日期。`,
  },
};
