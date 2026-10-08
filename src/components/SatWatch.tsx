import Link from 'next/link';
import AsOf from '@/components/AsOf';
import { Ext } from '@/components/Ext';
import SatCompare, { type SatSlot, type SatViewImage } from '@/components/SatCompare';
import { hrefFor } from '@/content/campsI18n';
import {
  SAT_TEXT,
  copernicusUrl,
  dayLabel,
  fmtKm,
  getSatSite,
  imgSrc,
  latestSatSites,
  monthLabel,
  satCredit,
  satSitePath,
  type SatSite,
} from '@/content/satWatch';
import type { Lang } from '@/site/seo';

/** Largest round distance that fits in 30% of the image width. */
function scaleBar(sizeM: number, lang: Lang) {
  const steps = [250, 500, 1000, 2000, 5000];
  const m = [...steps].reverse().find((s) => s <= sizeM * 0.3) ?? steps[0];
  const label = m >= 1000 ? SAT_TEXT[lang].km(m / 1000) : lang === 'zh' ? `${m}米` : lang === 'en' ? `${m} m` : `${m}m`;
  return { pct: (m / sizeM) * 100, label };
}

function shiftMonth(month: string, by: number) {
  const [y, m] = month.split('-').map(Number);
  const i = y * 12 + (m - 1) + by;
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`;
}

function yearsOf(site: SatSite) {
  const ys = site.images.map((i) => i.date.slice(0, 4)).sort();
  return ys[0] === ys[ys.length - 1] ? ys[0] : `${ys[0]}-${ys[ys.length - 1]}`;
}

/**
 * Camp Watch block for a camp or place dossier: the newest clear Sentinel-2 image of the site with its capture date,
 * a month strip to compare it with any earlier month, a scale bar and the Copernicus credit. Renders nothing for
 * sites without imagery. `id` is the camp slug (kwanliso-15) or the places.ts id (yongbyon).
 */
export default function SatWatch({ id, lang, name }: { id: string; lang: Lang; name: string }) {
  const site = getSatSite(id);
  if (!site) return null;
  const t = SAT_TEXT[lang];
  const km = fmtKm(site.sizeM / 1000);
  const images = [...site.images].sort((a, b) => a.date.localeCompare(b.date));
  const views: SatViewImage[] = images.map((im) => ({
    src: imgSrc(site.id, im.date),
    day: dayLabel(lang, im.date),
    alt: t.alt(name, dayLabel(lang, im.date), km),
    cloud: t.cloud(im.cloud),
    scene: im.scene,
    sceneUrl: im.src,
    copernicus: copernicusUrl(site.lat, site.lon, im.date),
  }));
  const afterIdx = images.findIndex((im) => im.date === site.latest);
  const latest = images[afterIdx];

  // One slot per month for the 24 months up to the latest image, so gaps (no clear image) stay visible.
  const lastMonth = latest.date.slice(0, 7);
  const byMonth = new Map(images.flatMap((im, i) => (im.month ? [[im.month, i] as const] : [])));
  byMonth.set(lastMonth, afterIdx);
  const slots: SatSlot[] = Array.from({ length: 24 }, (_, i) => {
    const m = shiftMonth(lastMonth, i - 23);
    return { label: monthLabel(lang, m), idx: byMonth.get(m) ?? null };
  });
  // Default comparison: the same season a year earlier (cancels most leaf and snow changes), else the oldest image.
  const yearAgo = [0, -1, 1, -2, 2].map((d) => byMonth.get(shiftMonth(lastMonth, -12 + d))).find((i) => i !== undefined);
  const defaultBefore = yearAgo ?? (afterIdx > 0 ? 0 : null);

  return (
    <section className="satwatch" aria-labelledby={`sw-${site.id}`}>
      <div className="sw-head">
        <h2 id={`sw-${site.id}`}>{t.title}</h2>
        <AsOf date={latest.date} label={t.captured} lang={lang} />
      </div>
      <p className="sw-intro">{t.intro(km, latest.pixelM)}</p>
      <SatCompare
        views={views}
        afterIdx={afterIdx}
        defaultBefore={defaultBefore}
        slots={slots}
        scale={scaleBar(site.sizeM, lang)}
        t={{
          before: t.before,
          after: t.after,
          latest: t.latest,
          pickMonth: t.pickMonth,
          compareAria: t.compareAria,
          noClear: t.noClear,
          scene: t.scene,
          openCopernicus: t.openCopernicus,
        }}
      />
      <p className="sw-note">
        {t.how} {t.ring}
      </p>
      <p className="sw-credit">
        <span lang="en">{satCredit(yearsOf(site))}</span>
        {t.creditNote && <> · {t.creditNote}</>} ·{' '}
        <Ext href="https://dataspace.copernicus.eu/">
          Copernicus Data Space
        </Ext>{' '}
        ·{' '}
        <Ext href="https://registry.opendata.aws/sentinel-2-l2a-cogs/">
          Sentinel-2 L2A COGs (AWS)
        </Ext>
      </p>
    </section>
  );
}

/**
 * The most recently imaged Camp Watch sites as cards (newest first), for a hub page or a home page strip.
 * Server component; each card links to the site's dossier.
 */
export function LatestImagery({ lang, limit = 4, heading = true }: { lang: Lang; limit?: number; heading?: boolean }) {
  const sites = latestSatSites(limit);
  if (sites.length === 0) return null;
  const t = SAT_TEXT[lang];
  return (
    <section className="sw-latest">
      {heading && (
        <>
          <h2>{t.latestTitle}</h2>
          <p className="muted">{t.latestIntro}</p>
        </>
      )}
      <ul>
        {sites.map((s) => {
          const day = dayLabel(lang, s.latest!);
          return (
            <li key={s.id}>
              <Link href={hrefFor(lang, satSitePath(s))}>
                <img src={imgSrc(s.id, s.latest!)} alt={t.alt(s.name, day, fmtKm(s.sizeM / 1000))} width={512} height={512} loading="lazy" />
                <strong lang={lang === 'en' ? undefined : 'en'}>{s.name}</strong>
                <AsOf date={s.latest!} label={t.updated} lang={lang} />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="sw-credit" lang="en">
        {satCredit(sites[0].latest!.slice(0, 4))}
      </p>
    </section>
  );
}
