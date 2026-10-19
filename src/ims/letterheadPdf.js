// SSF-IMS — bilingual official letterhead (लेटरहेड / लेटरपैड).
//
// Any letter the Foundation sends — to a government department, a company, a
// bank, a donor or a member — is written once here and comes out on the
// Foundation's own stationery, in English, हिंदी or both.
//
// Why the browser paints it: jsPDF has no Indic shaping, so drawing Devanagari
// with jsPDF breaks conjuncts. We lay the letter out as real HTML (the browser
// shapes Devanagari correctly), rasterise it with html2canvas, and assemble A4
// pages with jsPDF. The masthead is stamped on every page, so a two-page letter
// still reads as letterhead stationery.
//
// Both faces are bundled with the app (no Google Fonts fetch at raster time),
// so Hindi and English shape identically offline and on a network that blocks
// fonts.googleapis.com.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../assets/new-logo.png';
import latinUrl from '../assets/fonts/PlusJakartaSans-Variable.ttf?url';
import devaRegularUrl from '../assets/fonts/NotoSansDevanagari-Regular.ttf?url';
import devaBoldUrl from '../assets/fonts/NotoSansDevanagari-Bold.ttf?url';
import { CONTACT_INFO } from '../config/contact';

const NAVY = '#12345A';
const TEAL = '#176447';
const GOLD = '#C6A04A';
const INK = '#26343D';
const MUTED = '#5B6B7A';
const HAIRLINE = '#D5DEE8';

export const PAGE_W_MM = 210;
export const PAGE_H_MM = 297;
const MARGIN_MM = 14;                     // print margin on every edge
const PAGE_W_PX = 794;                    // A4 @ 96dpi — the raster width, i.e. the full page
// The raster is stamped at the full page width, so its inner padding IS the
// page margin: 14mm at 96dpi. Keeping the two in step is what makes the header,
// body and jsPDF-drawn footer share one left/right edge.
const PAD_PX = Math.round(MARGIN_MM * PAGE_W_PX / PAGE_W_MM);
const FOOTER_MM = 15;
const HEADER_GAP_MM = 5;                  // breathing room between masthead and body
const WATERMARK_OPACITY = 0.09;

const pxPerMm = PAGE_W_PX / PAGE_W_MM;

// Organisation identity. Every line below is attested in the repository:
// name/registration/scope in src/ims/orgProfileData.js, the taglines in
// src/components/Header.jsx and src/components/FloatingTicker.jsx, and the
// office address/contact in src/config/contact.js.
const ORG = {
  en: 'Swastik Srijan Foundation Samiti',
  hi: 'स्वस्तिक सृजन फाउंडेशन समिति',
  taglineHi: 'सेवा • समर्पण • समग्र विकास',
  taglineEn: 'Service • Dedication • Creation',
  identity: 'Registered Society • Established 2013 • Pan-India Presence',
  regNo: '05/22/03/11448/13',
  regDate: '30 December 2013',
  regLineEn: 'Registered under the Madhya Pradesh Societies Registration Act, 1973',
  regLineHi: 'मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973 के अंतर्गत पंजीकृत',
  website: 'www.swastiksrijan.in',
};

export const ADDRESS_LINE = CONTACT_INFO.address.fullRegistered;

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── fonts ───────────────────────────────────────────────────────────────────
let fontCss = null;
async function fontFaceCss() {
  if (fontCss != null) return fontCss;
  const toData = async (url) => {
    const res = await fetch(url);
    const buf = new Uint8Array(await res.arrayBuffer());
    let s = '';
    const CH = 0x8000;
    for (let i = 0; i < buf.length; i += CH) s += String.fromCharCode.apply(null, buf.subarray(i, i + CH));
    return `data:font/ttf;base64,${btoa(s)}`;
  };
  try {
    const [latin, reg, bold] = await Promise.all([toData(latinUrl), toData(devaRegularUrl), toData(devaBoldUrl)]);
    fontCss = `
      @font-face{font-family:'SSFLatin';src:url(${latin}) format('truetype');font-weight:200 800;font-style:normal;}
      @font-face{font-family:'SSFDevanagari';src:url(${reg}) format('truetype');font-weight:400;font-style:normal;}
      @font-face{font-family:'SSFDevanagari';src:url(${bold}) format('truetype');font-weight:700;font-style:normal;}`;
  } catch { fontCss = ''; }
  return fontCss;
}

