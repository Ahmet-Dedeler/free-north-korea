import { Radar } from 'lucide-react';
import AsOf from '@/components/AsOf';
import { Ext } from '@/components/Ext';
import { LAST_DATASET_TEST_UTC, LAUNCH_REPORTS, launchEvents, launchesNotInDataset, type Bound, type LaunchReport } from '@/content/events';
import { EVENT_TEXT, areaText, formatWhen } from '@/content/eventsI18n';
import type { Lang } from '@/site/seo';

/** How many of the latest reports to show when the database already has all of them. */
const LATEST = 3;

function kmList(values: number[], lang: Lang, bound: Bound) {
  const t = EVENT_TEXT[lang];
  if (!values.length) return '–';
  return t.bound(values.map((v) => t.km(v)).join(' / '), bound);
}

function Row({ e, lang, fresh }: { e: LaunchReport & { also: string[] }; lang: Lang; fresh: boolean }) {
  const t = EVENT_TEXT[lang];
  const area = areaText(e.areaJa, lang);
  /** Every launch time MOD gives to the minute (several when one release covers several launches). */
  const exact = e.timesJst.filter((x) => x.includes(':'));
  return (
    <tr className={fresh ? 'mod-fresh' : ''}>
      <td className="nowrap">
        {fresh && <span className="mod-badge">{t.launches.notYet}</span>}
        <b>{formatWhen(e.launchJst, lang, { tz: 'Asia/Tokyo', time: e.precision === 'minute' })}</b>
        {e.precision === 'minute' && <small>{formatWhen(e.launchUtc, lang)}</small>}
        {e.precision === 'hour' && <small>{`${e.timesJst[0]}:00–${e.timesJst[0]}:59 ${t.jst}`}</small>}
        {exact.length > (e.precision === 'minute' ? 1 : 0) && <small>{`${exact.join(', ')} ${t.jst}`}</small>}
      </td>
      <td>
        {t.count(e.count, e.countNote)} <small className="muted">{t.weapon[e.weapon]}</small>
        {e.areaJa && <small>{area ?? <span lang="ja">{e.areaJa}</span>}</small>}
      </td>
      <td className="nowrap">{kmList(e.rangeKm, lang, e.rangeBound)}</td>
      <td className="nowrap">{kmList(e.apogeeKm, lang, e.apogeeBound)}</td>
      <td>
        {e.landing ? t.landing[e.landing] : e.landingJa ? <span lang="ja">{e.landingJa}</span> : '–'}
        {e.eez && <small>{t.eez[e.eez]}</small>}
      </td>
      <td className="nowrap">
        <Ext href={e.url} hrefLang="ja">
          {t.launches.report}
        </Ext>
        {e.also.length > 0 && <small>{t.launches.alsoReports(e.also.length)}</small>}
      </td>
    </tr>
  );
}

/**
 * Japan Ministry of Defense launch reports on /missiles/list (all four languages). Launches the ministry reported
 * after the last test in the CNS dataset are flagged "not yet in the database"; when there are none, the latest
 * few reports are shown so readers can see the cross-check is live.
 */
export default function LaunchReports({ lang }: { lang: Lang }) {
  const t = EVENT_TEXT[lang];
  const fresh = launchesNotInDataset();
  const rows = fresh.length ? fresh : launchEvents().slice(0, LATEST);
  return (
    <section className="mod-wire panel" id="japan-mod-reports">
      <h2>
        <Radar size={20} className="h-icon" aria-hidden="true" /> {t.launches.title}
      </h2>
      <p>{t.launches.body}</p>
      {!fresh.length && <p className="muted">{t.launches.upToDate}</p>}
      <div className="table-wrap">
        <table className="mlist-table mod-table">
          <thead>
            <tr>
              <th>{t.launches.columns.time}</th>
              <th>{t.launches.columns.missiles}</th>
              <th>{t.launches.columns.distance}</th>
              <th>{t.launches.columns.apogee}</th>
              <th>{t.launches.columns.landed}</th>
              <th>{t.launches.columns.report}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <Row key={e.id} e={e} lang={lang} fresh={fresh.includes(e)} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="mod-foot">
        <AsOf date={LAUNCH_REPORTS.fetched.slice(0, 10)} label={t.launches.checked} lang={lang} staleAfter={1} />{' '}
        <span className="muted small">
          {t.launches.datasetLast}
          {lang === 'ja' || lang === 'zh' ? '：' : ': '}
          {formatWhen(new Date(LAST_DATASET_TEST_UTC).toISOString(), lang)} ·{' '}
          <Ext href={LAUNCH_REPORTS.source.url} hrefLang="ja" lang="ja">
            防衛省 報道資料
          </Ext>
        </span>
      </p>
    </section>
  );
}
