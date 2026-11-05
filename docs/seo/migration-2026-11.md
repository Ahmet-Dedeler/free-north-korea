# Search: the move to savenorthkorea.org (status, November 2026)

The site moved from `liberatenorthkorea.org` to `savenorthkorea.org` on 2026-10-19 (308 page-for-page, Change of
Address filed in Search Console). This is the state on 2026-11-05, for whoever checks it next.

## What Search Console showed

Numbers from Search Console, web search, 2026-10-03 to 2026-11-03. Google visits from PostHog.

| Date | New property: clicks / impressions | Old property: clicks / impressions | PostHog visits from Google |
| :--- | :--- | :--- | :--- |
| Oct 25 | 14 / 13,323 | 12 / 1,531 | 29 |
| Oct 27 | 0 / 16 | 10 / 1,663 | 18 |
| Oct 31 | 0 / 0 | 7 / 1,306 | 13 |
| Nov 3 | 0 / 0 | 16 / 1,108 | 55 |

So the new property reading zero did not mean zero visitors. Google still shows old URLs, and they redirect.

The 13,000 impressions a day on the new property were a few person pages at about position 10 with almost no clicks
(`/people/ri-sol-ju`: 15,783 impressions, 0 clicks). Their loss cost little; the top pages earning clicks were articles.

## What was ruled out

- Manual actions, security issues, removal requests: none on either property.
- Redirects: every old URL tested goes to the same path on the new domain in one hop, also as Googlebot.
- Crawling: 100% 200s at 111 ms on average, robots.txt open. Googlebot still fetched HTML daily.
- Canonicals, sitemap, noindex: all 1,518 URLs returned 200 with a self-canonical and no noindex.

## What is actually wrong

URL Inspection, 2026-11-05:

| URL | Status |
| :--- | :--- |
| new `/` | Indexed |
| new `/learn/how-can-north-korea-be-freed`, `/learn`, `/people`, `/map`, `/sanctions`, `/people/ri-sol-ju`, `/people/kim-han-sol`, `/ja/learn/how-north-koreans-escape` | Crawled, currently not indexed |
| old `/learn/is-it-possible-to-free-north-korea`, `/ja/learn/how-north-koreans-escape`, `/people/kim-kyong-hui`, `/counties/rinsan` | Still indexed |
| old `/`, `/learn/how-can-north-korea-be-freed` | Page with redirect (dropped) |

Google fetched the new pages and chose not to keep them. Some old URLs are gone with nothing in their place. That includes
pages with 13,000 words, so it looks like a verdict on the domain, not on single pages. Google doesn't say why, so
these are the likely causes, not proven ones:

- A domain registered on 2026-10-18 with 1,500 URLs on day one and almost no links of its own: 2 external links in
  Search Console, both from link-spam sites, against 23 real ones still pointing at the old domain.
- About 70% of the URLs were short templates: 716 county pages (median 130 words), 348 people pages (89 words).
- For its first day the new domain redirected to the old one, then the direction flipped.

## What we changed

- Counties with no camp, atlas place or at least 10 documented abuses (132 of 179, so 528 of 716 URLs): `noindex`, out
  of the sitemap, still on the site. The sitemap went from 1,518 URLs to 990.
- Markdown copies: `noindex`, and robots.txt keeps Googlebot off them. It was fetching them instead of pages.
- Home page hreflang said `zh` while everything else said `zh-Hans`.
- Person titles use the local script (`리설주 (Ri Sol Ju)`) and are no longer the same bare name in all four languages.
- Descriptions no longer cut mid-word. Organization and WebSite schema on home, breadcrumbs on people, counties, charts.
- Sitemap dates only where they are true.
- Search Console on 2026-11-05: sitemap resubmitted, validation started on the not-indexed group, indexing requested for
  11 URLs until the daily quota ran out (the top articles, `/learn`, `/camps`, `/people`, `/north-korea-vs-south-korea`, `/map`). `/sanctions`, `/ko` and `/ja`
  are next. IndexNow sent for all 990 URLs.

## What to check, and when

- Keep the redirect and the old domain for at least a year. Never remove the Change of Address.
- Judge by adding the two properties together. The Page indexing report lags: on Nov 5 it was dated Oct 23.
- By early December the articles should be back as Indexed under URL Inspection. If they are not, the code is not what
  is holding them back, and links are the thing to work on.

## What would help most now

Real links to the new domain. Nothing in the code can replace them for a new domain. Ask sites that already link to the
old domain (Search Console, Links, old property) to update, and earn new ones from people who cover North Korea, using
the things only we have: dated satellite images of camps, the sanctions lists matched across countries, ship tracking.
