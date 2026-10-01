import { Ext } from '@/components/Ext';
import { REPO_URL } from '@/site/config';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'How to Help Free North Korea: Things You Can Do Today',
  description:
    'Practical ways to help North Koreans, sorted by how much time you have: mail USB drives, fund a $3,000 rescue, tutor escapees online, contact lawmakers, contribute code.',
  path: '/act',
});

type Step = { title: string; text: string; href: string; cta: string; ext?: boolean };

const GROUPS: { time: string; intro: string; steps: Step[] }[] = [
  {
    time: '5 minutes',
    intro: 'Small, but real.',
    steps: [
      {
        title: 'Give to a rescue',
        text: 'Each rescue from China to safety costs about $3,000. $25 is a real share of one.',
        href: 'https://libertyinnorthkorea.org/donate',
        cta: 'Liberty in North Korea',
        ext: true,
      },
      {
        title: 'Share one explainer',
        text: 'Most people know North Korea from memes. Send someone a page that tells them what is actually going on.',
        href: '/learn/how-can-north-korea-be-freed',
        cta: 'How could North Korea be freed?',
      },
      {
        title: 'Star and share this project',
        text: 'Search results for "how to free North Korea" are almost empty. Links and stars help this site get found.',
        href: REPO_URL,
        cta: 'GitHub',
        ext: true,
      },
    ],
  },
  {
    time: 'An hour',
    intro: 'Things that put something physical or political in motion.',
    steps: [
      {
        title: 'Mail old USB drives or microSD cards',
        text: 'Flash Drives for Freedom wipes them, loads films, Wikipedia and news, and gets them into North Korea. Still running in 2026.',
        href: 'https://flashdrivesforfreedom.org',
        cta: 'Flash Drives for Freedom',
        ext: true,
      },
      {
        title: 'Write to your representatives',
        text:
          'Ask them to restore funding for Korean-language broadcasting (Radio Free Asia’s Korean service shut down in 2025), support human rights groups that lost grants, and press China to stop forcibly returning escapees.',
        href: '/learn/information-into-north-korea',
        cta: 'Background to cite',
      },
      {
        title: 'Read one memoir or watch Beyond Utopia',
        text: 'It changes how you talk about North Korea, and people around you will notice.',
        href: '/library',
        cta: 'Library',
      },
    ],
  },
  {
    time: 'Every week',
    intro: 'The highest-impact thing most people can do is consistent, boring help.',
    steps: [
      {
        title: 'Tutor an escapee in English',
        text: 'Freedom Speakers International (formerly TNKR) matches volunteers with North Koreans in South Korea. Refugees pick their tutors.',
        href: 'https://lovefsi.org',
        cta: 'Freedom Speakers International',
        ext: true,
      },
      {
        title: 'Give monthly to a group that lost funding',
        text: 'Documentation and media groups like NKDB, TJWG, Daily NK and Unification Media Group were hit by the 2025 US grant cuts.',
        href: '/organizations',
        cta: 'Organizations',
      },
      {
        title: 'Run a fundraiser',
        text: 'A school club or a birthday fundraiser can cover a full rescue. LiNK has kits for this.',
        href: 'https://libertyinnorthkorea.org',
        cta: 'LiNK',
        ext: true,
      },
    ],
  },
];

const SKILLS: { who: string; what: string }[] = [
  { who: 'Developers', what: 'This site is open source. Add data layers, build tools, improve the maps, fix bugs.' },
  { who: 'OSINT & mapping people', what: 'Geolocate camps and facilities from satellite imagery, check our coordinates, add sources.' },
  { who: 'Korean speakers', what: 'Translation is a bottleneck for documentation groups, and we want Korean versions of these pages.' },
  { who: 'Writers & creators', what: 'Good English content on North Korea is rare. Write explainers, make videos, pitch them here.' },
  { who: 'Students', what: 'Start a LiNK chapter, write a paper with escapee interviews, or run a screening of Beyond Utopia.' },
  { who: 'Lawyers & policy people', what: 'Accountability work (TJWG, Korea Future, the UN Seoul office) needs legal and policy help.' },
];

export default function Act() {
  return (
    <div className="wide">
      <p className="eyebrow">Take action</p>
      <h1>What you can do, sorted by how much time you have</h1>
      <p className="lede">
        North Korea feels too big to touch. But the useful work is cheap, specific and badly underfunded right now, so small help actually
        moves things. Pick one and do it today.
      </p>

      {GROUPS.map((g) => (
        <section key={g.time} className="act-group">
          <h2>
            {g.time} <small>{g.intro}</small>
          </h2>
          <div className="cards three">
            {g.steps.map((s) => (
              <div key={s.title} className="card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {s.ext ? <Ext href={s.href}>{s.cta} →</Ext> : <a href={s.href}>{s.cta} →</a>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="act-group">
        <h2>
          If you have a specific skill <small>These are the gaps.</small>
        </h2>
        <dl className="skills">
          {SKILLS.map((s) => (
            <div key={s.who}>
              <dt>{s.who}</dt>
              <dd>{s.what}</dd>
            </div>
          ))}
        </dl>
        <p>
          <Ext className="btn primary" href={REPO_URL}>
            Contribute on GitHub
          </Ext>
        </p>
      </section>

      <section className="act-group">
        <h2>Please don’t</h2>
        <ul>
          <li>Try to contact people inside North Korea or travel there to "help". It puts them in danger.</li>
          <li>Give to aid that goes through the regime without independent monitoring.</li>
          <li>Share unverified viral stories (execution rumors are often wrong). Check against Daily NK, NK News or the UN.</li>
        </ul>
      </section>
    </div>
  );
}
