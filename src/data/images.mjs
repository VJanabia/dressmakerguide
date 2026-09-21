// Image registry: the single source of truth for every picture on the site.
//
// Every image is an official Dressmaker screenshot or store asset, downloaded by
// scripts/fetch-images.py from Steam's own CDN and the official itch.io page, then re-encoded as
// local WebP at two widths. Nothing is hotlinked. The artwork belongs to the developers; see the
// disclaimer. Alt text was written from an actual read of the pixels (docs/shot-alt-text.json).
//
// Pages should not write alt text or file paths. Write ![anything](@SHOT_slot@ optional caption)
// and pass the body through resolveFigures(), which substitutes the approved alt, the path and the
// srcset. scripts/audit.mjs fails the build if a rendered alt disagrees with this file.

const WIDTH = 1100;
const HEIGHT = 619; // the true 16:9 ratio; a mismatched pair stretches the picture

const shot = (name, alt, caption) => ({
  name,
  src: '/assets/shots/' + name + '.webp',
  srcset: '/assets/shots/' + name + '-550.webp 550w, /assets/shots/' + name + '-1100.webp 1100w',
  width: WIDTH,
  height: HEIGHT,
  alt,
  caption,
});

export const SHOTS = {
  /* A customer at hand-in, reacting to the dress in her own words. */
  hero: shot('shot1',
    'A customer in the fitting room reading the dress she was handed in',
    'Hand-in is the moment the whole commission was for: the customer reacts in her own words.'),

  /* A finished gown on the mannequin with photo mode open. */
  finished: shot('shot2',
    'A purple floral gown with lace tiers displayed on a mannequin in photo mode',
    'A finished dress on the mannequin, with photo mode open to frame the shot.'),

  /* The sketchbook page with a customer brief and pattern choices. */
  sketch: shot('shot3',
    'The sketchbook open on a customer note with dress requirements and pattern choices',
    'The written brief is the brief. The sketchbook turns it into pattern pieces you can draft.'),

  /* The fabric shop with bolts, prices and commission limits. */
  fabric: shot('shot4',
    'Fabric shop shelves stacked with cloth bolts beside a list of fabrics and prices',
    'Bolt by bolt: prints, prices and the limits of the commission you are dressing for.'),

  /* Pattern pieces laid out on cloth, shears on top. */
  cut: shot('shot5',
    'Paper pattern pieces laid out on strawberry-print fabric with shears resting on the cloth',
    'Pattern pieces laid on the cloth decide what the dress will look like. Then the shears decide it permanently.'),

  /* The sewn dress waiting for decoration. */
  decorate: shot('shot6',
    'A finished strawberry-print dress on a mannequin beside a tray of accessories',
    'Sewing finished, decorating not: buttons, bows and lace can still be added before you hand it over.'),

  /* The sewing machine close up. */
  sew: shot('shot7',
    'Fabric being fed through a sewing machine with the stitch prompts shown on screen',
    'Panels go through the machine one seam at a time, with the controls on screen as you go.'),

  /* A finished dress with the completion options: hand in, keep working, or sell. */
  shop: shot('shot8',
    'A green off-the-shoulder dress on a mannequin with the commission completion options',
    'Hand the dress in, keep working on it, or sell it instead of delivering the commission.'),
};

/* Store art, for places where a wide screenshot would be wrong. */
export const ART = {
  capsule: {
    name: 'capsule',
    src: '/assets/shots/capsule.webp',
    srcset: '/assets/shots/capsule-550.webp 550w, /assets/shots/capsule-1100.webp 1100w',
    width: 616,
    height: 353,
    alt: 'Dressmaker store art: a dressmaker at work in her shop',
    caption: 'Dressmaker on Steam: cozy dressmaking, out now for Windows and macOS.',
  },
};

/* Legacy slot name kept so older page copy keeps working. */
SHOTS.itch = SHOTS.shop;

export const allShots = Object.values(SHOTS);

export function resolveShots(text) {
  return String(text).replace(/@SHOT_([a-z]+)@/g, (match, name) => (SHOTS[name] ? SHOTS[name].src : match));
}

/* Resolve a whole figure line: ![anything](@SHOT_slot@ optional caption).
   The alt is replaced with the approved alt for that picture, so a page cannot describe the wrong
   screenshot, and the srcset travels with it. */
export function resolveFigures(text) {
  return String(text).replace(
    /!\[[^\]]*\]\(@SHOT_([a-z]+)@([^)]*)\)/g,
    (match, name, rest) => {
      const image = SHOTS[name];
      if (!image) return match;
      const caption = String(rest).trim();
      return '![' + image.alt + '](' + image.src + (caption ? ' ' + caption : '') + ')';
    });
}

/* The approved alt text for each slot, for docs, tests and review. */
export const SHOT_ALTS = Object.fromEntries(
  Object.entries(SHOTS).map(([key, value]) => [key, value.alt]));
