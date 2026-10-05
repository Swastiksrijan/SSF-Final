// Legacy -> SSF-IMS migration CLI.
//
//   node scripts/migrate-legacy.js            # dry run (default, writes nothing)
//   node scripts/migrate-legacy.js --apply    # perform the additive import
//
// Additive + idempotent: legacy tables are never modified or deleted, and each
// imported legacy row is remembered so re-runs skip it ("kuch hatana nhi").
const sequelize = require('../config/database');
require('../models/ims');
const { migrateLegacy } = require('../services/ims/migrateLegacy');

(async () => {
  const apply = process.argv.includes('--apply');
  try {
    const stats = await migrateLegacy({ dryRun: !apply });
    console.log(apply ? '=== IMPORT DONE ===' : '=== DRY RUN (nothing written) ===');
    console.log(JSON.stringify(stats, null, 2));
    if (!apply) console.log('\nRun with --apply to import.');
  } catch (e) {
    console.error('Migration failed:', e);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
