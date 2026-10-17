const express = require('express');
const { sendMail, emailConfigured } = require('../services/mailer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Member = require('../models/Member');
const { requireAccountAuth, issueToken } = require('../services/userAuth');
const identity = require('../services/identityService');

const REAL_MEMBERSHIP_TYPES = ['general', 'active', 'life', 'advisory'];
const isAccountOnly = (member) => String(member?.memberType || '').trim().toLowerCase() === 'website_signup' || String(member?.message || '').trim().toLowerCase() === 'signup from website';
const isRealMembership = (member) => !isAccountOnly(member) && REAL_MEMBERSHIP_TYPES.includes(String(member?.memberType || '').trim().toLowerCase());
const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdminAuth = (req, res, next) => { const authHeader = req.headers.authorization || ''; const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''; if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' }); next(); };
const sendEmail = async (to, subject, text, html) => { if (!emailConfigured()) throw new Error('Email credentials missing in .env file'); await sendMail({ from: '"Swastik Srijan Admin"', to, subject, text, html }); };
// Member numbers continue the offline register series (SSF-MBR-000NN), never
// the old per-month website series, and a number already issued is never reused.
const getMemberNumber = async () => identity.nextMemberId(Member);

// Build the identity for a member who is being approved. A person who already
// exists in the offline register keeps their original number (matched on email
// or mobile) so they never end up with two parallel member IDs.
const buildMemberIdentity = async (member) => {
  const adopted = identity.matchRegisterEntry(member);
  const memberId = adopted && identity.isMemberId(adopted.memberId)
    ? adopted.memberId
    : await identity.nextMemberId(Member);
  return { memberId, certId: identity.memberCertIdFor(memberId) };
};
const getMonthYearCode = (date = new Date()) => { const month = String(date.getMonth() + 1).padStart(2, '0'); const year = String(date.getFullYear()).slice(-2); return `${month}${year}`; };
const membershipAmounts = { general: 1200, active: 2500, life: 8000 };
// A membership that carries a fee can only be approved once that fee is
// confirmed. Advisory/expert membership is honorary, so it is exempt.
const PAID_MEMBERSHIP_TYPES = ['general', 'active', 'life'];
const requiresPayment = (member) => PAID_MEMBERSHIP_TYPES.includes(String(member?.memberType || '').trim().toLowerCase());
const paymentGateMessage = 'Membership fee is not confirmed yet. The applicant must complete the payment, or the admin must record it as received, before approval.';

router.post('/member-account-signup', async (req, res) => {
    try { const { fullName, email, confirmEmail, phone, password, memberType, message } = req.body || {}; const primaryEmail = String(email || '').trim().toLowerCase(); if (!fullName || !primaryEmail || primaryEmail !== String(confirmEmail || '').trim().toLowerCase() || !phone || !password || password.length < 8 || !memberType) return res.status(400).json({ message: 'Please complete all required fields. Password must be at least 8 characters.' }); const existing = await Member.findOne({ where: { email: primaryEmail } }); if (existing?.passwordHash) return res.status(409).json({ message: 'An account with this email already exists. Please log in.' }); const member = existing || await Member.create({ fullName, email: primaryEmail, phone, passwordHash: hashPassword(password), memberType, message, status: 'pending', paymentStatus: memberType === 'advisory' ? 'not_required' : 'pending' }); if (existing) await member.update({ fullName, phone, passwordHash: hashPassword(password), memberType, message, status: existing.status, paymentStatus: memberType === 'advisory' ? 'not_required' : (existing.paymentStatus || 'pending') }); return res.status(existing ? 200 : 201).json({ status: 'success', message: 'Account created successfully.', token: issueToken(member), user: { id: member.id, fullName: member.fullName, email: member.email, phone: member.phone, memberType: member.memberType, status: member.status, paymentStatus: member.paymentStatus } }); }
    catch (error) { console.error('❌ Member account signup error:', error); return res.status(500).json({ message: 'Server Error' }); }
});

router.post('/member-payment-link', async (req, res) => {
    try { const { memberId } = req.body || {}; const member = await Member.findByPk(memberId); if (!member) return res.status(404).json({ message: 'Member application not found' }); if (!isRealMembership(member)) return res.status(400).json({ message: 'This account has not applied for membership. Please choose a membership role first.' }); if (member.paymentStatus === 'paid') return res.json({ status: 'paid', paymentStatus: 'paid', paymentId: member.paymentId }); if (member.memberType === 'advisory') return res.status(400).json({ message: 'Advisory membership is by invitation and does not use online payment.' }); const keyId = process.env.RAZORPAY_KEY_ID; const keySecret = process.env.RAZORPAY_KEY_SECRET; if (!keyId || !keySecret) return res.status(503).json({ message: 'Razorpay membership payment is not configured on the server yet.', fallbackUrl: 'https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view' }); if (member.paymentLinkId) return res.json({ status: 'success', paymentUrl: null, paymentLinkId: member.paymentLinkId, paymentStatus: member.paymentStatus }); const amountRupees = membershipAmounts[member.memberType] || membershipAmounts.general; const backendUrl = (process.env.BACKEND_PUBLIC_URL || 'https://ngo-backend-03hq.onrender.com').replace(/\/$/, ''); const referenceId = `SSF-MEM-${member.id}`.slice(0, 40); const payload = { amount: amountRupees * 100, currency: 'INR', accept_partial: false, reference_id: referenceId, description: `SSF Membership - ${member.memberType}`, customer: { name: member.fullName, email: member.email, contact: member.phone.replace(/\D/g, '').slice(-15) }, notify: { email: true, sms: false }, reminder_enable: true, notes: { member_id: member.id, member_type: member.memberType }, callback_url: `${backendUrl}/api/member-payment-callback`, callback_method: 'get' }; const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64'); const response = await fetch('https://api.razorpay.com/v1/payment_links', { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const result = await response.json(); if (!response.ok) return res.status(502).json({ message: result.error?.description || 'Unable to create Razorpay payment link' }); await member.update({ paymentStatus: 'pending', paymentLinkId: result.id, paymentAmount: amountRupees * 100 }); return res.json({ status: 'success', paymentUrl: result.short_url, paymentLinkId: result.id, paymentStatus: 'pending', amount: amountRupees }); }
    catch (error) { console.error('❌ Membership payment-link error:', error); return res.status(500).json({ message: 'Server Error' }); }
});

// The applicant pays through the shared Razorpay page and then records the
// mode + UTR/receipt reference here. This does NOT mark the fee as paid — an
// admin verifies the reference and confirms it, which is what unlocks approval.
router.post('/member-payment-submit', requireAccountAuth((req) => (req.body || {}).memberId), async (req, res) => {
    try {
        const { memberId, paymentMode, paymentReference } = req.body || {};
        const member = await Member.findByPk(memberId);
        if (!member) return res.status(404).json({ message: 'Membership application not found.' });
        if (!isRealMembership(member)) return res.status(400).json({ message: 'This account has not applied for membership yet.' });
        if (!requiresPayment(member)) return res.status(400).json({ message: 'Advisory / expert membership is honorary and does not need a fee.' });
        if (member.paymentStatus === 'paid') return res.json({ status: 'success', message: 'Your membership fee is already confirmed.', paymentStatus: 'paid' });
        const mode = String(paymentMode || '').trim();
        const reference = String(paymentReference || '').trim();
        if (!mode) return res.status(400).json({ message: 'Please select how you paid the membership fee.' });
        if (reference.length < 4) return res.status(400).json({ message: 'Please enter the UPI / UTR / receipt reference from your payment.' });
        await member.update({ paymentMode: mode, paymentReference: reference, paymentStatus: 'pending' });
        return res.json({ status: 'success', message: 'Payment details received. Our team will verify and confirm your membership.', paymentStatus: 'pending' });
    } catch (error) { console.error('❌ Membership payment submit error:', error); return res.status(500).json({ message: 'Server Error' }); }
});

router.get('/member-payment-callback', async (req, res) => {
    try { const { razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature } = req.query; const frontendUrl = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, ''); if (!razorpay_payment_id || !razorpay_payment_link_id || !razorpay_payment_link_reference_id || !razorpay_signature) return res.redirect(`${frontendUrl}/MemberDashboard?payment=failed`); const payload = `${razorpay_payment_link_id}|${razorpay_payment_link_reference_id}|${razorpay_payment_link_status}|${razorpay_payment_id}`; const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(payload).digest('hex'); const supplied = String(razorpay_signature); if (expected.length !== supplied.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied))) return res.redirect(`${frontendUrl}/MemberDashboard?payment=invalid`); const member = await Member.findOne({ where: { paymentLinkId: razorpay_payment_link_id } }); if (member && razorpay_payment_link_status === 'paid') await member.update({ paymentStatus: 'paid', paymentId: razorpay_payment_id, paymentPaidAt: new Date() }); return res.redirect(`${frontendUrl}/MemberDashboard?payment=${member && razorpay_payment_link_status === 'paid' ? 'success' : 'pending'}`); }
    catch (error) { console.error('❌ Membership payment callback error:', error); return res.redirect('https://swastiksrijan.in/MemberDashboard?payment=error'); }
});

