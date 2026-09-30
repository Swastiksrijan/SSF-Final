const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningCertificate = sequelize.define('LearningCertificate', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  accountId: { type: DataTypes.UUID, allowNull: false },
  learnerName: { type: DataTypes.STRING, allowNull: false },
  learnerEmail: { type: DataTypes.STRING, allowNull: false },
  courseId: { type: DataTypes.STRING, allowNull: false },
  courseTitle: { type: DataTypes.STRING, allowNull: false },
  completionPercent: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  learningHours: { type: DataTypes.INTEGER, allowNull: true },
  moduleAssessments: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  finalAssessment: { type: DataTypes.JSONB, allowNull: true },
  status: { type: DataTypes.ENUM('requested','approved','rejected','issued'), defaultValue: 'requested' },
  certificateId: { type: DataTypes.STRING, unique: true, allowNull: true },
  certificateIssuedAt: { type: DataTypes.DATE, allowNull: true },
  reviewNote: { type: DataTypes.TEXT, allowNull: true }
}, { timestamps: true });

module.exports = LearningCertificate;
