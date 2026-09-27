import { resolveFigures } from '../data/images.mjs';
import { LINKS } from '../data/site.mjs';

const BODY = "> Short answer: decoration in Dressmaker is **pin work**. You place trim in short runs, pin each run as you go, and the game sews it on when the dress is finished. Nothing about the decoration system is documented by the developers — what follows is community-tested handling, credited at the foot of the page.\n\n## Quick reference\n\n| Action | How | Why it matters |\n| --- | --- | --- |\n| Rotate the camera around the mannequin | Hold the **middle mouse button** | The only way to see the back and sides of a cuff |\n| Zoom in | The **Z** key, or press the middle mouse button | Detail work is invisible at default zoom |\n| Duplicate the accessory in hand | Hold **Shift** while placing | Twenty buttons without twenty trips to the tray |\n| Remove a whole run of lace or trim | Click it once, then the **X** in the box at the top | Cheaper than unpicking pin by pin |\n| Full three-axis rotation | Turn on **Accessory Rotation Gizmo** in Settings | Advanced placement — X, Y and Z, not just the surface |\n| Pan and turn the mannequin | **WASD** to pan, **scroll wheel** to rotate | Framing while you work |\n\n## How trim actually attaches\n\nThe thing that surprises people is that you never sew the trim. You place it, you pin it, and it goes on by itself at the end of the commission. Once the dress is finished, the pins stop being part of the design and the trim simply sits where you pinned it.\n\nThat has one useful consequence: **pins are a preview, not a commitment**. Clicking back to the fabric tab shows how the dress reads without them, which is the closest thing the game has to stepping back and looking at your work.\n\n![A finished strawberry-print dress on a mannequin beside a tray of accessories](@SHOT_decorate@ Sewing finished, decorating not: the tray is still open and every pin still moveable.)\n\n## Pin in short runs, not long ones\n\nThis is the single habit that decides whether your lace follows the dress or fights it.\n\nDragging a long length of trim across a whole hem in one go is where it goes wrong: the game struggles over every fold and curve it meets, and the run ends up straight where the cloth is not. The fix is to work in short lengths — a few centimetres at a time — and drop a pin at the end of each one. You do not have to re-click to continue; the game carries on from the pin you just placed.\n\nMore pins means the trim can bend around the cloth instead of cutting across it. Players who have spent time with it are consistent on this: **the more pins, the better the run sits.**\n\n> Tip: if a run is misbehaving, go back to the last point where it looked right, pin there, and carry on from that pin. There was probably a fold or a curve the trim could not resolve on its own.\n\n## Working around a cuff\n\nCuffs are where most people give up, because you cannot see what you are doing.\n\nThe approach that works is to treat a cuff as a whole dress at a smaller scale: zoom right in, then rotate the camera around the cuff as you place each pin, so you see the back and the sides in turn. It is the same motion as trimming a hem, just tighter and slower.\n\nIf the sleeves are in your way while you work on something else, **take them off**. You are not required to keep every part of the dress attached while you decorate it — the parts can go back on afterwards.\n\n![The sewing machine close up](@SHOT_sew@ The same fabric, later: decoration happens on the finished dress, after the seams are done.)\n\n## When trim goes wonky\n\nThere are three failure modes worth knowing, and they have different fixes.\n\n| What you see | What is happening | What to do |\n| --- | --- | --- |\n| Trim is upside down | The run was drawn in the opposite direction | Drag it the other way — right instead of left — and it reverses |\n| Trim clips through the cloth | The run is sitting slightly too proud of the surface | Use the adjustment buttons to tilt it a little |\n| Trim is floating above the dress | The raise and lower control is not responding | See the honest note below — this one is widely reported and unresolved |\n\nThe upside-down problem catches people out because there is nothing on screen that says \"this side up\". If a run looks wrong in a way you cannot name, check its direction first.\n\n## Adjusting a run after the fact\n\nNothing about decoration is locked in until you hand the dress over.\n\nHover the pins at the ends or the middle of a run and the game highlights in yellow the length you have selected. Highlight what you want, click, and start working on it again. Pins you have already placed can be moved.\n\nTo delete an entire run rather than reworking it, click the trim once and press the **X** that appears in the box at the top. That is a whole-run delete, not a single pin.\n\n## An honest note on raising and lowering trim\n\nThe trim guide this page draws on says the author could not raise or lower trim — that is, push it deeper into the dress or lift it clear of the surface. Players in the comments report the same thing, several of them asking whether it is a bug. One commenter suggests that holding the raise/lower control moves it further than clicking, and that fully raising a run and lowering it again can tidy up a wobbly line.\n\nWe are reporting this as **unresolved**. The developers have not said whether the control is intended to work differently, and we have not tested it ourselves. Treat it as a known rough edge rather than a technique.\n\n## Decoration is not a scoring system\n\nIt is worth saying plainly: the developers have published no decoration values, no list of what each trim is worth, and no rule about which decoration suits which customer. The store page promises you can \"add lace trims and other accessories wherever you like with complete creative freedom\" — that is the whole documented system.\n\nWhere decoration meets the commission is the brief. Some briefs name attribute targets that trims feed into, and some carry hard rules such as a colour restriction. Read those first; the rest is taste.\n\n## Frequently asked questions\n\n### Does trim have to be sewn on?\n\nNo. Trim is attached automatically when you finish the dress. There is no separate sewing step for it.\n\n### Can I move a pin after placing it?\n\nYes. Pins you have already placed can be moved, and hovering the pins at either end of a run — or in its middle — highlights the length you have selected so you can rework just that part.\n\n### Why is my trim floating above the dress?\n\nMany players report that trim sits proud of the surface and that the raise and lower control does not correct it. It is widely described as a bug. We have no official statement either way and are not going to guess.\n\n### How many decorations are in the game?\n\nThe developers have published totals for dress pieces, fabrics and accessories — over 150 dress pieces, over 450 fabrics and over 350 accessories — but no breakdown of which of those are decorations, and no decoration list. We do not have one to give you.\n\n## Where to go next\n\nDecoration is the last stage of the loop. If you are earlier in it, start with [how to play Dressmaker](/how-to-play), then the [Dressmaker sewing tips](/sewing-tips) for grain and seam order, and the [Dressmaker wiki](/wiki) for the fabric and pattern reference tables. The money side of a finished dress is on the [Dressmaker money guide](/money)."
  .split('\n').map((line) => resolveFigures(line)).join('\n');

