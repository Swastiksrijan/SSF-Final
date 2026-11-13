// Backfill the Correspondence & Communication master with the fields that were
// added after the first 27 records were created (mode, department, reply status,
// follow-up status, linked reference). Additive and idempotent: it only fills
// columns that are still empty, never overwrites a value an admin has set, and
// never changes reference numbers or dates.
//
// It also keeps the four MP-department addresses that failed to deliver marked
// as Failed / Bounced. Delivered is NOT recorded without real delivery proof.
const { Op } = require('sequelize');
const { models } = require('../../models/ims');

// Department display name by recipient email (only the ones we can verify).
const DEPT_BY_EMAIL = {
  'psmededu@mp.gov.in': 'चिकित्सा शिक्षा विभाग, मध्य प्रदेश',
  'psforest@gmail.com': 'वन विभाग, मध्य प्रदेश',
  'psscstwelfare@mp.gov.in': 'अनुसूचित जाति कल्याण विभाग, मध्य प्रदेश',
  'psnonconenergy@mp.gov.in': 'नवीन एवं नवकरणीय ऊर्जा विभाग, मध्य प्रदेश',
};
const FAILED_EMAILS = Object.keys(DEPT_BY_EMAIL);

function derivePatch(row) {
  const patch = {};
  const isEmail = !row.channel || row.channel === 'email';
  const failed = row.deliveryStatus === 'failed' || row.deliveryStatus === 'returned';

  if (!row.mode && isEmail) patch.mode = 'email';
  if (!row.department) {
    patch.department = DEPT_BY_EMAIL[row.recipientEmail] || row.recipient || row.sender || null;
  }
  if (!row.departmentCategory) {
    patch.departmentCategory = row.recipientEmail && row.recipientEmail.endsWith('.gov.in')
      ? 'state_government'
      : (row.recipientEmail ? 'government_department' : null);
  }
  if (!row.toEmails && row.direction === 'outward' && row.recipientEmail) patch.toEmails = row.recipientEmail;
  if (!row.replyStatus) {
    patch.replyStatus = row.direction === 'inward' ? 'not_required' : (failed ? 'not_required' : 'awaiting_reply');
  }
  if (!row.followUpStatus) patch.followUpStatus = failed ? 'not_required' : 'not_due';
  // The four known-bad MP addresses stay Failed — never "Delivered" without proof.
  if (FAILED_EMAILS.includes(row.recipientEmail) && row.deliveryStatus !== 'failed') patch.deliveryStatus = 'failed';

  // Drop keys whose value already matches (avoids pointless writes / audit noise).
  for (const k of Object.keys(patch)) {
    if (patch[k] == null || patch[k] === row[k]) delete patch[k];
  }
  return patch;
}

async function backfillCorrespondence() {
  const rows = await models.ImsCommunication.findAll({ where: { status: { [Op.ne]: 'archived' } } });
  let touched = 0;
  for (const row of rows) {
    const patch = derivePatch(row);
    if (Object.keys(patch).length === 0) continue;
    Object.assign(row, patch);
    await row.save();
    touched += 1;
  }
  return { total: rows.length, touched };
}

module.exports = { backfillCorrespondence, DEPT_BY_EMAIL, FAILED_EMAILS };
