const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

const sendAdminNotification = async (subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const recipients = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'swastiksrijanfoundation@gmail.com')
        .split(',').map((email) => email.trim()).filter(Boolean).join(',');
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await transporter.sendMail({
            from: `"Swastik Srijan Contact" <${process.env.EMAIL_USER}>`,
            to: recipients,
            replyTo: undefined,
            subject,
            text
        });
    } catch (error) {
        console.error('⚠️ Contact notification failed:', error.message);
    }
};

router.post('/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body || {};
        const cleanFirstName = String(firstName || '').trim();
        const cleanLastName = String(lastName || '').trim();
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanPhone = String(phone || '').trim();
        const cleanMessage = String(message || '').trim();

        if (cleanFirstName.length < 2) return res.status(400).json({ message: 'Please enter your first name.' });
        if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return res.status(400).json({ message: 'Please enter a valid email address.' });
        if (cleanPhone && cleanPhone.replace(/\D/g, '').length < 7) return res.status(400).json({ message: 'Please enter a valid phone number.' });
        if (cleanMessage.length < 10) return res.status(400).json({ message: 'Please enter a message of at least 10 characters.' });

        const contact = await ContactMessage.create({
            firstName: cleanFirstName,
            lastName: cleanLastName || null,
            email: cleanEmail,
            phone: cleanPhone || null,
            message: cleanMessage,
            status: 'new'
        });

        await sendAdminNotification(
            `New Contact Inquiry: ${cleanFirstName}${cleanLastName ? ` ${cleanLastName}` : ''}`,
            `New contact inquiry received.\n\nName: ${cleanFirstName}${cleanLastName ? ` ${cleanLastName}` : ''}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone || 'Not provided'}\nMessage: ${cleanMessage}`
        );

        return res.status(201).json({
            status: 'success',
            message: 'Message successfully submitted!',
            data: { id: contact.id }
        });
    } catch (error) {
        console.error('❌ Contact submission error:', error);
        return res.status(500).json({ message: 'Unable to submit right now. Please try again.' });
    }
});

module.exports = router;
