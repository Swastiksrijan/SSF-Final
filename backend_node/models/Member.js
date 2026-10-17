const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.TEXT, allowNull: true },
    resetTokenHash: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiresAt: { type: DataTypes.DATE, allowNull: true },
    memberType: { type: DataTypes.STRING, defaultValue: 'general' },
    designation: { type: DataTypes.STRING, allowNull: true },
    guardianName: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    pinCode: { type: DataTypes.STRING, allowNull: true },
    joiningDate: { type: DataTypes.DATEONLY, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    profilePhotoPath: { type: DataTypes.STRING, allowNull: true },
    profilePhotoData: { type: DataTypes.TEXT, allowNull: true },
    idProofType: { type: DataTypes.STRING, allowNull: true },
    identityNumber: { type: DataTypes.STRING, allowNull: true },
    idDocumentPath: { type: DataTypes.STRING, allowNull: true },
    reviewNote: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'changes_requested', 'approved', 'rejected'), defaultValue: 'pending' },
    paymentStatus: { type: DataTypes.ENUM('not_required', 'pending', 'paid', 'failed'), defaultValue: 'pending' },
    paymentId: { type: DataTypes.STRING, allowNull: true, unique: true },
    paymentLinkId: { type: DataTypes.STRING, allowNull: true, unique: true },
    paymentAmount: { type: DataTypes.INTEGER, allowNull: true },
    paymentMode: { type: DataTypes.STRING, allowNull: true },
    paymentReference: { type: DataTypes.STRING, allowNull: true },
    paymentPaidAt: { type: DataTypes.DATE, allowNull: true },
    memberId: { type: DataTypes.STRING, allowNull: true, unique: true },
    certId: { type: DataTypes.STRING, allowNull: true, unique: true },
    certificateType: { type: DataTypes.STRING, allowNull: true },
    certificateIssuedAt: { type: DataTypes.DATE, allowNull: true },
    // An issued ID card carries a validity window, and an admin can switch it
    // off without deleting the person's record.
    idValidFrom: { type: DataTypes.DATEONLY, allowNull: true },
    idValidTill: { type: DataTypes.DATEONLY, allowNull: true },
    idActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

// A website signup creates only an SSF account. It is not a membership application.
Member.addHook('beforeCreate', 'activateWebsiteAccount', (member) => {
    if (String(member.memberType || '').toLowerCase() === 'website_signup') {
        member.status = 'approved';
        member.paymentStatus = 'not_required';
        member.memberId = null;
        member.certId = null;
        member.certificateType = null;
        member.certificateIssuedAt = null;
    }
});

module.exports = Member;
