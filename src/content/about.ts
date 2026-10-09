/**
 * Text for /about in every language: who is behind the site, who writes the articles, why there are no faces or
 * names, how the data is collected, money, and how to reach us. Rendered by components/AboutPage.tsx.
 *
 * The site speaks as a group ("we"). The /learn explainers have one byline (AUTHOR_NAME in site/config.ts) and may say
 * "I"; this page explains that. Don't add photos or personal bios here: the site is about the people of North Korea.
 */
import type { Lang } from '@/site/seo';
import { AUTHOR_NAME } from '@/site/config';

export const ABOUT_PATHS = { en: '/about', ko: '/ko/about', ja: '/ja/about', zh: '/zh/about' } as const;

export interface AboutText {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  tiles: { value: string; label: string }[];
  writeTitle: string;
  write: string[];
  facesTitle: string;
  faces: string[];
  notTitle: string;
  not: string[];
  dataTitle: string;
  dataIntro: string;
  data: string[];
  leftOut: string;
  contactTitle: string;
  contact: string[];
  issue: string;
  code: string;
  sourcesLink: string;
  sources: string;
}

/** The advisory behind the "state hackers go after people who work on North Korea" line. */
export const ABOUT_SOURCES = [
  {
    name: 'CISA, FBI and US Cyber Command: North Korean advanced persistent threat focus: Kimsuky (AA20-301A), Oct 2020',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-301a',
  },
];