// Same answers as the FAQ section in the body, in the shape the FAQPage schema wants.
const FAQ = [
  [
    "Does trim have to be sewn on?",
    "No. Trim is attached automatically when the dress is finished, so there is no separate sewing step for it. You place it, you pin it, and it goes on at the end of the commission."
  ],
  [
    "Can I move a pin after placing it?",
    "Yes. Pins you have already placed can be moved. Hovering the pins at either end of a run, or in its middle, highlights the length you have selected so you can rework just that part of the decoration."
  ],
  [
    "Why is my trim floating above the dress?",
    "Many players report that trim sits proud of the surface and that the raise and lower control does not correct it, and it is widely described as a bug. We have no official statement either way and are not going to guess."
  ],
  [
    "How many decorations are in the game?",
    "The developers have published totals for dress pieces, fabrics and accessories - over 150 dress pieces, over 450 fabrics and over 350 accessories - but no breakdown of which of those count as decorations, and no decoration list."
  ]
];

export const page = {
  url: '/decorations',
  title: 'Dressmaker Decorations: Trim, Lace and Accessories',
  description: 'How decorating works in Dressmaker: pin trim in short runs so it follows curves, fix wonky or upside-down lace, and rotate accessories in three axes.',
  h1: 'Dressmaker Decorations and Trim',
  eyebrow: 'Decoration guide',
  lede: 'The developers have published no decoration system, no trim values and no rules about what suits which customer. What exists is handling knowledge, worked out by players, and a set of habits that decide whether lace follows the cloth or floats above it.',
  facts: [
    ['Trim attaches', 'Automatically, when the dress is finished'],
    ['Placement tool', 'Pins, dropped in short runs'],
    ['Adjust a run', 'Hover its pins, then click to rework'],
    ['Remove a run', 'Click it, then the X box at the top'],
    ['Duplicate fast', 'Hold Shift while placing'],
    ['Three-axis rotation', 'Accessory Rotation Gizmo, in Settings'],
  ],
  updated: '2026-09-26',
  updatedHuman: 'September 26, 2026',
  ogType: 'article',
  crumbs: [{ name: 'Home', url: '/' }, { name: 'Decorations', url: '/decorations' }],
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
  sources: [
    ['Tips for Working with Trim, by SilverLyrics (Steam guide)', LINKS.steamGuideTrim],
    ["Thing's I've Learned, by Seerolz (Steam guide)", LINKS.steamGuideTips],
    ['Dressmaker on Steam (decoration wording)', LINKS.steam],
  ],
  body: BODY,
};
