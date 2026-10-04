import Link from 'next/link';
import Avatar from '@/components/Avatar';
import { PEOPLE, age, currentRole, isDead, person } from '@/entities';
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
  return (
    <div className="wide">
      <p className="eyebrow">People</p>
      <h1>Who runs North Korea</h1>
      <p className="lede">
        {PEOPLE.length} people: the Kim family and the officials around them. Hover a name for a quick card, click for the full profile with
        family, positions, health reports and sanctions. Every fact links to its source.{' '}
        <a href="/api/people">Get it all as JSON</a>. For everyone on the UN and US lists, see <Link href="/sanctions">sanctions</Link>.
      </p>

      <section className="tree">
        <Link href="/kim-family-tree" className="ftree-promo">
          <span className="ftree-promo-faces">
            {['kim-jong-un', 'kim-ju-ae', 'kim-yo-jong', 'ri-sol-ju'].map((id) => {
              const p = person(id);
              return p ? <Avatar key={id} person={p} size={44} /> : null;
            })}
          </span>
          <span>
            <b>The Kim family now</b>
            <small className="muted">Family tree: who is who around Kim Jong Un, their ages, roles and the named successor</small>
          </span>
        </Link>
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