export const ABOUT_TEXT: Record<Lang, AboutText> = {
  en: {
    metaTitle: 'About: who runs Free North Korea and where the data comes from',
    metaDescription:
      'Free North Korea is an open-source project run by volunteers, not by a company, government or NGO. Who writes it, how the data is collected, why it takes no money, and how to reach us.',
    eyebrow: 'About',
    h1: 'Who is behind this site',
    lede: 'Free North Korea is an open-source project. A small group of volunteers builds it in the open, together with anyone who sends a fix on GitHub. No company, government or NGO runs it, and nobody pays for it.',
    tiles: [
      { value: '0', label: 'ads, sponsors or donations' },
      { value: '0', label: 'cookies; page views are only counted anonymously' },
      { value: '4', label: 'languages: English, Korean, Japanese, Chinese' },
      { value: 'Open', label: 'source: the code and data are on GitHub' },
    ],
    writeTitle: 'Who writes it',
    write: [
      `The explainers under Learn are written by ${AUTHOR_NAME}. When an article says “I”, that is the writer’s own judgment, for example which paths to change look most likely.`,
      'Everything else, the map, the data pages and the lists, is put together by the group from public sources. Every number links to where it came from, and anyone can correct any of it.',
    ],
    facesTitle: 'Why there are no faces or bios here',
    faces: [
      'This site is about the 26 million people living in North Korea, not about the people who build it.',
      'There is a practical reason too. North Korean state hackers go after people who work on North Korea, including experts and think tanks, according to a 2020 US government advisory. So the people behind the site stay out of the spotlight. Judge the site by its sources, not by who we are.',
    ],
    notTitle: 'Not affiliated with anyone',
    not: [
      'We are not Liberty in North Korea (LiNK), and not any other group this site links to. Our address is liberatenorthkorea.org; LiNK’s is libertyinnorthkorea.org.',
      'We point readers to groups like LiNK because they do the work on the ground. We have no ties to any government.',
    ],
    dataTitle: 'How the data is collected',
    dataIntro: 'Most of the site updates itself from official and research sources on a schedule. Nothing is typed in from memory.',
    data: [
      'Sanctions lists come straight from the UN 1718 Committee and the US Treasury (OFAC) files, every week.',
      'Earthquakes come from the USGS catalog and missile launches from Japan’s Ministry of Defense, checked every three hours.',
      'Satellite pictures of the camps and military sites are our own cuts of free Sentinel-2 imagery from Copernicus.',
      'Camp locations, human rights records and missile tests come from documentation groups and researchers (NKDB, HRNK, the CNS missile database). Their numbers keep their names on them.',
      'Facts about people come from Wikidata and official lists. A claim is dropped if its source page doesn’t load or doesn’t say it.',
      'A weekly job checks every source link for changes, moves and dead pages, and shows the result on the Sources page.',
    ],
    leftOut:
      'Some things are left out on purpose: no one’s home, no exact execution or burial sites, no incident stories that could identify a person. Those only appear as counts per county.',
    contactTitle: 'Get in touch',
    contact: [
      'Open an issue on GitHub for anything: a wrong number, a broken page, a source we missed, a translation that reads badly. Pull requests are welcome.',
      'If something on the site could put a person at risk, open an issue that only names the page, without the details. We take it down first and ask questions after.',
    ],
    issue: 'Open an issue',
    code: 'See the code',
    sourcesLink: 'Sources page',
    sources: 'Sources',
  },

  ko: {
    metaTitle: '소개: 자유 북한은 누가 만들고 데이터는 어디서 오나',
    metaDescription:
      '자유 북한은 회사나 정부, NGO가 아니라 자원봉사자들이 운영하는 오픈소스 프로젝트입니다. 누가 쓰는지, 데이터를 어떻게 모으는지, 왜 돈을 받지 않는지, 어떻게 연락하는지 적었습니다.',
    eyebrow: '소개',
    h1: '이 사이트를 만드는 사람들',
    lede: '자유 북한은 오픈소스 프로젝트입니다. 소수의 자원봉사자가 공개적으로 만들고, GitHub에서 수정을 보내는 누구나 함께 만듭니다. 회사도 정부도 NGO도 운영하지 않으며, 돈을 대는 곳도 없습니다.',
    tiles: [
      { value: '0', label: '광고, 후원사, 기부금' },
      { value: '0', label: '쿠키. 페이지 조회수는 익명으로만 집계' },
      { value: '4', label: '개 언어: 영어, 한국어, 일본어, 중국어' },
      { value: '공개', label: '코드와 데이터 모두 GitHub에 있음' },
    ],
    writeTitle: '누가 쓰나',
    write: [
      `해설 글의 필자는 ${AUTHOR_NAME}입니다. 글에서 "나"라고 말하는 부분은 글쓴이 자신의 판단입니다. 예를 들어 어떤 변화의 길이 가장 가능성이 높아 보이는지 같은 것입니다.`,
      '그 밖의 모든 것, 지도와 데이터 페이지와 명단은 공개된 자료로 여럿이 함께 만듭니다. 모든 숫자에는 출처 링크가 있고, 누구든 고칠 수 있습니다.',
    ],
    facesTitle: '왜 얼굴이나 소개가 없나',
    faces: [
      '이 사이트는 북한에 사는 2,600만 명에 관한 것이지, 사이트를 만드는 사람들에 관한 것이 아닙니다.',
      '현실적인 이유도 있습니다. 2020년 미국 정부 경보에 따르면 북한 국가 해커들은 전문가와 싱크탱크를 비롯해 북한을 다루는 사람들을 노립니다. 그래서 사이트를 만드는 사람들은 앞에 나서지 않습니다. 우리가 누구인지가 아니라 출처를 보고 판단해 주세요.',
    ],
    notTitle: '어느 단체와도 관계없음',
    not: [
      '우리는 Liberty in North Korea(LiNK)가 아니며, 이 사이트가 링크하는 다른 어떤 단체도 아닙니다. 우리 주소는 liberatenorthkorea.org이고, LiNK는 libertyinnorthkorea.org입니다.',
      'LiNK 같은 단체를 소개하는 것은 그들이 현장에서 일을 하기 때문입니다. 우리는 어느 정부와도 관계가 없습니다.',
    ],
    dataTitle: '데이터를 모으는 방법',
    dataIntro: '사이트 대부분은 공식 자료와 연구 자료에서 정해진 주기로 스스로 갱신됩니다. 기억에 의존해 적어 넣은 것은 없습니다.',
    data: [
      '제재 명단은 매주 유엔 1718 위원회와 미국 재무부(OFAC) 파일에서 그대로 받아 옵니다.',
      '지진은 미국 지질조사국(USGS) 목록에서, 미사일 발사는 일본 방위성 발표에서 3시간마다 확인합니다.',
      '수용소와 군사 시설의 위성 사진은 코페르니쿠스의 무료 Sentinel-2 영상을 우리가 직접 잘라 낸 것입니다.',
      '수용소 위치, 인권 기록, 미사일 시험은 기록 단체와 연구자들(NKDB, HRNK, CNS 미사일 데이터베이스)의 자료입니다. 그들의 숫자에는 그들의 이름을 붙여 둡니다.',
      '인물에 관한 사실은 위키데이터와 공식 명단에서 가져옵니다. 출처 페이지가 열리지 않거나 그 내용이 없으면 그 주장은 뺍니다.',
      '매주 모든 출처 링크가 바뀌었는지, 옮겨졌는지, 사라졌는지 확인하고 그 결과를 출처 페이지에 보여 줍니다.',
    ],
    leftOut:
      '일부러 빼는 것도 있습니다. 누군가의 집, 정확한 처형 장소나 매장지, 사람을 알아볼 수 있는 사건 이야기는 싣지 않습니다. 이런 것은 시·군별 건수로만 나옵니다.',
    contactTitle: '연락하기',
    contact: [
      '틀린 숫자, 깨진 페이지, 빠진 출처, 어색한 번역 등 무엇이든 GitHub에 이슈를 열어 주세요. 풀 리퀘스트도 환영합니다.',
      '사이트의 어떤 내용이 누군가를 위험하게 할 수 있다면, 자세한 내용 없이 페이지만 적어서 이슈를 열어 주세요. 먼저 내리고, 질문은 나중에 합니다.',
    ],
    issue: '이슈 열기',
    code: '코드 보기',
    sourcesLink: '출처 페이지',
    sources: '출처',
  },

  ja: {
    metaTitle: 'このサイトについて：自由北朝鮮を運営しているのは誰か、データはどこから来るか',
    metaDescription:
      '自由北朝鮮は、企業や政府、NGOではなく、ボランティアが運営するオープンソースのプロジェクトです。誰が書いているのか、データの集め方、お金を受け取らない理由、連絡の方法をまとめました。',
    eyebrow: 'このサイトについて',
    h1: 'このサイトを作っている人たち',
    lede: '自由北朝鮮はオープンソースのプロジェクトです。少人数のボランティアが公開の場で作り、GitHubで修正を送ってくれる人なら誰でも加わっています。企業も政府もNGOも運営しておらず、お金を出しているところもありません。',
    tiles: [
      { value: '0', label: '広告、スポンサー、寄付' },
      { value: '0', label: 'クッキー。閲覧数は匿名でのみ集計' },
      { value: '4', label: '言語：英語、韓国語、日本語、中国語' },
      { value: '公開', label: 'コードもデータもGitHubに' },
    ],
    writeTitle: '誰が書いているか',
    write: [
      `「解説」の記事は${AUTHOR_NAME}が書いています。記事の中で「私」と言うところは、書き手自身の判断です。たとえば、どの変化の道筋が最もありそうに見えるか、といったことです。`,
      'それ以外のすべて、地図、データのページ、リストは、公開されている資料からグループで作っています。どの数字にも出典へのリンクがあり、誰でも直せます。',
    ],
    facesTitle: 'なぜ顔写真や経歴がないのか',
    faces: [
      'このサイトは北朝鮮で暮らす2,600万人のためのもので、作っている人たちのためのものではありません。',
      '実際的な理由もあります。2020年の米国政府の勧告によると、北朝鮮の国家ハッカーは専門家やシンクタンクなど、北朝鮮を扱う人たちを狙っています。そのため、サイトを作っている人たちは表に出ません。私たちが誰かではなく、出典でサイトを判断してください。',
    ],
    notTitle: 'どの団体とも関係ありません',
    not: [
      '私たちはLiberty in North Korea（LiNK）ではなく、このサイトがリンクしている他のどの団体でもありません。私たちのアドレスはliberatenorthkorea.org、LiNKはlibertyinnorthkorea.orgです。',
      'LiNKのような団体を紹介するのは、彼らが現場で活動しているからです。私たちはどの政府とも関係がありません。',
    ],
    dataTitle: 'データの集め方',
    dataIntro: 'サイトの大部分は、公式の資料や研究資料から決まった間隔で自動的に更新されます。記憶で書き込んだものはありません。',
    data: [
      '制裁リストは毎週、国連1718委員会と米国財務省（OFAC）のファイルからそのまま取り込みます。',
      '地震は米国地質調査所（USGS）のカタログから、ミサイル発射は日本の防衛省の発表から、3時間ごとに確認します。',
      '収容所や軍事施設の衛星画像は、コペルニクスの無料のSentinel-2画像を私たちが切り出したものです。',
      '収容所の位置、人権の記録、ミサイル発射は、記録団体や研究者（NKDB、HRNK、CNSのミサイルデータベース）の資料です。彼らの数字には彼らの名前を付けています。',
      '人物についての事実はウィキデータと公式のリストから取ります。出典のページが開かない、またはその内容が書かれていなければ、その主張は外します。',
      '毎週、すべての出典リンクが変わっていないか、移動していないか、消えていないかを確認し、結果を出典のページに載せています。',
    ],
    leftOut:
      'あえて載せないものもあります。誰かの自宅、正確な処刑場所や埋葬地、個人を特定できる事件の話は載せません。それらは市・郡ごとの件数としてだけ表示します。',
    contactTitle: '連絡する',
    contact: [
      '間違った数字、壊れたページ、抜けている出典、不自然な翻訳など、何でもGitHubでIssueを開いてください。プルリクエストも歓迎です。',
      'サイトの内容が誰かを危険にさらすおそれがある場合は、詳細は書かずにページだけを書いてIssueを開いてください。まず取り下げ、質問はその後にします。',
    ],
    issue: 'Issueを開く',
    code: 'コードを見る',
    sourcesLink: '出典のページ',
    sources: '出典',
  },

  zh: {
    metaTitle: '关于本站：谁在运营自由朝鲜，数据从哪里来',
    metaDescription:
      '自由朝鲜是一个由志愿者运营的开源项目，不属于任何公司、政府或非政府组织。这里说明谁在写、数据怎么收集、为什么不收钱，以及怎样联系我们。',
    eyebrow: '关于',
    h1: '谁在做这个网站',
    lede: '自由朝鲜是一个开源项目。一小群志愿者公开地建设它，任何在 GitHub 上提交修改的人也都参与其中。没有公司、政府或非政府组织在运营它，也没有人为它出钱。',
    tiles: [
      { value: '0', label: '广告、赞助商或捐款' },
      { value: '0', label: 'cookie；页面浏览量只做匿名统计' },
      { value: '4', label: '种语言：英文、韩文、日文、中文' },
      { value: '开源', label: '代码和数据都在 GitHub 上' },
    ],
    writeTitle: '谁在写',
    write: [
      `“了解”栏目下的解读文章由 ${AUTHOR_NAME} 撰写。文章里说“我”的地方，是作者自己的判断，比如哪条变化的道路看起来最有可能。`,
      '其他所有内容，包括地图、数据页面和名单，都由大家根据公开来源整理。每个数字都链接到出处，任何人都可以纠正。',
    ],
    facesTitle: '为什么这里没有照片和个人介绍',
    faces: [
      '这个网站关注的是生活在朝鲜的 2,600 万人，而不是做网站的人。',
      '还有一个现实原因。根据 2020 年美国政府的一份警报，朝鲜国家黑客会盯上研究朝鲜的人，包括专家和智库。所以做网站的人不站到台前。请根据出处来判断这个网站，而不是根据我们是谁。',
    ],
    notTitle: '与任何机构都没有关系',
    not: [
      '我们不是 Liberty in North Korea（LiNK），也不是本站链接的任何其他组织。我们的网址是 liberatenorthkorea.org，LiNK 的是 libertyinnorthkorea.org。',
      '我们向读者介绍 LiNK 这样的组织，是因为他们在一线做事。我们与任何政府都没有关系。',
    ],
    dataTitle: '数据怎么收集',
    dataIntro: '网站的大部分内容会按固定周期，从官方和研究来源自动更新。没有任何内容是凭记忆写进去的。',
    data: [
      '制裁名单每周直接从联合国 1718 委员会和美国财政部（OFAC）的文件下载。',
      '地震数据来自美国地质调查局（USGS）的目录，导弹发射来自日本防卫省的通报，每三小时检查一次。',
      '收容所和军事设施的卫星图片，是我们自己从哥白尼计划免费的 Sentinel-2 影像中截取的。',
      '收容所位置、人权记录和导弹试射来自记录机构和研究者（NKDB、HRNK、CNS 导弹数据库）。他们的数字会标上他们的名字。',
      '关于人物的事实来自维基数据和官方名单。如果出处页面打不开，或者页面上没有这项说法，就会把它删掉。',
      '每周有一个任务检查所有出处链接是否改动、搬家或失效，结果公布在“来源”页面。',
    ],
    leftOut:
      '有些内容是故意不放的：任何人的住处、确切的处决地点或埋葬地点，以及可能认出某个人的事件经过。这些只以每个市郡的数量出现。',
    contactTitle: '联系我们',
    contact: [
      '任何问题都可以在 GitHub 上提交 issue：数字错误、页面坏了、漏掉的来源、读起来别扭的翻译。也欢迎提交 pull request。',
      '如果网站上的某些内容可能让某个人陷入危险，请提交一个只写明页面、不写细节的 issue。我们会先撤下，再问问题。',
    ],
    issue: '提交 issue',
    code: '查看代码',
    sourcesLink: '来源页面',
    sources: '来源',
  },
};

