// SSF-IMS PDF export — bilingual header, brand colours, auto table.
import jsPDF from 'jspdf';

const NAVY = [0, 35, 68];
const ORANGE = [255, 102, 0];
const GREY = [100, 116, 139];

/** Export a list of records to a branded, paginated PDF table. */
export function exportRecordsPdf({ title, subtitle, records, columns, lang = 'en' }) {
  if (!records || !records.length) return false;
  const cols = columns || Object.keys(records[0]).filter((k) => typeof records[0][k] !== 'object').slice(0, 8);
  const doc = new jsPDF({ orientation: 'landscape' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const header = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageW, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text('Swastik Srijan Foundation Samiti · SSF-IMS', 14, 9);
    doc.setFontSize(9);
    doc.text('One Organisation • One Record • Complete Accountability', 14, 15);
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageW - 14, 15, { align: 'right' });
  };

  const tableHead = (y) => {
    doc.setFillColor(...ORANGE);
    doc.rect(14, y, pageW - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    const colW = (pageW - 28) / cols.length;
    cols.forEach((c, i) => doc.text(String(c).toUpperCase().slice(0, 18), 16 + i * colW, y + 5.5));
    return y + 8;
  };

  header();
  doc.setTextColor(...NAVY);
  doc.setFontSize(15);
  doc.text(String(title), 14, 32);
  if (subtitle) {
    doc.setTextColor(...GREY);
    doc.setFontSize(10);
    doc.text(String(subtitle), 14, 38);
  }
  doc.setTextColor(...GREY);
  doc.setFontSize(9);
  doc.text(`${records.length} records · ${lang === 'hi' ? 'कुल' : 'total'}`, 14, 44);

  let y = tableHead(50);
  const colW = (pageW - 28) / cols.length;
  doc.setFontSize(8.5);
  records.forEach((r, idx) => {
    if (y > pageH - 16) {
      doc.addPage();
      header();
      y = tableHead(28);
      doc.setFontSize(8.5);
    }
    if (idx % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(14, y, pageW - 28, 7, 'F');
    }
    doc.setTextColor(30, 41, 59);
    cols.forEach((c, i) => {
      const v = r[c] == null ? '' : String(r[c]);
      doc.text(v.slice(0, 30), 16 + i * colW, y + 5);
    });
    y += 7;
  });

  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setTextColor(...GREY);
    doc.setFontSize(8);
    doc.text(`SSF-IMS · ${p} / ${pages}`, pageW - 14, pageH - 6, { align: 'right' });
  }

  doc.save(`ssf-ims-${String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`);
  return true;
}

/** Strip inline markdown markers for plain-text PDF rendering. */
const plain = (s) => String(s).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\*([^*]+)\*/g, '$1');

/**
 * Export a long markdown document (the Policy Manual) to a branded, paginated
 * PDF with a cover block, table of contents and readable chapter sections.
 */
export async function exportManualPdf({ title, subtitle, meta = [], toc = [], markdown, filename }) {
  const { parseBlocks } = await import('./markdown');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;
  const contentW = W - M * 2;
  let y = 0;

  const band = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, W, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Swastik Srijan Foundation · SSF-IMS', M, 9);
    doc.setFontSize(7.5);
    doc.text('One Organisation • One Record • Complete Accountability', W - M, 9, { align: 'right' });
  };
  const newPage = () => { doc.addPage(); band(); y = 22; };
  const ensure = (need) => { if (y + need > H - 16) newPage(); };

  // Cover block
  band();
  y = 26;
  doc.setTextColor(...NAVY);
  doc.setFontSize(19);
  doc.text(doc.splitTextToSize(plain(title), contentW), M, y);
  y += doc.splitTextToSize(plain(title), contentW).length * 8 + 2;
  if (subtitle) {
    doc.setTextColor(...ORANGE);
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(plain(subtitle), contentW), M, y);
    y += 8;
  }
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.8);
  doc.line(M, y, M + 40, y);
  y += 6;
  doc.setFontSize(9);
  meta.forEach((m) => {
    const lines = doc.splitTextToSize(plain(m), contentW);
    doc.setTextColor(...GREY);
    doc.text(lines, M, y);
    y += lines.length * 4.6 + 0.6;
  });
  y += 4;

  if (toc.length) {
    ensure(14);
    doc.setTextColor(...NAVY);
    doc.setFontSize(12);
    doc.text('Contents / विषय-सूची', M, y);
    y += 7;
    doc.setFontSize(9);
    toc.forEach((t, i) => {
      ensure(6);
      doc.setTextColor(40, 50, 65);
      const lines = doc.splitTextToSize(`${i + 1}. ${plain(t)}`, contentW);
      doc.text(lines, M, y);
      y += lines.length * 4.6 + 0.4;
    });
  }

  newPage();

  const blocks = parseBlocks(markdown || '');
  blocks.forEach((b) => {
    if (b.type === 'hr') { ensure(4); doc.setDrawColor(225, 230, 236); doc.setLineWidth(0.3); doc.line(M, y, W - M, y); y += 4; return; }
    if (b.type === 'heading') {
      const size = b.level === 1 ? 13 : b.level === 2 ? 11 : 10;
      ensure(size * 0.6 + 4);
      y += b.level === 1 ? 3 : 1.5;
      doc.setTextColor(...NAVY);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(plain(b.text), contentW);
      doc.text(lines, M, y);
      y += lines.length * (size * 0.45) + 2;
      return;
    }
    if (b.type === 'ul' || b.type === 'ol') {
      doc.setFontSize(9);
      b.items.forEach((it, i) => {
        const prefix = b.type === 'ol' ? `${i + 1}. ` : '• ';
        const lines = doc.splitTextToSize(prefix + plain(it), contentW - 4);
        ensure(lines.length * 4.6);
        doc.setTextColor(40, 50, 65);
        doc.text(lines, M + 3, y);
        y += lines.length * 4.6 + 0.6;
      });
      y += 1;
      return;
    }
    if (b.type === 'table') {
      doc.setFontSize(8.5);
      b.rows.forEach((row, ri) => {
        const text = row.join('   |   ');
        const lines = doc.splitTextToSize(plain(text), contentW);
        ensure(lines.length * 4.4 + 1);
        doc.setTextColor(ri === 0 ? 0 : 40, ri === 0 ? 35 : 50, ri === 0 ? 68 : 65);
        doc.text(lines, M, y);
        y += lines.length * 4.4 + 1;
      });
      y += 1.5;
      return;
    }
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(plain(b.text), contentW);
    ensure(lines.length * 4.8);
    doc.setTextColor(40, 50, 65);
    doc.text(lines, M, y);
    y += lines.length * 4.8 + 1.6;
  });

  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setTextColor(...GREY);
    doc.setFontSize(8);
    doc.text(`SSF-POL-MASTER-001 · ${p} / ${pages}`, W - M, H - 8, { align: 'right' });
  }
  doc.save(filename || 'ssf-policy-manual.pdf');
  return true;
}
