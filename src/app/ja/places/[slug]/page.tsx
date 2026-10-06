import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PlaceDossier from '@/components/PlaceDossier';
import { getAllPlaceSlugs, getPlaceBySlug } from '@/content/places-data';
import { PLACES_PATHS, PLACES_TEXT, placeFields, placeLanguages } from '@/content/placesI18n';
import { pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPlaceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) return {};
  const t = PLACES_TEXT.ja;
  const fields = placeFields('ja', place);
  return pageMeta({
    title: t.dossierTitle(place.name),
    description: t.dossierDescription(place.name, fields.categoryLabel, fields.note),
    path: `${PLACES_PATHS.ja}/${place.slug}`,
    lang: 'ja',
    languages: placeLanguages(place.slug),
    image: `${PLACES_PATHS.ja}/${place.slug}/opengraph-image`,
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!getPlaceBySlug(slug)) notFound();
  return <PlaceDossier lang="ja" slug={slug} />;
}
