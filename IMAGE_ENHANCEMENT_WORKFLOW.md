# Image Enhancement Workflow

This repository now includes an automated image-enhancement pipeline for website assets.

## What it does
1. Finds all images recursively (`jpg`, `jpeg`, `png`, `webp`, `bmp`, `tif`, `tiff`).
2. Applies realistic quality enhancement:
   - Auto-rotate from EXIF.
   - Gentle upscale for small images (default shortest side target: `1080`, max `2x`).
   - Mild denoise.
   - Subtle contrast/color boost.
   - Unsharp mask for detail recovery.
3. Replaces images **in-place** so existing website paths/references remain valid.

## Local usage
```bash
python scripts/enhance_images.py --dry-run
python scripts/enhance_images.py --backup-dir .image_backups
```

## GitHub workflow usage
Run **"Enhance repository images"** from Actions tab (`workflow_dispatch`).
It will:
- run enhancement on all images,
- commit changed assets,
- push back to the current branch.

Workflow file: `.github/workflows/enhance-images.yml`
Script file: `scripts/enhance_images.py`
