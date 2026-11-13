// Acceptance tests for Correspondence & Communication Management.
// Runs against an in-memory Postgres (pg-mem) so the real models and service
// code paths are exercised — the logic under test is not mocked.
//
//   node backend_node/tests/correspondence.test.js
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

async function main() {
  const { sequelize, models } = require('../models/ims');
  // pg-mem chokes on some unrelated column types (e.g. DECIMAL(12,2)); sync only
  // the tables this suite touches.
  await models.ImsCommunication.sync({ force: true });
  await models.ImsAuditTrail.sync({ force: true });
  await models.ImsIdSequence.sync({ force: true });

  const corr = require('../services/ims/correspondence');
  const { backfillCorrespondence, DEPT_BY_EMAIL } = require('../services/ims/correspondenceBackfill');
  const Com = models.ImsCommunication;

  console.log('\nFinancial-year label:');
  ok('14 Nov 2026 -> 2026-27', corr.fyLabel('2026-11-14') === '2026-27', corr.fyLabel('2026-11-14'));
  ok('14 Feb 2026 -> 2025-26', corr.fyLabel('2026-02-14') === '2025-26', corr.fyLabel('2026-02-14'));
  ok('Date object works', corr.fyLabel(new Date(2026, 3, 1)) === '2026-27', corr.fyLabel(new Date(2026, 3, 1)));

  console.log('\nReference numbering (date passed as ISO string, as the form sends it):');
  const r1 = await corr.nextReference('outward', '2026-11-14');
  ok('first outward ref', r1 === 'SSF/OUT/2026-27/001', r1);
  await Com.create({ recordId: 'COM-000001', direction: 'outward', referenceNo: r1, correspondenceDate: '2026-11-14' });
  const r2 = await corr.nextReference('outward', '2026-11-14');
  ok('second outward ref increments', r2 === 'SSF/OUT/2026-27/002', r2);
  const ri = await corr.nextReference('inward', '2026-11-15');
  ok('inward uses its own sequence', ri === 'SSF/IN/2026-27/001', ri);
  const rPrevFy = await corr.nextReference('outward', '2026-02-14');
  ok('previous FY gets its own series', rPrevFy === 'SSF/OUT/2025-26/001', rPrevFy);

  console.log('\nCreate via the resource engine auto-assigns reference + defaults:');
  const resource = require('../services/ims/resource');
  const created = await resource.create('communications', {
    direction: 'outward', correspondenceDate: '2026-11-14', subject: 'Auto ref test',
  });
  ok('referenceNo auto-generated on create', /^SSF\/OUT\/2026-27\/\d{3}$/.test(created.referenceNo || ''), created.referenceNo);
  ok('outward replyStatus defaults to awaiting_reply', created.replyStatus === 'awaiting_reply', created.replyStatus);
  ok('followUpStatus defaults to not_due', created.followUpStatus === 'not_due', created.followUpStatus);
  const createdIn = await resource.create('communications', { direction: 'inward', correspondenceDate: '2026-11-15', subject: 'Inward auto' });
  ok('inward replyStatus defaults to not_required', createdIn.replyStatus === 'not_required', createdIn.replyStatus);
  ok('supplied referenceNo is respected', (await resource.create('communications', { direction: 'outward', correspondenceDate: '2026-11-14', subject: 'Manual', referenceNo: 'SSF/OUT/2026-27/900' })).referenceNo === 'SSF/OUT/2026-27/900');

  console.log('\nList filters:');
  await Com.create({ recordId: 'COM-000010', direction: 'outward', referenceNo: 'SSF/OUT/2026-27/010', correspondenceDate: '2026-11-14', department: 'वन विभाग, मध्य प्रदेश', mode: 'email' });
  await Com.create({ recordId: 'COM-000011', direction: 'inward', referenceNo: 'SSF/IN/2026-27/002', correspondenceDate: '2026-11-15', department: 'Other Dept', mode: 'email' });
  const outOnly = await corr.list({ direction: 'outward' });
  ok('direction filter returns only outward', outOnly.records.every((x) => x.direction === 'outward'), `n=${outOnly.records.length}`);
  ok('outward count includes seeded rows', outOnly.total >= 3, `total=${outOnly.total}`);
  const byDept = await corr.list({ search: 'वन विभाग' });
  ok('search matches department', byDept.total === 1, `total=${byDept.total}`);
  const byMode = await corr.list({ mode: 'email' });
  ok('mode filter works', byMode.records.every((x) => x.mode === 'email'), `n=${byMode.records.length}`);

  console.log('\nDashboard counts:');
  const outward = await Com.create({ recordId: 'COM-000020', direction: 'outward', correspondenceDate: '2026-11-14', subject: 'dash outward' });
  const inward = await Com.create({ recordId: 'COM-000021', direction: 'inward', correspondenceDate: '2026-11-15', subject: 'dash inward' });
  await corr.linkReply(inward.id, outward.id, {});
  const dash = await corr.dashboard();
  ok('total counts all live rows', dash.total === await Com.count(), `total=${dash.total}`);
  ok('repliesReceived counts outward with a linked reply (not inward)', dash.repliesReceived === 1, `repliesReceived=${dash.repliesReceived}`);
  ok('awaitingReplies excludes the replied-to outward', dash.awaitingReplies === await Com.count({ where: { direction: 'outward', replyStatus: 'awaiting_reply' } }), `awaiting=${dash.awaitingReplies}`);
  ok('inward does not inflate repliesReceived', dash.repliesReceived < dash.inward + 1);

  console.log('\nReply linking:');
  const linked = await corr.repliesOf(outward.id);
  ok('repliesOf returns the linked inward', linked.replies.length === 1 && linked.replies[0].id === inward.id, `n=${linked.replies.length}`);
  ok('outward replyCount updated', linked.outward.replyCount === 1, `replyCount=${linked.outward.replyCount}`);
  ok('inward linkedOutwardRef set', linked.replies[0].linkedOutwardRef === outward.referenceNo || !!linked.replies[0].linkedOutwardRef, linked.replies[0].linkedOutwardRef);
  let threw = null;
  try { await corr.linkReply(outward.id, inward.id, {}); } catch (e) { threw = e; }
  ok('cannot link a non-inward as a reply', threw && threw.status === 400, threw && threw.message);
  await corr.unlinkReply(inward.id, {});
  const afterUnlink = await Com.findByPk(outward.id);
  ok('unlink resets outward replyCount', afterUnlink.replyCount === 0, `replyCount=${afterUnlink.replyCount}`);
  ok('unlink resets outward replyStatus', afterUnlink.replyStatus === 'awaiting_reply', afterUnlink.replyStatus);

  console.log('\nFollow-up queue:');
  await Com.create({ recordId: 'COM-000030', direction: 'outward', correspondenceDate: '2026-11-14', replyStatus: 'awaiting_reply', followUpDate: '2020-01-01', followUpStatus: 'due' });
  const due = await corr.followUps({ scope: 'due' });
  ok('overdue follow-up is flagged', due.records.some((r) => r.overdue === true), `n=${due.records.length}`);
  const pending = await corr.followUps({ scope: 'pending' });
  ok('pending scope lists awaiting_reply rows', pending.records.every((r) => r.replyStatus === 'awaiting_reply'), `n=${pending.records.length}`);

  console.log('\nDepartment-wise report:');
  const dept = await corr.departmentWise();
  ok('grouped rows carry outward/inward/total', dept.records.every((d) => typeof d.total === 'number' && d.outward + d.inward === d.total));

  console.log('\nBackfill (additive + idempotent):');
  await Com.destroy({ where: {} });
  await Com.create({ recordId: 'COM-000100', direction: 'outward', correspondenceDate: '2026-11-14', channel: 'email', recipientEmail: 'psmededu@mp.gov.in', recipient: 'चिकित्सा शिक्षा विभाग, मध्य प्रदेश', deliveryStatus: 'failed', subject: 'legacy row' });
  const bf1 = await backfillCorrespondence();
  const row = await Com.findOne({ where: { recordId: 'COM-000100' } });
  ok('backfill fills mode', row.mode === 'email', row.mode);
  ok('backfill fills department from email map', row.department === DEPT_BY_EMAIL['psmededu@mp.gov.in'], row.department);
  ok('backfill fills departmentCategory', row.departmentCategory === 'state_government', row.departmentCategory);
  ok('backfill fills replyStatus', row.replyStatus === 'not_required', row.replyStatus);
  ok('backfill fills toEmails for outward', row.toEmails === 'psmededu@mp.gov.in', row.toEmails);
  ok('backfill keeps failed delivery', row.deliveryStatus === 'failed', row.deliveryStatus);
  ok('backfill reports touched rows', bf1.touched === 1, `touched=${bf1.touched}`);
  const bf2 = await backfillCorrespondence();
  ok('backfill is idempotent', bf2.touched === 0, `touched=${bf2.touched}`);
  // An admin-set value is never overwritten.
  row.mode = 'hand_delivery';
  await row.save();
  await backfillCorrespondence();
  ok('backfill never overwrites an admin value', (await Com.findByPk(row.id)).mode === 'hand_delivery');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  await sequelize.close();
  if (fail) process.exit(1);
}

main().catch((e) => { console.error('TEST ERROR', e); process.exit(1); });
