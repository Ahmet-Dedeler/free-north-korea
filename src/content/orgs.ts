/**
 * Directory of organizations, companies and individuals working on North Korea.
 * Not only nonprofits: a lone investigator who freezes the regime's stolen money counts as much as a charity.
 *
 * `status` is our best reading of public activity as of `checked`. It is not an endorsement or an audit.
 * Corrections are welcome via GitHub issues.
 */

export type OrgCategory = 'rescue' | 'information' | 'documentation' | 'resettlement' | 'money' | 'research' | 'news' | 'advocacy';
/** Who is behind an entry, when it isn't a nonprofit or public body. Shown on the card. */
export type OrgKind = 'individual' | 'company';
export type OrgStatus = 'active' | 'at-risk' | 'paused' | 'unclear';

export interface Org {
  id: string;
  name: string;
  url: string;
  category: OrgCategory;
  based: string;
  founded?: number;
  status: OrgStatus;
  kind?: OrgKind;
  /** What they do, in one or two plain sentences. */
  summary: string;
  /** Short note on recent activity or context. */
  note?: string;
  /** Ways to help, most direct first. The website itself is always shown as an icon, so don't repeat it here. */
  help: { label: string; url: string }[];
  /** True when `url` is an article about the group rather than its own site (no website icon then). */
  noSite?: boolean;
  /** Site language when it isn't English. */
  lang?: string;
  /** Official accounts, as linked from the org's own website. */
  socials?: Partial<Record<Social, string>>;
}

export type Social = 'x' | 'bluesky' | 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin' | 'patreon';

