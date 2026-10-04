import { ARTICLES, articleBySlug } from '@/content/articles';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => ARTICLES.map((a) => ({ slug: a.slug }));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  return ogCard({ kicker: 'Explainer', title: a?.h1 ?? 'Free North Korea', sub: a?.teaser });
}
