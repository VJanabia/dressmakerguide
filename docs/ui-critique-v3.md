# UI critique v3 — dressmakerguide.com

**Reviewed:** the four round-3 renders in `docs/ui-review/round3/` (home-desktop 1440×3200, guide-desktop 1440×2200, wiki-desktop 1440×2000, release-desktop 1440×2400).

**Method:** fresh full-page renders of the build on disk at a true 1440 viewport plus a true 390 viewport (headless Chrome 153 via CDP, `Emulation.setDeviceMetricsOverride`, so the 390 renders are genuine and not floored at 500px), a computed-style/geometry probe injected into the live DOM, direct pixel measurement of the supplied PNGs and of the fresh renders, and vision passes (glm-4.6v primary, glm-4v-flash second opinion) over 2× crops. Where the vision passes and the pixels disagreed — and they did, once: glm-4v-flash reported "horizontal lines" between FAQ entries on /customers — the pixels win and the disagreement is not reported. My renders are checked in at **docs/ui-review/round3-verify/**.

---

## 0. Capture freshness — verified, the renders are current

| file | mtime |
|---|---|
| docs/ui-review/round3/home-desktop.png | **01:28:05** |
| docs/ui-review/round3/guide-desktop.png | **01:28:05** |
| docs/ui-review/round3/wiki-desktop.png | **01:28:05** |
| docs/ui-review/round3/release-desktop.png | **01:28:05** |
| src/lib/md.mjs | 01:27:44 |
| public/assets/styles.css | 01:27:54 |
| src/lib/layout.mjs | 01:27:12 |

All four PNGs are **11 seconds newer than the newest source file** and newer than the build inputs, so they do show the current build. `public/assets/styles.css` and `dist/assets/styles.css` are byte-identical (md5 `a0a41d9bd0dc707b1d2c5aebdb77a9da`, 349 lines). **The captures are trustworthy.**

**But they are height-capped, and that matters for three of the seven claims.** The supplied captures cover:

| capture | supplied height | actual page height | % of page shown |
|---|---|---|---|
| home-desktop | 3200 | 10160 | 31% |
| guide-desktop | 2200 | 8583 | 26% |
| wiki-desktop | 2000 | 6654 | 30% |
| release-desktop | 2400 | 8610 | 28% |

Everything at the end of these pages — **every sources block, every FAQ section, and the how-to-play and wiki figures** — is outside the frame. Claims 4, 5 and 6 therefore cannot be confirmed from the supplied PNGs at all; I verified them from fresh full-page renders and say so per claim below. This is the third round in a row where the capture set omits the regions under review.

---

## 1. Claim table

| # | Claim | Verdict | Decisive evidence |
|---|---|---|---|
| 1 | Fact strip no longer breaks 5+1; six tiles even, no orphan, no empty area | **PASS** | `grid-template-columns: 170px ×6`, **rows = 1**, `tailEmptyWidth = 0` at 1440 on all six pages probed. Supplied home PNG: one single content band y583–735. At 390: 2 columns × 3 rows (172.6px tiles), 355px tall vs 560px before. Vision: "6 boxes, all arranged in a single row… no orphaned box on a second row, and no large empty gap." No tile clipped (0/6 on every page). |
| 2 | TOC has a visible "On this page" label on desktop; on narrow screens sits above the article, collapsed | **PARTIAL — desktop label yes, desktop list GONE** | Label: painted (`.toc::before`, 11.2px, #6e6377; 232 dark px in the label band of the supplied home PNG). **List: 0 pixels.** Ink fraction in the rail link area (x1006–1254, y836–1120) is **0.0000, 0 dark pixels**, while the article column beside it is 0.4663. Vision on the crop: *"ON THIS PAGE — The area below the label is empty."* Affects **15 of 16 pages**; no page emits `<details open>`. Mobile half PASSES: at 390 the TOC is a 40px **collapsed** bar at y1114.7, article starts y1197.8, summary visible. Vision: *"collapsed bar with a '+' icon… appears above the article body text."* |
| 3 | All 11 content pages have eyebrow + H1 + standfirst + six-tile strip, consistent | **PASS** | Code: `eyebrow`/`lede`/`facts` each **11/11** across customers, demo, games-like, how-to-play, index, patch-notes, release-date, sewing-tips, system-requirements, troubleshooting, wiki. The 5 pages without a head (about, contact, disclaimer, privacy, 404) correctly have none. Vision confirmed all four elements in order on home, /how-to-play, /wiki and /release-date, with no missing or broken element. Head block is consistent across pages. |
| 4 | "Where this came from" sources block at the end of /release-date, /how-to-play, /wiki; visible and intentional | **PASS on substance — but NOT VISIBLE in any supplied capture** | Present on **all 11 content pages** (superset of the 3 claimed), not just 3. Vision on release-date, how-to-play and home crops: designed component — uppercase heading, contained box with border and background, bulleted link list — *"a deliberately designed component (not unstyled text or 'bolted on')"*. Position in the page: y9413 (home), y7867 (guide), y5938 (wiki), y7832 (release) — **all far below the 2000–3200px capture caps, so it is in none of the four supplied PNGs.** Verified from fresh full-page renders. One real defect: see §3.3. |
| 5 | FAQ on /customers, /release-date, /troubleshooting wrapped in a styled list; entries read as a designed component | **FAIL** | Wrapper exists (`<ol class="faq">` on those three pages plus home) but **it contains no `<li>`**: `.faq > li` matches **0 elements** on all three pages, so `.faq>li{border-bottom;padding:1.15rem 0}` and `li:first-child{border-top}` are inert. Pixel: longest continuous ink run inside the FAQ band is 38–219px and **0 candidate divider rules** (a rule would be ~784px). Vision (glm-4.6v): release-date *"no explicit horizontal rule, divider, or box separating one FAQ entry from the next"*; troubleshooting *"No divider rule separates entries."* Worse, `.faq h3{font-size:var(--t-lg)}` = **15.04px** overrides the round-3 h3 scale, so FAQ questions render **smaller than their own answers** (18.56px); pixel ink bands 13px (question) vs 19px (answer). |
| 6 | Figure captions visible under images, not just alt text | **PASS** | 18 figures / 18 figcaptions in dist — **100% coverage**, one caption per figure. Rendered 13.92px Inter #6e6377, 11.2px below the image bottom. Vision transcribed them correctly and called them legible on release-date (*"Hand-in is the moment the whole commission was for…"*), how-to-play and wiki (*"Pattern pieces laid on the cloth decide what the dress will look like…"*). Caveat: the supplied guide and wiki PNGs do not contain the figures (captions at y4327/y5542 and y3000) — verified from fresh renders. |
| 7 | Meta text #6e6377 and rose #a8476a clear 4.5:1; small text comfortably legible | **PASS** | `:root{--ink-3:#6e6377; --rose:#a8476a}` present in the appended block and winning (both `:root`, newer one last). Computed WCAG ratios: **ink-3 5.47 / 5.05 / 5.65 / 5.31** and **rose 5.39 / 4.97 / 5.56 / 5.22** (paper / paper-2 / surface / surface-2) — all ≥ 4.5:1, up from 4.40 / 4.06 / 4.19 / 3.86. Every small-text role now uses the new tokens. Vision on the fact strip: labels *"easy to read, not faint."* Residual: the small-type layer is still 8 sizes (10.56, 11.2, 11.52, 11.84, 12.8, 13.92, 15.04, 15.2) rather than the 4 the fix intended — see §4. |

**Four of seven fully passed (1, 3, 6, 7); one partial (2); one failed (5); one passed on substance but is unverifiable from the supplied captures (4).**

---

## 2. The TOC regression, in detail

This is new this round and it is the most damaging thing in the build.

`tocHtml()` in `src/lib/layout.mjs` now emits the details element **closed** — correct and necessary for the mobile fix:

```js
return '<aside class="toc" aria-label="On this page">' +
  '<details><summary>On this page</summary><nav><ol>' + links + '</ol></nav></details>' +
  '</aside>';
```

The desktop treatment then does this at ≥1080px:

```css
@media (min-width:1080px){.toc details{border:0;background:none;padding:0;box-shadow:none}.toc summary{display:none}.toc ol{margin-top:0}}
.toc::before{content:"On this page";display:none}
@media (min-width:1080px){.toc::before{display:block}}
```

So the only control that could open the disclosure is hidden with `display:none`, and nothing ever sets `open`. **A closed `<details>` does not render its content.** The v2 recommendation specified exactly this and included the missing half:

> In `tocHtml()` drop the open attribute, then open it only where it is a rail: `<script>if(matchMedia('(min-width:1080px)').matches) document.querySelectorAll('.toc details').forEach(function(d){d.open=true});</script>`

**That script (or an `open` attribute, or a `display:contents` unwrap) was never added.** The result is that the round-3 round replaced an unlabelled list with a labelled empty space.

**Why the DOM looks fine and the pixels do not.** The probe reports the nav and ol inside the closed details as `display: block; visibility: visible` with `offsetHeight = 278` — because Chrome hides closed-details content without changing its *computed* display. Only the geometry gives it away: the `<aside>` is **29px** tall while the nav inside it is **278px** and starts at y827.4, exactly where the aside ends — the content overflows a container that is not reserving space for it. The 29px is the `::before` label alone. **The pixels are decisive: 10 links, 0 painted pixels.**

---

## 3. The three most damaging remaining defects

### 3.1 The desktop table of contents is a label with nothing under it — 15 of 16 pages

**Evidence:** ink fraction 0.0000 in the rail below the label on the supplied home-desktop.png and wiki-desktop.png; vision: *"The area below the label is empty"*; `grep -l '<aside class="toc"' dist` → 15 pages, `grep -c '<details open>'` → 0.

**Fix** — stop using a closed disclosure for the desktop rail. In `public/assets/styles.css`:

```css
@media (min-width:1080px){
  .toc details{display:contents}   /* unwrap the details box so the closed-state hiding cannot apply */
  .toc summary{display:none}
  .toc::before{display:block}
  .toc nav{display:block}          /* the ol was already laid out; this makes the intent explicit */
}
```

`display:contents` on `<details>` removes its box entirely, so the `<nav><ol>` becomes an ordinary child of the sticky aside and is painted. If you would rather keep the details semantics, the equivalent one-line change in `src/lib/layout.mjs` is to emit the attribute and let CSS close it below 1080 — `'<details' + (openRail ? ' open' : '') + '>' + ...` — with `@media (max-width:1079px){.toc details:not([open]) > nav{display:none}}` guarding the collapsed mobile state.

### 3.2 The FAQ wrapper never emits a list item, so all its CSS is inert — and the questions are smaller than the answers

**Evidence:** `.faq > li` matches **0** elements on /customers, /release-date and /troubleshooting; `childTags = ["H2","H3","P","H3","P",…]`; 0 candidate divider rules in the pixels; `.faq h3` computed 15.04px vs body 18.56px.

`renderMarkdown()` opens the wrapper on the FAQ heading and then pushes `<h3>` and `<p>` as *siblings*:

```js
if (isFaqHeading && !inFaq) { inFaq = true; html.push('<ol class="faq">'); }
```

Nothing ever emits `<li>`. The `<ol>` also swallows the "Frequently asked questions" `<h2>` as its first child, which is an invalid content model for `ol` (only `li`, `script`, `template` are allowed) and is the direct cause of the empty-match behaviour.

**Fix** — match the CSS to the DOM that exists, in `styles.css` (smallest change, no renderer edit):

```css
.faq > h3{margin:1.7rem 0 .45em;padding-top:1rem;border-top:1px solid var(--line-2)}
.faq > h2 + p + h3,
.faq > h3:first-of-type{margin-top:.4rem;padding-top:0;border-top:0}
.faq h3{font-size:clamp(1.08rem,.3vw + 1rem,1.2rem);line-height:1.3}   /* >= body, not .94rem */
```

The alternative — and the better fix — is in `src/lib/md.mjs`: buffer the FAQ `###` heading and its following paragraphs and emit `<li><h3>…</h3><p>…</p></li>`, which makes the existing `.faq>li` rules live and fixes the invalid `ol`. Either way, **delete `.faq h3{font-size:var(--t-lg)}` (15.04px)**: a question that is 3.52px smaller than its answer is the single most obvious tell that this section was never designed, and it is a direct regression against the round-3 h3 scale (20.8px).

