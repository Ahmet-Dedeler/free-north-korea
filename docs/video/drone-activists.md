# Video plan: the drone students (from /learn/north-korea-drone-activists)

Faceless, AI-narrated YouTube explainer made from the article. Plan written 2026-10-18; first cut built 2026-10-19 in
`~/Code/free-north-korea-videos/drone-activists` (HyperFrames project, its README says how to rebuild). The current cut
is **v8.2, 12:54, 1920x1080** (`renders/drone-activists-v8.2-final.mp4` in that folder, upload text in its `youtube.md`);
what changed from v7 (and in v8.1, v8.2) is in its `docs/v8-notes.md`: a question opens each chapter, the cold open asks "So who did it?",
a comments outro, the route camera locked onto the plane, and rigged 3D reconstructions of the office meeting and the
podcast (Blender, MakeHuman bodies with mannequin faces). Voice picked by
ear: MiniMax Speech 2.8 HD, `English_Trustworth_Man`. The video adds one fact the article lacks: on June 12, 2026 the
same court sentenced former president Yoon Suk Yeol to 30 years for the October 2024 military drone flights over
Pyongyang, on the same benefiting-the-enemy charge (Korea Times).

## What the reference channel teaches us

Reference: Everything Econ, "The World's Biggest Economies, 1850 to 2030" (9:21, 22k subs; their best video,
"The World Map Resized by Carbon Emissions", has 418k views; most sit at 5k to 70k). Frames sampled every 20 s,
first 75 s transcribed.

1. **One visual carries the whole video.** It is a single bar-chart race that keeps evolving; ffmpeg finds zero hard
   cuts. Nothing is "stock B-roll". For us the equivalent is one persistent stage, the map of the Korean peninsula,
   that the camera keeps coming back to between chapters, with photos, quotes and diagrams flown in on top of it.
2. **Fixed frame, always the same.** Title and subtitle top-left, handle top-right, source line bottom-left, a
   "now showing" panel, one accent colour (gold) on dark. One-line burned captions at the bottom. End card with
   handles and the website. Because the template never changes, each new video is cheap.
3. **Narration is dense and causal.** About 150 words a minute, a number in almost every sentence, "because" and
   "mainly because", no hype, no "smash that like button". Neutral voice, deep male.
4. **The description is a source list.** Chapters, the dataset, then every figure in the narration with its source.
   That is exactly our sourcing rule, so we get it for free from the article's `sources`.
5. **Titles are plain and descriptive.** Their winners are a strong visual concept in the title ("resized by").
6. **Programmatic does not mean generic.** Everything is drawn from data by code. That is the moat against YouTube's
   "inauthentic content" monetization rule (mass-produced AI narration over stock clips gets demonetized): our
   video is original research with our own maps, satellite images and diagrams.

## The format for us

- 16:9, 1080p (render 4K stills where cheap), ~9 minutes, ~1,350 words of narration (the article is ~2,000).
- Look: the site's night band. Navy `--night`, white type, Anton for big numbers, brand blue as the accent, red only
  for danger (North Korean military, crash sites), same as the site. Small blue-star logo top-right.
- Persistent frame: chapter name top-left, source line bottom-left in mono, one-line captions bottom-centre.
- Narrator: neutral third person for chapters 1 to 7. The article's opinion part becomes a labelled final chapter,
  "Our take", spoken as "we" (an AI voice saying "I" reads as fake).
- No photoreal AI images of real people or real events. Real people appear only in press photos we credit, or as
  typographic cards. AI illustrations are stylised (flat, silhouettes, no faces) and only for scenes no camera saw.

## Beat sheet (~9:15)

