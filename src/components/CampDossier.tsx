import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Activity, Ban, BookOpen, Building2, Gavel, Landmark, Lock, MapPin, Pickaxe, ShieldAlert, Skull, Tag, Users } from 'lucide-react';
import Locator from '@/components/Locator';
import SatView from '@/components/SatView';
import SatWatch from '@/components/SatWatch';
import { ChipRow, COI_CRIMES, EvidenceMeter, KYOHWASO_OFFENCES, SourceCards, StatTile, iconFor } from '@/components/Visual';
import type { Camp } from '@/content/camps';
import { getAllCamps } from '@/content/camps';
import { CAMPS_TEXT, agencyBits, campFields, hrefFor, laborLabel, prisonerLabel } from '@/content/campsI18n';
import { getCountyBySlug } from '@/content/counties';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';

const LOCALE: Record<Lang, string> = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-Hans' };

function FactChips({ items, label, fallback, tone }: { items: string[]; label: (s: string, i: number) => string; fallback: LucideIcon; tone?: string }) {
  return (
    <ul className={`ichips ${tone ?? ''}`}>
      {items.map((it, i) => {
        const Icon = iconFor(it, fallback);
        return (
          <li key={it}>
            <Icon size={15} aria-hidden="true" />
            {label(it, i)}
          </li>
        );
      })}
    </ul>
  );
}

function DocMeter({ level, lang }: { level?: 'imagery' | 'reports' | 'testimony'; lang: Lang }) {
  const t = CAMPS_TEXT[lang];
  const steps = [
    { id: 'imagery', label: t.evidenceImagery },
    { id: 'reports', label: t.evidenceReports },
    { id: 'testimony', label: t.evidenceTestimony },
  ] as const;
  const at = level ? steps.findIndex((s) => s.id === level) : 2;
  return (
    <ol className="evidence" aria-label={t.evidenceAria}>
      {steps.map((s, i) => (
        <li key={s.id} className={i <= at ? 'on' : ''}>
          <span />
          {s.label}
        </li>
      ))}
    </ol>
  );
}

