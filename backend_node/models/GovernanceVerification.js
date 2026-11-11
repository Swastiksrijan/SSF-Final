const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('GovernanceVerification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  requestType: { type: DataTypes.ENUM('existing_member', 'office_bearer'), allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  memberId: { type: DataTypes.STRING, allowNull: true },
  designation: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  occupation: { type: DataTypes.STRING, allowNull: true },
  requestedChanges: { type: DataTypes.TEXT, allowNull: true },
  termStart: { type: DataTypes.DATEONLY, allowNull: true },
  termEnd: { type: DataTypes.DATEONLY, allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'verified', 'changes_requested', 'rejected'), defaultValue: 'pending' },
  committeeReference: { type: DataTypes.TEXT, allowNull: true },
  adminNote: { type: DataTypes.TEXT, allowNull: true },
  verifiedAt: { type: DataTypes.DATE, allowNull: true },
  verifiedBy: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });
