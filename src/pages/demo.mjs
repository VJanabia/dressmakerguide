import { SHOTS, resolveShots } from '../data/images.mjs';
import { LINKS } from '../data/site.mjs';

const BODY = [
  "> Short answer: The Dressmaker demo is a **free prototype on itch.io** — name your own price, Windows, macOS and Linux, about 115–128 MB. It is a standalone prototype, not a Steam demo of the full game, and the paid release on Steam is a much larger game.",
  "",
  "The free **Dressmaker demo** is the prototype on the developers' own itch.io page: [elyaradine.itch.io/dressmaker](@LINK_itch@). It is **name your own price**, so you can take it for $0, and it runs on Windows, macOS and Linux. It is the only official free download that exists.",
  "Two things to get straight first. This is a **prototype**, not the finished game, and the developers label it that way themselves. The paid **Steam release is a separate, much bigger game**: not the same download with more content bolted on.",
  "If you are here for the story, the town of clients and an ending, skip straight to the Steam release. If you want to know whether cutting a pattern on the bias feels as good as it sounds, the prototype answers that in an evening.",
  "![A green off-the-shoulder dress on a mannequin with the commission completion options](@SHOT_itch@ Hand the dress in, keep working on it, or sell it instead of delivering the commission.)",
  "## Where the free Dressmaker download is",
  "The download lives at [elyaradine.itch.io/dressmaker](@LINK_itch@). elyaradine is Jonathan Hau-Yoon, one of the three developers behind the game, so it is first-party, not a mirror.",
  "The prototype is listed as **name your own price**. Clicking **Download Now** opens itch.io's purchase page, where the price field accepts $0. Pay something if you want to support the team; the files are the same either way. That page is [the Dressmaker download page](@LINK_itchDownload@).",
  "The current build is **version 0.5.5**, and each platform gets its own zip:",
  "| Platform | File | Size |\n|---|---|---|\n| Windows | Dressmaker Prototype Windows 0.5.5.zip | 115 MB |\n| Linux | Dressmaker Prototype Linux 0.5.5.zip | 127 MB |\n| macOS | Dressmaker Prototype OSX 0.5.5.zip | 128 MB |",
  "The prototype is a small download. The Steam release downloads about **296 MB on Windows** and **309 MB on macOS**. Steam has no Linux depot, so the prototype is the only way to play Dressmaker on Linux.",
  "### There is no browser version and no APK",
  "Worth saying plainly: there is **no playable browser version** of Dressmaker and **no released mobile or APK version**. The developers said at launch that mobile ports are being planned, so this may change, but it will be announced by them first. Any site offering a playable-in-your-browser Dressmaker or a Dressmaker APK today is unofficial.",
  "## How to download and run the prototype",
  "Here is the whole flow in order.",
  "1. Open the official page: [elyaradine.itch.io/dressmaker](@LINK_itch@).\n2. Click **Download Now**. itch.io opens a purchase page because the listing is name your own price.\n3. Enter **$0** if you want it free, or any amount you feel like paying, and continue.\n4. Pick the zip for your machine: Windows (115 MB), Linux (127 MB) or macOS (128 MB).\n5. Unzip it somewhere you will find again, rather than running it from the zip preview.\n6. Open the unzipped folder and run the game. On a Mac there is one extra step, and it is next.",
  "## The macOS warning, and the official fix",
  "The macOS build is **not notarized**, because the team does not have an Apple developer account. macOS refuses to open it normally and warns that it cannot verify the developer and that the app may be malicious. The developers publish their own workaround on the itch page.",
  "1. Open **System Settings** from the Apple menu.\n2. Go to **Privacy & Security**.\n3. Scroll down to the security section, where macOS lists the blocked app, and click **Open Anyway**.\n4. Confirm the choice in the second prompt that appears.",
  "> Note: this is the route the itch page itself documents. You only need to do it once.",
  "## What is actually in the prototype",
  "The prototype is the project the full game grew out of. It started as a **Free Lives project made in about three weeks**, with **another month or two of work** added in a later update. The loop is the one the Steam release is built on: take a commission, choose fabric, cut and arrange the pattern pieces, sew, decorate, and hand the dress to a customer who reacts to it.",
  "The developers are blunt about this: \"It has a lot of unfinished seams, and ideas that had to be left on the cutting room floor.\" Expect a working sketch rather than a polished slice. The [Dressmaker sewing tips](/sewing-tips) page explains grain, bias and layout in plain English if you want a head start.",
  "### It is not a Steam demo",
  "The prototype is not a demo of the Steam release; the two are separate downloads. It is the original itch.io project at version 0.5.5, published long before the September 2026 launch build, and nothing in it is a cut-down version of Steam content.",
  "### Prototype 0.5.5 next to the full release",
  "| Prototype on itch.io (0.5.5) | Full game on Steam |\n|---|---|\n| Free, name your own price | $14.99, or $13.49 with the 10% launch discount |\n| Windows, macOS and Linux | Windows and macOS |\n| About three weeks of Free Lives work plus another month or two | The content-complete launch build |\n| The developers describe \"a lot of unfinished seams\" | Over 150 dress pieces, over 450 fabrics and over 350 accessories |\n| No story length published | Roughly 35 hours of story commissions, a town of clients, achievements and an ending |",
  "The prototype shows you the craft; the full game gives you the career. The town of clients, the achievements and the ending exist only in the paid release, and [Dressmaker customer preferences](/customers) covers what those commissions ask.",
  "## What players say about the prototype",
  "The itch.io page currently shows **4.8 out of 5 from 834 ratings**, with roughly **1,208 comments** — a lot of feedback for something still labelled a prototype. That score rates the free itch build, not the Steam release. Read the comments yourself at [elyaradine.itch.io/dressmaker](@LINK_itch@).",
  "## Who should download it, and who should skip it",
  "**Download the prototype if:**",
  "- You want to test the cutting and layout loop before spending $14.99.\n- You play on Linux, where there is no Steam build.\n- You enjoy seeing where a game came from, unfinished seams included.\n- You want a short, cozy session and do not mind that some ideas stop halfway.",
  "**Skip it if:**",
  "- You are here for the story commissions, the town of clients and the ending. Those live in the paid release.\n- You want the full wardrobe of over 150 dress pieces, over 450 fabrics and over 350 accessories.\n- Unfinished builds bother you more than they intrigue you.",
  "Because the prototype is free, the only thing you risk is an evening. If the loop grabs you, the [Dressmaker guide to how to play](/how-to-play) walks through the same steps in the finished game, and the [dressmaker game](/) overview covers the release and the price.",
  "## Is the full game free?",
  "No. Asked directly in the itch.io comments roughly three weeks before launch, developer elyaradine answered: \"No, the full [game will not be free].\" The Steam release is **$14.99**, or **$13.49** with the 10% launch discount, and the developers have confirmed there are **no microtransactions and no ads**. The [Dressmaker Steam release date](/release-date) page has the price, the platforms and the launch bundles.",
  "## Questions people ask before downloading",
  "### Do I need a gaming PC to run it?",
  "The developers have not published system requirements for the itch prototype, so we will not invent any. Steam lists **Windows 10 or later with an Intel Core i5 or AMD Ryzen, 8 GB of RAM and Intel UHD 630 graphics or better**, and **an Apple M1 with 8 GB of RAM** on Mac, with **1 GB of storage** on both.",
  "### Is the Dressmaker prototype free?",
  "Yes. The prototype on itch.io is name your own price, so you can download it for $0 or pay whatever you think it is worth. The paid Steam release is a separate, much bigger game.",
  "### Is the itch.io prototype a Steam demo?",
  "No. It is the original standalone prototype at version 0.5.5, and it is not a cut-down slice of the September 2026 Steam release. The two are separate downloads.",
  "### Is there a browser version or a Dressmaker APK?",
  "Not today. There is no playable browser version and no released mobile or APK version of Dressmaker. The developers said at launch that mobile ports are being planned, so watch their official channels. Anything offering either right now is unofficial.",
  "### Do I need a gaming PC to run the prototype?",
  "The developers have not published system requirements for the itch prototype. For the full game, Steam lists minimum specifications only, with no recommended tier.",
  "### Is the prototype still being updated?",
  "The current download is version 0.5.5, and the page showed an update within the last week when we checked in late September 2026. The developers have not published a roadmap for further prototype updates. The \"more free content and new features coming soon\" line in the September 2026 devlog refers to the full game.",
  "### What if it will not launch?",
  "Start with [Dressmaker troubleshooting](/troubleshooting), and remember that on macOS the notarization warning is expected, not a sign of a broken download. The team also links its Discord from the itch page at [discord.gg/tBa93Rzgj5](https://discord.gg/tBa93Rzgj5), the fastest place to ask a human.",
].join("\n\n")
  .split('\n').map((line) => resolveShots(line)).join('\n')
  .replaceAll('@LINK_itch@', LINKS.itch)
  .replaceAll('@LINK_itchDownload@', LINKS.itchDownload);

