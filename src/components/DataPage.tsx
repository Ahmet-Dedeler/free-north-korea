/**
 * /data (chart and dataset hub) and /data/<id> (one chart with its table, source and citation), shared by the
 * English, Korean and Japanese routes. Server components; only ChartView runs in the browser.
 */
import { ArrowRight, CalendarClock, Database, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { chartProps, getSeries, LOCALE, SERIES, SERIES_BUILT, toX, type Series } from '@/charts/data';
import ChartView from '@/charts/ChartView';
import { defaultsFor } from '@/charts/defaults';
import { DATA_TEXT } from '@/content/dataPage';
import { ENTITY_LABEL, SERIES_TEXT, TOPICS, UNIT_LABEL, dataPath } from '@/content/series';
import { TWO_KOREAS_PATHS } from '@/content/twoKoreas';
import { REPO_URL } from '@/site/config';
import { absolute, jsonLd, type Lang } from '@/site/seo';
import '@/charts/charts.css';

const RAW = `${REPO_URL.replace('github.com', 'raw.githubusercontent.com')}/main/data/series/csv`;

/** Small server-rendered trend line for a card: the chart's entities in their usual colours. */
function Sparkline({ s }: { s: Series }) {
  const o = defaultsFor(s.id);
  const p = chartProps(s.id, 'en', o);
  const W = 240;
  const H = 46;
  const stacked = p.kind !== 'line';
  const lines = p.lines.slice(0, stacked ? 4 : 3);
  const xs = [...new Set(lines.flatMap((l) => l.pts.map((q) => q[0])))].sort((a, b) => a - b);
  if (!xs.length) return null;
  const x0 = xs[0];
  const x1 = xs[xs.length - 1];
  const sx = (x: number) => ((x - x0) / (x1 - x0 || 1)) * W;
  if (stacked) {
    const totals = xs.map((x) => lines.reduce((sum, l) => sum + (l.pts.find((q) => q[0] === x)?.[1] ?? 0), 0));
    const max = Math.max(...totals, 1);
    const bw = Math.max(1, W / xs.length - 1);
    return (
      <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        {xs.map((x, i) => (
          <rect key={x} x={(i * W) / xs.length} y={H - (totals[i] / max) * H} width={bw} height={(totals[i] / max) * H} rx={1} style={{ fill: 'var(--e-prk)' }} />
        ))}
      </svg>
    );
  }
  const vals = lines.flatMap((l) => l.pts.map((q) => q[1]));
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const sy = (v: number) => H - 2 - ((v - lo) / (hi - lo || 1)) * (H - 4);
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      {lines.map((l) => (
        <path
          key={l.key}
          className={l.dashed ? 'dashed' : ''}
          vectorEffect="non-scaling-stroke"
          style={{ stroke: l.color }}
          d={l.pts.map((q, i) => `${i && (p.dated || q[0] - l.pts[i - 1][0] <= 3) ? 'L' : 'M'}${sx(q[0]).toFixed(1)},${sy(q[1]).toFixed(1)}`).join('')}
        />
      ))}
    </svg>
  );
}

/** "North Korea: 73.6 years (2023)" for a card. Stacked series show the latest total. */
function latestLine(s: Series, lang: Lang) {
  const nf = (v: number) => new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: Math.abs(v) < 10 ? 2 : Math.abs(v) < 100 ? 1 : 0 }).format(v);
  const unit = UNIT_LABEL[s.unit]?.[lang] ?? s.unit;
  const u = unit === '%' ? '%' : ` ${unit}`;
  const keys = Object.keys(s.entities);
  const kind = defaultsFor(s.id).kind ?? 'line';
  const when = (t: number | string) => (typeof t === 'number' ? String(t) : new Intl.DateTimeFormat(LOCALE[lang], { year: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(t + 'T00:00:00Z')));
  if (kind !== 'line') {
    const lastT = keys.map((k) => s.entities[k].at(-1)![0]).sort().at(-1)!;
    const total = keys.reduce((sum, k) => sum + (s.entities[k].find(([t]) => t === lastT)?.[1] ?? 0), 0);
    return `${nf(total)}${u} (${when(lastT)})`;
  }
  const k = keys.includes('PRK') ? 'PRK' : keys.includes('pyongyang') ? 'pyongyang' : keys[0];
  const last = s.entities[k].at(-1)!;
  return `${ENTITY_LABEL[k]?.[lang] ?? k}: ${nf(last[1])}${u} (${when(last[0])})`;
}

