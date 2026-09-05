const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const Member = require('../models/Member');

const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';

const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

const sendEmail = async (to, subject, text, html) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) throw new Error('Email credentials missing in .env file');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({ from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`, to, subject, text, html });
};

const getMemberNumber = async () => (await Member.count({ where: { status: 'approved' } })) + 1;

// Admin approval -> official Member ID + Membership Certificate ID + email.
router.post('/admin/member-approve/:id', requireAdminAuth, async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        if (member.status === 'approved' && member.memberId && member.certId) {
            return res.status(400).json({ message: 'Member is already approved', memberId: member.memberId, certId: member.certId });
        }

        const number = await getMemberNumber();
        const year = new Date().getFullYear();
        const memberId = `SSF-MEM-${year}-${String(number).padStart(4, '0')}`;
        const certId = `SSF-MCERT-${year}-${String(number).padStart(4, '0')}`;
        const certificateIssuedAt = new Date();

        await member.update({
            status: 'approved', memberId, certId,
            certificateType: 'Membership Certificate', certificateIssuedAt
        });

        const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
        const verificationUrl = `${frontendUrl}/verify/${certId}`;
        let emailSent = true;
        let warning = null;

        try {
            await sendEmail(
                member.email,
                'Membership Approved - Swastik Srijan Foundation',
                `Congratulations! Your SSF membership has been approved. Member ID: ${memberId}. Certificate ID: ${certId}. Verify your certificate here: ${verificationUrl}`,
                `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:1px solid #eee;border-radius:16px"><h2 style="color:#002344">Membership Approved</h2><p>Welcome to Swastik Srijan Foundation, <strong>${member.fullName}</strong>.</p><div style="background:#f7faf8;padding:18px;border-radius:12px;margin:18px 0"><p style="margin:0 0 8px;color:#666">Official Member ID</p><h2 style="margin:0;color:#002344;letter-spacing:1px">${memberId}</h2><p style="margin:16px 0 8px;color:#666">Membership Certificate ID</p><h3 style="margin:0;color:#166534;letter-spacing:1px">${certId}</h3></div><p>Your certificate can be publicly verified using the official verification page.</p><p style="text-align:center;margin-top:24px"><a href="${verificationUrl}" style="background:#002344;color:#fff;padding:13px 22px;text-decoration:none;border-radius:9px;font-weight:700">Verify Certificate</a></p><p style="font-size:12px;color:#888;margin-top:24px">${verificationUrl}</p></div>`
            );
        } catch (emailError) {
            emailSent = false;
            warning = 'Member approved, but the email notification failed.';
            console.error('⚠️ Member approval email failed:', emailError.message);
        }

        return res.json({ status: 'success', memberId, certId, certificateType: 'Membership Certificate', certificateIssuedAt, verificationUrl, emailSent, warning });
    } catch (error) {
        console.error('❌ Member approval error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

// Safe portal refresh fields for the logged-in member dashboard.
router.get('/member-status/:id', async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, {
            attributes: ['id', 'fullName', 'email', 'phone', 'memberType', 'status', 'memberId', 'certId', 'certificateType', 'certificateIssuedAt', 'createdAt']
        });
        if (!member) return res.status(404).json({ message: 'Member not found' });
        return res.json(member);
    } catch (error) {
        console.error('❌ Member status error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

// Membership certificate verification. Non-member IDs continue to the existing volunteer verifier.
router.get('/verify/:certId', async (req, res, next) => {
    const certId = String(req.params.certId || '');
    if (!certId.startsWith('SSF-MCERT-')) return next();

    try {
        const member = await Member.findOne({
            where: { certId, status: 'approved' },
            attributes: ['fullName', 'memberId', 'certId', 'certificateType', 'certificateIssuedAt', 'memberType']
        });
        if (!member) return res.status(404).json({ valid: false, message: 'Certificate not found or no longer valid.' });
        return res.json({
            valid: true,
            certificateType: member.certificateType || 'Membership Certificate',
            fullName: member.fullName,
            memberId: member.memberId,
            certId: member.certId,
            memberType: member.memberType,
            issuedAt: member.certificateIssuedAt
        });
    } catch (error) {
        console.error('❌ Member certificate verification error:', error);
        return res.status(500).json({ valid: false, message: 'Server Error' });
    }
});

module.exports = router;
