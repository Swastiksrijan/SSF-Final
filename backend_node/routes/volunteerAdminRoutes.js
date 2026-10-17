const express = require('express');
const { sendMail, emailConfigured } = require('../services/mailer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const identity = require('../services/identityService');

const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

const sendEmail = async (to, subject, text, html) => {
    if (!emailConfigured()) throw new Error('Email credentials missing');
    await sendMail({ from: '"Swastik Srijan Admin"', to, subject, text, html });
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
            idValidFrom: v.idValidFrom, idValidTill: v.idValidTill, idActive: v.idActive,
            idDocumentUrl: v.idDocumentPath ? `/uploads/${path.basename(v.idDocumentPath)}` : null,
            profilePhotoPath: v.profilePhotoPath ? `/uploads/${path.basename(v.profilePhotoPath)}` : null
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

        const approvedAt = new Date();
        const volunteerId = await identity.nextVolunteerId(Volunteer, approvedAt);
        const certId = identity.volunteerCertIdFor(volunteerId);
        await volunteer.update({ status: 'approved', isVerified: true, volunteerId, certId, approvedAt, reviewNote: null });
        await identity.reserve({ kind: 'volunteer', value: volunteerId, certValue: certId, recordId: volunteer.id, holderName: volunteer.fullName, holderEmail: volunteer.email });

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
        const allowed = ['fullName', 'email', 'phone', 'volunteerType', 'position', 'idType', 'identityNumber', 'message', 'reviewNote', 'status', 'isVerified', 'volunteerId', 'idValidFrom', 'idValidTill', 'idActive'];
        const updates = {};
        for (const field of allowed) if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) updates[field] = req.body[field];
        if (updates.email) updates.email = String(updates.email).trim().toLowerCase();
        if (updates.identityNumber !== undefined) updates.identityNumber = String(updates.identityNumber || '').trim() || null;
        if (updates.idType !== undefined) updates.idType = String(updates.idType || '').trim() || null;
        if (updates.volunteerType !== undefined) updates.volunteerType = String(updates.volunteerType || '').trim() || 'field';
        if (updates.position !== undefined) updates.position = String(updates.position || '').trim() || null;
        for (const field of ['idValidFrom', 'idValidTill']) {
            if (updates[field] !== undefined) updates[field] = String(updates[field] || '').trim() || null;
        }
        if (updates.idActive !== undefined) updates.idActive = updates.idActive === true || updates.idActive === 'true';
        // Hand-entered volunteer ID (a person may already hold an offline card).
        if (updates.volunteerId !== undefined) {
            const wanted = String(updates.volunteerId || '').trim();
            if (!wanted) updates.volunteerId = null;
            else {
                if (!identity.isVolunteerId(wanted)) return res.status(400).json({ message: 'Volunteer ID must look like SSF-VOL-2510-0001.' });
                if (await identity.isTaken(Volunteer, 'volunteerId', wanted, volunteer.id)) return res.status(400).json({ message: `Volunteer ID ${wanted} is already assigned to another volunteer.` });
                updates.volunteerId = wanted;
                updates.certId = identity.volunteerCertIdFor(wanted);
                await identity.reserve({ kind: 'volunteer', value: wanted, certValue: updates.certId, recordId: volunteer.id, holderName: volunteer.fullName, holderEmail: volunteer.email, note: 'Assigned by admin' });
            }
        }
        if (updates.status && !['pending', 'changes_requested', 'approved', 'rejected'].includes(String(updates.status))) return res.status(400).json({ message: 'Invalid volunteer status' });
        if (updates.status === 'approved' && volunteer.status !== 'approved') {
            const approvedAt = new Date();
            updates.status = 'approved';
            updates.isVerified = true;
            updates.approvedAt = approvedAt;
            if (!updates.volunteerId) {
                const nextId = volunteer.volunteerId || await identity.nextVolunteerId(Volunteer, approvedAt);
                updates.volunteerId = nextId;
                updates.certId = volunteer.certId || identity.volunteerCertIdFor(nextId);
                await identity.reserve({ kind: 'volunteer', value: nextId, certValue: updates.certId, recordId: volunteer.id, holderName: volunteer.fullName, holderEmail: volunteer.email });
            }
            updates.reviewNote = null;
        }
        if (updates.status === 'rejected') { updates.isVerified = false; updates.volunteerId = null; updates.certId = null; updates.approvedAt = null; }
        else if (updates.status === 'changes_requested') updates.isVerified = false;
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
        if (status === 'rejected') { updates.volunteerId = null; updates.certId = null; updates.approvedAt = null; await identity.revokeFor('volunteer', volunteer.id, updates.reviewNote || 'Rejected'); }
        if (req.body?.reviewNote !== undefined) updates.reviewNote = String(req.body.reviewNote || '').trim() || null;
        if (status === 'approved' && !volunteer.volunteerId) {
            const now = new Date();
            const nextId = await identity.nextVolunteerId(Volunteer, now);
            updates.approvedAt = now;
            updates.volunteerId = nextId;
            updates.certId = volunteer.certId || identity.volunteerCertIdFor(nextId);
            updates.reviewNote = null;
            await identity.reserve({ kind: 'volunteer', value: nextId, certValue: updates.certId, recordId: volunteer.id, holderName: volunteer.fullName, holderEmail: volunteer.email });
        }
        await volunteer.update(updates);
        return res.json({ status: 'success', message: `Volunteer status changed to ${status}.`, volunteer: volunteer.toJSON() });
    } catch (error) { console.error('❌ Volunteer status error:', error); return res.status(500).json({ message: 'Unable to change volunteer status.' }); }
});

