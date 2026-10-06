// Builds vivid-charts poster specs from data/series/series.json, so every number
// on a poster comes from the same sourced data the site uses.
// Render: node build.mjs && for f in *.json; do vivid render $f -o ${f%.json}.png; done
import fs from 'node:fs';

const S = JSON.parse(fs.readFileSync(new URL('../../data/series/series.json', import.meta.url))).series;
const get = (id) => S.find((x) => x.id === id);
const at = (arr, y) => (arr.find((p) => p[0] === y) || [y, null])[1];
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const brand = 'freenorthkorea';
const write = (name, spec) => fs.writeFileSync(new URL(`./${name}.json`, import.meta.url), JSON.stringify(spec, null, 2));

// 1. Missiles: stacked columns by class, night-time peninsula from the ISS behind.
{
  const s = get('missile-launches');
  const yrs = range(1984, 2026);
  const col = (k) => yrs.map((y) => at(s.entities[k], y));
  const tot = yrs.map((y, i) => ['short', 'medium', 'icbm', 'other'].reduce((t, k) => t + at(s.entities[k], y), 0));
  const un = tot.filter((_, i) => yrs[i] >= 2012).reduce((a, b) => a + b, 0);
  const all = tot.reduce((a, b) => a + b, 0);
  // x where the 2012 column starts (plot spans ~190..1062 for this box; checked on the render).
  const KJU_X = Math.round(190 + (872 / yrs.length) * yrs.indexOf(2012) - 2);
  write('missiles', {
    palette: { name: 'electric', bg: '#0a0c12', ink: '#f4f1ea', muted: '#9aa0ad', rule: '#2a2f3a' },
    type: { preset: 'impact', display: { family: 'Anton' } },
    background: { gradient: ['#06080d', '#0d111a', '#151a26'], grain: 0.07 },
    title: {
      box: { x: 64, y: 70, w: 620, h: 0 },
      lines: [
        { text: 'NORTH KOREA', role: 'kicker', size: 28, fill: '#ff5a3c', tracking: 0.32, gap: 8 },
        { text: 'MISSILE', role: 'display', size: 150, fill: '#f4f1ea', gap: 0 },
        { text: 'SURGE', role: 'display', size: 150, fill: '#ff5a3c', effect: { type: 'shadow', color: '#ff2a00' }, gap: 10 },
      ],
      dek: `Every missile fired from **1984 to 2026**. **${un} of ${all}** were launched after **Kim Jong Un** took power in December 2011.`,
      dekWidth: 520, dekSize: 23, dekColor: '#d9dbe2', dekRule: '#ff5a3c',
    },
    layers: [
      { type: 'image', src: 'commons:Korean Peninsula at night 20240124 132602 GMT Iss-070e080670.jpg',
        box: { x: 480, y: -40, w: 800, h: 860 }, fit: 'cover', fade: { left: 0.45, bottom: 0.6 } },
      { type: 'shape', shape: 'rect', box: { x: KJU_X, y: 560, w: 1062 - KJU_X, h: 752 }, fill: 'rgba(255,90,60,0.07)' },
      { type: 'shape', shape: 'line', box: { x: KJU_X, y: 560, w: 0, h: 752 }, stroke: 'rgba(255,90,60,0.6)', strokeWidth: 2, dash: '6 6' },
      { type: 'text', box: { x: KJU_X + 12, y: 572, w: 260, h: 60 }, text: '**KIM JONG UN ERA** \u2192', style: { size: 20, fill: '#ff5a3c', tracking: 0.12, weight: 700 } },
      { type: 'text', box: { x: 190, y: 572, w: 520, h: 60 }, text: '\u2190 **KIM IL SUNG, KIM JONG IL**', style: { size: 20, fill: '#9aa0ad', tracking: 0.12, weight: 700 } },
      { type: 'legend', box: { x: 64, y: 512, w: 1000, h: 30 }, direction: 'row', swatch: 'square', size: 19,
        items: [{ label: 'Short-range', color: '#ff5a3c' }, { label: 'Medium / hypersonic', color: '#ffb02e' }, { label: 'ICBM', color: '#fff1c2' }, { label: 'Sub-launched, satellite, unknown', color: '#5b6478' }] },
      { type: 'stacked-columns', box: { x: 40, y: 520, w: 1130, h: 840 },
        categories: yrs.map(String), labelEvery: 4, max: 70, ticks: [20, 40, 60], tickSuffix: 'missiles', seriesLabels: false,
        tickColor: '#9aa0ad', barGap: 0.18, radius: 3,
        series: [
          { label: 'Short-range', color: '#ff5a3c', values: col('short') },
          { label: 'Medium / hypersonic', color: '#ffb02e', values: col('medium') },
          { label: 'ICBM', color: '#fff1c2', values: col('icbm') },
          { label: 'Sub-launched, satellite, other', color: '#5b6478', values: col('other') },
        ] },
      { type: 'annotation', box: { x: 560, y: 690, w: 270, h: 80 },
        text: '**2022: 69 missiles**, the most in any year. 41 were sub-launched, satellite or unidentified.', to: [952, 712], bend: 0,
        style: { size: 19, fill: '#f4f1ea', italic: true }, arrowColor: '#ff5a3c' },
      { type: 'annotation', box: { x: 300, y: 1010, w: 320, h: 70 },
        text: '1994–2011, all of Kim Jong Il’s rule: **16 missiles**', to: [520, 1310], bend: 0.25,
        style: { size: 18, fill: '#c8ccd6', italic: true }, arrowColor: '#9aa0ad' },
    ],
    footer: {
      source: `${s.source.name}. ${s.note}`,
      note: 'Photo: the Korean Peninsula at night from the ISS, NASA (public domain). The dark gap is North Korea.',
      brand, color: '#8a90a0', brandColor: '#ff5a3c',
    },
  });
}

