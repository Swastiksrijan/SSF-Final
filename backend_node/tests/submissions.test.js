// Acceptance tests for the unified Submissions register.
// Runs against an in-memory Postgres (pg-mem) using the real models + service.
//
//   node backend_node/tests/submissions.test.js
process.env.NODE_ENV = 'test';

const { newDb } = require('pg-mem');
const mem = newDb();
mem.public.registerEnum('enum_Interests_interestType', ['movement', 'partner', 'volunteer', 'member', 'role']);
mem.public.registerEnum('enum_Interests_status', ['new', 'contacted', 'approved', 'rejected', 'closed']);
mem.public.registerEnum('enum_Members_status', ['pending', 'changes_requested', 'approved', 'rejected']);
mem.public.registerEnum('enum_Members_paymentStatus', ['not_required', 'pending', 'paid', 'failed']);
mem.public.registerEnum('enum_Donors_paymentStatus', ['pending', 'paid', 'failed', 'offline']);
mem.public.registerEnum('enum_Donors_status', ['new', 'contacted', 'completed']);
mem.public.registerEnum('enum_Volunteers_status', ['pending', 'changes_requested', 'approved', 'rejected']);
mem.public.registerEnum('enum_InternshipApplications_status', ['pending', 'reviewed', 'selected', 'completed', 'rejected']);
mem.public.registerEnum('enum_ContactMessages_status', ['new', 'contacted', 'closed']);
mem.public.registerEnum('enum_Complaints_status', ['received', 'under_review', 'awaiting_information', 'resolved', 'closed']);
let rewritingDonors = false;
mem.public.interceptQueries((sql) => {
  if (sql.includes('pg_enum') && /typname='enum_/.test(sql)) return [];
  if (/DROP TYPE IF EXISTS "public"\."enum_/.test(sql)) return [];
  // pg-mem cannot create DECIMAL(12,2); rewrite the Donors table to NUMERIC.
  if (!rewritingDonors && /CREATE TABLE IF NOT EXISTS "Donors"/.test(sql)) {
    rewritingDonors = true;
    try { mem.public.none(sql.replace(/DECIMAL\(12,2\)/g, 'NUMERIC(12,2)')); } finally { rewritingDonors = false; }
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
  const Interest = require('../models/Interest');
  const Member = require('../models/Member');
  const Volunteer = require('../models/Volunteer');
  const Donor = require('../models/Donor');
  const InternshipApplication = require('../models/InternshipApplication');
  const ContactMessage = require('../models/ContactMessage');
  const Complaint = require('../models/Complaint');
  const { models } = require('../models/ims');

  for (const m of [Interest, Member, Volunteer, Donor, InternshipApplication, ContactMessage, Complaint]) {
    await m.sync({ force: true });
  }
  await models.ImsSubmissionNote.sync({ force: true });

  const subs = require('../services/ims/submissions');

  console.log('\nAggregation across source tables:');
  await Interest.create({ interestType: 'member', fullName: 'Asha Verma', email: 'asha@example.com', phone: '9990001111', category: 'Life Member', message: 'Interested in life membership' });
  await Interest.create({ interestType: 'volunteer', fullName: 'Bilal Khan', email: 'bilal@example.com', phone: '9990002222', message: 'Weekend volunteer' });
  await Member.create({ fullName: 'Chetan Rao', email: 'chetan@example.com', phone: '9990003333', memberType: 'patron', city: 'Pune', status: 'pending' });
  await Donor.create({ fullName: 'Hari Prasad', email: 'hari@example.com', phone: '9990008888', city: 'Delhi', donationPurpose: 'education', amount: 5000 });
  await Volunteer.create({ fullName: 'Divya Nair', email: 'divya@example.com', phone: '9990004444', volunteerType: 'field', position: 'Coordinator' });
  await InternshipApplication.create({ fullName: 'Esha Gupta', email: 'esha@example.com', phone: '9990005555', college: 'IIT', course: 'BTech', internshipType: 'summer', duration: '2 months', resumePath: '/uploads/r.pdf' });
  await ContactMessage.create({ firstName: 'Farid', lastName: 'Ali', email: 'farid@example.com', phone: '9990006666', message: 'Please share details' });
  await Complaint.create({ reference: 'SSF/GRV/1', fullName: 'Gita Singh', email: 'gita@example.com', phone: '9990007777', category: 'service', subject: 'Delay in response', description: 'No reply yet' });

  const all = await subs.list({});
  const byType = (t) => all.filter((r) => r.sourceType === t).length;
  ok('returns every source type', all.length >= 8, `len=${all.length}`);
  ok('interest rows present', byType('interest') === 2, byType('interest'));
  ok('member row present', byType('member') === 1);
  ok('donor row present', byType('donor') === 1);
  ok('volunteer row present', byType('volunteer') === 1);
  ok('internship row present', byType('internship') === 1);
  ok('contact row present', byType('contact') === 1);
  ok('complaint row present', byType('complaint') === 1);

  const asha = all.find((r) => r.name === 'Asha Verma');
  ok('row has composite id', asha && /^interest:[0-9a-f-]{8,}$/.test(asha.id), asha && asha.id);
  ok('contact name composed from first+last', all.some((r) => r.name === 'Farid Ali'));

  console.log('\nFiltering:');
  const onlyMembers = await subs.list({ type: 'member' });
  ok('type filter returns only members', onlyMembers.length === 1 && onlyMembers[0].name === 'Chetan Rao', onlyMembers.length);
  const searchDivya = await subs.list({ q: 'divya' });
  ok('search matches name (case-insensitive)', searchDivya.length === 1 && searchDivya[0].sourceType === 'volunteer');
  const searchPhone = await subs.list({ q: '9990007777' });
  ok('search matches phone', searchPhone.length === 1 && searchPhone[0].name === 'Gita Singh');
  const noMatch = await subs.list({ q: 'zzzz-nobody' });
  ok('no match returns empty', noMatch.length === 0);

  console.log('\nOffice-side remark + follow-up (never touches the source row):');
  const before = await subs.list({ type: 'member' });
  ok('followUp defaults to new', before[0].followUp === 'new');
  await subs.updateNote(onlyMembers[0].id, { remark: 'Called, awaiting documents', followUp: 'contacted', updatedBy: 'admin' });
  const after = await subs.list({ type: 'member' });
  ok('remark persisted', after[0].remark === 'Called, awaiting documents', after[0].remark);
  ok('followUp persisted', after[0].followUp === 'contacted');
  const srcMember = await Member.findOne({ where: { fullName: 'Chetan Rao' } });
  ok('source row is untouched', srcMember.status === 'pending' && !srcMember.remark);

  await subs.updateNote(onlyMembers[0].id, { followUp: 'closed' });
  const filtered = await subs.list({ followUp: 'closed' });
  ok('follow-up filter works', filtered.length === 1 && filtered[0].name === 'Chetan Rao');
  ok('remark kept when only follow-up changes', (await subs.list({ type: 'member' }))[0].remark === 'Called, awaiting documents');

  let bad = false;
  try { await subs.updateNote('member:1', { followUp: 'nonsense' }); } catch (e) { bad = e.status === 400; }
  ok('invalid follow-up rejected (400)', bad);
  let badType = false;
  try { await subs.updateNote('nope:1', { remark: 'x' }); } catch (e) { badType = e.status === 400; }
  ok('unknown type rejected (400)', badType);

  console.log('\nSummary:');
  const summary = await subs.summary();
  ok('summary totals', summary.total === 8, summary.total);
  ok('summary counts member', summary.counts.member === 1);
  ok('summary tracks closed follow-up', summary.byFollowUp.closed === 1, JSON.stringify(summary.byFollowUp));

  console.log('\nDelete (permanent, all source types incl. complaint):');
  const complaintRow = (await subs.list({ type: 'complaint' }))[0];
  const delResult = await subs.remove(complaintRow.id);
  ok('complaint delete returns deleted flag', delResult.deleted === true && delResult.sourceType === 'complaint');
  ok('complaint row gone from source table', (await Complaint.findByPk(complaintRow.sourceId)) === null);
  ok('complaint gone from register', (await subs.list({ type: 'complaint' })).length === 0);

  const contactRow = (await subs.list({ type: 'contact' }))[0];
  await subs.updateNote(contactRow.id, { remark: 'temp', followUp: 'closed' });
  await subs.remove(contactRow.id);
  ok('contact row deleted', (await ContactMessage.findByPk(contactRow.sourceId)) === null);
  ok('sidecar note cleaned up on delete', (await models.ImsSubmissionNote.findOne({ where: { sourceType: 'contact', sourceId: contactRow.sourceId } })) === null);
  ok('summary reflects deletion', (await subs.summary()).total === 6, (await subs.summary()).total);

  let delUnknown = false;
  try { await subs.remove('nope:1'); } catch (e) { delUnknown = e.status === 400; }
  ok('delete unknown type rejected (400)', delUnknown);
  let delMissing = false;
  try { await subs.remove('member:does-not-exist'); } catch (e) { delMissing = e.status === 404; }
  ok('delete missing row rejected (404)', delMissing);
  let delBadId = false;
  try { await subs.remove('member:'); } catch (e) { delBadId = e.status === 400; }
  ok('delete blank id rejected (400)', delBadId);

  console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} — ${pass} passed, ${fail} failed`);
  if (fail) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
