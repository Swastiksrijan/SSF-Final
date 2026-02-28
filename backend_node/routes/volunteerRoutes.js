const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Volunteer = require('../models/Volunteer');
const Member = require('../models/Member');

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
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials missing in .env file');
    }

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
        console.error('❌ Nodemailer Error:', error);
        throw error; // Rethrow to handle in the route
    }
};

const getAdminRecipients = () => {
    const recipients = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'info@swastiksrijan.in,info@swastiksrijan.org')
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);

    return recipients.join(',');
};

// --- 3. Routes ---

// @route   POST /api/register
// @desc    Register a new volunteer
router.post('/register', upload.single('id_document'), async (req, res) => {
    console.log('📝 Received registration request:', req.body);
    console.log('📁 Received file:', req.file);
    try {
        const { name, email, phone, volunteer_type, position, id_type, message } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'ID Document is required' });
        }

        const newVolunteer = await Volunteer.create({
            fullName: name,
            email,
            phone,
            volunteerType: volunteer_type,
            position,
            idType: id_type,
            message,
            idDocumentPath: req.file.path,
            status: 'pending',
            isVerified: false
        });

        // Notify Admin via Email (do not block successful submission if email fails)
        const adminEmails = getAdminRecipients();
        let emailSent = true;
        let warning = null;

        try {
            await sendEmail(
                adminEmails,
                `New Volunteer Registration: ${name}`,
                `A new volunteer has applied. Please check the Admin Portal. Name: ${name}, Type: ${volunteer_type}, Position: ${position}`,
                `<h3>New Volunteer Request</h3><p><strong>Name:</strong> ${name}</p><p><strong>Type:</strong> ${volunteer_type}</p><p><strong>Position:</strong> ${position}</p><p>Please login to the Admin Portal to review documents.</p>`
            );
        } catch (emailError) {
            emailSent = false;
            warning = 'Application saved but admin email notification failed';
            console.error('⚠️ Volunteer registration email failed:', emailError.message);
        }

        res.status(201).json({ status: 'success', message: 'Application submitted successfully', data: newVolunteer, emailSent, warning });

    } catch (error) {
        console.error('❌ Registration Error DETAILS:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});


// @route   POST /api/member-signup
// @desc    Register a new member signup request
router.post('/member-signup', async (req, res) => {
    try {
        const { fullName, email, confirmEmail, phone, memberType, message } = req.body;

        const primaryEmail = (email || '').trim().toLowerCase();
        const secondaryEmail = (confirmEmail || '').trim().toLowerCase();

        if (!fullName || !primaryEmail || !secondaryEmail || !phone || !memberType) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        }

        if (primaryEmail !== secondaryEmail) {
            return res.status(400).json({ status: 'error', message: 'Email fields do not match' });
        }

        const newMember = await Member.create({
            fullName,
            email: primaryEmail,
            phone,
            memberType,
            message,
            status: 'pending'
        });

        const adminEmails = getAdminRecipients();
        let emailSent = true;
        let warning = null;

        try {
            await sendEmail(
                adminEmails,
                `New Member Signup: ${fullName}`,
                `A new member signup has been submitted. Name: ${fullName}, Type: ${memberType}, Email: ${primaryEmail}, Phone: ${phone}`,
                `<h3>New Member Signup</h3><p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${primaryEmail}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Type:</strong> ${memberType}</p><p><strong>Message:</strong> ${message || 'N/A'}</p>`
            );
        } catch (emailError) {
            emailSent = false;
            warning = 'Member signup saved but admin email notification failed';
            console.error('⚠️ Member signup email failed:', emailError.message);
        }

        res.status(201).json({ status: 'success', message: 'Member signup submitted successfully', data: newMember, emailSent, warning });
    } catch (error) {
        console.error('❌ Member signup error:', error);
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

        const formatted = volunteers.map(v => {
            // v.idDocumentPath is something like "backend_node/uploads/123.jpg" or "uploads/123.jpg"
            const fileName = path.basename(v.idDocumentPath);
            return {
                id: v.id,
                fullName: v.fullName,
                email: v.email,
                phone: v.phone,
                volunteerType: v.volunteerType,
                position: v.position,
                submittedAt: v.createdAt,
                status: v.status,
                certId: v.certId,
                idDocumentUrl: `/uploads/${fileName}`
            };
        });
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
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const downloadUrl = `${frontendUrl}/verify/${certId}`;

        try {
            await sendEmail(
                volunteer.email,
                'Your Volunteer Application Approved - Swastik Srijan Foundation',
                `Congratulations! You have been approved. Your Certificate ID is ${certId}. Download it here: ${downloadUrl}`,
                `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #003366;">Application Approved!</h2>
                    <p>Welcome to the team, <strong>${volunteer.fullName}</strong>.</p>
                    <p>Your application for <strong>${volunteer.volunteerType}</strong> has been verified by our team.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <p style="margin-bottom: 10px; color: #666;">Official Certificate ID</p>
                        <h1 style="margin: 0; color: #003366; letter-spacing: 2px;">${certId}</h1>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${downloadUrl}" style="background: #FF6600; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            Download Your Certificate
                        </a>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #888;">
                        If the button above doesn't work, copy and paste this link into your browser:<br>
                        <a href="${downloadUrl}">${downloadUrl}</a>
                    </p>
                    
                    <p style="margin-top: 40px; border-top: 1px solid #eee; pt-20px; font-size: 14px; color: #555;">
                        Best regards,<br>
                        <strong>Team Swastik Srijan Foundation</strong>
                    </p>
                </div>
                `
            );
            res.json({ status: 'success', certId, emailSent: true });
        } catch (emailErr) {
            console.error('⚠️ Approval successful but email failed:', emailErr.message);
            res.json({
                status: 'success',
                certId,
                emailSent: false,
                warning: 'Application approved but email failed. Please check your EMAIL_USER and EMAIL_PASS in .env'
            });
        }

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
            position: volunteer.position,
            approvedAt: volunteer.approvedAt,
            certId: volunteer.certId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
