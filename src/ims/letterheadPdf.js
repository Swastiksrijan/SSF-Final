// SSF-IMS — bilingual official letterhead (लेटरहेड / लेटरपैड).
//
// Any letter the Foundation sends — to a government department, a company, a
// bank, a donor or a member — is written here once and comes out on the
// Foundation's own letterhead, in English, हिंदी or both.
//
// Why the browser paints it: jsPDF has no Indic shaping, so drawing Devanagari
// with jsPDF breaks conjuncts. We lay the letter out as real HTML (the browser
// shapes Devanagari correctly), rasterise the header and the body with
// html2canvas, and assemble A4 pages with jsPDF. The header raster is stamped on
// every page, so a two-page letter still looks like letterhead stationery.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../assets/new-logo.png';
import devaRegularUrl from '../assets/fonts/NotoSansDevanagari-Regular.ttf?url';
import devaBoldUrl from '../assets/fonts/NotoSansDevanagari-Bold.ttf?url';
import { CONTACT_INFO } from '../config/contact';

const NAVY = '#12345A';
const TEAL = '#176447';
const INK = '#26343D';

export const PAGE_W_MM = 210;
export const PAGE_H_MM = 297;
const PAGE_W_PX = 794;                    // A4 @ 96dpi — the width we raster at
const FOOTER_MM = 16;
const MARGIN_MM = 14;
const BODY_BOTTOM_MM = PAGE_H_MM - FOOTER_MM - 4;
// The header/body rasters are laid on the page at MARGIN_MM and carry their own
// 34px inner padding, so page text really starts a little inside the margin.
// The stamped footer uses the same x so the rules and text line up.
const PAD_PX = 34;
const TEXT_X_MM = MARGIN_MM + (PAD_PX / PAGE_W_PX) * (PAGE_W_MM - 2 * MARGIN_MM);

const ORG = {
  en: 'Swastik Srijan Foundation Samiti',
  short: 'Swastik Srijan Foundation',
  shortHi: 'स्वस्तिक सृजन फाउंडेशन',
  hi: 'स्वस्तिक सृजन फाउंडेशन समिति',
  taglineEn: 'Service • Dedication • Creation',
  taglineHi: 'सेवा • समर्पण • सृजन',
  regNo: '05/22/03/11448/13',
  regLineEn: 'Registered under the Madhya Pradesh Societies Registration Act, 1973',
  regLineHi: 'मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973 के अंतर्गत पंजीकृत',
};

export const ADDRESS_LINE = CONTACT_INFO.address.fullRegistered;
export const CONTACT_LINE = `${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.primaryEmail} · swastiksrijan.in`;

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bundled Devanagari face, embedded once, so Hindi shapes offline too.
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
  } catch { devaFontCss = ''; }
  return devaFontCss;
}

const pick = (en, hi, lang) => (lang === 'hi' ? hi : lang === 'both' ? `${en} / ${hi}` : en);

async function ensureFonts() {
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all([
      "700 18px 'Plus Jakarta Sans'", "400 13px 'Plus Jakarta Sans'",
      "400 13px 'SSFDevanagari'", "700 14px 'SSFDevanagari'",
    ].map((f) => document.fonts.load(f).catch(() => {})));
  } catch { /* fonts optional */ }
}

function preloadImages(root) {
  const jobs = Array.from(root.querySelectorAll('img')).map((img) => (img.complete && img.naturalWidth
    ? Promise.resolve()
    : new Promise((res) => { img.onload = img.onerror = () => res(); })));
  return Promise.all(jobs);
}

async function renderHost(html, extraCss) {
  const host = document.createElement('div');
  host.setAttribute('data-ssf-letterhead', 'pdf');
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${PAGE_W_PX}px;background:#fff;z-index:-1;`;
  host.innerHTML = `<style>${await devaFontFaceCss()}${extraCss || BASE_CSS}</style>${html}`;
  document.body.appendChild(host);
  try {
    await ensureFonts();
    await preloadImages(host);
    const canvas = await html2canvas(host, {
      scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false,
      width: PAGE_W_PX, windowWidth: PAGE_W_PX,
    });
    return { canvas, host };
  } catch (e) { host.remove(); throw e; }
}

