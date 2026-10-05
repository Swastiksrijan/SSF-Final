const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const FinanceTransaction = require('../models/FinanceTransaction');
const AuditYear = require('../models/AuditYear');

const router = express.Router();

const requireOfficeAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
  if (!token || token !== expected) return res.status(401).json({ message: 'Unauthorized digital office access' });
  next();
};

// Financial year label for a date: 2025-04-01..2026-03-31 -> "2025-26".
const fyOf = (value) => {
  const s = String(value || '').slice(0, 10);
  const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7));
  if (!y || !m) return '';
  const start = m >= 4 ? y : y - 1;
  return start + '-' + String((start + 1) % 100).padStart(2, '0');
};
const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/\s+/g, ' ').trim();
const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };

// Next canonical id for a financial year, e.g. FIN-2025-26-000001.
const makeFinId = async (fy, t) => {
  const last = await FinanceTransaction.findOne({
    where: { transactionId: { [Op.like]: 'FIN-' + fy + '-%' } },
    order: [['transactionId', 'DESC']], transaction: t
  });
  let seq = last ? parseInt(String(last.transactionId).replace(/^.*-/, ''), 10) + 1 : 1;
  if (!isFinite(seq) || seq < 1) seq = 1;
  let candidate = 'FIN-' + fy + '-' + String(seq).padStart(6, '0');
  while (await FinanceTransaction.findOne({ where: { transactionId: candidate }, attributes: ['id'], transaction: t })) {
    seq += 1; candidate = 'FIN-' + fy + '-' + String(seq).padStart(6, '0');
  }
  return candidate;
};

// Strong duplicate probe: same reference (if given) else same date+amount+party.
const findDuplicate = async (body, t) => {
  const type = String(body.transactionType || '').trim();
  const amount = num(body.amount);
  const reference = String(body.referenceNumber || '').trim();
  if (!amount) return null;
  const base = { status: { [Op.ne]: 'archived' }, transactionType: type, amount };
  if (reference) {
    return FinanceTransaction.findOne({ where: Object.assign({}, base, { referenceNumber: reference }), transaction: t });
  }
  const date = String(body.transactionDate || '').slice(0, 10);
  const where = Object.assign({}, base, { transactionDate: date });
  if (body.partyId) where.partyId = String(body.partyId);
  return FinanceTransaction.findOne({ where, transaction: t });
};

router.get('/digital-office/finance/transactions', requireOfficeAuth, async (req, res) => {
  try {
    const where = { status: { [Op.ne]: 'archived' } };
    if (req.query.fy) where.financialYear = String(req.query.fy);
    if (req.query.type) where.transactionType = String(req.query.type);
    if (req.query.includeArchived === '1') delete where.status;
    if (req.query.search) {
      const q = '%' + String(req.query.search) + '%';
      where[Op.or] = [
        { transactionId: { [Op.iLike]: q } }, { referenceNumber: { [Op.iLike]: q } },
        { partyId: { [Op.iLike]: q } }, { transactionType: { [Op.iLike]: q } }
      ];
    }
    const rows = await FinanceTransaction.findAll({ where, order: [['transactionDate', 'DESC'], ['transactionId', 'DESC']] });
    return res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to load transactions.' }); }
});

router.post('/digital-office/finance/transactions', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const b = req.body || {};
    const amount = num(b.amount);
    if (!amount) { await t.rollback(); return res.status(400).json({ message: 'amount is required.' }); }
    const date = String(b.transactionDate || new Date().toISOString().slice(0, 10)).slice(0, 10);
    const fy = String(b.financialYear || fyOf(date));
    const force = Boolean(b.forceNew) && Boolean(String(b.forceReason || '').trim());
    if (!force) {
      const dupe = await findDuplicate({ transactionType: b.transactionType, amount, referenceNumber: b.referenceNumber, transactionDate: date, partyId: b.partyId }, t);
      if (dupe) {
        await t.rollback();
        return res.status(409).json({
          duplicate: true,
          message: 'Possible duplicate transaction.',
          existing: {
            transactionId: dupe.transactionId, amount: dupe.amount, transactionDate: dupe.transactionDate,
            transactionType: dupe.transactionType, partyId: dupe.partyId, referenceNumber: dupe.referenceNumber, id: dupe.id
          }
        });
      }
    }
    const transactionId = await makeFinId(fy, t);
    const row = await FinanceTransaction.create({
      transactionId, financialYear: fy, transactionDate: date,
      transactionType: String(b.transactionType || 'other'), amount,
      direction: String(b.direction || (/^(expense|payment|purchase)/i.test(String(b.transactionType || '')) ? 'out' : 'in')),
      paymentMode: b.paymentMode || null, cashAccountId: b.cashAccountId || null, bankAccountId: b.bankAccountId || null,
      partyId: b.partyId || null, donorId: b.donorId || null, memberId: b.memberId || null,
      projectId: b.projectId || null, fundId: b.fundId || null, accountId: b.accountId || null,
      voucherId: b.voucherId || null, receiptId: b.receiptId || null, referenceNumber: b.referenceNumber || null,
      sourceModule: b.sourceModule || 'finance', sourceRecordId: b.sourceRecordId || null,
      linkedRecords: Array.isArray(b.linkedRecords) ? b.linkedRecords : [],
      needsReview: force, createdBy: req.headers['x-office-actor'] || 'admin',
      createdByName: req.headers['x-office-actor-name'] || 'SSF Admin',
      data: Object.assign({}, b.data || {}, force ? { dedupeReason: String(b.forceReason) } : {})
    }, { transaction: t });
    await t.commit();
    return res.status(201).json(row);
  } catch (e) {
    try { await t.rollback(); } catch (_) {}
    console.error('Finance transaction save failed:', e);
    res.status(500).json({ message: 'Unable to save transaction.' });
  }
});

