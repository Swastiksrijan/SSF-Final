// Integration test: the bank / cash statement importer.
//
// Runs the real parser and the real double-entry engine against an in-memory
// Postgres (pg-mem), so the ledger rows, the Bank Book running balance and the
// idempotency guard are all exercised end to end — nothing is mocked.
//
//   node backend_node/tests/bankStatementImport.http.test.js
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

// pg-mem cannot parse DECIMAL(n,2) or Sequelize's DO $$ enum blocks; the IMS
// schema is enum-free, so only the DECIMAL rewrite is needed here.
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
const { Op } = require('sequelize');
const { sequelize, models } = require('../models/ims');
const statementImport = require('../services/ims/bankStatementImport');
const accounting = require('../services/ims/accounting');

let passed = 0; let failed = 0;
const ok = (label, cond, detail) => {
  if (cond) { passed++; console.log(`  ✓ ${label}`); }
  else { failed++; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); }
};

const STATEMENT = `Date        Particulars                                  Chq/Ref     Withdrawal    Deposit     Balance
01-04-2026  OPENING BALANCE                                                          0.00        19816.84
03-04-2026  UPIAB/509368400629/CR/RAMESH P/UBIN/9971103790@pts                  300.00      20116.84
04-04-2026  NEFT:RAZORPAY SOFTWARE PRIVATE LIMITED - AXISCN095                  489.18      20606.02
05-05-2026  March 25 Worldine QR Rent        271        29.50                               20576.52
10-05-2026  SELF                             33341500   10000.00                           10576.52
15-05-2026  UPIAB/288554541654/CR/ASHA KOC/HDFC/asha.k7@ptye                     1600.00     12176.52
`;

const LOOSE = `2026-06-01 Some donation received 5000.00 25000.00
2026-06-02 Office rent paid 1500.00 23500.00
`;