// 2. Defectors: women vs men arriving in South Korea.
{
  const s = get('defector-arrivals');
  const yrs = range(2002, 2025);
  const w = yrs.map((y) => at(s.entities.women, y));
  const m = yrs.map((y) => at(s.entities.men, y));
  const W = w.reduce((a, b) => a + b, 0), M = m.reduce((a, b) => a + b, 0);
  write('defectors', {
    palette: { name: 'poster', bg: '#f3ead8', ink: '#1d1a17', muted: '#6d655a', rule: '#d8cdb8' },
    type: { preset: 'classic', display: { family: 'DM Serif Display' } },
    background: { color: '#f3ead8', grain: 0.08 },
    title: {
      box: { x: 64, y: 64, w: 620, h: 0 },
      lines: [
        { text: 'THE ROAD SOUTH,', role: 'kicker', size: 26, tracking: 0.24, fill: '#b23a2b', gap: 4 },
        { text: 'Almost Closed', role: 'display', size: 96, fill: '#1d1a17', gap: 12 },
      ],
      dek: `North Koreans reaching South Korea each year. **${Math.round((W / (W + M)) * 100)}%** have been **women**. After the border sealed for Covid, arrivals fell from **${(w[7] + m[7]).toLocaleString('en')}** (2009) to **${w[19] + m[19]}** (2021).`,
      dekWidth: 600, dekSize: 22, dekColor: '#3b352e',
    },
    layers: [
      { type: 'stacked-columns', box: { x: 40, y: 330, w: 1130, h: 1030 },
        categories: yrs.map(String), labelEvery: 3, max: 3000, ticks: [1000, 2000, 3000], tickSuffix: 'people',
        barGap: 0.14, radius: 4,
        series: [
          { label: 'Women', color: '#b23a2b', values: w },
          { label: 'Men', color: '#2c3e57', values: m },
        ],
      },
      { type: 'stat', box: { x: 740, y: 84, w: 400, h: 140 }, value: (W + M).toLocaleString('en'), label: 'people arrived, 2002–2025', color: '#1d1a17', size: 92, align: 'end' },
      { type: 'annotation', box: { x: 850, y: 860, w: 200, h: 120 },
        text: 'January 2020: North Korea seals its border for Covid. 2021: **63 people**, the fewest on record.', to: [902, 1278], bend: 0.3,
        style: { size: 19, italic: true, fill: '#1d1a17' }, arrowColor: '#b23a2b' },
    ],
    footer: { source: 'Ministry of Unification (South Korea), North Korean defector statistics, via data.go.kr (KOGL Type 1). Counted on arrival in South Korea, which can be years after leaving the North.', brand, color: '#6d655a', brandColor: '#b23a2b' },
  });
}

