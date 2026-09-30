import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource, LngLatBoundsLike } from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Facility, Test } from './data';
import type { Theme } from './theme';
import { type ColorBy, OUTCOME_COLOR, TYPE_COLOR, TYPE_LABEL, formatDate } from './meta';

interface Props {
  tests: Test[]; // already filtered
  facilities: Facility[];
  selected: Test | null;
  colorBy: ColorBy;
  theme: Theme;
  onSelect: (id: string | null) => void;
}

// Free, keyless vector tiles from OpenFreeMap: calm light / dark basemaps that let the data pop.
const STYLE_URL: Record<Theme, string> = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};

/** Colours for our own layers, per theme. `outline` separates lines/arrows from the basemap. */
const PALETTE: Record<Theme, { outline: string; site: string; label: string; halo: string; callout: string }> = {
  light: { outline: '#ffffff', site: '#0f172a', label: '#334155', halo: '#ffffff', callout: '#0f172a' },
  dark: { outline: '#0b1120', site: '#e2e8f0', label: '#cbd5e1', halo: '#0b1120', callout: '#f8fafc' },
};
const HOME: LngLatBoundsLike = [
  [121, 30],
  [145, 45],
];

/** Compass bearing (deg, clockwise from north) of the segment a→b. Used to point the arrowheads. */
function bearingOf([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) {
  const r = Math.PI / 180;
  const y = Math.sin((lon2 - lon1) * r) * Math.cos(lat2 * r);
  const x = Math.cos(lat1 * r) * Math.sin(lat2 * r) - Math.sin(lat1 * r) * Math.cos(lat2 * r) * Math.cos((lon2 - lon1) * r);
  return (Math.atan2(y, x) / r + 360) % 360;
}

/** Arrowhead pointing up (north), filled with `color` and outlined in the theme's outline colour so it reads on any line or basemap. */
function arrowImage(color: string, hollow: boolean, outline: string) {
  const S = 48; // drawn at 2x, registered with pixelRatio 2 → 24px icon
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  g.beginPath();
  g.moveTo(S / 2, 5);
  g.lineTo(S - 8, S - 7);
  g.lineTo(S / 2, S - 16);
  g.lineTo(8, S - 7);
  g.closePath();
  g.lineJoin = 'round';
  g.lineWidth = 6;
  g.strokeStyle = outline;
  g.stroke();
  g.fillStyle = hollow ? outline : color;
  g.fill();
  if (hollow) {
    g.lineWidth = 3;
    g.strokeStyle = color;
    g.stroke();
  }
  return g.getImageData(0, 0, S, S);
}

const colorOf = (t: Test, by: ColorBy) => (by === 'type' ? TYPE_COLOR[t.missile.type] : OUTCOME_COLOR[t.outcome]);

function toGeoJSON(tests: Test[], colorBy: ColorBy) {
  const lines: Feature[] = [];
  const impacts: Feature[] = [];
  for (const t of tests) {
    if (!t.path) continue;
    const color = colorOf(t, colorBy);
    const failed = t.outcome === 'failure';
    const props = { id: t.id, color, outcome: t.outcome, arrow: `arrow-${color}${failed ? '-hollow' : ''}` };
    const n = t.path.length;
    lines.push({ type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates: t.path } });
    impacts.push({
      type: 'Feature',
      properties: { ...props, bearing: bearingOf(t.path[n - 2], t.path[n - 1]) },
      geometry: { type: 'Point', coordinates: t.landing! },
    });
  }
  return {
    lines: { type: 'FeatureCollection', features: lines } as FeatureCollection,
    impacts: { type: 'FeatureCollection', features: impacts } as FeatureCollection,
  };
}

function sitesGeoJSON(tests: Test[], facilities: Facility[]): FeatureCollection {
  const counts = new Map<string, number>();
  tests.forEach((t) => counts.set(t.facility.id, (counts.get(t.facility.id) ?? 0) + 1));
  return {
    type: 'FeatureCollection',
    features: facilities
      .filter((f) => counts.has(f.id))
      .map((f) => ({
        type: 'Feature',
        properties: { id: f.id, name: f.name, count: counts.get(f.id) },
        geometry: { type: 'Point', coordinates: [f.lon, f.lat] },
      })),
  };
}

