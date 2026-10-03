import Link from 'next/link';
import { age, isDead } from '@/entities';
import { LEADER, buildFamilyTree, type TreeEdge } from '@/entities/familyTree';
import { KIM_FAMILY_NOW } from '@/content/kimFamilyNow';
import Avatar from './Avatar';
import FamilyTreeFocus from './FamilyTreeFocus';

const CARD_H = 224;
const ROW = 278; // card height + room for the connector lines
const ROW_LABELS = ['His father’s generation', 'Kim Jong Un and his siblings', 'The next generation'];

/** Line geometry: x in column units (100 per column, scaled to the container by the SVG), y in pixels. */
function path(e: TreeEdge) {
  const x1 = (e.from.col + 0.5) * 100;
  const x2 = (e.to.col + 0.5) * 100;
  const top = e.from.row * ROW;
  if (e.kind === 'marriage') return `M${x1} ${top + CARD_H / 2} H${x2}`;
  const y1 = top + (e.from.at === 'middle' ? CARD_H / 2 : CARD_H);
  const bus = top + CARD_H + (ROW - CARD_H) / 2;
  return `M${x1} ${y1} V${bus} H${x2} V${e.to.row * ROW}`;
}

/**
 * The Kim family as it stands today, as a connected tree that always fits its container (columns are percentages,
 * lines are a stretched SVG). Server-rendered; on phones it turns into a list grouped by generation.
 */
export default function FamilyTree() {
  const tree = buildFamilyTree();
  const height = (tree.rows - 1) * ROW + CARD_H;
  const nodes = [...tree.nodes].sort((a, b) => a.row - b.row || a.col - b.col);
  return (
    <FamilyTreeFocus>
      <div className="ftree-canvas" style={{ height, ['--cols' as string]: tree.cols }}>
        <svg className="ftree-lines" viewBox={`0 0 ${tree.cols * 100} ${height}`} preserveAspectRatio="none" aria-hidden="true">
          {tree.edges.map((e, i) => (
            <path key={i} d={path(e)} className={`ftree-edge ${e.kind}`} data-ids={e.ids.join(' ')} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {nodes.map((n, i) => {
          const p = n.person;
          const dead = isDead(p);
          const a = age(p);
          const now = KIM_FAMILY_NOW[p.id];
          return [
            (i === 0 || nodes[i - 1].row !== n.row) && (
              <h3 key={`row-${n.row}`} className="ftree-rowlabel">
                {ROW_LABELS[n.row]}
              </h3>
            ),
            <Link
              key={p.id}
              id={`ft-${p.id}`}
              href={`/people/${p.id}`}
              className={`ftree-card ${dead ? 'is-dead' : ''} ${p.id === LEADER ? 'is-leader' : ''}`}
              style={{ ['--col' as string]: n.col, top: n.row * ROW, height: CARD_H }}
              data-node={p.id}
              data-related={n.related.join(' ')}
            >
              <span className="ftree-rel">{n.relation}</span>
              <Avatar person={p} size={52} />
              <b>{p.name_en}</b>
              <span className="ftree-age">
                {dead ? `${p.born?.date?.slice(0, 4) ?? '?'}–${p.died?.date?.slice(0, 4) ?? '?'}` : a !== null ? `${a} years old` : 'Age unknown'}
                </span>
              {p.sanctions.length > 0 && <span className="ftree-sanction">Sanctioned</span>}
              {now && <span className="ftree-now">{now.text}</span>}
            </Link>,
          ];
        })}
      </div>
    </FamilyTreeFocus>
  );
}
