const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const InternshipApplication = require('../models/InternshipApplication');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads', 'internships');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${path.extname(file.originalname).toLowerCase()}`)
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowed.includes(file.mimetype)) return cb(new Error('Resume must be PDF, DOC or DOCX.'));
        cb(null, true);
    }
});

const notifyAdmin = async (application) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const recipients = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'swastiksrijanfoundation@gmail.com').split(',').map(v => v.trim()).filter(Boolean).join(',');
    try {
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        await transporter.sendMail({
            from: `"SSF Internship" <${process.env.EMAIL_USER}>`,
            to: recipients,
            subject: `New Internship Application: ${application.fullName}`,
            text: `New internship application received.\n\nName: ${application.fullName}\nEmail: ${application.email}\nPhone: ${application.phone}\nCollege: ${application.college}\nCourse: ${application.course}\nArea: ${application.internshipType}\nDuration: ${application.duration}\nStart Date: ${application.startDate || 'Not specified'}\nResume: ${application.resumePath}`
        });
    } catch (error) {
        console.error('⚠️ Internship notification failed:', error.message);
    }
};

router.post('/internship', (req, res) => {
    upload.single('resume')(req, res, async (uploadError) => {
        try {
            if (uploadError) return res.status(400).json({ message: uploadError.message || 'Invalid resume upload.' });
            const { fullName, email, phone, college, course, internshipType, duration, startDate, message } = req.body || {};
            const clean = {
                fullName: String(fullName || '').trim(),
                email: String(email || '').trim().toLowerCase(),
                phone: String(phone || '').trim(),
                college: String(college || '').trim(),
                course: String(course || '').trim(),
                internshipType: String(internshipType || '').trim(),
                duration: String(duration || '').trim(),
                startDate: String(startDate || '').trim() || null,
                message: String(message || '').trim() || null
            };
            if (clean.fullName.length < 3) return res.status(400).json({ message: 'Please enter your full name.' });
            if (!/^\S+@\S+\.\S+$/.test(clean.email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
            if (clean.phone.replace(/\D/g, '').length < 7) return res.status(400).json({ message: 'Please enter a valid mobile number.' });
            if (!clean.college || !clean.course || !clean.internshipType || !clean.duration) return res.status(400).json({ message: 'Please complete all required application fields.' });
            if (!req.file) return res.status(400).json({ message: 'Please upload your resume.' });

            const application = await InternshipApplication.create({ ...clean, resumePath: `/uploads/internships/${req.file.filename}`, status: 'pending' });
            await notifyAdmin(application);
            return res.status(201).json({ status: 'success', message: 'Internship application submitted successfully.', data: { id: application.id } });
        } catch (error) {
            console.error('❌ Internship submission error:', error);
            if (req.file?.path) fs.unlink(req.file.path, () => {});
            return res.status(500).json({ message: 'Unable to submit right now. Please try again.' });
        }
    });
});

module.exports = router;
