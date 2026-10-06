import Link from 'next/link';
import { Handshake, ListOrdered, Radiation, RadioTower, Sprout, Store, Swords, Usb, Users } from 'lucide-react';
import { Dynasty, IconCards, Timeline, Tldr } from '@/components/ArticleBlocks';
import type { Article } from './types';

const article: Article = {
  slug: 'is-it-possible-to-free-north-korea',
  title: 'Is It Possible to Free North Korea? An Honest Answer',
  h1: 'Is it possible to free North Korea?',
  description:
    'Probably yes, but not on a schedule. Why the Kim regime has lasted 78 years, the cracks that are already showing, and what 1989 says about regimes that looked permanent.',
  teaser: 'Why the regime has lasted since 1948, the cracks that are already there, and what history says about "permanent" dictatorships.',
  updated: '2026-10-05',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        Probably yes, eventually. Every dictatorship ends at some point, and North Korea has more cracks now than at any time since the
        1990s famine. What nobody can tell you is when. People predicted collapse in the 1990s and again after 2011, and they were wrong
        both times.
      </p>

      <h2>Why has it lasted so long?</h2>
      <p>
        The Kim family has ruled since 1948. Three generations, 78 years. That's twice as long as the Soviet Union lasted after Stalin
        died (1953 to 1991).
      </p>
      <Dynasty />
      <p>A few things hold it up, and they kind of feed each other:</p>
      <IconCards
        tone="danger"
        items={[
          { icon: RadioTower, title: 'Total information control', children: 'No open internet, radios fixed to state channels, and kids taught from day one that the outside world is worse off.' },
          { icon: ListOrdered, title: 'Songbun', children: 'Every family is ranked by its loyalty going back generations. Your rank decides where you live, whether you go to university and whether you can join the party.' },
          { icon: Users, title: 'Collective punishment', stat: { value: '3', unit: 'generations' }, children: 'One political crime can send up to three generations of a family to a prison camp. Nobody only risks themselves, so organizing anything is almost impossible.' },
          { icon: Handshake, title: 'China', children: "China supplies most of North Korea's trade and fuel and sends escapees back. A collapsed North Korea would put US allies on its border, so Beijing keeps it alive." },
          { icon: Radiation, title: 'Nuclear weapons', stat: { value: '~60', unit: 'warheads' }, children: 'Around 60 warheads (SIPRI, January 2026) make outside regime change basically unthinkable. Which is probably the whole point of building them.' },
        ]}
      />

      <h2>The cracks that are already there</h2>
      <IconCards
        tone="ok"
        items={[
          {
            icon: Store,
            title: 'Markets',
            children:
              'When the ration system collapsed in the 1990s famine, people survived by trading. Most household income now comes from private markets (jangmadang), not the state. People who feed themselves need the regime less, and probably see it more clearly.',
          },
          {
            icon: Usb,
            title: 'Foreign media',
            children:
              'South Korean dramas and music spread on USB sticks and SD cards, and young people picked up South Korean slang. The regime answered with laws in 2020, 2021 and 2023 punishing South Korean media, slang and even hairstyles, some with death. Not exactly what a confident government does.',
          },
          {
            icon: Sprout,
            title: 'The jangmadang generation',
            children: 'People born after the famine grew up relying on markets, not the state. A lot of them seem to never have believed the propaganda the way their parents did.',
          },
          {
            icon: Swords,
            title: 'Soldiers abroad', stat: { value: '20,000+', unit: 'troops sent to Russia' },
            children:
              'Since late 2024 more than 20,000 troops went to fight for Russia, and Ukrainian and South Korean intelligence estimate about 6,000-7,000 were killed or wounded. Thousands of young men have now seen another country, and some captured soldiers asked not to be sent back.',
          },
        ]}
      />

      <h2>What history says</h2>
      <p>
        In 1988 almost nobody predicted that the communist governments of Eastern Europe would be gone two years later. Then it happened
        really fast:
      </p>
      <Timeline
        items={[
          { date: '9 Nov 1989', title: 'The Berlin Wall opens', text: 'East Germany had one of the biggest secret police forces in history (the Stasi). It still fell within weeks once people stopped being scared at the same time.' },
          { date: '21 Dec 1989', title: "Ceaușescu's rally turns on him", text: 'A staged rally in Bucharest, broadcast live on state TV, turned into booing in the middle of his speech.', tone: 'warn' },
          { date: '25 Dec 1989', title: 'Ceaușescu is executed', text: 'Four days after that speech.', tone: 'danger' },
          { date: '26 Dec 1991', title: 'The Soviet Union dissolves', text: 'Two years after that, the whole bloc was gone.' },
        ]}
      />
      <p>
        North Korea is harder than those cases, I think. It's more isolated, more brutal, and it has a powerful neighbor that doesn't want
        it to fall. But the pattern seems to hold: these regimes look stable right up until they don't, and the thing that changes is
        usually what ordinary people believe about each other (once everyone realizes everyone else is also done, fear stops working).
      </p>

      <h2>So what makes freedom more likely?</h2>
      <p>
        Anything that spreads information inside the country, gets people out alive, keeps evidence of crimes for later, or cuts the
        regime's money. Conveniently, those are also the things normal people can support. The specific paths are in{' '}
        <Link href="/learn/how-can-north-korea-be-freed">how North Korea could be freed</Link>, and the practical stuff is on{' '}
        <Link href="/act">what you can do</Link>.
      </p>

      <Tldr
        items={[
          'Probably yes. Every dictatorship ends, but nobody can tell you when.',
          'The regime lasts because of information control, collective punishment, China and nukes. Markets, foreign media and soldiers abroad are wearing at that.',
          'Eastern Europe looked permanent in 1988 and was gone by 1991.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'How long has the Kim regime ruled North Korea?',
      a: 'Since 1948. Kim Il Sung ruled until 1994, Kim Jong Il until 2011, and Kim Jong Un since then.',
    },
    {
      q: 'Will North Korea collapse soon?',
      a: 'Nobody knows. Predictions of collapse in the 1990s and after 2011 were wrong. The regime has real weaknesses (markets, foreign media, a costly war role for Russia), but timing depends on events like a succession crisis that are impossible to forecast.',
    },
    {
      q: 'Why does China support North Korea?',
      a: 'China does not want a collapsed North Korea on its border, refugee flows, or a unified Korea allied with the United States. So it supplies most of the North’s trade and fuel and forcibly repatriates people who escape.',
    },
  ],
  sources: [
    { label: 'SIPRI Yearbook 2026 press release', url: 'https://www.sipri.org/media/press-release/2026/increasing-focus-nuclear-weapons-amid-heightened-escalation-risks-new-sipri-yearbook-out-now' },
    { label: 'HRW World Report 2026: North Korea', url: 'https://www.hrw.org/world-report/2026/country-chapters/north-korea' },
    { label: 'Kyiv Independent: North Korean troops in Kursk at start of 2026', url: 'https://kyivindependent.com/nearly-11-000-north-korean-troops-stationed-in-russias-kursk-oblast-at-start-of-2026-media-reports/' },
    { label: 'UN Commission of Inquiry report (2014)', url: 'https://en.wikipedia.org/wiki/Report_of_the_Commission_of_Inquiry_on_Human_Rights_in_the_Democratic_People%27s_Republic_of_Korea' },
    { label: 'Wikipedia: Romanian revolution (1989)', url: 'https://en.wikipedia.org/wiki/Romanian_revolution' },
    { label: 'Wikipedia: Fall of the Berlin Wall', url: 'https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall' },
    { label: 'Wikipedia: Dissolution of the Soviet Union', url: 'https://en.wikipedia.org/wiki/Dissolution_of_the_Soviet_Union' },
  ],
};

export default article;
