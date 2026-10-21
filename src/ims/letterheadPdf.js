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
//
// Print geometry, all in millimetres on a true A4 sheet. The sheet is a
// *letterpad*, not a blank page with a heading: a double-rule frame encloses
// the whole page on every sheet, and the masthead, writing area and footer all
// sit inside it.
//
//   0 ─────────────────────────────────────────────── top of paper
//    9   frame: outer navy hairline (+ corner studs), inner gold hairline at 10.6
//   18   masthead accent band, then the header block (identity + Ref. No./Date)
//   ~60  writing area begins (To, Subject, body, signature)
//   268  footer rule (Registered Office · contact · page)
//   286  frame's inner rule
//   297 ─────────────────────────────────────────────── bottom of paper
//
// The body is rasterised with a transparent background and stamped as PNG, so
// the watermark drawn underneath it stays visible between the lines of text.
// Stamping it as JPEG (as an earlier revision did) painted an opaque white
// block over the watermark and erased it.

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../assets/new-logo.png';
import signatureImg from '../assets/brand/signature-secretary.png';
import sealImg from '../assets/brand/seal-sanstha.png';
import latinUrl from '../assets/fonts/PlusJakartaSans-Variable.ttf?url';
import devaRegularUrl from '../assets/fonts/NotoSansDevanagari-Regular.ttf?url';
import devaBoldUrl from '../assets/fonts/NotoSansDevanagari-Bold.ttf?url';
import { CONTACT_INFO } from '../config/contact';

// The Foundation holds a scanned signature for one signatory only. Printing it
// under another person's name would be a forged signature, so the renderer
// paints it only when the selected signatory matches the scan's owner.
export const SIGNATURE_HOLDER = 'Amit Kumar Pandey';

function hasSignatureScan(f) {
  if (f.signature === false) return false;
  return !f.signatoryName || f.signatoryName.trim() === SIGNATURE_HOLDER;
}

// Palette: the approved SSF brand tokens declared in src/index.css `:root`
// (--ssf-navy, --ssf-green, --ssf-ivory, --ssf-soft-blue, --ssf-charcoal,
// --ssf-gold), reused verbatim so the stationery matches the website.
const NAVY = '#12345A';
const TEAL = '#176447';
const GOLD = '#F7A814';
const INK = '#26343D';
const MUTED = '#5B6B7A';
const HAIRLINE = '#D5DEE8';
const SOFT_BLUE = '#EAF0F6';

export const PAGE_W_MM = 210;
export const PAGE_H_MM = 297;
const MARGIN_MM = 18;                     // print margin on every edge
const PAGE_W_PX = 794;                    // A4 @ 96dpi — the raster width, i.e. the full page
// The raster is stamped at the full page width, so its inner padding IS the
// page margin: 18mm at 96dpi. Keeping the two in step is what makes the header,
// body and jsPDF-drawn footer share one left/right edge.
const PAD_PX = Math.round(MARGIN_MM * PAGE_W_PX / PAGE_W_MM);
// The letterpad frame. `FRAME_MM` is the outer rule's inset from the paper
// edge; the gold rule sits `FRAME_RULE_MM` further in, and a small navy stud is
// centred on each corner of the outer rule. Content is inset by MARGIN_MM, so
// it clears the inner gold rule by ~7.4mm.
const FRAME_MM = 9;
const FRAME_RULE_MM = 1.6;
const FRAME_STUD_MM = 1.8;
const FOOTER_RULE_MM = 268;               // footer rule, measured from the paper top
const FOOTER_MM = PAGE_H_MM - FOOTER_RULE_MM;   // jsPDF draws the footer from the bottom
const FOOTER_GAP_MM = 4;                  // clearance between the last body line and the rule
const BODY_BOTTOM_MM = FOOTER_RULE_MM - FOOTER_GAP_MM;
const HEADER_GAP_MM = 5;                  // breathing room between masthead and body
const WATERMARK_OPACITY = 0.055;          // faint enough to survive B/W photocopying
const WATERMARK_MM = 118;                 // watermark size, centred on the page

const pxPerMm = PAGE_W_PX / PAGE_W_MM;

