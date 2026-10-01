'use client';

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource, LngLatBoundsLike } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ESCAPE_ROUTE, PLACE_COLOR, type Place, type PlaceCategory } from '../content/places';
import type { Theme } from '../theme';
import { MAPLIBRE_WORKER_URL, STYLE_URL } from './maplibre';

maplibregl.setWorkerUrl(MAPLIBRE_WORKER_URL);

interface Props {
  places: Place[]; // already filtered
  showRoute: boolean;
  selected: Place | null;
  theme: Theme;
  onSelect: (id: string | null) => void;
}

/** North Korea, snug. The escape route view zooms out to Southeast Asia. */
const HOME: LngLatBoundsLike = [
  [124.0, 37.6],
  [130.8, 43.1],
];
const ROUTE_BOUNDS: LngLatBoundsLike = [
  [99, 12],
  [131, 43.5],
];

const PALETTE: Record<Theme, { halo: string; label: string; ring: string }> = {
  light: { halo: '#ffffff', label: '#1e293b', ring: '#0f172a' },
  dark: { halo: '#0b1120', label: '#e2e8f0', ring: '#f8fafc' },
};

function placesGeoJSON(places: Place[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: places.map((p) => ({
      type: 'Feature',
      id: p.id,
      geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
      properties: { id: p.id, name: p.name, color: PLACE_COLOR[p.category as PlaceCategory] },
    })),
  };
}

function routeGeoJSON(show: boolean): FeatureCollection {
  if (!show) return { type: 'FeatureCollection', features: [] };
  const coords = ESCAPE_ROUTE.map((w) => [w.lon, w.lat]);
  return {
    type: 'FeatureCollection',
    features: [
      // the overland part is walked/driven; the last leg (Bangkok → Seoul) is a flight, drawn lighter
      { type: 'Feature', properties: { kind: 'land' }, geometry: { type: 'LineString', coordinates: coords.slice(0, -1) } },
      { type: 'Feature', properties: { kind: 'air' }, geometry: { type: 'LineString', coordinates: coords.slice(-2) } },
      ...ESCAPE_ROUTE.map((w, i) => ({
        type: 'Feature' as const,
        properties: { name: `${i + 1}. ${w.name}` },
        geometry: { type: 'Point' as const, coordinates: [w.lon, w.lat] },
      })),
    ],
  };
}

