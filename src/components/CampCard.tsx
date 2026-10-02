import Link from 'next/link';
import { Users } from 'lucide-react';
import type { Camp } from '@/content/camps';
import SatView from './SatView';
import { iconFor } from './Visual';

/** Index card for a camp: satellite thumbnail, name, status and the most telling facts as tags. */
export default function CampCard({ camp: c }: { camp: Camp }) {
  const kwanliso = c.kind.includes('kwanliso');
  const closed = /closed/i.test(c.status);
  return (
    <li>
      <Link href={`/camps/${c.slug}`} className="place-card">
        <SatView lat={c.lat} lon={c.lon} zoom={kwanliso ? 12 : 15} label={c.name} compact height={150} />
        <span className="pc-body">
          <strong>{c.name}</strong>
          <small>
            {c.koreanName ? `${c.koreanName} · ` : ''}
            {c.province}
          </small>
          <span className="pc-tags">
            <span className={closed ? '' : 'danger'}>{closed ? c.status : c.status.replace(/\s*\(per HRNK\)/, '')}</span>
            {c.prisoners && (
              <span>
                <Users size={12} /> ~{c.prisoners.toLocaleString()}
              </span>
            )}
            {c.facts.labor?.slice(0, 2).map((l) => {
              const Icon = iconFor(l, Users);
              return (
                <span key={l}>
                  <Icon size={12} /> {l}
                </span>
              );
            })}
          </span>
          {c.facts.summary && c.facts.summary.length < 220 && <p>{c.facts.summary}</p>}
        </span>
      </Link>
    </li>
  );
}
