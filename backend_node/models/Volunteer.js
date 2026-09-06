const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Volunteer = sequelize.define('Volunteer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    volunteerType: { type: DataTypes.STRING, defaultValue: 'field' },
    position: { type: DataTypes.STRING, allowNull: true },
    idType: { type: DataTypes.STRING, defaultValue: 'College ID' },
    identityNumber: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT },
    reviewNote: { type: DataTypes.TEXT, allowNull: true },
    idDocumentPath: { type: DataTypes.STRING, allowNull: false },
    profilePhotoPath: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'changes_requested', 'approved', 'rejected'), defaultValue: 'pending' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    volunteerId: { type: DataTypes.STRING, unique: true, allowNull: true },
    certId: { type: DataTypes.STRING, unique: true, allowNull: true },
    approvedAt: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

module.exports = Volunteer;
