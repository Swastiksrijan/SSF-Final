// SSF Organisation Profile → branded, bilingual institutional PDF.
//
// The document is built for EXTERNAL audiences (CSR, government, funders).
// It carries no internal software/IMS branding and no page is left with an
// orphaned heading or a mid-sentence cut.
//
// We deliberately do NOT draw Devanagari with jsPDF: jsPDF has no Indic
// shaping, so Hindi conjuncts break. Instead we lay the document out as real
// HTML (the browser shapes Devanagari perfectly), rasterise it with
// html2canvas, and slice the tall canvas into A4 pages. Slicing is done at
// safe element boundaries (never through a line of text), and the page footer
// ("Swastik Srijan Foundation Samiti | Organisation Profile" + page n / N) is
// stamped with jsPDF per page. Link blocks get jsPDF clickable-link
// annotations over the rasterised rows.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../assets/new-logo.png';
import devaRegularUrl from '../assets/fonts/NotoSansDevanagari-Regular.ttf?url';
import devaBoldUrl from '../assets/fonts/NotoSansDevanagari-Bold.ttf?url';
import { PROFILE_DOC, PROFILE_RENDER } from './orgProfileData';

const NAVY = '#002344';
const BLUE = '#0b3a63';
const TEAL = '#1F7A70';
const ORANGE = '#FF6600';
const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const MARGIN_MM = 12;
const FOOTER_MM = 12;
const BODY_MM = PAGE_H_MM - MARGIN_MM - FOOTER_MM; // usable slice height
const PAGE_W_PX = 794;   // A4 @ 96dpi

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Devanagari font as a data URL, embedded once. Bundling the font with the app
// (rather than a Google Fonts CDN at raster time) guarantees Hindi shapes
// correctly even offline or on a network that blocks fonts.googleapis.com.
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

// Render a bilingual string for the chosen output language.
function pick(en, hi, lang) {
  if (lang === 'hi') return hi;
  if (lang === 'both') return `${en} <span class="hi-inline">/ ${hi}</span>`;
  return en;
}
const t = (obj, lang) => pick(esc(obj.en), esc(obj.hi), lang);

