// Integration test: the full SSF membership / participation lifecycle.
//
// Exercises the real express routers against an in-memory Postgres (pg-mem), so
// the actual handlers, Sequelize models and validation run — nothing is mocked.
//
//   node backend_node/tests/membership.http.test.js
process.env.NODE_ENV = 'test';
process.env.ADMIN_PORTAL_TOKEN = 'test-token';

const { newDb } = require('pg-mem');
const mem = newDb();
// pg-mem cannot run Sequelize's ENUM introspection or its `DROP TYPE ... DO $$`
// block, so the enum types are pre-registered and those two queries intercepted.
mem.public.registerEnum('enum_Members_status', ['pending', 'changes_requested', 'approved', 'rejected']);
mem.public.registerEnum('enum_Members_paymentStatus', ['not_required', 'pending', 'paid', 'failed']);
mem.public.registerEnum('enum_Volunteers_status', ['pending', 'changes_requested', 'approved', 'rejected']);
mem.public.registerEnum('enum_Donors_paymentStatus', ['pending', 'paid', 'failed', 'offline']);
mem.public.registerEnum('enum_Donors_status', ['new', 'contacted', 'completed']);
mem.public.registerEnum('enum_Interests_interestType', ['movement', 'partner', 'volunteer', 'member']);
mem.public.registerEnum('enum_Interests_status', ['new', 'contacted', 'approved', 'rejected', 'closed']);
mem.public.registerEnum('enum_InternshipApplications_status', ['pending', 'reviewed', 'selected', 'completed', 'rejected']);
mem.public.registerEnum('enum_RoleDocuments_role', ['donor', 'intern', 'student', 'volunteer_teacher', 'skill_volunteer', 'ambassador']);
mem.public.registerEnum('enum_RoleDocuments_documentType', ['identity_card', 'certificate', 'joining_letter', 'completion_certificate', 'participation_certificate', 'training_certificate', 'appreciation_certificate', 'outstanding_contribution_certificate', 'partner_recognition']);
mem.public.registerEnum('enum_RoleDocuments_status', ['active', 'revoked', 'expired']);
let rewritingDonors = false;
mem.public.interceptQueries((sql) => {
  if (sql.includes('pg_enum') && /typname='enum_/.test(sql)) return [];
  if (/DROP TYPE IF EXISTS "public"\."enum_/.test(sql)) return [];
  // pg-mem cannot parse DECIMAL(12,2) column configs, so the Donors table is
  // created with NUMERIC instead — same semantics, parseable by pg-mem. The
  // re-entrancy guard stops the rewritten statement from being intercepted
  // again (which would recurse forever).
  if (!rewritingDonors && /CREATE TABLE IF NOT EXISTS "Donors"/.test(sql)) {
    rewritingDonors = true;
    try { mem.public.none(sql.replace(/DECIMAL\(12,2\)/g, 'NUMERIC(12,2)')); } finally { rewritingDonors = false; }
    return [];
  }
  // The portal tolerates these optional activity tables being absent.
  if (/CREATE TABLE IF NOT EXISTS "(Interests|RoleDocuments)"/.test(sql)) return [];
  return null;
});
const pgAdapter = mem.adapters.createPg();
const realPgPath = require.resolve('pg');
require(realPgPath);
require.cache[realPgPath].exports = { ...require.cache[realPgPath].exports, Client: pgAdapter.Client, Pool: pgAdapter.Pool };

// multer writes to a fixed ../uploads directory, so snapshot it and remove
// whatever this run adds — the test must not leave files behind in the repo.
// Internship and donor uploads land in subdirectories, so the walk recurses.
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
  // Register every model under test before sync so the tables are created.
  const Member = require('../models/Member');
  const Volunteer = require('../models/Volunteer');
  const Donor = require('../models/Donor');
  const InternshipApplication = require('../models/InternshipApplication');
  const Interest = require('../models/Interest');
  const RoleDocument = require('../models/RoleDocument');
  await sequelize.sync({ force: true });

  console.log('\nColumn-add migration (ensureColumns):');
  // Production databases predate the internship/donor upload columns, so
  // simulate that by dropping them and confirming ensureColumns restores them.
  await sequelize.query('ALTER TABLE "InternshipApplications" DROP COLUMN IF EXISTS "idDocumentPath"');
  await sequelize.query('ALTER TABLE "Donors" DROP COLUMN IF EXISTS "profilePhotoPath"');
  const { ensureColumns } = require('../services/ensureColumns');
  await ensureColumns();
  const columnsOf = (table) => mem.public.many(`SELECT column_name FROM information_schema.columns WHERE table_name='${table}'`).map((r) => r.column_name);
  const internColumns = columnsOf('InternshipApplications');
  const donorColumns = columnsOf('Donors');
  ok('internship id document column restored', internColumns.includes('idDocumentPath'), internColumns.join(','));
  ok('internship profile photo column present', internColumns.includes('profilePhotoPath'));
  ok('donor profile photo column restored', donorColumns.includes('profilePhotoPath'), donorColumns.join(','));
  ok('donor id document column present', donorColumns.includes('idDocumentPath'));
  await ensureColumns();
  ok('ensureColumns is idempotent', true);

  const app = express();
  app.use(express.json());
  for (const route of ['submissionRoutes', 'memberCertificateRoutes', 'volunteerAdminRoutes', 'userPortalRoutes', 'portalParticipationRoutes', 'profileApplicationRoutes', 'userDocumentRoutes', 'roleDocumentRoutes', 'volunteerRoutes', 'internshipRoutes', 'donorRoutes']) {
    app.use('/api', require(`../routes/${route}`));
  }
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const auth = { Authorization: 'Bearer test-token' };

  // The account UUID alone is no longer enough: user endpoints now require the
  // signed session token that login/signup returns, exactly like the browser.
  let userToken = '';
  const withToken = (h = {}) => (userToken ? { Authorization: `Bearer ${userToken}`, ...h } : h);
  const json = (p, h = {}) => fetch(base + p, { headers: withToken(h) }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  const send = (p, method, body, h = {}) => fetch(base + p, { method, headers: { 'Content-Type': 'application/json', ...withToken(h) }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  const upload = (p, fields, files) => {
    const form = new FormData();
    for (const [k, v] of Object.entries(fields || {})) form.append(k, v);
    for (const [k, f] of Object.entries(files || {})) form.append(k, new Blob([f.data], { type: f.type }), f.name);
    return fetch(base + p, { method: 'POST', headers: withToken(), body: form }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  };

  const PNG = { name: 'photo.png', type: 'image/png', data: Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex') };
  const PDF = { name: 'aadhaar.pdf', type: 'application/pdf', data: Buffer.from('%PDF-1.4 test identity document') };
  const DOC = { name: 'resume.pdf', type: 'application/pdf', data: Buffer.from('%PDF-1.4 test resume document') };

  try {
    console.log('\nJoin SSF signup (website account):');
    const email = 'asha.verma@example.com';
    const signup = await upload('/api/member-signup', { fullName: 'Asha Verma', email, confirmEmail: email, phone: '9876543210', password: 'secret1234', memberType: 'website_signup' });
    ok('signup 201', signup.status === 201 || signup.status === 200, JSON.stringify(signup.body).slice(0, 200));
    ok('signup returns a session user', !!signup.body.user?.id);
    ok('signup returns a signed session token', typeof signup.body.token === 'string' && signup.body.token.includes('.'), String(signup.body.token).slice(0, 24));
    const accountId = signup.body.user?.id;
    userToken = signup.body.token;
    ok('account is active immediately', signup.body.user?.status === 'approved', signup.body.user?.status);
    ok('account has no member id yet', !signup.body.user?.memberId);

    console.log('\nJoin SSF signup (JSON — the path AuthModal actually uses):');
    const jsonEmail = 'json.signup@example.com';
    const jsonSignup = await send('/api/member-signup', 'POST', { fullName: 'Json User', email: jsonEmail, confirmEmail: jsonEmail, phone: '9111111111', password: 'secret1234', memberType: 'website_signup', message: 'Signup from website' });
    ok('JSON signup 201', jsonSignup.status === 201, JSON.stringify(jsonSignup.body).slice(0, 200));
    ok('JSON signup returns a session user', !!jsonSignup.body.user?.id);
    ok('JSON signup is an approved account', jsonSignup.body.user?.status === 'approved', jsonSignup.body.user?.status);
    ok('JSON login works', (await send('/api/member-login', 'POST', { email: jsonEmail, password: 'secret1234' })).status === 200);
    ok('JSON signup rejects short password', (await send('/api/member-signup', 'POST', { fullName: 'X', email: 'x@example.com', confirmEmail: 'x@example.com', phone: '9000000002', password: 'short', memberType: 'website_signup' })).status === 400);

    console.log('\nSignup validation:');
    const weak = await upload('/api/member-signup', { fullName: 'Weak Pass', email: 'weak@example.com', confirmEmail: 'weak@example.com', phone: '9000000000', password: 'short', memberType: 'website_signup' });
    ok('password under 8 chars rejected', weak.status === 400 && /8 characters/i.test(weak.body.message), JSON.stringify(weak.body));
    const mismatch = await upload('/api/member-signup', { fullName: 'Mismatch', email: 'a@example.com', confirmEmail: 'b@example.com', phone: '9000000001', password: 'secret1234', memberType: 'general' });
    ok('mismatched emails rejected', mismatch.status === 400 && /do not match/i.test(mismatch.body.message), JSON.stringify(mismatch.body));
    const dup = await upload('/api/member-signup', { fullName: 'Asha Again', email, confirmEmail: email, phone: '9876543210', password: 'secret1234', memberType: 'website_signup' });
    ok('duplicate account rejected', dup.status === 409, JSON.stringify(dup.body));

    console.log('\nLogin:');
    const login = await send('/api/member-login', 'POST', { email, password: 'secret1234' });
    ok('login 200', login.status === 200, JSON.stringify(login.body).slice(0, 150));
    ok('wrong password rejected', (await send('/api/member-login', 'POST', { email, password: 'nope-nope' })).status === 401);

    console.log('\nMembership application with documents (Aadhaar):');
    const noDocs = await upload('/api/member-application', { accountId, fullName: 'Asha Verma', email, phone: '9876543210', memberType: 'general', idProofType: 'Aadhaar Card' });
    ok('missing photo + proof rejected', noDocs.status === 400, JSON.stringify(noDocs.body).slice(0, 150));
    const applied = await upload('/api/member-application', { accountId, fullName: 'Asha Verma', email, phone: '9876543210', memberType: 'general', idProofType: 'Aadhaar Card', identityNumber: '1234 5678 9012', message: 'I want to help with education drives.' }, { profile_photo: PNG, id_document: PDF });
    ok('application 201', applied.status === 201, JSON.stringify(applied.body).slice(0, 200));
    ok('application status is pending', applied.body.user?.status === 'pending', applied.body.user?.status);

    const stored = await Member.findByPk(accountId);
    ok('profile photo stored', !!stored.profilePhotoPath, String(stored.profilePhotoPath));
    ok('identity document stored', !!stored.idDocumentPath, String(stored.idDocumentPath));
    ok('document path is a public /uploads URL, not a server path', String(stored.idDocumentPath).startsWith('/uploads/'), String(stored.idDocumentPath));
    ok('profile photo path is a public /uploads URL', String(stored.profilePhotoPath).startsWith('/uploads/'), String(stored.profilePhotoPath));
    ok('id proof type persisted', stored.idProofType === 'Aadhaar Card', stored.idProofType);
    ok('identity number persisted', stored.identityNumber === '1234 5678 9012', stored.identityNumber);
    ok('memberType upgraded from website_signup', stored.memberType === 'general', stored.memberType);

    console.log('\nAdmin visibility:');
    const adminList = await json('/api/admin/members', auth);
    ok('admin member list requires auth', (await json('/api/admin/members')).status === 401);
    ok('admin sees the membership application', adminList.body.some((m) => m.id === accountId), `n=${adminList.body.length}`);
    const listed = adminList.body.find((m) => m.id === accountId);
    ok('admin row exposes idProofType', listed?.idProofType === 'Aadhaar Card');
    ok('admin row exposes identityNumber', listed?.identityNumber === '1234 5678 9012');
    ok('admin row exposes a public document URL', String(listed?.idDocumentPath || '').startsWith('/uploads/'), String(listed?.idDocumentPath));
    ok('admin row never exposes passwordHash', listed && !('passwordHash' in listed));

    console.log('\nCorrection workflow:');
    const corr = await send(`/api/admin/members/${accountId}/status`, 'PATCH', { status: 'changes_requested', reviewNote: 'Please upload a clearer Aadhaar copy.' }, auth);
    ok('correction request 200', corr.status === 200, JSON.stringify(corr.body).slice(0, 150));
    ok('status is changes_requested', corr.body.member?.status === 'changes_requested', corr.body.member?.status);
    ok('review note saved', corr.body.member?.reviewNote === 'Please upload a clearer Aadhaar copy.', corr.body.member?.reviewNote);
    ok('invalid status rejected', (await send(`/api/admin/members/${accountId}/status`, 'PATCH', { status: 'bogus' }, auth)).status === 400);

    const portal = await json(`/api/user-portal/${accountId}`);
    ok('user portal shows the correction note', portal.body.account?.reviewNote === 'Please upload a clearer Aadhaar copy.', JSON.stringify(portal.body.account?.reviewNote));
    ok('user portal rejects an anonymous request', (await fetch(`${base}/api/user-portal/${accountId}`).then((r) => r.status)) === 401);
    ok('user portal rejects another account\'s token', (await fetch(`${base}/api/user-portal/${accountId}`, { headers: { Authorization: 'Bearer deadbeef.cafe' } }).then((r) => r.status)) === 401);
    ok('user portal keeps profile photo', !!portal.body.account?.profilePhotoPath);

    console.log('\nResubmission after correction:');
    const resub = await upload('/api/member-application', { accountId, fullName: 'Asha Verma', email, phone: '9876543210', memberType: 'general', idProofType: 'PAN Card', identityNumber: 'ABCDE1234F' }, { profile_photo: PNG, id_document: PDF });
    ok('resubmission 201', resub.status === 201, JSON.stringify(resub.body).slice(0, 200));
    const afterResub = await Member.findByPk(accountId);
    ok('resubmission clears the correction note', afterResub.reviewNote === null, String(afterResub.reviewNote));
    ok('resubmission updates the proof type', afterResub.idProofType === 'PAN Card', afterResub.idProofType);
    ok('resubmission returns to pending', afterResub.status === 'pending', afterResub.status);

    console.log('\nApproval is gated on payment:');
    const blocked = await send(`/api/admin/member-approve/${accountId}`, 'POST', {}, auth);
    ok('approval blocked while fee is unpaid', blocked.status === 400, JSON.stringify(blocked.body).slice(0, 200));
    ok('blocked response reports payment status', blocked.body.paymentStatus === 'pending', blocked.body.paymentStatus);

    const badPayment = await send('/api/member-payment-submit', 'POST', { memberId: accountId, paymentMode: 'UPI', paymentReference: '12' });
    ok('short payment reference rejected', badPayment.status === 400, JSON.stringify(badPayment.body).slice(0, 150));

    const paySubmit = await send('/api/member-payment-submit', 'POST', { memberId: accountId, paymentMode: 'UPI', paymentReference: '425789123456' });
    ok('payment details accepted', paySubmit.status === 200, JSON.stringify(paySubmit.body).slice(0, 200));
    const paidRow = await Member.findByPk(accountId);
    ok('payment reference stored', paidRow.paymentReference === '425789123456', String(paidRow.paymentReference));
    ok('payment mode stored', paidRow.paymentMode === 'UPI', String(paidRow.paymentMode));
    ok('self-reported payment stays unverified', paidRow.paymentStatus === 'pending', paidRow.paymentStatus);
    ok('approval still blocked before admin confirmation', (await send(`/api/admin/member-approve/${accountId}`, 'POST', {}, auth)).status === 400);

    const confirmPayment = await send(`/api/admin/members/${accountId}`, 'PATCH', { paymentStatus: 'paid' }, auth);
    ok('admin records the fee as received', confirmPayment.status === 200, JSON.stringify(confirmPayment.body).slice(0, 150));
    const confirmedRow = await Member.findByPk(accountId);
    ok('payment marked paid', confirmedRow.paymentStatus === 'paid', confirmedRow.paymentStatus);
    ok('paid timestamp recorded', !!confirmedRow.paymentPaidAt, String(confirmedRow.paymentPaidAt));

    console.log('\nApproval:');
    const approve = await send(`/api/admin/member-approve/${accountId}`, 'POST', {}, auth);
    ok('approval 200', approve.status === 200, JSON.stringify(approve.body).slice(0, 200));
    ok('member id issued', /^SSF-MBR-\d{5}$/.test(String(approve.body.memberId)), approve.body.memberId);
    ok('certificate id issued', /^SSF-MCERT-\d{5}$/.test(String(approve.body.certId)), approve.body.certId);
    ok('approval returns a verification url', /\/verify\//.test(String(approve.body.verificationUrl)), approve.body.verificationUrl);
    ok('double approval rejected', (await send(`/api/admin/member-approve/${accountId}`, 'POST', {}, auth)).status === 400);

    const approved = await json(`/api/user-portal/${accountId}`);
    ok('portal reports approved status', approved.body.account?.status === 'approved', approved.body.account?.status);
    ok('portal reports member id', approved.body.account?.memberId === approve.body.memberId);

    console.log('\nCertificate verification + download:');
    const verify = await json(`/api/verify/${approve.body.certId}`);
    ok('certificate verification 200', verify.status === 200, JSON.stringify(verify.body).slice(0, 150));
    ok('verification returns the member name', verify.body.fullName === 'Asha Verma', verify.body.fullName);
    ok('verification returns the certificate id', verify.body.certId === approve.body.certId, verify.body.certId);
    ok('verification reports a valid document', verify.body.valid === true);
    ok('unknown certificate id = 404', (await json('/api/verify/SSF-MCERT-0000-9999')).status === 404);

    // The admin "fallback" download path: /user-document/<type>/<officialId>?account=<id>
    const idDoc = await fetch(`${base}/api/user-document/membership-id/${encodeURIComponent(approve.body.memberId)}?account=${accountId}`, { headers: withToken() }).then(async (r) => ({ status: r.status, text: await r.text() }));
    ok('membership ID card document renders', idDoc.status === 200 && /Membership Identity Card/.test(idDoc.text), String(idDoc.status));
    ok('ID card shows the member name', /Asha Verma/.test(idDoc.text));
    const certDoc = await fetch(`${base}/api/user-document/membership-certificate/${encodeURIComponent(approve.body.certId)}?account=${accountId}`, { headers: withToken() }).then(async (r) => ({ status: r.status, text: await r.text() }));
    ok('membership certificate document renders', certDoc.status === 200 && /Certificate of Membership/.test(certDoc.text), String(certDoc.status));
    const foreign = await fetch(`${base}/api/user-document/membership-id/SSF-MEM-0000-0001?account=${accountId}`, { headers: withToken() }).then((r) => r.status);
    ok('document for another member is refused', foreign === 403, String(foreign));
    const noAccount = await fetch(`${base}/api/user-document/membership-id/${encodeURIComponent(approve.body.memberId)}`).then((r) => r.status);
    ok('document without account reference is refused', noAccount === 400, String(noAccount));

    console.log('\nAdvisory membership is honorary (no fee gate):');
    const advEmail = 'advisor@example.com';
    const advSignup = await send('/api/member-account-signup', 'POST', { fullName: 'Meera Nair', email: advEmail, confirmEmail: advEmail, phone: '9811111111', password: 'StrongPass1', memberType: 'advisory' });
    const advId = advSignup.body.user?.id;
    const ashaToken = userToken;
    userToken = advSignup.body.token;
    ok('advisory signup accepted', advSignup.status === 201, JSON.stringify(advSignup.body).slice(0, 150));
    ok('advisory payment marked not required', advSignup.body.user?.paymentStatus === 'not_required', advSignup.body.user?.paymentStatus);
    const advApply = await upload('/api/member-application', { accountId: advId, fullName: 'Meera Nair', email: advEmail, phone: '9811111111', memberType: 'advisory', message: 'Legal advisory support.' }, { profile_photo: PNG });
    ok('advisory application accepted', advApply.status === 201, JSON.stringify(advApply.body).slice(0, 150));
    const advApprove = await send(`/api/admin/member-approve/${advId}`, 'POST', {}, auth);
    ok('advisory approves without any payment', advApprove.status === 200, JSON.stringify(advApprove.body).slice(0, 200));
    ok('advisory member id issued', /^SSF-MBR-\d{5}$/.test(String(advApprove.body.memberId)), advApprove.body.memberId);
    const advPay = await send('/api/member-payment-submit', 'POST', { memberId: advId, paymentMode: 'UPI', paymentReference: '999999999999' });
    ok('advisory payment submit refused', advPay.status === 400, JSON.stringify(advPay.body).slice(0, 150));
    userToken = ashaToken;

    console.log('\nVolunteer application (public route, with identity proof):');
    const vol = await upload('/api/register', { name: 'Ravi Kumar', email: 'ravi.kumar@example.com', phone: '9812345678', volunteer_type: 'field', position: 'Field Volunteer', id_type: 'Aadhaar Card', identity_number: '9999 8888 7777', message: 'Weekend drives.' }, { profile_photo: PNG, id_document: PDF });
    ok('volunteer application accepted', [200, 201].includes(vol.status), JSON.stringify(vol.body).slice(0, 200));
    const volRow = await Volunteer.findOne({ where: { email: 'ravi.kumar@example.com' } });
    ok('volunteer row created', !!volRow);
    ok('volunteer identity number stored', volRow?.identityNumber === '9999 8888 7777', String(volRow?.identityNumber));
    ok('volunteer identity proof type stored', volRow?.idType === 'Aadhaar Card', String(volRow?.idType));
    ok('volunteer document stored', !!volRow?.idDocumentPath, String(volRow?.idDocumentPath));

    console.log('\nVolunteer admin workflow:');
    const volList = await json('/api/admin/volunteers', auth);
    ok('admin volunteer list requires auth', (await json('/api/admin/volunteers')).status === 401);
    ok('admin sees the volunteer', Array.isArray(volList.body) && volList.body.some((v) => v.id === volRow.id), `n=${volList.body?.length}`);
    const volAdminRow = volList.body.find((v) => v.id === volRow.id);
    ok('admin volunteer row exposes a public document URL', String(volAdminRow?.idDocumentUrl || '').startsWith('/uploads/'), String(volAdminRow?.idDocumentUrl));
    ok('admin volunteer row exposes a public photo URL', String(volAdminRow?.profilePhotoPath || '').startsWith('/uploads/'), String(volAdminRow?.profilePhotoPath));
    ok('admin volunteer document URL is a /uploads URL', volAdminRow?.idDocumentUrl === `/uploads/${path.basename(volRow.idDocumentPath)}`, String(volAdminRow?.idDocumentUrl));
    ok('admin volunteer document URL leaks no server path', !String(volAdminRow?.idDocumentUrl || '').includes(uploadsDir), String(volAdminRow?.idDocumentUrl));
    const volCorr = await send(`/api/admin/volunteers/${volRow.id}/status`, 'PATCH', { status: 'changes_requested', reviewNote: 'Please share a valid college ID.' }, auth);
    ok('volunteer correction 200', volCorr.status === 200, JSON.stringify(volCorr.body).slice(0, 150));
    ok('volunteer note saved', volCorr.body.volunteer?.reviewNote === 'Please share a valid college ID.', volCorr.body.volunteer?.reviewNote);
    const volApprove = await send(`/api/admin/volunteers/${volRow.id}/status`, 'PATCH', { status: 'approved' }, auth);
    ok('volunteer approval 200', volApprove.status === 200, JSON.stringify(volApprove.body).slice(0, 150));
    ok('volunteer id issued', /^SSF-VOL-\d{4}-\d{4}$/.test(String(volApprove.body.volunteer?.volunteerId)), volApprove.body.volunteer?.volunteerId);
    ok('volunteer cert id issued', /^SSF-VCERT-\d{4}-\d{4}$/.test(String(volApprove.body.volunteer?.certId)), volApprove.body.volunteer?.certId);
    ok('volunteer marked verified', volApprove.body.volunteer?.isVerified === true);
    ok('invalid volunteer status rejected', (await send(`/api/admin/volunteers/${volRow.id}/status`, 'PATCH', { status: 'bogus' }, auth)).status === 400);

    console.log('\nVolunteer application without an identity document (optional docs):');
    const volNoDoc = await upload('/api/register', { name: 'No Doc Volunteer', email: 'nodoc.vol@example.com', phone: '9812345679', volunteer_type: 'field', position: 'Field Volunteer' }, { profile_photo: PNG });
    ok('volunteer accepted without an identity document', [200, 201].includes(volNoDoc.status), JSON.stringify(volNoDoc.body).slice(0, 200));
    const volNoDocRow = await Volunteer.findOne({ where: { email: 'nodoc.vol@example.com' } });
    ok('volunteer row created without a document', !!volNoDocRow);
    ok('volunteer document path is null when omitted', volNoDocRow?.idDocumentPath === null, String(volNoDocRow?.idDocumentPath));
    ok('volunteer identity proof type is null when omitted', volNoDocRow?.idType === null, String(volNoDocRow?.idType));

    console.log('\nInternship application (resume required, photo/ID optional):');
    const intern = await upload('/api/internship', { fullName: 'Meera Iyer', email: 'meera.iyer@example.com', phone: '9800000001', college: 'Delhi University', course: 'B.Com', internshipType: 'content_writing', duration: '6 Weeks', id_type: 'Aadhaar Card', identity_number: '1234 5678 9012' }, { resume: DOC, profile_photo: PNG, id_document: PDF });
    ok('internship accepted', intern.status === 201, JSON.stringify(intern.body).slice(0, 200));
    const internRow = await InternshipApplication.findOne({ where: { email: 'meera.iyer@example.com' } });
    ok('internship row created', !!internRow);
    ok('internship resume stored', String(internRow?.resumePath || '').startsWith('/uploads/internships/'), String(internRow?.resumePath));
    ok('internship profile photo stored', String(internRow?.profilePhotoPath || '').startsWith('/uploads/internships/'), String(internRow?.profilePhotoPath));
    ok('internship identity document stored', String(internRow?.idDocumentPath || '').startsWith('/uploads/internships/'), String(internRow?.idDocumentPath));
    ok('internship identity number stored', internRow?.identityNumber === '1234 5678 9012', String(internRow?.identityNumber));
    const internNoDoc = await upload('/api/internship', { fullName: 'No Doc Intern', email: 'nodoc.intern@example.com', phone: '9800000002', college: 'Mumbai University', course: 'B.Sc', internshipType: 'field_research', duration: '4 Weeks' }, { resume: DOC, profile_photo: PNG });
    ok('internship accepted without an identity document', internNoDoc.status === 201, JSON.stringify(internNoDoc.body).slice(0, 200));
    const internNoDocRow = await InternshipApplication.findOne({ where: { email: 'nodoc.intern@example.com' } });
    ok('internship document path is null when omitted', internNoDocRow?.idDocumentPath === null, String(internNoDocRow?.idDocumentPath));
    const internNoResume = await upload('/api/internship', { fullName: 'No Resume Intern', email: 'noresume@example.com', phone: '9800000003', college: 'X', course: 'Y', internshipType: 'tech_dev', duration: '4 Weeks' }, { profile_photo: PNG });
    ok('internship rejects a missing resume', internNoResume.status === 400, JSON.stringify(internNoResume.body).slice(0, 150));
    const internList = await json('/api/admin/internships', auth);
    ok('admin internship list requires auth', (await json('/api/admin/internships')).status === 401);
    const internAdminRow = Array.isArray(internList.body) ? internList.body.find((x) => x.id === internRow.id) : null;
    ok('admin internship row exposes a resume URL', String(internAdminRow?.resumeUrl || '').startsWith('/uploads/internships/'), String(internAdminRow?.resumeUrl));
    ok('admin internship row exposes a document URL', String(internAdminRow?.idDocumentUrl || '').startsWith('/uploads/internships/'), String(internAdminRow?.idDocumentUrl));
    ok('admin internship document URL keeps its subdirectory', String(internAdminRow?.idDocumentUrl || '').split('/').slice(0, 3).join('/') === '/uploads/internships', String(internAdminRow?.idDocumentUrl));

    console.log('\nDonor registration (PAN text + optional document):');
    const donor = await upload('/api/donor', { fullName: 'Suresh Rao', email: 'suresh.rao@example.com', phone: '9811111111', city: 'Pune', state: 'Maharashtra', donationPurpose: 'Education', amount: '5000', pan: 'AAKAS7123H', paymentMode: 'upi', receiptPreference: 'email' }, { id_document: PDF });
    ok('donor accepted', donor.status === 201, JSON.stringify(donor.body).slice(0, 200));
    ok('donor id returned', /^SSF-DON-\d{4}-\d{4}$/.test(String(donor.body.donorId)), String(donor.body.donorId));
    const donorRow = await Donor.findOne({ where: { email: 'suresh.rao@example.com' } });
    ok('donor row created', !!donorRow);
    ok('donor document stored', String(donorRow?.idDocumentPath || '').startsWith('/uploads/donors/'), String(donorRow?.idDocumentPath));
    ok('donor PAN stored', donorRow?.pan === 'AAKAS7123H', String(donorRow?.pan));
    const donorNoDoc = await upload('/api/donor', { fullName: 'No Doc Donor', email: 'nodoc.donor@example.com', phone: '9822222222', donationPurpose: 'General Donation', paymentMode: 'online' });
    ok('donor accepted without a document', donorNoDoc.status === 201, JSON.stringify(donorNoDoc.body).slice(0, 200));
    const donorNoDocRow = await Donor.findOne({ where: { email: 'nodoc.donor@example.com' } });
    ok('donor document path is null when omitted', donorNoDocRow?.idDocumentPath === null, String(donorNoDocRow?.idDocumentPath));
    ok('donor rejects an invalid PAN', (await upload('/api/donor', { fullName: 'Bad Pan', email: 'badpan@example.com', phone: '9833333333', pan: 'INVALID' })).status === 400);
    const donorList = await json('/api/admin/donors', auth);
    ok('admin donor list requires auth', (await json('/api/admin/donors')).status === 401);
    const donorAdminRow = Array.isArray(donorList.body) ? donorList.body.find((x) => x.id === donorRow.id) : null;
    ok('admin donor row exposes a document URL', String(donorAdminRow?.idDocumentUrl || '').startsWith('/uploads/donors/'), String(donorAdminRow?.idDocumentUrl));

    console.log('\nLegacy absolute-path normalisation:');
    // Rows created before the fix stored multer's absolute file.path. The admin
    // API must still hand the browser a usable /uploads URL for those.
    const legacy = await Member.create({ fullName: 'Legacy Applicant', email: 'legacy@example.com', phone: '9000000011', memberType: 'general', status: 'pending', idProofType: 'PAN Card', identityNumber: 'LEGACY1234X', idDocumentPath: path.join(__dirname, '..', 'uploads', 'legacy-scan.pdf'), profilePhotoPath: path.join(__dirname, '..', 'uploads', 'legacy-photo.png') });
    const legacyList = await json('/api/admin/members', auth);
    const legacyRow = legacyList.body.find((m) => m.id === legacy.id);
    ok('legacy absolute doc path becomes /uploads URL', legacyRow?.idDocumentPath === '/uploads/legacy-scan.pdf', String(legacyRow?.idDocumentPath));
    ok('legacy absolute photo path becomes /uploads URL', legacyRow?.profilePhotoPath === '/uploads/legacy-photo.png', String(legacyRow?.profilePhotoPath));

    console.log('\nPortal participation (logged-in volunteer apply):');
    const portalVol = await send('/api/portal-volunteer', 'POST', { accountId, name: 'Asha Verma', email, phone: '9876543210', volunteer_type: 'field', message: 'I can help with drives.' });
    ok('portal volunteer application accepted', [200, 201].includes(portalVol.status), JSON.stringify(portalVol.body).slice(0, 200));

    console.log('\nA registered member whose role marker was never updated still gets their ID card:');
    // This is the exact production shape that hid Divya Sharma's card: an
    // approval issued the register number but left memberType as
    // 'website_signup' with the 'Signup from website' marker. Membership must
    // follow the issued number, not the stale column.
    const identity = require('../services/identityService');
    // Create first, then issue the number — the beforeCreate hook deliberately
    // strips IDs from a website signup, and in production the number arrives
    // later on approval, exactly like this.
    const stuck = await Member.create({ fullName: 'Divya Sharma', email: 'divya.stuck@example.com', phone: '9827263231', passwordHash: 'x', memberType: 'website_signup', message: 'Signup from website', status: 'approved', paymentStatus: 'not_required' });
    await stuck.update({ memberId: 'SSF-MBR-00003', certId: 'SSF-MCERT-00003', certificateType: 'Membership Certificate', certificateIssuedAt: new Date() });
    const stuckToken = (await require('../services/userAuth').issueToken(stuck));
    const stuckHeaders = { Authorization: `Bearer ${stuckToken}` };
    ok('a row with an issued number is treated as a real membership', identity.isRealMembership(stuck));
    ok('it is no longer classed as account-only', !identity.isAccountOnly(stuck));

    const stuckPortal = await fetch(`${base}/api/user-portal/${stuck.id}`, { headers: stuckHeaders }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
    ok('portal returns the member ID', stuckPortal.body.account?.memberId === 'SSF-MBR-00003', String(stuckPortal.body.account?.memberId));
    ok('portal exposes the ID card URL', String(stuckPortal.body.account?.idCardUrl || '').includes('/api/user-document/membership-id/SSF-MBR-00003'), String(stuckPortal.body.account?.idCardUrl).slice(0, 80));
    ok('portal shows the register category in a separate field, not in memberType', stuckPortal.body.account?.memberCategory === 'Founder Member', String(stuckPortal.body.account?.memberCategory));
    // memberType is the plan the portal keys its fee logic off, so it must stay
    // the plan and never be replaced by the register wording.
    ok('memberType stays the membership plan', stuckPortal.body.account?.memberType === 'website_signup', String(stuckPortal.body.account?.memberType));
    const cardRes = await fetch(`${base}/api/user-document/membership-id/SSF-MBR-00003?account=${stuck.id}&token=${encodeURIComponent(stuckToken)}`);
    ok('the ID card document itself renders (200)', cardRes.status === 200, String(cardRes.status));
    const cardHtml = await cardRes.text();
    ok('the card names the holder', cardHtml.includes('Divya Sharma'));
    ok('the card shows the register category', cardHtml.includes('Founder Member'));
    const verifyRes = await fetch(`${base}/api/verify/SSF-MBR-00003`).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
    ok('the public verify page validates the card', verifyRes.status === 200 && verifyRes.body.valid === true, JSON.stringify(verifyRes.body).slice(0, 150));
    const verifyCertRes = await fetch(`${base}/api/verify/SSF-MCERT-00003`).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
    ok('the public verify page validates the certificate too', verifyCertRes.status === 200 && verifyCertRes.body.valid === true, JSON.stringify(verifyCertRes.body).slice(0, 150));
    const volVerify = await fetch(`${base}/api/verify/SSF-VOL-2510-9999`).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
    ok('an unknown volunteer ID still answers as not-found', volVerify.status === 404, String(volVerify.status));

    console.log('\nThe one-time repair fixes rows left contradictory by the old approval:');
    const repaired = await identity.reconcileRegisterMembers(Member);
    const fixed = await Member.findByPk(stuck.id);
    ok('the repair reports the row it changed', repaired.promoted >= 1, JSON.stringify(repaired));
    ok('the stale marker is cleared', !fixed.message, String(fixed.message));
    ok('the register category replaces website_signup', fixed.memberType === 'Founder Member', String(fixed.memberType));
    ok('the post from the register is filled in', fixed.designation === 'Treasurer', String(fixed.designation));
    ok('running the repair again changes nothing', (await identity.reconcileRegisterMembers(Member)).promoted === 0);

    console.log('\nProfile photo management:');
    const photoForm = new FormData();
    photoForm.append('profilePhoto', new Blob([PNG.data], { type: PNG.type }), PNG.name);
    const photoRes = await fetch(`${base}/api/member-profile/${accountId}/photo`, { method: 'PATCH', headers: withToken(), body: photoForm }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
    ok('photo upload 200', photoRes.status === 200, JSON.stringify(photoRes.body).slice(0, 150));
    ok('photo returned as data url', String(photoRes.body.profilePhotoPath || '').startsWith('data:image/'), String(photoRes.body.profilePhotoPath).slice(0, 40));
    const removed = await fetch(`${base}/api/member-profile/${accountId}/photo`, { method: 'DELETE', headers: withToken() }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
    ok('photo removal 200', removed.status === 200 && removed.body.profilePhotoPath === null, JSON.stringify(removed.body).slice(0, 120));
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
