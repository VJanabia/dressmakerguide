# UI critique — dressmakerguide.com

**Reviewed:** 4 rendered screenshots in `docs/ui-review/` (home-desktop 1440×2400, home-mobile 390×1600, guide-desktop 1440×1800, wiki-desktop 1440×1600).
**Method:** direct vision-model passes (GLM-4.6V primary + GLM-4V-Flash second opinion) on each screenshot, cross-checked against **hard pixel measurements** of the PNGs and against the stylesheet and markup that actually produced them.
**Verdict on the brief:** the client's "too low completion, redo it" is justified, and the cause is identifiable and mechanical, not a matter of taste.

---

## 0. Two things you must know before reading the findings

### 0.1 The screenshots are the *old* build, and the working tree is already a different site

The PNGs were written at **00:51:41**. `public/assets/styles.css` was rewritten at **00:53:11** (8,047 → 17,441 bytes), `src/lib/layout.mjs` at **00:53:17**, and `dist/` rebuilt at 00:53:11–17. `git status` shows all of `dist/`, `public/assets/styles.css`, `src/lib/layout.mjs` as modified against HEAD.

I verified which build the screenshots show, by measurement rather than assumption:

| Evidence | Measured in the PNGs | HEAD CSS predicts | New CSS predicts |
|---|---|---|---|
| Body line box (desktop, all pages) | **28 px** | `17px × 1.65` = **28.05 px** ✓ | `18.56px × 1.72` = 31.9 px ✗ |
| Left content gutter (1440) | **x = 180** | `(1440−1120)/2 + 20` = **180** ✓ | `(1440−1140)/2 + clamp(…)` ≈ 168 ✗ |
| Text column right edge | **≈ 917** | `74ch` ≈ 737 px → 180+737 = **917** ✓ | grid + 240 px rail ✗ (no rail visible) |

**The screenshots are HEAD, i.e. the 8 KB stylesheet.** So this critique describes the design the client rejected. Where a P1 item is already implemented by the in-progress stylesheet, the item carries a *Status:* note, so nothing gets rebuilt twice.

### 0.2 The "390px mobile" screenshot is not a 390px render — it is a crop of a wider one

This matters because it is the only mobile evidence, and drawing mobile conclusions from it would send you chasing a bug that may not exist.

- The PNG is 390 px wide and the left gutter measures exactly **x = 20 px**, matching `.wrap{padding:0 20px}`.
- Body text measures **17 px / 28 px**, i.e. an unscaled 1:1 render (a downscaled capture would have shrunk the type).
- Of 32 body text lines measured, **26 run to x = 386–389** — the last pixel columns — while genuine paragraph-final lines end short (x = 93, 144, 237, 239, 278, 349).

Full lines clipped at the frame edge with short last lines intact is the exact signature of **a text column wider than the captured frame**. If the viewport really were 390 px, `.wrap` content would be 350 px and text could never pass x = 370. Its passing x = 389 proves the content box is **≥ 370 px, so the layout viewport was ~410–430 px**, and the PNG is a left-crop of that render.

**Action:** re-capture mobile at a true 390 px viewport before changing any mobile CSS. The two mobile findings below are ones I can prove from markup and CSS, not from the crop.

---

## (a) Per-screenshot findings

### A1. home-desktop.png — 1440 × 2400

**What is actually on the page, top to bottom** (from `src/lib/layout.mjs` + `md.mjs` at HEAD, confirmed against the pixels):

