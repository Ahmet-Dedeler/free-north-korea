/**
 * /north-korea-vs-south-korea, shared by the English, Korean, Japanese and Chinese routes. Built like a poster: a "tale of the
 * tape" up top, then numbered chapters, each with its own kind of picture (annotated line charts, a stripe timeline,
 * people drawn to scale, hatched bars). Every number in the text and the pictures is read from data/series at build
 * time, so the page follows the weekly data refresh by itself.
 */
import { ArrowUpRight, BookOpen, Database } from 'lucide-react';
import Link from 'next/link';
import { chartProps, getSeries, latest, LOCALE, valueAt, type Band } from '@/charts/data';
import ChartView from '@/charts/ChartView';
import { PeopleToScale, Stripes, TaleOfTape, type TapeRow } from '@/charts/Infographics';
import { dataPath } from '@/content/series';
import { media } from '@/content/media';
import { TWO_KOREAS, TWO_KOREAS_PATHS, type Nums } from '@/content/twoKoreas';
import { REPO_URL } from '@/site/config';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';

const ROOT: Record<Lang, string> = { en: '', ko: '/ko', ja: '/ja', zh: '/zh' };

function numbers(lang: Lang) {
  const nf = (v: number | undefined, digits = 1) =>
    v === undefined ? '?' : new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(v);
  const L = (id: string, e: string) => latest(id, e)!;
  // Latest year both series actually have, so a labelled comparison is never 2024 against 2025.
  const paired = (id: string) => {
    const p = L(id, 'PRK');
    const k = L(id, 'KOR');
    const year = Math.min(Number(p.t), Number(k.t));
    return { p: { t: year, v: valueAt(id, 'PRK', year) ?? p.v }, k: { t: year, v: valueAt(id, 'KOR', year) ?? k.v } };
  };
  const le = { p: L('life-expectancy', 'PRK'), k: L('life-expectancy', 'KOR') };
  const gdp = { p: L('gdp-per-capita', 'PRK'), k: L('gdp-per-capita', 'KOR') };
  const cm = { p: L('child-mortality', 'PRK'), k: L('child-mortality', 'KOR') };
  const en = paired('energy-per-person');
  const el = paired('electricity-per-person');
  const dem = L('democracy', 'PRK');
  const hm = { p: L('height-men', 'PRK'), k: L('height-men', 'KOR') };
  const hw = { p: L('height-women', 'PRK'), k: L('height-women', 'KOR') };
  const food = { p: L('calories', 'PRK'), k: L('calories', 'KOR') };
  const phones = { p: L('mobile-phones', 'PRK'), k: L('mobile-phones', 'KOR') };
  const demK = L('democracy', 'KOR');
  // Defector arrivals: totals per year from the women and men series.
  const def = getSeries('defector-arrivals').entities;
  const defYears = def.women.map(([t, v]) => ({ t: Number(t), v: v + (def.men.find(([u]) => u === t)?.[1] ?? 0), w: v }));
  const defPeak = defYears.reduce((a, b) => (b.v > a.v ? b : a));
  const defMin = defYears.reduce((a, b) => (b.v < a.v ? b : a));
  const defLast = defYears[defYears.length - 1];
  const defTotal = defYears.reduce((sum, d) => sum + d.v, 0);
  const defWomen = defYears.reduce((sum, d) => sum + d.w, 0) / defTotal;
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
    hmGap: nf(hm.k.v - hm.p.v),
    hwP: nf(hw.p.v),
    hwK: nf(hw.k.v),
    defTotal: nf(defTotal, 0),
    defFrom: String(defYears[0].t),
    defWomen: nf(defWomen * 100, 0),
    defPeak: nf(defPeak.v, 0),
    defPeakYear: String(defPeak.t),
    defMin: nf(defMin.v, 0),
    defMinYear: String(defMin.t),
    defLast: nf(defLast.v, 0),
    defLastYear: String(defLast.t),
  };
  return { n, le, gdp, cm, el, hm, food, phones, dem, demK, nf };
}

