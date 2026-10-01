import Link from 'next/link';
import type { Article } from './types';

const article: Article = {
  slug: 'is-it-possible-to-free-north-korea',
  title: 'Is It Possible to Free North Korea? An Honest Answer',
  h1: 'Is it possible to free North Korea?',
  description:
    'Yes, but not on a schedule. Why the Kim regime has lasted 78 years, the cracks that are already showing, and what history says about regimes that looked permanent.',
  teaser: 'Why the regime has lasted since 1948, the cracks that are already there, and what history says about "permanent" dictatorships.',
  updated: '2026-10-01',
  minutes: 7,
  body: () => (
    <>
      <p className="lede">
        Yes. Every dictatorship ends eventually, and North Korea has more cracks now than at any point since the 1990s famine. What
        nobody can tell you is when. Anyone who gives you a date is guessing.
      </p>

      <h2>Why the regime has lasted so long</h2>
      <p>
        The Kim family has ruled since 1948, through three generations. That is longer than the Soviet Union lasted after Stalin. A few
        things explain it:
      </p>
      <ul>
        <li>
          <b>Total information control.</b> No open internet, radios fixed to state channels, and a population taught from childhood that
          the outside world is worse off.
        </li>
        <li>
          <b>Songbun.</b> Every family is ranked by its loyalty to the regime going back generations. Your rank decides where you can live,
          whether you can go to university and whether you can join the party.
        </li>
        <li>
          <b>Collective punishment.</b> If one person commits a political crime, up to three generations of their family can be sent to a
          prison camp. This makes organizing almost impossible, because nobody risks only themselves.
        </li>
        <li>
          <b>China.</b> China supplies most of North Korea's trade and fuel and sends escapees back. A collapsed North Korea would put US
          allies on China's border, so Beijing keeps it alive.
        </li>
        <li>
          <b>Nuclear weapons.</b> Around 60 warheads (SIPRI, January 2026) make outside regime change unthinkable. That is exactly why the
          regime built them.
        </li>
      </ul>

      <h2>The cracks that are already there</h2>
      <p>
        <b>Markets.</b> After the state ration system collapsed in the 1990s famine, people survived by trading. Most household income now
        comes from private markets (jangmadang), not the state. People who feed themselves depend less on the regime and see it more
        clearly.
      </p>
      <p>
        <b>Foreign media.</b> South Korean dramas and music spread through USB sticks and SD cards, and young North Koreans have picked up
        South Korean slang. The regime responded with laws (2020, 2021, 2023) punishing South Korean media, slang and even hairstyles, some
        with the death penalty. Those laws are a sign that it is losing that fight.
      </p>
      <p>
        <b>The jangmadang generation.</b> People born after the famine grew up relying on markets, not the state, and many of them have
        never believed the propaganda the way their parents did.
      </p>
      <p>
        <b>Soldiers abroad.</b> Since late 2024 North Korea has sent more than 20,000 troops to fight for Russia, and Ukrainian and South
        Korean intelligence estimate around 6,000-7,000 were killed or wounded. Thousands of young men have now seen another country, and
        some have been captured and asked not to be sent back.
      </p>

      <h2>What history says</h2>
      <p>
        In 1988 almost nobody predicted that the communist regimes of Eastern Europe would be gone within two years. Romania's
        Ceaușescu was cheered at a rally in December 1989 and executed a week later. East Germany had one of the biggest secret police
        forces in history (the Stasi) and still fell in weeks once people stopped being afraid at the same time.
      </p>
      <p>
        North Korea is harder than those cases. It is more isolated, more brutal, and has a powerful patron next door that doesn't want it
        to fall. But the general lesson holds: these regimes look stable right up until they don't, and the thing that changes is usually
        what ordinary people believe about each other.
      </p>

      <h2>What makes freedom more likely</h2>
      <p>
        Anything that spreads information inside the country, gets people out alive, keeps evidence of crimes for later, or cuts the
        regime's money. Those are also the things individual people can actually support. Read{' '}
        <Link href="/learn/how-can-north-korea-be-freed">how North Korea could be freed</Link> for the specific paths, or jump to{' '}
        <Link href="/act">what you can do</Link>.
      </p>
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
  ],
};

export default article;
