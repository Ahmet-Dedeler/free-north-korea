'use client';

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { ExpressionSpecification, GeoJSONSource, LngLatBoundsLike } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Theme } from '../theme';
import type { Lang } from '@/site/seo';
import { provinceName } from '@/content/countiesI18n';
import { COUNTRY_NAMES, LABEL_FIELDS, MAP_TEXT } from '@/content/mapI18n';
import { MAPLIBRE_WORKER_URL, STYLE_URL } from '../map/maplibre';
import { CROP_STOPS, LAYERS, LIGHTS_STOPS, OVERLAYS, RADAR_COLOR, SHADES, SHADE_COLORS, type LayerId, type Overlay, type Shade } from './config';
import type { FeatureCollection } from 'geojson';
import type { Basemap, Data, Focus, Selection } from './types';

maplibregl.setWorkerUrl(MAPLIBRE_WORKER_URL);

interface Props {
  data: Data;
  visible: Set<LayerId>;
  shade: Shade;
  base: Basemap;
  overlays: Set<Overlay>;
  /** Year shown by time-axis overlays (night lights). */
  year: number;
  /** Which 16-day composite of this season crop health shows (index into crops.provinces[*].season). */
  cropStep: number;
  selected: Selection | null;
  /** A spot to fly to without selecting a feature (a quake from Latest, a satellite close-up). */
  focus: Focus | null;
  theme: Theme;
  lang: Lang;
  onSelect: (s: Selection | null) => void;
}

const HOME: LngLatBoundsLike = [
  [124.1, 37.6],
  [130.8, 43.05],
];
const ROUTE_BOUNDS: LngLatBoundsLike = [
  [99, 12],
  [131, 43.5],
];
const PAL: Record<Theme, { halo: string; label: string; ring: string; line: string }> = {
  light: { halo: '#ffffff', label: '#1e293b', ring: '#0f172a', line: '#475569' },
  dark: { halo: '#0b1120', label: '#e2e8f0', ring: '#f8fafc', line: '#94a3b8' },
};
/** On satellite imagery, borders are drawn light so they read against fields and forest in either theme. */
const SAT_LINE = '#f8fafc';
/** Esri World Imagery, the same tiles as SatView. Esri asks for this credit wherever the imagery is shown. */
const SATELLITE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SAT_CREDIT = 'Imagery: Esri, Maxar, Earthstar Geographics';
const POINT_LAYERS = LAYERS.filter((l) => l.id !== 'escape-route');

/**
 * Step expression colouring counties by one numeric property.
 * `step` paints everything below its first threshold with the default colour, so that default
 * has to be the first data colour. Exact zero stays transparent on its own, or a county with
 * a few incidents (or a low density) would look empty.
 */
function shadeExpr(shade: Shade): ExpressionSpecification | string {
  const def = SHADES.find((s) => s.id === shade);
  if (!def?.stops) return 'rgba(0,0,0,0)';
  const prop: ExpressionSpecification = ['coalesce', ['get', shade], 0];
  const step: unknown[] = ['step', prop, SHADE_COLORS[1]];
  def.stops.slice(1).forEach((s, i) => step.push(s, SHADE_COLORS[i + 1]));
  return ['case', ['<=', prop, 0], SHADE_COLORS[0], step] as unknown as ExpressionSpecification;
}

/** Feature-state ids must match the GeoJSON property's type. Market ids are numbers; the URL keeps them as strings. */
function featureStateId(selected: Selection, data: Data): string | number | null {
  if (selected.kind === 'county') return selected.id;
  const raw = data[selected.layer].features.find((x) => String(x.properties?.id) === selected.id)?.properties?.id;
  return typeof raw === 'number' || typeof raw === 'string' ? raw : null;
}

/**
 * Basemap label in the reader's language. OSM's local-language country names for the two Koreas are their official
 * names (조선민주주의인민공화국, 大韓民國…), so the country labels use the names the rest of the site uses.
 */
