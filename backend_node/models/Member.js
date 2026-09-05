const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
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
    passwordHash: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    memberType: {
        type: DataTypes.STRING,
        defaultValue: 'general'
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    memberId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    certId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    certificateType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    certificateIssuedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Member;
