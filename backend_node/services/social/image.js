// SSF Social Publisher — code-generated post images (no stock photos).
// Produces a branded 1080x1080 PNG. House rule: awareness visuals are
// hand-coded art, never borrowed photos.
//
// Rendering: the PNG is rasterized with @napi-rs/canvas (Skia + HarfBuzz), the
// same text stack a browser uses. The older resvg rasterizer mishaped some
// Devanagari words, which is why Hindi titles looked wrong even though the
// caption text was fine. @napi-rs/canvas is preferred; resvg stays as a
// last-resort fallback so publishing never breaks.

const fs = require('fs');
const path = require('path');
const { ORG } = require('./content');

const FONT_DIR = path.join(__dirname, '..', '..', 'assets', 'fonts');
const FONT_FILES = ['NotoSans-Regular.ttf', 'NotoSans-Bold.ttf',
  'NotoSansDevanagari-Regular.ttf', 'NotoSansDevanagari-Bold.ttf']
  .map((f) => path.join(FONT_DIR, f)).filter((f) => fs.existsSync(f));

// Organisation emblem, loaded from disk so the rasterizer needs no network.
// Falls back to the letter "S" badge when the file is absent.
const LOGO_FILE = path.join(__dirname, '..', '..', 'assets', 'social-logo.png');
const LOGO_URI = (() => {
  try { return fs.existsSync(LOGO_FILE) ? 'data:image/png;base64,' + fs.readFileSync(LOGO_FILE).toString('base64') : ''; }
  catch { return ''; }
})();

const SITE = 'https://swastiksrijan.in/';
const FONT_STACK = '"Noto Sans Devanagari", "Noto Sans", "DejaVu Sans", sans-serif';

