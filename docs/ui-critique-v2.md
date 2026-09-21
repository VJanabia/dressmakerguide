# UI critique v2 — dressmakerguide.com

**Reviewed:** the four renders in docs/ui-review/v2/ (home-desktop, home-mobile, guide-desktop, wiki-desktop), cross-checked against the stylesheet and template that produced them, against hard pixel measurements of the PNGs, and against **fresh renders of the build now on disk** (kept in docs/ui-review/v2-current/).

**Method:** every claim below is either (a) a pixel measurement of a PNG, (b) a computed style / geometry reading taken from the live DOM at a controlled viewport, or (c) a direct vision-model pass over a 1.7–4x crop. Where the vision passes disagreed with the pixels — and they did, repeatedly: at low resolution they called the warm paper palette "monochrome black on white", and misread the 13.4px TOC rail as body size — the pixels win and the disagreement is not reported.

---

## 0. Read this first: the v2 screenshots are not the build on disk

This is the same class of problem round 1 hit, and it matters more this time, because a lot of what round 1 asked for landed *after* these PNGs were written.

| file | mtime |
|---|---|
| docs/ui-review/v2/*.png (the four you sent) | **00:53:41** |
| src/lib/layout.mjs | 00:58:36 |
| src/pages/index.mjs | 00:59:11 |
| public/assets/styles.css + src/lib/md.mjs | 01:00:27 |
| dist/ rebuilt | 01:00:41 |

The renders are **seven minutes older than the code**. Things the PNGs physically cannot show that the current stylesheet contains: the homepage TOC rail, figure captions, the rose rule above every H2, the mobile nav scroll strip, and the mobile table-to-card restack. A critique written from the PNGs alone would send you to re-fix things that are already fixed.

Three further defects in the capture itself:

1. **All four PNGs are height-capped, and the footer is visible in none of them.** home-desktop stops at 2600px of a 10,526px page; guide at 1700 of 8,233; wiki at 1500 of 6,144; mobile at 1500 of 13,535. Every file except wiki ends with ink on its very last pixel row. **You asked for a verdict on the footer: it is not in the frame anywhere.** I judged it from a fresh render instead.
2. **home-mobile.png is not a 390px render — it is a ~500px layout left-cropped to 390.** Evidence: the body line pitch measures **30px**, which matches the 500px layout computed line box (**29.5px**) and not a true 390px layout (**28.46px**); the left gutter is 20px, which is clamp(1.15rem,4vw,2.25rem) resolving at 4vw = 20px, whereas a true 390px viewport gives 18.4px; and body lines run to x=389, the last pixel column, while genuine paragraph-final lines stop short. Headless Chrome silently floors --window-size at 500px wide, which is almost certainly how this happened. **So any mobile conclusion drawn from that PNG is unsafe — including the alarming "text touching the right edge", which is a crop artifact and not a CSS bug.** I confirmed the signature reproduces from my own --window-size=390 capture, then rendered a true 390px layout through a 390px-wide iframe to get real mobile evidence.
3. wiki-desktop.png ends on blank paper, so it does not look truncated — but it is 1,500px of a 6,144px page.

**What I did instead:** served the current dist/ (already running on 127.0.0.1:4173), rendered the current build at a true 1440 viewport and at a true 390 viewport, and read the live DOM through an injected probe. Those renders are checked in at **docs/ui-review/v2-current/** — they are the first captures in this project that include the footer, and the first true-390px mobile render. Everything below describes the current build; where the v2 PNG differs, I say so explicitly.

---

## 1. Verdict, blunt

**It no longer looks amateur. It still looks unfinished — and those are different failures.**

Round 1 diagnosed "the design vocabulary exists but was never wired up; roughly 40% of the stylesheet never reaches a browser." That is now *partly* fixed and *partly* repeated. The progress is real and visible: there is a type system, a colour system, an elevation system, a page head, an answer-first layer, captioned figures, and tables that read as tables. Two seconds on the homepage now says "a decent themed publication", not "unstyled HTML". That is a genuine step.

But "a designed publication" requires the design to be *applied*, and right now the core of it is applied to **one page**. Measured across all 17 built pages:

    class="eyebrow"  1     class="facts"  1     class="lede"   1    <- all three: index.html only
    class="cards"    0     class="btn"    0     class="chip"   0
    class="faq"      0     class="sources" 0    class="pagenav" 0

The eyebrow kicker, the standfirst and the six-tile fact strip — the three things that most define the new page head — exist on the homepage and nowhere else. /how-to-play and /wiki open with a breadcrumb, an H1 and a date line, then dive straight into body text. That is exactly what the vision pass reported unprompted: *"There is no standfirst between the H1 and the meta line... the header lacks an introductory summary, which is a standard component of professionally designed magazine article openings."*

And six components you list as restyled this round — **cards, buttons, chips, FAQ, sources, previous/next nav — have zero occurrences in the built site.** Restyling them changed nothing any reader can see. The .faq rules are unreachable while the actual FAQ on /release-date is still a run of h3 + p.

The second-order tell is finish in the details. A designed page has one right edge, one label size, and labels you can read. This one has **three** right edges (paragraphs stop 70px short of tables and figures), **eleven** font sizes between 9.92px and 15.2px, and every small label sitting between 4.06:1 and 4.40:1 contrast — just under the accessibility floor, consistently, everywhere.

**Verdict:** the redesign succeeded at the level of *vocabulary* and has not yet succeeded at the level of *application and finish*. It reads as a well-chosen system that one page is using properly. Close the gap between "built" and "used", fix two visible grid breaks, and it will read as a publication. That is about a day of work, not another redesign.

---

## 2. Typography specifically

**The pairing is working — genuinely.** Fraunces for display, Newsreader for prose, Inter for UI is the right pattern for this genre, and it is actually rendering (verified in the pixels, not assumed from the CSS): the H1 shows Fraunces high stroke contrast and sharp serifs; body copy is a serif with a serif colour on the page; tables, nav, labels, buttons and the footer are all sans. Three families with three defined roles. **Do not change the families.**

**The scale is coherent at the top and collapses at the bottom.** Computed at 1440:

| element | family | size | ratio to next |
|---|---|---|---|
| H1 | Fraunces 700 | **53.6px** | |
| H2 | Fraunces 650 | **31.2px** | 1.72 ok |
| H3 | Inter 650 | **18.56px** | 1.68 ok |
| body | Newsreader 400 | **18.56px** | **1.00 — broken** |

H1 to H2 to H3 is a proper scale. Then **H3 is exactly the same size as body text** — 18.56px against 18.56px. The only things separating a subheading from a paragraph are the family (Inter vs Newsreader) and the weight (650 vs 400). In practice that works far better than round 1, where h3 and body were both sans and 2px apart, but it is still a missing step.

**Below body text there is no scale at all — there is a smear.** Eleven distinct sizes inside 5.3px:

     9.92px  .brand small ("FAN GUIDE")
    10.88px  .facts .k
    11.20px  .foot-grid h2
    11.52px  .eyebrow
    11.84px  .toc summary
    12.48px  .updated
    12.80px  .disclaimer
    13.28px  .nav-link, figcaption
    13.44px  .toc links
    14.40px  table
    15.20px  .facts .v

Nine of those sit within 3.5px of each other. That is not a scale, it is eleven separate decisions. Nobody can perceive the difference between 11.20 and 11.52 and 11.84, so the hierarchy those numbers were meant to build does not exist — while the smallest of them is small enough to be a defect in the masthead.

**Body text at this measure and line height: comfortable, slightly over-air.** 18.56px on a 31.92px line (1.72), measured maximum **715.21px** = 70ch, about 68–72 characters. 1.72 leading at ~70 characters reads well but is at the airy end, and that leading is compensating for a measure that is slightly too long. If you shorten the measure (see the right-edge fix in section 6), you can drop to line-height 1.66 and gain vertical rhythm for free.

**Too small or too light:** .brand small ("FAN GUIDE") at **9.92px** uppercase in rose at 4.19:1 — the smallest type on the site, in the masthead; .facts .k at **10.88px** at **4.40:1** — the label layer of the component added specifically to be scannable; .foot-grid h2 at **11.20px** at **4.06:1** — the only structure the footer has, and the least legible text in it. Nine components sit below the 4.5:1 AA threshold; figures and fix in section 6.4.

**Badly paired:** nothing. The failures here are of degree — too many sizes, floor too low, contrast too low — not of mismatched families.

---

## 3. The new components, one verdict each

### Eyebrow + H1 + lede header block — designed, the best thing in the redesign, and undermined by being on one page

Measured on the homepage: a 26x2px rose bar at x186–211, an 8px gap, eyebrow text at 11.52px Inter 700 with 0.12em tracking in rose; H1 at 53.6px Fraunces 700; a six-line standfirst at 20.48px Newsreader in ink-2 capped at 62ch; a 12.48px meta line. The bar is optically aligned to the eyebrow caps to within 1px (bar centre y129.5 vs cap centre y128.5) — correct. This is a real magazine opening.

The flaw is coverage, not craft: eyebrow and lede render on **exactly one page**. On /how-to-play and /wiki the same header slot renders as breadcrumb, H1, "Last reviewed September 21, 2026 · Unofficial fan guide", then straight into body. The component is finished; it is simply not used.

### Six-tile fact strip — right idea, visibly broken grid. Fix this first

At 1440, grid-template-columns repeat(auto-fit,minmax(190px,1fr)) inside a 1,068px content box resolves to **5 columns**, so the six tiles land **5 + 1**: five across y495–620, then "LENGTH — About 35 hours of commissions" alone on row two at x186–390 with roughly **850px of empty paper** beside it. The vision pass described it unprompted as *"only 1 tile with significant empty space to its right, creating a visually unbalanced layout."* This is the most obviously wrong thing above the fold on the homepage.

The tiles themselves are well made: white on paper, 1px line, 11px radius, shadow, equal 114px heights, uppercase tracked micro-label over a 15.2px semibold value. **That label/value typography is correct and should not be touched.**

And it is worse at 390. The grid collapses to one 353px column, so the strip becomes **six full-width tiles, y587–1146 — 560px of stacked boxes** before the reader reaches the hero image. The DOM probe confirms grid-template-columns computes to a single 353.219px column: this is the desktop auto-fit grid falling over, not a mobile design. The vision pass called it "designed for mobile"; it is not.

### "On this page" TOC rail — unfinished in both layouts, in opposite ways

*Desktop:* the rail is 240px at x1006–1246, sticky at top:5.6rem, and contains **no visible label** — the min-width:1080px block sets .toc summary{display:none} and strips border, background, padding and shadow. What remains is a bare numbered list of 11 items at 13.44px floating in the right margin with no rule, no container, no title. The vision pass: *"No visible heading above the list... no container, border, rule or background... the rail reads as floating text... looks like an unlabelled list."* Long entries wrap to a second line leaving an orphaned word.

*Mobile:* the TOC is emitted **after** the article in the DOM and the layout is a single column below 1080px, so it renders at the **bottom of the page**. Measured at a true 390: article ends y11732, **TOC y11756–12118**, footer y12179. That is a 362px **expanded** details block — "ON THIS PAGE" plus ten links — sitting 24px above the footer of a **13,535px page**. A table of contents there is not a design decision, it is a layout accident. The vision pass: *"intentional but out of place... styling is consistent and polished, but its position at the bottom of a very long page is unusual."*

### Tables — designed. The best-executed component in the build. Leave alone

Verified: a real gradient header (linear-gradient 180deg from surface-2 to plum 5%) with a plum-22% bottom border and 700-weight uppercase tracked labels; plum-4% zebra; rose-8% row hover; font-variant-numeric tabular-nums; a bolded first column; a 1px line box on --surface with a shadow; 11px radius. The vision pass on the wiki four-column table: *"clean, readable layout with consistent typography, padding and zebra striping; column widths proportional to content; no obvious faults."* Nothing is cramped.

The mobile restack is the best engineering in the redesign: below 640px the thead is hidden, each tr becomes a bordered card, th[scope=row] becomes a Fraunces 1.02rem title, and each td becomes a flex row with td::before{content:attr(data-label)}. I verified **data-label is genuinely emitted by md.mjs — 53 occurrences on the wiki page alone** — so those labels will render. A component designed *and* finished.

One dead line: thead th{position:sticky;top:0} cannot do anything inside .table-wrap{overflow-x:auto}, which is already a scroll container with no vertical overflow. Harmless, but it is not doing what it looks like it is doing.

### Cards — cannot be judged: not rendered anywhere

class="cards" and class="card" = 0 across all 17 built pages. The CSS exists and is unreachable.

### Callouts — designed

Verified on /release-date, where a .note.warn renders at y2925–3009: gold-soft ground, 1px gold-38% hairline, 11px radius, shadow, a 15px gold dot with a 4px 16%-gold ring at left 1.05rem, and 2.9rem of left padding to clear it. The vision pass: *"reads as a deliberately designed callout, not a plain paragraph with a tinted background."* One note: the dot is deliberately muted, so it registers as decoration rather than a signal — acceptable for a "note", a little weak for a "warning".

### Buttons — cannot be judged: not rendered anywhere

class="btn" = 0. There is no primary action of any kind anywhere on the site.

### Chips — cannot be judged: not rendered anywhere

class="chip" = 0.

### FAQ — cannot be judged as styled; the styles are unreachable

class="faq" = 0 while the FAQ on /release-date is still h3 + p. Round 1 asked for a styled details accordion; the CSS exists and nothing uses it.

### Sources block / previous-next page nav — cannot be judged: not emitted

class="sources" and class="pagenav" = 0. So /how-to-play still ends by simply stopping: no read-next, no provenance block, no byline. The vision pass on the foot of the guide page: *"No read-next/previous-next navigation. No author/byline block."*

### Footer — functional, generic, and visibly the least-designed thing left

Measured: 557px tall (y9945–10502), ground --paper-2 #f7f1ec against paper #fdfbf8 — a difference of 6/10/12 per channel, i.e. **barely perceptible**; one 1px top border; four link columns (Start here, Buy and play, More, Official links) with 11.2px uppercase headings at **4.06:1**; then three paragraphs of 12.8px disclaimer at 4.40:1. There is **no brand block, no logo, no display type, no column dividers, no second ground.** The vision pass: *"minimal visual distinction between column headings and links... looks like a default link list."* Round 1 asked for a footer with a brand block; it still has none. The link labels themselves are good and should stay.

**And the footer link styling never applies at all.** The rules `.foot-link{font-family:var(--sans);font-size:.87rem;color:var(--ink-2)}` and its hover state are dead, because `layout.mjs` emits the footer anchors as bare `<a href="...">` with **no class attribute** — I confirmed `.foot-link` appears nowhere in any built page. So the footer links fall through to the global anchor rule and render in **Newsreader serif, in --plum, with a rose 45% underline** — exactly the opposite of the Inter / --ink-2 / no-underline treatment the design system intends, and a direct type clash with the Inter uppercase headings directly above them. The vision pass saw the result and not the intent: it reported the whole footer as *"Serif font (consistent across all text)"* with links *"maroon, underlined"*, and never registered the headings as a different family. Two-line fix: either add the class in `layout.mjs` (`'<li><a class="foot-link" href="' + href + '">' + label + '</a></li>'`) or change the selector to `.foot-grid a`.

---

## 4. Colour and depth

**The palette is working and it is not muddy.** This is the clearest success of the round. The warm paper ground is real: #fdfbf8 covers about 87% of the homepage by pixel count, and the ink is #231a26, a plum-black rather than a neutral grey. Accents carry meaning rather than decoration: rose for labels and rules, plum for the primary action and the answer box accent, gold for caution, green for confirmed-fact dots. Nothing fights.

Contrast for the primary text colours is excellent and needs no change:

| token | on paper | verdict |
|---|---|---|
| --ink #231a26 | **16.30:1** | excellent |
| --plum #7d2b4a | **8.78:1** | excellent |
| --ink-2 #544a58 | **8.14:1** | excellent |
| --ink-3 #7d7286 | **4.40:1** | below AA — see 6.4 |
| --rose #b95b7d | **4.19:1** | below AA — see 6.4 |

**Shadows and borders are helping, not muddying.** The three elevation tokens are warm-tinted (rgba(92,27,51,...), i.e. plum, never grey) with small spreads and large blurs, so they read as paper lifting — correct for a warm ground. The 1px hairlines on cards, tiles and tables do real separation work. Two places where the depth is in the CSS but not on the screen: the footer ground shift is too small to register, and the answer box top-to-bottom gradient is invisible (the vision pass read it as a flat fill) — harmless, but it is not earning its bytes.

**The H2 rule is the one unresolved piece of colour.** Every H2 now carries h2::before — a 38x2px bar at opacity .5 of rose, left-aligned with the heading, sitting about 29px above the cap line. Measured colour in the render: #dbabba, which is rose at 50% over paper. It is a genuine editorial device in the right place, but at 38px and half opacity it sits exactly on the line between "section landmark" and "stray artefact". Commit or cut it.

---

## 5. Mobile at 390 — measured on a true 390px layout

I rendered a genuine 390px viewport (through a 390px-wide iframe, because headless Chrome floors --window-size at 500) and probed the DOM.

**Overflow: there is none.** Container 390px, gutter 18.4px each side, content box 353px (x18.4–371.6). The longest measured text right edge across the first 4,000px is **x368**. Nothing touches the edge. **The alarming "text running off the right edge" in v2/home-mobile.png is a crop artifact — there is no bug to fix, do not chase it.**

**Tap targets pass.** .nav-link computes to **94 x 44px** at 390px. The 44px floor is met.

**But the header strip is broken in two visible ways.**

1. **It is cut off mid-word with no affordance.** The strip is one row with overflow-x:auto, scrollbar-width:none and the webkit scrollbar hidden. Its content is **656px wide inside a 353px box**, so at 390px you see "How to Play · Tips · Customers · Wiki · Release" and then a hard cut through the middle of **"Releas"** — while Demo, Patch Notes and Games Like It are entirely invisible. There is no fade, no arrow, no partial pill, nothing to say the row scrolls. Measurements and the vision pass agree: *"cut off at the right edge, truncating Releas. There is no visual hint indicating horizontal scrolling."* A nav that looks truncated reads as broken, not as scrollable.
2. **The strip rule stops 38px short of the right edge.** .site-nav gets margin:0 calc(var(--gut)*-1) with flex:0 0 100%; the negative left margin pulls the box to x0 but the negative right margin does not widen the border box, so the strip occupies **x0–353 in a 390px viewport**. Measured in the pixels: the nav border-top spans **x0–352** while the header border-bottom spans **x0–389**. On screen: a hairline that starts flush at the left edge and stops 38px before the right edge, on the first thing anyone sees. The vision pass noticed it independently.

**Cramped type and awkward wrapping:**

- The header block is **126px tall** — about 18% of a 700px viewport — and it is sticky.
- Body is 16.545px on a 28.457px line at a 353px measure, which is comfortable. But the lede runs 11 lines before anything else happens, and with the 126px header the fact strip does not start until y587.
- The **six stacked fact tiles cost 560px** — the most expensive single mobile defect.
- Long TOC entries at the bottom wrap with orphan words.

**Does the TOC details element look intentional?** The styling does; the placement does not. The box is coherent — surface-2 ground, 1px line, 11px radius, shadow, uppercase tracked "ON THIS PAGE" with a rose minus marker — a reader would take it for a deliberate component. But it sits as **362px of expanded links immediately above the footer of a 13,535px page**, and it is **open by default** on a screen where the whole point of the details pattern was to keep it collapsed. It reads as a component designed for desktop that was never re-thought for the layout it actually lands in.

---

## 6. Ranked: the five things still making it look unfinished

### 1. The fact strip grid breaks visibly on desktop and costs 560px on mobile

**Evidence:** at 1440, auto-fit minmax(190px,1fr) in 1,068px yields 5 columns, so six tiles render **5 + 1** — five across, then "LENGTH" alone at x186–390 with about 850px of empty paper beside it. At 390 the same grid collapses to one 353px column: six full-width tiles, y587–1146, **560px of boxes** before the hero image.

**Fix** — replace the auto-fit with explicit steps. One rule set solves both problems:

    .facts{grid-template-columns:repeat(2,minmax(0,1fr))}
    @media (min-width:640px){.facts{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media (min-width:1080px){.facts{grid-template-columns:repeat(6,minmax(0,1fr))}}
    @media (max-width:639px){
      .facts li{padding:.7rem .85rem}
      .facts .v{font-size:.9rem}
    }

Desktop becomes one clean six-up row (168px tiles; "September 21, 2026" fits on one line at 15.2px, tight but fits). Mobile becomes three rows of two, roughly 250px instead of 560px. If 168px proves too tight for "Cozy Lives, published by Free Lives", use repeat(3,minmax(0,1fr)) above 1080 instead — two tidy rows of three, each tile 348px, every value on one line. Either beats 5+1; the 5+1 is what must go.

### 2. The TOC rail is unfinished on desktop and in the wrong place on mobile

**Evidence:** desktop — .toc summary{display:none} above 1080px removes the only label while the same block removes border, background, padding and shadow, leaving a bare numbered list at 13.44px floating at x1006–1246. Mobile — the TOC is emitted after the article, so it renders at **y11756–12118**, i.e. after 11,732px of article and 24px before the footer, as an **expanded** 362px block.

**Fix** — keep the summary as a static label on desktop, and lift the rail above the article on mobile:

    @media (min-width:1080px){
      .toc details{display:block}
      .toc summary{
        display:block;font-size:.72rem;font-weight:700;letter-spacing:.1em;
        text-transform:uppercase;color:var(--ink-3);
        padding:0 0 .55rem;border-bottom:1px solid var(--line);margin-bottom:.6rem}
      .toc summary::after{content:none}
    }
    @media (max-width:1079px){
      .layout.has-toc{display:flex;flex-direction:column}
      .toc{order:-1;margin:0 0 1.8rem}
    }

And make it collapsed by default so mobile gets a one-line bar instead of 362px of links. In tocHtml() drop the open attribute, then open it only where it is a rail:

    // layout.mjs: emit closed
    ... '<details><summary>On this page</summary><nav><ol>' + links + '</ol></nav></details>' ...

    <!-- once per page, after the footer markup -->
    <script>if(matchMedia('(min-width:1080px)').matches)
      document.querySelectorAll('.toc details').forEach(function(d){d.open=true});</script>

### 3. The new page head is applied to one page out of seventeen

**Evidence:** class="eyebrow" = 1, class="lede" = 1, class="facts" = 1, all in index.html. /how-to-play and /wiki open with breadcrumb, H1, "Last reviewed September 21, 2026 · Unofficial fan guide", then body text. The vision pass flagged the missing standfirst twice, unprompted, as *"a standard component of professionally designed magazine article openings."*

**Fix** — content, not CSS. Add eyebrow and lede to every page object in src/pages/*.mjs. The lede already exists as each page first paragraph, so promote it rather than writing anything new. For /how-to-play, whose first two sentences are already written:

    eyebrow: 'Walkthrough',
    lede: 'Dressmaker is a cozy crafting game about making one dress, for one person, for one ' +
          'occasion. Nothing is timed and there is no fail state; the tension comes from one ' +
          'rule — cutting is permanent and fabric costs coin.',

Then add a facts strip to the four pages whose whole purpose is a lookup — /release-date, /demo, /system-requirements, /customers. Every value you need is already in the prose. Give the eyebrow a working vocabulary rather than a decorative one: Walkthrough, Reference, Tips, Release, Comparison. This single item does more for "reads as a publication" than any CSS in this document.

### 4. The small-type layer: eleven arbitrary sizes, and every label below the AA contrast floor

**Evidence:** eleven font sizes between 9.92px and 15.20px, nine of them inside 3.5px (list in section 2). Contrast computed from the tokens: --ink-3 #7d7286 is **4.40:1** on paper, **4.06:1** on the footer ground and **4.26:1** on the table-header tint; --rose #b95b7d is **4.19:1** on paper and **3.86:1** on the footer. Every one is below the 4.5:1 AA threshold for normal text, and they are the colours of .updated, .facts .k, figcaption, .toc summary, .foot-grid h2, .disclaimer, .eyebrow, .brand small and thead th. The floor of 9.92px is the brand tagline.

**Fix** — two token values and four steps. No component needs touching individually:

    :root{
      --ink-3:#6e6377;       /* 5.47:1 on paper, 5.05:1 on --paper-2, 5.31:1 on --surface-2 */
      --rose:#a8476a;        /* 5.39:1 on paper, 4.97:1 on --paper-2 */
      --fs-micro:.75rem;     /* 12px — facts .k, foot h2, toc summary, brand small */
      --fs-meta:.8125rem;    /* 13px — updated, figcaption, crumbs, disclaimer */
      --fs-ui:.875rem;       /* 14px — nav-link, toc links, foot links, table */
      --fs-emph:.9375rem;    /* 15px — facts .v */
    }
    .facts .k,.foot-grid h2,.toc summary,.brand small{font-size:var(--fs-micro)}
    .updated,figcaption,.crumbs,.disclaimer{font-size:var(--fs-meta)}
    .nav-link,.toc,.foot-link,table{font-size:var(--fs-ui)}
    .facts .v{font-size:var(--fs-emph)}

