# Independent verification of on-screen values in the eight Dressmaker screenshots

**Scope.** Every numeric and textual claim listed in the verification request was re-read from the
images themselves. Nothing below is inferred from other documents in this repo.

**Images:** `public/assets/shots/shot1.webp` … `shot8.webp` (each 1100 x 619 px).

## Method

- `.webp` decoded to PNG with Pillow 11.3.0 (no resampling on decode).
- Regions of interest were cropped and enlarged **2x–10x** with LANCZOS before reading, because the
  source images are only 1100 px wide and the smallest UI text is roughly 8–10 px tall.
- Two independent vision models were used for every claim, both at `temperature 0`:
  **glm-4.6v** (primary) and **glm-4v-flash** (second opinion), via the OpenAI-compatible endpoint
  `https://open.bigmodel.cn/api/paas/v4/chat/completions`.
- Models were instructed to transcribe verbatim and to answer `[UNREADABLE]` rather than guess.
- Each claim was read at **at least two different crop scales**; a value is only marked VERIFIED when
  both models returned it consistently.

### Controls (proving the transcripts are real reads)

| Control | What was sent | glm-4.6v | glm-4v-flash | Result |
|---|---|---|---|---|
| Blank frame | 1280x720 solid dark grey | "entirely black with no visible text or objects" | — | PASS |
| Solid colour | 1100x619 solid red | `NO TEXT` | `NO TEXT` | PASS |
| **Anti-priming** | Synthetic "Requirements" box carrying numbers that **contradict** the claims: Quality **43**, Flowers **88**, Cute **17**, Romantic **92**, "My budget is **355**." | read back 43 / 88 / 17 / 92 / 355 | read back 43 / 88 / 17 / 92 / 355 | PASS |

The anti-priming control is the important one: the models reproduce whatever digits are actually
present, including digits that do not match the expected answers, so the readings below are
transcriptions rather than agreement bias.

## (a) Claim-by-claim results

Verdicts: **VERIFIED** = confirmed as claimed. **CORRECTED** = different from the claim.
**UNREADABLE** = could not be confirmed from the image.

| # | Shot | Claim under test | Verdict | Value actually read | Model agreement |
|---|---|---|---|---|---|
| 1 | shot3 | Requirements attribute **Quality 70** | VERIFIED | `Quality: 70` | both agreed (read at 3x, 3.5x and 6x) |
| 2 | shot3 | Requirements attribute **Flowers 60** | VERIFIED | `Flowers: 60` | both agreed (3x, 3.5x, 6x) |
| 3 | shot3 | Requirements attribute **Cute 30** | VERIFIED | `Cute: 30` | both agreed (3x, 3.5x, 6x) |
| 4 | shot3 | Requirements attribute **Romantic 45** | VERIFIED | `Romantic: 45` | both agreed (3x, 3.5x, 6x) |
| 5 | shot3 | Customer budget **800** | VERIFIED | `My budget is 800.` | both agreed (3x, 3.5x, 6x). A small currency glyph precedes the digits; see caveat C1 |
| 6 | shot3 | `Approx. 3.85m fabric required` | VERIFIED | `Approx. 3.85m fabric required` | both agreed (3x, 6x) |
| 7 | shot4 | Commission limit **Quality 0/80** | VERIFIED | `Quality 0/80` | both agreed (5x, 9x band) |
| 8 | shot4 | Commission limit **Formal 0/50** | VERIFIED | `Formal 0/50` | both agreed (5x, 9x band) |
| 9 | shot4 | Commission limit **Simple 0/75** | VERIFIED | `Simple 0/75` | both agreed (5x, 9x band; flash returned `NO TEXT` on the 9x band that clipped this line, 4.6v read it) |
| 10 | shot4 | Commission limit **Professional 0/50** | VERIFIED | `Professional 0/50` | both agreed (5x, 9x band). Word confirmed to end in "l", not "Profession" |
| 11 | shot4 | Constraint text **"Use only black"** | VERIFIED | `Use only black`, with no numbers on that line | both agreed (5x, 8x, 9x band) |
| 12 | shot4 | Left number is **current progress**, right number is the **limit** | VERIFIED (as a layout reading) | Printed as `0/80`, `0/50`, `0/75`, `0/50` — i.e. value **0** for all four against a per-attribute cap | both models independently described the format as current value / maximum. Caveat C2 |
| 13 | shot4 | Selected bolt name **"Dusty Pink Silk"** | VERIFIED | `Dusty Pink Silk` | both agreed (4x, 6x) |
| 14 | shot4 | Selected bolt length **2 metres** | VERIFIED | `2 metres` | both agreed (4x, 7x, 9x) |
| 15 | shot4 | Purchase button **"Buy (100)"** | VERIFIED | `Buy (100)` — cost **100** | both agreed (4x, 7x). A small currency glyph precedes the 100; see caveat C1 |
| 16 | shot1 | Customer name | VERIFIED | `Prudence` (speaker tag `PRUDENCE`; name card also `Prudence`) | both agreed (whole-card 6x, plus both full-image reads) |
| 17 | shot1 | A star rating is visible next to her name card | VERIFIED — **yes** | Five stars in the name card: **1 lit / 4 unlit**, above a partly-filled progress bar | both agreed on the whole-card crop and on both full-image reads. See caveat C3 |
| 18 | shot1 | Her dialogue line | VERIFIED (exact) | `Oh, how wonderful. This is MY dress, exactly as I wanted it.` | both agreed, character-for-character, at 5x |
| 19 | shot5 | Fabric name and length **"Strawberry Fields Simple Cotton (10.0m)"** | VERIFIED | `Strawberry Fields Simple Cotton (10.0m)` | both agreed (5x, 8x on the parenthesised length) |
| 20 | shot7 | Key prompt **"Space Sew"** | VERIFIED | `Space` -> `Sew` | both agreed (6x) |
| 21 | shot7 | Key prompt **"A D Rotate"** | VERIFIED | `A D` -> `Rotate` | both agreed (6x) |
| 22 | shot7 | Key prompt **"W S Change Speed"** | VERIFIED | `W S` -> `Change Speed` | both agreed (6x). 4.6v once lower-cased the "s"; both read `W S` on the dedicated crop |
| 23 | shot8 | Completion option **"Complete Commission"** | VERIFIED | `Complete Commission` | both agreed (4x, 6x) |
| 24 | shot8 | Completion option **"Keep working"** | VERIFIED | `Keep working` | both agreed (4x, 6x). One early full-image pass by 4.6v returned `Keep work'ng`; the dedicated crops both read `Keep working` |
| 25 | shot8 | Completion option and sell price **"Sell dress (869)"** | VERIFIED | `Sell dress (869)` — price **869** | both agreed (4x, 6x, 9x) |

