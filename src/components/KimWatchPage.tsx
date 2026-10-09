import Link from 'next/link';
import { CalendarClock, CalendarRange, Mail, Newspaper, ShieldAlert } from 'lucide-react';
import AsOf, { formatAsOf } from '@/components/AsOf';
import { Ext } from '@/components/Ext';
import LiveDays from '@/components/LiveDays';
import PersonLink from '@/components/PersonLink';
import { SourceCards, StatTile } from '@/components/Visual';
import {
  KCNA_CATEGORY_URL,
  KIM_WATCH,
  KIM_WATCH_DATA_URL,
  KIM_WATCH_PATHS,
  KIM_WATCH_RAW_URL,
  KIM_WATCH_TEXT,
  KINDS,
  KIND_LABEL,
  LOCALE,
  REGION_LABEL,
  appearanceDays,
  buildDay,
  daysSinceLastSeen,
  longestGap,
  monthsBetween,
  regionTally,
  topCompanions,
  type AppearanceDay,
  type KimRecord,
} from '@/content/kimWatch';
import { KIM_FAMILY_PATHS } from '@/content/kimFamilyI18n';
import { PEOPLE } from '@/entities';
import { SITE_NAME, SITE_URL } from '@/site/config';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';
import '@/charts/charts.css';

// Companion names → profile ids, for names that match exactly one person we have a profile for.
const nameCount = new Map<string, number>();
for (const p of PEOPLE) nameCount.set(p.name_en, (nameCount.get(p.name_en) ?? 0) + 1);
const profileByName = new Map(PEOPLE.filter((p) => nameCount.get(p.name_en) === 1).map((p) => [p.name_en, p]));

const DAY = 86_400_000;
const isoAdd = (iso: string, n: number) => new Date(Date.parse(iso + 'T00:00:00Z') + n * DAY).toISOString().slice(0, 10);
const monthLabel = (ym: string, lang: Lang, withYear = false) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString(LOCALE[lang], { timeZone: 'UTC', month: 'short', ...(withYear && { year: 'numeric' }) });

/** A companion's name: a hover-card link when we have a profile, plain text otherwise. Hangul on the Korean page when we know it. */
function Person({ name, lang }: { name: string; lang: Lang }) {
  const p = profileByName.get(name);
  if (!p) return <span lang={lang === 'en' ? undefined : 'en'}>{name}</span>;
  return (
    <PersonLink id={p.id} lang={lang}>
      {lang === 'ko' && p.name_ko ? p.name_ko : name}
    </PersonLink>
  );
}

/**
 * A KCNA headline. The Korean page shows KCNA's own Korean headline as text with no link (kcna.kp is blocked in South
 * Korea, and following the link could get a reader there in trouble). Other languages link the English report,
 * nofollow, since it is the regime's site.
 */
function Headline({ r, lang }: { r: Pick<KimRecord, 'title' | 'titleKo' | 'url'>; lang: Lang }) {
  if (lang === 'ko') return r.titleKo ? <span>{r.titleKo}</span> : <span lang="en">{r.title}</span>;
  return (
    <Ext href={r.url} rel="nofollow noopener noreferrer" lang={lang === 'en' ? undefined : 'en'}>
      {r.title}
    </Ext>
  );
}

/** 53 weeks of squares ending on `today`, GitHub-contributions style. Server-rendered; the title on each square says what happened. */
function YearCalendar({ days, today, lang }: { days: AppearanceDay[]; today: string; lang: Lang }) {
  const t = KIM_WATCH_TEXT[lang];
  const byDate = new Map(days.map((d) => [d.date, d]));
  // start on the Monday 52 weeks back so columns are whole weeks
  let start = isoAdd(today, -364);
  while (new Date(start + 'T00:00:00Z').getUTCDay() !== 1) start = isoAdd(start, -1);
  const cells: { date: string; day?: AppearanceDay; future: boolean }[] = [];
  for (let d = start; cells.length < 53 * 7; d = isoAdd(d, 1)) cells.push({ date: d, day: byDate.get(d), future: d > today });
  const months = new Map<number, string>();
  cells.forEach((c, i) => {
    if (c.date.endsWith('-01') || i === 0) months.set(Math.floor(i / 7), monthLabel(c.date.slice(0, 7), lang));
  });
  return (
    <div className="kw-cal-wrap">
      <div className="kw-cal-months" aria-hidden="true">
        {Array.from({ length: 53 }, (_, w) => (
          <span key={w}>{months.get(w) ?? ''}</span>
        ))}
      </div>
      {/* One picture for screen readers (the label); the squares themselves are decoration with hover titles. */}
      <div className="kw-cal" role="img" aria-label={t.calendarHint}>
        {cells.map((c) => (
          <span
            key={c.date}
            className={c.future ? 'kw-cal-future' : c.day ? `kw-k-${c.day.kind}` : 'kw-cal-none'}
            title={`${formatAsOf(c.date, LOCALE[lang])}: ${c.day ? `${KIND_LABEL[c.day.kind][lang]} (${c.day.reports.length})` : t.calendarNone}`}
          />
        ))}
      </div>
    </div>
  );
}

