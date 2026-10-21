// Verifies the IMS audit-report register (Audited Financial Statements) against
// the real CA-signed dataset — nothing mocked.
//
//   cd backend_node && node tests/auditReports.test.js
process.env.NODE_ENV = 'test';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

const { auditReportRegister } = require('../services/ims/auditReports');
const RAW = require('../data/auditReports.json');

const money = (n) => Math.round(Number(n) * 100);

function main() {
  const reg = auditReportRegister();
  const raw = RAW.reports || [];

  console.log('\nRegister shape:');
  ok('organisation carried through', reg.organization === RAW.organization, reg.organization);
  ok('inception financial year carried through', reg.inceptionFinancialYear === RAW.inceptionFinancialYear, reg.inceptionFinancialYear);
  ok('one entry per signed report', reg.years.length === raw.length, `got ${reg.years.length} want ${raw.length}`);
  ok('totals match the report count', reg.totals.auditedYears === raw.length);
  ok('pending years carried through', reg.totals.pendingYears === (RAW.pendingYears || []).length);
  ok('latest year is the newest signed report',
    reg.latestYear === raw[raw.length - 1].financialYear, `got ${reg.latestYear}`);

  console.log('\nYears are chronological, each self-consistent:');
  const sorted = reg.years.every((y, i) => i === 0 || String(reg.years[i - 1].financialYear) < String(y.financialYear));
  ok('years ascending by financial year', sorted);

  const problems = [];
  for (const y of reg.years) {
    const sumIncome = (y.income || []).reduce((a, h) => a + Number(h.amount || 0), 0);
    const sumExp = (y.expenditure || []).reduce((a, h) => a + Number(h.amount || 0), 0);
    if (money(sumIncome) !== money(y.incomeTotal)) problems.push(`${y.financialYear} income heads ${sumIncome} != ${y.incomeTotal}`);
    if (money(sumExp) !== money(y.expenditureTotal)) problems.push(`${y.financialYear} expense heads ${sumExp} != ${y.expenditureTotal}`);
    const expect = money(Math.abs(y.incomeTotal - y.expenditureTotal));
    if (money(y.result && y.result.amount) !== expect) problems.push(`${y.financialYear} result ${y.result && y.result.amount} != ${expect}`);
    const expectType = y.incomeTotal >= y.expenditureTotal ? 'surplus' : 'deficit';
    if ((y.result && y.result.type) !== expectType) problems.push(`${y.financialYear} type ${y.result && y.result.type} != ${expectType}`);
  }
  ok('income heads sum to the declared total', problems.length === 0, problems.join('; '));
  ok('every year states an auditor', reg.years.every((y) => y.auditor && (y.auditor.firm || y.auditor.partner)));
  ok('every year carries an opinion', reg.years.every((y) => !!y.opinion));
  ok('receipts total = opening balance + income',
    reg.years.every((y) => money(y.receiptsTotal) === money(Number(y.openingBalances.total || 0) + y.incomeTotal)));

  console.log('\nYear-on-year movement:');
  ok('first year has no comparison', reg.years[0].yoy === null);
  const yoyOk = reg.years.slice(1).every((y, i) => {
    const prev = reg.years[i];
    return money(y.yoy.income) === money(y.incomeTotal - prev.incomeTotal)
      && money(y.yoy.expenditure) === money(y.expenditureTotal - prev.expenditureTotal);
  });
  ok('each later year compares against the previous signed year', yoyOk);

  console.log('\nTotals:');
  const sumIncome = reg.years.reduce((a, y) => a + y.incomeTotal, 0);
  const sumExp = reg.years.reduce((a, y) => a + y.expenditureTotal, 0);
  ok('total income sums every year', money(reg.totals.income) === money(sumIncome), `${reg.totals.income} vs ${sumIncome}`);
  ok('total expenditure sums every year', money(reg.totals.expenditure) === money(sumExp), `${reg.totals.expenditure} vs ${sumExp}`);
  ok('latest closing balance is a number', Number.isFinite(reg.latestClosing));

  console.log('\nRead-only and non-mutating:');
  const before = JSON.stringify(RAW);
  auditReportRegister();
  auditReportRegister();
  ok('the source dataset is untouched', JSON.stringify(RAW) === before);
  ok('no year claims an unsupported result type',
    reg.years.every((y) => ['surplus', 'deficit'].includes(y.result && y.result.type)));

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main();
