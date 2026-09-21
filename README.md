# dressmakerguide.com

A fast, static, SEO-first fan guide to **Dressmaker** — the cozy dressmaking simulation game
from Jonathan Hau-Yoon (elyaradine), Sara Laubscher (sarandipityx) and Ruan Rothmann (raithza),
published by Free Lives under the Cozy Lives label. Steam App ID 4019220.

Unofficial. Not affiliated with the developers. See `/disclaimer`.

Repository: https://github.com/VJanabia/dressmakerguide - live at https://dressmakerguide.com

---

## Why it is built this way

- **Fully server-rendered HTML.** `scripts/build.mjs` renders every page to plain HTML in `dist/`.
  View source on any deployed page and the entire article is there. No client-side rendering,
  no hydration, no framework runtime. Googlebot and AdSense see exactly what you see.
- **Zero runtime dependencies.** The whole site is a build script and hand-written Markdown-ish content
  modules. Nothing to patch, nothing to break, nothing to upgrade every quarter.
- **Deployable anywhere that serves files.** Built for Cloudflare Pages (or Netlify / Vercel / S3).
- **Content is data.** Each page is one module in `src/pages/` exporting a `page` object:
  title, description, H1, breadcrumbs, JSON-LD, body.

## Commands

```bash
npm run build          # render every page into dist/, plus sitemap.xml, robots.txt, 404.html
npm run audit          # post-build SEO/HTML checks -> docs/audit-report.md (exit 1 on failure)
npm run verify         # boot the built site and prove every page serves its text without JS
npm run serve          # preview dist/ at http://127.0.0.1:4173
python scripts/fetch-images.py  # re-download the official screenshots as local WebP
python scripts/make-images.py   # regenerate og-default.png and the touch icon
```

Typical loop: `npm run build && npm run audit && npm run verify`, then `npm run serve` to eyeball it.

## Pages shipped (16 HTML files)

The homepage plus ten content pages, four compliance pages and a 404:

- `/` - dressmaker game
- `/how-to-play` - how to play dressmaker
- `/sewing-tips` - dressmaker guide
- `/customers` - dressmaker customer preferences
- `/wiki` - dressmaker wiki
- `/release-date` - dressmaker steam
- `/demo` - dressmaker demo
- `/system-requirements` - dressmaker system requirements
- `/patch-notes` - dressmaker patch notes
- `/troubleshooting` - dressmaker troubleshooting
- `/games-like` - games like dressmaker
- `/about`, `/contact`, `/privacy`, `/disclaimer` - utility and compliance pages
- `/404.html` - not found

## Layout

```
src/data/site.mjs        domain, official links, GA4 id, last-updated date
src/data/images.mjs      image registry (official screenshots + alt text)
src/lib/md.mjs           the small Markdown subset the content uses
src/lib/layout.mjs       HTML shell: head, nav, breadcrumbs, footer, JSON-LD
src/pages/*.mjs          one module per page = the content
public/                  styles.css, favicon, og image, touch icon
scripts/build.mjs        static site generator
scripts/audit.mjs        post-build verification
docs/dressmaker-facts.md verified facts and, more importantly, what is NOT verified
docs/page-brief.md       the writing rules used for every page
docs/audit-report.md     generated: per-page title/H1/word count/schema inventory
```

## Adding a page

1. Copy an existing file in `src/pages/`, change `url`, `title`, `description`, `h1`, `crumbs`, `body`.
2. Add it to the footer link lists in `src/lib/layout.mjs` and, if it belongs in the main nav, to `NAV`.
3. Link to it from at least one other page with a descriptive anchor (the audit fails on orphan pages).
4. `npm run build && npm run audit`.

Pages added to the sitemap automatically; `/about`, `/contact`, `/privacy` and `/disclaimer` are
deliberately excluded from the sitemap but stay indexable.

## Content rules this repo enforces

- No `keywords` meta tag anywhere (the audit fails if one appears).
- Exactly one `<h1>` per page.
- Title ≤ 60 characters, description ≤ 155 characters, both unique.
- Every image has `alt`, plus `loading="lazy"` (or `fetchpriority="high"` for the hero).
- No page under 700 words of body text; the guide pages run 1,200-1,800 words.
- Every page links back to `/` with the anchor **dressmaker game** — no orphan pages.
- Every internal link must resolve to a built page.
- JSON-LD: `VideoGame` on game pages, `FAQPage` where there is a real FAQ, `BreadcrumbList` sitewide.
- `FAQPage` honesty: every schema question must also exist as a visible H2-H4 heading, and every
  schema answer must appear as visible text on the same page. A FAQ that promises content the page
  never shows is a structured-data violation, and the two copies drift easily when page copy is edited.