export default function AtlasMap({ places, showRoute, selected, theme, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const latest = useRef({ places, showRoute, selected, theme, onSelect });
  latest.current = { places, showRoute, selected, theme, onSelect };
  const prevSel = useRef<string | null>(null);

  // --- create once ---
  useEffect(() => {
    const map = new maplibregl.Map({
      container: container.current!,
      style: STYLE_URL[theme],
      bounds: HOME,
      fitBoundsOptions: { padding: 30 },
      attributionControl: { compact: true },
      maxPitch: 0,
      dragRotate: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.touchZoomRotate.disableRotation();

    map.on('style.load', () => {
      // English labels where the tiles have them
      for (const layer of map.getStyle().layers) {
        if (layer.type !== 'symbol' || !map.getLayoutProperty(layer.id, 'text-field')) continue;
        map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']]);
      }
      setup();
    });

    // Runs on every style load (first load + each theme switch), since setStyle drops our layers.
    const setup = () => {
      const { places, showRoute, selected, theme } = latest.current;
      const pal = PALETTE[theme];
      map.addSource('route', { type: 'geojson', data: routeGeoJSON(showRoute) });
      map.addSource('places', { type: 'geojson', data: placesGeoJSON(places), promoteId: 'id' });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': PLACE_COLOR.route,
          'line-width': 3,
          'line-opacity': ['case', ['==', ['get', 'kind'], 'air'], 0.45, 0.9],
          'line-dasharray': [2, 1.5],
        },
      });
      map.addLayer({
        id: 'route-stops',
        type: 'circle',
        source: 'route',
        filter: ['==', ['geometry-type'], 'Point'],
        paint: { 'circle-radius': 4, 'circle-color': PLACE_COLOR.route, 'circle-stroke-width': 2, 'circle-stroke-color': pal.halo },
      });
      map.addLayer({
        id: 'route-labels',
        type: 'symbol',
        source: 'route',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: { 'text-field': ['get', 'name'], 'text-size': 12, 'text-offset': [0.8, 0], 'text-anchor': 'left', 'text-font': ['Noto Sans Regular'] },
        paint: { 'text-color': PLACE_COLOR.route, 'text-halo-color': pal.halo, 'text-halo-width': 1.5 },
      });

      map.addLayer({
        id: 'places-dot',
        type: 'circle',
        source: 'places',
        paint: {
          // zoom must be the top-level input, so the selected bump lives inside each stop
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            ['case', ['boolean', ['feature-state', 'selected'], false], 8, 5],
            9,
            ['case', ['boolean', ['feature-state', 'selected'], false], 11, 8],
          ],
          'circle-color': ['get', 'color'],
          'circle-stroke-width': ['case', ['boolean', ['feature-state', 'selected'], false], 3, 1.5],
          'circle-stroke-color': ['case', ['boolean', ['feature-state', 'selected'], false], pal.ring, pal.halo],
        },
      });
      map.addLayer({
        id: 'places-label',
        type: 'symbol',
        source: 'places',
        minzoom: 6.3,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-offset': [0, 1.1],
          'text-anchor': 'top',
          'text-optional': true,
          'text-font': ['Noto Sans Regular'],
        },
        paint: { 'text-color': pal.label, 'text-halo-color': pal.halo, 'text-halo-width': 1.5 },
      });
      if (selected) {
        map.setFeatureState({ source: 'places', id: selected.id }, { selected: true });
        prevSel.current = selected.id;
      }
    };

    map.on('click', 'places-dot', (e) => {
      const id = e.features?.[0]?.properties?.id as string | undefined;
      if (id) latest.current.onSelect(id);
    });
    map.on('click', (e) => {
      if (!map.queryRenderedFeatures(e.point, { layers: ['places-dot'] }).length) latest.current.onSelect(null);
    });
    map.on('mouseenter', 'places-dot', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'places-dot', () => (map.getCanvas().style.cursor = ''));

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- data changes ---
  useEffect(() => {
    const src = mapRef.current?.getSource('places') as GeoJSONSource | undefined;
    src?.setData(placesGeoJSON(places));
  }, [places]);

  useEffect(() => {
    const map = mapRef.current;
    const src = map?.getSource('route') as GeoJSONSource | undefined;
    src?.setData(routeGeoJSON(showRoute));
    if (map && src) map.fitBounds(showRoute ? ROUTE_BOUNDS : HOME, { padding: 30, duration: 900 });
  }, [showRoute]);

  // --- selection: highlight + fly ---
  function showSelected() {
    const map = mapRef.current!;
    const { selected } = latest.current;
    if (prevSel.current) map.setFeatureState({ source: 'places', id: prevSel.current }, { selected: false });
    prevSel.current = selected?.id ?? null;
    if (!selected) return;
    map.setFeatureState({ source: 'places', id: selected.id }, { selected: true });
    // leave room for the detail card: right side on desktop, bottom sheet on phones
    const padding =
      window.innerWidth > 800 ? { right: 380, left: 0, top: 0, bottom: 0 } : { bottom: window.innerHeight * 0.3, top: 0, left: 0, right: 0 };
    map.flyTo({ center: [selected.lon, selected.lat], zoom: Math.max(map.getZoom(), 8), padding, duration: 900 });
  }
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.getSource('places')) return showSelected();
    // deep link that arrives before the style has loaded: run once our layers exist
    const retry = () => map.getSource('places') && showSelected();
    map.once('idle', retry);
    return () => void map.off('idle', retry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // --- theme: swap basemap, style.load rebuilds our layers ---
  const appliedTheme = useRef(theme);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedTheme.current === theme) return;
    appliedTheme.current = theme;
    map.setStyle(STYLE_URL[theme], { diff: false });
  }, [theme]);

  return <div ref={container} className="map" />;
}