/** /learn index text in every language (the translated indexes list that language's articles). */
export const LEARN_PATHS = { en: '/learn', ko: '/ko/learn', ja: '/ja/learn', zh: '/zh/learn' } as const;

export const LEARN_TEXT: Record<Lang, { metaTitle: string; metaDescription: string; eyebrow: string; h1: string; lede: string; byline: string }> = {
  en: {
    metaTitle: 'Learn About North Korea: Freedom, Escape, Prison Camps',
    metaDescription:
      'Straight answers about North Korea: how it could be freed, whether that is possible, how people escape, the prison camps, and how information gets in.',
    eyebrow: 'Learn',
    h1: 'Straight answers about North Korea',
    lede: 'Short, sourced explainers on the questions people actually search for. Each one ends with something you can do.',
    byline: `Written by ${AUTHOR_NAME}.`,
  },
  ko: {
    metaTitle: '북한 해설: 자유, 탈북, 정치범수용소',
    metaDescription: '북한에 대한 솔직한 답: 북한이 어떻게 자유로워질 수 있는지, 그게 가능한지, 사람들이 어떻게 탈출하는지, 정치범수용소, 그리고 정보가 어떻게 들어가는지.',
    eyebrow: '해설',
    h1: '북한에 대한 솔직한 답',
    lede: '사람들이 실제로 검색하는 질문에 짧게, 출처를 달아 답한 해설입니다. 글마다 끝에 지금 할 수 있는 일이 있습니다.',
    byline: `글: ${AUTHOR_NAME}.`,
  },
  ja: {
    metaTitle: '北朝鮮の解説：自由、脱北、政治犯収容所',
    metaDescription: '北朝鮮についての率直な答え。どうすれば自由になれるのか、それは可能なのか、人々はどう脱出するのか、政治犯収容所、そして情報はどう届くのか。',
    eyebrow: '解説',
    h1: '北朝鮮についての率直な答え',
    lede: '人々が実際に検索する質問に、短く出典つきで答える解説です。どの記事も最後に、あなたにできることを載せています。',
    byline: `文：${AUTHOR_NAME}`,
  },
  zh: {
    metaTitle: '朝鲜解读：自由、出逃、政治犯收容所',
    metaDescription: '关于朝鲜的直接回答：朝鲜怎样才能获得自由，这是否可能，人们如何逃离，政治犯收容所，以及信息如何进入朝鲜。',
    eyebrow: '解读',
    h1: '关于朝鲜的直接回答',
    lede: '针对人们真正会搜索的问题，写成简短、有出处的解读。每篇结尾都有你可以做的事。',
    byline: `作者：${AUTHOR_NAME}`,
  },
};
