# Adding images to a page

The site has 8 official screenshots plus store art, all local WebP at two widths, all with verified
alt text. Most pages currently show only one or two. Your job: place them where they genuinely help,
without padding.

## How to add an image

One line, anywhere in the body, on its own line surrounded by blank lines:

```
![ignored](@SHOT_slot@ Caption text shown under the picture)
```

**Write anything in the alt slot — it is replaced by the registry's approved alt at build time.** You
must still write the caption, because that is what a reader sees. Keep captions under 120 characters
and useful: say what the reader is looking at and why it matters, never "screenshot of the game".

## The eight slots and what each one actually shows

| Slot | What is in the picture | Best placed next to |
| --- | --- | --- |
| `@SHOT_hero@` | A customer in the fitting room reading the dress she was handed | hand-in, customer reaction, rewards |
| `@SHOT_finished@` | A purple floral gown with lace tiers on a mannequin, photo mode open | finished results, photo mode, the payoff of a commission |
| `@SHOT_sketch@` | The sketchbook open on a customer note with requirements and pattern choices | reading a brief, designing, attribute targets |
| `@SHOT_fabric@` | Fabric shop shelves with cloth bolts beside a list of fabrics and prices | buying fabric, choosing cloth, prices |
| `@SHOT_cut@` | Paper pattern pieces laid out on strawberry-print fabric, shears on the cloth | pattern layout, cutting, grain and bias |
| `@SHOT_decorate@` | The sewn strawberry-print dress on a mannequin beside an accessory tray | decoration, accessories, after sewing finishes |
| `@SHOT_sew@` | Fabric being fed through the sewing machine, stitch prompts on screen | the sewing stage, the machine, controls |
| `@SHOT_shop@` | A green off-the-shoulder dress with the completion options (hand in / keep / sell) | off-rack selling, finishing, the end of a commission |

## Rules

1. **Placement must match the section.** A picture of the sewing machine in a section about buying
   fabric is worse than no picture. Use the table above.
2. **Three to five figures per page**, spread through the page. Never two in a row.
3. **One line of caption each.** No paragraph captions.
4. **Do not add images to the FAQ, the sources block, or a table.** They belong next to prose,
   steps or cards.
5. **Do not remove existing figures** — reposition them if a better neighbour exists.
6. **Do not change anything else.** Same file, same exported fields, same text.

## Verify

```bash
cd D:\DSH\dressmakerguide
node -e "import('./src/pages/YOURFILE.mjs').then(m=>console.log('OK'))"
npm test
npm run build
npm run audit
```

The audit checks that every rendered alt matches the registry, so a mismatch fails the build.
Report: file, figures before, figures after, and where you placed each one.
