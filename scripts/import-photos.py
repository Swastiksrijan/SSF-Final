#!/usr/bin/env python3
"""Import photos from a shared Google Drive / Google Photos link into the site.

Usage:
    python3 scripts/import-photos.py "<drive-folder-or-file-url>" [--to public/Gallery_Images]

The Drive folder/file must be shared as "Anyone with the link". Downloads only
image files (jpg/jpeg/png/webp/gif/avif/heic). After importing, run the normal
build (or just `git push` — Vercel's build optimizes them automatically).
"""
import argparse
import os
import shutil
import subprocess
import sys

SRC = "public/Gallery_Images"
IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".heic")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--to", default=SRC)
    ap.add_argument("--tmp", default="/tmp/ssf-drive-dl")
    args = ap.parse_args()

    if os.path.exists(args.tmp):
        shutil.rmtree(args.tmp)
    os.makedirs(args.tmp, exist_ok=True)
    os.makedirs(args.to, exist_ok=True)

    # gdown handles both file ids and folder urls.
    cmd = [sys.executable, "-m", "gdown", "--folder", args.url, "-O", args.tmp]
    print("→", " ".join(cmd))
    r = subprocess.run(cmd)
    if r.returncode != 0:
        # retry without --folder (single-file link)
        cmd = [sys.executable, "-m", "gdown", args.url, "-O", args.tmp]
        print("retry:", " ".join(cmd))
        subprocess.run(cmd, check=False)

    moved = 0
    for root, _dirs, files in os.walk(args.tmp):
        for f in files:
            if f.lower().endswith(IMG_EXT):
                dest = os.path.join(args.to, f)
                n = 1
                base, ext = os.path.splitext(f)
                while os.path.exists(dest):
                    dest = os.path.join(args.to, f"{base}-{n}{ext}")
                    n += 1
                shutil.copy2(os.path.join(root, f), dest)
                moved += 1
    print(f"✅ Imported {moved} photo(s) into {args.to}")
    if moved:
        print("   Next: commit & push (Vercel optimizes photos automatically on build).")


if __name__ == "__main__":
    main()