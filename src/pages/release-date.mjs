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
  "> Short answer: Dressmaker released on **Steam on September 21, 2026** for **Windows and macOS**, at **$14.99** with a **10% launch discount** that brings it to **$13.49**. It is Steam App ID 4019220, developed by Cozy Lives and published by Free Lives.",
  "",
  "Dressmaker released on **Steam on September 21, 2026** with **32 achievements**, at **$14.99** with a **10% launch discount** that brings it to **$13.49**. It is a Windows and macOS game from **Cozy Lives**, published by **Free Lives**, Steam App ID **4019220**. No console version exists.",
  "",
  "Here is the checkable half of the launch: the date, whether it slipped, the price outside the US, what the money buys, the bundles, and how to catch a sale. Still unsure about the sewing loop? The [free Dressmaker demo](/demo) answers that faster than any article can.",
  "",
  "![A customer in the fitting room reading the dress she was handed in](@SHOT_hero@ Hand-in is the moment the whole commission was for: the customer reacts in her own words.)",
  "",
  "## Dressmaker release facts at a glance",
  "",
  "| | Detail |\n|---|---|\n| Release date | September 21, 2026, the announced date, kept |\n| US price | $14.99 |\n| Launch discount | 10% off, time limited, taking it to $13.49 |\n| Platforms | Windows and macOS |\n| Steam App ID | 4019220 |\n| Developer | Cozy Lives: Jonathan Hau-Yoon, Sara Laubscher, Ruan Rothmann |\n| Publisher | Free Lives |\n| Consoles | None released. The developers said at launch that mobile and Switch ports are being planned |\n| Microtransactions | None. No ads, no data harvesting |\n| Post-launch content | More free content and new features are planned |",
  "",
  "Every figure comes from the official Steam store page, the developers' own devlog or SteamDB. Nothing here is a leak.",
  "",
  "## Was the release date delayed?",
  "",
  "No. Dressmaker shipped on the date the developers announced, and it is worth saying plainly, because plenty of people spent the summer predicting otherwise.",
  "",
  "The date went public in the [July 2026 devlog](@LINK_july@). The team then phrased the plan as &#34;unless there are delays,&#34; which readers took as a hint the game would slide into 2027. The [August 2026 devlog, three weeks out](@LINK_august@), answered that directly: the game was content complete, with credits compiled, the ending sequence finished and Steam achievement icons painted. It launched on schedule.",
  "",
  "So it was a caveat, not a delay, and there was never a second release date. If you see a post claiming a pushback, check the [official Steam news hub](@LINK_news@) first.",
  "",
  "Post-launch support is the open question: no patch notes for the released build had been published as of September 21, 2026. Whatever appears gets collected on the [Dressmaker patch notes](/patch-notes) page.",
  "",
  "## The $14.99 price and the launch discount",
  "",
  "The developers announced the price themselves. On **September 7, 2026**, the itch.io devlog post &#34;Scalding September Tea: Price announcement&#34; stated **&#34;$14.99, with regional pricing, and a -10% launch discount.&#34;** That is the entire pricing decision, two weeks before launch.",
  "",
  "Two details matter more than the headline. **Regional pricing means your price is not a conversion** — Steam sets a separate figure for each region, so UK, eurozone and Australian prices are their own numbers. And **the launch discount is a window, not the price**: 10% off expires, and the game returns to full price.",
  "",
  "> Note: prices change and discount windows close. These figures were verified on September 21, 2026. Check the [live price on Steam](@LINK_steam@) before you buy rather than trusting a cached number.",
  "",
  "## What you get for $14.99",
  "",
  "### Around 35 hours of story commissions",
  "",
  "The developers describe &#34;story commissions of approximately 35 hours (excluding off-rack dresses).&#34; That caveat matters: the 35 hours is the scripted customer work, and dresses you design for your own shop window sit outside it.",
  "",
  "### Over 150 dress pieces, 450 fabrics and 350 accessories",
  "",
  "The same announcement lists **over 150 dress pieces, over 450 fabrics and over 350 accessories** — the three axes you combine at the table, and why two players can hand in completely different dresses for one commission. Our [Dressmaker sewing tips](/sewing-tips) cover choosing between them.",
  "",
  "### No microtransactions, no ads, no AI",
  "",
  "Dressmaker is a single purchase with **no microtransactions, no ads and no data harvesting**, and the developers say **no generative AI art** was used. The itch.io page carries the &#34;No generative AI was used&#34; tag, and music is credited to Meydan. &#34;More free content and new features&#34; are promised after launch; no schedule or paid expansion has been announced.",
  "",
  "## Where to wishlist, buy and bundle",
  "",
  "The full game is sold at [Dressmaker on Steam](@LINK_steam@), for Windows and macOS from one store page. Wishlisting is free, and it is what emails you when the price drops.",
  "",
  "Two bundles shipped with the game, each carrying another **10%** off:",
  "",
  "- **Dressmaker X Town to City**, for the city-building half of the cozy shelf.\n- **Dressmaker x Paralives**, the life-sim pairing.",
  "",
  "The developers have not said whether bundle discounts stack with the launch discount, so check the cart total before you pay.",
  "",
  "The **itch.io prototype is still free and still up** — name-your-own-price, Windows, macOS and Linux — and it did not vanish when the paid game arrived. It is not the full game: the developers call it a prototype with &#34;a lot of unfinished seams,&#34; and they confirmed in the itch comments that the full release would not be free. Links, file sizes and the macOS security warning are on the [Dressmaker demo and download](/demo) page.",
  "",
  "## How to know when Dressmaker goes on sale",
  "",
  "There is no secret, just three reliable sources and a lot of noise.",
  "",
  "1. **Wishlist it on Steam.** A wishlist entry is what triggers Steam's discount email. It is the only notification that arrives without you going to look for it.\n2. **Watch the official news hub.** Developer-run promotions land on the [Steam news hub for App ID 4019220](@LINK_news@) and are mirrored on the [itch.io devlog](@LINK_devlog@).\n3. **Check the store page when a Steam seasonal sale starts.** Prices change there quietly, with no separate announcement.",
  "",
  "Ignore **fake countdown timers** for a &#34;Dressmaker free download,&#34; key resellers, and anyone offering the full game for nothing. No giveaway has been announced, and the only free build is the itch.io prototype on the developers' own page. A ticking clock is not a source.",
  "",
  "## Platforms: Windows, macOS and Steam Deck",
  "",
  "| Platform | Status on launch day |\n|---|---|\n| Windows | Released. Windows 10 or later, DirectX 11, about 1.19 GiB installed |\n| macOS | Released. Apple M1 minimum, about 1.22 GiB installed |\n| Steam Deck | Runs, but **not rated by Valve** and no controller support yet. The developers say it &#34;runs fast on the Steam Deck&#34; and that controller support is planned |\n| Linux (desktop) | No Steam build. The free itch.io prototype does ship a Linux download |\n| Nintendo Switch, mobile, browser | Not released. The developers said on launch day that mobile and Switch ports are being planned |",
  "",
  "Steam Deck gets the blunt answer: **Valve has not published a compatibility rating for Dressmaker**. There is no Verified, Playable or Unsupported badge on the store page as of September 21, 2026, and we will not guess one from the specifications. What the developers did say, in the launch-day announcement, is that the game &#34;runs fast on the Steam Deck&#34; and that they want to add proper controller support before calling it a portable game. The Windows requirements are light — an Intel Core i5 or Ryzen, 8 GB of RAM, Intel UHD 630-class graphics — and light requirements often mean a game runs well under Proton, but running well on paper is not a rating. When Valve does rate it, the badge appears on the store page for App ID 4019220.",
  "",
  "One piece of good news for Linux and handheld players: the itch.io prototype has a native Linux build, so you can test the cutting and sewing for nothing even though the Steam release has no Linux depot. Full specifications are on the [Dressmaker system requirements](/system-requirements) page.",
  "",
  "![A green off-the-shoulder dress on a mannequin with the commission completion options](@SHOT_itch@ Hand the dress in, keep working on it, or sell it instead of delivering the commission.)",
  "",
  "## Is it worth buying on launch day?",
  "",
  "We will not pretend a launch-day score settles anything. On September 21, 2026, SteamDB recorded **45 reviews at 79.65% positive** for Dressmaker, a number that will move a long way in both directions. Treat it as a snapshot, not a verdict.",
  "",
  "The stronger signal is the free prototype, public since 2025 with **4.8 out of 5 from 834 ratings** on itch.io: a large, settled sample from people who played the loop. Our advice is to try that first and buy on Steam only if the cutting and sewing clicks.",
  "",
  "Press coverage has been warm: the [Guardian](@LINK_guardian@) covered Dressmaker in August 2026, and the Steam page carries a five-star [Screenhub review](@LINK_screenhub@) calling it &#34;a triumph of original game design.&#34;",
  "",
  "If you have decided already, the [live Steam price](@LINK_steam@) is the only number that matters, and the rest of the [dressmaker game](/) guide is waiting for after your first few hours.",
  "",
  "## Frequently asked questions",
  "",
  "Everything below is the short version of what is on this page. For anything price-related, the [Dressmaker Steam store page](@LINK_steam@) is the source of truth.",
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
