#!/usr/bin/env node
/**
 * Live smoke test. Boots the built site on a port, requests every URL in the sitemap,
 * and proves each page returns 200 with its article text already in the HTML payload
 * (no JavaScript executed), plus the sitemap, robots.txt and 404 behaviour.
 *
 *   node scripts/verify.mjs
 */
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4319;
const base = 'http://127.0.0.1:' + PORT;
const fails = [];

const sitemap = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>https:\/\/dressmakerguide\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/');

const server = spawn(process.execPath, [path.join(root, 'scripts', 'serve.mjs'), String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));

const strip = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();

async function check(url, expectStatus = 200) {
  const res = await fetch(base + url, { redirect: 'manual' });
  const html = res.headers.get('content-type')?.includes('html') ? await res.text() : '';
  if (res.status !== expectStatus) fails.push(url + ': expected ' + expectStatus + ', got ' + res.status);
  if (expectStatus === 200 && html) {
    const text = strip(html);
    if (text.split(' ').length < 400) fails.push(url + ': only ' + text.split(' ').length + ' words served without JS');
    if (!/<h1[^>]*>/.test(html)) fails.push(url + ': no H1 in served HTML');
    if (!/<link rel="canonical"/.test(html)) fails.push(url + ': no canonical in served HTML');
    if (/<div id="(root|app)"><\/div>/.test(html)) fails.push(url + ': empty client-render shell detected');
    console.log('  200 ' + url.padEnd(24) + text.split(' ').length + ' words, ' + Math.round(html.length / 1024) + ' KB');
  } else {
    console.log('  ' + res.status + ' ' + url);
  }
  return html;
}

console.log('Serving dist/ on ' + base);
for (const u of urls) await check(u);
await check('/robots.txt');
await check('/sitemap.xml');
await check('/ads.txt');
await check('/llms.txt');
await check('/assets/shots/shot1.webp');
await check('/this-page-does-not-exist', 404);

const robots = await (await fetch(base + '/robots.txt')).text();
if (!robots.includes('Sitemap: https://dressmakerguide.com/sitemap.xml')) fails.push('robots.txt missing sitemap line');

server.kill();
console.log('\n' + (fails.length ? 'FAILURES:\n' + fails.map((f) => '  ! ' + f).join('\n') : 'All live checks passed: every page serves full text without JavaScript.'));
process.exitCode = fails.length ? 1 : 0;