router.post('/admin/member-approve/:id', requireAdminAuth, async (req, res) => {
    try { const member = await Member.findByPk(req.params.id); if (!member) return res.status(404).json({ message: 'Member not found' }); if (!isRealMembership(member)) return res.status(400).json({ message: 'This is an SSF account, not a membership application. The person must choose and submit a membership application first.' }); if (member.status === 'approved' && member.memberId && member.certId) return res.status(400).json({ message: 'Member is already approved', memberId: member.memberId, certId: member.certId }); if (requiresPayment(member) && member.paymentStatus !== 'paid') return res.status(400).json({ message: paymentGateMessage, paymentStatus: member.paymentStatus }); const certificateIssuedAt = new Date(); const { memberId, certId } = await buildMemberIdentity(member); await member.update({ status: 'approved', memberId, certId, certificateType: 'Membership Certificate', certificateIssuedAt }); await identity.reserve({ kind: 'member', value: memberId, certValue: certId, recordId: member.id, holderName: member.fullName, holderEmail: member.email }); const frontendUrl = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, ''); const verificationUrl = `${frontendUrl}/verify/${certId}`; let emailSent = true; let warning = null; try { await sendEmail(member.email, 'Membership Approved - Swastik Srijan Foundation', `Congratulations! Your SSF membership has been approved. Member ID: ${memberId}. Certificate ID: ${certId}. Verify: ${verificationUrl}`, `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:1px solid #eee;border-radius:16px"><h2>Membership Approved</h2><p>Welcome, <strong>${member.fullName}</strong>.</p><p><strong>Member ID:</strong> ${memberId}</p><p><strong>Certificate ID:</strong> ${certId}</p><p><a href="${verificationUrl}">Verify Certificate</a></p></div>`); } catch (emailError) { emailSent = false; warning = 'Member approved, but the email notification failed.'; console.error('⚠️ Member approval email failed:', emailError.message); } return res.json({ status: 'success', memberId, certId, certificateType: 'Membership Certificate', certificateIssuedAt, verificationUrl, emailSent, warning }); }
    catch (error) { console.error('❌ Member approval error:', error); res.status(500).json({ message: 'Server Error' }); }
});

