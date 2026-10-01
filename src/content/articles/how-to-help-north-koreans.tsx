import Link from 'next/link';
import type { Article } from './types';

const article: Article = {
  slug: 'how-to-help-north-koreans',
  title: 'How to Help North Korean People in 2026 (What Actually Works)',
  h1: 'How to help North Korean people',
  description:
    'Concrete ways to help North Koreans in 2026: fund a $3,000 rescue, send USB drives, tutor refugees online, support documentation groups, and press governments.',
  teaser: 'Concrete things that work, with costs. Rescues, USB drives, tutoring escapees, documentation, and pressure on governments.',
  updated: '2026-10-01',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        You can't fix North Korea from your laptop. You can get a specific person out, put a specific USB drive into the country, or keep
        a specific documentation group alive. Most of the groups doing this work are small, and 2025 was the worst funding year they've
        had in a long time, so a little money and time goes further here than in most causes.
      </p>

      <h2>Fund a rescue (about $3,000)</h2>
      <p>
        Most people who escape North Korea cross into China first. In China they have no legal status, and if caught they're sent back to
        face prison or worse. Getting from northern China to safety in Southeast Asia is a roughly 3,000-mile trip through brokers and
        safe houses. <Link href="/organizations#liberty-in-north-korea">Liberty in North Korea</Link> funds these journeys and says each one costs
        about $3,000. It has done more than 1,400 so far. It's getting harder: LiNK's 2025 report says China's biometric checkpoints and
        AI surveillance make every route slower and more expensive.
      </p>

      <h2>Send information in</h2>
      <p>
        Outside information is how North Koreans learn that their government is lying to them.{' '}
        <Link href="/organizations#flash-drives-for-freedom">Flash Drives for Freedom</Link> (run by the Human Rights Foundation) takes donated USB
        drives, wipes them, loads them with films, Korean Wikipedia, news and so on, and partner groups get them into the country. It's
        still running in 2026, with over 140,000 drives donated or pledged. Mailing a few old drives takes ten minutes.
      </p>
      <p>
        Radio matters too, and was hit hardest: Radio Free Asia's Korean service closed in July 2025 after US funding was cut, and South
        Korea ended its own broadcasts. Groups like <Link href="/organizations#unification-media-group">Unification Media Group</Link> still
        broadcast and badly need support.
      </p>

      <h2>Help escapees who already made it</h2>
      <p>
        34,538 North Koreans had reached South Korea by the end of 2025 (224 arrived that year, mostly women). Starting over is hard: new
        language registers, English, job hunting, and trauma. Volunteers can tutor English online through{' '}
        <Link href="/organizations#fsi">Freedom Speakers International</Link> (formerly TNKR) or volunteer with <Link href="/organizations#pscore">PSCORE</Link> in Seoul. If you speak English and
        can commit an hour a week, this is one of the most direct things you can do.
      </p>

      <h2>Keep the evidence</h2>
      <p>
        One day there will be trials, truth commissions and families looking for graves. Groups like{' '}
        <Link href="/organizations#nkdb">NKDB</Link>, <Link href="/organizations#tjwg">TJWG</Link> and{' '}
        <Link href="/organizations#korea-future">Korea Future</Link> interview escapees and map prisons and execution sites now, so that record exists.
        Several lost US grants in 2025.
      </p>

      <h2>Use your voice</h2>
      <ul>
        <li>Ask your representatives to fund broadcasting into North Korea and to restore support for human rights groups.</li>
        <li>Push for pressure on China to stop forcibly sending escapees back (it sent back an estimated 500-600 people in October 2023).</li>
        <li>Share escapee stories and books (our <Link href="/library">library</Link> has a list). Most people's picture of North Korea is memes.</li>
      </ul>

      <h2>If you have a specific skill</h2>
      <ul>
        <li>
          <b>Developers and data people:</b> this site is open source. Add data, fix facts, build tools.{' '}
          <a href="https://github.com/Ahmet-Dedeler/free-north-korea">GitHub</a>.
        </li>
        <li>
          <b>Korean speakers:</b> translation is a constant bottleneck for documentation groups and media projects.
        </li>
        <li>
          <b>Writers and creators:</b> good English-language content on North Korea is rare. Search results for "how to free North Korea"
          are almost empty.
        </li>
      </ul>

      <h2>Be careful with</h2>
      <p>
        Aid that goes through the regime without monitoring, and groups that won't say what they actually do or how much it costs. Ask for
        numbers. The good ones publish them.
      </p>
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
    { label: 'Flash Drives for Freedom', url: 'https://flashdrivesforfreedom.org/' },
    { label: 'Korea Times: 224 North Korean defectors entered South Korea in 2025', url: 'https://www.koreatimes.co.kr/foreignaffairs/northkorea/20260120/224-n-korean-defectors-enter-s-korea-in-2025' },
    { label: 'LiNK: crisis for North Korean human rights NGOs', url: 'https://libertyinnorthkorea.org/blog/crisis-for-north-korean-human-rights-ngos-urgent-support-needed' },
  ],
};

export default article;
