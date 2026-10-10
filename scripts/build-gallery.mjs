// Build the website photo gallery from raw originals.
//
// WORKFLOW (add photos any time — no code changes needed):
//   1. Drop the original photo(s) into  public/Gallery_Images/
//      (jpg/jpeg/png/webp — any size; originals stay the source of truth)
//   2. Run:  node scripts/build-gallery.mjs
//   3. Commit. The website gallery and the IMS asset library update themselves.
//
// It reads public/Gallery_Images/gallery.manifest.json for tidy captions /
// categories / years (matched by file name) and falls back to a sensible
// default for any new file, so an un-listed photo is never dropped.

import { readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'public', 'Gallery_Images');
const OUT_DIR = path.join(ROOT, 'public', 'gallery');
const MANIFEST = path.join(SRC_DIR, 'gallery.manifest.json');
const IMG_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

// slug from a file name -> stable public path gallery/<slug>.jpg
const slugify = (name) =>
  name.toLowerCase().replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'photo';

async function loadManifest() {
  if (!existsSync(MANIFEST)) return { entries: {} };
  try {
    const raw = JSON.parse(await readFileSafe(MANIFEST));
    return { entries: raw.entries || {} };
  } catch (e) {
    console.warn(`⚠️  Could not parse ${path.relative(ROOT, MANIFEST)}: ${e.message}`);
    return { entries: {} };
  }
}
async function readFileSafe(p) {
  const { readFile } = await import('node:fs/promises');
  return readFile(p, 'utf8');
}

const CATEGORY_CYCLE = ['Education', 'Health', 'Women Empowerment', 'Events', 'Community'];

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`✖ Source folder not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = await loadManifest();

  const files = (await readdir(SRC_DIR)).filter((f) => IMG_RE.test(f)).sort();
  if (!files.length) {
    console.error(`✖ No images in ${SRC_DIR}`);
    process.exit(1);
  }

  const used = new Set();
  const items = [];
  let idx = 0;
  for (const file of files) {
    idx += 1;
    let slug = slugify(file);
    while (used.has(slug)) slug += '-2';
    used.add(slug);

    const src = path.join(SRC_DIR, file);
    const outName = `${slug}.jpg`;
    const outPath = path.join(OUT_DIR, outName);
    try {
      await sharp(src)
        .rotate() // honour EXIF orientation
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(outPath);
    } catch (e) {
      console.warn(`⚠️  Skipped ${file}: ${e.message}`);
      idx -= 1;
      continue;
    }

    const meta = manifest.entries[file] || {};
    items.push({
      id: `gallery_${String(idx).padStart(3, '0')}`,
      src: `/gallery/${outName}`,
      original: file,
      titleEn: meta.titleEn || `Programme Activity ${idx}`,
      titleHi: meta.titleHi || `कार्यक्रम गतिविधि ${idx}`,
      category: meta.category || CATEGORY_CYCLE[(idx - 1) % CATEGORY_CYCLE.length],
      year: meta.year || '2024',
      alt: meta.alt || `SSF programme activity photo ${idx}`,
      aspect: 'horizontal',
      keywords: meta.keywords || [],
    });
  }

  const manifestOut = { generatedAt: new Date().toISOString(), count: items.length, items };
  await writeFile(path.join(OUT_DIR, 'gallery.json'), JSON.stringify(manifestOut, null, 2));
  await writeFile(path.join(ROOT, 'src', 'data', 'galleryManifest.json'), JSON.stringify(manifestOut, null, 2));

  console.log(`✅ Gallery built: ${items.length} photos -> public/gallery/ (web-optimized)`);
  console.log(`   manifest: public/gallery/gallery.json + src/data/galleryManifest.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
