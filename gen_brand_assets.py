"""Regenerates every brand asset in public/ from brand/optimum-lockup-source.pdf.

The source PDF holds the original cloud lockup as five layered 1872x576 images
- background, cloud, wordmark, subtext, arrow - each with its own soft mask.
Working from those masks rather than a flattened export keeps the pieces
separable, which is what makes the three brand decisions here possible:

  * the cloud and wordmark are painted black (the company's wall/print colour)
    while the download arrow keeps the brand red;
  * the tittle over the "i" in "optimum" is split off the wordmark by
    connected-component analysis and painted red, so the mark's red appears
    twice across the lockup instead of once;
  * "LTD" is dropped from the subtext. The subtext is a single strip of
    letterspaced glyphs, so the run is re-cut into its 17 glyphs, the last
    three are discarded, and the remaining "PRIME SOLUTIONS" is re-laid at the
    original tracking and centred under the wordmark.

This supersedes gen_favicons.py, which keyed a flattened export by colour and
so could not separate the arrow from the wordmark's tittle.

Run from the repo root:  python gen_brand_assets.py
"""
import re
import shutil
import zlib
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "brand" / "optimum-lockup-source.pdf"
PUBLIC = ROOT / "public"
DIST = ROOT / "dist"

W, H = 1872, 576                 # the source PDF's layer resolution
BLACK = (17, 17, 17)
WHITE = (255, 255, 255)
RED = (237, 28, 36)

# Layer alpha masks, by PDF object number.
MASKS = {"cloud": 10, "word": 13, "sub": 16, "arrow": 19}

SUBTEXT_GLYPHS = 17              # P R I M E   S O L U T I O N S   L T D
SUBTEXT_KEEP = 14                # everything up to and including SOLUTIONS
WORD_BREAK = 5                   # the space falls after PRIME's fifth glyph
WORD_SPACE = 2.07                # word space / letter space, measured off the source

ICON_WIDTH_FRACTION = 0.86       # the mark's share of a square icon's width
FAVICON_SIZES = [16, 32, 48, 96, 192, 512]
SUPERSAMPLE = 3                  # see _upscale()
SMOOTH_RADIUS = 1.4              # blur, in source pixels
SMOOTH_CONTRAST = 5.0            # edge contrast restored after the blur


# --------------------------------------------------------------------------
# source extraction


def _layers():
    data = SOURCE.read_bytes()

    def stream(obj):
        m = re.search(rb"\n%d 0 obj\s*<<(.*?)>>\s*stream\r?\n" % obj, data, re.S)
        start = m.end()
        return zlib.decompress(data[start:data.index(b"endstream", start)])

    return {name: np.frombuffer(stream(obj), dtype=np.uint8).reshape(H, W).copy()
            for name, obj in MASKS.items()}


