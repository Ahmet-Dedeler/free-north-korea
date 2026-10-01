/**
 * Places on the atlas. Coordinates come from Wikipedia's geocoded articles unless marked `approx`,
 * which means the point is placed by hand from satellite imagery reports and may be a few km off.
 */

export type PlaceCategory = 'camp' | 'nuclear' | 'missile' | 'regime' | 'border' | 'economy' | 'route';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lon: number;
  /** Short status line, e.g. "Operating" or "Closed ~2012". */
  status?: string;
  note: string;
  approx?: boolean;
  source?: { label: string; url: string };
  /** Related article on this site. */
  more?: string;
}

export const PLACE_CATEGORIES: { id: PlaceCategory; label: string; color: string; hint: string }[] = [
  { id: 'camp', label: 'Prison camps', color: '#dc2626', hint: 'Political prison camps (kwanliso) and prisons (kyohwaso)' },
  { id: 'nuclear', label: 'Nuclear', color: '#f59e0b', hint: 'Reactors, enrichment, test site, uranium' },
  { id: 'missile', label: 'Missile & space', color: '#8b5cf6', hint: 'Launch sites, test grounds, submarine base' },
  { id: 'regime', label: 'Regime', color: '#0ea5e9', hint: 'Seats and symbols of power in Pyongyang' },
  { id: 'border', label: 'Border & crossings', color: '#14b8a6', hint: 'Where people cross into China, and the DMZ' },
  { id: 'economy', label: 'Economy', color: '#64748b', hint: 'Mines, zones and showcase projects' },
  { id: 'route', label: 'Escape route', color: '#16a34a', hint: 'The usual 3,000-mile route to freedom' },
];

export const PLACE_COLOR = Object.fromEntries(PLACE_CATEGORIES.map((c) => [c.id, c.color])) as Record<PlaceCategory, string>;

