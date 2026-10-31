// Self-service account routes for the logged-in user portal.
//
// Everything here acts on the caller's OWN account, proven by the signed token
// (never by an id in the body), so a user can maintain their profile without an
// admin, and cannot touch anyone else's record.
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Member = require('../models/Member');
const { requireAccountAuth } = require('../services/userAuth');
const { databaseUnavailableResponse } = require('../services/dbHealth');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, `${salt}${process.env.AUTH_PEPPER || ''}`, 64).toString('hex');
  return `${salt}:${hash}`;
};
const verifyPassword = (password, stored) => {
  if (!stored || !stored.includes(':')) return false;
  const [salt, expectedHex] = stored.split(':');
  if (!salt || !expectedHex) return false;
  const derived = crypto.scryptSync(password, `${salt}${process.env.AUTH_PEPPER || ''}`, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return expected.length === derived.length && crypto.timingSafeEqual(derived, expected);
};

const publicMember = (member) => ({
  id: member.id,
  fullName: member.fullName,
  email: member.email,
  phone: member.phone,
  memberType: member.memberType,
  status: member.status,
  memberId: member.memberId,
  certId: member.certId,
  idProofType: member.idProofType,
  identityNumber: member.identityNumber,
  profilePhotoPath: member.profilePhotoData || member.profilePhotoPath,
});

// PATCH /api/account/profile -> update the caller's own name / phone / id proof.
router.patch('/account/profile', requireAccountAuth(), async (req, res) => {
  try {
    const member = await Member.findByPk(req.account.accountId);
    if (!member) return res.status(404).json({ message: 'Account not found.' });
    const { fullName, phone, idProofType, identityNumber } = req.body || {};
    const updates = {};
    if (fullName !== undefined) {
      const clean = String(fullName).trim();
      if (clean.length < 3) return res.status(400).json({ message: 'Please enter your full name (at least 3 characters).' });
      updates.fullName = clean;
    }
    if (phone !== undefined) {
      const clean = String(phone).trim();
      if (clean.replace(/\D/g, '').length < 7) return res.status(400).json({ message: 'Please enter a valid mobile number.' });
      updates.phone = clean;
    }
    if (idProofType !== undefined) updates.idProofType = String(idProofType).trim() || null;
    if (identityNumber !== undefined) updates.identityNumber = String(identityNumber).trim() || null;
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: 'No changes were provided.' });
    await member.update(updates);
    return res.json({ status: 'success', message: 'Profile updated.', user: publicMember(member) });
  } catch (error) {
    console.error('Account profile update error:', error);
    if (databaseUnavailableResponse(res, error)) return;
    return res.status(500).json({ message: 'Unable to update your profile right now.' });
  }
});

// POST /api/account/password -> change the caller's own password.
router.post('/account/password', requireAccountAuth(), async (req, res) => {
  try {
    const member = await Member.findByPk(req.account.accountId);
    if (!member) return res.status(404).json({ message: 'Account not found.' });
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Please enter your current and new password.' });
    if (String(newPassword).length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    if (!member.passwordHash) return res.status(400).json({ message: 'This account has no password set. Please use password reset.' });
    if (!verifyPassword(currentPassword, member.passwordHash)) return res.status(401).json({ message: 'Your current password is incorrect.' });
    await member.update({ passwordHash: hashPassword(newPassword) });
    return res.json({ status: 'success', message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Account password change error:', error);
    if (databaseUnavailableResponse(res, error)) return;
    return res.status(500).json({ message: 'Unable to change your password right now.' });
  }
});

module.exports = router;
