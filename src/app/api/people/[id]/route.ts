import { PEOPLE, familyOf, person } from '@/entities';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => PEOPLE.map((p) => ({ id: p.id }));

/** One person, with family links resolved in both directions. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = person((await params).id);
  if (!p) return Response.json({ error: 'not found' }, { status: 404 });
  const family = familyOf(p).map((f) => ({ relation: f.relation, id: f.person.id, name: f.person.name_en }));
  return Response.json({ ...p, family_resolved: family });
}
