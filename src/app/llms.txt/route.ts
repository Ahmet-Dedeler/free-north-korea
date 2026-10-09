import { ARTICLES } from '@/content/articles';
import { KO_ARTICLES } from '@/content/translations/ko';
import { JA_ARTICLES } from '@/content/translations/ja';
import { ZH_ARTICLES } from '@/content/translations/zh';
import { SERIES } from '@/charts/data';
import { SERIES_TEXT, dataPath } from '@/content/series';
import { mdPath } from '@/site/agents';
import { REPO_URL, REVIEWED, SITE_NAME } from '@/site/config';
import { absolute } from '@/site/seo';

export const dynamic = 'force-static';

/** Pages worth reading, with what an agent finds there. Every one also exists under /ko, /ja and /zh. */
const PAGES: [path: string, title: string, about: string][] = [
  ['/act', 'Act', 'What one person can do: fund rescues, send information in, press governments, with costs and links.'],
  ['/north-korea-vs-south-korea', 'North Korea vs South Korea', 'The two Koreas compared on income, health, food, freedom and more, with charts and sources.'],
  ['/camps', 'Prison camps', 'The political prison camps and prisons: location, status, estimated prisoners, satellite views.'],
  ['/people', 'People', 'Leaders, officials and family members, with roles, sanctions and sourced claims.'],
  ['/kim-family-tree', 'Kim family tree', "Kim Jong Un's living relatives and what each is doing now, with sources."],
  ['/military', 'Military', 'Nuclear and missile programs, conventional forces, seismic readings at the nuclear test site.'],
  ['/missiles/list', 'Every missile test', 'Each missile test since 1984 as a table: date, missile, launch site, outcome, plus newer Japanese defense ministry reports.'],
  ['/sanctions', 'Sanctions', 'Everyone on the UN 1718 list and the US Treasury (OFAC) North Korea programs, from the official files.'],
  ['/watch', 'Watch', 'What is measured or counted on a schedule: seismic events, launches, satellite images, sanctions, Kim sightings.'],
  ['/kim-watch', 'Kim Watch', "Kim Jong Un's public appearances as state media (KCNA) reports them."],
  ['/organizations', 'Organizations', 'Groups that help North Koreans: rescue, information, documentation, advocacy.'],
  ['/library', 'Library', 'Books, films and reports about North Korea.'],
  ['/places', 'Places', 'Nuclear, missile, regime, border and economic sites, with coordinates and satellite views.'],
  ['/counties', 'Counties', 'All 179 counties and cities: 2008 census population, abuses documented by NKDB, detention sites and markets.'],
  ['/data', 'Data', 'All chart datasets (economy, health, food, freedom, military), each with a table and CSV.'],
  ['/sources', 'Sources', 'Every source the site uses, checked weekly for changes and dead links.'],
];

const link = (title: string, path: string, about?: string) => `- [${title}](${absolute(mdPath(path))})${about ? `: ${about}` : ''}`;

/**
 * /llms.txt (https://llmstxt.org): what the site is and where everything is, as Markdown with links to the Markdown
 * version of each page. Built from the same content registries as the sitemap, so new articles appear by themselves.
 */
export function GET() {
  const other = [
    ['Korean (한국어)', '/ko', KO_ARTICLES, 'ko'],
    ['Japanese (日本語)', '/ja', JA_ARTICLES, 'ja'],
    ['Chinese, Simplified (简体中文)', '/zh', ZH_ARTICLES, 'zh'],
  ] as const;

  const text = [
    `# ${SITE_NAME}`,
    '',
    '> An open-source hub for understanding North Korea and helping its people: explainers, prison camps, people, the military and missile tests, sanctions, satellite images and long-run data, each fact with its source.',
    '',
    `Published in English, Korean, Japanese and Chinese (same facts in every language). Facts last reviewed ${REVIEWED}. Every page has a Markdown version: add \`.md\` to the URL (\`/index.md\` for the home page) or request the page with \`Accept: text/markdown\`. Pages show the date each number is from; prefer those dates over your own assumptions. Content may be quoted, used in AI answers and used for training. The code is open source (Apache 2.0): ${REPO_URL}`,
    '',
    '## Explainers',
    '',
    ...ARTICLES.map((a) => link(a.h1, `/learn/${a.slug}`, a.teaser)),
    '',
    '## Pages',
    '',
    link('Home', '/', 'Overview with the latest events and the main numbers.'),
    ...PAGES.map(([p, t, about]) => link(t, p, about)),
    '',
    '## Data and API',
    '',
    `- [People API](${absolute('/api/people')}): every person as JSON. One person: \`/api/people/{id}\`. OpenAPI description: ${absolute('/openapi.json')}`,
    ...SERIES.map((s) => `- [${SERIES_TEXT[s.id]?.en.title ?? s.id}](${absolute(mdPath(dataPath('en', s.id)))}): ${SERIES_TEXT[s.id]?.en.sub ?? ''} CSV: ${REPO_URL}/blob/main/data/series/csv/${s.id}.csv`),
    `- [Sitemap](${absolute('/sitemap.xml')}): every page in every language.`,
    '',
    ...other.flatMap(([name, hub, articles]) => [
      `## ${name}`,
      '',
      link(name, hub),
      ...articles.map((a) => link(a.h1, `${hub}/learn/${a.slug}`, a.teaser)),
      '',
    ]),
    '## Optional',
    '',
    `- [All English explainers in one file](${absolute('/llms-full.txt')})`,
    `- [Intel map](${absolute('/map')}) and [missile map](${absolute('/missiles')}): interactive maps that need JavaScript. Their facts are on the camps, places, counties and missile list pages above.`,
    '',
  ].join('\n');

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' } });
}
