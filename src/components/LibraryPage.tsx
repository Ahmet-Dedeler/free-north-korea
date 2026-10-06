import { CoverCard, DocCard } from '@/components/Covers';
import { SHELVES } from '@/content/library';
import { LIBRARY_TEXT, libraryShelf } from '@/content/libraryI18n';
import type { Lang } from '@/site/seo';

export default function LibraryPage({ lang }: { lang: Lang }) {
  const t = LIBRARY_TEXT[lang];
  return (
    <div className="wide">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>
      <nav className="chips tabs" aria-label={t.shelvesLabel}>
        {SHELVES.map((s) => (
          <a key={s.id} className="chip" href={`#${s.id}`}>
            {libraryShelf(lang, s.id).title} <small>{s.items.length}</small>
          </a>
        ))}
      </nav>
      {SHELVES.map((s) => {
        const shelf = libraryShelf(lang, s.id);
        const covers = s.id === 'memoir' || s.id === 'nonfiction' || s.id === 'film';
        return (
          <section key={s.id} id={s.id} className="shelf">
            <h2>{shelf.title}</h2>
            <p className="muted">{shelf.intro}</p>
            {covers ? (
              <ul className="cover-grid">
                {s.items.map((it) => (
                  <CoverCard key={it.title} item={it} kind={s.id === 'film' ? 'film' : 'book'} lang={lang} />
                ))}
              </ul>
            ) : (
              <ul className="doc-grid">
                {s.items.map((it) => (
                  <DocCard key={it.title} item={it} lang={lang} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
