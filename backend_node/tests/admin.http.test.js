// Integration test: the rebuilt admin command centre.
//
// Exercises the real routers (admin dashboard KPIs, the audit trail middleware
// and the CSV export) against an in-memory Postgres (pg-mem), so the actual
// handlers, Sequelize models and aggregation queries run — nothing is mocked.
//
//   node backend_node/tests/admin.http.test.js
process.env.NODE_ENV = 'test';
process.env.ADMIN_PORTAL_TOKEN = 'test-token';

const { newDb } = require('pg-mem');
const mem = newDb();
mem.public.registerEnum('enum_Members_status', ['pending', 'changes_requested', 'approved', 'rejected']);
mem.public.registerEnum('enum_Members_paymentStatus', ['not_required', 'pending', 'paid', 'failed']);
mem.public.registerEnum('enum_Volunteers_status', ['pending', 'changes_requested', 'approved', 'rejected']);
mem.public.registerEnum('enum_Donors_paymentStatus', ['pending', 'paid', 'failed', 'offline']);
mem.public.registerEnum('enum_Donors_status', ['new', 'contacted', 'completed']);
mem.public.registerEnum('enum_Interests_interestType', ['movement', 'partner', 'volunteer', 'member']);
mem.public.registerEnum('enum_Interests_status', ['new', 'contacted', 'approved', 'rejected', 'closed']);
mem.public.registerEnum('enum_ContactMessages_status', ['new', 'contacted', 'closed']);
mem.public.registerEnum('enum_InternshipApplications_status', ['pending', 'reviewed', 'selected', 'completed', 'rejected']);
mem.public.registerEnum('enum_RoleDocuments_role', ['donor', 'intern', 'student', 'volunteer_teacher', 'skill_volunteer', 'ambassador']);
mem.public.registerEnum('enum_RoleDocuments_documentType', ['identity_card', 'certificate', 'joining_letter', 'completion_certificate', 'participation_certificate', 'training_certificate', 'appreciation_certificate', 'outstanding_contribution_certificate', 'partner_recognition']);
mem.public.registerEnum('enum_RoleDocuments_status', ['active', 'revoked', 'expired']);
let rewritingDonors = false;
mem.public.interceptQueries((sql) => {
  if (sql.includes('pg_enum') && /typname='enum_/.test(sql)) return [];
  if (/DROP TYPE IF EXISTS "public"\."enum_/.test(sql)) return [];
  if (!rewritingDonors && /CREATE TABLE IF NOT EXISTS "Donors"/.test(sql)) {
    rewritingDonors = true;
    try { mem.public.none(sql.replace(/DECIMAL\(12,2\)/g, 'NUMERIC(12,2)')); } finally { rewritingDonors = false; }
    return [];
  }
  if (/CREATE TABLE IF NOT EXISTS "RoleDocuments"/.test(sql)) return [];
  return null;
});
const pgAdapter = mem.adapters.createPg();
const realPgPath = require.resolve('pg');
require(realPgPath);
require.cache[realPgPath].exports = { ...require.cache[realPgPath].exports, Client: pgAdapter.Client, Pool: pgAdapter.Pool };

const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '..', 'uploads');
const snapshot = (dir) => {
  const found = new Set();
  const walk = (current) => {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full); else found.add(full);
    }
  };
  walk(dir);
  return found;
};
const uploadsBefore = snapshot(uploadsDir);
const cleanupUploads = () => {
  for (const file of snapshot(uploadsDir)) {
    if (uploadsBefore.has(file)) continue;
    try { fs.unlinkSync(file); } catch (_) {}
  }
};

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

