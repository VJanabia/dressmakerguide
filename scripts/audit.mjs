#!/usr/bin/env node
/**
 * Post-build audit. Reads dist/ and checks the things that are easy to break:
 * unique titles/descriptions/canonicals, one H1 per page, alt text on every image,
 * valid JSON-LD, internal links that resolve, no orphan pages, no stray keywords meta.
 * Writes docs/audit-report.md and exits non-zero on any failure.
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

/* src path -> the single approved alt text for that picture. */
const { SHOTS } = await import('../src/data/images.mjs');
const REGISTRY_ALT = new Map(Object.values(SHOTS).map((s) => [s.src, s.alt]));
const problems = [];
const notes = [];
/* Utility pages are held to the technical checks (title, canonical, H1, links) but not to the
   editorial length targets, because nobody arrives on them from a search result. */
const AUDIT_EXEMPT = new Set(['/about', '/contact', '/privacy', '/disclaimer', '/404.html']);

/* Article body only: site chrome, breadcrumbs and JSON-LD are removed first, so the word
   count reflects what a reader actually gets on the page. */
const textOf = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<nav class="crumbs"[\s\S]*?<\/nav>/gi, ' ')
  .replace(/<header[\s\S]*?<\/header>/gi, ' ')
  .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&middot;/g, '.')
  .replace(/\s+/g, ' ').trim();

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await htmlFiles(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = await htmlFiles(dist);
const pages = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rel = '/' + path.relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  const url = rel === '/404.html' || rel === '/404' ? '/404.html' : (rel === '' ? '/' : rel);
  const title = (/<title>([\s\S]*?)<\/title>/.exec(html) || [, ''])[1];
  const desc = (/<meta name="description" content="([^"]*)"/.exec(html) || [, ''])[1];
  const canonical = (/<link rel="canonical" href="([^"]*)"/.exec(html) || [, ''])[1];
  const h1s = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g) || [];
  const h2s = html.match(/<h2[^>]*>/g) || [];
  const h3s = html.match(/<h3[^>]*>/g) || [];
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  const bodyText = textOf(html);
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => m[1]);

  if (/name="keywords"/i.test(html)) problems.push(url + ': contains a keywords meta tag (forbidden)');
  if (h1s.length !== 1) problems.push(url + ': expected exactly 1 H1, found ' + h1s.length);
  if (!title) problems.push(url + ': missing title');
  if (!desc) problems.push(url + ': missing meta description');
  if (title.length > 60 && url !== '/404.html') problems.push(url + ': title is ' + title.length + ' chars (target <= 60)');
  if (desc.length > 155 && !AUDIT_EXEMPT.has(url)) notes.push(url + ': description is ' + desc.length + ' chars (target <= 155)');
  if (!canonical) problems.push(url + ': missing canonical');
  for (const img of imgs) {
    if (!/\balt="/.test(img)) problems.push(url + ': image without alt -> ' + img.slice(0, 90));
    if (!/loading="lazy"/.test(img) && !/fetchpriority="high"/.test(img)) notes.push(url + ': image not lazy loaded -> ' + img.slice(0, 70));

    /* The alt text in page copy and the alt text in the registry must agree, otherwise a figure
       silently describes the wrong screenshot - which is exactly what happened the first time the
       image set was swapped. Registry alt wins; the page copy has to match it. */
    const src = (/<img[^>]*src="([^"]+)"/.exec(img) || [, ''])[1];
    const alt = (/<img[^>]*alt="([^"]*)"/.exec(img) || [, ''])[1];
    if (src && REGISTRY_ALT.has(src)) {
      const expected = REGISTRY_ALT.get(src);
      if (alt !== expected) {
        problems.push(url + ': alt text does not match the image registry for ' + src +
          '\n      page:     "' + alt + '"\n      registry: "' + expected + '"');
      }
    }
  }

  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const schemaTypes = [];
  const ldFaq = [];
  for (const block of ld) {
    try {
      const parsed = JSON.parse(block);
      const stack = [parsed];
      while (stack.length) {
        const node = stack.pop();
        if (Array.isArray(node)) stack.push(...node);
        else if (node && typeof node === 'object') {
          if (node['@type']) schemaTypes.push(...[].concat(node['@type']));
          if (node['@graph']) stack.push(...node['@graph']);
          if (node.mainEntity) stack.push(...[].concat(node.mainEntity));
          if (node['@type'] === 'FAQPage' && Array.isArray(node.mainEntity)) {
            for (const q of node.mainEntity) {
              ldFaq.push({ name: q.name, text: q.acceptedAnswer?.text || '' });
            }
          }
        }
      }
    } catch (e) { problems.push(url + ': invalid JSON-LD (' + e.message + ')'); }
  }

  /* FAQ answers must also appear as visible text: a FAQPage that promises content the page does
     not show is a structured-data violation, and it is easy to break when the two copies drift.
     The page copy carries markdown emphasis and typographic apostrophes, the schema copy does not,
     so both sides are normalised before comparing. */
  const norm = (t) => String(t)
    .replace(/\*\*|\*/g, '')
    .replace(/[\u2018\u2019\u201c\u201d"']/g, '')
    .replace(/&amp;/g, '&').replace(/&#39;/g, '').replace(/&quot;/g, '')
    // Stripping inline tags (links, emphasis) leaves a space before punctuation; ignore that.
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s+/g, ' ').trim();
  const bodyNorm = norm(bodyText);
  const headingTexts = [...html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/g)].map((m) => norm(m[1]));
  for (const item of ldFaq) {
    if (!headingTexts.includes(norm(item.name))) {
      problems.push(url + ': FAQ schema question has no matching visible heading -> "' + item.name.slice(0, 60) + '"');
    }
    const answer = norm(item.text);
    if (!bodyNorm.includes(answer)) {
      problems.push(url + ': FAQ schema answer is not visible on the page -> "' + item.text.slice(0, 70) + '..."');
    }
  }

  pages.push({ url, file: path.relative(root, file), title, titleLen: title.length, desc, descLen: desc.length, canonical, h1: h1s.length ? textOf(h1s[0]) : '', h1Count: h1s.length, h2: h2s.length, h3: h3s.length, imgs: imgs.length, words: bodyText.split(' ').filter(Boolean).length, schema: [...new Set(schemaTypes)], links, text: bodyText });
}

