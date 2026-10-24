// Verifies the FY 2025-26 workbook registers seed (Sector Registers, Annual
// Compliance, Sahyog in-kind support) against an in-memory Postgres (pg-mem),
// exercising the real models and seed code paths (nothing mocked).
//
//   cd backend_node && node tests/fyRegisters.test.js
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

const day = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v || '').slice(0, 10));

async function main() {
  const { sequelize, models } = require('../models/ims');
  patchDecimals(sequelize);
  // The legacy Digital Office table is not part of the IMS model set.
  require('../models/DigitalOfficeRecord');
  await sequelize.sync({ force: true });

  const { seedAnnualReports } = require('../services/ims/annualReportSeed');
  const { seedFinancialYearRegisters } = require('../services/ims/fyRegistersSeed');
  const {
    SECTOR_REGISTERS, ANNUAL_COMPLIANCE, SAHYOG_SUPPORT,
  } = require('../data/financialYearRegisters');
  const DigitalOfficeRecord = require('../models/DigitalOfficeRecord');

  // Boot order: meetings first (compliance links resolve the meeting held that
  // day), then the annual reports (which own the programme + FY namespaces).
  // The meetings seed itself is exercised by its own path; here we only need a
  // meeting to exist on each compliance date, so insert them directly.
  for (const c of ANNUAL_COMPLIANCE) {
    const exists = await models.ImsMeeting.findOne({ where: { recordId: 'MEET-' + c.date } });
    if (exists) continue;
    await models.ImsMeeting.create({
      recordId: 'MEET-' + c.date, title: c.purpose, meetingType: c.type,
      meetingDate: c.date, mode: 'offline', status: 'active',
    });
  }
  await seedAnnualReports();

  console.log('\nFY 2025-26 registers seed (first run):');
  const first = await seedFinancialYearRegisters();
  ok('creates one activity per sector row', first.sectorActivities === SECTOR_REGISTERS.length, `got ${first.sectorActivities}`);
  ok('creates one compliance row per entry', first.compliance === ANNUAL_COMPLIANCE.length, `got ${first.compliance}`);
  ok('creates one sahyog row per support entry', first.sahyog === SAHYOG_SUPPORT.length, `got ${first.sahyog}`);

  console.log('\nIdempotency (second run):');
  const second = await seedFinancialYearRegisters();
  ok('no sector activities re-created', second.sectorActivities === 0, `got ${second.sectorActivities}`);
  ok('no compliance rows re-created', second.compliance === 0, `got ${second.compliance}`);
  ok('no sahyog rows re-created', second.sahyog === 0, `got ${second.sahyog}`);
  ok('table counts unchanged',
    (await models.ImsCompliance.count()) === ANNUAL_COMPLIANCE.length
    && (await DigitalOfficeRecord.count({ where: { module: 'sahyog' } })) === SAHYOG_SUPPORT.length);

  console.log('\nSector Registers -> Programmes > Activities:');
  const edu = await models.ImsActivity.findOne({ where: { recordId: 'ACT-SECTOR-EDUCATION' } });
  ok('education sector activity exists', !!edu);
  ok('education carries its expenditure', Number(edu.data.expenditure) === 1000, String(edu.data && edu.data.expenditure));
  ok('education is dated 2025-06-15', day(edu.activityDate) === '2025-06-15', day(edu.activityDate));
  ok('education is an educationSupport activity', edu.activityType === 'educationSupport', edu.activityType);
  ok('education outcome names the sector and amount', /Education/.test(edu.outcome) && /1000/.test(edu.outcome), edu.outcome);
  ok('education keeps the source sector in data', edu.data.sector === 'Education', edu.data && edu.data.sector);
  const env = await models.ImsActivity.findOne({ where: { recordId: 'ACT-SECTOR-ENVIRONMENT' } });
  ok('environment carries the audited 15200', Number(env.data.expenditure) === 15200, String(env.data && env.data.expenditure));
  ok('environment is a plantation activity', env.activityType === 'plantation', env.activityType);
  const comm = await models.ImsActivity.findOne({ where: { recordId: 'ACT-SECTOR-COMMUNITY' } });
  ok('community row exists with no date', !!comm && !comm.activityDate);
  ok('a row with no expenditure is a Rs0 activity', comm.isFree === true, String(comm.isFree));

  console.log('\nSector activities attach to their programme and financial year:');
  const prog = await models.ImsProgramme.findOne({ where: { recordId: 'PROGRAM-ANNUAL-EDUCATION' } });
  const fy = await models.ImsFinancialYear.findOne({ where: { label: '2025–26' } });
  ok('education programme exists (from the annual reports seed)', !!prog);
  ok('education activity is linked to its programme',
    (await models.ImsRelation.findOne({ where: { fromType: 'activities', fromId: 'ACT-SECTOR-EDUCATION', toType: 'programmes', relation: 'programme' } })) !== null);
  ok('education activity carries its programme name', edu.data.programmeName === prog.name, edu.data.programmeName);
  const yrProject = await models.ImsProject.findOne({ where: { recordId: 'PROJECT-AR-2025-26' } });
  ok('FY 2025-26 year project exists', !!yrProject);
  ok('education activity is attached to the year project', edu.projectId === yrProject.id, `${edu.projectId} vs ${yrProject && yrProject.id}`);
  ok('FY 2025-26 exists (from the annual reports seed)', !!fy, fy && fy.recordId);
  ok('education activity carries the FY recordId', edu.data.financialYearId === fy.recordId, edu.data.financialYearId);
  const fyLinks = (await models.ImsRelation.findAll()).filter((l) => l.fromType === 'activities' && l.toType === 'financialYears');
  ok('sector activities are linked to the financial year', fyLinks.length >= SECTOR_REGISTERS.length, `got ${fyLinks.length}`);

  console.log('\nSector expenditure ties back to the Expense register totals:');
  const { FIN_REGISTERS } = require('../../src/data/financialRecords');
  const expReg = FIN_REGISTERS.find((r) => r.id === 'expenses');
  const col = (name) => expReg.columns.indexOf(name);
  const sumCategory = (label) => expReg.rows
    .filter((r) => String(r[col('Category')]).toLowerCase() === label.toLowerCase())
    .reduce((n, r) => n + Number(r[col('Amount (₹)')] || 0), 0);
  ok('education total matches the expense register',
    sumCategory('Education Exp.') === Number(edu.data.expenditure), `${sumCategory('Education Exp.')} vs ${edu.data.expenditure}`);
  ok('environment total matches the expense register',
    sumCategory('Environment Protection & Awareness') === Number(env.data.expenditure), `${sumCategory('Environment Protection & Awareness')} vs ${env.data.expenditure}`);

  console.log('\nAnnual Compliance -> Compliance register:');
  const comp = await models.ImsCompliance.findOne({ where: { recordId: 'CMP-ANNUAL-01' } });
  ok('COMP-01 exists', !!comp);
  ok('obligation is the agenda/purpose', comp.obligation === 'Approval of FY 2024-25 Audit Report', comp.obligation);
  ok('compliance type kept in legalSource', comp.legalSource === 'AGM', comp.legalSource);
  ok('date is 2025-04-30', day(comp.dueDate) === '2025-04-30', day(comp.dueDate));
  ok('decision kept as evidence', /approved unanimously/.test(comp.evidence), comp.evidence);
  ok('status is filed', comp.complianceStatus === 'filed', comp.complianceStatus);
  ok('every compliance row has a distinct number',
    new Set((await models.ImsCompliance.findAll()).map((x) => x.data.complianceNo)).size === ANNUAL_COMPLIANCE.length);

  console.log('\nResponsible person resolves to the committee position:');
  // The governance seed uses findOrCreate, which pg-mem's plpgsql shim cannot
  // parse; create the committee rows directly (the same shape the seed writes),
  // then re-run so the compliance rows resolve their responsible person.
  const committee = await models.ImsCommittee.create({ recordId: 'COMM-1', name: 'Current Managing Committee', isCurrent: true });
  for (const [position, name] of [['President', 'Ramesh Pandey'], ['Vice President', 'Preeti Shukla'], ['Secretary', 'Amit Kumar Pandey']]) {
    const person = await models.ImsPerson.create({ recordId: 'P-' + position.replace(/\s/g, ''), fullName: name, status: 'active' });
    await models.ImsCommitteeMember.create({ recordId: 'CM-' + position.replace(/\s/g, ''), committeeId: committee.id, personId: person.id, position, status: 'active' });
  }
  await seedFinancialYearRegisters();
  const pres = await models.ImsCommitteeMember.findOne({ where: { position: 'President' } });
  const comp2 = await models.ImsCompliance.findOne({ where: { recordId: 'CMP-ANNUAL-01' } });
  ok('president exists in the committee', !!pres);
  ok('COMP-01 responsible person is the President', comp2.responsiblePersonId === pres.personId,
    `${comp2.responsiblePersonId} vs ${pres && pres.personId}`);
  const comp10 = await models.ImsCompliance.findOne({ where: { recordId: 'CMP-ANNUAL-10' } });
  const vp = await models.ImsCommitteeMember.findOne({ where: { position: 'Vice President' } });
  ok('COMP-10 responsible person is the Vice President', comp10.responsiblePersonId === vp.personId,
    `${comp10.responsiblePersonId} vs ${vp && vp.personId}`);

  console.log('\nCompliance resolves the meeting held that day:');
  const { models: M } = require('../models/ims');
  const links = await M.ImsRelation.findAll();
  ok('compliance rows are linked to their meeting',
    links.some((l) => l.fromType === 'compliance' && l.toType === 'meetings' && l.relation === 'resolution'));

  console.log('\nSahyog in-kind support -> Sahyog register:');
  const syg = await DigitalOfficeRecord.findAll({ where: { module: 'sahyog' }, order: [['recordDate', 'ASC']] });
  ok('all sahyog rows are in module sahyog', syg.length === SAHYOG_SUPPORT.length, `got ${syg.length}`);
  const total = syg.reduce((n, r) => n + Number(r.amount || 0), 0);
  ok('total support is Rs 20,800', total === 20800, `got ${total}`);
  ok('mode is in-kind', syg.every((r) => r.data.mode === 'In-kind'));
  ok('each row names the property owner', syg.every((r) => r.data.name === 'Property Owner (Office Landlord)'));
  ok('sahyog type is Rent', syg.every((r) => r.data.sahyogType === 'Rent'));
  const feb = syg.find((r) => day(r.recordDate) === '2026-02-01');
  ok('February support is Rs 1000 (partial rent)', feb && Number(feb.amount) === 1000, feb && String(feb.amount));

  console.log('\nSahyog total ties back to the Expense register Support rows:');
  const supportTotal = expReg.rows
    .filter((r) => String(r[col('Mode')]).toLowerCase() === 'support')
    .reduce((n, r) => n + Number(r[col('Amount (₹)')] || 0), 0);
  ok('support total matches the expense register', supportTotal === total, `${supportTotal} vs ${total}`);

  console.log('\nNo destructive writes:');
  const row = await models.ImsCompliance.findOne({ where: { recordId: 'CMP-ANNUAL-05' } });
  await row.update({ complianceStatus: 'na' });
  const act = await models.ImsActivity.findOne({ where: { recordId: 'ACT-SECTOR-EDUCATION' } });
  await act.update({ outcome: 'Edited By Admin' });
  await seedFinancialYearRegisters();
  await row.reload(); await act.reload();
  ok('admin-edited compliance status is preserved', row.complianceStatus === 'na', row.complianceStatus);
  ok('admin-edited activity outcome is preserved', act.outcome === 'Edited By Admin', act.outcome);
  ok('nothing was archived by the seed',
    (await models.ImsCompliance.count({ where: { status: 'archived' } })) === 0
    && (await models.ImsActivity.count({ where: { status: 'archived' } })) === 0);

  console.log(`\n${pass} passing, ${fail} failed`);
  await sequelize.close();
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
