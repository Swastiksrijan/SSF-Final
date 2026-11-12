const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const GovernanceVerification = require('../models/GovernanceVerification');
const Member = require('../models/Member');
const identity = require('../services/identityService');
const adminAuth = require('../services/adminAuth');
const getAdminToken = () => adminAuth.configuredToken();
const requireAdminAuth = (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7).trim() : '';
  if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' });
  next();
};

// Separate governance verification inbox. It never creates or changes a Member row.
router.post('/governance-verifications', async (req, res) => {
  try {
    const b = req.body || {};
    const requestType = String(b.requestType || '').trim();
    const fullName = String(b.fullName || '').trim();
    const email = String(b.email || '').trim().toLowerCase();
    const phone = String(b.phone || '').trim();
    const memberId = String(b.memberId || '').trim() || null;
    if (!['existing_member', 'office_bearer'].includes(requestType) || !fullName || !email || !phone) {
      return res.status(400).json({ message: 'कृपया प्रकार, पूरा नाम, ईमेल और मोबाइल भरें।' });
    }
    if (requestType === 'existing_member' && !memberId) return res.status(400).json({ message: 'पुराने सदस्य की मौजूदा Member ID आवश्यक है।' });
    if (memberId && !identity.isMemberId(memberId)) return res.status(400).json({ message: 'Member ID का प्रारूप सही नहीं है।' });
    if (requestType === 'office_bearer' && !String(b.designation || '').trim()) return res.status(400).json({ message: 'पदाधिकारी का पद भरना आवश्यक है।' });
    const duplicate = await GovernanceVerification.findOne({ where: { requestType, email, status: { [Op.in]: ['pending', 'verified'] } } });
    if (duplicate) return res.status(409).json({ message: 'इस ईमेल से इसी प्रकार का सत्यापन अनुरोध पहले से दर्ज है।' });
    const record = await GovernanceVerification.create({
      requestType, fullName, email, phone, memberId,
      designation: String(b.designation || '').trim() || null,
      address: String(b.address || '').trim() || null,
      occupation: String(b.occupation || '').trim() || null,
      requestedChanges: String(b.requestedChanges || '').trim() || null,
      termStart: b.termStart || null, termEnd: b.termEnd || null
    });
    return res.status(201).json({ status: 'success', reference: 'SSF-GOV-' + record.id.slice(0, 8).toUpperCase(), message: 'सत्यापन अनुरोध प्राप्त हुआ। समिति के सत्यापन तक मौजूदा Member ID/पद में कोई बदलाव नहीं होगा।' });
  } catch (error) {
    console.error('Governance verification submission error:', error);
    return res.status(500).json({ message: 'सत्यापन अनुरोध जमा नहीं हो सका।' });
  }
});

router.get('/admin/governance-verifications', requireAdminAuth, async (_req, res) => {
  try {
    const rows = await GovernanceVerification.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(rows);
  } catch (error) {
    console.error('Governance verification list error:', error);
    return res.status(500).json({ message: 'सत्यापन सूची लोड नहीं हो सकी।' });
  }
});

router.patch('/admin/governance-verifications/:id', requireAdminAuth, async (req, res) => {
  try {
    const row = await GovernanceVerification.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Verification request not found.' });
    const status = String(req.body?.status || '').trim();
    if (!['verified', 'changes_requested', 'rejected', 'pending'].includes(status)) return res.status(400).json({ message: 'Invalid verification status.' });
    const committeeReference = String(req.body?.committeeReference || '').trim();
    const adminNote = String(req.body?.adminNote || '').trim();
    if (status === 'verified' && !committeeReference) return res.status(400).json({ message: 'सत्यापन के लिए समिति बैठक/प्रस्ताव का संदर्भ आवश्यक है।' });
    if (status === 'verified' && row.requestType === 'existing_member' && row.memberId) {
      const registerEntry = identity.registerEntryFor(row.memberId);
      if (!registerEntry) return res.status(404).json({ message: 'यह Member ID आधिकारिक पुराने सदस्य रजिस्टर में नहीं मिली। सत्यापन रोक दिया गया है।' });
      const norm = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
      if (norm(registerEntry.name) !== norm(row.fullName)) return res.status(409).json({ message: 'दर्ज नाम पुराने सदस्य रजिस्टर से मेल नहीं खाता। मूल दस्तावेज देखकर सुधार करें।' });
      const registerEmail = norm(registerEntry.email);
      const registerMobile = String(registerEntry.mobile || '').replace(/\D/g, '').slice(-10);
      if (registerEmail && registerEmail !== norm(row.email)) return res.status(409).json({ message: 'ईमेल पुराने सदस्य रजिस्टर से मेल नहीं खाता। मूल रजिस्टर की जाँच करें।' });
      if (registerMobile && registerMobile !== String(row.phone || '').replace(/\D/g, '').slice(-10)) return res.status(409).json({ message: 'मोबाइल पुराने सदस्य रजिस्टर से मेल नहीं खाता। मूल रजिस्टर की जाँच करें।' });
      const existing = await Member.findOne({ where: { memberId: row.memberId } });
      if (existing && (String(existing.email).toLowerCase() !== row.email || String(existing.phone).replace(/\D/g, '').slice(-10) !== row.phone.replace(/\D/g, '').slice(-10))) {
        return res.status(409).json({ message: 'Member ID से जुड़ा वेबसाइट रिकॉर्ड अलग ईमेल/मोबाइल दिखा रहा है। पहले मूल रजिस्टर से मैन्युअल जाँच करें।' });
      }
    }
    await row.update({
      status, committeeReference: committeeReference || row.committeeReference,
      adminNote: adminNote || row.adminNote,
      verifiedAt: status === 'verified' ? new Date() : row.verifiedAt,
      verifiedBy: status === 'verified' ? 'Managing Committee / Admin' : row.verifiedBy
    });
    return res.json({ status: 'success', record: row });
  } catch (error) {
    console.error('Governance verification update error:', error);
    return res.status(500).json({ message: 'सत्यापन स्थिति अपडेट नहीं हो सकी।' });
  }
});

module.exports = router;
