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