function labelExpr(lang: Lang): ExpressionSpecification {
  const name = ['coalesce', ...LABEL_FIELDS[lang].map((k) => ['get', k])];
  const kp = COUNTRY_NAMES[lang];
  if (!kp) return name as ExpressionSpecification;
  return ['match', ['get', 'iso_a2'], 'KP', kp.north, 'KR', kp.south, name] as unknown as ExpressionSpecification;
}

/**
 * Counties fade as you zoom in, so the basemap (roads, towns) shows through around the points. On satellite imagery
 * they start lighter and fade further: people switch to satellite to see the ground.
 */
function fillOpacity(shade: Shade, base: Basemap, overlays: Set<Overlay>): ExpressionSpecification | number {
  if (shade === 'none') return 0;
  // with the radar dots on, the county shading steps back so the two scales don't compete
  const k = overlays.has('radar') ? 0.4 : 1;
  const [lo, hi, loSel, hiSel] = (base === 'satellite' ? [0.45, 0.08, 0.6, 0.12] : [0.62, 0.22, 0.8, 0.35]).map((v) => v * k);
  return ['interpolate', ['linear'], ['zoom'], 6, ['case', ['boolean', ['feature-state', 'selected'], false], loSel, lo], 9.5, ['case', ['boolean', ['feature-state', 'selected'], false], hiSel, hi]];
}

/** Visits by ships broadcasting a flag other than North Korea's (no flag doesn't count), as the port panel shows. */
function foreignVisits(flags: unknown): number {
  try {
    const f = (typeof flags === 'string' ? JSON.parse(flags) : flags) as Record<string, number>;
    return Object.entries(f ?? {}).reduce((t, [k, v]) => (k === 'PRK' || k === 'unknown' ? t : t + v), 0);
  } catch {
    return 0;
  }
}

/** Province colour for one 16-day composite of crop health; a province with no clear view then stays see-through. */
function cropsExpr(step: number): ExpressionSpecification {
  const v: ExpressionSpecification = ['get', `crop${step}`];
  return ['case', ['==', v, null], 'rgba(0,0,0,0)', ['interpolate', ['linear'], v, ...CROP_STOPS.flat()]] as unknown as ExpressionSpecification;
}

/** County colour for one year of night lights; a county with no clean data that year stays see-through. */
function lightsExpr(year: number): ExpressionSpecification {
  const v: ExpressionSpecification = ['get', `lit${year}`];
  return ['case', ['==', v, null], 'rgba(0,0,0,0)', ['interpolate', ['linear'], ['sqrt', v], ...LIGHTS_STOPS.flatMap(([t, c]) => [Math.sqrt(t), c])]] as unknown as ExpressionSpecification;
}

/** One point per radar square, at its centre, carrying the square's counts. */
function radarDots(fc: FeatureCollection): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: fc.features.flatMap((f) => {
      if (f.geometry.type !== 'Polygon') return [];
      const ring = f.geometry.coordinates[0];
      const xs = ring.map((c) => c[0]);
      const ys = ring.map((c) => c[1]);
      const center = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
      return [{ type: 'Feature' as const, properties: f.properties, geometry: { type: 'Point' as const, coordinates: center } }];
    }),
  };
}

/** County border colour: the selected county gets a ring, the rest a hairline. */
function countyLine(base: Basemap, pal: (typeof PAL)[Theme]): ExpressionSpecification {
  return ['case', ['boolean', ['feature-state', 'selected'], false], base === 'satellite' ? '#facc15' : pal.ring, base === 'satellite' ? SAT_LINE : pal.line];
}

