#!/usr/bin/env python3
"""Clean, enhance and organise the media vault into web-ready photos.

Steps (nothing is ever deleted):
  1. de-duplicate (exact SHA-256 + near dHash) -> quarantine media/_duplicates/
  2. enhance every surviving photo (auto-orient, auto-contrast, colour,
     brightness for dark shots, sharpness)
  3. low-resolution photos are wrapped in a branded "poster" (navy/orange
     frame + bilingual caption) so a weak photo still looks presentable
  4. write everything to media/processed/<category>/<clean-name>.jpg

Run:  python3 scripts/media-process.py [--only SUBSTR] [--limit N]
"""
import argparse
import hashlib
import os
import re
import shutil
from collections import defaultdict
from datetime import datetime

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = 'media'
PROCESSED = os.path.join(ROOT, 'processed')
QUARANTINE = os.path.join(ROOT, '_duplicates')
SKIP_DIRS = {os.path.abspath(QUARANTINE), os.path.abspath(PROCESSED),
             os.path.abspath(os.path.join(ROOT, '_enum')),
             os.path.abspath(os.path.join(ROOT, '_website-originals')),
             os.path.abspath(os.path.join(ROOT, '05-videos'))}
IMG_EXT = {'.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'}

# Brand palette
NAVY = (0, 35, 68)
NAVY_D = (0, 21, 41)
ORANGE = (255, 102, 0)
YELLOW = (255, 209, 102)
WHITE = (255, 255, 255)

FONT_LAT_B = 'src/assets/fonts/NotoSansDevanagari-Bold.ttf'
FONT_LAT_R = 'src/assets/fonts/NotoSansDevanagari-Regular.ttf'
if not os.path.exists(FONT_LAT_B):
    FONT_LAT_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    FONT_LAT_R = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

CATEGORY_MAP = {
    '01-team': 'team',
    '02-programs/certificates': 'certificates',
    '02-programs/photo-2013-2026': 'events',
    '02-programs/ssf-activities-photo': 'activities',
    '04-graphics': 'graphics',
    '06-other': 'other',
}


def category_for(rel):
    rel = rel.replace('\\', '/')
    for key, val in CATEGORY_MAP.items():
        if rel.startswith(key + '/') or rel == key:
            return val
    return 'other'


def clean_name(path):
    base = os.path.splitext(os.path.basename(path))[0]
    base = base.replace('&', 'and')
    base = re.sub(r'[^A-Za-z0-9\u0900-\u097F]+', '-', base).strip('-').lower()
    base = re.sub(r'-{2,}', '-', base)
    return base or 'photo'


def iter_files(root=ROOT):
    for dirpath, _dirnames, filenames in os.walk(root):
        ap = os.path.abspath(dirpath)
        if any(ap.startswith(s) for s in SKIP_DIRS):
            continue
        for fn in filenames:
            if os.path.splitext(fn)[1].lower() in IMG_EXT:
                yield os.path.join(dirpath, fn)


def sha256(path, chunk=1 << 20):
    h = hashlib.sha256()
    with open(path, 'rb') as fh:
        for block in iter(lambda: fh.read(chunk), b''):
            h.update(block)
    return h.hexdigest()


def dhash(path, size=8):
    try:
        im = Image.open(path).convert('L').resize((size + 1, size))
    except Exception:
        return None
    px = list(im.getdata())
    bits = 0
    for row in range(size):
        for col in range(size):
            bits = (bits << 1) | (1 if px[row * (size + 1) + col] > px[row * (size + 1) + col + 1] else 0)
    return bits


def hamming(a, b):
    return bin(a ^ b).count('1')


def dedupe():
    files = sorted(iter_files())
    print(f'dedupe: scanning {len(files)} files...')
    by_hash = defaultdict(list)
    for p in files:
        by_hash[sha256(p)].append(p)
    moved = 0
    for h, group in by_hash.items():
        if len(group) < 2:
            continue
        group.sort(key=lambda x: (len(x), x))
        for dup in group[1:]:
            dest = os.path.join(QUARANTINE, h[:12], os.path.basename(dup))
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            if not os.path.exists(dest):
                shutil.move(dup, dest)
                moved += 1
    # near duplicates
    imgs = list(iter_files())
    hashes = {}
    for p in imgs:
        d = dhash(p)
        if d is not None:
            hashes[p] = d
    keys = sorted(hashes)
    near = 0
    for i, a in enumerate(keys):
        if a not in hashes:
            continue
        for b in keys[i + 1:]:
            if b not in hashes:
                continue
            if hamming(hashes[a], hashes[b]) <= 9:
                dest = os.path.join(QUARANTINE, 'near', os.path.basename(b))
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                if not os.path.exists(dest):
                    shutil.move(b, dest)
                    near += 1
                del hashes[b]
    print(f'dedupe: exact moved={moved}, near moved={near}, remaining={sum(1 for _ in iter_files())}')


def enhance(im):
    """Light, natural enhancement. Returns (image, mean_before)."""
    im = ImageOps.exif_transpose(im).convert('RGB')
    im = ImageOps.autocontrast(im, cutoff=1)
    gray = im.convert('L')
    mean = sum(list(gray.resize((32, 32)).getdata())) / 1024
    if mean < 95:                       # dark photo -> lift shadows
        im = ImageEnhance.Brightness(im).enhance(1.0 + min((95 - mean) / 220, 0.18))
    im = ImageEnhance.Color(im).enhance(1.08)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Sharpness(im).enhance(1.30)
    return im, mean


def _font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


