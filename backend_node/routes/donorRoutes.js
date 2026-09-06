const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const Donor = require('../models/Donor');

const getDonorNumber = async () => (await Donor.count()) + 1;

const sendAdminEmail = async (donor) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({
        from: `"Swastik Srijan Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Donor Registration - ${donor.donorId}`,
        text: `New donor registered.\nDonor ID: ${donor.donorId}\nName: ${donor.fullName}\nEmail: ${donor.email}\nPhone: ${donor.phone}\nAmount: ${donor.amount || 'Not specified'}\nPurpose: ${donor.donationPurpose || 'General donation'}`
    });
};

router.post('/donor', async (req, res) => {
    try {
        const { fullName, email, phone, city, state, country, donationPurpose, amount, pan, address, paymentMode, receiptPreference, notes } = req.body || {};
        const cleanName = String(fullName || '').trim();
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanPhone = String(phone || '').replace(/\D/g, '');
        if (!cleanName || !cleanEmail || !cleanPhone) return res.status(400).json({ message: 'Name, email and mobile number are required.' });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ message: 'Please enter a valid email address.' });
        if (cleanPhone.length < 7 || cleanPhone.length > 15) return res.status(400).json({ message: 'Please enter a valid mobile number.' });
        const number = await getDonorNumber();
        const now = new Date();
        const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
        const donorId = `SSF-DON-${monthYear}-${String(number).padStart(4, '0')}`;
        const donor = await Donor.create({ donorId, fullName: cleanName, email: cleanEmail, phone: cleanPhone, city: String(city || '').trim() || null, state: String(state || '').trim() || null, country: String(country || 'India').trim() || 'India', donationPurpose: String(donationPurpose || '').trim() || null, amount: amount ? Number(amount) : null, pan: String(pan || '').trim().toUpperCase() || null, address: String(address || '').trim() || null, paymentMode: String(paymentMode || '').trim() || null, receiptPreference: String(receiptPreference || 'email').trim(), paymentStatus: paymentMode === 'bank_transfer' || paymentMode === 'upi' ? 'offline' : 'pending', notes: String(notes || '').trim() || null });
        try { await sendAdminEmail(donor); } catch (emailError) { console.error('⚠️ Donor notification email failed:', emailError.message); }
        return res.status(201).json({ status: 'success', message: 'Donor details submitted successfully.', donorId: donor.donorId });
    } catch (error) {
        console.error('❌ Donor registration error:', error);
        return res.status(500).json({ message: 'Unable to save donor details right now.' });
    }
});

module.exports = router;