// internal link resolution
const urls = new Set(pages.map((p) => p.url));
for (const p of pages) {
  for (const href of p.links) {
    if (/^(https?:|mailto:|#|tel:)/.test(href)) continue;
    const clean = href.replace(/[#?].*$/, '').replace(/\/$/, '') || '/';
    if (!urls.has(clean) && clean !== '/404.html') problems.push(p.url + ': broken internal link -> ' + href);
  }
}

// orphan check: every page must be linked from at least one other page, and must link home
for (const p of pages) {
  if (p.url === '/404.html') continue;
  const inbound = pages.filter((q) => q !== p && q.links.some((h) => (h.replace(/\/$/, '') || '/') === p.url));
  if (!inbound.length) problems.push(p.url + ': orphan page (no internal links point to it)');
  if (p.url !== '/' && !p.links.some((h) => (h.replace(/\/$/, '') || '/') === '/')) problems.push(p.url + ': does not link back to the homepage');
  if (p.words < 700 && !AUDIT_EXEMPT.has(p.url)) problems.push(p.url + ': only ' + p.words + ' words of body text');
  if (p.words > 1400 && !AUDIT_EXEMPT.has(p.url) && p.url !== '/') notes.push(p.url + ': ' + p.words + ' words of body text (style target is 800-1200; long is fine when every section earns its place)');
}

const dupTitles = pages.map((p) => p.title).filter((t, i, a) => t && a.indexOf(t) !== i);
if (dupTitles.length) problems.push('duplicate titles: ' + [...new Set(dupTitles)].join(' | '));
const dupDesc = pages.map((p) => p.desc).filter((t, i, a) => t && a.indexOf(t) !== i);
if (dupDesc.length) problems.push('duplicate descriptions: ' + [...new Set(dupDesc)].join(' | '));
const dupCanon = pages.map((p) => p.canonical).filter((t, i, a) => t && a.indexOf(t) !== i);
if (dupCanon.length) problems.push('duplicate canonicals: ' + [...new Set(dupCanon)].join(' | '));

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://dressmakerguide.com', '').replace(/\/$/, '') || '/');
for (const p of pages) {
  if (p.url === '/404.html') continue;
  const inSitemap = sitemapUrls.includes(p.url);
  if (!inSitemap && !['/about', '/contact', '/privacy', '/disclaimer'].includes(p.url)) problems.push(p.url + ': missing from sitemap.xml');
}
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
if (!/Sitemap: https:\/\/dressmakerguide\.com\/sitemap\.xml/.test(robots)) problems.push('robots.txt does not point at the sitemap');

const totalWords = pages.reduce((a, p) => a + p.words, 0);
const rows = pages
  .sort((a, b) => (a.url === '/' ? -1 : b.url === '/' ? 1 : a.url.localeCompare(b.url)))
  .map((p) => '| \`' + p.url + '\` | ' + p.titleLen + ' | ' + p.descLen + ' | ' + p.h1Count + ' | ' + p.h2 + ' | ' + p.h3 + ' | ' + p.imgs + ' | ' + p.words + ' | ' + p.schema.join(', ') + ' |')
  .join('\n');

const report = [
  '# Build audit - dressmakerguide.com',
  '',
  'Generated by \`node scripts/audit.mjs\` on ' + new Date().toISOString().slice(0, 10) + '.',
  '',
  pages.length + ' HTML files, ' + totalWords.toLocaleString('en-US') + ' words of body text in total.',
  '',
  '| URL | Title len | Desc len | H1 | H2 | H3 | Images | Body words | JSON-LD types |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  rows,
  '',
  '## Page inventory',
  '',
  ...pages.sort((a, b) => (a.url === '/' ? -1 : b.url === '/' ? 1 : a.url.localeCompare(b.url))).flatMap((p) => [
    '### ' + p.url,
    '',
    '- Title (' + p.titleLen + ' chars): ' + p.title,
    '- Description (' + p.descLen + ' chars): ' + p.desc,
    '- H1: ' + p.h1,
    '- Canonical: ' + p.canonical,
    '- Words of body text: ' + p.words,
    '- Structured data: ' + (p.schema.join(', ') || 'BreadcrumbList only'),
    '',
  ]),
  '## Problems',
  '',
  problems.length ? problems.map((x) => '- ' + x).join('\n') : 'None. Every check passed.',
  '',
  '## Notes (non-fatal)',
  '',
  notes.length ? [...new Set(notes)].map((x) => '- ' + x).join('\n') : 'None.',
  '',
].join('\n');

await writeFile(path.join(root, 'docs', 'audit-report.md'), report, 'utf8');
console.log(report.split('## Problems')[0].split('## Page inventory')[0]);
console.log('Problems: ' + problems.length);
for (const p of problems) console.log('  ! ' + p);
console.log('Notes: ' + new Set(notes).size);
console.log('Report written to docs/audit-report.md');
if (problems.length) process.exitCode = 1;
