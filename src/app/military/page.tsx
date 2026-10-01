import Link from 'next/link';
import { Ext } from '@/components/Ext';
import { REVIEWED } from '@/site/config';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'North Korea Military Strength 2026: Nukes, Missiles, Army',
  description:
    'North Korea’s military in 2026: about 1.28 million active troops, ~60 nuclear warheads, solid-fuel ICBMs, artillery aimed at Seoul, crypto theft and 20,000+ troops sent to Russia.',
  path: '/military',
});

const HEADLINE = [
  { n: '~60', label: 'nuclear warheads assembled', src: 'SIPRI, Jan 2026' },
  { n: '~90', label: 'warheads’ worth of fissile material', src: 'SIPRI, Jan 2026' },
  { n: '1.28M', label: 'active-duty troops', src: 'IISS Military Balance' },
  { n: '20,000+', label: 'troops sent to fight for Russia since 2024', src: 'South Korean & Ukrainian intelligence' },
];

const MISSILES = [
  { cls: 'ICBM (solid fuel)', names: 'Hwasong-18, Hwasong-19', range: 'Can reach all of the US', note: 'Solid fuel means minutes to launch instead of hours. Hwasong-19 first flew in October 2024.' },
  { cls: 'ICBM (liquid fuel)', names: 'Hwasong-15, Hwasong-17', range: '13,000+ km', note: 'Hwasong-17 is one of the largest road-mobile missiles in the world.' },
  { cls: 'IRBM / hypersonic', names: 'Hwasong-12, Hwasong-16B', range: '~4,500 km (Guam)', note: 'Hwasong-16B carries a hypersonic glide vehicle meant to dodge missile defenses.' },
  { cls: 'SRBM', names: 'Hwasong-11 family (KN-23/24), KN-25', range: '300–800 km', note: 'Low-flying, maneuvering missiles aimed at South Korea and Japan. Fired at Ukraine by Russia.' },
  { cls: 'Cruise', names: 'Hwasal-1/2', range: '1,500–2,000 km', note: 'Low-altitude cruise missiles, claimed nuclear-capable.' },
  { cls: 'Submarine-launched', names: 'Pukguksong series', range: '1,000–2,000+ km', note: 'Built and tested at the Sinpo shipyard. Few real submarines to carry them yet.' },
];

export default function Military() {
  return (
    <article className="prose">
      <p className="eyebrow">Military capability</p>
      <h1>North Korea’s military in 2026</h1>
      <p className="lede">
        North Korea spends a huge share of a tiny economy on the military, and since 2017 it has turned that into a real nuclear arsenal.
        This is the picture from public sources. Numbers are estimates, and the sources often disagree by a lot.
      </p>

      <div className="stat-row compact">
        {HEADLINE.map((s) => (
          <div key={s.label} className="stat">
            <b>{s.n}</b>
            <span>{s.label}</span>
            <small>{s.src}</small>
          </div>
        ))}
      </div>

      <h2>Nuclear weapons</h2>
      <p>
        North Korea tested nuclear devices six times between 2006 and 2017, all at <Link href="/map#sites=punggye-ri">Punggye-ri</Link>. The last
        one, in September 2017, was likely a thermonuclear (hydrogen) bomb. SIPRI estimates that as of January 2026 it had about 60 assembled
        warheads (up from 50 a year earlier) and enough fissile material for about 90. Plutonium comes from the reactors at{' '}
        <Link href="/map#sites=yongbyon">Yongbyon</Link>, and enriched uranium from Yongbyon and the covert{' '}
        <Link href="/map#sites=kangson">Kangson</Link> site. Kim Jong Un has called for "exponential" growth of the arsenal, and in 2023 nuclear
        status was written into the constitution.
      </p>

      <h2>Missiles</h2>
      <p>
        Every class from short-range to intercontinental. The big shift of the last few years is solid fuel: solid-fuel missiles can be
        hidden and fired in minutes, which makes them much harder to destroy before launch. See every test on the{' '}
        <Link href="/missiles">missile test map</Link>.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Main systems</th>
              <th>Range</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {MISSILES.map((m) => (
              <tr key={m.cls}>
                <td>{m.cls}</td>
                <td>{m.names}</td>
                <td>{m.range}</td>
                <td>{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Conventional forces</h2>
      <p>
        On paper, one of the largest militaries in the world: about 1.28 million active troops, around 600,000 reserves and millions more in
        paramilitary units (IISS estimates). Most men serve close to ten years. In practice much of the equipment is Soviet-era, fuel and
        food are short, and soldiers are often used as construction and farm labor.
      </p>
      <p>
        The part that matters most is artillery. Thousands of guns and rocket launchers sit in hardened positions near the DMZ, within range
        of Seoul’s metro area of about 25 million people. That threat, more than nukes, is why a military solution has never been on the
        table.
      </p>

      <h2>The war in Ukraine</h2>
      <p>
        Since late 2024 North Korea has sent more than 20,000 troops to Russia, mainly to the Kursk region. South Korean intelligence put
        their losses at about 6,000 killed or wounded by early 2026, and Ukraine’s HUR at over 7,000. It has also shipped millions of
        artillery shells and Hwasong-11 (KN-23/24) missiles, which Russia has fired at Ukrainian cities.
      </p>
      <p>
        In return the regime gets money, food, oil, and possibly help with satellites, submarines and air defense. Its soldiers are also
        getting real combat experience with drones, which no other army in Asia has. A 2024 mutual defense treaty with Russia formalized
        the alliance.
      </p>

      <h2>Cyber and crypto theft</h2>
      <p>
        North Korean hacking groups (often called Lazarus) steal cryptocurrency on a scale no one else does. In February 2025 they took about
        $1.5 billion from the Bybit exchange, the largest crypto theft ever. Thousands of North Korean IT workers also hold remote jobs at
        foreign companies under fake identities. UN experts have said this money funds the weapons programs.
      </p>

      <h2>Why this matters for freedom</h2>
      <p>
        The weapons are the regime’s insurance policy against outside pressure, and they cost money that could feed people. Every dollar from
        crypto theft or arms sales to Russia is a dollar that keeps the elite loyal without reform. That is why cutting the regime’s income is
        one of the realistic levers in <Link href="/learn/how-can-north-korea-be-freed">how North Korea could be freed</Link>.
      </p>

      <h2>Sources</h2>
      <ul className="sources">
        <li>
          <Ext href="https://www.sipri.org/media/press-release/2026/increasing-focus-nuclear-weapons-amid-heightened-escalation-risks-new-sipri-yearbook-out-now">
            SIPRI Yearbook 2026
          </Ext>
        </li>
        <li>
          <Ext href="https://www.iiss.org/publications/the-military-balance/">IISS, The Military Balance</Ext>
        </li>
        <li>
          <Ext href="https://kyivindependent.com/nearly-11-000-north-korean-troops-stationed-in-russias-kursk-oblast-at-start-of-2026-media-reports/">
            Kyiv Independent: North Korean troops in Kursk, 2026
          </Ext>
        </li>
        <li>
          <Ext href="https://kyivindependent.com/north-korean-troops-took-over-7-000-casualties-in-russias-kursk-oblast-hur-claims/">
            Kyiv Independent: HUR casualty estimate
          </Ext>
        </li>
        <li>
          <Ext href="https://missilethreat.csis.org/country/dprk/">CSIS Missile Threat: North Korea</Ext>
        </li>
        <li>
          <Ext href="https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/">CNS North Korea Missile Test Database</Ext>
        </li>
      </ul>
      <p className="muted">Last reviewed {REVIEWED}.</p>
    </article>
  );
}
