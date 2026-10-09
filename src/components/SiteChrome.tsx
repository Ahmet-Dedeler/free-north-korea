'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { CHROME_TEXT, LANG_NAMES, basePath, langOf, localize } from '@/content/chrome';
import type { Lang } from '@/site/seo';
import { REPO_URL, REVIEWED } from '../site/config';
import { BRAND_BLUE, LOGO_STAR } from '../site/brand';
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
 * Closes a popover (the language menu, the mobile menu) on Escape, on a click outside `ref`, and when the page changes.
 */
function useDismiss(open: boolean, close: () => void, ref: React.RefObject<HTMLElement | null>, path: string) {
  useEffect(() => close(), [path]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const onDown = (e: PointerEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, close, ref]);
}

/** Native language names for the menus (the top bar button uses the short LANG_NAMES). */
const LANG_FULL: Record<Lang, string> = { en: 'English', ko: '한국어', ja: '日本語', zh: '中文' };
const tagOf = (l: Lang) => (l === 'zh' ? 'zh-Hans' : l);

/**
 * Site chrome: top bar on every page, footer on content pages.
 * Map pages fill the viewport under the bar and skip the footer.
 *
 * Top bar: logo, the main nav, a language menu and the Take action button. Below 1080px the nav doesn't fit, so it
 * moves into a menu behind the hamburger button (the links stay in the HTML either way, so crawlers see them).
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
  // a nav page with no version in the reader's language (the /map and /missiles apps) gets a small "EN" tag
  const englishOnly = (href: string) => lang !== 'en' && to(href) === href;

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  useDismiss(menuOpen, () => setMenuOpen(false), barRef, path);
  useDismiss(langOpen, () => setLangOpen(false), langRef, path);

  return (
    <div className={app ? 'shell shell-app' : 'shell'}>
      <header className={menuOpen ? 'topbar menu-open' : 'topbar'} ref={barRef}>
        <Link href={to('/')} className="logo" aria-label={t.home}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="10" fill={BRAND_BLUE} />
            <path d={LOGO_STAR} fill="#fff" />
          </svg>
          <span>Free North Korea</span>
        </Link>
        <nav className="nav" id="site-nav" aria-label="Main">
          {t.nav.map((n) => (
            <a key={n.href} href={to(n.href)} className={active(n.href) ? 'on' : ''} aria-current={active(n.href) ? 'page' : undefined}>
              {n.label}
              {englishOnly(n.href) && (
                <small className="nav-en" lang="en">
                  EN
                </small>
              )}
            </a>
          ))}
          <Link href={to('/act')} className="cta nav-cta">
            {t.cta}
          </Link>
        </nav>
        <div className="topbar-end">
          <div className="lang-menu" ref={langRef}>
            <button
              type="button"
              className="lang-btn"
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-controls="lang-list"
              aria-label={`${t.langs}: ${LANG_FULL[lang]}`}
              onClick={() => setLangOpen((o) => !o)}
            >
              <Globe size={15} aria-hidden />
              <span>{LANG_NAMES[lang]}</span>
              <ChevronDown size={13} aria-hidden />
            </button>
            {/* rendered closed too (just hidden), so the links to every language version are in the HTML */}
            <ul id="lang-list" className="lang-list" hidden={!langOpen}>
              {LANGS.map((l) => (
                <li key={l}>
                  <Link href={switchTo[l]} hrefLang={tagOf(l)} lang={tagOf(l)} aria-current={l === lang ? 'true' : undefined} onClick={() => setLangOpen(false)}>
                    {LANG_FULL[l]}
                    {l === lang && <Check size={14} aria-hidden />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href={to('/act')} className={`cta bar-cta ${active('/act') ? 'on' : ''}`}>
            {t.cta}
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? t.closeMenu : t.menu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </header>

      {app ? children : <main className="page">{children}</main>}

      {!app && (
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <b>Free North Korea</b>
              <p>{t.about}</p>
              <ul className="footer-langs">
                {LANGS.filter((l) => l !== lang).map((l) => (
                  <li key={l}>
                    <Link href={switchTo[l]} hrefLang={tagOf(l)} lang={tagOf(l)}>
                      {LANG_FULL[l]}
                    </Link>
                  </li>
                ))}
              </ul>
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
