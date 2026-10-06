import type { Metadata } from 'next';
import CountyDossier, { countyMetadata } from '@/components/CountyDossier';
import { getAllCountySlugs } from '@/content/counties';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCountySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return countyMetadata('ja', slug);
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  return <CountyDossier lang="ja" slug={slug} />;
}
