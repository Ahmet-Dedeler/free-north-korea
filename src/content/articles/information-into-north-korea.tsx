import Link from 'next/link';
import { Channels, OrgActions, Timeline, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import type { Article } from './types';

const article: Article = {
  slug: 'information-into-north-korea',
  title: 'How Information Gets Into North Korea: USBs, Radio, Balloons',
  h1: 'How outside information gets into North Korea',
  description:
    'USB drives, SD cards, radio and balloons: how foreign media reaches North Koreans, what changed after the 2025 funding cuts, and how to support it.',
  teaser: 'USB drives, SD cards, shortwave radio and balloons. What still works after the 2025 cuts, and how to support it.',
  updated: '2026-10-05',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        Most of North Korea's 26 million people don't really know what life is like anywhere else, and I'd guess that does more to keep
        the regime alive than any missile. Every channel that carries outside information in chips at that, and it's the one area where
        normal people outside can help directly.
      </p>

      <Channels />

      <h2 id="usb">USB drives and SD cards</h2>
      <p>
        These are the main channel today. A lot of households have a "notel" (a cheap Chinese media player) or a phone that reads SD and
        microSD cards. Drives come in through traders on the Chinese border, hidden in cargo, and then get copied and passed hand to hand.
        A microSD card is tiny and cheap and easy to hide (or swallow), which is why groups switched to them.
      </p>
      <p>
        What's on them? Mostly South Korean dramas and films, K-pop, news, Korean Wikipedia and escapee testimony. Nobody needs to lecture
        anyone. Watching a normal evening in Seoul kind of does that by itself.
      </p>
      <p>
        <OrgLink id="flash-drives-for-freedom">Flash Drives for Freedom</OrgLink> (Human Rights Foundation) collects donated drives and
        says over 140,000 have been donated or pledged. It's still active in 2026 (a lot of people assume it stopped).
      </p>

      <h2 id="radio">Radio</h2>
      <p>
        Official radios are fixed to state channels, but modified or smuggled ones pick up shortwave and medium-wave broadcasts at night.
        And this is the channel that got cut the most in 2025: Radio Free Asia's Korean service shut down on July 17, 2025 after its US
        grants were terminated, Voice of America was gutted, and South Korea's new government ended its own broadcasts and border
        loudspeakers in June 2025. So independent broadcasters like{' '}
        <OrgLink id="unification-media-group">Unification Media Group</OrgLink> are now a much bigger share of what's left.
      </p>

      <h2 id="balloons">Balloons</h2>
      <p>
        Activists in South Korea have floated balloons with leaflets, USB drives, dollar bills and rice over the border for decades. In
        2024 North Korea answered with thousands of trash balloons. In 2025 South Korea's government asked activists to stop and started
        enforcing a ban on launches, and most groups paused. Balloons are the most visible method, but probably not the most effective one.
      </p>

      <h2>What it costs North Koreans</h2>
      <p>A lot. The regime keeps adding laws against exactly this:</p>
      <Timeline
        items={[
          {
            date: 'Dec 2020',
            title: 'Law on Rejecting Reactionary Ideology and Culture',
            text: '5 to 10 years of labor for watching or keeping South Korean media, more in "serious" cases, and the death penalty for spreading it on a large scale.',
            tone: 'danger',
          },
          { date: 'Aug 2022', title: 'The same law is revised', text: 'Tightened two years later.' },
          {
            date: 'Jan 2023',
            title: 'Pyongyang Cultural Language Protection Act',
            text: 'Criminalizes talking like a South Korean (slang, expressions), with death as the maximum penalty.',
            tone: 'danger',
          },
          { date: '2025', title: 'UN report confirms executions', text: 'People were executed for distributing foreign media.', tone: 'danger' },
        ]}
      />
      <p>People do it anyway. I guess that tells you how much they want it.</p>

      <h2>How to help</h2>
      <OrgActions ids={['flash-drives-for-freedom', 'unification-media-group', 'daily-nk']} />
      <ul>
        <li>
          Mail spare USB drives or microSD cards to <a href="https://flashdrivesforfreedom.org/">Flash Drives for Freedom</a>.
        </li>
        <li>
          Donate to the groups that make and smuggle content (the information category on <Link href="/organizations">organizations</Link>).
        </li>
        <li>Ask your government to restore funding for Korean-language broadcasting.</li>
      </ul>

      <Tldr
        items={[
          'USB drives and microSD cards are the main channel now. Radio got cut hard in 2025, balloons mostly stopped.',
          'Watching South Korean media can mean 5 to 10 years of labor, spreading it widely can mean death, and people do it anyway.',
          'Easiest way to help: mail old drives to Flash Drives for Freedom.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'Is Flash Drives for Freedom still active?',
      a: 'Yes. The Human Rights Foundation project was still collecting drives in 2026 and reports more than 140,000 drives donated or pledged.',
    },
    {
      q: 'What happens to North Koreans caught with foreign media?',
      a: 'Under the 2020 Law on Rejecting Reactionary Ideology and Culture, watching or keeping South Korean media can mean 5 to 10 years of labor (more in serious cases), and distributing it on a large scale can be punished by death. A 2025 UN report documented executions for distributing unauthorized media.',
    },
    {
      q: 'Did radio broadcasts into North Korea stop?',
      a: 'Many did. Radio Free Asia’s Korean service shut down in July 2025 after US funding was cut, and South Korea ended its government broadcasts and border loudspeakers in June 2025. Some independent broadcasters continue.',
    },
  ],
  sources: [
    { label: 'Flash Drives for Freedom', url: 'https://flashdrivesforfreedom.org/' },
    { label: "HRW: North Korea's window on the world is at risk of closing", url: 'https://www.hrw.org/news/2025/07/21/north-koreas-window-on-the-world-is-at-risk-of-closing' },
    { label: 'Human Rights Watch: "lost decade" (UN report, Sept 2025)', url: 'https://www.hrw.org/news/2025/09/16/north-korea-lost-decade-of-rights-abuses' },
    { label: 'Wikipedia: Law on Rejecting Reactionary Ideology and Culture', url: 'https://en.wikipedia.org/wiki/Law_on_Rejecting_Reactionary_Ideology_and_Culture' },
    { label: 'Wikipedia: Pyongyang Cultural Language Protection Act', url: 'https://en.wikipedia.org/wiki/Pyongyang_Cultural_Language_Protection_Act' },
    { label: 'AP via KPBS: South Korea halts propaganda broadcasts (June 2025)', url: 'https://www.kpbs.org/news/international/2025/06/11/south-korea-halts-propaganda-broadcasts-along-border-with-rival-north' },
    { label: 'Al Jazeera: Radio Free Asia halts news operations', url: 'https://www.aljazeera.com/news/2025/10/31/radio-free-asia-says-halting-news-operations-due-to-trump-admin-cuts' },
    { label: 'NK News: civic group halts leaflet launches after crackdown', url: 'https://www.nknews.org/2025/07/civic-group-halts-leaflet-launches-toward-north-korea-following-crackdown/' },
  ],
};

export default article;
