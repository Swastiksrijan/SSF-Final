const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DigitalOfficeRecord = sequelize.define('DigitalOfficeRecord', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  recordId: { type: DataTypes.STRING, allowNull: false, unique: true },
  module: { type: DataTypes.STRING, allowNull: false },
  recordType: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
  recordDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  paymentMode: { type: DataTypes.STRING, allowNull: true },
  direction: { type: DataTypes.STRING, allowNull: true },
  account: { type: DataTypes.STRING, allowNull: true },
  linkedRecordId: { type: DataTypes.STRING, allowNull: true },
  personId: { type: DataTypes.STRING, allowNull: true },
  createdBy: { type: DataTypes.STRING, allowNull: true },
  createdByName: { type: DataTypes.STRING, allowNull: true },
  data: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} }
}, { timestamps: true, indexes: [
  { fields: ['module'] }, { fields: ['recordDate'] }, { fields: ['status'] },
  { fields: ['linkedRecordId'] }, { fields: ['personId'] }
] });

module.exports = DigitalOfficeRecord;
