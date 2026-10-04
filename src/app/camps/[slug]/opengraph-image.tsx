import { getAllCampSlugs, getCampBySlug } from '@/content/camps';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => getAllCampSlugs().map((slug) => ({ slug }));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCampBySlug(slug);
  return ogCard({ kicker: c?.kind ?? 'Prison camp', title: c?.name ?? 'North Korea prison camps', sub: c ? `${c.province} · ${c.status}` : undefined });
}
