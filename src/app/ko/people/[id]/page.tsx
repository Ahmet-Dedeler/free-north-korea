import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PersonDossier from '@/components/PersonDossier';
import { personLanguages, roleTitle, summaryOf } from '@/content/peopleI18n';
import { PEOPLE, currentRole, person } from '@/entities';
import { pageMeta } from '@/site/seo';

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => PEOPLE.map((p) => ({ id: p.id }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = person((await params).id);
  if (!p) return {};
  const role = currentRole(p);
  const path = personLanguages(p.id).ko;
  return pageMeta({
    title: `${p.name_en}${role ? `: ${roleTitle(role.title, 'ko')}` : ''}`,
    description: summaryOf(p.id, 'ko', p.summary).slice(0, 160),
    path,
    lang: 'ko',
    languages: personLanguages(p.id),
    image: `${path}/opengraph-image`,
  });
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  if (!person(id)) notFound();
  return <PersonDossier lang="ko" id={id} />;
}
