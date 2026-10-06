'use client';

import { useState } from 'react';
import { Ext } from '@/components/Ext';
import { CATEGORIES, KIND_LABEL, ORGS, STATUS_LABEL, type Org, type OrgCategory, type Social } from '@/content/orgs';
import { ORG_LABELS, ORG_PAGE } from '@/content/orgsI18n';
import { orgLogo } from '@/content/media';
import type { Lang } from '@/site/seo';
import { GlobeIcon, SOCIALS, SocialIcon } from './SocialIcon';

/** "Liberty in North Korea (LiNK)" → "LiNK"; otherwise initials of the first words. */
function monogram(name: string) {
  const abbr = name.match(/\(([A-Za-z0-9 ]{2,5})\)/)?.[1];
  if (abbr) return abbr;
  return name
    .replace(/\(.*\)/, '')
    .split(/\s+/)
    .filter((w) => /^[A-Z0-9]/.test(w))
    .map((w) => w[0])
    .slice(0, 3)
    .join('');
}

function Logo({ org }: { org: Org }) {
  const logo = orgLogo(org.id);
  return (
    <span className={`org-logo ${logo ? '' : `mono cat-${org.category}`}`} aria-hidden="true">
      {logo ? <img src={logo.src} alt="" loading="lazy" /> : monogram(org.name)}
    </span>
  );
}

/** English card fields stay in orgs.ts. Other languages overlay summary, note, help, category and status. */
function cardText(org: Org, lang: Lang) {
  if (lang === 'en') {
    return {
      summary: org.summary,
      note: org.note,
      help: org.help.map((h) => h.label),
      category: CATEGORIES.find((c) => c.id === org.category)!,
      status: STATUS_LABEL[org.status],
      kind: org.kind ? KIND_LABEL[org.kind] : '',
    };
  }
  const pack = ORG_LABELS[lang];
  const row = pack.orgs[org.id];
  return {
    summary: row.summary,
    note: row.note,
    help: row.help,
    category: pack.categories[org.category],
    status: pack.status[org.status],
    kind: org.kind ? pack.kind[org.kind] : '',
  };
}

function OrgCard({ org: o, lang }: { org: Org; lang: Lang }) {
  const ui = ORG_PAGE[lang];
  const text = cardText(o, lang);
  const socials = Object.entries(o.socials ?? {}) as [Social, string][];
  return (
    <article id={o.id} className="org">
      <header className="org-top">
        <Logo org={o} />
        <div className="org-title">
          <h2 lang="en">
            <Ext href={o.url}>{o.name}</Ext>
          </h2>
          <p className="org-meta">
            {text.kind ? `${text.kind} · ` : ''}
            <span lang="en">{o.based}</span>
            {o.founded ? ` · ${ui.founded(o.founded)}` : ''}
          </p>
        </div>
      </header>

      <div className="org-tags">
        <span className={`org-cat cat-${o.category}`} title={text.category.hint}>
          {text.category.label}
        </span>
        <span className={`status status-${o.status}`}>{text.status}</span>
      </div>

      <p className="org-summary">{text.summary}</p>
      {text.note && <p className="org-note">{text.note}</p>}

      <footer className="org-foot">
        {o.help.length > 0 && (
          <div className="org-actions">
            {o.help.map((h, i) => (
              <Ext key={h.url + text.help[i]} className={`btn ${i === 0 ? 'primary' : ''}`} href={h.url}>
                {text.help[i]}
              </Ext>
            ))}
          </div>
        )}
        <div className="org-links">
          {!o.noSite && (
            <Ext className="social" href={o.url} title={o.lang ? ui.websiteIn(o.lang) : ui.website}>
              <GlobeIcon />
              <span className="sr-only">{ui.website}</span>
              {o.lang && <small lang="en">{o.lang.slice(0, 2).toUpperCase()}</small>}
            </Ext>
          )}
          {socials.map(([kind, url]) => (
            <Ext
              key={kind}
              className="social"
              href={url}
              title={SOCIALS[kind].label}
              style={{ '--brand': `#${SOCIALS[kind].hex}` } as React.CSSProperties}
            >
              <SocialIcon kind={kind} />
              <span className="sr-only">{SOCIALS[kind].label}</span>
            </Ext>
          ))}
        </div>
      </footer>
    </article>
  );
}

/** Filterable org cards. Every card is in the server HTML; filtering only hides cards. */
export default function OrgDirectory({ lang = 'en' }: { lang?: Lang }) {
  const [cat, setCat] = useState<OrgCategory | 'all'>('all');
  const ui = ORG_PAGE[lang];
  const shown = cat === 'all' ? ORGS : ORGS.filter((o) => o.category === cat);
  const cats = lang === 'en' ? CATEGORIES : CATEGORIES.map((c) => ({ id: c.id, ...ORG_LABELS[lang].categories[c.id] }));
  return (
    <>
      <div className="chips tabs" role="tablist" aria-label={ui.filterLabel}>
        <button role="tab" aria-selected={cat === 'all'} className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>
          {ui.all} <small>{ORGS.length}</small>
        </button>
        {cats.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={cat === c.id}
            title={c.hint}
            className={`chip ${cat === c.id ? 'on' : ''}`}
            onClick={() => setCat(c.id)}
          >
            <i className={`cat-${c.id}`} />
            {c.label} <small>{ORGS.filter((o) => o.category === c.id).length}</small>
          </button>
        ))}
      </div>

      <div className="org-grid">
        {shown.map((o) => (
          <OrgCard key={o.id} org={o} lang={lang} />
        ))}
      </div>
    </>
  );
}
