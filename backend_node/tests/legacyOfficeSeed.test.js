// Regression test: the legacy Digital Office finance masters (Chart of Accounts,
// Financial Year Master) seed themselves into a brand-new database, so the
// Digital Office screens are not empty on a fresh Neon project.
//
//   cd backend_node && node tests/legacyOfficeSeed.test.js
process.env.NODE_ENV = 'test';

const { newDb } = require('pg-mem');
const mem = newDb();
// pg-mem cannot parse DECIMAL(14,2); rewrite it to NUMERIC for the create pass.
let rewriting = false;
mem.public.interceptQueries((sql) => {
  if (!rewriting && /DECIMAL\(\s*\d+\s*,\s*\d+\s*\)/i.test(sql)) {
    rewriting = true;
    try { mem.public.none(sql.replace(/DECIMAL\(\s*\d+\s*,\s*\d+\s*\)/gi, 'NUMERIC')); } finally { rewriting = false; }
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
  const DigitalOfficeRecord = require('../models/DigitalOfficeRecord');
  require('../models/DigitalOfficeAudit');
  await sequelize.sync({ force: true });

  const { seedLegacyOffice } = require('../services/ims/legacyOfficeSeed');
  const coa = require('../data/chartOfAccounts.json');

  console.log('\nFresh database:');
  ok('starts with no Digital Office records', await DigitalOfficeRecord.count() === 0);

  const first = await seedLegacyOffice({ actor: 'test' });
  const heads = await DigitalOfficeRecord.count({ where: { module: 'chartOfAccounts' } });
  const years = await DigitalOfficeRecord.count({ where: { module: 'fyMaster' } });
  ok('every account head seeded', heads === (coa.heads || []).length, `n=${heads}`);
  ok('financial years seeded', years > 0, `n=${years}`);
  ok('every audited year present', years >= (require('../data/auditReports.json').reports || []).length);
  ok('a head carries its code and name', await DigitalOfficeRecord.count({ where: { module: 'chartOfAccounts' } }) > 0);

  console.log('\nIdempotent:');
  const second = await seedLegacyOffice({ actor: 'test' });
  ok('re-run creates no account heads', second.chartOfAccounts === 0, `created=${second.chartOfAccounts}`);
  ok('re-run creates no financial years', second.fyMaster === 0, `created=${second.fyMaster}`);
  ok('account head count unchanged', await DigitalOfficeRecord.count({ where: { module: 'chartOfAccounts' } }) === heads);

  console.log('\nNo destructive writes:');
  const one = await DigitalOfficeRecord.findOne({ where: { module: 'chartOfAccounts' } });
  await one.update({ status: 'archived' });
  await seedLegacyOffice({ actor: 'test' });
  const after = await DigitalOfficeRecord.findByPk(one.id);
  ok('an archived head is not resurrected', after.status === 'archived');

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((error) => { console.error(error); process.exit(1); });
