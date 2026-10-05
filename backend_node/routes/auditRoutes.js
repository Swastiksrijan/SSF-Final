const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const AuditYear = require('../models/AuditYear');
const AuditRecord = require('../models/AuditRecord');
const FinanceTransaction = require('../models/FinanceTransaction');
const DigitalOfficeRecord = require('../models/DigitalOfficeRecord');

const router = express.Router();

const requireOfficeAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
  if (!token || token !== expected) return res.status(401).json({ message: 'Unauthorized digital office access' });
  next();
};

const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };
const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/\s+/g, ' ').trim();
const _fyOf = (value) => {
  const s = String(value || '').slice(0, 10);
  const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7));
  if (!y || !m) return '';
  const start = m >= 4 ? y : y - 1;
  return start + '-' + String((start + 1) % 100).padStart(2, '0');
};
const MAX_ATTACH = 4 * 1024 * 1024; // 4MB data URL cap

const nextSeqId = async (Model, field, prefix) => {
  const last = await Model.findOne({ where: { [field]: { [Op.like]: prefix + '%' } }, order: [[field, 'DESC']] });
  let seq = last ? parseInt(String(last[field]).replace(/^.*-/, ''), 10) + 1 : 1;
  if (!isFinite(seq) || seq < 1) seq = 1;
  let candidate = prefix + String(seq).padStart(3, '0');
  while (await Model.findOne({ where: { [field]: candidate }, attributes: ['id'] })) { seq += 1; candidate = prefix + String(seq).padStart(3, '0'); }
  return candidate;
};

// ---- Audit Year Master ------------------------------------------------------
router.get('/digital-office/audit/years', requireOfficeAuth, async (req, res) => {
  try {
    const where = {};
    if (req.query.fy) where.financialYear = String(req.query.fy);
    return res.json(await AuditYear.findAll({ where, order: [['financialYear', 'DESC']] }));
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to load audit years.' }); }
});

router.post('/digital-office/audit/years', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const b = req.body || {};
    const fy = String(b.financialYear || '').trim();
    if (!fy) { await t.rollback(); return res.status(400).json({ message: 'financialYear is required.' }); }
    const existing = await AuditYear.findOne({ where: { financialYear: fy }, transaction: t });
    if (existing) { await t.rollback(); return res.status(409).json({ message: 'Audit year already exists for ' + fy, auditId: existing.auditId }); }
    const auditId = b.auditId || await nextSeqId(AuditYear, 'auditId', 'AUD-' + fy + '-');
    const row = await AuditYear.create(Object.assign({}, b, { auditId, financialYear: fy, createdBy: req.headers['x-office-actor'] || 'admin' }), { transaction: t });
    await t.commit();
    return res.status(201).json(row);
  } catch (e) { try { await t.rollback(); } catch (_) {} console.error(e); res.status(500).json({ message: 'Unable to create audit year.' }); }
});

