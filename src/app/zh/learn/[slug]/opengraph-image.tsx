import { ZH_ARTICLES } from '@/content/translations/zh';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => ZH_ARTICLES.map((a) => ({ slug: a.slug }));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ZH_ARTICLES.find((x) => x.slug === slug);
  return ogCard({ kicker: '深度解读', title: a?.h1 ?? '自由朝鲜', sub: a?.teaser });
}
