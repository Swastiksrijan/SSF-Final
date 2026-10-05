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

  doc.save(`ssf-ims-${String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}.pdf`);
  return true;
}
