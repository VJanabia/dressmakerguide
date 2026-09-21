#!/usr/bin/env python3
"""Generate raster assets (OG card, touch icons) with Pillow only.

    python scripts/make-images.py

Outputs: public/assets/og-default.png (1200x630), public/assets/apple-touch-icon.png (180x180),
public/assets/favicon-32.png (32x32). All are the site's own artwork; the mark is a flat dress.
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets")
os.makedirs(OUT, exist_ok=True)

PLUM = (125, 43, 74)
PLUM_DARK = (92, 27, 51)
ROSE = (168, 71, 106)
ROSE_SOFT = (251, 239, 243)
PINK = (240, 195, 211)
INK = (35, 26, 38)
INK_2 = (84, 74, 88)
INK_3 = (110, 99, 119)
PAPER = (253, 251, 248)


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


def dress(d, x, y, s, body=(255, 255, 255)):
    """A flat dress: bodice, waist, A-line skirt, and a hem highlight."""
    d.polygon([(x + 0 * s, y + 10 * s), (x - 9 * s, y + 15.5 * s), (x - 9 * s, y + 19 * s),
               (x + 0 * s, y + 17 * s), (x + 9 * s, y + 19 * s), (x + 9 * s, y + 15.5 * s)], fill=body)
    d.polygon([(x - 6 * s, y + 20 * s), (x + 6 * s, y + 20 * s), (x + 15 * s, y + 34 * s),
               (x - 15 * s, y + 34 * s)], fill=body)
    d.line([(x - 12 * s, y + 32 * s), (x + 12 * s, y + 32 * s)], fill=PINK, width=max(2, int(1.4 * s)))


def gradient(size, top, bottom):
    w, h = size
    strip = Image.new("RGB", (1, h))
    px = strip.load()
    for y in range(h):
        t = y / max(1, h - 1)
        px[0, y] = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    return strip.resize((w, h))


def make_og():
    W, H = 1200, 630
    img = gradient((W, H), PAPER, ROSE_SOFT)
    d = ImageDraw.Draw(img)
    import math
    for dy, dashed in ((452, False), (496, True)):
        pts = [(x, dy + math.sin(x / 190.0) * 16) for x in range(0, W + 20, 20)]
        if dashed:
            for i in range(0, len(pts) - 1, 2):
                d.line([pts[i], pts[i + 1]], fill=(214, 160, 182), width=3)
        else:
            d.line(pts, fill=(214, 160, 182), width=3)

    d.rounded_rectangle([820, 150, 1060, 470], radius=28, fill=PLUM)
    dress(d, 940, 205, 6.2)

    d.text((82, 148), "Dressmaker Guide", font=font(72), fill=INK)
    d.text((82, 246), "How to play, sewing tips, customer", font=font(33, serif=False), fill=INK_2)
    d.text((82, 290), "notes and reference tables for the", font=font(33, serif=False), fill=INK_2)
    d.text((82, 334), "cozy dressmaking game", font=font(33, serif=False), fill=INK_2)
    d.rounded_rectangle([82, 398, 470, 446], radius=24, fill=PLUM)
    d.text((106, 409), "dressmakerguide.com", font=font(26, serif=False), fill=(255, 255, 255))
    d.text((82, 470), "Unofficial fan site. Not affiliated with the developers.", font=font(23, serif=False), fill=INK_3)
    img.save(os.path.join(OUT, "og-default.png"), optimize=True)
    img.resize((1200, 630), Image.LANCZOS).save(os.path.join(OUT, "og-default.png"), optimize=True)


def make_icons():
    for size, name in ((180, "apple-touch-icon.png"), (32, "favicon-32.png"), (192, "icon-192.png")):
        S = size
        img = Image.new("RGB", (S, S), PLUM)
        d = ImageDraw.Draw(img)
        # round the corners on the large sizes only
        if S >= 180:
            mask = Image.new("L", (S, S), 0)
            ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=255)
            base = Image.new("RGB", (S, S), PLUM)
            base.paste(img, (0, 0), mask)
            img = base
            d = ImageDraw.Draw(img)
        dress(d, S / 2, S * 0.20, S / 44, body=(253, 243, 247))
        d.line([(S * 0.16, S * 0.93), (S * 0.84, S * 0.93)], fill=PINK,
               width=max(1, int(S * 0.035)), joint="curve")
        img.save(os.path.join(OUT, name), optimize=True)


make_og()
make_icons()
print("wrote og-default.png, apple-touch-icon.png, favicon-32.png, icon-192.png to", OUT)
