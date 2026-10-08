// SSF Organisation Profile → branded, bilingual PDF.
//
// We deliberately do NOT draw Devanagari with jsPDF: jsPDF has no Indic shaping,
// so Hindi conjuncts break. Instead we lay the document out as real HTML (the
// browser shapes Devanagari perfectly), rasterise it with html2canvas, and slice
// the tall canvas into A4 pages. English-only chrome (page numbers) stays in
// jsPDF. This keeps the Hindi correct in the final PDF.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../assets/new-logo.png';
import devaRegularUrl from '../assets/fonts/NotoSansDevanagari-Regular.ttf?url';
import devaBoldUrl from '../assets/fonts/NotoSansDevanagari-Bold.ttf?url';
import { PROFILE_DOC } from './orgProfileData';

const NAVY = '#002344';
const ORANGE = '#FF6600';
const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const PAGE_W_PX = 794;   // A4 @ 96dpi
const PAGE_H_PX = 1122;

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Devanagari font as a data URL, embedded once. Bundling the font with the app
// (rather than relying on a Google Fonts CDN at raster time) guarantees Hindi
// shapes correctly even offline, on a slow connection, or inside an admin
// network that blocks fonts.googleapis.com.
let devaFontCss = null;
async function devaFontFaceCss() {
  if (devaFontCss != null) return devaFontCss;
  const toData = async (url) => {
    const res = await fetch(url);
    const buf = new Uint8Array(await res.arrayBuffer());
    let s = '';
    const CH = 0x8000;
    for (let i = 0; i < buf.length; i += CH) s += String.fromCharCode.apply(null, buf.subarray(i, i + CH));
    return `data:font/ttf;base64,${btoa(s)}`;
  };
  try {
    const [reg, bold] = await Promise.all([toData(devaRegularUrl), toData(devaBoldUrl)]);
    devaFontCss = `@font-face{font-family:'SSFDevanagari';src:url(${reg}) format('truetype');font-weight:400;font-style:normal;}
      @font-face{font-family:'SSFDevanagari';src:url(${bold}) format('truetype');font-weight:700;font-style:normal;}`;
  } catch {
    devaFontCss = '';
  }
  return devaFontCss;
}

// Resolve which language(s) to render for a row/label.
function pickText(en, hi, lang) {
  if (lang === 'hi') return hi;
  if (lang === 'both') return `${en} <span class="hi-inline">· ${hi}</span>`;
  return en;
}

