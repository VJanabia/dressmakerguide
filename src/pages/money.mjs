import { resolveFigures } from '../data/images.mjs';
import { LINKS } from '../data/site.mjs';

const BODY = "> Short answer: a commission pays you **twice** — once to make the dress, once when you hand it over — and a dress sold off the rack pays once, on a brief you chose yourself. The price is not a mystery number: players have worked out that material, labour, a quality multiplier and a prestige multiplier all feed it. The developers have never published the formula.\n\n## The two payments\n\nThe clearest thing to understand about Dressmaker's economy is that commissions are paid in instalments.\n\n| Stage | What you get | What it is for |\n| --- | --- | --- |\n| The commission is accepted | Coin up front | Covers the fabric you are about to buy |\n| The dress is handed over | Coin again | The actual reward for the work |\n| A dress sold off the rack | Coin once | Payment for stock you chose to make |\n\nThe up-front payment is the part people miss. It means a commission is not a gamble on your own wallet — you are funded before you cut, which matters most in the early game when one bolt of good cloth is a real decision.\n\n![Fabric shop shelves stacked with cloth bolts beside a list of fabrics and prices](@SHOT_fabric@ The up-front payment is what decides how ambitious your next commission can be.)\n\n## Selling dresses off the rack\n\nSelling a finished dress instead of delivering it is the second income, and it is the steadier one: nobody is waiting on it and no brief can be missed.\n\nThe community-reported unlock is that you need to get through roughly **the first three dresses** before off-rack selling opens up. After that, the entry point is in the sketchbook — turn to the next page to start a dress that is not attached to a customer.\n\nWhere the money comes in is the shop window. Dresses you make for yourself, made well, sell; and a dress made from leftover cloth is worth more than the cloth sitting in your inventory.\n\n![A green off-the-shoulder dress on a mannequin with the commission completion options](@SHOT_shop@ Selling is one of the three ways out of a finished dress, alongside handing it in and carrying on.)\n\n## What actually sets the price\n\nThis is the part with real information in it, and it comes from the community rather than the developers — one of the better Steam guides credits the breakdown to a player on the official Discord. We are passing it on because it is the only concrete account of the price we have found, and flagging clearly that it is **not developer documentation**.\n\n| Factor | What drives it | Notes |\n| --- | --- | --- |\n| Material | More expensive cloth sells for more | The base of the number |\n| Labour | Time spent making the dress | See the caveat below |\n| Quality | **Multiplier, up to 150%** | Cut on the grain and sew at 100% to reach it |\n| Prestige | **Multiplier, up to 150%** | Your rank in the game |\n\nTwo multipliers that each reach 150% is the reason a well-executed dress from a high-rank shop can be worth far more than the sum of its cloth. It also explains the most common complaint about the economy: the same pattern, cut sloppily, is not worth the material you bought for it.\n\nOne player, testing the labour component, reports that it looks tied to **how many seams a dress has plus its accessory additions**, but describes their own result as preliminary and not certain. We are repeating that uncertainty rather than tidying it up.\n\n> Note: the store page confirms what the loop gives you — you \"turn in dresses to customers to gain reputation and coin\" — but it does not describe a price formula. Everything in the table above is community-derived.\n\n## Checking a price before you commit\n\nYou can see what a dress is worth without selling it. The trick players use is to **press sell and then cancel** once the price appears. Do that deliberately, and do not do it while distracted — the second click is the one that sells the dress.\n\nThis is worth doing on a commission as well, because it tells you whether a dress is going to pay back the cloth you spent on it before you hand it over.\n\n## Free material, and how to undo a shopping mistake\n\nTwo practical notes that save real coin:\n\n- **Burlac is free material.** It will earn you a little if you sell something made from it, but it is not the profitable choice — scrap cloth from real commissions is worth more per dress, because the material component of the price is higher.\n- **Overbought fabric is recoverable.** If you have bought a pile of cloth you have no commission for, make a quick dress out of it and sell that off the rack. You get the money back, and usually more than you spent.\n\nThe second one is the single most useful habit in the early game, when it is easy to fill your inventory with bolts you admired rather than bolts you needed.\n\n## The pigeon, gifts and what they unlock\n\nTwo progression systems intersect with money without being about money.\n\nThe **pigeon**, which unlocks fairly early, lets you invite particular characters into your shop so you can make a dress for them — turning the commission flow from something that happens to you into something you can steer toward the people you want standing.\n\n**Gifting a dress** raises your level with whoever you gave it to. Levels unlock new patterns for your sketches, so a dress given away is a payment in a second currency: not coin, but a wider catalogue. If you are stuck for something new to cut, look at who you have not dressed yet.\n\n![A customer in the fitting room reading the dress she was handed in](@SHOT_hero@ A dress given rather than sold pays in patterns instead of coin.)\n\n## What we could not verify\n\nThree things are worth stating plainly, because a lot of guide content in this game does not.\n\n1. **No published formula.** The developers have not described how a dress is priced. The four-factor breakdown above is community work with a specific, credited origin.\n2. **The labour term is uncertain.** The player testing it says seams and accessories look like the drivers and that they still have to test it properly.\n3. **Thresholds are unknown.** Reputation levels, prestige tiers and their multiplier steps are not published anywhere we can point you to, so we are not going to invent numbers for them.\n\n## Frequently asked questions\n\n### Do you get paid before or after making a commission?\n\nBoth. The commission pays up front, which funds the fabric, and pays again when you hand the finished dress over.\n\n### How do you unlock selling dresses off the rack?\n\nCommunity reports put it at roughly the first three completed dresses. After that you start an off-rack dress from the next page of the sketchbook.\n\n### What makes a dress sell for more?\n\nMore expensive material, more labour, and two multipliers that each reach 150% — one for quality, driven by cutting on the grain and sewing at 100%, and one for prestige, driven by your rank.\n\n### How do you see a price without selling the dress?\n\nPress sell and cancel once the price shows. Do it carefully: the second click is the one that completes the sale.\n\n## Where to go next\n\nIf the price is what you came for, the [Dressmaker customer preferences](/customers) page covers the other half — reading the brief that decides whether a commission pays well at all. From there, [how to play Dressmaker](/how-to-play) for the full loop, [decorations and trim](/decorations) for the finishing stage, and [Dressmaker sewing tips](/sewing-tips) for the grain and seam habits that drive the quality multiplier."
  .split('\n').map((line) => resolveFigures(line)).join('\n');

