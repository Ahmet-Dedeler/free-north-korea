import type { Person } from '@/entities/types';
import { isDead } from '@/entities';

/** Photo if we have a freely licensed one, otherwise initials. Deceased people get a muted ring. */
export default function Avatar({ person: p, size = 48 }: { person: Person; size?: number }) {
  const initials = p.name_en
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  return (
    <span className={`avatar ${isDead(p) ? 'dead' : ''}`} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {p.image ? <img src={p.image.src} alt="" loading="lazy" /> : initials}
    </span>
  );
}
