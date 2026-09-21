// Image registry. Every picture is an official screenshot of Dressmaker, downloaded from Steam's
// store CDN by scripts/fetch-images.py, downscaled and re-encoded as local WebP. The artwork belongs
// to the developers; see the disclaimer. Nothing is hotlinked.
//
// Each entry carries the alt text used wherever the image appears, so the copy in a page module and
// the registry cannot drift apart (scripts/audit.mjs enforces that).
const shot = (n, alt, caption) => ({
  src: '/assets/shots/shot' + n + '.webp',
  width: 1100,
  height: 619,
  alt,
  caption,
});

export const SHOTS = {
  // Slot -> one of the eight official screenshots.

  // A customer at hand-in, reacting to the dress in her own words.
  hero: shot(1,
    'A customer in the fitting room reading the dress she was handed in',
    'Hand-in is the moment the whole commission was for: the customer reacts in her own words.'),

  // A finished gown on the mannequin with photo mode open.
  finished: shot(2,
    'A purple floral gown with lace tiers displayed on a mannequin in photo mode',
    'A finished dress on the mannequin, with photo mode open to frame the shot.'),

  // The sketchbook page with a customer brief and pattern choices.
  sketch: shot(3,
    'The sketchbook open on a customer note with dress requirements and pattern choices',
    'The written brief is the brief. The sketchbook turns it into pattern pieces you can draft.'),

  // The fabric shop with bolts, prices and commission limits.
  fabric: shot(4,
    'Fabric shop shelves stacked with cloth bolts beside a list of fabrics and prices',
    'Bolt by bolt: prints, prices and the limits of the commission you are dressing for.'),

  // Pattern pieces laid out on cloth, shears on top.
  cut: shot(5,
    'Paper pattern pieces laid out on strawberry-print fabric with shears resting on the cloth',
    'Pattern pieces laid on the cloth decide what the dress will look like. Then the shears decide it permanently.'),

  // The sewn dress waiting for decoration.
  decorate: shot(6,
    'A finished strawberry-print dress on a mannequin beside a tray of accessories',
    'Sewing finished, decorating not: buttons, bows and lace can still be added before you hand it over.'),

  // The sewing machine close up.
  sew: shot(7,
    'Fabric being fed through a sewing machine with the stitch prompts shown on screen',
    'Panels go through the machine one seam at a time, with the controls on screen as you go.'),

  // A finished dress with the completion options: hand in, keep working, or sell.
  shop: shot(8,
    'A green off-the-shoulder dress on a mannequin with the commission completion options',
    'Hand the dress in, keep working on it, or sell it instead of delivering the commission.'),

};

/* Legacy slot name kept so older page copy keeps working. It resolves to the dress-completion
   screenshot, which is the most representative "a dress is finished" image in the gallery. */
SHOTS.itch = SHOTS.shop;

// Handy lookup for pages that want "any screenshot of X".
export const allShots = Object.values(SHOTS);

/* Resolve every @SHOT_name@ token in a page body against this registry. Pages should call
   resolveShots(BODY) once instead of hand-writing a replaceAll per image, which is how the
   alt text drifted out of sync the first time round. Unknown tokens are left in place so the
   audit's unresolved-token check still fires. */
export function resolveShots(text) {
  return String(text).replace(/@SHOT_([a-z]+)@/g, (match, name) => (SHOTS[name] ? SHOTS[name].src : match));
}
