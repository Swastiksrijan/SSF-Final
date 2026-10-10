#!/usr/bin/env python3
"""Find duplicates in the media vault.

Two levels:
  1. exact  - identical bytes (SHA-256)
  2. near   - perceptually similar images (dHash, Hamming <= 10)

Duplicates are MOVED into media/_duplicates/<sha>/ (never deleted), so the
originals stay recoverable. Nothing functional is ever removed.
"""
import hashlib
import os
import shutil
from collections import defaultdict

ROOT = 'media'
QUARANTINE = os.path.join(ROOT, '_duplicates')
IMG_EXT = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}


def sha256(path, chunk=1 << 20):
    h = hashlib.sha256()
    with open(path, 'rb') as fh:
        for block in iter(lambda: fh.read(chunk), b''):
            h.update(block)
    return h.hexdigest()


def dhash(path, size=8):
    from PIL import Image
    try:
        im = Image.open(path).convert('L').resize((size + 1, size))
    except Exception:
        return None
    px = list(im.getdata())
    bits = 0
    n = 0
    for row in range(size):
        for col in range(size):
            left = px[row * (size + 1) + col]
            right = px[row * (size + 1) + col + 1]
            bits = (bits << 1) | (1 if left > right else 0)
            n += 1
    return bits


def hamming(a, b):
    return bin(a ^ b).count('1')


def iter_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        if os.path.abspath(dirpath).startswith(os.path.abspath(QUARANTINE)):
            continue
        for fn in filenames:
            yield os.path.join(dirpath, fn)


def main():
    files = sorted(iter_files())
    print(f'scanning {len(files)} files...')

    by_hash = defaultdict(list)
    for p in files:
        by_hash[sha256(p)].append(p)

    moved = 0
    exact_groups = 0
    for h, group in by_hash.items():
        if len(group) < 2:
            continue
        exact_groups += 1
        group.sort(key=lambda x: (len(x), x))  # keep shortest/cleanest name
        for dup in group[1:]:
            dest = os.path.join(QUARANTINE, h[:12], os.path.basename(dup))
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.move(dup, dest)
            moved += 1
            print(f'  exact dup: {dup}  ==  {group[0]}')

    # near-duplicate images (skip ones already quarantined)
    imgs = [p for p in iter_files() if os.path.splitext(p)[1].lower() in IMG_EXT]
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
            if hamming(hashes[a], hashes[b]) <= 10:
                dest = os.path.join(QUARANTINE, 'near', os.path.basename(b))
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                shutil.move(b, dest)
                del hashes[b]
                near += 1
                print(f'  near dup: {b}  ~  {a}')

    print(f'\nexact groups: {exact_groups}, exact moved: {moved}, near moved: {near}')
    remain = sum(1 for _ in iter_files())
    print(f'remaining files in vault: {remain}')


if __name__ == '__main__':
    main()