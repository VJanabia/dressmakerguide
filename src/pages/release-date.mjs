import { SHOTS, resolveShots } from '../data/images.mjs';
import { LINKS } from '../data/site.mjs';

const SHOT_hero = SHOTS.hero.src;
const SHOT_itch = SHOTS.fabric.src;

const FAQ = [
  [
    "When did Dressmaker come out on Steam?",
    "September 21, 2026. It released for Windows and macOS on Steam, App ID 4019220, on the date the developers originally announced."
  ],
  [
    "Was Dressmaker delayed?",
    "No. The August 2026 devlog said the game was content complete, and it launched on September 21, 2026 as planned. There was never a second release date."
  ],
  [
    "How much does Dressmaker cost?",
    "It is $14.99 in the US, with a 10% launch discount that takes it to $13.49. Steam prices each region separately, and the discount is time limited."
  ],
  [
    "Does Dressmaker go on sale?",
    "It is discounted right now, at launch. Beyond that no discount schedule has been announced; wishlisting on Steam gets you an email when the price drops."
  ],
  [
    "Is Dressmaker free?",
    "The itch.io prototype is free on a name-your-own-price basis and stays free. The full Steam release is not free: it costs $14.99, or $13.49 with the 10% launch discount."
  ],
  [
    "Is Dressmaker on consoles?",
    "Not yet. The released game is Windows and macOS only, but in the launch-day Steam announcement the developers said they are planning mobile and Switch ports, which players have been requesting. There is still no playable browser version."
  ],
  [
    "Does Dressmaker run on Steam Deck?",
    "Valve has not rated it, so nobody can honestly call it Verified. What the developers said at launch is that the game runs fast on the Steam Deck and that they want to add proper controller support before treating it as a handheld game. The Windows specs are light, so it should behave, but that is an expectation and not a badge. The free itch.io prototype does have a native Linux build."
  ]
];

const FAQ_BODY = FAQ.map(([q, a]) => '### ' + q + '\n\n' + a).join('\n\n');