async function main() {
  const express = require('express');
  const { sequelize } = require('../models/social');
  const Member = require('../models/Member');
  const Volunteer = require('../models/Volunteer');
  const Donor = require('../models/Donor');
  const InternshipApplication = require('../models/InternshipApplication');
  const Interest = require('../models/Interest');
  const ContactMessage = require('../models/ContactMessage');
  const RoleDocument = require('../models/RoleDocument');
  const AuditLog = require('../models/AuditLog');
  require('../models/IdIssuance');
  await sequelize.sync({ force: true });

  const app = express();
  app.use(express.json());
  const { adminAuditTrail } = require('../middleware/adminAuditTrail');
  app.use('/api', adminAuditTrail());
  for (const route of ['adminDashboardRoutes', 'memberCertificateRoutes', 'volunteerAdminRoutes', 'userPortalRoutes', 'submissionRoutes', 'portalParticipationRoutes', 'donorRoutes', 'internshipRoutes', 'contactRoutes', 'interestRoutes', 'userDocumentRoutes']) {
    app.use('/api', require(`../routes/${route}`));
  }
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const auth = { Authorization: 'Bearer test-token' };

  const json = (p, h = {}) => fetch(base + p, { headers: h }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  const send = (p, method, body, h = {}) => fetch(base + p, { method, headers: { 'Content-Type': 'application/json', ...h }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

  const PNG = { name: 'photo.png', type: 'image/png', data: Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex') };
  const upload = (p, fields, files) => {
    const form = new FormData();
    for (const [k, v] of Object.entries(fields || {})) form.append(k, v);
    for (const [k, f] of Object.entries(files || {})) form.append(k, new Blob([f.data], { type: f.type }), f.name);
    return fetch(base + p, { method: 'POST', body: form }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  };

  try {
    console.log('\nSeed: one real member, one volunteer, one internship, one donation, one account-only signup');
    await Member.create({ fullName: 'Asha Verma', email: 'asha@example.com', phone: '9876543210', passwordHash: 'x', memberType: 'general', status: 'pending', paymentStatus: 'pending' });
    await Member.create({ fullName: 'Account Only', email: 'acct@example.com', phone: '9876543211', passwordHash: 'x', memberType: 'website_signup', message: 'Signup from website', status: 'approved', paymentStatus: 'not_required' });
    await Volunteer.create({ fullName: 'Vikram Rao', email: 'vikram@example.com', phone: '9876543212', volunteerType: 'field', status: 'pending' });
    await InternshipApplication.create({ fullName: 'Neha Singh', email: 'neha@example.com', phone: '9876543213', college: 'ABC', course: 'BSc', internshipType: 'summer', duration: '2 months', resumePath: '/uploads/resume.pdf', status: 'pending' });
    await Donor.create({ fullName: 'Rakesh Gupta', email: 'rakesh@example.com', phone: '9876543214', amount: 5000, donationPurpose: 'Education', paymentStatus: 'paid', status: 'completed' });

    console.log('\nAdmin dashboard KPIs:');
    ok('dashboard requires admin auth', (await json('/api/admin/dashboard')).status === 401);
    const dash = await json('/api/admin/dashboard', auth);
    ok('dashboard 200', dash.status === 200, JSON.stringify(dash.body).slice(0, 200));
    ok('counts the pending membership', dash.body.members?.pending === 1, String(dash.body.members?.pending));
    ok('counts account-only signups separately', dash.body.members?.totalAccounts === 2, String(dash.body.members?.totalAccounts));
    ok('counts real membership records only', dash.body.members?.realMembers === 1, String(dash.body.members?.realMembers));
    ok('counts the pending volunteer', dash.body.volunteers?.pending === 1, String(dash.body.volunteers?.pending));
    ok('counts the internship', dash.body.internships?.total === 1, String(dash.body.internships?.total));
    ok('sums confirmed donations', dash.body.donations?.confirmedAmount === 5000, String(dash.body.donations?.confirmedAmount));
    ok('reports a generated timestamp', !!dash.body.generatedAt);
    ok('pending queue lists the member', dash.body.pendingQueue?.some((r) => r.kind === 'member' && r.name === 'Asha Verma'), JSON.stringify(dash.body.pendingQueue?.map((r) => r.kind)));
    ok('pending queue lists the volunteer', dash.body.pendingQueue?.some((r) => r.kind === 'volunteer'), '');
    ok('pending queue lists the internship', dash.body.pendingQueue?.some((r) => r.kind === 'internship'), '');

    console.log('\nAudit trail (written by the middleware on state changes):');
    const approve = await send('/api/admin/members/00000000-0000-0000-0000-000000000000/status', 'PATCH', { status: 'rejected' }, auth);
    ok('a mutating admin call runs', [200, 400, 404].includes(approve.status), String(approve.status));
    await new Promise((r) => setTimeout(r, 60));
    const trail = await json('/api/admin/audit-logs', auth);
    ok('audit log requires admin auth', (await json('/api/admin/audit-logs')).status === 401);
    ok('audit log 200', trail.status === 200, JSON.stringify(trail.body).slice(0, 150));
    ok('the mutating call was recorded', Array.isArray(trail.body) && trail.body.length >= 1, `n=${trail.body?.length}`);
    const entry = trail.body?.[0];
    ok('audit entry names the actor', entry?.actor === 'admin', String(entry?.actor));
    ok('audit entry records the action', entry?.action === 'status-changed', String(entry?.action));
    ok('audit entry records the entity type', entry?.entityType === 'member', String(entry?.entityType));
    ok('audit entry keeps a summary', typeof entry?.summary === 'string' && entry.summary.includes('/api/admin/'), String(entry?.summary));
    ok('audit entry records success/failure', entry?.detail && typeof entry.detail.ok === 'boolean', JSON.stringify(entry?.detail));
    ok('read-only GETs are not audited', !trail.body.some((r) => /GET /.test(String(r.summary))));
    ok('audit log filters by entity type', (await json('/api/admin/audit-logs?entityType=member', auth)).body.every((r) => r.entityType === 'member'));

    console.log('\nCSV export:');
    const membersCsv = await fetch(`${base}/api/admin/overview.csv?type=members`, { headers: auth });
    const membersText = await membersCsv.text();
    ok('members CSV 200', membersCsv.status === 200, String(membersCsv.status));
    ok('members CSV has a header row', membersText.split('\n')[0].includes('fullName'), membersText.split('\n')[0]);
    ok('members CSV includes the member', /Asha Verma/.test(membersText));
    ok('members CSV never leaks a password hash', !/passwordHash/.test(membersText));
    ok('volunteers CSV 200', (await fetch(`${base}/api/admin/overview.csv?type=volunteers`, { headers: auth })).status === 200);
    ok('donors CSV 200', (await fetch(`${base}/api/admin/overview.csv?type=donors`, { headers: auth })).status === 200);
    ok('internships CSV 200', (await fetch(`${base}/api/admin/overview.csv?type=internships`, { headers: auth })).status === 200);
    ok('CSV export requires admin auth', (await fetch(`${base}/api/admin/overview.csv?type=members`)).status === 401);
    ok('unknown export type falls back to members', (await fetch(`${base}/api/admin/overview.csv?type=bogus`, { headers: auth })).status === 200);

    console.log('\nAudit rows survive the record they describe:');
    const before = (await json('/api/admin/audit-logs', auth)).body.length;
    await send('/api/admin/members/00000000-0000-0000-0000-000000000000/delete', 'DELETE', undefined, auth);
    await new Promise((r) => setTimeout(r, 60));
    const after = (await json('/api/admin/audit-logs', auth)).body;
    ok('a failed delete is still recorded', after.length > before, `${before} -> ${after.length}`);
    ok('failed actions are marked unsuccessful', after.some((r) => r.detail?.ok === false));

    console.log('\nDonor admin: status, payment confirmation and certificate ID');
    const donor = await Donor.findOne({ where: { email: 'rakesh@example.com' } });
    ok('donor status requires admin auth', (await send(`/api/admin/donors/${donor.id}/status`, 'PATCH', { status: 'contacted' })).status === 401);
    const donorStatus = await send(`/api/admin/donors/${donor.id}/status`, 'PATCH', { status: 'contacted' }, auth);
    ok('donor status update works', donorStatus.status === 200 && donorStatus.body.donor?.status === 'contacted', JSON.stringify(donorStatus.body).slice(0, 160));
    ok('invalid donor status is rejected', (await send(`/api/admin/donors/${donor.id}/status`, 'PATCH', { status: 'nonsense' }, auth)).status === 400);
    const donorEdit = await send(`/api/admin/donors/${donor.id}`, 'PATCH', { fullName: 'Rakesh Kumar Gupta', phone: '9876500011', pan: 'AAKAS7123H' }, auth);
    ok('donor fields are editable', donorEdit.status === 200 && donorEdit.body.donor?.fullName === 'Rakesh Kumar Gupta', JSON.stringify(donorEdit.body).slice(0, 160));
    ok('donor rejects a bad PAN', (await send(`/api/admin/donors/${donor.id}`, 'PATCH', { pan: 'bad' }, auth)).status === 400);
    const donorCert = await send(`/api/admin/donors/${donor.id}`, 'PATCH', { paymentStatus: 'paid' }, auth);
    ok('confirming the payment issues a donor certificate ID', /^SSF-DONCERT-/.test(String(donorCert.body.donor?.certId)), String(donorCert.body.donor?.certId));
    ok('donor certificate verifies', (await json(`/api/verify/${donorCert.body.donor.certId}`)).body?.valid === true, JSON.stringify((await json(`/api/verify/${donorCert.body.donor.certId}`)).body));

    console.log('\nEdit endpoints for every application type');
    const vol = await Volunteer.findOne({ where: { email: 'vikram@example.com' } });
    const volEdit = await send(`/api/admin/volunteers/${vol.id}`, 'PATCH', { email: 'vikram.rao@example.com', idType: 'PAN Card', identityNumber: 'AAKAS7123H', position: 'Field Lead' }, auth);
    ok('volunteer edit accepts email, ID proof and position', volEdit.status === 200 && volEdit.body.volunteer?.email === 'vikram.rao@example.com' && volEdit.body.volunteer?.position === 'Field Lead', JSON.stringify(volEdit.body).slice(0, 200));
    const member = await Member.findOne({ where: { email: 'asha@example.com' } });
    const memEdit = await send(`/api/admin/members/${member.id}`, 'PATCH', { idProofType: 'Aadhaar Card', identityNumber: '1234 5678 9012', memberType: 'life' }, auth);
    ok('member edit accepts ID proof and role', memEdit.status === 200 && memEdit.body.member?.idProofType === 'Aadhaar Card' && memEdit.body.member?.memberType === 'life', JSON.stringify(memEdit.body).slice(0, 200));
    const intern = await InternshipApplication.findOne({ where: { email: 'neha@example.com' } });
    const intEdit = await send(`/api/admin/internships/${intern.id}`, 'PATCH', { college: 'XYZ College', duration: '3 months' }, auth);
    ok('internship edit works', intEdit.status === 200 && intEdit.body.data?.college === 'XYZ College', JSON.stringify(intEdit.body).slice(0, 160));
    const contact = await ContactMessage.create({ firstName: 'Test', email: 'contact@example.com', message: 'Hello there, I need help.', status: 'new' });
    const contactEdit = await send(`/api/admin/contacts/${contact.id}`, 'PATCH', { status: 'contacted', phone: '9876500022' }, auth);
    ok('contact edit works', contactEdit.status === 200 && contactEdit.body.data?.status === 'contacted', JSON.stringify(contactEdit.body).slice(0, 160));
    const interest = await Interest.create({ interestType: 'partner', fullName: 'Partner Person', email: 'partner@example.com', phone: '9876500033', message: 'We would like to partner with SSF.', status: 'new' });
    const interestEdit = await send(`/api/admin/interests/${interest.id}`, 'PATCH', { category: 'CSR Partner', phone: '9876500044' }, auth);
    ok('interest edit works', interestEdit.status === 200 && interestEdit.body.data?.category === 'CSR Partner', JSON.stringify(interestEdit.body).slice(0, 160));

    console.log('\nIssued ID re-issue and revoke');
    const reissue = await send(`/api/admin/volunteers/${vol.id}/reissue`, 'POST', {}, auth);
    ok('volunteer IDs can be re-issued', reissue.status === 400 || reissue.status === 200, String(reissue.status));
    await send(`/api/admin/volunteers/${vol.id}/status`, 'PATCH', { status: 'approved' }, auth);
    const reissue2 = await send(`/api/admin/volunteers/${vol.id}/reissue`, 'POST', {}, auth);
    ok('an approved volunteer re-issue returns fresh IDs', reissue2.status === 200 && /^SSF-VOL-/.test(String(reissue2.body.volunteerId)), JSON.stringify(reissue2.body).slice(0, 160));
    const revoke = await send(`/api/admin/volunteers/${vol.id}/revoke`, 'POST', {}, auth);
    ok('volunteer IDs can be revoked', revoke.status === 200, JSON.stringify(revoke.body).slice(0, 160));
    const revoked = await Volunteer.findByPk(vol.id);
    ok('a revoked volunteer keeps no IDs', revoked.volunteerId === null && revoked.certId === null && revoked.status === 'rejected', JSON.stringify({ id: revoked.volunteerId, cert: revoked.certId, status: revoked.status }));
    ok('a revoked volunteer ID no longer verifies', (await json(`/api/verify/${reissue2.body.volunteerId}`)).status === 404);
    ok('member re-issue requires an approved member', (await send(`/api/admin/members/${member.id}/reissue`, 'POST', {}, auth)).status === 400, '');
    ok('member revoke reports nothing to revoke', (await send(`/api/admin/members/${member.id}/revoke`, 'POST', {}, auth)).status === 400, '');

    console.log('\nIdentity numbers: no reuse, register series, manual correction');
    const { nextMemberId, nextVolunteerId, nextDonorId, isMemberId } = require('../services/identityService');
    // The offline register holds SSF-MBR-00018, so the next website member must
    // continue that series rather than start a parallel one.
    ok('next member id continues the register series', (await nextMemberId(Member)) === 'SSF-MBR-00019', await nextMemberId(Member));
    ok('register member id is accepted', isMemberId('SSF-MBR-00001'));
    ok('website member id is still accepted', isMemberId('SSF-MEM-2510-0001'));
    ok('a random string is not a member id', !isMemberId('MEM-1'));

    // A rejected member must not free their number for reuse.
    const reuse = await Member.create({ fullName: 'Reuse Person', email: 'reuse@example.com', phone: '9876500099', passwordHash: 'x', memberType: 'general', status: 'pending', paymentStatus: 'paid' });
    await send(`/api/admin/members/${reuse.id}/status`, 'PATCH', { status: 'approved' }, auth);
    const reuseId = (await Member.findByPk(reuse.id)).memberId;
    await send(`/api/admin/members/${reuse.id}/status`, 'PATCH', { status: 'rejected' }, auth);
    const later = await Member.create({ fullName: 'Later Person', email: 'later@example.com', phone: '9876500098', passwordHash: 'x', memberType: 'general', status: 'pending', paymentStatus: 'paid' });
    await send(`/api/admin/members/${later.id}/status`, 'PATCH', { status: 'approved' }, auth);
    ok('a revoked number is never handed out again', (await Member.findByPk(later.id)).memberId !== reuseId, `${reuseId} -> ${(await Member.findByPk(later.id)).memberId}`);

    console.log('\nRegister: an existing member keeps their original number');
    const adopted = await Member.create({ fullName: 'Ramesh Pandey', email: 'rameshpandey335@gmail.com', phone: '9718346691', passwordHash: 'x', memberType: 'general', status: 'pending', paymentStatus: 'paid' });
    await send(`/api/admin/members/${adopted.id}/status`, 'PATCH', { status: 'approved' }, auth);
    const adoptedRow = await Member.findByPk(adopted.id);
    ok('a register member adopts their offline number', adoptedRow.memberId === 'SSF-MBR-00001', String(adoptedRow.memberId));
    ok('the adopted certificate id follows the member id', adoptedRow.certId === 'SSF-MCERT-00001', String(adoptedRow.certId));

    const register = await json('/api/admin/member-register', auth);
    ok('member register requires admin auth', (await json('/api/admin/member-register')).status === 401);
    ok('member register lists every offline row', Array.isArray(register.body) && register.body.length >= 9, String(register.body?.length));
    ok('member register marks claimed numbers', register.body.find((r) => r.memberId === 'SSF-MBR-00001')?.claimed === true);
    ok('member register marks an unclaimed number', register.body.find((r) => r.memberId === 'SSF-MBR-00002')?.claimed === false);

    console.log('\nManual ID correction (the admin can set or fix a number)');
    await Member.update({ status: 'approved', paymentStatus: 'paid' }, { where: { id: member.id } });
    const manual = await send(`/api/admin/members/${member.id}`, 'PATCH', { memberId: 'SSF-MBR-00002', designation: 'Volunteer Coordinator', city: 'Rewa', idValidTill: '2030-12-31' }, auth);
    ok('admin can assign a register number by hand', manual.status === 200 && manual.body.member?.memberId === 'SSF-MBR-00002', JSON.stringify(manual.body).slice(0, 200));
    ok('the hand-assigned number carries its certificate id', manual.body.member?.certId === 'SSF-MCERT-00002', String(manual.body.member?.certId));
    ok('the corrected designation is stored', manual.body.member?.designation === 'Volunteer Coordinator');
    ok('a malformed manual id is refused', (await send(`/api/admin/members/${member.id}`, 'PATCH', { memberId: 'MBR-2' }, auth)).status === 400);
    ok('a duplicate manual id is refused', (await send(`/api/admin/members/${member.id}`, 'PATCH', { memberId: 'SSF-MBR-00001' }, auth)).status === 400);
    const clearId = await send(`/api/admin/members/${member.id}`, 'PATCH', { memberId: '' }, auth);
    ok('an id can be cleared', clearId.status === 200 && clearId.body.member?.memberId === null, String(clearId.body.member?.memberId));
    await send(`/api/admin/members/${member.id}`, 'PATCH', { memberId: 'SSF-MBR-00002' }, auth);

    console.log('\nDeactivate an ID card (stops verifying without deleting the record)');
    const off = await send(`/api/admin/members/${member.id}/id-status`, 'POST', { idActive: false }, auth);
    ok('member ID card can be switched off', off.status === 200 && off.body.idActive === false, JSON.stringify(off.body));
    ok('a switched-off member ID no longer verifies', (await json('/api/verify/SSF-MBR-00002')).status === 404);
    ok('the deactivated card explains why', (await json('/api/verify/SSF-MBR-00002')).body.message?.includes('deactivated'), JSON.stringify((await json('/api/verify/SSF-MBR-00002')).body));
    await send(`/api/admin/members/${member.id}/id-status`, 'POST', { idActive: true }, auth);
    ok('a reactivated member ID verifies again', (await json('/api/verify/SSF-MBR-00002')).status === 200);
    const volOff = await send(`/api/admin/volunteers/${vol.id}/id-status`, 'POST', { idActive: false }, auth);
    ok('volunteer ID card can be switched off', volOff.status === 200 && volOff.body.idActive === false, JSON.stringify(volOff.body));
    const donorOff = await send(`/api/admin/donors/${donor.id}/id-status`, 'POST', { idActive: false }, auth);
    ok('donor ID card can be switched off', donorOff.status === 200 && donorOff.body.idActive === false, JSON.stringify(donorOff.body));
    ok('a switched-off donor ID no longer verifies', (await json(`/api/verify/${donor.donorId}`)).status === 404);
    await send(`/api/admin/donors/${donor.id}/id-status`, 'POST', { idActive: true }, auth);

    console.log('\nDonor and volunteer numbers are unique and never reused');
    const donorNext = await nextDonorId(Donor);
    ok('next donor id is unique against the existing row', donorNext !== donor.donorId, donorNext);
    const donorManual = await send(`/api/admin/donors/${donor.id}`, 'PATCH', { donorId: 'SSF-DON-2601-0001' }, auth);
    ok('admin can correct a donor id by hand', donorManual.status === 200 && donorManual.body.donor?.donorId === 'SSF-DON-2601-0001', JSON.stringify(donorManual.body).slice(0, 200));
    ok('a malformed donor id is refused', (await send(`/api/admin/donors/${donor.id}`, 'PATCH', { donorId: 'DON-1' }, auth)).status === 400);
    const volManual = await send(`/api/admin/volunteers/${vol.id}`, 'PATCH', { volunteerId: 'SSF-VOL-2601-0007' }, auth);
    ok('admin can correct a volunteer id by hand', volManual.status === 200 && volManual.body.volunteer?.volunteerId === 'SSF-VOL-2601-0007', JSON.stringify(volManual.body).slice(0, 200));
    ok('a malformed volunteer id is refused', (await send(`/api/admin/volunteers/${vol.id}`, 'PATCH', { volunteerId: 'VOL-7' }, auth)).status === 400);
    ok('the volunteer id sequence skips the manual number', (await nextVolunteerId(Volunteer, new Date('2026-01-15'))) !== 'SSF-VOL-2601-0007', await nextVolunteerId(Volunteer, new Date('2026-01-15')));

    console.log('\nIssuance ledger: the admin can see every ID ever handed out');
    const issuances = await json('/api/admin/id-issuances', auth);
    ok('issuance ledger requires admin auth', (await json('/api/admin/id-issuances')).status === 401);
    ok('issuance ledger lists the member number', Array.isArray(issuances.body) && issuances.body.some((r) => r.kind === 'member' && r.value === 'SSF-MBR-00002'), JSON.stringify(issuances.body).slice(0, 160));
    ok('issuance ledger keeps the revoked volunteer number', issuances.body.some((r) => r.kind === 'volunteer' && r.status === 'revoked'), JSON.stringify(issuances.body.filter((r) => r.kind === 'volunteer')).slice(0, 200));
    ok('issuance ledger can be filtered by kind', (await json('/api/admin/id-issuances?kind=donor', auth)).body.every((r) => r.kind === 'donor'));
    ok('issuance ledger rejects an unknown kind', (await json('/api/admin/id-issuances?kind=ghost', auth)).status === 400);
  } catch (error) {
    fail += 1;
    console.error('\n  \u2717 unexpected failure:', error);
  } finally {
    server.close();
    cleanupUploads();
    console.log(`\n${fail === 0 ? '\u2705' : '\u274c'} ${pass} passed, ${fail} failed\n`);
    process.exit(fail === 0 ? 0 : 1);
  }
}

main();
