import { resolveFigures } from '../data/images.mjs';
import { LINKS } from '../data/site.mjs';

const BODY = "> Short answer: the developers never published a control list, and several of the most useful inputs in Dressmaker are undiscoverable — the scroll wheel snapping pattern rotation to exact angles, unrolling fabric with the arrow keys, and cutting every pattern piece at once. This page collects the ones players found.\n\n## Camera and mannequin\n\n| Input | What it does |\n| --- | --- |\n| **Middle mouse button**, held | Rotate the camera around the mannequin |\n| **Middle mouse button**, pressed | Zoom in |\n| **Z** | Zoom in |\n| **Scroll wheel** | Rotate the mannequin |\n| **WASD** | Pan the view up and down |\n\nHolding the middle button to orbit is the one to learn first. Almost every awkward moment in decoration — a cuff you cannot see the back of, a trim line that vanishes around a shoulder — is solved by moving the camera rather than by changing the dress.\n\nIf the camera stops responding to rotation at some point, leaving the mannequin for the shop and coming back restores it. It is a known quirk rather than something you did wrong.\n\n![Paper pattern pieces laid out on strawberry-print fabric with shears resting on the cloth](@SHOT_cut@ Pattern work is where the scroll wheel earns its keep.)\n\n## Pattern rotation snaps to exact angles\n\nThis is the highest-value input in the game and almost nobody finds it by accident.\n\nScrolling while holding a pattern rotates it — and it **snaps to nine-degree increments**. That means 0, 45 and 90 degrees are all reachable exactly, no matter how far off the pattern had drifted. Since cutting on the grain is one of the two things that drive the quality multiplier on a finished dress, being able to return a piece to a true 90 degrees with a single scroll is worth more than it sounds.\n\nThe arrow keys and **A** and **D** unroll more or less fabric when you are laying out, which is how you avoid trimming a bolt you did not need to cut.\n\nTwo more pattern-stage habits from the same source:\n\n- **Hover a pattern piece** for a moment and the game shows you where it belongs on the mannequin. Useful when a dress has more panels than you are holding in your head.\n- **Direction matters.** Cutting a piece the wrong way up is easy to do and hard to notice, and it shows on the finished dress.\n\n## Cutting every piece at once\n\nOnce your layout is set, you can click the scissors on each piece in turn and let them all cut simultaneously — you do not have to wait for one piece to finish before starting the next.\n\nThen, to clear the cut pieces, you do not need to click them individually either. **Hold the right mouse button and drag** across them and they go into the bin together.\n\nCutting patterns can also be recycled. If you cut a piece in a fabric you have changed your mind about, or you made a mistake, drag it out of the side menu and a prompt appears.\n\n![Fabric being fed through a sewing machine with the stitch prompts shown on screen](@SHOT_sew@ The machine is the other place the scroll wheel does something you would not guess.)\n\n## Sewing: the scroll wheel and sewing assist\n\nSewing is the stage people bounce off, and there are two settings and one input that change it completely.\n\n**Sewing assist**, in Settings, moves the fabric for you. With it on, the technique is to go slowly and stop around corners — or, as one player describes it, \"tap, tap, tap\".\n\n**The scroll wheel sews a manual amount.** This is the input that makes corners manageable: scroll a little, adjust, scroll again, rather than holding a direction and hoping. Experienced players use it at every corner and for tight turns, with or without sewing assist.\n\nThe **Accessory Rotation Gizmo**, also in Settings, gives you full X, Y and Z rotation for accessories instead of surface-only placement — the setting to turn on before you attempt anything detailed.\n\nOne reassurance worth having: bad sewing lowers your quality percentage, but **sewing better later raises it again**. A sloppy seam early in a dress is not a write-off.\n\n## Finding things in the menus\n\nA few habits that save real time once your inventory grows:\n\n- **Filter.** You can filter by design type and by fabric. Players who skip this end up scrolling the whole emporium for one bolt.\n- **Tap a fabric in your inventory** and it pulls that fabric up directly, instead of searching for it again.\n- **Bought fabric you do not need?** Make a quick dress and sell it off the rack to get the coin back — see the [Dressmaker money guide](/money).\n- **Starred items** appear at the top of the list while you are cutting patterns or decorating, so adding a fabric to the design page is also a way of pinning it.\n\n## Photo mode and the small touches\n\nPhoto mode lets you change the mannequin colour, the background and the lighting, which is how you get a clean screenshot of a finished dress. In sewing mode, clicking the spool changes the thread colour.\n\nThere is also a debug combination — **Ctrl + Shift + C** — which, from what players have seen, allows importing and exporting designs. It is not a documented feature and we are reporting it as an observed one.\n\n![A purple floral gown with lace tiers displayed on a mannequin in photo mode](@SHOT_finished@ Photo mode is where a finished dress stops being a garment and becomes a picture.)\n\n## Frequently asked questions\n\n### How do you rotate a pattern exactly 90 degrees?\n\nHold the pattern and scroll. Rotation snaps to nine-degree increments, so a single scroll brings a drifted piece back to 0, 45 or 90 degrees exactly. This is the fastest way to hit the grain, which feeds the quality multiplier on the finished dress.\n\n### How do you cut all the pattern pieces at once?\n\nClick the scissors on each piece; they cut simultaneously rather than one after another. To clear them, hold the right mouse button and drag across the cut pieces to send them to the bin.\n\n### Can you change the controls in Dressmaker?\n\nThe developers have published no key-rebinding option. What is documented on the store page is a **Mouse Only Option** category, alongside Custom Volume Controls and Playable without Timed Input, so a mouse-only playstyle is an intended one rather than something you have to fight.\n\n### Does bad sewing ruin a dress?\n\nNo. Bad sewing lowers the quality percentage, but sewing better afterwards raises it again, so an early mistake can be recovered within the same dress.\n\n## Where to go next\n\nThese inputs mostly serve two stages: laying out patterns and decorating. The [Dressmaker sewing tips](/sewing-tips) page covers the grain and seam decisions they feed, [decorations and trim](/decorations) covers the pin work, and [how to play Dressmaker](/how-to-play) puts the whole loop in order."
  .split('\n').map((line) => resolveFigures(line)).join('\n');

