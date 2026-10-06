import { personOgText } from '@/components/PersonOgText';
import { PEOPLE } from '@/entities';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => PEOPLE.map((p) => ({ id: p.id }));

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return ogCard(personOgText('ja', id));
}
