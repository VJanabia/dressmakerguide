# Page authoring brief — dressmakerguide.com

You are writing ONE page of a static fan guide for the cozy dressmaking game **Dressmaker**.
The audience is US English readers arriving from Google search. The site competes with thin
fan wikis by being genuinely deeper and more useful, page by page.

## Hard rules
1. **US English, native voice.** Warm, concrete, second person. No machine-translation tone,
   no "in conclusion", no "whether you're a beginner or a pro". Short sentences. Specific nouns.
2. **Never invent facts.** Every number, date, price and feature must come from
   `dressmaker-facts.md` (read it first). If something is not in there, write that the
   developers have not published it. Do NOT invent customer names, fabric stats, patch notes,
   scores, review counts, sales, or versions.
3. **Length: 900–1,400 words of body prose.** Depth over padding. No filler paragraphs.
4. Structure the body with `##` H2 sections and `###` H3 subsections. Do not start the body
   with an H2 that repeats the H1; lead with 1–2 short paragraphs of real answer first.
5. Include at least one table or figure where it genuinely helps. Figures use
   `![alt text](@SHOT_x@)` with a token from the list you are given.
6. Internal links: link back to the homepage with the exact anchor `[dressmaker game](/) `
   (at least once, naturally), and link to 2–4 related pages with descriptive anchors.
   All links are root-relative (`/how-to-play`), never absolute to another domain unless quoting a source.
7. External links: only to the official URLs in the facts file. Use markdown links.
8. Never write a keywords meta tag. Never mention SEO, rankings or word counts.
9. Do not copy text from any other website. Write it yourself.
10. Do not use the official logo. Our brand is the site name only.

## Deadlines / dates
Today is **September 21, 2026** — the Steam launch day.

## Writing style examples
- Good: "Cutting is the point of no return. Once the shears go through the cloth, that fabric is spent."
- Bad: "Dressmaker offers players a truly immersive and engaging dressmaking experience that is sure to delight fans of the genre."
- Good: "Steam lists minimum specs only. No recommended tier is published, which usually means the minimum is genuinely enough."
- Bad: "The system requirements are quite reasonable and should run on most modern PCs."

## Output format
Write ONLY the page module file, exactly in this shape (ESM, no TypeScript):

```js
import { SHOTS } from '../data/images.mjs';
import { LINKS } from '../data/site.mjs';

const BODY = [
  "First paragraph...",
  "",
  "## First H2",
  "",
  "Prose...",
  "",
  "### H3 inside it",
  "",
  "More prose with a [link](/how-to-play) in it.",
].join("\n")
  .replaceAll('@SHOT_x@', SHOTS.x.src);

export const page = {
  url: '/your-url',
  title: '...',            // <= 60 chars, primary keyword first
  description: '...',      // <= 155 chars, natural sentence, includes the keyword
  h1: '...',               // exactly one H1, related to but not identical to the title
  updated: '2026-09-21',
  updatedHuman: 'September 21, 2026',
  ogType: 'article',
  crumbs: [{ name: 'Home', url: '/' }, { name: 'Your Page', url: '/your-url' }],
  schema: [ /* optional extra JSON-LD object(s); BreadcrumbList is added automatically */ ],
  body: BODY,
};
```

Markdown subset supported by the renderer:
`##`/`###`/`####` headings, paragraphs, `- ` bullets, `1. ` numbered lists,
`| a | b |` tables (with a `|---|---|` separator row, first column becomes a row header),
`> ` callouts, `**bold**`, `*italic*`, `[text](url)`, `![alt](src)`.
Do NOT use raw HTML. Do NOT use code fences. Do NOT use footnotes.

Use these `import` names only when you actually use the token: SHOTS.hero, SHOTS.cut, SHOTS.sew,
SHOTS.decorate, SHOTS.itch, SHOTS.itchCover (all have .src and descriptive alt text already
suitable for the topic — pick the one whose alt text matches your section).

Pages that already exist (link to these, do not rewrite them): `/`, `/demo`, `/release-date`,
`/how-to-play`, `/sewing-tips`, `/customers`, `/patch-notes`, `/system-requirements`,
`/games-like`, `/wiki`, `/troubleshooting`, `/about`, `/contact`, `/privacy`, `/disclaimer`.

When you are done, write the file with the write tool and then run
`node -e "import('./src/pages/YOURFILE.mjs').then(m=>console.log('OK', m.page.title.length))"`
from `D:\\DSH\\dressmakerguide` to prove it loads. Report: file path, word count, and anything
you could not verify.
