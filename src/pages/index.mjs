import { SHOTS, resolveShots } from '../data/images.mjs';
import { LINKS } from '../data/site.mjs';

const SHOT_hero = SHOTS.hero.src;
const SHOT_cut = SHOTS.cut.src;
const SHOT_sew = SHOTS.sew.src;
const SHOT_decorate = SHOTS.decorate.src;

const BODY = [
  "> Short answer: Dressmaker is a **cozy dressmaking simulation** where you take commissions, choose fabric, cut out pattern pieces and sew them into finished dresses — then hand them in to customers you can satisfy or sabotage. It released on **Steam on September 21, 2026** for Windows and macOS at **$14.99**, and a **free prototype is on itch.io**.",
  "",
  "![A customer in the fitting room reading the dress she was handed in](@SHOT_hero@ Hand-in is the moment the whole commission was for: the customer reacts in her own words.)",
      "The full game released on **Steam on September 21, 2026** for **Windows and macOS**, priced at **$14.99** with a 10% launch discount that brings it to **$13.49**. A free, still-playable **prototype is on itch.io**, and it is the best way to find out whether the sewing rhythm clicks for you before you spend anything.",
    "## What is Dressmaker?",
    "Dressmaker is not a dress-up game and it is not a fashion-boutique management sim, although it borrows a little from both. It is a *making* game. Almost every minute you spend with it happens at the table: fabric spread out in front of you, pattern pieces in your hand, deciding what goes where.",
    "The developers describe it as \"a cozy simulation game where every part of making a dress is under your control,\" and that is a fair summary of the loop. A client walks in with an occasion and a taste. You pick a design in your sketchbook, browse the fabric shelves, arrange your pattern pieces on the cloth, cut, sew, decorate, and turn the dress in for coin and reputation.",
    "Three things make it feel different from other cozy crafting games:",
    "- **Your layout decisions are permanent.** Where you place a pattern piece on the fabric is exactly what shows up on the finished dress. Line the piece up with the grain and you get a neat, even result; cut it on the bias and the same cloth behaves completely differently. Nothing later in the process undoes a badly planned cut.\n- **Real dressmaking vocabulary, gently taught.** Grain, bias, panels, appliqué, lace trim. The game uses the real words, then shows you what they do, so you can finish it without ever having held a needle and still know what cutting on the bias means.\n- **You are allowed to be a menace.** The official store description invites you to \"satisfy (or sabotage!)\" your customers. If you want to send the mayor's daughter to the ball in a catastrophe of clashing velvet, the game will let you.",
    "The scale is bigger than the free prototype suggests. The developers have said the full game contains **over 150 dress pieces, more than 450 fabrics and over 350 accessories**, with roughly **35 hours of story commissions** before you count the dresses you make off your own bat. Steam lists **32 achievements**, and the store page confirms **Steam Cloud**, mouse-only play and no timed input, so you can take it at your own pace.",
    "![Paper pattern pieces laid out on strawberry-print fabric with shears resting on the cloth](@SHOT_cut@ Pattern pieces laid on the cloth decide what the dress will look like. Then the shears decide it permanently.)",
    "## How to Play Dressmaker",
    "The whole game is five steps, repeated with more expensive fabric each time. Here is the short version; the [how to play Dressmaker walkthrough](/how-to-play) covers every stage in detail.",
    "### Read the commission, then design in your sketchbook",
    "Every customer arrives with a request: an occasion, a rough idea, and personal taste you learn by paying attention. Open your sketchbook and design before you touch any cloth, and check what your shop actually stocks. Designing something you cannot afford to cut is the most common beginner mistake.",
    "### Choose fabric and lay out the pattern",
    "This is the heart of Dressmaker. You buy fabric — cotton, linen, wool, silk, velvet and many more — and each bolt has a pattern, a direction and a price. Pattern pieces are arranged on that cloth, and where they land decides the final look of every panel. You can use a different fabric for each panel of one garment.",
    "### Cut it out",
    "Cutting is the point of no return: once the shears go through the cloth, that fabric is spent. The mannequin preview lets you check a layout before you commit. Use it every single time.",
    "### Sew the panels together",
    "Feed the fabric through the sewing machine to stitch the pieces into a garment. The machine has an infinite bobbin, so there is no resource management here — the challenge is the order and alignment of your seams.",
    "### Decorate it and hand it in",
    "Buttons, bows, appliqué, lace trims and other accessories can be placed wherever you like. Then you turn the dress in. A commission comes with **named targets** — one official screenshot shows a Requirements box reading Quality 70, Flowers 60, Cute 30, Romantic 45 — and you are paid in **coin and reputation**, with a **star rating** on the customer's card. Reputation opens better commissions; coin buys the fabric that makes them possible. You can also display your own designs in the shop window and sell pre-made dresses off the rack.",
    "![Fabric being fed through a sewing machine with the stitch prompts shown on screen](@SHOT_sew@ Panels go through the machine one seam at a time, with the controls on screen as you go.)",
    "## Dressmaker Demo & Download",
    "There are two downloads and it is worth being clear about the difference.",
    "The [**free prototype on itch.io**](/demo) is a Windows, macOS and Linux download that has been public since mid-2025. It is the original three-week Free Lives build plus another month or two of work, and the developers are upfront that it has \"a lot of unfinished seams.\" It is not the full game. It is free on a name-your-own-price basis and it is the honest way to test whether the cutting and sewing loop suits you.",
    "The **full release** is the paid Steam version for Windows and macOS. It is not a demo of the prototype — it is a much larger game with an actual story, a town of clients, achievements and endings.",
    "The [Dressmaker demo and download](/demo) page has the direct link, the file sizes, the macOS Gatekeeper warning you will hit, and a straight answer on what the prototype does not include.",
    "## Steam Release Date and Price",
    "Dressmaker launched on **September 21, 2026** on Steam, priced at **$14.99** in the US with a **10% launch discount** to **$13.49**. It is a Windows and macOS release and there is no Linux build on Steam. Mobile and Switch ports are not out, but the developers said in their launch-day announcement that ports are being planned, along with a challenge mode, transparent fabrics and proper controller support. The developers confirmed the price and discount themselves in the official itch.io devlog two weeks before launch, and stated there are **no microtransactions, no ads, no data harvesting and no generative AI art** in the game.",
    "The [Dressmaker Steam release date](/release-date) page tracks the launch, the platform list, the bundles it shipped alongside and where to check the live price rather than trusting a cached number.",
    "## Beginner Sewing Tips",
    "The gap between a dress that gets a polite nod and a dress that gets a delighted customer is almost never about decoration. It is about three boring decisions made early:",
    "1. **Match the pattern piece to the grain unless you have a reason not to.** Grain-aligned panels look clean and predictable. Bias cuts are a deliberate, dramatic choice — make them on purpose, not by accident.\n2. **Big prints need small pattern pieces.** A large floral that looks gorgeous on the bolt loses its shape entirely once it is chopped into a bodice panel. Save statement prints for skirts and simple silhouettes.\n3. **Preview on the mannequin before every cut.** Cutting is irreversible and fabric costs coin. Two seconds of previewing saves an entire bolt.",
    "There is a longer list — seam order, trim placement, and how to plan a dress around a fabric you have already fallen in love with — on the [Dressmaker guide and sewing tips](/sewing-tips) page.",
    "![A finished strawberry-print dress on a mannequin beside a tray of accessories](@SHOT_decorate@ Sewing finished, decorating not: buttons, bows and lace can still be added before you hand it over.)",
    "## Customer Preferences",
    "Customers are the reason the dress matters. Each one has an occasion, a taste and a reaction, and the game tracks both **coin and reputation** when you hand a dress in. Satisfy someone and you gain standing that opens better commissions. Ignore what they asked for and you will see it in their face — which, if you are playing the sabotage run on purpose, is the whole joke.",
    "Preferences are not one hidden number. They combine the occasion (a wedding is not a Tuesday), the client's personal style, and how well your fabric and decoration choices match what they actually said. The [Dressmaker customer preferences](/customers) page covers how to read a brief, how to tell admiration from disappointment, and how to miss the mark on purpose without wrecking your reputation.",
    "## System Requirements",
    "Dressmaker is a modest game. The official Steam listing asks for **Windows 10 or later with an Intel Core i5 or AMD Ryzen processor, 8 GB of RAM and Intel UHD 630 graphics or better**, and on Mac an **Apple M1 with 8 GB of RAM**. Both platforms need **1 GB of available storage**. Steam lists minimum specifications only for this game — there is no published recommended tier, which usually means the minimum is genuinely enough.",
    "The install is about **1.19 GiB on Windows** and **1.22 GiB on macOS**, with a download of roughly **300 MB**. Full details, including what to do on older integrated graphics, are on the [Dressmaker system requirements](/system-requirements) page.",
    "## Games Like Dressmaker",
    "If you like the sound of Dressmaker but want something to play tonight, or you have finished the story commissions and want the same feeling again, the closest matches are cozy games about *making one specific thing well* rather than games about running a shop. Unpacking, A Little to the Left, Calico and Strange Horticulture all share the tactile, low-pressure, mildly obsessive quality that makes Dressmaker work.",
    "We put together ten of them, each with a note on what it shares with Dressmaker and what it does differently, on the [games like Dressmaker](/games-like) page.",
    "## Dressmaker Wiki",
    "Fabrics, pattern pieces, accessories and the customer roster each get a reference table in the [Dressmaker wiki](/wiki). It is the page to keep open in a second tab: how each fabric behaves and what it is best for, what each accessory is actually doing, and a customer table you can scan before a commission.",
    "## Frequently asked questions",
    "### Is Dressmaker a real game or just a demo?",
    "Both exist, and they are separate builds. The **free prototype on itch.io** is a substantial, finished-feeling slice that players have rated 4.8 out of 5. The **paid Steam release** is the full game, with story commissions, a town of clients, achievements and an ending. Buying the Steam version does not replace the prototype; they are two different downloads.",
    "### Is Dressmaker free?",
    "The itch.io prototype is free on a name-your-own-price basis. The full Steam release costs **$14.99** in the US, with a **10% launch discount** to **$13.49**. The developers have confirmed there are no microtransactions and no ads.",
    "### Is this the same as DressMaker or DressMaker Pro on Steam?",
    "No, and it is worth knowing before you buy the wrong thing. There are two other games on Steam called DressMaker and DressMaker Pro, both released in 2021, and both are 3D character design tools rather than games. This page is about Dressmaker by Cozy Lives and Free Lives, the cozy dressmaking sim that released on September 21, 2026. If the store page you are looking at mentions character rigging or game development, you are on the wrong one.",
    "### When did Dressmaker come out?",
    "Dressmaker released on Steam on **September 21, 2026** for Windows and macOS. The free prototype has been on itch.io since 2025.",
    "### Is Dressmaker on Nintendo Switch, PlayStation or Xbox?",
    "Not yet. The released game is Windows and macOS on Steam, plus the Windows, macOS and Linux prototype on itch.io. In the launch-day Steam announcement the developers said they are **planning mobile and Switch ports**, so a console version is on the roadmap rather than available today.",
    "### Is there a Dressmaker mobile app or a browser version I can play now?",
    "No playable mobile or browser version exists today, and we will not pretend otherwise. The developers did say on launch day that mobile ports are being planned, so expect an official announcement before any real app appears. Any site offering a \"Dressmaker APK\" or an online playable version right now is not affiliated with the developers.",
    "### How long is Dressmaker?",
    "The developers describe roughly **35 hours of story commissions**, before off-rack dresses, decorating for fun and the post-launch content they have said is still coming.",
    "### Is Dressmaker made with AI?",
    "No. The developers have said the game is privately owned and made by hand, and the itch.io prototype carries the \"No generative AI was used\" tag. Art, code and music are credited to named people.",
    "### Is Dressmaker hard?",
    "It is gentle by design — there is no timer and no fail state in the usual sense. The difficulty is that cutting is irreversible, so a careless layout costs fabric and coin. If you can plan a jigsaw, you can play Dressmaker.",
    "### Where do I get Dressmaker?",
    "Buy it on [Steam](@LINK_steam@) for Windows and macOS, or try the free prototype at [elyaradine.itch.io/dressmaker](@LINK_itch@). Both links go to the developers' own pages."
].join("\n\n")
  .split('\n').map((line) => resolveShots(line)).join('\n')
  .replaceAll('@LINK_steam@', LINKS.steam)
  .replaceAll('@LINK_itch@', LINKS.itch);

