const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Audit-year master: one row per financial year (AUD-2025-26-001). Holds the
// auditor, dates, status, and the structured auditor summary figures so the
// numbers live in fields as well as in the attached PDFs.
const AuditYear = sequelize.define('AuditYear', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  auditId: { type: DataTypes.STRING, allowNull: false, unique: true },
  financialYear: { type: DataTypes.STRING, allowNull: false },
  assessmentYear: { type: DataTypes.STRING, allowNull: true },
  auditStatus: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Not Started' },
  auditType: { type: DataTypes.STRING, allowNull: true },
  auditorName: { type: DataTypes.STRING, allowNull: true },
  auditFirm: { type: DataTypes.STRING, allowNull: true },
  membershipNo: { type: DataTypes.STRING, allowNull: true },
  auditorPan: { type: DataTypes.STRING, allowNull: true },
  auditorContact: { type: DataTypes.STRING, allowNull: true },
  auditorEmail: { type: DataTypes.STRING, allowNull: true },
  appointmentDate: { type: DataTypes.DATEONLY, allowNull: true },
  auditStartDate: { type: DataTypes.DATEONLY, allowNull: true },
  auditEndDate: { type: DataTypes.DATEONLY, allowNull: true },
  reportDate: { type: DataTypes.DATEONLY, allowNull: true },
  filingDate: { type: DataTypes.DATEONLY, allowNull: true },
  submissionStatus: { type: DataTypes.STRING, allowNull: true },
  revisionStatus: { type: DataTypes.STRING, allowNull: true },
  currentVersion: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Version 1' },
  remarks: { type: DataTypes.TEXT, allowNull: true },
  summary: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  createdBy: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true, indexes: [{ fields: ['financialYear'] }, { fields: ['auditStatus'] }] });

module.exports = AuditYear;