1. `header.site-head` — sticky, 64 px, inline SVG mark + "Dressmaker Guide / FAN GUIDE", then **8 nav pills** ("How to Play, Sewing Tips, Customers, Wiki, Release, Demo, Patch Notes, Games Like It"). The single most saturated element on the page is the active nav pill: solid `#9c3d5f` with white text.
2. `<h1>Dressmaker Game</h1>` — **renders as browser default** (see A5).
3. `p.updated` — 0.83 rem grey: "Last updated September 21, 2026. Dressmaker is a fan-made guide and is not affiliated with the developers."
4. A **bare, uncaptioned, unbordered image** (600×337 source scaled to the measure), 338 px of ink, y ≈ 234–571.
5. Two paragraphs, then `h2` "What is Dressmaker?", a 3-item bulleted list, more paragraphs.
6. `h2` "How to Play Dressmaker", then **five consecutive `h3`** ("Read the commission…", "Choose fabric…", "Cut it out", "Sew the panels…", "Decorate it…"), each a single 60–90 word paragraph.
7. Three more `h2` sections (Demo & Download, Steam Release Date and Price, Beginner Sewing Tips), each 1–3 paragraphs, separated only by whitespace.

There is no footer in the frame (the capture is the top 2400 px of a much longer page), and **no ad slot anywhere in the markup**.

**1. Layout and composition.** The eye lands on the active rose nav pill, then the game screenshot, then the H1 — in that order, which is backwards. There is no hero, no standfirst/dek, no key-facts block, no summary box, no card grid, no in-page table of contents: **the entire page is one continuous column of body text interrupted three times by a photograph.** It does not read as a designed publication; it reads as a Markdown file with a header and a footer bolted on. Measured: background colour `#fffdfb` covers **83.2 %** of the frame, and the text column occupies x = 180–917 inside a container that runs to x = 1260 — **343 px of permanent dead white space on the right of every single page** (24 % of the viewport).

**2. Typography.** This is the worst-performing dimension, and the failures are specific:
- **There is no `h1` rule in HEAD at all.** The only heading-1 selector is `.hero h1`, and `.hero` is never emitted by any page. So every H1 on the site falls back to the UA default: **2em = 34 px, in the inherited `system-ui` sans, with default 0.67em margins.** Meanwhile `h2` is `clamp(1.45rem,3vw,1.95rem)` = **31.2 px in Georgia** (the `--serif` stack degrades to Georgia on Windows). **H1 is 9 % larger than H2, in a different typeface.** The headline and its subheads are typographically indistinguishable.
- `h3` is 1.12 rem = **19 px sans**; `h4` is **17 px**; body is **17 px**. So h3, h4 and body are nearly the same size and the same typeface.
- **`h2` has `margin: 0 0 .5em` — zero top margin.** Nothing pushes a section heading away from the paragraph above it. This is the mechanical cause of the "wall of text" every reviewer independently reported: the only separation between sections is the preceding paragraph's ~18 px bottom margin.
- Line length is capped at `74ch` ≈ **737 px ≈ 90+ characters** of real text at 17 px. Past the comfortable 45–75 range, and left-aligned in a 1120 px container so the reader's eye has no right edge to return from.
- Line height 1.65 (28 px) is *passable*; the problem is not leading, it is measure and section rhythm.

**3. Colour and depth.** Flat in the strict sense: **the HEAD stylesheet contains zero `box-shadow` declarations.** There is no elevation layer anywhere on the site. The palette is one hue family — paper `#fffdfb`, ink `#241f26`, rose `#9c3d5f`/`#7a2d49`, rose-soft `#fbeef2`, hairline `#e8ded9` — and chromatic pixels total roughly **0.2–0.5 %** of the frame. There is no texture, no gradient, no brand surface. "Cozy dressmaking" — fabric, thread, warm paper, craft — is represented by a dusty rose link colour and a 30 px SVG.

**4. Density and rhythm.** Monotonous. Measured ink coverage per 50 px band across the page is a near-constant 6–16 % for 1,000 px at a stretch, broken only by the two image bands. Sections have no landmarks: same background, same left edge, same spacing, same weight. It is simultaneously **cramped** (headings with no air above them) and **empty** (83 % of the surface is blank paper).

**5. Components.** `header`: pill nav is the one finished-looking piece; the brand's "FAN GUIDE" sub-label at 0.7 rem/uppercase is fine. `h1`: unstyled UA default — the single loudest "this is unfinished" signal on the page. `p.updated`: 0.83 rem grey boilerplate, including a legal non-affiliation sentence, sits directly under the headline and pushes the real content down. Images: **no border, no radius, no shadow, no caption** (see problem 4 below). Tables: none on this page. Callouts: none. Cards: none. Buttons: none. There is no primary action of any kind on the homepage.

