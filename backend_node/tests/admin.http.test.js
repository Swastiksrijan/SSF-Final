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
  if (/CREATE TABLE IF NOT EXISTS "(Interests|RoleDocuments)"/.test(sql)) return [];
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
  const RoleDocument = require('../models/RoleDocument');
  const AuditLog = require('../models/AuditLog');
  await sequelize.sync({ force: true });

  const app = express();
  app.use(express.json());
  const { adminAuditTrail } = require('../middleware/adminAuditTrail');
  app.use('/api', adminAuditTrail());
  for (const route of ['adminDashboardRoutes', 'memberCertificateRoutes', 'volunteerAdminRoutes', 'userPortalRoutes', 'submissionRoutes', 'portalParticipationRoutes']) {
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
