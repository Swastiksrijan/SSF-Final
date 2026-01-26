const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Volunteer = sequelize.define('Volunteer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    volunteerType: {
        type: DataTypes.STRING,
        defaultValue: 'field'
    },
    position: {
        type: DataTypes.STRING,
        allowNull: true
    },
    idType: {
        type: DataTypes.STRING,
        defaultValue: 'College ID'
    },
    message: {
        type: DataTypes.TEXT
    },
    idDocumentPath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    // For Certificate
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    certId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    approvedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = Volunteer;
