/**
 * Reading, watching and source list. Links go to a stable public page (Open Library, Wikipedia,
 * the publisher or the archive itself) rather than a store.
 */

export type ShelfId = 'memoir' | 'nonfiction' | 'film' | 'report' | 'regime' | 'data';

export interface Item {
  title: string;
  by: string;
  year?: number;
  url: string;
  note: string;
  /** Short honest caveat when an account has been challenged. */
  caveat?: string;
}

export const SHELVES: { id: ShelfId; title: string; intro: string; items: Item[] }[] = [
  {
    id: 'memoir',
    title: 'Escapee memoirs',
    intro: 'First-hand accounts. Start here.',
    items: [
      {
        title: 'The Aquariums of Pyongyang',
        by: 'Kang Chol-hwan & Pierre Rigoulot',
        year: 2000,
        url: 'https://openlibrary.org/search?q=The+Aquariums+of+Pyongyang',
        note: 'Sent to the Yodok prison camp at age 9 with his whole family. The book that put the camps on the map for many readers.',
      },
      {
        title: 'The Girl with Seven Names',
        by: 'Hyeonseo Lee',
        year: 2015,
        url: 'https://openlibrary.org/search?q=The+Girl+with+Seven+Names',
        note: 'Left at 17, lived under false identities in China for a decade, then went back to the border to bring her family out.',
      },
      {
        title: 'Escape from Camp 14',
        by: 'Blaine Harden',
        year: 2012,
        url: 'https://openlibrary.org/search?q=Escape+from+Camp+14',
        note: 'Shin Dong-hyuk’s account of being born inside a political prison camp.',
        caveat: 'Shin later revised parts of his story (2015). The core account matches other testimony.',
      },
      {
        title: 'In Order to Live',
        by: 'Yeonmi Park',
        year: 2015,
        url: 'https://openlibrary.org/search?q=In+Order+to+Live+Yeonmi+Park',
        note: 'Escape at 13 through China, trafficking, and the Gobi desert crossing to Mongolia.',
        caveat: 'Some details have been questioned by journalists and other escapees.',
      },
      {
        title: 'A River in Darkness',
        by: 'Masaji Ishikawa',
        year: 2017,
        url: 'https://openlibrary.org/search?q=A+River+in+Darkness',
        note: 'A half-Japanese man whose family moved to North Korea in 1960 on a repatriation program and spent 36 years there.',
      },
      {
        title: 'Every Falling Star',
        by: 'Sungju Lee & Susan McClelland',
        year: 2016,
        url: 'https://openlibrary.org/search?q=Every+Falling+Star+Sungju+Lee',
        note: 'From a Pyongyang childhood to living in a street gang during the famine.',
      },
      {
        title: 'Dear Leader',
        by: 'Jang Jin-sung',
        year: 2014,
        url: 'https://openlibrary.org/search?q=Dear+Leader+Jang+Jin-sung',
        note: 'A former poet laureate inside the regime’s propaganda apparatus. Rare view from the elite.',
      },
    ],
  },
  {
    id: 'nonfiction',
    title: 'Understanding the country',
    intro: 'Journalism and analysis that explain how North Korea actually works.',
    items: [
      {
        title: 'Nothing to Envy',
        by: 'Barbara Demick',
        year: 2009,
        url: 'https://openlibrary.org/search?q=Nothing+to+Envy+Demick',
        note: 'Six people from the city of Chongjin through the 1990s famine. The best single book on ordinary life.',
      },
      {
        title: 'The Real North Korea',
        by: 'Andrei Lankov',
        year: 2013,
        url: 'https://openlibrary.org/search?q=The+Real+North+Korea+Lankov',
        note: 'Why the regime survives and how it might change. Lankov studied in Pyongyang in the 1980s.',
      },
      {
        title: 'North Korea Confidential',
        by: 'Daniel Tudor & James Pearson',
        year: 2015,
        url: 'https://openlibrary.org/search?q=North+Korea+Confidential',
        note: 'Markets, smuggling, fashion, drugs and media. How people actually get by.',
      },
      {
        title: 'The Great Successor',
        by: 'Anna Fifield',
        year: 2019,
        url: 'https://openlibrary.org/search?q=The+Great+Successor+Fifield',
        note: 'Biography of Kim Jong Un.',
      },
      {
        title: 'The Cleanest Race',
        by: 'B. R. Myers',
        year: 2010,
        url: 'https://openlibrary.org/search?q=The+Cleanest+Race+Myers',
        note: 'Argues the regime’s real ideology is race-based nationalism, not communism. Changes how you read the propaganda.',
      },
      {
        title: 'Without You, There Is No Us',
        by: 'Suki Kim',
        year: 2014,
        url: 'https://openlibrary.org/search?q=Without+You+There+Is+No+Us',
        note: 'Undercover as a teacher to the sons of the elite at a Pyongyang university.',
      },
      {
        title: 'The Accusation',
        by: 'Bandi (pseudonym)',
        year: 2017,
        url: 'https://openlibrary.org/search?q=The+Accusation+Bandi',
        note: 'Short stories written by a writer still living inside North Korea, smuggled out. Fiction, but rare.',
      },
      {
        title: 'The Impossible State',
        by: 'Victor Cha',
        year: 2012,
        url: 'https://openlibrary.org/search?q=The+Impossible+State+Victor+Cha',
        note: 'Policy view from a former White House North Korea adviser.',
      },
    ],
  },
  {
    id: 'film',
    title: 'Documentaries',
    intro: 'If you only watch one, watch Beyond Utopia.',
    items: [
      {
        title: 'Beyond Utopia',
        by: 'Madeleine Gavin',
        year: 2023,
        url: 'https://en.wikipedia.org/wiki/Beyond_Utopia',
        note: 'Follows a real escape through China, Vietnam, Laos and Thailand, filmed as it happens.',
      },
      {
        title: 'Under the Sun',
        by: 'Vitaly Mansky',
        year: 2015,
        url: 'https://en.wikipedia.org/wiki/Under_the_Sun_(2015_film)',
        note: 'A state-approved documentary about a Pyongyang family, with the regime’s staging left in.',
      },
      {
        title: 'The Mole: Undercover in North Korea',
        by: 'Mads Brügger',
        year: 2020,
        url: 'https://en.wikipedia.org/wiki/The_Mole:_Undercover_in_North_Korea',
        note: 'A Danish chef infiltrates a pro-regime friendship group and ends up in arms deals.',
      },
      {
        title: 'The Lovers and the Despot',
        by: 'Robert Cannan & Ross Adam',
        year: 2016,
        url: 'https://en.wikipedia.org/wiki/The_Lovers_and_the_Despot',
        note: 'Kim Jong Il kidnapped a South Korean director and actress to make films for him.',
      },
      {
        title: 'Crossing the Line',
        by: 'Daniel Gordon',
        year: 2006,
        url: 'https://en.wikipedia.org/wiki/Crossing_the_Line_(2006_film)',
        note: 'A US soldier who defected to North Korea in 1962 and lived there for decades.',
      },
    ],
  },
  {
    id: 'report',
    title: 'Key reports',
    intro: 'The primary documents most articles cite.',
    items: [
      {
        title: 'Report of the UN Commission of Inquiry on Human Rights in the DPRK',
        by: 'United Nations',
        year: 2014,
        url: 'https://www.ohchr.org/en/hr-bodies/hrc/co-idprk/commission-inquiry-on-h-rin-dprk',
        note: 'Found crimes against humanity "without any parallel in the contemporary world". Still the baseline.',
      },
      {
        title: 'UN OHCHR report on the decade since the Commission of Inquiry',
        by: 'United Nations',
        year: 2025,
        url: 'https://www.hrw.org/news/2025/09/16/north-korea-lost-decade-of-rights-abuses',
        note: 'Over 300 interviews. Found more surveillance, forced labor and executions since 2014.',
      },
      {
        title: 'The Hidden Gulag (2nd ed.)',
        by: 'David Hawk, HRNK',
        year: 2012,
        url: 'https://www.hrnk.org/publications/hrnk-publications.php',
        note: 'Camp by camp, with satellite imagery and testimony.',
      },
      {
        title: 'World Report 2026: North Korea',
        by: 'Human Rights Watch',
        year: 2026,
        url: 'https://www.hrw.org/world-report/2026/country-chapters/north-korea',
        note: 'Short annual summary of what changed.',
      },
      {
        title: 'SIPRI Yearbook 2026: World nuclear forces',
        by: 'SIPRI',
        year: 2026,
        url: 'https://www.sipri.org/sites/default/files/YB26%2008%20World%20Nuclear%20Forces.pdf',
        note: 'Current estimate of North Korea’s warheads (about 60) and fissile material.',
      },
    ],
  },
  {
    id: 'regime',
    title: 'From the regime itself',
    intro: 'Primary sources published by North Korea. Read them to understand the propaganda, not to believe it.',
    items: [
      {
        title: 'KCNA Watch',
        by: 'NK News',
        url: 'https://kcnawatch.org',
        note: 'Searchable archive of KCNA, Rodong Sinmun and other state media, without visiting North Korean servers.',
      },
      {
        title: 'Foreign Languages Publishing House books',
        by: 'Internet Archive',
        url: 'https://archive.org/search?query=%22Foreign+Languages+Publishing+House%22+Pyongyang',
        note: 'Scanned propaganda books, leader biographies and Juche texts in English.',
      },
      {
        title: 'North Korea Collection',
        by: 'University of Hawaiʻi at Mānoa Library',
        url: 'https://guides.library.manoa.hawaii.edu/kstudies/northkoreanbooks',
        note: 'Thousands of North Korean books and journals, with catalog records.',
      },
      {
        title: 'North Korea in the World',
        by: 'East-West Center & NCNK',
        url: 'https://www.northkoreaintheworld.org',
        note: 'Data on North Korea’s trade, diplomacy and foreign ties.',
      },
    ],
  },
  {
    id: 'data',
    title: 'Data and OSINT tools',
    intro: 'For researchers and developers who want to build on this.',
    items: [
      {
        title: 'DPRK Digital Atlas',
        by: '38 North / Stimson',
        url: 'https://www.stimson.org/project/38-north/dprk-digital-atlas/',
        note: 'Geospatial dataset of political, economic and security sites.',
      },
      {
        title: 'North Korean Prison Database',
        by: 'NKDB',
        url: 'https://nkpd.org',
        note: 'Detention facilities and cases from escapee testimony.',
      },
      {
        title: 'OCCRP Aleph',
        by: 'OCCRP',
        url: 'https://aleph.occrp.org',
        note: 'Searchable leaks and records, including sanctions-evasion company networks.',
      },
      {
        title: 'OSINT Tools: North Korea',
        by: 'paulpogoda',
        url: 'https://github.com/paulpogoda/OSINT-Tools-North-Korea',
        note: 'Curated list of maps, datasets and tools.',
      },
      {
        title: 'CNS North Korea Missile Test Database',
        by: 'James Martin CNS / NTI',
        url: 'https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/',
        note: 'The data behind our missile test map.',
      },
      {
        title: 'nk-missile-tests',
        by: 'nagix',
        url: 'https://github.com/nagix/nk-missile-tests',
        note: 'Original open-source visualization our missile map is based on. Updated as new tests happen.',
      },
    ],
  },
];
