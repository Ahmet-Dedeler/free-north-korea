// Small client for the KCNA website (www.kcna.kp), used by scripts/build-kimwatch.ts.
//
// What we learned about the site (October 2026):
//   - Plain HTTP only. HTTPS fails the TLS handshake. The server sits in Pyongyang and a page takes anywhere from 2 to
//     80 seconds, so requests run with long timeouts, a few retries and low concurrency.
//   - Article ids are 32-character hashes, not sequential numbers, so the only way to find articles is the listings.
//   - Every listing (categories and the site search) only reaches back one year: the oldest item is always about 365
//     days old. Older article pages may still load, but nothing links to them. That is why the build keeps its own
//     records and merges new ones in, instead of rebuilding from the site each time.
//   - Listings are a POST form (page_num, cnt_per_page, keyword, _csrf) tied to a JSESSIONID cookie. cnt_per_page is
//     not capped, so one request returns a whole category.
//   - "WPK General Secretary Kim Jong Un's Revolutionary Activities" (id below) is KCNA's own category for his
//     activities. Letters, greetings and flower baskets he receives or sends are not in it; they show up in the search.

export const KCNA = 'http://www.kcna.kp';
/** KCNA's category "WPK General Secretary Kim Jong Un's Revolutionary Activities". */
export const ACTIVITY_CATEGORY = 'b0721b9f23054ddc7fe56c2811a12715';

const UA = 'free-north-korea Kim Watch builder (+https://github.com/Ahmet-Dedeler/free-north-korea)';

export interface ListItem {
  id: string;
  title: string;
  /** Publication date from the listing, YYYY-MM-DD. */
  date: string;
}

export interface Article {
  id: string;
  title: string;
  /** Publication date from the listing, YYYY-MM-DD. */
  date: string;
  /** Body paragraphs as plain text. */
  paragraphs: string[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

/** Strips tags (KCNA wraps leader names in <nobr><august_name>) and squeezes whitespace. */
export const text = (html: string) => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

const isoDate = (d: string) => {
  const [y, m, day] = d.split('.').filter(Boolean).map(Number);
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export class KcnaClient {
  private cookie = '';
  private csrf = '';
  private readonly lang: string;
  private readonly timeoutMs: number;
  private readonly retries: number;

  // plain fields, not parameter properties: Node's type stripping can't run those
  constructor(lang = 'en', timeoutMs = 300_000, retries = 3) {
    this.lang = lang;
    this.timeoutMs = timeoutMs;
    this.retries = retries;
  }

  private async request(path: string, init: RequestInit = {}): Promise<string> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const res = await fetch(KCNA + path, {
          ...init,
          headers: { 'user-agent': UA, ...(this.cookie && { cookie: this.cookie }), ...init.headers },
          signal: AbortSignal.timeout(this.timeoutMs),
        });
        const setCookie = res.headers.getSetCookie();
        if (setCookie.length) {
          const jar = new Map(this.cookie.split('; ').filter(Boolean).map((c) => c.split('=') as [string, string]));
          for (const c of setCookie) {
            const [pair] = c.split(';');
            const i = pair.indexOf('=');
            jar.set(pair.slice(0, i), pair.slice(i + 1));
          }
          this.cookie = [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
        }
        if (!res.ok) throw new Error(`${res.status} ${path}`);
        const body = await res.text();
        const csrf = body.match(/name="_csrf"\s+value="([^"]+)"/)?.[1];
        if (csrf) this.csrf = csrf;
        return body;
      } catch (e) {
        lastError = e;
        if (attempt < this.retries) await sleep(5_000 * (attempt + 1));
      }
    }
    throw lastError;
  }

  /** Opens a session (cookie + CSRF token) the listing forms need. */
  async open() {
    await this.request(`/${this.lang}/article/list/${ACTIVITY_CATEGORY}`);
    if (!this.csrf) throw new Error('KCNA: no CSRF token on the category page');
  }

  private static parseList(html: string): ListItem[] {
    const items: ListItem[] = [];
    const re = /href="\/\w+\/article\/detail\/([0-9a-f]{32})"[^>]*>([\s\S]*?)<\/a>\s*<span><nobr>\[([0-9.]+)\]/g;
    for (const m of html.matchAll(re)) items.push({ id: m[1], title: text(m[2]), date: isoDate(m[3]) });
    return items;
  }

  /** Every item in a category, in one request. */
  async category(categoryId: string, max = 2000): Promise<ListItem[]> {
    const body = new URLSearchParams({ page_num: '1', cnt_per_page: String(max), keyword: '', _csrf: this.csrf });
    const html = await this.request(`/${this.lang}/article/list/${categoryId}`, {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    return KcnaClient.parseList(html);
  }

  /** Site-wide search (articles only). Slow: around five minutes for a few thousand hits. */
  async search(keyword: string, max = 5000): Promise<ListItem[]> {
    const body = new URLSearchParams({ page_num_all: '1', cnt_per_page_all: String(max), keyword_all: keyword, _csrf: this.csrf });
    const html = await this.request(`/${this.lang}/search`, {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    return KcnaClient.parseList(html);
  }

  /** One article: headline and body paragraphs. */
  async article(item: ListItem): Promise<Article> {
    const html = await this.request(`/${this.lang}/article/detail/${item.id}`);
    const main = html.slice(html.indexOf('<article'), html.indexOf('</article>'));
    const title = [...main.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1])).filter(Boolean).join(' ');
    const paragraphs = [...main.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => text(m[1])).filter(Boolean);
    if (!paragraphs.length) throw new Error(`KCNA: empty article ${item.id}`);
    return { id: item.id, title: title || item.title, date: item.date, paragraphs };
  }
}

/** Runs `fn` over `items` with at most `n` in flight. Failures are collected, not thrown. */
export async function pool<T, R>(items: T[], n: number, fn: (item: T, i: number) => Promise<R>) {
  const results: (R | undefined)[] = new Array(items.length);
  const errors: { item: T; error: unknown }[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        try {
          results[i] = await fn(items[i], i);
        } catch (error) {
          errors.push({ item: items[i], error });
        }
      }
    }),
  );
  return { results, errors };
}