That removes seven sizes, raises the floor from 9.92px to 12px, and takes every small label from 4.06–4.40:1 to 5.05–5.47:1. Both colour changes are imperceptible as colour changes; you will not notice them, you will just stop squinting.

### 5. The mobile header strip is cut off mid-word with a 38px gap in its rule

**Evidence:** .site-nav scrollWidth **656px** inside a **353px** box with the scrollbar hidden and no visual cue, so "Release" is sliced through and the last three destinations look unreachable. The strip border-top measures **x0–352** while the header border-bottom measures **x0–389** — a 38px hole at the right edge, caused by margin:0 calc(var(--gut)*-1) with flex:0 0 100%, where the negative right margin does not widen the border box.

**Fix:**

    @media (max-width:880px){
      .site-nav{
        flex:0 0 calc(100% + var(--gut) * 2);   /* border box becomes the full 390px */
        margin-inline:calc(var(--gut) * -1);
        -webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 26px),transparent);
                mask-image:linear-gradient(90deg,#000 calc(100% - 26px),transparent);
      }
    }

The calc fills the 38px hole so the rule runs edge to edge; the mask fades the last 26px so a half-visible pill reads as "there is more" rather than as a clipping bug. Accepted trade-off: the fade is present even at the end of the scroll, which is standard for this pattern.

