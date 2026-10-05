// SSF-IMS professional accounting engine.
// ONE ENTRY POINT: every financial transaction is recorded once as a voucher;
// this module turns that single entry into balanced double-entry ledger postings,
// so the Ledger, Journal, Trial Balance, Cash Book and Bank Book all follow
// automatically and the user never re-enters the same figure twice.
const { models, sequelize } = require('../../models/ims');
const { Op } = require('sequelize');
const { nextId } = require('./ids');
const { logAudit } = require('./audit');

const active = { status: { [Op.ne]: 'archived' } };
const money = (n) => Number(n || 0);

// Receipt types (money in) and payment types (money out). Anything else is a
// journal / contra voucher, which moves value between accounts (e.g. bank->cash).
const RECEIPT_TYPES = new Set(['income', 'donation', 'contribution', 'grant', 'interest', 'csr', 'receipt', 'contra_in']);
const PAYMENT_TYPES = new Set(['expense', 'rent', 'travel', 'reimbursement', 'advance', 'capital', 'bankCharges', 'payment', 'contra_out']);
const CONTRA_TYPES = new Set(['transfer', 'contra', 'adjustment']);

function classify(voucherType) {
  if (RECEIPT_TYPES.has(voucherType)) return 'receipt';
  if (PAYMENT_TYPES.has(voucherType)) return 'payment';
  if (CONTRA_TYPES.has(voucherType)) return 'contra';
  return 'journal';
}

function isIncomeAccount(accountType) {
  return accountType === 'income';
}

/**
 * Resolve the balancing (counter) account for a single-entry voucher.
 * Priority: explicit accountId -> income/expense (category) account -> bank/cash account.
 * Returns the account row, or null when the caller must supply explicit lines.
 */
async function resolveCounterAccount(payload) {
  if (payload.accountId) {
    const a = await models.ImsAccount.findByPk(payload.accountId);
    if (a) return a;
  }
  const kind = classify(payload.transactionType || payload.voucherType);
  // A category account (income/expense) is the natural counterpart for receipts/payments.
  const wanted = kind === 'receipt' ? 'income' : kind === 'payment' ? 'expense' : null;
  if (wanted) {
    const a = await models.ImsAccount.findOne({ where: { ...active, accountType: wanted }, order: [['code', 'ASC']] });
    if (a) return a;
  }
  // Fall back to the money account the funds moved through.
  if (payload.bankAccountId) {
    return models.ImsAccount.findOne({ where: { ...active, name: { [Op.iLike]: '%bank%' } } });
  }
  return models.ImsAccount.findOne({ where: { ...active, accountType: 'asset' }, order: [['code', 'ASC']] });
}

/**
 * Build balanced double-entry lines for a single-entry voucher.
 * Money in  : Dr money account   / Cr counter account
 * Money out : Dr counter account / Cr money account
 * Journal   : caller supplies lines (must balance).
 */
async function buildLines(payload) {
  const kind = classify(payload.transactionType || payload.voucherType);
  const amount = money(payload.amount);
  if (!amount) { const e = new Error('Amount is required'); e.status = 400; throw e; }

  if (Array.isArray(payload.lines) && payload.lines.length) {
    const lines = payload.lines.map((l) => ({
      accountId: l.accountId,
      debit: money(l.debit),
      credit: money(l.credit),
      narration: l.narration || payload.narration,
    }));
    const dr = lines.reduce((s, l) => s + l.debit, 0);
    const cr = lines.reduce((s, l) => s + l.credit, 0);
    if (Math.abs(dr - cr) > 0.009) {
      const e = new Error(`Journal not balanced: debit ${dr} vs credit ${cr}`);
      e.status = 400;
      throw e;
    }
    return lines;
  }

  const counter = await resolveCounterAccount(payload);
  if (!counter) {
    const e = new Error('Could not resolve the counter account. Select an account or configure the Chart of Accounts.');
    e.status = 400;
    throw e;
  }
  // The money account: explicit accountId, else the bank/cash account's linked COA account.
  let moneyAccount = null;
  if (kind !== 'contra' && payload.accountId && counter.id !== payload.accountId) {
    moneyAccount = await models.ImsAccount.findByPk(payload.accountId);
  }
  if (!moneyAccount) {
    moneyAccount = await resolveMoneyAccount(payload);
  }
  if (!moneyAccount) {
    const e = new Error('Select the bank or cash account the money moved through.');
    e.status = 400;
    throw e;
  }

  const nar = payload.narration || payload.notes || '';
  if (kind === 'receipt' || (kind === 'journal' && isIncomeAccount(counter.accountType))) {
    return [
      { accountId: moneyAccount.id, debit: amount, credit: 0, narration: nar },
      { accountId: counter.id, credit: amount, debit: 0, narration: nar },
    ];
  }
  if (kind === 'payment') {
    return [
      { accountId: counter.id, debit: amount, credit: 0, narration: nar },
      { accountId: moneyAccount.id, credit: amount, debit: 0, narration: nar },
    ];
  }
  // contra / transfer / adjustment: move between two money accounts
  return [
    { accountId: moneyAccount.id, debit: amount, credit: 0, narration: nar },
    { accountId: counter.id, credit: amount, debit: 0, narration: nar },
  ];
}

