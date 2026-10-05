// Seed the professional finance foundation: chart of accounts, current
// financial year, and default cash/bank accounts. Idempotent.
const { models } = require('../../models/ims');
const { nextId } = require('./ids');

// Standard NGO chart of accounts (code, name, type, parentCode).
const CHART = [
  ['1000', 'Cash in Hand', 'asset'],
  ['1100', 'Bank Accounts', 'asset'],
  ['1200', 'Fixed Deposits / Investments', 'asset'],
  ['1300', 'Advances & Receivables', 'asset'],
  ['1500', 'Fixed Assets', 'asset'],
  ['2000', 'Liabilities', 'liability'],
  ['2100', 'Creditors / Payables', 'liability'],
  ['2200', 'Statutory Dues (TDS/GST/PF)', 'liability'],
  ['2500', 'Corpus / Endowment Fund', 'equity'],
  ['2600', 'Unrestricted Funds', 'equity'],
  ['2700', 'Restricted Funds', 'equity'],
  ['3000', 'Donations & Contributions', 'income'],
  ['3100', 'Grants', 'income'],
  ['3200', 'Interest Income', 'income'],
  ['3300', 'CSR Income', 'income'],
  ['3400', 'Other Income', 'income'],
  ['4000', 'Programme Expenses', 'expense'],
  ['4100', 'Salary & Honorarium', 'expense'],
  ['4200', 'Rent', 'expense'],
  ['4300', 'Travel & Conveyance', 'expense'],
  ['4400', 'Office & Administration', 'expense'],
  ['4500', 'Utilities', 'expense'],
  ['4600', 'Bank Charges', 'expense'],
  ['4700', 'Audit & Compliance', 'expense'],
  ['4800', 'Repairs & Maintenance', 'expense'],
  ['4900', 'Miscellaneous Expenses', 'expense'],
];

async function ensureAccount(code, name, accountType) {
  let a = await models.ImsAccount.findOne({ where: { code } });
  if (!a) {
    a = await models.ImsAccount.create({
      code, name, accountType, recordId: await nextId('COA', null, models.ImsAccount),
      status: 'active', createdByName: 'Finance Seed',
    });
  }
  return a;
}

async function financeSeed() {
  const out = { accounts: 0, financialYear: null, cashAccounts: 0, bankAccounts: 0 };
  for (const [code, name, type] of CHART) {
    const before = await models.ImsAccount.count({ where: { code } });
    await ensureAccount(code, name, type);
    if (!before) out.accounts++;
  }

  const y = new Date().getMonth() >= 3 ? new Date().getFullYear() : new Date().getFullYear() - 1;
  const label = `${y}-${String((y + 1) % 100).padStart(2, '0')}`;
  let fy = await models.ImsFinancialYear.findOne({ where: { label } });
  if (!fy) {
    fy = await models.ImsFinancialYear.create({
      label, startDate: `${y}-04-01`, endDate: `${y + 1}-03-31`, isCurrent: true,
      recordId: await nextId('FY', null, models.ImsFinancialYear), status: 'active',
    });
    out.financialYear = label;
  }

  const [, cashCreated] = await models.ImsCashAccount.findOrCreate({
    where: { name: 'Main Cash Counter' },
    defaults: { name: 'Main Cash Counter', openingBalance: 0, recordId: await nextId('CSH', null, models.ImsCashAccount), status: 'active' },
  });
  if (cashCreated) out.cashAccounts++;

  const [, bankCreated] = await models.ImsBankAccount.findOrCreate({
    where: { accountNo: 'SSF-MAIN' },
    defaults: { bankName: 'SSF Main Bank Account', accountNo: 'SSF-MAIN', openingBalance: 0, recordId: await nextId('BNK', null, models.ImsBankAccount), status: 'active' },
  });
  if (bankCreated) out.bankAccounts++;

  return out;
}

module.exports = { financeSeed, CHART };