### Just outside the five — same evidence quality, lower damage

- **H3 is exactly the same size as body text** (18.56px vs 18.56px). Fix: h3{font-size:clamp(1.18rem,.4vw + 1.08rem,1.34rem)} gives 21.4px at 1440, a 1.15x step.
- **Paragraphs stop 70px short of everything else.** p{max-width:70ch} computes to **715.21px** (right edge x901) inside a **785px** article column, while figure, .table-wrap, .answer and li all run to x971. Three right edges exist; two of them agree. Make the column the measure:

      @media (min-width:1080px){
        .layout.has-toc{grid-template-columns:minmax(0,var(--measure)) 240px;
                        justify-content:space-between;gap:2rem}}
      .prose p{max-width:none}

  The alternative one-liner, if you would rather keep the column: set --measure:78ch (about 797px) so prose fills the 785px column — but that pushes the measure past 75 characters.
- **The nav label for /sewing-tips is literally "Tips"** (layout.mjs: ['/sewing-tips','Tips']), and /release-date is "Release". The footer calls the same two targets "Dressmaker guide: sewing tips" and "Dressmaker Steam release date". Ambiguous top-level labels beside unambiguous footer ones reads as unfinished. Use Sewing Tips and Release date, and let the mobile strip scroll.
- **The footer has no brand block** and its ground is only 6–12/255 away from the page. Add the wordmark in Fraunces above the columns and deepen the ground: .site-foot{background:color-mix(in srgb,var(--plum) 5%,var(--paper-2));border-top:1px solid color-mix(in srgb,var(--plum) 18%,transparent)}.
- **Round 1 biggest structural item is still partly open: six restyled components are never emitted.** Cards, buttons, chips, FAQ, sources and page-nav have zero occurrences. Either wire them into content — cards for "the five steps" and read-next, .faq for the real FAQ on /release-date, .sources on the factual pages — or delete the CSS. Measured precisely: **39 of the stylesheet 246 declaration lines (16%) belong to rules whose classes appear nowhere in dist** — .cards/.card (7 rules), .btn (4), .chips/.chip (6), .faq (5), .sources (3), .pagenav (6), plus .grid-2, figure.bleed, .muted, .small and .page.
- **The breadcrumb underlines only one of its two items.** The global a{border-bottom:1px solid rose-45%} applies to the "Home" link (measured: a 1px #deb3c0 rule at x186–220, about 7px below the baseline) while the current-page span gets none. Opt out and use a text underline: .crumbs a{border-bottom:0;text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--rose) 40%,transparent);text-underline-offset:.2em}.
- **Commit to the H2 rule or drop it:** h2::before{width:52px;height:2px;opacity:1}.

---

## 7. Anything actively wrong

All measured, not inferred.

1. **The fact strip renders 5 + 1** — a lone sixth tile with about 850px of empty paper beside it. (6.1)
2. **The mobile TOC renders after the article** — 362px of expanded links above the footer of a 13,535px page. (6.2)
3. **The desktop TOC rail has no visible heading at all** — summary is display:none above 1080px. (6.2)
4. **Nine components fail WCAG AA contrast**: --ink-3 at 4.06–4.40:1 and --rose at 3.86–4.19:1, against a 4.5:1 requirement. (6.4)
5. **The mobile nav strip rule is 38px short on the right** (x0–352 against the header x0–389), "Release" is clipped mid-word, three links are off-screen, and there is no scroll affordance. (6.5)
6. **.brand small renders at 9.92px** — the smallest text on the site, in the masthead.
7. **H3 equals body size** at 18.56px, so H3s do not read as headings.
8. **Three different right edges** on every page: prose at x901, tables/figures/lists/answer at x971.
9. **The nav says "Tips"** for /sewing-tips.
10. **No footer is visible in any of the four supplied screenshots** — all are height-capped mid-content. (0)
11. **home-mobile.png is not a 390px render** — it is a ~500px layout cropped to 390, and its apparent right-edge overflow is an artifact. Do not fix CSS for it. (0)
12. **thead th{position:sticky;top:0} is inert** inside its own overflow-x:auto scroll container.
13. **The footer links render in the wrong typeface** — serif, plum and underlined — because `.foot-link` is never emitted on the anchors, so the intended Inter / --ink-2 styling is dead. It clashes with the Inter headings immediately above. (3, footer)
14. **39 of 246 CSS declaration lines (16%) are unreachable** — rules whose classes appear nowhere in dist. (6, "just outside the five")
15. Not bugs, but worth knowing: the answer box gradient and the footer ground shift are both imperceptible in the render, so two places where the CSS implies depth are visually flat.

---

## 8. What is now good and should not be touched

- **The Fraunces / Newsreader / Inter pairing.** Correct families, correct roles, self-hosted, and actually loading. The single biggest improvement in the round.
- **The H2 rhythm.** margin-top 52.8px against margin-bottom 15.6px is a **3.4:1** above-to-below ratio, with h3 at 4.25:1. Round 1 problem #3 ("no section rhythm, headings with no air above them") is **fixed**. Do not touch these margins.
- **The warm token layer.** Paper #fdfbf8, ink #231a26 (16.30:1), ink-2 #544a58 (8.14:1), plum #7d2b4a (8.78:1), with warm plum-tinted shadows instead of neutral grey. Coherent, warm, never muddy.
- **The answer-first layer.** The .answer box genuinely gives the reader the summary before the prose, on the homepage and on /how-to-play. Keep the 4px accent bar and the tint.
- **Figures.** 17 figure elements and 35 figcaptions now emitted, bordered, rounded, shadowed and captioned. This alone moved the site from "text with pictures dropped in" to an illustrated guide.
- **Tables**, including the standout mobile restack to labelled cards with data-label verified as emitted (53 on /wiki). Do not simplify this back to a horizontal scroll.
- **The callout.** Verified rendering on /release-date; it reads as a designed callout, not a tinted paragraph.
- **The measured body text** on both platforms: 18.56px/31.92px at a 715px measure on desktop; 16.545px/28.457px at a 353px measure with an 18.4px gutter on mobile, with **no horizontal overflow** (longest line ends at x368 of 390). Tap targets are 94x44px.
- **The eyebrow bar alignment** — 26x2px bar, 8px gap, optically centred on the cap height to within 1px. Correct; just put it on the other sixteen pages.
- **The label/value typography inside the fact tiles**, and **the footer descriptive link anchors** (the words — fix the class, keep the labels). Both good patterns.

---

## Appendix — evidence

**Build state at review time.** public/assets/styles.css 21,508 bytes / 314 lines (md5 551b5ebd920b2a89f0dc111b671bd14a, identical to dist/assets/styles.css); src/lib/layout.mjs 10,395 bytes; src/lib/md.mjs 6,243 bytes; dist/ rebuilt 01:00:41. git status: all of dist/, public/assets/styles.css and src/lib/layout.mjs modified against HEAD.

**Renders used.** Current build served from dist/ on 127.0.0.1:4173; desktop captured at a true 1440 viewport; mobile captured at a true 390 viewport (390px iframe, because headless Chrome floors --window-size at 500px). Copies kept in **docs/ui-review/v2-current/** — the first captures in this project that include the footer, and the first true-390px mobile render.

**Geometry at 1440** (computed styles / getBoundingClientRect):

    wrap            150 … 1290     (1140 wide, gutter 36)
    article column  186 … 971      (785)
    TOC rail       1006 … 1246     (240)
    p max-width              715.21  -> right edge 901
    figure / .answer / .table-wrap / li -> right edge 971
    body 18.56px/31.92px Newsreader      h1 53.6px Fraunces
    h2 31.2px/36.8px, margin 52.8 / 15.6 h3 18.56px Inter

**Geometry at 390** (true viewport):

    container 390, gutter 18.4, content box 353 (18.4 … 371.6)
    body 16.545px/28.457px       h1 33.6px       nav-link 94 x 44
    .site-nav scrollWidth 656 inside a 353 box; border-top spans 0 … 352
    .site-head border-bottom spans 0 … 389   -> 38px gap
    facts grid-template-columns -> 353.219px  (a single column)
    article 1194 … 11732 · .toc 11756 … 12118 · footer 12179 … 13512

**Contrast** (WCAG 2.1, computed from the token values; backgrounds paper #fdfbf8, paper-2 #f7f1ec, surface-2 #fbf7f4):

    ink      16.30 / 15.03 / 15.81   pass
    plum      8.78 /  8.09 /  8.51   pass
    ink-2     8.14 /  7.51 /  7.89   pass
    ink-3     4.40 /  4.06 /  4.26   FAIL AA (needs 4.5)  -> #6e6377 gives 5.47 / 5.05 / 5.31
    rose      4.19 /  3.86 /  4.06   FAIL AA              -> #a8476a gives 5.39 / 4.97

**Component usage across the 17 built pages.** figure 17 · figcaption 35 · class="toc" 15 · has-toc 18 · class="answer" 11 · class="note" 8 · class="crumbs" 14 · class="facts" 1 · class="eyebrow" 1 · class="lede" 1 · class="card" 0 · class="btn" 0 · class="chip" 0 · class="faq" 0 · class="sources" 0 · class="pagenav" 0.