def _component(mask, seed):
    """Connected component of boolean `mask` containing `seed`."""
    seen = np.zeros_like(mask, dtype=bool)
    queue = deque([seed])
    seen[seed] = True
    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < mask.shape[0] and 0 <= nx < mask.shape[1] \
                    and mask[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                queue.append((ny, nx))
    return seen


def _split_tittle(word):
    """Separate the dot over the "i" - the wordmark's topmost blob - from the rest."""
    solid = word > 40
    ys, xs = np.where(solid)
    row = xs[ys == ys.min()]
    dot = _component(solid, (int(ys.min()), int(row[len(row) // 2])))
    # Dilate by a pixel so the glyph's antialiased fringe travels with it and
    # no black halo is left behind around the red dot.
    grown = dot.copy()
    grown[1:] |= dot[:-1]
    grown[:-1] |= dot[1:]
    grown[:, 1:] |= dot[:, :-1]
    grown[:, :-1] |= dot[:, 1:]
    return np.where(grown, 0, word), np.where(grown, word, 0)


def _glyph_runs(mask):
    on = (mask > 40).any(axis=0)
    runs, start = [], None
    for x, lit in enumerate(on):
        if lit and start is None:
            start = x
        elif not lit and start is not None:
            runs.append((start, x))
            start = None
    if start is not None:
        runs.append((start, len(on)))
    return runs


def _drop_ltd(sub, word):
    """Re-lay the subtext as "PRIME SOLUTIONS", centred under the wordmark."""
    runs = _glyph_runs(sub)
    if len(runs) != SUBTEXT_GLYPHS:
        raise SystemExit(f"expected {SUBTEXT_GLYPHS} subtext glyphs, found {len(runs)}")
    runs = runs[:SUBTEXT_KEEP]

    # Keep the source's own tracking: average the gaps between the letters we
    # are keeping, ignoring the wider gap that separates the two words.
    letter_gaps = [b[0] - a[1] for a, b in zip(runs, runs[1:])]
    del letter_gaps[WORD_BREAK - 1]
    tracking = sum(letter_gaps) / len(letter_gaps)

    ink = sum(b - a for a, b in runs)
    width = ink + tracking * (len(runs) - 2 + WORD_SPACE)
    word_cols = np.where((word > 40).any(axis=0))[0]
    left = (word_cols.min() + word_cols.max() + 1 - width) / 2

    out = np.zeros_like(sub)
    x = left
    for i, (a, b) in enumerate(runs):
        at = int(round(x))
        out[:, at:at + (b - a)] = np.maximum(out[:, at:at + (b - a)], sub[:, a:b])
        x += (b - a) + tracking * (WORD_SPACE if i == WORD_BREAK - 1 else 1)
    return out


# --------------------------------------------------------------------------
# compositing


def _upscale(mask, scale=SUPERSAMPLE):
    """Enlarge a mask without inheriting the source's pixel staircase.

    The layers are only 1872px wide, so a 1080px profile picture would have to
    magnify the mark past 1:1 and every stair-step on the cloud's curve would
    show. Blurring after the enlargement turns each step into a ramp, and
    stretching the contrast around the 50% point pulls that ramp back into a
    clean antialiased edge.
    """
    big = Image.fromarray(mask).resize((mask.shape[1] * scale, mask.shape[0] * scale),
                                       Image.BICUBIC)
    big = big.filter(ImageFilter.GaussianBlur(scale * SMOOTH_RADIUS))
    a = np.asarray(big, dtype=np.float32) / 255.0
    return np.clip((a - 0.5) * SMOOTH_CONTRAST + 0.5, 0, 1) * 255


def _paint(parts):
    """parts: [(mask, rgb)], painted in order onto a transparent canvas."""
    shape = parts[0][0].shape
    rgb = np.zeros((*shape, 3), dtype=np.float32)
    alpha = np.zeros(shape, dtype=np.float32)
    for mask, colour in parts:
        a = (mask / 255.0).astype(np.float32)
        rgb = rgb * (1 - a)[..., None] + np.array(colour, dtype=np.float32) * a[..., None]
        alpha = alpha + a * (1 - alpha)
    return Image.fromarray(
        np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8), "RGBA")


def _trim(im):
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > 3)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def _fit(im, width):
    """Downsample to `width`, preserving aspect. Never upscales."""
    height = max(1, round(im.height * width / im.width))
    return im.resize((width, height), Image.LANCZOS)


def _square(mark, size, ground=None):
    """Centre the mark on a square canvas at ICON_WIDTH_FRACTION of its width."""
    master = 1024
    inner = _fit(mark, round(master * ICON_WIDTH_FRACTION))
    canvas = Image.new("RGBA", (master, master), (*ground, 255) if ground else (0, 0, 0, 0))
    canvas.alpha_composite(inner, ((master - inner.width) // 2, (master - inner.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


def _card(lockup, size, ground=WHITE, fraction=0.62):
    canvas = Image.new("RGBA", size, (*ground, 255))
    inner = _fit(lockup, round(size[0] * fraction))
    canvas.alpha_composite(inner, ((size[0] - inner.width) // 2, (size[1] - inner.height) // 2))
    return canvas


# --------------------------------------------------------------------------


def artwork():
    """The finished mask set - cloud, wordmark, tittle, subtext, arrow - upscaled.

    Returns `lockup(ink, accent)` and `mark(ink, accent)`, each of which paints
    the masks and trims to the artwork. Passing the same colour for both gives
    the single-colour version used for stamps and single-plate print.
    """
    layers = _layers()
    wordmark, tittle = _split_tittle(layers["word"])
    subtext = _drop_ltd(layers["sub"], layers["word"])

    cloud, arrow = _upscale(layers["cloud"]), _upscale(layers["arrow"])
    wordmark, tittle, subtext = _upscale(wordmark), _upscale(tittle), _upscale(subtext)

    def lockup(ink, accent=RED):
        return _trim(_paint([(cloud, ink), (wordmark, ink), (subtext, ink),
                             (arrow, accent), (tittle, accent)]))

    def mark(ink, accent=RED):
        return _trim(_paint([(cloud, ink), (arrow, accent)]))

    return lockup, mark


def main():
    lockup, mark = artwork()

    light, dark = lockup(BLACK), lockup(WHITE)
    mark_light, mark_dark = mark(BLACK), mark(WHITE)

    written = []

    def save(name, im):
        path = PUBLIC / name
        im.save(path)
        written.append(name)
        print(f"  {name:34s} {im.size[0]}x{im.size[1]}")

    print("lockups")
    save("optimum-logo-light-bg.png", _fit(light, 800))
    save("optimum-logo-dark-bg.png", _fit(dark, 800))
    save("optimum-logo-header.png", _fit(light, 640))
    save("optimum-logo-header-knockout.png", _fit(dark, 640))
    save("logo.png", _fit(light, 512))

    print("marks")
    save("optimum-mark-knockout.png", _square(mark_dark, 512))

    print("icons")
    for size in FAVICON_SIZES:
        save(f"favicon-{size}x{size}.png", _square(mark_light, size))
    # iOS ignores alpha and composites on black, so this one needs a ground.
    save("apple-touch-icon.png", _square(mark_light, 180, ground=WHITE))
    ico = PUBLIC / "favicon.ico"
    _square(mark_light, 256).save(ico, sizes=[(16, 16), (32, 32), (48, 48)])
    written.append("favicon.ico")
    print(f"  {'favicon.ico':34s} 16/32/48")

    print("social")
    save("og-image.png", _card(light, (1200, 630)).convert("RGB"))

    print("mirroring into dist/")
    for name in written:
        if (DIST / name).exists():
            shutil.copy2(PUBLIC / name, DIST / name)
            print(f"  dist/{name}")


if __name__ == "__main__":
    main()
