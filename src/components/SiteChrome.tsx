'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CHROME_TEXT, LANG_NAMES, basePath, langOf, localize } from '@/content/chrome';
import type { Lang } from '@/site/seo';
import { REPO_URL, REVIEWED } from '../site/config';
import { Ext } from './Ext';

const LANGS: Lang[] = ['en', 'ko', 'ja', 'zh'];
const HREFLANG: Record<string, Lang> = { en: 'en', ko: 'ko', ja: 'ja', 'zh-hans': 'zh' };

/**
 * Where the language switcher sends you: the same page in each language. The server render guesses from the URL
 * pattern (localize); after load, the page's own hreflang links win, because they list exactly the versions that
 * exist. A language the page lacks falls back to that language's home page.
 */
function useSwitchTargets(path: string): Record<Lang, string> {
  // A page with no version in a language (the /map and /missiles apps) sends that language to its home page.
  const guess = () =>
    Object.fromEntries(
      LANGS.map((l) => {
        const base = basePath(path);
        const there = localize(l, base);
        return [l, l !== 'en' && there === base ? `/${l}` : there];
      }),
    ) as Record<Lang, string>;
  const [targets, setTargets] = useState(guess);
  useEffect(() => {
    const found: Partial<Record<Lang, string>> = {};
    for (const el of document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')) {
      const l = HREFLANG[(el.getAttribute('hreflang') ?? '').toLowerCase()];
      if (l) found[l] = new URL(el.href).pathname;
    }
    // Only trust the tags if they describe this page (after a client-side navigation the head can lag a moment).
    const current = langOf(path);
    if (found[current] !== path) return setTargets(guess());
    setTargets(Object.fromEntries(LANGS.map((l) => [l, found[l] ?? (l === 'en' ? '/' : `/${l}`)])) as Record<Lang, string>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  return targets;
}

/**
 * Site chrome: top bar on every page, footer on content pages.
 * Map pages fill the viewport under the bar and skip the footer.
 */
/** Pages that are a full-screen map: no footer, body doesn't scroll. */
const APP_PAGES = ['/map', '/missiles'];

export default function SiteChrome({ children }: { children: ReactNode }) {
  const path = usePathname() ?? '/';
  const lang = langOf(path);
  const t = CHROME_TEXT[lang];
  const to = (href: string) => localize(lang, href);
  const switchTo = useSwitchTargets(path);
  const app = APP_PAGES.includes(path);
  const base = basePath(path);
  const active = (href: string) => base === href || base.startsWith(href + '/');
  return (
    <div className={app ? 'shell shell-app' : 'shell'}>
      <header className="topbar">
        <Link href={to('/')} className="logo" aria-label={t.home}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6.2l1.6 3.9 4.2.3-3.2 2.7 1 4.1L12 15l-3.6 2.2 1-4.1-3.2-2.7 4.2-.3z" />
          </svg>
          <span>Free North Korea</span>
        </Link>
        <nav className="nav" aria-label="Main">
          {t.nav.map((n) => (
            <a key={n.href} href={to(n.href)} className={active(n.href) ? 'on' : ''} aria-current={active(n.href) ? 'page' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="topbar-end">
          <nav className="lang-switch" aria-label={t.langs}>
            {LANGS.map((l, k) => (
              <span key={l}>
                {k > 0 && (
                  <span className="muted" aria-hidden="true">
                    /
                  </span>
                )}
                <Link href={switchTo[l]} hrefLang={l === 'zh' ? 'zh-Hans' : l} lang={l === 'zh' ? 'zh-Hans' : l} className={l === lang ? 'muted on' : 'muted'} aria-current={l === lang ? 'true' : undefined}>
                  {LANG_NAMES[l]}
                </Link>
              </span>
            ))}
          </nav>
          <Link href={to('/act')} className={`cta ${active('/act') ? 'on' : ''}`}>
            {t.cta}
          </Link>
        </div>
      </header>

      {app ? children : <main className="page">{children}</main>}

      {!app && (
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <b>Free North Korea</b>
              <p>{t.about}</p>
              <div style={{ marginTop: '0.8rem', fontSize: '0.88rem' }}>
                {LANGS.filter((l) => l !== lang).map((l, k) => (
                  <span key={l}>
                    {k > 0 && ' · '}
                    <Link href={switchTo[l]} hrefLang={l === 'zh' ? 'zh-Hans' : l} lang={l === 'zh' ? 'zh-Hans' : l}>
                      {LANG_NAMES[l] === 'EN' ? 'English' : LANG_NAMES[l]}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <b>{t.explore}</b>
              {t.explore_links.map(([href, label]) => (
                <Link key={href} href={to(href)}>
                  {label}
                </Link>
              ))}
            </div>
            <div>
              <b>{t.help}</b>
              {t.help_links.map(([href, label]) => (
                <Link key={href} href={to(href)}>
                  {label}
                </Link>
              ))}
              <Ext href={REPO_URL}>{t.contribute}</Ext>
            </div>
            <div>
              <b>{t.read}</b>
              {t.read_links.map(([href, label]) => (
                <Link key={href} href={to(href)}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <p className="footer-note">
            {t.reviewed(REVIEWED)} {t.issue[0]} <Ext href={`${REPO_URL}/issues/new`}>{t.issue[1]}</Ext>
            {t.issue[2]}
          </p>
        </footer>
      )}
    </div>
  );
}
