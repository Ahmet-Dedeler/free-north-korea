import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCamps, getAllCampSlugs, getCampBySlug } from '@/content/camps';
import { getCountyBySlug } from '@/content/counties';
import { Activity, Ban, BookOpen, Building2, Gavel, Landmark, Lock, MapPin, Pickaxe, ShieldAlert, Skull, Tag, Users } from 'lucide-react';
import Locator from '@/components/Locator';
import SatView from '@/components/SatView';
import { ChipRow, COI_CRIMES, EvidenceMeter, KYOHWASO_OFFENCES, SourceCards, StatTile } from '@/components/Visual';
import { absolute, jsonLd, pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllCampSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const camp = getCampBySlug(slug);
  if (!camp) return {};

  return pageMeta({
    title: `${camp.name}: North Korea Prison Camp Dossier`,
    description: `${camp.name} (${camp.kind}): ${camp.status}. Located in ${camp.province}. ${camp.note}`,
    path: `/camps/${camp.slug}`,
  });
}

export default async function CampPage({ params }: Params) {
  const { slug } = await params;
  const camp = getCampBySlug(slug);
  if (!camp) notFound();

  const county = camp.countyCode ? getCountyBySlug(camp.countyCode) : null;
  const allCamps = getAllCamps();
  const nearbyCamps = allCamps.filter((c) => c.id !== camp.id && c.province === camp.province).slice(0, 3);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: camp.name,
    alternateName: camp.koreanName ? [camp.koreanName] : undefined,
    description: camp.overview ?? camp.note,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: camp.lat,
      longitude: camp.lon,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KP',
      addressRegion: camp.province,
    },
    url: absolute(`/camps/${camp.slug}`),
  };

  const kwanliso = camp.kind.includes('kwanliso');
  const f = camp.facts;
  const closed = /closed/i.test(camp.status);
  const summary = camp.overview || f.summary;
  const sources = [
    ...camp.sources,
    ...(f.report ? [{ name: `HRNK satellite report${f.report.year ? ` (${f.report.year})` : ''}`, url: f.report.url }] : []),
    { name: 'UN Commission of Inquiry (2014)', url: 'https://www.ohchr.org/en/hr-bodies/hrc/co-idprk/commission-inquiry-on-h-rin-dprk' },
  ];

  return (
    <article className="dossier-x">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <p className="eyebrow">
        <Link href="/camps">Prison camps</Link> · {camp.province}
      </p>

      <header className="dx-hero">
        <div className="dx-main">
          <span className={`kind-tag ${kwanliso ? 'kwanliso' : 'kyohwaso'}`}>
            {kwanliso ? <ShieldAlert size={14} /> : <Lock size={14} />}
            {kwanliso ? 'Political prison camp · kwanliso' : 'Prison · kyohwaso'}
          </span>
          <h1>{camp.name}</h1>
          {camp.koreanName && (
            <p className="dx-ko" lang="ko">
              {camp.koreanName}
            </p>
          )}
          {summary && <p className="dx-summary">{summary}</p>}
          <div className="tiles">
            <StatTile icon={Users} value={camp.prisoners ? `~${camp.prisoners.toLocaleString()}` : '?'} label="prisoners" note={camp.prisoners ? 'HRNK estimate' : 'no published estimate'} tone="danger" />
            <StatTile icon={closed ? Ban : Activity} value={closed ? 'Closed' : 'Active'} label={camp.status} tone={closed ? undefined : 'warn'} />
            <StatTile icon={Landmark} value={camp.agency.replace(/\s*\(.*\)/, '').replace('Ministry of ', '')} label="run by" note={camp.agency.match(/\((.*)\)/)?.[1]} />
          </div>
        </div>
        <Locator lat={camp.lat} lon={camp.lon} county={camp.countyCode} label={camp.name} pins={allCamps.filter((c) => c.id !== camp.id).map((c) => ({ lat: c.lat, lon: c.lon, title: c.name }))} />
      </header>

      <SatView lat={camp.lat} lon={camp.lon} zoom={kwanliso ? 13 : 15} label={camp.name} height={420} />
      <p className="dx-actions">
        <Link href={`/map#camps=${camp.id}`} className="btn">
          <MapPin size={15} /> Open on the intel map
        </Link>
        {county && (
          <Link href={`/counties/${county.slug}`} className="btn">
            <Building2 size={15} /> {county.name} county
          </Link>
        )}
        <Link href="/learn/north-korea-prison-camps" className="btn">
          <BookOpen size={15} /> How the camp system works
        </Link>
      </p>

      <div className="dx-grid">
        {f.prisoners && f.prisoners.length > 0 && (
          <section className="panel">
            <h2>Who is held here</h2>
            <ChipRow items={f.prisoners} />
          </section>
        )}
        {f.labor && f.labor.length > 0 && (
          <section className="panel">
            <h2>Forced labor</h2>
            <ChipRow items={f.labor} fallback={Pickaxe} tone="warn" />
          </section>
        )}
        {!kwanliso && f.evidence && (
          <section className="panel">
            <h2>How well documented</h2>
            <EvidenceMeter level={f.evidence} />
          </section>
        )}
        {(f.aka?.length || f.extraSites > 0) && (
          <section className="panel">
            <h2>Also known as</h2>
            {f.aka?.length ? <ChipRow items={f.aka} fallback={Tag} /> : null}
            {f.extraSites > 0 && <p className="muted small">HRNK ties {f.extraSites === 1 ? 'one more site' : `${f.extraSites} more sites`} to this facility.</p>}
          </section>
        )}
      </div>

      <section className={`callout ${kwanliso ? 'danger' : ''}`}>
        <div>
          <h2>{kwanliso ? 'Crimes against humanity' : 'Why people end up here'}</h2>
          <p>
            {kwanliso
              ? 'Whole families are sent to kwanliso without trial under guilt by association (yeonjwa-je). The 2014 UN Commission of Inquiry found these crimes in the political prison camps:'
              : 'Kyohwaso hold people sentenced through the regular courts. Sentences are set in years, but hunger, beatings and heavy labor kill many before release. Common charges:'}
          </p>
          <ChipRow items={kwanliso ? COI_CRIMES : KYOHWASO_OFFENCES} fallback={kwanliso ? Skull : Gavel} tone={kwanliso ? 'danger' : ''} />
        </div>
      </section>

      <h2>Sources</h2>
      <SourceCards sources={sources} />

      {nearbyCamps.length > 0 && (
        <>
          <h2>Other facilities in {camp.province}</h2>
          <ul className="place-cards">
            {nearbyCamps.map((nc) => (
              <li key={nc.id}>
                <Link href={`/camps/${nc.slug}`} className="place-card">
                  <SatView lat={nc.lat} lon={nc.lon} zoom={nc.kind.includes('kwanliso') ? 12 : 15} label={nc.name} compact height={130} />
                  <span className="pc-body">
                    <strong>{nc.name}</strong>
                    <small>
                      {nc.kind.includes('kwanliso') ? 'Political prison camp' : 'Prison'} · {nc.status}
                    </small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
