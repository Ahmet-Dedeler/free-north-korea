import { JA_ARTICLES } from '@/content/translations/ja';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => JA_ARTICLES.map((a) => ({ slug: a.slug }));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = JA_ARTICLES.find((x) => x.slug === slug);
  return ogCard({ kicker: '深層解説', title: a?.h1 ?? '自由北朝鮮', sub: a?.teaser });
}
