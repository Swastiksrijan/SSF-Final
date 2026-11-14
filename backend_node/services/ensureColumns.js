// Additive, idempotent column migrations.
//
// `sequelize.sync()` only creates missing TABLES — it never adds a column to a
// table that already exists, and the destructive `alter: true` pass is opt-in
// (DB_SYNC_ALTER) because on a free-tier Postgres it can be killed mid-query.
// So a new model attribute would silently stay absent on an existing
// production database. This helper issues `ADD COLUMN IF NOT EXISTS` for each
// declared column, which is safe to run on every boot: it never touches
// existing data and never drops anything.
const sequelize = require('../config/database');

const COLUMNS = [
  // Internship applications gained an optional photo + identity document so an
  // intern ID card can be issued (the form already promises one on selection).
  { table: 'InternshipApplications', column: 'profilePhotoPath', type: 'VARCHAR(255)' },
  { table: 'InternshipApplications', column: 'idDocumentPath', type: 'VARCHAR(255)' },
  { table: 'InternshipApplications', column: 'idType', type: 'VARCHAR(255)' },
  { table: 'InternshipApplications', column: 'identityNumber', type: 'VARCHAR(255)' },
  // Donors can attach a PAN / identity document and a profile photo.
  { table: 'Donors', column: 'idDocumentPath', type: 'VARCHAR(255)' },
  { table: 'Donors', column: 'profilePhotoPath', type: 'VARCHAR(255)' },
  // A donation certificate is issued once the payment is confirmed.
  { table: 'Donors', column: 'certId', type: 'VARCHAR(255)' },
  // Membership approval is gated on a confirmed payment, so the payment mode
  // and the UPI/UTR/receipt reference are recorded for audit.
  { table: 'Members', column: 'paymentMode', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'paymentReference', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'paymentUrl', type: 'VARCHAR(500)' },
  { table: 'Members', column: 'receiptNumber', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'receiptHistory', type: 'TEXT' },
  { table: 'Members', column: 'contributionTotalPaise', type: 'INTEGER DEFAULT 0' },
  { table: 'Members', column: 'patronInstallmentsPaid', type: 'INTEGER DEFAULT 0' },
  { table: 'Members', column: 'receiptIssuedAt', type: 'TIMESTAMP WITH TIME ZONE' },
  { table: 'Members', column: 'paymentVerifiedBy', type: 'VARCHAR(255)' },
  // The model gained a base64 photo plus profile-application fields after the
  // table already existed, and sequelize.sync() without alter never adds
  // columns. Without these, saving a portal profile photo fails on any
  // database older than the model.
  { table: 'Members', column: 'profilePhotoData', type: 'TEXT' },
  { table: 'Members', column: 'idProofType', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'identityNumber', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'idDocumentPath', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'reviewNote', type: 'TEXT' },
  // The admin command centre edits the full member profile, and an issued ID
  // card carries a validity window plus an active switch.
  { table: 'Members', column: 'designation', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'guardianName', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'address', type: 'TEXT' },
  { table: 'Members', column: 'city', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'state', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'pinCode', type: 'VARCHAR(255)' },
  { table: 'Members', column: 'joiningDate', type: 'DATE' },
  { table: 'Members', column: 'idValidFrom', type: 'DATE' },
  { table: 'Members', column: 'idValidTill', type: 'DATE' },
  { table: 'Members', column: 'idActive', type: 'BOOLEAN DEFAULT true' },
  { table: 'Volunteers', column: 'idValidFrom', type: 'DATE' },
  { table: 'Volunteers', column: 'idValidTill', type: 'DATE' },
  { table: 'Volunteers', column: 'idActive', type: 'BOOLEAN DEFAULT true' },
  { table: 'Donors', column: 'idValidFrom', type: 'DATE' },
  { table: 'Donors', column: 'idValidTill', type: 'DATE' },
  { table: 'Donors', column: 'idActive', type: 'BOOLEAN DEFAULT true' },
  // Preserve committee and General Body proceedings separately from the final order.
  { table: 'MemberActions', column: 'noticeReference', type: 'VARCHAR(64)' },
  { table: 'MemberActions', column: 'committeeDecisionText', type: 'TEXT' },
  { table: 'MemberActions', column: 'generalBodyDecisionText', type: 'TEXT' },
  // Stage-completion stamps and the per-stage email log, so the register shows
  // when each proceeding finished and which emails actually went out.
  { table: 'MemberActions', column: 'hearingOutcome', type: 'TEXT' },
  { table: 'MemberActions', column: 'hearingCompletedAt', type: 'TIMESTAMP WITH TIME ZONE' },
  { table: 'MemberActions', column: 'committeeReviewCompletedAt', type: 'TIMESTAMP WITH TIME ZONE' },
  { table: 'MemberActions', column: 'generalBodyReviewCompletedAt', type: 'TIMESTAMP WITH TIME ZONE' },
  { table: 'MemberActions', column: 'emailLog', type: 'JSONB DEFAULT \'[]\'::jsonb' },
  // Inward/outward correspondence register: additive columns only; preserve all existing communication rows.
  { table: 'ImsCommunications', column: 'referenceNo', type: 'VARCHAR(128)' },
  { table: 'ImsCommunications', column: 'correspondenceDate', type: 'DATE' },
  { table: 'ImsCommunications', column: 'communicationType', type: 'VARCHAR(64)' },
  { table: 'ImsCommunications', column: 'recipientEmail', type: 'VARCHAR(255)' },
  { table: 'ImsCommunications', column: 'recipientDesignation', type: 'VARCHAR(255)' },
  { table: 'ImsCommunications', column: 'senderEmail', type: 'VARCHAR(255)' },
  { table: 'ImsCommunications', column: 'followUpDate', type: 'DATE' },
  { table: 'ImsCommunications', column: 'attachmentUrl', type: 'TEXT' },
  { table: 'ImsCommunications', column: 'remarks', type: 'TEXT' },
  { table: 'ImsCommunications', column: 'receivedAt', type: 'TIMESTAMP WITH TIME ZONE' },
  // Correspondence & Communication Management expansion: email header fields,
  // reply linking, follow-up tracking. Additive only — existing rows untouched.
  { table: 'ImsCommunications', column: 'mode', type: 'VARCHAR(64)' },
  { table: 'ImsCommunications', column: 'priority', type: 'VARCHAR(32)' },
  { table: 'ImsCommunications', column: 'department', type: 'VARCHAR(255)' },
  { table: 'ImsCommunications', column: 'departmentCategory', type: 'VARCHAR(64)' },
  { table: 'ImsCommunications', column: 'senderDesignation', type: 'VARCHAR(255)' },
  { table: 'ImsCommunications', column: 'senderPhone', type: 'VARCHAR(64)' },
  { table: 'ImsCommunications', column: 'toEmails', type: 'TEXT' },
  { table: 'ImsCommunications', column: 'ccEmails', type: 'TEXT' },
  { table: 'ImsCommunications', column: 'bccEmails', type: 'TEXT' },
  { table: 'ImsCommunications', column: 'messageId', type: 'VARCHAR(512)' },
  { table: 'ImsCommunications', column: 'replyStatus', type: 'VARCHAR(64)' },
  { table: 'ImsCommunications', column: 'replyDate', type: 'DATE' },
  { table: 'ImsCommunications', column: 'linkedOutwardId', type: 'INTEGER' },
  { table: 'ImsCommunications', column: 'linkedOutwardRef', type: 'VARCHAR(128)' },
  { table: 'ImsCommunications', column: 'replyCount', type: 'INTEGER DEFAULT 0' },
  { table: 'ImsCommunications', column: 'followUpStatus', type: 'VARCHAR(64)' },
  { table: 'ImsCommunications', column: 'actionTaken', type: 'TEXT' },
  { table: 'ImsCommunications', column: 'dispatchNo', type: 'VARCHAR(128)' },
  { table: 'ImsCommunications', column: 'trackingNo', type: 'VARCHAR(128)' },
  { table: 'ImsCommunications', column: 'externalRef', type: 'VARCHAR(255)' },
  { table: 'ImsCommunications', column: 'attachments', type: 'JSONB DEFAULT \'[]\'::jsonb' },
];

