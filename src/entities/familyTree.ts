/**
 * Layout for the Kim family tree on /kim-family-tree. It shows the family as it matters today, centred on the
 * current leader, not the full history:
 *   row 0: the leader's father, his living partners and his living siblings (the leader's aunts/uncles)
 *   row 1: the father's children, each followed by their living partners
 *   row 2: grandchildren, under their parents
 * The dead are only kept when they connect living people (Kim Jong Il, Kim Jong Nam).
 *
 * Positions are in column units, not pixels, so the page can size the tree to its container: no sideways scrolling.
 * Built at build time from data/entities/people.json; adding a person or family link updates it.
 */
import { familyOf, isDead, person } from '.';
import type { Person, Relation } from './types';

export const LEADER = 'kim-jong-un';

export interface TreeNode {
  person: Person;
  col: number; // column of the card's left edge (may be fractional)
  row: number;
  relation: string; // what this person is to the leader ("Sister", "Daughter", ...)
  related: string[]; // ids directly linked to this person, for hover highlighting
}

export interface TreeEdge {
  kind: 'marriage' | 'child';
  /** Points in (column, row-relative) units; rendered by FamilyTree.tsx. */
  from: { col: number; row: number; at: 'bottom' | 'middle' };
  to: { col: number; row: number };
  ids: string[];
}

export interface FamilyTree {
  nodes: TreeNode[];
  edges: TreeEdge[];
  cols: number;
  rows: number;
}

const year = (p: Person) => p.born?.date ?? '9999';
const byAge = (a: Person, b: Person) => year(a).localeCompare(year(b));
const rel = (p: Person, ...r: Relation[]) => familyOf(p).filter((f) => r.includes(f.relation)).map((f) => f.person);

const LABEL: Record<Relation, [string, string]> = {
  father: ['Father', 'Father'],
  mother: ['Mother', 'Mother'],
  spouse: ['Husband', 'Wife'],
  child: ['Son', 'Daughter'],
  sibling: ['Brother', 'Sister'],
  'half-sibling': ['Half-brother', 'Half-sister'],
  uncle: ['Uncle', 'Uncle'],
  aunt: ['Aunt', 'Aunt'],
  nephew: ['Nephew', 'Nephew'],
  niece: ['Niece', 'Niece'],
  'in-law': ['In-law', 'In-law'],
};

/** What `p` is to the leader, in plain words. */
function relationToLeader(leader: Person, p: Person, father: Person): string {
  if (p.id === leader.id) return 'Supreme Leader';
  const f = familyOf(leader).find((x) => x.person.id === p.id);
  if (f) return LABEL[f.relation][p.gender === 'female' ? 1 : 0];
  if (rel(father, 'spouse').some((s) => s.id === p.id)) return 'Father’s partner';
  return 'Relative';
}

export function buildFamilyTree(): FamilyTree {
  const leader = person(LEADER)!;
  const father = rel(leader, 'father')[0];
  const alive = (p: Person) => !isDead(p);

  const children = rel(father, 'child').sort(byAge);
  // a dead child stays only if they have living children (Kim Jong Nam -> Kim Han Sol)
  const kept = children.filter((c) => alive(c) || rel(c, 'child').some(alive));

  // row 1: each child, then their living partners
  const row1: Person[] = [];
  for (const c of kept) row1.push(c, ...rel(c, 'spouse').filter(alive));
  const col1 = new Map(row1.map((p, i) => [p.id, i]));

  // row 0: father's living siblings, the father, his living partners; centred over his children
  const siblings = rel(father, 'sibling', 'half-sibling').filter(alive).sort(byAge);
  const partners = rel(father, 'spouse').filter(alive);
  const row0 = [...siblings, father, ...partners];
  const kidsMid = (col1.get(kept[0].id)! + col1.get(kept[kept.length - 1].id)!) / 2;
  let start0 = kidsMid - siblings.length;
  start0 = Math.max(0, Math.min(start0, row1.length - row0.length));

  // row 2: grandchildren under their parent (or between a parent couple)
  const row2: { p: Person; col: number; parents: Person[] }[] = [];
  for (const c of kept) {
    for (const g of rel(c, 'child').filter(alive).sort(byAge)) {
      const other = rel(g, 'father', 'mother').find((x) => x.id !== c.id && col1.has(x.id)) ?? null;
      const col = other ? (col1.get(c.id)! + col1.get(other.id)!) / 2 : col1.get(c.id)!;
      row2.push({ p: g, col, parents: other ? [c, other] : [c] });
    }
  }
  // push right on collisions
  row2.sort((a, b) => a.col - b.col);
  for (let i = 1; i < row2.length; i++) row2[i].col = Math.max(row2[i].col, row2[i - 1].col + 1);

  const placed: { p: Person; col: number; row: number }[] = [
    ...row0.map((p, i) => ({ p, col: start0 + i, row: 0 })),
    ...row1.map((p, i) => ({ p, col: i, row: 1 })),
    ...row2.map((g) => ({ p: g.p, col: g.col, row: 2 })),
  ];
  const inTree = new Set(placed.map((x) => x.p.id));
  const nodes: TreeNode[] = placed.map(({ p, col, row }) => ({
    person: p,
    col,
    row,
    relation: relationToLeader(leader, p, father),
    related: familyOf(p).filter((f) => inTree.has(f.person.id)).map((f) => f.person.id),
  }));
  const at = new Map(nodes.map((n) => [n.person.id, n]));

  const edges: TreeEdge[] = [];
  // marriages: father and his partners, each child and their partners
  for (const pt of partners) edges.push(marriage(at.get(father.id)!, at.get(pt.id)!));
  for (const c of kept) for (const s of rel(c, 'spouse').filter((s) => at.has(s.id))) edges.push(marriage(at.get(c.id)!, at.get(s.id)!));
  // father -> children
  const f = at.get(father.id)!;
  for (const c of kept) {
    const n = at.get(c.id)!;
    edges.push({ kind: 'child', from: { col: f.col, row: 0, at: 'bottom' }, to: { col: n.col, row: 1 }, ids: [father.id, c.id] });
  }
  // parents -> grandchildren (from the middle of the couple's marriage line, or the single parent's card)
  for (const g of row2) {
    const n = at.get(g.p.id)!;
    const ps = g.parents.map((p) => at.get(p.id)!);
    const couple = ps.length === 2;
    const col = couple ? (ps[0].col + ps[1].col) / 2 : ps[0].col;
    edges.push({ kind: 'child', from: { col, row: 1, at: couple ? 'middle' : 'bottom' }, to: { col: n.col, row: 2 }, ids: [...g.parents.map((p) => p.id), g.p.id] });
  }

  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  return { nodes, edges, cols, rows: 3 };
}

function marriage(a: TreeNode, b: TreeNode): TreeEdge {
  return { kind: 'marriage', from: { col: a.col, row: a.row, at: 'middle' }, to: { col: b.col, row: b.row }, ids: [a.person.id, b.person.id] };
}

/** Ids shown in the tree, so profile pages only link to it for people who are on it. */
export const familyTreeIds = () => new Set(buildFamilyTree().nodes.map((n) => n.person.id));
