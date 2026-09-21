# Research log: Dressmaker patch notes / update history

Collected 2026-09-21 for /patch-notes (src/pages/patch-notes.mjs). Re-verify with the commands at the
bottom. Everything below was read from a first-party source: Steam's own news API and the
developers' own itch.io devlog feed.

## Sources used

1. Steam news API (authoritative list of Steam announcements for app 4019220):
   https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=4019220&count=100&maxlength=0&format=json
2. itch.io devlog RSS (authoritative, complete devlog list):
   https://elyaradine.itch.io/dressmaker/devlog.rss
3. Human-facing pages: https://store.steampowered.com/news/app/4019220 and
   https://elyaradine.itch.io/dressmaker/devlog
4. https://steamdb.info/app/4019220/patchnotes/ (used only to confirm there is no patch-notes feed;
   its page content is mostly navigation, so no facts were taken from it)

NOTE: reading https://store.steampowered.com/news/app/4019220 through a JS-rendering extractor
returns the page chrome and the words "No more older posts found" but NOT the post list. The Steam
news API is the reliable way to enumerate the posts. Same for itch.io: ?page=2 and ?page=3 return
page 1 content to the extractor; the RSS feed is the reliable enumeration.

## Key finding: there are no post-launch patch notes

The Steam news API returns exactly **8 items** for app 4019220, and every one carries
feedlabel = "Community Announcements". There is no item with feedlabel "Patchnotes" and no item
dated after launch day. The newest Steam post is the launch announcement itself (2026-09-21).

Conclusion used on the page: as of September 21, 2026 the released build has **no published
post-launch patch**. Do not print a version number for the Steam build — none has been published.

## Steam announcements (8 items, all "Community Announcements")

| # | Date (UTC) | Title | URL |
|---|---|---|---|
| 1 | 2026-09-21 | Dressmaker - Out Now! | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1844115010501162 |
| 2 | 2026-09-07 | Scalding September Tea: Price Announcement | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1842846814453407 |
| 3 | 2026-08-31 | Dressmaker August Tea | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1842212951310643 |
| 4 | 2026-07-28 | Dressmaker July Tea: Launch Date Announcement | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1839041357038561 |
| 5 | 2026-06-09 | Dressmaker Just Hit 100k Wishlists! | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1834602721202194 |
| 6 | 2026-06-06 | Dressmaker showcase at Wholesome Direct | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1834602721194070 |
| 7 | 2026-05-27 | Dressmaker May Tea | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1833968530885410 |
| 8 | 2026-04-15 | Dressmaker April Tea | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1830163047255567 |

The Steam page went up in September 2025 (per the itch devlog "Update and Steam wishlist!"), but
Steam carries **no announcement from 2025** — the earliest is April 2026. So the Steam feed is
incomplete as a history of the project; the itch devlog covers 2025.

## itch.io devlog (16 items, complete list per the RSS feed)

| # | Date | Title | URL |
|---|---|---|---|
| 1 | 2026-09-07 | Scalding September Tea: Price announcement | https://elyaradine.itch.io/dressmaker/devlog/1655725/scalding-september-tea-price-announcement |
| 2 | 2026-08-31 | August Tea (3 weeks until launch!) | https://elyaradine.itch.io/dressmaker/devlog/1647471/august-tea-3-weeks-until-launch |
| 3 | 2026-07-28 | July Tea (and Launch Date announcement!) | https://elyaradine.itch.io/dressmaker/devlog/1607332/july-tea-and-launch-date-announcement |
| 4 | 2026-06-03 | Belated May Tea | https://elyaradine.itch.io/dressmaker/devlog/1542951/belated-may-tea |
| 5 | 2026-04-17 | April Tea | https://elyaradine.itch.io/dressmaker/devlog/1491987/april-tea |
| 6 | 2025-11-11 | We've gone quiet! (posted by sarandipityx) | https://elyaradine.itch.io/dressmaker/devlog/1110229/weve-gone-quiet |
| 7 | 2025-10-03 | Hotfix 0.5.5 | https://elyaradine.itch.io/dressmaker/devlog/1064949/hotfix-055 |
| 8 | 2025-09-29 | Hotfix 0.5.3 | https://elyaradine.itch.io/dressmaker/devlog/1061725/hotfix-053 |
| 9 | 2025-09-23 | 0.5.1 - Bug fixes and some new content | https://elyaradine.itch.io/dressmaker/devlog/1039264/051-bug-fixes-and-some-new-content |
| 10 | 2025-09-18 | Update and Steam wishlist! | https://elyaradine.itch.io/dressmaker/devlog/1034568/update-and-steam-wishlist |
| 11 | 2025-09-09 | Hotfix update | https://elyaradine.itch.io/dressmaker/devlog/1027697/hotfix-update |
| 12 | 2025-09-05 | Small update and... GREAT NEWS | https://elyaradine.itch.io/dressmaker/devlog/1024947/small-update-and-great-news |
| 13 | 2025-09-03 | Small patch version 0.4.2 | https://elyaradine.itch.io/dressmaker/devlog/1023706/small-patch-version-042 |
| 14 | 2025-09-02 | Small patch version 0.4.1 | https://elyaradine.itch.io/dressmaker/devlog/1023033/small-patch-version-041 |
| 15 | 2025-09-01 | Big update, and some mixed news | https://elyaradine.itch.io/dressmaker/devlog/1022132/big-update-and-some-mixed-news |
| 16 | 2025-08-04 | A small update | https://elyaradine.itch.io/dressmaker/devlog/1001926/a-small-update |

RSS pubDates are GMT; the itch page shows the same day. Note item 7: the 0.5.5 zip files themselves
are stamped "02 October 2025 @ 15:49 UTC" while the devlog post is dated October 3, 2025. The page
uses the devlog date.