// Same answers as the FAQ section in the body, in the shape the FAQPage schema wants.
const FAQ = [
  [
    "How do you rotate a pattern exactly 90 degrees?",
    "Hold the pattern and scroll. Rotation snaps to nine-degree increments, so a single scroll brings a drifted piece back to 0, 45 or 90 degrees exactly. That is the fastest way to hit the grain, which feeds the quality multiplier on a finished dress."
  ],
  [
    "How do you cut all the pattern pieces at once?",
    "Click the scissors on each piece and they cut simultaneously rather than one after another. To clear them, hold the right mouse button and drag across the cut pieces to send them all to the bin."
  ],
  [
    "Can you change the controls in Dressmaker?",
    "The developers have published no key-rebinding option. What the Steam page does list is a Mouse Only Option category, alongside Custom Volume Controls and Playable without Timed Input, so a mouse-only playstyle is an intended one rather than something you have to fight."
  ],
  [
    "Does bad sewing ruin a dress?",
    "No. Bad sewing lowers the quality percentage, but sewing better afterwards raises it again, so an early mistake can be recovered within the same dress."
  ]
];

export const page = {
  url: '/controls',
  title: 'Dressmaker Controls and Shortcuts: Rotate and Zoom',
  description: 'Dressmaker controls worth knowing: scroll to snap pattern rotation to exact angles, unroll fabric, cut every piece at once, and sew corners by wheel.',
  h1: 'Dressmaker Controls and Shortcuts',
  eyebrow: 'Controls reference',
  lede: 'Dressmaker ships with no published control list, and several of the most useful inputs in the game are effectively hidden. This is what players have found, including the one that snaps pattern rotation to an exact angle.',
  facts: [
    ['Orbit the camera', 'Hold the middle mouse button'],
    ['Zoom', 'The Z key, or middle-click'],
    ['Rotate the mannequin', 'Scroll wheel'],
    ['Snap a pattern to 90 degrees', 'Scroll while holding the piece'],
    ['Unroll more fabric', 'A and D, or the arrow keys'],
    ['Clear cut pieces', 'Hold right mouse button and drag'],
  ],
  updated: '2026-09-26',
  updatedHuman: 'September 26, 2026',
  ogType: 'article',
  crumbs: [{ name: 'Home', url: '/' }, { name: 'Controls', url: '/controls' }],
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
    ["Thing's I've Learned, by Seerolz (Steam guide, including tips added by players in its comments)", LINKS.steamGuideTips],
    ['Tips for Working with Trim, by SilverLyrics (Steam guide)', LINKS.steamGuideTrim],
    ['Dressmaker on Steam (Mouse Only Option and accessibility categories)', LINKS.steam],
  ],
  body: BODY,
};
