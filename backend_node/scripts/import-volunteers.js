// Volunteer & Leadership form import CLI.
//
//   node scripts/import-volunteers.js            # dry run (default, writes nothing)
//   node scripts/import-volunteers.js --apply    # perform the additive import
//
// Additive + idempotent: existing persons/volunteers are reused, never deleted
// or overwritten ("kuch hatana nhi").
const sequelize = require('../config/database');
const { seedVolunteers } = require('../services/ims/volunteerSeed');
const { VOLUNTEER_IMPORT } = require('../services/ims/volunteerImportData');

(async () => {
  const apply = process.argv.includes('--apply');
  try {
    if (apply) {
      const stats = await seedVolunteers({ imsRole: 'system' });
      console.log('=== IMPORT DONE ===');
      console.log(JSON.stringify(stats, null, 2));
    } else {
      const [rows] = await sequelize.query('SELECT COUNT(*)::int AS count FROM "ImsVolunteers"');
      console.log('=== DRY RUN (nothing written) ===');
      console.log(`Form responses in import file : ${VOLUNTEER_IMPORT.length}`);
      console.log(`Volunteers currently in register: ${rows[0].count}`);
      console.log('\nRun with --apply to import.');
    }
  } catch (e) {
    console.error('Import failed:', e);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
