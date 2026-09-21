# Documentation-style rewrite brief

The site is changing from a blog-shaped guide to a **documentation/wiki-shaped guide**. The layout is
already done (left sidebar, centre article, right on-this-page rail, breadcrumbs). What is left is the
**content inside each page**: it must read like reference material you scan, not prose you read.

Target audience: US English readers arriving from Google with a specific question.

---

## The shape every page must now have

```
> Short answer: one or two sentences that fully answer the page's question. Keep it.

(your existing eyebrow / lede / facts fields stay as they are)

## <section>
Short lead-in: 1-2 sentences maximum. Then a table, steps, cards or callouts.
```

**A section is almost never three paragraphs.** If a section is currently prose, convert it to one of:

| Shape | Use it for | Markdown |
| --- | --- | --- |
| **Table** | anything comparable: fabrics, specs, fixes, options, versions, platforms | `| A | B |` with a `|---|---|` row |
| **Steps** | any procedure, in order | `::: steps` block (see below) |
| **Cards** | 3-6 short parallel items: choices, categories, "who should" lists | `::: cards` block |
| **Callout** | one key tip or one warning, lifted out of the prose | `> Tip: ...` / `> Warning: ...` |
| **Short list** | 3-6 bullets, each under 20 words, lead phrase in **bold** | `- **Lead.** rest` |

## The three components, exactly

**Steps** — one step per line, numbered, title in bold, body after a dash:

```
::: steps
1. **Read the brief** — occasion, taste and budget are all in the note.
2. **Draft in the sketchbook** - before you commit to any cloth.
3. **Preview on the mannequin** — this is the last free check you get.
:::
```

**Cards** — each card is an H3 title plus a short body:

```
::: cards
### Cotton
Cheap, forgiving, and the right first choice for practice dresses.
### Silk
Beautiful drape, unforgiving to cut. Save it for a commission that pays.
:::
```

**Callouts** — a blockquote whose first word is Tip, Warning or Note:

```
> Tip: preview every layout before you cut. Two seconds saves a bolt.

> Warning: cutting is permanent. There is no undo.
```

## Writing rules

1. **Cut the prose by half.** Target 700-1,100 words of visible text per page, down from 1,400-2,000.
   Delete any sentence that does not answer a question a player would type into Google.
2. **Short sentences.** Under 20 words. One idea each.
3. **Bold the scannable part.** Every bullet and step leads with a bold phrase.
4. **No paragraph longer than 3 sentences.** Split it or tabulate it.
5. **Prefer the table.** If two things are being compared in prose, it is a table.
6. **Every table needs a header row.** No table without column names.
7. **Do not invent facts.** Every number and claim must already exist on the page or in
   `docs/dressmaker-facts.md`. If you cannot verify something, say the developers have not published it.
8. **Keep every existing section's subject.** You are restructuring, not deleting topics.
9. **Keep the internal links.** Link to related pages with descriptive anchors, and keep at least one
   `[dressmaker game](/)` link per page.
10. **Keep the H2 headings meaningful** — they become the on-this-page rail.

## Output format

Rewrite the page module exactly as it exists now: same file path, same exported `page` object,
same `url`, `title`, `description`, `h1`, `eyebrow`, `lede`, `facts`, `crumbs`, `schema`, `sources`.
Only `body` changes, plus `facts` values if a table now carries that information better.

```js
const BODY = [
  "> Short answer: ...",
  "",
  "## First section",
  "",
  "One short lead-in line.",
  "",
  "::: steps",
  "1. **Step one** — what to do.",
  ":::",
  "",
  "| Column | Column |",
  "| --- | --- |",
  "| value | value |",
  "",
  "> Tip: the one thing that matters here.",
].join("\n")
  .split("\n").map((line) => resolveShots(line)).join("\n");
```

Note the ending: use `resolveShots` on the body, and keep any `![alt](@SHOT_x@ caption)` figure lines
that are already there (they render as captioned figures).

## Verify before you report

```bash
cd D:\DSH\dressmakerguide
node -e "import('./src/pages/YOURFILE.mjs').then(m=>console.log('OK', m.page.body.length))"
npm test
npm run build
npm run audit
```

`npm test` covers the renderer, `npm run audit` checks titles, alt text, FAQ/schema agreement and
internal links. Both must pass. Report: file path, new word count, how many tables/steps/cards/callouts
you produced, and anything you could not verify.
