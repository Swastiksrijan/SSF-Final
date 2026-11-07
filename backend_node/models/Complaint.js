const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Complaint', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  reference: { type: DataTypes.STRING(32), allowNull: false, unique: true },
  fullName: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: true },
  phone: { type: DataTypes.STRING(24), allowNull: true },
  category: { type: DataTypes.STRING(80), allowNull: false },
  subject: { type: DataTypes.STRING(180), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('received', 'under_review', 'awaiting_information', 'resolved', 'closed'), allowNull: false, defaultValue: 'received' },
  resolutionNote: { type: DataTypes.TEXT, allowNull: true },
  resolvedAt: { type: DataTypes.DATE, allowNull: true },
}, { timestamps: true, indexes: [{ unique: true, fields: ['reference'] }, { fields: ['status', 'createdAt'] }] });
