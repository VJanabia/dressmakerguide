#!/usr/bin/env python3
"""Build the site icons from the source artwork.

Source: assets-source/dress.jpg, a flat illustration of a dress on a white ground. It is 1024x1024 but the
dress occupies only about 16% of the frame, so the subject is cropped to its bounding box first -
otherwise a 32px favicon is a speck in a white field.

    python scripts/make-icons.py

Outputs, all square:
  public/favicon.svg              hand-drawn vector dress that echoes the source silhouette
  public/assets/favicon-16.png    browser tab
  public/assets/favicon-32.png    browser tab, retina
  public/assets/icon-192.png      Android / PWA
  public/assets/apple-touch-icon.png  180px, iOS home screen
  public/assets/og-default.png    1200x630 social card
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets")
SRC = os.path.join(ROOT, "assets-source", "dress.jpg")
os.makedirs(OUT, exist_ok=True)

CREAM = (253, 251, 248)
INK = (35, 26, 38)
INK_2 = (84, 74, 88)
INK_3 = (110, 99, 119)
ROSE = (168, 71, 106)


def subject_box(im, tol=40):
    """Bounding box of everything that is not the white background."""
    a = np.array(im.convert("RGB")).astype(int)
    mask = np.abs(a - np.array([255, 255, 255])).sum(axis=2) > tol
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if not len(rows) or not len(cols):
        return (0, 0) + im.size
    return (int(cols.min()), int(rows.min()), int(cols.max()) + 1, int(rows.max()) + 1)


def dress_on_tile(im, size, pad_frac=0.16, tile=None, radius_frac=0.22):
    """Centre the dress on a square tile, with a margin so it never touches the edge."""
    box = subject_box(im)
    subject = im.crop(box)
    inner = int(size * (1 - 2 * pad_frac))
    s = subject.copy()
    s.thumbnail((inner, inner), Image.LANCZOS)
    if tile is None:
        tile_img = Image.new("RGB", (size, size), CREAM)
    else:
        tile_img = Image.new("RGB", (size, size), tile)
    tile_img.paste(s, ((size - s.size[0]) // 2, (size - s.size[1]) // 2))
    if radius_frac and size >= 120:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * radius_frac), fill=255)
        base = Image.new("RGB", (size, size), CREAM if tile is None else tile)
        base.paste(tile_img, (0, 0), mask)
        tile_img = base
    return tile_img


def font(size, serif=True):
    names = (["georgia.ttf", "times.ttf", "DejaVuSerif.ttf"] if serif
             else ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"])
    for name in names:
        for base in (r"C:\Windows\Fonts", "/usr/share/fonts/truetype/dejavu"):
            p = os.path.join(base, name)
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    pass
    return ImageFont.load_default()


def make_icons():
    src = Image.open(SRC).convert("RGB")
    for size, name in ((16, "favicon-16.png"), (32, "favicon-32.png"),
                       (48, "favicon-48.png"), (192, "icon-192.png")):
        # Small sizes get less padding so the dress stays legible.
        pad = 0.08 if size <= 48 else 0.14
        dress_on_tile(src, size, pad_frac=pad, radius_frac=0.22).save(os.path.join(OUT, name), optimize=True)
        print("  %-22s %dpx" % (name, size))
    dress_on_tile(src, 180, pad_frac=0.14, radius_frac=0.22).save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)
    print("  %-22s %dpx" % ("apple-touch-icon.png", 180))


def make_og():
    src = Image.open(SRC).convert("RGB")
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)
    import math
    for dy, dashed in ((470, False), (516, True)):
        pts = [(x, dy + math.sin(x / 200.0) * 14) for x in range(0, W + 20, 20)]
        if dashed:
            for i in range(0, len(pts) - 1, 2):
                d.line([pts[i], pts[i + 1]], fill=(232, 205, 214), width=3)
        else:
            d.line(pts, fill=(232, 205, 214), width=3)
    hero = dress_on_tile(src, 330, pad_frac=0.06, tile=None, radius_frac=0.18)
    img.paste(hero, (810, 130))
    d.text((82, 150), "Dressmaker Guide", font=font(72), fill=INK)
    d.text((82, 248), "How to play, sewing tips, customer", font=font(33, serif=False), fill=INK_2)
    d.text((82, 292), "notes and reference tables for the", font=font(33, serif=False), fill=INK_2)
    d.text((82, 336), "cozy dressmaking game", font=font(33, serif=False), fill=INK_2)
    d.text((82, 402), "dressmakerguide.com", font=font(28, serif=False), fill=ROSE)
    d.text((82, 448), "Unofficial fan site. Not affiliated with the developers.", font=font(22, serif=False), fill=INK_3)
    img.save(os.path.join(OUT, "og-default.png"), optimize=True)
    print("  %-22s %dx%d" % ("og-default.png", W, H))


def tint_report():
    src = Image.open(SRC).convert("RGB")
    box = subject_box(src)
    px = np.array(src.crop(box)).reshape(-1, 3)
    px = px[np.abs(px.astype(int) - 255).sum(axis=1) > 40]
    mean = px.mean(axis=0).round().astype(int)
    print("  source subject colour: rgb%s  (%.1f%% of frame)" % (tuple(mean), 100 * len(px) / (1024 * 1024)))


if not os.path.exists(SRC):
    print("source not found:", SRC); sys.exit(1)
print("building icons from dress.jpg")
tint_report()
make_icons()
make_og()
print("done ->", OUT)
