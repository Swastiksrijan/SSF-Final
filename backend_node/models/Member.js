const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.TEXT, allowNull: true },
    memberType: { type: DataTypes.STRING, defaultValue: 'general' },
    message: { type: DataTypes.TEXT, allowNull: true },
    profilePhotoPath: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
    paymentStatus: { type: DataTypes.ENUM('not_required', 'pending', 'paid', 'failed'), defaultValue: 'pending' },
    paymentId: { type: DataTypes.STRING, allowNull: true, unique: true },
    paymentLinkId: { type: DataTypes.STRING, allowNull: true, unique: true },
    paymentAmount: { type: DataTypes.INTEGER, allowNull: true },
    paymentPaidAt: { type: DataTypes.DATE, allowNull: true },
    memberId: { type: DataTypes.STRING, allowNull: true, unique: true },
    certId: { type: DataTypes.STRING, allowNull: true, unique: true },
    certificateType: { type: DataTypes.STRING, allowNull: true },
    certificateIssuedAt: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

module.exports = Member;
