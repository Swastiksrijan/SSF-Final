// SSF — social page cover/banner generator (code-drawn, no stock photos).
// Builds premium branded covers from the shared palette + emblem so every
// channel looks consistent. Run: node backend_node/scripts/makeSocialCovers.js
//
// Layouts respect each network's profile-photo overlap:
//  - Facebook: profile pic covers the BOTTOM-LEFT on mobile -> keep it clear.
//  - LinkedIn: profile pic covers the BOTTOM-LEFT -> keep it clear.
const fs = require('fs');
const path = require('path');
const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas');

const ROOT = path.join(__dirname, '..');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
const LOGO_FILE = path.join(ROOT, 'assets', 'social-logo.png');
const OUT_DIR = path.join(ROOT, '..', 'public', 'social-covers');

const NAVY_DEEP = '#001529';
const NAVY = '#002344';
const NAVY_MID = '#0b3a63';
const ORANGE = '#FF6600';
const ORANGE_LT = '#FF8C42';
const YELLOW = '#FFD166';

const BRAND = {
  name: 'Swastik Srijan Foundation',
  legal: 'Swastik Srijan Foundation Samiti',
  mottoEn: 'Creating Change. Inspiring Lives.',
  mottoHi: 'सहयोग • कौशल • जागरूकता • सृजन',
  tagline: 'One Organisation • One Record • Complete Accountability',
  website: 'swastiksrijan.in',
  phone: '+91 97183 46691',
};

// Register the bundled fonts under stable families (canvas has no auto-fallback,
// so EN uses "NotoSans" and Devanagari lines use "NotoSansDev").
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'NotoSans-Regular.ttf'), 'NotoSansR');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'NotoSans-Bold.ttf'), 'NotoSansB');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'NotoSansDevanagari-Regular.ttf'), 'NotoDevR');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'NotoSansDevanagari-Bold.ttf'), 'NotoDevB');

const EN = (size) => `${size}px NotoSansB`;
const ENr = (size) => `${size}px NotoSansR`;
const HI = (size) => `${size}px NotoDevB`;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Fit a single line into maxWidth by shrinking the font (never wraps).
function fitFont(ctx, text, family, weight, maxWidth, startSize, minSize = 18) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1;
  }
  return size;
}

function paintBackground(ctx, W, H) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, NAVY_DEEP);
  g.addColorStop(0.55, NAVY);
  g.addColorStop(1, NAVY_MID);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // warm glow top-right, cool glow bottom-left
  const warm = ctx.createRadialGradient(W * 0.88, H * 0.16, 0, W * 0.88, H * 0.16, Math.max(W, H) * 0.62);
  warm.addColorStop(0, 'rgba(255,102,0,0.30)');
  warm.addColorStop(0.5, 'rgba(255,102,0,0.08)');
  warm.addColorStop(1, 'rgba(255,102,0,0)');
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, W, H);

  const cool = ctx.createRadialGradient(W * 0.06, H * 0.94, 0, W * 0.06, H * 0.94, Math.max(W, H) * 0.55);
  cool.addColorStop(0, 'rgba(12,74,110,0.55)');
  cool.addColorStop(1, 'rgba(12,74,110,0)');
  ctx.fillStyle = cool;
  ctx.fillRect(0, 0, W, H);

  // faint diagonal sheen
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  for (let x = -H; x < W; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + H, H);
    ctx.stroke();
  }
  ctx.restore();

  // hairline top accent
  const top = ctx.createLinearGradient(0, 0, W, 0);
  top.addColorStop(0, ORANGE);
  top.addColorStop(0.5, YELLOW);
  top.addColorStop(1, ORANGE);
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, 6);
}

async function drawLogo(ctx, x, y, size) {
  const logo = await loadImage(LOGO_FILE);
  const r = size / 2;
  const cx = x + r, cy = y + r;
  // glass disc + placeholder letter
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r - 2, 0, Math.PI * 2); ctx.clip();
  const pad = size * 0.08;
  ctx.drawImage(logo, x + pad, y + pad, size - pad * 2, size - pad * 2);
  ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,209,102,0.85)'; ctx.stroke();
}

// Round photo frame: centre-crops a real SSF photo into a circle with a ring.
async function drawCirclePhoto(ctx, file, cx, cy, r, ring = '#FFD166', ringW = 6) {
  const img = await loadImage(path.join(ROOT, '..', 'public', 'images', file));
  const d = r * 2;
  const scale = Math.max(d / img.width, d / img.height);
  const dw = img.width * scale, dh = img.height * scale;
  ctx.save();
  // soft shadow
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 8;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#0b3a63'; ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r - ringW / 2, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
  ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, r - ringW / 2, 0, Math.PI * 2);
  ctx.lineWidth = ringW; ctx.strokeStyle = ring; ctx.stroke();
}

