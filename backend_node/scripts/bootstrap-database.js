// One-off bootstrap for a brand-new Neon database:
//   sync schema -> seed masters -> restore Digital Office backup -> migrate to IMS.
// Idempotent: safe to re-run. Uses DB_URL from the environment.
const fs = require('fs');
const path = require('path');

async function main() {
  const sequelize = require('../config/database');
  require('../models/ims'); // register IMS models before sync
  // Register every legacy model so sequelize.sync() creates their tables too.
  for (const m of ['AuditRecord', 'AuditYear', 'ContactMessage', 'DigitalOfficeAudit',
    'DigitalOfficeRecord', 'Donor', 'FinanceTransaction', 'Interest',
    'InternshipApplication', 'LearningCertificate', 'Member', 'RoleDocument', 'Volunteer']) {
    require(`../models/${m}`);
  }
  const DigitalOfficeRecord = require('../models/DigitalOfficeRecord');

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

  console.log('3) Restoring Digital Office backup...');
  const dir = path.join(__dirname, '..', '..', '.openhands', 'backups');
  const files = fs.readdirSync(dir).filter(f => /^digital-office-records-.*\.json$/.test(f)).sort();
  if (files.length) {
    const rows = JSON.parse(fs.readFileSync(path.join(dir, files[files.length - 1]), 'utf8'));
    const existing = new Set((await DigitalOfficeRecord.findAll({ attributes: ['recordId'] })).map(r => r.recordId));
    const fresh = rows.filter(r => !existing.has(r.recordId));
    if (fresh.length) { await DigitalOfficeRecord.bulkCreate(fresh, { validate: false }); }
    console.log(`   backup ${files[files.length - 1]}: restored ${fresh.length}, already present ${rows.length - fresh.length}`);
  } else {
    console.log('   no backup file found');
  }

  console.log('4) Migrating legacy data into IMS...');
  const { migrateLegacy } = require('../services/ims/migrateLegacy');
  const stats = await migrateLegacy({ dryRun: false });
  console.log('   created:', JSON.stringify(stats.created));
  console.log('   skipped:', stats.skipped, '| unmapped:', stats.unmapped.length);

  const { models } = require('../models/ims');
  const [legacyCount] = await sequelize.query('SELECT COUNT(*)::int AS n FROM "DigitalOfficeRecords"');
  console.log('5) Verify: DigitalOfficeRecords =', legacyCount[0].n);

  await sequelize.close();
  console.log('DONE');
}

main().catch(e => { console.error('BOOTSTRAP FAILED:', e.message); process.exit(1); });
