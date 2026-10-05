// SSF-IMS Cost Centre engine.
// A Cost Centre is a financial CLASSIFICATION / REPORTING dimension, never a
// second entry point. Every figure here is derived from the single-entry
// ledger (ImsLedgerEntry) written by accounting.postVoucher() — so income,
// expense, budget-vs-actual, monthly/quarterly/annual reports all follow from
// one transaction and no figure is ever entered twice.
const { models } = require('../../models/ims');
const { Op } = require('sequelize');

const active = { status: { [Op.ne]: 'archived' } };
const money = (n) => Number(n || 0);

// Cost centre types (spec §5) and categories (spec §6). Configurable: the
// master data is not hard-coded, these are just suggested defaults for pickers.
const COST_CENTRE_TYPES = [
  { id: 'programme', en: 'Programme', hi: 'कार्यक्रम' },
  { id: 'project', en: 'Project', hi: 'परियोजना' },
  { id: 'department', en: 'Department / Function', hi: 'विभाग / कार्य' },
  { id: 'location', en: 'Location / Centre', hi: 'स्थान / केंद्र' },
  { id: 'activity', en: 'Activity', hi: 'गतिविधि' },
  { id: 'institutional', en: 'Institutional', hi: 'संस्थागत' },
];

const COST_CENTRE_CATEGORIES = [
  'Education', 'Skill Development', 'Livelihood', 'Health', 'Women Welfare',
  'Child Welfare', 'Elderly Welfare', 'Disability/Rehabilitation', 'Agriculture',
  'Environment', 'Rural Development', 'Animal Welfare', 'Social Awareness',
  'Cultural Activities', 'Administration', 'HR', 'IT/Digital', 'Compliance',
  'Fundraising', 'Other',
];

/** Account-type map (id -> accountType), used to isolate classification legs. */
async function accountTypes() {
  const accounts = await models.ImsAccount.findAll({ where: active, attributes: ['id', 'accountType'] });
  return new Map(accounts.map((a) => [a.id, a.accountType]));
}

/**
 * Actual income/expense per cost centre, derived from the ledger.
 * Only the CLASSIFICATION legs count: expense from expense-type accounts,
 * income from income-type accounts. The cash/bank control legs of the same
 * voucher are ignored so nothing is double-counted.
 */
async function actualByCostCentre({ financialYearId, from, to } = {}) {
  const where = { ...active, costCentreId: { [Op.ne]: null } };
  if (financialYearId) where.financialYearId = financialYearId;
  if (from) where.entryDate = { ...(where.entryDate || {}), [Op.gte]: from };
  if (to) where.entryDate = { ...(where.entryDate || {}), [Op.lte]: to };
  const [rows, types] = await Promise.all([
    models.ImsLedgerEntry.findAll({ where, attributes: ['costCentreId', 'accountId', 'debit', 'credit'] }),
    accountTypes(),
  ]);
  const map = new Map();
  for (const r of rows) {
    const ty = types.get(r.accountId);
    if (ty !== 'expense' && ty !== 'income') continue;
    const cur = map.get(r.costCentreId) || { expense: 0, income: 0 };
    if (ty === 'expense') cur.expense += money(r.debit) - money(r.credit);
    else cur.income += money(r.credit) - money(r.debit);
    map.set(r.costCentreId, cur);
  }
  return map;
}

/** Budget totals per cost centre (approved + current), from ImsBudget lines. */
async function budgetByCostCentre({ financialYearId } = {}) {
  const where = { ...active, costCentreId: { [Op.ne]: null } };
  if (financialYearId) where.financialYearId = financialYearId;
  const rows = await models.ImsBudget.findAll({ where, attributes: ['costCentreId', 'amount'] });
  const map = new Map();
  for (const r of rows) map.set(r.costCentreId, (map.get(r.costCentreId) || 0) + money(r.amount));
  return map;
}

/**
 * Master list with live financial rollups. `expense` = debit, `income` = credit
 * (programme payments debit the expense/counter account, receipts credit income).
 */