// Organisation identity. Every line below is attested in the repository:
// name/registration/scope in src/ims/orgProfileData.js and
// src/pages/RegistrationDetails.jsx, the taglines in src/components/Header.jsx
// and src/components/FloatingTicker.jsx, and the office address/contact in
// src/config/contact.js. Nothing here is invented.
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
    font-size: 12.4px; line-height: 1.6; -webkit-font-smoothing: antialiased;
    position: relative;
  }
  .hi { font-family: 'SSFDevanagari', sans-serif; }

  /* ---- masthead ------------------------------------------------------- */
  .lh-head { position: relative; z-index: 1; padding: 0 ${PAD_PX}px; }
  /* The tri-band is the Foundation's institutional mark: navy (the
     organisation), green (its service work) and a narrow gold rule (the
     accent). It reads as one deliberate device rather than decoration. */
  .lh-accent { height: 2.6px; background: linear-gradient(90deg, ${NAVY} 0 62%, ${TEAL} 62% 88%, ${GOLD} 88% 100%); }

  .lh-head-top { display: flex; align-items: center; gap: 17px; padding: 15px 0 13px; }

  /* Double-ring seal around the emblem — an outer navy hairline and an inner
     gold hairline, the conventional way a registered society presents its
     mark on official stationery. Both rings are real borders on nested
     elements, not box-shadow: html2canvas does not rasterise box-shadow, so
     an inset ring silently disappeared from the printed PDF. */
  .lh-seal {
    flex-shrink: 0; width: 76px; height: 76px; padding: 3px;
    display: grid; place-items: center;
    border: 1px solid rgba(18,52,90,.26); border-radius: 50%; background: #ffffff;
  }
  .lh-seal-inner {
    width: 100%; height: 100%; display: grid; place-items: center;
    border: 1px solid rgba(247,168,20,.7); border-radius: 50%;
  }
  .lh-logo { width: 58px; height: auto; display: block; }

  .lh-names { flex: 1; min-width: 0; }
  .lh-identity { display: flex; align-items: center; gap: 7px; }
  .lh-identity .dash { width: 16px; height: 2px; background: ${GOLD}; flex-shrink: 0; }
  .lh-identity .txt { font-size: 7.1px; font-weight: 800; letter-spacing: .17em; text-transform: uppercase; color: ${TEAL}; }
  .lh-name-en { margin-top: 6px; font-size: 21.5px; font-weight: 800; color: ${NAVY}; letter-spacing: -.015em; line-height: 1.1; }
  .lh-name-hi { margin-top: 4px; font-size: 15px; font-weight: 700; color: ${NAVY}; line-height: 1.3; }
  .lh-tag { margin-top: 7px; font-size: 8.3px; font-weight: 700; color: ${TEAL}; letter-spacing: .03em; }
  .lh-tag .sep { color: ${GOLD}; padding: 0 5px; }
  .lh-tag .en { color: ${MUTED}; font-weight: 600; }

  .lh-ref {
    flex-shrink: 0; width: 156px; padding-left: 15px;
    border-left: 1px solid ${HAIRLINE}; text-align: right;
  }
  .lh-ref .cap { font-size: 7px; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; color: ${MUTED}; }
  .lh-ref .row { margin-top: 8px; }
  .lh-ref .k { font-size: 7px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; color: ${TEAL}; }
  .lh-ref .v { margin-top: 2px; font-size: 10px; font-weight: 700; color: ${NAVY}; word-break: break-word; }

  /* Two-tone double rule closing the masthead. */
  .lh-rule { height: 1.6px; background: ${NAVY}; }
  .lh-rule-gold { height: 0.7px; background: ${GOLD}; }

  .lh-legal {
    display: flex; justify-content: space-between; align-items: baseline; gap: 18px;
    padding: 7px 0 8px; color: ${MUTED}; font-size: 7.3px; line-height: 1.5;
  }
  .lh-legal-hi { margin-top: 2px; color: #71818F; }
  .lh-legal-reg { flex-shrink: 0; text-align: right; color: ${NAVY}; font-size: 7.5px; font-weight: 800; letter-spacing: .04em; }
  .lh-legal-reg .sub { color: ${MUTED}; font-weight: 600; letter-spacing: 0; }
  .lh-rule-thin { height: 1px; background: ${SOFT_BLUE}; }

  /* ---- body ----------------------------------------------------------- */
  /* Flex column, not block: a block child's margin-top would collapse out of
     .lh and inflate the raster height, pushing a letter that fits onto a
     spurious second page. Which block is first varies (To, Subject or the
     salutation, depending on what the composer filled in), so containing the
     collapse here fixes it for every shape of letter at once. */
  .lh-body { position: relative; z-index: 1; display: flex; flex-direction: column; padding: 0 ${PAD_PX}px; }
  .lh-to { font-size: 12px; line-height: 1.6; }
  .lh-to .lbl { font-weight: 800; color: ${NAVY}; }

  .lh-subject { margin-top: 15px; padding: 8px 12px; background: #F5F8FB; border-left: 3px solid ${NAVY}; border-top: 1px solid ${SOFT_BLUE}; border-right: 1px solid ${SOFT_BLUE}; border-bottom: 1px solid ${SOFT_BLUE}; }
  .lh-subject .lbl { font-size: 8.5px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: ${TEAL}; }
  .lh-subject .txt { margin-top: 3px; font-size: 13px; font-weight: 700; color: ${NAVY}; line-height: 1.45; }

  .lh-salut { margin-top: 15px; font-size: 12.4px; font-weight: 700; color: ${INK}; }
  .lh-p { margin-top: 9px; font-size: 12.4px; text-align: justify; white-space: pre-wrap; }
  .lh-thanks { margin-top: 16px; font-size: 12.4px; }

  .lh-sign { margin-top: 26px; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
  .lh-sign-col { text-align: right; margin-left: auto; }
  .lh-sign .for { font-size: 12px; font-weight: 700; color: ${INK}; }
  /* The scanned signature sits above the name, the way it is written on paper.
     The dashed rule stays underneath as the signing line. */
  .lh-sign .sig { height: 34px; width: auto; margin: 8px 2px 0 auto; display: block; }
  .lh-sign .line { margin: 2px 0 0 auto; width: 208px; border-top: 1px dashed #B9C6D4; }
  /* Organisation seal, bottom-left of the signing block. */
  .lh-sign .seal { width: 88px; height: auto; opacity: .88; flex-shrink: 0; }
  .lh-sign .nm { margin-top: 5px; font-size: 13px; font-weight: 800; color: ${NAVY}; }
  .lh-sign .desig { font-size: 11px; color: ${INK}; }

  .lh-extra { margin-top: 16px; font-size: 11px; line-height: 1.55; }
  .lh-extra .lbl { font-weight: 800; color: ${NAVY}; }

  /* ---- footer (live HTML preview only; the PDF stamps its own) --------- */
  /* Spacing mirrors stampFooter's millimetre offsets (rule, then text at
     +4.4mm / +8.3mm / +12.6mm) so the preview's footer sits where the PDF's
     does instead of a few millimetres higher. */
  .lh-foot { margin-top: 18px; padding: 0 ${PAD_PX}px; }
  .lh-foot .rule { position: relative; height: 1px; background: ${HAIRLINE}; }
  .lh-foot .rule::before { content: ''; position: absolute; left: 0; top: 0; width: 34px; height: 1px; background: ${GOLD}; }
  .lh-foot .grid { display: flex; justify-content: space-between; gap: 18px; padding-top: 3.3mm; font-size: 7.4px; color: ${MUTED}; line-height: 1.5; }
  .lh-foot .grid .right { text-align: right; flex-shrink: 0; }
  .lh-foot .grid .right .site { color: ${NAVY}; font-weight: 700; }
  .lh-foot .pageno { margin-top: 2.1mm; text-align: center; font-size: 7.2px; color: #94A3B8; }

  /* ---- letterpad frame ------------------------------------------------ */
  /* The device that makes this stationery read as a *pad* rather than a page
     with a heading: a navy hairline enclosing the sheet, an inset gold
     hairline, and a navy stud centred on each corner. Drawn as four 1px
     absolutely-positioned rules per ring (plus four studs) instead of one
     bordered box, because html2canvas rasterises the rules pixel-perfectly
     while a bordered element can land on a half-pixel and come out grey. */
  .lh-frame { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 3; }
  .lh-frame i { position: absolute; display: block; background: ${NAVY}; }
  .lh-frame i.outer-h { left: ${FRAME_MM}mm; right: ${FRAME_MM}mm; height: 1px; }
  .lh-frame i.outer-v { top: ${FRAME_MM}mm; bottom: ${FRAME_MM}mm; width: 1px; }
  .lh-frame i.gold-h { left: ${FRAME_MM + FRAME_RULE_MM}mm; right: ${FRAME_MM + FRAME_RULE_MM}mm; height: 1px; background: ${GOLD}; opacity: .85; }
  .lh-frame i.gold-v { top: ${FRAME_MM + FRAME_RULE_MM}mm; bottom: ${FRAME_MM + FRAME_RULE_MM}mm; width: 1px; background: ${GOLD}; opacity: .85; }
  .lh-frame i.stud { width: ${FRAME_STUD_MM}mm; height: ${FRAME_STUD_MM}mm; margin: -${FRAME_STUD_MM / 2}mm 0 0 -${FRAME_STUD_MM / 2}mm; }
`;

/** The letterpad's enclosing double rule with a stud on each corner.
 *  Millimetre literals rather than calc(): html2canvas resolves neither `inset`
 *  nor `calc(100% - 9mm)`, and the sheet is a known 210 × 297mm. */
function frameHtml() {
  const s = FRAME_MM; const g = FRAME_MM + FRAME_RULE_MM;
  const R = PAGE_W_MM - s; const B = PAGE_H_MM - s;
  const studs = [[s, s], [R, s], [s, B], [R, B]]
    .map(([x, y]) => `<i class="stud" style="left:${x}mm;top:${y}mm"></i>`).join('');
  return `<div class="lh-frame">
    <i class="outer-h" style="top:${s}mm"></i>
    <i class="outer-h" style="bottom:${s}mm"></i>
    <i class="outer-v" style="left:${s}mm"></i>
    <i class="outer-v" style="right:${s}mm"></i>
    <i class="gold-h" style="top:${g}mm"></i>
    <i class="gold-h" style="bottom:${g}mm"></i>
    <i class="gold-v" style="left:${g}mm"></i>
    <i class="gold-v" style="right:${g}mm"></i>
    ${studs}
  </div>`;
}

function headerHtml(f = {}) {
  return `<div class="lh-head">
    <div class="lh-accent"></div>
    <div class="lh-head-top">
      <div class="lh-seal"><div class="lh-seal-inner"><img class="lh-logo" src="${logoImg}" alt="Swastik Srijan Foundation Samiti" /></div></div>
      <div class="lh-names">
        <div class="lh-identity"><span class="dash"></span><span class="txt">${esc(ORG.identity)}</span></div>
        <div class="lh-name-en">${esc(ORG.en)}</div>
        <div class="lh-name-hi hi">${esc(ORG.hi)}</div>
        <div class="lh-tag hi">${esc(ORG.taglineHi)}<span class="sep">•</span><span class="en">${esc(ORG.taglineEn)}</span></div>
      </div>
      <div class="lh-ref">
        <div class="cap">Official Correspondence</div>
        <div class="row"><div class="k">Ref. No.</div><div class="v">${esc(f.letterNo || 'To be assigned')}</div></div>
        <div class="row"><div class="k">Date</div><div class="v">${esc(f.date || '')}</div></div>
      </div>
    </div>
    <div class="lh-rule"></div>
    <div class="lh-rule-gold"></div>
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

  // Ref. No. and Date live once, in the masthead's right-hand column. They are
  // deliberately not repeated here: printing them twice on one sheet reads as a
  // layout mistake on formal stationery.
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
      ${f.seal === false ? '' : `<img class="seal" src="${sealImg}" alt="Organisation seal" />`}
      <div class="lh-sign-col">
        <div class="for">${pick('For', 'हेतु', lang)} ${esc(ORG.en)}</div>
        ${hasSignatureScan(f) ? `<img class="sig" src="${signatureImg}" alt="Signature" data-signature-img />` : ''}
        <div class="line"></div>
        <div class="nm">${esc(f.signatoryName || '')}</div>
        <div class="desig">${esc(f.signatoryDesignation || pick('Authorised Signatory', 'अधिकृत हस्ताक्षरकर्ता', lang))}</div>
      </div>
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
      <div class="right">${esc(CONTACT_INFO.phones.primaryFormatted)} · ${esc(CONTACT_INFO.primaryEmail)}<br/><span class="site">${esc(ORG.website)}</span></div>
    </div>
    <div class="pageno">Ref. ${esc(f.letterNo || '—')} &nbsp;·&nbsp; Page ${page} of ${pages}</div>
  </div>`;
}

/** Standalone HTML document of one A4 sheet — used for the live on-screen preview. */
export async function letterheadPreviewHtml(f, { lang = 'both', watermark = true } = {}) {
  const mark = watermark ? await watermarkDataUrl() : null;
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"/>
<title>${esc(f.letterNo || 'SSF Letterhead')}</title>
<style>${await fontFaceCss()}
  html,body{margin:0;padding:0;background:#8a97a3;}
  /* The preview mirrors the PDF sheet: masthead pinned to the top margin,
     footer pinned to the bottom margin, body flowing in between, and the
     letterpad frame drawn over the whole sheet. */
  .sheet{position:relative;width:${PAGE_W_MM}mm;height:${PAGE_H_MM}mm;margin:0 auto;background:#fff;overflow:hidden;}
  .sheet .mark{position:absolute;left:50%;top:50%;width:${WATERMARK_MM}mm;height:${WATERMARK_MM}mm;margin:-${WATERMARK_MM / 2}mm 0 0 -${WATERMARK_MM / 2}mm;opacity:${WATERMARK_OPACITY};pointer-events:none;}
  .sheet .inner{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;
    padding:${MARGIN_MM}mm 0 0;}
  .sheet .lh{flex:1;display:flex;flex-direction:column;min-height:0;background:transparent;
    /* .lh spans MARGIN_MM..paper bottom, so this padding is what ends the
       writing area at exactly BODY_BOTTOM_MM — the same millimetre the PDF
       uses — and the preview shows precisely the text that fits on paper. */
    padding-bottom:${PAGE_H_MM - BODY_BOTTOM_MM}mm;}
  /* The writing area ends at the same millimetre as the PDF's (bodyBottom), so
     the preview shows exactly the text that will fit on the printed sheet. */
  .sheet .lh-body{flex:1;min-height:0;overflow:hidden;margin-top:${HEADER_GAP_MM}mm;}
  /* Pinned to the sheet itself, not to .lh — .lh begins at the top margin, so
     absolute positioning against it would push the footer past the paper edge.
     At FOOTER_RULE_MM it matches the PDF's jsPDF-drawn rule exactly. */
  .sheet .lh-foot{position:absolute;top:${FOOTER_RULE_MM}mm;left:0;right:0;margin:0;z-index:1;}
  @media print{@page{size:A4;margin:0}html,body{background:#fff}.sheet{margin:0}}
  ${BASE_CSS}
</style></head><body>
  <div class="sheet">
    ${mark ? `<img class="mark" src="${mark}" alt=""/>` : ''}
    <div class="inner">
      <div class="lh">${headerHtml(f)}${bodyHtml(f, lang)}</div>
    </div>
    ${footerHtml(f, 1, 1)}
    ${frameHtml()}
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

let watermarkPromise;
/**
 * The emblem as a navy monochrome PNG, for the page watermark.
 *
 * The source logo is a full-colour roundel whose pale plate reaches the corners
 * of the square image, so stamping it as-is would drop a faint grey box behind
 * the text. Re-tinting every opaque pixel navy (and keeping the alpha channel)
 * leaves a clean silhouette that reads as a watermark and photocopies well.
 */
function watermarkDataUrl() {
  if (!watermarkPromise) {
    watermarkPromise = (async () => {
      const img = await logoImage();
      if (!img) return null;
      const S = 900;
      const c = document.createElement('canvas');
      c.width = S; c.height = S;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, S, S);
      // `source-in` keeps the existing alpha and replaces every colour with navy.
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, S, S);
      ctx.globalCompositeOperation = 'source-over';
      return c.toDataURL('image/png');
    })();
  }
  return watermarkPromise;
}

async function renderHost(html, { transparent = false, minHeightPx = 0 } = {}) {
  const host = document.createElement('div');
  host.setAttribute('data-ssf-letterhead', 'pdf');
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${PAGE_W_PX}px;z-index:-1;`;
  // The body raster must stay transparent so the watermark drawn underneath it
  // shows through between the lines of text, and it is given the full writing
  // height so the writing area is the same on every page of every letter.
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

/** Faint navy emblem, centred on the page and drawn under the text. */
function stampWatermark(pdf, dataUrl) {
  if (!dataUrl) return;
  const size = WATERMARK_MM;
  pdf.setGState(new pdf.GState({ opacity: WATERMARK_OPACITY }));
  pdf.addImage(dataUrl, 'PNG', (PAGE_W_MM - size) / 2, (PAGE_H_MM - size) / 2, size, size, undefined, 'FAST');
  pdf.setGState(new pdf.GState({ opacity: 1 }));
}

/**
 * The letterpad frame: a navy hairline enclosing the sheet, an inset gold
 * hairline, and a navy stud on each corner. Drawn with jsPDF vector primitives
 * rather than rasterised, so the rules stay hairline-crisp at 600dpi print
 * instead of picking up the raster's antialiasing.
 */
function stampFrame(pdf) {
  const s = FRAME_MM; const g = FRAME_MM + FRAME_RULE_MM;
  const R = PAGE_W_MM - s; const B = PAGE_H_MM - s;
  const r2 = PAGE_W_MM - g; const b2 = PAGE_H_MM - g;
  pdf.setDrawColor(18, 52, 90);
  pdf.setLineWidth(0.25);
  pdf.rect(s, s, R - s, B - s);
  pdf.setDrawColor(247, 168, 20);
  pdf.setLineWidth(0.18);
  pdf.rect(g, g, r2 - g, b2 - g);
  // Corner studs sit centred on the outer rule's four corners.
  const h = FRAME_STUD_MM / 2;
  pdf.setFillColor(18, 52, 90);
  [[s, s], [R, s], [s, B], [R, B]].forEach(([x, y]) => pdf.rect(x - h, y - h, FRAME_STUD_MM, FRAME_STUD_MM, 'F'));
}

function stampFooter(pdf, meta) {
  const y = FOOTER_RULE_MM;
  const xr = PAGE_W_MM - MARGIN_MM;
  // Institutional divider: a hairline across the writing column with a short
  // gold segment at its left end, echoing the masthead band. It spans the text
  // column, not the whole sheet, so it reads as part of the letter block
  // instead of colliding with the letterpad frame.
  pdf.setDrawColor(213, 222, 232); pdf.setLineWidth(0.2);
  pdf.line(MARGIN_MM, y, xr, y);
  pdf.setDrawColor(247, 168, 20); pdf.setLineWidth(0.5);
  pdf.line(MARGIN_MM, y, MARGIN_MM + 9, y);
  // 7.4pt keeps the registered address legible on a 600dpi office printer; the
  // earlier 6.4pt footer was effectively unreadable once printed.
  pdf.setTextColor(91, 107, 122); pdf.setFontSize(7.4);
  pdf.text(`Registered Office: ${ADDRESS_LINE}`, MARGIN_MM, y + 4.4);
  pdf.text(`${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.primaryEmail}`,
    xr, y + 4.4, { align: 'right' });
  pdf.setTextColor(18, 52, 90); pdf.setFontSize(7.2);
  pdf.text(ORG.website, xr, y + 8.3, { align: 'right' });
  pdf.setTextColor(148, 163, 184); pdf.setFontSize(6.8);
  pdf.text(`Ref. ${meta.letterNo || '—'}  ·  Page ${pdf.internal.getCurrentPageInfo().pageNumber} of ${meta.pageCount}`,
    PAGE_W_MM / 2, y + 12.6, { align: 'center' });
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
  const bodyBottom = BODY_BOTTOM_MM;
  const writingPx = Math.round((bodyBottom - bodyTop) * pxPerMm);
  // The body raster is transparent so the watermark, drawn underneath it, stays
  // visible between the lines of text instead of being painted over by a white
  // background (which is what hid the watermark in the previous layout).
  const body = await renderHost(`<div class="lh">${bodyHtml(f, lang)}</div>`, {
    transparent: true, minHeightPx: writingPx,
  });
  const mark = watermark ? await watermarkDataUrl() : null;
  try {
    const scale = body.canvas.width / PAGE_W_PX;
    const pageContentPx = Math.round((bodyBottom - bodyTop) * pxPerMm * scale);
    const boundaries = [0, ...safeBoundaries(body.host, scale), body.canvas.height];

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    let y = 0; let first = true;
    while (y < body.canvas.height) {
      let end = Math.min(y + pageContentPx, body.canvas.height);
      if (end < body.canvas.height) {
        // Break between blocks, never through a line of text.
        let best = -1;
        for (const b of boundaries) { if (b > y && b <= end) best = b; else if (b > end) break; }
        if (best > y) end = best;
      }
      const h = end - y;
      const slice = document.createElement('canvas');
      slice.width = body.canvas.width; slice.height = h;
      const sctx = slice.getContext('2d');
      // No white fill: the slice keeps its alpha so the watermark shows through.
      sctx.drawImage(body.canvas, 0, y, body.canvas.width, h, 0, 0, body.canvas.width, h);

      if (!first) pdf.addPage();
      first = false;
      stampWatermark(pdf, mark);
      stampHeader(pdf, headerCanvas);
      const hMm = (h / scale) * (PAGE_W_MM / PAGE_W_PX);
      // PNG (not JPEG) — JPEG has no alpha channel and would erase the watermark.
      pdf.addImage(slice.toDataURL('image/png'), 'PNG', 0, bodyTop, PAGE_W_MM, hMm, undefined, 'FAST');
      y = end;
    }
    const pages = pdf.internal.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      pdf.setPage(p);
      stampFrame(pdf);
      stampFooter(pdf, { ...f, pageCount: pages });
    }
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
