const express = require('express');
const crypto = require('crypto');
const { Op } = require('sequelize');
const Complaint = require('../models/Complaint');
const { sendMail, emailConfigured } = require('../services/mailer');
const { databaseUnavailableResponse } = require('../services/dbHealth');

const router = express.Router();
const attempts = new Map();
const categories = new Set(['service', 'staff', 'volunteer', 'donation', 'website', 'programme', 'safety', 'other']);
const statuses = new Set(['received', 'under_review', 'awaiting_information', 'resolved', 'closed']);
const clean = (v, max) => String(v || '').trim().slice(0, max);
const adminOnly = (req, res, next) => {
  // Use the same office bearer-token rule as /api/ims. Anyone with a valid
  // IMS login session can therefore manage grievances without a second token.
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
  if (!token || token !== expected) {
    return res.status(401).json({ message: 'Please sign in to SSF-IMS to access the grievance register.' });
  }
  next();
};
const notifySubmitter = async (complaint) => {
  if (!complaint.email) return { sent: false, reason: 'no_email' };
  if (!emailConfigured()) return { sent: false, reason: 'email_not_configured' };
  try {
    await sendMail({
      from: '"SSF Grievance Desk"',
      to: complaint.email,
      subject: `Update on your SSF grievance — ${complaint.reference}`,
      text: `Dear ${complaint.fullName},

Your complaint submitted to Swastik Srijan Foundation Samiti has been updated.

Reference: ${complaint.reference}
Subject: ${complaint.subject}
Current status: ${complaint.status.replace(/_/g, ' ')}
${complaint.resolutionNote ? `Resolution / response: ${complaint.resolutionNote}` : ''}

You can verify the latest status using your reference number and registered email on the Complaint & Grievance Redressal page:
https://swastiksrijan.in/ComplaintGrievance

Regards,
SSF Grievance Desk
Swastik Srijan Foundation Samiti`
    });
    return { sent: true };
  } catch (e) {
    console.error('Grievance submitter notification failed:', e.message);
    return { sent: false, reason: 'send_failed' };
  }
};

const notify = async (complaint) => {
  if (!emailConfigured()) return;
  const to = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'swastiksrijanfoundation@gmail.com').split(',').map(v => v.trim()).filter(Boolean);
  try {
    await sendMail({ from: '"SSF Grievance Desk"', to, subject: `New grievance received — ${complaint.reference}`,
      text: `A grievance has been submitted to Swastik Srijan Foundation Samiti.\n\nReference: ${complaint.reference}\nName: ${complaint.fullName}\nEmail: ${complaint.email || 'Not provided'}\nPhone: ${complaint.phone || 'Not provided'}\nCategory: ${complaint.category}\nSubject: ${complaint.subject}\n\nDescription:\n${complaint.description}\n\nPlease review it in the authorised grievance register.` });
  } catch (e) { console.error('Grievance notification failed:', e.message); }
};

