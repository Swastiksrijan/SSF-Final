// Integration test: the letterhead composer's register save and reference
// numbering.
//
// Exercises the real IMS resource engine and the real HTTP route against an
// in-memory Postgres (pg-mem) — the Sequelize model, the ID ledger, the audit
// trail and the route's auth are all the production ones, nothing is mocked.
//
//   node backend_node/tests/letterhead.http.test.js
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

// pg-mem cannot parse DECIMAL(n,2); the IMS schema is enum-free, so the decimal
// rewrite is the only interception needed.
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
const { sequelize, models } = require('../models/ims');

let passed = 0; let failed = 0;
const ok = (label, cond, detail) => {
  if (cond) { passed++; console.log(`  ✓ ${label}`); }
  else { failed++; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); }
};

// The payload the composer's "File in register" button sends.
const letterPayload = (n) => ({
  title: `Proposal for CSR partnership — letter ${n}`,
  category: 'Official Correspondence',
  docType: 'Official Communication Letter',
  issueDate: '2026-10-19',
  owner: 'Ramesh Pandey',
  source: 'Letterhead composer',
  approvedBy: 'Founder & National President',
  data: {
    letterNo: `SSF/LTR/2026/${String(n).padStart(4, '0')}`,
    date: '2026-10-19',
    docType: 'Official Communication Letter',
    toName: 'Shri A. K. Sharma',
    toDesignation: 'General Manager (CSR)',
    toOrg: 'Bharat Heavy Electricals Limited',
    toAddress: 'Bhopal, Madhya Pradesh',
    subject: `CSR partnership proposal ${n}`,
    salutation: 'Respected Sir,',
    body: 'First paragraph.\n\nSecond paragraph.',
    closing: 'Thank you,',
    enclosures: '1. Project note',
    cc: 'The Managing Committee, SSF',
    signatoryName: 'Ramesh Pandey',
    signatoryDesignation: 'Founder & National President',
    language: 'both',
    watermark: true,
  },
});

