import Link from 'next/link';
import { Footprints, HandCoins } from 'lucide-react';
import { HelpMenu, OrgActions, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import type { Article } from './types';

const article: Article = {
  slug: 'how-to-help-north-koreans',
  title: 'How to Help North Korean People in 2026 (What Actually Works)',
  h1: 'How to help North Korean people',
  description:
    'Concrete ways to help North Koreans in 2026: fund a $3,000 rescue, send USB drives, tutor refugees online, support documentation groups, and press governments.',
  teaser: 'Concrete things that work, with costs. Rescues, USB drives, tutoring escapees, documentation, and pressure on governments.',
  updated: '2026-10-05',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        You can't fix North Korea from your laptop. But you can get one specific person out, put one specific USB drive into the country,
        or keep one small documentation group alive for another year. And most of the groups doing this are tiny, and 2025 was their worst
        funding year in a long time, so a bit of money or time probably goes further here than in most causes.
      </p>

      <HelpMenu />

      <h2 id="rescue">Fund a rescue (about $3,000)</h2>
      <p>
        Most people who escape cross into China first. There they have no legal status, and if they're caught they get sent back to face
        prison or worse. Getting from northern China to safety in Southeast Asia is a roughly 3,000-mile trip through brokers and safe
        houses.
      </p>
      <Stats
        items={[
          { icon: HandCoins, value: '~$3,000', label: 'to fund one rescue', note: 'Liberty in North Korea' },
          { icon: Footprints, value: '1,400+', label: 'people rescued by LiNK so far', note: 'LiNK, 2026' },
        ]}
      />
      <p>
        <OrgLink id="liberty-in-north-korea">Liberty in North Korea</OrgLink> funds these trips. It's getting harder though: LiNK's 2025
        report says China's biometric checkpoints and AI surveillance make every route slower and more expensive.
      </p>
      <OrgActions ids={['liberty-in-north-korea', 'crossing-borders']} />

      <h2 id="information">Send information in</h2>
      <p>
        Outside information is how North Koreans find out their government is lying to them.{' '}
        <OrgLink id="flash-drives-for-freedom">Flash Drives for Freedom</OrgLink> (run by the Human Rights Foundation) takes donated USB
        drives, wipes them, loads them with films, Korean Wikipedia, news etc., and partner groups get them into the country. It's still
        running in 2026, with over 140,000 drives donated or pledged. Mailing a few old drives takes like ten minutes.
      </p>
      <p>
        Radio matters too, and it got hit hardest. Radio Free Asia's Korean service closed in July 2025 after US funding was cut, and South
        Korea ended its own broadcasts. Groups like <OrgLink id="unification-media-group">Unification Media Group</OrgLink> still
        broadcast and really need support.
      </p>
      <OrgActions ids={['flash-drives-for-freedom', 'unification-media-group']} />

      <h2 id="escapees">Help escapees who already made it</h2>
      <p>
        34,538 North Koreans had reached South Korea by the end of 2025 (224 arrived that year, mostly women). Starting over is hard: a
        new version of your own language, English, job hunting, trauma, and family left behind.
      </p>
      <p>
        You can tutor English online through <OrgLink id="fsi">Freedom Speakers International</OrgLink> (formerly TNKR) or volunteer with{' '}
        <OrgLink id="pscore">PSCORE</OrgLink> in Seoul. If you speak English and can do an hour a week, this is one of the most direct
        things you can do (and you actually get to know the person you're helping).
      </p>
      <OrgActions ids={['fsi', 'pscore']} />

      <h2 id="evidence">Keep the evidence</h2>
      <p>
        One day there'll probably be trials, truth commissions and families looking for graves. Groups like{' '}
        <OrgLink id="nkdb">NKDB</OrgLink>, <OrgLink id="tjwg">TJWG</OrgLink> and <OrgLink id="korea-future">Korea Future</OrgLink>{' '}
        interview escapees and map prisons and execution sites now, so that record exists when it's needed. Several of them lost US grants
        in 2025.
      </p>
      <OrgActions ids={['nkdb', 'tjwg', 'korea-future']} />

      <h2 id="voice">Use your voice</h2>
      <ul>
        <li>Ask your representatives to fund broadcasting into North Korea and to restore support for human rights groups.</li>
        <li>Push for pressure on China to stop sending escapees back (it sent back an estimated 500-600 people in October 2023 alone).</li>
        <li>
          Share escapee stories and books (our <Link href="/library">library</Link> has a list). Most people's picture of North Korea is
          memes, so one good book recommendation does more than you'd expect.
        </li>
      </ul>

      <h2>If you have a specific skill</h2>
      <ul>
        <li>
          <b>Developers and data people:</b> this site is open source. Add data, fix facts, build tools on{' '}
          <a href="https://github.com/Ahmet-Dedeler/free-north-korea">GitHub</a>.
        </li>
        <li>
          <b>Korean speakers:</b> translation is a constant bottleneck for documentation groups and media projects.
        </li>
        <li>
          <b>Writers and creators:</b> good English content on North Korea is weirdly rare. Search "how to free North Korea" and see how
          little comes up.
        </li>
      </ul>

      <h2>Be careful with</h2>
      <p>
        Aid that goes through the regime with no monitoring, and groups that won't say what they actually do or what it costs. Ask for
        numbers. The good ones publish them.
      </p>

      <Tldr
        items={[
          'Cheapest: mail an old USB drive to Flash Drives for Freedom. Most direct: ~$3,000 funds a full rescue through LiNK.',
          'If you speak English, an hour a week tutoring an escapee is real, personal help.',
          'These groups are small and lost a lot of funding in 2025, so small amounts matter.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'How much does it cost to rescue a North Korean refugee?',
      a: 'Liberty in North Korea says a rescue from China to safety costs about $3,000. The organization has helped more than 1,400 people escape.',
    },
    {
      q: 'Can I send USB drives to North Korea?',
      a: 'Not directly, but you can mail used USB drives to Flash Drives for Freedom, a Human Rights Foundation project. They wipe the drives, load them with outside content and partner groups get them into North Korea.',
    },
    {
      q: 'How many North Korean defectors live in South Korea?',
      a: 'About 34,500. South Korea’s Unification Ministry counted 34,538 arrivals in total by the end of 2025, including 224 who arrived in 2025.',
    },
  ],
  sources: [
    { label: 'Liberty in North Korea: refugee rescues', url: 'https://libertyinnorthkorea.org/refugee-rescues' },
    { label: 'Liberty in North Korea 2025 annual report', url: 'https://libertyinnorthkorea.org/blog/helping-north-korean-people-win-their-freedom-liberty-in-north-koreas-2025-annual-report' },
    { label: 'Flash Drives for Freedom', url: 'https://flashdrivesforfreedom.org/' },
    { label: 'Korea Times: 224 North Korean defectors entered South Korea in 2025', url: 'https://www.koreatimes.co.kr/foreignaffairs/northkorea/20260120/224-n-korean-defectors-enter-s-korea-in-2025' },
    { label: "NBC News: 600 North Koreans deported from China have 'vanished' (TJWG, Dec 2023)", url: 'https://www.nbcnews.com/news/world/north-koreans-deported-china-vanished-rcna128280' },
    { label: 'LiNK: crisis for North Korean human rights NGOs', url: 'https://libertyinnorthkorea.org/blog/crisis-for-north-korean-human-rights-ngos-urgent-support-needed' },
  ],
};

export default article;
