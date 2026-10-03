/**
 * Layout for the Kim family tree (/kim-family-tree and /people).
 *
 * Everything is computed at build time from data/entities/people.json, so the tree is plain server-rendered HTML + SVG
 * and updates itself when a person or family link is added. Rules:
 * - Blood members are the descendants of the oldest ancestor we have. People who married in sit to the right of
 *   their partner on the same row, joined by a marriage line.
 * - Children hang under the parent who married in (or under a dashed "not in our data" marker when the other
 *   parent isn't recorded), so a father with several partners shows which children came from whom.
 * - Subtrees are packed left to right by bounding box. Simple, never overlaps, and the Kim tree is small.
 */
import { PEOPLE, familyOf } from '.';
import type { Person } from './types';

export const CARD_W = 128;
export const CARD_H = 150;
const GAP = 14; // horizontal gap between cards
const ROW = 220; // vertical distance between generations
const GHOST_H = 34;

export interface TreeNode {
  id: string; // person id, or `ghost:<parent>` for an unrecorded co-parent
  person?: Person;
  x: number; // left edge
  y: number; // top edge
  ghost?: boolean;
  /** Ids this node is directly related to (parents, partners, children, siblings), for hover highlighting. */
  related: string[];
}

export interface TreeEdge {
  d: string; // SVG path
  kind: 'marriage' | 'child';
  ids: string[]; // people the edge touches, for highlighting
}

export interface FamilyTree {
  nodes: TreeNode[];
  edges: TreeEdge[];
  width: number;
  height: number;
}

interface Group {
  coparent: Person | null; // null: the other parent isn't in our data
  children: Person[];
}

interface Sub {
  nodes: TreeNode[];
  edges: TreeEdge[];
  minX: number;
  maxX: number;
}

const year = (p: Person) => p.born?.date ?? '9999';

export function buildFamilyTree(people: Person[] = PEOPLE.filter((p) => p.tags.includes('family'))): FamilyTree {
  const ids = new Set(people.map((p) => p.id));
  const rel = (p: Person, ...r: string[]) => familyOf(p).filter((f) => r.includes(f.relation) && ids.has(f.person.id)).map((f) => f.person);
  const parents = (p: Person) => rel(p, 'father', 'mother');

  // Root: the oldest person with no recorded parents who has children (Kim Hyong Jik). Their partner joins as a spouse.
  const root = people
    .filter((p) => parents(p).length === 0 && rel(p, 'child').length > 0)
    .sort((a, b) => Number(b.gender === 'male') - Number(a.gender === 'male') || year(a).localeCompare(year(b)))[0];

  /** Children of p, grouped by the other parent, ordered by the eldest child (childless partners last). */
  const groups = (p: Person): Group[] => {
    const out = new Map<string, Group>();
    for (const s of rel(p, 'spouse')) out.set(s.id, { coparent: s, children: [] });
    for (const c of rel(p, 'child')) {
      const other = parents(c).find((x) => x.id !== p.id) ?? null;
      const key = other?.id ?? '?';
      if (!out.has(key)) out.set(key, { coparent: other, children: [] });
      out.get(key)!.children.push(c);
    }
    const gs = [...out.values()];
    gs.forEach((g) => g.children.sort((a, b) => year(a).localeCompare(year(b))));
    const first = (g: Group) => (g.children[0] ? year(g.children[0]) : 'zzzz' + year(g.coparent!));
    return gs.sort((a, b) => first(a).localeCompare(first(b)));
  };

  const relatedOf = (p: Person) => familyOf(p).filter((f) => ids.has(f.person.id)).map((f) => f.person.id);

  const shift = (s: Sub, dx: number): Sub => ({
    nodes: s.nodes.map((n) => ({ ...n, x: n.x + dx })),
    edges: s.edges.map((e) => ({ ...e, d: e.d.replace(/(M|L|H) ?(-?[\d.]+)/g, (_, c, v) => `${c}${+v + dx}`) })),
    minX: s.minX + dx,
    maxX: s.maxX + dx,
  });

  const lay = (p: Person, depth: number): Sub => {
    const y = depth * ROW;
    const gs = groups(p);
    if (!gs.length) return { nodes: [{ id: p.id, person: p, x: 0, y, related: relatedOf(p) }], edges: [], minX: 0, maxX: CARD_W };

    const nodes: TreeNode[] = [];
    const edges: TreeEdge[] = [];
    let cursor = 0;
    const slots: { node: TreeNode; children: TreeNode[] }[] = [];
    for (const g of gs) {
      // lay out this group's children side by side
      const kids: TreeNode[] = [];
      let kx = cursor;
      for (const c of g.children) {
        const sub = lay(c, depth + 1);
        const placed = shift(sub, kx - sub.minX);
        nodes.push(...placed.nodes);
        edges.push(...placed.edges);
        kids.push(placed.nodes.find((n) => n.id === c.id)!);
        kx = placed.maxX + GAP;
      }
      const span = g.children.length ? kx - GAP - cursor : CARD_W;
      const width = Math.max(span, CARD_W);
      if (span < width) {
        // a single narrow child under a partner card: centre it
        const dx = (width - span) / 2;
        for (const k of kids) k.x += dx;
      }
      const cx = cursor + width / 2;
      const node: TreeNode = g.coparent
        ? { id: g.coparent.id, person: g.coparent, x: cx - CARD_W / 2, y, related: relatedOf(g.coparent) }
        : { id: `ghost:${p.id}:${slots.length}`, ghost: true, x: cx - CARD_W / 2, y: y + CARD_H / 2 - GHOST_H / 2, related: [p.id, ...g.children.map((c) => c.id)] };
      nodes.push(node);
      slots.push({ node, children: kids });
      cursor += width + GAP;
    }

    // p sits just left of its first partner
    const self: TreeNode = { id: p.id, person: p, x: slots[0].node.x - CARD_W - GAP, y, related: relatedOf(p) };
    nodes.push(self);

    // marriage line along the card middles, from p to the last partner
    const my = y + CARD_H / 2;
    const last = slots[slots.length - 1].node;
    edges.push({ d: `M${self.x + CARD_W} ${my} H${last.x}`, kind: 'marriage', ids: [p.id, ...slots.map((s) => s.node.id)] });

    // children: drop from the co-parent to a bus, then down to each child
    for (const { node, children } of slots) {
      if (!children.length) continue;
      const top = node.ghost ? node.y + GHOST_H : node.y + CARD_H;
      const bus = y + CARD_H + (ROW - CARD_H) / 2;
      const pcx = node.x + CARD_W / 2;
      // one path per child (they overlap on the shared bus), so a highlight shows exactly one parent-child line
      for (const c of children) {
        const x = c.x + CARD_W / 2;
        edges.push({ d: `M${pcx} ${top} L${pcx} ${bus} H${x} L${x} ${y + ROW}`, kind: 'child', ids: [p.id, node.id, c.id] });
      }
    }

    const xs = nodes.map((n) => n.x);
    return { nodes, edges, minX: Math.min(...xs), maxX: Math.max(...xs) + CARD_W };
  };

  const full = lay(root, 0);
  const placed = shift(full, -full.minX + 2);
  const depth = Math.max(...placed.nodes.map((n) => n.y));
  return { nodes: placed.nodes, edges: placed.edges, width: placed.maxX + 2, height: depth + CARD_H + 4 };
}
