import Link from 'next/link';
import { isDead } from '@/entities';
import { CARD_H, CARD_W, buildFamilyTree } from '@/entities/familyTree';
import type { Person } from '@/entities/types';
import Avatar from './Avatar';
import FamilyTreeFocus from './FamilyTreeFocus';

/** Years as Supreme Leader, from the person's roles. */
function ruled(p: Person) {
  const r = p.roles.find((x) => x.title === 'Supreme Leader of North Korea');
  if (!r?.start) return null;
  return r.end ? `Ruled ${r.start.slice(0, 4)}–${r.end.slice(0, 4)}` : `Ruling since ${r.start.slice(0, 4)}`;
}

/** How someone fell, when the data says so. */
function fate(p: Person) {
  const cause = p.died?.cause ?? '';
  if (p.status?.value === 'executed' || /execution/i.test(cause)) return 'executed';
  if (/poison/i.test(cause)) return 'assassinated';
  if (p.status?.value === 'purged' || p.tags.includes('purged')) return 'sidelined';
  return null;
}

/**
 * The Kim family as a connected tree: server-rendered cards and SVG lines, so it's indexable and works without JS.
 * Hovering (or tapping) a person highlights their parents, partners, children and siblings.
 */
export default function FamilyTree() {
  const tree = buildFamilyTree();
  return (
    <FamilyTreeFocus>
      <div className="ftree-canvas" style={{ width: tree.width, height: tree.height }}>
        <svg className="ftree-lines" width={tree.width} height={tree.height} aria-hidden="true">
          {tree.edges.map((e, i) => (
            <path key={i} d={e.d} className={`ftree-edge ${e.kind}`} data-ids={e.ids.join(' ')} />
          ))}
        </svg>
        {tree.nodes.map((n) => {
          if (n.ghost)
            return (
              <span
                key={n.id}
                className="ftree-ghost"
                data-node={n.id}
                data-related={n.related.join(' ')}
                style={{ left: n.x, top: n.y, width: CARD_W }}
                title="The other parent is not in our data"
              >
                Other parent
              </span>
            );
          const p = n.person!;
          const dead = isDead(p);
          const r = ruled(p);
          const f = fate(p);
          return (
            <Link
              key={n.id}
              id={`ft-${p.id}`}
              href={`/people/${p.id}`}
              className={`ftree-card ${dead ? 'is-dead' : ''} ${r ? 'is-ruler' : ''}`}
              data-node={p.id}
              data-related={n.related.join(' ')}
              style={{ left: n.x, top: n.y, width: CARD_W, height: CARD_H }}
            >
              <Avatar person={p} size={52} />
              <b>{p.name_en}</b>
              {p.name_ko && <span className="ko">{p.name_ko}</span>}
              <span className="ftree-years">
                {p.born?.date?.slice(0, 4) ?? '?'}
                {dead ? `–${p.died?.date?.slice(0, 4) ?? '?'}` : ''}
              </span>
              {r ? <span className="ftree-badge ruler">{r}</span> : f ? <span className="ftree-badge fate">{f}</span> : null}
            </Link>
          );
        })}
      </div>
    </FamilyTreeFocus>
  );
}
