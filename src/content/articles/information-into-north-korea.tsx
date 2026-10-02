import Link from 'next/link';
import { Channels, OrgActions } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import type { Article } from './types';

const article: Article = {
  slug: 'information-into-north-korea',
  title: 'How Information Gets Into North Korea: USBs, Radio, Balloons',
  h1: 'How outside information gets into North Korea',
  description:
    'USB drives, SD cards, radio and balloons: how foreign media reaches North Koreans, what changed after the 2025 funding cuts, and how to support it.',
  teaser: 'USB drives, SD cards, shortwave radio and balloons. What still works after the 2025 cuts, and how to support it.',
  updated: '2026-10-01',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        The regime's strongest weapon isn't a missile. It's that most of its 26 million people don't know what life is like anywhere else.
        Every channel that carries outside information in chips at that, and it's the one front where ordinary people outside can help
        directly.
      </p>

      <Channels />

      <h2 id="usb">USB drives and SD cards</h2>
      <p>
        These are the main channel today. Many households have a "notel" (a cheap Chinese media player) or a phone that reads SD and
        microSD cards. Drives come in through traders on the Chinese border, hidden in cargo, and get copied and passed hand to hand. A
        microSD card is tiny, cheap and easy to hide or swallow, which is why groups switched to them.
      </p>
      <p>
        Content is mostly South Korean dramas and films, K-pop, news, Korean Wikipedia, and testimony from escapees. The point isn't to
        lecture. Watching normal life in Seoul does that by itself.
      </p>
      <p>
        <OrgLink id="flash-drives-for-freedom">Flash Drives for Freedom</OrgLink> (Human Rights Foundation) collects donated drives and
        says over 140,000 have been donated or pledged. It's still active in 2026, contrary to what a lot of people assume.
      </p>

      <h2 id="radio">Radio</h2>
      <p>
        Official radios are fixed to state channels, but modified or smuggled radios pick up shortwave and medium-wave broadcasts at night.
        This was the most-cut channel in 2025: Radio Free Asia's Korean service shut down on July 17, 2025 after US grants were terminated,
        Voice of America was gutted, and South Korea's new government ended its own government broadcasts and border loudspeakers in June
        2025. Independent broadcasters like <OrgLink id="unification-media-group">Unification Media Group</OrgLink> are now a much
        bigger share of what's left.
      </p>

      <h2 id="balloons">Balloons</h2>
      <p>
        Activists in South Korea have floated balloons carrying leaflets, USB drives, dollar bills and rice across the border for decades.
        In 2024 North Korea answered with thousands of trash balloons. In 2025 South Korea's government asked activists to stop and began
        enforcing a ban on launches, and most groups paused. Balloons were always the most visible method, not the most effective.
      </p>

      <h2>What it costs North Koreans</h2>
      <p>
        A lot. The 2020 Reactionary Ideology and Culture Rejection Act allows the death penalty for distributing South Korean media and long
        labor camp sentences for watching it. A 2025 UN report confirmed executions for distributing foreign media. People do it anyway,
        which tells you how much they want it.
      </p>

      <h2>How to help</h2>
      <OrgActions ids={['flash-drives-for-freedom', 'unification-media-group', 'daily-nk']} />
      <ul>
        <li>
          Mail spare USB drives or microSD cards to <a href="https://flashdrivesforfreedom.org/">Flash Drives for Freedom</a>.
        </li>
        <li>Donate to the groups that make and smuggle content (see the information category on <Link href="/organizations">organizations</Link>).</li>
        <li>Ask your government to restore funding for Korean-language broadcasting.</li>
      </ul>
    </>
  ),
  faq: [
    {
      q: 'Is Flash Drives for Freedom still active?',
      a: 'Yes. The Human Rights Foundation project was still collecting drives in 2026 and reports more than 140,000 drives donated or pledged.',
    },
    {
      q: 'What happens to North Koreans caught with foreign media?',
      a: 'Under the 2020 Reactionary Ideology and Culture Rejection Act, watching South Korean media can mean years in a labor camp, and distributing it can be punished by death. A 2025 UN report documented executions for distributing unauthorized media.',
    },
    {
      q: 'Did radio broadcasts into North Korea stop?',
      a: 'Many did. Radio Free Asia’s Korean service shut down in July 2025 after US funding was cut, and South Korea ended its government broadcasts and border loudspeakers in June 2025. Some independent broadcasters continue.',
    },
  ],
  sources: [
    { label: 'Flash Drives for Freedom', url: 'https://flashdrivesforfreedom.org/' },
    { label: "HRW: North Korea's window on the world is at risk of closing", url: 'https://www.hrw.org/news/2025/07/21/north-koreas-window-on-the-world-is-at-risk-of-closing' },
    { label: 'AP via KPBS: South Korea halts propaganda broadcasts (June 2025)', url: 'https://www.kpbs.org/news/international/2025/06/11/south-korea-halts-propaganda-broadcasts-along-border-with-rival-north' },
    { label: 'Al Jazeera: Radio Free Asia halts news operations', url: 'https://www.aljazeera.com/news/2025/10/31/radio-free-asia-says-halting-news-operations-due-to-trump-admin-cuts' },
    { label: 'NK News: civic group halts leaflet launches after crackdown', url: 'https://www.nknews.org/2025/07/civic-group-halts-leaflet-launches-toward-north-korea-following-crackdown/' },
  ],
};

export default article;
