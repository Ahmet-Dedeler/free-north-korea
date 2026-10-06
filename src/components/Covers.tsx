import type { Item } from '@/content/library';
import { LIBRARY_TEXT, libraryItemCopy } from '@/content/libraryI18n';
import { cover, hostIcon, hostInitial, hostLabel, type Media } from '@/content/media';
import { LANG_TAG, type Lang } from '@/site/seo';

/** Stable hue per title so generated covers don't change between builds. */
function hue(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

/** Typographic stand-in when no cover image exists, styled like a plain paperback. */
function MadeCover({ item }: { item: Item }) {
  const [main, sub] = item.title.split(/:\s*/);
  return (
    <span className="made-cover" lang="en" style={{ '--h': hue(item.title) } as React.CSSProperties}>
      <b>{main}</b>
      {sub && <i>{sub}</i>}
      <small>{item.by.split(/&|,/)[0].trim()}</small>
    </span>
  );
}

/** Book or film card: the cover is the card, details show on hover (and always on touch screens). */
export function CoverCard({ item, kind, lang = 'en' }: { item: Item; kind: 'book' | 'film'; lang?: Lang }) {
  const img = cover(item.title);
  const copy = libraryItemCopy(lang, item);
  const ui = LIBRARY_TEXT[lang];
  const short = item.title.split(/:\s*/)[0];
  const altTitle = copy.localTitle ? `${copy.localTitle} (${item.title})` : item.title;
  return (
    <li className="cover-card">
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        <span className={`cover ${kind}`}>
          {img ? (
            <img src={img.src} alt={kind === 'book' ? ui.coverOf(altTitle) : ui.posterOf(altTitle)} loading="lazy" />
          ) : (
            <MadeCover item={item} />
          )}
          <span className="cover-note">
            {copy.note}
            {copy.caveat && <em>{copy.caveat}</em>}
          </span>
          {copy.caveat && (
            <span className="cover-flag" title={copy.caveat}>
              {ui.disputed}
            </span>
          )}
        </span>
        {copy.localTitle ? <strong lang={LANG_TAG[lang]}>{copy.localTitle}</strong> : <strong lang="en">{short}</strong>}
        <span className="cover-by" lang="en">
          {copy.localTitle ? `${short} · ` : ''}
          {item.by}
          {item.year ? ` · ${item.year}` : ''}
        </span>
      </a>
    </li>
  );
}

/** Small square mark for a site: org logo, site icon, or the first letter of the host. */
export function SiteMark({ url, size = 40, icon }: { url: string; size?: number; icon?: Media }) {
  const m = icon ?? hostIcon(url);
  const host = hostLabel(url);
  return (
    <span className="site-mark" style={{ width: size, height: size, '--h': hue(host) } as React.CSSProperties} aria-hidden="true">
      {m ? <img src={m.src} alt="" loading="lazy" /> : <b>{hostInitial(url)}</b>}
    </span>
  );
}

/** Report / dataset card: publisher mark, title, publisher and year, one-line note. */
export function DocCard({ item, lang = 'en' }: { item: Item; lang?: Lang }) {
  const copy = libraryItemCopy(lang, item);
  return (
    <li>
      <a className="doc-card" href={item.url} target="_blank" rel="noopener noreferrer">
        <SiteMark url={item.url} />
        <span className="doc-body">
          <strong lang="en">{item.title}</strong>
          <span className="doc-meta">
            <span lang="en">
              {item.by}
              {item.year ? ` · ${item.year}` : ''}
            </span>
            {' · '}
            <span className="doc-host">{hostLabel(item.url)} ↗</span>
          </span>
          <span className="doc-note">{copy.note}</span>
        </span>
      </a>
    </li>
  );
}
