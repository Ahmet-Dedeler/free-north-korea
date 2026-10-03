/**
 * One line per person on /kim-family-tree: what they are doing *now*, with the source it came from.
 * Kept here instead of people.json because these change often (roles, health, whereabouts) and are checked by hand.
 * Re-check when bumping REVIEWED in src/site/config.ts.
 */
export interface NowLine {
  text: string;
  source: { name: string; url: string };
}

export const KIM_FAMILY_NOW: Record<string, NowLine> = {
  'kim-jong-un': {
    text: 'Supreme Leader since 2011. NIS, Sept 2026: over 140 kg, high heart risk.',
    source: { name: 'The Japan Times (NIS briefing)', url: 'https://japantimes.co.jp/news/2026/09/30/asia-pacific/north-korea-leader-obese-seoul-spy' },
  },
  'kim-ju-ae': {
    text: 'Named successor, South Korea’s NIS said in Feb 2026.',
    source: { name: 'BBC News', url: 'https://www.bbc.com/news/articles/cn0e1g7kwglo' },
  },
  'kim-yo-jong': {
    text: 'Heads the party’s General Affairs Department since Feb 2026. Politburo alternate.',
    source: { name: 'Wikipedia: Kim Yo Jong', url: 'https://en.wikipedia.org/wiki/Kim_Yo_Jong' },
  },
  'ri-sol-ju': {
    text: 'First Lady. Appears with Kim Jong Un at state events.',
    source: { name: 'Wikipedia: Ri Sol-ju', url: 'https://en.wikipedia.org/wiki/Ri_Sol-ju' },
  },
  'kim-jong-chol': {
    text: 'No political role. Rarely seen in public.',
    source: { name: 'Wikipedia: Kim Jong-chul', url: 'https://en.wikipedia.org/wiki/Kim_Jong-chul' },
  },
  'kim-sol-song': {
    text: 'Works behind the scenes in party propaganda.',
    source: { name: 'Wikipedia: Kim Sol-song', url: 'https://en.wikipedia.org/wiki/Kim_Sol-song' },
  },
  'kim-han-sol': {
    text: 'In hiding abroad since his father’s murder in 2017.',
    source: {
      name: 'The New Yorker',
      url: 'https://www.newyorker.com/magazine/2020/11/23/the-underground-movement-trying-to-topple-the-north-korean-regime',
    },
  },
  'kim-kyong-hui': {
    text: 'Back in public since 2020. Her husband was executed in 2013.',
    source: { name: 'Wikipedia: Kim Kyong-hui', url: 'https://en.wikipedia.org/wiki/Kim_Kyong-hui' },
  },
  'kim-pyong-il': {
    text: 'Retired diplomat, home since 2019 after 40 years abroad.',
    source: { name: 'Wikipedia: Kim Pyong-il', url: 'https://en.wikipedia.org/wiki/Kim_Pyong-il' },
  },
  'kim-ok': {
    text: 'Out of view since 2011. Reported purged.',
    source: { name: 'Yonhap', url: 'https://en.yna.co.kr/view/AEN20160726002600315' },
  },
  'kim-jong-il': {
    text: 'Died 2011. Kim Jong Un’s father.',
    source: { name: 'Wikipedia: Kim Jong Il', url: 'https://en.wikipedia.org/wiki/Kim_Jong_Il' },
  },
  'kim-jong-nam': {
    text: 'Killed with VX nerve agent at Kuala Lumpur airport in 2017.',
    source: { name: 'Wikipedia: Assassination of Kim Jong-nam', url: 'https://en.wikipedia.org/wiki/Assassination_of_Kim_Jong-nam' },
  },
};
