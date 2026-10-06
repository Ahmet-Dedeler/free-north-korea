# /// script
# dependencies = ["pillow"]
# ///
"""Builds public/img/pages/og-background.jpg, the full-bleed photo strip behind every share card (src/site/og.tsx).

Three photos side by side, blended at the seams:
  left   people on a Pyongyang street  (Matt Paish, CC BY 2.0, Wikimedia Commons)
  middle Panmunjom, the border in the DMZ (Wikimedia Commons, see media.json article:how-to-help-north-koreans)
  right  the peninsula at night        (NASA Black Marble 2016, public domain)
The people panel is blurred so no one is identifiable. The two left panels are tinted navy and darkened so the card's text stays readable on top of them.

    uv run scripts/og-background.py
"""
import tempfile
import urllib.request

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

W, H = 1200, 630
# The street photo is downloaded to a temp file, never saved in public/: only the blurred version is published.
STREET = "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/People-street-north-korea-walk.jpg/1920px-People-street-north-korea-walk.jpg"
NAVY = (11, 17, 32)


def cover(path, w, h, focus=(0.5, 0.5)):
    """Scale to cover w x h, then crop around the focus point (fractions of width/height)."""
    im = Image.open(path).convert("RGB")
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = min(max(0, round(im.width * focus[0] - w / 2)), im.width - w)
    y = min(max(0, round(im.height * focus[1] - h / 2)), im.height - h)
    return im.crop((x, y, x + w, y + h))


def tint(im, strength=0.55, light=0.75):
    """Navy duotone: keeps the shapes, drops the colours that would fight the text."""
    grey = ImageOps.grayscale(im)
    duo = ImageOps.colorize(grey, black=NAVY, white=(170, 186, 214))
    out = Image.blend(im, duo, strength)
    return ImageEnhance.Brightness(out).enhance(light)


# Blurred on purpose: these are real people inside North Korea, and this site must never make anyone there
# identifiable. At this radius they read as a crowd, not as faces.
street = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name
req = urllib.request.Request(STREET, headers={"User-Agent": "free-north-korea og builder (+https://github.com/Ahmet-Dedeler/free-north-korea)"})
with urllib.request.urlopen(req) as r, open(street, "wb") as f:
    f.write(r.read())
people = tint(cover(street, 460, H, (0.78, 0.45)).filter(ImageFilter.GaussianBlur(9)), 0.45, 0.95)
border = tint(cover("public/img/articles/how-to-help-north-koreans.jpg", 460, H, (0.5, 0.55)), 0.5, 0.8)
night = cover("public/img/pages/korea-at-night.jpg", 460, H, (0.62, 0.6))

canvas = Image.new("RGB", (W, H), NAVY)
# panels overlap by 60px; each later panel fades in over the previous one
for im, x in ((people, 0), (border, 370), (night, 740)):
    mask = Image.new("L", im.size, 255)
    if x:
        ramp = Image.linear_gradient("L").rotate(90, expand=True).resize((60, H))  # 0 -> 255 left to right
        mask.paste(ImageOps.invert(ramp).transpose(Image.FLIP_LEFT_RIGHT), (0, 0))
    canvas.paste(im, (x, 0), mask)

canvas.save("public/img/pages/og-background.jpg", quality=82, optimize=True)
print("wrote public/img/pages/og-background.jpg")
