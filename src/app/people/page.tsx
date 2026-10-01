import Link from 'next/link';
import Avatar from '@/components/Avatar';
import { PEOPLE, age, currentRole, familyOf, isDead } from '@/entities';
import type { Person } from '@/entities/types';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'Who Runs North Korea: Kim Family Tree and Leadership',
  description:
    'The Kim family tree and the people who run North Korea in 2026: ages, roles, family links, health reports and sanctions, each with sources. Also available as JSON.',
  path: '/people',
});

const GROUPS: { tag: string; title: string; hint: string }[] = [
  { tag: 'politburo', title: 'Party and state leadership', hint: 'Politburo, cabinet and the Supreme People’s Assembly' },
  { tag: 'military', title: 'Military', hint: 'Korean People’s Army command' },
  { tag: 'security', title: 'Security services', hint: 'Secret police, police and intelligence' },
  { tag: 'missile', title: 'Weapons programs', hint: 'Missiles, nuclear and munitions industry' },
  { tag: 'cyber', title: 'Cyber', hint: 'Hacking units and crypto theft' },
  { tag: 'economy', title: 'Money', hint: 'Office 39, finance and trade' },
  { tag: 'diplomat', title: 'Diplomats', hint: 'Foreign ministry and ambassadors' },
  { tag: 'purged', title: 'Purged or executed', hint: 'What happens to people who fall' },
  { tag: 'defector', title: 'Elite defectors', hint: 'Officials who escaped' },
];

/** Generation number within the Kim family, counted down from the oldest ancestors we have. */
function generations(family: Person[]) {
  const ids = new Set(family.map((p) => p.id));
  const gen = new Map<string, number>();
  const parentsOf = (p: Person) => familyOf(p).filter((f) => (f.relation === 'father' || f.relation === 'mother') && ids.has(f.person.id)).map((f) => f.person);
  const visit = (p: Person, seen = new Set<string>()): number => {
    if (gen.has(p.id)) return gen.get(p.id)!;
    if (seen.has(p.id)) return 0;
    seen.add(p.id);
    const ps = parentsOf(p);
    const g = ps.length ? Math.max(...ps.map((x) => visit(x, seen))) + 1 : -1; // -1 = unknown yet
    if (g >= 0) gen.set(p.id, g);
    return g;
  };
  for (const p of family) visit(p);
  // people with no parents in the graph: put them next to their spouse or sibling, else at the top
  for (let pass = 0; pass < 3; pass++) {
    for (const p of family) {
      if (gen.has(p.id)) continue;
      const peer = familyOf(p).find((f) => ['spouse', 'sibling', 'half-sibling'].includes(f.relation) && gen.has(f.person.id));
      const child = familyOf(p).find((f) => f.relation === 'child' && gen.has(f.person.id));
      if (peer) gen.set(p.id, gen.get(peer.person.id)!);
      else if (child) gen.set(p.id, gen.get(child.person.id)! - 1);
    }
  }
  for (const p of family) if (!gen.has(p.id)) gen.set(p.id, 0);
  const min = Math.min(...gen.values());
  const rows: Person[][] = [];
  for (const p of family) (rows[gen.get(p.id)! - min] ??= []).push(p);
  return rows.map((r) => r.sort((a, b) => (a.born?.date ?? '9999').localeCompare(b.born?.date ?? '9999')));
}

function Card({ p }: { p: Person }) {
  const a = age(p);
  const dead = isDead(p);
  const role = currentRole(p);
  return (
    <Link href={`/people/${p.id}`} className={`pcard ${dead ? 'is-dead' : ''}`}>
      <Avatar person={p} size={64} />
      <b>{p.name_en}</b>
      <span className="pcard-years">
        {p.born?.date?.slice(0, 4) ?? '?'}
        {dead ? `–${p.died?.date?.slice(0, 4) ?? '?'}` : a !== null ? ` · ${a}` : ''}
      </span>
      {role && <span className="pcard-role">{role.title}</span>}
      {(p.status?.value === 'executed' || p.status?.value === 'purged') && <span className="pcard-flag">{p.status.value}</span>}
      {p.sanctions.length > 0 && <span className="pcard-flag sanction">sanctioned</span>}
    </Link>
  );
}

export default function People() {
  const family = PEOPLE.filter((p) => p.tags.includes('family'));
  const rows = generations(family);
  const LABEL = ['Ancestors', 'Kim Il Sung’s generation', 'Kim Jong Il’s generation', 'Kim Jong Un’s generation', 'The next generation'];
  // which generation is Kim Il Sung in? label rows relative to him
  const kisRow = rows.findIndex((r) => r.some((p) => p.id === 'kim-il-sung'));
  return (
    <div className="wide">
      <p className="eyebrow">People</p>
      <h1>Who runs North Korea</h1>
      <p className="lede">
        {PEOPLE.length} people: the Kim family and the officials around them. Hover a name for a quick card, click for the full profile with
        family, positions, health reports and sanctions. Every fact links to its source.{' '}
        <a href="/api/people">Get it all as JSON</a>.
      </p>

      <section className="tree">
        <h2>The Kim family</h2>
        {rows.map((row, i) => (
          <div key={i} className="tree-row">
            <span className="tree-label">{LABEL[i - kisRow + 1] ?? `Generation ${i + 1}`}</span>
            <div className="tree-cards">
              {row.map((p) => (
                <Card key={p.id} p={p} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {GROUPS.map((g) => {
        const list = PEOPLE.filter((p) => p.tags.includes(g.tag) && !p.tags.includes('family'));
        if (!list.length) return null;
        return (
          <section key={g.tag} className="pgroup">
            <h2>
              {g.title} <small>{g.hint}</small>
            </h2>
            <div className="pgrid">
              {list.map((p) => (
                <Card key={p.id} p={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
