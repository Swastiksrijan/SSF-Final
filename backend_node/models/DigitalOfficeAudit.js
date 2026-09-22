const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DigitalOfficeAudit = sequelize.define('DigitalOfficeAudit', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  action: { type: DataTypes.STRING, allowNull: false },
  module: { type: DataTypes.STRING, allowNull: false },
  recordId: { type: DataTypes.STRING, allowNull: true },
  actor: { type: DataTypes.STRING, allowNull: true },
  details: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} }
}, { timestamps: true, indexes: [{ fields: ['module'] }, { fields: ['recordId'] }, { fields: ['createdAt'] }] });

module.exports = DigitalOfficeAudit;
