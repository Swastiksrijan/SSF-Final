// Website-wide photo library.
//
// Every real SSF activity photo lives in public/Gallery_Images/ and is turned
// into a web-optimized asset + manifest by `node scripts/build-gallery.mjs`.
// Import these helpers from ANY website page/section to use a photo, e.g.
//
//   import { galleryPhotos, pickPhoto, photosByCategory } from '../../data/gallery';
//   const hero = pickPhoto({ category: 'Education' });
//   <img src={hero.src} alt={hero.alt} />
//
// Nothing here is hard-coded per photo: add a file to Gallery_Images, re-run
// the build, and new photos become available everywhere automatically.

import manifest from './galleryManifest.json';

export const galleryPhotos = () => manifest.items || [];
export const galleryCount = () => manifest.count || 0;

// Photos in a given category (case-insensitive), newest first by file order.
export function photosByCategory(category) {
  const c = String(category || '').toLowerCase();
  return galleryPhotos().filter((p) => String(p.category).toLowerCase() === c);
}

// Free-text search across title/category/keywords/alt.
export function searchPhotos(query) {
  const q = String(query || '').toLowerCase().trim();
  if (!q) return galleryPhotos();
  return galleryPhotos().filter((p) =>
    [p.titleEn, p.titleHi, p.category, p.alt, ...(p.keywords || [])]
      .join(' ')
      .toLowerCase()
      .includes(q),
  );
}

// Deterministic single pick — same filters => same photo (stable across renders).
export function pickPhoto({ category, query, index = 0 } = {}) {
  let pool = galleryPhotos();
  if (category) pool = pool.filter((p) => String(p.category).toLowerCase() === String(category).toLowerCase());
  if (query) pool = searchPhotos(query);
  if (!pool.length) pool = galleryPhotos();
  return pool.length ? pool[index % pool.length] : null;
}