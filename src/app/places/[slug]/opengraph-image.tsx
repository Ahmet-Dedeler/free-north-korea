import { getAllPlaceSlugs, getPlaceBySlug } from '@/content/places-data';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => getAllPlaceSlugs().map((slug) => ({ slug }));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPlaceBySlug(slug);
  return ogCard({ kicker: p?.categoryLabel ?? 'Key site', title: p?.name ?? 'North Korea key sites', sub: p?.note });
}
