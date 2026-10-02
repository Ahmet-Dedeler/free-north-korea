import type { Item } from '@/content/library';
import { cover, hostIcon, hostInitial, hostLabel, type Media } from '@/content/media';

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
    <span className="made-cover" style={{ '--h': hue(item.title) } as React.CSSProperties}>
      <b>{main}</b>
      {sub && <i>{sub}</i>}
      <small>{item.by.split(/&|,/)[0].trim()}</small>
    </span>
  );
}

/** Book or film card: the cover is the card, details show on hover (and always on touch screens). */
export function CoverCard({ item, kind }: { item: Item; kind: 'book' | 'film' }) {
  const img = cover(item.title);
  return (
    <li className="cover-card">
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        <span className={`cover ${kind}`}>
          {img ? <img src={img.src} alt={`${kind === 'book' ? 'Cover' : 'Poster'} of ${item.title}`} loading="lazy" /> : <MadeCover item={item} />}
          <span className="cover-note">
            {item.note}
            {item.caveat && <em>{item.caveat}</em>}
          </span>
          {item.caveat && (
            <span className="cover-flag" title={item.caveat}>
              Disputed details
            </span>
          )}
        </span>
        <strong>{item.title.split(/:\s*/)[0]}</strong>
        <span className="cover-by">
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
export function DocCard({ item }: { item: Item }) {
  return (
    <li>
      <a className="doc-card" href={item.url} target="_blank" rel="noopener noreferrer">
        <SiteMark url={item.url} />
        <span className="doc-body">
          <strong>{item.title}</strong>
          <span className="doc-meta">
            {item.by}
            {item.year ? ` · ${item.year}` : ''} · <span className="doc-host">{hostLabel(item.url)} ↗</span>
          </span>
          <span className="doc-note">{item.note}</span>
        </span>
      </a>
    </li>
  );
}
