import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CampDossier from '@/components/CampDossier';
import { getAllCampSlugs, getCampBySlug } from '@/content/camps';
import { campLanguages, campMetaDescription, campMetaTitle } from '@/content/campsI18n';
import { pageMeta } from '@/site/seo';

const lang = 'ja' as const;
type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllCampSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const camp = getCampBySlug(slug);
  if (!camp) return {};
  return pageMeta({
    title: campMetaTitle(lang, camp.name),
    description: campMetaDescription(lang, camp),
    path: campLanguages(camp.slug)[lang],
    lang,
    languages: campLanguages(camp.slug),
    image: `${campLanguages(camp.slug)[lang]}/opengraph-image`,
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const camp = getCampBySlug(slug);
  if (!camp) notFound();
  return <CampDossier lang={lang} camp={camp} />;
}