// 3. North vs South: GDP per person, slope from 1940 to 2022, with the night photo.
{
  const s = get('gdp-per-capita');
  const n40 = at(s.entities.PRK, 1940), s40 = at(s.entities.KOR, 1940);
  const n22 = at(s.entities.PRK, 2022), s22 = at(s.entities.KOR, 2022);
  // Hand-drawn slope so the close 1940 values get separate labels.
  const xL = 300, xR = 900, y = (v) => 1290 - (v / 44000) * 720;
  const usd = (v) => '$' + v.toLocaleString('en');
  // Raw <text> in an svg layer doesn't render (the engine outlines text itself), so labels are text layers.
  const T = (x, top, align, txt, style) => ({ type: 'text', box: { x: align === 'end' ? x - 400 : align === 'middle' ? x - 200 : x, y: top, w: 400, h: 80 }, align, text: txt, style });
  const lab = (x, cy, align, value, name, color) => [
    T(x, cy - 22, align, value, { family: 'Anton', size: 44, fill: color }),
    T(x, cy + 34, align, name, { family: 'Barlow Condensed', weight: 700, size: 22, tracking: 0.12, fill: '#d6dae3' }),
  ];
  const slopeText = [
    T(xL, 452, 'middle', '1940', { family: 'Anton', size: 64, fill: '#f2f2f2' }),
    T(xR, 452, 'middle', '2022', { family: 'Anton', size: 64, fill: '#f2f2f2' }),
    ...[10000, 20000, 30000, 40000].map((v) => T(xL - 14, y(v) - 8, 'end', '$' + v / 1000 + 'K', { family: 'Barlow Condensed', size: 18, fill: '#7f889b' })),
    ...lab(xL - 32, y(n40) - 60, 'end', usd(n40), 'NORTH KOREA', '#ff4a3d'),
    ...lab(xL - 32, y(s40) + 34, 'end', usd(s40), 'SOUTH KOREA', '#7fbcff'),
    ...lab(xR + 32, y(s22) - 8, 'start', usd(s22), 'SOUTH KOREA', '#7fbcff'),
    ...lab(xR + 32, y(n22) - 8, 'start', usd(n22), 'NORTH KOREA', '#ff4a3d'),
    T(xR - 72, (y(s22) + y(n22)) / 2 - 40, 'end', `${Math.round(s22 / n22)}\u00d7`, { family: 'Anton', size: 84, fill: '#f2f2f2' }),
    T(xR - 72, (y(s22) + y(n22)) / 2 + 56, 'end', 'the gap in 2022', { family: 'Barlow Condensed', size: 22, weight: 600, fill: '#d6dae3' }),
  ];
  const slopeSvg = `
    <defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>
    ${[0, 10000, 20000, 30000, 40000].map((v) => `<line x1="${xL}" x2="${xR}" y1="${y(v)}" y2="${y(v)}" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>`).join('')}
    <line x1="${xL}" x2="${xL}" y1="545" y2="1290" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
    <line x1="${xR}" x2="${xR}" y1="545" y2="1290" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
    <line x1="${xL}" y1="${y(s40)}" x2="${xR}" y2="${y(s22)}" stroke="#4ea3ff" stroke-width="22" stroke-opacity="0.55" filter="url(#glow)"/>
    <line x1="${xL}" y1="${y(s40)}" x2="${xR}" y2="${y(s22)}" stroke="#7fbcff" stroke-width="9" stroke-linecap="round"/>
    <line x1="${xL}" y1="${y(n40)}" x2="${xR}" y2="${y(n22)}" stroke="#ff4a3d" stroke-width="22" stroke-opacity="0.5" filter="url(#glow)"/>
    <line x1="${xL}" y1="${y(n40)}" x2="${xR}" y2="${y(n22)}" stroke="#ff4a3d" stroke-width="9" stroke-linecap="round"/>
    ${[[xL, s40, '#7fbcff'], [xR, s22, '#7fbcff'], [xL, n40, '#ff4a3d'], [xR, n22, '#ff4a3d']].map(([x, v, c]) => `<circle cx="${x}" cy="${y(v)}" r="13" fill="${c}" stroke="#05070c" stroke-width="4"/>`).join('')}
    <path d="M${xR - 40},${y(s22) + 20} h-14 V${y(n22) - 20} h14" fill="none" stroke="#f2f2f2" stroke-width="3"/>`;
  write('divergence', {
    width: 1200, height: 1500,
    palette: { name: 'atlas', bg: '#05070c', ink: '#f2f2f2', muted: '#9aa3b5' },
    type: { preset: 'impact', display: { family: 'Anton' } },
    background: { color: '#05070c', grain: 0.06 },
    title: {
      box: { x: 60, y: 60, w: 1080, h: 0 }, align: 'middle',
      lines: [
        { text: 'ONE PENINSULA, TWO FATES', role: 'kicker', size: 26, tracking: 0.3, fill: '#9aa3b5', gap: 6 },
        { runs: [{ text: `${Math.round(s22 / n22)}×`, fill: '#4ea3ff' }, { text: ' RICHER', fill: '#f2f2f2' }], role: 'display', size: 140 },
      ],
      dek: `In 1940 the North was the richer half. By 2022 the average South Korean produced **${Math.round(s22 / n22)} times** as much as the average North Korean.`,
      dekWidth: 760, dekSize: 24, dekColor: '#d6dae3',
    },
    layers: [
      { type: 'image', src: 'commons:Korean Peninsula at night 20240124 132602 GMT Iss-070e080670.jpg',
        box: { x: 0, y: 330, w: 1200, h: 1060 }, fit: 'cover', fade: { top: 0.3, bottom: 0.3 }, opacity: 0.8 },
      { type: 'svg', box: { x: 0, y: 0, w: 1200, h: 1500 }, markup: slopeSvg },
      ...slopeText,
      { type: 'annotation', box: { x: 420, y: 1110, w: 360, h: 70 },
        text: 'North Korea is **poorer now** than it was in 1940', to: [760, 1248], bend: 0.3,
        style: { size: 21, italic: true, fill: '#f2f2f2' }, arrowColor: '#ff4a3d' },
    ],
    footer: {
      source: `${s.source.name}. GDP per person in international dollars at 2011 prices. North Korea figures are estimates.`,
      note: 'Background: the Korean Peninsula at night from the ISS, January 2024, NASA (public domain).',
      brand, color: '#8a93a6', brandColor: '#4ea3ff',
    },
  });
}