export default function IntelMap({ data, visible, shade, base, overlays, year, cropStep, selected, focus, theme: deviceTheme, lang, onSelect }: Props) {
  // Night lights need a night map: dark around the counties, so unlit reads as dark and lit as glow.
  const theme: Theme = overlays.has('lights') ? 'dark' : deviceTheme;
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const latest = useRef({ data, visible, shade, base, overlays, year, cropStep, selected, theme, onSelect });
  latest.current = { data, visible, shade, base, overlays, year, cropStep, selected, theme, onSelect };
  const prevSel = useRef<{ source: string; id: string | number } | null>(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: box.current!,
      style: STYLE_URL[theme],
      bounds: HOME,
      fitBoundsOptions: { padding: 20 },
      attributionControl: { compact: true },
      maxPitch: 0,
      dragRotate: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.touchZoomRotate.disableRotation();
    const tip = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10, className: 'map-tip' });

    map.on('style.load', () => {
      for (const layer of map.getStyle().layers) {
        if (layer.type !== 'symbol' || !map.getLayoutProperty(layer.id, 'text-field')) continue;
        map.setLayoutProperty(layer.id, 'text-field', labelExpr(lang));
      }
      setup();
    });

    const setup = () => {
      const { data, visible, shade, base, overlays, theme } = latest.current;
      const pal = PAL[theme];
      // first basemap symbol layer: our fills/lines go under the labels, points on top of everything
      const firstLabel = map.getStyle().layers.find((l) => l.type === 'symbol')?.id;

      // Satellite sits over the basemap's own fills and roads but under its labels, so place names stay (a hybrid
      // view, like Google's). Esri serves real imagery to about zoom 18 here; beyond that MapLibre overzooms.
      map.addSource('satellite', { type: 'raster', tiles: [SATELLITE], tileSize: 256, maxzoom: 18, attribution: SAT_CREDIT });
      map.addLayer({ id: 'satellite', type: 'raster', source: 'satellite', layout: { visibility: base === 'satellite' ? 'visible' : 'none' } }, firstLabel);

      map.addSource('counties', { type: 'geojson', data: data.counties, promoteId: 'pcode' });
      map.addLayer(
        {
          id: 'county-fill',
          type: 'fill',
          source: 'counties',
          paint: {
            'fill-color': shadeExpr(shade) as ExpressionSpecification,
            'fill-opacity': fillOpacity(shade, base, overlays),
          },
        },
        firstLabel,
      );
      map.addLayer(
        {
          id: 'county-line',
          type: 'line',
          source: 'counties',
          paint: {
            'line-color': countyLine(base, pal),
            'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2.5, 0.4],
            'line-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0.45],
          },
        },
        firstLabel,
      );
      map.addSource('provinces', { type: 'geojson', data: data.provinces });
      map.addLayer({ id: 'province-line', type: 'line', source: 'provinces', paint: { 'line-color': base === 'satellite' ? SAT_LINE : pal.line, 'line-width': 1.2, 'line-opacity': 0.8 } }, firstLabel);

      // Overlays cover the county shading (a dark raster and a choropleth don't mix) but sit under the borders,
      // labels and points, so you can still hover and click counties through them.
      // Night lights: a county fill on the counties source, one year at a time (`lit<year>`, merged in by loadData)
      map.addLayer(
        { id: 'lights', type: 'fill', source: 'counties', paint: { 'fill-color': lightsExpr(latest.current.year), 'fill-opacity': 0.94 }, layout: { visibility: overlays.has('lights') ? 'visible' : 'none' } },
        'county-line',
      );
      // Crop health: a province fill (its cropland only is measured, but the province is the unit), one 16-day
      // composite at a time (`crop<i>`, merged in by loadData)
      map.addLayer(
        { id: 'crops', type: 'fill', source: 'provinces', paint: { 'fill-color': cropsExpr(latest.current.cropStep), 'fill-opacity': 0.82 }, layout: { visibility: overlays.has('crops') ? 'visible' : 'none' } },
        'county-line',
      );
      // Radar: vessels that sent no AIS per 0.1° square (public/layers/radar.geojson, scripts/build-ships.ts), drawn
      // as one dot per square at its centre, sized by count. Filled squares read as solid blocks spilling onto the
      // coast; dots read as "ships out here" and leave the sea and coastline visible.
      map.addSource('radar', { type: 'geojson', data: radarDots(data.radar), attribution: 'Global Fishing Watch' });
      map.addLayer(
        {
          id: 'radar',
          type: 'circle',
          source: 'radar',
          paint: {
            'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 5, ['+', 0.8, ['*', 0.28, ['sqrt', ['get', 'dark']]]], 9, ['+', 2, ['*', 1.1, ['sqrt', ['get', 'dark']]]]],
            'circle-color': RADAR_COLOR,
            'circle-opacity': 0.72,
            'circle-stroke-width': 0,
          },
          layout: { visibility: overlays.has('radar') ? 'visible' : 'none' },
        },
        'county-line',
      );

      map.addSource('escape-route', { type: 'geojson', data: data['escape-route'] });
      const routeVis = visible.has('escape-route') ? 'visible' : 'none';
      map.addLayer({
        id: 'escape-route-line',
        type: 'line',
        source: 'escape-route',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: { visibility: routeVis, 'line-cap': 'round' },
        paint: { 'line-color': '#22c55e', 'line-width': 3, 'line-dasharray': [2, 1.5], 'line-opacity': ['case', ['==', ['get', 'kind'], 'air'], 0.45, 0.95] },
      });
      map.addLayer({
        id: 'escape-route-label',
        type: 'symbol',
        source: 'escape-route',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: { visibility: routeVis, 'text-field': ['get', 'name'], 'text-size': 12, 'text-anchor': 'left', 'text-offset': [0.8, 0], 'text-font': ['Noto Sans Regular'] },
        paint: { 'text-color': '#16a34a', 'text-halo-color': pal.halo, 'text-halo-width': 1.5 },
      });

      for (const l of POINT_LAYERS) {
        map.addSource(l.id, { type: 'geojson', data: data[l.id], promoteId: 'id' });
        const vis = visible.has(l.id) ? 'visible' : 'none';
        // markets scale with stall count, ports with visits; everything else with zoom
        const radius: ExpressionSpecification =
          l.id === 'markets'
            ? ['interpolate', ['linear'], ['zoom'], 6, ['+', 1.5, ['/', ['sqrt', ['coalesce', ['get', 'stalls'], 50]], 9]], 11, ['+', 4, ['/', ['sqrt', ['coalesce', ['get', 'stalls'], 50]], 3]]]
            : l.id === 'ports'
              ? ['interpolate', ['linear'], ['zoom'], 6, ['+', 4, ['/', ['sqrt', ['get', 'visits']], 2.2]], 10, ['+', 7, ['/', ['sqrt', ['get', 'visits']], 1.4]]]
              : ['interpolate', ['linear'], ['zoom'], 6, ['case', ['boolean', ['feature-state', 'selected'], false], l.size[0] + 4, l.size[0]], 10, ['case', ['boolean', ['feature-state', 'selected'], false], l.size[1] + 4, l.size[1]]];
        map.addLayer({
          id: `${l.id}-dot`,
          type: 'circle',
          source: l.id,
          layout: { visibility: vis },
          paint: {
            'circle-radius': radius,
            'circle-color': l.color,
            'circle-opacity': l.id === 'markets' || l.id === 'ports' ? 0.8 : 1,
            'circle-stroke-width': ['case', ['boolean', ['feature-state', 'selected'], false], 3, 1.2],
            'circle-stroke-color': ['case', ['boolean', ['feature-state', 'selected'], false], pal.ring, pal.halo],
          },
        });
        if (l.id === 'camps' || l.id === 'missile-bases' || l.id === 'sites' || l.id === 'ports') {
          map.addLayer({
            id: `${l.id}-label`,
            type: 'symbol',
            source: l.id,
            minzoom: l.id === 'camps' || l.id === 'ports' ? 6.2 : 7,
            layout: { visibility: vis, 'text-field': ['get', 'name'], 'text-size': 11.5, 'text-offset': [0, 1.1], 'text-anchor': 'top', 'text-optional': true, 'text-font': ['Noto Sans Regular'], 'text-max-width': 10 },
            paint: { 'text-color': pal.label, 'text-halo-color': pal.halo, 'text-halo-width': 1.5 },
          });
        }
      }
      applySelection(false);
    };

    const pointLayerIds = () => POINT_LAYERS.filter((l) => latest.current.visible.has(l.id)).map((l) => `${l.id}-dot`);

    map.on('click', (e) => {
      const hits = map.queryRenderedFeatures(e.point, { layers: pointLayerIds().filter((id) => map.getLayer(id)) });
      if (hits.length) {
        const f = hits[0];
        return latest.current.onSelect({ kind: 'point', layer: f.source as LayerId, id: String(f.properties.id) });
      }
      const c = map.queryRenderedFeatures(e.point, { layers: ['county-fill'] })[0];
      latest.current.onSelect(c ? { kind: 'county', id: String(c.properties.pcode) } : null);
    });
    map.on('mousemove', (e) => {
      if (!map.getLayer('county-fill')) return;
      const hits = map.queryRenderedFeatures(e.point, { layers: pointLayerIds().filter((id) => map.getLayer(id)) });
      const c = hits.length ? null : map.queryRenderedFeatures(e.point, { layers: ['county-fill'] })[0];
      map.getCanvas().style.cursor = hits.length || c ? 'pointer' : '';
      const f = hits[0] ?? c;
      if (!f) return void tip.remove();
      const p = f.properties;
      const { shade, overlays, year, cropStep, data } = latest.current;
      const fmt = MAP_TEXT[lang].tips[shade];
      // with night lights on, the county tip gives that year's lit share instead of the shading value
      const lit = p[`lit${year}`];
      const extra = hits.length
        ? ''
        : overlays.has('lights')
          ? ` · ${MAP_TEXT[lang].lightsTip(year, typeof lit === 'number' ? lit : null)}`
          : overlays.has('crops')
            ? (() => {
                // a county's tip gives its province's crop greenness (the unit crop health is measured in)
                const s = data.crops.provinces[String(p.pcode ?? '').slice(0, 4)]?.season[cropStep];
                return s ? ` · ${MAP_TEXT[lang].cropTip(s.date, s.anomaly)}` : '';
              })()
            : fmt && p[shade] !== undefined
            ? ` · ${fmt(Number(p[shade]))}`
            : '';
      const esc = (v: unknown) => String(v).replace(/</g, '&lt;');
      const tx = MAP_TEXT[lang];
      const sub = !hits.length ? `${provinceName(String(p.province ?? ''), lang)}${extra}` : f.source === 'ports' ? tx.portTip(Number(p.visits), foreignVisits(p.flags)) : '';
      const name = f.source === 'ports' ? tx.portName(String(p.port), p.near === true || p.near === 'true', String(p.name)) : p.name;
      tip
        .setLngLat(e.lngLat)
        .setHTML(`<b>${esc(name)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}`)
        .addTo(map);
    });
    map.on('mouseout', () => tip.remove());

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- visibility ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer('county-fill')) return;
    for (const l of LAYERS) {
      const v = visible.has(l.id) ? 'visible' : 'none';
      for (const suffix of ['-dot', '-label', '-line']) if (map.getLayer(l.id + suffix)) map.setLayoutProperty(l.id + suffix, 'visibility', v);
    }
    if (map.getLayer('escape-route-label')) map.setLayoutProperty('escape-route-label', 'visibility', visible.has('escape-route') ? 'visible' : 'none');
  }, [visible]);

  // escape route: zoom out to show it when it's switched on
  const routeWasOn = useRef(visible.has('escape-route'));
  useEffect(() => {
    const on = visible.has('escape-route');
    if (on !== routeWasOn.current) mapRef.current?.fitBounds(on ? ROUTE_BOUNDS : HOME, { padding: 30, duration: 900 });
    routeWasOn.current = on;
  }, [visible]);

  // --- county shading and basemap ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer('county-fill')) return;
    map.setPaintProperty('county-fill', 'fill-color', shadeExpr(shade) as ExpressionSpecification);
    map.setPaintProperty('county-fill', 'fill-opacity', fillOpacity(shade, base, overlays));
    map.setPaintProperty('county-line', 'line-color', countyLine(base, PAL[theme]));
    map.setPaintProperty('province-line', 'line-color', base === 'satellite' ? SAT_LINE : PAL[theme].line);
    map.setLayoutProperty('satellite', 'visibility', base === 'satellite' ? 'visible' : 'none');
    for (const o of OVERLAYS) if (map.getLayer(o.id)) map.setLayoutProperty(o.id, 'visibility', overlays.has(o.id) ? 'visible' : 'none');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shade, base, overlays]);

  // --- year of time-axis overlays ---
  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer('lights')) map.setPaintProperty('lights', 'fill-color', lightsExpr(year));
  }, [year]);
  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer('crops')) map.setPaintProperty('crops', 'fill-color', cropsExpr(cropStep));
  }, [cropStep]);

  // --- selection ---
  function applySelection(fly: boolean) {
    const map = mapRef.current;
    const { selected, data } = latest.current;
    if (!map?.getSource('counties')) return;
    if (prevSel.current) map.setFeatureState(prevSel.current, { selected: false });
    prevSel.current = null;
    if (!selected) return;
    const source = selected.kind === 'county' ? 'counties' : selected.layer;
    const id = featureStateId(selected, data);
    if (id !== null) {
      prevSel.current = { source, id };
      map.setFeatureState(prevSel.current, { selected: true });
    }
    if (!fly) return;
    const wide = window.innerWidth > 800;
    // phones: the panel is a bottom sheet up to 45vh tall, so keep the selection in the part of the map above it
    const hidden = map.getContainer().getBoundingClientRect().bottom - window.innerHeight * 0.55;
    const padding = wide ? { top: 40, bottom: 40, left: 40, right: 420 } : { top: 30, bottom: Math.max(30, Math.round(hidden) + 20), left: 20, right: 20 };
    if (selected.kind === 'county') {
      const f = data.counties.features.find((x) => x.properties?.pcode === selected.id);
      if (!f) return;
      const b = new maplibregl.LngLatBounds();
      const walk = (c: unknown): void => (Array.isArray(c) && typeof c[0] === 'number' ? void b.extend(c as [number, number]) : (c as unknown[]).forEach(walk));
      walk((f.geometry as { coordinates: unknown }).coordinates);
      map.fitBounds(b, { padding, maxZoom: 9.5, duration: 800 });
    } else {
      const f = data[selected.layer].features.find((x) => String(x.properties?.id) === selected.id);
      if (f?.geometry.type === 'Point') map.flyTo({ center: f.geometry.coordinates as [number, number], zoom: Math.max(map.getZoom(), 9), padding, duration: 800 });
    }
  }
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.getSource('counties')) return applySelection(true);
    const retry = () => map.getSource('counties') && applySelection(true);
    map.once('idle', retry);
    return () => void map.off('idle', retry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // --- data refresh (only matters in dev) ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getSource('counties')) return;
    (map.getSource('counties') as GeoJSONSource).setData(data.counties);
  }, [data]);

  // --- focus: fly to a spot (a quake gets a pulsing ring; a close-up zooms right in) ---
  const focusMarker = useRef<maplibregl.Marker | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    focusMarker.current?.remove();
    focusMarker.current = null;
    if (!map || !focus) return;
    if (focus.ping !== false) {
      const el = document.createElement('div');
      el.className = 'focus-ping';
      focusMarker.current = new maplibregl.Marker({ element: el }).setLngLat(focus.center).addTo(map);
    }
    // keep the spot clear of the panel: on the right on desktop, the bottom sheet on phones
    const wide = window.innerWidth > 800;
    const hidden = map.getContainer().getBoundingClientRect().bottom - window.innerHeight * 0.55;
    const padding = wide ? { top: 40, bottom: 40, left: 40, right: 420 } : { top: 30, bottom: Math.max(30, Math.round(hidden) + 20), left: 20, right: 20 };
    map.flyTo({ center: focus.center, zoom: focus.zoom ?? Math.max(map.getZoom(), 7), padding, duration: focus.zoom ? 1600 : 900 });
  }, [focus]);

  // --- theme ---
  const appliedTheme = useRef(theme);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedTheme.current === theme) return;
    appliedTheme.current = theme;
    map.setStyle(STYLE_URL[theme], { diff: false });
  }, [theme]);

  return <div ref={box} className="map" />;
}
