# Steam API captures - Dressmaker, App ID 4019220

Raw first-party captures taken on **2026-09-21** (release day), kept so every number on the
site can be re-checked without re-fetching:

- appdetails-4019220.json - https://store.steampowered.com/api/appdetails?appids=4019220&cc=us&l=english
- appdetails-4019220-extract.json - trimmed fields from the same call (platforms, categories, ratings)
- store-page-4019220.html - the US English store page as served that day
- factsheet-run-2026-09-21.md - the fact sheet the pages were written from

To refresh: re-run the same endpoints (they are public and need no key) and diff against
docs/dressmaker-facts.md, which is the file the site content actually depends on.

Note on name collisions: a Steam search for "dressmaker" also returns **DressMaker** (App ID
1487080) and **DressMaker Pro** (App ID 1599300), both released in 2021 and both 3D character
design tools - not this game. Do not merge their data with App ID 4019220.