**6. Mobile.** N/A.

**7. Single biggest reason it looks unfinished.** Its headline is not styled at all, so the page's own title looks like default browser output while the nav pill is the most designed thing on screen.

---

### A2. home-mobile.png — 390 × 1600 (see 0.2: a crop, not a 390 px render)

**1. Layout and composition.** Header (brand + wrapped pill nav + eyebrow row), H1, byline, a game image, then an unbroken run of body text and `h2`/`h3` sections. The eye lands on the header block and the image; the H1 is not dominant. Same "styled document" character as desktop, compressed.

**2. Typography.** Body measures 17 px / 28 px — correct and legible in itself. Visible in the frame: a bulleted list and a numbered list rendering as default UA lists with `padding-left:1.25em`, and `h2` at Georgia against the sans H1. Same H1/H2 collapse as desktop. Line length runs to the clipped edge, so effective measure cannot be judged from this capture.

**3. Colour and depth.** Identical flat palette; the only strong colour is again the active nav pill.

**4. Density and rhythm.** Denser than desktop (the image and text alternate with less air), but the same absence of landmarks.

**5. Components.** The header is the weak point. `.site-nav` is `display:flex; flex-wrap:wrap` holding **8 items** inside a `position:sticky` header with `min-height:64px`. At 390 px the brand takes one row and the pills wrap to two or three more, so the sticky header consumes on the order of **150–180 px — roughly 20 % of an 844 px viewport — permanently pinned over the content.** This is provable from the CSS and markup and is a serious mobile defect regardless of the capture problem. Tap targets are otherwise ~30 px tall (`.nav-link{padding:7px 11px}` at 0.88 rem), **below the 44 px minimum**.

**6. Mobile-specific.** Reported for completeness, with the caveat in 0.2: the frame shows body text clipped at the right edge with a 20 px left margin and a **0 px right margin**. If that is real rather than a crop artefact, note that `body{overflow-x:hidden}` is exactly what converts an overflow bug into silently chopped words instead of a scrollbar. **Reproduce at a true 390 px viewport, then remove `overflow-x:hidden` from `body` and fix the underlying overflow rather than masking it.**

**7. Single biggest reason it looks unfinished.** The header becomes a tall stack of wrapping text pills that is pinned over the article.

---

### A3. guide-desktop.png — 1440 × 1800 (/how-to-play)

**1. Layout and composition.** Header → breadcrumb "Home / How to Play" (0.82 rem grey) → H1 "How to Play Dressmaker" → `p.updated` → intro paragraphs → a numbered five-step list → `h2` section → a table → further `h2`/`h3` sections. The breadcrumb is the only structural landmark and it is too small and too grey to function as one. Same 180–917 text column, same 343 px dead right column.

**2. Typography.** Same failures, plus a new one: the five-step structure is carried entirely by an `<ol>` at body size with default markers. The single most important structure on a walkthrough page — the steps — is typographically invisible. `h2` still has no top margin, so each procedural section runs straight out of the previous paragraph.

**3. Colour and depth.** Flat; the table is the only boxed element and it has no shadow, so it does not lift off the page.

**4. Density and rhythm.** The densest of the four. Long unbroken prose between rare headings, then a table that is visually the same weight as the text around it.

**5. Components.** `table`: 1 px `#e8ded9` border, 14 px radius, white background, uppercase 0.78 rem `thead` — structurally reasonable, but the **zebra striping is `#fdfbfa` on `#ffffff`, a 2/255 difference that is invisible**; the pixel histogram confirms both colours present in near-equal proportion, i.e. the stripes render and cannot be seen. The table reads as a plain white block. `breadcrumb`: weak. `ol`: default. No callouts, no "cutting is permanent" warning treatment despite the page's own copy saying so. The **"answer" box, fact strip, cards, buttons, prev/next nav and FAQ styling in the stylesheet are all dead code** — see problem 1.

