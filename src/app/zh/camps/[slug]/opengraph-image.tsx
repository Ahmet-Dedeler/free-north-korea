import { getAllCampSlugs, getCampBySlug } from '@/content/camps';
import { campOg } from '@/content/campsI18n';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => getAllCampSlugs().map((slug) => ({ slug }));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = campOg('zh', getCampBySlug(slug));
  return ogCard({ kicker: card.kicker, title: card.title, sub: card.sub });
}
