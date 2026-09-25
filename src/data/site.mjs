// Site-wide constants. Single source of truth for domain, copy and official links.
export const SITE = {
  domain: 'dressmakerguide.com',
  origin: 'https://dressmakerguide.com',
  name: 'Dressmaker Guide',
  tagline: 'A fan-made guide to the cozy dressmaking game',
  lang: 'en-US',
  locale: 'en_US',
  // Set to true only after the real GA4 property exists, then run the build again.
  ga4Id: '',
  // Date of the last editorial pass over the whole site (ISO). Shown in the footer.
  contentUpdated: '2026-09-21',
};

// Official, verifiable sources. Every factual claim on the site points back to one of these.
export const LINKS = {
  steam: 'https://store.steampowered.com/app/4019220/Dressmaker/',
  steamNews: 'https://store.steampowered.com/news/app/4019220',
  steamCommunity: 'https://steamcommunity.com/app/4019220/',
  steamDiscussions: 'https://steamcommunity.com/app/4019220/discussions/',
  steamDb: 'https://steamdb.info/app/4019220/',
  itch: 'https://elyaradine.itch.io/dressmaker',
  itchDevlog: 'https://elyaradine.itch.io/dressmaker/devlog',
  itchPricePost: 'https://elyaradine.itch.io/dressmaker/devlog/1655725/scalding-september-tea-price-announcement',
  itchAugustTea: 'https://elyaradine.itch.io/dressmaker/devlog/1647471/august-tea-3-weeks-until-launch',
  itchJulyTea: 'https://elyaradine.itch.io/dressmaker/devlog/1607332/july-tea-and-launch-date-announcement',
  itchDownload: 'https://elyaradine.itch.io/dressmaker/purchase',
  screenhubReview: 'https://www.screenhub.com.au/news/reviews/dressmaker-pc-game-review-2707829/',
  guardian: 'https://www.theguardian.com/games/2026/aug/18/dressmaker-a-canvas-for-the-creativity-of-dream-dress-design',
};

/* Advertising. One source of truth for the three units and for the AdSense client, so a key is
   changed in exactly one place and nothing has to be found in rendered HTML.

   - adsenseClient: the AdSense snippet is printed into <head> on every page. That is the snippet
     Google's site verification looks for, and it is what Auto Ads needs once the site is approved.
     No AdSense ad unit is placed here yet - only the verification/Auto Ads script.
   - inPagePush: the Monetag container. The network fills the empty div at runtime; the layout
     renders the container in the slot at the foot of the article and loads the script once.
   - banners: two fixed-size iframe creatives from the same network. Each one needs its own
     atOptions block immediately before its invoke.js, because both scripts read the same
     window.atOptions global and the last one written would otherwise win.

   Set enabled to false to build the site with no ad markup at all. */
export const ADS = {
  enabled: true,
  adsenseClient: 'ca-pub-9073496682747119',
  inPagePush: {
    containerId: 'container-86858e1a8992e8258ee330ca2817c8c5',
    src: 'https://pl31505864.profitableratecpmnetwork.com/86858e1a8992e8258ee330ca2817c8c5/invoke.js',
  },
  banners: {
    /* 468x60: the in-article unit, dropped in after the first section of every page. */
    wide: {
      key: '3bfd5956c4fad25498ca50e62ef7dcca',
      width: 468,
      height: 60,
      src: 'https://www.highrevenueformat.com/3bfd5956c4fad25498ca50e62ef7dcca/invoke.js',
    },
    /* 320x50: the unit further down the article, and the one that fits a phone exactly. */
    narrow: {
      key: '9f809a88800c18b0d09bd3c33ac1e2eb',
      width: 320,
      height: 50,
      src: 'https://www.highrevenueformat.com/9f809a88800c18b0d09bd3c33ac1e2eb/invoke.js',
    },
  },
};
