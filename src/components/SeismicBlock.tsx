import { Activity } from 'lucide-react';
import AsOf from '@/components/AsOf';
import { Ext } from '@/components/Ext';
import { SEISMIC, TEST_SITE_RADIUS_KM, seismicNearTestSite, seismicSince, type SeismicEvent } from '@/content/events';
import { EVENT_TEXT, formatWhen } from '@/content/eventsI18n';
import type { Lang } from '@/site/seo';

/** Magnitude bars run from 0 to this, so the 2017 test (mb 6.3) nearly fills the row. */
const MAX_MAG = 7;
const TONE: Record<string, string> = { 'nuclear explosion': 'danger', collapse: 'warn' };

function Label({ e, lang }: { e: SeismicEvent; lang: Lang }) {
  const t = EVENT_TEXT[lang];
  const text = t.usgsTypes[e.type] ?? e.type;
  return (
    <span className={`seis-label ${TONE[e.type] ?? ''}`} title={`USGS: ${e.type}`} lang={t.usgsTypes[e.type] ? undefined : 'en'}>
      {text}
    </span>
  );
}

const mag = (e: SeismicEvent) => (e.mag == null ? '?' : e.mag.toFixed(1));

/**
 * USGS seismic readings for /military (all four languages): the events at the Punggye-ri test site as bars, and
 * every event in the search box in a table that opens on click. Server-rendered, so the numbers are in the HTML.
 */
export default function SeismicBlock({ lang }: { lang: Lang }) {
  const t = EVENT_TEXT[lang];
  const near = seismicNearTestSite();
  const tests = near.filter((e) => e.type === 'nuclear explosion').length;
  const km = (n: number) => t.km(Math.round(n * 10) / 10);

  return (
    <div className="seis">
      <h3>
        <Activity size={18} className="h-icon" aria-hidden="true" /> {t.seismic.title}
      </h3>
      <p className="mil-p">{t.seismic.body(tests)}</p>
      <h4>{t.seismic.nearTitle(near.length, TEST_SITE_RADIUS_KM)}</h4>
      <ol className="seis-rows">
        {near.map((e) => (
          <li key={e.id} className={TONE[e.type] ?? ''}>
            <span className="seis-date">{formatWhen(e.time, lang, { time: false })}</span>
            <Label e={e} lang={lang} />
            <span className="seis-bar" aria-hidden="true">
              <i style={{ width: `${((e.mag ?? 0) / MAX_MAG) * 100}%` }} />
            </span>
            <span className="seis-mag">
              <b>{mag(e)}</b> <small lang="en">{e.magType}</small>
            </span>
            <span className="seis-km">{t.seismic.fromSite(km(e.kmFromTestSite))}</span>
            <Ext href={e.url} className="seis-link" aria-label={`${t.seismic.columns.link}: ${e.id}`}>
              USGS
            </Ext>
          </li>
        ))}
      </ol>

      <details className="seis-all">
        <summary>{t.seismic.allTitle(SEISMIC.events.length, seismicSince())}</summary>
        <p className="muted small">{t.seismic.allNote}</p>
        <div className="table-wrap">
          <table className="mlist-table">
            <thead>
              <tr>
                <th>{t.seismic.columns.date}</th>
                <th>{t.seismic.columns.label}</th>
                <th>{t.seismic.columns.magnitude}</th>
                <th>{t.seismic.columns.place}</th>
                <th>{t.seismic.columns.distance}</th>
              </tr>
            </thead>
            <tbody>
              {SEISMIC.events.map((e) => (
                <tr key={e.id}>
                  <td className="nowrap">
                    <Ext href={e.url}>{formatWhen(e.time, lang)}</Ext>
                  </td>
                  <td>
                    <Label e={e} lang={lang} />
                  </td>
                  <td className="nowrap">
                    {mag(e)} <small className="muted" lang="en">{e.magType}</small>
                  </td>
                  <td lang="en">{e.place}</td>
                  <td className="nowrap">{km(e.kmFromTestSite)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="seis-foot">
        <AsOf date={SEISMIC.fetched.slice(0, 10)} label={t.seismic.fetched} lang={lang} staleAfter={1} />{' '}
        <span className="muted small">
          {t.seismic.sourceBefore}
          <Ext href={SEISMIC.source.url} lang="en">
            {SEISMIC.source.name}
          </Ext>
        </span>
      </p>
    </div>
  );
}
