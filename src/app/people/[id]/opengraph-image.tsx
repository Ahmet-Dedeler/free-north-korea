import { PEOPLE, currentRole, person } from '@/entities';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => PEOPLE.map((p) => ({ id: p.id }));

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = person(id);
  const role = p && currentRole(p);
  return ogCard({ kicker: 'Who runs North Korea', title: p?.name_en ?? 'People', sub: role?.title ?? p?.summary });
}