router.patch('/admin/members/:id', requireAdminAuth, async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        const allowed = ['fullName', 'email', 'phone', 'memberType', 'designation', 'guardianName', 'address', 'city', 'state', 'pinCode', 'joiningDate', 'message', 'status', 'paymentStatus', 'paymentMode', 'paymentReference', 'paymentId', 'paymentAmount', 'paymentLinkId', 'reviewNote', 'idProofType', 'identityNumber', 'memberId', 'idValidFrom', 'idValidTill', 'idActive'];
        const updates = {};
        for (const field of allowed) if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) updates[field] = req.body[field];
        if (updates.email) updates.email = String(updates.email).trim().toLowerCase();
        if (updates.reviewNote !== undefined) updates.reviewNote = String(updates.reviewNote || '').trim() || null;
        if (updates.idProofType !== undefined) updates.idProofType = String(updates.idProofType || '').trim() || null;
        if (updates.identityNumber !== undefined) updates.identityNumber = String(updates.identityNumber || '').trim() || null;
        for (const field of ['designation', 'guardianName', 'city', 'state', 'pinCode']) {
            if (updates[field] !== undefined) updates[field] = String(updates[field] || '').trim() || null;
        }
        if (updates.address !== undefined) updates.address = String(updates.address || '').trim() || null;
        if (updates.joiningDate !== undefined) updates.joiningDate = String(updates.joiningDate || '').trim() || null;
        for (const field of ['idValidFrom', 'idValidTill']) {
            if (updates[field] !== undefined) updates[field] = String(updates[field] || '').trim() || null;
        }
        if (updates.idActive !== undefined) updates.idActive = updates.idActive === true || updates.idActive === 'true';
        // An admin can correct the official ID number by hand — needed when the
        // person already holds an offline number. The format is validated and a
        // number that belongs to somebody else is refused.
        if (updates.memberId !== undefined) {
            const wanted = String(updates.memberId || '').trim();
            if (!wanted) updates.memberId = null;
            else {
                if (!identity.isMemberId(wanted)) return res.status(400).json({ message: 'Member ID must look like SSF-MBR-00001 or SSF-MEM-2510-0001.' });
                if (await identity.isTaken(Member, 'memberId', wanted, member.id)) return res.status(400).json({ message: `Member ID ${wanted} is already assigned to another member.` });
                updates.memberId = wanted;
                updates.certId = identity.memberCertIdFor(wanted);
                await identity.reserve({ kind: 'member', value: wanted, certValue: updates.certId, recordId: member.id, holderName: member.fullName, holderEmail: member.email, note: 'Assigned by admin' });
            }
        }
        if (updates.memberType && String(updates.memberType).toLowerCase() === 'website_signup') return res.status(400).json({ message: 'website_signup is an account type, not a membership role.' });
        if (updates.status && !['pending', 'changes_requested', 'approved', 'rejected'].includes(String(updates.status))) return res.status(400).json({ message: 'Invalid member status' });
        if (updates.paymentStatus && !['not_required', 'pending', 'paid', 'failed'].includes(String(updates.paymentStatus))) return res.status(400).json({ message: 'Invalid payment status' });
        if (updates.paymentMode !== undefined) updates.paymentMode = String(updates.paymentMode || '').trim() || null;
        if (updates.paymentReference !== undefined) updates.paymentReference = String(updates.paymentReference || '').trim() || null;
        if (updates.paymentStatus === 'paid' && member.paymentStatus !== 'paid') updates.paymentPaidAt = new Date();
        if (updates.status === 'approved') {
            const prospective = { ...member.toJSON(), ...updates };
            if (requiresPayment(prospective) && prospective.paymentStatus !== 'paid') return res.status(400).json({ message: paymentGateMessage, paymentStatus: prospective.paymentStatus });
            if (!isRealMembership(prospective)) return res.status(400).json({ message: 'Only a submitted membership application can be approved as a member.' });
            if (member.status !== 'approved' && !member.memberId && !updates.memberId) {
                const now = new Date();
                const issued = await buildMemberIdentity(member);
                updates.memberId = issued.memberId;
                updates.certId = member.certId || issued.certId;
                updates.certificateType = member.certificateType || 'Membership Certificate';
                updates.certificateIssuedAt = now;
            }
        }
        if (updates.status === 'rejected') {
            updates.memberId = null; updates.certId = null; updates.certificateType = null; updates.certificateIssuedAt = null;
        }
        await member.update(updates);
        return res.json({ status: 'success', message: 'Member record updated.', member: member.toJSON() });
    } catch (error) { console.error('❌ Member update error:', error); return res.status(500).json({ message: 'Unable to update member record.' }); }
});

