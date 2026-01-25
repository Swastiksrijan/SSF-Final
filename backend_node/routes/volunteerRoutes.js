const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Volunteer = require('../models/Volunteer');

// --- 1. File Upload Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure uploads dir exists
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // secure filename
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- 2. Email Configuration (Reusable) ---
const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        });
        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        console.error('Email Error:', error);
    }
};

// --- 3. Routes ---

// @route   POST /api/register
// @desc    Register a new volunteer
router.post('/register', upload.single('id_document'), async (req, res) => {
    try {
        const { name, email, phone, volunteer_type, id_type, message } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'ID Document is required' });
        }

        const newVolunteer = await Volunteer.create({
            fullName: name,
            email,
            phone,
            volunteerType: volunteer_type,
            idType: id_type,
            message,
            idDocumentPath: req.file.path,
            status: 'pending',
            isVerified: false
        });

        // Notify Admin via Email
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@swastiksrijan.in';
        await sendEmail(
            adminEmail,
            `New Volunteer Registration: ${name}`,
            `A new volunteer has applied. Please check the Admin Portal. Name: ${name}, Type: ${volunteer_type}`,
            `<h3>New Volunteer Request</h3><p><strong>Name:</strong> ${name}</p><p><strong>Type:</strong> ${volunteer_type}</p><p>Please login to the Admin Portal to review documents.</p>`
        );

        res.status(201).json({ status: 'success', message: 'Application submitted successfully', data: newVolunteer });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});

// @route   GET /api/admin/volunteers
// @desc    Get all volunteers (Admin uses this)
router.get('/admin/volunteers', async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll({
            order: [['createdAt', 'DESC']]
        });

        const formatted = volunteers.map(v => ({
            id: v.id,
            fullName: v.fullName,
            email: v.email,
            phone: v.phone,
            volunteerType: v.volunteerType,
            submittedAt: v.createdAt,
            status: v.status,
            certId: v.certId,
            // Ensure path separators are correct for URL
            idDocumentUrl: `http://localhost:${process.env.PORT || 5000}/${v.idDocumentPath.split('uploads')[1] ? 'uploads' + v.idDocumentPath.split('uploads')[1].replace(/\\/g, '/') : v.idDocumentPath}`
        }));
        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/admin/approve/:id
// @desc    Approve volunteer and generate Cert ID
router.post('/admin/approve/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);

        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

        if (volunteer.status === 'approved') {
            return res.status(400).json({ message: 'Already approved' });
        }

        // Generate ID
        // Count currently approved volunteers to generate sequential ID
        const approvedCount = await Volunteer.count({ where: { status: 'approved' } });
        const certId = `SSF-VOL-2026-${String(approvedCount + 1).padStart(4, '0')}`;

        await volunteer.update({
            status: 'approved',
            isVerified: true,
            certId: certId,
            approvedAt: new Date()
        });

        // Send Approval Email
        await sendEmail(
            volunteer.email,
            'Your Volunteer Application Approved - Swastik Srijan Foundation',
            `Congratulations! You have been approved. Your Certificate ID is ${certId}.`,
            `<h3>Application Approved!</h3><p>Welcome to the team, ${volunteer.fullName}.</p><p>Your Official Certificate ID is: <strong>${certId}</strong></p><p>You can verify and download it from our website.</p>`
        );

        res.json({ status: 'success', certId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/verify/:certId
// @desc    Public verification
router.get('/verify/:certId', async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({
            where: {
                certId: req.params.certId,
                status: 'approved'
            }
        });

        if (!volunteer) return res.status(404).json({ valid: false });

        res.json({
            valid: true,
            fullName: volunteer.fullName,
            volunteerType: volunteer.volunteerType,
            approvedAt: volunteer.approvedAt,
            certId: volunteer.certId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
