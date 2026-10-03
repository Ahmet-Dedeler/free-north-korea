import Link from 'next/link';
import { Crown, HeartPulse, Users, ShieldAlert } from 'lucide-react';
import FamilyTree from '@/components/FamilyTree';
import { SourceCards, StatTile } from '@/components/Visual';
import { KIM_FAMILY_NOW } from '@/content/kimFamilyNow';
import { age, isDead, person } from '@/entities';
import { LEADER, buildFamilyTree } from '@/entities/familyTree';
import { jsonLd, pageMeta, absolute } from '@/site/seo';

export const metadata = pageMeta({
  title: 'Kim Family Tree 2026: Who Is Who Around Kim Jong Un Now',
  description:
    'Kim Jong Un’s family today: his daughter and named successor Kim Ju Ae, sister Kim Yo Jong, wife Ri Sol Ju, siblings, aunt and uncle. Ages, current roles and status, each with a source.',
  path: '/kim-family-tree',
});

export default function KimFamilyTree() {
  const tree = buildFamilyTree();
  const people = tree.nodes.map((n) => n.person);
  const living = people.filter((p) => !isDead(p));
  const sanctioned = living.filter((p) => p.sanctions.length > 0);
  const leader = person(LEADER)!;
  const heir = person('kim-ju-ae');

  // every "now" line on the cards cites a source; list them once at the bottom
  const sources = [...new Map(people.flatMap((p) => (KIM_FAMILY_NOW[p.id] ? [KIM_FAMILY_NOW[p.id].source] : [])).map((s) => [s.url, s])).values()];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kim family of North Korea',
    url: absolute('/kim-family-tree'),
    itemListElement: people.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absolute(`/people/${p.id}`), name: p.name_en })),
  };

  return (
    <div className="wide">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href="/people">People</Link>
      </p>
      <h1>The Kim family now</h1>
      <p className="lede">Who is who around Kim Jong Un today: how old they are, what they do, and who is next in line. Hover a person to see their closest relatives.</p>

      <div className="tiles">
        <StatTile icon={Crown} value={`${age(leader)}`} label="Kim Jong Un’s age" note="Supreme Leader since 2011" />
        <StatTile icon={HeartPulse} value="140+ kg" label="his weight, per South Korean intelligence" note="High heart disease risk (NIS, Sept 2026)" tone="danger" />
        {heir && <StatTile icon={Users} value={heir.name_en} label="named successor" note={`About ${age(heir)} years old (NIS, Feb 2026)`} tone="warn" />}
        <StatTile icon={ShieldAlert} value={`${living.length}`} label="living family members shown" note={`${sanctioned.length} under sanctions`} />
      </div>

      <FamilyTree />

      <section className="prose ftree-notes">
        <p className="muted">
          Ages are worked out from reported birth dates, many of which North Korea never confirmed. People who died are only shown where they link
          living relatives. Missing someone? The data lives in <code>data/entities/people.json</code> and <code>src/content/kimFamilyNow.ts</code>; open
          an issue or a pull request.
        </p>
        <h2>Sources</h2>
        <SourceCards sources={sources} />
      </section>
    </div>
  );
}
