const express = require('express');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const Volunteer = require('../models/Volunteer');
const Member = require('../models/Member');

const router = express.Router();
const cleanEmail = (value) => String(value || '').trim().toLowerCase();
const cleanPhone = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const notifyAdmin = async (subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false;
  try {
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({ from: `\"Swastik Srijan Admin\" <${process.env.EMAIL_USER}>`, to: (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'info@swastiksrijan.in'), subject, text });
    return true;
  } catch (error) {
    console.error('Portal participation notification failed:', error.message);
    return false;
  }
};

router.post('/portal-volunteer', async (req, res) => {
  try {
    const { accountId, name, email, phone, volunteer_type, message } = req.body || {};
    const normalizedEmail = cleanEmail(email);
    const normalizedPhone = cleanPhone(phone);
    if (!accountId || !name || !normalizedEmail || !normalizedPhone) {
      return res.status(400).json({ status: 'error', message: 'Please complete your profile details before applying.' });
    }
    const member = await Member.findByPk(accountId);
    if (!member) return res.status(404).json({ status: 'error', message: 'SSF account not found. Please log in again.' });
    if (cleanEmail(member.email) !== normalizedEmail) return res.status(403).json({ status: 'error', message: 'Account verification failed. Please log in again.' });
    if (!member.profilePhotoPath) return res.status(400).json({ status: 'error', message: 'Please add a profile photo in My Profile before applying as a volunteer.' });
    const duplicate = await Volunteer.findOne({ where: { [Op.or]: [{ email: normalizedEmail }, { phone: normalizedPhone }] } });
    if (duplicate) return res.status(409).json({ status: 'error', message: 'A volunteer application with this email or mobile number already exists.' });
    const volunteer = await Volunteer.create({
      fullName: String(name).trim(), email: normalizedEmail, phone: normalizedPhone,
      volunteerType: String(volunteer_type || 'field').trim() || 'field', position: 'General Volunteer',
      idType: 'Profile Account', identityNumber: null, message: String(message || '').trim() || null,
      idDocumentPath: null, profilePhotoPath: member.profilePhotoPath, status: 'pending', isVerified: false
    });
    const emailSent = await notifyAdmin(`New Volunteer Application: ${volunteer.fullName}`, `New volunteer application received from the logged-in SSF portal.\nName: ${volunteer.fullName}\nType: ${volunteer.volunteerType}\nPhone: ${volunteer.phone}\nEmail: ${volunteer.email}`);
    return res.status(201).json({ status: 'success', message: 'Volunteer application submitted successfully.', emailSent, data: volunteer });
  } catch (error) {
    console.error('Portal volunteer submission error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to save the volunteer application right now. Please try again.' });
  }
});

router.post('/portal-member-application', async (req, res) => {
  try {
    const { accountId, fullName, email, phone, memberType, message } = req.body || {};
    const normalizedEmail = cleanEmail(email);
    const normalizedPhone = cleanPhone(phone);
    const allowedTypes = new Set(['general', 'active', 'life', 'advisory']);
    const selectedType = String(memberType || '').toLowerCase();
    if (!accountId || !fullName || !normalizedEmail || !normalizedPhone || !allowedTypes.has(selectedType)) {
      return res.status(400).json({ status: 'error', message: 'Please complete all membership fields.' });
    }
    const member = await Member.findByPk(accountId);
    if (!member) return res.status(404).json({ status: 'error', message: 'SSF account not found. Please log in again.' });
    if (cleanEmail(member.email) !== normalizedEmail) return res.status(403).json({ status: 'error', message: 'Account verification failed. Please log in again.' });
    if (!member.profilePhotoPath) return res.status(400).json({ status: 'error', message: 'Please add a profile photo in My Profile before applying for membership.' });
    if (member.status === 'approved' && member.memberId) return res.status(409).json({ status: 'error', message: 'Your SSF membership is already approved.' });
    if (!['website_signup', 'changes_requested', 'rejected', 'pending'].includes(String(member.memberType || '').toLowerCase()) && member.status !== 'approved') {
      return res.status(409).json({ status: 'error', message: 'This membership account cannot be submitted right now.' });
    }
    await member.update({
      fullName: String(fullName).trim(), phone: normalizedPhone, memberType: selectedType,
      message: String(message || '').trim() || null, idProofType: null, idDocumentPath: null,
      status: 'pending', paymentStatus: selectedType === 'advisory' ? 'not_required' : 'pending',
      reviewNote: null, memberId: null, certId: null, certificateType: null, certificateIssuedAt: null
    });
    const emailSent = await notifyAdmin(`Membership Application: ${member.fullName}`, `Membership application submitted from the logged-in SSF portal.\nName: ${member.fullName}\nType: ${member.memberType}\nEmail: ${member.email}\nPhone: ${member.phone}`);
    return res.status(201).json({ status: 'success', message: 'Membership application submitted successfully. It is now under review.', emailSent, user: { id: member.id, fullName: member.fullName, email: member.email, phone: member.phone, memberType: member.memberType, status: member.status } });
  } catch (error) {
    console.error('Portal membership submission error:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to save the membership application right now. Please try again.' });
  }
});

module.exports = router;