| Time | Chapter | Narration (gist) | Visuals |
| --- | --- | --- | --- |
| 0:00 | Cold open | Jan 10, 2026: North Korea's army publishes photos of a sky-blue drone in a Kaesong field. Seoul says no military unit flew that day. So who did? | KCNA photo, slow push-in. Flight-log route draws itself in red. Title card. |
| 0:30 | Four flights, two crashes | Ganghwa launch, grid pass over the Pyongsan uranium mill, south past Kaesong, crash. Second crash Sep 2025 from Paju. Skywalker Titan, ~1M won, 4 h, 260 km. | **Map stage**: peninsula, DMZ, pins from `DroneRouteMap`. Lawnmower grid over Pyongsan. Our own Sentinel-2 Pyongsan chips (23 dated images) as a time scrub. Spec card for the airframe. Counter 4 / 2. |
| 1:35 | Who they are | Estel Engineering, Sejong University startup centre, Sep 2023. Builder, pilot, North Korea specialist. Why we use names. | Registry screenshot. Three cards (role, one line each), press photos with credit where they exist. |
| 2:40 | What they wanted | Kim's public quotes: "we could do this better", satellite internet on phones, a router dropped by drone. The 2020-2023 censorship laws. | Kinetic quote cards with source + date. USB stick vs balloon vs drone diagram. Link card to the information article. |
| 3:45 | Behind closed doors | Nov 2025 Yeoju crash, the PhD specialist, Pyongsan photos on the monitor: "end of the dictatorship", "political prison camps". 21 months of KakaoTalk. | Stylised illustration of the office (monitor glow, no faces). Chat rebuilt as translated bubbles, labelled "reconstructed from MBC, Feb 2, 2026". At most ~6 s of the MBC clip. |
| 4:55 | The intelligence money | Defense Intelligence Command contact from Jul 2024, ~13M won (~$9,500) through NK Monitor and Global Insight. Both dark now. | Flow diagram: command, two sites, the group. Count-up. Footer screenshots of the two sites. |
| 5:45 | The court | Charged with benefiting the enemy; 5 and 3 years asked. Sep 16, 2026: aviation guilty, suspended; enemy charge not proven (no SD card shown). 2 to 1 on that charge. | Timeline scroll (the article's `Timeline` items). Bars: 5 yrs asked vs 8 months suspended. Zoom on KCNA wreck photo: "published photos show no card". |
| 6:55 | Would Starlink work? | Geofenced cells, all off over the North; bleed along the DMZ. Ukraine was switched on in days; Crimea refused. Power, radio direction finders, locked phones. | **Signature visual**: hex cells over the peninsula, South lit, North dark, then lit as "what one license would do". Four obstacle icons. |
| 8:05 | Our take | Understandable, still unfortunate. RFA cut, broadcasts ended. A sanctions license and a switch at SpaceX, prepared before a crisis. | Back to the map stage, pulled wide. End card: savenorthkorea.org/learn/north-korea-drone-activists. |

## Asset inventory (already on disk)

- Site, `public/img/articles/`: `drone-flight-log-map.jpg`, `drone-kim-chungshin.jpg`, `drone-mbc-chat.jpg`,
  `drone-nkmonitor-footers.jpg`, `drone-oh-channela.png`, `drone-sejong-raid.jpg`, `north-korea-drone-activists.jpg`
  (credits in `src/content/media.json`).
- Our Sentinel-2 chips: `public/img/sentinel/pyongsan/` (23 dates), `yongbyon/`, the camps. Free to use with the
  Copernicus credit.
- Map geometry: `src/site/geo.ts` (Locator SVG), pins in `DroneRouteMap` (`components/ArticleBlocks.tsx`).
- Antigravity research session `52e8c997` scratch folder
  (`~/.gemini/antigravity/brain/52e8c997-f834-472b-9712-f1423f64901d/scratch/`): three full-size KCNA wreck
  photos via Yonhap, nine MBC storyboard frames, Channel A and Future Korea stills of Oh, News1 and Unityinfo
  photos of Kim, Estel registry, NK Monitor footers, Segye image.
- Clips: MBC report `Bo29dloR2pA` (2:28, the chat logs). Channel A interview with Oh (ichannela.com
  `000000510295`). Kim's January 2025 podcast is cited in the article but not linked; find it before using it.

## Rights and safety

- KCNA photos are what every outlet runs; credit "KCNA via Yonhap". MBC and Channel A run Content ID: keep any
  broadcast clip under ~6 s, framed, subtitled and talked over (commentary), and expect a claim. If a claim blocks
  the video, the fallback is the still plus a quote card. Prefer our own visuals everywhere else.
- YouTube's altered-content box: tick it if any illustration could pass as real. Mention the AI voice in the
  description.
- Names follow the article (they named themselves in public). For a Korean version, remember Korea has criminal
  defamation even for true statements; the public-interest framing and sticking to court-reported facts covers us,
  but don't add anything the article doesn't source.
- Run the channel as a brand account with hardware-key 2FA and no personal email; North Korean state hackers target
  people who work on this.

## Pipeline

1. **Script**: cut the article to ~1,350 words, one paragraph per beat, plain spoken English. Every sentence keeps
   its source so the description writes itself.
2. **Voice audition** (hcai, a few cents each): the same 30 s paragraph in `minimax/speech-2.8-hd`,
   `inworld/tts-1.5-max` and `resemble-ai/chatterbox-pro`, Ahmet picks by ear. hcai is fine for this video; a
   channel publishing every week should move to a paid provider (ElevenLabs is still the bar for natural English
   and has Korean/Japanese/Chinese voices; there is no key on this machine yet).
3. **TTS per paragraph**, then word timestamps with local `whisper` on the result, giving a `timeline.json` that
   drives every animation and the captions.
4. **Visuals in HyperFrames** (CLI 0.8.172 installed, skills `faceless-explainer`, `hyperframes-keyframes`,
   `motion-graphics`): HTML + GSAP, deterministic, renders to MP4 headless. It reuses the site's CSS tokens and
   fonts directly, which a Three.js world (the `sand-to-30k` approach) wouldn't. Map stage as SVG from `geo.ts`,
   Ken Burns on photos, kinetic quotes, the hex-cell scene.
5. **Music**: a low tense bed from `google/lyria-2` or `minimax/music-1.5`, ducked under the voice.
6. **Captions**: burned one-line captions (like the reference) plus SRT tracks in English, Korean, Japanese and
   Chinese (the site's four languages), translated from the script, not from auto-captions.
7. **Packaging**: thumbnail from the KCNA drone photo with the red route and 3 to 4 words; description with
   chapters, every source from the article, the Copernicus and KCNA credits, a link to the article.
8. **Shorts**: three vertical cuts of 30 to 50 s (Starlink hex cells, the chat logs, the verdict), each ending on
   the site URL.

Where it lives: a new folder `~/Code/free-north-korea-videos/` with one shared template (the frame, captions, map
stage) and one folder per video, reading assets from this repo. The template is the real product: there are 9
/learn articles in four languages, and each can become a video for the cost of a script and a voice run.

## Title ideas

- Three Students Flew Drones Into North Korea. South Korea Prosecuted Them.
- The Drone That Crashed in Kaesong
- Why Starlink Doesn't Work in North Korea (Shorts)

## Open decisions

- English only first, or English plus a Korean voice version (this is a Korean story; Korean explainer channels like
  당신이 몰랐던 이야기 have 1.3M subscribers)?
- How much broadcast footage to risk (none, stills only, or ~6 s clips).
- Channel name and handle (Save North Korea, matching the site and the blue star).
