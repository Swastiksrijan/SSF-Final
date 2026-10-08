// SSF Social Publisher — code-generated post images (SVG, no stock photos).
// Returns a branded 1080x1080 SVG that the browser renders to PNG-like visual.
// House rule: awareness visuals are hand-coded art, never borrowed photos.

const fs = require('fs');
const path = require('path');
const { ORG } = require('./content');

const FONT_DIR = path.join(__dirname, '..', '..', 'assets', 'fonts');
const FONT_FILES = ['NotoSans-Regular.ttf', 'NotoSans-Bold.ttf',
  'NotoSansDevanagari-Regular.ttf', 'NotoSansDevanagari-Bold.ttf']
  .map((f) => path.join(FONT_DIR, f)).filter((f) => fs.existsSync(f));

// Organisation emblem, embedded as a data URI so the rasterizer needs no network.
// Falls back to the letter "S" badge when the file is absent.
const LOGO_FILE = path.join(__dirname, '..', '..', 'assets', 'social-logo.png');
let LOGO_URI = '';
try { if (fs.existsSync(LOGO_FILE)) LOGO_URI = 'data:image/png;base64,' + fs.readFileSync(LOGO_FILE).toString('base64'); } catch { /* badge fallback */ }

const CAT = {
  education: ['#002344', '#0b3a63', '#FFD166'],
  health: ['#7f1d1d', '#b91c1c', '#FFD166'],
  environment: ['#064e3b', '#047857', '#FFD166'],
  women: ['#4c1d95', '#7c3aed', '#FFD166'],
  youth: ['#0c4a6e', '#0284c7', '#FFD166'],
  community: ['#002344', '#0b3a63', '#FF6600'],
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Greedy word-wrap into lines of at most `max` characters.
function wrap(text, max) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur.length) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur.length) lines.push(cur);
  return lines;
}

function tspans(lines, x, startY, lh) {
  return lines.map((l, i) => `<tspan x="${x}" y="${startY + i * lh}">${esc(l)}</tspan>`).join('');
}

// Build the bilingual SVG for one post.
function postSvg(post) {
  const [c1, c2, accent] = CAT[post.category] || CAT.community;
  const titleEnLines = wrap(post.titleEn, 20).slice(0, 2);
  const titleHiLines = wrap(post.titleHi, 22).slice(0, 2);
  const subEnLines = wrap(post.subtitleEn || '', 52).slice(0, 1);
  const subHiLines = wrap(post.subtitleHi || '', 48).slice(0, 1);

  let y = 400;
  const titleEn = tspans(titleEnLines, 70, y, 84); y += titleEnLines.length * 84 + 30;
  const titleHi = tspans(titleHiLines, 70, y, 72); y += titleHiLines.length * 72 + 34;
  const subEn = tspans(subEnLines, 70, y, 42); y += subEnLines.length ? 50 : 0;
  const subHi = tspans(subHiLines, 70, y, 40); y += subHiLines.length ? 48 : 0;
  const barY = Math.min(Math.max(y + 14, 770), 850);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" font-family="'Noto Sans Devanagari','Noto Sans','Nirmala UI','Mangal','Segoe UI',Arial,sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <circle cx="960" cy="120" r="220" fill="${accent}" opacity="0.10"/>
  <circle cx="120" cy="980" r="260" fill="#ffffff" opacity="0.05"/>

  <!-- brand row: organisation emblem + name + motto -->
  <g transform="translate(70,70)">
    ${LOGO_URI
      ? `<image x="0" y="0" width="104" height="104" href="${LOGO_URI}"/>`
      : `<rect x="0" y="0" width="104" height="104" rx="24" fill="#ffffff"/><text x="52" y="70" text-anchor="middle" font-size="56" font-weight="800" fill="${c1}">S</text>`}
    <text x="130" y="40" font-size="36" font-weight="800" fill="#ffffff">${esc(ORG.name)}</text>
    <text x="130" y="76" font-size="24" font-weight="700" fill="#ffffff">${esc(ORG.mottoEn)}</text>
    <text x="130" y="106" font-size="22" font-weight="600" fill="${accent}">${esc(ORG.mottoHi)}</text>
  </g>

  <!-- bilingual title + subtitle -->
  <text font-size="72" font-weight="800" fill="#ffffff">${titleEn}</text>
  <text font-size="58" font-weight="700" fill="${accent}">${titleHi}</text>
  <text font-size="34" fill="#ffffff" opacity="0.92">${subEn}</text>
  <text font-size="32" font-weight="600" fill="${accent}" opacity="0.95">${subHi}</text>

  <!-- accent bar -->
  <rect x="70" y="${barY}" width="150" height="10" rx="5" fill="${accent}"/>

  <!-- footer -->
  <text x="70" y="912" font-size="28" fill="#ffffff" opacity="0.85">${esc(post.dateEn)} • ${esc(post.dateHi)}</text>
  <text x="70" y="962" font-size="28" font-weight="700" fill="${accent}">🌐 ${esc(ORG.website)}   📞 ${esc(ORG.phone)}</text>
  <text x="70" y="1022" font-size="24" font-weight="700" fill="#ffffff" opacity="0.75">#SSF #SwastikSrijan #${esc(post.category || 'community')}</text>
</svg>`;
}

let ResvgCtor;
function getResvg() {
  if (ResvgCtor === undefined) {
    try { ResvgCtor = require('@resvg/resvg-js').Resvg; } catch { ResvgCtor = null; }
  }
  return ResvgCtor;
}

// Rasterize a post to a PNG Buffer (Facebook / Instagram / Telegram need PNG).
// Returns null when the rasterizer is unavailable so callers can fall back.
function postPng(post) {
  const R = getResvg();
  if (!R) return null;
  const opts = { fitTo: { mode: 'width', value: 1080 } };
  if (FONT_FILES.length) {
    opts.font = { fontFiles: FONT_FILES, loadSystemFonts: true, defaultFontFamily: 'Noto Sans Devanagari' };
  } else {
    opts.font = { loadSystemFonts: true };
  }
  return Buffer.from(new R(postSvg(post), opts).render().asPng());
}

module.exports = { postSvg, postPng, isSvgSafe: () => true };
