/** HTML → Markdown for the agent-facing routes (see site/agents.ts). Server only: keep it out of client bundles. */
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { parse, type HTMLElement } from 'node-html-parser';
import { SITE_URL } from './config';

/**
 * Things an agent doesn't need: scripts, styles, icons and charts drawn in SVG, buttons, hover-card previews
 * (`role=tooltip`, they repeat the linked page), decorative or hidden markup, and the app chrome.
 */
const DROP = [
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'canvas',
  'iframe',
  'button',
  'form',
  'input',
  'select',
  'nav',
  '[role="tooltip"]',
  '[aria-hidden="true"]',
  '[hidden]',
  'img[alt=""]',
].join(',');

const SPACED = 'b,strong,em,i,span,small,time,div,dt,dd,figcaption';

const nhm = new NodeHtmlMarkdown({ maxConsecutiveNewlines: 2, keepDataImages: false, bulletMarker: '-' });

/** Absolute URL for a link found in the page, so the Markdown still works when read on its own. */
function absolutize(root: HTMLElement) {
  for (const [sel, attr] of [
    ['a[href]', 'href'],
    ['img[src]', 'src'],
  ] as const) {
    for (const el of root.querySelectorAll(sel)) {
      const v = el.getAttribute(attr);
      if (v?.startsWith('/') && !v.startsWith('//')) el.setAttribute(attr, SITE_URL + v);
    }
  }
}

const meta = (doc: HTMLElement, sel: string, attr = 'content') => doc.querySelector(sel)?.getAttribute(attr)?.trim();
/** YAML scalar: quoted when it could be misread. */
const yaml = (v: string) => (/^[\w .,()/-]+$/.test(v) && !/^[-\d]/.test(v) ? v : JSON.stringify(v));

/**
 * Turns one of our built pages into Markdown: YAML front matter (title, description, canonical URL, language,
 * translations) and the page's `<main>` content. Pages without `<main>` (the full-screen map apps) fall back to <body>.
 */
export function pageToMarkdown(html: string): string {
  const doc = parse(html, { comment: false });
  const front: [string, string | undefined][] = [
    ['title', doc.querySelector('title')?.text.trim()],
    ['description', meta(doc, 'meta[name="description"]')],
    ['url', meta(doc, 'link[rel="canonical"]', 'href')],
    ['language', doc.querySelector('[lang]:not(html)')?.getAttribute('lang') ?? doc.querySelector('html')?.getAttribute('lang')],
  ];
  const translations = doc
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')] as const)
    .filter(([lang]) => lang && lang !== 'x-default');

  const main = doc.querySelector('main') ?? doc.querySelector('body');
  if (!main) return '';
  main.querySelectorAll(DROP).forEach((el) => el.remove());
  absolutize(main);
  // cards stack a number, a label and a note in separate elements with no space between them ("26Mpeople");
  // a space after each keeps the words apart in Markdown (extra spaces collapse)
  main.querySelectorAll(SPACED).forEach((el) => el.insertAdjacentHTML('afterend', ' '));
  const body = nhm.translate(main.innerHTML).trim();

  const lines = ['---', ...front.filter(([, v]) => v).map(([k, v]) => `${k}: ${yaml(v!)}`)];
  if (translations.length > 1) {
    lines.push('translations:', ...translations.map(([lang, href]) => `  ${lang}: ${href}`));
  }
  lines.push('---', '', body, '');
  return lines.join('\n');
}

/**
 * Fetches a page's HTML from the running site and converts it. Used by the Markdown routes; the origin comes from the
 * incoming request, so it works the same on localhost, previews and production. Returns null for a missing page.
 */
export async function fetchPageMarkdown(origin: string, path: string): Promise<string | null> {
  const res = await fetch(new URL(path, origin), { headers: { accept: 'text/html' }, redirect: 'follow' });
  if (!res.ok || !res.headers.get('content-type')?.includes('text/html')) return null;
  return pageToMarkdown(await res.text());
}
