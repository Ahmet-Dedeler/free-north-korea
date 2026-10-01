import Link from 'next/link';
import { age, currentRole, isDead, person } from '@/entities';
import Avatar from './Avatar';

/**
 * A person's name that links to their profile and shows a small card on hover/focus.
 * Pure CSS (no JS), so it works in prerendered HTML and for keyboard users.
 */
export default function PersonLink({ id, children }: { id: string; children?: React.ReactNode }) {
  const p = person(id);
  if (!p) return <>{children ?? id}</>;
  const role = currentRole(p);
  const a = age(p);
  return (
    <span className="plink">
      <Link href={`/people/${p.id}`}>{children ?? p.name_en}</Link>
      <span className="plink-card" role="tooltip">
        <Avatar person={p} size={56} />
        <span className="plink-body">
          <b>{p.name_en}</b>
          {p.name_ko && <span className="ko">{p.name_ko}</span>}
          {role && <span>{role.title}</span>}
          <span className="muted">
            {p.born?.date ? `Born ${p.born.date.slice(0, 4)}` : 'Birth year unknown'}
            {a !== null ? (isDead(p) ? ` · died aged ${a}` : ` · ${a} years old`) : ''}
          </span>
        </span>
      </span>
    </span>
  );
}
