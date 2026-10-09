/**
 * Text for the site chrome (top bar and footer) in every language, and the helpers that point its links at the
 * reader's language. SiteChrome works out the language from the URL (/ko, /ja, /zh, else English).
 */
import type { Lang } from '@/site/seo';

/**
 * First path segments that exist under /ko, /ja and /zh. Everything else (the /map and /missiles apps) only exists
 * in English. /learn has no translated index page; its translated hub is the language's home page.
 */
const TRANSLATED = new Set([
  'act', 'camps', 'counties', 'data', 'kim-family-tree', 'kim-watch', 'library', 'military', 'north-korea-vs-south-korea',
  'organizations', 'people', 'places', 'sanctions', 'sources', 'watch',
]);

export const LANG_PREFIXES: Lang[] = ['ko', 'ja', 'zh'];

/** Language of a path: its /ko, /ja or /zh prefix, else English. */
export function langOf(path: string): Lang {
  return LANG_PREFIXES.find((l) => path === `/${l}` || path.startsWith(`/${l}/`)) ?? 'en';
}

/** The English path of any page (drops the language prefix). */
export function basePath(path: string): string {
  const lang = langOf(path);
  return lang === 'en' ? path : path.slice(lang.length + 1) || '/';
}

/**
 * Where an English path lives in `lang`, by URL pattern alone. Learn articles are translated under the same slug
 * (the build checks it). The language switcher prefers the page's own hreflang links when they exist, which also
 * covers the rare page that exists in one language only.
 */