/** One camp dossier, shared by /camps/[slug] and the Korean, Japanese and Chinese routes. */
export default function CampDossier({ lang, camp }: { lang: Lang; camp: Camp }) {
  const t = CAMPS_TEXT[lang];
  const f = campFields(lang, camp);
  const county = camp.countyCode ? getCountyBySlug(camp.countyCode) : null;
  const allCamps = getAllCamps();
  const nearbyCamps = allCamps.filter((c) => c.id !== camp.id && c.province === camp.province).slice(0, 3);
  const kwanliso = camp.kind.includes('kwanliso');
  const facts = camp.facts;
  const closed = /closed/i.test(camp.status);
  const summary = f.overview || f.summary;
  const agency = agencyBits(lang, camp.agency);
  const sources = [
    ...camp.sources,
    ...(facts.report ? [{ name: t.hrnkReport(facts.report.year), url: facts.report.url }] : []),
    { name: t.coiSource, url: 'https://www.ohchr.org/en/hr-bodies/hrc/co-idprk/commission-inquiry-on-h-rin-dprk' },
  ];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: camp.name,
    alternateName: camp.koreanName ? [camp.koreanName] : undefined,
    description: lang === 'en' ? (camp.overview ?? camp.note) : f.overview || f.note,
    inLanguage: LANG_TAG[lang],
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
    url: absolute(hrefFor(lang, `/camps/${camp.slug}`)),
  };

  const crimeEn = kwanliso ? COI_CRIMES : KYOHWASO_OFFENCES;
  const crimeLabel = kwanliso ? t.crimes : t.offences;

  return (
    <article className="dossier-x">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <p className="eyebrow">
        <Link href={hrefFor(lang, '/camps')}>{t.crumb}</Link> · {f.province}
      </p>

      <header className="dx-hero">
        <div className="dx-main">
          <span className={`kind-tag ${kwanliso ? 'kwanliso' : 'kyohwaso'}`}>
            {kwanliso ? <ShieldAlert size={14} /> : <Lock size={14} />}
            {f.kindTag}
          </span>
          <h1 lang={lang === 'en' ? undefined : 'en'}>{camp.name}</h1>
          {camp.koreanName && (
            <p className="dx-ko" lang="ko">
              {camp.koreanName}
            </p>
          )}
          {summary && <p className="dx-summary">{summary}</p>}
          <div className="tiles">
            <StatTile
              icon={Users}
              value={camp.prisoners ? `~${camp.prisoners.toLocaleString(lang === 'en' ? undefined : LOCALE[lang])}` : '?'}
              label={t.prisoners}
              note={camp.prisoners ? t.prisonersEstimate : t.prisonersUnknown}
              tone="danger"
            />
            <StatTile icon={closed ? Ban : Activity} value={closed ? t.closed : t.active} label={f.status} tone={closed ? undefined : 'warn'} />
            <StatTile icon={Landmark} value={agency.value} label={t.runBy} note={agency.note} />
          </div>
        </div>
        <Locator
          lat={camp.lat}
          lon={camp.lon}
          county={camp.countyCode}
          label={camp.name}
          pins={allCamps.filter((c) => c.id !== camp.id).map((c) => ({ lat: c.lat, lon: c.lon, title: c.name }))}
        />
      </header>

      <SatView lat={camp.lat} lon={camp.lon} zoom={kwanliso ? 13 : 15} label={camp.name} height={420} />
      <p className="dx-actions">
        <Link href={`/map#camps=${camp.id}`} className="btn">
          <MapPin size={15} /> {t.openOnMap}
        </Link>
        {county && (
          <Link href={hrefFor(lang, `/counties/${county.slug}`)} className="btn">
            <Building2 size={15} /> {t.county(county.name)}
          </Link>
        )}
        <Link href={hrefFor(lang, '/learn/north-korea-prison-camps')} className="btn">
          <BookOpen size={15} /> {t.howCamps}
        </Link>
      </p>

      <SatWatch id={camp.slug} lang={lang} name={camp.name} />

      <div className="dx-grid">
        {facts.prisoners && facts.prisoners.length > 0 && (
          <section className="panel">
            <h2>{t.whoHeld}</h2>
            {lang === 'en' ? (
              <ChipRow items={facts.prisoners} />
            ) : (
              <FactChips items={facts.prisoners} label={(s) => prisonerLabel(lang, s)} fallback={Users} />
            )}
          </section>
        )}
        {facts.labor && facts.labor.length > 0 && (
          <section className="panel">
            <h2>{t.forcedLabor}</h2>
            {lang === 'en' ? (
              <ChipRow items={facts.labor} fallback={Pickaxe} tone="warn" />
            ) : (
              <FactChips items={facts.labor} label={(s) => laborLabel(lang, s)} fallback={Pickaxe} tone="warn" />
            )}
          </section>
        )}
        {!kwanliso && facts.evidence && (
          <section className="panel">
            <h2>{t.documented}</h2>
            {lang === 'en' ? <EvidenceMeter level={facts.evidence} /> : <DocMeter level={facts.evidence} lang={lang} />}
          </section>
        )}
        {(facts.aka?.length || facts.extraSites > 0) && (
          <section className="panel">
            <h2>{t.aka}</h2>
            {facts.aka?.length ? (
              <div lang="en">
                <ChipRow items={facts.aka} fallback={Tag} />
              </div>
            ) : null}
            {facts.extraSites > 0 && <p className="muted small">{facts.extraSites === 1 ? t.extraOne : t.extraMany(facts.extraSites)}</p>}
          </section>
        )}
      </div>

      <section className={`callout ${kwanliso ? 'danger' : ''}`}>
        <div>
          <h2>{kwanliso ? t.crimesTitle : t.whyTitle}</h2>
          <p>{kwanliso ? t.crimesBody : t.whyBody}</p>
          {lang === 'en' ? (
            <ChipRow items={crimeEn} fallback={kwanliso ? Skull : Gavel} tone={kwanliso ? 'danger' : ''} />
          ) : (
            <FactChips items={[...crimeEn]} label={(_, i) => crimeLabel[i] ?? _} fallback={kwanliso ? Skull : Gavel} tone={kwanliso ? 'danger' : ''} />
          )}
        </div>
      </section>

      <h2>{t.sources}</h2>
      <SourceCards sources={sources} />

      {nearbyCamps.length > 0 && (
        <>
          <h2>{t.otherIn(f.province)}</h2>
          <ul className="place-cards">
            {nearbyCamps.map((nc) => {
              const near = campFields(lang, nc);
              return (
                <li key={nc.id}>
                  <Link href={hrefFor(lang, `/camps/${nc.slug}`)} className="place-card">
                    <SatView lat={nc.lat} lon={nc.lon} zoom={nc.kind.includes('kwanliso') ? 12 : 15} label={nc.name} compact height={130} />
                    <span className="pc-body">
                      <strong lang={lang === 'en' ? undefined : 'en'}>{nc.name}</strong>
                      <small>
                        {near.kindShort} · {near.status}
                      </small>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </article>
  );
}
