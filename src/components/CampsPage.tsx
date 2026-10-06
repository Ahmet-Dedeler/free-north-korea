import Link from 'next/link';
import { BookOpen, Lock, MapPin, ShieldAlert, Users } from 'lucide-react';
import CampCard from '@/components/CampCard';
import Locator from '@/components/Locator';
import { StatTile } from '@/components/Visual';
import { getAllCamps } from '@/content/camps';
import { CAMPS_TEXT, hrefFor } from '@/content/campsI18n';
import type { Lang } from '@/site/seo';

/** The camps index, shared by /camps, /ko/camps, /ja/camps and /zh/camps. */
export default function CampsPage({ lang }: { lang: Lang }) {
  const t = CAMPS_TEXT[lang];
  const camps = getAllCamps();
  const kwanliso = camps.filter((c) => c.kind.includes('kwanliso'));
  const kyohwaso = camps.filter((c) => !c.kind.includes('kwanliso'));

  const pins = camps.map((c) => ({
    lat: c.lat,
    lon: c.lon,
    title: c.name,
    href: hrefFor(lang, `/camps/${c.slug}`),
    color: c.kind.includes('kwanliso') ? '#dc2626' : '#ea580c',
    r: c.kind.includes('kwanliso') ? 8 : 6,
  }));

  return (
    <div className="wide">
      <div className="index-hero">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.h1}</h1>
          <p className="lede">{t.lede}</p>
          <div className="tiles">
            <StatTile icon={Users} value={t.statPrisonersValue} label={t.statPrisoners} note={t.statPrisonersNote} tone="danger" />
            <StatTile icon={ShieldAlert} value={kwanliso.length} label={t.statKwanliso} />
            <StatTile icon={Lock} value={kyohwaso.length} label={t.statKyohwaso} />
          </div>
          <p className="dx-actions">
            <Link href="/map#camps=camp-0" className="btn primary">
              <MapPin size={15} /> {t.openMap}
            </Link>
            <Link href={hrefFor(lang, '/learn/north-korea-prison-camps')} className="btn">
              <BookOpen size={15} /> {t.howSystem}
            </Link>
          </p>
        </div>
        <figure className="index-map">
          <Locator pins={pins} label={t.mapLabel} />
          <figcaption className="key">
            <span>
              <i style={{ background: '#dc2626' }} /> {t.legendKwanliso}
            </span>
            <span>
              <i style={{ background: '#ea580c' }} /> {t.legendKyohwaso}
            </span>
          </figcaption>
        </figure>
      </div>

      <section className="index-section">
        <h2>
          <ShieldAlert size={20} className="h-icon danger" /> {t.kwanlisoTitle} <small>{kwanliso.length}</small>
        </h2>
        <p className="muted">{t.kwanlisoBlurb}</p>
        <ul className="place-cards">
          {kwanliso.map((c) => (
            <CampCard key={c.id} camp={c} lang={lang} />
          ))}
        </ul>
      </section>

      <section className="index-section">
        <h2>
          <Lock size={20} className="h-icon warn" /> {t.kyohwasoTitle} <small>{kyohwaso.length}</small>
        </h2>
        <p className="muted">{t.kyohwasoBlurb}</p>
        <ul className="place-cards">
          {kyohwaso.map((c) => (
            <CampCard key={c.id} camp={c} lang={lang} />
          ))}
        </ul>
      </section>
    </div>
  );
}