def poster(im, title, out_path, w=1080, h=1350):
    """Wrap a low-res photo in a branded frame with a bilingual caption."""
    canvas = Image.new('RGB', (w, h), NAVY)
    d = ImageDraw.Draw(canvas)
    # subtle dot pattern
    for y in range(0, h, 46):
        for x in range(0, w, 46):
            off = 23 if (y // 46) % 2 else 0
            d.ellipse([x + off - 2, y - 2, x + off + 2, y + 2], fill=(12, 52, 90))
    # top accent
    d.rectangle([0, 0, w, 12], fill=ORANGE)
    d.rectangle([0, h - 12, w, h], fill=ORANGE)

    f_brand = _font(FONT_LAT_B, 34)
    f_tag = _font(FONT_LAT_R, 22)
    f_title = _font(FONT_LAT_B, 40)
    f_sub = _font(FONT_LAT_R, 26)

    d.text((60, 46), 'SWASTIK  SRIJAN  FOUNDATION', font=f_brand, fill=WHITE)
    d.text((60, 92), '\u0938\u094d\u0935\u0938\u094d\u0924\u093f\u0915 \u0938\u0943\u091c\u0928 \u092b\u093c\u093e\u0909\u0902\u0921\u0947\u0936\u0928  |  \u0905\u092d\u0940 \u0924\u0915 \u0915\u093e \u0938\u092b\u093c\u0930', font=f_tag, fill=YELLOW)

    # fit photo inside frame area
    fx0, fy0, fx1, fy1 = 60, 150, w - 60, h - 250
    fw, fh = fx1 - fx0, fy1 - fy0
    ratio = min(fw / im.width, fh / im.height)
    nw, nh = max(1, int(im.width * ratio)), max(1, int(im.height * ratio))
    photo = im.resize((nw, nh), Image.LANCZOS)
    px, py = fx0 + (fw - nw) // 2, fy0 + (fh - nh) // 2
    # white frame
    d.rectangle([px - 10, py - 10, px + nw + 10, py + nh + 10], fill=WHITE)
    canvas.paste(photo, (px, py))

    # caption
    cap_y = h - 220
    d.rectangle([60, cap_y - 26, 70, cap_y + 60], fill=ORANGE)
    d.text((90, cap_y - 18), title, font=f_title, fill=WHITE)
    d.text((90, cap_y + 36), '\u0938\u093e\u0925 \u092e\u093f\u0932\u0915\u0930, \u092c\u0926\u0932\u093e\u0935 \u0915\u0940 \u0913\u0930', font=f_sub, fill=YELLOW)
    d.text((90, cap_y + 74), 'Together for change', font=f_sub, fill=(190, 205, 220))
    canvas.save(out_path, 'JPEG', quality=88, optimize=True)


def portrait(im, out_path, size=900):
    """Square centre-crop portrait for team avatars."""
    side = min(im.size)
    left = (im.width - side) // 2
    top = max(0, (im.height - side) // 2 - int(side * 0.05))
    im = im.crop((left, top, left + side, top + side)).resize((size, size), Image.LANCZOS)
    im.save(out_path, 'JPEG', quality=90, optimize=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', default='', help='only files whose path contains this')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--no-dedupe', action='store_true')
    args = ap.parse_args()

    if not args.no_dedupe:
        dedupe()

    files = sorted(iter_files())
    if args.only:
        files = [f for f in files if args.only in f]
    if args.limit:
        files = files[:args.limit]

    os.makedirs(PROCESSED, exist_ok=True)
    seen_names = defaultdict(int)
    stats = {'poster': 0, 'enhanced': 0, 'portrait': 0, 'kept': 0, 'failed': 0}
    for i, p in enumerate(files, 1):
        rel = os.path.relpath(p, ROOT)
        cat = category_for(rel)
        out_dir = os.path.join(PROCESSED, cat)
        os.makedirs(out_dir, exist_ok=True)
        name = clean_name(p)
        seen_names[name] += 1
        if seen_names[name] > 1:
            name = f'{name}-{seen_names[name]}'
        out_path = os.path.join(out_dir, name + '.jpg')
        try:
            src = Image.open(p)
            has_alpha = src.mode in ('RGBA', 'LA') or (src.mode == 'P' and 'transparency' in src.info)
            im = src
            small = min(im.size) < 900
            im, mean = enhance(im)
            if cat == 'team':
                portrait(im, out_path)
                stats['portrait'] += 1
            elif cat in ('graphics', 'certificates'):
                # logos / certificates: enhance only, keep original aspect
                if has_alpha:
                    out_path = out_path[:-4] + '.png'
                    im.convert('RGBA').save(out_path, 'PNG', optimize=True)
                else:
                    im.save(out_path, 'JPEG', quality=92, optimize=True)
                stats['kept'] += 1
            elif small:
                nm = clean_name(p)
                title = nm.replace('-', ' ').title() if re.search(r'[a-z]', nm) else 'SSF Programme'
                poster(im, title, out_path)
                stats['poster'] += 1
            else:
                if max(im.size) > 2000:
                    im.thumbnail((2000, 2000), Image.LANCZOS)
                im.save(out_path, 'JPEG', quality=88, optimize=True)
                stats['enhanced'] += 1
            if i % 25 == 0 or i == len(files):
                print(f'  [{i}/{len(files)}] {rel}  (mean={mean:.0f}{"  poster" if small else ""})')
        except Exception as e:
            stats['failed'] += 1
            print(f'  FAIL {rel}: {e}')

    print(f'\ndone. enhanced={stats["enhanced"]} poster={stats["poster"]} failed={stats["failed"]}')
    print(f'output: {PROCESSED}/')


if __name__ == '__main__':
    main()