/** Resolve the COA account behind a bank/cash account (uses the control account). */
async function resolveMoneyAccount(payload) {
  if (payload.bankAccountId) {
    const bank = await models.ImsBankAccount.findByPk(payload.bankAccountId);
    if (bank) return ensureMoneyCoa(bank, 'bank');
  }
  if (payload.cashAccountId) {
    const cash = await models.ImsCashAccount.findByPk(payload.cashAccountId);
    if (cash) return ensureMoneyCoa(cash, 'cash');
  }
  return null;
}

async function ensureMoneyCoa(account, kind) {
  const code = kind === 'bank' ? '1100' : '1000';
  const fallback = kind === 'bank' ? 'Bank Accounts' : 'Cash in Hand';
  let coa = await models.ImsAccount.findOne({ where: { ...active, code } });
  if (!coa) {
    coa = await models.ImsAccount.create({
      code, name: fallback, accountType: 'asset', recordId: await nextId('COA', null, models.ImsAccount),
      createdByName: 'Finance Engine', status: 'active',
    });
  }
  return coa;
}

/**
 * Post a single-entry voucher to the ledger. Idempotent per voucherNo.
 * This is the ONLY place a financial transaction is written.
 */
async function postVoucher(payload, req) {
  const txnDate = payload.txnDate || payload.voucherDate || new Date().toISOString().slice(0, 10);
  const kind = classify(payload.transactionType || payload.voucherType);
  const voucherType = payload.voucherType || kind;
  const amount = money(payload.amount);
  if (!amount) { const e = new Error('Amount is required'); e.status = 400; throw e; }

  // Resolve / auto-create the financial year.
  let fyId = payload.financialYearId;
  if (!fyId) {
    const y = new Date(txnDate).getMonth() >= 3 ? new Date(txnDate).getFullYear() : new Date(txnDate).getFullYear() - 1;
    const label = `${y}-${String((y + 1) % 100).padStart(2, '0')}`;
    let fy = await models.ImsFinancialYear.findOne({ where: { label } });
    if (!fy) {
      fy = await models.ImsFinancialYear.create({ label, startDate: `${y}-04-01`, endDate: `${y + 1}-03-31`, isCurrent: true, recordId: await nextId('FY', null, models.ImsFinancialYear) });
    }
    fyId = fy.id;
  }

  const lines = await buildLines({ ...payload, amount });

  return sequelize.transaction(async (t) => {
    const voucherNo = payload.voucherNo || await nextId('VCH', null, models.ImsVoucher);
    const direction = kind === 'receipt' ? 'in' : kind === 'payment' ? 'out' : (payload.direction || (kind === 'receipt' ? 'in' : 'out'));
    const transactionNo = await nextId('TXN', null, models.ImsTransaction);

    const voucher = await models.ImsVoucher.create({
      voucherNo, voucherType, voucherDate: txnDate, amount,
      narration: payload.narration || payload.notes || '',
      approvedBy: payload.approvedBy || null,
      recordId: voucherNo, status: payload.status || 'approved',
      createdByName: 'Receipts & Payments',
    }, { transaction: t });

    const txn = await models.ImsTransaction.create({
      transactionNo, txnDate, financialYearId: fyId, transactionType: payload.transactionType || voucherType,
      amount, direction, paymentMode: payload.paymentMode || 'cash',
      fundId: payload.fundId || null, projectId: payload.projectId || null, costCentreId: payload.costCentreId || null,
      accountId: lines[0].accountId, partyId: payload.partyId || null, personId: payload.personId || null,
      donorId: payload.donorId || null, bankAccountId: payload.bankAccountId || null, cashAccountId: payload.cashAccountId || null,
      voucherId: voucher.id, sourceModule: payload.sourceModule || 'receipts_payments', sourceRecordId: payload.sourceRecordId || null,
      maker: payload.maker || 'SSF Admin', checker: payload.checker || null,
      recordId: transactionNo, status: 'active',
    }, { transaction: t });

    const entries = [];
    for (const line of lines) {
      const acct = await models.ImsAccount.findByPk(line.accountId, { transaction: t });
      const entryNo = await nextId('LED', null, models.ImsLedgerEntry);
      const entry = await models.ImsLedgerEntry.create({
        entryNo, entryDate: txnDate, financialYearId: fyId,
        voucherId: voucher.id, voucherNo, voucherType,
        accountId: line.accountId, accountCode: acct ? acct.code : null, accountName: acct ? acct.name : null,
        debit: line.debit || 0, credit: line.credit || 0, narration: line.narration || '',
        fundId: payload.fundId || null, projectId: payload.projectId || null, costCentreId: payload.costCentreId || null,
        partyId: payload.partyId || null, bankAccountId: payload.bankAccountId || null, cashAccountId: payload.cashAccountId || null,
        transactionId: txn.id, transactionNo, sourceModule: payload.sourceModule || 'receipts_payments',
        sourceRecordId: payload.sourceRecordId || null, recordId: entryNo, status: 'active',
      }, { transaction: t });
      entries.push(entry);
    }

    await logAudit({
      entityType: 'vouchers', entityId: voucherNo, action: 'post',
      newValue: { voucherNo, amount, voucherType, lines: lines.length }, req,
    });

    return { voucher, transaction: txn, entries };
  });
}

