// One-off backfill: load the bank statements already committed to the repo
// (src/data/bankStatements.js — FY 2024-25 and FY 2025-26) into the IMS ledger.
//
// Those two years live in the frontend as a data file, which is why the Bank
// Book page showed them but the registers, ledger and trial balance did not.
// This script runs the SAME parser and the SAME importer as the paste UI, so the
// result is identical to the treasurer pasting each statement by hand.
//
// Idempotent: safe to run more than once.
//
//   cd backend_node && node scripts/backfill-bank-statements.js
//   cd backend_node && node scripts/backfill-bank-statements.js --dry-run
const path = require('path');
const fs = require('fs');
const os = require('os');
const esbuild = require('esbuild');

const DRY = process.argv.includes('--dry-run');

function loadStatements() {
  // The data file is ESM with no runtime dependencies; transpile it in memory
  // rather than duplicating the numbers here (a copy would silently drift).
  const src = path.join(__dirname, '..', '..', 'src', 'data', 'bankStatements.js');
  const out = esbuild.buildSync({
    entryPoints: [src],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  });
  const tmp = path.join(os.tmpdir(), `ssf-bankstatements-${process.pid}.cjs`);
  fs.writeFileSync(tmp, out.outputFiles[0].text);
  const mod = require(tmp);
  fs.unlinkSync(tmp);
  return mod;
}

async function main() {
  const { BANK_STATEMENTS, bankStatementRecords } = loadStatements();
  const statementImport = require('../services/ims/bankStatementImport');
  const { sequelize } = require('../models/ims');
  await sequelize.sync();

  for (const [accountId, byFy] of Object.entries(BANK_STATEMENTS)) {
    for (const [fy, st] of Object.entries(byFy)) {
      // Reuse the app's own converter so the importer sees exactly the rows the
      // Bank Book page would have shown for this year. An explicit OPENING
      // BALANCE line seeds the running balance, so each row's direction (debit
      // or credit) is read from how the balance moved.
      const records = bankStatementRecords(accountId, fy);
      const line = (date, particulars, ref, amount, balance) =>
        `${date}  ${particulars}${ref ? `  ${ref}` : ''}  ${Number(amount).toFixed(2)}  ${Number(balance).toFixed(2)}`;
      const text = [
        line(st.periodFrom, 'OPENING BALANCE', '', st.openingBalance, st.openingBalance),
        ...records.map((r) => {
          const d = r.data;
          const amount = d.deposit != null ? d.deposit : d.withdrawal;
          return line(r.recordDate, d.particulars, d.chqNum, amount, d.balance);
        }),
      ].join('\n');

      const pv = await statementImport.preview(text, { accountKey: accountId, openingBalance: st.openingBalance });
      console.log(`\n${accountId} · FY ${fy}: parsed ${pv.entries.length}, deposits ${pv.years[0]?.deposit}, withdrawals ${pv.years[0]?.withdrawal}, ties=${pv.runningBalanceTies}, toImport=${pv.toImport}`);
      if (DRY) continue;
      const out = await statementImport.commit(text, {
        kind: 'bank', accountKey: accountId, openingBalance: st.openingBalance, openingFy: fy,
      });
      console.log(`  imported ${out.imported}, skipped ${out.skipped}, errors ${out.errors.length}`);
      if (out.errors.length) console.log('  first error:', out.errors[0]);
    }
  }
  await sequelize.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
