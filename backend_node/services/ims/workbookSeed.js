// Seeds the official SSF Financial Records workbook (data/officialRegisters.json)
// into the SSF-IMS finance masters, plus the CA-signed audit years.
//
// The workbook's Master Voucher (190) is exactly Donation register (93) +
// Expense register (97); Membership (17) is a subset of donations, and the Cash
// Book / Bank Book / Cash & Bank Book are split views of the same events. So we
// seed ONE canonical IMS transaction per Donation and per Expense row — nothing
// is counted twice.
//
// Idempotent: keyed by sourceRecordId, so re-running never duplicates. This is
// what lets a brand-new database populate its finance registers by itself.
const { Op } = require('sequelize');
const { models, sequelize } = require('../../models/ims');

const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };
const _fyOf = (value) => {
  const s = String(value || '').slice(0, 10);
  const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7));
  if (!y || !m) return '';
  const start = m >= 4 ? y : y - 1;
  return start + '-' + String((start + 1) % 100).padStart(2, '0');
};

const _R = { in: 'in', out: 'out' };
const isInKind = (mode) => /support/i.test(String(mode || ''));
const sourceModuleOf = (regId) => ({ donations: 'donations', membership: 'membership', expenses: 'expenses', cash: 'cash', bank: 'bank', cashbank: 'cashbank', vouchers: 'vouchers' }[regId] || regId);

/** Resolve (or create) the IMS financial year master row for a label like 2025-26. */
async function ensureFinancialYear(label, transaction) {
  if (!label) return null;
  const start = Number(String(label).split('-')[0]);
  if (!start) return null;
  let fy = await models.ImsFinancialYear.findOne({ where: { label }, transaction });
  if (!fy) {
    fy = await models.ImsFinancialYear.create({
      recordId: `FY-${label}`, label,
      startDate: `${start}-04-01`, endDate: `${start + 1}-03-31`,
      isCurrent: false, createdByName: 'Official Workbook',
    }, { transaction });
  }
  return fy;
}

