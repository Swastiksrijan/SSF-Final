const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Permanent, one-row-per-complaint register. Rows are created automatically
// the first time a complaint is marked resolved and are never deleted if the
// live complaint is later reopened.
module.exports = sequelize.define('ResolvedGrievance', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  complaintId: { type: DataTypes.UUID, allowNull: false, unique: true },
  reference: { type: DataTypes.STRING(32), allowNull: false, unique: true },
  fullName: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: true },
  phone: { type: DataTypes.STRING(24), allowNull: true },
  category: { type: DataTypes.STRING(80), allowNull: false },
  subject: { type: DataTypes.STRING(180), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  resolutionNote: { type: DataTypes.TEXT, allowNull: false },
  receivedAt: { type: DataTypes.DATE, allowNull: false },
  resolvedAt: { type: DataTypes.DATE, allowNull: false },
  resolvedBy: { type: DataTypes.STRING(160), allowNull: true },
}, { timestamps: true, indexes: [{ fields: ['resolvedAt'] }] });