**6. Mobile.** N/A.

**7. Single biggest reason it looks unfinished.** A step-by-step guide whose steps have no visual structure.

---

### A4. wiki-desktop.png — 1440 × 1600 (/wiki)

**1. Layout and composition.** Header → breadcrumb "Home / Wiki" → H1 "Dressmaker Wiki" → `p.updated` → intro → `h2` "Materials at a glance" + a 5-table reference set → `h2` "Where this table stops being useful" → `h2` "Pattern pieces and garment panels". This page is definitionally a *reference* page, and its dominant content type is the table — yet **the tables carry no more visual weight than the paragraphs**, and 5 tables of `min-width:520px` are stacked inside a 737 px column. There is no table of contents, no index, no search, no anchors navigation. For the site's most reference-like page there is no reference apparatus at all.

**2. Typography.** Same H1/H2 collapse; same missing `h2` top margin. Tables are set at 0.94 rem with `padding:11px 15px`, which is acceptable, but with **no tabular numerals** the figure columns do not align.

**3. Colour and depth.** `#ffffff` and `#fdfbfa` and `#faf6f4` together account for ~20 % of the frame here (the tables and their stripes), and all three are within a few points of the paper colour. The page is a single flat field.

**4. Density and rhythm.** The most repetitive of the four — heading, paragraph, table, heading, paragraph, table — with no variation in treatment to signal "this is a lookup table" vs "this is prose".

**5. Components.** The table is the primary component and is the weakest: invisible zebra, no header emphasis beyond uppercase grey, no row hover, no shadow, no horizontal-scroll affordance for the mobile case. This is the highest-leverage component on the site and it is the least designed.

**6. Mobile.** N/A.

**7. Single biggest reason it looks unfinished.** Its reference tables are visually indistinguishable from its paragraphs.

---

### A5. The structural cause, verified in the source

`md.mjs` can emit only: `p`, `h2`–`h4`, `ul`/`ol`/`li`, `strong`/`em`/`code`/`a`, `div.table-wrap > table`, `aside.note` (`.warn` variant), and a **bare `<img>` inside a `<p>`**. The caption syntax `![alt](src "caption")` compiles to a `title=` tooltip, **not a visible caption**.

Therefore these selectors in HEAD's `styles.css` are **never applied anywhere on the site**:

