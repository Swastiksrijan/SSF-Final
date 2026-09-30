const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Interest = require('../models/Interest');
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');

const sendAdminNotification = async (subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const recipients = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'swastiksrijanfoundation@gmail.com').split(',').map((email) => email.trim()).filter(Boolean).join(',');
    try {
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        await transporter.sendMail({ from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`, to: recipients, subject, text });
    } catch (error) { console.error('⚠️ Interest notification failed:', error.message); }
};

const sendApplicantEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !to) return;
    try {
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        await transporter.sendMail({ from: `"Swastik Srijan Foundation" <${process.env.EMAIL_USER}>`, to, subject, text });
    } catch (error) { console.error('⚠️ Applicant notification failed:', error.message); }
};

const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
    if (!token || token !== expected) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

const monthYearCode = (date = new Date()) => `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
const normalizeMemberType = (category) => {
    const value = String(category || '').toLowerCase();
    if (value.includes('life')) return 'life';
    if (value.includes('active')) return 'active';
    if (value.includes('advisory')) return 'advisory';
    return 'general';
};

const ensureRoleRecord = async (interest) => {
    const email = String(interest.email || '').trim().toLowerCase();
    if (interest.interestType === 'volunteer') {
        let volunteer = await Volunteer.findOne({ where: { email }, order: [['createdAt', 'DESC']] });
        if (!volunteer) {
            volunteer = await Volunteer.create({
                fullName: interest.fullName,
                email,
                phone: interest.phone,
                volunteerType: interest.category || 'General Volunteer',
                position: interest.category || 'General Volunteer',
                message: interest.message,
                idDocumentPath: null,
                status: 'pending'
            });
        }
        if (volunteer.status !== 'approved') {
            const approvedCount = await Volunteer.count({ where: { status: 'approved' } });
            const now = new Date();
            const number = String(approvedCount + 1).padStart(4, '0');
            const period = monthYearCode(now);
            await volunteer.update({
                status: 'approved',
                isVerified: true,
                volunteerId: volunteer.volunteerId || `SSF-VOL-${period}-${number}`,
                certId: volunteer.certId || `SSF-VCERT-${period}-${number}`,
                approvedAt: now,
                reviewNote: null
            });
        }
        return { kind: 'volunteer', record: volunteer };
    }

    if (interest.interestType === 'member') {
        const memberType = normalizeMemberType(interest.category);
        let member = await Member.findOne({ where: { email }, order: [['createdAt', 'ASC']] });
        if (!member) {
            member = await Member.create({
                fullName: interest.fullName,
                email,
                phone: interest.phone,
                memberType,
                message: interest.message,
                status: 'pending',
                paymentStatus: memberType === 'advisory' ? 'not_required' : 'pending'
            });
        } else {
            await member.update({ fullName: interest.fullName, phone: interest.phone, memberType, message: interest.message, status: 'pending', paymentStatus: memberType === 'advisory' ? 'not_required' : (member.paymentStatus || 'pending') });
        }

        const number = await Member.count({ where: { status: 'approved' } }) + 1;
        const now = new Date();
        const period = monthYearCode(now);
        await member.update({
            status: 'approved',
            memberId: member.memberId || `SSF-MEM-${period}-${String(number).padStart(4, '0')}`,
            certId: member.certId || `SSF-MCERT-${period}-${String(number).padStart(4, '0')}`,
            certificateType: 'Membership Certificate',
            certificateIssuedAt: now
        });
        return { kind: 'member', record: member };
    }

    return null;
};

router.post('/interest', async (req, res) => {
    try {
        const { type, fullName, email, phone, message, category } = req.body || {};
        if (!['movement', 'partner', 'volunteer', 'member'].includes(type)) return res.status(400).json({ message: 'Invalid interest type' });
        if (!fullName || fullName.trim().length < 3) return res.status(400).json({ message: 'Please enter your full name.' });
        if (!/^\S+@\S+\.\S+$/.test(String(email || '').trim())) return res.status(400).json({ message: 'Please enter a valid email address.' });
        if (String(phone || '').replace(/\D/g, '').length < 7) return res.status(400).json({ message: 'Please enter a valid phone number.' });
        if (['movement', 'partner'].includes(type) && (!message || message.trim().length < 10)) return res.status(400).json({ message: 'Please tell us briefly how you would like to contribute.' });
        const finalMessage = String(message || '').trim() || (type === 'volunteer' ? 'I would like to volunteer with Swastik Srijan Foundation.' : type === 'member' ? 'I am interested in SSF membership.' : '');
        const interest = await Interest.create({ interestType: type, fullName: fullName.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), category: String(category || '').trim() || null, message: finalMessage, status: 'new' });
        const labelMap = { partner: 'CSR / Partnership', movement: 'Nation-Building Movement', volunteer: 'Volunteer', member: 'Membership' };
        const label = labelMap[type];
        await sendAdminNotification(`New ${label} Interest: ${fullName}`, `New ${label} request received.\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nCategory: ${category || 'Not specified'}\nMessage: ${finalMessage}`);
        return res.status(201).json({ status: 'success', message: 'Request submitted successfully.', data: { id: interest.id, type: interest.interestType, category: interest.category } });
    } catch (error) { console.error('❌ Interest submission error:', error); return res.status(500).json({ message: 'Unable to submit right now. Please try again.' }); }
});

router.get('/admin/interests', requireAdminAuth, async (_req, res) => {
    try { return res.json(await Interest.findAll({ order: [['createdAt', 'DESC']] })); }
    catch (error) { console.error('❌ Admin interests fetch error:', error); return res.status(500).json({ message: 'Unable to load interest requests.' }); }
});

router.patch('/admin/interests/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const status = String(req.body?.status || '').trim().toLowerCase();
        if (!['new', 'contacted', 'approved', 'rejected', 'closed'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
        const interest = await Interest.findByPk(req.params.id);
        if (!interest) return res.status(404).json({ message: 'Request not found.' });

        if (status === 'approved' && ['volunteer', 'member'].includes(interest.interestType)) {
            const result = await ensureRoleRecord(interest);
            await interest.update({ status: 'approved' });
            const record = result?.record;
            const ids = result?.kind === 'volunteer'
                ? `Volunteer ID: ${record.volunteerId}\nCertificate ID: ${record.certId}`
                : `Member ID: ${record.memberId}\nCertificate ID: ${record.certId}`;
            await sendApplicantEmail(interest.email, `${result.kind === 'volunteer' ? 'Volunteer' : 'Membership'} Application Approved - Swastik Srijan Foundation`, `Congratulations ${interest.fullName}! Your application has been approved by Swastik Srijan Foundation.\n\n${ids}\n\nYou can view your official documents from your SSF user dashboard after signing in with this email address.`);
            return res.json({ status: 'success', data: interest, issued: ids });
        }

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
    } catch (error) { console.error('❌ Interest deletion error:', error); return res.status(500).json({ message: 'Unable to delete request.' }); }
};

router.delete('/admin/interests/:id', requireAdminAuth, deleteInterest);
router.post('/admin/interests/:id/delete', requireAdminAuth, deleteInterest);

module.exports = router;