const wiki = (title: string) => ({ label: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${title}` });

export const PLACES: Place[] = [
  // ---- prison camps ----
  {
    id: 'camp-14',
    name: 'Camp 14, Kaechon',
    category: 'camp',
    lat: 39.5711,
    lon: 126.0555,
    status: 'Operating',
    note: 'Total control zone where prisoners are never released. Shin Dong-hyuk (Escape from Camp 14) says he was born here.',
    source: wiki('Kaechon_internment_camp'),
    more: '/learn/north-korea-prison-camps',
  },
  {
    id: 'camp-15',
    name: 'Camp 15, Yodok',
    category: 'camp',
    lat: 39.6742,
    lon: 126.8514,
    status: 'Reported closed or downsized, disputed',
    note: 'Had a "revolutionizing zone" from which some prisoners were released, which is why most early camp testimony comes from here. Kang Chol-hwan (The Aquariums of Pyongyang) was held here as a child.',
    source: wiki('Yodok_concentration_camp'),
    more: '/learn/north-korea-prison-camps',
  },
  {
    id: 'camp-16',
    name: 'Camp 16, Hwasong',
    category: 'camp',
    lat: 41.2685,
    lon: 129.3912,
    status: 'Operating',
    note: 'The largest known political prison camp, a few km from the Punggye-ri nuclear test site. Tens of thousands of prisoners estimated.',
    source: wiki('Hwasong_concentration_camp'),
    more: '/learn/north-korea-prison-camps',
  },
  {
    id: 'camp-18',
    name: 'Camp 18, Pukchang',
    category: 'camp',
    lat: 39.5462,
    lon: 126.0632,
    status: 'Reported closed or merged',
    note: 'Mining camp across the river from Camp 14. Reports suggest it was closed or merged in the 2000s, though parts may still be used.',
    source: wiki('Pukchang_concentration_camp'),
  },
  {
    id: 'camp-22',
    name: 'Camp 22, Hoeryong',
    category: 'camp',
    lat: 42.538,
    lon: 129.9355,
    status: 'Closed ~2012',
    note: 'Once one of the largest camps. Closed around 2012. What happened to its prisoners is unknown.',
    source: wiki('Hoeryong_concentration_camp'),
  },
  {
    id: 'camp-25',
    name: 'Camp 25, Chongjin',
    category: 'camp',
    lat: 41.8335,
    lon: 129.7256,
    status: 'Operating, expanded in the 2010s',
    note: 'Political prison camp on the edge of Chongjin. Satellite imagery showed new guard posts and buildings in the 2010s.',
    source: wiki('Chongjin_concentration_camp'),
  },
  {
    id: 'kyohwaso-1',
    name: 'Kyohwaso No. 1, Kaechon',
    category: 'camp',
    lat: 39.7083,
    lon: 125.9233,
    status: 'Operating',
    note: 'Re-education prison for people convicted of crimes. Survivors describe forced labor and high death rates.',
    source: wiki('Kaechon_prison_camp'),
  },
  {
    id: 'kyohwaso-12',
    name: 'Kyohwaso No. 12, Chongori',
    category: 'camp',
    lat: 42.2099,
    lon: 129.7537,
    status: 'Operating',
    note: 'Holds many people forcibly sent back from China after escaping. Testimony describes starvation and abuse, especially of women.',
    source: wiki('Chongori_concentration_camp'),
    more: '/learn/how-north-koreans-escape',
  },

  // ---- nuclear ----
  {
    id: 'yongbyon',
    name: 'Yongbyon nuclear complex',
    category: 'nuclear',
    lat: 39.8,
    lon: 125.754,
    status: 'Operating',
    note: 'The heart of the nuclear program: reactors that make plutonium, a reprocessing plant and a uranium enrichment hall.',
    source: wiki('Nyongbyon_Nuclear_Scientific_Research_Center'),
    more: '/military',
  },
  {
    id: 'kangson',
    name: 'Kangson enrichment site',
    category: 'nuclear',
    lat: 38.957,
    lon: 125.611,
    status: 'Operating',
    note: 'Suspected covert uranium enrichment plant near Pyongyang. Kim Jong Un visited an enrichment facility in 2024 in a rare public photo-op.',
    source: wiki('Kangson_enrichment_site'),
  },
  {
    id: 'punggye-ri',
    name: 'Punggye-ri nuclear test site',
    category: 'nuclear',
    lat: 41.2781,
    lon: 129.0875,
    status: 'Restored, ready for a 7th test',
    note: 'All six nuclear tests (2006-2017) happened here. Tunnels were blown up for cameras in 2018, then repaired.',
    source: wiki('Punggye-ri_Nuclear_Test_Site'),
    more: '/military',
  },
  {
    id: 'pyongsan',
    name: 'Pyongsan uranium mill',
    category: 'nuclear',
    lat: 38.317,
    lon: 126.432,
    approx: true,
    status: 'Operating',
    note: 'Mines and processes uranium ore into yellowcake, the raw material for the enrichment program.',
    source: { label: '38 North', url: 'https://www.38north.org/' },
  },

  // ---- missile & space ----
  {
    id: 'sohae',
    name: 'Sohae Satellite Launching Station',
    category: 'missile',
    lat: 39.66,
    lon: 124.705,
    status: 'Operating, expanding',
    note: 'Main space launch site, also used for rocket engine tests. Launched the Malligyong-1 spy satellite in 2023.',
    source: wiki('Sohae_Satellite_Launching_Station'),
    more: '/missiles',
  },
  {
    id: 'tonghae',
    name: 'Tonghae Satellite Launching Ground',
    category: 'missile',
    lat: 40.8583,
    lon: 129.6864,
    status: 'Mostly idle',
    note: 'East coast launch site used for early long-range rocket tests (1998, 2006, 2009).',
    source: wiki('Tonghae_Satellite_Launching_Ground'),
    more: '/missiles',
  },
  {
    id: 'sinpo',
    name: 'Sinpo shipyard',
    category: 'missile',
    lat: 40.0347,
    lon: 128.1856,
    status: 'Operating',
    note: 'Submarine base and shipyard where submarine-launched ballistic missiles (Pukguksong) are built and tested.',
    source: wiki('Sinpo'),
    more: '/missiles',
  },
  {
    id: 'kusong',
    name: 'Kusong testing ground',
    category: 'missile',
    lat: 40.01325,
    lon: 125.22302,
    status: 'Operating',
    note: 'Inland missile test area used for Hwasong-12 and other launches.',
    more: '/missiles',
  },
  {
    id: 'sunan',
    name: 'Sunan (Pyongyang airport)',
    category: 'missile',
    lat: 39.203,
    lon: 125.7093,
    status: 'Operating',
    note: 'Pyongyang’s international airport doubles as an ICBM launch pad. Several Hwasong-15 and -17 shots were fired from here.',
    more: '/missiles',
  },

  // ---- regime ----
  {
    id: 'kumsusan',
    name: 'Kumsusan Palace of the Sun',
    category: 'regime',
    lat: 39.0642,
    lon: 125.7875,
    note: 'Mausoleum where the embalmed bodies of Kim Il Sung and Kim Jong Il lie in state.',
    source: wiki('Kumsusan_Palace_of_the_Sun'),
  },
  {
    id: 'kim-il-sung-square',
    name: 'Kim Il Sung Square',
    category: 'regime',
    lat: 39.0195,
    lon: 125.7525,
    note: 'Site of the military parades where new missiles are often shown for the first time.',
    source: wiki('Kim_Il_Sung_Square'),
  },
  {
    id: 'ryugyong',
    name: 'Ryugyong Hotel',
    category: 'regime',
    lat: 39.0367,
    lon: 125.7308,
    note: '105-story pyramid started in 1987 and still not open. A symbol of the regime’s priorities.',
    source: wiki('Ryugyong_Hotel'),
  },

  // ---- border ----
  {
    id: 'hyesan',
    name: 'Hyesan',
    category: 'border',
    lat: 41.4,
    lon: 128.1833,
    note: 'Border city on the Yalu, across from China’s Changbai. Historically a major smuggling and crossing point, now heavily fenced.',
    source: wiki('Hyesan'),
    more: '/learn/how-north-koreans-escape',
  },
  {
    id: 'musan',
    name: 'Musan',
    category: 'border',
    lat: 42.0706,
    lon: 129.3389,
    note: 'Mining county on the Tumen River, a common crossing area. Several well-known escapees came from here.',
    source: wiki('Musan_County'),
    more: '/learn/how-north-koreans-escape',
  },
  {
    id: 'hoeryong',
    name: 'Hoeryong',
    category: 'border',
    lat: 42.4333,
    lon: 129.75,
    note: 'Border city on the Tumen. The river is narrow here, so it was a frequent crossing point before new fences went up after 2020.',
    source: wiki('Hoeryong'),
    more: '/learn/how-north-koreans-escape',
  },
  {
    id: 'sinuiju',
    name: 'Sinuiju–Dandong bridge',
    category: 'border',
    lat: 40.115,
    lon: 124.3925,
    note: 'The Friendship Bridge over the Yalu. Most legal trade with China goes through here, and so does a lot of smuggled media.',
    source: wiki('Sino-Korean_Friendship_Bridge'),
  },
  {
    id: 'jsa',
    name: 'Panmunjom (Joint Security Area)',
    category: 'border',
    lat: 37.9558,
    lon: 126.6767,
    note: 'The truce village in the DMZ. A soldier escaped across it under fire in 2017.',
    source: wiki('Joint_Security_Area'),
  },

  // ---- economy ----
  {
    id: 'musan-mine',
    name: 'Musan iron mine',
    category: 'economy',
    lat: 42.2319,
    lon: 129.2692,
    note: 'One of the largest open-pit iron mines in Asia. Ore exports to China were a big source of hard currency before sanctions.',
    source: wiki('Musan_mine'),
  },
  {
    id: 'kaesong-ic',
    name: 'Kaesong Industrial Region',
    category: 'economy',
    lat: 37.9333,
    lon: 126.6333,
    status: 'Closed since 2016',
    note: 'Joint zone where South Korean companies employed over 50,000 North Korean workers. Shut down in 2016. The North blew up the nearby liaison office in 2020.',
    source: wiki('Kaesong_Industrial_Region'),
  },
  {
    id: 'kalma',
    name: 'Wonsan-Kalma resort',
    category: 'economy',
    lat: 39.19,
    lon: 127.49,
    approx: true,
    status: 'Opened 2025',
    note: 'Beach resort Kim Jong Un pushed for years, opened in 2025 mostly for Russian tourists. Also near a common missile launch area.',
  },
  {
    id: 'rason',
    name: 'Rason special economic zone',
    category: 'economy',
    lat: 42.3444,
    lon: 130.3844,
    note: 'Free trade zone where North Korea borders both China and Russia. The rail and road link to Russia runs through here.',
    source: wiki('Rason'),
  },
];

/**
 * The usual escape route, from the Chinese border to Southeast Asia, then a flight to Seoul.
 * Waypoints are illustrative: real routes change constantly and are kept secret.
 */
export const ESCAPE_ROUTE: { name: string; lat: number; lon: number; note: string }[] = [
  { name: 'Crossing the Yalu or Tumen', lat: 41.4, lon: 128.18, note: 'Most people cross a river into China, usually with a paid broker.' },
  { name: 'Hiding in northeast China', lat: 41.8025, lon: 123.4281, note: 'No legal status. If caught, sent back. Many spend years here.' },
  { name: 'Through southern China', lat: 25.0464, lon: 102.7094, note: 'Days of buses and trains past ID checkpoints and facial recognition.' },
  { name: 'Laos', lat: 17.98, lon: 102.63, note: 'Jungle and river crossings, often at night.' },
  { name: 'Thailand', lat: 13.7525, lon: 100.4942, note: 'Escapees can turn themselves in and are transferred to South Korea.' },
  { name: 'Seoul', lat: 37.56, lon: 126.99, note: 'Three months at the Hanawon resettlement center, then citizenship.' },
];