async function listCostCentres(filters = {}) {
  const where = { ...active };
  if (filters.financialYearId) where.financialYearId = filters.financialYearId;
  if (filters.centreType) where.centreType = filters.centreType;
  if (filters.category) where.category = filters.category;
  if (filters.programmeId) where.programmeId = filters.programmeId;
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.status) where.status = filters.status;
  if (filters.location) where.location = { [Op.iLike]: `%${filters.location}%` };
  const centres = await models.ImsCostCentre.findAll({ where, order: [['recordId', 'ASC']] });

  const [actual, budget, programmes, projects, funds] = await Promise.all([
    actualByCostCentre({ financialYearId: filters.financialYearId, from: filters.from, to: filters.to }),
    budgetByCostCentre({ financialYearId: filters.financialYearId }),
    models.ImsProgramme.findAll({ where: active, attributes: ['id', 'name'] }),
    models.ImsProject.findAll({ where: active, attributes: ['id', 'name'] }),
    models.ImsFund.findAll({ where: active, attributes: ['id', 'name'] }),
  ]);
  const nameOf = (rows) => new Map(rows.map((r) => [r.id, r.name]));
  const pName = nameOf(programmes), prName = nameOf(projects), fName = nameOf(funds);

  return centres.map((c) => {
    const a = actual.get(c.id) || { expense: 0, income: 0 };
    const budgetAmt = budget.get(c.id) || money(c.currentBudget) || money(c.approvedBudget) || 0;
    const income = a.income, expense = a.expense;
    return {
      ...c.toJSON(),
      programmeName: pName.get(c.programmeId) || null,
      projectName: prName.get(c.projectId) || null,
      fundName: fName.get(c.fundId) || null,
      budget: budgetAmt,
      actualIncome: income,
      actualExpense: expense,
      balance: budgetAmt - expense,
      variance: budgetAmt - expense,
      utilisation: budgetAmt ? Math.round((expense / budgetAmt) * 100) : 0,
      overspent: expense > budgetAmt && budgetAmt > 0,
    };
  });
}

/** Dashboard KPIs (spec §20). */
async function costCentreDashboard({ financialYearId } = {}) {
  const rows = await listCostCentres({ financialYearId });
  const totalBudget = rows.reduce((s, r) => s + r.budget, 0);
  const totalExpense = rows.reduce((s, r) => s + r.actualExpense, 0);
  const totalIncome = rows.reduce((s, r) => s + r.actualIncome, 0);
  const overspent = rows.filter((r) => r.overspent).length;
  return {
    kpis: {
      total: rows.length,
      active: rows.filter((r) => r.status === 'active').length,
      draft: rows.filter((r) => r.status === 'draft').length,
      closed: rows.filter((r) => ['closed', 'archived'].includes(r.status) || r.isClosed).length,
      onHold: rows.filter((r) => r.status === 'onHold').length,
      totalBudget, totalExpense, totalIncome,
      remaining: totalBudget - totalExpense,
      utilisation: totalBudget ? Math.round((totalExpense / totalBudget) * 100) : 0,
      overspent,
    },
    byType: COST_CENTRE_TYPES.map((t) => ({
      ...t, count: rows.filter((r) => r.centreType === t.id).length,
      expense: rows.filter((r) => r.centreType === t.id).reduce((s, r) => s + r.actualExpense, 0),
    })),
    top: [...rows].sort((a, b) => b.actualExpense - a.actualExpense).slice(0, 8),
    overspentRows: rows.filter((r) => r.overspent),
    rows,
  };
}