async function main() {
  await sequelize.sync();

  console.log('\nParsing (aligned, with a header row):');
  const parsed = statementImport.parseStatement(STATEMENT);
  // The OPENING BALANCE line is the statement's own opening figure, not a
  // transaction, so it is deliberately not parsed as an entry.
  ok('every transaction row is parsed', parsed.entries.length === 5, String(parsed.entries.length));
  ok('no warnings', parsed.warnings.length === 0, parsed.warnings.join(' | '));
  const may5 = parsed.entries.find((e) => e.date === '2026-05-05');
  ok('a withdrawal goes into the withdrawal column', may5 && may5.withdrawal === 29.5 && may5.deposit === null, JSON.stringify(may5));
  ok('its cheque number is lifted out of the text', may5 && may5.ref === '271', may5 && may5.ref);
  const may10 = parsed.entries.find((e) => e.date === '2026-05-10');
  ok('a large withdrawal stays a withdrawal', may10 && may10.withdrawal === 10000 && may10.deposit === null, JSON.stringify(may10));
  const apr3 = parsed.entries.find((e) => e.date === '2026-04-03');
  ok('a credit goes into the deposit column', apr3 && apr3.deposit === 300 && apr3.withdrawal === null, JSON.stringify(apr3));
  ok('dates normalise to ISO', parsed.entries.every((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date)));
  ok('the financial year is derived from the date', parsed.entries.every((e) => statementImport.fyOf(e.date) === '2026-27'));

  console.log('\nParsing (loose paste, no header):');
  const loose = statementImport.parseStatement(LOOSE);
  ok('both loose rows parse', loose.entries.length === 2, String(loose.entries.length));
  ok('direction is inferred from the balance movement',
    loose.entries[0].deposit === 5000 && loose.entries[1].withdrawal === 1500,
    JSON.stringify(loose.entries.map((e) => [e.deposit, e.withdrawal])));

  console.log('\nPreview (nothing written):');
  const before = await models.ImsLedgerEntry.count();
  const pv = await statementImport.preview(STATEMENT, { openingBalance: 19816.84 });
  const after = await models.ImsLedgerEntry.count();
  ok('preview writes nothing', before === after, `${before} -> ${after}`);
  ok('preview reports the year totals', pv.years.length === 1 && pv.years[0].fy === '2026-27', JSON.stringify(pv.years));
  ok('preview totals the deposits', pv.years[0].deposit === 2389.18, String(pv.years[0].deposit));
  ok('preview totals the withdrawals', pv.years[0].withdrawal === 10029.5, String(pv.years[0].withdrawal));
  ok('preview says the running balance ties', pv.runningBalanceTies === true, JSON.stringify({ expected: pv.expectedClosing, ties: pv.runningBalanceTies }));
  ok('preview reports the rows still to import', pv.toImport === 5, String(pv.toImport));

  console.log('\nCommit (posts to the double-entry ledger):');
  const out = await statementImport.commit(STATEMENT, { openingBalance: 19816.84, openingFy: '2026-27', kind: 'bank' });
  ok('every row is imported', out.imported === 6, JSON.stringify({ imported: out.imported, errors: out.errors.length })); // 5 transactions + 1 opening voucher
  ok('no row errors', out.errors.length === 0, JSON.stringify(out.errors.slice(0, 2)));

  const entries = await models.ImsLedgerEntry.findAll({ where: { sourceModule: 'bank_statement_import' }, attributes: ['debit', 'credit'] });
  const debit = entries.reduce((s, e) => s + Number(e.debit), 0);
  const credit = entries.reduce((s, e) => s + Number(e.credit), 0);
  ok('the imported postings balance', Math.abs(debit - credit) < 0.01, `Dr ${debit} vs Cr ${credit}`);

  const tb = await accounting.trialBalance({});
  ok('the trial balance stays balanced', tb.balanced === true, JSON.stringify({ dr: tb.totalDebit, cr: tb.totalCredit }));

  const book = await accounting.book('bank', {});
  ok('the bank book opens with the opening balance', book.entries[0].balance === 19816.84, String(book.entries[0].balance));
  ok('the bank book closes at the statement closing balance', book.closingBalance === 12176.52, String(book.closingBalance));

  console.log('\nIdempotency (re-pasting the same statement):');
  const again = await statementImport.commit(STATEMENT, { openingBalance: 19816.84, openingFy: '2026-27', kind: 'bank' });
  ok('the second run imports nothing', again.imported === 0, String(again.imported));
  ok('the second run skips every row', again.skipped === 5, String(again.skipped));
  const book2 = await accounting.book('bank', {});
  ok('the bank book balance is unchanged', book2.closingBalance === 12176.52, String(book2.closingBalance));

  const pv2 = await statementImport.preview(STATEMENT, { openingBalance: 19816.84 });
  ok('preview now reports nothing to import', pv2.toImport === 0, String(pv2.toImport));
  ok('preview reports the already-imported count', pv2.alreadyImported === 5, String(pv2.alreadyImported));

  console.log('\nHTTP endpoints (auth + preview + import):');
  const app = express();
  app.use(express.json({ limit: '5mb' }));
  app.use('/api', require('../routes/imsRoutes'));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const auth = { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' };
  const post = (p, body, h = auth) => fetch(base + p, { method: 'POST', headers: h, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

  const noAuth = await post('/api/ims/finance/statement/preview', { text: STATEMENT }, { 'Content-Type': 'application/json' });
  ok('the endpoint rejects an unauthenticated call', noAuth.status === 401, String(noAuth.status));

  const httpPreview = await post('/api/ims/finance/statement/preview', { text: STATEMENT, openingBalance: 19816.84 });
  ok('preview returns 200', httpPreview.status === 200, JSON.stringify(httpPreview.body).slice(0, 120));
  ok('preview finds the year', httpPreview.body.years?.[0]?.fy === '2026-27', JSON.stringify(httpPreview.body.years));

  const empty = await post('/api/ims/finance/statement/import', { text: '   ' });
  ok('import refuses an empty paste', empty.status === 400, String(empty.status));

  const httpImport = await post('/api/ims/finance/statement/import', { text: STATEMENT, openingBalance: 19816.84, openingFy: '2026-27', kind: 'bank' });
  ok('import returns 200', httpImport.status === 200, JSON.stringify(httpImport.body).slice(0, 120));
  ok('re-importing over HTTP changes nothing', httpImport.body.imported === 0 && httpImport.body.skipped === 5, JSON.stringify(httpImport.body));

  const fresh = await post('/api/ims/finance/statement/import', { text: LOOSE, kind: 'bank' });
  ok('a fresh paste imports over HTTP', fresh.body.imported === 2, JSON.stringify(fresh.body));
  server.close();

  console.log("\nThe repo's two bundled statements (backfill path):");
  // The Bank Book page has always shown FY 2024-25 and FY 2025-26 from a frontend
  // data file. The backfill script feeds those same numbers through this importer,
  // so the ledger must reproduce the statement's own printed closing balance.
  const path2 = require('path'); const fsp = require('fs'); const osp = require('os'); const esb = require('esbuild');
  const bundledSrc = path2.join(__dirname, '..', '..', 'src', 'data', 'bankStatements.js');
  const built = esb.buildSync({ entryPoints: [bundledSrc], bundle: true, format: 'cjs', platform: 'node', write: false, logLevel: 'silent' });
  const tmpFile = path2.join(osp.tmpdir(), `ssf-test-bankstatements-${process.pid}.cjs`);
  fsp.writeFileSync(tmpFile, built.outputFiles[0].text);
  const bundled = require(tmpFile);
  fsp.unlinkSync(tmpFile);

  const toText = (acct, fy, st) => {
    const line = (d, pa, r, am, b) => `${d}  ${pa}${r ? '  ' + r : ''}  ${Number(am).toFixed(2)}  ${Number(b).toFixed(2)}`;
    return [line(st.periodFrom, 'OPENING BALANCE', '', st.openingBalance, st.openingBalance),
      ...bundled.bankStatementRecords(acct, fy).map((r) => {
        const d = r.data; const am = d.deposit != null ? d.deposit : d.withdrawal;
        return line(r.recordDate, d.particulars, d.chqNum, am, d.balance);
      })].join('\n');
  };

  const maxIdBefore = Math.max(0, ...(await models.ImsLedgerEntry.findAll({ attributes: ['id'] })).map((r) => r.id));

  for (const [acct, byFy] of Object.entries(bundled.BANK_STATEMENTS)) {
    for (const [fy, st] of Object.entries(byFy)) {
      const text = toText(acct, fy, st);
      const p = await statementImport.preview(text, { accountKey: acct, openingBalance: st.openingBalance });
      ok(`${fy}: every row is read`, p.entries.length === st.transactions.length, `${p.entries.length} vs ${st.transactions.length}`);
      ok(`${fy}: deposits match the statement`, Math.abs(p.years[0].deposit - st.summary.totalCredits) < 0.01, `${p.years[0].deposit} vs ${st.summary.totalCredits}`);
      ok(`${fy}: withdrawals match the statement`, Math.abs(p.years[0].withdrawal - st.summary.totalDebits) < 0.01, `${p.years[0].withdrawal} vs ${st.summary.totalDebits}`);
      ok(`${fy}: the running balance ties`, p.runningBalanceTies === true, String(p.expectedClosing));
      const c = await statementImport.commit(text, { kind: 'bank', accountKey: acct, openingBalance: st.openingBalance, openingFy: fy });
      ok(`${fy}: every row lands in the ledger`, c.errors.length === 0, JSON.stringify(c.errors[0] || {}).slice(0, 120));
    }
  }

  // The earliest year's opening balance is posted as a voucher; later years'
  // printed openings are just the prior closing, so they are not posted again.
  // year's printed opening is that closing, so posting it again would double it.
  // So the bank side (COA 1100) nets to the latest printed closing balance.
  const y2526 = bundled.BANK_STATEMENTS['UBIN-4814']['2025-26'];
  const added = await models.ImsLedgerEntry.findAll({ where: { id: { [Op.gt]: maxIdBefore } }, attributes: ['debit', 'credit', 'voucherType', 'accountCode'] });
  const openingVouchers = added.filter((l) => l.voucherType === 'contra').length;
  ok('exactly one opening voucher is posted for the two years', openingVouchers === 2, `${openingVouchers} contra postings`);
  // Only the bank side (COA 1100) shows the movement; the other side is the
  // suspense/opening-equity counterpart, so summing all lines would net to zero.
  const netAdded = added
    .filter((l) => l.accountCode === statementImport.BANK_COA)
    .reduce((s, l) => s + Number(l.debit) - Number(l.credit), 0);
  const expectedNet = y2526.summary.closingBalance;
  ok('the two bundled years move the bank by the right amount',
    Math.abs(netAdded - expectedNet) < 0.01,
    `net ${netAdded.toFixed(2)}, expected ${expectedNet.toFixed(2)}`);

  const tbNow = await accounting.trialBalance({});
  ok('the trial balance still balances after the backfill', tbNow.balanced === true, JSON.stringify({ dr: tbNow.totalDebit, cr: tbNow.totalCredit }));

  console.log('\nRegisters agree with the bank book:');
  // Every posting is a balanced pair, so the ledger's debits equal its credits
  // and the day book lists two lines per voucher.
  const allLedger = await models.ImsLedgerEntry.findAll({ attributes: ['debit', 'credit', 'voucherNo'] });
  const totalDr = allLedger.reduce((s, l) => s + Number(l.debit), 0);
  const totalCr = allLedger.reduce((s, l) => s + Number(l.credit), 0);
  ok('every ledger posting has a balancing counterpart', Math.abs(totalDr - totalCr) < 0.01, `Dr ${totalDr} vs Cr ${totalCr}`);
  const byVoucher = {};
  for (const l of allLedger) byVoucher[l.voucherNo] = (byVoucher[l.voucherNo] || 0) + 1;
  ok('no voucher has fewer than two postings', Object.values(byVoucher).every((n) => n >= 2), JSON.stringify(Object.values(byVoucher).filter((n) => n < 2).slice(0, 5)));

  console.log(`\n${failed === 0 ? '✅' : '❌'} ${passed} passed, ${failed} failed\n`);
  await sequelize.close();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