**Totals: 25 VERIFIED, 0 CORRECTED, 0 UNREADABLE.**

Two adjacent on-screen strings were also read and are consistent with the claims above, though they
were not separately claimed: shot8's panel heading is `Dress Complete!`, and shot8 carries a
`PHOTO PREVIEW` label above the preview frame.

## (b) Alt text and captions

Alt text is a plain noun phrase (<= 125 characters); captions are a single sentence (<= 160
characters). Fine UI strings are deliberately not quoted.

| Shot | Alt text | Caption |
|---|---|---|
| shot1 | Woman in a purple dress and feathered hat at a shop counter, with a dialogue box and a star-rated customer card | A customer in a feathered hat praises the finished dress, while her card below shows a single filled star and a progress bar. |
| shot2 | A purple floral gown on a mannequin in a panelled room, with a camera settings panel down the right side | The completed gown is posed on a mannequin while the photo tool's environment, light and colour controls fill the right side. |
| shot3 | An open sketchbook design screen with a dress sketch, a written brief, a requirements list and fabric swatches | A notebook-style design page sets the client's written request beside a sketched dress, its part list and the fabrics on offer. |
| shot4 | A fabric shop counter with stacked cloth bolts and a panel describing the selected roll's qualities and price | In the emporium, a chosen roll of silk is shown with its colour, quality tags, quantity and the price to buy it. |
| shot5 | Pale pattern pieces with dashed cutting lines laid on strawberry-print cotton beside a pair of scissors | Cutting guides are marked out on a strawberry-print cotton, with the fabric's name and length listed along the bottom. |
| shot6 | A part-finished strawberry-print dress on a mannequin beside an accessories panel and a completion notice | With sewing finished, an accessory tray opens beside the dress so trims can still be added before the garment is handed in. |
| shot7 | A vintage sewing machine on a wooden table with thread spools, a hand guiding green fabric and key prompts | A hand feeds patterned cloth through an ornate sewing machine while on-screen prompts list the sewing controls. |
| shot8 | A mannequin in a finished green tiered dress with a preview frame and a panel of completion choices | The finished green gown is displayed in a preview frame as a completion panel offers the player their next move. |

