const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendMail, emailConfigured } = require('../services/mailer');
const router = express.Router();
const Donor = require('../models/Donor');

// Donor uploads are optional: a PAN / identity document and a profile photo.
// JSON bodies (the Join SSF hub and the User Portal) still work unchanged —
// multer simply passes a non-multipart request straight through.
const uploadDir = path.join(__dirname, '..', 'uploads', 'donors');
fs.mkdirSync(uploadDir, { recursive: true });
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const storage = multer.diskStorage({ destination: (_req, _file, cb) => cb(null, uploadDir), filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${path.extname(file.originalname).toLowerCase()}`) });
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.fieldname === 'profile_photo') return IMAGE_TYPES.includes(file.mimetype) ? cb(null, true) : cb(new Error('Profile photo must be JPG, PNG or WebP.'));
        if (file.fieldname === 'id_document') return (IMAGE_TYPES.includes(file.mimetype) || file.mimetype === 'application/pdf') ? cb(null, true) : cb(new Error('Document must be JPG, PNG, WebP or PDF.'));
        return cb(new Error('Unexpected upload field.'));
    }
});
const removeFile = (file) => { if (file?.path) fs.unlink(file.path, () => {}); };
const donorFileUrl = (file) => (file ? `/uploads/donors/${file.filename}` : null);

const getDonorNumber = async () => (await Donor.count()) + 1;

const sendAdminEmail = async (donor) => {
    if (!emailConfigured()) return;
    await sendMail({
        from: '"Swastik Srijan Website"',
        to: process.env.EMAIL_USER,
        subject: `New Donor Registration - ${donor.donorId}`,
        text: `New donor registered.\nDonor ID: ${donor.donorId}\nName: ${donor.fullName}\nEmail: ${donor.email}\nPhone: ${donor.phone}\nAmount: ${donor.amount || 'Not specified'}\nPurpose: ${donor.donationPurpose || 'General donation'}`
    });
};

const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
    if (!token || token !== expected) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

router.post('/donor', upload.fields([{ name: 'profile_photo', maxCount: 1 }, { name: 'id_document', maxCount: 1 }]), async (req, res) => {
    const profilePhoto = req.files?.profile_photo?.[0];
    const idDocument = req.files?.id_document?.[0];
    const cleanup = () => { removeFile(profilePhoto); removeFile(idDocument); };
    try {
        const { fullName, email, phone, city, state, country, donationPurpose, amount, pan, address, paymentMode, receiptPreference, notes } = req.body || {};
        const cleanName = String(fullName || '').trim();
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanPhone = String(phone || '').replace(/\D/g, '');
        if (!cleanName || !cleanEmail || !cleanPhone) { cleanup(); return res.status(400).json({ message: 'Name, email and mobile number are required.' }); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { cleanup(); return res.status(400).json({ message: 'Please enter a valid email address.' }); }
        if (cleanPhone.length < 7 || cleanPhone.length > 15) { cleanup(); return res.status(400).json({ message: 'Please enter a valid mobile number.' }); }
        if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(pan).trim().toUpperCase())) { cleanup(); return res.status(400).json({ message: 'Please enter a valid PAN (e.g. AAKAS7123H) or leave it blank.' }); }
        const number = await getDonorNumber();
        const now = new Date();
        const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
        const donorId = `SSF-DON-${monthYear}-${String(number).padStart(4, '0')}`;
        const donor = await Donor.create({ donorId, fullName: cleanName, email: cleanEmail, phone: cleanPhone, city: String(city || '').trim() || null, state: String(state || '').trim() || null, country: String(country || 'India').trim() || 'India', donationPurpose: String(donationPurpose || '').trim() || null, amount: amount ? Number(amount) : null, pan: String(pan || '').trim().toUpperCase() || null, address: String(address || '').trim() || null, paymentMode: String(paymentMode || '').trim() || null, receiptPreference: String(receiptPreference || 'email').trim(), paymentStatus: paymentMode === 'bank_transfer' || paymentMode === 'upi' ? 'offline' : 'pending', notes: String(notes || '').trim() || null, profilePhotoPath: donorFileUrl(profilePhoto), idDocumentPath: donorFileUrl(idDocument) });
        try { await sendAdminEmail(donor); } catch (emailError) { console.error('⚠️ Donor notification email failed:', emailError.message); }
        return res.status(201).json({ status: 'success', message: 'Donor details submitted successfully.', donorId: donor.donorId });
    } catch (error) {
        cleanup();
        console.error('❌ Donor registration error:', error);
        return res.status(500).json({ message: 'Unable to save donor details right now.' });
    }
});

router.get('/admin/donors', requireAdminAuth, async (_req, res) => {
    try {
        const donors = await Donor.findAll({ order: [['createdAt', 'DESC']] });
        return res.json(donors.map((d) => ({ ...d.toJSON(), profilePhotoUrl: d.profilePhotoPath, idDocumentUrl: d.idDocumentPath })));
    } catch (error) {
        console.error('❌ Admin donor list error:', error);
        return res.status(500).json({ message: 'Unable to load donor records.' });
    }
});

// A donation certificate is issued once the payment is confirmed. Its ID is
// derived from the donor's own number so the certificate and the receipt stay
// linked to the same person without a second sequence.
const donorCertificateId = (donor) => (donor.donorId ? String(donor.donorId).replace('SSF-DON-', 'SSF-DONCERT-') : null);

// One admin endpoint covers the whole donor record: status, payment
// confirmation and the editable contact fields. Keeping it single means the
// audit trail records one clear action instead of a spray of partial updates.
router.patch('/admin/donors/:id', requireAdminAuth, async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor record not found.' });
        const allowed = ['fullName', 'email', 'phone', 'city', 'state', 'country', 'donationPurpose', 'amount', 'pan', 'address', 'paymentMode', 'receiptPreference', 'paymentStatus', 'status', 'notes'];
        const updates = {};
        for (const field of allowed) if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) updates[field] = req.body[field];
        if (updates.email !== undefined) {
            updates.email = String(updates.email || '').trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
        }
        if (updates.fullName !== undefined) { updates.fullName = String(updates.fullName || '').trim(); if (updates.fullName.length < 3) return res.status(400).json({ message: 'Please enter the donor name.' }); }
        if (updates.phone !== undefined) { updates.phone = String(updates.phone || '').replace(/\D/g, ''); if (updates.phone.length < 7 || updates.phone.length > 15) return res.status(400).json({ message: 'Please enter a valid mobile number.' }); }
        if (updates.pan !== undefined) { updates.pan = String(updates.pan || '').trim().toUpperCase() || null; if (updates.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(updates.pan)) return res.status(400).json({ message: 'Please enter a valid PAN (e.g. AAKAS7123H) or leave it blank.' }); }
        if (updates.amount !== undefined) updates.amount = updates.amount === null || updates.amount === '' ? null : Number(updates.amount);
        if (updates.status !== undefined && !['new', 'contacted', 'completed'].includes(String(updates.status))) return res.status(400).json({ message: 'Invalid donor status.' });
        if (updates.paymentStatus !== undefined && !['pending', 'paid', 'failed', 'offline'].includes(String(updates.paymentStatus))) return res.status(400).json({ message: 'Invalid payment status.' });
        // Confirming the payment issues the donation certificate ID exactly once.
        // A legacy row may predate donorId, so mint one from the same scheme the
        // public form uses rather than leaving the certificate unidentifiable.
        if (['paid', 'offline'].includes(String(updates.paymentStatus || donor.paymentStatus)) && !donor.certId) {
            if (!donor.donorId) {
                const now = new Date();
                const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
                updates.donorId = `SSF-DON-${monthYear}-${String((await Donor.count()) + 1).padStart(4, '0')}`;
            }
            updates.certId = donorCertificateId({ donorId: updates.donorId || donor.donorId });
        }
        await donor.update(updates);
        return res.json({ status: 'success', message: 'Donor record updated.', donor: donor.toJSON() });
    } catch (error) {
        console.error('❌ Admin donor update error:', error);
        return res.status(500).json({ message: 'Unable to update donor record.' });
    }
});

router.patch('/admin/donors/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor record not found.' });
        const status = String(req.body?.status || '').trim().toLowerCase();
        if (!['new', 'contacted', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid donor status.' });
        await donor.update({ status });
        return res.json({ status: 'success', message: `Donor status changed to ${status}.`, donor: donor.toJSON() });
    } catch (error) {
        console.error('❌ Admin donor status error:', error);
        return res.status(500).json({ message: 'Unable to change donor status.' });
    }
});

const removeStoredFile = (storedPath) => { if (!storedPath) return; const filePath = path.join(__dirname, '..', String(storedPath).replace(/^\/+/, '')); try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (error) { console.warn('Donor upload cleanup failed:', error.message); } };

router.delete('/admin/donors/:id', requireAdminAuth, async (req, res) => {
    try {
        const donor = await Donor.findOne({ where: { id: req.params.id } });
        if (!donor) return res.status(404).json({ message: 'Donor record not found.' });
        removeStoredFile(donor.profilePhotoPath);
        removeStoredFile(donor.idDocumentPath);
        await donor.destroy();
        return res.json({ status: 'success', message: 'Donor record permanently deleted.' });
    } catch (error) {
        console.error('❌ Admin donor delete error:', error);
        return res.status(500).json({ message: 'Unable to delete donor record.' });
    }
});

module.exports = router;