// 4. Aid: humanitarian money for North Korea by year, radial bars.
{
  const s = get('humanitarian-aid');
  const pts = s.entities.PRK;
  const max = Math.max(...pts.map((p) => p[1]));
  const peak = pts.find((p) => p[1] === max);
  const last = pts.at(-2); // last full year
  write('aid', {
    palette: { name: 'civic', bg: '#ece6da', ink: '#1b2a2a', muted: '#6b7470' },
    type: { preset: 'modern', display: { family: 'Archivo Black' } },
    background: { color: '#ece6da', grain: 0.07 },
    title: {
      box: { x: 60, y: 64, w: 1080, h: 0 },
      lines: [
        { runs: [{ text: '−' + Math.round((1 - last[1] / max) * 100) + '%', fill: '#0f8a7e' }], role: 'display', size: 130, gap: 0 },
        { text: 'THE AID THAT DRIED UP', role: 'display', size: 54, fill: '#1b2a2a', gap: 10 },
      ],
      dek: `Humanitarian funding for North Korea reported to the UN. **$${Math.round(max)}M** in ${peak[0]}, **$${last[1].toFixed(1)}M** in ${last[0]}. Since 2020 the border has stayed shut to almost every aid worker.`,
      dekWidth: 620, dekSize: 22, dekColor: '#3a4644',
    },
    layers: [
      { type: 'radial-bars', box: { x: 0, y: 330, w: 1200, h: 1080 }, cx: 560, cy: 880, inner: 0.24, center: '**27 years** of aid, 2000 to 2026', startAngle: 0, endAngle: 340,
        sort: 'none', scale: 'sqrt', format: { prefix: '$', suffix: 'M', compact: false, decimals: 0 },
        categories: { hi: '#0f8a7e', lo: '#c2493a' },
        items: pts.map(([y, v]) => ({ label: String(y) + (y === 2026 ? '*' : ''), value: v, category: y >= 2021 ? 'lo' : 'hi', display: v < 10 ? `$${v.toFixed(1)}M` : `$${Math.round(v)}M` })) },
    ],
    footer: { source: `${s.source.name}, CC BY 4.0. Money reported as received, by the year it was meant for. *2026 is the year so far.`, note: 'Bar length uses a square-root scale so the small recent years stay visible.', brand, color: '#6b7470', brandColor: '#0f8a7e' },
  });
}