// Same answers as the FAQ section in the body, in the shape the FAQPage schema wants.
const FAQ = [
  [
    "Do you get paid before or after making a commission?",
    "Both. The commission pays up front, which is what funds the fabric you are about to buy, and pays again when you hand the finished dress over."
  ],
  [
    "How do you unlock selling dresses off the rack?",
    "Community reports put it at roughly the first three completed dresses. After that you start a dress that is not attached to a customer from the next page of the sketchbook."
  ],
  [
    "What makes a dress sell for more?",
    "More expensive material, more labour, and two multipliers that each reach 150 percent - one for quality, driven by cutting on the grain and sewing at 100 percent, and one for prestige, driven by your rank in the game. The developers have not published the formula itself."
  ],
  [
    "How do you see a price without selling the dress?",
    "Press sell and cancel once the price appears. Do it carefully: the second click is the one that completes the sale."
  ]
];

export const page = {
  url: '/money',
  title: 'Dressmaker Money Guide: How Dress Prices Work',
  description: 'How money works in Dressmaker: the two payments per commission, the four factors behind a dress price, and how to recover coin from overbought fabric.',
  h1: 'Dressmaker Money and Selling Prices',
  eyebrow: 'Economy guide',
  lede: 'Commissions in Dressmaker pay twice, and a dress sold off the rack pays once on a brief you chose. The developers have never published a price formula, so this page separates what players have worked out from what is still guesswork.',
  facts: [
    ['Commission pays', 'Up front, then again on hand-in'],
    ['Off-rack selling', 'Unlocks after roughly three dresses'],
    ['Price factors', 'Material, labour, quality, prestige'],
    ['Multipliers', 'Quality and prestige, up to 150% each'],
    ['Free material', 'Burlac, but scrap cloth pays better'],
    ['Second currency', 'Gifts raise levels, which unlock patterns'],
  ],
  updated: '2026-09-26',
  updatedHuman: 'September 26, 2026',
  ogType: 'article',
  crumbs: [{ name: 'Home', url: '/' }, { name: 'Money', url: '/money' }],
  schema: [
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
    ["Thing's I've Learned, by Seerolz (Steam guide, credits the price breakdown to a player on the official Discord)", LINKS.steamGuideTips],
    ['Dressmaker on Steam (coin and reputation wording)', LINKS.steam],
    ['Steam Community guides for Dressmaker', LINKS.steamGuideGuides],
  ],
  body: BODY,
};
