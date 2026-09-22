import { SITE, LINKS } from '../data/site.mjs';
import { renderMarkdown } from './md.mjs';

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* The site mark: the dress artwork from assets-source/dress.jpg, scaled by scripts/make-icons.py.
   Decorative, so the alt is empty - the site name sits next to it as text. */
const ICON = '<img class="mark" src="/assets/dress-96.webp" srcset="/assets/dress-96.webp 1x, /assets/dress-192.webp 2x" ' +
  'width="34" height="34" alt="" decoding="async">';

/* Global navigation. Every page links home with the exact-match anchor "dressmaker game",
   which is the rule that keeps the site from having orphan pages. */
/* Sidebar navigation, grouped the way a guide site is browsed rather than the order pages were
   written. Rendered on every page so the whole structure is one click away, and so no page is an
   orphan. The current page is marked with aria-current. */
const NAV_GROUPS = [
  ['Start here', [
    ['/', 'Dressmaker game'],
    ['/how-to-play', 'How to play'],
    ['/sewing-tips', 'Sewing tips'],
    ['/customers', 'Customers'],
  ]],
  ['Reference', [
    ['/wiki', 'Wiki and tables'],
    ['/system-requirements', 'System requirements'],
    ['/troubleshooting', 'Troubleshooting'],
  ]],
  ['Release', [
    ['/release-date', 'Steam release date'],
    ['/demo', 'Demo download'],
    ['/patch-notes', 'Patch notes'],
    ['/games-like', 'Games like Dressmaker'],
  ]],
];