router.patch('/admin/members/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        const status = String(req.body?.status || '').trim().toLowerCase();
        if (!['pending', 'changes_requested', 'approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid member status' });
        if (status === 'approved' && !isRealMembership(member)) return res.status(400).json({ message: 'This account has not submitted a membership application.' });
        if (status === 'approved' && requiresPayment(member) && member.paymentStatus !== 'paid') return res.status(400).json({ message: paymentGateMessage, paymentStatus: member.paymentStatus });
        const updates = { status };
        if (req.body?.reviewNote !== undefined) updates.reviewNote = String(req.body.reviewNote || '').trim() || null;
        if (status === 'approved' && !member.memberId) {
            const now = new Date(); const issued = await buildMemberIdentity(member);
            updates.memberId = issued.memberId;
            updates.certId = member.certId || issued.certId;
            updates.certificateType = member.certificateType || 'Membership Certificate'; updates.certificateIssuedAt = now;
        }
        if (status === 'rejected') { updates.memberId = null; updates.certId = null; updates.certificateType = null; updates.certificateIssuedAt = null; }
        if (status === 'rejected') await identity.revokeFor('member', member.id, updates.reviewNote || 'Rejected');
        await member.update(updates);
        if (updates.memberId) await identity.reserve({ kind: 'member', value: updates.memberId, certValue: updates.certId, recordId: member.id, holderName: member.fullName, holderEmail: member.email });
        return res.json({ status: 'success', message: `Member status changed to ${status}.`, member: member.toJSON() });
    } catch (error) { console.error('❌ Member status error:', error); return res.status(500).json({ message: 'Unable to change member status.' }); }
});

