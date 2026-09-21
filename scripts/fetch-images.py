#!/usr/bin/env python3
"""Download the developers' own official screenshots and store local WebP copies.

Source: the Steam store CDN - the same 1920x1080 screenshots the official Steam store page
serves, via Steam's public appdetails endpoint. We fetch, downscale and convert; the artwork
is untouched and is credited to the developers wherever it appears.

    python scripts/fetch-images.py
"""
import io, json, os, re, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets", "shots")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}


def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=90) as r:
        return r.read()


data = json.loads(get("https://store.steampowered.com/api/appdetails?appids=4019220&cc=us&l=english"))["4019220"]["data"]
shots = data.get("screenshots", [])
print("official screenshots available:", len(shots))

for i, s in enumerate(shots, start=1):
    url = s["path_full"].split("?")[0]
    name = "shot%d" % i
    try:
        im = Image.open(io.BytesIO(get(url))).convert("RGB")
        w, h = im.size
        if w > 1100:
            im = im.resize((1100, round(h * 1100 / w)), Image.LANCZOS)
        path = os.path.join(OUT, name + ".webp")
        im.save(path, "WEBP", quality=84, method=6)
        print("%-8s %sx%s -> %sx%s, %d KB" % (name, w, h, im.size[0], im.size[1], os.path.getsize(path) // 1024))
    except Exception as e:
        print("FAIL", name, type(e).__name__, e)
