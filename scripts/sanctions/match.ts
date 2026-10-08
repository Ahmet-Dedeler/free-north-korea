// Works out which entries on different sanctions lists are the same person, company or ship.
//
// Lists spell names differently and don't share one ID scheme, so two entries only count as the same target when
// something beyond the name says so. Methods, strongest first:
//   un-ref        the national list cites the UN reference number (KPi.041)
//   imo           same IMO number (ships, shipping companies)
//   swift         same SWIFT/BIC bank code
//   passport      same passport number, and birth dates don't contradict it
//   name-dob      same name (any spelling either list gives) and the same full date of birth
//   name-address  same name and the same street address (companies and ships only)
//   name-date     same name as a UN entry and listed on the same day the UN listed it
//   name-un       same name as a UN entry, the national list says the listing carries out a UN designation, and only
//                 one UN entry has that name
// A name alone is never enough. Same name with nothing to confirm it is kept as a "possible" match: it doesn't make
// the two entries one target, but it does stop us from calling either one "listed by only one government".
// Two different UN entries are never merged, whatever the other lists say.
import { orgCore, orgKey, personKey } from './lib.ts';
import type { Kind } from './national.ts';

export type ListKey = 'UN' | 'US' | 'UK' | 'EU' | 'JP';
export type Method = 'un-ref' | 'imo' | 'swift' | 'passport' | 'name-dob' | 'name-address' | 'name-date' | 'name-un';
export const METHODS: Method[] = ['un-ref', 'imo', 'swift', 'passport', 'name-dob', 'name-address', 'name-date', 'name-un'];
export const LISTS: ListKey[] = ['UN', 'US', 'UK', 'EU', 'JP'];

export interface Rec {
  list: ListKey;
  id: string;
  name: string;
  names: string[];
  kind: Kind;
  listed?: string;
  un?: string;
  unBasis?: boolean;
  dob?: string[];
  passports?: string[];
  imo?: string[];
  swift?: string[];
  /** Street addresses, as keys from addressKey() in lib.ts. */
  addr?: string[];
}

/** One sanctioned person, company, ship or aircraft, with every list that names it. */
export interface Target {
  name: string;
  kind: Kind;
  /** UN reference number when the target is on the UN list. */
  un?: string;
  /** Each list's own IDs for this target (confirmed matches only). */
  on: Partial<Record<ListKey, string[]>>;
  /** How each list's entry was tied to the others. */
  how: Partial<Record<ListKey, Method>>;
  /** Lists with an entry of the same name that nothing confirms is the same target. */
  maybe?: ListKey[];
}

const SPELLING: [RegExp, string][] = [
  [/defence/g, 'defense'],
  [/organisation/g, 'organization'],
  [/centre/g, 'center'],
  [/korean/g, 'korea'],
];
const looseKeysOf = (r: Rec) =>
  new Set(
    r.names
      .map((n) =>
        r.kind === 'individual'
          ? personKey(n).replace(/[^a-z]/g, '').split('').sort().join('')
          : SPELLING.reduce((s, [re, to]) => s.replace(re, to), orgCore(n)).replace(/[^a-z0-9]/g, ''),
      )
      .filter((k) => k.length > 3),
  );
const keysOf = (r: Rec) => new Set(r.names.map((n) => (r.kind === 'individual' ? personKey(n) : orgKey(n))).filter((k) => k.length > 3));
const fullDates = (r: Rec) => (r.dob ?? []).filter((d) => d.length === 10);
function dobCompatible(a: Rec, b: Rec) {
  if (!a.dob?.length || !b.dob?.length) return true;
  return a.dob.some((x) => b.dob!.some((y) => x === y || ((x.length === 4 || y.length === 4) && x.slice(0, 4) === y.slice(0, 4))));
}
const rank = (m: Method) => METHODS.indexOf(m);

