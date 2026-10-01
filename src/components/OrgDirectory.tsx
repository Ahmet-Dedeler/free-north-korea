'use client';

import { useState } from 'react';
import { CATEGORIES, ORGS, STATUS_LABEL, type OrgCategory } from '@/content/orgs';

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
            {c.label} <small>{ORGS.filter((o) => o.category === c.id).length}</small>
          </button>
        ))}
      </div>

      <div className="org-grid">
        {shown.map((o) => (
          <section key={o.id} id={o.id} className="org">
            <div className="org-head">
              <span className="org-cat">{CATEGORIES.find((c) => c.id === o.category)!.label}</span>
              <span className={`status status-${o.status}`}>{STATUS_LABEL[o.status]}</span>
            </div>
            <h2>
              <a href={o.url} target="_blank" rel="noopener noreferrer">
                {o.name}
              </a>
            </h2>
            <p className="org-meta">
              {o.based}
              {o.founded ? ` · since ${o.founded}` : ''}
            </p>
            <p>{o.summary}</p>
            {o.note && <p className="org-note">{o.note}</p>}
            {o.help.length > 0 && (
              <p className="org-help">
                {o.help.map((h) => (
                  <a key={h.url + h.label} href={h.url} target="_blank" rel="noopener noreferrer">
                    {h.label} →
                  </a>
                ))}
              </p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
