import Link from 'next/link';
import { getAllCamps } from '@/content/camps';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'North Korea Prison Camps: Kwanliso and Kyohwaso Guide',
  description:
    'Documented guide to North Korea’s political prison camps (kwanliso) and correctional prisons (kyohwaso): locations, estimated prisoner counts, operating status, and satellite documentation.',
  path: '/camps',
});

export default function CampsIndex() {
  const camps = getAllCamps();
  const kwanliso = camps.filter((c) => c.kind.includes('kwanliso'));
  const kyohwaso = camps.filter((c) => !c.kind.includes('kwanliso'));

  return (
    <div className="wide">
      <p className="eyebrow">Human Rights & Detention</p>
      <h1>North Korean Prison Camps & Detention Facilities</h1>
      <p className="lede">
        The DPRK operates a two-tier concentration camp system: secret political prison camps (kwanliso) where an estimated
        80,000 to 120,000 people are imprisoned under lifetime sentences, and correctional re-education facilities (kyohwaso)
        where prisoners perform hazardous forced labor.
      </p>

      <div className="d-stats" style={{ margin: '2rem 0' }}>
        <div>
          <b>{camps.length}</b>
          <span>tracked facilities</span>
        </div>
        <div>
          <b>{kwanliso.length}</b>
          <span>kwanliso political camps</span>
        </div>
        <div>
          <b>{kyohwaso.length}</b>
          <span>kyohwaso penal camps</span>
        </div>
        <div>
          <b>~100,000+</b>
          <span>est. prisoners (UN COI)</span>
        </div>
      </div>

      <p>
        <Link href="/map#camps=camp-0" className="chip on" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Explore all camps on the interactive Intel Map →
        </Link>
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2>Political Prison Camps (Kwanliso)</h2>
        <p className="muted">
          Operated by the secret police (Ministry of State Security). Prisoners are detained without trial or legal representation,
          often alongside three generations of their family under guilt-by-association (yeonjwa-je).
        </p>
        <div className="cards three" style={{ marginTop: '1.5rem' }}>
          {kwanliso.map((c) => (
            <article key={c.id} className="card">
              <p className="kicker" style={{ color: '#dc2626' }}>
                {c.koreanName ?? 'Kwanliso'} · {c.province}
              </p>
              <h3>
                <Link href={`/camps/${c.slug}`}>{c.name}</Link>
              </h3>
              <p className="dossier-badges" style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                <span className={`badge ${c.status.toLowerCase().includes('operating') ? 'badge-dead' : 'badge-alive'}`}>{c.status}</span>
                {c.prisoners && <span className="badge">~{c.prisoners.toLocaleString()} prisoners</span>}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-2)' }}>{c.note}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                <Link href={`/camps/${c.slug}`}>Read full dossier →</Link>
                {' · '}
                <Link href={`/map#camps=${c.id}`} className="muted">
                  View on map
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '3.5rem' }}>
        <h2>Correctional Prisons (Kyohwaso) & Penal Labor</h2>
        <p className="muted">
          Operated by the Ministry of Social Security (regular police). Sentences are nominally fixed-term for economic infractions,
          unauthorized border crossing, or illegal telephone contact, but death rates from malnutrition and abuse are exceptionally high.
        </p>
        <div className="cards three" style={{ marginTop: '1.5rem' }}>
          {kyohwaso.map((c) => (
            <article key={c.id} className="card">
              <p className="kicker" style={{ color: '#f97316' }}>
                {c.koreanName ?? 'Kyohwaso'} · {c.province}
              </p>
              <h3>
                <Link href={`/camps/${c.slug}`}>{c.name}</Link>
              </h3>
              <p className="dossier-badges" style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                <span className={`badge ${c.status.toLowerCase().includes('operating') ? 'badge-dead' : 'badge-alive'}`}>{c.status}</span>
                {c.prisoners && <span className="badge">~{c.prisoners.toLocaleString()} prisoners</span>}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-2)' }}>{c.note}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                <Link href={`/camps/${c.slug}`}>Read full dossier →</Link>
                {' · '}
                <Link href={`/map#camps=${c.id}`} className="muted">
                  View on map
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