// Re-issue an approved volunteer's official IDs with a fresh number (an ID
// issued in error, or a replacement card). The previous number stops verifying
// because the record keeps only the latest one.
router.post('/admin/volunteers/:id/reissue', requireAdminAuth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        if (volunteer.status !== 'approved') return res.status(400).json({ message: 'Only an approved volunteer has IDs to re-issue.' });
        const issuedAt = new Date();
        const volunteerId = await identity.nextVolunteerId(Volunteer, issuedAt);
        const certId = identity.volunteerCertIdFor(volunteerId);
        await identity.revokeFor('volunteer', volunteer.id, 'Re-issued');
        await volunteer.update({ volunteerId, certId, approvedAt: issuedAt, reviewNote: null });
        await identity.reserve({ kind: 'volunteer', value: volunteerId, certValue: certId, recordId: volunteer.id, holderName: volunteer.fullName, holderEmail: volunteer.email });
        return res.json({ status: 'success', message: 'Volunteer IDs re-issued.', volunteerId, certId, approvedAt: issuedAt });
    } catch (error) { console.error('❌ Volunteer re-issue error:', error); return res.status(500).json({ message: 'Unable to re-issue volunteer IDs.' }); }
});

// Switch an issued volunteer ID card on or off. A deactivated card stops
// verifying immediately, without deleting the volunteer's record.
router.post('/admin/volunteers/:id/id-status', requireAdminAuth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        const active = req.body?.idActive === undefined ? !volunteer.idActive : Boolean(req.body.idActive);
        await volunteer.update({ idActive: active });
        return res.json({ status: 'success', message: active ? 'ID card activated.' : 'ID card deactivated. It no longer verifies.', idActive: active });
    } catch (error) { console.error('❌ Volunteer ID status error:', error); return res.status(500).json({ message: 'Unable to change the ID card status.' }); }
});

// Revoke an issued volunteer ID: the IDs are cleared and the record is rejected
// so the ID card and certificate stop verifying immediately.
router.post('/admin/volunteers/:id/revoke', requireAdminAuth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        if (!volunteer.volunteerId && !volunteer.certId) return res.status(400).json({ message: 'This volunteer has no issued IDs to revoke.' });
        const reason = String(req.body?.reviewNote || '').trim() || null;
        await identity.revokeFor('volunteer', volunteer.id, reason || 'Revoked by admin');
        await volunteer.update({ status: 'rejected', isVerified: false, volunteerId: null, certId: null, approvedAt: null, reviewNote: reason });
        return res.json({ status: 'success', message: 'Volunteer IDs revoked. The ID card and certificate no longer verify.' });
    } catch (error) { console.error('❌ Volunteer revoke error:', error); return res.status(500).json({ message: 'Unable to revoke volunteer IDs.' }); }
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