// ---------------------------------------------------------------------------
// Photo-led set. Every photo is freely licensed (credits in each footer) or the
// site's own people photos (licenses in data/entities/people.json).
const PEOPLE = '../../public/img/people/';

// 5. Missiles by ruler, faces in circles. Circle AREA = missiles fired (r ∝ √n).
{
  const s = get('missile-launches');
  const tot = (y) => ['short', 'medium', 'icbm', 'other'].reduce((t, k) => t + at(s.entities[k], y), 0);
  const sum = (a, b) => range(a, b).reduce((t, y) => t + tot(y), 0);
  const il = sum(1984, 1994), jongIl = sum(1995, 2011), un = sum(2012, 2026);
  const R = 360, r = (n) => R * Math.sqrt(n / un);
  const big = { cx: 760, cy: 930 };
  const small = [
    { name: 'KIM IL SUNG', years: '1984–1994', n: il, img: 'kim-il-sung', cx: 170, cy: 1150 },
    { name: 'KIM JONG IL', years: '1994–2011', n: jongIl, img: 'kim-jong-il', cx: 170, cy: 840 },
  ];
  const disc = (cx, cy, rr, img) => [
    { type: 'shape', shape: 'circle', box: { x: cx - rr - 10, y: cy - rr - 10, w: 2 * rr + 20, h: 2 * rr + 20 }, fill: '#d7261e' },
    { type: 'image', src: `${PEOPLE}${img}.jpg`, shape: 'circle', box: { x: cx - rr, y: cy - rr, w: 2 * rr, h: 2 * rr }, fit: 'cover', focus: 'top',
      filter: 'duotone', duotone: ['#2a0d08', '#f6d2b0'] },
  ];
  const T = (x, y, w, txt, style, align = 'start') => ({ type: 'text', box: { x, y, w, h: 60 }, text: txt, style, align });
  write('kims', {
    palette: { name: 'poster', bg: '#efe4cc', ink: '#2a0d08', muted: '#7a5a4a', accent: '#d7261e' },
    type: { preset: 'impact', display: { family: 'Anton' } },
    background: { gradient: ['#f3e9d2', '#e6d5b2'], grain: 0.09 },
    title: {
      box: { x: 60, y: 60, w: 620, h: 0 },
      lines: [
        { text: 'WHO FIRED', role: 'display', size: 92, fill: '#2a0d08', gap: 0 },
        { text: "NORTH KOREA'S", role: 'display', size: 58, fill: '#2a0d08', gap: 4 },
        { text: 'MISSILES?', role: 'display', size: 128, fill: '#d7261e', effect: { type: 'extrude', color: '#7a120c', depth: 6 } },
      ],
      dek: `Missiles launched under each leader since the first ballistic missile tests in 1984. **Circle area = missiles fired.** Kim Jong Un has launched **${Math.round(un / (il + jongIl))} times** as many as his father and grandfather combined.`,
      dekWidth: 540, dekSize: 22, dekColor: '#3a1c14',
    },
    layers: [
      // Sunburst behind the big circle, propaganda-poster style.
      { type: 'svg', box: { x: 0, y: 0, w: 1200, h: 1500 }, markup:
        Array.from({ length: 24 }, (_, i) => { const a0 = (i * 15 * Math.PI) / 180, a1 = ((i * 15 + 7.5) * Math.PI) / 180, L = 900;
          return `<path d="M${big.cx},${big.cy}L${big.cx + L * Math.cos(a0)},${big.cy + L * Math.sin(a0)}L${big.cx + L * Math.cos(a1)},${big.cy + L * Math.sin(a1)}Z" fill="#d7261e" fill-opacity="0.07"/>`; }).join('') },
      ...disc(big.cx, big.cy, R, 'kim-jong-un'),
      { type: 'shape', shape: 'rect', box: { x: big.cx - 150, y: big.cy + R - 70, w: 300, h: 150 }, fill: '#2a0d08', radius: 8 },
      { type: 'stat', box: { x: big.cx - 150, y: big.cy + R - 52, w: 300, h: 90 }, value: String(un), color: '#ffffff', size: 78, align: 'middle' },
      T(big.cx - 150, big.cy + R + 44, 300, 'MISSILES FIRED', { size: 18, fill: '#f6d2b0', tracking: 0.2, weight: 700 }, 'middle'),
      T(big.cx - 200, big.cy + R + 92, 400, '**KIM JONG UN**  2012–2026', { size: 26, fill: '#2a0d08' }, 'middle'),
      ...small.flatMap((k) => [
        ...disc(k.cx, k.cy, r(k.n), k.img),
        T(k.cx + r(k.n) + 26, k.cy - 52, 240, String(k.n), { family: 'Anton', size: 64, fill: '#d7261e' }),
        T(k.cx + r(k.n) + 26, k.cy + 22, 260, `**${k.name}**`, { size: 22, fill: '#2a0d08' }),
        T(k.cx + r(k.n) + 26, k.cy + 50, 260, k.years, { size: 20, fill: '#6b4a3a' }),
      ]),
      { type: 'annotation', box: { x: 70, y: 1300, w: 330, h: 60 }, text: 'Same scale. Area, not width, is the count.', style: { size: 18, italic: true, fill: '#6b4a3a' } },
    ],
    footer: {
      source: `${s.source.name}. Each missile counts once. 2026 runs to 2026-09-20.`,
      note: 'Photos: Jesse Charlie (CC0); Vladimir Smirnov / TASS (CC BY 4.0), via Wikimedia Commons.',
      brand, color: '#6b4a3a', brandColor: '#d7261e',
    },
  });
}

