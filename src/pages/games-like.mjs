import { SHOTS, resolveShots } from '../data/images.mjs';
import { LINKS } from '../data/site.mjs';

const SHOT_cut = SHOTS.cut.src;

const BODY = [
  "> Short answer: If you want the feeling of Dressmaker without the dressmaking, start with **Unpacking**, **A Little to the Left** or **Wilmot's Warehouse** for tactile organising, and **Calico** or **Strange Horticulture** for cozy making with a shop attached. None of them replace Dressmaker's fabric-layout mechanic, which is the part that is genuinely unusual.",
  "",
  "If you go looking for games like Dressmaker, most cozy lists hand you farming sims and shop-management games. Dressmaker is neither. The [dressmaker game](/) is about making one beautiful thing with your hands: choosing the fabric, laying out the pattern pieces, cutting, sewing, decorating. The shop is scaffolding around that.",

  "The question worth asking is not whether a game is cozy. It is whether it puts a real object under your hands. The ten below pass that test in different ways, some by making, some by decorating, some by organizing. None of them is Dressmaker, and where each falls short is worth saying out loud.",

  "![Paper pattern pieces laid out on strawberry-print fabric with shears resting on the cloth](@SHOT_cut@ Pattern pieces laid on the cloth decide what the dress will look like. Then the shears decide it permanently.)",

  "## How to choose",

  "- **The making.** If you like the cutting, the sewing rhythm and the moment a garment comes together, try *Potion Craft* and *Strange Horticulture* for hands-on workbenches, and *Stardew Valley* for a crafting loop wrapped around a town.\n- **The decorating.** If you liked placing buttons, bows and lace wherever you wanted, go to *Calico*, *House Flipper* and *Town to City*.\n- **The organizing.** If fitting pattern pieces onto a bolt without waste was your favorite part, *Unpacking*, *A Little to the Left* and *Wilmot's Warehouse* are the closest matches anyone has shipped.\n- **The plain physical satisfaction.** If you want a surface changing under your hands and nothing to design, *PowerWash Simulator* is the purest version of it.",

  "## Ten cozy games like Dressmaker",

  "### Unpacking (2021)",

  "Unpacking is a wordless puzzle game about emptying boxes into a new home and finding a place for every object. What it shares with Dressmaker is the hands: you pick things up, turn them, and decide exactly where they live, with no timer and no way to lose. It is the most tactile game here. The difference is that you are arranging a life that already exists rather than designing something new, and it quietly judges your choices.",

  "Where to play: [Steam](https://store.steampowered.com/app/1135690/Unpacking/)",

  "### A Little to the Left (2022)",

  "Max Inferno's tidy-up puzzler hands you a shelf or a drawer and asks you to arrange the objects into something that feels right, then sends a cat through to wreck it. That is the same itch you get in Dressmaker when pattern pieces finally fit onto a bolt without waste: calm, fiddly in the best way, and never punishing. The difference is that every puzzle here has an intended answer, while a dress only has yours.",

  "Where to play: [Steam](https://store.steampowered.com/app/1629520/A_Little_to_the_Left/)",

  "### Wilmot's Warehouse (2019)",

  "You are a small square in a big warehouse, and your job is to sort tiles into a layout that only you understand. Later, when an order comes in, you have to remember where you put things. It shares Dressmaker's quiet spatial thinking and its refusal to rush you. The difference is that Wilmot's has no aesthetic at all: there is no right-looking answer, only a system that works. If the layout is your favorite part of Dressmaker, start here.",

  "Where to play: [Steam](https://store.steampowered.com/app/839870/Wilmots_Warehouse/)",

  "### Potion Craft: Alchemist Simulator (2022)",

  "If the sewing machine is your favorite object in Dressmaker, this is the closest thing to it. You grind herbs with a mortar, stir the cauldron, draw a path across an alchemy map to land on the effect you want, then sell the bottle to whoever walks in. It is hands-on, tactile and shop-shaped in exactly the way Dressmaker is. The difference is that alchemy has correct answers and a resource economy; dressmaking has taste.",

  "Where to play: [Steam](https://store.steampowered.com/app/1210320/Potion_Craft_Alchemist_Simulator/)",

  "### Strange Horticulture (2022)",

  "This is a shop game, but the making is real: you identify plants by leaf shape and smell, arrange them into your collection and set them on the counter for customers with specific needs. The pleasure of handling specimens and matching them to a request is very close to Dressmaker's customer loop. Be warned, though. Strange Horticulture has a dark occult mystery underneath it, a map to explore and endings you can get wrong.",

  "Where to play: [Steam](https://store.steampowered.com/app/1574580/Strange_Horticulture/)",

  "### Calico (2020)",

  "Calico is a cozy community sim about running a cat cafe in a town of magical girls and talking animals. You bake, you gather, you recruit animals, and most importantly here, you decorate your cafe however you like. That freedom to place things purely because they look good is the Dressmaker feeling. The difference is that Calico spreads itself across many small activities, so no single one runs as deep.",

  "Where to play: [Steam](https://store.steampowered.com/app/1112890/Calico/)",

  "### House Flipper (2018)",

  "House Flipper is the decorating half of Dressmaker stretched into a whole game. You buy a wreck, clean it, repair it, knock down walls and furnish every room, then sell it. The physical satisfaction of scrubbing a floor until it shines is immediate, and the before-and-after is genuinely yours. What it lacks is Dressmaker's restraint: the goal is a profitable sale, and nobody reacts to your taste the way a client does.",

  "Where to play: [Steam](https://store.steampowered.com/app/613100/House_Flipper/)",

  "### PowerWash Simulator (2022)",

  "No game on this list is more purely satisfying to hold. You point a power washer at something filthy and watch the grime come off in strips until the surface gleams. There is no fail state, no timer and no story to keep up with. It shares Dressmaker's core pleasure, a physical action that visibly changes the thing in front of you, while sharing none of its creativity. There is exactly one correct result, and it is *clean*.",

  "Where to play: [Steam](https://store.steampowered.com/app/1290000/PowerWash_Simulator/)",

  "### Stardew Valley (2016)",

  "Stardew Valley is the pick for anyone who misses the town more than the dress. You farm, craft, fish and cook, and the townsfolk have tastes, schedules and opinions you slowly learn to read — the same skill Dressmaker asks for when a client describes what they want. The honest differences are large: Stardew runs on a daily clock, seasons and energy, and it will send you into a mine with a sword.",

  "Where to play: [Steam](https://store.steampowered.com/app/413150/Stardew_Valley/)",

  "### Town to City",

  "Town to City is the cozy city builder that Dressmaker shipped alongside in the \"Dressmaker X Town to City\" bundle, which takes 10% off each game if you buy them together. The pleasure in it is placement: houses, trees and lamp posts, arranged until a street looks the way you imagined. That is Dressmaker's satisfaction at a larger scale, but you are composing a town rather than one garment.",

  "Where to play: [Steam](https://store.steampowered.com/app/3115220/Town_to_City/)",

  "## What none of these can replace",

  "None of the ten is Dressmaker, and the gap is wider than a genre label suggests.",

  "The mechanic that makes Dressmaker hard to substitute is the fabric layout. Pattern pieces go onto a bolt of cloth, and where you put them is what ends up on the finished dress. Aligned to the grain it reads neat and even; cut on the bias the same cloth behaves differently; every panel can use a different fabric. That decision is permanent the moment the shears go through.",

  "So treat this list as a substitute for the feeling, not the feature. The [how to play Dressmaker](/how-to-play) walkthrough covers the layout stage in full. Dressmaker itself released on September 21, 2026 on Steam for Windows and macOS at $14.99, with a 10% launch discount to $13.49; the [Dressmaker release date](/release-date) page has the details, and the free itch.io prototype on the [demo page](/demo) is the cheapest way to find out whether the cutting rhythm clicks for you.",

  "| Game | The Dressmaker-like itch it scratches | Platform |\n|---|---|---|\n| Unpacking | Placing every object by hand until a room feels finished | Windows, macOS, Linux |\n| A Little to the Left | Tidying a small space into a satisfying arrangement | Windows, macOS |\n| Wilmot's Warehouse | Sorting a layout that only makes sense to you | Windows, macOS |\n| Potion Craft: Alchemist Simulator | Hands-on making at a workbench, one item at a time | Windows |\n| Strange Horticulture | Handling materials and matching them to a request | Windows, macOS |\n| Calico | Decorating a space purely because it looks good | Windows, macOS |\n| House Flipper | Cleaning, repairing and furnishing a room until it sings | Windows, macOS |\n| PowerWash Simulator | The plain physical joy of a surface coming clean | Windows |\n| Stardew Valley | A town whose tastes you slowly learn to read | Windows, macOS, Linux |\n| Town to City | Composing a view with nobody rushing you | Windows |",

  "Every link above goes to that game's own Steam store page, and each platform list comes from the same listing. Dressmaker itself is a Windows and macOS release on [Steam](@LINK_steam@)."
].join("\n\n")
  .split('\n').map((line) => resolveShots(line)).join('\n')
  .replaceAll('@LINK_steam@', LINKS.steam);