const FAQ = [
  [
    "Is Dressmaker a real game or just a demo?",
    "Both exist, and they are separate builds. The free prototype on itch.io is a substantial, finished-feeling slice that players have rated 4.8 out of 5. The paid Steam release is the full game, with story commissions, a town of clients, achievements and an ending. Buying the Steam version does not replace the prototype; they are two different downloads."
  ],
  [
    "Is Dressmaker free?",
    "The itch.io prototype is free on a name-your-own-price basis. The full Steam release costs $14.99 in the US, with a 10% launch discount to $13.49. The developers have confirmed there are no microtransactions and no ads."
  ],
  [
    "Is this the same as DressMaker or DressMaker Pro on Steam?",
    "No, and it is worth knowing before you buy the wrong thing. There are two other games on Steam called **DressMaker** and **DressMaker Pro**, both released in 2021, and both are 3D character design tools rather than games. This page is about **Dressmaker** by Cozy Lives and Free Lives, the cozy dressmaking sim that released on September 21, 2026. If the store page you are looking at mentions character rigging or game development, you are on the wrong one.",
    "When did Dressmaker come out?",
    "Dressmaker released on Steam on September 21, 2026 for Windows and macOS. The free prototype has been on itch.io since 2025."
  ],
  [
    "Is Dressmaker on Nintendo Switch, PlayStation or Xbox?",
    "Not yet. The released game is Windows and macOS on Steam, plus the Windows, macOS and Linux prototype on itch.io. In the launch-day Steam announcement the developers said they are planning mobile and Switch ports, so a console version is on the roadmap rather than available today."
  ],
  [
    "Is there a Dressmaker mobile app or a browser version I can play now?",
    "No playable mobile or browser version exists today, and we will not pretend otherwise. The developers did say on launch day that mobile ports are being planned, so expect an official announcement before any real app appears. Any site offering a Dressmaker APK or an online playable version right now is not affiliated with the developers."
  ],
  [
    "How long is Dressmaker?",
    "The developers describe roughly **35 hours of story commissions**, before off-rack dresses, decorating for fun and the post-launch content they have said is still coming."
  ],
  [
    "Is Dressmaker made with AI?",
    "No. The developers have said the game is privately owned and made by hand, and the itch.io prototype carries the **No generative AI was used** tag. Art, code and music are credited to named people."
  ],
  [
    "Is Dressmaker hard?",
    "It is gentle by design — there is no timer and no fail state in the usual sense. The difficulty is that cutting is irreversible, so a careless layout costs fabric and coin. If you can plan a jigsaw, you can play Dressmaker."
  ],
  [
    "Where do I get Dressmaker?",
    "Buy it on **Steam** for Windows and macOS, or try the free prototype at **elyaradine.itch.io/dressmaker**. Both links go to the developers' own pages."
  ]
];

