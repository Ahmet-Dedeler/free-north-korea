/**
 * /north-korea-vs-south-korea, shared by the English, Korean and Japanese routes. Every number in the text and the
 * tiles is read from data/series at build time, so the page follows the weekly data refresh by itself.
 */
import { BookOpen, Database } from 'lucide-react';
import Link from 'next/link';
import { chartProps, getSeries, latest, LOCALE, valueAt, type Band } from '@/charts/data';
import ChartView from '@/charts/ChartView';
import { ENTITY_LABEL, dataPath } from '@/content/series';
import { media } from '@/content/media';
import { TWO_KOREAS, TWO_KOREAS_PATHS, type Nums } from '@/content/twoKoreas';
import { REPO_URL } from '@/site/config';
import { absolute, jsonLd, type Lang } from '@/site/seo';

const ROOT: Record<Lang, string> = { en: '', ko: '/ko', ja: '/ja' };

function numbers(lang: Lang) {
  const nf = (v: number | undefined, digits = 1) =>
    v === undefined ? '?' : new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(v);
  const L = (id: string, e: string) => latest(id, e)!;
  const le = { p: L('life-expectancy', 'PRK'), k: L('life-expectancy', 'KOR') };
  const gdp = { p: L('gdp-per-capita', 'PRK'), k: L('gdp-per-capita', 'KOR') };
  const cm = { p: L('child-mortality', 'PRK'), k: L('child-mortality', 'KOR') };
  const en = { p: L('energy-per-person', 'PRK'), k: L('energy-per-person', 'KOR') };
  const el = { p: L('electricity-per-person', 'PRK'), k: L('electricity-per-person', 'KOR') };
  const dem = L('democracy', 'PRK');
  const hm = { p: L('height-men', 'PRK'), k: L('height-men', 'KOR') };
  // Life expectancy low point during the famine, from the data rather than typed in.
  const famine = Math.min(...getSeries('life-expectancy').entities.PRK.filter(([t]) => +t >= 1994 && +t <= 2002).map(([, v]) => v));
  const n: Nums = {
    leP: nf(le.p.v),
    leK: nf(le.k.v),
    leYear: String(le.p.t),
    leGap: nf(le.k.v - le.p.v),
    le90P: nf(valueAt('life-expectancy', 'PRK', 1990)),
    le90K: nf(valueAt('life-expectancy', 'KOR', 1990)),
    leFamine: nf(famine),
    gdpP: nf(gdp.p.v, 0),
    gdpK: nf(gdp.k.v, 0),
    gdpYear: String(gdp.p.t),
    gdpRatio: nf(gdp.k.v / gdp.p.v, 0),
    gdp40P: nf(valueAt('gdp-per-capita', 'PRK', 1940), 0),
    gdp40K: nf(valueAt('gdp-per-capita', 'KOR', 1940), 0),
    cmP: nf(cm.p.v),
    cmK: nf(cm.k.v),
    cmYear: String(cm.p.t),
    cmRatio: nf(cm.p.v / cm.k.v, 0),
    cm90: nf(valueAt('child-mortality', 'PRK', 1990)),
    cm96: nf(valueAt('child-mortality', 'PRK', 1996)),
    enP: nf(en.p.v, 0),
    enK: nf(en.k.v, 0),
    en80P: nf(valueAt('energy-per-person', 'PRK', 1980), 0),
    en80K: nf(valueAt('energy-per-person', 'KOR', 1980), 0),
    accP: nf(latest('electricity-access', 'PRK')!.v, 0),
    demP: nf(dem.v, 2),
    demYear: String(dem.t),
    dem86K: nf(valueAt('democracy', 'KOR', 1986), 2),
    dem88K: nf(valueAt('democracy', 'KOR', 1988), 2),
    hmP: nf(hm.p.v),
    hmK: nf(hm.k.v),
    hm30P: nf(valueAt('height-men', 'PRK', 1930)),
    hm30K: nf(valueAt('height-men', 'KOR', 1930)),
  };
  return { n, le, gdp, cm, el, nf };
}

/** Side-by-side comparison tile with two proportional bars. */
function VsTile({ label, p, k, unit, foot, year, lang, digits = 1 }: { label: string; p: number; k: number; unit: string; foot: string; year: string; lang: Lang; digits?: number }) {
  const max = Math.max(p, k);
  const fmt = (v: number) => new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: digits }).format(v);
  return (
    <div className="vs-tile">
      <span className="vs-label">
        {label} <small>{year}</small>
      </span>
      {(['PRK', 'KOR'] as const).map((c) => {
        const v = c === 'PRK' ? p : k;
        return (
          <div key={c} className={`vs-row ${c.toLowerCase()}`}>
            <span className="vs-name">{ENTITY_LABEL[c][lang]}</span>
            <span className="vs-bar">
              <i style={{ width: `${Math.max(2, (v / max) * 100)}%` }} />
            </span>
            <b>
              {fmt(v)}
              <small>{unit}</small>
            </b>
          </div>
        );
      })}
      <span className="vs-foot">{foot}</span>
    </div>
  );
}