Deliberately **not** built: `/play-online` and `/mobile-apk`. There is no official browser version
and no official mobile version of Dressmaker, so those pages would be fabricated content. The
homepage says so explicitly instead.

## Images

`src/data/images.mjs` is the single source of truth. It maps eight named slots to the developers' own
official screenshots, downloaded by `scripts/fetch-images.py` from Steam's CDN and re-encoded as local
WebP in `public/assets/shots/`. Nothing is hotlinked, so the pages stay fast and independent. The art
belongs to the developers and is credited in the footer.

Two rules keep the figures honest:

1. **Resolve tokens with the shared helper.** A page writes `![alt](@SHOT_cut@)` and joins its body through
   `resolveShots()` from the registry. Do not hand-write a `replaceAll` chain per image; that is how
   the alt text drifted out of sync the first time round.
2. **The alt text in page copy must equal the registry alt for that file.** `npm run audit` fails if they
   differ, and prints both strings. A figure that describes the wrong screenshot is worse than a figure with
   no alt at all.

The alt strings were written from a read of the actual pixels by a vision model (see
`docs/shot-alt-text.json` for the scene notes). They deliberately avoid quoting fine-grained on-screen
UI text, which is the least reliable part of any automated read. If you replace a screenshot, update the
registry entry first and then run `npm run audit` to find every page that needs to follow.

The scene descriptions behind those alts were produced by posting the eight screenshots to a vision model
(the GLM endpoint configured in this environment) with a second model cross-checking and a blank-image
control test. **Disclosure:** that means the public Steam screenshots were sent to a third-party API; no
site data, analytics or user information was involved. Scene notes and provenance are kept in
`docs/shot-alt-text.json`. Word-level UI strings from that read are the least reliable part of it, so
they are quoted nowhere on the site without independent confirmation.
Word-level UI strings from that read are the least reliable part of it, so the load-bearing numbers were
then cross-checked by a second pass: two models, multiple crop scales and an **anti-priming control** that fed
the models a synthetic requirements box with deliberately wrong values and confirmed they read back the wrong
numbers rather than the expected ones. The claim table is in `docs/shot-verification.md`.

That pass is why the site can now describe the attribute targets a commission is scored against
(`Quality 70, Flowers 60, Cute 30, Romantic 45` and the shop-side limits) instead of claiming no scoring
system exists. Four caveats from it are honoured in the copy: the currency glyph is unidentified, the
progress-versus-limit reading of `0/80` is an inference from notation, the per-star count is not defensible
from a crop, and unverified UI values are not quoted anywhere.
## Target keywords: one page, one term (per-page map)

| URL | Primary keyword | Title | H1 |
| --- | --- | --- | --- |
| `/404` | utility page | Page not found | Dressmaker Guide | That page is not on the pattern table |
| `/about` | utility page | About Dressmaker Guide: Who Writes This Fan Site | About This Site |
| `/contact` | utility page | Contact Dressmaker Guide: Corrections & Questions | Contact |
| `/customers` | dressmaker customer preferences | Dressmaker Customer Preferences: How to Read a Brief | Dressmaker Customer Preferences |
| `/demo` | dressmaker demo | Dressmaker Demo: Free Prototype Download on itch.io | Dressmaker Demo and Free Download |
| `/disclaimer` | utility page | Disclaimer | Dressmaker Guide Fan Site | Disclaimer |
| `/games-like` | games like dressmaker | Games Like Dressmaker: 10 Cozy Crafting Picks | Games Like Dressmaker |
| `/how-to-play` | how to play dressmaker | How to Play Dressmaker: Cutting, Sewing & Scoring | How to Play Dressmaker |
| `/` | dressmaker game | Dressmaker Game: How to Play, Release Date & Tips | Dressmaker Game |
| `/patch-notes` | dressmaker patch notes | Dressmaker Patch Notes & Update History | Dressmaker Patch Notes and Update History |
| `/privacy` | utility page | Privacy Policy | Dressmaker Guide | Privacy Policy |
| `/release-date` | dressmaker steam | Dressmaker Steam: Release Date, Price & Platforms | Dressmaker Steam Release Date and Price |
| `/sewing-tips` | dressmaker guide | Dressmaker Guide: Sewing Tips for Better Dresses | Dressmaker Guide: Sewing Tips and Pattern Advice |
| `/system-requirements` | dressmaker system requirements | Dressmaker System Requirements: PC & Mac Specs | Dressmaker System Requirements |
| `/troubleshooting` | dressmaker troubleshooting | Dressmaker Troubleshooting: Common Fixes | Dressmaker Troubleshooting |
| `/wiki` | dressmaker wiki | Dressmaker Wiki: Fabrics, Patterns & Accessories | Dressmaker Wiki |

