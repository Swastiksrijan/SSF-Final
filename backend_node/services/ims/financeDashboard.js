// Finance module dashboard: professional accounting KPIs derived from the
// single-entry ledger (no duplicate data entry anywhere).
const { models } = require('../../models/ims');
const { Op } = require('sequelize');
const { trialBalance } = require('./accounting');

const active = { status: { [Op.ne]: 'archived' } };
const money = (n) => Number(n || 0);

async function financeDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [fy, funds, projects, accounts, vouchers, budgets] = await Promise.all([
    models.ImsFinancialYear.findOne({ where: { ...active, isCurrent: true } }),
    models.ImsFund.count({ where: active }),
    models.ImsProject.count({ where: active }),
    models.ImsAccount.count({ where: active }),
    models.ImsVoucher.count({ where: active }),
    models.ImsBudget.count({ where: active }),
  ]);

  const tb = await trialBalance({});

  // Income / expense come from the trial balance by account type.
  const allAccounts = await models.ImsAccount.findAll({ where: active, attributes: ['id', 'accountType'] });
  const typeOf = new Map(allAccounts.map((a) => [a.id, a.accountType]));
  let income = 0, expense = 0, assets = 0, liabilities = 0;
  for (const a of tb.accounts) {
    const ty = typeOf.get(a.accountId);
    const net = a.debit - a.credit;
    if (ty === 'income') income += -net;         // income is a credit balance
    else if (ty === 'expense') expense += net;   // expense is a debit balance
    else if (ty === 'asset') assets += net;
    else if (ty === 'liability') liabilities += -net;
  }

  const [receipts, payments] = await Promise.all([
    models.ImsLedgerEntry.sum('debit', { where: { ...active, entryDate: { [Op.gte]: today.slice(0, 7) + '-01' } } }),
    models.ImsLedgerEntry.sum('credit', { where: { ...active, entryDate: { [Op.gte]: today.slice(0, 7) + '-01' } } }),
  ]);
  const unreviewed = await models.ImsTransaction.count({ where: { ...active, needsReview: true } });
  const pendingVouchers = await models.ImsVoucher.count({ where: { ...active, status: { [Op.notIn]: ['approved', 'posted'] } } });

  const recentVouchers = await models.ImsVoucher.findAll({ where: active, order: [['id', 'DESC']], limit: 8 });

  return {
    kpis: {
      financialYear: fy ? fy.label : null,
      income, expense, net: income - expense,
      assets, liabilities,
      funds, projects, accounts, vouchers, budgets,
      monthReceipts: money(receipts), monthPayments: money(payments),
      unreviewed, pendingVouchers,
      trialBalanced: tb.balanced,
    },
    trialBalance: { totalDebit: tb.totalDebit, totalCredit: tb.totalCredit, balanced: tb.balanced },
    recentVouchers: recentVouchers.map((v) => v.toJSON()),
  };
}

module.exports = { financeDashboard };
