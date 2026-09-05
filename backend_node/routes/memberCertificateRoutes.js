const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({ from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`, to, subject, text, html });
};

const getMemberNumber = async () => (await Member.count({ where: { status: 'approved' } })) + 1;
const membershipAmounts = { general: 1200, active: 2500, life: 8000 };

// Create a unique Razorpay Payment Link for this member application.
router.post('/member-payment-link', async (req, res) => {
    try {
        const { memberId } = req.body || {};
        const member = await Member.findByPk(memberId);
        if (!member) return res.status(404).json({ message: 'Member application not found' });
        if (member.paymentStatus === 'paid') return res.json({ status: 'paid', paymentStatus: 'paid', paymentId: member.paymentId });
        if (member.memberType === 'advisory') return res.status(400).json({ message: 'Advisory membership is by invitation and does not use online payment.' });

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            return res.status(503).json({
                message: 'Razorpay membership payment is not configured on the server yet.',
                fallbackUrl: 'https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view'
            });
        }

        if (member.paymentLinkId) return res.status(200).json({ status: 'success', paymentUrl: null, paymentLinkId: member.paymentLinkId, paymentStatus: member.paymentStatus });

        const amountRupees = membershipAmounts[member.memberType] || membershipAmounts.general;
        const frontendUrl = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
        const referenceId = `SSF-MEM-${member.id}`.slice(0, 40);
        const payload = {
            amount: amountRupees * 100,
            currency: 'INR',
            accept_partial: false,
            reference_id: referenceId,
            description: `SSF Membership - ${member.memberType}`,
            customer: { name: member.fullName, email: member.email, contact: member.phone.replace(/\D/g, '').slice(-15) },
            notify: { email: true, sms: false },
            reminder_enable: true,
            notes: { member_id: member.id, member_type: member.memberType },
            callback_url: `${frontendUrl}/MemberDashboard`,
            callback_method: 'get'
        };

        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/payment_links', {
            method: 'POST',
            headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) {
            console.error('Razorpay payment-link error:', result);
            return res.status(502).json({ message: result.error?.description || 'Unable to create Razorpay payment link' });
        }

        await member.update({ paymentStatus: 'pending', paymentLinkId: result.id, paymentAmount: amountRupees * 100 });
        return res.json({ status: 'success', paymentUrl: result.short_url, paymentLinkId: result.id, paymentStatus: 'pending', amount: amountRupees });
    } catch (error) {
        console.error('❌ Membership payment-link error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

// Razorpay Payment Link callback. Signature is verified server-side before marking paid.
router.get('/member-payment-callback', async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature } = req.query;
        if (!razorpay_payment_id || !razorpay_payment_link_id || !razorpay_payment_link_reference_id || !razorpay_signature) {
            return res.redirect('https://swastiksrijan.in/MemberDashboard?payment=failed');
        }
        const payload = `${razorpay_payment_link_id}|${razorpay_payment_link_reference_id}|${razorpay_payment_link_status}|${razorpay_payment_id}`;
        const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(payload).digest('hex');
        if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(razorpay_signature)))) {
            return res.redirect('https://swastiksrijan.in/MemberDashboard?payment=invalid');
        }

        const member = await Member.findOne({ where: { paymentLinkId: razorpay_payment_link_id } });
        if (member && razorpay_payment_link_status === 'paid') {
            await member.update({ paymentStatus: 'paid', paymentId: razorpay_payment_id, paymentPaidAt: new Date() });
        }
        const frontendUrl = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
        return res.redirect(`${frontendUrl}/MemberDashboard?payment=${member && razorpay_payment_link_status === 'paid' ? 'success' : 'pending'}`);
    } catch (error) {
        console.error('❌ Membership payment callback error:', error);
        return res.redirect('https://swastiksrijan.in/MemberDashboard?payment=error');
    }
});

// Admin approval -> official Member ID + Membership Certificate ID + email.
router.post('/admin/member-approve/:id', requireAdminAuth, async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        if (member.status === 'approved' && member.memberId && member.certId) return res.status(400).json({ message: 'Member is already approved', memberId: member.memberId, certId: member.certId });
        if (member.memberType !== 'advisory' && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && member.paymentStatus !== 'paid') {
            return res.status(400).json({ message: 'Membership payment is not confirmed yet. Ask the applicant to complete payment before approval.', paymentStatus: member.paymentStatus });
        }

        const number = await getMemberNumber();
        const year = new Date().getFullYear();
        const memberId = `SSF-MEM-${year}-${String(number).padStart(4, '0')}`;
        const certId = `SSF-MCERT-${year}-${String(number).padStart(4, '0')}`;
        const certificateIssuedAt = new Date();
        await member.update({ status: 'approved', memberId, certId, certificateType: 'Membership Certificate', certificateIssuedAt });

        const frontendUrl = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
        const verificationUrl = `${frontendUrl}/verify/${certId}`;
        let emailSent = true; let warning = null;
        try {
            await sendEmail(member.email, 'Membership Approved - Swastik Srijan Foundation',
                `Congratulations! Your SSF membership has been approved. Member ID: ${memberId}. Certificate ID: ${certId}. Verify: ${verificationUrl}`,
                `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:1px solid #eee;border-radius:16px"><h2>Membership Approved</h2><p>Welcome, <strong>${member.fullName}</strong>.</p><p><strong>Member ID:</strong> ${memberId}</p><p><strong>Certificate ID:</strong> ${certId}</p><p><a href="${verificationUrl}">Verify Certificate</a></p></div>`);
        } catch (emailError) { emailSent = false; warning = 'Member approved, but the email notification failed.'; console.error('⚠️ Member approval email failed:', emailError.message); }
        return res.json({ status: 'success', memberId, certId, certificateType: 'Membership Certificate', certificateIssuedAt, verificationUrl, emailSent, warning });
    } catch (error) {
        console.error('❌ Member approval error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/member-status/:id', async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, { attributes: ['id','fullName','email','phone','memberType','status','paymentStatus','paymentId','paymentLinkId','paymentAmount','paymentPaidAt','memberId','certId','certificateType','certificateIssuedAt','createdAt'] });
        if (!member) return res.status(404).json({ message: 'Member not found' });
        return res.json(member);
    } catch (error) { console.error('❌ Member status error:', error); return res.status(500).json({ message: 'Server Error' }); }
});

router.get('/verify/:certId', async (req, res, next) => {
    const certId = String(req.params.certId || '');
    if (!certId.startsWith('SSF-MCERT-')) return next();
    try {
        const member = await Member.findOne({ where: { certId, status: 'approved' }, attributes: ['fullName','memberId','certId','certificateType','certificateIssuedAt','memberType'] });
        if (!member) return res.status(404).json({ valid: false, message: 'Certificate not found or no longer valid.' });
        return res.json({ valid: true, certificateType: member.certificateType || 'Membership Certificate', fullName: member.fullName, memberId: member.memberId, certId: member.certId, memberType: member.memberType, issuedAt: member.certificateIssuedAt });
    } catch (error) { console.error('❌ Member certificate verification error:', error); return res.status(500).json({ valid: false, message: 'Server Error' }); }
});

module.exports = router;
