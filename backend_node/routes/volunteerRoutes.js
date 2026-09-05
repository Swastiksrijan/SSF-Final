const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Volunteer = require('../models/Volunteer');
const Member = require('../models/Member');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const sendEmail = async (to, subject, text, html) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) throw new Error('Email credentials missing in .env file');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
        from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`, to, subject, text, html
    });
};

const getAdminRecipients = () => (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'swastiksrijanfoundation@gmail.com')
    .split(',').map((email) => email.trim()).filter(Boolean).join(',');

const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

const sendAdminNotification = async ({ subject, text, html }) => {
    try {
        await sendEmail(getAdminRecipients(), subject, text, html);
        return { emailSent: true, warning: null };
    } catch (emailError) {
        console.error('⚠️ Admin notification email failed:', emailError.message);
        return { emailSent: false, warning: 'Data saved but admin email notification failed' };
    }
};

const hashPassword = (password) => crypto.scryptSync(password, process.env.AUTH_PEPPER || '', 64).toString('hex');
const verifyPassword = (password, storedHash) => {
    const derived = crypto.scryptSync(password, process.env.AUTH_PEPPER || '', 64);
    const stored = Buffer.from(storedHash, 'hex');
    return stored.length === derived.length && crypto.timingSafeEqual(derived, stored);
};

// @route POST /api/admin/login
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body || {};
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (!username || !password) return res.status(400).json({ status: 'error', message: 'Username and password are required' });
    if (username !== adminUsername || password !== adminPassword) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    return res.json({ status: 'success', token: getAdminToken() });
});

// @route POST /api/register
router.post('/register', upload.single('id_document'), async (req, res) => {
    try {
        const { name, email, phone, volunteer_type, position, id_type, message } = req.body;
        if (!req.file) return res.status(400).json({ status: 'error', message: 'ID Document is required' });
        const newVolunteer = await Volunteer.create({ fullName: name, email, phone, volunteerType: volunteer_type, position, idType: id_type, message, idDocumentPath: req.file.path, status: 'pending', isVerified: false });
        const notify = await sendAdminNotification({
            subject: `New Volunteer Registration: ${name}`,
            text: `A new volunteer has applied. Name: ${name}, Type: ${volunteer_type}, Position: ${position}, Phone: ${phone}, Email: ${email}`,
            html: `<h3>New Volunteer Request</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Type:</strong> ${volunteer_type}</p><p><strong>Position:</strong> ${position}</p><p><strong>Message:</strong> ${message || 'N/A'}</p>`
        });
        res.status(201).json({ status: 'success', message: 'Application submitted successfully', data: newVolunteer, ...notify, whatsapp: `https://wa.me/919718346691?text=${encodeURIComponent(`Hi, new volunteer signup submitted: ${name}, ${phone}, ${email}`)}` });
    } catch (error) {
        console.error('❌ Registration Error:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});

// @route POST /api/member-signup
router.post('/member-signup', async (req, res) => {
    try {
        const { fullName, email, confirmEmail, phone, password, memberType, message } = req.body || {};
        const primaryEmail = (email || '').trim().toLowerCase();
        const secondaryEmail = (confirmEmail || '').trim().toLowerCase();
        if (!fullName || !primaryEmail || !secondaryEmail || !phone || !password || !memberType) return res.status(400).json({ status: 'error', message: 'All required fields must be provided' });
        if (primaryEmail !== secondaryEmail) return res.status(400).json({ status: 'error', message: 'Email fields do not match' });
        if (password.length < 8) return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters' });

        const existing = await Member.findOne({ where: { email: primaryEmail } });
        if (existing) return res.status(409).json({ status: 'error', message: 'An account with this email already exists. Please log in.' });

        const newMember = await Member.create({ fullName, email: primaryEmail, phone, passwordHash: hashPassword(password), memberType, message, status: 'pending' });
        const notify = await sendAdminNotification({
            subject: `New Website Account Signup: ${fullName}`,
            text: `New website account created. Name: ${fullName}, Email: ${primaryEmail}, Phone: ${phone}`,
            html: `<h3>New Website Account</h3><p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${primaryEmail}</p><p><strong>Phone:</strong> ${phone}</p>`
        });
        res.status(201).json({ status: 'success', message: 'Account created successfully. You are now signed in.', user: { id: newMember.id, fullName: newMember.fullName, email: newMember.email, phone: newMember.phone, memberType: newMember.memberType, status: newMember.status }, ...notify });
    } catch (error) {
        console.error('❌ Member signup error:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});

// @route POST /api/member-login
router.post('/member-login', async (req, res) => {
    try {
        const email = (req.body?.email || '').trim().toLowerCase();
        const password = req.body?.password || '';
        if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password are required' });

        const member = await Member.findOne({ where: { email } });
        if (!member || !member.passwordHash || !verifyPassword(password, member.passwordHash)) return res.status(401).json({ status: 'error', message: 'Invalid email or password' });

        return res.json({
            status: 'success',
            message: 'Login successful',
            user: { id: member.id, fullName: member.fullName, email: member.email, phone: member.phone, memberType: member.memberType, status: member.status }
        });
    } catch (error) {
        console.error('❌ Member login error:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});

// @route GET /api/admin/volunteers
router.get('/admin/volunteers', requireAdminAuth, async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll({ order: [['createdAt', 'DESC']] });
        res.json(volunteers.map(v => ({ id: v.id, fullName: v.fullName, email: v.email, phone: v.phone, volunteerType: v.volunteerType, position: v.position, submittedAt: v.createdAt, status: v.status, certId: v.certId, idDocumentUrl: `/uploads/${path.basename(v.idDocumentPath)}` })));
    } catch (error) { console.error(error); res.status(500).json({ message: 'Server Error' }); }
});

// @route GET /api/admin/members
router.get('/admin/members', requireAdminAuth, async (req, res) => {
    try { res.json(await Member.findAll({ order: [['createdAt', 'DESC']] })); }
    catch (error) { console.error(error); res.status(500).json({ message: 'Server Error' }); }
});

router.post('/admin/approve/:id', requireAdminAuth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        if (volunteer.status === 'approved') return res.status(400).json({ message: 'Already approved' });
        const approvedCount = await Volunteer.count({ where: { status: 'approved' } });
        const certId = `SSF-VOL-2026-${String(approvedCount + 1).padStart(4, '0')}`;
        await volunteer.update({ status: 'approved', isVerified: true, certId, approvedAt: new Date() });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const downloadUrl = `${frontendUrl}/verify/${certId}`;
        try {
            await sendEmail(volunteer.email, 'Your Volunteer Application Approved - Swastik Srijan Foundation', `Congratulations! Your Certificate ID is ${certId}. Download it here: ${downloadUrl}`, `<p>Welcome to the team, <strong>${volunteer.fullName}</strong>.</p><p>Your Certificate ID is <strong>${certId}</strong>.</p><p><a href="${downloadUrl}">View certificate verification</a></p>`);
            res.json({ status: 'success', certId, emailSent: true });
        } catch (emailErr) { console.error('⚠️ Approval email failed:', emailErr.message); res.json({ status: 'success', certId, emailSent: false, warning: 'Approved but email failed.' }); }
    } catch (error) { console.error(error); res.status(500).json({ message: 'Server Error' }); }
});

router.get('/verify/:certId', async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ where: { certId: req.params.certId, status: 'approved' } });
        if (!volunteer) return res.status(404).json({ valid: false });
        res.json({ valid: true, fullName: volunteer.fullName, volunteerType: volunteer.volunteerType, position: volunteer.position, approvedAt: volunteer.approvedAt, certId: volunteer.certId });
    } catch (error) { console.error(error); res.status(500).json({ message: 'Server Error' }); }
});

module.exports = router;
