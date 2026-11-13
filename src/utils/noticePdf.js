// SSF — official "कारण बताओ नोटिस" (show-cause notice) PDF.
//
// jsPDF cannot shape Devanagari (conjuncts break), so — exactly like the
// letterhead builder — the notice is laid out as real HTML, the browser shapes
// the Hindi, html2canvas rasterises it, and jsPDF assembles true A4 pages. The
// Devanagari face is bundled and embedded, so the Hindi renders offline and on
// networks that block Google Fonts.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../assets/new-logo.png';
import latinUrl from '../assets/fonts/PlusJakartaSans-Variable.ttf?url';
import devaRegularUrl from '../assets/fonts/NotoSansDevanagari-Regular.ttf?url';
import devaBoldUrl from '../assets/fonts/NotoSansDevanagari-Bold.ttf?url';

const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const MARGIN_MM = 14;
const CONTENT_W_MM = PAGE_W_MM - MARGIN_MM * 2;
const CONTENT_H_MM = PAGE_H_MM - MARGIN_MM * 2;
const PAGE_W_PX = 794; // A4 @ 96dpi

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

async function ensureFonts() {
  try {
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.all([
      "700 18px 'SSFLatin'", "400 13px 'SSFLatin'",
      "400 13px 'SSFDevanagari'", "700 14px 'SSFDevanagari'",
    ].map((f) => document.fonts.load(f).catch(() => {})));
  } catch { /* fonts optional */ }
}

const preloadImages = (host) => Promise.all(
  [...host.querySelectorAll('img')].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))),
);

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const BASE_CSS = `
  .nt{font-family:'SSFLatin','SSFDevanagari',system-ui,'Segoe UI',Arial,sans-serif;color:#172b3a;font-size:14px;line-height:1.7;padding:0;box-sizing:border-box}
  .nt-head{display:flex;align-items:center;gap:18px;border-bottom:3px solid #176447;padding-bottom:16px}
  .nt-head img{width:84px;height:84px;object-fit:contain}
  .nt-head .en{font-size:21px;font-weight:800;color:#12345A;font-family:'SSFLatin'}
  .nt-head .hi{font-size:16px;font-weight:700;color:#176447;font-family:'SSFDevanagari'}
  .nt-head .sub{font-size:12px;color:#64748b}
  .nt-meta{display:flex;justify-content:space-between;gap:12px;font-size:13px;margin-top:18px}
  .nt-title{text-align:center;color:#12345A;font-size:19px;margin:22px 0 16px;font-family:'SSFDevanagari'}
  .nt-body{white-space:pre-wrap;font-family:'SSFDevanagari','SSFLatin',sans-serif}
  .nt-foot{border-top:1px solid #d7dee8;margin-top:28px;padding-top:12px;font-size:12px;color:#64748b;font-family:'SSFDevanagari'}`;

// The exact text an admin previews, so the PDF matches the preview one-to-one.
function noticeLines(row) {
  const due = row.replyDueAt ? new Date(row.replyDueAt).toLocaleString('hi-IN', { dateStyle: 'long', timeStyle: 'short' }) : 'जवाब की तारीख दर्ज नहीं';
  return row.status !== 'draft' && row.noticeText ? row.noticeText : [
    'प्रति: ' + row.personName,
    'सदस्य ID: ' + (row.memberId || 'रजिस्टर में उपलब्ध नहीं / पुष्टि अपेक्षित'),
    'वर्तमान पद: ' + (row.currentDesignation || 'रिकॉर्ड अनुसार'),
    'संपर्क ईमेल: ' + row.email,
    'विषय: अपना पक्ष/स्पष्टीकरण प्रस्तुत करने के संबंध में।',
    row.noticeText ? 'अतिरिक्त विवरण: ' + row.noticeText : '',
    'लागू नियम/उप-नियम: ' + row.bylawClause,
    'प्रस्तावित कार्रवाई का कारण: ' + row.grounds,
    'तथ्य एवं उपलब्ध रिकॉर्ड: ' + row.factualSummary,
    'जवाब की अंतिम तारीख: ' + due,
    'ऑनलाइन जवाब लिंक: नोटिस जारी होने पर जोड़ा जाएगा।',
    'यदि आप व्यक्तिगत/ऑनलाइन सुनवाई चाहते हैं, तो जवाब में इसकी मांग और सुविधाजनक संपर्क विवरण लिखें।',
    'यह नोटिस केवल अपना पक्ष रखने का अवसर है; यह दोष सिद्धि, सदस्यता समाप्ति या पद से हटाने का अंतिम आदेश नहीं है।',
  ].filter(Boolean).join('\n\n');
}

function noticeHtml(row) {
  const logo = new URL(logoImg, window.location.origin).href;
  const date = new Date().toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata' });
  return `<div class="nt">
    <header class="nt-head"><img src="${esc(logo)}" alt="SSF Logo"><div><div class="en">SWASTIK SRIJAN FOUNDATION SAMITI</div><div class="hi">स्वास्तिक सृजन फाउंडेशन समिति</div><div class="sub">आधिकारिक सूचना / Official Communication</div></div></header>
    <div class="nt-meta"><b>नोटिस संदर्भ: ${esc(row.noticeReference || 'ड्राफ्ट')}</b><b>दिनांक: ${esc(date)}</b></div>
    <h2 class="nt-title">कारण बताओ नोटिस</h2>
    <div class="nt-body">${esc(noticeLines(row))}</div>
    <div class="nt-foot">Swastik Srijan Foundation Samiti | यह नोटिस संस्था के अभिलेख हेतु जारी किया गया है।</div>
  </div>`;
}

/** Build the notice as a real multi-page A4 PDF. */
export async function buildNoticePdf(row) {
  const host = document.createElement('div');
  host.setAttribute('data-ssf-notice', 'pdf');
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${PAGE_W_PX}px;background:#ffffff;z-index:-1;`;
  host.innerHTML = `<style>${await fontFaceCss()}${BASE_CSS}</style>${noticeHtml(row)}`;
  document.body.appendChild(host);
  try {
    await ensureFonts();
    await preloadImages(host);
    const canvas = await html2canvas(host, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, width: PAGE_W_PX, windowWidth: PAGE_W_PX });
    const pxPerMm = canvas.width / CONTENT_W_MM;
    const pageContentPx = Math.round(CONTENT_H_MM * pxPerMm);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    let y = 0; let first = true;
    while (y < canvas.height) {
      const h = Math.min(pageContentPx, canvas.height - y);
      const slice = document.createElement('canvas');
      slice.width = canvas.width; slice.height = h;
      const ctx = slice.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      if (!first) pdf.addPage();
      first = false;
      pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', MARGIN_MM, MARGIN_MM, CONTENT_W_MM, h / pxPerMm, undefined, 'FAST');
      y += h;
    }
    return pdf;
  } finally {
    host.remove();
  }
}

export function noticeFileName(row) {
  const safe = String(row.noticeReference || 'SSF-NOTICE').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${safe}-${new Date().toISOString().slice(0, 10)}.pdf`;
}

export async function downloadNoticePdf(row) {
  const pdf = await buildNoticePdf(row);
  pdf.save(noticeFileName(row));
}
