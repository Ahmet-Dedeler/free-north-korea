import Link from 'next/link';
import type { Article } from './types';

const article: Article = {
  slug: 'how-can-north-korea-be-freed',
  title: 'How Can North Korea Be Freed? Realistic Paths in 2026',
  h1: 'How can North Korea be freed?',
  description:
    'The realistic ways North Korea could become free: collapse, elite split, reform or information pressure. What actually moves things in 2026, and what you can do.',
  teaser: 'Five ways the regime could end or open up, how likely each one is, and which ones ordinary people can actually push on.',
  updated: '2026-10-01',
  minutes: 9,
  body: () => (
    <>
      <p className="lede">
        Nobody is going to invade North Korea to free it. A war on the peninsula would kill hundreds of thousands of people in the first
        days, and the regime has around 60 nuclear warheads. So "freeing North Korea" in practice means one thing: the people inside
        the country getting enough room, information and leverage to change their own government, or the regime cracking on its own.
      </p>
      <p>
        That sounds slow and abstract. It isn't hopeless though. Regimes that looked permanent fell fast before (East Germany in 1989
        went from "stable" to gone in about a month). Below are the paths people who study North Korea actually take seriously, roughly
        from most to least likely to matter.
      </p>

      <h2>1. Information gets in, and loyalty leaks out</h2>
      <p>
        The Kim family's power rests on control of what 26 million people know. Most North Koreans are taught that South Koreans are
        starving and that the outside world is hostile. When that story breaks, obedience gets more expensive to buy.
      </p>
      <p>
        It is already breaking. Since the famine of the 1990s, private markets (jangmadang) spread across the country, and with them came
        USB sticks, SD cards and Chinese phones loaded with South Korean dramas, music and news. Surveys of escapees consistently show that
        a large share watched foreign media before leaving, and many say it is part of why they left.
      </p>
      <p>
        The regime knows this. It passed the Reactionary Ideology and Culture Rejection Act in 2020, which makes distributing South
        Korean media punishable by death, and a 2025 UN report found executions for "distribution of unauthorized media" are real, not
        theoretical. You don't write laws like that against something that isn't working.
      </p>
      <p>
        This is the path outsiders can push on most directly: funding radio broadcasts, USB and SD card drops, and the groups that make
        the content. See <Link href="/learn/information-into-north-korea">how information gets into North Korea</Link>.
      </p>

      <h2>2. A split at the top</h2>
      <p>
        Most dictatorships end because the people around the dictator stop backing him, not because of a mass uprising. In North Korea that
        means the military, the security services (the Ministry of State Security) and the party elite in Pyongyang.
      </p>
      <p>
        Kim Jong Un has worked hard to prevent this. He had his uncle Jang Song Thaek executed in 2013 and his half-brother Kim Jong Nam
        assassinated with VX nerve agent in 2017. Purges keep the elite scared. But a succession crisis (Kim's health, a contested heir)
        is exactly the moment when an elite split becomes possible. Elite defections, like the 2016 defection of deputy ambassador Thae
        Yong-ho, show that loyalty at the top is not total.
      </p>

      <h2>3. Reform from the inside (the China or Vietnam route)</h2>
      <p>
        A future leader could open the economy without giving up power, the way China did after 1978. Life would get a lot better for
        ordinary people, even if it wouldn't be "free" in the full sense. The Kim regime has flirted with market reforms several times
        (2002, 2012-2014) and pulled back each time, because markets also create people with their own money and their own information.
      </p>
      <p>
        Since 2024 the direction has been the opposite: Kim declared South Korea a separate "hostile state", dropped the goal of peaceful
        reunification and demolished the Arch of Reunification in Pyongyang.
      </p>

      <h2>4. Collapse</h2>
      <p>
        Economic collapse, famine or a failed succession could bring the state down suddenly. This is the scenario South Korean and US
        planners prepare for, and it is messy: loose nuclear material, refugee flows into China and South Korea, and the question of
        whether China would move troops in. Collapse is not the same as freedom, and the first months would matter enormously.
      </p>
      <p>
        One reason documentation groups like <Link href="/organizations">NKDB, TJWG and HRNK</Link> matter: when the regime falls, there will
        need to be records of who ran the camps, who was killed and where the bodies are. Transitional justice starts with evidence
        collected now.
      </p>

      <h2>5. Outside pressure</h2>
      <p>
        Sanctions, UN action and diplomatic pressure don't free anyone by themselves. They raise the cost of the regime's weapons programs
        and cut into the money that keeps the elite loyal. The regime's biggest new income streams are now crypto theft (the Lazarus
        group took about $1.5 billion from Bybit in February 2025) and selling shells, missiles and soldiers to Russia for the war in
        Ukraine. Closing those streams is policy work, but it is real.
      </p>
      <p>
        The other big lever is China. China forcibly sends escapees back to North Korea, where they face prison camps or worse (in October
        2023 China repatriated an estimated 500-600 people in one sweep). Pressure on Beijing to stop forced repatriation would save lives
        directly.
      </p>

      <h2>What doesn't work</h2>
      <p>
        Military action. Waiting for the regime to reform itself. Treating North Korea purely as a nuclear negotiation and forgetting the
        people. Aid that goes through the regime without monitoring tends to feed the elite and the army first.
      </p>

      <h2>So what can one person do?</h2>
      <p>
        More than you'd think, because the effective work here is cheap and badly underfunded. In 2025 the US cut funding for Radio Free
        Asia's Korean service (it shut down in July 2025) and froze grants to North Korea human rights groups, and South Korea stopped
        its own broadcasts and asked activists to stop sending balloons. The information pipeline into the country is weaker right now
        than it has been in years.
      </p>
      <ul>
        <li>
          <b>Fund a rescue.</b> Liberty in North Korea says a rescue costs about $3,000 and has done over 1,400.
        </li>
        <li>
          <b>Send information in.</b> Mail spare USB drives to Flash Drives for Freedom, or donate to groups that broadcast and smuggle
          media.
        </li>
        <li>
          <b>Back the documenters.</b> Small donations to NKDB, TJWG or Daily NK go a long way after the 2025 grant cuts.
        </li>
        <li>
          <b>Make noise.</b> Ask your representatives to fund broadcasting into North Korea and to press China on forced repatriation.
        </li>
      </ul>
      <p>
        The full list, sorted by how much time you have, is on the <Link href="/act">take action page</Link>.
      </p>
    </>
  ),
  faq: [
    {
      q: 'Can North Korea be freed by military force?',
      a: 'Not realistically. North Korea has around 60 nuclear warheads and thousands of artillery pieces within range of Seoul, a city of about 10 million people. A war would kill huge numbers of civilians on both sides of the border. Nearly every serious path to freedom runs through change inside the country.',
    },
    {
      q: 'What is the most likely way North Korea changes?',
      a: 'Most analysts point to a mix of internal pressure and an elite split, often around a leadership succession. The spread of foreign information and private markets weakens the loyalty the regime depends on, which makes a split at the top more likely when a crisis comes.',
    },
    {
      q: 'How can an ordinary person help free North Korea?',
      a: 'Fund refugee rescues (about $3,000 each through Liberty in North Korea), donate USB drives or money for sending information into the country, support documentation groups that record abuses, and ask your government to fund broadcasting into North Korea and pressure China to stop forced repatriation.',
    },
    {
      q: 'Does North Korea still want reunification with South Korea?',
      a: 'No. In 2024 Kim Jong Un declared South Korea a separate hostile state, dropped peaceful reunification as a goal and had the Arch of Reunification in Pyongyang demolished.',
    },
  ],
  sources: [
    { label: 'SIPRI Yearbook 2026, World nuclear forces', url: 'https://www.sipri.org/media/press-release/2026/increasing-focus-nuclear-weapons-amid-heightened-escalation-risks-new-sipri-yearbook-out-now' },
    { label: 'Human Rights Watch: North Korea "lost decade" (UN report, Sept 2025)', url: 'https://www.hrw.org/news/2025/09/16/north-korea-lost-decade-of-rights-abuses' },
    { label: "HRW: North Korea's window on the world is at risk of closing (2025)", url: 'https://www.hrw.org/news/2025/07/21/north-koreas-window-on-the-world-is-at-risk-of-closing' },
    { label: 'Liberty in North Korea 2025 annual report', url: 'https://libertyinnorthkorea.org/blog/helping-north-korean-people-win-their-freedom-liberty-in-north-koreas-2025-annual-report' },
    { label: 'KEI: How closing VOA and RFA undermines US influence in North Korea', url: 'https://keia.org/the-peninsula/how-closing-voa-and-rfa-undermines-u-s-influence-in-north-korea/' },
  ],
};

export default article;