``.hero``, ``.hero h1``, ``.answer``, ``.facts``, ``.cards``, ``.card``, ``.btn``, ``.btn.ghost``, ``.grid-2``, ``.faq``, ``.pagenav``, `figure``, `figcaption``, `figure img``

That is roughly **40 % of the stylesheet — effectively all of its components — dead code**, confirmed by grepping every built page: no page contains `class="answer"`, `class="cards"`, `class="facts"`, `class="btn"`, `class="hero"`, `class="pagenav"` or `class="faq"`.

Consequences: no image on the site has a visible caption, border, radius or shadow; there is no summary box, no fact strip, no card grid, no button, no prev/next nav, and no visible FAQ treatment. One more consequence, from the missing `h1` rule: **`.updated`, `.lede` and `.hero` were written for a page shell that was never built.**

---

## (b) Synthesised top problems, ranked

1. **The design vocabulary exists but was never wired up.** ~40 % of the stylesheet never reaches a browser, and the headline it was all built around has no rule at all. This one fact explains almost every symptom below. The site is not under-designed; it is *unconnected*.
2. **The H1 is unstyled UA default and is only 9 % larger than the H2, in a different typeface.** The most important typographic signal on the page is missing, so every page reads as raw HTML at first glance.
3. **H2 sections have no top margin, so there is no section rhythm.** "Wall of text" is the direct, mechanical result of `h2{margin:0 0 .5em}` plus an `h3` that is only 2 px larger than body text.
4. **343 px of permanent dead white space on the right of every desktop page**, because a `74ch` measure sits left-aligned inside a 1120 px container. 83 % of the paper is blank, and none of the blank space does any work.
5. **Zero elevation and zero brand identity.** `box-shadow` appears 0 times in the stylesheet; chromatic accent is ~0.3 % of pixels; "cozy dressmaking" is not expressed in the visual language at all.
6. **The table — the primary content type on a wiki and guide site — is the least designed component**, with invisible zebra striping and no header emphasis, hover, or numerals alignment.
7. **No "answer-first" layer.** No summary box, no fact strip, no dek/standfirst. A reader arriving from Google must read three paragraphs to learn the release date and price, which are the exact facts they came for.
8. **The mobile header stacks 8 wrapping pills into a sticky block ~20 % of the viewport tall**, and nav tap targets are ~30 px, below the 44 px minimum.
9. **Images are structurally second-class**: bare `<img>` in a `<p>`, no figure, no visible caption, no border or radius, on a site whose subject is visual.
10. **No reference apparatus on the reference pages** — no TOC, no anchors nav, no search, on a site with a wiki and a 20-link footer.

---

## (c) Redesign plan

### P1 — highest perceived-quality gain per unit of effort

Each item is a concrete CSS or template change against the **current** (working-tree) stylesheet.

1. **Style the bare `h1` and make it clearly the dominant element.**
   The gap: at HEAD only `.hero h1` exists and `.hero` is never emitted, so the H1 is UA default 34 px sans against a 31.2 px Georgia `h2`.
   Do: add a bare `h1` rule — display serif, `font-size:clamp(2.2rem, 1.4rem + 3vw, 3.4rem)`, `font-weight:700`, `line-height:1.06`, `letter-spacing:-.028em`, `margin:0 0 .5rem`, `text-wrap:balance`. Target ratio H1:H2 ≥ 1.6.
   *Status:* already present in the working tree (`styles.css` line 105) — verify it wins cascade over any UA default and that `h2` is ≥ 1.4 rem so the ratio holds at 390 px.

2. **Give `h2` real space above it.**
   Do: `h2{margin:2.6em 0 .6em}` (`margin-top:clamp(2rem,4vw,3.4rem)`), and add a landmark treatment — either a 1 px `border-top` on `h2` with `padding-top:1.2rem`, or a small numbered eyebrow in `--sans`, 0.72 rem, uppercase, `--rose`.
   *Status:* working tree sets `margin:2.5em 0 .55em` — good; the landmark treatment is still missing.

3. **Fix the 343 px dead column: match the container to the measure, or use it.**
   Do: either set `--wrap:820px` so the container equals the measure, or — better — keep the wide shell and make `.layout` a grid: `grid-template-columns: minmax(0,68ch) 240px` above 1080 px, with the TOC rail (and a 300×600 ad slot) in column 2. Set the measure to `--measure:68ch` and apply it to `p, li, .note p` rather than to every direct child of `.prose` (capping `figure` and `.table-wrap` at the measure is what forces tables into a 737 px box while the page is 1120 px wide).
   *Status:* working tree adds `.layout.has-toc` with a 240 px rail — the remaining bug is that `.prose>*{max-width:74ch}` at HEAD also capped tables and figures; make sure the newer `p{max-width:var(--measure)}` form is used, not the `>*` form.

4. **Build a real type scale with contrast at every level.**
   Do: H1 ~3.35 rem / H2 ~1.95 rem / **H3 1.3 rem, `--sans`, weight 650** / body 1.06 rem. Today `h3`, `h4` and body are 19/17/17 px — indistinguishable. Also set body `line-height:1.7` and add `text-wrap:pretty` to `p`.

5. **Add an elevation layer.**
   Do: define `--sh-1/2/3` as warm-tinted (never neutral grey) and apply `--sh-1` to `.table-wrap`, `.card`, `.note`, `.facts li`, `figure img`, `.pagenav a`; `--sh-2` on hover with `transform:translateY(-2px)`.
   *Status:* working tree already defines `--sh-1/2/3` — just ensure every component consumes them.

6. **Make the tables actually read as tables.**
   Do: replace the invisible `#fdfbfa` zebra with a real tint (~`color-mix(in srgb, var(--plum) 4%, var(--surface))`); give `thead th` a tinted background plus a 1 px `--plum`-at-30 % bottom border; add `font-variant-numeric:tabular-nums` to `td`; add `tbody tr:hover{background:var(--plum-soft)}`; make `thead` `position:sticky;top:0` inside `.table-wrap`; and on mobile add a scroll affordance (a right-edge fade mask or a "scroll →" hint) since `table{min-width:520px}` inside a 350 px column will scroll.