export const page = {
  url: '/games-like',
  title: 'Games Like Dressmaker: 10 Cozy Crafting Picks',
  description: 'Ten cozy games like Dressmaker, picked for hands-on making, decorating and organizing, with Steam links and an honest note on what none of them replace.',
  h1: 'Games Like Dressmaker',
  eyebrow: "Recommendations",
  lede: "If you go looking for games like Dressmaker, most cozy lists hand you farming sims and shop-management games. Dressmaker is neither. The dressmaker game is about making one beautiful thing with your hands: choosing the fabric, laying out the pattern pieces, cutting, sewing, decorating. The shop is scaffolding around that.",
  facts: [
    ['Closest match', "Unpacking"],
    ['For organising', "A Little to the Left, Wilmot’s Warehouse"],
    ['For cozy making', "Calico, Strange Horticulture"],
    ['For town life', "Stardew Valley, Cozy Grove"],
    ['Launch bundle', "Town to City"],
    ['Unreplaceable', "The fabric-layout mechanic"],
  ],
  updated: '2026-09-21',
  updatedHuman: 'September 21, 2026',
  ogType: 'article',
  crumbs: [{ name: 'Home', url: '/' }, { name: 'Games Like Dressmaker', url: '/games-like' }],
  sources: [
    ['Dressmaker on Steam', LINKS.steam],
    ['Official itch.io devlog', LINKS.itchDevlog],
  ],
  body: BODY,
};
