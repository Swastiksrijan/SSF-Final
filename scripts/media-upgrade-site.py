#!/usr/bin/env python3
"""Replace low-res website photos with higher-res originals from the vault.

Only swaps in a vault photo when it is (near) identical to the one already on
the site (perceptual match), so content never changes - just quality. Every
replaced file is backed up under media/_website-originals/replaced/ first.
Nothing is deleted.
"""
import glob
import json
import os
import shutil

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

BACKUP = 'media/_website-originals/replaced'


def enhance(im):
    im = ImageOps.exif_transpose(im).convert('RGB')
    im = ImageOps.autocontrast(im, cutoff=1)
    gray = im.convert('L')
    mean = sum(list(gray.resize((32, 32)).getdata())) / 1024
    if mean < 95:
        im = ImageEnhance.Brightness(im).enhance(1.0 + min((95 - mean) / 220, 0.18))
    im = ImageEnhance.Color(im).enhance(1.08)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Sharpness(im).enhance(1.30)
    return im


def backup(path):
    rel = os.path.relpath(path, '.')
    dest = os.path.join(BACKUP, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if not os.path.exists(dest):
        shutil.copy2(path, dest)


def square(im, size=900):
    side = min(im.size)
    left = (im.width - side) // 2
    top = max(0, (im.height - side) // 2 - int(side * 0.05))
    return im.crop((left, top, left + side, top + side)).resize((size, size), Image.LANCZOS)


def main():
    ups = json.load(open('/tmp/ups.json'))
    done = 0
    for target, tsize, src, ssize, dist in ups:
        if 'temp' in target:
            continue
        if not os.path.exists(target):
            continue
        backup(target)
        try:
            im = Image.open(src)
            im = enhance(im)
            if target.endswith('-sq.jpg'):
                im = square(im, 900)
            else:
                if max(im.size) > 1800:
                    im.thumbnail((1800, 1800), Image.LANCZOS)
            if target.lower().endswith('.png'):
                im.save(target, 'PNG', optimize=True)
            else:
                im.save(target, 'JPEG', quality=90, optimize=True)
            done += 1
            print(f'  upgraded {target}  {tsize} -> {im.size}  (from {src})')
        except Exception as e:
            print(f'  FAIL {target}: {e}')
    print(f'\ndone: {done} photos upgraded. backups -> {BACKUP}/')


if __name__ == '__main__':
    main()