export function DataHub({ lang }: { lang: Lang }) {
  const t = DATA_TEXT[lang];
  const nf = new Intl.NumberFormat(LOCALE[lang]);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    name: t.metaTitle,
    description: t.metaDescription,
    inLanguage: lang,
    url: absolute(dataPath(lang)),
    dateModified: SERIES_BUILT,
    dataset: SERIES.map((s) => ({ '@type': 'Dataset', name: SERIES_TEXT[s.id]?.[lang]?.title ?? s.title, url: absolute(dataPath(lang, s.id)) })),
  };
  return (
    <div className="data-hub">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>

      <div className="data-top">
        <Link href={TWO_KOREAS_PATHS[lang]} className="data-featured">
          <span className="data-kicker">{t.featuredKicker}</span>
          <b>{t.featuredTitle}</b>
          <span>{t.featuredBody}</span>
          <ArrowRight size={18} aria-hidden="true" className="data-arrow" />
        </Link>
        <div className="data-facts">
          <div className="tile">
            <Database className="tile-icon" size={18} aria-hidden="true" />
            <b>{nf.format(SERIES.length)}</b>
            <span>{t.tiles.series}</span>
          </div>
          <div className="tile">
            <CalendarClock className="tile-icon" size={18} aria-hidden="true" />
            <b>{new Intl.DateTimeFormat(LOCALE[lang], { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(SERIES_BUILT + 'T00:00:00Z'))}</b>
            <span>{t.tiles.built}</span>
            <small>{t.tiles.builtNote}</small>
          </div>
          <div className="tile">
            <RefreshCw className="tile-icon" size={18} aria-hidden="true" />
            <b>{t.tiles.weekly}</b>
            <span>{t.tiles.weeklyNote}</span>
          </div>
        </div>
      </div>

      {TOPICS.map((topic) => (
        <section key={topic.id} className="data-topic" id={topic.id}>
          <h2>{topic.title[lang]}</h2>
          <div className="series-grid">
            {topic.series.map((id) => {
              const s = getSeries(id);
              const text = SERIES_TEXT[id]?.[lang];
              return (
                <article key={id} className="series-card">
                  <Link href={dataPath(lang, id)} className="series-main">
                    <b>{text?.title ?? s.title}</b>
                    <span className="series-sub">{text?.sub}</span>
                    <Sparkline s={s} />
                    <span className="series-latest">{latestLine(s, lang)}</span>
                  </Link>
                  <div className="series-foot">
                    <span className="series-src">{s.source.name.replace(/, via Our World in Data$/, '')}</span>
                    <a className="chip-btn" href={`${RAW}/${id}.csv`} download>
                      <Download size={13} aria-hidden="true" /> {t.csv}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section className="callout data-ours">
        <h2>{t.oursTitle}</h2>
        <p>{t.ours}</p>
      </section>

      <section className="data-meta">
        <div>
          <h2>{t.licenseTitle}</h2>
          <p className="muted">{t.license}</p>
        </div>
        <a className="btn" href={`${REPO_URL}/tree/main/data/series`} target="_blank" rel="noopener noreferrer">
          <Database size={16} aria-hidden="true" /> {t.github}
        </a>
      </section>
    </div>
  );
}

export function SeriesPage({ lang, id }: { lang: Lang; id: string }) {
  const t = DATA_TEXT[lang];
  const s = getSeries(id);
  const text = SERIES_TEXT[id]?.[lang];
  const title = text?.title ?? s.title;
  const topic = TOPICS.find((tp) => tp.series.includes(id));
  const related = (topic?.series ?? []).filter((r) => r !== id).slice(0, 4);
  const year = SERIES_BUILT.slice(0, 4);
  const url = absolute(dataPath(lang, id));
  const all = Object.values(s.entities).flat();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: title,
    description: text?.sub ?? s.title,
    inLanguage: lang,
    url,
    dateModified: s.fetched,
    temporalCoverage: `${String(all.reduce((m, [x]) => (toX(x) < toX(m) ? x : m), all[0][0]))}/${String(all.reduce((m, [x]) => (toX(x) > toX(m) ? x : m), all[0][0]))}`,
    isBasedOn: s.source.url,
    license: s.source.license,
    distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${RAW}/${id}.csv` }],
  };
  return (
    <div className="data-series">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href={dataPath(lang)}>{t.back}</Link>
        {topic && (
          <>
            {' · '}
            <Link href={`${dataPath(lang)}#${topic.id}`}>{topic.title[lang]}</Link>
          </>
        )}
      </p>
      <h1>{title}</h1>
      <ChartView {...chartProps(id, lang, defaultsFor(id))} />

      <section className="data-about">
        <h2>{t.about}</h2>
        <dl>
          <dt>{t.latestLabel}</dt>
          <dd>{latestLine(s, lang)}</dd>
          <dt>{t.licenseTitle}</dt>
          <dd>{s.source.license ?? '—'}</dd>
          <dt>{t.citeTitle}</dt>
          <dd className="cite">{t.cite(title, url, s.source.name, year)}</dd>
        </dl>
        <div className="chart-actions">
          <a className="chip-btn" href={`${RAW}/${id}.csv`} download>
            <Download size={14} aria-hidden="true" /> CSV
          </a>
          <a className="chip-btn" href={`${REPO_URL}/blob/main/data/series/csv/${id}.csv`} target="_blank" rel="noopener noreferrer">
            <Database size={14} aria-hidden="true" /> {t.github}
          </a>
        </div>
      </section>

      {related.length > 0 && (
        <section className="data-related">
          <h2>{t.related}</h2>
          <div className="chart-grid">
            {related.map((r) => (
              <ChartView key={r} {...chartProps(r, lang, { ...defaultsFor(r), compact: true })} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
