# Steam app 4019220 "Dressmaker" — verified fact sheet
Fetched: 2026-09-21 (UTC) directly from Steam endpoints via curl (no bridge needed).
Raw artifacts: D:/DSH/steam_4019220_appdetails.json , D:/DSH/steam_4019220_page.html , D:/DSH/ar.json

## Sources
- S1 API: https://store.steampowered.com/api/appdetails?appids=4019220&cc=us&l=english
- S2 page: https://store.steampowered.com/app/4019220/Dressmaker/?cc=us&l=english
- S3 reviews API: https://store.steampowered.com/appreviews/4019220?json=1&language=all&purchase_type=all&num_per_page=0
- S4 search API: https://store.steampowered.com/api/storesearch/?term=Dressmaker&l=english&cc=us

## Core
- name: Dressmaker (S1)
- steam_appid: 4019220 (S1)
- type: game (S1)
- is_free: false (S1)
- required_age: 0 (S1)
- release_date: { date: "Sep 21, 2026", coming_soon: false } (S1). Store page embeds release_date unix ts 1789990310 = 2026-09-21T11:31:50Z (S2)
- price_overview (S1): currency USD, initial 1499 (= $14.99, initial_formatted "$14.99"), final 1349 (= $13.49, final_formatted "$13.49"), discount_percent 10
- package: 1410125, option_text "Dressmaker - <span class=\"discount_original_price\">$14.99</span> $13.49" (S1)
- developers: ["Cozy Lives"] (S1)
- publishers: ["Free Lives"] (S1)
- platforms: windows true, mac true, linux false (S1)

## Genres / categories (S1, verbatim)
- genres: Casual (id 4), Simulation (id 28)
- categories: Single-player (2), Steam Achievements (22), Custom Volume Controls (68), Mouse Only Option (76), Playable without Timed Input (74), Steam Cloud (23), Family Sharing (62)
- No controller/full-controller-support category is present. No "Steam Trading Cards", no "Steam Workshop".

## Languages (S1, raw)
"English<strong>*</strong>, Simplified Chinese<strong>*</strong>, Japanese<strong>*</strong><br><strong>*</strong>languages with full audio support"
=> English, Simplified Chinese, Japanese; all three with full audio support.

## Links (S1)
- website: https://www.freelives.net
- support_info: { url: "www.freelives.net", email: "support@freelives.net" }

## short_description (S1)
"Become a dressmaker! Choose fabric, cut out patterns, and sew them all together to satisfy (or sabotage!) townsfolk in this cozy crafting game inspired by real dressmaking."

## "About the game" bullet list (S1 about_the_game, final <ul>)
- Buy from a wide range of fabrics, including cotton, linen, wool, silk and velvet.
- Design and colour your dress in your sketchbook, adding fabric samples and appliqué.
- Arrange and cut out your dress pattern, preview them on a mannequin and sew them together.
- Turn in your dresses to your customers to gain both reputation and coin.
- Pet the kitty.

## pc_requirements (S1) — only "minimum", no "recommended"
Minimum: OS: Windows 10 or later | Processor: Intel Core i5 or AMD Ryzen | Memory: 8 GB RAM | Graphics: Intel UHD 630 or Better | DirectX: Version 11 | Storage: 1 GB available space

## mac_requirements (S1) — only "minimum"
Minimum: Processor: Apple M1 | Memory: 8 GB RAM | Storage: 1 GB available space

## linux_requirements (S1) — present even though platforms.linux = false
Minimum: OS: Ubuntu, Mint or similar | Processor: Intel Core i5 or AMD Ryzen | Graphics: Intel UHD 630 or Better | Storage: 1 GB available space

## Reviews / recommendations
- appdetails has NO "recommendations" key (S1) and NO "metacritic" key => NOT FOUND there.
- Store page inline summary (S2): summary_num_reviews 41, summary_num_positive_reviews 38, eReviewScore 7; tooltip "92% of the 41 user reviews for this game are positive."
- appreviews API (S3, as of fetch): total_reviews 58, total_positive 55, total_negative 3, review_score 8, review_score_desc "Very Positive"

## Media
- screenshots count: 8 (S1)
  1. https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4019220/6b964f0ee4ad9041718877ec563b0079c3353ce1/ss_6b964f0ee4ad9041718877ec563b0079c3353ce1.1920x1080.jpg?t=1789990729
  2. https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4019220/9324e5f5fcaec804ef925bc5e79e8f3f15dfe329/ss_9324e5f5fcaec804ef925bc5e79e8f3f15dfe329.1920x1080.jpg?t=1789990729
  3. https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4019220/fa62a65abc68c79812fd1daa771deb4ef2bc0312/ss_fa62a65abc68c79812fd1daa771deb4ef2bc0312.1920x1080.jpg?t=1789990729
- movies: 1 — id 257195686, name "Gameplay Trailer" (S1)
- achievements: total 32 (S1)
- header_image / capsule available in steam_4019220_appdetails.json

## DLC / demo
- "dlc" key absent from appdetails (S1); zero case-insensitive occurrences of "dlc" and of "download demo" in the store page HTML (S2)
- storesearch "Dressmaker" returns only: 4019220 Dressmaker, 1487080 DressMaker, 1599300 DressMaker Pro (S4) — no demo app linked
=> Demo app id: NOT FOUND. DLC app ids: NOT FOUND.
