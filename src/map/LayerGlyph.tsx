import type { LayerId } from './config';

/**
 * The site's own marks for the map layers, drawn for this map instead of a stock icon set: solid shapes on one
 * 24px grid, like the glyphs in Google Maps' place pins. They sit white inside the layer's colour disc in the
 * sidebar chips (Explorer.tsx) and take `currentColor`, so an off chip greys them with no extra CSS.
 *
 * camps: a guard tower · detention: a cell door with bars · china-detention: a U-turn arrow (held in China, then sent back)
 * missile-bases: a missile · sites: the radiation trefoil (nuclear and missile sites) · markets: a stall's awning
 * ports: an anchor · escape-route: a dashed path with an arrow head
 */
const GLYPHS: Record<LayerId, React.ReactNode> = {
  camps: (
    <>
      <path d="M5.5 8 12 3l6.5 5z" fill="currentColor" />
      <rect x="7" y="9" width="10" height="4.5" rx="1" fill="currentColor" />
      <path d="M9 13.5 7 21M15 13.5l2 7.5M9.4 17.5h5.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" fill="none" />
    </>
  ),
  detention: (
    <path
      fillRule="evenodd"
      fill="currentColor"
      d="M7 3.5h10A2.5 2.5 0 0 1 19.5 6v12a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 18V6A2.5 2.5 0 0 1 7 3.5zM7.9 6.8v10.4h1.7V6.8zm3.25 0v10.4h1.7V6.8zm3.25 0v10.4h1.7V6.8z"
    />
  ),
  'china-detention': (
    <>
      <path d="M17.5 21V10a5.5 5.5 0 0 0-11 0v3" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
      <path d="M2 12.5h9L6.5 19.5z" fill="currentColor" />
    </>
  ),
  'missile-bases': (
    <>
      <path d="M12 2c2.7 2.5 3.7 5.8 3.7 9.5V16H8.3v-4.5C8.3 7.8 9.3 4.5 12 2z" fill="currentColor" />
      <path d="M8.3 12.8 5 16.3V19.5l3.3-1.7zm7.4 0 3.3 3.5V19.5l-3.3-1.7zM10.4 17.4h3.2L12 22z" fill="currentColor" />
    </>
  ),
  sites: (
    <>
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <path
        fill="currentColor"
        d="M13.55 14.68 16.5 19.79A9 9 0 0 1 7.5 19.79l2.95-5.11a3.1 3.1 0 0 0 3.1 0zM8.9 12H3a9 9 0 0 1 4.5-7.79l2.95 5.11A3.1 3.1 0 0 0 8.9 12zm4.65-2.68 2.95-5.11A9 9 0 0 1 21 12h-5.9a3.1 3.1 0 0 0-1.55-2.68z"
      />
    </>
  ),
  markets: (
    <>
      <path d="M3.5 9.5 5.3 4h13.4l1.8 5.5z" fill="currentColor" />
      <path d="M5.5 11.2V20h13v-8.8" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <rect x="10" y="14" width="4" height="6" fill="currentColor" />
    </>
  ),
  ports: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="5.2" r="2.2" />
      <path d="M12 7.4V20.5M8 11h8M4.8 14c.5 3.8 3.5 6.5 7.2 6.5s6.7-2.7 7.2-6.5" />
    </g>
  ),
  'escape-route': (
    <>
      <path d="M4.5 19.5c1-5.2 4.2-7.6 9.3-8.3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2.6 3.2" />
      <path d="M12.6 6.2 20.5 9.4l-5.7 5.8z" fill="currentColor" />
    </>
  ),
};

export default function LayerGlyph({ id, size = 14 }: { id: LayerId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {GLYPHS[id]}
    </svg>
  );
}
