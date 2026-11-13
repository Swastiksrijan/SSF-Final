// One-off bootstrap for a brand-new Neon database:
//   sync schema -> seed masters -> seed the official finance workbook.
// Idempotent: safe to re-run. Uses DB_URL from the environment.
async function main() {
  const sequelize = require('../config/database');
  require('../models/ims'); // register IMS models before sync
  // Register every portal model so sequelize.sync() creates their tables too.
  for (const m of ['ContactMessage', 'Donor', 'Interest',
    'InternshipApplication', 'LearningCertificate', 'Member', 'RoleDocument', 'Volunteer']) {
    require(`../models/${m}`);
  }

  console.log('1) Syncing schema...');
  await sequelize.sync();
  console.log('   ✅ schema synced');

  console.log('2) Seeding masters...');
  try {
    const { models } = require('../models/ims');
    if (await models.ImsCostCentre.count() === 0) {
      const { seedCostCentres } = require('../services/ims/costCentreSeed');
      console.log('   cost centres:', (await seedCostCentres()).created);
    }
    const { seedOrgProfile } = require('../services/ims/orgProfileSeed');
    const s = await seedOrgProfile();
    if (s.created) console.log('   org profile sections:', s.created);
  } catch (e) { console.log('   seed warning:', e.message); }

  // Finance foundation (chart of accounts, current FY, cash/bank accounts) then
  // the official Financial Records workbook — so a fresh database comes up with
  // the full donation/expense history and audited years, not an empty ledger.
  console.log('3) Seeding finance foundation...');
  const { financeSeed } = require('../services/ims/financeSeed');
  const f = await financeSeed();
  console.log('   accounts:', f.accounts, '| FY:', f.financialYear || 'existing', '| cash:', f.cashAccounts, '| bank:', f.bankAccounts);

  console.log('4) Seeding the official finance workbook...');
  const { seedOfficialWorkbook } = require('../services/ims/workbookSeed');
  const wb = await seedOfficialWorkbook({ actor: 'bootstrap' });
  console.log('   finance transactions:', wb.created, '| audited years:', wb.auditYearsCreated);

  console.log('5) Seeding the FY 2025-26 registers (Sector, Compliance, Sahyog)...');
  const { seedFinancialYearRegisters } = require('../services/ims/fyRegistersSeed');
  const fr = await seedFinancialYearRegisters();
  console.log('   sector activities:', fr.sectorActivities, '| compliance:', fr.compliance, '| sahyog:', fr.sahyog);

  const [txCount] = await sequelize.query('SELECT COUNT(*)::int AS n FROM "ImsTransactions"');
  console.log('6) Verify: ImsTransactions =', txCount[0].n);

  await sequelize.close();
  console.log('DONE');
}

main().catch(e => { console.error('BOOTSTRAP FAILED:', e.message); process.exit(1); });
