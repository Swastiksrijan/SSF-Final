// One-off logical backup of the Digital Office records + audit log (JSON).
// Written to .openhands/backups/ (gitignored). Run: node backup-digital-office.js
const fs = require('fs');
const path = require('path');
const sequelize = require('./config/database');

(async () => {
  const out = path.join(__dirname, '..', '.openhands', 'backups');
  fs.mkdirSync(out, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');

  const [records] = await sequelize.query('SELECT * FROM "DigitalOfficeRecords" ORDER BY id');
  const [audits] = await sequelize.query('SELECT * FROM "DigitalOfficeAudits" ORDER BY id');

  const rFile = path.join(out, `digital-office-records-${stamp}.json`);
  const aFile = path.join(out, `digital-office-audits-${stamp}.json`);
  fs.writeFileSync(rFile, JSON.stringify(records, null, 2));
  fs.writeFileSync(aFile, JSON.stringify(audits, null, 2));

  console.log(`Backed up ${records.length} records -> ${rFile}`);
  console.log(`Backed up ${audits.length} audit rows -> ${aFile}`);
  await sequelize.close();
  process.exit(0);
})().catch((e) => { console.error('BACKUP FAILED:', e.message); process.exit(1); });
