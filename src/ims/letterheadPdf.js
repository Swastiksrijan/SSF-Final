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
// Print geometry, all in millimetres on a true A4 sheet:
//
//   0 ─────────────────────────────────────────────── top of paper
//   14   masthead accent band, then the header block (identity + Ref. No./Date)
//   ~56  writing area begins (To, Subject, body, signature)
//   282  footer rule (Registered Office · contact · page)
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
const GOLD = '#B89B62';
const INK = '#26343D';
const MUTED = '#5B6B7A';
const HAIRLINE = '#C7D2DE';
const SOFT_BLUE = '#EAF0F6';

export const PAGE_W_MM = 210;
export const PAGE_H_MM = 297;
const MARGIN_MM = 14;                     // print margin on every edge
const PAGE_W_PX = 794;                    // A4 @ 96dpi — the raster width, i.e. the full page
// The raster is stamped at the full page width, so its inner padding IS the
// page margin: 14mm at 96dpi. Keeping the two in step is what makes the header,
// body and jsPDF-drawn footer share one left/right edge.
const PAD_PX = Math.round(MARGIN_MM * PAGE_W_PX / PAGE_W_MM);
const FOOTER_MM = 18;                     // footer rule sits 15mm above the paper edge
const HEADER_GAP_MM = 5;                  // breathing room between masthead and body
const WATERMARK_OPACITY = 0.075;         // subtle colour visible behind the full writing area
const WATERMARK_MM = 158;                 // watermark size, centred on the page

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

  .lh-head-top { display: flex; align-items: center; gap: 8px; padding: 13px 0 12px; min-width: 0; }

  /* Double-ring seal around the emblem — an outer navy hairline and an inner
     gold hairline, the conventional way a registered society presents its
     mark on official stationery. Both rings are real borders on nested
     elements, not box-shadow: html2canvas does not rasterise box-shadow, so
     an inset ring silently disappeared from the printed PDF. */
  .lh-seal {
    flex-shrink: 0; width: 68px; height: 68px; padding: 3px;
    display: grid; place-items: center;
    border: 1px solid rgba(18,52,90,.26); border-radius: 50%; background: #ffffff;
  }
  .lh-seal-inner {
    width: 100%; height: 100%; display: grid; place-items: center;
    border: 1px solid rgba(247,168,20,.7); border-radius: 50%;
  }
  .lh-logo { width: 52px; height: auto; display: block; }

  .lh-names { flex: 1; min-width: 0; }
  .lh-identity { display: flex; align-items: center; gap: 7px; }
  .lh-identity .dash { width: 16px; height: 2px; background: ${GOLD}; flex-shrink: 0; }
  .lh-identity .txt { font-size: 7.1px; font-weight: 800; letter-spacing: .17em; text-transform: uppercase; color: ${TEAL}; }
  .lh-name-en { margin-top: 5px; font-size: 19px; font-weight: 800; color: ${NAVY}; letter-spacing: -.02em; line-height: 1.14; overflow-wrap: anywhere; }
  .lh-name-hi { margin-top: 4px; font-size: 14px; font-weight: 700; color: ${NAVY}; line-height: 1.3; overflow-wrap: anywhere; }
  .lh-tag { margin-top: 7px; font-size: 8.3px; font-weight: 700; color: ${TEAL}; letter-spacing: .03em; }
  .lh-tag .sep { color: ${GOLD}; padding: 0 5px; }
  .lh-tag .en { color: ${MUTED}; font-weight: 600; }

  .lh-ref {
    flex: 0 0 116px; width: 116px; min-width: 0; padding-left: 8px;
    border-left: 1px solid ${HAIRLINE}; text-align: right;
  }
  .lh-ref .cap { font-size: 6.4px; font-weight: 800; letter-spacing: .06em; line-height: 1.35; text-transform: uppercase; color: ${MUTED}; overflow-wrap: anywhere; }
  .lh-ref .row { margin-top: 8px; }
  .lh-ref .k { font-size: 7px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; color: ${TEAL}; }
  .lh-ref .v { margin-top: 2px; font-size: 9.2px; font-weight: 700; color: ${NAVY}; overflow-wrap: anywhere; word-break: break-word; }

  /* Two-tone double rule closing the masthead. */
  .lh-rule { height: 1.6px; background: ${NAVY}; }
  .lh-rule-gold { height: 0.7px; background: ${GOLD}; }

  .lh-legal {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
    padding: 7px 0 8px; color: ${MUTED}; font-size: 7.3px; line-height: 1.5;
  }
  .lh-legal-main { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .lh-legal-reg { max-width: 34%; overflow-wrap: anywhere; }
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
  .lh-body { position: relative; z-index: 1; display: flex; flex: 1 0 auto; flex-direction: column; padding: 0 ${PAD_PX}px 3mm; }
  .lh-to { font-size: 12px; line-height: 1.6; }
  .lh-to .lbl { font-weight: 800; color: ${NAVY}; }

  .lh-subject { margin-top: 15px; padding: 8px 12px; background: #F5F8FB; border-left: 3px solid ${NAVY}; border-top: 1px solid ${SOFT_BLUE}; border-right: 1px solid ${SOFT_BLUE}; border-bottom: 1px solid ${SOFT_BLUE}; }
  .lh-subject .lbl { font-size: 8.5px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: ${TEAL}; }
  .lh-subject .txt { margin-top: 3px; font-size: 13px; font-weight: 700; color: ${NAVY}; line-height: 1.45; }

  .lh-salut { margin-top: 15px; font-size: 12.4px; font-weight: 700; color: ${INK}; }
  .lh-p { margin-top: 9px; font-size: 12.4px; text-align: justify; white-space: pre-wrap; }
  .lh-thanks { margin-top: 16px; font-size: 12.4px; }

  /* Keep the signature block at the end of the letter, above the fixed registered-office footer.
     On short letters it settles near the bottom of the writing area; on long letters it follows
     the final paragraph naturally. Enclosures/CC are placed before this block in bodyHtml. */
  .lh-sign { margin-top: auto; padding-top: 7px; border-top: 1px solid ${HAIRLINE}; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; break-inside: avoid; }
  .lh-sign-left { flex: 1; min-width: 0; padding-bottom: 2px; }
  .lh-sign-left .closing { font-size: 12px; font-weight: 700; color: ${INK}; }
  .lh-sign-left .org { margin-top: 0; font-size: 10.5px; font-weight: 800; color: ${NAVY}; }
  .lh-sign-left .orgline { display: flex; align-items: center; gap: 7px; margin-top: 5px; }
  .lh-sign-left .tag { margin-top: 2px; font-size: 8px; color: ${MUTED}; letter-spacing: .02em; }
  .lh-sign-left .seal { display: block; width: 30px; height: auto; margin: 0; opacity: .9; flex-shrink: 0; }
  .lh-sign-seal { display: block; width: 42px; height: auto; margin: 4px auto 0; opacity: .9; }
  .lh-sign-col { flex: 0 0 235px; max-width: 42%; min-width: 0; text-align: center; }
  .lh-sign-trio { width: 100%; display: flex; flex-direction: row; gap: 8px; align-items: flex-end; }
  .lh-sign-trio .person { flex: 1 1 0; width: 33.333%; min-width: 0; text-align: center; break-inside: avoid; }
  .lh-sign-trio .line { margin: 6px auto 0; width: 92%; max-width: 150px; border-top: 1px solid #9AAABD; }
  .lh-sign-trio-head { text-align: center; font-size: 8px; line-height: 1.25; font-weight: 700; color: ${INK}; margin: 0 0 2px; }
  .lh-sign-trio-org { text-align: center; font-size: 9px; line-height: 1.2; font-weight: 800; color: ${NAVY}; margin: 0 0 2px; }
  .lh-sign-trio .nm { margin-top: 4px; font-size: 9.5px; line-height: 1.2; font-weight: 800; color: ${NAVY}; overflow-wrap: anywhere; }
  .lh-sign-trio .desig { font-size: 8.5px; line-height: 1.2; color: ${INK}; }
  .lh-sign-trio .for { font-size: 7px; line-height: 1.2; color: ${MUTED}; }
  .lh-sign .for { font-size: 10px; font-weight: 700; color: ${INK}; }
  .lh-sign .sig { height: 34px; max-width: 150px; object-fit: contain; margin: 5px auto 0; display: block; }
  .lh-sign .line { margin: 2px auto 0; width: 205px; border-top: 1px solid #9AAABD; }
  .lh-sign .nm { margin-top: 5px; font-size: 12px; font-weight: 800; color: ${NAVY}; }
  .lh-sign .desig { font-size: 10px; color: ${INK}; }

  .lh-extra { margin-top: 16px; font-size: 11px; line-height: 1.55; }
  .lh-extra .lbl { font-weight: 800; color: ${NAVY}; }

  /* ---- footer (live HTML preview only; the PDF stamps its own) --------- */
  .lh-foot { margin-top: 12px; padding: 0 ${PAD_PX}px; }
  .lh-foot .rule { position: relative; height: 1px; background: ${HAIRLINE}; }
  .lh-foot .rule::before { content: ''; position: absolute; left: 0; top: 0; width: 28px; height: 1px; background: ${NAVY}; }
  .lh-foot .grid { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding-top: 4px; font-size: 7.4px; color: ${MUTED}; line-height: 1.5; }
  .lh-foot .grid .left { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .lh-foot .grid .right { width: 34%; max-width: 220px; min-width: 0; text-align: right; flex-shrink: 0; overflow-wrap: anywhere; word-break: break-word; }
  .lh-foot .grid .right .site { color: ${NAVY}; font-weight: 700; }
  .lh-foot .pageno { margin-top: 3px; text-align: center; font-size: 7.2px; color: #94A3B8; }
`;

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
        <div class="row"><div class="k">Ref. No.</div><div class="v">${f.blankMode ? '________________' : esc(f.letterNo || 'To be assigned')}</div></div>
        <div class="row"><div class="k">Date</div><div class="v">${f.blankMode ? '________________' : esc(f.date || '')}</div></div>
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
  if (f.blankMode) {
    return `<div class="lh-body" style="min-height:640px;flex:1;display:flex;flex-direction:column;justify-content:flex-end">
      <div style="flex:1;min-height:470px"></div>
      <div style="display:flex;justify-content:flex-end;gap:40px;padding:0 0 18px;color:${MUTED};font-size:10px">
        <div style="width:150px;text-align:center;border-top:1px solid #9AAABD;padding-top:6px">Authorised Signatory / अधिकृत हस्ताक्षरकर्ता</div>
      </div>
    </div>`;
  }
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
    ${f.enclosures ? `<div class="lh-extra" data-safe>
      <span class="lbl">${pick('Enclosures', 'संलग्नक', lang)}:</span> ${esc(f.enclosures)}
    </div>` : ''}
    ${f.cc ? `<div class="lh-extra" data-safe>
      <span class="lbl">${pick('Copy to', 'प्रतिलिपि', lang)}:</span> ${esc(f.cc)}
    </div>` : ''}
    <div class="lh-sign" data-safe>
      ${f.signatoryMode === 'trio' ? `
        <div style="width:100%">
          <div class="closing" style="margin-bottom:3px">${esc(closing)}</div>
          <div class="lh-sign-trio-head">${pick('For and on behalf of', 'की ओर से', lang)}</div>
          <div class="lh-sign-trio-org">${esc(ORG.en)}</div>
          <div class="lh-sign-trio">
            <div class="person"><div class="line"></div><div class="nm">Ramesh Pandey</div><div class="desig">${pick('President', 'अध्यक्ष', lang)}</div></div>
            <div class="person"><div class="line"></div><div class="nm">Amit Kumar Pandey</div><div class="desig">${pick('Secretary', 'सचिव', lang)}</div></div>
            <div class="person"><div class="line"></div><div class="nm">Divya Sharma</div><div class="desig">${pick('Treasurer', 'कोषाध्यक्ष', lang)}</div></div>
          </div>
        </div>
      ` : `
        <div class="lh-sign-left">
          <div class="closing">${esc(closing)}</div>
          ${f.seal !== false && (f.sealPosition === 'left' || !f.sealPosition) ? `<div class="orgline"><div class="org">${esc(ORG.en)}</div><img class="seal" src="${sealImg}" alt="Organisation seal" /></div>` : `<div class="org">${esc(ORG.en)}</div>`}
          <div class="tag hi">${esc(ORG.taglineHi)} · ${esc(ORG.taglineEn)}</div>
        </div>
        <div class="lh-sign-col">
          <div class="for">${pick('For and on behalf of', 'की ओर से', lang)}<br/>${esc(ORG.en)}</div>
          ${hasSignatureScan(f) ? `<img class="sig" src="${signatureImg}" alt="Signature" data-signature-img />` : ''}
          <div class="line"></div>
          ${f.seal !== false && f.sealPosition === 'signatory' ? `<img class="lh-sign-seal" src="${sealImg}" alt="Organisation seal" />` : ''}
          <div class="nm">${esc(f.signatoryName || '')}</div>
          <div class="desig">${esc(f.signatoryDesignation || pick('Authorised Signatory', 'अधिकृत हस्ताक्षरकर्ता', lang))}</div>
        </div>
      `}
    </div>
  </div>`;
}

function footerHtml(f, page, pages) {
  return `<div class="lh-foot">
    <div class="rule"></div>
    <div class="grid">
      <div class="left">Registered Office: ${esc(ADDRESS_LINE)}</div>
      <div class="right">${esc(CONTACT_INFO.phones.primaryFormatted)}<br/>${esc(CONTACT_INFO.primaryEmail)}<br/><span class="site">${esc(ORG.website)}</span></div>
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
     footer pinned to the bottom margin, body flowing in between. */
  .sheet{position:relative;width:${PAGE_W_MM}mm;height:${PAGE_H_MM}mm;margin:0 auto;background:#fff;overflow:hidden;box-sizing:border-box;}
  .sheet::after{content:'';position:absolute;inset:4mm;border:1.1px solid ${NAVY};pointer-events:none;z-index:20;}
  .sheet::before{content:'';position:absolute;inset:5.3mm;border:0.35px solid #D7E0E8;pointer-events:none;z-index:20;}
  .sheet .mark{position:absolute;left:50%;top:50%;width:${WATERMARK_MM}mm;height:${WATERMARK_MM}mm;margin:-${WATERMARK_MM / 2}mm 0 0 -${WATERMARK_MM / 2}mm;opacity:${WATERMARK_OPACITY};pointer-events:none;}
  .sheet .inner{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;
    padding:${MARGIN_MM}mm 0 4mm;}
  .sheet .lh{flex:1;display:flex;flex-direction:column;min-height:0;}
  /* The 4mm bottom padding plus the footer's own height puts the footer rule
     around 282mm, exactly where the PDF's jsPDF-drawn footer rule sits
     (PAGE_H_MM - FOOTER_MM), so preview and print agree to the millimetre. */
  .sheet .lh-foot{margin-top:auto;padding-bottom:0;}
  @media print{@page{size:A4;margin:0}html,body{background:#fff}.sheet{margin:0}}
  ${BASE_CSS}
</style></head><body>
  <div class="sheet">
    ${mark ? `<img class="mark" src="${mark}" alt=""/>` : ''}
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

let watermarkPromise;
/**
 * Full-colour logo watermark, clipped to a circle so the square source image
 * cannot leave a rectangular plate behind the letter text. Page-level opacity
 * keeps the emblem subtle while preserving its original brand colours.
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
      // Keep original logo colours; mask to a circle to remove square corners.
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S * 0.485, 0, Math.PI * 2);
      ctx.fill();
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
    ? `.lh{background:transparent${minHeightPx ? `;min-height:${minHeightPx}px;display:flex;flex-direction:column` : ''}}\n       .lh-body{${minHeightPx ? `min-height:${minHeightPx}px;` : ''}flex:1 1 auto;min-height:0;box-sizing:border-box;display:flex;flex-direction:column}\n       .lh-sign{margin-top:auto;flex-shrink:0}`
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

function stampFooter(pdf, meta) {
  const y = PAGE_H_MM - FOOTER_MM;
  const xr = PAGE_W_MM - MARGIN_MM;
  // Institutional divider: a hairline across the page with a short gold
  // segment at its left end, echoing the masthead band.
  pdf.setDrawColor(213, 222, 232); pdf.setLineWidth(0.2);
  pdf.line(MARGIN_MM, y, xr, y);
  pdf.setDrawColor(247, 168, 20); pdf.setLineWidth(0.5);
  pdf.line(MARGIN_MM, y, MARGIN_MM + 9, y);
  // 7.4pt keeps the registered address legible on a 600dpi office printer; the
  // earlier 6.4pt footer was effectively unreadable once printed.
  pdf.setTextColor(91, 107, 122); pdf.setFontSize(7.1);
  const addressLines = pdf.splitTextToSize(`Registered Office: ${ADDRESS_LINE}`, 112);
  pdf.text(addressLines.slice(0, 2), MARGIN_MM, y + 4.0, { lineHeightFactor: 1.15 });
  const contactX = xr;
  pdf.setFontSize(7.0);
  pdf.text(CONTACT_INFO.phones.primaryFormatted, contactX, y + 4.0, { align: 'right' });
  pdf.text(CONTACT_INFO.primaryEmail, contactX, y + 7.1, { align: 'right' });
  pdf.setTextColor(18, 52, 90); pdf.setFontSize(7.0);
  pdf.text(ORG.website, contactX, y + 10.1, { align: 'right' });
  pdf.setTextColor(148, 163, 184); pdf.setFontSize(6.5);
  pdf.text(`Ref. ${meta.letterNo || '—'}  ·  Page ${pdf.internal.getCurrentPageInfo().pageNumber} of ${meta.pageCount}`,
    PAGE_W_MM / 2, y + 13.0, { align: 'center' });
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
      stampFooter(pdf, { ...f, pageCount: pages });
      // Premium double border, inset from the paper edge so no printer clips it.
      pdf.setDrawColor(18, 52, 90); pdf.setLineWidth(0.65);
      pdf.rect(4.2, 4.2, PAGE_W_MM - 8.4, PAGE_H_MM - 8.4, 'S');
      pdf.setDrawColor(199, 210, 222); pdf.setLineWidth(0.22);
      pdf.rect(5.4, 5.4, PAGE_W_MM - 10.8, PAGE_H_MM - 10.8, 'S');
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
  const safe = String(f.blankMode ? 'SSF-Blank-Letterhead' : (f.letterNo || 'SSF-LETTER')).replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
  if (f.blankMode) {
    L.push('Blank official letterhead — PDF attachment contains the stationery.');
    L.push(`Registered Office: ${ADDRESS_LINE}`, `${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.primaryEmail} · ${ORG.website}`);
    return L.join('\\n');
  }
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