const pick = (en, hi, lang) => (lang === 'hi' ? hi : lang === 'both' ? `${en} / ${hi}` : en);

async function ensureFonts() {
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all([
      "700 18px 'SSFLatin'", "400 13px 'SSFLatin'",
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

// ── layout ──────────────────────────────────────────────────────────────────
const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .lh {
    width: ${PAGE_W_PX}px; background: #ffffff; color: ${INK};
    font-family: 'SSFLatin', system-ui, sans-serif;
    font-size: 12.5px; line-height: 1.62; -webkit-font-smoothing: antialiased;
    position: relative;
  }
  .hi { font-family: 'SSFDevanagari', sans-serif; }

  /* ---- masthead ---- */
  .lh-head { position: relative; z-index: 1; padding: 0 ${PAD_PX}px; }
  .lh-accent { height: 3px; background: linear-gradient(90deg, ${NAVY} 0 58%, ${TEAL} 58% 86%, ${GOLD} 86% 100%); }
  .lh-head-top { display: flex; align-items: center; gap: 16px; padding: 15px 0 12px; }
  .lh-logo-wrap {
    width: 76px; height: 76px; flex-shrink: 0; display: grid; place-items: center;
    border: 1px solid ${HAIRLINE}; border-radius: 50%; background: #ffffff;
  }
  .lh-logo { width: 62px; height: auto; display: block; }
  .lh-names { flex: 1; min-width: 0; }
  .lh-identity { font-size: 7.2px; font-weight: 700; letter-spacing: .19em; text-transform: uppercase; color: ${TEAL}; }
  .lh-name-en { margin-top: 5px; font-size: 21.5px; font-weight: 800; color: ${NAVY}; letter-spacing: -.015em; line-height: 1.12; }
  .lh-name-hi { margin-top: 3px; font-size: 15px; font-weight: 700; color: ${NAVY}; line-height: 1.32; }
  .lh-tag { margin-top: 6px; font-size: 8.4px; font-weight: 700; color: ${TEAL}; letter-spacing: .04em; }
  .lh-tag .en { color: ${MUTED}; font-weight: 600; }

  .lh-ref {
    flex-shrink: 0; width: 152px; padding-left: 14px; margin-left: 2px;
    border-left: 1px solid ${HAIRLINE}; text-align: right;
  }
  .lh-ref .cap { font-size: 7px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: ${MUTED}; }
  .lh-ref .row { margin-top: 7px; }
  .lh-ref .k { font-size: 7px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: ${TEAL}; }
  .lh-ref .v { margin-top: 1px; font-size: 10px; font-weight: 700; color: ${NAVY}; word-break: break-word; }

  .lh-rule { height: 2px; background: linear-gradient(90deg, ${NAVY} 0 58%, ${TEAL} 58% 86%, ${GOLD} 86% 100%); }
  .lh-legal {
    display: flex; justify-content: space-between; align-items: baseline; gap: 18px;
    padding: 7px 0 8px; color: ${MUTED}; font-size: 7.4px; line-height: 1.5;
  }
  .lh-legal-hi { margin-top: 2px; color: #71818F; }
  .lh-legal-reg { flex-shrink: 0; text-align: right; color: ${NAVY}; font-size: 7.6px; font-weight: 800; }
  .lh-legal-reg .sub { color: ${MUTED}; font-weight: 600; }
  .lh-rule-thin { height: 1px; background: #EAF0F6; }

  /* ---- body ---- */
  .lh-body { position: relative; z-index: 1; padding: 0 ${PAD_PX}px; }
  .lh-meta { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
  .lh-to { font-size: 12px; line-height: 1.62; }
  .lh-to .lbl { font-weight: 800; color: ${NAVY}; }
  .lh-fields { flex-shrink: 0; text-align: right; font-size: 11px; line-height: 1.6; }
  .lh-fields .k { font-weight: 800; color: ${NAVY}; }
  .lh-fields .fill { display: inline-block; min-width: 132px; border-bottom: 1px dotted #9FB0C0; padding-bottom: 1px; color: ${INK}; font-weight: 600; }

  .lh-subject { margin-top: 15px; padding: 8px 12px; background: #F4F8FB; border-left: 4px solid ${TEAL}; }
  .lh-subject .lbl { font-size: 8.6px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: ${TEAL}; }
  .lh-subject .txt { margin-top: 3px; font-size: 13px; font-weight: 700; color: ${NAVY}; line-height: 1.45; }

  .lh-salut { margin-top: 15px; font-size: 12.5px; font-weight: 700; color: ${INK}; }
  .lh-p { margin-top: 9px; font-size: 12.5px; text-align: justify; white-space: pre-wrap; }
  .lh-thanks { margin-top: 16px; font-size: 12.5px; }

  .lh-sign { margin-top: 26px; text-align: right; }
  .lh-sign .for { font-size: 12px; font-weight: 700; color: ${INK}; }
  .lh-sign .nm { margin-top: 32px; font-size: 13px; font-weight: 800; color: ${NAVY}; }
  .lh-sign .desig { font-size: 11px; color: ${INK}; }
  .lh-sign .line { margin: 24px 0 0 auto; width: 208px; border-top: 1px dashed #B9C6D4; }

  .lh-extra { margin-top: 16px; font-size: 11px; line-height: 1.55; }
  .lh-extra .lbl { font-weight: 800; color: ${NAVY}; }

  /* ---- footer (only used by the live HTML preview; the PDF stamps its own) ---- */
  .lh-foot { margin-top: 18px; padding: 0 ${PAD_PX}px; }
  .lh-foot .rule { height: 1px; background: ${HAIRLINE}; }
  .lh-foot .grid { display: flex; justify-content: space-between; gap: 18px; padding-top: 4px; font-size: 7.6px; color: ${MUTED}; line-height: 1.45; }
  .lh-foot .grid .right { text-align: right; flex-shrink: 0; }
  .lh-foot .pageno { margin-top: 3px; text-align: center; font-size: 7.2px; color: #94A3B8; }
`;

function headerHtml(f = {}) {
  return `<div class="lh-head">
    <div class="lh-accent"></div>
    <div class="lh-head-top">
      <div class="lh-logo-wrap"><img class="lh-logo" src="${logoImg}" alt="Swastik Srijan Foundation Samiti" /></div>
      <div class="lh-names">
        <div class="lh-identity">${esc(ORG.identity)}</div>
        <div class="lh-name-en">${esc(ORG.en)}</div>
        <div class="lh-name-hi hi">${esc(ORG.hi)}</div>
        <div class="lh-tag hi">${esc(ORG.taglineHi)} <span class="en">• ${esc(ORG.taglineEn)}</span></div>
      </div>
      <div class="lh-ref">
        <div class="cap">Official Correspondence</div>
        <div class="row"><div class="k">Ref. No.</div><div class="v">${esc(f.letterNo || 'To be assigned')}</div></div>
        <div class="row"><div class="k">Date</div><div class="v">${esc(f.date || '')}</div></div>
      </div>
    </div>
    <div class="lh-rule"></div>
    <div class="lh-legal">
      <div class="lh-legal-main">
        <div>${esc(ORG.regLineEn)}</div>
        <div class="lh-legal-hi hi">${esc(ORG.regLineHi)}</div>
      </div>
      <div class="lh-legal-reg">REGN. NO. ${esc(ORG.regNo)}<br/><span class="sub">Registered ${esc(ORG.regDate)}</span></div>
    </div>
    <div class="lh-rule-thin"></div>
  </div>`;
}

function bodyHtml(f, lang) {
  const paragraphs = String(f.body || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const toBlock = [f.toName, f.toDesignation, f.toOrg, f.toAddress]
    .map((v) => String(v || '').trim()).filter(Boolean);
  const salutation = f.salutation || pick('Respected Sir/Madam,', 'आदरणीय महोदय / महोदया,', lang);
  const closing = f.closing || pick('Thank you,', 'धन्यवाद,', lang);
  const refLine = String(f.letterNo || '').trim();
  const dateLine = String(f.date || '').trim();

  return `<div class="lh-body">
    ${(toBlock.length || refLine || dateLine) ? `<div class="lh-meta" data-safe>
      ${toBlock.length ? `<div class="lh-to">
        <div class="lbl">${pick('To,', 'प्रति,', lang)}</div>
        ${toBlock.map((line) => `<div>${esc(line)}</div>`).join('')}
      </div>` : '<div class="lh-to"></div>'}
      <div class="lh-fields">
        <div><span class="k">Ref. No.:</span> <span class="fill">${esc(refLine || '—')}</span></div>
        <div><span class="k">${pick('Date', 'दिनांक', lang)}:</span> <span class="fill">${esc(dateLine || '—')}</span></div>
      </div>
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
      <div class="nm">${esc(f.signatoryName || '')}</div>
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

function footerHtml(f, page, pages) {
  return `<div class="lh-foot">
    <div class="rule"></div>
    <div class="grid">
      <div>Registered Office: ${esc(ADDRESS_LINE)}</div>
      <div class="right">${esc(CONTACT_INFO.phones.primaryFormatted)} · ${esc(CONTACT_INFO.primaryEmail)}<br/>${esc(ORG.website)}</div>
    </div>
    <div class="pageno">Ref. ${esc(f.letterNo || '—')} &nbsp;·&nbsp; Page ${page} of ${pages}</div>
  </div>`;
}

/** Standalone HTML document of one A4 sheet — used for the live on-screen preview. */
export async function letterheadPreviewHtml(f, { lang = 'both', watermark = true } = {}) {
  const logo = watermark ? await logoDataUrl() : null;
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"/>
<title>${esc(f.letterNo || 'SSF Letterhead')}</title>
<style>${await fontFaceCss()}
  html,body{margin:0;padding:0;background:#8a97a3;}
  /* The preview mirrors the PDF sheet: masthead pinned to the top margin,
     footer pinned to the bottom margin, body flowing in between. */
  .sheet{position:relative;width:${PAGE_W_MM}mm;height:${PAGE_H_MM}mm;margin:0 auto;background:#fff;overflow:hidden;}
  .sheet .mark{position:absolute;left:50%;top:50%;width:112mm;height:112mm;margin:-56mm 0 0 -56mm;opacity:${WATERMARK_OPACITY};pointer-events:none;}
  .sheet .inner{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;
    padding:${MARGIN_MM}mm 0 ${FOOTER_MM - 9}mm;}
  .sheet .lh{flex:1;display:flex;flex-direction:column;min-height:0;}
  .sheet .lh-foot{margin-top:auto;}
  @media print{@page{size:A4;margin:0}html,body{background:#fff}.sheet{margin:0}}
  ${BASE_CSS}
</style></head><body>
  <div class="sheet">
    ${logo ? `<img class="mark" src="${logo}" alt=""/>` : ''}
    <div class="inner">
      <div class="lh">${headerHtml(f)}${bodyHtml(f, lang)}${footerHtml(f, 1, 1)}</div>
    </div>
  </div>
</body></html>`;
}

// ── rasterise → A4 pages ────────────────────────────────────────────────────
let logoImagePromise;
/** The logo as a decoded image element (canvas drawImage cannot take a URL). */
function logoImage() {
  if (!logoImagePromise) {
    logoImagePromise = new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = logoImg;
    });
  }
  return logoImagePromise;
}

let logoDataUrlCache;
/** The logo as a PNG data URL, for stamping into a standalone HTML preview. */
async function logoDataUrl() {
  if (logoDataUrlCache !== undefined) return logoDataUrlCache;
  const img = await logoImage();
  if (!img) { logoDataUrlCache = null; return null; }
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  c.getContext('2d').drawImage(img, 0, 0);
  logoDataUrlCache = c.toDataURL('image/png');
  return logoDataUrlCache;
}

async function renderHost(html, { transparent = false, minHeightPx = 0 } = {}) {
  const host = document.createElement('div');
  host.setAttribute('data-ssf-letterhead', 'pdf');
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${PAGE_W_PX}px;z-index:-1;`;
  // The body raster must stay transparent so the watermark drawn underneath it
  // shows through between the lines of text, and it is given the full writing
  // height so the watermark sits at the centre of the page rather than of
  // however much text happens to be written.
  const extra = transparent
    ? `.lh{background:transparent${minHeightPx ? `;min-height:${minHeightPx}px` : ''}}`
    : '';
  host.innerHTML = `<style>${await fontFaceCss()}${BASE_CSS}${extra}</style>${html}`;
  document.body.appendChild(host);
  try {
    await ensureFonts();
    await preloadImages(host);
    const canvas = await html2canvas(host, {
      scale: 2, backgroundColor: transparent ? null : '#ffffff', useCORS: true, logging: false,
      width: PAGE_W_PX, windowWidth: PAGE_W_PX,
    });
    return { canvas, host };
  } catch (e) { host.remove(); throw e; }
}

/** Render the masthead alone, so it can be measured once and stamped per page. */
async function measureHeader(f) {
  const { canvas, host } = await renderHost(`<div class="lh">${headerHtml(f)}</div>`);
  host.remove();
  return canvas;
}

function safeBoundaries(host, scale) {
  const hostTop = host.getBoundingClientRect().top;
  return Array.from(host.querySelectorAll('[data-safe]'))
    .map((el) => Math.round((el.getBoundingClientRect().top - hostTop) * scale))
    .filter((v) => v > 0)
    .sort((a, b) => a - b);
}

const headerHeightMm = (headerCanvas) => (PAGE_W_MM) * (headerCanvas.height / headerCanvas.width);

function stampHeader(pdf, headerCanvas) {
  pdf.addImage(headerCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, MARGIN_MM, PAGE_W_MM, headerHeightMm(headerCanvas), undefined, 'FAST');
}

function stampFooter(pdf, meta) {
  const y = PAGE_H_MM - FOOTER_MM;
  const xr = PAGE_W_MM - MARGIN_MM;
  pdf.setDrawColor(213, 222, 232); pdf.setLineWidth(0.2);
  pdf.line(MARGIN_MM, y, xr, y);
  pdf.setTextColor(91, 107, 122); pdf.setFontSize(6.4);
  pdf.text(`Registered Office: ${ADDRESS_LINE}`, MARGIN_MM, y + 4.2);
  pdf.text(`${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.primaryEmail} · ${ORG.website}`,
    xr, y + 4.2, { align: 'right' });
  pdf.setTextColor(148, 163, 184); pdf.setFontSize(6);
  pdf.text(`Ref. ${meta.letterNo || '—'}  ·  Page ${pdf.internal.getCurrentPageInfo().pageNumber} of ${meta.pageCount}`,
    PAGE_W_MM / 2, y + 8.4, { align: 'center' });
}

/**
 * Build the letter PDF.
 * @param {object} f    letter fields (letterNo, date, to*, subject, body, signatory*)
 * @param {object} opts { lang: 'en'|'hi'|'both', watermark: boolean }
 * @returns {Promise<jsPDF>}
 */
export async function buildLetterPdf(f, { lang = 'both', watermark = true } = {}) {
  const headerCanvas = await measureHeader(f);
  const headerH = headerHeightMm(headerCanvas);
  const bodyTop = MARGIN_MM + headerH + HEADER_GAP_MM;
  const bodyBottom = PAGE_H_MM - FOOTER_MM - 4;
  const writingPx = Math.round((bodyBottom - bodyTop) * pxPerMm);
  // The body raster is transparent so the watermark, drawn underneath it, stays
  // visible between the lines of text instead of being painted over by a white
  // background (which is what hid the watermark in the previous layout).
  const body = await renderHost(`<div class="lh">${bodyHtml(f, lang)}</div>`, {
    transparent: true, minHeightPx: writingPx,
  });
  const watermarkImg = watermark ? await logoImage() : null;
  try {
    const scale = body.canvas.width / PAGE_W_PX;
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
      if (watermarkImg) {
        const size = 112 * pxPerMm * scale;
        sctx.globalAlpha = WATERMARK_OPACITY;
        sctx.drawImage(watermarkImg, (slice.width - size) / 2, (slice.height - size) / 2, size, size);
        sctx.globalAlpha = 1;
      }
      sctx.drawImage(body.canvas, 0, y, body.canvas.width, h, 0, 0, body.canvas.width, h);

      if (!first) pdf.addPage();
      first = false;
      stampHeader(pdf, headerCanvas);
      const hMm = (h / scale) * (PAGE_W_MM / PAGE_W_PX);
      pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', 0, bodyTop, PAGE_W_MM, hMm, undefined, 'FAST');
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
  L.push(`${ORG.taglineHi} · ${ORG.taglineEn}`);
  L.push(`Regn. No. ${ORG.regNo} · Registered ${ORG.regDate}`);
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
  if (f.signatoryName) L.push(f.signatoryName);
  L.push(f.signatoryDesignation || pick('Authorised Signatory', 'अधिकृत हस्ताक्षरकर्ता', lang));
  if (f.enclosures) L.push('', `${pick('Enclosures', 'संलग्नक', lang)}: ${f.enclosures}`);
  if (f.cc) L.push(`${pick('Copy to', 'प्रतिलिपि', lang)}: ${f.cc}`);
  L.push('', `Registered Office: ${ADDRESS_LINE}`,
    `${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.primaryEmail} · ${ORG.website}`);
  return L.join('\n');
}

/** Share the letter: the PDF itself on devices that can take a file, else text. */
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

/**
 * Suggested next letter reference, e.g. SSF/LTR/2026/0007, derived from the
 * letters already stored in the IMS Documents register.
 *
 * This is a *suggestion* only. The collision-proof identity of a saved letter is
 * the permanent recordId the server issues atomically at save time
 * (see `documentId` in ImsLetterhead), because the register's own ID sequence is
 * row-locked and cannot hand the same number to two concurrent saves. A number
 * typed here by hand can still be edited freely by the admin.
 */
export function nextLetterNo(existing = [], year = new Date().getFullYear()) {
  const prefix = `SSF/LTR/${year}/`;
  const max = existing
    .map((r) => {
      const d = (r && r.data) || {};
      return String(d.letterNo || r.letterNo || '');
    })
    .filter((n) => n.startsWith(prefix))
    .map((n) => parseInt(n.slice(prefix.length), 10) || 0)
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}${String(max + 1).padStart(4, '0')}`;
}

export const LETTERHEAD_ORG = ORG;
export const LETTERHEAD_LAYOUT = { PAGE_W_MM, PAGE_H_MM, MARGIN_MM, FOOTER_MM, PAD_PX, PAGE_W_PX, pxPerMm };
