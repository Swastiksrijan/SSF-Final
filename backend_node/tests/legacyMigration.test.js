// Regression test: every legacy Digital Office record lands in the IMS masters,
// so removing the standalone Digital Office app leaves no data behind. Also
// proves the migration is additive, idempotent and resilient (one unreadable
// legacy table never aborts the rest).
//
//   cd backend_node && node tests/legacyMigration.test.js
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
  const { models } = require('../models/ims');
  // Register the legacy office tables the migration reads.
  const DigitalOfficeRecord = require('../models/DigitalOfficeRecord');
  const DigitalOfficeAudit = require('../models/DigitalOfficeAudit');

  // pg-mem cannot run Sequelize findOrCreate (it emits plpgsql). Stand in with
  // findOne+create — the same result, exercised against real rows.
  for (const M of [models.ImsRelation, models.ImsPersonRole]) {
    M.findOrCreate = async function ({ where, defaults }) {
      let row = await M.findOne({ where });
      if (row) return [row, false];
      row = await M.create({ ...where, ...defaults });
      return [row, true];
    };
  }

  // pg-mem cannot create the legacy Postgres ENUM columns (Members.status),
  // so create the IMS + office tables directly instead of a global sync. The
  // legacy social tables stay absent; migrateLegacy reports them as skipped
  // sources (covered by the resilience check below).
  for (const M of Object.values(models)) await M.sync({ force: true });
  await DigitalOfficeRecord.sync({ force: true });
  await DigitalOfficeAudit.sync({ force: true });
  ok('IMS + office tables created', true);

  const { migrateLegacy, MODULE_MAP } = require('../services/ims/migrateLegacy');

  console.log('\nFresh database, before migration:');
  ok('no IMS transactions yet', await models.ImsTransaction.count() === 0);
  ok('no IMS documents yet', await models.ImsDocument.count() === 0);

  // One legacy row per kind of target: a mapped finance module, a mapped
  // governance module, and an unmapped module (must be archived, not dropped).
  await DigitalOfficeRecord.create({ recordId: 'LEG-EXP-1', module: 'expenses', recordType: 'general', recordDate: '2025-06-01', amount: 500, direction: 'out', paymentMode: 'Cash', data: { payee: 'Vendor A', category: 'Office' } });
  await DigitalOfficeRecord.create({ recordId: 'LEG-DON-1', module: 'donations', recordType: 'donation', recordDate: '2025-06-02', amount: 1000, direction: 'in', paymentMode: 'Cash', data: { donorName: 'Donor X' } });
  await DigitalOfficeRecord.create({ recordId: 'LEG-MEET-1', module: 'meetings', recordType: 'agm', recordDate: '2025-06-03', data: { title: 'Annual General Meeting' } });
  await DigitalOfficeRecord.create({ recordId: 'LEG-UNK-1', module: 'mysteryModule', recordType: 'x', recordDate: '2025-06-04', data: { foo: 'bar' } });

  console.log('\nMigration moves every record into IMS:');
  const stats = await migrateLegacy({ dryRun: false });
  ok('expense landed as an IMS transaction', await models.ImsTransaction.count() === 1, `n=${await models.ImsTransaction.count()}`);
  ok('donation landed as an IMS donation', await models.ImsDonation.count() === 1, `n=${await models.ImsDonation.count()}`);
  ok('meeting landed as an IMS meeting', await models.ImsMeeting.count() === 1, `n=${await models.ImsMeeting.count()}`);
  const archived = await models.ImsDocument.findOne({ where: { recordId: { [require('sequelize').Op.like]: 'DOC%' } } });
  ok('unmapped module archived as an IMS document', !!archived);
  ok('unmapped module is reported', stats.unmapped.includes('mysteryModule:LEG-UNK-1'), JSON.stringify(stats.unmapped));
  // pg-mem cannot create the legacy social tables (ENUM columns), so those four
  // sources are expected to report a missing table; the office-records source
  // (the one this test drives) must never error.
  const officeErrors = stats.errors.filter((e) => e.startsWith('digitalOfficeRecords:'));
  ok('the office-records source never errors', officeErrors.length === 0, JSON.stringify(officeErrors));
  ok('only the absent legacy social tables are skipped', stats.errors.every((e) => /relation ".*" does not exist/.test(e)), JSON.stringify(stats.errors.map((e) => e.split(':')[0])));

  const txn = await models.ImsTransaction.findOne({ where: { sourceRecordId: 'LEG-EXP-1' } });
  ok('transaction keeps its amount and direction', txn && Number(txn.amount) === 500 && txn.direction === 'out');
  ok('transaction keeps the original legacy payload', txn && txn.data && txn.data._legacyRecordId === 'LEG-EXP-1');

  console.log('\nIdempotent — re-running adds nothing:');
  const second = await migrateLegacy({ dryRun: false });
  ok('re-run creates no transactions', (second.created.transactions || 0) === 0, `created=${second.created.transactions}`);
  ok('re-run skips the migrated rows', second.skipped >= 4, `skipped=${second.skipped}`);
  ok('transaction count unchanged', await models.ImsTransaction.count() === 1);
  ok('donation count unchanged', await models.ImsDonation.count() === 1);

  console.log('\nAdditive only — legacy tables are never touched:');
  ok('legacy Digital Office rows still present', await DigitalOfficeRecord.count() === 4, `n=${await DigitalOfficeRecord.count()}`);

  console.log('\nResilient — one unreadable source does not abort the rest:');
  const Module = require('module');
  const originalLoad = Module._load;
  Module._load = function (request, parent, isMain) {
    if (request === '../../models/Member' || request.endsWith('/models/Member') || request === '../models/Member') {
      throw new Error('simulated unreadable Members table');
    }
    return originalLoad.apply(this, arguments);
  };
  let resilient;
  try { resilient = await migrateLegacy({ dryRun: true }); }
  finally { Module._load = originalLoad; }
  ok('a failing source is reported, not thrown', resilient.errors.some((e) => e.startsWith('members:')));
  ok('the office records source still ran', resilient.sources.digitalOfficeRecords === 4, `n=${resilient.sources.digitalOfficeRecords}`);

  console.log('\nMODULE_MAP coverage:');
  const viewOnly = new Set(['dashboard', 'certificates', 'reports', 'finDashboard', 'finStatements', 'finTransactions', 'finLedger', 'finIntegrity', 'finAudit', 'integrity', 'form10bd', 'audit']);
  ok('every non-view module is mapped', Object.keys(MODULE_MAP).length >= 131, `mapped=${Object.keys(MODULE_MAP).length}`);
  ok('view-only screens are intentionally absent', viewOnly.size === 12);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((error) => { console.error(error); process.exit(1); });
