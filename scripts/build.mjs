#!/usr/bin/env node
/**
 * Dressmaker Guide - static site generator.
 * Zero dependencies: renders every page to fully server-side HTML in dist/,
 * then writes sitemap.xml, robots.txt and a 404 page.
 *
 *   node scripts/build.mjs
 */
import { readdir, readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE, LINKS } from '../src/data/site.mjs';
import { renderPage } from '../src/lib/layout.mjs';
import { notFoundPage } from '../src/pages/404.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const src = path.join(root, 'src');

const SITEMAP_EXCLUDE = new Set(['/about', '/contact', '/privacy', '/disclaimer']);

async function loadPages() {
  const dir = path.join(src, 'pages');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.mjs') && f !== '404.mjs').sort();
  const pages = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(dir, f)).href);
    if (!mod.page) throw new Error(f + ' does not export a page object');
    pages.push(mod.page);
  }
  return pages;
}

function sitemapXml(pages) {
  const rows = pages
    .filter((p) => !SITEMAP_EXCLUDE.has(p.url))
    .map((p) => {
      const loc = SITE.origin + (p.url === '/' ? '/' : p.url + '/');
      const priority = p.url === '/' ? '1.0' : '0.8';
      return '  <url>\n' +
        '    <loc>' + loc + '</loc>\n' +
        '    <lastmod>' + (p.updated || SITE.contentUpdated) + '</lastmod>\n' +
        '    <changefreq>' + (p.changefreq || 'monthly') + '</changefreq>\n' +
        '    <priority>' + priority + '</priority>\n' +
        '  </url>';
    }).join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + rows + '\n</urlset>\n';
}

const robotsTxt = [
  '# ' + SITE.domain,
  'User-agent: *',
  'Allow: /',
  '',
  '# Ads and analytics crawlers used by Google AdSense must be able to read the site.',
  'User-agent: Mediapartners-Google',
  'Allow: /',
  '',
  'User-agent: AdsBot-Google',
  'Allow: /',
  '',
  'Sitemap: ' + SITE.origin + '/sitemap.xml',
  '',
].join('\n');

async function findStale(dir, expected) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await findStale(full, expected));
    else if (e.name.endsWith('.html') && !expected.has(full)) out.push(full);
  }
  return out;
}

async function main() {
  const t0 = Date.now();
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  const pages = await loadPages();
  const written = [];

  for (const page of pages) {
    const html = renderPage(page);
    const dir = page.url === '/' ? dist : path.join(dist, page.url.replace(/^\//, ''));
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, 'index.html');
    await writeFile(file, html, 'utf8');
    written.push({ url: page.url, file, html, page });
  }

  // 404 - served by Cloudflare Pages / Netlify for unknown paths.
  await writeFile(path.join(dist, '404.html'), renderPage(notFoundPage), 'utf8');
  written.push({ url: '/404', file: path.join(dist, '404.html'), html: renderPage(notFoundPage), page: notFoundPage });

  await writeFile(path.join(dist, 'sitemap.xml'), sitemapXml(pages), 'utf8');
  await writeFile(path.join(dist, 'robots.txt'), robotsTxt, 'utf8');
  await writeFile(path.join(dist, '_headers'), [
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  X-Frame-Options: SAMEORIGIN',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
  ].join('\n'), 'utf8');

  // Copy everything in public/ into dist/ (styles, screenshots, favicon, ads.txt, llms.txt).
  // Data driven, so adding a file to public/ never needs a build-script change.
  const publicDir = path.join(root, 'public');
  const publicEntries = await readdir(publicDir, { withFileTypes: true });
  for (const entry of publicEntries) {
    if (entry.name === 'dist') continue;
    await cp(path.join(publicDir, entry.name), path.join(dist, entry.name), { recursive: true });
  }

  const stale = await findStale(dist, new Set(written.map((w) => w.file)));
  const bytes = (await Promise.all(written.map(async (w) => (await stat(w.file)).size))).reduce((a, b) => a + b, 0);

  console.log('Built ' + written.length + ' HTML pages in ' + (Date.now() - t0) + 'ms (' + Math.round(bytes / 1024) + ' KB)');
  for (const w of written) console.log('  ' + w.url.padEnd(24) + Math.round(w.html.length / 1024) + ' KB');
  console.log('  /sitemap.xml, /robots.txt, /404.html');
  if (stale.length) console.log('  note: ' + stale.length + ' stale html file(s) left in dist');
}

main().catch((err) => { console.error(err); process.exit(1); });
