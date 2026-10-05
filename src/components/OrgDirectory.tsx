'use client';

import { useState } from 'react';
import { CATEGORIES, KIND_LABEL, ORGS, STATUS_LABEL, type Org, type OrgCategory, type Social } from '@/content/orgs';
import { orgLogo } from '@/content/media';
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

function OrgCard({ org: o }: { org: Org }) {
  const category = CATEGORIES.find((c) => c.id === o.category)!;
  const socials = Object.entries(o.socials ?? {}) as [Social, string][];
  return (
    <article id={o.id} className="org">
      <header className="org-top">
        <Logo org={o} />
        <div className="org-title">
          <h2>
            <a href={o.url} target="_blank" rel="noopener noreferrer">
              {o.name}
            </a>
          </h2>
          <p className="org-meta">
            {o.kind ? `${KIND_LABEL[o.kind]} · ` : ''}
            {o.based}
            {o.founded ? ` · since ${o.founded}` : ''}
          </p>
        </div>
      </header>

      <div className="org-tags">
        <span className={`org-cat cat-${o.category}`} title={category.hint}>
          {category.label}
        </span>
        <span className={`status status-${o.status}`}>{STATUS_LABEL[o.status]}</span>
      </div>

      <p className="org-summary">{o.summary}</p>
      {o.note && <p className="org-note">{o.note}</p>}

      <footer className="org-foot">
        {o.help.length > 0 && (
          <div className="org-actions">
            {o.help.map((h, i) => (
              <a key={h.url + h.label} className={`btn ${i === 0 ? 'primary' : ''}`} href={h.url} target="_blank" rel="noopener noreferrer">
                {h.label}
              </a>
            ))}
          </div>
        )}
        <div className="org-links">
          {!o.noSite && (
            <a className="social" href={o.url} target="_blank" rel="noopener noreferrer" title={o.lang ? `Website (${o.lang})` : 'Website'}>
              <GlobeIcon />
              <span className="sr-only">Website</span>
              {o.lang && <small>{o.lang.slice(0, 2).toUpperCase()}</small>}
            </a>
          )}
          {socials.map(([kind, url]) => (
            <a
              key={kind}
              className="social"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={SOCIALS[kind].label}
              style={{ '--brand': `#${SOCIALS[kind].hex}` } as React.CSSProperties}
            >
              <SocialIcon kind={kind} />
              <span className="sr-only">{SOCIALS[kind].label}</span>
            </a>
          ))}
        </div>
      </footer>
    </article>
  );
}

/** Filterable org cards. Every card is in the server HTML; filtering only hides cards. */
export default function OrgDirectory() {
  const [cat, setCat] = useState<OrgCategory | 'all'>('all');
  const shown = cat === 'all' ? ORGS : ORGS.filter((o) => o.category === cat);
  return (
    <>
      <div className="chips tabs" role="tablist" aria-label="Filter by focus">
        <button role="tab" aria-selected={cat === 'all'} className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>
          All <small>{ORGS.length}</small>
        </button>
        {CATEGORIES.map((c) => (
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
          <OrgCard key={o.id} org={o} />
        ))}
      </div>
    </>
  );
}
