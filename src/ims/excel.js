// SSF-IMS Excel (.xlsx) export — brand-styled, lazily loads exceljs so the
// ~1MB library is only fetched when the user actually clicks "Excel".
const NAVY = 'FF002344';

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/** Export records to a styled .xlsx workbook (frozen header + autofilter). */
export async function exportRecordsExcel({ title, records, columns, sheetName }) {
  if (!records || !records.length) return false;
  const mod = await import('exceljs');
  const ExcelJS = mod.default || mod;
  const cols = columns || Object.keys(records[0]).filter((k) => typeof records[0][k] !== 'object');
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SSF-IMS';
  wb.created = new Date();
  const ws = wb.addWorksheet(String(sheetName || title || 'Data').slice(0, 30));
  ws.columns = cols.map((c) => ({ header: String(c), key: c, width: Math.min(42, Math.max(14, String(c).length + 6)) }));

  const hr = ws.getRow(1);
  hr.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  hr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
  hr.alignment = { vertical: 'middle' };
  hr.height = 20;

  records.forEach((r) => {
    const row = {};
    cols.forEach((c) => {
      const v = r[c];
      row[c] = v == null ? '' : (typeof v === 'object' ? JSON.stringify(v) : v);
    });
    ws.addRow(row);
  });

  ws.autoFilter = { from: 'A1', to: { row: 1, column: cols.length } };
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  const buf = await wb.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `ssf-ims-${slug(title)}-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
  return true;
}