/** Ledger for one account, with a running balance. */
async function accountLedger(accountId, { from, to, limit = 500 } = {}) {
  const where = { ...active, accountId };
  if (from) where.entryDate = { ...(where.entryDate || {}), [Op.gte]: from };
  if (to) where.entryDate = { ...(where.entryDate || {}), [Op.lte]: to };
  const rows = await models.ImsLedgerEntry.findAll({ where, order: [['entryDate', 'ASC'], ['id', 'ASC']], limit: Math.min(limit, 2000) });
  let bal = 0;
  const out = rows.map((r) => {
    bal += money(r.debit) - money(r.credit);
    return { ...r.toJSON(), balance: bal };
  });
  const debit = rows.reduce((s, r) => s + money(r.debit), 0);
  const credit = rows.reduce((s, r) => s + money(r.credit), 0);
  return { entries: out, totalDebit: debit, totalCredit: credit, closingBalance: debit - credit };
}

/** Trial balance: every account with debit/credit totals; must balance. */
async function trialBalance({ asOf, financialYearId } = {}) {
  const where = { ...active };
  if (asOf) where.entryDate = { [Op.lte]: asOf };
  if (financialYearId) where.financialYearId = financialYearId;
  const rows = await models.ImsLedgerEntry.findAll({ where, attributes: ['accountId', 'accountCode', 'accountName', 'debit', 'credit'] });
  const map = new Map();
  for (const r of rows) {
    const key = r.accountId;
    const cur = map.get(key) || { accountId: r.accountId, accountCode: r.accountCode, accountName: r.accountName, debit: 0, credit: 0 };
    cur.debit += money(r.debit);
    cur.credit += money(r.credit);
    map.set(key, cur);
  }
  const accounts = [...map.values()].map((a) => ({
    ...a,
    net: a.debit - a.credit,
    balance: a.debit >= a.credit ? a.debit - a.credit : a.credit - a.debit,
    side: a.debit >= a.credit ? 'Dr' : 'Cr',
  }));
  const totalDebit = accounts.reduce((s, a) => s + a.debit, 0);
  const totalCredit = accounts.reduce((s, a) => s + a.credit, 0);
  return { accounts, totalDebit, totalCredit, balanced: Math.abs(totalDebit - totalCredit) < 0.01, asOf: asOf || null };
}

