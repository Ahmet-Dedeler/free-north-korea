/**
 * Text for /library, /ko/library, /ja/library and /zh/library.
 * Item notes and caveats are keyed by shelf id, then the English title in library.ts.
 * English shelf titles and item notes stay in library.ts. This file holds the page chrome in all four
 * languages, and the Korean, Japanese and Chinese shelf text, notes and caveats.
 */
import { SHELVES, type Item, type ShelfId } from '@/content/library';
import type { Lang } from '@/site/seo';

export const LIBRARY_PATHS = { en: '/library', ko: '/ko/library', ja: '/ja/library', zh: '/zh/library' } as const;

export interface ItemCopy {
  note: string;
  caveat?: string;
  /** Standard published title in this language. The English title stays on the card beside it. */
  localTitle?: string;
}

type ShelfCopy = { title: string; intro: string };

export interface LibraryText {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  shelvesLabel: string;
  disputed: string;
  coverOf: (title: string) => string;
  posterOf: (title: string) => string;
}

export const LIBRARY_TEXT: Record<Lang, LibraryText> = {
  en: {
    metaTitle: 'Best Books, Documentaries and Sources on North Korea',
    metaDescription:
      'The best books and documentaries on North Korea: escapee memoirs, journalism, UN reports, primary sources from the regime itself, and open data for researchers.',
    eyebrow: 'Library',
    h1: 'What to read and watch',
    lede: 'Memoirs by people who escaped, journalism that explains the system, the reports everyone cites, the regime\u2019s own publications, and the datasets behind this site.',
    shelvesLabel: 'Shelves',
    disputed: 'Disputed details',
    coverOf: (title) => `Cover of ${title}`,
    posterOf: (title) => `Poster of ${title}`,
  },
  ko: {
    metaTitle: '북한에 관한 책, 다큐멘터리, 자료',
    metaDescription:
      '북한에 관한 책과 다큐멘터리. 탈북민 회고록, 체제를 설명하는 취재, 유엔 보고서, 북한 당국이 낸 자료, 연구자를 위한 공개 데이터.',
    eyebrow: '도서관',
    h1: '읽을 것과 볼 것',
    lede: '탈북한 사람들의 회고록, 체제를 설명하는 취재, 글마다 인용되는 보고서, 북한 당국이 낸 출판물, 그리고 이 사이트의 바탕이 된 데이터입니다.',
    shelvesLabel: '서가',
    disputed: '이견 있음',
    coverOf: (title) => `${title} 표지`,
    posterOf: (title) => `${title} 포스터`,
  },
  ja: {
    metaTitle: '北朝鮮についての本、ドキュメンタリー、資料',
    metaDescription:
      '北朝鮮についての本とドキュメンタリー。脱北者の回想録、体制を説明する取材、国連の報告書、体制自身の一次資料、研究者向けの公開データ。',
    eyebrow: '図書館',
    h1: '何を読み、何を見るか',
    lede: '脱出した人たちの回想録、体制の仕組みを説明する取材、よく引用される報告書、北朝鮮自身の出版物、そしてこのサイトの基になっているデータです。',
    shelvesLabel: '棚',
    disputed: '異論あり',
    coverOf: (title) => `${title}の表紙`,
    posterOf: (title) => `${title}のポスター`,
  },
  zh: {
    metaTitle: '关于朝鲜的书、纪录片和资料',
    metaDescription:
      '关于朝鲜的书和纪录片：脱北者回忆录、解释体制的报道、联合国报告、政权自己的原始资料，以及给研究者的公开数据。',
    eyebrow: '书库',
    h1: '读什么，看什么',
    lede: '逃出来的人写的回忆录，解释这套体制的报道，文章里经常引用的报告，朝鲜政权自己的出版物，以及本站所用的数据集。',
    shelvesLabel: '书架',
    disputed: '有争议',
    coverOf: (title) => `${title}封面`,
    posterOf: (title) => `${title}海报`,
  },
};

const SHELF_COPY: Record<Exclude<Lang, 'en'>, Record<ShelfId, ShelfCopy>> = {
  ko: {
    memoir: { title: '탈북민 회고록', intro: '당사자의 기록입니다. 여기서부터 읽으면 됩니다.' },
    nonfiction: { title: '나라를 이해하기', intro: '북한이 실제로 어떻게 움직이는지 설명하는 취재와 분석입니다.' },
    film: { title: '다큐멘터리', intro: '하나만 본다면 Beyond Utopia를 보시면 됩니다.' },
    report: { title: '주요 보고서', intro: '대부분의 글이 인용하는 1차 자료입니다.' },
    regime: {
      title: '북한 당국의 자료',
      intro: '북한이 낸 1차 자료입니다. 선전을 이해하기 위해 읽으십시오. 사실로 받아들이지는 마십시오.',
    },
    data: { title: '데이터와 OSINT 도구', intro: '이 자료를 바탕으로 작업하려는 연구자와 개발자를 위한 목록입니다.' },
  },
  ja: {
    memoir: { title: '脱北者の回想録', intro: '当事者の記録です。まずはここから読んでください。' },
    nonfiction: { title: '国を理解する', intro: '北朝鮮が実際にどう動いているかを説明する取材と分析です。' },
    film: { title: 'ドキュメンタリー', intro: '一本だけ見るなら Beyond Utopia です。' },
    report: { title: '主要な報告書', intro: '多くの記事が引用する一次資料です。' },
    regime: {
      title: '体制自身の資料',
      intro: '北朝鮮が刊行した一次資料です。プロパガンダを理解するために読んでください。信じ込むためではありません。',
    },
    data: { title: 'データとOSINTツール', intro: 'この上に何かを作りたい研究者と開発者向けです。' },
  },
  zh: {
    memoir: { title: '脱北者回忆录', intro: '当事人的记述。从这里读起。' },
    nonfiction: { title: '理解这个国家', intro: '解释朝鲜实际上如何运转的报道和分析。' },
    film: { title: '纪录片', intro: '如果只看一部，看 Beyond Utopia。' },
    report: { title: '主要报告', intro: '大多数文章引用的原始文件。' },
    regime: {
      title: '政权自己的出版物',
      intro: '朝鲜出版的原始资料。读它们是为了看懂宣传，不是为了把它们当真。',
    },
    data: { title: '数据与开源情报工具', intro: '给想在此基础上继续做的研究者和开发者。' },
  },
};

