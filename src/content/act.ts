/**
 * Text for /act in every language. The steps, numbers, and links match the English page.
 * Org names with no local name in orgs.ts stay in English; ActPage wraps those strings in lang="en".
 */
import { REPO_URL } from '@/site/config';
import type { Lang } from '@/site/seo';

export const ACT_PATHS = { en: '/act', ko: '/ko/act', ja: '/ja/act', zh: '/zh/act' } as const;

export type ActStepIcon = 'share' | 'star' | 'mail' | 'book' | 'coins';

/** Links and logos, in the same order as each language's groups and steps. */
export const ACT_GROUPS: {
  steps: { href: string; ext?: boolean; org?: string; icon?: ActStepIcon }[];
}[] = [
  {
    steps: [
      { href: 'https://libertyinnorthkorea.org/donate', ext: true, org: 'liberty-in-north-korea' },
      { href: '/learn/how-can-north-korea-be-freed', icon: 'share' },
      { href: REPO_URL, ext: true, icon: 'star' },
    ],
  },
  {
    steps: [
      { href: 'https://flashdrivesforfreedom.org', ext: true, org: 'flash-drives-for-freedom' },
      { href: '/learn/information-into-north-korea', icon: 'mail' },
      { href: '/library', icon: 'book' },
    ],
  },
  {
    steps: [
      { href: 'https://lovefsi.org', ext: true, org: 'fsi' },
      { href: '/organizations', icon: 'coins' },
      { href: 'https://libertyinnorthkorea.org', ext: true, org: 'liberty-in-north-korea' },
    ],
  },
];

type StepText = { title: string; text: string; cta: string };
type GroupText = { time: string; intro: string; steps: [StepText, StepText, StepText] };
type SkillText = { who: string; what: string };
type DontText = { title: string; text: string };

export type ActText = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  groups: [GroupText, GroupText, GroupText];
  skillsTitle: string;
  skillsIntro: string;
  skills: [SkillText, SkillText, SkillText, SkillText, SkillText, SkillText];
  contribute: string;
  dontTitle: string;
  dont: [DontText, DontText, DontText];
};

