const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoleDocument = sequelize.define('RoleDocument', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    personId: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    role: {
        type: DataTypes.ENUM('donor', 'intern', 'student', 'volunteer_teacher', 'skill_volunteer', 'ambassador'),
        allowNull: false
    },
    documentType: {
        type: DataTypes.ENUM(
            'identity_card',
            'certificate',
            'joining_letter',
            'completion_certificate',
            'participation_certificate',
            'training_certificate',
            'appreciation_certificate',
            'outstanding_contribution_certificate',
            'partner_recognition'
        ),
        allowNull: false
    },
    documentNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    issueDate: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    validUntil: { type: DataTypes.DATEONLY, allowNull: true },
    status: { type: DataTypes.ENUM('active', 'revoked', 'expired'), allowNull: false, defaultValue: 'active' },
    verificationCode: { type: DataTypes.STRING, allowNull: false, unique: true },
    metadata: { type: DataTypes.JSONB, allowNull: true }
}, { timestamps: true });

module.exports = RoleDocument;