7. **Promote images to figures with visible captions.**
   Do: in `md.mjs`, emit `<figure><img …><figcaption>…</figcaption></figure>` for the `![alt](src "caption")` form instead of a bare `<img title>` inside `<p>`; then `figure{margin:0 0 2.2rem}`, `figure img{border-radius:14px;border:1px solid var(--line);box-shadow:var(--sh-1)}`, `figcaption{font-family:var(--sans);font-size:.83rem;color:var(--ink-3);margin-top:.6rem;line-height:1.55}`. This is a ~15-line renderer change that lights up already-written dead CSS and adds captions to every screenshot on the site.

8. **Replace the dashed callout and give callouts an icon slot.**
   Do: `.note` — drop `border:1px dashed` (dashed borders read as wireframe/placeholder); use `border:1px solid color-mix(in srgb,var(--rose) 30%,transparent)`, `background:var(--plum-soft)`, a 4 px left accent bar (or a leading icon dot via `::before`), `border-radius:11px`, `padding:1rem 1.2rem 1rem 2.9rem`, `box-shadow:var(--sh-1)`. Keep `.warn` as the gold variant.
   *Status:* the working tree has already rewritten `.note` this way — no action needed beyond wiring more callouts into the content.

9. **Fix the mobile header and tap targets.**
   Do: below 720 px, replace the wrapping 8-pill nav with either a horizontally scrollable single row (`overflow-x:auto; flex-wrap:nowrap; scrollbar-width:none`) or a `<details>`/`summary` disclosure menu; add `min-height:44px` and `padding:.6rem .8rem` to `.nav-link`; give `html` `scroll-padding-top` equal to the header height so anchor links do not land under the sticky bar (HEAD has `scroll-behavior:smooth` but no `scroll-padding-top` — a real bug today).

10. **Delete the boilerplate under the H1 and demote the legal text.**
    Do: reduce `p.updated` to a compact single meta row (updated date · "fact-checked against the official Steam and itch.io pages" · reading time) in `--sans` 0.79 rem; move the "not affiliated with the developers" sentence out of the page body — it is already in the footer disclaimer. Right now a legal sentence is the second thing on every page.

### P2 — structural changes worth doing

