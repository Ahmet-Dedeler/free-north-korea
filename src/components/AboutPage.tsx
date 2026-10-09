import Link from 'next/link';
import { Activity, CodeXml, Handshake, Landmark, Link2, PenLine, Satellite, ShieldOff, UserRound, Users } from 'lucide-react';
import { SourceCards, StatTile } from '@/components/Visual';
import { ABOUT_SOURCES, ABOUT_TEXT } from '@/content/about';
import { REPO_URL } from '@/site/config';
import type { Lang } from '@/site/seo';
import { Ext } from './Ext';

/** A page that exists in every language: English at the root, the rest under /ko, /ja, /zh. */
const at = (lang: Lang, path: string) => (lang === 'en' ? path : `/${lang}${path}`);

/** One icon per line of "How the data is collected", in the same order as the text. */
const DATA_ICONS = [Landmark, Activity, Satellite, Users, UserRound, Link2];

/**
 * /about and its translations: who is behind the site (a group, no faces), who writes the articles, how the data is
 * collected, money, and contact. Text lives in content/about.ts.
 */
export default function AboutPage({ lang }: { lang: Lang }) {
  const t = ABOUT_TEXT[lang];
  return (
    <div className="wide about">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>

      <div className="tiles about-tiles">
        {t.tiles.map((x) => (
          <StatTile key={x.label} value={x.value} label={x.label} />
        ))}
      </div>

      <div className="about-grid">
        <section>
          <h2>
            <PenLine size={20} aria-hidden /> {t.writeTitle}
          </h2>
          {t.write.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <section>
          <h2>
            <ShieldOff size={20} aria-hidden /> {t.facesTitle}
          </h2>
          {t.faces.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <section>
          <h2>
            <Handshake size={20} aria-hidden /> {t.notTitle}
          </h2>
          {t.not.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      </div>

      <section className="band">
        <h2>{t.dataTitle}</h2>
        <p className="muted">{t.dataIntro}</p>
        <ul className="about-data">
          {t.data.map((line, i) => {
            const Icon = DATA_ICONS[i] ?? Link2;
            return (
              <li key={line}>
                <Icon size={18} aria-hidden />
                <span>{line}</span>
              </li>
            );
          })}
        </ul>
        <p className="about-leftout">{t.leftOut}</p>
        <p>
          <Link href={at(lang, '/sources')}>{t.sourcesLink} →</Link>
        </p>
      </section>

      <section className="band callout">
        <h2>{t.contactTitle}</h2>
        {t.contact.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="hero-cta">
          <Ext className="btn primary" href={`${REPO_URL}/issues/new`}>
            {t.issue}
          </Ext>
          <Ext className="btn" href={REPO_URL}>
            <CodeXml size={15} aria-hidden /> {t.code}
          </Ext>
        </div>
      </section>

      <section className="band">
        <h2>{t.sources}</h2>
        <SourceCards sources={ABOUT_SOURCES} />
      </section>
    </div>
  );
}
