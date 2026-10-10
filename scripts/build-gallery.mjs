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

import { readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'public', 'Gallery_Images');
const OUT_DIR = path.join(ROOT, 'public', 'gallery');
const MANIFEST = path.join(SRC_DIR, 'gallery.manifest.json');
const HASHES = path.join(SRC_DIR, 'gallery.hashes.json');
const WEB_MANIFEST = path.join(ROOT, 'public', 'gallery', 'gallery.json');
const SRC_MANIFEST = path.join(ROOT, 'src', 'data', 'galleryManifest.json');
const IMG_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

// slug from a file name -> stable public path gallery/<slug>.jpg
const slugify = (name) =>
  name.toLowerCase().replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'photo';

// --- duplicate detection (name/link independent) ---------------------------
// dHash: shrink to 16x17 grayscale and set a bit wherever a pixel is brighter
// than its right neighbour -> 256-bit signature. Robust to JPEG re-encoding and
// resizing (WhatsApp/Drive re-saves), so the SAME picture is caught even when
// the file name, size and quality differ.
const HASH_BITS = 256;
async function dHash(file) {
  const { data } = await sharp(file)
    .resize(17, 16, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let hex = '';
  for (let y = 0; y < 16; y += 1) {
    let row = 0n;
    for (let x = 0; x < 16; x += 1) {
      const left = data[y * 17 + x];
      const right = data[y * 17 + x + 1];
      if (left > right) row |= 1n << BigInt(15 - x);
    }
    hex += row.toString(16).padStart(4, '0');
  }
  return hex;
}
function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i += 1) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) { d += x & 1; x >>= 1; }
  }
  return d;
}
const NEAR_DUP_DISTANCE = Math.round(HASH_BITS * 0.12); // ≤ ~12% differing bits = same picture

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
  const seenHashes = []; // { file, hash } kept photos, for duplicate detection
  const outSlugs = new Set(); // slugs written this run, for stale-file cleanup
  const items = [];
  let idx = 0;      // slot number (stable ids); only advances for kept photos
  let scanned = 0;  // files examined
  const dupes = [];

  // Stable slot ids across runs: remember which file owns which slot so a file
  // added/removed elsewhere never renumbers the whole gallery.
  let prevSlots = {};
  try {
    prevSlots = JSON.parse(await readFileSafe(HASHES)).slots || {};
  } catch {
    prevSlots = {};
  }
  const slotByFile = { ...prevSlots };

  // Process photos already in the gallery FIRST, so when a newly-added file
  // duplicates an existing photo, the existing one is kept and the new copy is
  // dropped (previous = source of truth).
  const prevOrder = Object.entries(prevSlots).sort((a, b) => a[1].localeCompare(b[1]));
  const prevRank = new Map(prevOrder.map(([f], i) => [f, i]));
  const ordered = [...files].sort((a, b) => {
    const ra = prevRank.has(a) ? prevRank.get(a) : 1e9;
    const rb = prevRank.has(b) ? prevRank.get(b) : 1e9;
    return ra - rb || a.localeCompare(b);
  });

  for (const file of ordered) {
    scanned += 1;
    const src = path.join(SRC_DIR, file);

    // Duplicate check on the photo's own content (ignores file name & source link).
    let hash = '';
    try {
      hash = await dHash(src);
    } catch (e) {
      console.warn(`⚠️  Skipped ${file}: ${e.message}`);
      continue;
    }
    const dupOf = seenHashes.find((h) => h.hash === hash || hamming(h.hash, hash) <= NEAR_DUP_DISTANCE);
    if (dupOf) {
      dupes.push({ file, duplicateOf: dupOf.file });
      continue;
    }
    seenHashes.push({ file, hash });

    // Reuse this file's previous slot id when it had one; otherwise grab the
    // next free slot so existing ids never shift.
    const usedSlots = new Set(Object.values(slotByFile));
    const slotNum = (n) => `gallery_${String(n).padStart(3, '0')}`;
    let id = slotByFile[file];
    if (!id) {
      do { idx += 1; } while (usedSlots.has(slotNum(idx)));
      id = slotNum(idx);
      slotByFile[file] = id;
    }

    let slug = slugify(file);
    while (used.has(slug)) slug += '-2';
    used.add(slug);
    outSlugs.add(`${slug}.jpg`);

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
    const display = items.length + 1;
    items.push({
      id,
      src: `/gallery/${outName}`,
      original: file,
      titleEn: meta.titleEn || `Programme Activity ${display}`,
      titleHi: meta.titleHi || `कार्यक्रम गतिविधि ${display}`,
      category: meta.category || CATEGORY_CYCLE[(display - 1) % CATEGORY_CYCLE.length],
      year: meta.year || '2024',
      alt: meta.alt || `SSF programme activity photo ${display}`,
      aspect: 'horizontal',
      keywords: meta.keywords || [],
    });
  }

  // Forget slots for files that no longer exist (keeps the index lean).
  const nowFiles = new Set(items.map((i) => i.original));
  for (const f of Object.keys(slotByFile)) if (!nowFiles.has(f)) delete slotByFile[f];

  const manifestOut = { count: items.length, items };
  await writeFile(WEB_MANIFEST, JSON.stringify(manifestOut, null, 2));
  await writeFile(SRC_MANIFEST, JSON.stringify(manifestOut, null, 2));
  await writeFile(
    HASHES,
    JSON.stringify({ slots: slotByFile, hashes: Object.fromEntries(seenHashes.map((h) => [h.file, h.hash])) }, null, 2),
  );

  // Remove optimized images whose source was deleted/renamed (keeps /gallery lean).
  try {
    const existing = await readdir(OUT_DIR);
    for (const f of existing) {
      if (f === 'gallery.json') continue;
      if (!outSlugs.has(f)) await rm(path.join(OUT_DIR, f), { force: true });
    }
  } catch { /* OUT_DIR may be empty on first run */ }

  console.log(`✅ Gallery built: ${items.length} photos -> public/gallery/ (web-optimized)`);
  console.log(`   scanned ${scanned}, skipped ${dupes.length} duplicate(s), ids stable across runs`);
  if (dupes.length) {
    console.log('   duplicates skipped (name/link independent):');
    for (const d of dupes.slice(0, 20)) console.log(`     • ${d.file}  ==  ${d.duplicateOf}`);
    if (dupes.length > 20) console.log(`     … and ${dupes.length - 20} more`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
