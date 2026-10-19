# X (Twitter)

The project's X account. One post per poster, so the data reaches people who never open the site.

| | |
|---|---|
| Handle | [@freenorthkorea](https://x.com/freenorthkorea) |
| Display name | SaveNorthKorea.org |
| Bio | empty |
| Link on the profile | https://savenorthkorea.org |
| Joined | 9 August 2025 |
| Account ID | 1954202339776364544 |
| Posts (19 Oct 2026) | 7, of which 2 carry a poster |

The account is the same "we" as the site: volunteers, no company, no government, no NGO, no money taken. No
faces, no personal bios, no logo other than the site's (a white star on a blue disc).

## Assets

- `x-banner-1500x500.png`, `x-banner-3000x1000.png`: the banner, built by `npm run brand:banner`
  (`scripts/build-x-banner.mjs`) from the site's own brand colours, the domain from `src/site/config.ts` and the
  numbers from our data files, so the banner never drifts from the site. X overlays the profile picture on the
  banner, so the banner keeps that corner empty and puts the URL at the top.
- `x-pfp-400.png`, `x-pfp-512.png`, `x-pfp-4096.png`: the profile picture. X takes PNG, not SVG, so the SVG
  (`public/favicon.svg`) is rendered to PNG. Blue stands for freedom; red is never used in the brand, only where
  it means danger.
- `x-avatar-current.jpg`, `x-banner-current.jpg`: what X serves today (snapshot, 19 Oct 2026). Kept so the live
  assets can be compared or re-uploaded without hunting for them.

## How a post is written

The house style comes from the first poster post (6 Oct 2026, the army poster):

> 1 in 18 North Koreans is a soldier.
>
> That's the second-highest rate on earth, behind only Eritrea.
>
> South Korea: 1 in 91
> Turkey: 1 in 167
> USA: 1 in 240

- The first line is the title: one number, one sentence, no throat-clearing. It repeats the poster's own headline,
  so the post still works when the image is only half loaded.
- The next lines say why the number matters, in plain words.
- The rest of the numbers go one per line.
- The source and the photo credit are printed in the poster's footer, so the text never repeats them.
- No hashtags, no emoji, no em dashes, no marketing words, no link. Plain numbers.
- Under 280 characters, like the first post. Long posts are a paid feature, and the account is not one.

## What we don't post

- Incident narratives. They carry surnames. Counts by right violated, and a link to NKDB for the detail.
- Exact execution or burial sites, or anyone's home.
- Unverified numbers. Every figure has to be in the site's data (`data/series/series.json`) or in the poster's own
  source line, and when the data is old the post says how old.
- Rumours, unless they are labelled as rumours.

## Posts so far

| Date | Poster | Text |
|---|---|---|
| 19 Oct 2026 | camps | "Up to 120,000 people are held in North Korea's prison camps." |
| 6 Oct 2026 | army | "1 in 18 North Koreans is a soldier." |
| 7 Mar 2026 | none | "Windscribe or @windscribe is great" |

The account also replies to people (2 Jul 2026 to @patrickc, and others). A reply is the account talking to a
person, not a data post, but the same rules apply: no em dashes, no hashtags, no marketing voice.

The other posters in `docs/posters/` (missiles, defector arrivals, divergence, aid, Kims, rice) have not been posted
yet.

## Posting a poster

```bash
node docs/posters/build.mjs
npx vivid-charts render docs/posters/<name>.json -o docs/posters/<name>.png --scale 2
```

Then attach the PNG to a new post and write the text as above. The poster is 1200x1500, so X keeps it sharp. Add
the post to the table in the same commit that changes the poster.

The account is linked from the site footer. The handle and the URL live in `src/site/config.ts` (`X_URL`), so
changing one changes the site, this doc and the posts table.