router.put('/digital-office/audit/years/:id', requireOfficeAuth, async (req, res) => {
  try {
    const row = await AuditYear.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Audit year not found.' });
    const allowed = ['assessmentYear', 'auditStatus', 'auditType', 'auditorName', 'auditFirm', 'membershipNo', 'auditorPan',
      'auditorContact', 'auditorEmail', 'appointmentDate', 'auditStartDate', 'auditEndDate', 'reportDate', 'filingDate',
      'submissionStatus', 'revisionStatus', 'currentVersion', 'remarks', 'summary'];
    allowed.forEach((k) => { if (Object.prototype.hasOwnProperty.call(req.body, k)) row[k] = req.body[k]; });
    await row.save();
    return res.json(row);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to update audit year.' }); }
});

// ---- Generic audit records (auditor / document / observation / query / adjustment / reportVersion / filing)
const KINDS = new Set(['auditor', 'document', 'observation', 'query', 'adjustment', 'reportVersion', 'filing']);

router.get('/digital-office/audit/records', requireOfficeAuth, async (req, res) => {
  try {
    const where = { status: { [Op.ne]: 'deleted' } };
    if (req.query.kind) where.kind = String(req.query.kind);
    if (req.query.auditId) where.auditId = String(req.query.auditId);
    if (req.query.fy) where.financialYear = String(req.query.fy);
    return res.json(await AuditRecord.findAll({ where, order: [['createdAt', 'DESC']] }));
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to load audit records.' }); }
});

router.post('/digital-office/audit/records', requireOfficeAuth, async (req, res) => {
  try {
    const b = req.body || {};
    const kind = String(b.kind || '').trim();
    if (!KINDS.has(kind)) return res.status(400).json({ message: 'Invalid audit record kind.' });
    const prefixMap = { auditor: 'AUD-PROF-', document: 'AUD-DOC-', observation: 'AUD-OBS-', query: 'AUD-QRY-', adjustment: 'ADJ-', reportVersion: 'AUD-VER-', filing: 'AUD-FIL-' };
    let recordId = b.recordId;
    if (!recordId) {
      if (kind === 'adjustment') recordId = await nextSeqId(AuditRecord, 'recordId', 'ADJ-' + (b.financialYear || '') + '-');
      else recordId = await nextSeqId(AuditRecord, 'recordId', prefixMap[kind]);
    }
    if (b.attachment && String(b.attachment).length > MAX_ATTACH) return res.status(413).json({ message: 'Attachment too large (max 4MB).' });
    const row = await AuditRecord.create({
      recordId, kind, auditId: b.auditId || null, financialYear: b.financialYear || null,
      status: b.status || 'active', relatedTransactionId: b.relatedTransactionId || null,
      dueDate: b.dueDate || null, amount: b.amount == null || b.amount === '' ? null : num(b.amount),
      data: b.data || {}, createdBy: req.headers['x-office-actor'] || 'admin'
    });
    return res.status(201).json(row);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to save audit record.' }); }
});

router.put('/digital-office/audit/records/:id', requireOfficeAuth, async (req, res) => {
  try {
    const row = await AuditRecord.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Audit record not found.' });
    const allowed = ['status', 'relatedTransactionId', 'dueDate', 'amount', 'data'];
    allowed.forEach((k) => { if (Object.prototype.hasOwnProperty.call(req.body, k)) row[k] = req.body[k]; });
    await row.save();
    return res.json(row);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to update audit record.' }); }
});

router.delete('/digital-office/audit/records/:id', requireOfficeAuth, async (req, res) => {
  try {
    const row = await AuditRecord.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Audit record not found.' });
    row.status = 'deleted';
    await row.save();
    return res.json({ status: 'success', recordId: row.recordId });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to archive audit record.' }); }
});

// ---- Audit summary (figures + findings + documents for a year) --------------
router.get('/digital-office/audit/summary', requireOfficeAuth, async (req, res) => {
  try {
    const fy = String(req.query.fy || '');
    const year = await AuditYear.findOne({ where: { financialYear: fy } });
    const recs = await AuditRecord.findAll({ where: { financialYear: fy, status: { [Op.ne]: 'deleted' } } });
    const txWhere = { status: { [Op.ne]: 'archived' } };
    if (fy) txWhere.financialYear = fy;
    const tx = await FinanceTransaction.findAll({ where: txWhere });
    const receipts = tx.filter((r) => r.direction === 'in' && r.transactionType !== 'opening').reduce((a, r) => a + num(r.amount), 0);
    const payments = tx.filter((r) => r.direction === 'out').reduce((a, r) => a + num(r.amount), 0);
    const byKind = (k) => recs.filter((r) => r.kind === k);
    const findings = byKind('observation');
    return res.json({
      financialYear: fy, year, transactions: tx.length,
      financial: { receipts, payments, surplus: receipts - payments },
      audit: { auditor: year ? year.auditorName : null, reportDate: year ? year.reportDate : null, status: year ? year.auditStatus : 'Not Started' },
      findings: { total: findings.length, open: findings.filter((f) => /open|action|review|pending/i.test(f.data?.status || '')).length, resolved: findings.filter((f) => /resolved/i.test(f.data?.status || '')).length },
      documents: { uploaded: byKind('document').length, versions: byKind('reportVersion').length },
      filings: byKind('filing').map((f) => ({ form: f.data?.form, status: f.data?.applicability || f.data?.status, dueDate: f.dueDate, filedDate: f.data?.actualFilingDate })),
      observations: findings.map((f) => ({ recordId: f.recordId, observation: f.data?.observation, severity: f.data?.severity, status: f.data?.status, relatedTransactionId: f.relatedTransactionId, dueDate: f.dueDate })),
      queries: byKind('query').map((q) => ({ recordId: q.recordId, question: q.data?.question, status: q.data?.auditorStatus }))
    });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to build audit summary.' }); }
});

// ---- Audited financial reports (transcribed from CA-signed statements) ------
// One canonical dataset of every audited year (Income & Expenditure, Receipts
// & Payments, Balance Sheet). Served as-is so the UI can show the actual
// CA-certified figures alongside the computed ledger.
router.get('/digital-office/audit/reports', requireOfficeAuth, async (req, res) => {
  try {
    let data;
    try { data = require('../data/auditReports.json'); }
    catch (_) { return res.status(404).json({ message: 'auditReports.json not found.' }); }
    const reports = data.reports || [];
    const years = [];
    for (let i = 0; i < reports.length; i += 1) {
      const r = reports[i];
      const prev = reports[i - 1];
      const receiptTotal = num(r.openingBalances && r.openingBalances.total) + num(r.incomeTotal);
      years.push({
        financialYear: r.financialYear,
        status: r.status,
        opinion: r.opinion,
        auditor: r.auditor && (r.auditor.firm || r.auditor.partner),
        income: num(r.incomeTotal),
        expenditure: num(r.expenditureTotal),
        capitalExpenditure: (r.capitalExpenditure || []).reduce((a, c) => a + num(c.amount), 0),
        result: r.result,
        receiptsTotal: receiptTotal,
        opening: r.openingBalances,
        closing: r.closingBalances,
        generalFund: r.generalFund,
        fixedAssets: r.fixedAssets,
        sourceFile: r.sourceFile,
        yoy: prev ? {
          income: num(r.incomeTotal) - num(prev.incomeTotal),
          expenditure: num(r.expenditureTotal) - num(prev.expenditureTotal)
        } : null
      });
    }
    return res.json({ organization: data.organization, inceptionFinancialYear: data.inceptionFinancialYear, note: data.note, years, pendingYears: data.pendingYears || [], reports });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to load audited reports.' }); }
});

// ---- Year comparison (previous vs current) ---------------------------------
router.get('/digital-office/audit/comparison', requireOfficeAuth, async (req, res) => {
  try {
    const years = await AuditYear.findAll({ order: [['financialYear', 'ASC']] });
    const out = [];
    const auditedByFy = {};
    try {
      const rep = require('../data/auditReports.json');
      (rep.reports || []).forEach((r) => { auditedByFy[r.financialYear] = r; });
    } catch (_) {}
    const fys = Array.from(new Set([].concat(years.map((y) => y.financialYear), Object.keys(auditedByFy)))).sort();
    for (const fy of fys) {
      const year = years.find((y) => y.financialYear === fy);
      const tx = await FinanceTransaction.findAll({ where: { financialYear: fy, status: { [Op.ne]: 'archived' } } });
      const bookReceipts = tx.filter((r) => r.direction === 'in' && r.transactionType !== 'opening').reduce((a, r) => a + num(r.amount), 0);
      const bookPayments = tx.filter((r) => r.direction === 'out').reduce((a, r) => a + num(r.amount), 0);
      const audited = auditedByFy[fy];
      const hasBooks = tx.length > 0;
      const receipts = hasBooks ? bookReceipts : (audited ? num(audited.incomeTotal) : 0);
      const payments = hasBooks ? bookPayments : (audited ? num(audited.expenditureTotal) : 0);
      const findings = await AuditRecord.count({ where: { kind: 'observation', financialYear: fy, status: { [Op.ne]: 'deleted' } } });
      out.push({
        financialYear: fy, receipts, payments, surplus: receipts - payments, findings,
        status: year ? year.auditStatus : (audited ? audited.status : 'Not Started'),
        source: hasBooks ? 'books' : (audited ? 'audited' : 'none'),
        resultType: audited ? audited.result.type : (receipts - payments >= 0 ? 'surplus' : 'deficit')
      });
    }
    return res.json({ years: out });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to build comparison.' }); }
});

// ---- Financial Year closing checks + close ---------------------------------
router.get('/digital-office/finance/year-close/check', requireOfficeAuth, async (req, res) => {
  try {
    const fy = String(req.query.fy || '');
    const tx = await FinanceTransaction.findAll({ where: { financialYear: fy, status: { [Op.ne]: 'archived' } } });
    const checks = [];
    let cash = 0, bank = 0;
    tx.forEach((r) => { const a = num(r.amount), out = r.direction === 'out'; if (norm(r.paymentMode) === 'cash') cash += out ? -a : a; else bank += out ? -a : a; });
    if (cash < 0) checks.push({ id: 'negative_cash', level: 'critical', message: 'Negative cash balance: ' + cash.toFixed(2) });
    if (bank < 0) checks.push({ id: 'negative_bank', level: 'critical', message: 'Negative bank balance: ' + bank.toFixed(2) });
    const noRef = tx.filter((r) => !r.referenceNumber).length;
    if (noRef) checks.push({ id: 'missing_reference', level: 'warning', message: noRef + ' transaction(s) without a reference/UTR.' });
    const noSource = tx.filter((r) => !r.sourceModule).length;
    if (noSource) checks.push({ id: 'orphan', level: 'warning', message: noSource + ' transaction(s) without a source.' });
    const year = await AuditYear.findOne({ where: { financialYear: fy } });
    if (year) {
      const openFindings = await AuditRecord.count({ where: { kind: 'observation', financialYear: fy, status: { [Op.ne]: 'deleted' }, [Op.and]: [sequelize.where(sequelize.json('data.status'), { [Op.notILike]: '%resolved%' })] } });
      if (openFindings) checks.push({ id: 'open_findings', level: 'warning', message: openFindings + ' open audit finding(s).' });
    }
    const critical = checks.filter((c) => c.level === 'critical').length;
    return res.json({ fy, canClose: critical === 0, checks, balances: { cash, bank } });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to run year-close checks.' }); }
});

// ---- Audit Pack (organized index for a year) --------------------------------
router.get('/digital-office/audit/pack', requireOfficeAuth, async (req, res) => {
  try {
    const fy = String(req.query.fy || '');
    const year = await AuditYear.findOne({ where: { financialYear: fy } });
    const recs = await AuditRecord.findAll({ where: { financialYear: fy, status: { [Op.ne]: 'deleted' } }, order: [['createdAt', 'DESC']] });
    const tx = await FinanceTransaction.findAll({ where: { financialYear: fy, status: { [Op.ne]: 'archived' } } });
    const cashbook = await DigitalOfficeRecord.count({ where: { module: 'cash', status: { [Op.ne]: 'deleted' } } });
    const bankbook = await DigitalOfficeRecord.count({ where: { module: 'bank', status: { [Op.ne]: 'deleted' } } });
    const index = [
      { section: 'Financial Statements', items: ['Balance Sheet', 'Income & Expenditure', 'Receipts & Payments', 'Trial Balance'] },
      { section: 'Books', items: ['Cash Book (' + cashbook + ')', 'Bank Book (' + bankbook + ')', 'Ledger', 'Journal'] },
      { section: 'Transactions', items: [tx.length + ' canonical transactions'] },
      { section: 'Audit Reports', items: recs.filter((r) => r.kind === 'reportVersion').map((r) => r.data?.version + ' · ' + r.data?.label) },
      { section: 'Documents', items: recs.filter((r) => r.kind === 'document').map((r) => r.data?.category + ' · ' + r.data?.title) },
      { section: 'Observations', items: recs.filter((r) => r.kind === 'observation').map((r) => r.recordId + ' · ' + (r.data?.status || '')) },
      { section: 'Compliance', items: recs.filter((r) => r.kind === 'filing').map((r) => r.data?.form + ' · ' + (r.data?.applicability || '')) },
    ];
    return res.json({ fy, auditId: year ? year.auditId : null, generatedAt: new Date().toISOString(), index });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to build audit pack.' }); }
});

// ---- One-time seed: official workbook -> canonical transactions -------------
// The workbook's Master Voucher (190) is exactly Donation register (93) +
// Expense register (97); Membership (17) is a subset of donations, and the Cash
// Book / Bank Book / Cash & Bank Book are split views of the same events.
// So we seed ONE canonical transaction per Donation and per Expense row and
// link every other register as a view — nothing is counted twice.
// Idempotent: keyed by sourceRecordId, so re-running never duplicates.
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

router.post('/digital-office/finance/seed', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const force = String(req.query.force || '') === '1';
    if (force) await FinanceTransaction.destroy({ where: {}, transaction: t });
    let data;
    try { data = require('../data/officialRegisters.json'); }
    catch (_) { await t.rollback(); return res.status(500).json({ message: 'officialRegisters.json not found. Run the generator.' }); }
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
        summary, createdBy: req.headers['x-office-actor'] || 'admin'
      }, { transaction: t });
    }
    // Seed every audited year (from the CA-signed statements) into the audit
    // year master + audit report records, so the whole history lives in fields.
    let auditYearsCreated = 0;
    try {
      const reports = require('../data/auditReports.json');
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
        const auditId = await nextSeqId(AuditYear, 'auditId', 'AUD-' + r.financialYear + '-');
        await AuditYear.create({
          auditId, financialYear: r.financialYear, assessmentYear: r.assessmentYear || null,
          auditStatus: r.status || 'Audited', auditType: 'Statutory',
          auditorName: (r.auditor && r.auditor.partner) || null, auditFirm: (r.auditor && r.auditor.firm) || null,
          membershipNo: (r.auditor && r.auditor.membershipNo) || null, auditorContact: (r.auditor && r.auditor.phone) || null,
          auditorEmail: (r.auditor && r.auditor.email) || null,
          reportDate: (r.auditor && r.auditor.reportDate) || null,
          submissionStatus: 'Filed', currentVersion: 'Final',
          remarks: 'Transcribed from CA-signed audited statements (' + r.sourceFile + ').',
          summary, createdBy: req.headers['x-office-actor'] || 'admin'
        }, { transaction: t });
        auditYearsCreated += 1;
      }
    } catch (e) { console.error('auditReports seed skipped:', e.message); }
    await t.commit();
    return res.json({ status: 'ok', created, skipped, auditYear: year ? year.auditId : null, auditYearsCreated });
  } catch (e) {
    try { await t.rollback(); } catch (_) {}
    console.error('Finance seed failed:', e);
    res.status(500).json({ message: 'Seed failed.', detail: e.message });
  }
});

module.exports = router;
