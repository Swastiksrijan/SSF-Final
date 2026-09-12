const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Interest = require('../models/Interest');

const sendAdminNotification = async (subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const recipients = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'swastiksrijanfoundation@gmail.com').split(',').map((email) => email.trim()).filter(Boolean).join(',');
    try {
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        await transporter.sendMail({ from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`, to: recipients, subject, text });
    } catch (error) { console.error('⚠️ Interest notification failed:', error.message); }
};

const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
    if (!token || token !== expected) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

router.post('/interest', async (req, res) => {
    try {
        const { type, fullName, email, phone, message } = req.body || {};
        if (!['movement', 'partner', 'volunteer', 'member'].includes(type)) return res.status(400).json({ message: 'Invalid interest type' });
        if (!fullName || fullName.trim().length < 3) return res.status(400).json({ message: 'Please enter your full name.' });
        if (!/^\S+@\S+\.\S+$/.test(String(email || '').trim())) return res.status(400).json({ message: 'Please enter a valid email address.' });
        if (String(phone || '').replace(/\D/g, '').length < 7) return res.status(400).json({ message: 'Please enter a valid phone number.' });
        if (['movement', 'partner'].includes(type) && (!message || message.trim().length < 10)) return res.status(400).json({ message: 'Please tell us briefly how you would like to contribute.' });
        const finalMessage = String(message || '').trim() || (type === 'volunteer' ? 'I would like to volunteer with Swastik Srijan Foundation.' : 'I am interested in SSF membership.');
        const interest = await Interest.create({ interestType: type, fullName: fullName.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), message: finalMessage, status: 'new' });
        const labelMap = { partner: 'CSR / Partnership', movement: 'Nation-Building Movement', volunteer: 'Volunteer', member: 'Membership' };
        const label = labelMap[type];
        await sendAdminNotification(`New ${label} Interest: ${fullName}`, `New ${label} request received.\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${finalMessage}`);
        return res.status(201).json({ status: 'success', message: 'Request submitted successfully.', data: { id: interest.id, type: interest.interestType } });
    } catch (error) { console.error('❌ Interest submission error:', error); return res.status(500).json({ message: 'Unable to submit right now. Please try again.' }); }
});

router.get('/admin/interests', requireAdminAuth, async (_req, res) => {
    try { return res.json(await Interest.findAll({ order: [['createdAt', 'DESC']] })); }
    catch (error) { console.error('❌ Admin interests fetch error:', error); return res.status(500).json({ message: 'Unable to load movement/partnership requests.' }); }
});

router.patch('/admin/interests/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const status = String(req.body?.status || '');
        if (!['new', 'contacted', 'closed'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
        const interest = await Interest.findByPk(req.params.id);
        if (!interest) return res.status(404).json({ message: 'Request not found.' });
        await interest.update({ status });
        return res.json({ status: 'success', data: interest });
    } catch (error) { console.error('❌ Interest status update error:', error); return res.status(500).json({ message: 'Unable to update status.' }); }
});

const deleteInterest = async (req, res) => {
    try {
        const interest = await Interest.findByPk(req.params.id);
        if (!interest) return res.status(404).json({ message: 'Request not found.' });
        await interest.destroy();
        return res.json({ status: 'success', message: 'Request deleted permanently.' });
    } catch (error) { console.error('❌ Interest delete error:', error); return res.status(500).json({ message: 'Unable to delete request.' }); }
};

router.delete('/admin/interests/:id', requireAdminAuth, deleteInterest);
router.post('/admin/interests/:id/delete', requireAdminAuth, deleteInterest);

module.exports = router;
