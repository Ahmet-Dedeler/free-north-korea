import peopleJson from '../../data/entities/people.json';
import orgsJson from '../../data/entities/orgs.json';
import type { Org, Person, Relation } from './types';

export const PEOPLE = peopleJson as Person[];
export const ENTITY_ORGS = orgsJson as Org[];

const byId = new Map(PEOPLE.map((p) => [p.id, p]));
const orgById = new Map(ENTITY_ORGS.map((o) => [o.id, o]));

export const person = (id: string) => byId.get(id);
export const entityOrg = (id: string) => orgById.get(id);

/** Age today, or age at death. Null when the birth date is unknown. */
export function age(p: Person, today = new Date()): number | null {
  const b = p.born?.date;
  if (!b || !/^\d{4}/.test(b)) return null;
  const end = p.died?.date && /^\d{4}/.test(p.died.date) ? new Date(p.died.date) : today;
  const born = new Date(b.length === 4 ? `${b}-07-01` : b);
  let a = end.getUTCFullYear() - born.getUTCFullYear();
  if (b.length > 4 && (end.getUTCMonth() < born.getUTCMonth() || (end.getUTCMonth() === born.getUTCMonth() && end.getUTCDate() < born.getUTCDate()))) a--;
  return a;
}

export const isDead = (p: Person) => Boolean(p.died?.date) || /dead|executed|died/i.test(p.status?.value ?? '');

/** The role a person is best known for right now (latest open role, else latest role). */
export function currentRole(p: Person) {
  const open = p.roles.filter((r) => !r.end);
  const pick = (open.length ? open : p.roles).slice().sort((a, b) => (b.start ?? '').localeCompare(a.start ?? ''))[0];
  return pick ?? null;
}

/** If `other` says "p is my <rel>", what is `other` to p? */
function inverse(rel: Relation, other: Person): Relation | null {
  const female = other.gender === 'female';
  switch (rel) {
    case 'father':
    case 'mother':
      return 'child';
    case 'child':
      return female ? 'mother' : 'father';
    case 'uncle':
    case 'aunt':
      return female ? 'niece' : 'nephew';
    case 'niece':
    case 'nephew':
      return female ? 'aunt' : 'uncle';
    case 'spouse':
    case 'sibling':
    case 'half-sibling':
    case 'in-law':
      return rel;
  }
}

/**
 * Family links in both directions. The research data may only record a link on one side
 * (e.g. Kim Jong Un lists his father, but Kim Jong Il doesn't list Kim Jong Un), so we mirror them.
 */
export function familyOf(p: Person): { relation: Relation; person: Person; note?: string | null }[] {
  const out = new Map<string, { relation: Relation; person: Person; note?: string | null }>();
  for (const f of p.family) {
    const other = byId.get(f.person_id);
    if (other) out.set(other.id, { relation: f.relation, person: other, note: f.note });
  }
  for (const other of PEOPLE) {
    if (other.id === p.id || out.has(other.id)) continue;
    const back = other.family.find((f) => f.person_id === p.id);
    const rel = back && inverse(back.relation, other);
    // the back-link's note is written from the other person's side, so don't reuse it
    if (rel) out.set(other.id, { relation: rel, person: other });
  }
  return [...out.values()];
}

export const RELATION_ORDER: Relation[] = ['father', 'mother', 'spouse', 'sibling', 'half-sibling', 'child', 'uncle', 'aunt', 'niece', 'nephew', 'in-law'];
