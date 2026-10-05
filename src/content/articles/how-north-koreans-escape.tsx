import Link from 'next/link';
import { TrendingDown, UserRound, Users } from 'lucide-react';
import { ArrivalsChart, BorderMap, EscapeRoute, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink, PlaceLink } from '@/components/HoverLinks';
import type { Article } from './types';

const article: Article = {
  slug: 'how-north-koreans-escape',
  title: 'How Do North Koreans Escape? Routes, Costs and Risks',
  h1: 'How North Koreans escape',
  description:
    'How people escape North Korea in 2026: crossing into China, the 3,000-mile route through Southeast Asia, broker costs, forced repatriation, and arrival in South Korea.',
  teaser: 'The river crossing, hiding in China, the 3,000-mile route to Southeast Asia, and why only 224 people made it in 2025.',
  updated: '2026-10-05',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        In 2025, 224 North Koreans reached South Korea. Before the pandemic it was over 1,000 a year, and in 2009 it was nearly 3,000. So
        did people stop wanting to leave? Probably not. The border and China both got a lot harder to get through.
      </p>

      <Stats
        items={[
          { icon: TrendingDown, value: '224', label: 'arrived in South Korea in 2025', note: 'Unification Ministry', tone: 'danger' },
          { icon: UserRound, value: '198', label: 'of them were women', note: '2025' },
          { icon: Users, value: '34,538', label: 'arrivals in total', note: 'by end of 2025' },
        ]}
      />

      <EscapeRoute />

      <h2 id="border">Step 1: crossing the border</h2>
      <p>
        Almost everyone leaves through China, across the Tumen or Yalu rivers. The usual crossing areas are near border towns like{' '}
        <PlaceLink slug="hyesan">Hyesan</PlaceLink>, <PlaceLink slug="musan">Musan</PlaceLink> and{' '}
        <PlaceLink slug="hoeryong">Hoeryong</PlaceLink> (also on the <Link href="/map">intel map</Link>).
      </p>
      <BorderMap />
      <p>
        Since 2020 North Korea has built new fences, added guard posts and given border guards shoot-to-kill orders, so now you basically
        need a broker who pays off the guards. Prices have gone up many times over.
      </p>
      <p>Escaping by sea or straight across the DMZ happens too, but rarely. Those cases make the news because they're so unusual.</p>

      <h2 id="china">Step 2: hiding in China</h2>
      <p>
        China treats North Koreans as illegal economic migrants, not refugees, and sends them back. Women (198 of the 224 in 2025) are
        often trafficked into forced marriages or the sex trade, and many live in China for years without papers. Facial recognition, ID
        checks on buses and trains and phone tracking make just moving around really hard now.
      </p>
      <p>
        If they're caught, they're sent back. In October 2023 China sent back an estimated 500-600 people in one operation. Back home
        they're interrogated, and anyone who had contact with South Koreans or Christians can end up in a{' '}
        <Link href="/learn/north-korea-prison-camps">prison camp</Link>.
      </p>

      <h2 id="route">Step 3: the long way out</h2>
      <p>
        The usual route runs about 3,000 miles south through China into Southeast Asia, often Laos and then Thailand, where escapees can
        turn themselves in and eventually get sent to South Korea (Mongolia used to be another option). It takes weeks: safe houses,
        buses, jungle crossings at night. This is the part that rescue groups like{' '}
        <OrgLink id="liberty-in-north-korea">Liberty in North Korea</OrgLink> pay for, about $3,000 per person.
      </p>

      <h2 id="south-korea">Step 4: South Korea</h2>
      <p>
        First South Korean intelligence questions them, then they spend about three months at Hanawon, a resettlement center, learning how
        to live in a market economy. They get citizenship and some help with housing and jobs.
      </p>
      <p>
        It's still really hard. New technology, a lot of different vocabulary (South Korean is full of English words), discrimination, and
        family left behind. Groups like <OrgLink id="fsi">Freedom Speakers International</OrgLink> and{' '}
        <OrgLink id="pscore">PSCORE</OrgLink> help with English, school and public speaking.
      </p>

      <h2 id="numbers">The numbers</h2>
      <p>Hover a bar for the year. The COVID border closure basically stopped everything, and it never really recovered:</p>
      <ArrivalsChart />

      <Tldr
        items={[
          'Almost everyone crosses a river into China, hides, then travels ~3,000 miles to Southeast Asia and on to South Korea.',
          'Only 224 made it in 2025, down from ~3,000 in 2009, because the border and China’s surveillance got so much harder.',
          'About $3,000 funds one rescue. Getting caught in China means being sent back.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'How many North Koreans escape each year?',
      a: 'In 2025, 224 North Koreans reached South Korea, according to the Unification Ministry. That is far below the pre-pandemic level of about 1,000 a year and the 2009 peak of 2,914.',
    },
    {
      q: 'Why does China send North Korean refugees back?',
      a: 'China classifies North Koreans as illegal economic migrants rather than refugees, under an agreement with North Korea. Human rights groups and the UN say this violates the principle of non-refoulement because returnees face torture and imprisonment.',
    },
    {
      q: 'What route do North Korean defectors take?',
      a: 'Most cross a river into China, hide there, and then travel about 3,000 miles south through China into Southeast Asia (often Laos and Thailand), where they can be transferred to South Korea.',
    },
  ],
  sources: [
    { label: 'UPI: defector arrivals fell to 224 in 2025', url: 'https://www.upi.com/Top_News/World-News/2026/01/20/nkorea-defectors-entering-fell-to-244-in-2025-down-from-previous-year/9381768962888/' },
    { label: 'Wikipedia: North Korean defectors (yearly arrivals)', url: 'https://en.wikipedia.org/wiki/North_Korean_defectors' },
    { label: "NBC News: 600 North Koreans deported from China have 'vanished' (TJWG, Dec 2023)", url: 'https://www.nbcnews.com/news/world/north-koreans-deported-china-vanished-rcna128280' },
    { label: 'Liberty in North Korea: refugee rescues', url: 'https://libertyinnorthkorea.org/refugee-rescues' },
    { label: 'Liberty in North Korea 2025 annual report', url: 'https://libertyinnorthkorea.org/blog/helping-north-korean-people-win-their-freedom-liberty-in-north-koreas-2025-annual-report' },
  ],
};

export default article;