- **Page hero.** `<header class="page-head">` with optional eyebrow kicker, a large `h1`, a standfirst/`.lede` dek at 1.2 rem `--ink-2` capped at 62ch, and a meta row. This is what separates "publication" from "document". *(Working tree has `page-head`/`eyebrow`/`lede` — currently used on the homepage only; roll out to every page.)*
- **Answer-first summary box.** Wire `page.answer` to render `<aside class="answer">` immediately under the H1 on every guide page, stating the release date, price, platforms and the single most useful takeaway in 2–3 sentences. Highest-value component for Google-arriving readers and for featured snippets. *(CSS exists and is good; it is currently unused.)*
- **Fact strip.** Wire `page.facts` to `.facts` on release/price/system-requirements pages. *(Currently homepage only.)*
- **Sticky "On this page" TOC rail** above 1080 px, generated from the H2s. It fills the dead right column, gives every page landmarks, and fixes problem 4 and problem 10 at once. *(Working tree has the TOC — extend it to all pages with ≥3 H2s and make the rail visually distinct.)*
- **Card grid for hub sections.** Use `.cards`/`.card` for "the five steps", "related guides", "where to go next" — anywhere the current build uses a bare `<ul>`. *(CSS exists, unused.)*
- **Prev/next page nav** (`.pagenav`) at the foot of guide pages so /how-to-play, /sewing-tips, /customers read as a sequence rather than isolated documents.
- **Sources/provenance block** (`.sources`) listing where each factual claim was checked. This is a genuine trust and E-E-A-T asset for an unofficial fan site making claims about dates and prices.
- **Turn the FAQ into a styled `<details>` accordion** rather than a run of `h3` + `p`; it is currently carried by schema markup only and looks like ordinary prose.
- **Restructure the header**: 8 top-level items is too many for a masthead. Group to ~5 (Guides, Wiki, Release, Demo, More) and add site search — a reference site with a 5-table wiki and 20 footer links has no way to look anything up.
- **Build a small brand kit**: two typefaces with defined roles, three accent hues with defined meanings (rose = primary action, gold = caution, green = confirmed fact), mark clear-space rules, an OG card template, and a subtle paper grain/texture on `body` or the hero.
- **Plan ad placement deliberately** — there is currently no ad slot in the markup. Reserve an in-article slot after the answer box and the 300×600 rail in the right column that today is dead space, so AdSense insertion does not wreck the rhythm later.

### P3 — nice to have

- Reading-progress indicator and back-to-top on long guides.
- Dark mode via `prefers-color-scheme` (the token layer in the working tree makes this cheap).
- Expand the print stylesheet (it currently only hides header/footer).
- Micro-interactions: animated link underlines, figure zoom-on-click, chevron on TOC links.
- Author/about box with a real byline and a stated review process for factual pages.
- `scroll-margin-top` (or `scroll-padding-top`) on headings — worth doing now, not later, because TOC anchors land under the sticky header without it.
- Related-articles module at the foot of each guide.

### What "good" looks like in this genre, and what is missing here

A well-made editorial game guide — the standard set by a quality walkthrough on a large outlet, or by a first-rate documentation site — shares a recognisable kit: a **masthead with a clear brand block**; a **hero** carrying an eyebrow, a large display headline, a standfirst dek and a byline with a "last updated" date; an **answer-first summary box** so the reader gets the fact they came for above the fold; a **fact strip** of key stats; a **sticky on-this-page rail** that gives every long page a visible skeleton; **section headings with generous space above them and a hairline or numbered kicker** so the eye can navigate by landmarks; **figure/figcaption** on every image with a real caption; **tables with strong header treatment, tabular numerals, row hover and a mobile scroll affordance**; **iconic callouts** with a coloured accent bar for warnings and tips; **card grids** for hub and "read next" sections; **prev/next navigation**; a **sources block**; and a **footer with a brand block**, not merely four columns of links. Typographically it rests on two typefaces with defined roles, a measure of 62–72 characters, line-height 1.6–1.75, and a type scale with a ratio of at least 1.25 between steps.

Our version has **none** of those components in the browser. It has a sticky header, a breadcrumb, a headline, an unattributed byline, unstyled prose, bare images, plain tables, a footer — and a stylesheet in which the answer box, fact strip, cards, buttons, callouts, FAQ, page nav, figures and hero have all been written and then never connected to anything. The gap is not decorative polish; it is the entire connective layer.

---

## (d) What "finished" would look like

