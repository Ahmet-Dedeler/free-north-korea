import { KO_ARTICLES } from '@/content/translations/ko';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => KO_ARTICLES.map((a) => ({ slug: a.slug }));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = KO_ARTICLES.find((x) => x.slug === slug);
  return ogCard({ kicker: '심층 해설', title: a?.h1 ?? '자유 북한', sub: a?.teaser });
}
