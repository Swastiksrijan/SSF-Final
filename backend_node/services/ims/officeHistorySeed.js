// Seeds the Managing Committee History register from the real SSF Digital
// Office records (module: officeHistory). Idempotent: a record is only created
// when its permanent recordId is not already present, so edits/archives are kept.
const { models } = require('../../models/ims');
const { OFFICE_HISTORY } = require('./officeHistoryData');

async function seedOfficeHistory() {
  const out = { officeHistory: 0 };
  const date = (v) => (/^\d{4}-\d{2}-\d{2}/.test(String(v || '')) ? String(v).slice(0, 10) : null);
  for (const rec of OFFICE_HISTORY) {
    const exists = await models.ImsOfficeHistory.findOne({ where: { recordId: rec.recordId } });
    if (exists) continue;
    await models.ImsOfficeHistory.create({
      recordId: rec.recordId,
      recordDate: date(rec.recordDate),
      recordType: rec.recordType,
      status: 'active',
      ...rec.data,
      eventDate: date(rec.data.eventDate),
      meetingDate: date(rec.data.meetingDate),
      createdByName: 'SSF Admin',
    });
    out.officeHistory++;
  }
  return out;
}

module.exports = { seedOfficeHistory };