router.post('/digital-office/finance/transactions/:id/link', requireOfficeAuth, async (req, res) => {
  try {
    const row = await FinanceTransaction.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Transaction not found.' });
    const links = Array.isArray(row.linkedRecords) ? row.linkedRecords.slice() : [];
    const add = Array.isArray(req.body.linkedRecords) ? req.body.linkedRecords : (req.body.linkedRecord ? [req.body.linkedRecord] : []);
    add.forEach((l) => { if (l && !links.some((x) => x && x.module === l.module && x.recordId === l.recordId)) links.push(l); });
    row.linkedRecords = links;
    if (req.body.patch && typeof req.body.patch === 'object') {
      ['voucherId', 'receiptId', 'referenceNumber', 'projectId', 'fundId', 'accountId'].forEach((k) => { if (req.body.patch[k]) row[k] = req.body.patch[k]; });
    }
    await row.save();
    return res.json(row);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to link records.' }); }
});

router.post('/digital-office/finance/transactions/:id/archive', requireOfficeAuth, async (req, res) => {
  try {
    const row = await FinanceTransaction.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Transaction not found.' });
    row.status = 'archived';
    row.data = Object.assign({}, row.data, { archiveReason: String(req.body?.reason || '').slice(0, 300) });
    await row.save();
    return res.json({ status: 'success', transactionId: row.transactionId });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to archive transaction.' }); }
});

// Duplicate candidate groups (same reference, or same date+amount+type+party).
router.get('/digital-office/finance/duplicates', requireOfficeAuth, async (req, res) => {
  try {
    const where = { status: { [Op.ne]: 'archived' } };
    if (req.query.fy) where.financialYear = String(req.query.fy);
    const rows = await FinanceTransaction.findAll({ where });
    const groups = {};
    rows.forEach((r) => {
      const ref = norm(r.referenceNumber);
      const key = ref
        ? 'ref:' + ref + '|' + norm(r.transactionType) + '|' + num(r.amount)
        : 'dap:' + String(r.transactionDate).slice(0, 10) + '|' + num(r.amount) + '|' + norm(r.transactionType) + '|' + norm(r.partyId);
      (groups[key] = groups[key] || []).push({
        id: r.id, transactionId: r.transactionId, amount: num(r.amount), transactionDate: r.transactionDate,
        transactionType: r.transactionType, partyId: r.partyId, referenceNumber: r.referenceNumber, sourceModule: r.sourceModule
      });
    });
    const dupGroups = Object.values(groups).filter((g) => g.length > 1);
    return res.json({ count: dupGroups.reduce((a, g) => a + (g.length - 1), 0), groups: dupGroups });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to scan duplicates.' }); }
});

// Finance Data Integrity: missing links, negative balances, unreconciled, mismatch.
router.get('/digital-office/finance/integrity', requireOfficeAuth, async (req, res) => {
  try {
    const where = { status: { [Op.ne]: 'archived' } };
    if (req.query.fy) where.financialYear = String(req.query.fy);
    const rows = await FinanceTransaction.findAll({ where, order: [['transactionDate', 'ASC']] });
    const issues = [];
    let cash = 0, bank = 0;
    rows.forEach((r) => {
      const amt = num(r.amount), out = r.direction === 'out', none = r.direction === 'none';
      const mode = norm(r.paymentMode);
      if (!none) { if (mode === 'cash') cash += out ? -amt : amt; else bank += out ? -amt : amt; }
      // missing links
      if (/donation|membership|receipt/.test(norm(r.transactionType)) && !r.receiptId && !(r.linkedRecords || []).some((l) => l.module === 'donations')) {
        issues.push({ kind: 'missing_link', severity: 'warning', transactionId: r.transactionId, id: r.id, message: 'Donation without a linked receipt.' });
      }
      if (/expense|payment/.test(norm(r.transactionType)) && !none && !r.voucherId) {
        issues.push({ kind: 'missing_link', severity: 'warning', transactionId: r.transactionId, id: r.id, message: 'Expense without a linked voucher.' });
      }
      if (!r.sourceModule && !r.referenceNumber) {
        issues.push({ kind: 'orphan', severity: 'info', transactionId: r.transactionId, id: r.id, message: 'Transaction without a source or reference.' });
      }
    });
    if (cash < 0) issues.push({ kind: 'negative_cash', severity: 'critical', message: 'Cash balance is negative: ' + cash.toFixed(2) });
    if (bank < 0) issues.push({ kind: 'negative_bank', severity: 'critical', message: 'Bank balance is negative: ' + bank.toFixed(2) });
    const receipts = rows.filter((r) => r.direction === 'in' && r.transactionType !== 'opening').reduce((a, r) => a + num(r.amount), 0);
    const payments = rows.filter((r) => r.direction === 'out').reduce((a, r) => a + num(r.amount), 0);
    const inKind = rows.filter((r) => r.direction === 'none').reduce((a, r) => a + num(r.amount), 0);
    // Compare the computed figures to the audited summary for the same year.
    let reconciliation = null;
    if (req.query.fy) {
      const year = await AuditYear.findOne({ where: { financialYear: String(req.query.fy) } });
      if (year && year.summary) {
        const s = year.summary;
        const auditedExpenditure = num(s['Total Expenditure']);
        const computedExpenditure = payments + inKind;
        reconciliation = {
          receipts: { computed: receipts, audited: num(s['Donation Received']) + num(s['Membership Fees Received']), diff: receipts - (num(s['Donation Received']) + num(s['Membership Fees Received'])) },
          expenditure: { computed: computedExpenditure, audited: auditedExpenditure, diff: computedExpenditure - auditedExpenditure },
          cashClosing: { computed: cash, audited: num(s['Closing Cash Balance']), diff: cash - num(s['Closing Cash Balance']) },
          bankClosing: { computed: bank, audited: num(s['Closing Bank Balance (UBI)']), diff: bank - num(s['Closing Bank Balance (UBI)']) }
        };
        Object.entries(reconciliation).forEach(([k, v]) => {
          if (Math.abs(v.diff) > 0.5) issues.push({ kind: 'audit_mismatch', severity: 'warning', message: 'Audit mismatch in ' + k + ': computed ' + v.computed.toFixed(2) + ' vs audited ' + v.audited.toFixed(2) });
        });
      }
    }
    return res.json({
      fy: req.query.fy || null, count: rows.length, issues, reconciliation,
      balances: { cash, bank }, totals: { receipts, payments, inKind }
    });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to run integrity check.' }); }
});

// Ledger (head-wise) + Journal (chronological) derived from canonical transactions.
router.get('/digital-office/finance/ledger', requireOfficeAuth, async (req, res) => {
  try {
    const where = { status: { [Op.ne]: 'archived' } };
    if (req.query.fy) where.financialYear = String(req.query.fy);
    const rows = await FinanceTransaction.findAll({ where, order: [['transactionDate', 'ASC']] });
    const heads = {};
    rows.forEach((r) => {
      const head = String(r.transactionType || 'other');
      heads[head] = heads[head] || { head, debit: 0, credit: 0, entries: [] };
      const amt = num(r.amount), out = r.direction === 'out';
      if (out) heads[head].debit += amt; else heads[head].credit += amt;
      heads[head].entries.push({ transactionId: r.transactionId, date: r.transactionDate, amount: amt, direction: r.direction, partyId: r.partyId, mode: r.paymentMode });
    });
    return res.json({ fy: req.query.fy || null, heads: Object.values(heads) });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to build ledger.' }); }
});

router.get('/digital-office/finance/journal', requireOfficeAuth, async (req, res) => {
  try {
    const where = { status: { [Op.ne]: 'archived' } };
    if (req.query.fy) where.financialYear = String(req.query.fy);
    const rows = await FinanceTransaction.findAll({ where, order: [['transactionDate', 'ASC'], ['transactionId', 'ASC']] });
    let running = 0;
    const entries = rows.map((r) => {
      const amt = num(r.amount), out = r.direction === 'out';
      running += out ? -amt : amt;
      return { transactionId: r.transactionId, date: r.transactionDate, type: r.transactionType, direction: r.direction, mode: r.paymentMode, amount: amt, running };
    });
    return res.json({ fy: req.query.fy || null, entries });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Unable to build journal.' }); }
});

module.exports = router;