// Returns { status, created, skipped, auditYearsCreated }.
async function seedOfficialWorkbook({ force = false, actor = 'system' } = {}) {
  const t = await sequelize.transaction();
  try {
    if (force) {
      await models.ImsTransaction.destroy({ where: { sourceModule: { [Op.in]: ['donations', 'expenses', 'opening'] } }, transaction: t });
    }
    const data = require('../../data/officialRegisters.json');
    const CANONICAL = ['donations', 'expenses'];
    let created = 0, skipped = 0;
    for (const reg of (data.registers || [])) {
      if (!CANONICAL.includes(reg.id)) continue;
      const module = sourceModuleOf(reg.id);
      const col = (name) => reg.columns.indexOf(name);
      const ci = { date: col('Date'), particulars: col('Particulars'), memberName: col('Member Name'), type: col('Type'), category: col('Category'), mode: col('Mode'), amount: col('Amount (₹)'), ref: col('Bank Reference / UTR') };
      let seq = 0;
      for (const row of (reg.rows || [])) {
        seq += 1;
        const srcId = 'SSF-' + String(module).slice(0, 3).toUpperCase() + '-' + String(row[ci.date] || '').replace(/-/g, '') + '-' + String(seq).padStart(5, '0');
        const exists = await models.ImsTransaction.findOne({ where: { sourceRecordId: srcId, sourceModule: module }, attributes: ['id'], transaction: t });
        if (exists) { skipped += 1; continue; }
        const date = String(row[ci.date] || '').slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { skipped += 1; continue; }
        const amount = num(row[ci.amount]);
        if (!amount) { skipped += 1; continue; }
        const mode = ci.mode >= 0 ? (row[ci.mode] || 'Cash') : 'Cash';
        const inKind = reg.id === 'expenses' && isInKind(mode);
        const direction = reg.id === 'donations' ? _R.in : (inKind ? 'none' : _R.out);
        const fyLabel = _fyOf(date);
        const fy = await ensureFinancialYear(fyLabel, t);
        const transactionNo = 'FIN-' + fyLabel + '-' + String(seq).padStart(6, '0');
        const party = ci.particulars >= 0 ? (row[ci.particulars] || '') : (ci.memberName >= 0 ? row[ci.memberName] : '');
        const typeOf = reg.id === 'donations' ? (/contribution/i.test(String(row[ci.type] || '')) ? 'membership' : 'donation') : 'expense';
        await models.ImsTransaction.create({
          recordId: transactionNo, transactionNo,
          txnDate: date, financialYearId: fy ? fy.id : null,
          transactionType: typeOf, amount, direction, paymentMode: mode,
          sourceModule: module, sourceRecordId: srcId, needsReview: false,
          createdByName: 'Official Workbook',
          data: { importedFrom: 'official-workbook', register: reg.id, particulars: party, reference: ci.ref >= 0 ? (row[ci.ref] || null) : null, inKind },
        }, { transaction: t });
        created += 1;
      }
    }

    // Opening balances from the audited summary (dated 1 April) so the running
    // cash/bank balances are meaningful and can be compared to the audited close.
    const summaryMap = {};
    (data.auditSummary || []).forEach((x) => { summaryMap[x.particulars] = x.amount; });
    const openings = [
      { label: 'Opening Cash Balance', mode: 'Cash' },
      { label: 'Opening Bank Balance (UBI)', mode: 'Bank' }
    ];
    for (const op of openings) {
      const amt = num(summaryMap[op.label]);
      if (!amt) continue;
      const srcId = 'SSF-OPN-' + op.mode.toUpperCase() + '-00001';
      const exists = await models.ImsTransaction.findOne({ where: { sourceRecordId: srcId }, attributes: ['id'], transaction: t });
      if (exists) { skipped += 1; continue; }
      const fy = await ensureFinancialYear('2025-26', t);
      const transactionNo = 'FIN-2025-26-OPN-' + op.mode.toUpperCase();
      await models.ImsTransaction.create({
        recordId: transactionNo, transactionNo,
        txnDate: '2025-04-01', financialYearId: fy ? fy.id : null,
        transactionType: 'opening', amount: amt, direction: 'in', paymentMode: op.mode,
        sourceModule: 'opening', sourceRecordId: srcId, needsReview: false,
        createdByName: 'Official Workbook',
        data: { importedFrom: 'official-workbook', opening: true, label: op.label },
      }, { transaction: t });
      created += 1;
    }

    // Seed the FY 2025-26 audit register entry with the audited summary figures.
    const fyLabel = '2025-26';
    let auditYearsCreated = 0;
    const existingYear = await models.ImsAudit.findOne({ where: { recordId: 'AUD-2025-26-001' }, transaction: t });
    if (!existingYear) {
      const summary = {};
      (data.auditSummary || []).forEach((x) => { summary[x.particulars] = x.amount; });
      const fy = await ensureFinancialYear(fyLabel, t);
      await models.ImsAudit.create({
        recordId: 'AUD-2025-26-001', auditType: 'Statutory', financialYearId: fy ? fy.id : null,
        auditor: 'CA Kapil Tiwari', status: 'active', createdBy: actor,
        data: {
          assessmentYear: '2026-27', auditStatus: 'Completed', submissionStatus: 'To Be Confirmed',
          currentVersion: 'Final', summary,
          remarks: 'Seeded from the official Financial Records workbook Audit Summary.',
        },
      }, { transaction: t });
      auditYearsCreated += 1;
    }

    // Seed every audited year (from the CA-signed statements) into the audit
    // register, so the whole history lives in fields.
    try {
      const reports = require('../../data/auditReports.json');
      for (const r of (reports.reports || [])) {
        const recordId = 'AUD-' + r.financialYear + '-001';
        const exists = await models.ImsAudit.findOne({ where: { recordId }, attributes: ['id'], transaction: t });
        if (exists) continue;
        const summary = {
          'Income for the year': r.incomeTotal,
          'Expenditure for the year': r.expenditureTotal,
          'Opening Cash Balance': r.openingBalances && r.openingBalances.cash,
          'Opening Bank Balance (UBI)': r.openingBalances && r.openingBalances.bank,
          'Total Opening Balance': r.openingBalances && r.openingBalances.total,
          'Closing Cash Balance': r.closingBalances && r.closingBalances.cash,
          'Closing Bank Balance (UBI)': r.closingBalances && r.closingBalances.bank,
          'General Fund Opening Balance': r.generalFund && r.generalFund.opening,
          'General Fund Closing Balance': r.generalFund && r.generalFund.closing,
          'Surplus/Deficit transferred to Balance Sheet': r.result && (r.result.type === 'surplus' ? r.result.amount : -r.result.amount)
        };
        const fy = await ensureFinancialYear(r.financialYear, t);
        await models.ImsAudit.create({
          recordId, auditType: 'Statutory', financialYearId: fy ? fy.id : null,
          auditor: (r.auditor && r.auditor.partner) || null, status: 'active', createdBy: actor,
          data: {
            assessmentYear: r.assessmentYear || null, auditStatus: r.status || 'Audited',
            auditFirm: (r.auditor && r.auditor.firm) || null,
            membershipNo: (r.auditor && r.auditor.membershipNo) || null,
            auditorContact: (r.auditor && r.auditor.phone) || null,
            auditorEmail: (r.auditor && r.auditor.email) || null,
            reportDate: (r.auditor && r.auditor.reportDate) || null,
            submissionStatus: 'Filed', currentVersion: 'Final', summary,
            remarks: 'Transcribed from CA-signed audited statements (' + r.sourceFile + ').',
          },
        }, { transaction: t });
        auditYearsCreated += 1;
      }
    } catch (e) { console.error('auditReports seed skipped:', e.message); }

    await t.commit();
    return { status: 'ok', created, skipped, auditYearsCreated };
  } catch (e) {
    try { await t.rollback(); } catch (_) {}
    throw e;
  }
}

module.exports = { seedOfficialWorkbook };
