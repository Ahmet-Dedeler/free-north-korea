# YouTube

The project's YouTube channel. The banner is the first thing a visitor sees, so it carries the same
message as the X banner: the site's own numbers, the real domain, and nothing that is not true.

| | |
|---|---|
| Channel | SaveNorthKorea.org |
| Link on the channel | https://savenorthkorea.org |
| Banner | `youtube-banner-2560x1440.png` |

The account is the same "we" as the site: volunteers, no company, no government, no NGO, no money
taken. No faces, no personal bios, no logo other than the site's (a white star on a blue disc).

## Assets

- `youtube-banner-2560x1440.png`: the channel banner, built by `npm run brand:youtube`
  (`scripts/build-youtube-banner.mjs`). It reads the brand colours and the logo from the site's own
  files, the domain from `src/site/config.ts` and the numbers from our data files, so the banner
  cannot drift from the site. The background is one of our own Sentinel-2 chips of Yongbyon, blurred
  and darkened, so the channel shows the work it actually does.
- `youtube-pfp-800.png`: the channel avatar, the same star at the 800x800 YouTube asks for.
- `crops/`: what each device actually shows, so the banner can be checked without guessing.
  `tv-2560x1440.png` is everything, `desktop-2560x423.png` the desktop strip, `app-safe-1546x423.png`
  the conservative safe area, `phone-374x62.png` what a phone browser renders.

## How the banner is laid out

YouTube crops one 2560x1440 file differently per device and never resizes it:

| Device | Shows |
|---|---|
| TV | the whole 2560x1440 |
| Desktop | a 2560x423 strip |
| Phone browser | the same strip, scaled down to 374px |
| The app | tighter, so the 1546x423 safe area is the conservative zone |

YouTube does the crop on the server, and it is not centred vertically: it takes the band from
35.3% to 64.7% of the height, which is `y 508` to `y 932` of a 2560x1440 source. It never crops
horizontally, so the whole 2560 wide band is what a browser shows, tiny on a phone. The layout
therefore puts the logo, the name, the tagline and the numbers inside the centred 1546x423, where
the app also shows them, and uses the rest of the canvas for the satellite texture and the outline
of the country.

The channel avatar sits over the banner's bottom-left in the YouTube app, so the disc is raised and
the bottom-left corner is left empty. The social link icons land over the bottom-right, so that
corner is empty too. On the web channel page the avatar sits below the banner, but the app does
overlap it.

## The numbers on the banner

They come from our own data, and the script reads them fresh every time:

- **360 missile launches since 1984**: the missile dataset (`public/data/test.en.json`).
- **17 sites watched from space**: the Sentinel-2 manifest (`data/sentinel.json`).
- **369 Sentinel-2 images**: the same manifest, every image of every site.

The X banner (`docs/brand/x.md`) carries the same three numbers, so the two accounts say the same
thing. `scripts/brand/shared.mjs` holds the reading, so the two banners cannot disagree.