const FAQ = [
  [
    "Is the Dressmaker prototype free?",
    "Yes. The prototype on itch.io is name your own price, so you can download it for $0 or pay whatever you think it is worth. The paid Steam release is a separate, much bigger game."
  ],
  [
    "Is the itch.io prototype a Steam demo?",
    "No. It is the original standalone prototype at version 0.5.5, and it is not a cut-down slice of the September 2026 Steam release. The two are separate downloads."
  ],
  [
    "Is there a browser version or a Dressmaker APK?",
    "Not today. There is no playable browser version and no released mobile or APK version of Dressmaker. The developers said at launch that mobile ports are being planned, so watch their official channels. Anything offering either right now is unofficial."
  ],
  [
    "Do I need a gaming PC to run the prototype?",
    "The developers have not published system requirements for the itch prototype. For the full game, Steam lists minimum specifications only, with no recommended tier."
  ],
];

export const page = {
  url: '/demo',
  title: "Dressmaker Demo: Free Prototype Download on itch.io",
  description: "The Dressmaker demo is a free, name-your-own-price prototype on itch.io: Windows, macOS and Linux downloads, file sizes and the macOS fix.",
  h1: 'Dressmaker Demo and Free Download',
  eyebrow: "Free prototype",
  lede: "The free Dressmaker demo is the prototype on the developers' own itch.io page: elyaradine.itch.io/dressmaker. It is name your own price, so you can take it for $0, and it runs on Windows, macOS and Linux. It is the only official free download that exists.",
  facts: [
    ['Price', "Free, name your own price"],
    ['Where', "itch.io, the developers’ own page"],
    ['Platforms', "Windows, macOS and Linux"],
    ['Download', "About 115–128 MB"],
    ['Version', "Prototype 0.5.5"],
    ['Rating', "4.8 of 5 from 834 ratings"],
  ],
  updated: '2026-09-21',
  updatedHuman: 'September 21, 2026',
  ogType: 'article',
  crumbs: [{ name: 'Home', url: '/' }, { name: 'Demo', url: '/demo' }],
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
    ['Dressmaker prototype on itch.io', LINKS.itch],
    ['itch.io download page', LINKS.itchDownload],
    ['itch.io devlog', LINKS.itchDevlog],
  ],
  body: BODY,
};
