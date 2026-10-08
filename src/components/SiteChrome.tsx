'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { REPO_URL, REVIEWED } from '../site/config';
import { Ext } from './Ext';

const NAV = [
  { href: '/map', label: 'Map' },
  { href: '/military', label: 'Military' },
  { href: '/missiles', label: 'Missile tests' },
  { href: '/people', label: 'People' },
  { href: '/organizations', label: 'Organizations' },
  { href: '/library', label: 'Library' },
  { href: '/learn', label: 'Learn' },
];

/**
 * Site chrome: top bar on every page, footer on content pages.
 * Map pages fill the viewport under the bar and skip the footer.
 */
/** Pages that are a full-screen map: no footer, body doesn't scroll. */
const APP_PAGES = ['/map', '/missiles'];

export default function SiteChrome({ children }: { children: ReactNode }) {
  const path = usePathname() ?? '/';
  const translated = ['/ko', '/ja', '/zh'].some((p) => path === p || path.startsWith(p + '/'));
  const app = APP_PAGES.includes(path);
  const active = (href: string) => path === href || path.startsWith(href + '/');
  return (
    <div className={app ? 'shell shell-app' : 'shell'}>
      <header className="topbar">
        <Link href="/" className="logo" aria-label="Free North Korea, home">
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6.2l1.6 3.9 4.2.3-3.2 2.7 1 4.1L12 15l-3.6 2.2 1-4.1-3.2-2.7 4.2-.3z" />
          </svg>
          <span>Free North Korea</span>
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={active(n.href) ? 'on' : ''} aria-current={active(n.href) ? 'page' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="topbar-end">
          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginRight: '10px', fontSize: '12px' }}>
            <Link href="/" className={!translated ? 'muted on' : 'muted'} style={{ fontWeight: !translated ? 600 : 'normal' }}>
              EN
            </Link>
            <span className="muted" style={{ opacity: 0.4 }}>/</span>
            <Link href="/ko" className={path.startsWith('/ko') ? 'muted on' : 'muted'} style={{ fontWeight: path.startsWith('/ko') ? 600 : 'normal' }}>
              한국어
            </Link>
            <span className="muted" style={{ opacity: 0.4 }}>/</span>
            <Link href="/ja" className={path.startsWith('/ja') ? 'muted on' : 'muted'} style={{ fontWeight: path.startsWith('/ja') ? 600 : 'normal' }}>
              日本語
            </Link>
            <span className="muted" style={{ opacity: 0.4 }}>/</span>
            <Link href="/zh" className={path.startsWith('/zh') ? 'muted on' : 'muted'} style={{ fontWeight: path.startsWith('/zh') ? 600 : 'normal' }}>
              中文
            </Link>
          </div>
          <Link href="/act" className={`cta ${active('/act') ? 'on' : ''}`}>
            Take action
          </Link>
        </div>
      </header>

      {app ? children : <main className="page">{children}</main>}

      {!app && (
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <b>Free North Korea</b>
              <p>
                An open-source hub for understanding North Korea and helping the 26 million people living under its regime. No ads, no
                cookies, no affiliation with any government. Page views are counted anonymously.
              </p>
              <div style={{ marginTop: '0.8rem', fontSize: '0.88rem' }}>
                <Link href="/ko">한국어 (Korean)</Link> · <Link href="/ja">日本語 (Japanese)</Link> · <Link href="/zh">中文 (Chinese)</Link>
              </div>
            </div>
            <div>
              <b>Explore</b>
              <Link href="/map">Intel map</Link>
              <Link href="/camps">Prison camps</Link>
              <Link href="/places">Key strategic sites</Link>
              <Link href="/counties">179 counties</Link>
              <Link href="/missiles">Missile tests</Link>
              <Link href="/missiles/list">Missile test list</Link>
              <Link href="/sanctions">Sanctions</Link>
              <Link href="/kim-watch">Kim Watch</Link>
              <Link href="/north-korea-vs-south-korea">North vs South Korea</Link>
              <Link href="/data">Charts and data</Link>
              <Link href="/library">Library</Link>
            </div>
            <div>
              <b>Help</b>
              <Link href="/act">Take action</Link>
              <Link href="/organizations">Organizations</Link>
              <Link href="/learn/how-to-help-north-koreans">How to help</Link>
              <Ext href={REPO_URL}>Contribute on GitHub</Ext>
            </div>
            <div>
              <b>Read</b>
              <Link href="/learn/how-can-north-korea-be-freed">How can North Korea be freed?</Link>
              <Link href="/learn/is-it-possible-to-free-north-korea">Is it possible?</Link>
              <Link href="/learn/north-korea-prison-camps">Prison camps</Link>
              <Link href="/learn/how-north-koreans-escape">How people escape</Link>
            </div>
          </div>
          <p className="footer-note">
            Facts last reviewed {REVIEWED}. Found something wrong or out of date?{' '}
            <Ext href={`${REPO_URL}/issues/new`}>Open an issue</Ext>. Code: Apache 2.0.
          </p>
        </footer>
      )}
    </div>
  );
}
