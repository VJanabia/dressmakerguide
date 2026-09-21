#!/usr/bin/env python3
"""Generate raster assets (OG card, touch icon) from the SVG design, using Pillow only.

    python scripts/make-images.py

Outputs: public/assets/og-default.png (1200x630), public/assets/apple-touch-icon.png (180x180).
These are the site's own artwork - no third-party images are bundled.
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets")
os.makedirs(OUT, exist_ok=True)

ROSE = (156, 61, 95)
ROSE_SOFT = (251, 238, 242)
ROSE_MID = (194, 112, 143)
INK = (36, 31, 38)
INK_2 = (78, 70, 82)
INK_3 = (111, 103, 118)

def font(size, serif=True, bold=False):
    candidates = (
        ["georgia.ttf", "Georgia.ttf", "times.ttf", "DejaVuSerif.ttf", "LiberationSerif-Regular.ttf"]
        if serif else
        ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf", "LiberationSans-Regular.ttf"]
    )
    for name in candidates:
        for base in (r"C:\Windows\Fonts", "/usr/share/fonts/truetype/dejavu", "/Library/Fonts"):
            p = os.path.join(base, name)
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    pass
    return ImageFont.load_default()

def vertical_gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", (1, h))
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        px[0, y] = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    return img.resize((w, h))

def dress(draw, x, y, scale=1.0):
    """A simple dress silhouette: bodice, waist seam, skirt."""
    def s(v):
        return v * scale
    draw.polygon([(x, y), (x + s(60), y + s(46)), (x + s(60), y + s(92)), (x + s(120), y + s(92)), (x + s(120), y + s(46))], fill=ROSE)
    draw.line([(x + s(4), y + s(120)), (x + s(116), y + s(120))], fill=ROSE_MID, width=max(2, int(s(6))))
    draw.polygon([(x + s(60), y + s(126)), (x + s(120), y + s(126)), (x + s(150), y + s(250)), (x + s(30), y + s(250))], fill=(232, 183, 200))
    draw.line([(x + s(44), y + s(168)), (x + s(136), y + s(168))], fill=(255, 255, 255), width=max(2, int(s(4))))

def make_og():
    W, H = 1200, 630
    img = vertical_gradient((W, H), (255, 253, 251), ROSE_SOFT)
    d = ImageDraw.Draw(img)
    # stitching curves
    for dy, dash in ((470, False), (510, True)):
        pts = []
        for x in range(0, W + 20, 20):
            import math
            pts.append((x, dy + math.sin(x / 190.0) * 18))
        if dash:
            for i in range(0, len(pts) - 1, 2):
                d.line([pts[i], pts[i + 1]], fill=ROSE_MID, width=3)
        else:
            d.line(pts, fill=ROSE_MID, width=3)

    dress(d, 830, 170, scale=1.05)

    d.text((80, 150), "Dressmaker Guide", font=font(74), fill=INK)
    d.text((80, 246), "How to play, sewing tips and", font=font(34, serif=False), fill=INK_2)
    d.text((80, 292), "customer notes for the cozy", font=font(34, serif=False), fill=INK_2)
    d.text((80, 338), "dressmaking game", font=font(34, serif=False), fill=INK_2)
    d.text((80, 540), "dressmakerguide.com", font=font(28, serif=False), fill=ROSE)
    d.text((80, 578), "unofficial fan site", font=font(24, serif=False), fill=INK_3)
    img.save(os.path.join(OUT, "og-default.png"), optimize=True)

def make_icon():
    S = 180
    img = Image.new("RGB", (S, S), ROSE)
    d = ImageDraw.Draw(img)
    d.polygon([(S * .5, S * .18), (S * .28, S * .36), (S * .28, S * .5), (S * .5, S * .42), (S * .72, S * .5), (S * .72, S * .36)], fill=(255, 255, 255))
    d.line([(S * .12, S * .66), (S * .88, S * .66)], fill=(243, 201, 216), width=6)
    d.polygon([(S * .3, S * .74), (S * .7, S * .74), (S * .82, S * .94), (S * .18, S * .94)], fill=(243, 201, 216))
    img.save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)
    img.resize((32, 32), Image.LANCZOS).save(os.path.join(OUT, "favicon-32.png"), optimize=True)

make_og()
make_icon()
print("wrote og-default.png, apple-touch-icon.png, favicon-32.png to", OUT)