export const CATEGORIES: { id: OrgCategory; label: string; hint: string }[] = [
  { id: 'rescue', label: 'Rescue', hint: 'Getting people out of China to safety' },
  { id: 'information', label: 'Information in', hint: 'Radio, USB drives and media into North Korea' },
  { id: 'documentation', label: 'Documentation', hint: 'Recording abuses for future justice' },
  { id: 'resettlement', label: 'Resettlement', hint: 'Education and support for escapees' },
  { id: 'money', label: 'Cutting the money', hint: "Tracing and freezing the regime's stolen crypto" },
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

export const KIND_LABEL: Record<OrgKind, string> = {
  individual: 'Individual',
  company: 'Company',
};

export const ORGS_CHECKED = '2026-10-05';

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
    socials: {
      x: 'https://x.com/LibertyinNK',
      instagram: 'https://www.instagram.com/libertyinnorthkorea/',
      youtube: 'https://www.youtube.com/channel/UCowMJ16vcNtqJJFTSH3yEVg',
      facebook: 'https://www.facebook.com/libertyinnk/',
    },
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
    socials: {
      x: 'https://x.com/hrf',
      instagram: 'https://www.instagram.com/hrf/',
      facebook: 'https://www.facebook.com/humanrightsfoundation',
    },
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
    help: [],
    socials: {
      instagram: 'https://www.instagram.com/uni__media',
      youtube: 'https://www.youtube.com/user/enjoyotv',
      facebook: 'https://www.facebook.com/unificationmediagroup/',
    },
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
    help: [],
    socials: {
      youtube: 'https://www.youtube.com/@%EB%A6%AC%EC%96%BC%EB%B6%81_realnk',
      facebook: 'https://www.facebook.com/dailynk2005',
    },
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
    help: [],
    socials: {
      x: 'https://x.com/twtNKDB',
      facebook: 'https://www.facebook.com/nkdb.org',
      linkedin: 'https://www.linkedin.com/company/13342644/',
    },
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
    help: [],
    socials: {
      x: 'https://x.com/tjwgseoul',
      youtube: 'https://www.youtube.com/channel/UCVH2h_raGM-fNfg9gRY1Hpg',
      facebook: 'https://www.facebook.com/transitionaljusticewg',
      linkedin: 'https://www.linkedin.com/company/transitional-justice-working-group-tjwg',
    },
  },
  {
    id: 'korea-future',
    name: 'Korea Future',
    url: 'https://www.koreafuture.org',
    category: 'documentation',
    based: 'London and Seoul',
    status: 'active',
    summary: 'Documents abuses in the North Korean penal system case by case, identifying victims and perpetrators.',
    help: [],
    socials: {
      x: 'https://x.com/KFuturexhr',
      youtube: 'https://www.youtube.com/channel/UCI3mdfLSUZzEQc9M9CaWmXw',
      linkedin: 'https://www.linkedin.com/company/korea-future',
    },
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
    socials: {
      x: 'https://x.com/committeehrnk',
      youtube: 'https://www.youtube.com/committeehrnk',
      facebook: 'https://www.facebook.com/CommitteeHRNK',
    },
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
    help: [],
    socials: {
      x: 'https://x.com/nkhumanrights',
      instagram: 'https://www.instagram.com/citizensnkhr/',
      youtube: 'https://www.youtube.com/channel/UC6XHHitRcLv_RfhwoeVmnmQ',
      facebook: 'https://www.facebook.com/nkhumanrights',
    },
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
    socials: {
      x: 'https://x.com/PSCORE911',
      instagram: 'https://www.instagram.com/pscorekorea/',
      youtube: 'https://www.youtube.com/user/PSCORE911',
      facebook: 'https://www.facebook.com/PscoreKorea/',
      linkedin: 'https://www.linkedin.com/company/pscore',
    },
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
    socials: {
      instagram: 'https://www.instagram.com/freedomspeakersinternational/',
      youtube: 'https://www.youtube.com/@FreedomSpeakersInternational',
      facebook: 'https://www.facebook.com/FreedomSpeakersInternational/',
      linkedin: 'https://www.linkedin.com/company/lovefsi/',
      patreon: 'https://www.patreon.com/fsi21',
    },
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
    help: [],
    socials: {
      instagram: 'https://www.instagram.com/crossingbordersnk/',
      youtube: 'https://www.youtube.com/channel/UCa_iDvFW6nOOWKWf6e4xJZw',
      facebook: 'https://www.facebook.com/CrossingBordersNK',
    },
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
    lang: 'Korean',
    help: [],
    socials: {
      x: 'https://x.com/durihanamission',
      instagram: 'https://www.instagram.com/durihana1999/',
      youtube: 'https://www.youtube.com/@tvdurihana478',
      facebook: 'https://www.facebook.com/durihana.ac',
    },
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
    lang: 'Korean',
    help: [],
  },
  {
    id: 'nk-watch',
    name: 'NK Watch',
    url: 'https://www.nkwatch.org',
    category: 'documentation',
    based: 'Seoul',
    status: 'unclear',
    summary: 'Founded by former prison camp guard Ahn Myeong-chul. Collects testimony from camp survivors and files cases with the UN.',
    help: [],
  },
  {
    id: 'nk-freedom-coalition',
    name: 'North Korea Freedom Coalition',
    url: 'https://www.nkfreedom.org',
    category: 'advocacy',
    based: 'Washington, DC',
    status: 'active',
    summary: 'Coalition of groups behind North Korea Freedom Week. Lobbies the US government on refugees and human rights.',
    help: [],
    socials: {
      x: 'https://x.com/nkfc',
      youtube: 'https://www.youtube.com/nkfreedom',
      facebook: 'https://www.facebook.com/nkfreedom.org',
    },
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
    help: [],
    socials: {
      x: 'https://x.com/UNrightsSeoul',
      youtube: 'https://www.youtube.com/user/UNOHCHR',
      facebook: 'https://www.facebook.com/UNrightsSeoul',
    },
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
    socials: {
      x: 'https://x.com/38NorthNK',
    },
  },
  {
    id: 'beyond-parallel',
    name: 'Beyond Parallel (CSIS)',
    url: 'https://beyondparallel.csis.org',
    category: 'research',
    based: 'Washington, DC',
    status: 'active',
    summary: 'Satellite imagery and data on missile bases, prison camps and the economy, plus surveys of people inside North Korea.',
    help: [],
    socials: {
      x: 'https://x.com/CSISKoreaChair',
      facebook: 'https://www.facebook.com/csiskoreachair/',
    },
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
    help: [],
    socials: {
      x: 'https://x.com/nknewsorg',
      bluesky: 'https://bsky.app/profile/nknewsorg.bsky.social',
      instagram: 'https://www.instagram.com/nknewsorg/',
      youtube: 'https://www.youtube.com/channel/UCz5Nf5Eb7EQul1mLqrRwliw',
      facebook: 'https://www.facebook.com/nknewsorg',
    },
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
    socials: {
      x: 'https://x.com/hrw',
      bluesky: 'https://bsky.app/profile/hrw.org',
      instagram: 'https://www.instagram.com/humanrightswatch/',
      tiktok: 'https://www.tiktok.com/@humanrightswatch',
      youtube: 'https://www.youtube.com/user/HumanRightsWatch',
      facebook: 'https://www.facebook.com/HumanRightsWatch',
      linkedin: 'https://www.linkedin.com/company/human-rights-watch/',
    },
  },
  {
    id: 'zachxbt',
    name: 'ZachXBT',
    url: 'https://t.me/investigations',
    category: 'money',
    kind: 'individual',
    based: 'Independent, online',
    founded: 2021,
    status: 'active',
    summary:
      'Pseudonymous on-chain investigator. Traces stolen crypto, named Lazarus as the thief in the $1.5 billion Bybit hack in 2025, and gets exchanges and stablecoin issuers to freeze North Korean funds before they are laundered.',
    note: 'Has helped freeze more than $75 million tied to North Korea since 2022. In 2025 he went undercover with a Lazarus laundering crew, which got about 442,000 USDT frozen.',
    help: [
      { label: 'Read his investigations', url: 'https://t.me/investigations' },
      { label: 'The $75M figure', url: 'https://panews.io/articles/01a10c01-72bb-7487-a271-fd5374b44b26' },
    ],
    socials: {
      x: 'https://x.com/zachxbt',
    },
  },
  {
    id: 'tayvano',
    name: 'Taylor Monahan (tayvano)',
    url: 'https://github.com/tayvano/lazarus-bluenoroff-research',
    category: 'money',
    kind: 'individual',
    based: 'Independent, online',
    founded: 2016,
    status: 'active',
    summary:
      'Security researcher who has tracked North Korean hackers since 2016. Keeps an open list of every heist attributed to Lazarus and its sister units, and exposes North Korean IT workers hired by crypto projects.',
    note: '295+ incidents and $6.9 billion+ in stolen crypto logged, from 2016 to the $350M Bitget theft in September 2026.',
    help: [{ label: 'The Lazarus heist list', url: 'https://github.com/tayvano/lazarus-bluenoroff-research' }],
    noSite: true,
  },
  {
    id: 'seal',
    name: 'Security Alliance (SEAL)',
    url: 'https://securityalliance.org',
    category: 'money',
    based: 'Online',
    status: 'active',
    summary:
      'Volunteer security researchers. SEAL 911 is a free 24/7 hotline for anyone being hacked, and their guides teach companies how to spot and stop North Korean IT workers.',
    help: [
      { label: 'Spot a North Korean IT worker', url: 'https://frameworks.securityalliance.org/dprk-it-workers/overview/' },
    ],
    socials: {
      x: 'https://x.com/_SEAL_Org',
    },
  },
  {
    id: 'lazarus-bounty',
    name: 'LazarusBounty (Bybit)',
    url: 'https://www.lazarusbounty.com',
    category: 'money',
    kind: 'company',
    based: 'Dubai',
    founded: 2025,
    status: 'active',
    summary:
      'Bounty site the exchange Bybit opened after Lazarus stole $1.5 billion from it. Anyone who traces the stolen money and gets it frozen earns 10% of what is frozen.',
    note: 'Up to $140 million in bounties on offer.',
    help: [{ label: 'Hunt the stolen funds', url: 'https://www.lazarusbounty.com' }],
  },
  {
    id: 'leaflet-groups',
    name: 'Balloon and leaflet groups',
    url: 'https://www.nknews.org/2025/07/civic-group-halts-leaflet-launches-toward-north-korea-following-crackdown/',
    category: 'information',
    based: 'South Korea',
    noSite: true,
    status: 'paused',
    summary: 'Escapee-led groups that floated leaflets, USB drives, dollars and rice across the border by balloon.',
    note: 'Mostly halted in 2025 after South Korea asked groups to stop and enforced a ban on launches.',
    help: [{ label: 'Why they stopped', url: 'https://www.nknews.org/2025/07/civic-group-halts-leaflet-launches-toward-north-korea-following-crackdown/' }],
  },
];