### 3.3 The sources box is 283px wider than the article it belongs to

**Evidence:** measured right edges at 1440 on /release-date, /wiki and /how-to-play:

```
first paragraph  942.08
article / figure / faq   970.81
table            969.81
facts strip     1254      <- full wrap
sources block   1254      <- full wrap
```

The block reads as designed in isolation (vision called it *"a deliberately designed component"*), but it is a direct child of `.wrap` (1068px) while `.prose` is 784.8px, so it overhangs the article column by **283px** and is wider than the FAQ section sitting immediately above it. That overhang is exactly what "bolted on" looks like, and it is measurable rather than a matter of taste.

**Fix** — put the block in the article column, in `styles.css`:

```css
@media (min-width:1080px){
  .wrap > .sources{width:calc(100% - 240px - clamp(1.5rem,3vw,3rem))}   /* matches the has-toc column */
}
@media (max-width:1079px){.wrap > .sources{width:100%}}
```

Cleaner and preferable: move `sourcesHtml(page.sources)` in `src/lib/layout.mjs` from its current position (after the closing `</div>` of `.layout`) to inside `<article class="prose">`, so it inherits the column instead of being clamped to it.

---

## 4. Residual items, lower damage but still open from v2

- **The small-type layer is still a smear of 8 sizes** — 10.56, 11.2, 11.52, 11.84, 12.8, 13.92, 15.04, 15.2px. The round-3 fix defined 4 tokens (`--t-xs .72rem`, `--t-sm .8rem`, `--t-md .87rem`, `--t-lg .94rem`) but `.brand small` (10.56), `.toc summary` (11.84), `.foot-grid h2` (11.2), `.toc::before` (11.2) and `.facts .v` (15.2) were never migrated, so four of the eight sit within 1.3px of each other. Contrast is fixed; the scale is not. Migrate those five declarations to the tokens and the layer becomes 4 sizes with a 12px floor.
- **The breadcrumb underlines only its first item.** Measured: `.crumbs a` ("Home") has `border-bottom: 1px` rose-45%; the current-page `<span>` has `border-bottom: 0px`. Opt out and use a text underline: `.crumbs a{border-bottom:0;text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--rose) 40%,transparent);text-underline-offset:.2em}`.
- **Four right edges remain, not three** — 942.1 (paragraphs at `--measure:74ch`), 969.8 (tables), 970.8 (article/figures/FAQ), 1254 (facts strip and sources). Fixing 3.3 removes the worst one; `--measure:78ch` or `.prose p{max-width:none}` with the column as the measure removes the 942/970 split.
- **.brand small at 10.56px is still the smallest type on the site**, in the masthead, at 5.39:1. It clears AA now; it is simply smaller than anything else on the page.
- **Still zero occurrences of `cards`, `btn`, `chip`, `pagenav`** in dist. Round 1's structural item is closed for `faq` and `sources` (both now emitted — 4 pages and 11 pages respectively) and remains open for the other four. Not a visual defect, but those CSS rules are still unreachable.