A finished version of this site would be recognisable in a two-second glance as a *publication* rather than a styled document, and the change would be structural before it was decorative. Every page would open with a real masthead: an eyebrow kicker, a large display-serif headline that is unmistakably the largest thing on screen, a standfirst in a second colour, and a compact meta row carrying the review date and the fact-checking claim — with the legal non-affiliation sentence demoted to the footer where it already lives. Directly beneath it, the reader from Google would meet a tinted "short answer" box giving the release date, price and platforms in two sentences, and on the release, demo and requirements pages a row of keyed fact cards, so that the three facts most visitors came for are available before any scrolling. Long pages would carry a sticky on-this-page rail in the right column — the column that today is 343 pixels of dead white paper — which would simultaneously give every page a visible skeleton and give the AdSense rail a natural home. Sections would be separated by real space above each `h2` plus a hairline or a numbered kicker, so the page could be scanned by landmark rather than read as an undifferentiated column; `h3` would be visibly larger than body text instead of two pixels off it. Every screenshot would sit in a bordered, rounded, subtly shadowed figure with a visible caption, which alone would change the page from "text with pictures dropped into it" into an illustrated guide. Tables would have tinted headers, tabular numerals, visible striping, row hover and a scroll affordance on mobile. The whole surface would rest on a warm paper ground with a defined elevation layer and three accents with consistent meanings, so that boxes, cards and callouts sit *above* the page rather than being drawn on it. On a phone the header would collapse to a single scrollable row or a disclosure menu — never a sticky three-row stack of wrapping pills eating a fifth of the screen — with 44-pixel targets and no clipped text. And underneath all of it would sit the two unglamorous fixes that make the rest legible: an `h1` rule in the stylesheet, and a `h2` top margin.

---

## Appendix — evidence summary

**Measured from the PNGs**
- Desktop text column x = 180 → 917 inside a container running to x = 1260: **343 px of dead space**, on all three desktop pages.
- Background `#fffdfb` = **83.2 %** of home-desktop, **83.5 %** of guide-desktop, **74.6 %** of wiki-desktop.
- Body text: **17 px font / 28 px line box** (1.65) — matches HEAD CSS exactly, which is how I identified the build.
- Home-desktop vertical rhythm: header 0–100, H1 ≈ 107–186, image band 234–571 (338 px of ink), then continuous 28 px-rhythm text with 6–16 % ink coverage per 50 px band to the foot.
- Wiki: `#ffffff` 9.3 %, `#fdfbfa` 8.4 %, `#faf6f4` 2.5 % — i.e. the table, its zebra stripes and the footer tint are all within a few points of each other and of the paper.
- home-mobile: 26 of 32 body lines reach x = 386–389 with a 20 px left gutter; paragraph-final lines end at x = 93/144/237/239/278/349. Content box therefore ≥ 370 px → layout viewport ≥ 410 px → the PNG is a left-crop, not a 390 px render.

**Verified in the source**
- `public/assets/styles.css` at HEAD (8,047 bytes): **zero `box-shadow` declarations**; no bare `h1` rule (only `.hero h1`); `h2{margin:0 0 .5em}` (no top margin); `h3{font-size:1.12rem}` vs `body{font-size:17px}`; `.prose>*{max-width:74ch}`; `tbody tr:nth-child(even){background:#fdfbfa}` on `.table-wrap{background:#fff}`; `html` has `scroll-behavior:smooth` but no `scroll-padding-top`; `body{overflow-x:hidden}`; `.site-nav{flex-wrap:wrap}` with 8 items in a sticky header.
- `src/lib/md.mjs` emits a **bare `<img>` inside `<p>`** for `![alt](src "caption")` — never a `<figure>`, and the caption becomes a `title=` attribute. Hence `figure`/`figcaption`/`figure img` are dead.
- Grepping all built pages: **no page contains** `class="answer"`, `cards`, `facts`, `btn`, `hero`, `pagenav`, `faq`, `chips` or `sources` at HEAD.
- Repo state: screenshots (00:51:41) predate the rewrite of `public/assets/styles.css` (00:53:11, now 17,441 bytes), `src/lib/layout.mjs` (00:53:17) and the `dist/` rebuild. The working tree's new stylesheet adds a bare `h1` rule, `--sh-1/2/3` elevation, self-hosted Fraunces/Newsreader/Inter, an `.eyebrow`, `.lede`, TOC rail and redesigns of `.answer`, `.note`, `.facts`, `.card`, chips and sources — but at the time of writing `dist` emits only `eyebrow`(1), `lede`(1), `facts`(1) and `toc` on the pages checked, with `answer`, `cards`, `chips`, `sources` and `pagenav` still unused.