## Version numbers that are actually published

Prototype only: **0.4.1, 0.4.2, 0.5.1, 0.5.3, 0.5.5**. The newest prototype files on itch.io are
still labelled 0.5.5 (Windows/Linux/macOS zips), so there has been no prototype build patch since
October 2025. Several prototype-era posts shipped without a published number (2025-08-04,
2025-09-05, 2025-09-09, 2025-09-18) — the page lists those by date only rather than guessing.

**No version number exists in print for the released Steam build.**

## Channel date mismatches (do not "fix" these — they are real)

- April Tea: Steam 2026-04-15, itch.io 2026-04-17 (two days apart).
- May Tea: Steam 2026-05-27 as "Dressmaker May Tea"; itch.io 2026-06-03 as "Belated May Tea". The
  itch post explains the delay was flu and that the post had already gone to Steam without her.

## Content notes captured from the posts (used on the page)

- 2026-09-21 launch post: small updates "in the immediate weeks" to fix bugs found since release
  "with a sprinkling of new fabrics and accessories on top"; longer-term plans listed as an online
  challenge mode (compare and vote on dresses), transparent fabrics not in the launch build, proper
  controller support ("runs fast on the Steam Deck" but wants real pad support), and planned mobile
  and Switch ports.
- 2026-09-07: $14.99, regional pricing, -10% launch discount; no microtransactions, ads, data
  harvesting or generative AI; approx 35 hours of story commissions (excluding off-rack), 150+ dress
  pieces, 450+ fabrics, 350+ accessories.
- 2026-08-31: launch date will be met; game content complete (credits compiled, ending sequence
  done, open source licences included, achievement icons painted); three full-time devs, almost 40
  years combined experience; named collaborators (sound, character art, production, QA, community,
  marketing, story, music, key art).
- 2026-07-28: 200,000+ wishlists; launch date 21 September 2026; early-build sign-ups for creators
  under embargo; front desk makeover.
- 2026-06-09: passed 100,000 wishlists.
- 2026-06-06: Wholesome Direct trailer, September 2026 window announced.
- 2026-05-27: fabric inventory rework (highlight preview, name on hover only); off-rack dress
  feature; 9 of 10 planned characters illustrated.
- 2026-04-15: characters measured and mannequin adjusted to fit, pattern pieces drafted from those
  measurements; new shaders for silk/velvet sheen and possible "fabrics" like sequins; fabric and
  accessories shop rebuilt.
- 2025-09-29 (0.5.3): less finicky trim placement; middle-click zoom in mannequin scene; green trim
  fix; ruffle skirt ("the megaskirt") rebuilt with equal side panels (broke existing dresses made
  with that pattern); new needle/pin models; patterns not fitting in the cutting room fixed;
  sketchbook paging while the pencil is selected; new Argyle wool fabrics; new red silk; Gothic
  Collar pattern added. Follow-up fixed a niche save-corruption bug and fabrics that were not
  unlocking.
- 2025-10-03 (0.5.5): flounce sleeves showed the three-quarter sleeve sprite in the sketchbook;
  ruffle skirt grainline and naming wrong; the fix broke panel ordering on existing ruffle skirts.
- 2025-09-23 (0.5.1): new bodice and skirt (skirt "may genuinely require in the region of about 40m
  of fabric to cut"); fairly accurate seam allowances shown in cutting room and sewing; inventory
  menu replaces fabric cycling; better mannequin background; new trims; fixes to sewing direction
  detection, upside-down default patterns, sketchbook colour picker, clipping meshes.
- 2025-09-05: Free Lives greenlit the full game; sketchbook preview beside the cutting room table.
- 2025-09-01: buttons and bows, pageable dress history, panel colouring, tag previews, sewing speed
  control, one new character with two quests; plus the admission that downloads were not yet high
  enough to make funding an easy decision.
- 2025-08-04: first patch — Reset Save fixed, sewing more forgiving, confetti audio toned down.

## Could not verify / incomplete

- **No Steam patch notes exist to list.** If the site owner finds any later, they will appear at
  https://store.steampowered.com/news/app/4019220 with feedlabel "Patchnotes" in the API above.
- The Steam news feed only starts in April 2026, so it is not a complete project history on its own.
- The itch.io RSS feed returns 16 items and appears complete (it ends at the earliest post visible
  on the devlog page), but RSS feeds can be truncated — treat the itch list as complete "as far as
  the feed reports".
- **One fact not in docs/dressmaker-facts.md:** the launch post says the team is "also planning
  mobile and Switch ports". The facts file currently says no console version has been announced and
  that there is no official mobile version. The page states the port plans as the developers' own
  launch-day statement, attributed as a plan, not as a release. Worth reconciling with
  /release-date and the facts file before the next build.
- No post-launch patch version numbers, no hotfix dates after 2026-09-21, and no update cadence
  beyond the phrase "in the immediate weeks" — none of that is published.

## How to re-verify

```
# Steam announcements for the app (JSON, authoritative)
python -c "import urllib.request,json,datetime;d=json.load(urllib.request.urlopen('https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=4019220&count=100&maxlength=0&format=json'));[print(datetime.datetime.fromtimestamp(i['date'],datetime.timezone.utc).date(), i['feedlabel'], i['title']) for i in d['appnews']['newsitems']]"

# itch.io devlog feed (complete list of devlogs)
python -c "import urllib.request;print(urllib.request.urlopen('https://elyaradine.itch.io/dressmaker/devlog.rss').read().decode('utf-8','replace')[:4000])"

# the page must still load and render
cd D:/DSH/dressmakerguide && node -e "import('./src/pages/patch-notes.mjs').then(m=>console.log('OK', m.page.title.length))"
```
