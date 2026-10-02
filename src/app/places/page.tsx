import Link from 'next/link';
import { getAllPlaces } from '@/content/places-data';
import { PLACE_CATEGORIES } from '@/content/places';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'Key Sites & Strategic Facilities in North Korea',
  description:
    'Comprehensive directory of North Korea’s strategic installations: nuclear complexes, undeclared missile operating bases, border crossing points, regime monuments, and economic zones.',
  path: '/places',
});

export default function PlacesIndex() {
  const places = getAllPlaces();

  return (
    <div className="wide">
      <p className="eyebrow">Strategic Geography</p>
      <h1>Key Sites & Strategic Facilities</h1>
      <p className="lede">
        Nuclear reactors, underground missile checkout shelters, DMZ border posts, Pyongyang monuments, and special economic
        enclaves across North Korea.
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '1.5rem 0' }}>
        <Link href="/map#sites=yongbyon" className="chip on">
          Explore on Intel Map →
        </Link>
        {PLACE_CATEGORIES.filter((c) => c.id !== 'camp' && c.id !== 'route').map((c) => (
          <a key={c.id} href={`#${c.id}`} className="chip">
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: c.color, marginRight: '6px' }} />
            {c.label}
          </a>
        ))}
      </div>

      {PLACE_CATEGORIES.filter((c) => c.id !== 'camp' && c.id !== 'route').map((cat) => {
        const matching = places.filter((p) => p.category === cat.id);
        if (matching.length === 0) return null;
        return (
          <section key={cat.id} id={cat.id} style={{ marginTop: '3rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }} />
              {cat.label} <small className="muted" style={{ fontSize: '0.6em', fontWeight: 'normal' }}>({matching.length})</small>
            </h2>
            <p className="muted">{cat.hint}</p>

            <div className="cards three" style={{ marginTop: '1.5rem' }}>
              {matching.map((p) => (
                <article key={p.id} className="card">
                  <p className="kicker" style={{ color: cat.color }}>
                    {p.categoryLabel}
                  </p>
                  <h3>
                    <Link href={`/places/${p.slug}`}>{p.name}</Link>
                  </h3>
                  {p.status && (
                    <p className="dossier-badges" style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="badge">{p.status}</span>
                    </p>
                  )}
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-2)' }}>{p.note}</p>
                  <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                    <Link href={`/places/${p.slug}`}>Read details →</Link>
                    {' · '}
                    <Link href={`/map#sites=${p.id}`} className="muted">
                      View on map
                    </Link>
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