router.post('/complaints', async (req, res) => {
  try {
    const ip = String(req.headers['x-forwarded-for'] || req.ip || 'unknown').split(',')[0].trim();
    const now = Date.now();
    const recent = (attempts.get(ip) || []).filter(t => now - t < 15 * 60 * 1000);
    if (recent.length >= 5) return res.status(429).json({ message: 'Too many submissions. Please try again later.' });
    if (clean(req.body?.website, 200)) return res.status(400).json({ message: 'Unable to accept this submission.' });
    const fullName = clean(req.body?.fullName, 120);
    const email = clean(req.body?.email, 160).toLowerCase();
    const phone = clean(req.body?.phone, 24).replace(/\D/g, '');
    const category = clean(req.body?.category, 80);
    const subject = clean(req.body?.subject, 180);
    const description = clean(req.body?.description, 10000);
    if (fullName.length < 2) return res.status(400).json({ message: 'Please enter your full name.' });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (phone && phone.replace(/\D/g, '').length < 7) return res.status(400).json({ message: 'Please enter a valid phone number.' });
    if (!email && !phone) return res.status(400).json({ message: 'Please provide an email address or mobile number for follow-up.' });
    if (!categories.has(category)) return res.status(400).json({ message: 'Please select a valid complaint category.' });
    if (subject.length < 4 || description.length < 20) return res.status(400).json({ message: 'Please provide a subject and at least 20 characters of detail.' });
    attempts.set(ip, [...recent, now]);
    const reference = `SSF-GRV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const complaint = await Complaint.create({ reference, fullName, email: email || null, phone: phone || null, category, subject, description, status: 'received' });
    await notify(complaint);
    return res.status(201).json({ message: 'Your complaint has been received.', reference, status: complaint.status, receivedAt: complaint.createdAt });
  } catch (error) {
    console.error('Complaint submission error:', error);
    if (databaseUnavailableResponse(res, error)) return;
    return res.status(500).json({ message: 'Unable to submit your complaint right now. Please try again later.' });
  }
});

router.post('/complaints/track', async (req, res) => {
  try {
    const reference = clean(req.body?.reference, 32).toUpperCase();
    const rawContact = clean(req.body?.contact, 160).toLowerCase();
    const contact = rawContact.includes('@') ? rawContact : rawContact.replace(/\D/g, '');
    if (!reference || !contact) return res.status(400).json({ message: 'Enter your reference number and the email/mobile number used when submitting.' });
    const complaint = await Complaint.findOne({ where: { reference, [Op.or]: [{ email: contact }, { phone: contact }] } });
    if (!complaint) return res.status(404).json({ message: 'No matching complaint was found. Check the reference number and contact detail.' });
    return res.json({ reference: complaint.reference, category: complaint.category, subject: complaint.subject, status: complaint.status, receivedAt: complaint.createdAt, updatedAt: complaint.updatedAt, resolutionNote: complaint.status === 'resolved' || complaint.status === 'closed' ? complaint.resolutionNote : null });
  } catch (error) {
    console.error('Complaint tracking error:', error);
    if (databaseUnavailableResponse(res, error)) return;
    return res.status(500).json({ message: 'Unable to check status right now.' });
  }
});

router.get('/admin/complaints', adminOnly, async (req, res) => {
  try {
    const status = clean(req.query.status, 40);
    const where = statuses.has(status) ? { status } : {};
    // Keep the complete register: resolved/closed rows remain stored and visible.
    // Do not cap the register at the latest 300 complaints.
    const rows = await Complaint.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json({ total: rows.length, complaints: rows });
  } catch (error) {
    if (databaseUnavailableResponse(res, error)) return;
    return res.status(500).json({ message: 'Unable to load the grievance register.' });
  }
});

router.patch('/admin/complaints/:id', adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
    const status = clean(req.body?.status, 40);
    const resolutionNote = clean(req.body?.resolutionNote, 5000);
    if (!statuses.has(status)) return res.status(400).json({ message: 'Invalid complaint status.' });
    if (status === 'resolved' && resolutionNote.length < 5) return res.status(400).json({ message: 'Add a brief resolution note before marking this complaint resolved.' });
    const previousStatus = complaint.status;
    const previousNote = complaint.resolutionNote || '';
    const nextNote = resolutionNote || previousNote;
    await complaint.update({ status, resolutionNote: nextNote, resolvedAt: status === 'resolved' ? (complaint.resolvedAt || new Date()) : null });
    let notification = { sent: false, reason: 'no_change' };
    if (complaint.email && (previousStatus !== status || previousNote !== nextNote)) {
      notification = await notifySubmitter(complaint);
    }
    const notificationMessage = !complaint.email
      ? 'No email was provided by the complainant; automatic email notification was not possible.'
      : notification.sent
        ? 'An update email was sent to the complainant.'
        : notification.reason === 'email_not_configured'
          ? 'The record was saved, but outgoing email is not configured on the server.'
          : notification.reason === 'send_failed'
            ? 'The record was saved, but the notification email could not be sent. Check the email provider logs/settings.'
            : 'No new notification was needed.';
    return res.json({ message: `Complaint record saved. ${notificationMessage}`, notification, complaint });
  } catch (error) {
    if (databaseUnavailableResponse(res, error)) return;
    return res.status(500).json({ message: 'Unable to update the complaint.' });
  }
});

module.exports = router;
