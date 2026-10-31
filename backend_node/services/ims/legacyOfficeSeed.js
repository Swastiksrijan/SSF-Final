// Seeds the two legacy SSF Digital Office finance masters that live in
// DigitalOfficeRecord (not the IMS tables), so a brand-new database has them
// too — the Digital Office screens still read these:
//
//   • Chart of Accounts  (data/chartOfAccounts.json) -> module 'chartOfAccounts'
//   • Financial Year Master (data/auditReports.json) -> module 'fyMaster'
//
// Idempotent: a head/year is matched on its code/FY, so re-running never
// duplicates and an archived head is never resurrected.
const sequelize = require('../../config/database');
const DigitalOfficeRecord = require('../../models/DigitalOfficeRecord');
const DigitalOfficeAudit = require('../../models/DigitalOfficeAudit');

const prefix = { chartOfAccounts: 'COA', fyMaster: 'FY' };

const makeId = async (module, transaction) => {
  const p = prefix[module] || 'REC';
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let sequence = (await DigitalOfficeRecord.count({ where: { module }, transaction })) + 1;
  let candidate = `SSF-${p}-${stamp}-${String(sequence).padStart(5, '0')}`;
  while (await DigitalOfficeRecord.findOne({ where: { recordId: candidate }, attributes: ['id'], transaction })) {
    sequence += 1;
    candidate = `SSF-${p}-${stamp}-${String(sequence).padStart(5, '0')}`;
  }
  return candidate;
};

const fyEndDate = (fy) => { const [, b] = String(fy).split('-'); const endY = 2000 + Number(b); return endY + '-03-31'; };

async function seedChartOfAccounts(actor) {
  const coa = require('../../data/chartOfAccounts.json');
  const existing = await DigitalOfficeRecord.findAll({ where: { module: 'chartOfAccounts' } });
  // Include archived heads too: an archived head must never be resurrected.
  const have = new Set(existing.map((r) => String((r.data && r.data.code) || '').toUpperCase()));
  let created = 0;
  for (const h of (coa.heads || [])) {
    if (have.has(String(h.code).toUpperCase())) continue;
    const recordId = await makeId('chartOfAccounts');
    await DigitalOfficeRecord.create({
      recordId, module: 'chartOfAccounts', recordType: h.type || 'head', status: 'active',
      recordDate: new Date(), personId: null, createdBy: actor, createdByName: 'SSF Admin',
      data: { code: h.code, nameEn: h.nameEn, nameHi: h.nameHi, type: h.type, group: h.group, status: 'Active', effectiveDate: new Date().toISOString().slice(0, 10), remarks: 'Seeded from SSF Chart of Accounts' }
    });
    created += 1;
  }
  return { created, total: (coa.heads || []).length };
}

async function seedFyMaster(actor) {
  const audit = require('../../data/auditReports.json');
  const reports = [...(audit.reports || [])].sort((a, b) => String(a.financialYear).localeCompare(String(b.financialYear)));
  const existing = await DigitalOfficeRecord.findAll({ where: { module: 'fyMaster' } });
  const have = new Set(existing.map((r) => String((r.data && r.data.fy) || '').trim()));
  const carryRows = [];
  for (const rep of reports) {
    const fy = rep.financialYear;
    const ob = rep.openingBalances || {};
    const cb = rep.closingBalances || {};
    carryRows.push({ fy, opening: { cash: ob.cash || 0, bank: ob.bank || 0, total: ob.total || 0 }, closing: { cash: cb.cash || 0, bank: cb.bank || 0, total: cb.total || 0 }, generalFund: rep.generalFund || {}, status: rep.status || 'Audited', auditor: rep.auditor || null });
  }
  // The FY immediately after the last audited year opens with that year's closing.
  const last = reports[reports.length - 1];
  if (last) {
    const [, b] = String(last.financialYear).split('-');
    const nextStart = 2000 + Number(b);
    const nextFy = nextStart + '-' + String((nextStart + 1) % 100).padStart(2, '0');
    const cb = last.closingBalances || {};
    carryRows.push({ fy: nextFy, opening: { cash: cb.cash || 0, bank: cb.bank || 0, total: cb.total || 0 }, closing: null, generalFund: { opening: (last.generalFund || {}).closing || 0 }, status: 'Books', auditor: null });
  }
  let created = 0;
  for (const row of carryRows) {
    if (have.has(row.fy)) continue;
    const recordId = await makeId('fyMaster');
    await DigitalOfficeRecord.create({
      recordId, module: 'fyMaster', recordType: 'Financial Year', status: 'active',
      recordDate: new Date(fyEndDate(row.fy)), personId: null,
      createdBy: actor, createdByName: 'SSF Admin',
      data: {
        fy: row.fy,
        labelEn: 'Financial Year ' + row.fy,
        labelHi: 'वित्तीय वर्ष ' + row.fy,
        openingCash: row.opening.cash, openingBank: row.opening.bank, openingTotal: row.opening.total,
        closingCash: row.closing ? row.closing.cash : null, closingBank: row.closing ? row.closing.bank : null, closingTotal: row.closing ? row.closing.total : null,
        generalFundOpening: (row.generalFund || {}).opening || null, generalFundClosing: (row.generalFund || {}).closing || null,
        carrySource: 'Audited closing of previous year',
        fyStatus: row.status, lockState: 'Open',
        auditor: row.auditor ? (row.auditor.firm || '') : '',
        effectiveDate: fyEndDate(row.fy), remarks: 'Seeded from audited dataset'
      }
    });
    created += 1;
  }
  return { created, total: carryRows.length };
}

// Returns { chartOfAccounts, fyMaster } counts created.
async function seedLegacyOffice({ actor = 'system' } = {}) {
  const out = { chartOfAccounts: 0, fyMaster: 0 };
  const coa = await seedChartOfAccounts(actor);
  out.chartOfAccounts = coa.created;
  if (coa.created) {
    await DigitalOfficeAudit.create({ action: 'seed', module: 'chartOfAccounts', recordId: 'COA', actor, details: { created: coa.created } });
  }
  const fy = await seedFyMaster(actor);
  out.fyMaster = fy.created;
  if (fy.created) {
    await DigitalOfficeAudit.create({ action: 'seed', module: 'fyMaster', recordId: 'FYMASTER', actor, details: { created: fy.created } });
  }
  return out;
}

module.exports = { seedLegacyOffice };
