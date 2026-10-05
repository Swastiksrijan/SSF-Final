const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// One canonical financial transaction = one row here. Every register (donation,
// receipt, cash/bank entry, ledger, voucher) links back to this single row by
// transactionId, so a financial event is counted exactly once in every report.
const FinanceTransaction = sequelize.define('FinanceTransaction', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  transactionId: { type: DataTypes.STRING, allowNull: false, unique: true }, // FIN-2026-000001
  financialYear: { type: DataTypes.STRING, allowNull: false },
  transactionDate: { type: DataTypes.DATEONLY, allowNull: false },
  transactionType: { type: DataTypes.STRING, allowNull: false }, // donation / membership / expense / receipt / payment / other
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
  direction: { type: DataTypes.STRING, allowNull: false }, // in / out
  paymentMode: { type: DataTypes.STRING, allowNull: true },
  cashAccountId: { type: DataTypes.STRING, allowNull: true },
  bankAccountId: { type: DataTypes.STRING, allowNull: true },
  partyId: { type: DataTypes.STRING, allowNull: true },
  donorId: { type: DataTypes.STRING, allowNull: true },
  memberId: { type: DataTypes.STRING, allowNull: true },
  projectId: { type: DataTypes.STRING, allowNull: true },
  fundId: { type: DataTypes.STRING, allowNull: true },
  accountId: { type: DataTypes.STRING, allowNull: true },
  voucherId: { type: DataTypes.STRING, allowNull: true },
  receiptId: { type: DataTypes.STRING, allowNull: true },
  referenceNumber: { type: DataTypes.STRING, allowNull: true }, // UTR / cheque / receipt no.
  sourceModule: { type: DataTypes.STRING, allowNull: true },
  sourceRecordId: { type: DataTypes.STRING, allowNull: true },
  linkedRecords: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' }, // active / archived
  needsReview: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  createdBy: { type: DataTypes.STRING, allowNull: true },
  createdByName: { type: DataTypes.STRING, allowNull: true },
  data: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} }
}, {
  timestamps: true,
  indexes: [
    { fields: ['financialYear'] }, { fields: ['transactionType'] }, { fields: ['status'] },
    { fields: ['referenceNumber'] }, { fields: ['sourceModule'] }, { fields: ['sourceRecordId'] }
  ]
});

module.exports = FinanceTransaction;