export default function TwoKoreasPage({ lang }: { lang: Lang }) {
  const t = TWO_KOREAS[lang];
  const { n, le, gdp, cm, el, hm, food, phones, dem, demK, nf } = numbers(lang);
  const night = media('page:korea-at-night');
  const B = t.bands;
  const U = t.units;
  const war: Band = { from: 1950, to: 1953, label: B.war };
  const famine: Band = { from: 1994, to: 1998, label: B.famine };
  const famineYear = Number(
    getSeries('life-expectancy')
      .entities.PRK.filter(([y]) => +y >= 1994 && +y <= 2002)
      .reduce((a, b) => (b[1] < a[1] ? b : a))[0],
  );
  const sp = lang === 'ja' || lang === 'zh' ? '' : ' '; // the h1 text must read exactly like t.h1
  const times = (a: number, b: number) => `${nf(a / b, a / b >= 10 ? 0 : 1)}×`;

  const tape: TapeRow[] = [
    { label: t.tape.life, meta: `${le.p.t} · ${U.years}`, p: le.p.v, k: le.k.v, chip: `+${n.leGap}` },
    { label: t.tape.gdp, meta: `${gdp.p.t} · $`, p: gdp.p.v, k: gdp.k.v, digits: 0, prefix: '$', chip: times(gdp.k.v, gdp.p.v) },
    { label: t.tape.power, meta: `${el.p.t} · kWh`, p: el.p.v, k: el.k.v, digits: 0, chip: times(el.k.v, el.p.v) },
    { label: t.tape.kids, meta: `${cm.p.t} · %`, p: cm.p.v, k: cm.k.v, suffix: '%', chip: times(cm.p.v, cm.k.v) },
    { label: t.tape.food, meta: `${food.p.t} / ${food.k.t} · ${U.kcal}`, p: food.p.v, k: food.k.v, digits: 0, chip: times(food.k.v, food.p.v) },
    { label: t.tape.phones, meta: `${phones.p.t} / ${phones.k.t} · ${U.per100}`, p: phones.p.v, k: phones.k.v, digits: 0, chip: times(phones.k.v, phones.p.v) },
    { label: t.tape.height, meta: `${U.bornIn(String(hm.p.t))} · ${U.cm}`, p: hm.p.v, k: hm.k.v, chip: `+${n.hmGap}` },
    { label: t.tape.freedom, meta: `${dem.t} · ${U.index}`, p: dem.v, k: demK.v, digits: 2 },
  ];

  const charts: Record<string, ReturnType<typeof chartProps>> = {
    money: chartProps('gdp-per-capita', lang, {
      entities: ['KOR', 'PRK', 'CHN', 'WLD'],
      from: 1911,
      bands: [war],
      gap: { hi: 'KOR', lo: 'PRK', mode: 'ratio' },
      notes: [{ x: 1940, key: 'PRK', text: t.notes.money(n), side: 'up' }],
    }),
    life: chartProps('life-expectancy', lang, {
      entities: ['KOR', 'PRK', 'CHN', 'WLD'],
      from: 1950,
      bands: [war, famine],
      gap: { hi: 'KOR', lo: 'PRK', mode: 'diff' },
      notes: [{ x: famineYear, key: 'PRK', text: t.notes.life(n), side: 'down' }],
    }),
    kids: chartProps('child-mortality', lang, {
      entities: ['PRK', 'KOR', 'CHN', 'WLD'],
      from: 1960,
      bands: [famine],
      gap: { hi: 'PRK', lo: 'KOR', mode: 'ratio' },
      notes: [{ x: 1996, key: 'PRK', text: t.notes.kids(n), side: 'up' }],
    }),
    energy: chartProps('energy-per-person', lang, {
      entities: ['KOR', 'PRK', 'CHN', 'WLD'],
      from: 1965,
      gap: { hi: 'KOR', lo: 'PRK', mode: 'ratio' },
      notes: [{ x: 1980, key: 'PRK', text: t.notes.energy, side: 'up' }],
    }),
    leaving: chartProps('defector-arrivals', lang, { kind: 'stacked' }),
  };
  const more = [
    chartProps('calories', lang, { entities: ['KOR', 'PRK', 'WLD'], compact: true, gap: { hi: 'KOR', lo: 'PRK', mode: 'ratio' } }),
    chartProps('electricity-access', lang, { entities: ['KOR', 'PRK', 'WLD'], compact: true }),
    chartProps('mobile-phones', lang, { entities: ['KOR', 'PRK', 'WLD'], from: 2000, compact: true }),
    chartProps('fertility', lang, { entities: ['KOR', 'PRK', 'WLD'], compact: true }),
    chartProps('armed-forces', lang, { entities: ['PRK', 'KOR'], compact: true }),
    chartProps('co2-per-person', lang, { entities: ['KOR', 'PRK', 'WLD'], compact: true }),
    chartProps('population', lang, { entities: ['KOR', 'PRK'], from: 1945, compact: true }),
    chartProps('height-women', lang, { entities: ['KOR', 'PRK', 'CHN'], compact: true }),
  ];

  /** The picture for each chapter. */
  const visual = (id: string) => {
    if (id === 'freedom')
      return (
        <>
          <Stripes
            id="democracy"
            entities={['KOR', 'PRK', 'CHN']}
            from={1945}
            lang={lang}
            low={t.stripes.low}
            high={t.stripes.high}
            marks={[
              { x: 1948, label: t.stripes.twoStates },
              { x: 1987, label: B.democracy },
            ]}
          />
          <p className="tk-more-link">
            <Link href={dataPath(lang, 'democracy')}>
              {t.stripes.open} <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </p>
        </>
      );
    if (id === 'height')
      return (
        <PeopleToScale
          lang={lang}
          men={[hm.p.v, hm.k.v]}
          women={[latest('height-women', 'PRK')!.v, latest('height-women', 'KOR')!.v]}
          labels={{ men: t.height.men, women: t.height.women, born: U.bornIn(String(hm.p.t)) }}
        />
      );
    return charts[id] ? <ChartView {...charts[id]} /> : null;
  };

  const faq = t.faq(n);
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: t.metaTitle,
      description: t.metaDescription,
      inLanguage: LANG_TAG[lang],
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

      <header className="tk-poster">
        {night && (
          <figure className="tk-poster-photo">
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
        <div className="tk-poster-text">
          <p className="tk-kicker">
            <Link href={dataPath(lang)}>{t.eyebrow}</Link>
            <span>{t.poster.kicker}</span>
          </p>
          <h1 className="tk-title display">
            <span className="prk">{t.poster.north}</span>
            {sp}
            <span className="vs">{t.poster.vs}</span>
            {sp}
            <span className="kor">{t.poster.south}</span>
          </h1>
          <p className="tk-lede">{t.lede}</p>
        </div>
        <div className="tk-poster-tape">
          <h2 className="tk-tape-title">{t.poster.tape}</h2>
          <TaleOfTape rows={tape} lang={lang} />
        </div>
      </header>

      {t.sections.map((s, i) => (
        <section key={s.id} id={s.id} className="tk-section">
          <div className="tk-chapter">
            <span className="tk-num display" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="display">{s.h2}</h2>
          </div>
          <div className="tk-text">
            {s.body(n).map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
          {visual(s.id)}
        </section>
      ))}

      <section className="tk-section">
        <div className="tk-chapter">
          <span className="tk-num display" aria-hidden="true">
            +
          </span>
          <h2 className="display">{t.moreTitle}</h2>
        </div>
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
