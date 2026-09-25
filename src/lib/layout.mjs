import { SITE, LINKS, ADS } from '../data/site.mjs';
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



/* --- advertising ------------------------------------------------------------
   Three slots, all inside the article column so an ad is met where the reader is
   already looking rather than parked in a rail nobody scrolls to:

     slot 1  468x60  after the first section of the page
     slot 2  320x50  two sections further down
     slot 3  the in-page push container, at the foot of the article

   Every slot carries a visible "Advertisement" label, so an ad can never be
   mistaken for a screenshot, a callout or an editorial recommendation. The two
   banner creatives are fixed pixel sizes chosen by the network, so the wide one
   is scaled down on a narrow phone by AD_FIT_SCRIPT instead of overflowing the
   column - the ad stays fully on screen and the page never scrolls sideways. */

function adLabel() {
  return '<p class="ad-label">Advertisement</p>';
}

/* A fixed-size iframe creative. atOptions must be set in its own inline script
   immediately before the invoke.js it belongs to: both units read the same
   window.atOptions, so a single shared block would feed the wrong key to one. */
function bannerSlot(banner) {
  if (!ADS.enabled || !banner) return '';
  return '<aside class="ad-slot" data-ad-fit="' + banner.width + '" aria-label="Advertisement">' +
    adLabel() +
    '<div class="ad-body">' +
    '<script>atOptions = { "key" : "' + banner.key + '", "format" : "iframe", "height" : ' + banner.height +
    ', "width" : ' + banner.width + ', "params" : {} };</script>' +
    '<script src="' + banner.src + '"></script>' +
    '</div></aside>';
}

/* The in-page push unit: an empty container the network fills at runtime, plus
   the one script that fills it. async, so it never holds up the article. */
function inPagePushSlot() {
  if (!ADS.enabled || !ADS.inPagePush) return '';
  return '<aside class="ad-slot ad-slot-push" aria-label="Advertisement">' +
    adLabel() +
    '<div class="ad-body"><div id="' + ADS.inPagePush.containerId + '"></div></div>' +
    '<script async data-cfasync="false" src="' + ADS.inPagePush.src + '"></script>' +
    '</aside>';
}

/* Put a slot immediately before the nth H2, i.e. after the (n-1)th section. A page
   with fewer sections than that gets the slot after its last one rather than no
   ad at all, and a page with no H2 at all gets it after the first paragraph. */
function insertBeforeHeading(html, slot, n) {
  if (!slot) return html;
  let idx = -1;
  for (let i = 0; i < n; i++) {
    idx = html.indexOf('<h2', idx + 1);
    if (idx === -1) return html + '\n' + slot;
  }
  return html.slice(0, idx) + slot + '\n' + html.slice(idx);
}

/* The article body with the three slots in it. Rendering rather than hand-placing
   them keeps every page - including pages added later - on the same rhythm. */
function withAds(html) {
  if (!ADS.enabled) return html;
  let out = insertBeforeHeading(html, bannerSlot(ADS.banners.wide), 2);
  out = insertBeforeHeading(out, bannerSlot(ADS.banners.narrow), 5);
  return out + '\n' + inPagePushSlot();
}

/* The banner creatives are a fixed 468 and 320 pixels wide. Below that the slot
   scales the frame to the column instead of hiding it: a hidden ad is an ad the
   network counts as delivered but nobody sees, which is the one thing an ad slot
   must never be. Re-runs on resize, and after load in case the network writes its
   iframe late. */
const AD_FIT_SCRIPT = ADS.enabled ? [
  '<script>',
  '(function () {',
  '  function fit() {',
  '    var slots = document.querySelectorAll(".ad-slot[data-ad-fit]");',
  '    for (var i = 0; i < slots.length; i++) {',
  '      var slot = slots[i];',
  '      var body = slot.querySelector(".ad-body");',
  '      if (!body) continue;',
  '      var frame = body.querySelector("iframe");',
  '      body.style.height = "";',
  '      if (!frame) continue;',
  '      frame.style.transform = "";',
  '      var want = parseInt(slot.getAttribute("data-ad-fit"), 10);',
  '      var have = slot.clientWidth;',
  '      if (!want || !have || have >= want) continue;',
  /* The FRAME is scaled, never the wrapper it sits in: scaling the wrapper would scale its own
     height as well, so the creative would come out smaller than the box reserved for it and the
     bottom of the banner would be cut off. The wrapper only reserves the scaled height. */
  '      var scale = have / want;',
  '      var tall = frame.offsetHeight || parseInt(frame.getAttribute("height"), 10) || 0;',
  '      body.style.height = Math.round(tall * scale) + "px";',
  '      frame.style.transformOrigin = "center top";',
  '      frame.style.transform = "scale(" + scale.toFixed(4) + ")";',
  '    }',
  '  }',
  '  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fit);',
  '  else fit();',
  '  window.addEventListener("load", fit);',
  '  var t;',
  '  window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(fit, 150); });',
  '})();',
  '</script>',
].join('\n') : '';

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
    /* The AdSense snippet belongs in <head> - that is where Google's site verification looks for
       it, and where Auto Ads expects it once the account is approved. Printed on every page, not
       just the homepage, because a site is verified as a site and not as one URL. */
    ADS.enabled && ADS.adsenseClient ? '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + escAttr(ADS.adsenseClient) + '" crossorigin="anonymous"></script>' : '',
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
    withAds(renderMarkdown(page.body)),
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
    AD_FIT_SCRIPT,
    '</body>',
    '</html>',
  ].filter(Boolean).join('\n');

  return head;
}