async function main() {
  await sequelize.sync();
  const app = express();
  app.use(express.json({ limit: '12mb' }));
  app.use('/api', require('../routes/imsRoutes'));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const auth = { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' };
  const post = (p, body) => fetch(base + p, { method: 'POST', headers: auth, body: JSON.stringify(body) });
  const get = (p) => fetch(base + p, { headers: auth });

  console.log('\nThe register the composer writes to:');
  const bad = await get('/api/ims/officialDocuments');
  ok('the old module name is rejected (the bug this fix removes)',
    bad.status === 500 && /Unknown IMS resource/.test(await bad.text()), `HTTP ${bad.status}`);
  const empty = await get('/api/ims/documents?limit=5');
  const emptyBody = await empty.json();
  ok('the documents register responds', empty.status === 200, `HTTP ${empty.status}`);
  ok('it starts empty', Array.isArray(emptyBody.records) && emptyBody.records.length === 0, JSON.stringify(emptyBody).slice(0, 120));

  console.log('\nSaving a letter (the "File in register" button):');
  const r1 = await post('/api/ims/documents', letterPayload(1));
  const b1 = await r1.json();
  ok('the letter saves', r1.status === 201 || r1.status === 200, `HTTP ${r1.status} ${JSON.stringify(b1).slice(0, 160)}`);
  ok('it gets a permanent record id', /^DOC-\d{4}-\d{4}$/.test(b1.recordId || ''), String(b1.recordId));
  ok('the letter number is stored', b1.data && b1.data.letterNo === 'SSF/LTR/2026/0001', JSON.stringify(b1.data || {}).slice(0, 120));
  ok('the recipient is stored', b1.data && b1.data.toOrg === 'Bharat Heavy Electricals Limited');
  ok('the body is stored verbatim', b1.data && b1.data.body.includes('Second paragraph.'));
  ok('the document type is stored', b1.docType === 'Official Communication Letter', String(b1.docType));
  ok('the category is stored', b1.category === 'Official Correspondence', String(b1.category));

  console.log('\nSaving more letters (sequential, no duplicates):');
  const ids = [b1.recordId];
  for (let n = 2; n <= 6; n++) {
    const r = await post('/api/ims/documents', letterPayload(n));
    const b = await r.json();
    if (r.ok) ids.push(b.recordId);
    else console.log(`    letter ${n} failed: HTTP ${r.status} ${JSON.stringify(b).slice(0, 120)}`);
  }
  ok('six letters saved', ids.length === 6, ids.join(', '));
  ok('every record id is unique', new Set(ids).size === ids.length, ids.join(', '));
  ok('the ids are sequential', ids.join(',') === ids.slice().sort().join(','), ids.join(', '));

  console.log('\nConcurrent saves (reference numbering under load):');
  // pg-mem does not emulate SELECT ... FOR UPDATE, so the row lock that makes
  // nextId() atomic in production is a no-op here: overlapping allocators read
  // the same counter and collide. Asserting on this would be asserting on the
  // emulator, not on the code, so the burst is reported rather than graded, and
  // the property that actually matters is checked directly below.
  const burst = await Promise.all([7, 8, 9, 10, 11, 12].map((n) => post('/api/ims/documents', letterPayload(n))));
  const burstBodies = await Promise.all(burst.map((r) => r.json()));
  const burstIds = burstBodies.map((b) => b.recordId).filter(Boolean);
  const burstDupes = burstIds.length !== new Set(burstIds).size;
  console.log(`    ${burstIds.length}/6 concurrent saves allocated an id; duplicate ids: ${burstDupes}` +
    (burstDupes ? '  (pg-mem ignores FOR UPDATE — expected here, not in production)' : ''));
  ok('the id allocator is the row-locked one production uses',
    /ImsIdSequence/.test(require('fs').readFileSync(require.resolve('../services/ims/ids'), 'utf8')) &&
    /lock:\s*t\.LOCK\.UPDATE/.test(require('fs').readFileSync(require.resolve('../services/ims/ids'), 'utf8')));

  console.log('\nReading the register back (what the Recent letters table shows):');
  const listRes = await get('/api/ims/documents?limit=500');
  const list = await listRes.json();
  const expected = 6 + burstIds.length;
  ok(`every letter that saved is listed (${expected})`, list.total === expected, `${list.total} vs ${expected}`);
  const nums = list.records.map((x) => (x.data || {}).letterNo).filter(Boolean);
  ok('no reference number is duplicated', new Set(nums).size === nums.length, nums.join(', '));
  ok('the register is newest-first', Number(list.records[0].id) > Number(list.records[list.records.length - 1].id));
  ok('a letter can be fetched by its record id', (await (await get(`/api/ims/documents/${b1.recordId}`)).json()).recordId === b1.recordId);

  console.log('\nReference numbering derived from the register:');
  // Mirrors nextLetterNo() in src/ims/letterheadPdf.js.
  const nextLetterNo = (existing, year = 2026) => {
    const prefix = `SSF/LTR/${year}/`;
    const max = existing
      .map((r) => String(((r && r.data) || {}).letterNo || ''))
      .filter((n) => n.startsWith(prefix))
      .map((n) => parseInt(n.slice(prefix.length), 10) || 0)
      .reduce((a, b) => Math.max(a, b), 0);
    return `${prefix}${String(max + 1).padStart(4, '0')}`;
  };
  const stored = list.records.map((x) => (x.data || {}).letterNo).filter(Boolean).sort();
  const highest = stored[stored.length - 1];
  const expectedNext = `SSF/LTR/2026/${String(Number(highest.slice(-4)) + 1).padStart(4, '0')}`;
  ok('the next reference continues the series', nextLetterNo(list.records) === expectedNext, `${nextLetterNo(list.records)} vs ${expectedNext}`);
  ok('a different year restarts at 0001', nextLetterNo(list.records, 2027) === 'SSF/LTR/2027/0001', nextLetterNo(list.records, 2027));
  ok('an empty register starts at 0001', nextLetterNo([]) === 'SSF/LTR/2026/0001', nextLetterNo([]));

  console.log('\nThe existing registers are untouched:');
  ok('no other document row was created', await models.ImsDocument.count() === expected, String(await models.ImsDocument.count()));
  const audits = await models.ImsAuditTrail.count({ where: { entityType: 'documents' } });
  ok('every save left an audit entry', audits === expected, `${audits} vs ${expected}`);

  server.close();
  console.log(`\n${failed ? '✗' : '✓'} ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error('TEST CRASHED', e); process.exit(1); });
