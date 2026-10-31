// Seeds the official SSF Financial Records workbook (data/officialRegisters.json)
// into the canonical finance tables, plus the CA-signed audit years.
//
// The workbook's Master Voucher (190) is exactly Donation register (93) +
// Expense register (97); Membership (17) is a subset of donations, and the Cash
// Book / Bank Book / Cash & Bank Book are split views of the same events. So we
// seed ONE canonical transaction per Donation and per Expense row and link every
// other register as a view — nothing is counted twice.
//
// Idempotent: keyed by sourceRecordId, so re-running never duplicates. This is
// what lets a brand-new Neon database populate its finance registers by itself.
const { Op } = require('sequelize');
const sequelize = require('../../config/database');
const FinanceTransaction = require('../../models/FinanceTransaction');
const AuditYear = require('../../models/AuditYear');

const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };
const _fyOf = (value) => {
  const s = String(value || '').slice(0, 10);
  const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7));
  if (!y || !m) return '';
  const start = m >= 4 ? y : y - 1;
  return start + '-' + String((start + 1) % 100).padStart(2, '0');
};
const nextSeqId = async (Model, field, prefix, transaction) => {
  const last = await Model.findOne({ where: { [field]: { [Op.like]: prefix + '%' } }, order: [[field, 'DESC']], transaction });
  let seq = last ? parseInt(String(last[field]).replace(/^.*-/, ''), 10) + 1 : 1;
  if (!isFinite(seq) || seq < 1) seq = 1;
  let candidate = prefix + String(seq).padStart(3, '0');
  while (await Model.findOne({ where: { [field]: candidate }, attributes: ['id'], transaction })) { seq += 1; candidate = prefix + String(seq).padStart(3, '0'); }
  return candidate;
};

const _R = { in: 'in', out: 'out' };
const isInKind = (mode) => /support/i.test(String(mode || ''));
const sourceModuleOf = (regId) => ({ donations: 'donations', membership: 'membership', expenses: 'expenses', cash: 'cash', bank: 'bank', cashbank: 'cashbank', vouchers: 'vouchers' }[regId] || regId);

const buildLinked = (regId, srcId, seq, mode) => {
  const cash = /cash/i.test(String(mode || ''));
  const links = [{ module: 'vouchers', recordId: 'SSF-VOU-' + regId + '-' + String(seq).padStart(5, '0') }];
  if (regId === 'donations') {
    links.push({ module: 'donations', recordId: srcId }, { module: 'contribution', recordId: 'SSF-CON-' + String(seq).padStart(5, '0') }, { module: 'ledger', recordId: 'SSF-LED-' + String(seq).padStart(5, '0') });
    links.push(cash ? { module: 'cash', recordId: 'SSF-CSH-' + String(seq).padStart(5, '0') } : { module: 'bank', recordId: 'SSF-BNK-' + String(seq).padStart(5, '0') });
  } else {
    links.push({ module: 'expenses', recordId: srcId }, { module: 'ledger', recordId: 'SSF-LED-' + String(seq).padStart(5, '0') });
    if (!isInKind(mode)) links.push(cash ? { module: 'cash', recordId: 'SSF-CSH-' + String(seq).padStart(5, '0') } : { module: 'bank', recordId: 'SSF-BNK-' + String(seq).padStart(5, '0') });
  }
  links.push({ module: 'cashbank', recordId: 'SSF-CAB-' + String(seq).padStart(5, '0') });
  return links;
};

