// Integration test: GET /api/ims/audit-reports and the signed-PDF route.
//
// Exercises the real Express route and the real auth middleware against the real
// CA-signed dataset and the real archived PDFs — nothing is mocked.
//
//   node backend_node/tests/auditReports.http.test.js
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

mem.public.interceptQueries((sql) => {
  if (sql.includes('pg_enum') && /typname='enum_/.test(sql)) return [];
  if (/DROP TYPE IF EXISTS "public"\."enum_/.test(sql)) return [];
  if (/DECIMAL\(\d+,\s*\d+\)/.test(sql)) {
    mem.public.none(sql.replace(/DECIMAL\((\d+),\s*(\d+)\)/g, 'NUMERIC($1,$2)'));
    return [];
  }
  return null;
});

const pgAdapter = mem.adapters.createPg();
const realPgPath = require.resolve('pg');
require(realPgPath);
require.cache[realPgPath].exports = { ...require.cache[realPgPath].exports, Client: pgAdapter.Client, Pool: pgAdapter.Pool };

const express = require('express');
const crypto = require('crypto');
const { sequelize } = require('../models/ims');

let passed = 0; let failed = 0;
const ok = (label, cond, detail) => {
  if (cond) { passed++; console.log(`  ✓ ${label}`); }
  else { failed++; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); }
};

async function main() {
  await sequelize.sync();
  const app = express();
  app.use(express.json());
  app.use('/api', require('../routes/imsRoutes'));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const auth = { Authorization: 'Bearer test-token' };
  const get = (p, headers = auth) => fetch(base + p, { headers });

  console.log('\nThe route is protected:');
  const anon = await get('/api/ims/audit-reports', {});
  ok('an unauthenticated read is refused', anon.status === 401, `HTTP ${anon.status}`);
  const wrong = await get('/api/ims/audit-reports', { Authorization: 'Bearer nope' });
  ok('a wrong token is refused', wrong.status === 401, `HTTP ${wrong.status}`);

  console.log('\nThe register:');
  const res = await get('/api/ims/audit-reports');
  ok('it responds', res.status === 200, `HTTP ${res.status}`);
  const body = await res.json();
  ok('it names the organisation', /Swastik Srijan/.test(body.organization || ''), String(body.organization));
  ok('every signed year is present', Array.isArray(body.years) && body.years.length === 5, `${body.years && body.years.length}`);
  ok('the pending years are listed', Array.isArray(body.pendingYears) && body.pendingYears.length === 8, `${body.pendingYears && body.pendingYears.length}`);
  ok('the latest year is reported', body.latestYear === '2025-26', String(body.latestYear));
  ok('each year states an auditor and an opinion',
    body.years.every((y) => y.auditor && y.opinion));
  ok('the years are newest-agnostic ascending in the payload',
    body.years[0].financialYear < body.years[body.years.length - 1].financialYear);

  console.log('\nThe signed report file:');
  const file = await get('/api/ims/audit-reports/2025-26/file');
  ok('the file is served', file.status === 200, `HTTP ${file.status}`);
  ok('it is sent as a PDF', (file.headers.get('content-type') || '').includes('application/pdf'),
    String(file.headers.get('content-type')));
  const buf = Buffer.from(await file.arrayBuffer());
  ok('it is a real PDF', buf.slice(0, 5).toString() === '%PDF-', JSON.stringify(buf.slice(0, 8).toString()));
  ok('it is not an empty stub', buf.length > 50000, `${buf.length} bytes`);
  // Byte-identity with the archive copy proves the route serves the signed
  // document rather than a re-render.
  const onDisk = require('fs').readFileSync(
    require('path').join(__dirname, '..', '..', 'audit-reports', 'fy-2025-26', 'SSF-Audit-Report_FY-2025-2026.pdf'));
  ok('it is byte-identical to the archived signed report',
    crypto.createHash('md5').update(buf).digest('hex') === crypto.createHash('md5').update(onDisk).digest('hex'));

  console.log('\nEvery audited year has a downloadable signed report:');
  for (const y of body.years) {
    const r = await get(`/api/ims/audit-reports/${y.financialYear}/file`);
    const b = Buffer.from(await r.arrayBuffer());
    ok(`${y.financialYear} downloads a PDF`,
      r.status === 200 && b.slice(0, 5).toString() === '%PDF-' && b.length > 50000,
      `HTTP ${r.status}, ${b.length} bytes`);
  }

  console.log('\nBad input is refused, not guessed:');
  const unknown = await get('/api/ims/audit-reports/1999-00/file');
  ok('a year with no signed report is 404', unknown.status === 404, `HTTP ${unknown.status}`);
  const pending = await get('/api/ims/audit-reports/2016-17/file');
  ok('a pending year is 404', pending.status === 404, `HTTP ${pending.status}`);
  // The route resolves the stored path against the archive root; a traversal
  // attempt must never escape it.
  const trav = await get('/api/ims/audit-reports/..%2f..%2f..%2fpackage.json/file');
  ok('a traversal attempt is refused', trav.status === 404, `HTTP ${trav.status}`);
  const travBody = await trav.text();
  ok('and leaks no file contents', !/"dependencies"/.test(travBody), travBody.slice(0, 80));

  console.log(`\n${passed} passed, ${failed} failed`);
  server.close();
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
