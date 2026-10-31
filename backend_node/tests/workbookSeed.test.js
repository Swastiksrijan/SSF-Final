// Regression test: the official Financial Records workbook seeds itself into a
// brand-new database, so a fresh Neon instance has finance data on first boot
// without any admin action. Runs against an in-memory Postgres (pg-mem).
//
//   node backend_node/tests/workbookSeed.test.js
process.env.NODE_ENV = 'test';

const { newDb } = require('pg-mem');
const mem = newDb();
// pg-mem cannot parse DECIMAL(14,2), so the finance tables are created with
// NUMERIC instead — same semantics, parseable by pg-mem. The re-entrancy guard
// stops the rewritten statement from being intercepted again.
let rewriting = false;
mem.public.interceptQueries((sql) => {
  if (!rewriting && /CREATE TABLE IF NOT EXISTS "FinanceTransactions"/.test(sql)) {
    rewriting = true;
    try { mem.public.none(sql.replace(/DECIMAL\(\d+,\s*\d+\)/g, 'NUMERIC')); } finally { rewriting = false; }
    return [];
  }
  return null;
});
const pgAdapter = mem.adapters.createPg();
const realPgPath = require.resolve('pg');
require(realPgPath);
require.cache[realPgPath].exports = { ...require.cache[realPgPath].exports, Client: pgAdapter.Client, Pool: pgAdapter.Pool };

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

async function main() {
  const { sequelize } = require('../models/social');
  const FinanceTransaction = require('../models/FinanceTransaction');
  const AuditYear = require('../models/AuditYear');
  await sequelize.sync({ force: true });

  const { seedOfficialWorkbook } = require('../services/ims/workbookSeed');

  console.log('\nFresh database (simulates a brand-new Neon instance):');
  ok('starts with no finance transactions', await FinanceTransaction.count() === 0);
  ok('starts with no audit years', await AuditYear.count() === 0);

  const first = await seedOfficialWorkbook({ actor: 'test' });
  const donations = await FinanceTransaction.count({ where: { sourceModule: 'donations' } });
  const expenses = await FinanceTransaction.count({ where: { sourceModule: 'expenses' } });
  ok('donation register seeded (93 rows)', donations === 93, `n=${donations}`);
  ok('expense register seeded (97 rows)', expenses === 97, `n=${expenses}`);
  ok('opening balances seeded', await FinanceTransaction.count({ where: { sourceModule: 'opening' } }) === 2);
  ok('FY 2025-26 audit year seeded', await AuditYear.count({ where: { financialYear: '2025-26' } }) >= 1);
  ok('audited years seeded from CA statements', first.auditYearsCreated > 0, `n=${first.auditYearsCreated}`);
  ok('in-kind expenses carry no cash/bank direction', (await FinanceTransaction.count({ where: { sourceModule: 'expenses', direction: 'none' } })) > 0);

  console.log('\nIdempotent — safe to run on every boot:');
  const second = await seedOfficialWorkbook({ actor: 'test' });
  ok('re-run creates no new transactions', second.created === 0, `created=${second.created}`);
  ok('re-run skips the existing rows', second.skipped > 0, `skipped=${second.skipped}`);
  ok('donation count unchanged after re-run', await FinanceTransaction.count({ where: { sourceModule: 'donations' } }) === 93);
  ok('audit year count unchanged after re-run', await AuditYear.count({ where: { financialYear: '2025-26' } }) === 1);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((error) => { console.error(error); process.exit(1); });