---

## 5. Anything actively broken

1. **The desktop TOC renders a heading over empty space on 15 of 16 pages.** (§3.1) The single most visibly broken thing in the build, and a regression introduced *by* the round-3 TOC fix.
2. **`<ol class="faq">` contains an `<h2>` and zero `<li>`** — invalid HTML content model, and the reason every `.faq > li` rule is dead. (§3.2)
3. **The sources box overhangs the article column by 283px** — active misalignment against the FAQ directly above it. (§3.3)
4. **Four different right edges on every content page** (942.1 / 969.8 / 970.8 / 1254). Up from three in v2, because the sources block added one.
5. **FAQ questions render 3.52px smaller than their answers** (15.04px vs 18.56px) — inverted hierarchy, visible at a glance.
6. **The four supplied captures show 26–31% of each page**, so claims 4, 5 and 6 are unverifiable from them as delivered.

**Not broken — checked and clean:** no horizontal overflow anywhere (`scrollWidth == innerWidth` at both 1440 and 390 on every page); **0 of 6 fact tiles clipped** on all pages probed; no element overflows its parent; the mobile TOC is correctly collapsed and correctly placed above the article; the mobile fact strip is 3 even rows of 2; captions are present on 100% of figures; the contrast fix is real and every small-text role clears 4.5:1.

