/**
 * Directory of organizations working on North Korea.
 *
 * `status` is our best reading of public activity as of `checked`. It is not an endorsement or an audit.
 * Corrections are welcome via GitHub issues.
 */

export type OrgCategory = 'rescue' | 'information' | 'documentation' | 'resettlement' | 'research' | 'news' | 'advocacy';
export type OrgStatus = 'active' | 'at-risk' | 'paused' | 'unclear';

export interface Org {
  id: string;
  name: string;
  url: string;
  category: OrgCategory;
  based: string;
  founded?: number;
  status: OrgStatus;
  /** What they do, in one or two plain sentences. */
  summary: string;
  /** Short note on recent activity or context. */
  note?: string;
  /** Ways to help, most direct first. */
  help: { label: string; url: string }[];
}

export const CATEGORIES: { id: OrgCategory; label: string; hint: string }[] = [
  { id: 'rescue', label: 'Rescue', hint: 'Getting people out of China to safety' },
  { id: 'information', label: 'Information in', hint: 'Radio, USB drives and media into North Korea' },
  { id: 'documentation', label: 'Documentation', hint: 'Recording abuses for future justice' },
  { id: 'resettlement', label: 'Resettlement', hint: 'Education and support for escapees' },
  { id: 'research', label: 'Research', hint: 'Analysis, satellite imagery, data' },
  { id: 'news', label: 'News', hint: 'Reporting on and from inside North Korea' },
  { id: 'advocacy', label: 'Advocacy', hint: 'Pressure on governments and the UN' },
];

export const STATUS_LABEL: Record<OrgStatus, string> = {
  active: 'Active',
  'at-risk': 'Active, funding hit',
  paused: 'Paused',
  unclear: 'Status unclear',
};

export const ORGS_CHECKED = '2026-10-01';

