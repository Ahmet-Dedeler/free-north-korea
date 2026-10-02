import Link from 'next/link';
import { ArrivalsChart, EscapeRoute } from '@/components/ArticleBlocks';
import { OrgLink, PlaceLink } from '@/components/HoverLinks';
import type { Article } from './types';

const article: Article = {
  slug: 'how-north-koreans-escape',
  title: 'How Do North Koreans Escape? Routes, Costs and Risks',
  h1: 'How North Koreans escape',
  description:
    'How people escape North Korea in 2026: crossing into China, the 3,000-mile route through Southeast Asia, broker costs, forced repatriation, and arrival in South Korea.',
  teaser: 'The river crossing, hiding in China, the 3,000-mile route to Southeast Asia, and why only 224 people made it in 2025.',
  updated: '2026-10-01',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        In 2025, 224 North Koreans reached South Korea. Before the pandemic it was over 1,000 a year, and in 2009 it was nearly 3,000. The
        drop isn't because fewer people want to leave. The border and China both got much harder to get through.
      </p>

      <EscapeRoute />

      <h2 id="border">Step 1: crossing the border</h2>
      <p>
        Almost everyone leaves through China, across the Tumen or Yalu rivers. The usual crossing points are near border towns like <PlaceLink slug="hyesan">Hyesan</PlaceLink>,{" "}
        <PlaceLink slug="musan">Musan</PlaceLink> and <PlaceLink slug="hoeryong">Hoeryong</PlaceLink> (you can see them on the <Link href="/map">intel map</Link>). Since 2020 North Korea has built new fences, added guard
        posts and given border guards shoot-to-kill orders, so crossings now usually need a broker who pays off guards. Prices have gone up
        many times over.
      </p>
      <p>
        Escaping by sea or directly across the DMZ happens, but rarely. Those cases make the news because they are so unusual.
      </p>

      <h2 id="china">Step 2: hiding in China</h2>
      <p>
        China treats North Koreans as illegal economic migrants, not refugees, and sends them back. Women, who make up most escapees (198 of
        the 224 in 2025), are often trafficked into forced marriages or the sex trade. Many live in China for years without papers. China's
        facial recognition, ID checks on buses and trains, and phone tracking now make moving around very hard.
      </p>
      <p>
        If caught, people are repatriated. In October 2023 China sent back an estimated 500-600 people in one operation. Back in North Korea
        they're interrogated, and anyone who had contact with South Koreans or Christians can end up in a <Link href="/learn/north-korea-prison-camps">prison camp</Link>.
      </p>

      <h2 id="route">Step 3: the long route out</h2>
      <p>
        The usual route runs about 3,000 miles south through China to Southeast Asia, often into Laos and then Thailand, where escapees can
        turn themselves in and are eventually sent to South Korea. Mongolia was an alternative route in the past. The trip takes weeks and
        goes through safe houses, buses and jungle crossings. This is the part that rescue groups like{' '}
        <OrgLink id="liberty-in-north-korea">Liberty in North Korea</OrgLink> fund, at about $3,000 per person.
      </p>

      <h2 id="south-korea">Step 4: South Korea</h2>
      <p>
        Escapees are questioned by South Korean intelligence and then spend about three months at Hanawon, a resettlement center, learning
        how to live in a market society. They get South Korean citizenship and some housing and job support. The adjustment is still very
        hard: new technology, different vocabulary, discrimination, and family left behind. Groups like{' '}
        <OrgLink id="fsi">Freedom Speakers International</OrgLink> and <OrgLink id="pscore">PSCORE</OrgLink> help with English,
        education and public speaking.
      </p>

      <h2 id="numbers">The numbers</h2>
      <ArrivalsChart />
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
    { label: 'Liberty in North Korea: refugee rescues', url: 'https://libertyinnorthkorea.org/refugee-rescues' },
    { label: 'Liberty in North Korea 2025 annual report', url: 'https://libertyinnorthkorea.org/blog/helping-north-korean-people-win-their-freedom-liberty-in-north-koreas-2025-annual-report' },
  ],
};

export default article;