// 6. Rice price vs the dollar: the won collapsing, over a rice close-up.
{
  const s = get('rice-price'), fx = get('won-per-dollar');
  const monthly = (pts) => {
    const by = {};
    for (const [d, v] of pts) (by[d.slice(0, 7)] ||= []).push(v);
    const out = [];
    for (let y = 2013; y <= 2026; y++) for (let m = 1; m <= 12; m++) {
      const k = `${y}-${String(m).padStart(2, '0')}`;
      if (k > pts.at(-1)[0].slice(0, 7)) break;
      out.push([k, by[k] ? by[k].reduce((a, b) => a + b, 0) / by[k].length : null]);
    }
    // Months with no survey: straight line between the neighbours.
    out.forEach((p, i) => { if (p[1] == null) { let a = i - 1, b = i + 1; while (out[b][1] == null) b++; p[1] = out[a][1] + ((out[b][1] - out[a][1]) * (i - a)) / (b - a); } });
    return out;
  };
  const rice = monthly(s.entities.pyongyang);
  const last = s.entities.pyongyang.at(-1), first = s.entities.pyongyang.find(([d]) => d.startsWith('2024-01'));
  const fxLast = fx.entities.pyongyang.at(-1), fxFirst = fx.entities.pyongyang.find(([d]) => d.startsWith('2024-01'));
  const riceX = last[1] / first[1], fxX = fxLast[1] / fxFirst[1];
  const usd = (v, r) => (v / r).toFixed(2);
  write('rice', {
    palette: { name: 'money', bg: '#15110b', ink: '#f5eedc', muted: '#b9ac8f', accent: '#ffcf3f' },
    type: { preset: 'impact', display: { family: 'Anton' } },
    background: { color: '#15110b', grain: 0.07 },
    title: {
      box: { x: 60, y: 70, w: 700, h: 0 }, shadow: true,
      lines: [
        { text: 'A KILO OF RICE IN PYONGYANG', role: 'kicker', size: 26, tracking: 0.22, fill: '#ffcf3f', gap: 8 },
        { runs: [{ text: `${Math.round(riceX)}×`, fill: '#ffcf3f' }, { text: ' THE PRICE', fill: '#ffffff' }], role: 'display', size: 120, gap: 4 },
        { text: 'IN UNDER THREE YEARS', role: 'display', size: 60, fill: '#ffffff' },
      ],
      dek: `**${first[1].toLocaleString('en')} won** in January 2024, **${last[1].toLocaleString('en')} won** on ${last[0]}. The rice did not get dearer: **the won did.** A dollar went from ${fxFirst[1].toLocaleString('en')} to ${fxLast[1].toLocaleString('en')} won, so in dollars the kilo still costs about **$${usd(last[1], fxLast[1])}**.`,
      dekWidth: 600, dekSize: 22, dekColor: '#f5eedc', dekPanel: 'rgba(15,10,4,0.55)',
    },
    layers: [
      { type: 'image', src: './img/Mushqbudji_rice_grains_close_up.jpg', box: { x: 0, y: 0, w: 1200, h: 900 }, fit: 'cover',
        filter: 'duotone', duotone: ['#2b1d08', '#f3e2b4'], fade: { bottom: 0.55 }, opacity: 0.85 },
      { type: 'area-time', box: { x: 40, y: 620, w: 1110, h: 740 }, x: rice.map(([k]) => (k.endsWith('-01') ? k.slice(0, 4) : k === rice.at(-1)[0] ? 'SEP 2026' : k)),
        labelEvery: 24, outline: true, glow: true, ticks: [10000, 20000, 30000, 40000], format: { suffix: ' won' }, endValues: true,
        series: [{ label: 'Won per kg', values: rice.map(([, v]) => Math.round(v)), color: '#ffcf3f' }],
        notes: [{ at: '2020', y: 15000, text: '2020–2023: border shut for Covid. Prices stayed near 5,000 won.', width: 300, color: '#f5eedc' }] },
      { type: 'stat', box: { x: 360, y: 740, w: 440, h: 120 }, value: `${fxX.toFixed(1)}×`, label: 'won per dollar, Jan 2024 to Sep 2026', color: '#ffcf3f', size: 72, align: 'end' },
    ],
    footer: {
      source: `${s.source.name}, Pyongyang. Monthly average of the surveys; months without one are interpolated. Data to ${last[0]}. Hyesan and Sinuiju move the same way.`,
      note: 'Photo: rice grains, Wikimedia Commons (CC0).',
      brand, color: '#a89b80', brandColor: '#ffcf3f',
    },
  });
}

