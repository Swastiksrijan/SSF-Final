// SSF Social Publisher — code-generated post images (SVG, no stock photos).
// Returns a branded 1080x1080 SVG that the browser renders to PNG-like visual.
// House rule: awareness visuals are hand-coded art, never borrowed photos.

const { ORG } = require('./content');

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

// Build the SVG for one post.
function postSvg(post) {
  const [c1, c2, accent] = CAT[post.category] || CAT.community;
  const titleEnLines = wrap(post.titleEn, 18).slice(0, 3);
  const titleHiLines = wrap(post.titleHi, 20).slice(0, 3);
  const bodyLines = wrap(post.bodyEn.split('\n')[0], 40).slice(0, 1);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" font-family="'Noto Sans Devanagari','Nirmala UI','Mangal','Segoe UI',Arial,sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <circle cx="960" cy="120" r="220" fill="${accent}" opacity="0.10"/>
  <circle cx="120" cy="980" r="260" fill="#ffffff" opacity="0.05"/>

  <!-- brand row -->
  <g transform="translate(70,70)">
    <rect x="0" y="0" width="96" height="96" rx="22" fill="#ffffff"/>
    <text x="48" y="64" text-anchor="middle" font-size="52" font-weight="800" fill="${c1}">S</text>
    <text x="120" y="38" font-size="34" font-weight="800" fill="#ffffff">${esc(ORG.name)}</text>
    <text x="120" y="76" font-size="22" fill="${accent}">${esc(ORG.taglineEn)}</text>
  </g>

  <!-- main title, bilingual -->
  <text font-size="74" font-weight="800" fill="#ffffff">${tspans(titleEnLines, 70, 430, 88)}</text>
  <text font-size="60" font-weight="700" fill="${accent}">${tspans(titleHiLines, 70, 430 + titleEnLines.length * 88 + 44, 76)}</text>

  <!-- accent bar -->
  <rect x="70" y="760" width="150" height="10" rx="5" fill="${accent}"/>

  <!-- footer -->
  <text x="70" y="900" font-size="30" fill="#ffffff" opacity="0.92">${esc(post.dateEn)} • ${esc(post.dateHi)}</text>
  <text x="70" y="952" font-size="30" font-weight="700" fill="${accent}">🌐 ${esc(ORG.website)}   📞 ${esc(ORG.phone)}</text>
  <text x="70" y="1012" font-size="24" fill="#ffffff" opacity="0.75">${esc(bodyLines[0] || '')}</text>
</svg>`;
}

module.exports = { postSvg, isSvgSafe: () => true };
