const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

const sendEmail = async (to, subject, text, html) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) throw new Error('Email credentials missing');
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({ from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`, to, subject, text, html });
};

const removeUploadedFile = (storedPath) => {
    if (!storedPath) return;
    const filename = path.basename(storedPath);
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (error) { console.warn('Upload cleanup failed:', error.message); }
};

const getMonthYearCode = (date = new Date()) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}${year}`;
};

router.get('/admin/volunteers', requireAdminAuth, async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll({ order: [['createdAt', 'DESC']] });
        res.json(volunteers.map(v => ({
            id: v.id, fullName: v.fullName, email: v.email, phone: v.phone,
            volunteerType: v.volunteerType, position: v.position, idType: v.idType,
            identityNumber: v.identityNumber, message: v.message, reviewNote: v.reviewNote,
            submittedAt: v.createdAt, status: v.status,
            volunteerId: v.volunteerId, certId: v.certId, approvedAt: v.approvedAt,
            idDocumentUrl: v.idDocumentPath ? `/uploads/${path.basename(v.idDocumentPath)}` : null,
            profilePhotoPath: v.profilePhotoPath || null
        })));
    } catch (error) {
        console.error('❌ Volunteer admin list error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/admin/approve/:id', requireAdminAuth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        if (volunteer.status === 'approved' && volunteer.volunteerId && volunteer.certId) return res.status(400).json({ message: 'Volunteer is already approved', volunteerId: volunteer.volunteerId, certId: volunteer.certId });

        const approvedCount = await Volunteer.count({ where: { status: 'approved' } });
        const approvedAt = new Date();
        const number = String(approvedCount + 1).padStart(4, '0');
        const period = getMonthYearCode(approvedAt);
        const volunteerId = `SSF-VOL-${period}-${number}`;
        const certId = `SSF-VCERT-${period}-${number}`;
        await volunteer.update({ status: 'approved', isVerified: true, volunteerId, certId, approvedAt, reviewNote: null });

        const frontendUrl = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
        const verificationUrl = `${frontendUrl}/verify/${certId}`;
        let emailSent = true; let warning = null;
        try {
            await sendEmail(volunteer.email, 'Volunteer Application Approved - Swastik Srijan Foundation', `Congratulations! Your volunteer application has been approved. Volunteer ID: ${volunteerId}. Certificate ID: ${certId}. Verify: ${verificationUrl}`, `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:1px solid #eee;border-radius:16px"><h2>Volunteer Application Approved</h2><p>Welcome, <strong>${volunteer.fullName}</strong>.</p><p><strong>Volunteer ID:</strong> ${volunteerId}</p><p><strong>Certificate ID:</strong> ${certId}</p><p><a href="${verificationUrl}">Verify Certificate</a></p></div>`);
        } catch (emailError) { emailSent = false; warning = 'Volunteer approved, but the email notification failed.'; console.error('⚠️ Volunteer approval email failed:', emailError.message); }
        return res.json({ status: 'success', volunteerId, certId, approvedAt, verificationUrl, emailSent, warning });
    } catch (error) {
        console.error('❌ Volunteer approval error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.patch('/admin/volunteers/:id', requireAdminAuth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        const allowed = ['fullName', 'email', 'phone', 'volunteerType', 'position', 'idType', 'identityNumber', 'message', 'reviewNote', 'status', 'isVerified'];
        const updates = {};
        for (const field of allowed) if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) updates[field] = req.body[field];
        if (updates.email) updates.email = String(updates.email).trim().toLowerCase();
        if (updates.status && !['pending', 'changes_requested', 'approved', 'rejected'].includes(String(updates.status))) return res.status(400).json({ message: 'Invalid volunteer status' });
        if (updates.status === 'approved' && volunteer.status !== 'approved') {
            const approvedCount = await Volunteer.count({ where: { status: 'approved' } });
            const approvedAt = new Date();
            const period = getMonthYearCode(approvedAt);
            updates.status = 'approved';
            updates.isVerified = true;
            updates.approvedAt = approvedAt;
            updates.volunteerId = volunteer.volunteerId || `SSF-VOL-${period}-${String(approvedCount + 1).padStart(4, '0')}`;
            updates.certId = volunteer.certId || `SSF-VCERT-${period}-${String(approvedCount + 1).padStart(4, '0')}`;
            updates.reviewNote = null;
        }
        if (updates.status === 'rejected' || updates.status === 'changes_requested') updates.isVerified = false;
        await volunteer.update(updates);
        return res.json({ status: 'success', message: 'Volunteer record updated.', volunteer: volunteer.toJSON() });
    } catch (error) { console.error('❌ Volunteer update error:', error); return res.status(500).json({ message: 'Unable to update volunteer record.' }); }
});

router.patch('/admin/volunteers/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        const status = String(req.body?.status || '').trim().toLowerCase();
        if (!['pending', 'changes_requested', 'approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid volunteer status' });
        const updates = { status, isVerified: status === 'approved' };
        if (req.body?.reviewNote !== undefined) updates.reviewNote = String(req.body.reviewNote || '').trim() || null;
        if (status === 'approved' && !volunteer.volunteerId) {
            const approvedCount = await Volunteer.count({ where: { status: 'approved' } });
            const now = new Date();
            const period = getMonthYearCode(now);
            updates.approvedAt = now;
            updates.volunteerId = `SSF-VOL-${period}-${String(approvedCount + 1).padStart(4, '0')}`;
            updates.certId = volunteer.certId || `SSF-VCERT-${period}-${String(approvedCount + 1).padStart(4, '0')}`;
            updates.reviewNote = null;
        }
        await volunteer.update(updates);
        return res.json({ status: 'success', message: `Volunteer status changed to ${status}.`, volunteer: volunteer.toJSON() });
    } catch (error) { console.error('❌ Volunteer status error:', error); return res.status(500).json({ message: 'Unable to change volunteer status.' }); }
});

router.delete('/admin/volunteers/:id', requireAdminAuth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer application not found' });
        removeUploadedFile(volunteer.idDocumentPath);
        removeUploadedFile(volunteer.profilePhotoPath);
        await volunteer.destroy();
        return res.json({ status: 'success', message: 'Volunteer application deleted permanently.' });
    } catch (error) {
        console.error('❌ Volunteer delete error:', error);
        return res.status(500).json({ message: 'Unable to delete volunteer application.' });
    }
});

module.exports = router;