export default function MapView({ tests, facilities, selected, colorBy, theme, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const ready = useRef(false);
  // latest props for use inside map event handlers
  const latest = useRef({ tests, facilities, selected, colorBy, theme, onSelect });
  latest.current = { tests, facilities, selected, colorBy, theme, onSelect };
  const firstSetup = useRef(true);

  // --- create map once ---
  useEffect(() => {
    const map = new maplibregl.Map({
      container: container.current!,
      style: STYLE_URL[theme],
      bounds: HOME,
      fitBoundsOptions: { padding: 40 },
      attributionControl: { compact: true },
      maxPitch: 0,
      dragRotate: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    // "home" button: back to the Korean peninsula overview
    map.addControl(
      {
        onAdd() {
          const el = document.createElement('div');
          el.className = 'maplibregl-ctrl maplibregl-ctrl-group';
          el.innerHTML = '<button type="button" title="Reset view" aria-label="Reset view" class="home-btn">⌂</button>';
          el.onclick = () => map.fitBounds(HOME, { padding: 40, duration: 800 });
          return el;
        },
        onRemove() {},
      },
      'bottom-right',
    );
    map.touchZoomRotate.disableRotation();

    map.on('style.load', () => {
      map.setProjection({ type: 'globe' });
      // Basemap labels default to local scripts (한국어, 日本語, 中文). Use English where tiles have it.
      for (const layer of map.getStyle().layers) {
        if (layer.type !== 'symbol' || !map.getLayoutProperty(layer.id, 'text-field')) continue;
        map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']]);
      }
      setupLayers();
    });

    // (Re)build our sources + layers. Runs on every style load, i.e. first load and each theme switch,
    // because setStyle() throws away everything we added.
    const setupLayers = () => {
      const { tests, facilities, colorBy, theme } = latest.current;
      const pal = PALETTE[theme];
      const g = toGeoJSON(tests, colorBy);
      map.addSource('lines', { type: 'geojson', data: g.lines, promoteId: 'id' });
      map.addSource('impacts', { type: 'geojson', data: g.impacts, promoteId: 'id' });
      map.addSource('sites', { type: 'geojson', data: sitesGeoJSON(tests, facilities) });
      map.addSource('ends', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

      for (const color of new Set([...Object.values(TYPE_COLOR), ...Object.values(OUTCOME_COLOR)])) {
        map.addImage(`arrow-${color}`, arrowImage(color, false, pal.outline), { pixelRatio: 2 });
        map.addImage(`arrow-${color}-hollow`, arrowImage(color, true, pal.outline), { pixelRatio: 2 });
      }

      const dimmed = (on: number, off: number): maplibregl.ExpressionSpecification => [
        'case', ['boolean', ['feature-state', 'dim'], false], on, off,
      ];

      map.addLayer({
        id: 'lines-casing',
        type: 'line',
        source: 'lines',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': pal.outline, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 3, 8, 6], 'line-opacity': dimmed(0.15, 0.9) },
      });
      map.addLayer({
        id: 'lines',
        type: 'line',
        source: 'lines',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1.4, 8, 3],
          'line-opacity': dimmed(0.12, 0.8),
          'line-dasharray': ['case', ['==', ['get', 'outcome'], 'failure'], ['literal', [2, 2]], ['literal', [1, 0]]],
        },
      });
      // Invisible fat copy of every line: this is what the cursor actually hits, so a 1.5px line
      // can be caught from ~10px away. Picking the *closest* line happens in pickTest().
      map.addLayer({
        id: 'lines-hit',
        type: 'line',
        source: 'lines',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#000', 'line-width': 20, 'line-opacity': 0.001 },
      });
      // the line under the cursor, lifted above the pile with a contrasting outline
      map.addLayer({
        id: 'lines-hover-casing',
        type: 'line',
        source: 'lines',
        filter: ['==', ['get', 'id'], ''],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': pal.outline, 'line-width': 9 },
      });
      map.addLayer({
        id: 'lines-hover',
        type: 'line',
        source: 'lines',
        filter: ['==', ['get', 'id'], ''],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 4.5 },
      });
      map.addLayer({
        id: 'lines-selected',
        type: 'line',
        source: 'lines',
        filter: ['==', ['get', 'id'], ''],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 6 },
      });
      // direction chevrons along the selected flight
      map.addLayer({
        id: 'lines-selected-arrows',
        type: 'symbol',
        source: 'lines',
        filter: ['==', ['get', 'id'], ''],
        layout: {
          'symbol-placement': 'line',
          'symbol-spacing': 70,
          'icon-image': ['get', 'arrow'],
          'icon-size': 0.6,
          'icon-rotate': 90, // icons point north; line placement aligns the x axis with the line
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });
      // arrowhead where each missile came down, pointing the way it was flying
      map.addLayer({
        id: 'impacts',
        type: 'symbol',
        source: 'impacts',
        layout: {
          'icon-image': ['get', 'arrow'],
          'icon-size': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 8, 0.9],
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        paint: { 'icon-opacity': dimmed(0.15, 1) },
      });
      map.addLayer({
        id: 'impacts-selected',
        type: 'symbol',
        source: 'impacts',
        filter: ['==', ['get', 'id'], ''],
        layout: {
          'icon-image': ['get', 'arrow'],
          'icon-size': 1.4,
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });
      map.addLayer({
        id: 'sites',
        type: 'circle',
        source: 'sites',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 3.5, 40, 11],
          'circle-color': pal.site,
          'circle-opacity': 0.85,
          'circle-stroke-color': pal.outline,
          'circle-stroke-width': 1.5,
        },
      });
      map.addLayer({
        id: 'sites-selected',
        type: 'circle',
        source: 'sites',
        filter: ['==', ['get', 'id'], ''],
        paint: { 'circle-radius': 13, 'circle-color': 'transparent', 'circle-stroke-color': pal.site, 'circle-stroke-width': 2 },
      });
      map.addLayer({
        id: 'sites-label',
        type: 'symbol',
        source: 'sites',
        minzoom: 6,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
          'text-font': ['Noto Sans Regular'],
          'text-optional': true,
        },
        paint: { 'text-color': pal.label, 'text-halo-color': pal.halo, 'text-halo-width': 1.5 },
      });

      // "Launch" / "Came down here" callouts for the selected test
      map.addLayer({
        id: 'ends',
        type: 'symbol',
        source: 'ends',
        layout: {
          'text-field': ['get', 'label'],
          'text-font': ['Noto Sans Bold'],
          'text-size': 12,
          'text-variable-anchor': ['top', 'bottom', 'right', 'left'],
          'text-radial-offset': 1.3,
          'text-justify': 'auto',
          'text-allow-overlap': true,
        },
        paint: { 'text-color': pal.callout, 'text-halo-color': pal.halo, 'text-halo-width': 2 },
      });

      ready.current = true;
      syncSelection();
      if (firstSetup.current) {
        firstSetup.current = false;
        flyToSelected(false); // deep link: frame the test from the URL
      }
    };


    // --- hover + click picking ---
    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, className: 'map-tip', offset: 12 });
    const byId = (id: string) => latest.current.tests.find((t) => t.id === id);

    /** Screen-space distance from point p to segment ab. */
    const segDist = (p: maplibregl.Point, a: maplibregl.Point, b: maplibregl.Point) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = dx * dx + dy * dy;
      const t = len ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len)) : 0;
      return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
    };

    /**
     * The test whose flight path is nearest the cursor, within `radius` px.
     * The fat hit layer gives candidates; we then measure real distances so that in a
     * dense bundle you get the line you're actually pointing at, not a random one on top.
     */
    const pickTest = (pt: maplibregl.Point, radius: number): Test | null => {
      if (!map.getLayer('lines-hit')) return null;
      const box: [maplibregl.PointLike, maplibregl.PointLike] = [
        [pt.x - radius, pt.y - radius],
        [pt.x + radius, pt.y + radius],
      ];
      const ids = new Set(map.queryRenderedFeatures(box, { layers: ['lines-hit', 'impacts'] }).map((f) => f.properties?.id as string));
      let best: Test | null = null;
      let bestD = radius;
      for (const id of ids) {
        const t = byId(id);
        if (!t?.path) continue;
        const pts = t.path.map((c) => map.project(c));
        let d = Infinity;
        for (let i = 1; i < pts.length; i++) d = Math.min(d, segDist(pt, pts[i - 1], pts[i]));
        // the selected test wins ties so it stays easy to grab
        if (latest.current.selected?.id === id) d -= 2;
        if (d <= bestD) {
          bestD = d;
          best = t;
        }
      }
      return best;
    };

    let hoverId = '';
    const setHover = (id: string) => {
      if (id === hoverId) return;
      hoverId = id;
      for (const l of ['lines-hover-casing', 'lines-hover']) if (map.getLayer(l)) map.setFilter(l, ['==', ['get', 'id'], id]);
    };

    map.on('mousemove', (e: maplibregl.MapMouseEvent) => {
      const t = pickTest(e.point, 10);
      if (t) {
        setHover(t.id);
        map.getCanvas().style.cursor = 'pointer';
        const dist = t.distanceKm ? ` · ${t.distanceKm.toLocaleString('en-US')} km` : '';
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `<strong>${t.missile.name}</strong><span>${formatDate(t.date)} · ${TYPE_LABEL[t.missile.type]}${dist}</span><em>Click for details</em>`,
          )
          .addTo(map);
        return;
      }
      setHover('');
      const site = map.getLayer('sites') ? map.queryRenderedFeatures(e.point, { layers: ['sites'] })[0]?.properties : null;
      if (site) {
        map.getCanvas().style.cursor = '';
        popup
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${site.name}</strong><span>${site.count} launch${site.count === 1 ? '' : 'es'} in view</span>`)
          .addTo(map);
        return;
      }
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
    map.getCanvas().addEventListener('mouseleave', () => {
      setHover('');
      popup.remove();
    });

    map.on('click', (e: maplibregl.MapMouseEvent) => {
      // fingers are fatter than cursors
      const touch = (e.originalEvent as PointerEvent).pointerType === 'touch' || matchMedia('(pointer: coarse)').matches;
      latest.current.onSelect(pickTest(e.point, touch ? 18 : 10)?.id ?? null);
    });

    return () => {
      ready.current = false;
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dim everything except the selected test and highlight it.
  function syncSelection() {
    const map = mapRef.current;
    // guard: after a hot reload the live map may predate newer layers
    if (!map || !ready.current || !map.getLayer('ends')) return;
    const { tests, selected } = latest.current;
    const id = selected?.path ? selected.id : '';
    for (const t of tests) {
      if (!t.path) continue;
      const dim = !!selected && t.id !== selected.id;
      map.setFeatureState({ source: 'lines', id: t.id }, { dim });
      map.setFeatureState({ source: 'impacts', id: t.id }, { dim });
    }
    map.setFilter('lines-selected', ['==', ['get', 'id'], id]);
    map.setFilter('impacts-selected', ['==', ['get', 'id'], id]);
    map.setFilter('lines-selected-arrows', ['==', ['get', 'id'], id]);
    const ends: Feature[] = [];
    if (selected) {
      const site = selected.facility.id === 'unknown' ? 'Launch (site unknown)' : `Launch\n${selected.facility.name}`;
      ends.push({ type: 'Feature', properties: { label: site }, geometry: { type: 'Point', coordinates: [selected.facility.lon, selected.facility.lat] } });
      if (selected.landing) {
        const dist = selected.distanceKm ? `\n${selected.distanceKm.toLocaleString('en-US')} km away` : '';
        const label = selected.outcome === 'failure' ? `Failed, came down here${dist}` : `Came down here${dist}`;
        ends.push({ type: 'Feature', properties: { label }, geometry: { type: 'Point', coordinates: selected.landing } });
      }
    }
    (map.getSource('ends') as GeoJSONSource).setData({ type: 'FeatureCollection', features: ends });
    map.setFilter('sites-selected', ['==', ['get', 'id'], selected?.facility.id ?? '']);
  }

  // --- data changes ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready.current) return;
    const g = toGeoJSON(tests, colorBy);
    (map.getSource('lines') as GeoJSONSource).setData(g.lines);
    (map.getSource('impacts') as GeoJSONSource).setData(g.impacts);
    (map.getSource('sites') as GeoJSONSource).setData(sitesGeoJSON(tests, facilities));
    // feature-state survives setData only for ids that still exist; re-apply
    map.once('idle', syncSelection);
    syncSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests, facilities, colorBy]);

  // --- theme changes: swap basemap; style.load then rebuilds our layers in the new palette ---
  const appliedTheme = useRef(theme);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedTheme.current === theme) return;
    appliedTheme.current = theme;
    ready.current = false;
    map.setStyle(STYLE_URL[theme], { diff: false });
  }, [theme]);

  // Frame the selected flight, leaving room for the detail card.
  function flyToSelected(animate = true) {
    const map = mapRef.current;
    const { selected } = latest.current;
    if (!map || !selected) return;
    const pts = selected.path ?? [[selected.facility.lon, selected.facility.lat]];
    const b = new maplibregl.LngLatBounds(pts[0], pts[0]);
    pts.forEach((p) => b.extend(p));
    let padding: maplibregl.PaddingOptions = { top: 80, bottom: 60, left: 60, right: 470 };
    if (window.innerWidth <= 800) {
      // phone: the detail sheet covers the bottom half of the screen, frame the flight above it
      const rect = container.current!.getBoundingClientRect();
      const sheetTop = window.innerHeight * 0.5;
      const hidden = Math.max(0, rect.bottom - sheetTop);
      padding = { top: 50, left: 30, right: 30, bottom: Math.min(rect.height - 80, hidden + 30) };
    }
    map.fitBounds(b, { padding, maxZoom: 6.5, duration: animate ? 900 : 0 });
  }

  // --- selection changes: highlight + fly ---
  useEffect(() => {
    syncSelection();
    // before the first load the camera gets reset by style/projection setup; the load handler flies instead
    if (ready.current) flyToSelected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return <div ref={container} className="map" />;
}

export { HOME };
