const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Member = require('../models/Member');

const router = express.Router();
const FRONTEND_URL = (process.env.FRONTEND_URL || process.env.FRONTEND_PUBLIC_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
const emailRecipients = () => String(process.env.EMAIL_USER || '').trim();

const sendResetEmail = async (member, resetToken) => {
    const user = emailRecipients();
    const pass = String(process.env.EMAIL_PASS || '').trim();
    if (!user || !pass) throw new Error('EMAIL_USER/EMAIL_PASS is not configured on the backend');
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
    const link = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
    await transporter.sendMail({
        from: `"Swastik Srijan Foundation" <${user}>`,
        to: member.email,
        subject: 'Reset your SSF account password',
        text: `Hello ${member.fullName},\n\nUse this link to reset your SSF account password:\n${link}\n\nThis link expires in 30 minutes. If you did not request this, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px"><h2 style="color:#002344">Reset your SSF password</h2><p>Hello <strong>${member.fullName}</strong>,</p><p>We received a request to reset your SSF account password.</p><p><a href="${link}" style="display:inline-block;background:#FF6600;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Reset Password</a></p><p style="font-size:13px;color:#666">This link expires in 30 minutes. If you did not request this, you can safely ignore this email.</p></div>`
    });
};

router.post('/forgot-password', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ status: 'error', message: 'Please enter your registered email address.' });
    try {
        const member = await Member.findOne({ where: { email } });
        // Do not disclose whether an email belongs to an account.
        if (!member || !member.passwordHash) return res.json({ status: 'success', message: 'If an account exists for this email, a password reset link has been sent.' });

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        await member.update({ resetTokenHash: tokenHash, resetTokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000) });
        try {
            await sendResetEmail(member, rawToken);
        } catch (emailError) {
            await member.update({ resetTokenHash: null, resetTokenExpiresAt: null });
            console.error('❌ Password reset email failed:', emailError.message);
            return res.status(503).json({ status: 'error', code: 'RESET_EMAIL_NOT_CONFIGURED', message: 'Password reset email service is not configured on the server. Please contact SSF support or try again after the email service is configured.' });
        }
        return res.json({ status: 'success', message: 'If an account exists for this email, a password reset link has been sent.' });
    } catch (error) {
        console.error('❌ Forgot password error:', error);
        return res.status(500).json({ status: 'error', message: 'Unable to process password reset right now. Please try again later.' });
    }
});

router.post('/reset-password', async (req, res) => {
    const token = String(req.body?.token || '').trim();
    const password = String(req.body?.password || '');
    if (!token || !password) return res.status(400).json({ status: 'error', message: 'Reset token and new password are required.' });
    if (password.length < 8) return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters.' });
    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const member = await Member.findOne({ where: { resetTokenHash: tokenHash } });
        if (!member || !member.resetTokenExpiresAt || new Date(member.resetTokenExpiresAt).getTime() < Date.now()) return res.status(400).json({ status: 'error', message: 'This password reset link is invalid or expired. Please request a new one.' });
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.scryptSync(password, `${salt}${process.env.AUTH_PEPPER || ''}`, 64).toString('hex');
        await member.update({ passwordHash: `${salt}:${hash}`, resetTokenHash: null, resetTokenExpiresAt: null });
        return res.json({ status: 'success', message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error('❌ Reset password error:', error);
        return res.status(500).json({ status: 'error', message: 'Unable to reset password right now.' });
    }
});

module.exports = router;
