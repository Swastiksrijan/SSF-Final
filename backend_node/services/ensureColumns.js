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
];

async function ensureColumns() {
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

module.exports = { ensureColumns, COLUMNS };