function buildHtml(lang) {
  const secs = PROFILE_DOC.sections.map((s) => {
    const rows = s.rows.map((r) => {
      const label = pickText(esc(r.l.en), esc(r.l.hi), lang);
      const value = pickText(esc(r.v.en), esc(r.v.hi), lang);
      return `<div class="row">
        <div class="cell-label">${label}</div>
        <div class="cell-value">${value}</div>
      </div>`;
    }).join('');
    return `<section class="sec">
      <div class="sec-head">
        <span class="sec-title">${pickText(esc(s.en), esc(s.hi), lang)}</span>
      </div>
      ${s.intro ? `<p class="sec-intro">${pickText(esc(s.intro.en), esc(s.intro.hi), lang)}</p>` : ''}
      <div class="rows">${rows}</div>
    </section>`;
  }).join('');

  return `
  <div class="doc">
    <header class="cover">
      <div class="cover-band"></div>
      <img class="cover-logo" src="${logoImg}" alt="SSF" />
      <div class="cover-org">${pickText(esc(PROFILE_DOC.org.en), esc(PROFILE_DOC.org.hi), lang)}</div>
      <div class="cover-tag">${pickText(esc(PROFILE_DOC.tagline.en), esc(PROFILE_DOC.tagline.hi), lang)}</div>
      <div class="cover-title">${pickText(esc(PROFILE_DOC.generation.en), esc(PROFILE_DOC.generation.hi), lang)}</div>
      <p class="cover-purpose">${pickText(esc(PROFILE_DOC.purpose.en), esc(PROFILE_DOC.purpose.hi), lang)}</p>
      <div class="cover-code">${esc(PROFILE_DOC.code)}</div>
    </header>
    ${secs}
    <footer class="foot">
      <span>${esc(PROFILE_DOC.org.en)}</span>
      <span>${esc(PROFILE_DOC.code)}</span>
    </footer>
  </div>`;
}

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Mukta:wght@400;600;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .doc {
    width: ${PAGE_W_PX}px; background: #ffffff; color: #1f2937;
    font-family: 'Plus Jakarta Sans', 'SSFDevanagari', 'Mukta', 'Noto Serif Devanagari', system-ui, sans-serif;
    font-size: 13px; line-height: 1.5;
  }
  .hi-inline { color: #64748b; font-family: 'SSFDevanagari', 'Mukta','Noto Serif Devanagari',sans-serif; }
  .cover { position: relative; padding: 0 0 26px; }
  .cover-band { height: 12px; background: linear-gradient(90deg, ${NAVY}, ${ORANGE}); }
  .cover-logo { width: 74px; height: 74px; object-fit: contain; display: block; margin: 22px 0 0 40px; }
  .cover-org { margin: 14px 40px 0; font-size: 27px; font-weight: 800; color: ${NAVY}; line-height: 1.2; }
  .cover-tag { margin: 8px 40px 0; font-size: 13px; font-weight: 700; color: ${ORANGE}; letter-spacing: .02em; }
  .cover-title { margin: 26px 40px 0; padding: 14px 18px; background: ${NAVY}; color: #fff; font-size: 18px; font-weight: 800; border-radius: 10px; }
  .cover-purpose { margin: 14px 40px 0; font-size: 13px; color: #475569; }
  .cover-code { margin: 16px 40px 0; font-family: ui-monospace, monospace; font-size: 11px; color: #94a3b8; }
  .sec { padding: 4px 40px 10px; page-break-inside: auto; }
  .sec-head { margin: 22px 0 8px; border-bottom: 2px solid ${NAVY}; padding-bottom: 6px; }
  .sec-title { font-size: 17px; font-weight: 800; color: ${NAVY}; }
  .sec-intro { font-size: 11.5px; color: #64748b; margin: 6px 0 10px; }
  .rows { display: flex; flex-direction: column; gap: 0; }
  .row { display: flex; gap: 12px; padding: 7px 10px; border-bottom: 1px solid #eef2f7; }
  .row:nth-child(even) { background: #f8fafc; }
  .cell-label { width: 240px; flex: 0 0 240px; font-weight: 700; color: #123b5d; font-size: 12px; }
  .cell-value { flex: 1; color: #334155; font-size: 12.5px; word-break: break-word; }
  .foot { margin: 24px 40px 0; padding-top: 10px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-family: ui-monospace, monospace; }
`;

async function ensureFonts() {
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const faces = [
      "800 20px 'Plus Jakarta Sans'", "400 13px 'Plus Jakarta Sans'",
      "400 13px 'SSFDevanagari'", "700 14px 'SSFDevanagari'",
      "700 14px 'Mukta'", "400 13px 'Mukta'",
      "400 13px 'Noto Serif Devanagari'", "700 14px 'Noto Serif Devanagari'",
    ];
    await Promise.all(faces.map((f) => document.fonts.load(f).catch(() => {})));
  } catch { /* fonts optional */ }
}

function preloadImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  return Promise.all(imgs.map((img) => (img.complete && img.naturalWidth
    ? Promise.resolve()
    : new Promise((res) => { img.onload = img.onerror = () => res(); }))));
}

function sliceToPdf(canvas, pdf, scale) {
  const pageH = Math.round(PAGE_H_PX * scale);
  const total = canvas.height;
  let y = 0;
  let first = true;
  while (y < total) {
    const h = Math.min(pageH, total - y);
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = h;
    const ctx = slice.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
    const img = slice.toDataURL('image/jpeg', 0.94);
    if (!first) pdf.addPage();
    const hMm = (h / scale) * (PAGE_W_MM / PAGE_W_PX);
    pdf.addImage(img, 'JPEG', 0, 0, PAGE_W_MM, hMm, undefined, 'FAST');
    y += h;
    first = false;
  }
}

/** Render the profile HTML to a tall canvas (shared by the PDF builders). */
export async function renderProfileCanvas({ lang = 'both' } = {}) {
  const host = document.createElement('div');
  host.setAttribute('data-ssf-profile', 'pdf');
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${PAGE_W_PX}px;background:#fff;z-index:-1;`;
  const fontCss = await devaFontFaceCss();
  host.innerHTML = `<style>${fontCss}${STYLE}</style>${buildHtml(lang)}`;
  document.body.appendChild(host);
  try {
    await ensureFonts();
    await preloadImages(host);
    return await html2canvas(host, {
      scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false,
      width: PAGE_W_PX, windowWidth: PAGE_W_PX,
    });
  } finally {
    host.remove();
  }
}

/** Render the profile to a jsPDF document (not yet saved). */
export async function buildProfilePdf({ lang = 'both' } = {}) {
  const canvas = await renderProfileCanvas({ lang });
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  sliceToPdf(canvas, pdf, 2);
  // English footer with page numbers (Hindi-safe: numbering has no Devanagari).
  const pages = pdf.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    pdf.setPage(p);
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(8);
    pdf.text(`SSF-IMS · ${p} / ${pages}`, PAGE_W_MM - 10, PAGE_H_MM - 5, { align: 'right' });
  }
  return pdf;
}

/** Build the profile PDF and return a Blob (for preview / upload). */
export async function profilePdfBlob({ lang = 'both' } = {}) {
  const pdf = await buildProfilePdf({ lang });
  return pdf.output('blob');
}

/** True when running on Apple Safari (no native PDF <iframe> rendering). */
function isSafari() {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
}

/**
 * Show the built profile PDF and return a Blob + preview URL.
 * Apple Safari cannot render PDFs in an <iframe>; there we open a new tab so the
 * admin still sees the document.
 */
export async function previewProfilePdf({ lang = 'both' } = {}) {
  const blob = await profilePdfBlob({ lang });
  const url = URL.createObjectURL(blob);
  if (isSafari()) {
    window.open(url, '_blank', 'noopener');
    return { blob, url, opened: true };
  }
  return { blob, url, opened: false };
}

/** Build and trigger a browser download. */
export async function downloadProfilePdf({ lang = 'both', filename } = {}) {
  const pdf = await buildProfilePdf({ lang });
  pdf.save(filename || `ssf-organisation-profile-${lang}-${new Date().toISOString().slice(0, 10)}.pdf`);
  return true;
}
