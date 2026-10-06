// Restore a Digital Office logical backup (JSON) into the configured database.
// Produced by backup-digital-office.js. Safe to re-run: existing recordIds are
// skipped, so it only inserts what is missing.
//   node scripts/restore-digital-office.js [path-to-records.json]
// Defaults to the newest .openhands/backups/digital-office-records-*.json.
const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
const DigitalOfficeRecord = require('../models/DigitalOfficeRecord');

function newestBackup() {
    const dir = path.join(__dirname, '..', '..', '.openhands', 'backups');
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir)
        .filter(f => /^digital-office-records-.*\.json$/.test(f))
        .sort();
    return files.length ? path.join(dir, files[files.length - 1]) : null;
}

(async () => {
    const file = process.argv[2] || newestBackup();
    if (!file || !fs.existsSync(file)) {
        console.error('No backup file found. Pass a path: node scripts/restore-digital-office.js <records.json>');
        process.exit(1);
    }

    const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`Restoring ${rows.length} records from ${path.basename(file)}`);

    await sequelize.sync();
    const { Op } = require('sequelize');
    const existing = new Set(
        (await DigitalOfficeRecord.findAll({ attributes: ['recordId'] })).map(r => r.recordId),
    );

    const fresh = rows.filter(r => !existing.has(r.recordId));
    if (!fresh.length) {
        console.log('Nothing to do — every recordId already present.');
    } else {
        await DigitalOfficeRecord.bulkCreate(fresh, { validate: false });
        console.log(`✅ Restored ${fresh.length} records (${rows.length - fresh.length} already present).`);
    }

    await sequelize.close();
    process.exit(0);
})().catch(e => { console.error('RESTORE FAILED:', e.message); process.exit(1); });