// Re-issue an approved member's official IDs with a fresh number. Used when an
// ID was issued in error or needs to be replaced; the old number stops
// verifying because the record only keeps the latest one.
router.post('/admin/members/:id/reissue', requireAdminAuth, async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        if (!isRealMembership(member)) return res.status(400).json({ message: 'This is an SSF account, not a membership application.' });
        if (member.status !== 'approved') return res.status(400).json({ message: 'Only an approved member has IDs to re-issue.' });
        const issuedAt = new Date();
        const { memberId, certId } = await buildMemberIdentity(member);
        await identity.revokeFor('member', member.id, 'Re-issued');
        await member.update({ memberId, certId, certificateType: 'Membership Certificate', certificateIssuedAt: issuedAt });
        await identity.reserve({ kind: 'member', value: memberId, certValue: certId, recordId: member.id, holderName: member.fullName, holderEmail: member.email });
        return res.json({ status: 'success', message: 'Member IDs re-issued.', memberId, certId, certificateIssuedAt: issuedAt });
    } catch (error) { console.error('❌ Member re-issue error:', error); return res.status(500).json({ message: 'Unable to re-issue member IDs.' }); }
});

// Revoke an issued membership: the IDs are cleared and the record is rejected,
// so the certificate and ID card stop verifying immediately.
router.post('/admin/members/:id/revoke', requireAdminAuth, async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        if (!member.memberId && !member.certId) return res.status(400).json({ message: 'This member has no issued IDs to revoke.' });
        const reason = String(req.body?.reviewNote || '').trim() || null;
        await identity.revokeFor('member', member.id, reason || 'Revoked by admin');
        await member.update({ status: 'rejected', memberId: null, certId: null, certificateType: null, certificateIssuedAt: null, reviewNote: reason });
        return res.json({ status: 'success', message: 'Membership IDs revoked. The ID card and certificate no longer verify.' });
    } catch (error) { console.error('❌ Member revoke error:', error); return res.status(500).json({ message: 'Unable to revoke member IDs.' }); }
});

