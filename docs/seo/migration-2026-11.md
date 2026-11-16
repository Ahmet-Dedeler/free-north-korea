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
- Search Console on 2026-11-06 (08:05 UTC): indexing requested for no URLs and none found already indexed. `/sanctions` was the first one tried, it is still "Crawled, currently not indexed", and the request hit Quota Exceeded, so the run stopped. Not inspected: `/ko`, `/ja`, `/zh`, `/kim-family-tree`, `/people/kim-yo-jong`, `/people/kim-jong-un`, `/people/ri-sol-ju`, `/people/kim-han-sol`, `/library`, `/organizations`, `/act`.
- Search Console on 2026-11-15, both properties, 28 days to Nov 13. New: 54 clicks, 60.8K impressions, and near zero
  since Oct 27 (0 to 3 impressions a day). Old: 204 clicks, 62.8K impressions, 4 to 7 clicks a day and impressions
  rising (1,108 on Nov 3, 6,198 on Nov 11). Page indexing, both dated Nov 9: new 226 indexed and 1,476 not (1,385
  "Crawled, currently not indexed", validation Failed; 57 "Duplicate, Google chose different canonical"); old 678
  indexed and 341 not. For `/camps` and `/map` Google names the old URL as the canonical it chose. So Google is still
  keeping the old domain, not the new one. Redirects and the new site's HTML were rechecked: no link to the old domain
  anywhere. External links to the new domain: 102, of which 99 are the old domain itself, 1 GitHub, 2 spam. No manual
  action or security issue on either. All 16 URLs inspected were "not on Google"; indexing requested for 9
  (`/learn/how-can-north-korea-be-freed`, `/learn`, `/sanctions`, `/ko`, `/ja`, `/zh`, `/camps`, `/map`,
  `/kim-family-tree`) before the quota ran out. Not requested: `/north-korea-vs-south-korea`, `/watch`,
  `/people/kim-yo-jong`, `/people/kim-jong-un`, `/library`, `/organizations`, `/act`. PostHog: 6 to 21 visits a day
  from Google, Nov 6 to 14.
- Search Console on 2026-11-16, 28 days to Nov 14. New: 54 clicks, 60.8K impressions, 0 to 3 impressions a day since
  Nov 5. Old: 206 clicks, 64.8K impressions, 4 to 7 clicks a day, impressions down from 6,198 (Nov 11) to 2,481
  (Nov 14). Page indexing, both dated Nov 13: new 227 indexed and about 1,480 not (1,420 "Crawled, currently not
  indexed", validation Failed; 21 "Duplicate, Google chose different canonical", down from 57); old 672 indexed and
  347 not. All 16 URLs inspected are still "Crawled, currently not indexed", now with the inspected URL as Google's
  canonical (on Nov 15 `/camps` and `/map` named the old URL). `/learn`, `/camps`, `/map` and `/kim-family-tree` were
  recrawled on Nov 15 after the request; the other five requested that day were not yet. Indexing requested for no
  URLs: the first one hit Quota Exceeded, so the same seven wait. External links unchanged at 102 (99 from the old
  domain). No manual action or security issue. PostHog: 6 to 21 visits a day from Google, Nov 10 to 15.

## What to check, and when

- Keep the redirect and the old domain for at least a year. Never remove the Change of Address.
- Judge by adding the two properties together. The Page indexing report lags: on Nov 5 it was dated Oct 23.
- By early December the articles should be back as Indexed under URL Inspection. If they are not, the code is not what
  is holding them back, and links are the thing to work on.

## What would help most now

Real links to the new domain. Nothing in the code can replace them for a new domain. Ask sites that already link to the
old domain (Search Console, Links, old property) to update, and earn new ones from people who cover North Korea, using
the things only we have: dated satellite images of camps, the sanctions lists matched across countries, ship tracking.
