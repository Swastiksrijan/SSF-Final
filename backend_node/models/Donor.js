const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donor = sequelize.define('Donor', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    donorId: { type: DataTypes.STRING, allowNull: true, unique: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true, defaultValue: 'India' },
    donationPurpose: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    pan: { type: DataTypes.STRING, allowNull: true },
    idDocumentPath: { type: DataTypes.STRING, allowNull: true },
    profilePhotoPath: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    paymentMode: { type: DataTypes.STRING, allowNull: true },
    receiptPreference: { type: DataTypes.STRING, allowNull: true, defaultValue: 'email' },
    paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'offline'), defaultValue: 'pending' },
    certId: { type: DataTypes.STRING, allowNull: true, unique: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('new', 'contacted', 'completed'), defaultValue: 'new' },
    // Donor ID cards carry the same validity window / active switch.
    idValidFrom: { type: DataTypes.DATEONLY, allowNull: true },
    idValidTill: { type: DataTypes.DATEONLY, allowNull: true },
    idActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

module.exports = Donor;