export const ORGS: Org[] = [
  {
    id: 'liberty-in-north-korea',
    name: 'Liberty in North Korea (LiNK)',
    url: 'https://libertyinnorthkorea.org',
    category: 'rescue',
    based: 'Long Beach, CA and Seoul',
    founded: 2004,
    status: 'active',
    summary:
      'Funds rescues of North Korean refugees from China to safety in Southeast Asia, then supports them as they resettle. Also runs storytelling and campaigns.',
    note: '1,400+ rescues so far, 17 in 2025. About $3,000 per rescue.',
    help: [
      { label: 'Donate to a rescue', url: 'https://libertyinnorthkorea.org/donate' },
      { label: 'Start a fundraiser', url: 'https://libertyinnorthkorea.org' },
    ],
  },
  {
    id: 'flash-drives-for-freedom',
    name: 'Flash Drives for Freedom (Human Rights Foundation)',
    url: 'https://flashdrivesforfreedom.org',
    category: 'information',
    based: 'New York',
    founded: 2016,
    status: 'active',
    summary:
      'Collects used USB drives, loads them with films, Korean Wikipedia and news, and gets them into North Korea through partner groups.',
    note: 'Still running in 2026: 140,000+ drives donated or pledged.',
    help: [{ label: 'Mail your old USB drives', url: 'https://flashdrivesforfreedom.org' }],
  },
  {
    id: 'unification-media-group',
    name: 'Unification Media Group (UMG)',
    url: 'https://uni-media.net',
    category: 'information',
    based: 'Seoul',
    founded: 2014,
    status: 'at-risk',
    summary: 'Produces radio broadcasts and media aimed at listeners inside North Korea, much of it made by escapees.',
    note: 'One of the few broadcasters left after Radio Free Asia’s Korean service closed in July 2025. Affected by 2025 US grant cuts.',
    help: [{ label: 'Website', url: 'https://uni-media.net' }],
  },
  {
    id: 'daily-nk',
    name: 'Daily NK',
    url: 'https://www.dailynk.com/english/',
    category: 'news',
    based: 'Seoul',
    founded: 2005,
    status: 'at-risk',
    summary: 'News from a network of sources inside North Korea: market prices, crackdowns, executions, daily life.',
    note: 'Named by HRW among groups at risk after 2025 US funding cuts.',
    help: [{ label: 'Read and share', url: 'https://www.dailynk.com/english/' }],
  },
  {
    id: 'nkdb',
    name: 'NKDB (Database Center for North Korean Human Rights)',
    url: 'https://en.nkdb.org',
    category: 'documentation',
    based: 'Seoul',
    founded: 2003,
    status: 'at-risk',
    summary: 'Interviews escapees and keeps the largest database of North Korean human rights violations, plus a prison database.',
    note: 'Affected by 2025 US grant cuts.',
    help: [{ label: 'Website', url: 'https://en.nkdb.org' }],
  },
  {
    id: 'tjwg',
    name: 'Transitional Justice Working Group (TJWG)',
    url: 'https://en.tjwg.org',
    category: 'documentation',
    based: 'Seoul',
    founded: 2014,
    status: 'at-risk',
    summary: 'Maps execution and burial sites and builds the evidence base for future accountability and transitional justice.',
    help: [{ label: 'Website', url: 'https://en.tjwg.org' }],
  },
  {
    id: 'korea-future',
    name: 'Korea Future',
    url: 'https://www.koreafuture.org',
    category: 'documentation',
    based: 'London and Seoul',
    status: 'active',
    summary: 'Documents abuses in the North Korean penal system case by case, identifying victims and perpetrators.',
    help: [{ label: 'Website', url: 'https://www.koreafuture.org' }],
  },
  {
    id: 'hrnk',
    name: 'Committee for Human Rights in North Korea (HRNK)',
    url: 'https://www.hrnk.org',
    category: 'research',
    based: 'Washington, DC',
    founded: 2001,
    status: 'active',
    summary: 'Research and advocacy. Its satellite imagery reports on individual prison camps (and The Hidden Gulag) are the standard reference.',
    help: [{ label: 'Reports', url: 'https://www.hrnk.org/publications/hrnk-publications.php' }],
  },
  {
    id: 'nkhr',
    name: "Citizens' Alliance for North Korean Human Rights (NKHR)",
    url: 'https://en.nkhr.or.kr',
    category: 'advocacy',
    based: 'Seoul',
    founded: 1996,
    status: 'active',
    summary: 'One of the oldest North Korean human rights groups. Advocacy, education and support for escapees.',
    note: 'Marked 30 years in 2026.',
    help: [{ label: 'Website', url: 'https://en.nkhr.or.kr' }],
  },
  {
    id: 'pscore',
    name: 'PSCORE',
    url: 'https://www.pscore.org',
    category: 'resettlement',
    based: 'Seoul',
    founded: 2006,
    status: 'active',
    summary: 'Founded by escapees. Runs education programs and one-on-one tutoring for North Koreans in South Korea, plus advocacy.',
    help: [{ label: 'Volunteer as a tutor', url: 'https://www.pscore.org' }],
  },
  {
    id: 'fsi',
    name: 'Freedom Speakers International (formerly TNKR)',
    url: 'https://lovefsi.org',
    category: 'resettlement',
    based: 'Seoul and Arlington, VA',
    founded: 2013,
    status: 'active',
    summary:
      'Matches North Korean escapees with volunteer English tutors and public speaking coaches. Refugees pick their own tutors. 600+ refugees and 1,200+ volunteers so far.',
    help: [
      { label: 'Volunteer to tutor', url: 'https://lovefsi.org' },
      { label: 'Donate', url: 'https://donate.lovefsi.com/' },
    ],
  },
  {
    id: 'crossing-borders',
    name: 'Crossing Borders',
    url: 'https://crossingbordersnk.org',
    category: 'rescue',
    based: 'USA and Northeast Asia',
    founded: 2003,
    status: 'active',
    summary: 'Cares for North Korean refugees hiding in China, especially women and children, including children born to North Korean mothers there.',
    help: [{ label: 'Website', url: 'https://crossingbordersnk.org' }],
  },
  {
    id: 'durihana',
    name: 'Durihana',
    url: 'https://www.durihana.com',
    category: 'rescue',
    based: 'Seoul',
    founded: 1999,
    status: 'unclear',
    summary: 'Christian group that has helped North Koreans escape through China and runs a school for young escapees in Seoul.',
    help: [{ label: 'Website (Korean)', url: 'https://www.durihana.com' }],
  },
  {
    id: 'nauh',
    name: 'NAUH (Now, Action & Unity for Human Rights)',
    url: 'https://www.nauh.or.kr',
    category: 'rescue',
    based: 'Seoul',
    founded: 2010,
    status: 'unclear',
    summary: 'Escapee-led group founded by Ji Seong-ho. Rescue support, information work and advocacy.',
    help: [{ label: 'Website (Korean)', url: 'https://www.nauh.or.kr' }],
  },
  {
    id: 'nk-watch',
    name: 'NK Watch',
    url: 'https://www.nkwatch.org',
    category: 'documentation',
    based: 'Seoul',
    status: 'unclear',
    summary: 'Founded by former prison camp guard Ahn Myeong-chul. Collects testimony from camp survivors and files cases with the UN.',
    help: [{ label: 'Website', url: 'https://www.nkwatch.org' }],
  },
  {
    id: 'nk-freedom-coalition',
    name: 'North Korea Freedom Coalition',
    url: 'https://www.nkfreedom.org',
    category: 'advocacy',
    based: 'Washington, DC',
    status: 'active',
    summary: 'Coalition of groups behind North Korea Freedom Week. Lobbies the US government on refugees and human rights.',
    help: [{ label: 'Website', url: 'https://www.nkfreedom.org' }],
  },
  {
    id: 'ohchr-seoul',
    name: 'UN Human Rights Office in Seoul',
    url: 'https://seoul.ohchr.org',
    category: 'documentation',
    based: 'Seoul',
    founded: 2015,
    status: 'active',
    summary: 'The UN field office set up after the 2014 Commission of Inquiry. Interviews escapees and keeps a central record for accountability.',
    help: [{ label: 'Website', url: 'https://seoul.ohchr.org' }],
  },
  {
    id: '38-north',
    name: '38 North (Stimson Center)',
    url: 'https://www.38north.org',
    category: 'research',
    based: 'Washington, DC',
    founded: 2009,
    status: 'active',
    summary: 'Analysis of North Korea, best known for commercial satellite imagery of nuclear and missile sites. Runs the DPRK Digital Atlas.',
    help: [{ label: 'DPRK Digital Atlas', url: 'https://www.stimson.org/project/38-north/dprk-digital-atlas/' }],
  },
  {
    id: 'beyond-parallel',
    name: 'Beyond Parallel (CSIS)',
    url: 'https://beyondparallel.csis.org',
    category: 'research',
    based: 'Washington, DC',
    status: 'active',
    summary: 'Satellite imagery and data on missile bases, prison camps and the economy, plus surveys of people inside North Korea.',
    help: [{ label: 'Website', url: 'https://beyondparallel.csis.org' }],
  },
  {
    id: 'nk-news',
    name: 'NK News / NK Pro',
    url: 'https://www.nknews.org',
    category: 'news',
    based: 'Seoul',
    founded: 2010,
    status: 'active',
    summary: 'Independent news on North Korea. NK Pro adds paid research tools (ship tracking, KCNA archives, leadership tracker).',
    help: [{ label: 'Read', url: 'https://www.nknews.org' }],
  },
  {
    id: 'hrw',
    name: 'Human Rights Watch',
    url: 'https://www.hrw.org/asia/north-korea',
    category: 'advocacy',
    based: 'New York',
    status: 'active',
    summary: 'Annual country reports and campaigns, including on forced repatriation from China.',
    help: [{ label: 'North Korea page', url: 'https://www.hrw.org/asia/north-korea' }],
  },
  {
    id: 'leaflet-groups',
    name: 'Balloon and leaflet groups',
    url: 'https://www.nknews.org/2025/07/civic-group-halts-leaflet-launches-toward-north-korea-following-crackdown/',
    category: 'information',
    based: 'South Korea',
    status: 'paused',
    summary: 'Escapee-led groups that floated leaflets, USB drives, dollars and rice across the border by balloon.',
    note: 'Mostly halted in 2025 after South Korea asked groups to stop and enforced a ban on launches.',
    help: [],
  },
];
