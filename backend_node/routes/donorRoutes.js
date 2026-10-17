const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendMail, emailConfigured } = require('../services/mailer');
const router = express.Router();
const Donor = require('../models/Donor');
const identity = require('../services/identityService');

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

// Never reuse a donor number: the next one is the highest already issued plus
// one, so a deleted record cannot cause a duplicate ID.
const getDonorNumber = async (date = new Date()) => identity.nextDonorId(Donor, date);

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
        const now = new Date();
        const donorId = await getDonorNumber(now);
        const donor = await Donor.create({ donorId, fullName: cleanName, email: cleanEmail, phone: cleanPhone, city: String(city || '').trim() || null, state: String(state || '').trim() || null, country: String(country || 'India').trim() || 'India', donationPurpose: String(donationPurpose || '').trim() || null, amount: amount ? Number(amount) : null, pan: String(pan || '').trim().toUpperCase() || null, address: String(address || '').trim() || null, paymentMode: String(paymentMode || '').trim() || null, receiptPreference: String(receiptPreference || 'email').trim(), paymentStatus: paymentMode === 'bank_transfer' || paymentMode === 'upi' ? 'offline' : 'pending', notes: String(notes || '').trim() || null, profilePhotoPath: donorFileUrl(profilePhoto), idDocumentPath: donorFileUrl(idDocument) });
        await identity.reserve({ kind: 'donor', value: donorId, recordId: donor.id, holderName: donor.fullName, holderEmail: donor.email });
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
        const allowed = ['fullName', 'email', 'phone', 'city', 'state', 'country', 'donationPurpose', 'amount', 'pan', 'address', 'paymentMode', 'receiptPreference', 'paymentStatus', 'status', 'notes', 'donorId', 'idValidFrom', 'idValidTill', 'idActive'];
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
        for (const field of ['idValidFrom', 'idValidTill']) {
            if (updates[field] !== undefined) updates[field] = String(updates[field] || '').trim() || null;
        }
        if (updates.idActive !== undefined) updates.idActive = updates.idActive === true || updates.idActive === 'true';
        // Hand-entered donor ID, validated and checked for collisions.
        if (updates.donorId !== undefined) {
            const wanted = String(updates.donorId || '').trim();
            if (!wanted) updates.donorId = null;
            else {
                if (!identity.isDonorId(wanted)) return res.status(400).json({ message: 'Donor ID must look like SSF-DON-2510-0001.' });
                if (await identity.isTaken(Donor, 'donorId', wanted, donor.id)) return res.status(400).json({ message: `Donor ID ${wanted} is already assigned to another donor.` });
                updates.donorId = wanted;
                updates.certId = identity.donorCertIdFor(wanted);
                await identity.reserve({ kind: 'donor', value: wanted, certValue: updates.certId, recordId: donor.id, holderName: donor.fullName, holderEmail: donor.email, note: 'Assigned by admin' });
            }
        }
        if (updates.paymentStatus !== undefined && !['pending', 'paid', 'failed', 'offline'].includes(String(updates.paymentStatus))) return res.status(400).json({ message: 'Invalid payment status.' });
        // Confirming the payment issues the donation certificate ID exactly once.
        // A legacy row may predate donorId, so mint one from the same scheme the
        // public form uses rather than leaving the certificate unidentifiable.
        if (['paid', 'offline'].includes(String(updates.paymentStatus || donor.paymentStatus)) && !donor.certId) {
            if (!donor.donorId) {
                updates.donorId = await getDonorNumber();
                await identity.reserve({ kind: 'donor', value: updates.donorId, recordId: donor.id, holderName: donor.fullName, holderEmail: donor.email });
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

// Switch a donor ID card on or off. A deactivated card stops verifying.
router.post('/admin/donors/:id/id-status', requireAdminAuth, async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor record not found.' });
        const active = req.body?.idActive === undefined ? !donor.idActive : Boolean(req.body.idActive);
        await donor.update({ idActive: active });
        return res.json({ status: 'success', message: active ? 'Donor ID card activated.' : 'Donor ID card deactivated. It no longer verifies.', idActive: active });
    } catch (error) {
        console.error('❌ Donor ID status error:', error);
        return res.status(500).json({ message: 'Unable to change the donor ID card status.' });
    }
});

// Every official number the Foundation has issued, newest first. This is the
// admin's ID operations register: it still lists numbers whose record was since
// revoked, which is exactly the point of an append-only ledger.
router.get('/admin/id-issuances', requireAdminAuth, async (req, res) => {
    try {
        const kind = String(req.query.kind || '').trim().toLowerCase() || null;
        if (kind && !['member', 'volunteer', 'donor'].includes(kind)) return res.status(400).json({ message: 'Unknown ID kind.' });
        return res.json(await identity.listIssuances(kind));
    } catch (error) {
        console.error('❌ ID issuance list error:', error);
        return res.status(500).json({ message: 'Unable to load issued IDs.' });
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
