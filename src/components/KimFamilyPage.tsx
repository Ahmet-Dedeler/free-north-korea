import Link from 'next/link';
import { Crown, HeartPulse, Users, ShieldAlert } from 'lucide-react';
import FamilyTree from '@/components/FamilyTree';
import KimLastSeen from '@/components/KimLastSeen';
import { SourceCards, StatTile } from '@/components/Visual';
import { KIM_FAMILY_NOW } from '@/content/kimFamilyNow';
import { KIM_FAMILY_PATHS, KIM_FAMILY_TEXT, withLang } from '@/content/kimFamilyI18n';
import { age, isDead, person } from '@/entities';
import { LEADER, buildFamilyTree } from '@/entities/familyTree';
import { jsonLd, absolute, type Lang } from '@/site/seo';

export default function KimFamilyPage({ lang }: { lang: Lang }) {
  const t = KIM_FAMILY_TEXT[lang];
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
    name: t.jsonLdName,
    description: t.metaDescription,
    url: absolute(KIM_FAMILY_PATHS[lang]),
    itemListElement: people.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absolute(withLang(lang, `/people/${p.id}`)),
      name: p.name_en,
    })),
  };

  return (
    <div className="wide">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href={withLang(lang, '/people')}>{t.eyebrow}</Link>
      </p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>

      <div className="tiles">
        <StatTile icon={Crown} value={`${age(leader)}`} label={t.ageLabel} note={t.ageNote} />
        <StatTile icon={HeartPulse} value={t.weightValue} label={t.weightLabel} note={t.weightNote} tone="danger" />
        {heir && <StatTile icon={Users} value={<span lang="en">{heir.name_en}</span>} label={t.successorLabel} note={t.successorNote(age(heir))} tone="warn" />}
        <StatTile icon={ShieldAlert} value={`${living.length}`} label={t.livingLabel} note={t.livingNote(sanctioned.length)} />
      </div>

      <KimLastSeen lang={lang} />

      <FamilyTree lang={lang} />

      <section className="prose ftree-notes">
        <p className="muted">
          {t.noteAges} {t.noteDead} {t.noteMissing} <code lang="en">data/entities/people.json</code>{t.noteAnd}<code lang="en">src/content/kimFamilyNow.ts</code>{t.noteTail}
        </p>
        <h2>{t.sources}</h2>
        <div lang="en">
          <SourceCards sources={sources} />
        </div>
      </section>
    </div>
  );
}
