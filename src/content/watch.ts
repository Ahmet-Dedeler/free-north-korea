/**
 * Text for /watch (and /ko/watch, /ja/watch, /zh/watch): the hub for everything the site measures or counts
 * itself and keeps up to date on a schedule. Sorted by how a number is known, most trustworthy first:
 * measured (satellites, seismometers, radar), counted (official lists), reported by the regime (KCNA).
 * The data itself lives in the feature modules (events.ts, satWatch.ts, sanctions.ts, kimWatch.ts).
 */
import type { Lang } from '@/site/seo';

export const WATCH_PATHS = { en: '/watch', ko: '/ko/watch', ja: '/ja/watch', zh: '/zh/watch' } as const;

interface WatchText {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  kinds: { measured: [string, string]; counted: [string, string]; reported: [string, string] };
  measuredTitle: string;
  measuredIntro: string;
  eventsTitle: string;
  eventsMore: { military: string; missiles: string };
  imagesTitle: string;
  imagesIntro: string;
  countedTitle: string;
  countedIntro: string;
  listsLabel: string;
  sanctionsMore: string;
  dataMore: string;
  reportedTitle: string;
  reportedIntro: string;
  scheduleTitle: string;
  schedule: [string, string][];
  scheduleNote: string;
  /** The short block on the home pages. */
  teaser: { title: string; intro: string; more: string };
}