/** One cost centre with its linked register of transactions (spec §22-23). */
async function costCentre360(id) {
  const centre = await models.ImsCostCentre.findByPk(id);
  if (!centre) { const e = new Error('Cost centre not found'); e.status = 404; throw e; }
  const cid = centre.id;

  const [ledger, txnCount, budgets, docs, resolutions] = await Promise.all([
    models.ImsLedgerEntry.findAll({ where: { ...active, costCentreId: cid }, order: [['entryDate', 'ASC'], ['id', 'ASC']], limit: 2000 }),
    models.ImsTransaction.count({ where: { ...active, costCentreId: cid } }),
    models.ImsBudget.findAll({ where: { ...active, costCentreId: cid } }),
    models.ImsDocument.findAll({ where: { ...active }, limit: 200 }),
    models.ImsResolution.findAll({ where: active, attributes: ['id', 'title', 'resolutionNo'], limit: 200 }),
  ]);

  let balance = 0;
  const types = await accountTypes();
  // The cost centre register shows the CLASSIFICATION lines (expense/income)
  // only — the cash/bank control legs belong to the money accounts, not here.
  const register = ledger
    .filter((l) => types.get(l.accountId) === 'expense' || types.get(l.accountId) === 'income')
    .map((l) => {
      const ty = types.get(l.accountId);
      const debit = money(l.debit), credit = money(l.credit);
      balance += ty === 'expense' ? debit - credit : credit - debit;
      return {
        id: l.id, entryNo: l.entryNo, date: l.entryDate, voucherNo: l.voucherNo, voucherType: l.voucherType,
        transactionNo: l.transactionNo, accountName: l.accountName, narration: l.narration, accountType: ty,
        debit, credit, balance, fundId: l.fundId, projectId: l.projectId, partyId: l.partyId,
      };
    });

  const income = register.filter((r) => r.accountType === 'income').reduce((s, r) => s + (r.credit - r.debit), 0);
  const expense = register.filter((r) => r.accountType === 'expense').reduce((s, r) => s + (r.debit - r.credit), 0);
  const budgetAmt = budgets.reduce((s, b) => s + money(b.amount), 0) || money(centre.currentBudget) || money(centre.approvedBudget) || 0;

  // Linked reference names.
  const [programme, project, fund, person] = await Promise.all([
    centre.programmeId ? models.ImsProgramme.findByPk(centre.programmeId) : null,
    centre.projectId ? models.ImsProject.findByPk(centre.projectId) : null,
    centre.fundId ? models.ImsFund.findByPk(centre.fundId) : null,
    centre.responsiblePersonId ? models.ImsPerson.findByPk(centre.responsiblePersonId) : null,
  ]);

  const closeCheck = await costCentreCloseCheck(centre.id);

  return {
    costCentre: {
      ...centre.toJSON(),
      programmeName: programme ? programme.name : null,
      projectName: project ? project.name : null,
      fundName: fund ? fund.name : null,
      responsibleName: person ? person.fullName : null,
    },
    summary: {
      income, expense, budget: budgetAmt, balance: budgetAmt - expense,
      variance: budgetAmt - expense, net: income - expense,
      utilisation: budgetAmt ? Math.round((expense / budgetAmt) * 100) : 0,
      overspent: expense > budgetAmt && budgetAmt > 0,
      transactions: txnCount, entries: ledger.length,
    },
    register,
    budgets: budgets.map((b) => b.toJSON()),
    linked: {
      resolutions: resolutions.filter((x) => centre.resolutionReference && String(x.resolutionNo || '').includes(centre.resolutionReference)).map((x) => x.toJSON()),
      documents: docs.slice(0, 10).map((d) => d.toJSON()),
    },
    closeCheck,
  };
}

/** Monthly rollup for a cost centre (spec §24). Classification legs only. */
async function monthlyReport(id, { financialYearId } = {}) {
  const where = { ...active, costCentreId: id };
  if (financialYearId) where.financialYearId = financialYearId;
  const [rows, types] = await Promise.all([
    models.ImsLedgerEntry.findAll({ where, order: [['entryDate', 'ASC']], attributes: ['entryDate', 'accountId', 'debit', 'credit'] }),
    accountTypes(),
  ]);
  const months = new Map();
  let running = 0;
  for (const r of rows) {
    const ty = types.get(r.accountId);
    if (ty !== 'expense' && ty !== 'income') continue;
    const key = String(r.entryDate).slice(0, 7);
    const m = months.get(key) || { month: key, opening: running, income: 0, expense: 0 };
    if (ty === 'income') { m.income += money(r.credit) - money(r.debit); running += money(r.credit) - money(r.debit); }
    else { m.expense += money(r.debit) - money(r.credit); running -= money(r.debit) - money(r.credit); }
    m.closing = running;
    months.set(key, m);
  }
  const list = [...months.values()].map((m) => ({ ...m, transfers: 0, adjustments: 0, net: m.income - m.expense }));
  return {
    months: list,
    totalIncome: list.reduce((s, m) => s + m.income, 0),
    totalExpense: list.reduce((s, m) => s + m.expense, 0),
  };
}

