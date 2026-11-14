// Builds a 1200x630 social share card: a real photograph of the Foundation with
// the role name (Hindi + English) and the Foundation name over it.
//
// The card is generated at build time so a shared link previews a real photo
// instead of a flat graphic, and so the recipient can read which role the link
// is for. Fonts are embedded as base64 because the build host has no system
// Devanagari font.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const fontHi = fs.readFileSync(path.join(root, 'src/assets/fonts/NotoSansDevanagari-Bold.ttf')).toString('base64');
const fontLa = fs.readFileSync(path.join(root, 'src/assets/fonts/PlusJakartaSans-Variable.ttf')).toString('base64');
const logoPath = path.join(root, 'src/assets/new-logo.png');

const WIDTH = 1200;
const HEIGHT = 630;

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

// Split a name into at most two lines so long department titles still fit.
function wrap(text, maxChars, maxLines = 2) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

function overlaySvg({ hindi, english, kicker, brand, brandHindi }) {
  const hindiLines = wrap(hindi, 22);
  const englishLines = wrap(english, 28);

  let lastHindi = 0;
  const hindiText = hindiLines
    .map((line, index) => {
      lastHindi = 288 + index * 74;
      return `<text class="hi" x="64" y="${lastHindi}" font-size="64">${escapeHtml(line)}</text>`;
    })
    .join('');
  const englishTop = lastHindi + 66;
  const englishText = englishLines
    .map((line, index) => `<text class="en" x="64" y="${englishTop + index * 58}" font-size="46">${escapeHtml(line)}</text>`)
    .join('');
  const lastEnglish = englishTop + (englishLines.length - 1) * 58;
  const ruleY = Math.max(lastEnglish + 44, 512);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0b2545" stop-opacity="0.90"/>
      <stop offset="0.52" stop-color="#12345A" stop-opacity="0.70"/>
      <stop offset="1" stop-color="#12345A" stop-opacity="0.14"/>
    </linearGradient>
    <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.5" stop-color="#0b2545" stop-opacity="0"/>
      <stop offset="1" stop-color="#0b2545" stop-opacity="0.86"/>
    </linearGradient>
    <style>
      @font-face{font-family:'HI';src:url(data:font/ttf;base64,${fontHi}) format('truetype');}
      @font-face{font-family:'LA';src:url(data:font/ttf;base64,${fontLa}) format('truetype');}
      .k{font-family:'LA';font-weight:800;letter-spacing:4px;font-size:23px;fill:#F7A814;}
      .hi{font-family:'HI';font-weight:700;fill:#ffffff;}
      .en{font-family:'LA';font-weight:800;fill:#ffffff;}
      .brand{font-family:'LA';font-weight:800;fill:#ffffff;font-size:28px;}
      .brandhi{font-family:'HI';font-weight:700;fill:#C6D6E6;font-size:21px;}
    </style>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#side)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#base)"/>
  <rect x="0" y="0" width="${WIDTH}" height="8" fill="#F7A814"/>
  <text class="k" x="64" y="106">${escapeHtml(kicker)}</text>
  ${hindiText}
  ${englishText}
  <rect x="64" y="${ruleY}" width="6" height="40" fill="#F7A814"/>
  <text class="brand" x="86" y="${ruleY + 31}">${escapeHtml(brand)}</text>
  <text class="brandhi" x="64" y="${ruleY + 72}">${escapeHtml(brandHindi)}</text>
</svg>`;
}

export async function buildShareCard({ photo, hindi, english, kicker, brand, brandHindi, out }) {
  const overlay = Buffer.from(overlaySvg({ hindi, english, kicker, brand, brandHindi }));

  let base;
  try {
    base = await sharp(photo).resize(WIDTH, HEIGHT, { fit: 'cover', position: 'attention' }).toBuffer();
  } catch {
    base = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#0b2545' } }).png().toBuffer();
  }

  const layers = [{ input: overlay, top: 0, left: 0 }];
  try {
    const logo = await sharp(logoPath).resize({ height: 92, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    layers.push({ input: logo, top: 40, left: WIDTH - 92 - 56 });
  } catch {
    // A missing logo must not fail the build; the card still carries the name.
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(base).composite(layers).jpeg({ quality: 84, chromaSubsampling: '4:4:4' }).toFile(out);
}
