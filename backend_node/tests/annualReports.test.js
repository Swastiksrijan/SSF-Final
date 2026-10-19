// Verifies the Annual Progress Reports seed against an in-memory Postgres
// (pg-mem), exercising the real models and seed code paths (nothing mocked).
//
//   cd backend_node && node tests/annualReports.test.js
process.env.NODE_ENV = 'test';

const { newDb } = require('pg-mem');
const mem = newDb();
const pgAdapter = mem.adapters.createPg();
const realPgPath = require.resolve('pg');
require(realPgPath);
require.cache[realPgPath].exports = { ...require.cache[realPgPath].exports, Client: pgAdapter.Client, Pool: pgAdapter.Pool };

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

// pg-mem cannot parse DECIMAL(n,2); rewrite to NUMERIC so sequelize.sync works.
function patchDecimals(sequelize) {
  const orig = sequelize.query.bind(sequelize);
  sequelize.query = (sql, opts) => {
    let s = sql;
    if (typeof s === 'string') s = s.replace(/DECIMAL\(\s*\d+\s*,\s*\d+\s*\)/gi, 'NUMERIC');
    return orig(s, opts);
  };
}

async function main() {
  const { sequelize, models } = require('../models/ims');
  patchDecimals(sequelize);
  await sequelize.sync({ force: true });

  const { seedAnnualReports, annualReportRegister } = require('../services/ims/annualReportSeed');
  const { ANNUAL_REPORTS, PROGRAMMES } = require('../data/annualReports');

  const expectedActivities = ANNUAL_REPORTS.reduce((n, y) => n + y.activities.length, 0);

  console.log('\nAnnual Reports seed (first run):');
  const first = await seedAnnualReports();
  ok('creates one project per report year', first.projects === ANNUAL_REPORTS.length, `got ${first.projects}`);
  ok('creates one document per report year', first.documents === ANNUAL_REPORTS.length, `got ${first.documents}`);
  ok('creates one activity per named initiative', first.activities === expectedActivities, `got ${first.activities} want ${expectedActivities}`);
  ok('creates one programme per area of work', first.programmes === PROGRAMMES.length, `got ${first.programmes}`);
  ok('creates a financial year per report period', first.financialYears === ANNUAL_REPORTS.length, `got ${first.financialYears}`);

  console.log('\nIdempotency (second run):');
  const second = await seedAnnualReports();
  ok('no projects re-created', second.projects === 0, `got ${second.projects}`);
  ok('no documents re-created', second.documents === 0, `got ${second.documents}`);
  ok('no activities re-created', second.activities === 0, `got ${second.activities}`);
  ok('no programmes re-created', second.programmes === 0, `got ${second.programmes}`);
  ok('no financial years re-created', second.financialYears === 0, `got ${second.financialYears}`);
  ok('table counts unchanged',
    (await models.ImsProject.count()) === ANNUAL_REPORTS.length
    && (await models.ImsDocument.count()) === ANNUAL_REPORTS.length
    && (await models.ImsActivity.count()) === expectedActivities);

  console.log('\nNo destructive writes:');
  // Edit a record the way an admin would, then re-run the seed.
  const doc = await models.ImsDocument.findOne({ where: { recordId: 'DOC-AR-2020-21' } });
  ok('report document exists for 2020-21', !!doc);
  await doc.update({ owner: 'Edited By Admin' });
  const proj = await models.ImsProject.findOne({ where: { recordId: 'PROJECT-AR-2020-21' } });
  await proj.update({ projectStatus: 'onHold' });
  await seedAnnualReports();
  await doc.reload(); await proj.reload();
  ok('admin-edited document field is preserved', doc.owner === 'Edited By Admin', doc.owner);
  ok('admin-edited project status is preserved', proj.projectStatus === 'onHold', proj.projectStatus);
  ok('nothing was archived by the seed',
    (await models.ImsDocument.count({ where: { status: 'archived' } })) === 0
    && (await models.ImsActivity.count({ where: { status: 'archived' } })) === 0);

  console.log('\nSource fidelity:');
  const d = await models.ImsDocument.findOne({ where: { recordId: 'DOC-AR-2025-26' } });
  ok('every report document links to its Drive file', /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/.test(d.fileUrl), d.fileUrl);
  ok('document category is Annual Report', d.category === 'Annual Report', d.category);
  ok('public confidentiality', d.confidentiality === 'public', d.confidentiality);
  const uniqueUrls = new Set((await models.ImsDocument.findAll()).map((x) => x.fileUrl));
  ok('each year has a distinct source PDF', uniqueUrls.size === ANNUAL_REPORTS.length, `got ${uniqueUrls.size}`);
  const p = await models.ImsProject.findOne({ where: { recordId: 'PROJECT-AR-2013-14' } });
  const dstr = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
  ok('project period matches the reporting year', dstr(p.startDate) === '2013-04-01' && dstr(p.endDate) === '2014-03-31', `${p.startDate}..${p.endDate}`);
  ok('project carries the report summary', p.objective.includes('30 December 2013'));

  console.log('\nRegister endpoint payload:');
  const reg = await annualReportRegister();
  ok('lists every year', reg.years.length === ANNUAL_REPORTS.length, `got ${reg.years.length}`);
  ok('totals are consistent',
    reg.totals.documents === ANNUAL_REPORTS.length
    && reg.totals.projects === ANNUAL_REPORTS.length
    && reg.totals.activities === expectedActivities);
  const y2013 = reg.years.find((x) => x.year === '2013–14');
  ok('a year exposes its document, project and activities',
    !!y2013.document && !!y2013.project && y2013.activities.length === 2);
  ok('year is newest-last / order preserved', reg.years[reg.years.length - 1].year === '2025–26');
  const anyCovered = reg.years.every((x) => x.programmesCovered.length > 0);
  ok('every year maps its initiatives to programmes', anyCovered);

  console.log('\nCross-links:');
  const { models: M } = require('../models/ims');
  const links = await M.ImsRelation.findAll();
  ok('activities are linked to their report document', links.some((l) => l.fromType === 'activities' && l.toType === 'documents' && l.relation === 'reportedIn'));
  ok('activities are linked to their programme', links.some((l) => l.fromType === 'activities' && l.toType === 'programmes' && l.relation === 'programme'));
  ok('the year project is linked to its report document', links.some((l) => l.fromType === 'projects' && l.toType === 'documents' && l.relation === 'reportedIn'));

  console.log(`\n${pass} passing, ${fail} failed`);
  await sequelize.close();
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