/** Quarterly rollup (spec §25): budget, actual, utilisation, variance. */
async function quarterlyReport(id, { financialYearId } = {}) {
  const where = { ...active, costCentreId: id };
  if (financialYearId) where.financialYearId = financialYearId;
  const [rows, types] = await Promise.all([
    models.ImsLedgerEntry.findAll({ where, attributes: ['entryDate', 'accountId', 'debit', 'credit'] }),
    accountTypes(),
  ]);
  const quarters = [1, 2, 3, 4].map((q) => ({ quarter: `Q${q}`, income: 0, expense: 0 }));
  for (const r of rows) {
    const ty = types.get(r.accountId);
    if (ty !== 'expense' && ty !== 'income') continue;
    const mo = Number(String(r.entryDate).slice(5, 7));
    const q = Math.floor(((mo + 8) % 12) / 3); // FY starts April -> Q1 = Apr-Jun
    if (ty === 'income') quarters[q].income += money(r.credit) - money(r.debit);
    else quarters[q].expense += money(r.debit) - money(r.credit);
  }
  const totalExpense = quarters.reduce((s, q) => s + q.expense, 0);
  const budgets = await models.ImsBudget.findAll({ where: { ...active, costCentreId: id, ...(financialYearId ? { financialYearId } : {}) } });
  const totalBudget = budgets.reduce((s, b) => s + money(b.amount), 0);
  const perQ = totalBudget / 4;
  const list = quarters.map((q) => ({
    ...q, budget: perQ, variance: perQ - q.expense,
    utilisation: perQ ? Math.round((q.expense / perQ) * 100) : 0,
  }));
  return { quarters: list, totalBudget, totalExpense, variance: totalBudget - totalExpense };
}

/** Annual rollup for every cost centre (spec §26). */
async function annualReport({ financialYearId } = {}) {
  const rows = await listCostCentres({ financialYearId });
  const totalBudget = rows.reduce((s, r) => s + r.budget, 0);
  const totalActual = rows.reduce((s, r) => s + r.actualExpense, 0);
  const totalIncome = rows.reduce((s, r) => s + r.actualIncome, 0);
  return {
    rows: rows.map((r) => ({
      recordId: r.recordId, name: r.name, centreType: r.centreType, category: r.category,
      programmeName: r.programmeName, projectName: r.projectName,
      budget: r.budget, actual: r.actualExpense, income: r.actualIncome,
      variance: r.variance, utilisation: r.utilisation,
    })),
    totalBudget, totalActual, totalIncome, variance: totalBudget - totalActual,
  };
}

/** Pre-close integrity check (spec §48). */
async function costCentreCloseCheck(id) {
  const pendingTxns = await models.ImsTransaction.count({ where: { ...active, costCentreId: id, needsReview: true } });
  const openStatus = await models.ImsCostCentre.findOne({ where: { id }, attributes: ['status'] });
  const linkedBudget = await models.ImsBudget.count({ where: { ...active, costCentreId: id } });
  const warnings = [];
  if (pendingTxns) warnings.push({ en: `${pendingTxns} transaction(s) pending review`, hi: `${pendingTxns} लेनदेन समीक्षा हेतु लंबित` });
  if (linkedBudget === 0) warnings.push({ en: 'No budget linked to this cost centre', hi: 'इस लागत केंद्र से कोई बजट जुड़ा नहीं' });
  if (openStatus && ['active'].includes(openStatus.status)) warnings.push({ en: 'Cost centre is still Active', hi: 'लागत केंद्र अभी सक्रिय है' });
  return { ok: warnings.length === 0, warnings, pendingTransactions: pendingTxns, budgets: linkedBudget };
}

/** Change status without ever deleting (spec §27, §31). */
async function setCostCentreStatus(id, status, req) {
  const centre = await models.ImsCostCentre.findByPk(id);
  if (!centre) { const e = new Error('Cost centre not found'); e.status = 404; throw e; }
  const allowed = ['draft', 'active', 'onHold', 'closing', 'closed', 'archived', 'review', 'approved'];
  if (!allowed.includes(status)) { const e = new Error('Invalid status'); e.status = 400; throw e; }
  const closed = status === 'closed' || status === 'archived';
  await centre.update({ status, isClosed: closed, updatedBy: req && req.imsRole ? req.imsRole : 'system' });
  const { logAudit } = require('./audit');
  await logAudit({ entityType: 'costCentres', entityId: centre.recordId, action: closed ? 'close' : 'status', newValue: { status }, req });
  return centre;
}

module.exports = {
  COST_CENTRE_TYPES, COST_CENTRE_CATEGORIES,
  listCostCentres, costCentreDashboard, costCentre360,
  monthlyReport, quarterlyReport, annualReport, costCentreCloseCheck, setCostCentreStatus,
  actualByCostCentre, budgetByCostCentre,
};
