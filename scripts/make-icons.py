#!/usr/bin/env python3
"""Generate the site icons and the header mark straight from the source artwork.

    python scripts/make-icons.py

Source: assets-source/dress.jpg. It is 1024x1024, but 84% of the frame is white and the dress
occupies only about 15% of it, so the image is trimmed to the dress before scaling. That trim is the
difference between a legible icon and a white square with a speck in it - at 32px the untrimmed
dress would be roughly 8px tall.

Nothing is redrawn and nothing is recoloured. The output is the source pixels, rescaled.
"""
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets-source", "dress.jpg")
IMG = os.path.join(ROOT, "public", "assets")
os.makedirs(IMG, exist_ok=True)


def trim(im, tol=40):
    """Crop away the white margin so the dress fills the square."""
    a = np.array(im.convert("RGB")).astype(int)
    mask = np.abs(a - 255).sum(axis=2) > tol
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if not len(rows) or not len(cols):
        return im
    pad = int(max(cols.max() - cols.min(), rows.max() - rows.min()) * 0.04)
    box = (max(0, int(cols.min()) - pad), max(0, int(rows.min()) - pad),
           min(im.size[0], int(cols.max()) + 1 + pad), min(im.size[1], int(rows.max()) + 1 + pad))
    return im.crop(box)


def square(im):
    """Pad to a square with the artwork's own background colour, so nothing is distorted."""
    w, h = im.size
    side = max(w, h)
    canvas = Image.new("RGB", (side, side), im.getpixel((0, 0)))
    canvas.paste(im, ((side - w) // 2, (side - h) // 2))
    return canvas


src = Image.open(SRC).convert("RGB")
art = square(trim(src))
print("source %dx%d -> trimmed %dx%d" % (src.size[0], src.size[1], art.size[0], art.size[1]))

for size, name in ((16, "favicon-16.png"), (32, "favicon-32.png"), (48, "favicon-48.png"),
                   (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")):
    art.resize((size, size), Image.LANCZOS).save(os.path.join(IMG, name), optimize=True)
    print("  %-22s %dpx" % (name, size))

for size, name in ((96, "dress-96.webp"), (192, "dress-192.webp")):
    art.resize((size, size), Image.LANCZOS).save(os.path.join(IMG, name), "WEBP", quality=88, method=6)
    print("  %-22s %dpx webp" % (name, size))
art.resize((192, 192), Image.LANCZOS).save(os.path.join(IMG, "dress-192.png"), optimize=True)
print("done ->", IMG)