/* The strip in the header: the few pages a first-time visitor needs. */
const NAV = [
  ['/how-to-play', 'How to Play'],
  ['/sewing-tips', 'Tips'],
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



/* The fact strip under a page head: at-a-glance answers for the reader and for a featured snippet.
   Entries are [label, value] pairs supplied by the page, so nothing here is invented. */
function factsHtml(facts) {
  return '<ul class="facts">' + facts.map(([k, v]) =>
    '<li><span class="k">' + k + '</span><span class="v">' + v + '</span></li>').join('') + '</ul>';
}


/* Sources: the official pages a page's claims were checked against. Curated per page rather than
   scraped, so it is a short honest list and not a dump of every outbound link. */
function sourcesHtml(sources) {
  return '<aside class="sources"><h2>Where this came from</h2><ul>' +
    sources.map(([label, url]) =>
      '<li><a href="' + url + '" target="_blank" rel="noopener">' + label + '</a></li>').join('') +
    '</ul></aside>';
}


/* The left rail. Every link is absolute and crawlable, so the sidebar doubles as the site's
   internal linking structure rather than being decorative. */
function sidebarHtml(current) {
  const groups = NAV_GROUPS.map(function (entry) {
    const title = entry[0];
    const links = entry[1].map(function (pair) {
      const href = pair[0];
      const label = pair[1];
      const active = href === current;
      return '<li><a href="' + href + '"' + (active ? ' aria-current="page"' : '') + '>' + label + '</a></li>';
    }).join('');
    return '<div class="side-group"><p class="side-title">' + title + '</p><ul>' + links + '</ul></div>';
  }).join('');
  return '<aside class="sidebar" aria-label="Guide contents">' +
    '<details open><summary>Guide contents</summary>' + groups + '</details></aside>';
}

/* The page head: an optional eyebrow kicker, the single H1, an optional standfirst, and the
   review date. Kept as one unit so every page starts the same way. */
function pageHead(page) {
  const out = ['<header class="page-head">'];
  if (page.crumbs && page.crumbs.length > 1) {
    const items = page.crumbs.map(function (c, idx) {
      const last = idx === page.crumbs.length - 1;
      return '<li>' + (last ? '<span aria-current="page">' + c.name + '</span>' : '<a href="' + c.url + '">' + c.name + '</a>') + '</li>';
    }).join('');
    out.push('<nav class="crumbs" aria-label="Breadcrumb"><ol>' + items + '</ol></nav>');
  }
  if (page.eyebrow) out.push('<p class="eyebrow">' + page.eyebrow + '</p>');
  out.push('<h1>' + page.h1 + '</h1>');
  if (page.lede) out.push('<p class="lede">' + page.lede + '</p>');
  if (page.updated) {
    /* Date only. The non-affiliation notice lives in the footer where it belongs; keeping it in the
       head made legal text the second thing a reader saw on every page. */
    out.push('<p class="updated"><time datetime="' + page.updated + '">Reviewed ' + page.updatedHuman + '</time></p>');
  }
  out.push('</header>');
  return out.join('\n');
}

/* A table of contents generated from the H2s actually present in the body, so it can never list a
   section that does not exist. Collapsed behind a details element on mobile, sticky on desktop. */
function tocHtml(body) {
  const items = [];
  for (const m of String(body).matchAll(/^##\s+(.+)$/gm)) {
    const text = m[1].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
    items.push({ id, text });
  }
  if (items.length < 3) return '';
  const links = items.map((i) => '<li><a href="#' + i.id + '">' + i.text + '</a></li>').join('');
  /* Emitted CLOSED. Above 1080px the CSS hides the summary and shows the list expanded under a
     static label; below 1080px the details stays shut and moves to the top of the flow, instead of
     rendering 362px of expanded links after the article. */
  return '<aside class="toc" aria-label="On this page">' +
    '<details><summary>On this page</summary><nav><ol>' + links + '</ol></nav></details>' +
    '</aside>';
}


/* FAQ schema must quote exactly what the page shows, or it is a structured-data violation. Rather
   than asking every author to copy answers twice, the schema is rebuilt from the visible FAQ
   section at render time. Edit the page body and the JSON-LD follows. */
function syncFaqSchema(schema, body) {
  const list = [].concat(schema || []);
  const faq = list.find(function (node) { return node && node['@type'] === 'FAQPage'; });
  if (!faq || !Array.isArray(faq.mainEntity)) return list;

  const visible = new Map();
  const lines = String(body).split('\n');
  let inFaq = false;
  let question = null;
  for (const line of lines) {
    const t = line.trim();
    let hashes = 0;
    while (hashes < t.length && t.charAt(hashes) === '#') hashes++;
    const isHeading = hashes >= 2 && hashes <= 4 && t.charAt(hashes) === ' ';
    if (isHeading && hashes === 2) {
      inFaq = /frequently asked|^faq\b/i.test(t.slice(3).trim());
      question = null;
      continue;
    }
    if (inFaq && isHeading && hashes === 3) { question = t.slice(4).trim(); visible.set(question, []); continue; }
    if (inFaq && question && t && !t.startsWith('|') && !t.startsWith(':::') && !t.startsWith('>')) {
      visible.get(question).push(t);
    }
  }
  /* Markdown emphasis and typographic quotes are stripped so the schema copy matches the rendered
     text after the audit normalises both sides. */
  const plain = function (text) {
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*/g, '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  };

  faq.mainEntity = faq.mainEntity.map(function (q) {
    const shown = visible.get(plain(q.name));
    if (!shown || !shown.length) return q;
    return { '@type': 'Question', name: q.name, acceptedAnswer: { '@type': 'Answer', text: plain(shown.join(' ')) } };
  });
  return list;
}

export function renderPage(page) {
  const url = SITE.origin + (page.url === '/' ? '/' : page.url + '/');
  const social = (page.socialImage || (SITE.origin + '/assets/og-default.png'));
  const graph = [];
  if (page.schema) graph.push(...syncFaqSchema(page.schema, page.body));
  if (page.crumbs && page.crumbs.length > 1) graph.push(breadcrumbLd(page.crumbs));

  /* Auto: any page with enough sections gets an on-this-page rail. A page can opt out with
     toc: false, and anything with fewer than three H2s gets nothing regardless. */
  const toc = page.toc === false ? '' : tocHtml(page.body);

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
    '<meta name="theme-color" content="#7d2b4a">',
    '<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">',
    '<link rel="icon" href="/assets/favicon-16.png" sizes="16x16" type="image/png">',
    '<link rel="icon" href="/assets/favicon-48.png" sizes="48x48" type="image/png">',
    '<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    '<link rel="stylesheet" href="/assets/styles.css">',
    '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/fraunces.woff2" crossorigin>',
    '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter.woff2" crossorigin>',
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
    '<main id="main">',
    '<div class="wrap docs">',
    sidebarHtml(page.url),
    '<div class="doc-main">',
    pageHead(page),
    page.facts && page.facts.length ? factsHtml(page.facts) : '',
    '<div class="layout' + (toc ? ' has-toc' : '') + '">',
    '<article class="prose">',
    renderMarkdown(page.body),
    page.sources && page.sources.length ? sourcesHtml(page.sources) : '',
    '</article>',
    toc,
    '</div>',
    '</div>',
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
