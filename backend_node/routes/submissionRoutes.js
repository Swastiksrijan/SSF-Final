const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const Volunteer = require('../models/Volunteer');
const Member = require('../models/Member');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname).toLowerCase()}`)
});

const profileTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
const documentTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']);
const profileExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']);
const documentExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.pdf']);
const fileFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const isProfile = file.fieldname === 'profile_photo';
  const allowed = isProfile ? profileTypes.has(file.mimetype) || profileExtensions.has(extension) : documentTypes.has(file.mimetype) || documentExtensions.has(extension);
  if (allowed) return cb(null, true);
  return cb(new Error(isProfile
    ? 'Profile photo must be JPG, PNG, WebP or HEIC/HEIF.'
    : 'Identity document must be JPG, PNG, WebP, HEIC/HEIF or PDF.'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 2 } });
const multipart = (fields) => (req, res, next) => {
  if (!req.is('multipart/form-data')) return next();
  upload.fields(fields)(req, res, (error) => {
    if (!error) return next();
    const uploaded = Object.values(req.files || {}).flat();
    uploaded.forEach(removeFile);
    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'One of the uploaded files is larger than 5MB.'
        : error.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Please upload only the requested profile photo and identity document.'
          : `File upload error: ${error.message}`;
      return res.status(400).json({ status: 'error', message });
    }
    return res.status(400).json({ status: 'error', message: error.message || 'Unable to process the uploaded file.' });
  });
};

const removeFile = (file) => { if (file?.path && fs.existsSync(file.path)) { try { fs.unlinkSync(file.path); } catch (_) {} } };
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, `${salt}${process.env.AUTH_PEPPER || ''}`, 64).toString('hex');
  return `${salt}:${hash}`;
};
const adminRecipients = () => (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'info@swastiksrijan.in').split(',').map(v => v.trim()).filter(Boolean).join(',');
const notifyAdmin = async (subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ EMAIL_USER/EMAIL_PASS missing; application was saved without email notification.');
    return false;
  }
  try {
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({ from: `"Swastik Srijan Admin" <${process.env.EMAIL_USER}>`, to: adminRecipients(), subject, text });
    return true;
  } catch (error) {
    console.error('⚠️ Application notification failed:', error.message);
    return false;
  }
};
const cleanEmail = (value) => String(value || '').trim().toLowerCase();
const cleanPhone = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const isAccountOnly = (member) => String(member?.memberType || '').trim().toLowerCase() === 'website_signup' || String(member?.message || '').trim().toLowerCase() === 'signup from website';

router.post('/register', multipart([
  { name: 'id_document', maxCount: 1 },
  { name: 'profile_photo', maxCount: 1 }
]), async (req, res) => {
  const profilePhoto = req.files?.profile_photo?.[0];
  const idDocument = req.files?.id_document?.[0];
  try {
    const { name, email, phone, volunteer_type, position, id_type, message } = req.body || {};
    if (!name || !email || !phone || !profilePhoto || !idDocument) {
      removeFile(profilePhoto); removeFile(idDocument);
      return res.status(400).json({ status: 'error', message: 'Full name, email, phone, profile photo and identity document are required.' });
    }
    if (profilePhoto.size > 2 * 1024 * 1024) { removeFile(profilePhoto); removeFile(idDocument); return res.status(400).json({ status: 'error', message: 'Profile photo must be 2MB or smaller.' }); }
    const normalizedEmail = cleanEmail(email);
    const normalizedPhone = cleanPhone(phone);
    const duplicate = await Volunteer.findOne({ where: { [Op.or]: [{ email: normalizedEmail }, { phone: normalizedPhone }] } });
    if (duplicate) { removeFile(profilePhoto); removeFile(idDocument); return res.status(409).json({ status: 'error', message: cleanEmail(duplicate.email) === normalizedEmail ? 'A volunteer application with this email already exists.' : 'A volunteer application with this mobile number already exists.' }); }
    const newVolunteer = await Volunteer.create({
      fullName: name.trim(), email: normalizedEmail, phone: normalizedPhone,
      volunteerType: volunteer_type || 'field', position: position || 'General Volunteer', idType: id_type || 'College ID',
      message: message?.trim() || null, idDocumentPath: idDocument.path, profilePhotoPath: `/uploads/${profilePhoto.filename}`,
      status: 'pending', isVerified: false
    });
    const emailSent = await notifyAdmin(`New Volunteer Application: ${name.trim()}`, `New volunteer application received.\nName: ${name.trim()}\nType: ${volunteer_type || 'field'}\nPosition: ${position || 'General Volunteer'}\nPhone: ${normalizedPhone}\nEmail: ${normalizedEmail}`);
    return res.status(201).json({ status: 'success', message: 'Application submitted successfully', emailSent, data: newVolunteer });
  } catch (error) {
    removeFile(profilePhoto); removeFile(idDocument);
    console.error('❌ Volunteer submission error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Unable to submit your volunteer application.' });
  }
});

router.post('/member-signup', multipart([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'id_document', maxCount: 1 }
]), async (req, res) => {
  const profilePhoto = req.files?.profile_photo?.[0];
  const idDocument = req.files?.id_document?.[0];
  try {
    const { fullName, email, confirmEmail, phone, password, memberType, idProofType, message } = req.body || {};
    const primaryEmail = cleanEmail(email);
    const secondaryEmail = cleanEmail(confirmEmail);
    const normalizedPhone = cleanPhone(phone);
    const isWebsiteAccount = memberType === 'website_signup';
    if (!fullName || !primaryEmail || !phone || !memberType) { removeFile(profilePhoto); removeFile(idDocument); return res.status(400).json({ status: 'error', message: 'Full name, email, phone and membership type are required.' }); }
    if (!isWebsiteAccount && !secondaryEmail) { removeFile(profilePhoto); removeFile(idDocument); return res.status(400).json({ status: 'error', message: 'Email confirmation is required.' }); }
    if (secondaryEmail && primaryEmail !== secondaryEmail) { removeFile(profilePhoto); removeFile(idDocument); return res.status(400).json({ status: 'error', message: 'Email fields do not match.' }); }
    if (!password || password.length < 8) { removeFile(profilePhoto); removeFile(idDocument); return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters.' }); }
    if (!isWebsiteAccount && (!profilePhoto || !idDocument || !idProofType)) { removeFile(profilePhoto); removeFile(idDocument); return res.status(400).json({ status: 'error', message: 'Please upload both a profile photo and identity proof.' }); }
    if (profilePhoto && profilePhoto.size > 2 * 1024 * 1024) { removeFile(profilePhoto); removeFile(idDocument); return res.status(400).json({ status: 'error', message: 'Profile photo must be 2MB or smaller.' }); }

    const existing = await Member.findOne({ where: { [Op.or]: [{ email: primaryEmail }, { phone: normalizedPhone }] } });
    if (existing) {
      const sameEmail = cleanEmail(existing.email) === primaryEmail;
      if (!sameEmail && cleanPhone(existing.phone) === normalizedPhone) { removeFile(profilePhoto); removeFile(idDocument); return res.status(409).json({ status: 'error', message: 'An SSF account already exists with this mobile number. Please use the existing account email.' }); }
      if (isWebsiteAccount) {
        if (existing.passwordHash) { removeFile(profilePhoto); removeFile(idDocument); return res.status(409).json({ status: 'error', message: 'An account with this email already exists. Please log in.' }); }
        await existing.update({ passwordHash: hashPassword(password), phone: normalizedPhone, memberType: 'website_signup', message: 'Signup from website', status: 'approved', paymentStatus: 'not_required' });
        return res.status(200).json({ status: 'success', message: 'Account created successfully. You are now signed in.', user: { id: existing.id, fullName: existing.fullName, email: existing.email, phone: existing.phone, memberType: existing.memberType, status: existing.status } });
      }
      if (isAccountOnly(existing)) {
        const updates = { fullName: fullName.trim(), phone: normalizedPhone, memberType, idProofType, message: message?.trim() || null, profilePhotoPath: `/uploads/${profilePhoto.filename}`, idDocumentPath: idDocument.path, status: 'pending', paymentStatus: memberType === 'advisory' ? 'not_required' : 'pending', reviewNote: null };
        await existing.update(updates);
        const emailSent = await notifyAdmin(`New Membership Application: ${fullName.trim()}`, `An existing SSF account has submitted a membership application.\nName: ${fullName.trim()}\nType: ${memberType}\nEmail: ${primaryEmail}\nPhone: ${normalizedPhone}`);
        return res.status(201).json({ status: 'success', message: 'Membership application submitted successfully', emailSent, data: existing, user: { id: existing.id, fullName: existing.fullName, email: existing.email, phone: existing.phone, memberType: existing.memberType, status: existing.status } });
      }
      if (existing.status === 'changes_requested') {
        await existing.update({ fullName: fullName.trim(), phone: normalizedPhone, memberType, idProofType, message: message?.trim() || null, profilePhotoPath: `/uploads/${profilePhoto.filename}`, idDocumentPath: idDocument.path, status: 'pending', reviewNote: null });
        const emailSent = await notifyAdmin(`Membership Application Resubmitted: ${fullName.trim()}`, `A membership application has been updated and resubmitted.\nName: ${fullName.trim()}\nType: ${memberType}\nEmail: ${primaryEmail}\nPhone: ${normalizedPhone}`);
        return res.status(200).json({ status: 'success', message: 'Membership application updated and resubmitted successfully.', emailSent, data: existing, user: { id: existing.id, fullName: existing.fullName, email: existing.email, phone: existing.phone, memberType: existing.memberType, status: existing.status } });
      }
      removeFile(profilePhoto); removeFile(idDocument);
      return res.status(409).json({ status: 'error', message: 'A membership application with this email already exists.' });
    }

    const newMember = await Member.create({
      fullName: fullName.trim(), email: primaryEmail, phone: normalizedPhone, passwordHash: hashPassword(password),
      memberType, message: message?.trim() || null, profilePhotoPath: `/uploads/${profilePhoto.filename}`,
      idProofType, idDocumentPath: idDocument.path, status: 'pending', paymentStatus: memberType === 'advisory' ? 'not_required' : 'pending'
    });
    const emailSent = await notifyAdmin(`New Membership Application: ${fullName.trim()}`, `New membership application received.\nName: ${fullName.trim()}\nType: ${memberType}\nEmail: ${primaryEmail}\nPhone: ${normalizedPhone}`);
    return res.status(201).json({ status: 'success', message: 'Membership application submitted successfully', emailSent, data: newMember, user: { id: newMember.id, fullName: newMember.fullName, email: newMember.email, phone: newMember.phone, memberType: newMember.memberType, status: newMember.status } });
  } catch (error) {
    removeFile(profilePhoto); removeFile(idDocument);
    console.error('❌ Membership submission error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Unable to submit your membership application.' });
  }
});

module.exports = router;