const BODY = [
  "> Short answer: Dressmaker released on **Steam on September 21, 2026** for **Windows and macOS**, at **$14.99** with a **10% launch discount** that brings it to **$13.49**. Steam App ID 4019220, from Cozy Lives, published by Free Lives.",
  "",
  "Figures below are checkable on Steam, the developers' devlog or SteamDB. Want the sewing loop? Try the [free Dressmaker demo](/demo).",
  "",
  "![A customer in the fitting room reading the dress she was handed in](@SHOT_hero@ Hand-in is the moment the whole commission was for.)",
  "",
  "## Dressmaker release facts at a glance",
  "",
  "The launch in one table.",
  "",
  "| Item | Detail |\n| --- | --- |\n| Release date | September 21, 2026, the announced date, kept |\n| US price | $14.99, or $13.49 at launch |\n| Platforms | Windows and macOS |\n| Steam App ID | 4019220 |\n| Achievements | 32 |\n| Developer | Cozy Lives: Jonathan Hau-Yoon, Sara Laubscher, Ruan Rothmann |\n| Publisher | Free Lives |\n| Consoles | None released |\n| Microtransactions | None, no ads, no data harvesting |\n| Post-launch | More free content and features are planned |",
  "",
  "## Was the release date delayed?",
  "",
  "No. It shipped on the announced date, and there was never a second one.",
  "",
  "| When | What the developers said |\n| --- | --- |\n| [July 2026 devlog](@LINK_july@) | September 21, 2026 — “unless there are delays” |\n| [August 2026 devlog](@LINK_august@) | Content complete: credits, ending and achievement icons finished |\n| Launch day | “Dressmaker - Out Now!” on the Steam news hub |",
  "",
  "Readers read that caveat as a slide into 2027. Check the [Steam news hub](@LINK_news@) before believing a pushback post.",
  "",
  "> Note: no patch notes for the released build had been published as of September 21, 2026. New ones land on [Dressmaker patch notes](/patch-notes).",
  "",
  "## The $14.99 price and the launch discount",
  "",
  "The September 7, 2026 devlog post “Scalding September Tea: Price announcement” stated **“$14.99, with regional pricing, and a -10% launch discount.”**",
  "",
  "| Context | Price | Notes |\n| --- | --- | --- |\n| US Steam price | **$14.99** | Full price after the launch window |\n| Launch discount | **$13.49** | 10% off, time limited |\n| Regional pricing | Set per region | Not a currency conversion |\n| itch.io prototype | Free | Name your own price, and it stays free |\n| Bundles | **-10%** | Town to City and Paralives, each |",
  "",
  "> Note: prices change and discount windows close. These figures were verified on September 21, 2026 — check the [live price on Steam](@LINK_steam@).",
  "",
  "## What you get for $14.99",
  "",
  "One purchase, no store extras.",
  "",
  "::: cards",
  "### About 35 hours of story commissions",
  "“Story commissions of approximately 35 hours (excluding off-rack dresses)” — your own shop-window dresses sit outside that.",
  "### Over 150 dress pieces, 450 fabrics, 350 accessories",
  "Three axes you combine at the table, so two players can hand in completely different dresses for one brief. See [Dressmaker sewing tips](/sewing-tips).",
  "### No microtransactions, no ads, no AI",
  "No ads, no data harvesting and no generative AI art. Music is credited to Meydan.",
  "### More free content coming",
  "“More free content and new features” are promised after launch. No schedule, no paid expansion.",
  ":::",
  "",
  "## Where to wishlist, buy and bundle",
  "",
  "Buy the full game at [Dressmaker on Steam](@LINK_steam@). Wishlisting is free and emails you when the price drops. Two launch bundles carry another **10%** off:",
  "",
  "- **Dressmaker X Town to City** — the city-building pairing.\n- **Dressmaker x Paralives** — the life-sim pairing.",
  "",
  "> Note: the developers have not said whether bundle discounts stack. Check the cart total before you pay.",
  "",
  "The **itch.io prototype is still free and still up**: name-your-own-price for Windows, macOS and Linux. It is not the full game — the developers call it a prototype with “a lot of unfinished seams,” and confirmed the full release would not be free. Links, sizes and the macOS warning are on the [Dressmaker demo and download](/demo) page.",
  "",
  "## How to know when Dressmaker goes on sale",
  "",
  "::: steps",
  "1. **Wishlist it on Steam** — a wishlist entry triggers the discount email, the one notice that arrives without you looking.",
  "2. **Watch the official news hub** — dev promotions land on the [Steam news hub](@LINK_news@) and mirror on the [itch.io devlog](@LINK_devlog@).",
  "3. **Check the store page when a Steam seasonal sale starts** — prices change there quietly.",
  ":::",
  "",
  "> Warning: ignore countdown timers for a “Dressmaker free download,” key resellers and “full game for free” offers. No giveaway has been announced.",
  "",
  "## Platforms: Windows, macOS and Steam Deck",
  "",
  "| Platform | Status on launch day |\n| --- | --- |\n| Windows | Released. Windows 10 or later, DirectX 11, about 1.19 GiB installed |\n| macOS | Released. Apple M1 minimum, about 1.22 GiB installed |\n| Steam Deck | Runs, but **not rated by Valve** and no controller support yet |\n| Linux (desktop) | No Steam build. The free prototype ships a Linux download |\n| Switch, mobile, browser | Not released. Mobile and Switch ports are planned |",
  "",
  "> Note: Valve had published no Steam Deck compatibility rating as of September 21, 2026. We will not guess one from the specs.",
  "",
  "The developers say the game “runs fast on the Steam Deck,” and that controller support is planned. Light requirements (Core i5, 8 GB RAM) are not a rating. Full specs: [Dressmaker system requirements](/system-requirements).",
  "",
  "![A green off-the-shoulder dress on a mannequin with the commission completion options](@SHOT_itch@ Hand it in, keep working, or sell it instead of delivering the commission.)",
  "",
  "## Is it worth buying on launch day?",
  "",
  "| Signal | What it says |\n| --- | --- |\n| Steam reviews, launch day | 45 reviews at 79.65% positive — a snapshot, not a verdict |\n| itch.io prototype, since 2025 | **4.8 out of 5 from 834 ratings** — a large, settled sample |\n| Press | [The Guardian](@LINK_guardian@) covered it in August 2026; [Screenhub](@LINK_screenhub@) gives it five stars, “a triumph of original game design” |",
  "",
  "Try the free prototype first; buy on Steam only if the cutting and sewing clicks. If you have decided, the [live Steam price](@LINK_steam@) is the only number that matters, and the rest of the [dressmaker game](/) guide comes after.",
  "",
  "## Frequently asked questions",
  "",
  "Short answers to everything above, and the [Dressmaker Steam store page](@LINK_steam@) for prices.",
  "",
  FAQ_BODY
].join("\n")
  .split('\n').map((line) => resolveShots(line)).join('\n')
  .replaceAll('@LINK_steam@', LINKS.steam)
  .replaceAll('@LINK_news@', LINKS.steamNews)
  .replaceAll('@LINK_devlog@', LINKS.itchDevlog)
  .replaceAll('@LINK_july@', LINKS.itchJulyTea)
  .replaceAll('@LINK_august@', LINKS.itchAugustTea)
  .replaceAll('@LINK_guardian@', LINKS.guardian)
  .replaceAll('@LINK_screenhub@', LINKS.screenhubReview);