export const WATCH_TEXT: Record<Lang, WatchText> = {
  en: {
    metaTitle: 'North Korea watch: what satellites, seismometers and official lists show',
    metaDescription:
      'Live numbers on North Korea that anyone can check: our own Sentinel-2 satellite images of prison camps and nuclear sites, seismic readings, missile launches tracked by radar, five official sanctions lists, and Kim Jong Un’s reported appearances.',
    eyebrow: 'Watch',
    h1: 'What can be seen from outside',
    lede: 'North Korea hides almost everything, so most numbers about it are estimates. This page keeps the ones that are not: what satellites, seismometers and radar measure, and what governments officially count. Scripts check every source on a schedule and the page updates itself.',
    kinds: {
      measured: ['Measured', 'Satellite images, seismometers, radar. Physics; anyone can check it again.'],
      counted: ['Counted', 'Official lists with a public method, such as sanctions lists. We say who did the counting.'],
      reported: ['Reported by the regime', 'What KCNA, North Korea’s state media, says. True only as a statement, and labelled that way.'],
    },
    measuredTitle: 'Measured',
    measuredIntro: 'Events picked up by instruments outside North Korea, with who measured them and a link to their record.',
    eventsTitle: 'Latest measured events',
    eventsMore: { military: 'Seismic readings on the military page', missiles: 'All missile tests' },
    imagesTitle: 'Newest satellite images',
    imagesIntro: 'Our own images of prison camps and nuclear and missile sites, from the European Sentinel-2 satellites. We pick the clearest one by measuring cloud inside each square. Open a place to compare months.',
    countedTitle: 'Counted',
    countedIntro: 'Five governments and the UN each publish who they sanction under their North Korea measures. We download the official files every week.',
    listsLabel: 'Entries on each list',
    sanctionsMore: 'Who is on which list',
    dataMore: 'Charts and data',
    reportedTitle: 'Reported by the regime',
    reportedIntro: 'Kim Jong Un’s public appearances, as KCNA reports them. Nobody outside can check these reports; a gap means KCNA reported nothing.',
    scheduleTitle: 'How often it updates',
    schedule: [
      ['Every 3 hours', 'Seismic readings (USGS) and launch reports (Japan Ministry of Defense)'],
      ['Every day', 'Kim Jong Un’s reported appearances (KCNA)'],
      ['Every week', 'Satellite images (Sentinel-2), sanctions lists, missile test database, and a check that every other source still loads'],
    ],
    scheduleNote: 'Every script and every downloaded file is public on GitHub.',
    teaser: {
      title: 'Watched from outside, updated on its own',
      intro: 'Missile launches tracked by radar, seismic readings, our own satellite images of the camps, and five official sanctions lists. Scripts check them every few hours.',
      more: 'Everything we measure',
    },
  },
  ko: {
    metaTitle: '북한 워치: 위성, 지진계, 공식 명단이 보여주는 것',
    metaDescription:
      '누구나 다시 확인할 수 있는 북한 관련 수치: 정치범수용소와 핵시설을 직접 찍은 센티넬-2 위성 영상, 지진 관측, 레이더로 추적한 미사일 발사, 다섯 개의 공식 제재 명단, 그리고 보도된 김정은의 공개 활동.',
    eyebrow: '워치',
    h1: '밖에서 볼 수 있는 것',
    lede: '북한은 거의 모든 것을 숨기기 때문에 북한에 관한 수치는 대부분 추정치입니다. 이 페이지에는 추정이 아닌 것만 모았습니다. 위성과 지진계, 레이더가 측정한 것, 그리고 각국 정부가 공식적으로 집계한 것입니다. 스크립트가 정해진 주기로 모든 출처를 확인하고 페이지를 스스로 갱신합니다.',
    kinds: {
      measured: ['측정', '위성 영상, 지진계, 레이더. 물리적 관측이라 누구나 다시 확인할 수 있습니다.'],
      counted: ['집계', '제재 명단처럼 방법이 공개된 공식 명단. 누가 집계했는지 밝힙니다.'],
      reported: ['정권 발표', '북한 관영 매체 조선중앙통신의 보도. 발표 내용으로서만 사실이며, 그렇게 표시합니다.'],
    },
    measuredTitle: '측정',
    measuredIntro: '북한 밖의 장비가 잡아낸 사건입니다. 누가 측정했는지와 원래 기록 링크를 함께 보여줍니다.',
    eventsTitle: '최근 측정된 사건',
    eventsMore: { military: '군사 페이지의 지진 관측', missiles: '전체 미사일 시험' },
    imagesTitle: '최신 위성 영상',
    imagesIntro: '유럽 센티넬-2 위성으로 직접 만든 정치범수용소와 핵·미사일 시설 영상입니다. 각 구역 안의 구름을 측정해 가장 맑은 영상을 고릅니다. 장소를 열면 달별로 비교할 수 있습니다.',
    countedTitle: '집계',
    countedIntro: '유엔과 네 나라 정부가 각자의 대북 제재 대상을 공개합니다. 매주 공식 파일을 내려받습니다.',
    listsLabel: '명단별 등재 수',
    sanctionsMore: '누가 어느 명단에 있는지',
    dataMore: '차트와 데이터',
    reportedTitle: '정권 발표',
    reportedIntro: '조선중앙통신이 보도한 김정은의 공개 활동입니다. 밖에서는 이 보도를 확인할 수 없고, 공백은 보도가 없었다는 뜻입니다.',
    scheduleTitle: '갱신 주기',
    schedule: [
      ['3시간마다', '지진 관측(USGS)과 미사일 발사 보고(일본 방위성)'],
      ['매일', '보도된 김정은의 공개 활동(조선중앙통신)'],
      ['매주', '위성 영상(센티넬-2), 제재 명단, 미사일 시험 데이터베이스, 그 밖의 모든 출처가 여전히 열리는지 확인'],
    ],
    scheduleNote: '모든 스크립트와 내려받은 파일은 GitHub에 공개되어 있습니다.',
    teaser: {
      title: '밖에서 지켜보고, 스스로 갱신합니다',
      intro: '레이더로 추적한 미사일 발사, 지진 관측, 수용소를 직접 찍은 위성 영상, 다섯 개의 공식 제재 명단. 스크립트가 몇 시간마다 확인합니다.',
      more: '측정하는 모든 것 보기',
    },
  },
  ja: {
    metaTitle: '北朝鮮ウォッチ：衛星、地震計、公式リストが示すもの',
    metaDescription:
      '誰でも確かめ直せる北朝鮮の数字：政治犯収容所と核施設を独自に撮ったセンチネル2の衛星画像、地震観測、レーダーで追跡したミサイル発射、5つの公式制裁リスト、報道された金正恩の公開活動。',
    eyebrow: 'ウォッチ',
    h1: '外から見えるもの',
    lede: '北朝鮮はほとんどすべてを隠すため、北朝鮮に関する数字の多くは推計です。このページには推計でないものだけを集めました。衛星、地震計、レーダーが測ったものと、各国政府が公式に数えたものです。スクリプトが決まった間隔ですべての出典を確認し、ページは自動で更新されます。',
    kinds: {
      measured: ['測定', '衛星画像、地震計、レーダー。物理的な観測なので、誰でも確かめ直せます。'],
      counted: ['集計', '制裁リストのように方法が公開された公式リスト。誰が数えたかを明記します。'],
      reported: ['政権の発表', '北朝鮮の国営メディア、朝鮮中央通信の報道。発表としてのみ事実で、そう表示します。'],
    },
    measuredTitle: '測定',
    measuredIntro: '北朝鮮の外にある機器がとらえた出来事です。誰が測ったかと、元の記録へのリンクを示します。',
    eventsTitle: '最近測定された出来事',
    eventsMore: { military: '軍事ページの地震観測', missiles: 'すべてのミサイル発射' },
    imagesTitle: '最新の衛星画像',
    imagesIntro: '欧州のセンチネル2衛星から独自に作った、政治犯収容所と核・ミサイル施設の画像です。各区画の中の雲を測って最も鮮明な画像を選びます。場所を開くと月ごとに比べられます。',
    countedTitle: '集計',
    countedIntro: '国連と4つの政府がそれぞれ北朝鮮関連の制裁対象を公表しています。公式ファイルを毎週ダウンロードします。',
    listsLabel: 'リストごとの登録数',
    sanctionsMore: '誰がどのリストに載っているか',
    dataMore: 'グラフとデータ',
    reportedTitle: '政権の発表',
    reportedIntro: '朝鮮中央通信が報じた金正恩の公開活動です。外部からは確かめられず、空白は報道がなかったことを意味します。',
    scheduleTitle: '更新の頻度',
    schedule: [
      ['3時間ごと', '地震観測（USGS）とミサイル発射の発表（防衛省）'],
      ['毎日', '報道された金正恩の公開活動（朝鮮中央通信）'],
      ['毎週', '衛星画像（センチネル2）、制裁リスト、ミサイル発射データベース、ほかのすべての出典が開けるかの確認'],
    ],
    scheduleNote: 'すべてのスクリプトとダウンロードしたファイルはGitHubで公開しています。',
    teaser: {
      title: '外から見張り、自動で更新',
      intro: 'レーダーで追跡したミサイル発射、地震観測、収容所を独自に撮った衛星画像、5つの公式制裁リスト。スクリプトが数時間ごとに確認します。',
      more: '測定しているものすべて',
    },
  },
  zh: {
    metaTitle: '朝鲜观察：卫星、地震仪和官方名单显示了什么',
    metaDescription:
      '任何人都能复核的朝鲜数据：我们自己用哨兵二号卫星拍摄的政治犯收容所和核设施影像、地震观测、雷达追踪的导弹发射、五份官方制裁名单，以及报道中金正恩的公开活动。',
    eyebrow: '观察',
    h1: '从外面能看到什么',
    lede: '朝鲜几乎隐藏一切，所以关于朝鲜的数字大多是估计。本页只收集不是估计的数字：卫星、地震仪和雷达测量到的，以及各国政府正式统计的。脚本按固定周期检查每个来源，页面自动更新。',
    kinds: {
      measured: ['测量', '卫星影像、地震仪、雷达。属于物理观测，任何人都能复核。'],
      counted: ['统计', '方法公开的官方名单，例如制裁名单。我们注明由谁统计。'],
      reported: ['政权发布', '朝鲜官方媒体朝中社的报道。只作为发布内容属实，并如此标注。'],
    },
    measuredTitle: '测量',
    measuredIntro: '朝鲜境外的仪器捕捉到的事件，注明由谁测量，并链接到原始记录。',
    eventsTitle: '最新测量到的事件',
    eventsMore: { military: '军事页面上的地震观测', missiles: '全部导弹试射' },
    imagesTitle: '最新卫星影像',
    imagesIntro: '我们用欧洲哨兵二号卫星自己制作的政治犯收容所和核、导弹设施影像。我们测量每个方框内的云量，挑出最清晰的一张。打开地点可以按月对比。',
    countedTitle: '统计',
    countedIntro: '联合国和四个国家的政府各自公布对朝制裁对象。我们每周下载官方文件。',
    listsLabel: '各名单的条目数',
    sanctionsMore: '谁在哪份名单上',
    dataMore: '图表和数据',
    reportedTitle: '政权发布',
    reportedIntro: '朝中社报道的金正恩公开活动。外界无法核实这些报道；空白表示朝中社没有报道。',
    scheduleTitle: '更新频率',
    schedule: [
      ['每 3 小时', '地震观测（USGS）和导弹发射报告（日本防卫省）'],
      ['每天', '报道中金正恩的公开活动（朝中社）'],
      ['每周', '卫星影像（哨兵二号）、制裁名单、导弹试射数据库，并检查其他所有来源是否仍能打开'],
    ],
    scheduleNote: '所有脚本和下载的文件都在 GitHub 上公开。',
    teaser: {
      title: '从外部观察，自动更新',
      intro: '雷达追踪的导弹发射、地震观测、我们自己拍摄的收容所卫星影像，以及五份官方制裁名单。脚本每几个小时检查一次。',
      more: '查看我们测量的一切',
    },
  },
};
