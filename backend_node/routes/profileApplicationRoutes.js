const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Volunteer = require('../models/Volunteer');
const Member = require('../models/Member');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: (_req, _file, cb) => cb(null, uploadDir), filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname).toLowerCase()}`) });
const profilePhotoOnly = (_req, file, cb) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype) ? cb(null, true) : cb(new Error('Profile photo must be JPG, PNG or WebP.'));
const idDocumentOnly = (_req, file, cb) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype) ? cb(null, true) : cb(new Error('ID document must be JPG, PNG or PDF.'));
const uploadPhoto = multer({ storage, fileFilter: profilePhotoOnly, limits: { fileSize: 2 * 1024 * 1024, files: 1 } });
const uploadVolunteerFiles = multer({ storage, fileFilter: (req, file, cb) => file.fieldname === 'profile_photo' ? profilePhotoOnly(req, file, cb) : idDocumentOnly(req, file, cb), limits: { fileSize: 5 * 1024 * 1024, files: 2 } });
const hashPassword = (password) => { const salt = crypto.randomBytes(16).toString('hex'); const hash = crypto.scryptSync(password, `${salt}${process.env.AUTH_PEPPER || ''}`, 64).toString('hex'); return `${salt}:${hash}`; };
const sendAdminNotification = async (subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const recipients = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'swastiksrijanfoundation@gmail.com').split(',').map((email) => email.trim()).filter(Boolean).join(',');
    try { const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } }); await transporter.sendMail({ from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`, to: recipients, subject, text }); }
    catch (error) { console.error('⚠️ Admin notification failed:', error.message); }
};
const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdminAuth = (req, res, next) => { const authHeader = req.headers.authorization || ''; const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''; if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' }); next(); };

router.post('/register', uploadVolunteerFiles.fields([{ name: 'id_document', maxCount: 1 }, { name: 'profile_photo', maxCount: 1 }]), async (req, res) => {
    try {
        const { name, email, phone, volunteer_type, position, id_type, message } = req.body || {};
        const idDocument = req.files?.id_document?.[0]; const profilePhoto = req.files?.profile_photo?.[0];
        if (!name || !email || !phone || !idDocument || !profilePhoto) return res.status(400).json({ status: 'error', message: 'Full name, email, phone, profile photo and ID document are required.' });
        if (profilePhoto.size > 2 * 1024 * 1024) return res.status(400).json({ status: 'error', message: 'Profile photo must be 2MB or smaller.' });
        if (idDocument.size > 5 * 1024 * 1024) return res.status(400).json({ status: 'error', message: 'ID document must be 5MB or smaller.' });
        const newVolunteer = await Volunteer.create({ fullName: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), volunteerType: volunteer_type || 'field', position: position || 'General Volunteer', idType: id_type || 'College ID', message: message || null, idDocumentPath: idDocument.path, profilePhotoPath: `/uploads/${profilePhoto.filename}`, status: 'pending', isVerified: false });
        await sendAdminNotification(`New Volunteer Registration: ${name}`, `New volunteer application received. Name: ${name}, Type: ${volunteer_type || 'field'}, Position: ${position || 'General Volunteer'}, Phone: ${phone}, Email: ${email}`);
        return res.status(201).json({ status: 'success', message: 'Application submitted successfully', data: newVolunteer });
    } catch (error) { console.error('❌ Volunteer registration error:', error); return res.status(500).json({ status: 'error', message: error.message || 'Server Error' }); }
});

router.post('/member-signup', uploadPhoto.single('profile_photo'), async (req, res) => {
    try {
        const { fullName, email, confirmEmail, phone, password, memberType, message } = req.body || {};
        const primaryEmail = (email || '').trim().toLowerCase(); const secondaryEmail = (confirmEmail || '').trim().toLowerCase(); const isWebsiteAccount = memberType === 'website_signup';
        if (!fullName || !primaryEmail || !secondaryEmail || !phone || !memberType) return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        if (primaryEmail !== secondaryEmail) return res.status(400).json({ status: 'error', message: 'Email fields do not match' });
        if (!password || password.length < 8) return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters' });
        const photoPath = req.file ? `/uploads/${req.file.filename}` : null; const existing = await Member.findOne({ where: { email: primaryEmail } });
        if (existing) {
            if (existing.passwordHash && isWebsiteAccount) return res.status(409).json({ status: 'error', message: 'An account with this email already exists. Please log in.' });
            if (existing.passwordHash && !isWebsiteAccount) return res.status(409).json({ status: 'error', message: 'A membership account with this email already exists.' });
            const updates = { passwordHash: hashPassword(password) }; if (photoPath) updates.profilePhotoPath = photoPath; await existing.update(updates);
            return res.status(200).json({ status: 'success', message: 'Your membership record now has a website account.', data: existing, user: { id: existing.id, fullName: existing.fullName, email: existing.email, phone: existing.phone, memberType: existing.memberType, status: existing.status } });
        }
        const newMember = await Member.create({ fullName: fullName.trim(), email: primaryEmail, phone: phone.trim(), passwordHash: hashPassword(password), memberType: isWebsiteAccount ? 'general' : memberType, message: message || null, profilePhotoPath: photoPath, status: 'pending' });
        await sendAdminNotification(`New Member Signup: ${fullName}`, `New member application received. Name: ${fullName}, Type: ${isWebsiteAccount ? 'website account' : memberType}, Email: ${primaryEmail}, Phone: ${phone}`);
        return res.status(201).json({ status: 'success', message: 'Membership application submitted successfully', data: newMember, user: { id: newMember.id, fullName: newMember.fullName, email: newMember.email, phone: newMember.phone, memberType: newMember.memberType, status: newMember.status } });
    } catch (error) { console.error('❌ Member registration error:', error); return res.status(500).json({ status: 'error', message: error.message || 'Server Error' }); }
});

router.get('/admin/members', requireAdminAuth, async (_req, res) => {
    try {
        const members = await Member.findAll({ attributes: { exclude: ['passwordHash'] }, order: [['createdAt', 'DESC']] });
        return res.json(members.map(member => ({ ...member.toJSON(), profilePhotoPath: member.profilePhotoPath || null })));
    } catch (error) { console.error('❌ Member admin list error:', error); return res.status(500).json({ message: 'Server Error' }); }
});

module.exports = router;