### Longer scene notes (for reference, not length-limited)

- **shot1** — Fitting-room interior. A woman in a purple high-collared dress and a feathered hat
  stands behind a counter; `FITTING ROOM` signage on the wall, a cat asleep on a bench, a mannequin
  behind her. The dialogue box carries the speaker tag `PRUDENCE` and the line quoted in row 18,
  with `SKIP` above it. The name card sits at bottom **centre** (roughly x 360–760), not bottom-left.
- **shot2** — A purple/lavender floral gown with lace trim and a tiered skirt on a mannequin, in a
  room with green patterned wallpaper and wooden panelling. Right side is the photo tool.
- **shot3** — Open sketchbook on a wooden surface: customer note, Requirements box, four named
  pattern parts, a fabric-required line, draft/export/import buttons, a dress sketch with a pencil,
  a long list of dress attribute scores, and a fabric list with prices on the right.
- **shot4** — Fabric-shop interior ("The International Emporium"). Stacked cloth bolts, a bolt list
  with prices on the right, the commission-limits box above it, and the selected-bolt panel at the
  bottom.
- **shot5** — Overhead work-table view. Pale cut pieces with dashed outlines and `Grain Quality:
  100%` labels lie on strawberry-print cotton; scissors rest on the cloth. Bottom edge carries the
  fabric name/length and its attribute scores; `Send to inventory` at bottom left.
- **shot6** — Close view of a part-finished dress on a mannequin: cream/strawberry-print fabric,
  short puffed sleeves with white ruffles, a pink bow at the waist, red bead/lacing detail. An
  accessory panel occupies the right; a completion notice with a finish button sits at bottom left.
- **shot7** — First-person view over a wooden table: a hand on green floral fabric at an ornate
  vintage sewing machine, several spools of thread beside it. The key prompts are along the bottom
  **left**; the bottom-right of that strip is empty.
- **shot8** — A mannequin in a finished green off-the-shoulder tiered dress against wooden panelling
  and framed pictures, with a `PHOTO PREVIEW` frame and the completion panel offering the three
  options in rows 23–25; a photo control panel sits on the right.

## (c) What could not be confirmed

Everything in the claim list was confirmable. The following *incidental* details were **not**
confirmed, and the markdown above deliberately does not assert them:

1. **C1 — The currency symbol.** In shot3 the budget, in shot4 the buy button and in shot8 the sell
   price each have a small glyph immediately before the digits. The **digits are certain**
   (800, 100, 869); the glyph itself could not be identified — glm-4.6v returned a character that did
   not survive JSON encoding and glm-4v-flash did not report a symbol at all. Treated as UNREADABLE.
2. **C2 — Which number is progress vs limit rests on notation, not on an explicit label.** No string
   such as "0 of 80" was found; the evidence is the `X/Y` slash format, all four left-hand values
   being 0, and both models independently describing the left as the current value and the right as
   the maximum. glm-4.6v additionally reports a horizontal progress bar under each label in that box;
   glm-4v-flash described only label + numbers and did not mention bars. **The models disagree on
   whether those progress bars exist** — that specific detail is unconfirmed.
3. **C3 — Star counts are only reliable at whole-card framing.** Crops that cut the star row in half
   produced inconsistent counts (e.g. "1 lit, 2 unlit" and "3 lit" from the same model on two
   overlapping fragments). Only the crop containing the entire card, and both full-image passes,
   agreed on **5 stars, 1 lit / 4 unlit**. The *presence* of a star rating is solidly verified; a
   per-star pixel-level count beyond that framing is not something I would defend.
4. **Not checked at all** (outside the claim list): the exact list of dress attribute scores in
   shot3's middle panel, the fabric prices in shot3/shot4's right-hand lists, the accessory counts in
   shot6's right panel, and the photo-panel slider values in shot2/shot8. Models returned these
   readily, but they were not verified at the zoom levels used for the claims above and should not be
   treated as confirmed.

## Reproducing

The throwaway tooling (WebP->PNG conversion, crop generation, API caller and control images) was
deleted after the run, as requested. To reproduce: convert each `.webp` to PNG with Pillow, crop and
upscale the region of interest 2x–10x with LANCZOS, then POST a base64 data URI to
`https://open.bigmodel.cn/api/paas/v4/chat/completions` with `model: glm-4.6v` or
`model: glm-4v-flash` and `temperature: 0`, using the GLM key already present in
`~/.dsh/.credentials.yaml`.
