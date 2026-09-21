import { SITE, LINKS } from '../data/site.mjs';
import { renderMarkdown } from './md.mjs';

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ICON = '<svg class="mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path fill="#9c3d5f" d="M16 2.5 7 9.5v4.2l9-3.4 9 3.4V9.5z"/><path fill="none" stroke="#c2708f" stroke-width="2" stroke-dasharray="3 3" d="M4 20h24"/><path fill="#e8b7c8" d="M8 22h16l3 7H5z"/></svg>';

/* Global navigation. Every page links home with the exact-match anchor "dressmaker game",
   which is the rule that keeps the site from having orphan pages. */
const NAV = [
  ['/how-to-play', 'How to Play'],
  ['/sewing-tips', 'Sewing Tips'],
  ['/customers', 'Customers'],
  ['/wiki', 'Wiki'],
  ['/release-date', 'Release'],
  ['/demo', 'Demo'],
  ['/patch-notes', 'Patch Notes'],
  ['/games-like', 'Games Like It'],
];

const FOOT_COLS = [
  ['Start here', [
    ['/', 'dressmaker game'],
    ['/how-to-play', 'How to play Dressmaker'],
    ['/sewing-tips', 'Dressmaker guide: sewing tips'],
    ['/customers', 'Dressmaker customer preferences'],
    ['/wiki', 'Dressmaker wiki'],
  ]],
  ['Buy &amp; play', [
    ['/release-date', 'Dressmaker Steam release date'],
    ['/demo', 'Dressmaker demo download'],
    ['/system-requirements', 'Dressmaker system requirements'],
    ['/troubleshooting', 'Dressmaker troubleshooting'],
    ['/patch-notes', 'Dressmaker patch notes'],
  ]],
  ['More', [
    ['/games-like', 'Games like Dressmaker'],
    ['/about', 'About this site'],
    ['/contact', 'Contact'],
    ['/privacy', 'Privacy policy'],
    ['/disclaimer', 'Disclaimer'],
  ]],
];

function crumbsHtml(crumbs) {
  if (!crumbs || crumbs.length < 2) return '';
  const items = crumbs.map((c, idx) => {
    const last = idx === crumbs.length - 1;
    return '<li>' + (last ? '<span aria-current="page">' + c.name + '</span>' : '<a href="' + c.url + '">' + c.name + '</a>') + '</li>';
  }).join('');
  return '<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>' + items + '</ol></nav>';
}

export function breadcrumbLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: SITE.origin + (c.url === '/' ? '/' : c.url + '/'),
    })),
  };
}

export function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '') },
    })),
  };
}

export function renderPage(page) {
  const url = SITE.origin + (page.url === '/' ? '/' : page.url + '/');
  const social = (page.socialImage || (SITE.origin + '/assets/og-default.png'));
  const graph = [];
  if (page.schema) graph.push(...[].concat(page.schema));
  if (page.crumbs && page.crumbs.length > 1) graph.push(breadcrumbLd(page.crumbs));

  const head = [
    '<!DOCTYPE html>',
    '<html lang="' + SITE.lang + '">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>' + escAttr(page.title) + '</title>',
    '<meta name="description" content="' + escAttr(page.description) + '">',
    '<link rel="canonical" href="' + url + '">',
    '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">',
    '<meta property="og:type" content="' + (page.ogType || 'website') + '">',
    '<meta property="og:site_name" content="' + SITE.name + '">',
    '<meta property="og:locale" content="' + SITE.locale + '">',
    '<meta property="og:title" content="' + escAttr(page.ogTitle || page.title) + '">',
    '<meta property="og:description" content="' + escAttr(page.description) + '">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:image" content="' + social + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="theme-color" content="#9c3d5f">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">',
    '<link rel="stylesheet" href="/assets/styles.css">',
    page.preload ? '<link rel="preload" as="image" href="' + escAttr(page.preload) + '" fetchpriority="high">' : '',
    SITE.ga4Id ? '<script async src="https://www.googletagmanager.com/gtag/js?id=' + SITE.ga4Id + '"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","' + SITE.ga4Id + '");</script>' : '',
    graph.length ? '<script type="application/ld+json">' + JSON.stringify(graph.length === 1 ? graph[0] : { '@context': 'https://schema.org', '@graph': graph }) + '</script>' : '',
    '</head>',
    '<body>',
    '<a class="skip" href="#main">Skip to content</a>',
    '<header class="site-head">',
    '<div class="wrap">',
    '<a class="brand" href="/">' + ICON + '<span>' + SITE.name + '<small>Fan guide</small></span></a>',
    '<nav class="site-nav" aria-label="Main">' + NAV.map(([href, label]) =>
      '<a class="nav-link" href="' + href + '"' + (page.url === href ? ' aria-current="page"' : '') + '>' + label + '</a>').join('') + '</nav>',
    '</div>',
    '</header>',
    crumbsHtml(page.crumbs),
    '<main id="main">',
    '<div class="wrap prose">',
    '<h1>' + page.h1 + '</h1>',
    page.updated ? '<p class="updated">Last updated <time datetime="' + page.updated + '">' + page.updatedHuman + '</time>. Dressmaker is a fan-made guide and is not affiliated with the developers.</p>' : '',
    renderMarkdown(page.body),
    '</div>',
    '</main>',
    '<footer class="site-foot">',
    '<div class="wrap">',
    '<div class="foot-grid">',
    FOOT_COLS.map(([title, links]) => '<div><h2>' + title + '</h2><ul>' + links.map(([href, label]) =>
      '<li><a href="' + href + '">' + label + '</a></li>').join('') + '</ul></div>').join(''),
    '<div><h2>Official links</h2><ul>' +
      '<li><a href="' + LINKS.steam + '" target="_blank" rel="noopener">Dressmaker on Steam</a></li>' +
      '<li><a href="' + LINKS.itch + '" target="_blank" rel="noopener">Dressmaker prototype on itch.io</a></li>' +
      '<li><a href="' + LINKS.steamNews + '" target="_blank" rel="noopener">Official Steam announcements</a></li>' +
      '<li><a href="' + LINKS.itchDevlog + '" target="_blank" rel="noopener">Official itch.io devlog</a></li>' +
    '</ul></div>',
    '</div>',
    '<div class="disclaimer">',
    '<p><strong>Dressmaker Guide is an unofficial fan site.</strong> We are not affiliated with, endorsed by or sponsored by the Dressmaker development team, Cozy Lives, Free Lives, Valve or itch.io. Dressmaker and all related names, artwork and screenshots are the property of their respective owners and are used here for identification, commentary and review.</p>',
    '<p>Facts on this site are checked against the official Steam store page and the official itch.io page and devlog. Where a detail has not been announced officially, we say so instead of guessing. Spotted something out of date? <a href="/contact">Tell us</a>.</p>',
    '<p>&copy; ' + new Date().getFullYear() + ' dressmakerguide.com &middot; Content last reviewed <time datetime="' + SITE.contentUpdated + '">' + SITE.contentUpdated + '</time>.</p>',
    '</div>',
    '</div>',
    '</footer>',
    '</body>',
    '</html>',
  ].filter(Boolean).join('\n');

  return head;
}
