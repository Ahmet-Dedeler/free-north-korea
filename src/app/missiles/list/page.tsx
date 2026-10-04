import Link from 'next/link';
import { CalendarDays, CheckCircle2, Map, Rocket, Target } from 'lucide-react';
import AsOf from '@/components/AsOf';
import { Ext } from '@/components/Ext';
import { StatTile } from '@/components/Visual';
import { buildDataset } from '@/missiles/data';
import { OUTCOME_COLOR, OUTCOME_LABEL, TYPES, TYPE_COLOR, formatDate, km } from '@/missiles/meta';
import { absolute, jsonLd, pageMeta } from '@/site/seo';
import testsRaw from '../../../../public/data/test.en.json';
import missilesRaw from '../../../../public/data/missile.en.json';
import facilitiesRaw from '../../../../public/data/facility.en.json';

// Same data as the /missiles map, as a plain table: readable without JavaScript, by people and by search engines.
const DATA = buildDataset(testsRaw as never, missilesRaw as never, facilitiesRaw as never);
const LATEST = DATA.tests[0];

export const metadata = pageMeta({
  title: `List of North Korean Missile Tests (${DATA.minYear}–${DATA.maxYear})`,
  description: `All ${DATA.tests.length} known North Korean ballistic missile and space launch tests from ${DATA.minYear} to ${DATA.maxYear} in one table: date, missile, launch site, distance, altitude and outcome.`,
  path: '/missiles/list',
});

export default function MissileList() {
  const { tests } = DATA;
  const years = [...new Set(tests.map((t) => t.year))];
  const known = tests.filter((t) => t.outcome !== 'unknown');
  const success = Math.round((known.filter((t) => t.outcome === 'success').length / known.length) * 100);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `North Korean missile tests, ${DATA.minYear}–${DATA.maxYear}`,
    description: `Every known North Korean ballistic missile and space launch test: ${tests.length} tests with date, missile, launch site, distance, apogee and outcome.`,
    url: absolute('/missiles/list'),
    temporalCoverage: `${tests.at(-1)!.date}/${LATEST.date}`,
    creator: { '@type': 'Organization', name: 'James Martin Center for Nonproliferation Studies (CNS)' },
    isBasedOn: 'https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/',
  };

  return (
    <div className="wide">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href="/missiles">Missile tests</Link> · Full list
      </p>
      <h1>
        Every North Korean missile test, {DATA.minYear}–{DATA.maxYear}
      </h1>
      <p className="lede">
        All {tests.length} known ballistic missile and space launch tests in one table, newest first. Click a date to see the flight path on
        the map.
      </p>
      <div className="tiles">
        <StatTile icon={Rocket} value={tests.length} label="tests" />
        <StatTile icon={Target} value={tests.filter((t) => t.missile.type === 'ICBM').length} label="ICBM tests" tone="danger" />
        <StatTile icon={CheckCircle2} value={`${success}%`} label="succeeded" note="of tests with a known outcome" />
        <StatTile icon={CalendarDays} value={formatDate(LATEST.date)} label="latest test in the data" note={LATEST.missile.name} />
      </div>
      <p>
        <AsOf date={LATEST.date} label="Data runs to" /> ·{' '}
        <span className="muted small">
          Source: <Ext href="https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/">CNS North Korea Missile Test Database</Ext>{' '}
          via <Ext href="https://github.com/nagix/nk-missile-tests">nagix/nk-missile-tests</Ext>. A launch after that date may not be listed yet.
        </span>
      </p>
      <p className="dx-actions">
        <Link href="/missiles" className="btn primary">
          <Map size={15} /> Open the interactive map
        </Link>
      </p>

      <nav className="mlist-years" aria-label="Jump to year">
        {years.map((y) => (
          <a key={y} href={`#y${y}`} className="chip">
            {y} <small>{tests.filter((t) => t.year === y).length}</small>
          </a>
        ))}
      </nav>
      <p className="key left">
        {TYPES.map((t) => (
          <span key={t.id} title={t.hint}>
            <i style={{ background: t.color }} /> {t.label}
          </span>
        ))}
      </p>

      {years.map((y) => {
        const rows = tests.filter((t) => t.year === y);
        return (
          <section key={y} id={`y${y}`} className="index-section mlist-year">
            <h2>
              {y} <small>{rows.length} {rows.length === 1 ? 'test' : 'tests'}</small>
            </h2>
            <div className="table-wrap">
              <table className="mlist-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Missile</th>
                    <th>Launch site</th>
                    <th>Distance</th>
                    <th>Apogee</th>
                    <th>Landed</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <Link href={`/missiles#test=${t.id}`}>{formatDate(t.date)}</Link>
                      </td>
                      <td>
                        <i className="dot" style={{ background: TYPE_COLOR[t.missile.type] }} />
                        {t.missile.name} <small className="muted">{t.missile.type === 'Unknown' ? '' : t.missile.type}</small>
                      </td>
                      <td>{t.facility.name}</td>
                      <td className="nowrap">{km(t.distanceKm)}</td>
                      <td className="nowrap">{km(t.apogeeKm)}</td>
                      <td>{t.landingRegion ?? '—'}</td>
                      <td className="nowrap" style={{ color: OUTCOME_COLOR[t.outcome] }}>
                        {OUTCOME_LABEL[t.outcome]}
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