Word counts, description lengths and structured-data types per page are listed in `docs/audit-report.md`,
regenerated by every `npm run audit`.
## Deploy

`dist/` is committed, so the site deploys with **no build step at all**. That is deliberate: the
generator has zero dependencies, so a build runner adds nothing but a failure mode.

### Why Cloudflare Pages, not Vercel

| | Cloudflare Pages | Vercel (Hobby) |
| --- | --- | --- |
| Cost for this site | Free, unlimited bandwidth and requests | Free tier capped at 100 GB bandwidth/month |
| AdSense-friendly | No commercial-use restriction | Hobby is **non-commercial** by ToS; ad revenue pushes you to Pro at $20/mo |
| Redirect rules for www to apex | Built in | Needs `vercel.json` |
| DNS + SSL + Always Use HTTPS | Same dashboard as the domain | Needs nameserver delegation to Vercel |
| Bandwidth spikes | Not billed | Overage risk |

**Use Cloudflare Pages.** The decisive factor is the AdSense plan: monetising a Vercel Hobby deployment
is against their terms, and this site exists to run ads. If you ever need preview builds per pull request,
both do it, so that is not a reason to switch.

### Cloudflare Pages setup

1. Push this repository to GitHub.
2. Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git, pick the repo.
3. Build command: **leave empty**. Output directory: **`dist`**. (If you prefer to build in CI,
   `npm run build` works too, and needs nothing but Node - the two Python scripts are only for
   regenerating images, and their output is committed.)
4. Custom domains: add `dressmakerguide.com`, then `www.dressmakerguide.com`.
5. Redirect rule so the www host never serves a duplicate: if `http.host eq "www.dressmakerguide.com"`
   then **301** to `https://dressmakerguide.com` + path. A Bulk Redirect or a single Dynamic Redirect
   both work; keep it to one hop.
6. SSL/TLS -> Edge Certificates -> enable **Always Use HTTPS** (this is the http -> https redirect).
7. Verify: `http://www.dressmakerguide.com/` and `http://dressmakerguide.com/` both land on
   `https://dressmakerguide.com/` in a single hop, and `https://dressmakerguide.com/sitemap.xml` returns XML.

`dist/_headers` is picked up automatically and sets long-lived caching for `/assets/*` plus a few
security headers. Netlify would need a `_redirects` line instead; Vercel would need `vercel.json`.
## Post-deploy checklist

- [ ] `https://dressmakerguide.com/sitemap.xml` returns the XML with all pages and today's `lastmod`.
- [ ] `https://dressmakerguide.com/robots.txt` allows everything and points at the sitemap.
- [ ] `view-source:` any page shows the full article text without JavaScript.
- [ ] Google Search Console: add the domain property, verify by DNS TXT, submit `sitemap.xml`.
- [ ] GSC → URL Inspection → Request Indexing for `/` and the four guide pages.
- [ ] GA4: create the property, then set `ga4Id` in `src/data/site.mjs` and rebuild.
- [ ] AdSense: apply once the site has been live and indexed for a few days; add `ads.txt` from the AdSense dashboard.
- [ ] Add a `/contact` email that actually receives mail (currently `hello@dressmakerguide.com`).
- [ ] Re-check the Steam page for price and spec changes monthly; update `docs/dressmaker-facts.md` first.

## Maintenance

The facts live in one place: `docs/dressmaker-facts.md`. When the developers publish something new —
a patch, a price change, new content — update the facts sheet, then update the affected pages, then
run `npm run build && npm run audit`. Never edit a page to add a number that is not in the facts sheet.
