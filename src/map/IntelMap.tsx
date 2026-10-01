'use client';

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { ExpressionSpecification, GeoJSONSource, LngLatBoundsLike } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Theme } from '../theme';
import { MAPLIBRE_WORKER_URL, STYLE_URL } from '../map/maplibre';
import { LAYERS, NIGHT_LIGHTS, SHADES, SHADE_COLORS, type LayerId, type Shade } from './config';
import type { Data, Selection } from './types';

maplibregl.setWorkerUrl(MAPLIBRE_WORKER_URL);

interface Props {
  data: Data;
  visible: Set<LayerId>;
  shade: Shade;
  selected: Selection | null;
  theme: Theme;
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
const POINT_LAYERS = LAYERS.filter((l) => l.id !== 'escape-route');

/** Step expression colouring counties by one numeric property. */
function shadeExpr(shade: Shade): ExpressionSpecification | string {
  const def = SHADES.find((s) => s.id === shade);
  if (!def?.stops) return 'rgba(0,0,0,0)';
  const prop: ExpressionSpecification = ['coalesce', ['get', shade], 0];
  const expr: unknown[] = ['step', prop, SHADE_COLORS[0]];
  def.stops.slice(1).forEach((s, i) => expr.push(s, SHADE_COLORS[i + 1]));
  return expr as ExpressionSpecification;
}

/** Counties fade as you zoom in, so the basemap (roads, towns) shows through around the points. */
function fillOpacity(shade: Shade): ExpressionSpecification | number {
  if (shade === 'none' || shade === 'lights') return 0;
  return ['interpolate', ['linear'], ['zoom'], 6, ['case', ['boolean', ['feature-state', 'selected'], false], 0.8, 0.62], 9.5, ['case', ['boolean', ['feature-state', 'selected'], false], 0.35, 0.22]];
}

export default function IntelMap({ data, visible, shade, selected, theme, onSelect }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const latest = useRef({ data, visible, shade, selected, theme, onSelect });
  latest.current = { data, visible, shade, selected, theme, onSelect };
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
        map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']]);
      }
      setup();
    });

    const setup = () => {
      const { data, visible, shade, theme } = latest.current;
      const pal = PAL[theme];
      // first basemap symbol layer: our fills/lines go under the labels, points on top of everything
      const firstLabel = map.getStyle().layers.find((l) => l.type === 'symbol')?.id;

      map.addSource('lights', { type: 'raster', tiles: [NIGHT_LIGHTS], tileSize: 256, maxzoom: 8, attribution: 'NASA Black Marble' });
      map.addLayer({ id: 'lights', type: 'raster', source: 'lights', paint: { 'raster-opacity': 0.95 }, layout: { visibility: shade === 'lights' ? 'visible' : 'none' } }, firstLabel);

      map.addSource('counties', { type: 'geojson', data: data.counties, promoteId: 'pcode' });
      map.addLayer(
        {
          id: 'county-fill',
          type: 'fill',
          source: 'counties',
          paint: {
            'fill-color': shadeExpr(shade) as ExpressionSpecification,
            'fill-opacity': fillOpacity(shade),
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
            'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], pal.ring, pal.line],
            'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2.5, 0.4],
            'line-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0.45],
          },
        },
        firstLabel,
      );
      map.addSource('provinces', { type: 'geojson', data: data.provinces });
      map.addLayer({ id: 'province-line', type: 'line', source: 'provinces', paint: { 'line-color': pal.line, 'line-width': 1.2, 'line-opacity': 0.8 } }, firstLabel);

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
        // markets scale with stall count; everything else with zoom
        const radius: ExpressionSpecification =
          l.id === 'markets'
            ? ['interpolate', ['linear'], ['zoom'], 6, ['+', 1.5, ['/', ['sqrt', ['coalesce', ['get', 'stalls'], 50]], 9]], 11, ['+', 4, ['/', ['sqrt', ['coalesce', ['get', 'stalls'], 50]], 3]]]
            : ['interpolate', ['linear'], ['zoom'], 6, ['case', ['boolean', ['feature-state', 'selected'], false], l.size[0] + 4, l.size[0]], 10, ['case', ['boolean', ['feature-state', 'selected'], false], l.size[1] + 4, l.size[1]]];
        map.addLayer({
          id: `${l.id}-dot`,
          type: 'circle',
          source: l.id,
          layout: { visibility: vis },
          paint: {
            'circle-radius': radius,
            'circle-color': l.color,
            'circle-opacity': l.id === 'markets' ? 0.75 : 1,
            'circle-stroke-width': ['case', ['boolean', ['feature-state', 'selected'], false], 3, 1.2],
            'circle-stroke-color': ['case', ['boolean', ['feature-state', 'selected'], false], pal.ring, pal.halo],
          },
        });
        if (l.id === 'camps' || l.id === 'missile-bases' || l.id === 'sites') {
          map.addLayer({
            id: `${l.id}-label`,
            type: 'symbol',
            source: l.id,
            minzoom: l.id === 'camps' ? 6.2 : 7,
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
      const { shade } = latest.current;
      const extra =
        !hits.length && shade !== 'none' && shade !== 'lights' && p[shade] !== undefined
          ? ` · ${Number(p[shade]).toLocaleString('en-US')} ${SHADES.find((s) => s.id === shade)!.label.toLowerCase()}`
          : '';
      tip
        .setLngLat(e.lngLat)
        .setHTML(`<b>${String(p.name).replace(/</g, '&lt;')}</b>${hits.length ? '' : `<span>${String(p.province ?? '')}${extra}</span>`}`)
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

  // --- county shading ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer('county-fill')) return;
    map.setPaintProperty('county-fill', 'fill-color', shadeExpr(shade) as ExpressionSpecification);
    map.setPaintProperty('county-fill', 'fill-opacity', fillOpacity(shade));
    map.setLayoutProperty('lights', 'visibility', shade === 'lights' ? 'visible' : 'none');
  }, [shade]);

  // --- selection ---
  function applySelection(fly: boolean) {
    const map = mapRef.current;
    const { selected, data } = latest.current;
    if (!map?.getSource('counties')) return;
    if (prevSel.current) map.setFeatureState(prevSel.current, { selected: false });
    prevSel.current = null;
    if (!selected) return;
    const source = selected.kind === 'county' ? 'counties' : selected.layer;
    prevSel.current = { source, id: selected.id };
    map.setFeatureState(prevSel.current, { selected: true });
    if (!fly) return;
    const wide = window.innerWidth > 800;
    const padding = wide ? { top: 40, bottom: 40, left: 40, right: 420 } : { top: 30, bottom: Math.round(window.innerHeight * 0.35), left: 20, right: 20 };
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