// Values added to an existing Postgres ENUM. `sequelize.sync()` will not extend
// an enum type that already exists, so a new option would be rejected on any
// database older than the model. `ADD VALUE IF NOT EXISTS` is additive and safe
// to run on every boot.
const ENUM_VALUES = [
  { type: 'enum_MemberActions_actionScope', values: ['volunteer_review', 'staff_review', 'general_notice'] },
];

async function ensureEnumValues() {
  const added = [];
  for (const { type, values } of ENUM_VALUES) {
    for (const value of values) {
      try {
        await sequelize.query(`ALTER TYPE "${type}" ADD VALUE IF NOT EXISTS '${value}'`);
        added.push(`${type}.${value}`);
      } catch (error) {
        // The type may not exist yet on a fresh install (sync creates it with
        // every value), or pg-mem may not support ALTER TYPE. Never fatal.
        console.warn(`⚠️ ensureEnumValues skipped ${type}.${value}: ${error.message}`);
      }
    }
  }
  return added;
}

async function ensureColumns() {
  await ensureEnumValues();
  const added = [];
  for (const { table, column, type } of COLUMNS) {
    try {
      await sequelize.query(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}`);
      added.push(`${table}.${column}`);
    } catch (error) {
      // A missing table (fresh install where sync already made it, or a module
      // not yet registered) must never take the service down.
      console.warn(`⚠️ ensureColumns skipped ${table}.${column}: ${error.message}`);
    }
  }
  return added;
}

module.exports = { ensureColumns, COLUMNS, ENUM_VALUES };
