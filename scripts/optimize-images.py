#!/usr/bin/env python3
"""Shrink oversized photos in-place without changing filenames or layout.

- Applies EXIF orientation first (so nothing gets rotated).
- Caps the long side at 1600 px (source photos are only displayed smaller).
- JPEG -> quality 85, progressive.
- PNG without transparency (photo saved as PNG) -> 256-colour, dithered.
- PNG with transparency -> kept, only re-optimized.

Filenames and paths are preserved, so no code changes are required.
"""
import os
import glob

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None
MAX_SIDE = 1600
JPEG_Q = 85

before = sum(
    os.path.getsize(p)
    for p in glob.glob("public/**/*", recursive=True)
    if p.lower().endswith((".jpg", ".jpeg", ".png")) and os.path.isfile(p)
)
counts = {"jpg": 0, "png_photo": 0, "png_alpha": 0}

for path in glob.glob("public/**/*", recursive=True):
    low = path.lower()
    is_jpg = low.endswith((".jpg", ".jpeg"))
    is_png = low.endswith(".png")
    if not (is_jpg or is_png):
        continue
    try:
        im = Image.open(path)
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        scale = min(1.0, MAX_SIDE / max(w, h))
        if scale < 1:
            im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)

        alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
        # A PNG can carry an alpha channel that is fully opaque everywhere —
        # then it is really a photo and can be quantized like one.
        if alpha and im.mode == "RGBA":
            if im.split()[3].getextrema()[0] == 255:
                alpha = False
        tmp = path + ".opt"
        if is_png and alpha:
            im.save(tmp, format="PNG", optimize=True)
            counts["png_alpha"] += 1
        elif is_png:
            im.convert("RGB").quantize(
                colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG
            ).save(tmp, format="PNG", optimize=True)
            counts["png_photo"] += 1
        else:
            im.convert("RGB").save(tmp, format="JPEG", quality=JPEG_Q, optimize=True, progressive=True)
            counts["jpg"] += 1

        if os.path.getsize(tmp) < os.path.getsize(path):
            os.replace(tmp, path)
        else:
            os.remove(tmp)
    except Exception as e:
        print("skip", path, e)

after = sum(
    os.path.getsize(p)
    for p in glob.glob("public/**/*", recursive=True)
    if p.lower().endswith((".jpg", ".jpeg", ".png")) and os.path.isfile(p)
)
print(f"before {before/1e6:6.1f} MB   after {after/1e6:6.1f} MB   saved {(before-after)/1e6:.1f} MB ({100*(before-after)/max(before,1):.0f}%)")
print("processed:", counts)