export function localize(lang: Lang, path: string): string {
  if (lang === 'en') return path;
  if (path === '/' || path === '/learn') return `/${lang}`;
  if (path === '/missiles/list') return `/${lang}/missiles/list`;
  const first = path.split(/[/?#]/)[1] ?? '';
  return TRANSLATED.has(first) || first === 'learn' ? `/${lang}${path}` : path;
}

interface ChromeText {
  home: string;
  nav: { href: string; label: string }[];
  cta: string;
  langs: string;
  about: string;
  explore: string;
  explore_links: [string, string][];
  help: string;
  help_links: [string, string][];
  contribute: string;
  read: string;
  read_links: [string, string][];
  reviewed: (d: string) => string;
  issue: [string, string, string];
}

const LEARN = {
  freed: '/learn/how-can-north-korea-be-freed',
  possible: '/learn/is-it-possible-to-free-north-korea',
  camps: '/learn/north-korea-prison-camps',
  escape: '/learn/how-north-koreans-escape',
  help: '/learn/how-to-help-north-koreans',
};

export const CHROME_TEXT: Record<Lang, ChromeText> = {
  en: {
    home: 'Free North Korea, home',
    nav: [
      { href: '/map', label: 'Map' },
      { href: '/watch', label: 'Watch' },
      { href: '/military', label: 'Military' },
      { href: '/missiles', label: 'Missile tests' },
      { href: '/people', label: 'People' },
      { href: '/organizations', label: 'Organizations' },
      { href: '/library', label: 'Library' },
      { href: '/learn', label: 'Learn' },
    ],
    cta: 'Take action',
    langs: 'Language',
    about:
      'An open-source hub for understanding North Korea and helping the 26 million people living under its regime. No ads, no cookies, no affiliation with any government. Page views are counted anonymously.',
    explore: 'Explore',
    explore_links: [
      ['/map', 'Intel map'],
      ['/watch', 'Watch: what can be seen from outside'],
      ['/camps', 'Prison camps'],
      ['/places', 'Key strategic sites'],
      ['/counties', '179 counties'],
      ['/missiles', 'Missile tests'],
      ['/missiles/list', 'Missile test list'],
      ['/sanctions', 'Sanctions'],
      ['/kim-watch', 'Kim Watch'],
      ['/north-korea-vs-south-korea', 'North vs South Korea'],
      ['/data', 'Charts and data'],
      ['/library', 'Library'],
    ],
    help: 'Help',
    help_links: [
      ['/act', 'Take action'],
      ['/organizations', 'Organizations'],
      [LEARN.help, 'How to help'],
    ],
    contribute: 'Contribute on GitHub',
    read: 'Read',
    read_links: [
      [LEARN.freed, 'How can North Korea be freed?'],
      [LEARN.possible, 'Is it possible?'],
      [LEARN.camps, 'Prison camps'],
      [LEARN.escape, 'How people escape'],
    ],
    reviewed: (d) => `Facts last reviewed ${d}.`,
    issue: ['Found something wrong or out of date?', 'Open an issue', '. Code: Apache 2.0.'],
  },
  ko: {
    home: '자유 북한, 홈',
    nav: [
      { href: '/map', label: '지도' },
      { href: '/watch', label: '워치' },
      { href: '/military', label: '군사' },
      { href: '/missiles', label: '미사일 시험' },
      { href: '/people', label: '인물' },
      { href: '/organizations', label: '단체' },
      { href: '/library', label: '자료실' },
      { href: '/learn', label: '알아보기' },
    ],
    cta: '행동하기',
    langs: '언어',
    about:
      '북한을 이해하고 그 체제 아래 사는 2,600만 명을 돕기 위한 오픈소스 허브입니다. 광고도 쿠키도 없고, 어느 정부와도 관계가 없습니다. 페이지 조회수는 익명으로만 집계합니다.',
    explore: '둘러보기',
    explore_links: [
      ['/map', '정보 지도 (영어)'],
      ['/watch', '워치: 밖에서 볼 수 있는 것'],
      ['/camps', '정치범수용소'],
      ['/places', '주요 전략 시설'],
      ['/counties', '179개 시·군'],
      ['/missiles', '미사일 시험 지도 (영어)'],
      ['/missiles/list', '미사일 시험 목록'],
      ['/sanctions', '제재'],
      ['/kim-watch', '김정은 워치'],
      ['/north-korea-vs-south-korea', '북한과 한국 비교'],
      ['/data', '차트와 데이터'],
      ['/library', '자료실'],
    ],
    help: '돕기',
    help_links: [
      ['/act', '행동하기'],
      ['/organizations', '단체'],
      [LEARN.help, '도울 수 있는 방법'],
    ],
    contribute: 'GitHub에서 참여하기',
    read: '읽기',
    read_links: [
      [LEARN.freed, '북한은 어떻게 자유로워질 수 있을까?'],
      [LEARN.possible, '가능한 일일까?'],
      [LEARN.camps, '정치범수용소'],
      [LEARN.escape, '사람들은 어떻게 탈출하나'],
    ],
    reviewed: (d) => `사실 관계 최종 검토: ${d}.`,
    issue: ['틀리거나 오래된 내용을 발견했나요?', '이슈 열기', '. 코드: Apache 2.0.'],
  },
  ja: {
    home: '自由北朝鮮、ホーム',
    nav: [
      { href: '/map', label: '地図' },
      { href: '/watch', label: 'ウォッチ' },
      { href: '/military', label: '軍事' },
      { href: '/missiles', label: 'ミサイル発射' },
      { href: '/people', label: '人物' },
      { href: '/organizations', label: '団体' },
      { href: '/library', label: '資料' },
      { href: '/learn', label: '解説' },
    ],
    cta: '行動する',
    langs: '言語',
    about:
      '北朝鮮を理解し、その体制の下で暮らす2,600万人を助けるためのオープンソースのハブです。広告もクッキーもなく、どの政府とも関係はありません。ページの閲覧数は匿名でのみ数えています。',
    explore: '見る',
    explore_links: [
      ['/map', '情報マップ（英語）'],
      ['/watch', 'ウォッチ：外から見えるもの'],
      ['/camps', '政治犯収容所'],
      ['/places', '主要な戦略施設'],
      ['/counties', '179の市・郡'],
      ['/missiles', 'ミサイル発射マップ（英語）'],
      ['/missiles/list', 'ミサイル発射の一覧'],
      ['/sanctions', '制裁'],
      ['/kim-watch', '金正恩ウォッチ'],
      ['/north-korea-vs-south-korea', '北朝鮮と韓国の比較'],
      ['/data', 'グラフとデータ'],
      ['/library', '資料'],
    ],
    help: '支援',
    help_links: [
      ['/act', '行動する'],
      ['/organizations', '団体'],
      [LEARN.help, '支援の方法'],
    ],
    contribute: 'GitHubで参加する',
    read: '読む',
    read_links: [
      [LEARN.freed, '北朝鮮はどうすれば自由になれるか'],
      [LEARN.possible, 'それは可能か'],
      [LEARN.camps, '政治犯収容所'],
      [LEARN.escape, '人々はどう脱出するのか'],
    ],
    reviewed: (d) => `事実の最終確認：${d}。`,
    issue: ['誤りや古い情報を見つけましたか？', 'Issueを開く', '。コード：Apache 2.0。'],
  },
  zh: {
    home: '自由朝鲜，首页',
    nav: [
      { href: '/map', label: '地图' },
      { href: '/watch', label: '观察' },
      { href: '/military', label: '军事' },
      { href: '/missiles', label: '导弹试射' },
      { href: '/people', label: '人物' },
      { href: '/organizations', label: '组织' },
      { href: '/library', label: '资料库' },
      { href: '/learn', label: '了解' },
    ],
    cta: '采取行动',
    langs: '语言',
    about: '一个开源平台，帮助人们了解朝鲜，并帮助生活在其政权下的 2,600 万人。没有广告，没有 cookie，与任何政府无关。页面浏览量只做匿名统计。',
    explore: '浏览',
    explore_links: [
      ['/map', '情报地图（英文）'],
      ['/watch', '观察：从外面能看到什么'],
      ['/camps', '政治犯收容所'],
      ['/places', '主要战略设施'],
      ['/counties', '179 个市郡'],
      ['/missiles', '导弹试射地图（英文）'],
      ['/missiles/list', '导弹试射列表'],
      ['/sanctions', '制裁'],
      ['/kim-watch', '金正恩观察'],
      ['/north-korea-vs-south-korea', '朝鲜与韩国对比'],
      ['/data', '图表和数据'],
      ['/library', '资料库'],
    ],
    help: '帮助',
    help_links: [
      ['/act', '采取行动'],
      ['/organizations', '组织'],
      [LEARN.help, '如何帮助'],
    ],
    contribute: '在 GitHub 上参与',
    read: '阅读',
    read_links: [
      [LEARN.freed, '朝鲜怎样才能获得自由？'],
      [LEARN.possible, '这可能吗？'],
      [LEARN.camps, '政治犯收容所'],
      [LEARN.escape, '人们如何逃离'],
    ],
    reviewed: (d) => `事实最后核对：${d}。`,
    issue: ['发现错误或过时的内容？', '提交 issue', '。代码：Apache 2.0。'],
  },
};

/** Native names for the language switcher. */
export const LANG_NAMES: Record<Lang, string> = { en: 'EN', ko: '한국어', ja: '日本語', zh: '中文' };
