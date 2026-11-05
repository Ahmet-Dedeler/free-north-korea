import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PersonDossier from '@/components/PersonDossier';
import { personMetadata } from '@/components/personMetadata';
import { PEOPLE, person } from '@/entities';

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => PEOPLE.map((p) => ({ id: p.id }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return personMetadata((await params).id, 'ko');
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  if (!person(id)) notFound();
  return <PersonDossier lang="ko" id={id} />;
}
