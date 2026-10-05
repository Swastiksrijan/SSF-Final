const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Generic, year-wise audit record store. One table backs the whole Annual Audit
// & Compliance layer, discriminated by `kind`, so every part of the spec
// (documents, observations, queries, adjustments, versions, filings) keeps a
// full history without separate migrations:
//
//   auditor      — Auditor Profile
//   document     — Audit Documents (category, version, upload meta)
//   observation  — Audit Observations (severity, status, relatedTransactionId)
//   query        — Audit Query Management
//   adjustment   — Audit Adjustments (ADJ-YYYY-NNNNNN)
//   reportVersion— Audit Report version history
//   filing       — Statutory Filing Tracker (Form 10B/10BB/ITR-7, applicability)
const AuditRecord = sequelize.define('AuditRecord', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  recordId: { type: DataTypes.STRING, allowNull: false, unique: true },
  kind: { type: DataTypes.STRING, allowNull: false },
  auditId: { type: DataTypes.STRING, allowNull: true },
  financialYear: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
  relatedTransactionId: { type: DataTypes.STRING, allowNull: true },
  dueDate: { type: DataTypes.DATEONLY, allowNull: true },
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  data: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  createdBy: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true, indexes: [{ fields: ['kind'] }, { fields: ['auditId'] }, { fields: ['financialYear'] }, { fields: ['relatedTransactionId'] }] });

module.exports = AuditRecord;