const CAT = {
  education: ['#002344', '#0b3a63', '#FFD166'],
  health: ['#7f1d1d', '#b91c1c', '#FFD166'],
  environment: ['#064e3b', '#047857', '#FFD166'],
  women: ['#4c1d95', '#7c3aed', '#FFD166'],
  youth: ['#0c4a6e', '#0284c7', '#FFD166'],
  community: ['#002344', '#0b3a63', '#FF6600'],
  // Festival palettes — one distinct, respectful colour family per tradition so
  // a greeting does not reuse a single generic look for every religion.
  festival: ['#002344', '#0b3a63', '#FFD166'],
  'festival-hindu': ['#7c2d12', '#b45309', '#FFD166'],
  'festival-muslim': ['#064e3b', '#047857', '#D4AF37'],
  'festival-sikh': ['#1e3a8a', '#2563eb', '#F59E0B'],
  'festival-christian': ['#7f1d1d', '#b91c1c', '#FCD34D'],
  'festival-buddhist': ['#78350f', '#b45309', '#FDE68A'],
  'festival-jain': ['#7f1d1d', '#dc2626', '#FCD34D'],
  'festival-jewish': ['#1e3a8a', '#1d4ed8', '#D4AF37'],
  // Solemn tone for remembrance / tragedy days — muted, no celebratory warmth.
  solemn: ['#1f2937', '#374151', '#9CA3AF'],
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ---- shared layout maths (used by both the canvas and SVG renderers) --------

// Greedy word-wrap into lines of at most `max` characters (SVG fallback only).
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

// Vertical plan of the poster: title block positions + the footer button box.
function layout(post) {
  const titleEnLines = wrap(post.titleEn, 20).slice(0, 2);
  const titleHiLines = wrap(post.titleHi, 22).slice(0, 2);
  const subEnLines = wrap(post.subtitleEn || '', 52).slice(0, 1);
  const subHiLines = wrap(post.subtitleHi || '', 48).slice(0, 1);

  let y = 400;
  const titleEnY = y; y += titleEnLines.length * 84 + 30;
  const titleHiY = y; y += titleHiLines.length * 72 + 34;
  const subEnY = y; y += subEnLines.length ? 50 : 0;
  const subHiY = y; y += subHiLines.length ? 48 : 0;
  const barY = Math.min(Math.max(y + 14, 770), 850);
  return { titleEnLines, titleHiLines, subEnLines, subHiLines, titleEnY, titleHiY, subEnY, subHiY, barY };
}

// ---- SVG string (browser fallback when no rasterizer is available) ----------
function postSvg(post) {
  const [c1, c2, accent] = CAT[post.palette] || CAT[post.category] || CAT.community;
  const L = layout(post);
  const titleEn = tspans(L.titleEnLines, 70, L.titleEnY, 84);
  const titleHi = tspans(L.titleHiLines, 70, L.titleHiY, 72);
  const subEn = tspans(L.subEnLines, 70, L.subEnY, 42);
  const subHi = tspans(L.subHiLines, 70, L.subHiY, 40);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" font-family="'Noto Sans Devanagari','Noto Sans',Arial,sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <circle cx="960" cy="120" r="220" fill="${accent}" opacity="0.10"/>
  <circle cx="120" cy="980" r="260" fill="#ffffff" opacity="0.05"/>

  <g transform="translate(70,70)">
    ${LOGO_URI
      ? `<image x="0" y="0" width="104" height="104" href="${LOGO_URI}"/>`
      : `<rect x="0" y="0" width="104" height="104" rx="24" fill="#ffffff"/><text x="52" y="70" text-anchor="middle" font-size="56" font-weight="800" fill="${c1}">S</text>`}
    <text x="130" y="40" font-size="36" font-weight="800" fill="#ffffff">${esc(ORG.name)}</text>
    <text x="130" y="76" font-size="24" font-weight="700" fill="#ffffff">${esc(ORG.mottoEn)}</text>
    <text x="130" y="106" font-size="22" font-weight="600" fill="${accent}">${esc(ORG.mottoHi)}</text>
  </g>

  <text font-size="72" font-weight="800" fill="#ffffff">${titleEn}</text>
  <text font-size="58" font-weight="700" fill="${accent}">${titleHi}</text>
  <text font-size="34" fill="#ffffff" opacity="0.92">${subEn}</text>
  <text font-size="32" font-weight="600" fill="${accent}" opacity="0.95">${subHi}</text>

  <rect x="70" y="${L.barY}" width="150" height="10" rx="5" fill="${accent}"/>

  <text x="70" y="880" font-size="28" fill="#ffffff" opacity="0.85">${esc(post.dateEn)} • ${esc(post.dateHi)}</text>
  <text x="70" y="926" font-size="28" font-weight="700" fill="${accent}">${esc(ORG.website)}   ${esc(ORG.phone)}</text>
  <text x="70" y="976" font-size="24" font-weight="700" fill="#ffffff" opacity="0.75">#SSF #SwastikSrijan #${esc(post.category || 'community')}</text>
  <rect x="680" y="905" width="330" height="82" rx="41" fill="#FF6600"/>
  <text x="845" y="957" text-anchor="middle" font-size="34" font-weight="800" fill="#ffffff">Join Us</text>
</svg>`;
}

// ---- canvas (preferred) ----------------------------------------------------

let skia; // undefined = not tried, null = unavailable
function getSkia() {
  if (skia !== undefined) return skia;
  try {
    skia = require('@napi-rs/canvas');
    for (const f of FONT_FILES) {
      const family = /Devanagari/i.test(f) ? 'Noto Sans Devanagari' : 'Noto Sans';
      skia.GlobalFonts.registerFromPath(f, family);
    }
  } catch { skia = null; }
  return skia;
}

let logoImg; // cached decoded emblem
async function getLogo() {
  if (logoImg !== undefined) return logoImg;
  try { logoImg = await getSkia().loadImage(LOGO_FILE); } catch { logoImg = null; }
  return logoImg;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapCanvas(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(ctx, lines, x, y, lh) {
  let cy = y;
  for (const ln of lines) { ctx.fillText(ln, x, cy); cy += lh; }
  return cy;
}

async function drawPost(post, format = 'png') {
  const { createCanvas } = getSkia();
  const [c1, c2, accent] = CAT[post.palette] || CAT[post.category] || CAT.community;
  const W = 1080, H = 1080, M = 70;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';

  // background
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.10; ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(960, 120, 220, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 0.05; ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(120, 980, 260, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // brand row: emblem + name + motto
  const logo = await getLogo();
  if (logo) {
    ctx.drawImage(logo, M, M, 104, 104);
  } else {
    ctx.fillStyle = '#ffffff'; roundRect(ctx, M, M, 104, 104, 24); ctx.fill();
    ctx.fillStyle = c1; ctx.font = `800 56px ${FONT_STACK}`; ctx.textAlign = 'center';
    ctx.fillText('S', M + 52, M + 70); ctx.textAlign = 'left';
  }
  ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff';
  ctx.font = `800 36px ${FONT_STACK}`; ctx.fillText(ORG.name, M + 130, M + 40);
  ctx.font = `700 24px ${FONT_STACK}`; ctx.fillText(ORG.mottoEn, M + 130, M + 76);
  ctx.fillStyle = accent;
  ctx.font = `600 22px ${FONT_STACK}`; ctx.fillText(ORG.mottoHi, M + 130, M + 106);

  // title (EN then HI) + subtitles
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 72px ${FONT_STACK}`;
  let y = drawLines(ctx, wrapCanvas(ctx, post.titleEn, W - 140).slice(0, 2), M, 400, 84) + 30;
  ctx.fillStyle = accent;
  ctx.font = `700 58px ${FONT_STACK}`;
  y = drawLines(ctx, wrapCanvas(ctx, post.titleHi, W - 140).slice(0, 2), M, y, 72) + 34;
  if (post.subtitleEn) {
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.92;
    ctx.font = `400 34px ${FONT_STACK}`;
    y = drawLines(ctx, wrapCanvas(ctx, post.subtitleEn, W - 140).slice(0, 1), M, y, 42) + 8;
    ctx.globalAlpha = 1;
  }
  if (post.subtitleHi) {
    ctx.fillStyle = accent; ctx.globalAlpha = 0.95;
    ctx.font = `600 32px ${FONT_STACK}`;
    y = drawLines(ctx, wrapCanvas(ctx, post.subtitleHi, W - 140).slice(0, 1), M, y, 40) + 8;
    ctx.globalAlpha = 1;
  }

  // accent bar
  const barY = Math.min(Math.max(y + 14, 770), 850);
  ctx.fillStyle = accent; roundRect(ctx, M, barY, 150, 10, 5); ctx.fill();

  // footer: date, contact (no emoji -> no missing-glyph boxes), hashtags, button
  ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.85;
  ctx.font = `400 28px ${FONT_STACK}`;
  ctx.fillText(`${post.dateEn} • ${post.dateHi}`, M, 880);
  ctx.globalAlpha = 1; ctx.fillStyle = accent;
  ctx.font = `700 28px ${FONT_STACK}`;
  ctx.fillText(`${ORG.website}   ${ORG.phone}`, M, 926);
  ctx.globalAlpha = 0.75; ctx.fillStyle = '#ffffff';
  ctx.font = `700 24px ${FONT_STACK}`;
  ctx.fillText(`#SSF #SwastikSrijan #${post.category || 'community'}`, M, 976);
  ctx.globalAlpha = 1;

  // "Join Us" button -> the post caption carries the same link so a tap opens it
  ctx.fillStyle = '#FF6600'; roundRect(ctx, 680, 905, 330, 82, 41); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.font = `800 34px ${FONT_STACK}`;
  ctx.fillText('Join Us', 845, 957);
  ctx.textAlign = 'left';

  return Buffer.from(canvas.toBuffer(format === 'jpeg' ? 'image/jpeg' : 'image/png'));
}

// ---- resvg (fallback only) -------------------------------------------------

let ResvgCtor;
function getResvg() {
  if (ResvgCtor === undefined) {
    try { ResvgCtor = require('@resvg/resvg-js').Resvg; } catch { ResvgCtor = null; }
  }
  return ResvgCtor;
}

// Rasterize a post to a PNG Buffer. Returns null when no rasterizer is available
// so callers can fall back to plain text.
async function postPng(post) {
  if (getSkia()) {
    try { return await drawPost(post, 'png'); } catch { /* fall through to resvg */ }
  }
  const R = getResvg();
  if (R) {
    const opts = { fitTo: { mode: 'width', value: 1080 } };
    opts.font = FONT_FILES.length
      ? { fontFiles: FONT_FILES, loadSystemFonts: true, defaultFontFamily: 'Noto Sans Devanagari' }
      : { loadSystemFonts: true };
    return Buffer.from(new R(postSvg(post), opts).render().asPng());
  }
  return null;
}

// JPEG variant: Instagram only accepts JPEG (a PNG is rejected with code 9004).
async function postJpeg(post) {
  if (getSkia()) {
    try { return await drawPost(post, 'jpeg'); } catch { /* fall back to PNG */ }
  }
  return postPng(post);
}

module.exports = { postSvg, postPng, postJpeg, site: SITE, isSvgSafe: () => true };