// ── layout ──────────────────────────────────────────────────────────────────
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .lh {
    width: ${PAGE_W_PX}px; background: #ffffff; color: ${INK};
    font-family: 'Plus Jakarta Sans','SSFDevanagari',system-ui,sans-serif;
    font-size: 12.5px; line-height: 1.6; -webkit-font-smoothing: antialiased;
    position: relative;
  }
  .hi { font-family: 'SSFDevanagari','Mukta',sans-serif; }
  .lh-head {
    position: relative; z-index: 1; padding: 0 34px 0;
    background: linear-gradient(180deg, #f7fafc 0%, #ffffff 88%);
    border-bottom: 1px solid #dbe4ec;
  }
  .lh-accent { height: 5px; margin: 0 -34px 17px; background: linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 72%, ${TEAL} 72%, ${TEAL} 91%, #c6a15b 91%, #c6a15b 100%); }
  .lh-head-top { display: flex; align-items: center; gap: 16px; }
  .lh-logo-wrap { width: 78px; height: 78px; display: grid; place-items: center; flex-shrink: 0; border: 1px solid #dbe4ec; border-radius: 15px; background: #ffffff; box-shadow: 0 3px 12px rgba(18,52,90,.08); }
  .lh-logo { width: 68px; height: 68px; object-fit: contain; }
  .lh-names { flex: 1; min-width: 0; padding-top: 1px; }
  .lh-eyebrow { font-size: 8px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: ${TEAL}; margin-bottom: 5px; }
  .lh-name-en { font-size: 21px; font-weight: 800; color: ${NAVY}; letter-spacing: -.025em; line-height: 1.16; }
  .lh-name-hi { font-size: 15px; font-weight: 700; color: ${NAVY}; margin-top: 4px; line-height: 1.3; }
  .lh-tag { margin-top: 7px; font-size: 8px; font-weight: 700; letter-spacing: .055em; color: ${TEAL}; }
  .lh-right { text-align: right; flex-shrink: 0; width: 150px; padding-left: 12px; border-left: 1px solid #dbe4ec; }
  .lh-right .doc-label { display: inline-block; padding: 5px 7px; border-radius: 4px; background: #eaf3ef; color: ${TEAL}; font-size: 7px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
  .lh-right .kv { margin-top: 7px; font-size: 8.5px; color: ${INK}; line-height: 1.55; }
  .lh-right .kv .k { color: ${NAVY}; font-weight: 800; }
  .lh-legal { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 14px; padding: 9px 0 10px; color: #526477; font-size: 7.5px; line-height: 1.45; }
  .lh-legal-main { flex: 1; min-width: 0; }
  .lh-legal-hi { margin-top: 2px; color: #657587; font-family: 'SSFDevanagari','Mukta',sans-serif; }
  .lh-legal-reg { flex-shrink: 0; text-align: right; color: ${NAVY}; font-size: 8px; font-weight: 800; }
  .lh-rule { height: 3px; background: linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 72%, ${TEAL} 72%, ${TEAL} 91%, #c6a15b 91%, #c6a15b 100%); }
  .lh-rule-thin { height: 1px; background: #e7edf2; }

  .lh-body { position: relative; z-index: 1; padding: 0 34px; }
  .lh-to { margin-top: 2px; font-size: 12px; line-height: 1.65; }
  .lh-to .lbl { font-weight: 800; color: ${NAVY}; }
  .lh-subject { margin-top: 14px; border-left: 4px solid ${TEAL}; padding: 7px 12px; background: #f4f8fb; }
  .lh-subject .lbl { font-size: 9px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: ${TEAL}; }
  .lh-subject .txt { margin-top: 3px; font-size: 13px; font-weight: 700; color: ${NAVY}; line-height: 1.45; }
  .lh-salut { margin-top: 14px; font-size: 12.5px; font-weight: 700; color: ${INK}; }
  .lh-p { margin-top: 9px; font-size: 12.5px; text-align: justify; white-space: pre-wrap; }
  .lh-thanks { margin-top: 16px; font-size: 12.5px; }
  .lh-sign { margin-top: 26px; text-align: right; }
  .lh-sign .for { font-size: 12px; font-weight: 700; color: ${INK}; }
  .lh-sign .nm { margin-top: 30px; font-size: 13px; font-weight: 800; color: ${NAVY}; }
  .lh-sign .desig { font-size: 11px; color: ${INK}; }
  .lh-sign .line { margin: 22px 0 0 auto; width: 210px; border-top: 1px dashed #b9c6d4; }
  .lh-extra { margin-top: 18px; font-size: 11px; }
  .lh-extra .lbl { font-weight: 800; color: ${NAVY}; }

`;

function headerHtml(f = {}) {
  return `<div class="lh-head">
    <div class="lh-accent"></div>
    <div class="lh-head-top">
      <div class="lh-logo-wrap"><img class="lh-logo" src="${logoImg}" alt="SSF" /></div>
      <div class="lh-names">
        <div class="lh-eyebrow">Registered Non-Profit Organisation</div>
        <div class="lh-name-en">${esc(ORG.en)}</div>
        <div class="lh-name-hi hi">${esc(ORG.hi)}</div>
        <div class="lh-tag">${esc(ORG.taglineEn)} &nbsp;•&nbsp; ${esc(ORG.taglineHi)}</div>
      </div>
      <div class="lh-right">
        <div class="doc-label">OFFICIAL CORRESPONDENCE</div>
        <div class="kv"><span class="k">Letter Ref.</span><br/>${esc(f.letterNo || 'To be assigned')}</div>
        <div class="kv"><span class="k">Date</span><br/>${esc(f.date || '')}</div>
      </div>
    </div>
    <div class="lh-legal">
      <div class="lh-legal-main">
        <div>${esc(ORG.regLineEn)}</div>
        <div class="lh-legal-hi">${esc(ORG.regLineHi)}</div>
      </div>
      <div class="lh-legal-reg">REGISTRATION NO.<br/>${esc(ORG.regNo)}</div>
    </div>
    <div class="lh-rule"></div>
    <div class="lh-rule-thin"></div>
  </div>`;
}

/** Full letter body (everything between the header rule and the footer rule). */
function bodyHtml(f, lang) {
  const paragraphs = String(f.body || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const toBlock = [
    f.toName, f.toDesignation, f.toOrg, f.toAddress,
  ].map((v) => String(v || '').trim()).filter(Boolean);
  const salutation = f.salutation || pick('Respected Sir/Madam,', 'आदरणीय महोदय / महोदया,', lang);
  const closing = f.closing || pick('Thank you,', 'धन्यवाद,', lang);

  return `<div class="lh-body">
    ${toBlock.length ? `<div class="lh-to" data-safe>
      <div class="lbl">${pick('To,', 'प्रति,', lang)}</div>
      ${toBlock.map((line) => `<div>${esc(line)}</div>`).join('')}
    </div>` : ''}
    ${f.subject ? `<div class="lh-subject" data-safe>
      <div class="lbl">${pick('Subject', 'विषय', lang)}</div>
      <div class="txt">${esc(f.subject)}</div>
    </div>` : ''}
    <div class="lh-salut" data-safe>${esc(salutation)}</div>
    ${paragraphs.map((p) => `<div class="lh-p" data-safe>${esc(p)}</div>`).join('')}
    <div class="lh-thanks" data-safe>${esc(closing)}</div>
    <div class="lh-sign" data-safe>
      <div class="for">${pick('For', 'हेतु', lang)} ${esc(ORG.en)}</div>
      <div class="line"></div>
      <div class="nm">${esc(f.signatoryName || 'Ramesh Pandey')}</div>
      <div class="desig">${esc(f.signatoryDesignation || pick('Authorised Signatory', 'अधिकृत हस्ताक्षरकर्ता', lang))}</div>
    </div>
    ${f.enclosures ? `<div class="lh-extra" data-safe>
      <span class="lbl">${pick('Enclosures', 'संलग्नक', lang)}:</span> ${esc(f.enclosures)}
    </div>` : ''}
    ${f.cc ? `<div class="lh-extra" data-safe>
      <span class="lbl">${pick('Copy to', 'प्रतिलिपि', lang)}:</span> ${esc(f.cc)}
    </div>` : ''}
  </div>`;
}

function renderBody(f, lang) {
  return `<div class="lh">${bodyHtml(f, lang)}</div>`;
}

/** Render the letterhead header alone, so it can be measured and stamped. */
async function measureHeader(f) {
  const { canvas } = await renderHost(`<div class="lh">${headerHtml(f)}</div>`);
  return canvas;
}

// ── rasterise → A4 pages ────────────────────────────────────────────────────
const pxPerMm = PAGE_W_PX / PAGE_W_MM;

// Logo as a data URL, so the faint watermark can be stamped straight by jsPDF
// (vector placement keeps the PDF small, unlike baking it into every page raster).
let logoDataUrlCache;
async function logoDataUrl() {
  if (logoDataUrlCache !== undefined) return logoDataUrlCache;
  logoDataUrlCache = await new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      res(c.toDataURL('image/png'));
    };
    img.onerror = () => res(null);
    img.src = logoImg;
  });
  return logoDataUrlCache;
}

function safeBoundaries(host, scale) {
  const hostTop = host.getBoundingClientRect().top;
  return Array.from(host.querySelectorAll('[data-safe]'))
    .map((el) => Math.round((el.getBoundingClientRect().top - hostTop) * scale))
    .filter((v) => v > 0)
    .sort((a, b) => a - b);
}

/** Height the header raster occupies once laid on the page (mm). */
function headerHeightMm(headerCanvas) {
  return (PAGE_W_MM - 2 * MARGIN_MM) * (headerCanvas.height / headerCanvas.width);
}

function stampHeader(pdf, headerCanvas) {
  const w = PAGE_W_MM - 2 * MARGIN_MM;
  pdf.addImage(headerCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', MARGIN_MM, MARGIN_MM, w, headerHeightMm(headerCanvas), undefined, 'FAST');
}

function stampFooter(pdf, meta) {
  const y = PAGE_H_MM - FOOTER_MM + 3;
  const xr = PAGE_W_MM - TEXT_X_MM;
  pdf.setDrawColor(213, 222, 232); pdf.setLineWidth(0.2);
  pdf.line(TEXT_X_MM, y, xr, y);
  pdf.setTextColor(91, 107, 122); pdf.setFontSize(6.6);
  pdf.text(`Registered Office: ${ADDRESS_LINE}`, TEXT_X_MM, y + 4);
  pdf.text(`${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.primaryEmail} · swastiksrijan.in`,
    xr, y + 4, { align: 'right' });
  pdf.setTextColor(148, 163, 184); pdf.setFontSize(6.2);
  pdf.text(`Ref. ${meta.letterNo || '—'}  ·  Page ${pdf.internal.getCurrentPageInfo().pageNumber} of ${meta.pageCount}`,
    PAGE_W_MM / 2, y + 8, { align: 'center' });
}

/**
 * Build the letter PDF.
 * @param {object} f    letter fields (letterNo, date, to*, subject, body, signatory*)
 * @param {object} opts { lang: 'en'|'hi'|'both', watermark: boolean }
 * @returns {Promise<jsPDF>}
 */
export async function buildLetterPdf(f, { lang = 'both', watermark = true } = {}) {
  const headerCanvas = await measureHeader(f);
  const body = await renderHost(renderBody(f, lang));
  const watermarkImg = watermark ? await logoDataUrl() : null;
  try {
    const scale = body.canvas.width / PAGE_W_PX;
    const bodyTop = MARGIN_MM + headerHeightMm(headerCanvas) + 4;
    const bodyBottom = PAGE_H_MM - FOOTER_MM - 4;
    const pageContentPx = Math.round((bodyBottom - bodyTop) * pxPerMm * scale);
    const boundaries = [0, ...safeBoundaries(body.host, scale), body.canvas.height];

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    let y = 0; let first = true;
    while (y < body.canvas.height) {
      let end = Math.min(y + pageContentPx, body.canvas.height);
      if (end < body.canvas.height) {
        let best = -1;
        for (const b of boundaries) { if (b > y && b <= end) best = b; else if (b > end) break; }
        if (best > y) end = best;
      }
      const h = end - y;
      const slice = document.createElement('canvas');
      slice.width = body.canvas.width; slice.height = h;
      const sctx = slice.getContext('2d');
      sctx.fillStyle = '#ffffff'; sctx.fillRect(0, 0, slice.width, slice.height);
      sctx.drawImage(body.canvas, 0, y, body.canvas.width, h, 0, 0, body.canvas.width, h);

      if (!first) pdf.addPage();
      first = false;
      if (watermarkImg) {
        const wm = 96;
        pdf.setGState(new pdf.GState({ opacity: 0.06 }));
        pdf.addImage(watermarkImg, 'PNG', (PAGE_W_MM - wm) / 2, (PAGE_H_MM - wm) / 2, wm, wm, undefined, 'FAST');
        pdf.setGState(new pdf.GState({ opacity: 1 }));
      }
      stampHeader(pdf, headerCanvas);
      const hMm = (h / scale) * (PAGE_W_MM / PAGE_W_PX);
      pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG',
        MARGIN_MM, bodyTop, PAGE_W_MM - 2 * MARGIN_MM, hMm, undefined, 'FAST');
      y = end;
    }
    const pages = pdf.internal.getNumberOfPages();
    for (let p = 1; p <= pages; p++) { pdf.setPage(p); stampFooter(pdf, { ...f, pageCount: pages }); }
    pdf.setPage(1);
    return pdf;
  } finally {
    body.host.remove();
  }
}

export async function letterPdfBlob(f, opts) {
  const pdf = await buildLetterPdf(f, opts);
  return pdf.output('blob');
}

export function letterFileName(f, lang) {
  const safe = String(f.letterNo || 'SSF-LETTER').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${safe}-${lang}-${new Date().toISOString().slice(0, 10)}.pdf`;
}

/** Download the letter. */
export async function downloadLetterPdf(f, opts = {}) {
  const pdf = await buildLetterPdf(f, opts);
  pdf.save(letterFileName(f, opts.lang || 'both'));
}

/** Preview: returns a blob URL. Safari cannot render PDF in an iframe. */
export async function previewLetterPdf(f, opts = {}) {
  const blob = await letterPdfBlob(f, opts);
  const url = URL.createObjectURL(blob);
  const ua = navigator.userAgent;
  const safari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
  if (safari) { window.open(url, '_blank', 'noopener'); return { blob, url, opened: true }; }
  return { blob, url, opened: false };
}

/** Open the browser print dialog for the letter (works offline). */
export async function printLetterPdf(f, opts = {}) {
  const blob = await letterPdfBlob(f, opts);
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank', 'noopener');
  if (!w) { URL.revokeObjectURL(url); throw new Error('Popup blocked — allow popups to print.'); }
  const done = () => { try { w.focus(); w.print(); } catch { /* user prints manually */ } };
  if (w.document && w.document.readyState === 'complete') done(); else w.onload = done;
}

/** Plain-text version of the letter, for WhatsApp / clipboard. */
export function letterPlainText(f, lang = 'both') {
  const L = [];
  L.push(ORG.en, ORG.hi);
  L.push(`${ORG.taglineEn} · ${ORG.taglineHi}`);
  L.push(`Reg. No. ${ORG.regNo}`);
  L.push('');
  L.push(`Ref. No.: ${f.letterNo || '—'}`);
  L.push(`Date: ${f.date || ''}`);
  L.push('');
  const to = [f.toName, f.toDesignation, f.toOrg, f.toAddress].map((v) => String(v || '').trim()).filter(Boolean);
  if (to.length) { L.push('To,'); L.push(...to); L.push(''); }
  if (f.subject) L.push(`${pick('Subject', 'विषय', lang)}: ${f.subject}`, '');
  L.push(f.salutation || pick('Respected Sir/Madam,', 'आदरणीय महोदय / महोदया,', lang), '');
  L.push(String(f.body || '').trim(), '');
  L.push(f.closing || pick('Thank you,', 'धन्यवाद,', lang), '');
  L.push(`${pick('For', 'हेतु', lang)} ${ORG.en}`);
  L.push(f.signatoryName || 'Ramesh Pandey');
  L.push(f.signatoryDesignation || pick('Authorised Signatory', 'अधिकृत हस्ताक्षरकर्ता', lang));
  if (f.enclosures) L.push('', `${pick('Enclosures', 'संलग्नक', lang)}: ${f.enclosures}`);
  if (f.cc) L.push(`${pick('Copy to', 'प्रतिलिपि', lang)}: ${f.cc}`);
  L.push('', `${ADDRESS_LINE}`, `${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.primaryEmail} · swastiksrijan.in`);
  return L.join('\n');
}

/**
 * Share the letter: the PDF itself on devices that can take a file (mobile
 * share sheet), otherwise a WhatsApp / e-mail text share.
 */
export async function shareLetterPdf(f, { lang = 'both', via = 'native' } = {}) {
  const text = letterPlainText(f, lang);
  if (via === 'native') {
    try {
      const blob = await letterPdfBlob(f, { lang });
      const file = new File([blob], letterFileName(f, lang), { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: f.subject || 'SSF Letter', text: text.slice(0, 300) });
        return { shared: 'file' };
      }
    } catch { /* fall through to text share */ }
  }
  if (via === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    return { shared: 'whatsapp' };
  }
  if (via === 'email') {
    const subject = f.subject || 'SSF Official Letter';
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    return { shared: 'email' };
  }
  if (navigator.share) { await navigator.share({ title: f.subject || 'SSF Letter', text }); return { shared: 'text' }; }
  await navigator.clipboard.writeText(text);
  return { shared: 'clipboard' };
}

/** Next letter number for the year, e.g. SSF/LTR/2026/0007. */
export function nextLetterNo(existing = [], year = new Date().getFullYear()) {
  const prefix = `SSF/LTR/${year}/`;
  const max = existing
    .map((r) => String((r && r.data && r.data.letterNo) || ''))
    .filter((n) => n.startsWith(prefix))
    .map((n) => parseInt(n.slice(prefix.length), 10) || 0)
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}${String(max + 1).padStart(4, '0')}`;
}

export const LETTERHEAD_ORG = ORG;
