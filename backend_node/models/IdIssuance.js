// Every official identity number the Foundation has ever issued.
//
// The live Member / Volunteer / Donor rows only hold the number a person has
// *today*. This ledger is append-only: once a number has been issued it stays
// here forever, so a number freed by a revocation can never be handed to
// somebody else — the old printed card would otherwise start verifying as a
// different person.
//
// It also gives the admin a single place to see every ID operation: what was
// issued, to whom, and what has been revoked.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IdIssuance = sequelize.define('IdIssuance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  kind: { type: DataTypes.STRING, allowNull: false },   // member | volunteer | donor
  value: { type: DataTypes.STRING, allowNull: false },  // SSF-MBR-00019
  certValue: { type: DataTypes.STRING, allowNull: true },
  recordId: { type: DataTypes.STRING, allowNull: true },
  holderName: { type: DataTypes.STRING, allowNull: true },
  holderEmail: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'issued' }, // issued | revoked
  issuedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  revokedAt: { type: DataTypes.DATE, allowNull: true },
  note: { type: DataTypes.TEXT, allowNull: true },
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['kind', 'value'] }],
});

module.exports = IdIssuance;