const ITEM_COPY: Record<Exclude<Lang, 'en'>, Record<ShelfId, Record<string, ItemCopy>>> = {
  ko: {
    memoir: {
      'The Aquariums of Pyongyang': {
        localTitle: '평양의 수족관',
        note: '9살에 가족 전체와 함께 요덕 정치범수용소에 보내졌습니다. 많은 독자에게 수용소를 처음 알린 책입니다.',
      },
      'The Girl with Seven Names': {
        note: '17살에 나와 중국에서 10년 동안 가짜 신분으로 살다가, 가족을 데려오려고 국경으로 다시 갔습니다.',
      },
      'Escape from Camp 14': {
        localTitle: '14호 수용소 탈출',
        note: '신동혁이 정치범수용소 안에서 태어났다고 말한 기록입니다.',
        caveat: '신동혁은 2015년에 이야기 일부를 수정했습니다. 핵심 내용은 다른 증언과 맞습니다.',
      },
      'In Order to Live': {
        note: '13살에 중국을 거쳐 탈출했습니다. 인신매매를 겪었고, 고비 사막을 건너 몽골로 갔습니다.',
        caveat: '일부 세부 내용에 대해 기자와 다른 탈북민이 의문을 제기했습니다.',
      },
      'A River in Darkness': {
        note: '한쪽이 일본인인 남성입니다. 1960년 귀국 사업으로 가족이 북한에 이주했고, 36년을 그곳에서 보냈습니다.',
      },
      'Every Falling Star': {
        note: '평양에서의 어린 시절에서, 기근 때 거리의 패거리로 사는 삶까지를 다룹니다.',
      },
      'Dear Leader': {
        note: '체제 선전 기구에서 일했던 전직 계관시인입니다. 엘리트 내부에서 본 드문 기록입니다.',
      },
      'The Tears of My Soul': {
        note: '1987년 대한항공 858편 폭파를 실행한 전직 북한 정보요원의 기록입니다. 엘리트 선발, 간첩 훈련, 귀순을 다룹니다.',
      },
      'A Thousand Miles to Freedom': {
        note: '기근 때 어머니와 함께 탈출해, 중국 곳곳에 숨어 9년을 버틴 뒤 고비 사막을 거쳐 한국에 도착했습니다.',
      },
      'Under the Same Sky': {
        note: '1990년대 기근 때 고아가 된 꽃제비입니다. 음식을 찾아 헤매고 탄광에서 일하며 살아남다가, LiNK를 통해 미국으로 탈출했습니다.',
      },
      'This Is Paradise! My North Korean Childhood': {
        note: '기근 때 중국 국경 온성군에서의 어린 시절입니다. 공개 처형과 마을 생활을 저자가 직접 그린 그림이 실려 있습니다.',
      },
      'Stars Between the Sun and Moon': {
        note: '가정 폭력, 중국에서의 인신매매, 북한 노동 수용소로의 강제 송환, 그리고 다시 탈출한 일을 견딘 기록입니다.',
      },
      'The Hard Road Out: One Woman\u2019s Escape from North Korea': {
        note: '중국 농촌에서 강제 결혼으로 팔려 갔고, 청진의 강제 노동 수용소로 송환되었다가 살아남아, 다시 탈출해 영국에서 인권 활동가가 되었습니다.',
      },
      'Eyes of the Tailless Animals: Prison Memoirs of a North Korean Woman': {
        note: '국가 배급 업무를 감독하던 사람이 개천 1호 교화소에서 6년을 복역했습니다. 일반 교화소에 대한 가장 이른 증언 가운데 하나입니다.',
        caveat: '구체적인 고문 주장 일부는 이후 탈북민의 설명과 다릅니다. 수용소의 전반적인 실태는 일치합니다.',
      },
      'Long Road Home: Testimony of a North Korean Camp Survivor': {
        note: '인민보안성의 전직 중령입니다. 아버지의 과거가 드러난 뒤 14호와 18호 관리소에 보내졌고, 두 곳 모두에서 탈출한 것으로 알려진 유일한 생존자입니다.',
      },
    },
    nonfiction: {
      'Nothing to Envy': {
        note: '1990년대 기근을 통과한 청진 사람 여섯의 이야기입니다. 평범한 삶을 다룬 책 가운데 가장 낫습니다.',
      },
      'The Real North Korea': {
        note: '정권이 왜 유지되는지, 어떻게 바뀔 수 있는지를 다룹니다. 란코프는 1980년대에 평양에서 유학했습니다.',
      },
      'North Korea Confidential': {
        note: '시장, 밀수, 패션, 마약, 미디어. 사람들이 실제로 어떻게 살아가는지입니다.',
      },
      'The Great Successor': { note: '김정은의 전기입니다.' },
      'The Cleanest Race': {
        note: '체제의 실제 이념은 공산주의가 아니라 인종에 기초한 민족주의라고 주장합니다. 선전을 어떻게 읽는지가 달라집니다.',
      },
      'Without You, There Is No Us': {
        note: '평양의 한 대학에서 엘리트의 아들들을 가르치는 교사로, 신분을 숨기고 들어갔습니다.',
      },
      'The Accusation': {
        localTitle: '고발',
        note: '아직 북한에 사는 작가가 써서 밖으로 몰래 내보낸 단편집입니다. 소설이지만, 이런 글은 드뭅니다.',
      },
      'The Impossible State': { note: '전직 백악관 북한 보좌관의 정책 쪽 시각입니다.' },
      'Under the Loving Care of the Fatherly Leader': {
        note: '40년의 취재와 탈북민 수백 명 인터뷰에 기초한, 김씨 일가에 대한 방대한 800쪽 역사서입니다.',
      },
      'North of the DMZ: Essays on Daily Life in North Korea': {
        note: '여행증, 가택 수색, 밀수된 라디오, 패션, 식량 배급처럼 일상의 사회 현실을 짧고 구체적으로 쓴 글입니다.',
      },
      'The Sister: The extraordinary story of Kim Yo Jong': {
        note: '김정은의 여동생이자 사실상의 부지도자인 김여정의 전기와 정치 분석입니다.',
      },
      'The Invitation-Only Zone': {
        note: '1970년대와 1980년대에 북한 당국이 일본 해안에서 일본인을 납치해 간첩 훈련에 쓴 일을 조사한 책입니다.',
      },
      'Escape from North Korea: The Untold Story of Asia\u2019s Underground Railroad': {
        note: '기독교 선교사, 브로커, 은신처가 탈북민을 중국과 동남아시아를 가로지르는 3,000마일 경로로 안내하는 네트워크입니다.',
      },
      'The Lazarus Heist': {
        note: '북한 정찰총국의 사이버 부대가 2014년 소니 해킹에서 수십억 달러 규모의 암호화폐 탈취와 중앙은행 해킹으로 커진 과정입니다.',
      },
      'North Korea: State of Paranoia': {
        note: '정치경제, 군사 교리, 그리고 냉전 이후 정권이 살아남으려고 어떻게 적응했는지를 넓게 다룹니다.',
      },
      'North Korea: Markets and Military Rule': {
        note: '배급제가 무너지면서 북한 사회 아래에서부터 시장화가 어떻게 퍼졌는지에 대한 경제 분석입니다.',
      },
    },
    film: {
      'Beyond Utopia': { note: '중국, 베트남, 라오스, 태국을 거치는 실제 탈출을, 일어나는 동안 촬영했습니다.' },
      'Under the Sun': {
        note: '당국이 허가한, 평양 한 가족을 다룬 다큐멘터리입니다. 정권이 장면을 연출한 과정이 그대로 남아 있습니다.',
      },
      'The Mole: Undercover in North Korea': {
        note: '덴마크인 요리사가 친북 친선 단체에 잠입하다가 무기 거래에까지 들어가게 됩니다.',
      },
      'The Lovers and the Despot': { note: '김정일이 영화를 만들게 하려고 한국의 감독과 여배우를 납치한 일입니다.' },
      'Crossing the Line': { note: '1962년 북한으로 귀순해 수십 년을 산 미군 병사의 이야기입니다.' },
      'Camp 14: Total Control Zone': {
        note: '신동혁의 증언과 함께, 전직 수용소 경비원과 보안 기관 관계자의 드문 인터뷰가 나옵니다.',
      },
      'Shadow Flowers': {
        note: '뜻하지 않게 한국에 들어온 평양 주민 김련희가, 집으로 돌아가려고 10년 동안 활동한 과정을 따라갑니다.',
      },
      'Children of the Secret State': {
        note: '1990년대 기근 때 굶주리는 거리의 아이들을 몰래 찍은 영상입니다. 이 위기가 국제적으로 처음 인정받게 만든 기록입니다.',
      },
      'A State of Mind': {
        note: '아리랑 집단체조에 나가기 위해 몇 달 동안 훈련하는 평양의 여학생 둘을 따라가며, 수도의 일상을 보여 줍니다.',
      },
      'Seoul Train': {
        note: '중국을 가로지르는 비밀 경로와, 중국 당국에 붙잡히면 강제 송환되는 위험을 기록합니다.',
      },
      'I Am Sun Mu': {
        note: '북한 국가 선전 화가였던 사람이 서울로 탈북한 뒤 체제에 맞서는 그림을 그리고, 베이징에서 신분을 숨긴 전시를 엽니다.',
      },
      'Secret State of North Korea': {
        note: '북한 안에서 몰래 반출한 영상입니다. 불법 DVD, 휴대전화, 암시장 거래, 국가 통제에 대한 조용한 반발이 나옵니다.',
      },
    },
    report: {
      'Report of the UN Commission of Inquiry on Human Rights in the DPRK': {
        note: '인도에 반하는 죄가 "현대 세계에 유례가 없다"고 결론 내렸습니다. 지금도 기준이 되는 보고서입니다.',
      },
      'UN OHCHR report on the decade since the Commission of Inquiry': {
        note: '인터뷰가 300건을 넘습니다. 2014년 이후 감시, 강제 노동, 처형이 늘었다고 결론 내렸습니다.',
      },
      'The Hidden Gulag (2nd ed.)': { note: '수용소마다 위성사진과 증언을 붙였습니다.' },
      'World Report 2026: North Korea': { note: '한 해 동안 무엇이 바뀌었는지 짧게 정리한 글입니다.' },
      'SIPRI Yearbook 2026: World nuclear forces': {
        note: '북한 탄두(약 60기)와 핵분열 물질에 대한 현재 추정치입니다.',
      },
      'Parallel Gulag: North Korea\u2019s "An-jeon-bu" Police Detention Facilities': {
        note: '위성사진과 탈북민 증언으로, 전국의 일반 경찰 구류 시설과 노동단련대를 지도로 만들었습니다.',
      },
      'White Paper on Human Rights in North Korea': {
        note: '한국의 국책 연구기관이 최근 탈북민 심층 면접 수백 건을 바탕으로 매년 내는 종합 보고서입니다.',
      },
      'Denied from the Start: Human Rights Violations Against Women': {
        note: '국가 구금 시설에서의 성별에 따른 학대, 강제 노동, 성폭력을 증거와 함께 상세히 기록했습니다.',
      },
      'Captured on Camera: North Korea\u2019s Controlled Border Infrastructure': {
        note: '위성사진으로, 2020년 이후 새로 세운 500km가 넘는 이중 울타리, 초소, 발견 즉시 사살 명령이 탈출로를 어떻게 막았는지 보여 줍니다.',
      },
      'Final Report of the UN Panel of Experts on DPRK Sanctions': {
        note: '러시아의 거부권으로 임무가 끝나기 전, 제재 회피, 해상 선박 간 환적, 무기 거래를 조사한 마지막 보고서입니다.',
      },
      'North Korea\u2019s Digital Gulag: Surveillance and the Technology of Repression': {
        note: '외부 정보를 막기 위해 쓰이는 스마트폰 워터마크, 소프트웨어 통제, 자동 파일 검사에 대한 기술 분석입니다.',
      },
    },
    regime: {
      'KCNA Watch': {
        note: '북한 서버에 접속하지 않고 조선중앙통신, 로동신문과 다른 관영 매체를 검색할 수 있는 아카이브입니다.',
      },
      'Foreign Languages Publishing House books': {
        note: '영어로 된 선전 서적, 지도자 전기, 주체 문헌의 스캔본입니다.',
      },
      'North Korea Collection': { note: '북한 서적과 잡지 수천 점과 그 목록 기록입니다.' },
      'North Korea in the World': { note: '북한의 무역, 외교, 대외 관계 데이터입니다.' },
    },
    data: {
      'DPRK Digital Atlas': { note: '정치, 경제, 안보 시설의 지리 데이터입니다.' },
      'North Korean Prison Database': { note: '탈북민 증언으로 모은 구금 시설과 사건입니다.' },
      'OCCRP Aleph': { note: '유출 문서와 기록을 검색할 수 있습니다. 제재 회피 회사 연결망도 포함합니다.' },
      'OSINT Tools: North Korea': { note: '지도, 데이터셋, 도구를 모아 둔 목록입니다.' },
      'CNS North Korea Missile Test Database': { note: '이 사이트의 미사일 발사 지도에 쓰인 데이터입니다.' },
      'nk-missile-tests': {
        note: '이 사이트의 미사일 지도가 바탕으로 삼은 원래 오픈소스 시각화입니다. 새 발사가 있으면 갱신됩니다.',
      },
      'NK Pro': {
        note: '상업 위성사진 분석, 항공 추적, 무역 선박 데이터, 지도부 이동 기록을 제공하는 정보 서비스입니다.',
      },
      'Daily NK Market Prices': {
        note: '북한 시장 안의 익명 연락책으로 모은, 2주마다 갱신되는 물가와 환율입니다.',
      },
      'KPA Journal': {
        note: '조선인민군, 해안포, 특수작전 사령부, 갱도 포진지에 대한 전문 연구 자료입니다.',
      },
    },
  },
  ja: {
    memoir: {
      'The Aquariums of Pyongyang': {
        localTitle: '平壌の水槽',
        note: '9歳で家族全員とともに耀徳の政治犯収容所へ送られました。多くの読者にとって、収容所を知るきっかけになった本です。',
      },
      'The Girl with Seven Names': {
        note: '17歳で出国し、中国で10年間、偽の身分で暮らしたあと、家族を連れ出すために国境へ戻りました。',
      },
      'Escape from Camp 14': {
        localTitle: '北朝鮮 14号管理所からの脱出',
        note: '申東赫が政治犯収容所の中で生まれたと語った記録です。',
        caveat: '申東赫は2015年に話の一部を修正しました。中心となる内容は、他の証言と一致します。',
      },
      'In Order to Live': {
        note: '13歳で中国を経由して脱出しました。人身売買に遭い、ゴビ砂漠を越えてモンゴルへ渡りました。',
        caveat: '一部の細部については、記者や他の脱北者が疑問を呈しています。',
      },
      'A River in Darkness': {
        note: '片方の親が日本人です。1960年の帰国事業で家族が北朝鮮へ移り、36年間そこで暮らしました。',
      },
      'Every Falling Star': {
        note: '平壌での子ども時代から、飢饉のときに街頭のグループで暮らすまでを描いています。',
      },
      'Dear Leader': {
        note: '体制の宣伝機関で働いていた元桂冠詩人です。エリートの内側から見た、まれな記録です。',
      },
      'The Tears of My Soul': {
        note: '1987年の大韓航空機858便爆破を実行した、元北朝鮮情報工作員の記録です。エリートの選抜、スパイ訓練、亡命を扱います。',
      },
      'A Thousand Miles to Freedom': {
        note: '飢饉のときに母親と脱出し、中国各地に隠れて9年間生き延びたあと、ゴビ砂漠を経て韓国に着きました。',
      },
      'Under the Same Sky': {
        note: '1990年代の飢饉で孤児になったコッチェビです。残飯をあさり、炭鉱で働きながら生き延び、LiNKを通じて米国へ脱出しました。',
      },
      'This Is Paradise! My North Korean Childhood': {
        note: '飢饉のとき、中国国境の穏城郡で過ごした子ども時代です。公開処刑と村の暮らしを、著者自身が描いた絵が載っています。',
      },
      'Stars Between the Sun and Moon': {
        note: '家庭内暴力、中国での人身売買、北朝鮮の労働収容所への強制送還、そして再びの脱出を生き延びた記録です。',
      },
      'The Hard Road Out: One Woman\u2019s Escape from North Korea': {
        note: '中国の農村で強制結婚に売られ、清津の強制労働収容所へ送還されたあと生き延び、再び脱出して英国で人権活動家になりました。',
      },
      'Eyes of the Tailless Animals: Prison Memoirs of a North Korean Woman': {
        note: '国の配給を監督していた人が、价川の教化所第1号で6年間服役しました。一般の教化所についての、最も早い証言の一つです。',
        caveat: '具体的な拷問の記述の一部は、その後の脱北者の説明と異なります。収容所の全般的な状況は一致します。',
      },
      'Long Road Home: Testimony of a North Korean Camp Survivor': {
        note: '人民保安省の元中佐です。父の過去が明らかになったあと14号と18号の管理所へ送られ、両方から脱出したことが知られている唯一の生存者です。',
      },
    },
    nonfiction: {
      'Nothing to Envy': {
        note: '1990年代の飢饉を生きた清津の6人の話です。普通の暮らしを描いた本のなかで、最も優れています。',
      },
      'The Real North Korea': {
        note: '体制がなぜ存続し、どう変わりうるかを扱います。ランコフは1980年代に平壌で留学していました。',
      },
      'North Korea Confidential': {
        note: '市場、密輸、ファッション、麻薬、メディア。人々が実際にどう暮らしているかです。',
      },
      'The Great Successor': { note: '金正恩の伝記です。' },
      'The Cleanest Race': {
        note: '体制の本当のイデオロギーは共産主義ではなく、人種にもとづく民族主義だと論じます。宣伝の読み方が変わります。',
      },
      'Without You, There Is No Us': {
        note: '平壌の大学で、エリートの息子たちを教える教師として身分を隠して入りました。',
      },
      'The Accusation': {
        localTitle: '告発',
        note: '今も北朝鮮に住む作家が書き、外へ持ち出された短編集です。小説ですが、こうした文章はまれです。',
      },
      'The Impossible State': { note: '元ホワイトハウスの北朝鮮担当補佐官による、政策からの見方です。' },
      'Under the Loving Care of the Fatherly Leader': {
        note: '40年の取材と数百人の脱北者へのインタビューにもとづく、金一族の800ページに及ぶ歴史です。',
      },
      'North of the DMZ: Essays on Daily Life in North Korea': {
        note: '旅行証、家宅捜索、密輸されたラジオ、ファッション、食糧配給など、日常の社会の実態を短く具体的に書いた文章です。',
      },
      'The Sister: The extraordinary story of Kim Yo Jong': {
        note: '金正恩の妹で、事実上の副指導者である金与正の伝記と政治分析です。',
      },
      'The Invitation-Only Zone': {
        note: '1970年代と1980年代に、北朝鮮が日本の海岸で日本人を拉致し、スパイの訓練に使った事件の調査です。',
      },
      'Escape from North Korea: The Untold Story of Asia\u2019s Underground Railroad': {
        note: 'キリスト教徒の宣教師、ブローカー、隠れ家が、中国と東南アジアを横切る3,000マイルの経路で脱北者を案内するネットワークです。',
      },
      'The Lazarus Heist': {
        note: '北朝鮮の偵察総局のサイバー部隊が、2014年のソニーへのハッキングから、数十億ドル規模の暗号資産と中央銀行への窃盗へと広がった経緯です。',
      },
      'North Korea: State of Paranoia': {
        note: '政治経済、軍事ドクトリン、そして冷戦後に体制が生き残るためにどう適応したかを広く扱います。',
      },
      'North Korea: Markets and Military Rule': {
        note: '配給制度が崩れたことで、北朝鮮社会の下から市場化がどう広がったかの経済分析です。',
      },
    },
    film: {
      'Beyond Utopia': { note: '中国、ベトナム、ラオス、タイを通る実際の脱出を、起きているあいだに撮影しています。' },
      'Under the Sun': {
        note: '当局の許可を受けた、平壌のある家族についてのドキュメンタリーです。体制が場面を演出した過程が残っています。',
      },
      'The Mole: Undercover in North Korea': {
        note: 'デンマーク人の料理人が体制寄りの友好団体に潜入し、武器取引にまで関わります。',
      },
      'The Lovers and the Despot': { note: '金正日が映画を作らせるために、韓国の監督と女優を拉致した話です。' },
      'Crossing the Line': { note: '1962年に北朝鮮へ亡命し、数十年暮らした米兵の話です。' },
      'Camp 14: Total Control Zone': {
        note: '申東赫の証言とともに、元収容所看守と保安機関の職員への、まれなインタビューが出てきます。',
      },
      'Shadow Flowers': {
        note: '意図せず韓国に着いた平壌の主婦、キム・リョンヒが、家に戻るために10年間活動した過程を追います。',
      },
      'Children of the Secret State': {
        note: '1990年代の飢饉で飢えていた路上の子どもたちを隠し撮りした映像です。この危機を国際社会が認めざるを得なくした、最初の記録です。',
      },
      'A State of Mind': {
        note: 'アリラン大衆体操に出るため数か月訓練する、平壌の女子生徒2人を追い、首都の日常を見せます。',
      },
      'Seoul Train': {
        note: '中国を横切る地下の経路と、中国当局に捕まると強制送還される危険を記録しています。',
      },
      'I Am Sun Mu': {
        note: '北朝鮮の国家宣伝画家だった人がソウルへ脱北し、体制に逆らう絵を描き、北京で身分を隠した展示を開きます。',
      },
      'Secret State of North Korea': {
        note: '北朝鮮の内部から持ち出された映像です。違法なDVD、携帯電話、闇市場の取引、国家の統制への静かな抵抗が映っています。',
      },
    },
    report: {
      'Report of the UN Commission of Inquiry on Human Rights in the DPRK': {
        note: '人道に対する罪は「現代世界に類例がない」と認定しました。今も基準になる報告書です。',
      },
      'UN OHCHR report on the decade since the Commission of Inquiry': {
        note: 'インタビューは300件を超えます。2014年以降、監視、強制労働、処刑が増えたと結論づけました。',
      },
      'The Hidden Gulag (2nd ed.)': { note: '収容所ごとに、衛星画像と証言を付けています。' },
      'World Report 2026: North Korea': { note: '1年で何が変わったかの短いまとめです。' },
      'SIPRI Yearbook 2026: World nuclear forces': {
        note: '北朝鮮の核弾頭（約60発）と核分裂性物質の、現在の推計です。',
      },
      'Parallel Gulag: North Korea\u2019s "An-jeon-bu" Police Detention Facilities': {
        note: '衛星画像と脱北者の証言で、全国の一般の警察留置施設と労働鍛錬隊を地図にしています。',
      },
      'White Paper on Human Rights in North Korea': {
        note: '韓国の国策研究機関が、最近の脱北者への詳細な聞き取り数百件をもとに毎年出す総合報告書です。',
      },
      'Denied from the Start: Human Rights Violations Against Women': {
        note: '国家の拘禁施設における、ジェンダーに基づく虐待、強制労働、性暴力を、証拠とともに詳しく記録しています。',
      },
      'Captured on Camera: North Korea\u2019s Controlled Border Infrastructure': {
        note: '衛星画像で、2020年以降に新設された500kmを超える二重の塀、監視所、発見次第射殺するという命令が、脱出経路をどう塞いだかを示しています。',
      },
      'Final Report of the UN Panel of Experts on DPRK Sanctions': {
        note: 'ロシアの拒否権で任務が終わる前の、制裁逃れ、海上での船舶間の積み替え、武器取引を調べた最後の報告書です。',
      },
      'North Korea\u2019s Digital Gulag: Surveillance and the Technology of Repression': {
        note: '外部の情報を止めるために使われる、スマートフォンの透かし、ソフトウェアの制御、ファイルの自動検査についての技術分析です。',
      },
    },
    regime: {
      'KCNA Watch': {
        note: '北朝鮮のサーバーに接続せずに、朝鮮中央通信、労働新聞と他の国営メディアを検索できるアーカイブです。',
      },
      'Foreign Languages Publishing House books': {
        note: '英語の宣伝書籍、指導者の伝記、主体の文献のスキャンです。',
      },
      'North Korea Collection': { note: '北朝鮮の書籍と雑誌が数千点あり、目録の記録も付いています。' },
      'North Korea in the World': { note: '北朝鮮の貿易、外交、対外関係のデータです。' },
    },
    data: {
      'DPRK Digital Atlas': { note: '政治、経済、安全保障の施設の地理データです。' },
      'North Korean Prison Database': { note: '脱北者の証言から集めた拘禁施設と事例です。' },
      'OCCRP Aleph': {
        note: '流出文書と記録を検索できます。制裁逃れに使われた企業のネットワークも含みます。',
      },
      'OSINT Tools: North Korea': { note: '地図、データセット、ツールを集めた一覧です。' },
      'CNS North Korea Missile Test Database': { note: 'このサイトのミサイル発射地図の基になっているデータです。' },
      'nk-missile-tests': {
        note: 'このサイトのミサイル地図がもとづく、元のオープンソースの可視化です。新しい発射があると更新されます。',
      },
      'NK Pro': {
        note: '商用衛星画像の分析、航空の追跡、貿易船舶のデータ、指導部の移動記録を提供する情報サービスです。',
      },
      'Daily NK Market Prices': {
        note: '北朝鮮の市場にいる匿名の連絡先から集めた、2週間ごとの物価と為替です。',
      },
      'KPA Journal': {
        note: '朝鮮人民軍、海岸砲、特殊作戦司令部、堅固な砲兵陣地についての専門的な研究資料です。',
      },
    },
  },
  zh: {
    memoir: {
      'The Aquariums of Pyongyang': {
        localTitle: '平壤的水族馆',
        note: '9岁时和全家一起被送进耀德政治犯收容所。对很多读者来说，是这本书让他们知道了收容所。',
      },
      'The Girl with Seven Names': {
        note: '17岁离开，在中国以假身份生活了10年，然后回到边境把家人带出来。',
      },
      'Escape from Camp 14': {
        localTitle: '逃出14号劳改营',
        note: '申东赫讲述自己出生在政治犯收容所里的记述。',
        caveat: '申东赫在2015年修改了叙述中的一部分。核心内容与其他证词相符。',
      },
      'In Order to Live': {
        note: '13岁经中国逃出，遭遇人口贩卖，并穿过戈壁沙漠进入蒙古。',
        caveat: '部分细节曾被记者和其他脱北者质疑。',
      },
      'A River in Darkness': {
        note: '父母一方是日本人。1960年全家经归国事业迁到朝鲜，在那里生活了36年。',
      },
      'Every Falling Star': { note: '从平壤的童年，写到饥荒期间在街头团伙里的生活。' },
      'Dear Leader': { note: '曾在政权宣传机构里担任桂冠诗人。很少见的、从精英内部看出去的记录。' },
      'The Tears of My Soul': {
        note: '1987年大韩航空858号班机爆炸案的实施者、前朝鲜情报人员的记述。写到精英选拔、间谍训练和叛逃。',
      },
      'A Thousand Miles to Freedom': {
        note: '饥荒期间和母亲一起逃出，在中国各地躲藏九年，之后穿过戈壁沙漠到达韩国。',
      },
      'Under the Same Sky': {
        note: '1990年代饥荒中成为孤儿的花燕子（kotjebi）。靠捡拾和挖煤活下来，后经LiNK逃到美国。',
      },
      'This Is Paradise! My North Korean Childhood': {
        note: '饥荒期间在中国边境稳城郡的童年，配有作者自己画的公开处决和乡村生活。',
      },
      'Stars Between the Sun and Moon': {
        note: '挨过家暴、在中国遭人口贩卖、被强制遣返到朝鲜劳动营，然后再次逃出。',
      },
      'The Hard Road Out: One Woman\u2019s Escape from North Korea': {
        note: '被卖到中国农村强迫结婚，被遣返回清津的强迫劳动营，活了下来，再次逃出后在英国成为人权活动者。',
      },
      'Eyes of the Tailless Animals: Prison Memoirs of a North Korean Woman': {
        note: '曾负责监督国家配给的人，在价川第1教化所服刑六年。是关于普通教化所的最早证词之一。',
        caveat: '部分具体的酷刑说法与后来脱北者的描述不同，但收容所的总体状况相符。',
      },
      'Long Road Home: Testimony of a North Korean Camp Survivor': {
        note: '人民保安省前中校。父亲的过去被查出后被送进14号和18号收容所，是已知唯一从两处都逃出的幸存者。',
      },
    },
    nonfiction: {
      'Nothing to Envy': { note: '清津六个人如何度过1990年代饥荒。写普通人生活的书里，这一本最好。' },
      'The Real North Korea': { note: '政权为什么还能维持，又可能怎样变化。兰科夫1980年代曾在平壤留学。' },
      'North Korea Confidential': { note: '市场、走私、时装、毒品和媒体。人们实际上怎样过日子。' },
      'The Great Successor': { note: '金正恩的传记。' },
      'The Cleanest Race': {
        note: '认为政权真正的意识形态是基于种族的民族主义，而不是共产主义。读宣传的方式会因此改变。',
      },
      'Without You, There Is No Us': { note: '隐瞒身份，在平壤一所大学里给精英的儿子当老师。' },
      'The Accusation': {
        localTitle: '告发',
        note: '仍住在朝鲜境内的作家写的短篇集，被偷偷带出。是小说，但很少见。',
      },
      'The Impossible State': { note: '一位前白宫朝鲜事务顾问从政策角度写的看法。' },
      'Under the Loving Care of the Fatherly Leader': {
        note: '根据四十年报道和数百次脱北者访谈写成的金氏家族史，长达800页。',
      },
      'North of the DMZ: Essays on Daily Life in North Korea': {
        note: '关于旅行证、抄家、走私收音机、时装和口粮的短文，写的是具体的日常生活。',
      },
      'The Sister: The extraordinary story of Kim Yo Jong': {
        note: '金正恩的妹妹、事实上的副领导人金与正的传记和政治分析。',
      },
      'The Invitation-Only Zone': {
        note: '调查1970年代和1980年代朝鲜从日本沿海海滩绑架日本公民、用来训练间谍的事件。',
      },
      'Escape from North Korea: The Untold Story of Asia\u2019s Underground Railroad': {
        note: '基督教传教士、中间人和安全屋组成的网络，引导脱北者走完穿越中国和东南亚的3,000英里路线。',
      },
      'The Lazarus Heist': {
        note: '朝鲜侦察总局的网络部队如何从2014年对索尼的网络攻击，发展到数十亿美元的加密货币盗窃和央行盗窃。',
      },
      'North Korea: State of Paranoia': {
        note: '全面概述政治经济、军事学说，以及政权在冷战后如何调整以求生存。',
      },
      'North Korea: Markets and Military Rule': {
        note: '详细的经济分析：配给制度崩溃后，市场化如何从朝鲜社会的底层向上蔓延。',
      },
    },
    film: {
      'Beyond Utopia': { note: '跟随一次真实的逃亡，途经中国、越南、老挝和泰国，拍摄于事件发生之时。' },
      'Under the Sun': { note: '一部经当局批准、关于平壤一个家庭的纪录片，政权布置场面的过程被留在片中。' },
      'The Mole: Undercover in North Korea': { note: '一名丹麦厨师潜入亲政权的友好团体，最后卷入军火交易。' },
      'The Lovers and the Despot': { note: '金正日绑架韩国导演和女演员，让他们为自己拍电影。' },
      'Crossing the Line': { note: '一名1962年叛逃到朝鲜、在那里生活了几十年的美国士兵。' },
      'Camp 14: Total Control Zone': { note: '有申东赫的证词，也有对前收容所看守和安全官员的少见采访。' },
      'Shadow Flowers': {
        note: '跟随金莲姬。她是平壤的家庭主妇，无意中到了韩国，然后用十年时间争取回家。',
      },
      'Children of the Secret State': {
        note: '1990年代饥荒期间偷拍的挨饿流浪儿童影像，是最早迫使国际社会承认这场危机的材料。',
      },
      'A State of Mind': {
        note: '跟随两名平壤女学生。她们为参加阿里郎团体操训练了数月。片子展示首都里的日常生活。',
      },
      'Seoul Train': { note: '记录穿越中国的秘密通道，以及被中国当局逮捕后强制遣返的严重风险。' },
      'I Am Sun Mu': {
        note: '一名前朝鲜国家宣传画家叛逃到首尔，创作挑战政权的政治艺术，并在北京办了一场隐瞒身份的展览。',
      },
      'Secret State of North Korea': {
        note: '从朝鲜境内偷运出来的影像：非法DVD、手机、黑市交易，以及对国家管控的安静抵制。',
      },
    },
    report: {
      'Report of the UN Commission of Inquiry on Human Rights in the DPRK': {
        note: '认定存在“当代世界绝无仅有”的危害人类罪。至今仍是基准报告。',
      },
      'UN OHCHR report on the decade since the Commission of Inquiry': {
        note: '访谈超过300次。结论是2014年以来监控、强迫劳动和处决都有增加。',
      },
      'The Hidden Gulag (2nd ed.)': { note: '逐个收容所，附有卫星图像和证词。' },
      'World Report 2026: North Korea': { note: '这一年发生了什么变化的简短摘要。' },
      'SIPRI Yearbook 2026: World nuclear forces': { note: '对朝鲜核弹头（约60枚）和裂变材料的当前估计。' },
      'Parallel Gulag: North Korea\u2019s "An-jeon-bu" Police Detention Facilities': {
        note: '用卫星图像和脱北者证词，标出全国的普通警察羁押场所和劳动锻炼队。',
      },
      'White Paper on Human Rights in North Korea': {
        note: '韩国的国家研究机构每年发布的综合报告，依据是近期数百次深入的脱北者访谈。',
      },
      'Denied from the Start: Human Rights Violations Against Women': {
        note: '对国家拘禁设施中基于性别的虐待、强迫劳动和性暴力所作的详细证据记录。',
      },
      'Captured on Camera: North Korea\u2019s Controlled Border Infrastructure': {
        note: '卫星图像记录2020年以来新建的500多公里双重围栏、岗哨和发现即射杀的命令如何堵死了逃亡路线。',
      },
      'Final Report of the UN Panel of Experts on DPRK Sanctions': {
        note: '在俄罗斯否决、任务结束之前，关于逃避制裁、海上船对船转运和军火交易的最后一份调查报告。',
      },
      'North Korea\u2019s Digital Gulag: Surveillance and the Technology of Repression': {
        note: '对用于阻断外部信息的手机水印、软件控制和自动文件检查的技术分析。',
      },
    },
    regime: {
      'KCNA Watch': { note: '可检索的朝鲜中央通讯社、劳动新闻和其他官媒档案，不必访问朝鲜的服务器。' },
      'Foreign Languages Publishing House books': { note: '英文宣传书籍、领导人传记和主体文献的扫描件。' },
      'North Korea Collection': { note: '数千种朝鲜书籍和期刊，并附有目录记录。' },
      'North Korea in the World': { note: '关于朝鲜贸易、外交和对外关系的数据。' },
    },
    data: {
      'DPRK Digital Atlas': { note: '政治、经济与安全设施的地理空间数据。' },
      'North Korean Prison Database': { note: '根据脱北者证词整理的拘禁设施和案例。' },
      'OCCRP Aleph': { note: '可检索的泄露文件和记录，包括逃避制裁的公司网络。' },
      'OSINT Tools: North Korea': { note: '整理过的地图、数据集和工具清单。' },
      'CNS North Korea Missile Test Database': { note: '本站导弹试射地图所用的数据。' },
      'nk-missile-tests': { note: '本站导弹地图所依据的原始开源可视化。有新的试射就会更新。' },
      'NK Pro': { note: '提供商业卫星图像分析、航空追踪、贸易船舶数据和领导人出行记录的情报服务。' },
      'Daily NK Market Prices': { note: '根据朝鲜市场里的匿名联系人整理的、每两周更新的商品价格和汇率。' },
      'KPA Journal': { note: '关于朝鲜人民军、海岸炮、特种作战司令部和加固炮兵阵地的专题研究。' },
    },
  },
};

export function libraryShelf(lang: Lang, id: ShelfId): ShelfCopy {
  if (lang === 'en') {
    const shelf = SHELVES.find((s) => s.id === id)!;
    return { title: shelf.title, intro: shelf.intro };
  }
  return SHELF_COPY[lang][id];
}

export function libraryItemCopy(lang: Lang, item: Item): ItemCopy {
  if (lang === 'en') return { note: item.note, caveat: item.caveat };
  const shelf = SHELVES.find((s) => s.items.some((i) => i.title === item.title));
  const copy = shelf ? ITEM_COPY[lang][shelf.id][item.title] : undefined;
  return copy ?? { note: item.note, caveat: item.caveat };
}