export default function TwoKoreasPage({ lang }: { lang: Lang }) {
  const t = TWO_KOREAS[lang];
  const { n, le, gdp, cm, el, nf } = numbers(lang);
  const night = media('page:korea-at-night');
  const B = t.bands;
  const war: Band = { from: 1950, to: 1953, label: B.war };
  const famine: Band = { from: 1994, to: 1998, label: B.famine };

  const charts: Record<string, ReturnType<typeof chartProps>> = {
    money: chartProps('gdp-per-capita', lang, { entities: ['KOR', 'PRK', 'CHN', 'WLD'], from: 1911, bands: [war] }),
    life: chartProps('life-expectancy', lang, { entities: ['KOR', 'PRK', 'CHN', 'WLD'], from: 1950, bands: [war, famine] }),
    kids: chartProps('child-mortality', lang, { entities: ['PRK', 'KOR', 'CHN', 'WLD'], from: 1960, bands: [famine] }),
    energy: chartProps('energy-per-person', lang, { entities: ['KOR', 'PRK', 'CHN', 'WLD'], from: 1965 }),
    freedom: chartProps('democracy', lang, { entities: ['KOR', 'PRK', 'CHN'], from: 1945, bands: [{ from: 1987, to: 1988, label: B.democracy }] }),
  };
  const more = [
    chartProps('height-men', lang, { entities: ['KOR', 'PRK', 'CHN'], compact: true }),
    chartProps('calories', lang, { entities: ['KOR', 'PRK', 'WLD'], compact: true }),
    chartProps('electricity-access', lang, { entities: ['KOR', 'PRK', 'WLD'], compact: true }),
    chartProps('mobile-phones', lang, { entities: ['KOR', 'PRK', 'WLD'], from: 2000, compact: true }),
    chartProps('fertility', lang, { entities: ['KOR', 'PRK', 'WLD'], compact: true }),
    chartProps('armed-forces', lang, { entities: ['PRK', 'KOR'], compact: true }),
    chartProps('co2-per-person', lang, { entities: ['KOR', 'PRK', 'WLD'], compact: true }),
    chartProps('population', lang, { entities: ['KOR', 'PRK'], from: 1945, compact: true }),
  ];

  const faq = t.faq(n);
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: t.metaTitle,
      description: t.metaDescription,
      inLanguage: lang,
      url: absolute(TWO_KOREAS_PATHS[lang]),
      dateModified: getSeries('life-expectancy').fetched,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

  return (
    <div className="wide tk">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href={dataPath(lang)}>{t.eyebrow}</Link>
      </p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>

      <div className="tk-hero">
        <div className="vs-grid">
          <VsTile lang={lang} label={t.vs.life} p={le.p.v} k={le.k.v} unit={lang === 'en' ? ' yrs' : lang === 'ko' ? '세' : '歳'} year={String(le.p.t)} foot={t.shorter(n.leGap)} />
          <VsTile lang={lang} label={t.vs.gdp} p={gdp.p.v} k={gdp.k.v} digits={0} unit=" $" year={String(gdp.p.t)} foot={t.times(n.gdpRatio)} />
          <VsTile lang={lang} label={t.vs.power} p={el.p.v} k={el.k.v} digits={0} unit=" kWh" year={String(el.p.t)} foot={t.times(nf(el.k.v / el.p.v, 0))} />
          <VsTile lang={lang} label={t.vs.kids} p={cm.p.v} k={cm.k.v} unit="%" year={String(cm.p.t)} foot={t.timesNorth(n.cmRatio)} />
        </div>
        {night && (
          <figure className="tk-night">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={night.src} alt={t.nightCaption} width={840} height={1224} loading="eager" />
            <figcaption>
              {t.nightCaption}{' '}
              <a href={night.sourceUrl} target="_blank" rel="noopener noreferrer">
                {night.credit}
              </a>
            </figcaption>
          </figure>
        )}
      </div>

      {t.sections.map((s) => (
        <section key={s.id} id={s.id} className="tk-section">
          <h2>{s.h2}</h2>
          <div className="tk-text">
            {s.body(n).map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
          <ChartView {...charts[s.id]} />
        </section>
      ))}

      <section className="tk-section">
        <h2>{t.moreTitle}</h2>
        <p className="muted">{t.moreHint}</p>
        <div className="chart-grid">
          {more.map((c) => (
            <ChartView key={c.id} {...c} />
          ))}
        </div>
      </section>

      <section className="callout tk-caveat">
        <h2>{t.caveatTitle}</h2>
        {t.caveat.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </section>

      <section className="tk-section">
        <h2>{t.faqTitle}</h2>
        <div className="tk-faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="tk-data">
        <div>
          <h2>{t.dataTitle}</h2>
          <p>{t.dataBody}</p>
        </div>
        <div className="tk-data-cta">
          <Link className="btn primary" href={dataPath(lang)}>
            <Database size={16} aria-hidden="true" /> {t.dataCta}
          </Link>
          <a className="btn" href={`${REPO_URL}/tree/main/data/series`} target="_blank" rel="noopener noreferrer">
            {t.githubCta}
          </a>
          <Link className="btn" href={`${ROOT[lang]}/learn/how-can-north-korea-be-freed`}>
            <BookOpen size={16} aria-hidden="true" /> {t.readNext}
          </Link>
        </div>
      </section>
    </div>
  );
}