export const page = {
  url: '/',
  title: 'Dressmaker Game: How to Play, Release Date & Tips',
  description: 'Dressmaker is a cozy dressmaking sim out now on Steam. Learn how to play, cut patterns and sew, plus demo download, price, customers and beginner tips.',
  h1: 'Dressmaker Game',
  eyebrow: 'Complete guide',
  lede: "Dressmaker is a cozy dressmaking simulator from developers elyaradine (Jonathan Hau-Yoon), sarandipityx (Sara Laubscher) and raithza (Ruan Rothmann), published by Free Lives under the Cozy Lives label. You run a small dress shop: take a commission, choose the fabric, lay out the pattern, cut it out, sew it together and decorate the finished dress. Then you hand it in and find out whether your customer loves it — or whether you have quietly ruined their wedding.",
  facts: [
    ['Released', 'September 21, 2026'],
    ['Price', '$14.99, or $13.49 at launch'],
    ['Platforms', 'Windows and macOS'],
    ['Free prototype', 'Playable now on itch.io'],
    ['Made by', 'Cozy Lives, published by Free Lives'],
    ['Length', 'About 35 hours of commissions'],
  ],
  updated: '2026-09-21',
  updatedHuman: 'September 21, 2026',
  ogType: 'article',
  preload: SHOT_hero,
  crumbs: [{ name: 'Home', url: '/' }],
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: 'Dressmaker',
      alternateName: 'Dressmaker game',
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
    ['Dressmaker on Steam', LINKS.steam],
    ['Dressmaker prototype on itch.io', LINKS.itch],
    ['Official Steam announcements', LINKS.steamNews],
  ],
  body: BODY,
};