// Switch an issued ID card on or off without deleting the person's record.
// A deactivated card stops verifying, which is what "inactive" has to mean.
router.post('/admin/members/:id/id-status', requireAdminAuth, async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        const active = req.body?.idActive === undefined ? !member.idActive : Boolean(req.body.idActive);
        await member.update({ idActive: active });
        return res.json({ status: 'success', message: active ? 'ID card activated.' : 'ID card deactivated. It no longer verifies.', idActive: active });
    } catch (error) { console.error('❌ Member ID status error:', error); return res.status(500).json({ message: 'Unable to change the ID card status.' }); }
});

// The offline register, as an admin sees it: every number with whether it has
// already been claimed, so a member can be given their original ID.
router.get('/admin/member-register', requireAdminAuth, async (_req, res) => {
    try {
        return res.json(await identity.registerOverview(Member));
    } catch (error) { console.error('❌ Member register error:', error); return res.status(500).json({ message: 'Unable to load the member register.' }); }
});

router.delete('/admin/members/:id', requireAdminAuth, async (req, res) => {
    try { const member = await Member.findByPk(req.params.id); if (!member) return res.status(404).json({ message: 'Member application not found' }); for (const storedPath of [member.profilePhotoPath, member.idDocumentPath]) { if (storedPath) { const filename = path.basename(storedPath); const filePath = path.join(__dirname, '..', 'uploads', filename); try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (error) { console.warn('Member file cleanup failed:', error.message); } } } await member.destroy(); return res.json({ status: 'success', message: 'Member application deleted permanently.' }); }
    catch (error) { console.error('❌ Member delete error:', error); return res.status(500).json({ message: 'Unable to delete member application.' }); }
});

router.get('/member-status/:id', requireAccountAuth((req) => req.params.id), async (req, res) => {
    try { const member = await Member.findByPk(req.params.id, { attributes: ['id','fullName','email','phone','memberType','designation','guardianName','address','city','state','pinCode','joiningDate','status','paymentStatus','paymentId','paymentLinkId','paymentAmount','paymentMode','paymentReference','paymentPaidAt','memberId','certId','certificateType','certificateIssuedAt','idValidFrom','idValidTill','idActive','reviewNote','idProofType','identityNumber','profilePhotoPath','profilePhotoData','createdAt'] }); if (!member) return res.status(404).json({ message: 'Member not found' }); const data = member.toJSON(); data.profilePhotoPath = member.profilePhotoData || member.profilePhotoPath; return res.json(data); }
    catch (error) { console.error('❌ Member status error:', error); return res.status(500).json({ message: 'Server Error' }); }
});

router.get('/verify/:certId', async (req, res, next) => {
    const certId = String(req.params.certId || ''); if (!certId.startsWith('SSF-MCERT-')) return next(); try { const member = await Member.findOne({ where: { certId, status: 'approved' }, attributes: ['fullName','memberId','certId','certificateType','certificateIssuedAt','memberType','message','idActive','idValidFrom','idValidTill'] }); if (!member || !isRealMembership(member)) return res.status(404).json({ valid: false, message: 'Certificate not found or no longer valid.' }); if (member.idActive === false) return res.status(404).json({ valid: false, message: 'This ID card has been deactivated by the Foundation.' }); const today = new Date().toISOString().slice(0, 10); if (member.idValidTill && String(member.idValidTill) < today) return res.status(404).json({ valid: false, message: 'This ID card has expired.' }); return res.json({ valid: true, certificateType: member.certificateType || 'Membership Certificate', fullName: member.fullName, memberId: member.memberId, certId: member.certId, memberType: member.memberType, issuedAt: member.certificateIssuedAt, idValidFrom: member.idValidFrom, idValidTill: member.idValidTill }); }
    catch (error) { console.error('❌ Member certificate verification error:', error); return res.status(500).json({ valid: false, message: 'Server Error' }); }
});

function hashPassword(password) { const salt = crypto.randomBytes(16).toString('hex'); const hash = crypto.scryptSync(password, `${salt}${process.env.AUTH_PEPPER || ''}`, 64).toString('hex'); return `${salt}:${hash}`; }
module.exports = router;