export const page = {
  url: '/release-date',
  title: 'Dressmaker Steam: Release Date, Price & Platforms',
  description: 'Dressmaker Steam release date is September 21, 2026, at $14.99 with a 10% launch discount. Price, platforms, bundles and how to catch a sale.',
  h1: 'Dressmaker Steam Release Date and Price',
  eyebrow: "Steam release",
  lede: "Dressmaker released on Steam on September 21, 2026 with 32 achievements, at $14.99 with a 10% launch discount that brings it to $13.49. It is a Windows and macOS game from Cozy Lives, published by Free Lives, Steam App ID 4019220. No console version exists.",
  facts: [
    ['Released', "September 21, 2026"],
    ['US price', "$14.99, or $13.49 at launch"],
    ['Platforms', "Windows and macOS"],
    ['Steam App ID', "4019220"],
    ['Developer', "Cozy Lives"],
    ['Publisher', "Free Lives"],
  ],
  updated: '2026-09-21',
  updatedHuman: 'September 21, 2026',
  ogType: 'article',
  preload: SHOT_hero,
  crumbs: [{ name: 'Home', url: '/' }, { name: 'Release Date', url: '/release-date' }],
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: 'Dressmaker',
      alternateName: 'Dressmaker Steam',
      url: LINKS.steam,
      description: 'Cozy dressmaking simulation game where you choose fabric, cut out patterns, sew garments and decorate them for the townsfolk.',
      genre: ['Simulation', 'Casual', 'Indie'],
      gamePlatform: ['PC (Microsoft Windows)', 'macOS'],
      applicationCategory: 'Game',
      operatingSystem: 'Windows 10 or later, macOS (Apple M1 or later)',
      playMode: 'SinglePlayer',
      datePublished: '2026-09-21',
      author: [
        { '@type': 'Person', name: 'Jonathan Hau-Yoon' },
        { '@type': 'Person', name: 'Sara Laubscher' },
        { '@type': 'Person', name: 'Ruan Rothmann' },
      ],
      publisher: { '@type': 'Organization', name: 'Free Lives' },
      sameAs: [LINKS.steam, LINKS.itch],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
  sources: [
    ['Dressmaker on Steam (price, platforms, requirements)', LINKS.steam],
    ['Official Steam announcements', LINKS.steamNews],
    ['Scalding September Tea: price announcement', LINKS.itchPricePost],
    ['SteamDB app 4019220 (packages, depots)', LINKS.steamDb],
  ],
  body: BODY,
};
