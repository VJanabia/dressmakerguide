import { LINKS } from '../data/site.mjs';

export const notFoundPage = {
  url: '/404',
  title: 'Page not found | Dressmaker Guide',
  description: 'That page does not exist on Dressmaker Guide. Jump back to the Dressmaker game homepage, or go straight to the how to play guide, the wiki or the demo page.',
  h1: 'That page is not on the pattern table',
  crumbs: [{ name: 'Home', url: '/' }],
  noindex: true,
  body: [
    'The page you asked for does not exist here. It may have been renamed, or the link that brought you here may have a typo in it.',
    '',
    '## Where to go instead',
    '',
    '- [Dressmaker game homepage](/) - what the game is, how it plays and what it costs',
    '- [How to play Dressmaker](/how-to-play) - the full walkthrough from first commission to finished dress',
    '- [Getting started and beginner tips](/sewing-tips) - the mistakes that cost you fabric and coin',
    '- [Customer preferences](/customers) - how to read a brief and keep your reputation intact',
    '- [Dressmaker wiki](/wiki) - fabric, pattern and accessory tables',
    '- [Demo download](/demo) - play the free itch.io prototype',
    '- [Steam release date](/release-date) - launch details, price and platforms',
    '- [Patch notes](/patch-notes) - what the developers changed and when',
    '',
    'If a link on this site sent you here, please [tell us about it](/contact) so we can fix it.',
    '',
    '> Note: Dressmaker Guide is an unofficial fan site and is not affiliated with the developers. The official pages are the [Steam store page](' + LINKS.steam + ') and the [itch.io prototype](' + LINKS.itch + ').',
  ].join('\n'),
};
