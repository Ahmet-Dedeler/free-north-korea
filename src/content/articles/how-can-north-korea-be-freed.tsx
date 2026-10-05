import Link from 'next/link';
import { Radiation, Bitcoin, Undo2 } from 'lucide-react';
import { FivePaths, HelpMenu, Stats, Tldr } from '@/components/ArticleBlocks';
import PersonLink from '@/components/PersonLink';
import type { Article } from './types';

const article: Article = {
  slug: 'how-can-north-korea-be-freed',
  title: 'How Can North Korea Be Freed? Realistic Paths in 2026',
  h1: 'How can North Korea be freed?',
  description:
    'The realistic ways North Korea could become free: information, an elite split, reform, collapse or outside pressure. What seems to move things in 2026, and what you can do.',
  teaser: 'Five ways the regime could end or open up, roughly how likely each one is, and which ones normal people can actually push on.',
  updated: '2026-10-05',
  minutes: 8,
  body: () => (
    <>
      <p className="lede">
        Could someone just invade North Korea and free it? Probably not. North Korea has around 60 nuclear warheads, and Seoul (about 10
        million people) sits within range of thousands of its artillery pieces. A war would likely kill a huge number of people on both
        sides before anyone got freed.
      </p>
      <p>
        So when people say "freeing North Korea" they usually mean something slower: the people inside getting enough information, money
        and room to change things themselves, or the regime cracking on its own. That sounds kinda hopeless. I don't think it is though.
        East Germany looked permanent in the summer of 1989, and the Berlin Wall was open by November.
      </p>
      <p>
        Nobody knows which of these happens, or when (anyone who tells you a date is guessing). But these are the five paths people who
        study North Korea take seriously, roughly in the order I'd bet on them:
      </p>

      <FivePaths />

      <h2 id="information">1. Information gets in, and loyalty leaks out</h2>
      <p>
        The whole system runs on controlling what 26 million people know. Kids grow up being told that South Koreans are poor and the
        outside world wants to destroy them. If people stop believing that, I guess obedience gets a lot more expensive to buy.
      </p>
      <p>
        And it's already leaking. After the famine in the 1990s, private markets (jangmadang) spread across the country, and with them
        came USB sticks, SD cards and Chinese phones full of South Korean dramas, K-pop and news. Surveys of escapees keep finding that a
        lot of them watched foreign media before they left, and many say it's part of why they left.
      </p>
      <p>
        The regime clearly sees this as a threat. Its 2020 law on "reactionary ideology" gives 5 to 10 years of labor for watching South
        Korean media (more in "serious" cases) and allows the death penalty for spreading it on a large scale, and a 2025 UN report found people really
        were executed for it. You probably don't write laws like that against something that isn't spreading.
      </p>
      <p>
        This is also the path outsiders can push on most directly: radio, USB drives, and the people who make the content. More in{' '}
        <Link href="/learn/information-into-north-korea">how information gets into North Korea</Link>.
      </p>

      <h2 id="split">2. A split at the top</h2>
      <p>
        Most dictatorships end because the people around the dictator stop backing him, not because of a big uprising. In North Korea
        that'd be the army, the secret police (the Ministry of State Security) and the party elite in Pyongyang.
      </p>
      <p>
        <PersonLink id="kim-jong-un">Kim Jong Un</PersonLink> seems very aware of this. He had his uncle{' '}
        <PersonLink id="jang-song-thaek">Jang Song Thaek</PersonLink> executed in 2013 and his half-brother{' '}
        <PersonLink id="kim-jong-nam">Kim Jong Nam</PersonLink> killed with VX nerve agent in 2017. Purges keep everyone scared. But a
        succession crisis (Kim getting sick, an heir nobody agrees on, etc.) is exactly the kind of moment when a split becomes possible.
        And loyalty at the top isn't total: deputy ambassador <PersonLink id="thae-yong-ho">Thae Yong-ho</PersonLink> defected in 2016.
      </p>
      <p>Outsiders can't really push this one. Which is kind of the frustrating part.</p>

      <h2 id="reform">3. Reform from the inside (the China route)</h2>
      <p>
        A future leader could open up the economy and keep power, the way China did after 1978. That wouldn't be freedom, but life would
        probably get a lot better for normal people. North Korea tried small market reforms in 2002 and again in 2012-2014, and pulled
        back both times (markets create people with their own money and their own information, which is the exact thing the regime is
        scared of).
      </p>
      <p>
        Right now it's going the other way. In 2024 Kim declared South Korea a separate "hostile state", dropped peaceful reunification
        as a goal and had the Arch of Reunification in Pyongyang torn down.
      </p>

      <h2 id="collapse">4. Collapse</h2>
      <p>
        Famine, an economic crash or a failed succession could bring the state down suddenly. This is the scenario South Korean and US
        planners actually prepare for, and it's messy: loose nuclear material, refugees heading for China and South Korea, and the big
        question of whether China sends troops in. Collapse isn't the same as freedom. The first few months would matter a lot.
      </p>
      <p>
        That's one reason documentation groups like <Link href="/organizations">NKDB, TJWG and HRNK</Link> matter so much. If the
        regime falls, someone will need records of who ran the camps, who was killed and where they're buried. That evidence has to be
        collected now, while the witnesses are still alive.
      </p>

      <h2 id="pressure">5. Outside pressure</h2>
      <p>
        Sanctions and UN pressure don't free anyone by themselves. What they can do is make weapons more expensive and cut the money that
        keeps the elite loyal. And the regime's newer income is kind of wild: crypto theft, plus selling shells, missiles and soldiers to
        Russia for the war in Ukraine.
      </p>
      <Stats
        items={[
          { icon: Bitcoin, value: '$1.5B', label: 'stolen from Bybit by North Korean hackers', note: 'Feb 2025', tone: 'danger' },
          { icon: Undo2, value: '500-600', label: 'escapees China sent back in one sweep', note: 'Oct 2023, estimate', tone: 'danger' },
          { icon: Radiation, value: '~60', label: 'nuclear warheads', note: 'SIPRI, Jan 2026' },
        ]}
      />
      <p>
        Then there's China. It sends escapees back to North Korea, where they face prison camps or worse. Getting Beijing to stop would
        save lives directly. Not easy obviously, but it's one of the few levers governments really have.
      </p>

      <h2>What probably doesn't work</h2>
      <p>
        Some things have been tried a lot and haven't moved much, at least so far: waiting for the regime to reform itself, treating North
        Korea purely as a nuclear negotiation (and kind of forgetting the 26 million people), and aid that goes through the regime with no
        monitoring, which tends to feed the elite and the army first.
      </p>
      <p>
        And war, for the reasons above. People who study this disagree about a lot of things, but I haven't found many who think a war
        would leave North Koreans better off.
      </p>

      <h2>So what can one person do?</h2>
      <p>
        More than you'd think, honestly, because the stuff that works here is cheap and badly underfunded. In 2025 the US cut Radio Free
        Asia's Korean service (it shut down in July 2025) and froze grants to North Korea human rights groups, and South Korea stopped its
        own broadcasts and asked activists to stop sending balloons. So the pipeline into the country is weaker right now than it's been
        in years.
      </p>
      <HelpMenu base="/learn/how-to-help-north-koreans" />
      <p>
        Each of those is explained (with costs) in <Link href="/learn/how-to-help-north-koreans">how to help North Koreans</Link>, and
        everything sorted by how much time you have is on the <Link href="/act">take action page</Link>.
      </p>

      <Tldr
        items={[
          'A war to free North Korea would probably kill more people than it saves, so most realistic paths go through change inside the country.',
          'Information getting in is the one path outsiders can push on directly, and it got a lot weaker after the 2025 funding cuts.',
          'Nobody knows when. East Germany looked permanent until it suddenly didn’t.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'Can North Korea be freed by military force?',
      a: 'Probably not without a disaster. North Korea has around 60 nuclear warheads and thousands of artillery pieces within range of Seoul, a city of about 10 million people. A war would likely kill huge numbers of civilians on both sides of the border, which is why most serious paths to freedom run through change inside the country.',
    },
    {
      q: 'What is the most likely way North Korea changes?',
      a: 'Nobody knows for sure. Many analysts point to a mix of internal pressure and an elite split, often around a leadership succession. Foreign information and private markets weaken the loyalty the regime depends on, which could make a split at the top more likely when a crisis comes.',
    },
    {
      q: 'How can an ordinary person help free North Korea?',
      a: 'Fund refugee rescues (about $3,000 each through Liberty in North Korea), donate USB drives or money for sending information into the country, support documentation groups that record abuses, and ask your government to fund broadcasting into North Korea and press China to stop forced repatriation.',
    },
    {
      q: 'Does North Korea still want reunification with South Korea?',
      a: 'Officially, no. In 2024 Kim Jong Un declared South Korea a separate hostile state, dropped peaceful reunification as a goal and had the Arch of Reunification in Pyongyang demolished.',
    },
  ],
  sources: [
    { label: 'SIPRI Yearbook 2026, World nuclear forces', url: 'https://www.sipri.org/media/press-release/2026/increasing-focus-nuclear-weapons-amid-heightened-escalation-risks-new-sipri-yearbook-out-now' },
    { label: 'Human Rights Watch: North Korea "lost decade" (UN report, Sept 2025)', url: 'https://www.hrw.org/news/2025/09/16/north-korea-lost-decade-of-rights-abuses' },
    { label: "HRW: North Korea's window on the world is at risk of closing (2025)", url: 'https://www.hrw.org/news/2025/07/21/north-koreas-window-on-the-world-is-at-risk-of-closing' },
    { label: 'FBI: North Korea responsible for $1.5 billion Bybit hack (Feb 2025)', url: 'https://www.ic3.gov/PSA/2025/PSA250226' },
    { label: "NBC News: 600 North Koreans deported from China have 'vanished' (TJWG, Dec 2023)", url: 'https://www.nbcnews.com/news/world/north-koreans-deported-china-vanished-rcna128280' },
    { label: 'Wikipedia: Law on Rejecting Reactionary Ideology and Culture (2020)', url: 'https://en.wikipedia.org/wiki/Law_on_Rejecting_Reactionary_Ideology_and_Culture' },
    { label: 'Wikipedia: Fall of the Berlin Wall', url: 'https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall' },
    { label: 'Liberty in North Korea 2025 annual report', url: 'https://libertyinnorthkorea.org/blog/helping-north-korean-people-win-their-freedom-liberty-in-north-koreas-2025-annual-report' },
    { label: 'KEI: How closing VOA and RFA undermines US influence in North Korea', url: 'https://keia.org/the-peninsula/how-closing-voa-and-rfa-undermines-u-s-influence-in-north-korea/' },
  ],
};

export default article;
