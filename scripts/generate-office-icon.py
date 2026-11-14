#!/usr/bin/env python3
"""Generate the "SSF Office" PWA icon set.

Distinct from the public site icon on purpose: the public app keeps the plain
white-background favicon, while the office app gets a navy (#12345A) tile with
the round emblem centred inside, so the two home-screen icons are told apart at
a glance. Rendered at 512 and 192 (Android launcher sizes) plus a maskable
variant with extra padding for the launcher safe zone.
"""
from PIL import Image, ImageDraw

NAVY = (18, 52, 90)          # #12345A brand navy
SRC = "public/brand/logo/ssf-logo-round.png"
OUT_DIR = "public/brand/office"

# (filename, canvas size, emblem fraction of canvas)
TARGETS = [
    ("office-icon-512.png", 512, 0.70),
    ("office-icon-192.png", 192, 0.70),
    ("office-icon-maskable-512.png", 512, 0.52),
]


def make(size, frac):
    emblem = Image.open(SRC).convert("RGBA")
    inner = int(size * frac)
    emblem = emblem.resize((inner, inner), Image.LANCZOS)

    canvas = Image.new("RGBA", (size, size), NAVY + (255,))
    draw = ImageDraw.Draw(canvas)
    # Rounded white plate behind the emblem so its own white background blends in
    # instead of showing a hard square edge.
    pad = int(size * 0.04)
    plate = (size - inner) // 2 - pad
    draw.rounded_rectangle(
        [plate, plate, size - plate, size - plate],
        radius=int(size * 0.16),
        fill=(255, 255, 255, 255),
    )
    off = (size - inner) // 2
    canvas.alpha_composite(emblem, (off, off))
    return canvas


def main():
    import os
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, size, frac in TARGETS:
        make(size, frac).convert("RGB").save(f"{OUT_DIR}/{name}", "PNG", optimize=True)
        print("wrote", f"{OUT_DIR}/{name}")


if __name__ == "__main__":
    main()