---

## 6. Blunt answer

**Does this now look like a finished publication? No** — not because the design is wrong, but because three specific holes are visible at a glance: the desktop table of contents is a title with nothing under it, the FAQ is still a plain run of headings and paragraphs with smaller questions than answers, and the sources box is wider than the article it sits beneath. The page head, the fact strip, the captions, the contrast and the type pairing are all genuinely finished. Close §3.1–§3.3 and this reads as a publication.

---

## Appendix — evidence

**Build state.** `public/assets/styles.css` 21,454 bytes / 349 lines, md5 `a0a41d9bd0dc707b1d2c5aebdb77a9da`, byte-identical to `dist/assets/styles.css`; `src/lib/layout.mjs` 11,184 bytes; `src/lib/md.mjs` 6,745 bytes. Round-3 PNGs 01:28:05 — newer than every source file.

**Component presence across the 16 built pages** (from dist):

```
                       eyebrow lede facts sources faq figcap  h1
about / contact / disclaimer / privacy / 404     0    0     0       0   0      0   1
customers                  1     1     1      1     1      1   1
demo                       1     1     1      1     0      1   1
games-like                 1     1     1      1     0      1   1
how-to-play                1     1     1      1     0      2   1
index                      1     1     1      1     1      4   1
patch-notes                1     1     1      1     0      1   1
release-date               1     1     1      1     1      2   1
sewing-tips                1     1     1      1     0      2   1
system-requirements        1     1     1      1     0      1   1
troubleshooting            1     1     1      1     1      1   1
wiki                       1     1     1      1     0      1   1
totals (11 content pages) 11    11    11     11     4     18  11
```

