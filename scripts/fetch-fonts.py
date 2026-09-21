#!/usr/bin/env python3
"""Download the site's web fonts as WOFF2 and store them locally.

Self-hosted on purpose: no third-party request at runtime, no Google Fonts dependency, nothing
extra to disclose in the privacy policy, and one less asset that a blocker or a firewall can
break. All three families are SIL Open Font License, which permits commercial use.

    python scripts/fetch-fonts.py

Rather than mirroring Google's unicode-range subsets (which risks grabbing a slice that lacks
basic Latin letters), this requests exactly the characters the site uses. Glyphs outside that
set fall back to the system stack, which is fine for a US-English site.
"""
import io, os, re, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets", "fonts")
os.makedirs(OUT, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}

# Every character the pages actually contain, plus digits and the punctuation used in prose.
CHARS = (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    " .,:;!?'\"()[]{}&%$#@*+-=/\\\\|<>&"
    "\u2018\u2019\u201c\u201d\u2013\u2014\u2026\u00b7\u00a0"
    "\u00e9\u00e8\u00fc\u00f6\u00e4\u00e7\u00f1\u00e0\u00e2\u00ee\u00f4\u00fb\u00ab\u00bb\u00b0\u00d7\u00a9\u00ae\u2122\u2192\u00a3\u20ac"
)
# Google's text= endpoint caps the sample; dedupe and keep it tight.
CHARS = "".join(dict.fromkeys(CHARS))

REQUESTS = [
    ("Fraunces:opsz,wght@9..144,600..700", "fraunces.woff2"),
    ("Newsreader:opsz,wght@6..72,400..600", "newsreader.woff2"),
    ("Inter:wght@400..700", "inter.woff2"),
]


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


ok = 0
for family, filename in REQUESTS:
    q = urllib.parse.quote(CHARS, safe="")
    url = "https://fonts.googleapis.com/css2?family=" + family + "&text=" + q + "&display=swap"
    try:
        css = get(url).decode("utf-8", "replace")
    except Exception as e:
        print("FAIL css", family, type(e).__name__, e)
        continue
    # The text= endpoint returns a single self-contained kit file, so one URL per family.
    urls = re.findall(r"url\((https://fonts\.gstatic\.com/[^)]+)\)", css)
    if not urls:
        print("FAIL no font url for", family)
        continue
    data = get(urls[0])
    with open(os.path.join(OUT, filename), "wb") as f:
        f.write(data)
    print("%-20s %5d KB" % (filename, len(data) // 1024))
    ok += 1

print("written:", ok, "of", len(REQUESTS), "->", OUT)
