import Link from 'next/link';
import { CalendarDays, CheckCircle2, Map, Rocket, Target } from 'lucide-react';
import AsOf from '@/components/AsOf';
import { Ext } from '@/components/Ext';
import LaunchReports from '@/components/LaunchReports';
import { StatTile } from '@/components/Visual';
import { MISSILE_LIST_LOCALE, MISSILE_LIST_PATHS, MISSILE_LIST_TEXT, MISSILE_TYPE_IDS } from '@/content/missileList';
import { buildDataset } from '@/missiles/data';
import { TYPE_COLOR } from '@/missiles/meta';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';
import testsRaw from '../../public/data/test.en.json';
import missilesRaw from '../../public/data/missile.en.json';
import facilitiesRaw from '../../public/data/facility.en.json';

// Same data as the /missiles map, as a plain table: readable without JavaScript, by people and by search engines.
export const MISSILE_LIST_DATA = buildDataset(testsRaw as never, missilesRaw as never, facilitiesRaw as never);

const CNS_URL = 'https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/';
const REPO_URL = 'https://github.com/nagix/nk-missile-tests';
const CNS_NAME = 'CNS North Korea Missile Test Database';
const REPO_NAME = 'nagix/nk-missile-tests';
const CREATOR = 'James Martin Center for Nonproliferation Studies (CNS)';

/** UTC calendar date, formatted for the page language. */
function formatDate(iso: string, lang: Lang) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString(MISSILE_LIST_LOCALE[lang], {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatKm(n: number | null, lang: Lang, empty: string) {
  if (n === null) return empty;
  return `${n.toLocaleString(MISSILE_LIST_LOCALE[lang])} km`;
}

/** The missile-test table, shared by /missiles/list, /ko/missiles/list, /ja/missiles/list and /zh/missiles/list. */
export default function MissileListPage({ lang }: { lang: Lang }) {
  const text = MISSILE_LIST_TEXT[lang];
  const { tests, minYear, maxYear } = MISSILE_LIST_DATA;
  const latest = tests[0];
  const years = [...new Set(tests.map((test) => test.year))];
  const known = tests.filter((test) => test.outcome !== 'unknown');
  const success = Math.round((known.filter((test) => test.outcome === 'success').length / known.length) * 100);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: text.datasetName(minYear, maxYear),
    description: text.datasetDescription(tests.length),
    inLanguage: LANG_TAG[lang],
    url: absolute(MISSILE_LIST_PATHS[lang]),
    temporalCoverage: `${tests.at(-1)!.date}/${latest.date}`,
    creator: { '@type': 'Organization', name: CREATOR },
    // Same terms as the missile-launches series: the machine-readable copy we build from is MIT (nagix/nk-missile-tests).
    license: 'https://opensource.org/license/mit',
    isBasedOn: CNS_URL,
  };

  return (
    <div className="wide">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href="/missiles">{text.eyebrowLink}</Link> · {text.eyebrowRest}
      </p>
      <h1>{text.h1(minYear, maxYear)}</h1>
      <p className="lede">{text.lede(tests.length)}</p>
      <div className="tiles">
        <StatTile icon={Rocket} value={tests.length} label={text.stats.tests} />
        <StatTile icon={Target} value={tests.filter((test) => test.missile.type === 'ICBM').length} label={text.stats.icbm} tone="danger" />
        <StatTile icon={CheckCircle2} value={`${success}%`} label={text.stats.succeeded} note={text.stats.succeededNote} />
        <StatTile
          icon={CalendarDays}
          value={formatDate(latest.date, lang)}
          label={text.stats.latest}
          note={<span lang="en">{latest.missile.name}</span>}
        />
      </div>
      <p>
        <AsOf date={latest.date} label={text.dataRunsTo} lang={lang} /> ·{' '}
        <span className="muted small">
          {text.source.before}
          <Ext href={CNS_URL} lang="en">
            {CNS_NAME}
          </Ext>
          {text.source.between}
          <Ext href={REPO_URL} lang="en">
            {REPO_NAME}
          </Ext>
          {text.source.after}
          {text.source.note}
        </span>
      </p>
      <p className="dx-actions">
        <Link href="/missiles" className="btn primary">
          <Map size={15} /> {text.openMap}
        </Link>
      </p>

      <LaunchReports lang={lang} />

      <nav className="mlist-years" aria-label={text.jumpToYear}>
        {years.map((year) => (
          <a key={year} href={`#y${year}`} className="chip">
            {year} <small>{tests.filter((test) => test.year === year).length}</small>
          </a>
        ))}
      </nav>
      <p className="key left">
        {MISSILE_TYPE_IDS.map((id) => {
          const type = text.types[id];
          return (
            <span key={id} title={type.hint}>
              <i style={{ background: TYPE_COLOR[id] }} /> {type.label === id ? <span lang="en">{type.label}</span> : type.label}
            </span>
          );
        })}
      </p>

      {years.map((year) => {
        const rows = tests.filter((test) => test.year === year);
        return (
          <section key={year} id={`y${year}`} className="index-section mlist-year">
            <h2>
              {year} <small>{text.yearCount(rows.length)}</small>
            </h2>
            <div className="table-wrap">
              <table className="mlist-table">
                <thead>
                  <tr>
                    <th>{text.columns.date}</th>
                    <th>{text.columns.missile}</th>
                    <th>{text.columns.site}</th>
                    <th>{text.columns.distance}</th>
                    <th>{text.columns.apogee}</th>
                    <th>{text.columns.landed}</th>
                    <th>{text.columns.outcome}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <Link href={`/missiles#test=${row.id}`}>{formatDate(row.date, lang)}</Link>
                      </td>
                      <td>
                        <i className="dot" style={{ background: TYPE_COLOR[row.missile.type] }} />
                        <span lang="en">{row.missile.name}</span>{' '}
                        <small className="muted" lang="en">
                          {row.missile.type === 'Unknown' ? '' : row.missile.type}
                        </small>
                      </td>
                      <td lang="en">{row.facility.name}</td>
                      <td className="nowrap">{formatKm(row.distanceKm, lang, text.empty)}</td>
                      <td className="nowrap">{formatKm(row.apogeeKm, lang, text.empty)}</td>
                      <td>{row.landingRegion ? <span lang="en">{row.landingRegion}</span> : text.empty}</td>
                      <td className={`nowrap out-${row.outcome}`}>
                        {text.outcomes[row.outcome]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
