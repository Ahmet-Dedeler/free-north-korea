import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import SiteChrome from '@/components/SiteChrome';
import { ThemeProvider } from '@/theme';
import { SITE_NAME, SITE_URL } from '@/site/config';
import './globals.css';
import './site.css';
import './visual.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: understand North Korea, help its people`, template: `%s | ${SITE_NAME}` },
  description:
    'An open-source hub on North Korea: a map of prison camps and nuclear sites, military capability, every missile test, a library, and the organizations helping North Koreans, with clear ways to act.',
  applicationName: SITE_NAME,
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1120' },
  ],
};

// Set the theme before first paint so dark-mode users never see a white flash.
const THEME_SCRIPT = `try{var d=matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light';localStorage.removeItem('theme')}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme is set by the inline script before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