function KindKey({ lang }: { lang: Lang }) {
  return (
    <p className="key left">
      {KINDS.map((k) => (
        <span key={k}>
          <i className={`kw-k-${k}`} /> {KIND_LABEL[k][lang]}
        </span>
      ))}
    </p>
  );
}

function HBars({ rows, max, unit }: { rows: { key: string; label: React.ReactNode; value: number; className?: string }[]; max: number; unit: (n: number) => string }) {
  return (
    <ul className="kw-hbars">
      {rows.map((r) => (
        <li key={r.key}>
          <span className="kw-hb-label">{r.label}</span>
          <span className="kw-hb-track">
            <i className={r.className ?? ''} style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          </span>
          <span className="kw-hb-value">{unit(r.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Kim Watch, shared by /kim-watch, /ko/kim-watch, /ja/kim-watch and /zh/kim-watch. Only the text changes per language. */
export default function KimWatchPage({ lang }: { lang: Lang }) {
  const t = KIM_WATCH_TEXT[lang];
  const locale = LOCALE[lang];
  const fmt = (d: string) => formatAsOf(d, locale);
  const today = buildDay();
  const { records, messages, coverage, fetched, oldestListed, lastAppearance } = KIM_WATCH;
  const days = appearanceDays(records);
  const since = daysSinceLastSeen(today);
  const lastRecord = lastAppearance && records.find((r) => r.id === lastAppearance.id);
  const gap = longestGap(days);
  const appearanceReports = records.filter((r) => r.appearance);
  const received = messages.filter((m) => m.direction === 'received').length;
  const sent = messages.length - received;
  const from = oldestListed ?? coverage.from;

  // monthly bars: every month from the first record to the build day
  const months = monthsBetween(from, today > coverage.to ? today : coverage.to).slice(-24);
  const perMonth = months.map((m) => {
    const inMonth = days.filter((d) => d.date.startsWith(m));
    return { m, total: inMonth.length, byKind: KINDS.map((k) => ({ k, n: inMonth.filter((d) => d.kind === k).length })), daughter: inMonth.filter((d) => d.daughter).length };
  });
  const maxMonth = Math.max(...perMonth.map((p) => p.total), 1);

  const mix = KINDS.map((k) => ({ key: k, label: KIND_LABEL[k][lang], value: days.filter((d) => d.kind === k).length, className: `kw-k-${k}` }))
    .filter((r) => r.value)
    .sort((a, b) => b.value - a.value);
  const regions = regionTally(days).map(([region, n]) => ({
    key: region ?? 'none',
    label: region ? (REGION_LABEL[region]?.[lang] ?? region) : t.notStated,
    value: n,
    className: region ? 'kw-bar-place' : 'kw-bar-none',
  }));
  const companions = topCompanions(days, 15);
  const daughterDays = days.filter((d) => d.daughter).length;
  const wifeDays = days.filter((d) => d.wife).length;

  // timeline grouped by month, newest first
  const timeline = new Map<string, AppearanceDay[]>();
  for (const d of days) timeline.set(d.date.slice(0, 7), [...(timeline.get(d.date.slice(0, 7)) ?? []), d]);

  const msgMonths = months.slice(-12).map((m) => ({
    m,
    received: messages.filter((x) => x.direction === 'received' && x.date.startsWith(m)).length,
    sent: messages.filter((x) => x.direction === 'sent' && x.date.startsWith(m)).length,
  }));

  const sources =
    lang === 'ko'
      ? [{ name: t.dataLink, url: KIM_WATCH_DATA_URL, note: 'GitHub' }]
      : [
          { name: `KCNA: WPK General Secretary Kim Jong Un's Revolutionary Activities`, url: KCNA_CATEGORY_URL, note: 'kcna.kp (HTTP)' },
          { name: t.dataLink, url: KIM_WATCH_DATA_URL, note: 'GitHub' },
        ];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: t.metaTitle,
    description: t.datasetDescription,
    inLanguage: LANG_TAG[lang],
    url: absolute(KIM_WATCH_PATHS[lang]),
    dateModified: fetched,
    temporalCoverage: `${from}/${coverage.to}`,
    creator: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    // the Korean page doesn't link kcna.kp (blocked in South Korea), so the source is named without a URL there
    isBasedOn:
      lang === 'ko'
        ? { '@type': 'CreativeWork', name: 'KCNA (Korean Central News Agency) reports on Kim Jong Un’s activities' }
        : { '@type': 'CreativeWork', name: 'KCNA (Korean Central News Agency) reports on Kim Jong Un’s activities', url: KCNA_CATEGORY_URL },
    distribution: { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: KIM_WATCH_RAW_URL },
  };

  return (
    <div className="wide kw">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>

      <div className="kw-source" role="note">
        <ShieldAlert size={18} aria-hidden="true" />
        <div>
          <b>{t.sourceTitle}</b>
          <p>{t.source}</p>
        </div>
      </div>

      {lastAppearance && since !== null && (
        <section className="kw-hero">
          <div className="kw-hero-num">
            <b className="display">
              <LiveDays from={lastAppearance.date} initial={since} />
            </b>
            <span>
              <LiveDays from={lastAppearance.date} initial={since} show="unit" one={t.lastSeenBlock.unit(1)} many={t.lastSeenBlock.unit(2)} /> <em>{t.daysSince}</em>
            </span>
          </div>
          <div className="kw-hero-last">
            <small>{t.lastSeen}</small>
            <b>{fmt(lastAppearance.date)}</b>
            {lastRecord && (
              <p>
                <Headline r={lastRecord} lang={lang} />
              </p>
            )}
            <p className="muted small">{t.counted(fmt(fetched))}</p>
          </div>
        </section>
      )}

      <div className="tiles">
        <StatTile icon={CalendarRange} value={days.length} label={t.tiles.days} note={t.tiles.daysNote(fmt(from), fmt(coverage.to))} />
        <StatTile icon={Newspaper} value={appearanceReports.length} label={t.tiles.reports} note={t.tiles.reportsNote} />
        <StatTile icon={CalendarClock} value={t.daysUnit(gap.days)} label={t.tiles.gap} note={gap.from && t.tiles.gapNote(fmt(gap.from), fmt(gap.to))} tone="warn" />
        <StatTile icon={Mail} value={messages.length} label={t.tiles.letters} note={t.tiles.lettersNote(received, sent)} />
      </div>
      <p>
        <AsOf date={fetched} lang={lang} />
      </p>

      <section className="index-section">
        <h2>{t.calendarTitle}</h2>
        <p className="muted">{t.calendarHint}</p>
        <div className="panel">
          <YearCalendar days={days} today={today} lang={lang} />
          <KindKey lang={lang} />
        </div>
      </section>

      <section className="index-section">
        <h2>{t.monthTitle}</h2>
        <p className="muted">{t.monthHint}</p>
        <div className="panel">
          <ol className="year-bars sanc-bars kw-bars">
            {perMonth.map((p) => (
              <li key={p.m} title={`${monthLabel(p.m, lang, true)}: ${t.daysUnit(p.total)}`}>
                <span className="yb-stack" style={{ height: `${(p.total / maxMonth) * 86}%` }}>
                  {p.byKind.filter((b) => b.n).map((b) => (
                    <i key={b.k} style={{ flex: b.n }} className={`kw-k-${b.k}`} />
                  ))}
                </span>
                {p.total > 0 && <em style={{ '--h': `${(p.total / maxMonth) * 86}%` } as React.CSSProperties}>{p.total}</em>}
                <small>{monthLabel(p.m, lang)}</small>
              </li>
            ))}
          </ol>
          <KindKey lang={lang} />
        </div>
      </section>

      <div className="kw-grid">
        <section className="index-section">
          <h2>{t.mixTitle}</h2>
          <p className="muted">{t.mixHint}</p>
          <HBars rows={mix} max={Math.max(...mix.map((r) => r.value), 1)} unit={t.daysUnit} />
        </section>
        <section className="index-section">
          <h2>{t.whereTitle}</h2>
          <p className="muted">{t.whereHint}</p>
          <HBars rows={regions} max={Math.max(...regions.map((r) => r.value), 1)} unit={t.daysUnit} />
        </section>
      </div>

      <section className="index-section">
        <h2>{t.whoTitle}</h2>
        <p className="muted">{t.whoHint}</p>
        <HBars
          rows={companions.map(([name, n]) => ({ key: name, label: <Person name={name} lang={lang} />, value: n, className: 'kw-bar-person' }))}
          max={companions[0]?.[1] ?? 1}
          unit={t.daysUnit}
        />
      </section>

      <section className="index-section">
        <h2>{t.daughterTitle}</h2>
        <div className="kw-daughter">
          <div className="kw-daughter-num">
            <b className="display">{daughterDays}</b>
            <span>/ {t.daysUnit(days.length)}</span>
          </div>
          <div>
            <p>{t.daughter(daughterDays, days.length)}</p>
            <p className="muted">{t.daughterPhotos}</p>
            <p className="muted small">
              {t.daughterProfile}
              <PersonLink id="kim-ju-ae" lang={lang} /> · {t.wife(wifeDays)}
            </p>
          </div>
        </div>
        <ol className="year-bars kw-bars kw-bars-small" aria-hidden="true">
          {perMonth.map((p) => (
            <li key={p.m} title={`${monthLabel(p.m, lang, true)}: ${p.daughter}`}>
              <span className="yb-stack" style={{ height: `${p.daughter ? Math.max(12, (p.daughter / Math.max(...perMonth.map((x) => x.daughter), 1)) * 86) : 0}%` }}>
                {p.daughter > 0 && <i style={{ flex: 1 }} className="kw-bar-daughter" />}
              </span>
              <small>{monthLabel(p.m, lang)}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="index-section">
        <h2>
          {t.timelineTitle} <small>{days.length}</small>
        </h2>
        <p className="muted">
          {t.timelineHint} {t.approxNote}
        </p>
        {lang === 'ko' ? t.noLinkNote && <p className="muted small">{t.noLinkNote}</p> : t.linkNote && <p className="muted small">{t.linkNote}</p>}
        {t.englishNote && <p className="muted small">{t.englishNote}</p>}
        <div className="kw-timeline">
          {[...timeline.entries()].map(([m, list], i) => (
            <details key={m} open={i < 3}>
              <summary>
                {monthLabel(m, lang, true)} <small>{t.daysUnit(list.length)}</small>
              </summary>
              <ol>
                {list.map((d) => (
                  <li key={d.date} className="kw-day">
                    <time dateTime={d.date} className={`kw-day-date kw-kb-${d.kind}`}>
                      {formatAsOf(d.date, locale)}
                      {d.approx && '*'}
                    </time>
                    <div>
                      <ul className="kw-reports">
                        {d.reports.map((r) => (
                          <li key={r.id}>
                            <Headline r={r} lang={lang} />
                            {r.speech && <span className="kw-chip">{t.speech}</span>}
                          </li>
                        ))}
                      </ul>
                      <p className="kw-day-meta">
                        <span className={`kw-chip kw-chip-${d.kind}`}>{KIND_LABEL[d.kind][lang]}</span>
                        {d.regions.map((rg) => (
                          <span key={rg} className="kw-chip">
                            {REGION_LABEL[rg]?.[lang] ?? rg}
                          </span>
                        ))}
                        {d.daughter && <span className="kw-chip kw-chip-daughter">{t.daughterBadge}</span>}
                        {d.companions.length > 0 && (
                          <span className="kw-with">
                            {t.withLabel}:{' '}
                            {d.companions.map((n, j) => (
                              <span key={n}>
                                {j > 0 && ', '}
                                <Person name={n} lang={lang} />
                              </span>
                            ))}
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </section>

      <section className="index-section">
        <h2>{t.messagesTitle}</h2>
        <p className="muted">{t.messagesHint}</p>
        <div className="kw-grid">
          <div className="table-wrap">
            <table className="sanc-table kw-msg-table">
              <thead>
                <tr>
                  <th>
                    <span className="sr-only">{t.month}</span>
                  </th>
                  <th>{t.received}</th>
                  <th>{t.sent}</th>
                </tr>
              </thead>
              <tbody>
                {msgMonths
                  .slice()
                  .reverse()
                  .map((r) => (
                    <tr key={r.m}>
                      <td>{monthLabel(r.m, lang, true)}</td>
                      <td>{r.received}</td>
                      <td>{r.sent}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3>{t.latestMessages}</h3>
            <ul className="kw-msgs" lang="en">
              {messages.slice(0, 10).map((m) => (
                <li key={m.id}>
                  <small>{formatAsOf(m.date, locale)}</small>{' '}
                  {lang === 'ko' ? m.title : (
                    <Ext href={m.url} rel="nofollow noopener noreferrer">
                      {m.title}
                    </Ext>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="index-section prose">
        <h2>{t.methodTitle}</h2>
        {t.method(fmt(from)).map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p>{t.check}</p>
        <p>
          <Ext href={KIM_WATCH_DATA_URL}>{t.dataLink}</Ext> · <code lang="en">scripts/build-kimwatch.ts</code>
        </p>
        <p className="muted small">
          <PersonLink id="kim-jong-un" lang={lang} />
          {' · '}
          <Link href={KIM_FAMILY_PATHS[lang]}>{t.familyTree}</Link>
        </p>
      </section>

      <h2>{t.sources}</h2>
      <SourceCards sources={sources} />
    </div>
  );
}