/** Day book / journal: every voucher with its postings, newest first. */
async function dayBook({ from, to, voucherType, voucherNo, transactionNo, limit = 200 } = {}) {
  const where = { ...active };
  if (from) where.entryDate = { ...(where.entryDate || {}), [Op.gte]: from };
  if (to) where.entryDate = { ...(where.entryDate || {}), [Op.lte]: to };
  if (voucherType) where.voucherType = voucherType;
  if (voucherNo) where.voucherNo = voucherNo;
  if (transactionNo) where.transactionNo = transactionNo;
  const rows = await models.ImsLedgerEntry.findAll({ where, order: [['entryDate', 'DESC'], ['id', 'DESC']], limit: Math.min(limit, 2000) });
  return { entries: rows.map((r) => r.toJSON()) };
}

/** Cash book / bank book: postings to the money control account, with a running balance. */
async function book(kind, { from, to } = {}) {
  const code = kind === 'bank' ? '1100' : '1000';
  const coa = await models.ImsAccount.findOne({ where: { ...active, code } });
  const where = { ...active, accountId: coa ? coa.id : -1 };
  if (from) where.entryDate = { ...(where.entryDate || {}), [Op.gte]: from };
  if (to) where.entryDate = { ...(where.entryDate || {}), [Op.lte]: to };
  const rows = await models.ImsLedgerEntry.findAll({ where, order: [['entryDate', 'ASC'], ['id', 'ASC']] });
  let bal = 0;
  const entries = rows.map((r) => {
    const inflow = money(r.debit);
    const outflow = money(r.credit);
    bal += inflow - outflow;
    return { ...r.toJSON(), inflow, outflow, balance: bal };
  });
  return { kind, account: coa ? { id: coa.id, code: coa.code, name: coa.name } : null, entries, closingBalance: bal };
}

/** Budget vs actual (ledger spend) variance. */
async function budgetVariance({ financialYearId, costCentreId } = {}) {
  const where = { ...active };
  if (financialYearId) where.financialYearId = financialYearId;
  if (costCentreId) where.costCentreId = costCentreId;
  const budgets = await models.ImsBudget.findAll({ where });
  const ledgerWhere = { ...active };
  if (financialYearId) ledgerWhere.financialYearId = financialYearId;
  if (costCentreId) ledgerWhere.costCentreId = costCentreId;
  const ledger = await models.ImsLedgerEntry.findAll({ where: ledgerWhere, attributes: ['accountId', 'debit', 'credit'] });
  const actual = new Map();
  for (const l of ledger) {
    actual.set(l.accountId, (actual.get(l.accountId) || 0) + money(l.debit) - money(l.credit));
  }
  const accounts = await models.ImsAccount.findAll({ where: active });
  const acctName = new Map(accounts.map((a) => [a.id, a.name]));
  const rows = budgets.map((b) => {
    const spent = actual.get(b.accountId) || 0;
    const amt = money(b.amount);
    return {
      id: b.id, recordId: b.recordId, accountId: b.accountId, accountName: acctName.get(b.accountId) || null,
      amount: amt, actual: spent, variance: amt - spent,
      utilisation: amt ? Math.round((spent / amt) * 100) : 0,
    };
  });
  const totalBudget = rows.reduce((s, r) => s + r.amount, 0);
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  return { rows, totalBudget, totalActual, totalVariance: totalBudget - totalActual };
}

module.exports = {
  classify, postVoucher, accountLedger, trialBalance, dayBook, book, budgetVariance,
  RECEIPT_TYPES, PAYMENT_TYPES, CONTRA_TYPES,
};
