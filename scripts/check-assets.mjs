#!/usr/bin/env node
/**
 * Confirm every file the built pages reference actually exists in dist/.
 *
 *   node scripts/check-assets.mjs
 *
 * Catches the class of mistake where a page points at an icon, font, image or manifest that was
 * never copied into the build.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const pages = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) pages.push(full);
  }
};
walk(DIST);

const refs = new Map(); // path -> set of pages
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  for (const m of html.matchAll(/(?:href|src|content)="(\/[^"#?]+\.(?:png|svg|webp|woff2|css|js|webmanifest|ico|xml|txt))"/g)) {
    const url = m[1];
    if (!refs.has(url)) refs.set(url, new Set());
    refs.get(url).add('/' + path.relative(DIST, page).replace(/\\/g, '/'));
  }
  // srcset entries too
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url.startsWith('/')) {
        if (!refs.has(url)) refs.set(url, new Set());
        refs.get(url).add('/' + path.relative(DIST, page).replace(/\\/g, '/'));
      }
    }
  }
}

const missing = [];
for (const [url, users] of [...refs].sort()) {
  const file = path.join(DIST, decodeURIComponent(url));
  const ok = fs.existsSync(file);
  if (!ok) missing.push([url, [...users].slice(0, 3).join(', ')]);
}

console.log(refs.size + ' referenced assets checked across ' + pages.length + ' pages');
if (missing.length) {
  console.log('\nMISSING:');
  for (const [url, users] of missing) console.log('  ! ' + url + '   (used by ' + users + ')');
} else {
  console.log('every referenced asset is present');
}
process.exit(missing.length ? 1 : 0);
