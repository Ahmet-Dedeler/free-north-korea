/**
 * Which places Camp Watch makes Sentinel-2 images of, and how big each image is on the ground.
 * Plain data with no imports: `scripts/sentinel/targets.ts` reads it under plain Node, the site reads it too.
 *
 * Sites are every place in `places.ts` with category camp, nuclear or missile. Camps are centred on the camp
 * dossier's own point (`public/layers/camps.geojson`, HRNK), because that is the pin readers see next to the image.
 */

/** Places categories that get satellite chips. */
export const SAT_CATEGORIES = ['camp', 'nuclear', 'missile'] as const;

/** Default chip width and height in metres. Sentinel-2 true colour is 10 m per pixel. */
export const CHIP_M_DEFAULT = 5120;
/** Political prison camps (kwanliso) cover tens to hundreds of km², so they get a wider view. */
export const CHIP_M_KWANLISO = 7680;

/** Per-place overrides (keyed by `places.ts` id), in metres. Must be a multiple of 40. */
export const CHIP_M_OVERRIDE: Record<string, number> = {
  // Launch pads, engine test stand and new assembly halls are spread over ~5 km.
  sohae: 7680,
  // Reactors, reprocessing plant and enrichment hall sit on both banks of the Kuryong river.
  yongbyon: 7680,
};

/** Longest side of the published JPEG in pixels. Wider chips are downsampled to this. */
export const OUT_PX = 512;