function drawPill(ctx, x, y, w, h, label) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, ORANGE);
  g.addColorStop(1, ORANGE_LT);
  ctx.fillStyle = g;
  roundRect(ctx, x, y, w, h, h / 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  const size = fitFont(ctx, label, 'NotoSansB', 800, w - 40, Math.round(h * 0.46));
  ctx.font = EN(size);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 2);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
}

function accentBar(ctx, x, y, w) {
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, ORANGE);
  g.addColorStop(1, YELLOW);
  ctx.fillStyle = g;
  roundRect(ctx, x, y, w, 8, 4); ctx.fill();
}

// ---- Facebook Page cover (1640 x 664) --------------------------------------
async function facebookCover() {
  const W = 1640, H = 664, M = 78;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  paintBackground(ctx, W, H);

  // brand block (top-left)
  await drawLogo(ctx, M, 58, 118);
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left';
  const nameSize = fitFont(ctx, BRAND.name, 'NotoSansB', 800, W * 0.5, 52);
  ctx.font = EN(nameSize); ctx.fillText(BRAND.name, M + 142, 108);
  ctx.font = ENr(24); ctx.globalAlpha = 0.75;
  ctx.fillText(BRAND.legal, M + 142, 146);
  ctx.globalAlpha = 1;

  // headline
  const hx = M, hy = 318;
  ctx.fillStyle = '#ffffff';
  const s1 = fitFont(ctx, BRAND.mottoEn, 'NotoSansB', 800, W - M * 2 - 120, 92);
  ctx.font = EN(s1); ctx.fillText(BRAND.mottoEn, hx, hy);
  ctx.fillStyle = YELLOW;
  ctx.font = HI(52); ctx.fillText(BRAND.mottoHi, hx, hy + 74);
  accentBar(ctx, hx, hy + 104, 190);
  ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.85;
  ctx.font = ENr(30); ctx.fillText(BRAND.tagline, hx, hy + 158);
  ctx.globalAlpha = 1;

  // two round SSF photo frames (centre-right), overlap-free
  await drawCirclePhoto(ctx, 'real/girls-study-group-mat.jpg', 1085, 250, 145, YELLOW, 7);
  await drawCirclePhoto(ctx, 'real/tree_plantation.jpg', 1395, 250, 145, ORANGE, 7);

  // contact + CTA bottom-right (bottom-left kept clear for the profile pic)
  ctx.textAlign = 'right';
  ctx.fillStyle = YELLOW; ctx.font = EN(34);
  ctx.fillText(BRAND.website, W - M, 560);
  ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.8; ctx.font = ENr(26);
  ctx.fillText(BRAND.phone, W - M, 598);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  drawPill(ctx, 1105, 445, 270, 74, 'Join Us');

  fs.writeFileSync(path.join(OUT_DIR, 'facebook-cover-1640x664.png'), canvas.toBuffer('image/png'));
}

// ---- LinkedIn company cover (1128 x 191) -----------------------------------
async function linkedinCover() {
  const W = 1128, H = 191, M = 46;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  paintBackground(ctx, W, H);

  // brand block top-left; bottom-left stays clear (profile pic overlaps it)
  await drawLogo(ctx, M, 26, 84);
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left';
  const nameSize = fitFont(ctx, BRAND.name, 'NotoSansB', 800, 500, 40);
  ctx.font = EN(nameSize); ctx.fillText(BRAND.name, M + 102, 58);
  ctx.fillStyle = YELLOW; ctx.font = EN(22);
  ctx.fillText(BRAND.mottoEn, M + 102, 90);
  ctx.fillStyle = YELLOW; ctx.globalAlpha = 0.9; ctx.font = HI(21);
  ctx.fillText(BRAND.mottoHi, M + 102, 118);
  ctx.globalAlpha = 1;

  // one round SSF photo frame (centre-right)
  await drawCirclePhoto(ctx, 'real/community-education-meeting.jpg', 970, 95, 66, YELLOW, 5);

  // contact top-right
  ctx.textAlign = 'right';
  ctx.fillStyle = YELLOW; ctx.font = EN(26); ctx.fillText(BRAND.website, W - M, 60);
  ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.8; ctx.font = ENr(19);
  ctx.fillText(BRAND.phone, W - M, 100);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';

  // orange accent line along the very bottom
  accentBar(ctx, 0, H - 8, W);

  fs.writeFileSync(path.join(OUT_DIR, 'linkedin-cover-1128x191.png'), canvas.toBuffer('image/png'));
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await facebookCover();
  await linkedinCover();
  console.log('Wrote covers to', OUT_DIR);
})().catch((e) => { console.error(e); process.exit(1); });
