import { VOLUNTEER_TEMPLATE_COLUMNS, VOLUNTEER_TEMPLATE_SAMPLE } from './volunteerTemplate';

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

/**
 * Download the Volunteer register import template (.xlsx): a bilingual header
 * row (English key + Hindi label) and one example row so the format is obvious.
 */
export async function downloadVolunteerTemplate() {
  const mod = await import('exceljs');
  const ExcelJS = mod.default || mod;
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SSF-IMS';
  const ws = wb.addWorksheet('Volunteers');
  ws.columns = VOLUNTEER_TEMPLATE_COLUMNS.map((c) => ({
    header: `${c.en}${c.required ? ' *' : ''} | ${c.hi}`,
    key: c.key,
    width: Math.max(16, c.en.length + 8),
  }));
  const hr = ws.getRow(1);
  hr.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  hr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
  hr.height = 20;
  const row = {};
  VOLUNTEER_TEMPLATE_COLUMNS.forEach((c) => { row[c.key] = VOLUNTEER_TEMPLATE_SAMPLE[c.key] || ''; });
  ws.addRow(row);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  const buf = await wb.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    'ssf-volunteer-import-template.xlsx'
  );
  return true;
}

const normHeader = (s) => String(s || '').split('|')[0].replace(/\*/g, '').trim().toLowerCase();

/**
 * Read an uploaded .xlsx into volunteer rows keyed by the model field names.
 * Columns are matched by the English header (Hindi is ignored), so a filled
 * template round-trips. Unknown columns are ignored; blank rows are dropped.
 */
export async function parseVolunteerWorkbook(file) {
  const mod = await import('exceljs');
  const ExcelJS = mod.default || mod;
  const wb = new ExcelJS.Workbook();
  const buf = await file.arrayBuffer();
  await wb.xlsx.load(buf);
  const ws = wb.worksheets[0];
  if (!ws) return [];
  const headerByEn = {};
  VOLUNTEER_TEMPLATE_COLUMNS.forEach((c) => { headerByEn[normHeader(c.en)] = c.key; });
  const colKey = {};
  ws.getRow(1).eachCell((cell, col) => {
    const key = headerByEn[normHeader(cell.value)];
    if (key) colKey[col] = key;
  });
  const rows = [];
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const out = {};
    let filled = false;
    Object.entries(colKey).forEach(([col, key]) => {
      const v = row.getCell(Number(col)).value;
      const val = v == null ? '' : (typeof v === 'object' && v.text != null ? v.text : v);
      const s = String(val == null ? '' : val).trim();
      if (s) { out[key] = s; filled = true; }
    });
    if (filled && (out.fullName || out.email || out.mobile)) rows.push(out);
  });
  return rows;
}
