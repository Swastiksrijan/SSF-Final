const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InternshipApplication = sequelize.define('InternshipApplication', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    college: { type: DataTypes.STRING, allowNull: false },
    course: { type: DataTypes.STRING, allowNull: false },
    internshipType: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: true },
    resumePath: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'reviewed', 'selected', 'completed', 'rejected'), defaultValue: 'pending' },
    internId: { type: DataTypes.STRING, allowNull: true, unique: true },
    joiningLetterId: { type: DataTypes.STRING, allowNull: true, unique: true },
    completionCertId: { type: DataTypes.STRING, allowNull: true, unique: true },
    selectedAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

module.exports = InternshipApplication;