export function matchLists(recs: Rec[]): { targets: Target[]; warnings: string[] } {
  const parent = recs.map((_, i) => i);
  const unOf = recs.map((r) => (r.list === 'UN' ? r.id : ''));
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const edges: { a: number; b: number; how: Method }[] = [];
  const warnings: string[] = [];
  const link = (a: number, b: number, how: Method) => {
    const [ra, rb] = [find(a), find(b)];
    if (recs[a].list === recs[b].list || recs[a].kind !== recs[b].kind) return;
    if (ra !== rb && unOf[ra] && unOf[rb]) {
      warnings.push(`${how} would join UN ${unOf[ra]} and UN ${unOf[rb]} (via ${recs[a].list} ${recs[a].id} / ${recs[b].list} ${recs[b].id}); not merged`);
      return;
    }
    edges.push({ a, b, how });
    if (ra !== rb) {
      parent[ra] = rb;
      unOf[rb] ||= unOf[ra];
    }
  };
  const pairs = (group: number[], fn: (a: number, b: number) => void) => {
    for (let x = 0; x < group.length; x++) for (let y = x + 1; y < group.length; y++) fn(group[x], group[y]);
  };
  const index = (fn: (r: Rec) => Iterable<string>) => {
    const idx = new Map<string, number[]>();
    recs.forEach((r, i) => {
      for (const v of fn(r)) idx.set(`${r.kind} ${v}`, [...(idx.get(`${r.kind} ${v}`) ?? []), i]);
    });
    return idx;
  };

  // 1. UN reference numbers cited by national lists
  const unByRef = new Map(recs.flatMap((r, i) => (r.list === 'UN' ? [[r.id, i] as const] : [])));
  // Lists do mistype these: the EU file gives Kim Tong-Ho the UN number of Kim Kyong Ok. So a cited number only
  // counts when the name agrees too, or a passport or birth date does.
  recs.forEach((r, i) => {
    const j = r.list !== 'UN' && r.un ? unByRef.get(r.un) : undefined;
    if (j === undefined) return;
    const u = recs[j];
    const names = keysOf(u);
    const cores = new Set(u.names.map(orgCore));
    const agrees =
      [...keysOf(r)].some((k) => names.has(k)) ||
      (r.kind !== 'individual' && r.names.some((n) => orgCore(n).length > 3 && cores.has(orgCore(n)))) ||
      r.passports?.some((p) => u.passports?.includes(p)) ||
      fullDates(r).some((d) => fullDates(u).includes(d));
    if (agrees) link(i, j, 'un-ref');
    else warnings.push(`${r.list} ${r.id} (${r.name}) cites UN ${r.un} (${u.name}), but nothing else agrees; matched on its own details instead`);
  });

  // 2. shared identifiers
  for (const g of index((r) => r.imo ?? []).values()) pairs(g, (a, b) => link(a, b, 'imo'));
  for (const g of index((r) => r.swift ?? []).values()) pairs(g, (a, b) => link(a, b, 'swift'));
  for (const g of index((r) => r.passports ?? []).values()) pairs(g, (a, b) => dobCompatible(recs[a], recs[b]) && link(a, b, 'passport'));

  // 3. same name plus one more fact
  const byName = index(keysOf);
  for (const g of byName.values())
    pairs(g, (a, b) => {
      const [ra, rb] = [recs[a], recs[b]];
      if (ra.kind === 'individual' && fullDates(ra).some((d) => fullDates(rb).includes(d))) link(a, b, 'name-dob');
      else if (ra.kind !== 'individual' && ra.addr?.some((k) => rb.addr?.includes(k))) link(a, b, 'name-address');
      else if ((ra.list === 'UN') !== (rb.list === 'UN') && ra.listed && ra.listed === rb.listed && dobCompatible(ra, rb)) link(a, b, 'name-date');
    });

  // 4. national listings that say they carry out a UN designation, matched to the one UN entry with that name
  recs.forEach((r, i) => {
    if (r.list === 'UN' || !r.unBasis || unOf[find(i)]) return;
    const cands = new Set<number>();
    for (const k of keysOf(r)) for (const j of byName.get(`${r.kind} ${k}`) ?? []) if (recs[j].list === 'UN' && dobCompatible(r, recs[j])) cands.add(j);
    if (cands.size === 1) link(i, [...cands][0], 'name-un');
  });

  // Targets from the clusters
  const clusters = new Map<number, number[]>();
  recs.forEach((_, i) => clusters.set(find(i), [...(clusters.get(find(i)) ?? []), i]));
  const best = new Map<number, Method>();
  for (const e of edges)
    for (const i of [e.a, e.b]) {
      const cur = best.get(i);
      if (!cur || rank(e.how) < rank(cur)) best.set(i, e.how);
    }
  const targetOf = new Map<number, Target>();
  const targets: Target[] = [];
  for (const [root, members] of clusters) {
    const sorted = members.slice().sort((a, b) => LISTS.indexOf(recs[a].list) - LISTS.indexOf(recs[b].list));
    const lead = recs[sorted[0]];
    const t: Target = { name: lead.name, kind: lead.kind, ...(lead.list === 'UN' && { un: lead.id }), on: {}, how: {} };
    for (const i of sorted) {
      const r = recs[i];
      (t.on[r.list] ??= []).push(r.id);
      const m = best.get(i);
      const prev = t.how[r.list];
      if (m && r.list !== lead.list && (!prev || rank(m) < rank(prev))) t.how[r.list] = m;
    }
    targets.push(t);
    targetOf.set(root, t);
  }

  // Possible matches: a looser name key (letters of a person's name in any order, British and American spellings
  // and company suffixes ignored), same kind, birth dates don't rule it out, nothing confirms it. Loose on purpose:
  // a possible match never joins two entries, it only stops us from claiming that one government acts alone.
  for (const g of index(looseKeysOf).values())
    pairs(g, (a, b) => {
      if (find(a) === find(b) || recs[a].list === recs[b].list || !dobCompatible(recs[a], recs[b])) return;
      const ta = targetOf.get(find(a))!;
      const tb = targetOf.get(find(b))!;
      if (!ta.on[recs[b].list]) ta.maybe = [...new Set([...(ta.maybe ?? []), recs[b].list])];
      if (!tb.on[recs[a].list]) tb.maybe = [...new Set([...(tb.maybe ?? []), recs[a].list])];
    });
  for (const t of targets) t.maybe?.sort((a, b) => LISTS.indexOf(a) - LISTS.indexOf(b));

  targets.sort((a, b) => (a.un ? 0 : 1) - (b.un ? 0 : 1) || (a.un ?? '').localeCompare(b.un ?? '') || a.name.localeCompare(b.name));
  return { targets, warnings };
}
