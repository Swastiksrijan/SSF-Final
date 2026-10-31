const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizAttempt = sequelize.define('QuizAttempt', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  accountId: { type: DataTypes.UUID, allowNull: false },
  quizId: { type: DataTypes.STRING, allowNull: false },
  quizTitle: { type: DataTypes.STRING, allowNull: false },
  correct: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.INTEGER, allowNull: false },
  percent: { type: DataTypes.INTEGER, allowNull: false },
  passPercent: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 80 },
  passed: { type: DataTypes.BOOLEAN, allowNull: false },
  answerSelections: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  certificateId: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true, indexes: [{ fields: ['accountId', 'createdAt'] }, { fields: ['quizId', 'createdAt'] }] });

module.exports = QuizAttempt;
