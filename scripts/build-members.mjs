// Build the member/team photo library from raw originals.
//
// Source of truth:  public/Gallery_Images/team/   (originals, add any time)
// Outputs:          public/members/<slug>.jpg        web-optimized portrait
//                   public/members/<slug>-sq.jpg     square smart-crop (avatars)
//                   public/members/members.json      + src/data/memberManifest.json
//
// Safe de-duplication: only pixel-identical copies are merged (a re-saved file
// of the same picture). Photos that merely share a NAME but show different
// subjects are all kept.
//
// Run:  node scripts/build-members.mjs

import { readdir, writeFile, mkdir, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'public', 'Gallery_Images', 'team');
const OUT_DIR = path.join(ROOT, 'public', 'members');
const IDX = path.join(SRC_DIR, 'members.hashes.json');
const WEB_MANIFEST = path.join(OUT_DIR, 'members.json');
const SRC_MANIFEST = path.join(ROOT, 'src', 'data', 'memberManifest.json');
const IMG_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const DUP_MAX_DIFF = 8; // 32x32 grayscale mean abs diff; identical re-saves ~0-3, real photos 50+

const slugify = (s) => s.toLowerCase().replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'member';

// Tidy "harish_kumar" / "Adv Harish" / "Ramesh photo" -> a readable name.
function personName(file) {
  let n = file
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/\b(updated|new|final|phot|photo|img|image|whatsapp|screenshot|copy|edited|11zon)\b/gi, ' ')
    .replace(/[_.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!n) return 'Team Member';
  return n
    .split(' ')
    .map((w) => (/^[A-Z]{2,}$/.test(w) || /^[A-Z][a-z]/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ');
}

// Prefer the cleanest-looking file name inside a duplicate cluster.
function nameScore(file) {
  const base = file.replace(/\.[a-z0-9]+$/i, '');
  let s = 0;
  if (/^[a-z]+(_[a-z]+)+$/.test(base)) s += 3;          // first_last slug
  if (/^([A-Z][a-z]+ )+[A-Z][a-z]+$/.test(base)) s += 2; // Proper Case
  if (/\b(phot|photo|updated|new|final|img|copy|11zon)\b/i.test(base)) s -= 3;
  if (/^\d/.test(base)) s -= 1;
  return s;
}

async function fingerprint(file) {
  const { data } = await sharp(file).resize(32, 32, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  return data;
}
function meanDiff(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`✖ Source folder not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  let prev = {};
  try { prev = JSON.parse(await readFile(IDX, 'utf8')).slots || {}; } catch { prev = {}; }

  const files = (await readdir(SRC_DIR)).filter((f) => IMG_RE.test(f)).sort();
  const kept = [];      // { file, fp }
  const dupes = [];
  const order = [...files].sort((a, b) => {
    const ra = prev[a] ? 0 : 1; const rb = prev[b] ? 0 : 1;
    return ra - rb || a.localeCompare(b);
  });

  const usedSlugs = new Set();
  const outSlugs = new Set();
  const items = [];

  for (const file of order) {
    const src = path.join(SRC_DIR, file);
    let fp;
    try { fp = await fingerprint(src); } catch (e) { console.warn(`⚠️  Skip ${file}: ${e.message}`); continue; }

    const dup = kept.find((k) => meanDiff(k.fp, fp) <= DUP_MAX_DIFF);
    if (dup) {
      dupes.push({ file, duplicateOf: dup.file });
      // Prefer the cleaner name: if this copy is better, swap the kept entry.
      if (nameScore(file) > nameScore(dup.file)) { dup.file = file; dup.fp = fp; }
      continue;
    }
    kept.push({ file, fp });
  }

  // Build outputs only for the surviving files.
  for (const { file } of kept) {
    let slug = slugify(file);
    while (usedSlugs.has(slug)) slug += '-2';
    usedSlugs.add(slug);
    outSlugs.add(`${slug}.jpg`);
    outSlugs.add(`${slug}-sq.jpg`);

    const src = path.join(SRC_DIR, file);
    try {
      await sharp(src).rotate()
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(OUT_DIR, `${slug}.jpg`));
      await sharp(src).rotate()
        .resize(600, 600, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(OUT_DIR, `${slug}-sq.jpg`));
    } catch (e) {
      console.warn(`⚠️  Skip ${file}: ${e.message}`);
      continue;
    }
    items.push({
      id: slug,
      name: personName(file),
      file,
      photo: `/members/${slug}.jpg`,
      square: `/members/${slug}-sq.jpg`,
    });
  }

  items.sort((a, b) => a.name.localeCompare(b.name));

  const manifestOut = { count: items.length, items };
  await writeFile(WEB_MANIFEST, JSON.stringify(manifestOut, null, 2));
  await writeFile(SRC_MANIFEST, JSON.stringify(manifestOut, null, 2));
  await writeFile(IDX, JSON.stringify({ slots: Object.fromEntries(kept.map((k) => [k.file, slugify(k.file)])) }, null, 2));

  // Prune optimized files whose source is gone.
  try {
    const existing = await readdir(OUT_DIR);
    for (const f of existing) {
      if (f === 'members.json') continue;
      if (!outSlugs.has(f)) await rm(path.join(OUT_DIR, f), { force: true });
    }
  } catch { /* first run */ }

  console.log(`✅ Member library: ${items.length} unique photos -> public/members/ (+ square crops)`);
  if (dupes.length) {
    console.log(`   merged ${dupes.length} exact duplicate(s):`);
    for (const d of dupes) console.log(`     • ${d.file}  ==  ${d.duplicateOf}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