**Geometry at 1440** (computed styles / getBoundingClientRect): wrap 186…1254; article column 186…970.8 (784.8); first paragraph right 942.08 (`--measure:74ch` = 756.08px); TOC rail x1014 w240, aside height **29px**, inner nav height **278px** overflowing; `grid-template-columns` of `.facts` = `170px ×6`, rows 1, tail empty 0; body 18.56px; h1 53.6 / h2 31.2 / h3 20.8 / faq h3 **15.04**; captions 13.92px, 11.2px below the image; `.toc::before` 11.2px #6e6377 `display:block`.

**Geometry at 390** (true viewport): doc 12,117px; facts 2 columns × 3 rows (172.6px tiles, band y704.4–1059.3); TOC 40px collapsed bar y1114.7–1154.6; article starts y1197.8; `overflow-x` false.

**Contrast** (WCAG 2.1, computed from token values; paper #fdfbf8 / paper-2 #f7f1ec / surface #ffffff / surface-2 #fbf7f4):

```
ink   #231a26   16.30  15.03  16.84  15.81   pass
ink-2 #544a58    8.14   7.51   8.41   7.89   pass
ink-3 #7d7286  OLD 4.40   4.06   4.54   4.26   FAIL AA
ink-3 #6e6377  NEW 5.47   5.05   5.65   5.31   pass
rose  #b95b7d  OLD 4.19   3.86   4.33   4.06   FAIL AA
rose  #a8476a  NEW 5.39   4.97   5.56   5.22   pass
```

**Renders used.** Current build served from `dist/` on 127.0.0.1:4188; fresh full-page captures at a true 1440 viewport and a true 390 viewport are kept in **docs/ui-review/round3-verify/** (`home-w1440-full.png` 1440×10160, `howtoplay-w1440-full.png` 1440×8583, `wiki-w1440-full.png` 1440×6654, `releasedate-w1440-full.png` 1440×8610, `customers-w1440-full.png` 1440×7799, `troubleshooting-w1440-full.png` 1440×8101, `howtoplay-w390-full.png` 390×12117).
