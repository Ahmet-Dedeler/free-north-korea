import { CoverCard, DocCard } from '@/components/Covers';
import { SHELVES } from '@/content/library';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'Best Books, Documentaries and Sources on North Korea',
  description:
    'The best books and documentaries on North Korea: escapee memoirs, journalism, UN reports, primary sources from the regime itself, and open data for researchers.',
  path: '/library',
});

export default function Library() {
  return (
    <div className="wide">
      <p className="eyebrow">Library</p>
      <h1>What to read and watch</h1>
      <p className="lede">
        Memoirs by people who escaped, journalism that explains the system, the reports everyone cites, the regime’s own publications, and
        the datasets behind this site.
      </p>
      <nav className="chips tabs" aria-label="Shelves">
        {SHELVES.map((s) => (
          <a key={s.id} className="chip" href={`#${s.id}`}>
            {s.title} <small>{s.items.length}</small>
          </a>
        ))}
      </nav>
      {SHELVES.map((s) => (
        <section key={s.id} id={s.id} className="shelf">
          <h2>{s.title}</h2>
          <p className="muted">{s.intro}</p>
          {s.id === 'memoir' || s.id === 'nonfiction' || s.id === 'film' ? (
            <ul className="cover-grid">
              {s.items.map((it) => (
                <CoverCard key={it.title} item={it} kind={s.id === 'film' ? 'film' : 'book'} />
              ))}
            </ul>
          ) : (
            <ul className="doc-grid">
              {s.items.map((it) => (
                <DocCard key={it.title} item={it} />
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
