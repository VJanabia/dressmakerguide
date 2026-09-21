#!/usr/bin/env python3
"""Download the developers' own official screenshots and store local, multi-size WebP copies.

Sources: the Steam store CDN (the images and video poster frames the official store page serves)
and the official itch.io page. We fetch, downscale and convert; the artwork is untouched and is
credited to the developers wherever it appears.

    python scripts/fetch-images.py

Output: public/assets/shots/<name>-550.webp, <name>-1100.webp, plus a <name>.webp copy of the
1100px version so a plain `src` still works in any context that does not read srcset.
"""
import io, json, os, re, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets", "shots")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}
CDN = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4019220/extras/"


def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=90) as r:
        return r.read()


def save_sizes(name, im):
    """1100px and 550px WebP, and a default copy at the larger size."""
    im = im.convert("RGB")
    w, h = im.size
    big = im if w <= 1100 else im.resize((1100, round(h * 1100 / w)), Image.LANCZOS)
    small = big.resize((550, round(big.size[1] * 550 / big.size[0])), Image.LANCZOS)
    small.save(os.path.join(OUT, name + "-550.webp"), "WEBP", quality=82, method=6)
    big.save(os.path.join(OUT, name + "-1100.webp"), "WEBP", quality=86, method=6)
    big.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=86, method=6)
    return big.size


# 1) the eight official store screenshots
data = json.loads(get("https://store.steampowered.com/api/appdetails?appids=4019220&cc=us&l=english").decode())["4019220"]["data"]
shots = data.get("screenshots", [])
print("store screenshots available:", len(shots))
for i, s in enumerate(shots, start=1):
    try:
        im = Image.open(io.BytesIO(get(s["path_full"].split("?")[0])))
        size = save_sizes("shot%d" % i, im)
        print("  shot%-3d -> %sx%s" % (i, size[0], size[1]))
    except Exception as e:
        print("  FAIL shot%d" % i, type(e).__name__, e)

# 2) the store header and the itch.io page images, which carry scenes the gallery does not
EXTRA = [
    ("header", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4019220/f1cd08127872e60e4c47a4bc3e40d682d94741bf/header.jpg"),
    ("capsule", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4019220/dde8e789013d3ff938c10dffa3689e6977b0672c/capsule_616x353.jpg"),
]
for name, url in EXTRA:
    try:
        im = Image.open(io.BytesIO(get(url)))
        size = save_sizes(name, im)
        print("  %-8s -> %sx%s" % (name, size[0], size[1]))
    except Exception as e:
        print("  FAIL", name, type(e).__name__, e)

# 3) itch.io prototype screenshots, discovered from the page rather than guessed
try:
    html = get("https://elyaradine.itch.io/dressmaker").decode("utf-8", "replace")
    found, seen = [], set()
    for m in re.finditer(r"https://img.itch.zone/([A-Za-z0-9_=/+-]+?)/(?:original|680x[0-9]+)/([A-Za-z0-9]+).(png|jpg)", html):
        if m.group(2) in seen:
            continue
        seen.add(m.group(2))
        found.append("https://img.itch.zone/" + m.group(1) + "/original/" + m.group(2) + "." + m.group(3))
    print("itch image candidates:", len(found))
    for i, u in enumerate(found[:4], start=1):
        try:
            im = Image.open(io.BytesIO(get(u)))
            if im.size[0] < 600:
                print("  itch%d skipped (only %sx%s)" % (i, im.size[0], im.size[1]))
                continue
            size = save_sizes("itch%d" % i, im)
            print("  itch%-3d -> %sx%s" % (i, size[0], size[1]))
        except Exception as e:
            print("  FAIL itch%d" % i, type(e).__name__, e)
except Exception as e:
    print("FAIL itch page", type(e).__name__, e)
