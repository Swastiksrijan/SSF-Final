// Safe, additive Gmail import for the SSF correspondence master register.
// The caller must supply reviewed/normalised messages; Gmail credentials never
// enter the IMS backend. Gmail message ID (or RFC Message-ID) is the idempotency key.
const { models } = require('../../models/ims');
const resource = require('./resource');
const { logAudit } = require('./audit');

const clean = (v, max = 10000) => (v == null ? '' : String(v)).trim().slice(0, max);
const dateOnly = (v) => {
  const s = clean(v, 40);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

function normalise(input) {
  const direction = clean(input.direction, 12).toLowerCase();
  const messageId = clean(input.messageId, 998);
  const correspondenceDate = dateOnly(input.correspondenceDate || input.date);
  if (!['inward', 'outward'].includes(direction)) throw new Error('Each import row needs direction inward or outward.');
  if (!messageId) throw new Error('Each import row needs the original Gmail Message-ID for safe deduplication.');
  if (!correspondenceDate) throw new Error('Each import row needs a valid correspondence date.');
  const sender = clean(input.sender, 500);
  const recipient = clean(input.recipient, 500);
  const subject = clean(input.subject, 500);
  if (!subject) throw new Error('Each import row needs a subject.');
  return {
    direction, messageId, correspondenceDate,
    communicationType: 'official_correspondence', channel: 'email', mode: 'email',
    priority: clean(input.priority, 20) || 'normal',
    sender, senderEmail: clean(input.senderEmail, 320),
    recipient, recipientEmail: clean(input.recipientEmail, 320),
    toEmails: clean(input.toEmails, 2000), ccEmails: clean(input.ccEmails, 2000),
    subject, message: clean(input.message || input.snippet, 12000),
    deliveryStatus: clean(input.deliveryStatus, 30) || (direction === 'outward' ? 'sent' : 'not_applicable'),
    sentAt: direction === 'outward' ? (input.sentAt || correspondenceDate) : null,
    receivedAt: direction === 'inward' ? (input.receivedAt || correspondenceDate) : null,
    replyStatus: direction === 'outward' ? 'awaiting_reply' : 'not_required',
    followUpStatus: 'not_due',
    remarks: 'Imported from Gmail after review. Gmail thread ID: ' + clean(input.gmailThreadId, 100),
    status: 'active',
  };
}

async function importReviewed(rows, req) {
  if (!Array.isArray(rows) || !rows.length) { const e = new Error('Provide reviewed rows to import.'); e.status = 400; throw e; }
  if (rows.length > 200) { const e = new Error('Import is limited to 200 rows per batch.'); e.status = 400; throw e; }
  const result = { inserted: 0, skipped: 0, failed: 0, records: [], errors: [] };
  for (let i = 0; i < rows.length; i += 1) {
    try {
      const payload = normalise(rows[i]);
      const existing = await models.ImsCommunication.findOne({ where: { messageId: payload.messageId } });
      if (existing) { result.skipped += 1; result.records.push({ row: i, status: 'duplicate', recordId: existing.recordId }); continue; }
      const created = await resource.create('communications', payload, req, { skipDuplicateCheck: true });
      result.inserted += 1;
      result.records.push({ row: i, status: 'inserted', recordId: created.recordId, referenceNo: created.referenceNo });
    } catch (error) {
      result.failed += 1;
      result.errors.push({ row: i, message: error.message || 'Import failed' });
    }
  }
  await logAudit({ entityType: 'communications', entityId: 'gmail-import', action: 'gmail_import_batch', newValue: { inserted: result.inserted, skipped: result.skipped, failed: result.failed }, req });
  return result;
}

module.exports = { importReviewed };
