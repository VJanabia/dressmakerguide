#!/usr/bin/env node
/**
 * Renderer regression tests. The Markdown renderer has broken silently more than once - a bad
 * replacement ate the dollar sign off every price, and a slice boundary truncated every FAQ
 * section at its first question. Neither threw an error; both were caught by eye.
 *
 *   node scripts/test-renderer.mjs
 *
 * Runs in a couple of milliseconds and is wired to `npm test`.
 */
import { renderMarkdown } from '../src/lib/md.mjs';

let failed = 0;
function check(label, condition, detail) {
  if (condition) { console.log('  ok   ' + label); return; }
  failed++;
  console.log('  FAIL ' + label + (detail ? '\n       ' + detail : ''));
}

const cases = [];
const test = (name, fn) => cases.push([name, fn]);

test('prices survive bold markup', () => {
  const html = renderMarkdown('It costs **$14.99**, or **$13.49** at launch.');
  check('both prices intact', html.includes('$14.99') && html.includes('$13.49'), html);
  check('no truncated price fragments', !/\b[34]\.(99|49)\b/.test(html.replace(/\$1[34]\.(99|49)/g, '')), html);
});

test('the answer box renders from a Short answer blockquote', () => {
  const html = renderMarkdown('> Short answer: it costs **$14.99**.');
  check('renders as .answer', html.includes('<aside class="answer">'), html);
  check('the label is stripped', !/short answer/i.test(html), html);
  check('the price survives', html.includes('$14.99'), html);
});

test('a note stays a note', () => {
  const html = renderMarkdown('> Note: costs **$14.99**.');
  check('renders as .note', html.includes('<aside class="note'), html);
});

test('figures carry a visible caption', () => {
  const html = renderMarkdown('![alt text](/a.webp A caption here)');
  check('renders a figure', html.includes('<figure>'), html);
  check('the caption is visible text', html.includes('<figcaption>A caption here</figcaption>'), html);
  check('the alt is kept', html.includes('alt="alt text"'), html);
});

test('tables emit data-labels for the mobile restack', () => {
  const html = renderMarkdown('| A | B |\n|---|---|\n| 1 | 2 |');
  check('renders a table', html.includes('<table>'), html);
  check('cells carry their column name', html.includes('data-label="B"'), html);
});

test('a FAQ section becomes one list item per question', () => {
  const md = ['## Frequently asked questions', '', '### Q one?', '', 'A one.', '', '### Q two?', '', 'A two.', '', '## After', '', 'Body.'].join('\n');
  const html = renderMarkdown(md);
  check('renders an ol.faq', html.includes('<ol class="faq">'), html);
  check('two items', (html.match(/<li>/g) || []).length === 2, html);
  check('each item holds its own answer',
    (html.match(/<li><h3[^>]*>[^<]*<\/h3><p>[\s\S]*?<\/p><\/li>/g) || []).length === 2, html);
  check('the section heading is outside the list', !/<ol class="faq">\s*<h2/.test(html), html);
  check('the list closes before the next section', /<\/ol>\s*<h2 id="after"/.test(html), html);
});

test('section slicing keeps subsections with their parent', () => {
  const md = ['## Parent', '', 'Intro.', '', '### Child', '', 'Child body.', '', '## Sibling', '', 'Sibling body.'].join('\n');
  const html = renderMarkdown(md);
  check('the child heading survives', html.includes('<h3 id="child">'), html);
  check('the sibling section survives', html.includes('Sibling body.'), html);
  check('the parent is not swallowed by the child', /<h2 id="parent">[\s\S]*Intro\.[\s\S]*<h3 id="child">/.test(html), html);
});

test('headings keep their anchor ids', () => {
  const html = renderMarkdown('## How to play Dressmaker\n\ntext');
  check('id is slugged', html.includes('id="how-to-play-dressmaker"'), html);
});

test('inline markup still works', () => {
  const html = renderMarkdown('a [link](/demo) with **bold**, *em* and \`code\`');
  check('link', html.includes('href="/demo"'), html);
  check('bold', html.includes('<strong>bold</strong>'), html);
  check('em', html.includes('<em>em</em>'), html);
  check('code', html.includes('<code>code</code>'), html);
});

test('content is escaped', () => {
  const html = renderMarkdown('a <script>alert(1)</script> b');
  check('no raw script tag', !html.includes('<script>'), html);
});

console.log('renderer tests');
for (const [name, fn] of cases) { console.log(' ' + name); fn(); }
console.log(failed ? '\n' + failed + ' FAILURES' : '\nall renderer tests pass');
process.exit(failed ? 1 : 0);