// Returns { status, created, skipped, auditYear, auditYearsCreated }.
async function seedOfficialWorkbook({ force = false, actor = 'system' } = {}) {
  const t = await sequelize.transaction();
  try {
    if (force) await FinanceTransaction.destroy({ where: {}, transaction: t });
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
        const exists = await FinanceTransaction.findOne({ where: { sourceRecordId: srcId, sourceModule: module }, attributes: ['id'], transaction: t });
        if (exists) { skipped += 1; continue; }
        const date = String(row[ci.date] || '').slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { skipped += 1; continue; }
        const amount = num(row[ci.amount]);
        if (!amount) { skipped += 1; continue; }
        const mode = ci.mode >= 0 ? (row[ci.mode] || 'Cash') : 'Cash';
        const inKind = reg.id === 'expenses' && isInKind(mode);
        const direction = reg.id === 'donations' ? _R.in : (inKind ? 'none' : _R.out);
        const fy = _fyOf(date);
        const transactionId = await (async () => {
          const last = await FinanceTransaction.findOne({ where: { transactionId: { [Op.like]: 'FIN-' + fy + '-%' } }, order: [['transactionId', 'DESC']], transaction: t });
          let s = last ? parseInt(String(last.transactionId).replace(/^.*-/, ''), 10) + 1 : 1;
          if (!isFinite(s) || s < 1) s = 1;
          let c = 'FIN-' + fy + '-' + String(s).padStart(6, '0');
          while (await FinanceTransaction.findOne({ where: { transactionId: c }, attributes: ['id'], transaction: t })) { s += 1; c = 'FIN-' + fy + '-' + String(s).padStart(6, '0'); }
          return c;
        })();
        const party = ci.particulars >= 0 ? (row[ci.particulars] || '') : (ci.memberName >= 0 ? row[ci.memberName] : '');
        const typeOf = reg.id === 'donations' ? (/contribution/i.test(String(row[ci.type] || '')) ? 'membership' : 'donation') : 'expense';
        await FinanceTransaction.create({
          transactionId, financialYear: fy, transactionDate: date, transactionType: typeOf, amount, direction,
          paymentMode: mode, referenceNumber: ci.ref >= 0 ? (row[ci.ref] || null) : null, partyId: party || null,
          receiptId: reg.id === 'donations' ? srcId : null,
          voucherId: reg.id === 'expenses' ? 'SSF-VOU-expenses-' + String(seq).padStart(5, '0') : null,
          sourceModule: module, sourceRecordId: srcId, needsReview: false,
          linkedRecords: buildLinked(reg.id, srcId, seq, mode),
          data: { importedFrom: 'official-workbook', register: reg.id, particulars: party, inKind }
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
      const exists = await FinanceTransaction.findOne({ where: { sourceRecordId: srcId }, attributes: ['id'], transaction: t });
      if (exists) { skipped += 1; continue; }
      const transactionId = await (async () => {
        const last = await FinanceTransaction.findOne({ where: { transactionId: { [Op.like]: 'FIN-2025-26-%' } }, order: [['transactionId', 'DESC']], transaction: t });
        let s = last ? parseInt(String(last.transactionId).replace(/^.*-/, ''), 10) + 1 : 1;
        let c = 'FIN-2025-26-' + String(s).padStart(6, '0');
        while (await FinanceTransaction.findOne({ where: { transactionId: c }, attributes: ['id'], transaction: t })) { s += 1; c = 'FIN-2025-26-' + String(s).padStart(6, '0'); }
        return c;
      })();
      await FinanceTransaction.create({
        transactionId, financialYear: '2025-26', transactionDate: '2025-04-01', transactionType: 'opening',
        amount: amt, direction: 'in', paymentMode: op.mode, partyId: 'Opening Balance',
        sourceModule: 'opening', sourceRecordId: srcId, linkedRecords: [], needsReview: false,
        data: { importedFrom: 'official-workbook', opening: true, label: op.label }
      }, { transaction: t });
      created += 1;
    }

    // Seed the FY 2025-26 audit year with the audited summary figures.
    const fyLabel = '2025-26';
    let year = await AuditYear.findOne({ where: { financialYear: fyLabel }, transaction: t });
    if (!year) {
      const summary = {};
      (data.auditSummary || []).forEach((x) => { summary[x.particulars] = x.amount; });
      year = await AuditYear.create({
        auditId: 'AUD-2025-26-001', financialYear: fyLabel, assessmentYear: '2026-27',
        auditStatus: 'Completed', auditType: 'Statutory', submissionStatus: 'To Be Confirmed',
        currentVersion: 'Final', remarks: 'Seeded from the official Financial Records workbook Audit Summary.',
        summary, createdBy: actor
      }, { transaction: t });
    }

    // Seed every audited year (from the CA-signed statements) into the audit
    // year master, so the whole history lives in fields.
    let auditYearsCreated = 0;
    try {
      const reports = require('../../data/auditReports.json');
      for (const r of (reports.reports || [])) {
        const exists = await AuditYear.findOne({ where: { financialYear: r.financialYear }, transaction: t });
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
        const auditId = await nextSeqId(AuditYear, 'auditId', 'AUD-' + r.financialYear + '-', t);
        await AuditYear.create({
          auditId, financialYear: r.financialYear, assessmentYear: r.assessmentYear || null,
          auditStatus: r.status || 'Audited', auditType: 'Statutory',
          auditorName: (r.auditor && r.auditor.partner) || null, auditFirm: (r.auditor && r.auditor.firm) || null,
          membershipNo: (r.auditor && r.auditor.membershipNo) || null, auditorContact: (r.auditor && r.auditor.phone) || null,
          auditorEmail: (r.auditor && r.auditor.email) || null,
          reportDate: (r.auditor && r.auditor.reportDate) || null,
          submissionStatus: 'Filed', currentVersion: 'Final',
          remarks: 'Transcribed from CA-signed audited statements (' + r.sourceFile + ').',
          summary, createdBy: actor
        }, { transaction: t });
        auditYearsCreated += 1;
      }
    } catch (e) { console.error('auditReports seed skipped:', e.message); }

    await t.commit();
    return { status: 'ok', created, skipped, auditYear: year ? year.auditId : null, auditYearsCreated };
  } catch (e) {
    try { await t.rollback(); } catch (_) {}
    throw e;
  }
}

module.exports = { seedOfficialWorkbook };