// 7. Political prisoners: 80,000 to 120,000 (UN COI 2014), one figure per 1,000 people.
write('camps', {
  palette: { name: 'atlas', bg: '#0e0e0f', ink: '#efece6', muted: '#9b968c', accent: '#e23b2e' },
  type: { preset: 'classic', display: { family: 'DM Serif Display' } },
  background: { gradient: ['#0b0b0c', '#17161a'], grain: 0.08 },
  title: {
    box: { x: 64, y: 70, w: 600, h: 0 },
    lines: [
      { text: 'NORTH KOREA’S PRISON CAMPS', role: 'kicker', size: 24, tracking: 0.24, fill: '#e23b2e', gap: 10 },
      { text: 'Up to 120,000', role: 'display', size: 92, fill: '#efece6', gap: 0 },
      { text: 'people held', role: 'display', size: 64, fill: '#efece6', italic: true },
    ],
    dek: 'In 2014 a UN Commission of Inquiry estimated **80,000 to 120,000** people were held in political prison camps (kwanliso), often whole families, and called what happens there **crimes against humanity**.',
    dekWidth: 540, dekSize: 22, dekColor: '#cfcac0', dekRule: '#e23b2e',
  },
  layers: [
    { type: 'image', src: './img/Shin_Dong_Hyuk.jpg', box: { x: 560, y: 0, w: 640, h: 700 }, fit: 'cover', focus: 'center',
      filter: 'grayscale', fade: { left: 0.45, bottom: 0.4 } },
    { type: 'annotation', box: { x: 900, y: 600, w: 250, h: 60 }, text: 'Shin Dong-hyuk, who says he was born in Camp 14, at the UN in Geneva',
      style: { size: 16, italic: true, fill: '#cfcac0' } },
    { type: 'legend', box: { x: 70, y: 720, w: 1060, h: 30 }, direction: 'row', swatch: 'circle', size: 19,
      items: [{ label: 'Low estimate: 80,000', color: '#e23b2e' }, { label: 'Up to 40,000 more', color: '#6b2a24' }, { label: 'Each figure = 1,000 people', color: '#efece6' }] },
    { type: 'pictogram', box: { x: 70, y: 780, w: 1060, h: 560 }, icon: 'icon:ph:person-fill', shape: 'icon', total: 120, columns: 15,
      showLabels: false, parts: [{ label: 'Low estimate', value: 80, color: '#e23b2e' }, { label: 'Upper range', value: 40, color: '#6b2a24' }] },
  ],
  footer: {
    source: 'UN Commission of Inquiry on Human Rights in the DPRK, report A/HRC/25/63 (2014). There is no newer precise count; some camps have since closed and others expanded.',
    note: 'Photo: Shin Dong-hyuk, U.S. Mission Geneva (public domain), via Wikimedia Commons. Shin revised parts of his account in 2015.',
    brand, color: '#8f8a80', brandColor: '#e23b2e',
  },
});