export const ACT_TEXT: Record<Lang, ActText> = {
  en: {
    metaTitle: 'How to Help Free North Korea: Things You Can Do Today',
    metaDescription:
      'Practical ways to help North Koreans, sorted by how much time you have: mail USB drives, fund a $3,000 rescue, tutor escapees online, contact lawmakers, contribute code.',
    eyebrow: 'Take action',
    h1: 'What you can do, sorted by how much time you have',
    lede: 'North Korea feels too big to touch. But the useful work is cheap, specific and badly underfunded right now, so small help actually moves things. Pick one and do it today.',
    groups: [
      {
        time: '5 minutes',
        intro: 'Small, but real.',
        steps: [
          {
            title: 'Give to a rescue',
            text: 'Each rescue from China to safety costs about $3,000. $25 is a real share of one.',
            cta: 'Liberty in North Korea',
          },
          {
            title: 'Share one explainer',
            text: 'Most people know North Korea from memes. Send someone a page that tells them what is actually going on.',
            cta: 'How could North Korea be freed?',
          },
          {
            title: 'Star and share this project',
            text: 'Search results for "how to free North Korea" are almost empty. Links and stars help this site get found.',
            cta: 'GitHub',
          },
        ],
      },
      {
        time: 'An hour',
        intro: 'Things that put something physical or political in motion.',
        steps: [
          {
            title: 'Mail old USB drives or microSD cards',
            text: 'Flash Drives for Freedom wipes them, loads films, Wikipedia and news, and gets them into North Korea. Still running in 2026.',
            cta: 'Flash Drives for Freedom',
          },
          {
            title: 'Write to your representatives',
            text: 'Ask them to restore funding for Korean-language broadcasting (Radio Free Asia’s Korean service shut down in 2025), support human rights groups that lost grants, and press China to stop forcibly returning escapees.',
            cta: 'Background to cite',
          },
          {
            title: 'Read one memoir or watch Beyond Utopia',
            text: 'It changes how you talk about North Korea, and people around you will notice.',
            cta: 'Library',
          },
        ],
      },
      {
        time: 'Every week',
        intro: 'The highest-impact thing most people can do is consistent, boring help.',
        steps: [
          {
            title: 'Tutor an escapee in English',
            text: 'Freedom Speakers International (formerly TNKR) matches volunteers with North Koreans in South Korea. Refugees pick their tutors.',
            cta: 'Freedom Speakers International',
          },
          {
            title: 'Give monthly to a group that lost funding',
            text: 'Documentation and media groups like NKDB, TJWG, Daily NK and Unification Media Group were hit by the 2025 US grant cuts.',
            cta: 'Organizations',
          },
          {
            title: 'Run a fundraiser',
            text: 'A school club or a birthday fundraiser can cover a full rescue. LiNK has kits for this.',
            cta: 'LiNK',
          },
        ],
      },
    ],
    skillsTitle: 'If you have a specific skill',
    skillsIntro: 'These are the gaps.',
    skills: [
      { who: 'Developers', what: 'This site is open source. Add data layers, build tools, improve the maps, fix bugs.' },
      {
        who: 'OSINT & mapping people',
        what: 'Geolocate camps and facilities from satellite imagery, check our coordinates, add sources.',
      },
      {
        who: 'Korean speakers',
        what: 'Translation is a bottleneck for documentation groups. This site is in English, Korean, Japanese and Chinese; check our translations and fix what reads wrong.',
      },
      {
        who: 'Writers & creators',
        what: 'Good English content on North Korea is rare. Write explainers, make videos, pitch them here.',
      },
      {
        who: 'Students',
        what: 'Start a LiNK chapter, write a paper with escapee interviews, or run a screening of Beyond Utopia.',
      },
      {
        who: 'Lawyers & policy people',
        what: 'Accountability work (TJWG, Korea Future, the UN Seoul office) needs legal and policy help.',
      },
    ],
    contribute: 'Contribute on GitHub',
    dontTitle: 'Please don’t',
    dont: [
      {
        title: 'Contact people inside or travel there to "help".',
        text: 'It puts them in danger.',
      },
      {
        title: 'Give to aid that goes through the regime unmonitored.',
        text: 'Without independent monitoring there is no way to know who ends up with it.',
      },
      {
        title: 'Share unverified viral stories.',
        text: 'Execution rumors are often wrong. Check against Daily NK, NK News or the UN.',
      },
    ],
  },

  ko: {
    metaTitle: '북한을 자유롭게 하도록 돕는 방법: 오늘 할 수 있는 일',
    metaDescription:
      '북한 사람을 돕는 구체적인 방법을, 가진 시간별로 나눴습니다. USB 보내기, $3,000 구출 후원, 온라인으로 탈북민에게 영어 가르치기, 의원에게 연락하기, 코드 기여.',
    eyebrow: '행동',
    h1: '할 수 있는 일, 가진 시간별로',
    lede: '북한은 손대기에는 너무 크게 느껴집니다. 하지만 쓸모 있는 일은 지금 비용이 적고, 내용이 구체적이며, 자금이 심하게 부족합니다. 그래서 작은 도움이 실제로 일을 움직입니다. 하나를 골라 오늘 해 주세요.',
    groups: [
      {
        time: '5분',
        intro: '작지만, 진짜입니다.',
        steps: [
          {
            title: '구출에 후원하기',
            text: '중국에서 안전한 곳까지의 구출 한 건은 약 $3,000입니다. $25는 그 한 건의 실제 몫입니다.',
            cta: 'Liberty in North Korea',
          },
          {
            title: '설명 글 하나 공유하기',
            text: '대부분의 사람은 북한을 밈으로만 압니다. 실제로 무슨 일이 있는지를 알려 주는 페이지를 한 사람에게 보내 주세요.',
            cta: '북한은 어떻게 자유로워질 수 있을까?',
          },
          {
            title: '이 프로젝트에 스타를 누르고 공유하기',
            text: '"how to free North Korea" 검색 결과는 거의 비어 있습니다. 링크와 스타가 이 사이트가 검색되게 합니다.',
            cta: 'GitHub',
          },
        ],
      },
      {
        time: '한 시간',
        intro: '손에 잡히는 것이든 정치적인 것이든, 뭔가를 실제로 움직이게 하는 일입니다.',
        steps: [
          {
            title: '쓰던 USB나 microSD 카드 보내기',
            text: 'Flash Drives for Freedom이 내용을 지우고, 영화와 위키백과와 뉴스를 담아 북한으로 들여보냅니다. 2026년에도 운영 중입니다.',
            cta: 'Flash Drives for Freedom',
          },
          {
            title: '의원에게 편지 쓰기',
            text: '한국어 방송 예산을 복원하고 (자유아시아방송 한국어 서비스는 2025년에 문을 닫았습니다), 지원금을 잃은 인권 단체를 지원하고, 중국이 탈북민을 강제송환하지 않도록 압박해 달라고 요청해 주세요.',
            cta: '인용할 배경',
          },
          {
            title: '회고록 한 권을 읽거나 Beyond Utopia 보기',
            text: '북한을 이야기하는 방식이 바뀌고, 주변 사람도 그것을 알아챕니다.',
            cta: '도서관',
          },
        ],
      },
      {
        time: '매주',
        intro: '대부분 사람이 할 수 있는 일 가운데, 효과가 가장 큰 것은 꾸준하고 지루한 도움입니다.',
        steps: [
          {
            title: '탈북민에게 영어 가르치기',
            text: 'Freedom Speakers International(옛 TNKR)이 자원봉사자와 한국에 있는 북한 사람을 연결합니다. 난민이 튜터를 고릅니다.',
            cta: 'Freedom Speakers International',
          },
          {
            title: '자금을 잃은 단체에 매달 후원하기',
            text: 'NKDB, TJWG, Daily NK, Unification Media Group 같은 기록 단체와 미디어 단체는 2025년 미국 지원금 삭감의 타격을 받았습니다.',
            cta: '단체',
          },
          {
            title: '모금하기',
            text: '학교 동아리나 생일 모금으로 구출 한 건 전체를 댈 수 있습니다. LiNK에는 이를 위한 키트가 있습니다.',
            cta: 'LiNK',
          },
        ],
      },
    ],
    skillsTitle: '특정한 기술이 있다면',
    skillsIntro: '비어 있는 자리입니다.',
    skills: [
      {
        who: '개발자',
        what: '이 사이트는 오픈소스입니다. 데이터 레이어를 더하고, 도구를 만들고, 지도를 개선하고, 버그를 고쳐 주세요.',
      },
      {
        who: '공개정보 분석과 지도를 하는 사람',
        what: '위성 영상으로 수용소와 시설의 위치를 찾고, 우리 좌표를 확인하고, 출처를 더해 주세요.',
      },
      {
        who: '한국어를 하는 사람',
        what: '번역은 기록 단체들의 병목입니다. 이 사이트는 영어, 한국어, 일본어, 중국어로 나옵니다. 번역을 읽어 보고 어색한 곳을 고쳐 주세요.',
      },
      {
        who: '글을 쓰고 만드는 사람',
        what: '북한에 대한 좋은 영어 콘텐츠는 드뭅니다. 설명 글을 쓰고, 영상을 만들고, 여기로 제안해 주세요.',
      },
      {
        who: '학생',
        what: 'LiNK 지부를 만들거나, 탈북민을 인터뷰한 논문을 쓰거나, Beyond Utopia 상영회를 열어 주세요.',
      },
      {
        who: '법률가와 정책을 다루는 사람',
        what: '책임 규명 작업(TJWG, Korea Future, 유엔 서울 사무소)에는 법률과 정책 도움이 필요합니다.',
      },
    ],
    contribute: 'GitHub에 기여하기',
    dontTitle: '하지 말아 주세요',
    dont: [
      {
        title: '북한 안에 있는 사람에게 연락하거나, "돕겠다"며 그곳으로 가는 것.',
        text: '그 사람들을 위험에 빠뜨립니다.',
      },
      {
        title: '독립적인 감시 없이 정권을 거쳐 들어가는 지원에 돈을 내는 것.',
        text: '감시가 없으면 결국 누구 손에 들어가는지 알 방법이 없습니다.',
      },
      {
        title: '확인되지 않고 퍼진 이야기를 공유하는 것.',
        text: '처형 소문은 틀린 경우가 많습니다. Daily NK, NK News 또는 유엔과 대조해 주세요.',
      },
    ],
  },

  ja: {
    metaTitle: '北朝鮮を自由にする手助け：今日できること',
    metaDescription:
      '北朝鮮の人を助ける具体的な方法を、使える時間で分けました。USBを送る、$3,000の救出を支える、オンラインで脱北者に英語を教える、議員に連絡する、コードを書く。',
    eyebrow: '行動',
    h1: 'できること。使える時間で分けています',
    lede: '北朝鮮は、触れられないほど大きく感じます。でも、役に立つ仕事は今、費用が少なく、中身が具体的で、資金がひどく足りていません。だから小さな助けが実際に物事を動かします。一つ選んで、今日やってください。',
    groups: [
      {
        time: '5分',
        intro: '小さいけれど、本物です。',
        steps: [
          {
            title: '救出に寄付する',
            text: '中国から安全な場所までの救出1件は、約$3,000です。$25は、その1件の本物の分担です。',
            cta: 'Liberty in North Korea',
          },
          {
            title: '解説を一つシェアする',
            text: 'ほとんどの人は、北朝鮮をミームで知っています。実際に何が起きているかを書いたページを、誰かに送ってください。',
            cta: '北朝鮮はどうすれば自由になれるのか',
          },
          {
            title: 'このプロジェクトにスターを付けてシェアする',
            text: '「how to free North Korea」の検索結果は、ほとんど空です。リンクとスターが、このサイトが見つかる助けになります。',
            cta: 'GitHub',
          },
        ],
      },
      {
        time: '1時間',
        intro: '物としても、政治としても、何かを実際に動かすことです。',
        steps: [
          {
            title: '使わなくなったUSBやmicroSDカードを送る',
            text: 'Flash Drives for Freedomが中身を消去し、映画、ウィキペディア、ニュースを入れて、北朝鮮に届けます。2026年も続いています。',
            cta: 'Flash Drives for Freedom',
          },
          {
            title: '議員に手紙を書く',
            text: '韓国語放送の予算を戻すこと（自由アジア放送の韓国語サービスは2025年に閉鎖しました）、助成金を失った人権団体を支えること、中国が脱北者を強制送還しないよう圧力をかけることを、頼んでください。',
            cta: '引用できる背景',
          },
          {
            title: '回想録を一冊読むか、Beyond Utopiaを見る',
            text: '北朝鮮の話し方が変わり、周りの人もそれに気づきます。',
            cta: 'ライブラリー',
          },
        ],
      },
      {
        time: '毎週',
        intro: 'ほとんどの人にとって効果が一番大きいのは、続いていて退屈な助けです。',
        steps: [
          {
            title: '脱北者に英語を教える',
            text: 'Freedom Speakers International（旧TNKR）は、ボランティアと韓国にいる北朝鮮の人を結びつけます。難民が自分のチューターを選びます。',
            cta: 'Freedom Speakers International',
          },
          {
            title: '資金を失った団体に毎月寄付する',
            text: 'NKDB、TJWG、Daily NK、Unification Media Groupのような記録団体とメディア団体は、2025年の米国助成金削減の影響を受けました。',
            cta: '団体',
          },
          {
            title: '募金をする',
            text: '学校のクラブか、誕生日の募金で、救出1件をまかなえます。LiNKには、そのためのキットがあります。',
            cta: 'LiNK',
          },
        ],
      },
    ],
    skillsTitle: '特定のスキルがあるなら',
    skillsIntro: '足りていないところです。',
    skills: [
      {
        who: '開発者',
        what: 'このサイトはオープンソースです。データレイヤーを足し、ツールを作り、地図を良くし、バグを直してください。',
      },
      {
        who: '公開情報分析と地図を扱う人',
        what: '衛星画像から収容所や施設の位置を特定し、こちらの座標を確かめ、出典を足してください。',
      },
      {
        who: '韓国語ができる人',
        what: '翻訳は記録団体のボトルネックです。このサイトは英語、韓国語、日本語、中国語で公開しています。翻訳を読んで、不自然なところを直してください。',
      },
      {
        who: '書き手と作り手',
        what: '北朝鮮についての良い英語のコンテンツは少ないです。解説を書き、動画を作り、ここに提案してください。',
      },
      {
        who: '学生',
        what: 'LiNKの支部を作るか、脱北者への聞き取りで論文を書くか、Beyond Utopiaの上映会をしてください。',
      },
      {
        who: '法律と政策の人',
        what: '責任を問う仕事（TJWG、Korea Future、国連ソウル事務所）には、法律と政策の助けが必要です。',
      },
    ],
    contribute: 'GitHubで貢献する',
    dontTitle: 'しないでください',
    dont: [
      {
        title: '北朝鮮の中にいる人に連絡したり、「助ける」ために現地へ行ったりすること。',
        text: 'その人たちを危険にさらします。',
      },
      {
        title: '独立した監視のないまま、体制を通る支援にお金を出すこと。',
        text: '監視がなければ、最後に誰の手に渡るのか確かめようがありません。',
      },
      {
        title: '未確認のまま広がった話をシェアすること。',
        text: '処刑のうわさは間違っていることが多いです。Daily NK、NK News、または国連と照らし合わせてください。',
      },
    ],
  },

  zh: {
    metaTitle: '怎样帮忙让朝鲜获得自由：今天能做的事',
    metaDescription:
      '帮助朝鲜人的具体做法，按你有多少时间来分：寄U盘、资助一次$3,000的营救、在线辅导脱北者、联系议员、贡献代码。',
    eyebrow: '行动',
    h1: '你能做的事，按你有多少时间来排',
    lede: '朝鲜大得好像碰不到。但有用的工作现在花钱少、内容具体，而且资金严重不足，所以一点小帮助确实能起作用。挑一件，今天就做。',
    groups: [
      {
        time: '5分钟',
        intro: '小，但是实在。',
        steps: [
          {
            title: '资助一次营救',
            text: '从中国到安全地带，一次营救大约$3,000。$25是其中实实在在的一份。',
            cta: 'Liberty in North Korea',
          },
          {
            title: '分享一篇说明',
            text: '大多数人是从表情包认识朝鲜的。把一篇讲清楚实际发生了什么的页面，发给一个人。',
            cta: '朝鲜怎样才能获得自由？',
          },
          {
            title: '给这个项目加星并分享',
            text: '搜索“how to free North Korea”，结果几乎是空的。链接和星标能让这个网站被找到。',
            cta: 'GitHub',
          },
        ],
      },
      {
        time: '一小时',
        intro: '让一件实物，或一件政治上的事，真正动起来。',
        steps: [
          {
            title: '寄出旧U盘或microSD卡',
            text: 'Flash Drives for Freedom 会清空它们，装上电影、维基百科和新闻，再送进朝鲜。2026年仍在做。',
            cta: 'Flash Drives for Freedom',
          },
          {
            title: '给议员写信',
            text: '请他们恢复韩语广播的经费（自由亚洲电台的韩语节目已于2025年停播），支持失去拨款的人权机构，并敦促中国停止强制遣返脱北者。',
            cta: '可引用的背景',
          },
          {
            title: '读一本回忆录，或看 Beyond Utopia',
            text: '这会改变你谈论朝鲜的方式，你身边的人也会注意到。',
            cta: '书库',
          },
        ],
      },
      {
        time: '每周',
        intro: '对大多数人来说，作用最大的是持续的、乏味的帮助。',
        steps: [
          {
            title: '给一名脱北者辅导英语',
            text: 'Freedom Speakers International（原TNKR）把志愿者和在韩国的朝鲜人配对。难民自己选导师。',
            cta: 'Freedom Speakers International',
          },
          {
            title: '按月捐给失去资金的机构',
            text: 'NKDB、TJWG、Daily NK 和 Unification Media Group 这类记录机构和媒体机构，受到了2025年美国拨款削减的打击。',
            cta: '机构',
          },
          {
            title: '办一场募捐',
            text: '学校社团或生日募捐，就可以凑够一次完整的营救。LiNK 有为此准备的套件。',
            cta: 'LiNK',
          },
        ],
      },
    ],
    skillsTitle: '如果你有一项具体的技能',
    skillsIntro: '这些是缺口。',
    skills: [
      { who: '开发者', what: '本站是开源的。添加数据图层，做工具，改进地图，修漏洞。' },
      {
        who: '做开源情报和地图的人',
        what: '用卫星图像给收容所和设施定位，核对我们的坐标，补充来源。',
      },
      {
        who: '会韩语的人',
        what: '翻译是记录机构的瓶颈。本站有英文、韩文、日文和中文版。请读一读译文，把不通顺的地方改掉。',
      },
      {
        who: '写作者和创作者',
        what: '关于朝鲜的好英文内容很少。写说明，做视频，投到这里来。',
      },
      {
        who: '学生',
        what: '成立一个 LiNK 分部，写一篇有脱北者访谈的论文，或者办一场 Beyond Utopia 放映。',
      },
      {
        who: '律师和政策方面的人',
        what: '追责工作（TJWG、Korea Future、联合国首尔办公室）需要法律和政策上的帮助。',
      },
    ],
    contribute: '在 GitHub 上贡献',
    dontTitle: '请不要',
    dont: [
      {
        title: '联系朝鲜境内的人，或为了“帮忙”亲自前往。',
        text: '这会让他们陷入危险。',
      },
      {
        title: '向没有独立监督、经过政权的援助捐钱。',
        text: '没有监督，就无法知道东西最后到了谁手里。',
      },
      {
        title: '转发未经核实的热传故事。',
        text: '关于处决的传闻经常是错的。请对照 Daily NK、NK News 或联合国。',
      },
    ],
  },
};
