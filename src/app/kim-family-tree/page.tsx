import Link from 'next/link';
import { Crown, Skull, Users, GitBranch } from 'lucide-react';
import FamilyTree from '@/components/FamilyTree';
import PersonLink from '@/components/PersonLink';
import { SourceCards, StatTile } from '@/components/Visual';
import { PEOPLE, isDead } from '@/entities';
import { buildFamilyTree } from '@/entities/familyTree';
import { jsonLd, pageMeta, absolute } from '@/site/seo';

export const metadata = pageMeta({
  title: 'Kim Family Tree: Four Generations Who Ruled North Korea',
  description:
    'Interactive Kim family tree: Kim Il Sung, Kim Jong Il, Kim Jong Un, Kim Yo Jong, Kim Ju Ae and the relatives who were sidelined, exiled, executed or assassinated. Every person links to a sourced profile.',
  path: '/kim-family-tree',
});

const SOURCES = [
  { name: 'Kim family (North Korea)', url: 'https://en.wikipedia.org/wiki/Kim_family_(North_Korea)', note: 'Wikipedia overview' },
  { name: 'Assassination of Kim Jong-nam', url: 'https://en.wikipedia.org/wiki/Assassination_of_Kim_Jong-nam', note: 'Wikipedia' },
  { name: 'Jang Song-thaek', url: 'https://en.wikipedia.org/wiki/Jang_Song-thaek', note: 'Wikipedia: arrest and execution, 2013' },
  { name: 'Kim Ju-ae', url: 'https://en.wikipedia.org/wiki/Kim_Ju_Ae', note: 'Wikipedia: public appearances since 2022' },
];

export default function KimFamilyTree() {
  const family = PEOPLE.filter((p) => p.tags.includes('family'));
  const tree = buildFamilyTree(family);
  const generations = new Set(tree.nodes.filter((n) => !n.ghost).map((n) => n.y)).size;
  const killed = family.filter((p) => p.status?.value === 'executed' || /execution|poison/i.test(p.died?.cause ?? ''));
  const alive = family.filter((p) => !isDead(p));

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kim family of North Korea',
    url: absolute('/kim-family-tree'),
    itemListElement: family.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absolute(`/people/${p.id}`), name: p.name_en })),
  };

  return (
    <div className="wide">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href="/people">People</Link>
      </p>
      <h1>The Kim family tree</h1>
      <p className="lede">
        One family has ruled North Korea since 1948, passing power from father to son twice. This is everyone in it we have sourced data for:{' '}
        {family.length} people across {generations} generations, including the relatives who lost out.
      </p>

      <div className="tiles">
        <StatTile icon={Crown} value="3" label="leaders, father to son" note="Kim Il Sung, Kim Jong Il, Kim Jong Un" />
        <StatTile icon={GitBranch} value={generations} label="generations shown" />
        <StatTile icon={Users} value={alive.length} label="still alive" note="as far as is publicly known" />
        <StatTile icon={Skull} value={killed.length} label="killed by the regime" note={killed.map((p) => p.name_en).join(', ')} tone="danger" />
      </div>

      <FamilyTree />

      <section className="prose ftree-notes">
        <h2>How power passed</h2>
        <ul>
          <li>
            <PersonLink id="kim-il-sung" /> founded the state in 1948 with Soviet backing and ruled until he died in 1994. He chose his eldest son
            over his brother <PersonLink id="kim-yong-ju" /> and his son by his second wife, <PersonLink id="kim-pyong-il" />, who spent decades as an
            ambassador in Europe.
          </li>
          <li>
            <PersonLink id="kim-jong-il" /> ruled from 1994 to 2011. He had children with several partners. His eldest son{' '}
            <PersonLink id="kim-jong-nam" /> fell out of favour and was killed with VX nerve agent at Kuala Lumpur airport in 2017.
          </li>
          <li>
            <PersonLink id="kim-jong-un" /> took over in 2011. In 2013 he had his uncle by marriage, <PersonLink id="jang-song-thaek" />, executed. His
            sister <PersonLink id="kim-yo-jong" /> is one of the most powerful officials in the country, and his daughter{' '}
            <PersonLink id="kim-ju-ae" /> has appeared at missile launches and parades since 2022.
          </li>
        </ul>
        <p className="muted">
          Partners with no recorded children of their own and children whose other parent we have no sourced profile for are shown as{' '}
          <em>Other parent</em>. Missing someone? The data lives in <code>data/entities/people.json</code>; open an issue or a pull request.
        </p>
        <h2>Sources</h2>
        <SourceCards sources={SOURCES} />
      </section>
    </div>
  );
}