// 8. Soldiers per person: North vs South, with the Panmunjom guards cut out.
{
  const a = get('armed-forces'), p = get('population');
  const ratio = (k) => at(p.entities[k], 2020) / at(a.entities[k], 2020);
  const nk = Math.round(ratio('PRK')), sk = Math.round(ratio('KOR'));
  const COLS = 18;
  const row = (y, rows) => ({ x: 60, y, w: 1080, h: rows * 64 });
  write('army', {
    palette: { name: 'olive', bg: '#e9e4d4', ink: '#1f2417', muted: '#5f6650', accent: '#c4271c' },
    type: { preset: 'impact', display: { family: 'Anton' } },
    background: { color: '#e9e4d4', grain: 0.08 },
    title: {
      box: { x: 60, y: 70, w: 620, h: 0 },
      lines: [
        { text: 'A COUNTRY IN UNIFORM', role: 'kicker', size: 26, tracking: 0.22, fill: '#c4271c', gap: 8 },
        { runs: [{ text: `1 IN ${nk}`, fill: '#c4271c' }], role: 'display', size: 170, gap: 0 },
        { text: 'NORTH KOREANS IS A SOLDIER', role: 'display', size: 46, fill: '#1f2417' },
      ],
      dek: `**${(at(a.entities.PRK, 2020) / 1e6).toFixed(2)} million** people in the armed forces out of 26 million, one of the highest shares on Earth. South Korea, with twice the people, has **${(at(a.entities.KOR, 2020) / 1e3).toFixed(0)},000**.`,
      dekWidth: 560, dekSize: 23, dekColor: '#2f3524',
    },
    layers: [
      { type: 'image', src: 'cutout:./img/DMZ___North_Korean_Soldiers_marching_along_the_defense_line_PS.jpg', box: { x: 660, y: 20, w: 540, h: 740 },
        fit: 'contain', filter: 'grayscale', shadow: true },
      { type: 'text', box: { x: 60, y: 450, w: 640, h: 40 }, text: `**NORTH KOREA**  1 soldier for every ${nk} people`, style: { size: 28, fill: '#1f2417' } },
      { type: 'pictogram', box: { x: 60, y: 500, w: 648, h: 150 }, icon: 'icon:ph:person-fill', shape: 'icon', total: nk, columns: 9, showLabels: false,
        parts: [{ label: 'Soldier', value: 1, color: '#c4271c' }], rest: '#b7b39f' },
      { type: 'text', box: { x: 60, y: 760, w: 1080, h: 40 }, text: `**SOUTH KOREA**  1 soldier for every ${sk} people`, style: { size: 28, fill: '#1f2417' } },
      { type: 'pictogram', box: { x: 60, y: 810, w: 1080, h: 520 }, icon: 'icon:ph:person-fill', shape: 'icon', total: sk, columns: 15, showLabels: false,
        parts: [{ label: 'Soldier', value: 1, color: '#2456a6' }], rest: '#b7b39f' },
    ],
    footer: {
      source: `${a.source.name}; population from UN WPP via Our World in Data. Active personnel, 2020 (latest year in the series).`,
      note: 'Photo: North Korean soldiers at Panmunjom, Wikimedia Commons (CC BY-SA 3.0).',
      brand, color: '#5f6650', brandColor: '#c4271c',
    },
  });
}
