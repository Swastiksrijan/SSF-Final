#!/usr/bin/env python3
"""
Enhance all repository images in-place while preserving file paths.

Features:
- Recursively finds images by extension.
- Applies realistic enhancement (gentle upscale + denoise + sharpening + small color/contrast tuning).
- Overwrites original files to keep website references/layout intact.
- Supports dry-run and backup modes.

Usage examples:
  python scripts/enhance_images.py --dry-run
  python scripts/enhance_images.py --backup-dir .image_backups
  python scripts/enhance_images.py --target-short-side 1080 --max-scale 2.0
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

SUPPORTED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".tif",
    ".tiff",
}

DEFAULT_EXCLUDES = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "__pycache__",
}


def iter_images(root: Path, excludes: set[str]) -> Iterable[Path]:
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in excludes for part in path.parts):
            continue
        if path.suffix.lower() in SUPPORTED_EXTENSIONS:
            yield path


def compute_scale(width: int, height: int, target_short_side: int, max_scale: float) -> float:
    short_side = min(width, height)
    if short_side >= target_short_side:
        return 1.0
    requested = target_short_side / float(short_side)
    return min(max(1.0, requested), max_scale)


def enhance_image(
    img: Image.Image,
    target_short_side: int,
    max_scale: float,
    denoise: bool,
) -> Image.Image:
    exif = img.getexif()
    img = ImageOps.exif_transpose(img)

    original_mode = img.mode
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")

    scale = compute_scale(img.width, img.height, target_short_side, max_scale)
    if scale > 1.0:
        new_size = (int(img.width * scale), int(img.height * scale))
        img = img.resize(new_size, Image.Resampling.LANCZOS)

    if denoise:
        # Mild denoise to reduce compression artifacts while preserving details.
        img = img.filter(ImageFilter.MedianFilter(size=3))

    # Realistic enhancement pipeline (kept subtle on purpose).
    img = ImageEnhance.Contrast(img).enhance(1.05)
    img = ImageEnhance.Color(img).enhance(1.04)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=140, threshold=3))

    # Restore alpha mode if original had alpha.
    if original_mode == "RGBA" and img.mode != "RGBA":
        img = img.convert("RGBA")

    # Reattach EXIF where possible.
    img.info["exif"] = exif.tobytes() if exif else b""
    return img


def save_image(img: Image.Image, target_path: Path) -> None:
    ext = target_path.suffix.lower()
    exif_bytes = img.info.get("exif", b"")

    if ext in {".jpg", ".jpeg"}:
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        img.save(
            target_path,
            format="JPEG",
            quality=95,
            optimize=True,
            progressive=True,
            subsampling=0,
            exif=exif_bytes,
        )
    elif ext == ".png":
        img.save(target_path, format="PNG", optimize=True, compress_level=6)
    elif ext == ".webp":
        img.save(target_path, format="WEBP", quality=95, method=6)
    elif ext in {".bmp", ".tif", ".tiff"}:
        img.save(target_path)
    else:
        # Fallback: let PIL choose by extension
        img.save(target_path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Enhance all images in a repo in-place.")
    parser.add_argument("--root", default=".", help="Repository root path (default: current dir).")
    parser.add_argument(
        "--target-short-side",
        type=int,
        default=1080,
        help="Upscale images whose shortest side is below this value.",
    )
    parser.add_argument(
        "--max-scale",
        type=float,
        default=2.0,
        help="Maximum upscaling factor to keep results realistic.",
    )
    parser.add_argument(
        "--backup-dir",
        default="",
        help="Optional backup directory where original images are copied before overwrite.",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        default=[],
        help="Additional path parts to exclude (can be passed multiple times).",
    )
    parser.add_argument("--dry-run", action="store_true", help="Only list files that would be processed.")
    parser.add_argument("--no-denoise", action="store_true", help="Disable median denoise step.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = Path(args.root).resolve()
    excludes = set(DEFAULT_EXCLUDES) | set(args.exclude)

    backup_dir = Path(args.backup_dir).resolve() if args.backup_dir else None
    if backup_dir:
        backup_dir.mkdir(parents=True, exist_ok=True)

    images = sorted(iter_images(root, excludes))
    print(f"Found {len(images)} images under {root}")

    processed = 0
    failed = 0

    for image_path in images:
        rel = image_path.relative_to(root)
        print(f"- Processing: {rel}")

        if args.dry_run:
            continue

        try:
            if backup_dir:
                backup_target = backup_dir / rel
                backup_target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(image_path, backup_target)

            with Image.open(image_path) as img:
                enhanced = enhance_image(
                    img,
                    target_short_side=args.target_short_side,
                    max_scale=args.max_scale,
                    denoise=not args.no_denoise,
                )
                save_image(enhanced, image_path)

            processed += 1
        except Exception as exc:
            failed += 1
            print(f"  ! Failed: {rel} -> {exc}")

    print(f"Done. Processed: {processed}, Failed: {failed}, Dry-run: {args.dry_run}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