// ── block renderers ─────────────────────────────────────────────────────────
function renderBlock(b, lang) {
  switch (b.type) {
    case 'para':
      return `<div class="blk para" data-safe>
        ${b.label ? `<div class="para-label">${t(b.label, lang)}</div>` : ''}
        <p class="para-text">${t(b.text, lang)}</p>
      </div>`;
    case 'bullets':
      return `<div class="blk bullets" data-safe>
        ${b.label ? `<div class="block-label">${t(b.label, lang)}</div>` : ''}
        <ul>${b.items.map((i) => `<li data-safe>${t(i, lang)}</li>`).join('')}</ul>
      </div>`;
    case 'kv':
      return `<div class="blk kv" data-safe>${b.rows.map((r) => `<div class="kvrow" data-safe>
        <div class="kv-label">${t(r.l, lang)}</div>
        <div class="kv-value">${t(r.v, lang)}</div>
      </div>`).join('')}</div>`;
    case 'table':
      return `<div class="blk tablewrap" data-safe>
        <table>
          <thead><tr>${b.columns.map((c) => `<th>${t(c, lang)}</th>`).join('')}</tr></thead>
          <tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${t(c, lang)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        ${b.note ? `<div class="table-note">${t(b.note, lang)}</div>` : ''}
      </div>`;
    case 'cards':
      return b.items.map((c) => `<div class="blk card" data-safe>
        <div class="card-name">${t(c.name, lang)}</div>
        <div class="card-lines">${c.lines.map((ln) => `<div class="card-line" data-safe>
          <span class="cl-label">${t(ln.l, lang)}</span>
          <span class="cl-value">${t(ln.v, lang)}</span>
        </div>`).join('')}</div>
      </div>`).join('');
    case 'callout':
      return `<div class="blk callout${b.tone === 'accent' ? ' accent' : b.tone === 'muted' ? ' muted' : ''}" data-safe>
        ${b.label ? `<div class="callout-label">${t(b.label, lang)}</div>` : ''}
        <p>${t(b.text, lang)}</p>
      </div>`;
    case 'links':
      return `<div class="blk links" data-safe>
        ${b.label ? `<div class="block-label">${t(b.label, lang)}</div>` : ''}
        <div class="link-grid">${b.links.map((ln, i) => `<a class="link-row" data-safe data-link="${esc(ln.url)}" data-link-i="${i}">
          <span class="link-name">${esc(ln.label)}</span>
          <span class="link-url">${esc(ln.url.replace(/^https?:\/\//, ''))}</span>
        </a>`).join('')}</div>
      </div>`;
    case 'facts':
      return `<div class="blk facts" data-safe>${b.items.map((f) => `<div class="fact" data-safe>
        <div class="fact-value">${pick(esc(f.value.en), esc(f.value.hi), lang)}</div>
        <div class="fact-label">${t(f.label, lang)}</div>
      </div>`).join('')}</div>`;
    case 'gallery':
      return `<div class="blk gallery" data-safe>
        ${b.label ? `<div class="block-label">${t(b.label, lang)}</div>` : ''}
        <div class="gal-grid">${b.items.map((g) => `<figure class="gal-item" data-safe>
          <div class="gal-img" style="background-image:url('${esc(g.src)}')"></div>
          <figcaption>${t(g.caption, lang)}</figcaption>
        </figure>`).join('')}</div>
      </div>`;
    case 'years':
      return `<div class="blk years" data-safe>
        ${b.label ? `<div class="block-label">${t(b.label, lang)}</div>` : ''}
        <div class="yr-grid">${b.items.map((y) => `<a class="yr-chip" data-safe data-link="${esc(y.url)}">
          <div class="yr-year">${esc(y.year)}</div>
          <div class="yr-open">${pick('View', 'देखें', lang)} →</div>
        </a>`).join('')}</div>
      </div>`;
    case 'docCards':
      return `<div class="blk docs" data-safe>
        ${b.label ? `<div class="block-label">${t(b.label, lang)}</div>` : ''}
        <div class="doc-grid">${b.items.map((d) => `<a class="doc-card" data-safe data-link="${esc(d.url)}">
          <div class="doc-card-top"><span class="doc-icon">▤</span><span class="doc-tag">${t(d.tag, lang)}</span></div>
          <div class="doc-name">${t(d.name, lang)}</div>
          ${lang === 'en' ? '' : `<div class="doc-hi">${esc(d.hi || '')}</div>`}
          <div class="doc-open">${pick('View document', 'दस्तावेज़ देखें', lang)} →</div>
        </a>`).join('')}</div>
      </div>`;
    case 'signature':
      return `<div class="blk sign" data-safe>
        <div class="sign-issued">
          <div class="sign-issued-lbl">${t(b.issuedLabel, lang)}</div>
          <div class="sign-issued-by">${pick(esc(b.issuedByEn), esc(b.issuedByHi), lang)}</div>
          <div class="sign-issued-org">${pick(esc(b.orgEn), esc(b.orgHi), lang)}</div>
        </div>
        <div class="sign-meta">
          <div><span class="sm-lbl">${t(b.dateLabel, lang)}:</span> <span class="sm-line">&nbsp;</span></div>
          <div><span class="sm-lbl">${t(b.placeLabel, lang)}:</span> <span class="sm-line">&nbsp;</span></div>
        </div>
        <div class="sign-seal">
          <div class="seal-box"></div>
          <div class="seal-lbl">${t(b.sealLabel, lang)}</div>
        </div>
      </div>`;
    default:
      return '';
  }
}

function renderCover(lang) {
  const c = PROFILE_RENDER.cover;
  return `<div class="cover" data-safe>
    <div class="cover-top">
      <img class="cover-logo" src="${logoImg}" alt="SSF" />
      <div class="cover-orgblock">
        <div class="cover-org-en">${esc(PROFILE_DOC.org.en)}</div>
        <div class="cover-org-hi">${esc(PROFILE_DOC.org.hi)}</div>
      </div>
    </div>
    <div class="cover-mid">
      <div class="cover-title">${pick(esc(c.title.en), esc(c.title.hi), lang)}</div>
      <div class="cover-sub">${pick(esc(c.subtitle.en), esc(c.subtitle.hi), lang)}</div>
    </div>
    <div class="cover-foot">
      <div class="cover-reg">Registered under the Madhya Pradesh Societies Registration Act, 1973 · Regn. No. 05/22/03/11448/13</div>
      <div class="cover-reg-hi">मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973 के अंतर्गत पंजीकृत · पंजीकरण सं. 05/22/03/11448/13</div>
      <div class="cover-ver"><span class="ver-lbl">${pick(esc(c.versionLabel.en), esc(c.versionLabel.hi), lang)}:</span> <span class="ver-code">${esc(c.code)}</span></div>
    </div>
  </div>`;
}

function renderSection(s, lang) {
  const title = lang === 'hi'
    ? `<h2 class="sec-title">${esc(s.hi)}</h2>`
    : lang === 'both'
      ? `<h2 class="sec-title">${esc(s.en)}</h2><div class="sec-title-hi">${esc(s.hi)}</div>`
      : `<h2 class="sec-title">${esc(s.en)}</h2>`;
  return `<section class="sec" data-sec="${s.id}">
    <div class="sec-head" data-safe>${title}</div>
    ${s.intro ? `<p class="sec-intro" data-safe>${t(s.intro, lang)}</p>` : ''}
    ${s.blocks.map((b) => renderBlock(b, lang)).join('')}
  </section>`;
}

function renderClosing(lang) {
  const c = PROFILE_RENDER.closing;
  return `<section class="sec closing" data-sec="closing" data-safe>
    <div class="cl-org-en">${esc(PROFILE_DOC.org.en)}</div>
    <div class="cl-org-hi">${esc(PROFILE_DOC.org.hi)}</div>
    <div class="cl-statement">${t(c.statement, lang)}</div>
    <div class="cl-band">${t(c.audience, lang)}</div>
    <div class="cl-contact">
      <div>${esc(CONTACT_BLOCK.email)}</div>
      <div>${esc(CONTACT_BLOCK.phone)}</div>
      <div>${esc(CONTACT_BLOCK.website)}</div>
      <div>${esc(CONTACT_BLOCK.address)}</div>
    </div>
    <div class="cl-sign">
      <div class="cl-sign-caption">${t(c.signatoryCaption, lang)}</div>
      <div class="sign-grid">
        <div><span class="sm-lbl">${t(c.nameLabel, lang)}:</span> <span class="sm-line">&nbsp;</span></div>
        <div><span class="sm-lbl">${t(c.designationLabel, lang)}:</span> <span class="sm-line">&nbsp;</span></div>
        <div><span class="sm-lbl">${t(c.dateLabel, lang)}:</span> <span class="sm-line">&nbsp;</span></div>
        <div><span class="sm-lbl">${t(c.placeLabel, lang)}:</span> <span class="sm-line">&nbsp;</span></div>
      </div>
      <div class="sign-seal">
        <div class="seal-box"></div>
        <div class="seal-lbl">${t(c.sealLabel, lang)}</div>
      </div>
    </div>
  </section>`;
}

// Contact block used only by the closing page.
let CONTACT_BLOCK = { email: '', phone: '', website: '', address: '' };
function setContactBlock() {
  const about = PROFILE_RENDER.sections.find((s) => s.id === 'about');
  const rows = about.blocks.find((b) => b.type === 'kv').rows;
  const get = (labelEn) => {
    const r = rows.find((x) => x.l.en === labelEn);
    return r ? r.v.en : '';
  };
  CONTACT_BLOCK = {
    email: get('Official Email'),
    phone: get('Official Contact'),
    website: get('Website'),
    address: get('Registered Office'),
  };
}

function buildCoverHtml(lang) {
  return `<div class="doc cover-doc">${renderCover(lang)}</div>`;
}

function buildBodyHtml(lang) {
  setContactBlock();
  const secs = PROFILE_RENDER.sections.map((s) => renderSection(s, lang)).join('');
  return `<div class="doc"><div class="content">${secs}${renderClosing(lang)}</div></div>`;
}

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Mukta:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .doc {
    width: ${PAGE_W_PX}px; background: #ffffff; color: #1f2937;
    font-family: 'Plus Jakarta Sans', 'SSFDevanagari', 'Mukta', system-ui, sans-serif;
    font-size: 12.5px; line-height: 1.55; -webkit-font-smoothing: antialiased;
  }
  .hi-inline { color: #64748b; font-family: 'SSFDevanagari','Mukta',sans-serif; }
  h2, .sec-title { font-family: 'Plus Jakarta Sans','SSFDevanagari',sans-serif; }

  /* ── Cover ─────────────────────────────────────────────── */
  .cover { padding: 46px 44px 40px; min-height: 1080px; display: flex; flex-direction: column; }
  .cover-top { display: flex; align-items: center; gap: 18px; }
  .cover-logo { width: 84px; height: 84px; object-fit: contain; }
  .cover-org-en { font-size: 22px; font-weight: 800; color: ${NAVY}; letter-spacing: .01em; }
  .cover-org-hi { font-size: 17px; font-weight: 700; color: ${BLUE}; font-family: 'SSFDevanagari','Mukta',sans-serif; margin-top: 2px; }
  .cover-mid { margin-top: 220px; border-left: 6px solid ${ORANGE}; padding-left: 26px; }
  .cover-title { font-size: 44px; font-weight: 800; color: ${NAVY}; line-height: 1.1; }
  .cover-sub { margin-top: 18px; font-size: 14px; font-weight: 600; color: ${TEAL}; max-width: 560px; line-height: 1.6; }
  .cover-foot { margin-top: auto; padding-top: 20px; border-top: 2px solid ${NAVY}; }
  .cover-reg { font-size: 11.5px; font-weight: 700; color: ${NAVY}; }
  .cover-reg-hi { font-size: 10.5px; color: #64748b; margin-top: 3px; font-family: 'SSFDevanagari','Mukta',sans-serif; }
  .cover-ver { margin-top: 8px; font-family: ui-monospace, monospace; font-size: 11px; color: #64748b; }
  .ver-code { color: ${NAVY}; font-weight: 700; }

  /* ── Content ───────────────────────────────────────────── */
  .content { padding: 4px 44px 24px; }
  .sec { margin-top: 22px; }
  .sec-head { border-bottom: 2.5px solid ${NAVY}; padding-bottom: 7px; margin-bottom: 12px; break-after: avoid; }
  .sec-title { font-size: 19px; font-weight: 800; color: ${NAVY}; letter-spacing: .005em; }
  .sec-title-hi { font-size: 13px; font-weight: 700; color: ${BLUE}; margin-top: 2px; font-family: 'SSFDevanagari','Mukta',sans-serif; }
  .sec-intro { font-size: 11.5px; color: #64748b; margin-bottom: 12px; }
  .blk { margin-bottom: 14px; }

  .para-label, .block-label { font-size: 13px; font-weight: 800; color: ${BLUE}; margin-bottom: 5px; }
  .para-text { font-size: 12.5px; color: #334155; text-align: justify; }
  .bullets ul { columns: 2; column-gap: 26px; list-style: none; }
  .bullets li { position: relative; padding-left: 15px; margin-bottom: 5px; color: #334155; font-size: 12px; break-inside: avoid; }
  .bullets li::before { content: ''; position: absolute; left: 2px; top: 8px; width: 5px; height: 5px; border-radius: 50%; background: ${ORANGE}; }

  .kv { border: 1px solid #e6edf5; border-radius: 10px; overflow: hidden; }
  .kvrow { display: flex; gap: 14px; padding: 8px 14px; border-bottom: 1px solid #eef2f7; }
  .kvrow:last-child { border-bottom: 0; }
  .kvrow:nth-child(even) { background: #f8fafc; }
  .kv-label { flex: 0 0 210px; font-weight: 700; color: ${BLUE}; font-size: 11.5px; }
  .kv-value { flex: 1; color: #334155; font-size: 12px; word-break: break-word; }

  .tablewrap { border: 1px solid #e6edf5; border-radius: 10px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { background: ${NAVY}; color: #fff; text-align: left; font-size: 11px; font-weight: 700; padding: 9px 12px; }
  td { padding: 8px 12px; font-size: 11.5px; color: #334155; border-bottom: 1px solid #eef2f7; vertical-align: top; }
  tr:nth-child(even) td { background: #f8fafc; }
  tr:last-child td { border-bottom: 0; }
  th:nth-child(1), td:nth-child(1) { width: 27%; }
  th:nth-child(2), td:nth-child(2) { width: 34%; }
  .table-note { font-size: 10.5px; color: #94a3b8; padding: 7px 12px; background: #fbfcfe; border-top: 1px solid #eef2f7; }

  .card { border: 1px solid #e6edf5; border-left: 4px solid ${TEAL}; border-radius: 10px; padding: 11px 14px; break-inside: avoid; }
  .card-name { font-size: 13.5px; font-weight: 800; color: ${NAVY}; margin-bottom: 6px; }
  .card-line { display: flex; gap: 12px; font-size: 11.5px; padding: 2px 0; }
  .cl-label { flex: 0 0 130px; font-weight: 700; color: ${BLUE}; }
  .cl-value { flex: 1; color: #334155; }

  .callout { border-radius: 10px; padding: 12px 16px; background: #f1f5f9; border-left: 4px solid ${NAVY}; }
  .callout.accent { background: #fff5eb; border-left-color: ${ORANGE}; }
  .callout.muted { background: #f8fafc; border-left-color: #cbd5e1; }
  .callout-label { font-size: 11.5px; font-weight: 800; color: ${BLUE}; margin-bottom: 4px; }
  .callout p { font-size: 12px; color: #334155; }

  .link-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
  .link-row { display: flex; justify-content: space-between; gap: 10px; text-decoration: none;
    padding: 7px 12px; border: 1px solid #e6edf5; border-radius: 8px; background: #f8fafc; break-inside: avoid; }
  .link-name { font-size: 11.5px; font-weight: 700; color: ${NAVY}; }
  .link-url { font-size: 10.5px; color: ${TEAL}; }

  /* facts strip */
  .facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .fact { border: 1px solid #e6edf5; border-top: 3px solid ${ORANGE}; border-radius: 10px;
    padding: 12px 10px; text-align: center; background: #fbfdff; break-inside: avoid; }
  .fact-value { font-size: 21px; font-weight: 800; color: ${NAVY}; line-height: 1; }
  .fact-label { font-size: 10.5px; color: #64748b; margin-top: 6px; font-weight: 600; }

  /* photo gallery */
  .gal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .gal-item { border: 1px solid #e6edf5; border-radius: 10px; overflow: hidden; background: #fff; break-inside: avoid; }
  .gal-img { width: 100%; height: 128px; background-size: cover; background-position: center; background-repeat: no-repeat; }
  .gal-item figcaption { font-size: 10.5px; font-weight: 600; color: ${BLUE}; padding: 7px 9px; line-height: 1.35; }

  /* public document cards */
  .doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .doc-card { display: block; text-decoration: none; border: 1px solid #e6edf5; border-left: 4px solid ${TEAL};
    border-radius: 10px; padding: 10px 13px; background: #f8fafc; break-inside: avoid; }
  .doc-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .doc-icon { color: ${ORANGE}; font-weight: 800; font-size: 13px; }
  .doc-tag { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em;
    color: #c65f00; background: #fff3e6; border: 1px solid #ffe0c2; border-radius: 999px; padding: 2px 8px; }
  .doc-name { font-size: 12px; font-weight: 800; color: ${NAVY}; margin-top: 5px; }
  .doc-hi { font-size: 10.5px; color: #64748b; font-family: 'SSFDevanagari','Mukta',sans-serif; }
  .doc-open { font-size: 10px; font-weight: 700; color: ${TEAL}; margin-top: 6px; }

  /* year-wise annual reports */
  .yr-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .yr-chip { display: block; text-decoration: none; text-align: center; border: 1px solid #e6edf5;
    border-radius: 8px; padding: 9px 6px; background: #fbfdff; break-inside: avoid; }
  .yr-year { font-size: 13px; font-weight: 800; color: ${NAVY}; }
  .yr-open { font-size: 9px; font-weight: 700; color: ${TEAL}; margin-top: 3px; }

  .sign { border: 1px solid #e6edf5; border-radius: 10px; padding: 18px 18px 14px; }
  .sign-issued-lbl { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
  .sign-issued-by { font-size: 15px; font-weight: 800; color: ${NAVY}; margin-top: 3px; }
  .sign-issued-org { font-size: 12px; color: #475569; }
  .sign-meta { margin-top: 14px; display: flex; gap: 30px; font-size: 12px; color: #475569; }
  .sm-lbl { font-weight: 700; color: ${BLUE}; }
  .sm-line { display: inline-block; min-width: 110px; border-bottom: 1px solid #cbd5e1; }
  .sign-seal { margin-top: 22px; }
  .seal-box { width: 130px; height: 62px; border: 1.5px dashed #cbd5e1; border-radius: 8px; }
  .seal-lbl { font-size: 10px; color: #94a3b8; margin-top: 5px; }

  /* ── Closing page ──────────────────────────────────────── */
  .closing { text-align: center; padding-top: 40px; }
  .cl-org-en { font-size: 26px; font-weight: 800; color: ${NAVY}; }
  .cl-org-hi { font-size: 19px; font-weight: 700; color: ${BLUE}; font-family: 'SSFDevanagari','Mukta',sans-serif; margin-top: 4px; }
  .cl-statement { margin: 24px auto 0; max-width: 560px; font-size: 14px; font-style: italic; color: #334155; }
  .cl-band { margin: 26px auto 0; display: inline-block; background: ${NAVY}; color: #fff; font-weight: 700; font-size: 12.5px; padding: 10px 22px; border-radius: 999px; }
  .cl-contact { margin-top: 22px; font-size: 12.5px; color: #334155; line-height: 1.9; }
  .cl-sign { margin-top: 46px; text-align: left; display: inline-block; min-width: 460px; }
  .cl-sign-caption { font-size: 12px; font-weight: 800; color: ${BLUE}; margin-bottom: 12px; }
  .sign-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 40px; font-size: 12px; color: #475569; }
`;

async function ensureFonts() {
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const faces = [
      "800 20px 'Plus Jakarta Sans'", "400 13px 'Plus Jakarta Sans'",
      "400 13px 'SSFDevanagari'", "700 14px 'SSFDevanagari'",
    ];
    await Promise.all(faces.map((f) => document.fonts.load(f).catch(() => {})));
  } catch { /* fonts optional */ }
}

function preloadImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  const bgEls = Array.from(root.querySelectorAll('[style*="background-image"]'));
  const jobs = [];
  imgs.forEach((img) => jobs.push(img.complete && img.naturalWidth
    ? Promise.resolve()
    : new Promise((res) => { img.onload = img.onerror = () => res(); })));
  bgEls.forEach((el) => {
    const m = /url\(['"]?([^'")]+)['"]?\)/.exec(el.getAttribute('style') || '');
    if (m) jobs.push(new Promise((res) => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = m[1]; }));
  });
  return Promise.all(jobs);
}

// Collect safe pixel boundaries from the DOM: the top of each top-level safe
// block inside `.content`. Slicing happens only at these y positions so a page
// never cuts through a line of text; a block taller than one page is allowed to
// split (rare) at content-line boundaries.
function safeBoundaries(host, scale) {
  const content = host.querySelector('.content');
  if (!content) return [];
  const hostTop = host.getBoundingClientRect().top;
  const pts = new Set();
  const add = (el) => {
    const r = el.getBoundingClientRect();
    pts.add(Math.round((r.top - hostTop) * scale));
  };
  content.querySelectorAll(':scope > section').forEach(add);
  content.querySelectorAll('[data-safe]').forEach(add);
  // line-level boundaries so an oversized block can still split cleanly
  content.querySelectorAll('li, .kvrow, .card-line, .link-row, .callout p, .para-text, tbody tr, .gal-item, .doc-card, .yr-chip, .fact').forEach(add);
  return [...pts].sort((a, b) => a - b);
}

function sliceToPdf(canvas, pdf, scale, host, { newPageFirst = false } = {}) {
  const pageContentPx = Math.round(BODY_MM * (PAGE_W_PX / PAGE_W_MM) * scale); // usable px height
  const boundaries = [0, ...safeBoundaries(host, scale), canvas.height];
  const total = canvas.height;
  let y = 0;
  const pages = [];
  while (y < total) {
    let end = Math.min(y + pageContentPx, total);
    if (end < total) {
      let best = -1;
      for (const b of boundaries) { if (b > y && b <= end) best = b; else if (b > end) break; }
      if (best > y) end = best;
    }
    pages.push([y, end]);
    y = end;
  }
  pages.forEach(([start, end], i) => {
    const h = end - start;
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = h;
    const ctx = slice.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, start, canvas.width, h, 0, 0, canvas.width, h);
    const img = slice.toDataURL('image/jpeg', 0.94);
    if (i > 0 || newPageFirst) pdf.addPage();
    pdf.addImage(img, 'JPEG', MARGIN_MM, MARGIN_MM, PAGE_W_MM - 2 * MARGIN_MM, (h / scale) * (PAGE_W_MM / PAGE_W_PX), undefined, 'FAST');
  });
  return { count: pages.length, pages };
}

function addCoverPage(pdf, canvas) {
  const wMm = PAGE_W_MM - 2 * MARGIN_MM;
  let hMm = wMm * (canvas.height / canvas.width);
  if (hMm > BODY_MM) hMm = BODY_MM;
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', MARGIN_MM, MARGIN_MM, wMm, hMm, undefined, 'FAST');
}

function drawFooters(pdf) {
  const pages = pdf.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.2);
    pdf.line(MARGIN_MM, PAGE_H_MM - FOOTER_MM + 2, PAGE_W_MM - MARGIN_MM, PAGE_H_MM - FOOTER_MM + 2);
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(7.5);
    pdf.text('Swastik Srijan Foundation Samiti  |  Organisation Profile', MARGIN_MM, PAGE_H_MM - 6);
    pdf.text(`${p} / ${pages}`, PAGE_W_MM - MARGIN_MM, PAGE_H_MM - 6, { align: 'right' });
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(6.5);
    pdf.text(`Document ID: ${PROFILE_DOC.code}`, PAGE_W_MM / 2, PAGE_H_MM - 6, { align: 'center' });
  }
}

// Map each rendered link row to its PDF page + position and add jsPDF link
// annotations, so social links are clickable in the exported PDF.
function addLinkAnnotations(pdf, host, scale, pages, pageOffset) {
  const hostTop = host.getBoundingClientRect().top;
  const links = host.querySelectorAll('a[data-link]');
  links.forEach((a) => {
    const r = a.getBoundingClientRect();
    const yPx = (r.top - hostTop) * scale;
    const hPx = r.height * scale;
    const wPx = r.width * scale;
    let page = 0, acc = 0;
    for (let i = 0; i < pages.length; i++) {
      const [s, e] = pages[i];
      if (yPx >= s && yPx < e) { page = i + 1; acc = s; break; }
      acc = e;
    }
    if (!page) return;
    const localTopMm = ((yPx - acc) / scale) * (PAGE_W_MM / PAGE_W_PX) + MARGIN_MM;
    const hMm = (hPx / scale) * (PAGE_W_MM / PAGE_W_PX);
    const wMm = (wPx / scale) * (PAGE_W_MM / PAGE_W_PX);
    pdf.setPage(page + pageOffset);
    pdf.link(MARGIN_MM, localTopMm, wMm, hMm, { url: a.getAttribute('data-link') });
  });
}

async function renderHost(html) {
  const host = document.createElement('div');
  host.setAttribute('data-ssf-profile', 'pdf');
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${PAGE_W_PX}px;background:#fff;z-index:-1;`;
  const fontCss = await devaFontFaceCss();
  host.innerHTML = `<style>${fontCss}${STYLE}</style>${html}`;
  document.body.appendChild(host);
  try {
    await ensureFonts();
    await preloadImages(host);
    const canvas = await html2canvas(host, {
      scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false,
      width: PAGE_W_PX, windowWidth: PAGE_W_PX,
    });
    return { canvas, host };
  } catch (e) {
    host.remove();
    throw e;
  }
}

/** Render the full profile (cover + body) to a tall canvas. Kept for reuse. */
export async function renderProfileCanvas({ lang = 'both' } = {}) {
  setContactBlock();
  const inner = `${renderCover(lang)}<div class="content">${PROFILE_RENDER.sections
    .map((s) => renderSection(s, lang)).join('')}${renderClosing(lang)}</div>`;
  return renderHost(`<div class="doc">${inner}</div>`);
}

/** Render the profile to a jsPDF document (not yet saved). */
export async function buildProfilePdf({ lang = 'both' } = {}) {
  setContactBlock();
  const cover = await renderHost(buildCoverHtml(lang));
  let body;
  try {
    body = await renderHost(buildBodyHtml(lang));
    const scale = body.canvas.width / PAGE_W_PX;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    addCoverPage(pdf, cover.canvas);                 // page 1 = cover
    const { pages } = sliceToPdf(body.canvas, pdf, scale, body.host, { newPageFirst: true });
    drawFooters(pdf);
    addLinkAnnotations(pdf, body.host, scale, pages, 1);
    return pdf;
  } finally {
    cover.host.remove();
    if (body) body.host.remove();
  }
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