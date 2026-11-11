const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const MemberAction = require('../models/MemberAction');
const { sendMail, emailConfigured } = require('../services/mailer');

const adminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token || token !== adminToken()) return res.status(401).json({ message: 'Unauthorized admin access' });
  next();
};
const hashToken = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const publicRecord = row => {
  const value = row.toJSON();
  delete value.responseTokenHash;
  delete value.createdBy;
  delete value.updatedBy;
  return value;
};
const escapeHtml = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

router.get('/admin/member-actions', requireAdmin, async (_req, res) => {
  try { const rows = await MemberAction.findAll({ order: [['createdAt', 'DESC']] }); res.json(rows.map(publicRecord)); }
  catch (e) { console.error('Member action list:', e); res.status(500).json({ message: 'नोटिस रजिस्टर लोड नहीं हो सका।' }); }
});

router.post('/admin/member-actions', requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const required = ['personName', 'email', 'actionScope', 'bylawClause', 'grounds', 'factualSummary', 'replyDueAt'];
    if (required.some(k => !String(b[k] || '').trim()) || !['membership_review', 'office_bearer_role_review'].includes(b.actionScope)) {
      return res.status(400).json({ message: 'नाम, ईमेल, कार्रवाई का दायरा, नियम, कारण, तथ्य और जवाब की अंतिम तारीख आवश्यक हैं।' });
    }
    const due = new Date(b.replyDueAt);
    if (!Number.isFinite(due.getTime()) || due.getTime() <= Date.now()) return res.status(400).json({ message: 'जवाब की अंतिम तारीख भविष्य की होनी चाहिए।' });
    const row = await MemberAction.create({
      personName: String(b.personName).trim(), email: String(b.email).trim().toLowerCase(),
      phone: String(b.phone || '').trim() || null, memberId: String(b.memberId || '').trim() || null,
      currentDesignation: String(b.currentDesignation || '').trim() || null,
      actionScope: b.actionScope, bylawClause: String(b.bylawClause).trim(),
      grounds: String(b.grounds).trim(), factualSummary: String(b.factualSummary).trim(),
      noticeText: String(b.noticeText || '').trim() || null, replyDueAt: due, createdBy: 'Admin Portal'
    });
    res.status(201).json(publicRecord(row));
  } catch (e) { console.error('Member action create:', e); res.status(500).json({ message: 'नोटिस ड्राफ्ट सेव नहीं हो सका।' }); }
});

router.patch('/admin/member-actions/:id', requireAdmin, async (req, res) => {
  try {
    const row = await MemberAction.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'नोटिस रिकॉर्ड नहीं मिला।' });
    const b = req.body || {};
    if (b.action === 'issue_notice') {
      if (row.status !== 'draft') return res.status(409).json({ message: 'यह नोटिस पहले ही जारी हो चुका है।' });
      const method = String(b.dispatchMethod || '').trim();
      const dispatchReference = String(b.dispatchReference || '').trim();
      if (!['email', 'registered_post', 'speed_post', 'hand_delivery', 'email_and_post'].includes(method)) return res.status(400).json({ message: 'भेजने का सही माध्यम चुनें।' });
      if (['registered_post', 'speed_post', 'hand_delivery', 'email_and_post'].includes(method) && !dispatchReference) return res.status(400).json({ message: 'डाक रसीद/हैंड डिलीवरी प्रमाण का विवरण दर्ज करें।' });
      const rawToken = crypto.randomBytes(32).toString('hex');
      const baseUrl = (process.env.FRONTEND_PUBLIC_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
      const responseUrl = baseUrl + '/Members?notice=' + rawToken;
      const textBody = row.noticeText || [
        'स्वस्तिक सृजन फाउंडेशन समिति',
        'कारण बताओ नोटिस',
        'प्रति: ' + row.personName,
        'सदस्यता/पद: ' + (row.currentDesignation || row.memberId || 'रिकॉर्ड अनुसार'),
        'नियमावली: ' + row.bylawClause,
        'कारण: ' + row.grounds,
        'तथ्य: ' + row.factualSummary,
        'कृपया ' + new Date(row.replyDueAt).toLocaleDateString('hi-IN') + ' तक अपना लिखित जवाब दें।',
        'ऑनलाइन जवाब: ' + responseUrl,
        'यह नोटिस केवल पक्ष रखने का अवसर है; यह निष्कासन/पद से हटाने का अंतिम आदेश नहीं है।'
      ].join('\n');
      let delivery = 'not_sent';
      if (['email', 'email_and_post'].includes(method)) {
        if (!emailConfigured()) return res.status(503).json({ message: 'ईमेल सेवा कॉन्फ़िगर नहीं है। पहले डाक से भेजें या ईमेल सेवा सेट करें।' });
        await sendMail({ to: row.email, subject: 'SSF कारण बताओ नोटिस — ' + row.personName, text: textBody, html: '<div style="font-family:Arial,sans-serif;white-space:pre-line">' + escapeHtml(textBody) + '</div><p><a href="' + responseUrl + '">ऑनलाइन जवाब दें</a></p>' });
        delivery = 'email_sent';
      }
      await row.update({ noticeText: textBody, responseTokenHash: hashToken(rawToken), status: 'notice_issued', dispatchMethod: method, dispatchReference: dispatchReference || null, dispatchAt: new Date(), emailDeliveryStatus: delivery, updatedBy: 'Admin Portal' });
      return res.json({ status: 'success', record: publicRecord(row), responseUrl });
    }
    if (b.action === 'hearing') {
      const hearingAt = new Date(b.hearingAt);
      if (!Number.isFinite(hearingAt.getTime()) || !String(b.hearingNotes || '').trim()) return res.status(400).json({ message: 'सुनवाई की तारीख और विवरण आवश्यक हैं।' });
      await row.update({ hearingAt, hearingNotes: String(b.hearingNotes).trim(), status: 'hearing_scheduled', updatedBy: 'Admin Portal' });
    } else if (b.action === 'committee_review') {
      const mayReview = ['reply_received', 'hearing_scheduled'].includes(row.status) || (row.status === 'notice_issued' && Date.now() > new Date(row.replyDueAt).getTime());
      if (!mayReview) return res.status(409).json({ message: 'समिति समीक्षा से पहले जवाब की अवधि पूरी होने दें और प्राप्त जवाब/सुनवाई रिकॉर्ड करें।' });
      if (!String(b.committeeMeetingReference || '').trim() || !String(b.decisionText || '').trim()) return res.status(400).json({ message: 'समिति बैठक/प्रस्ताव संदर्भ और कार्यवाही दर्ज करें।' });
      await row.update({ committeeMeetingReference: String(b.committeeMeetingReference).trim(), decisionText: String(b.decisionText).trim(), status: 'committee_review', updatedBy: 'Admin Portal' });
    } else if (b.action === 'general_body_review') {
      if (row.status !== 'committee_review') return res.status(409).json({ message: 'पहले प्रबंध समिति की समीक्षा और कार्यवाही दर्ज करें।' });
      if (!String(b.generalBodyMeetingReference || '').trim() || !String(b.decisionText || '').trim()) return res.status(400).json({ message: 'सामान्य सभा की बैठक/प्रस्ताव संख्या और निर्णय दर्ज करें।' });
      await row.update({ generalBodyMeetingReference: String(b.generalBodyMeetingReference).trim(), decisionText: String(b.decisionText).trim(), status: 'general_body_review', updatedBy: 'Admin Portal' });
    } else if (b.action === 'close') {
      if (!['committee_review', 'general_body_review'].includes(row.status)) return res.status(409).json({ message: 'अंतिम निर्णय से पहले समिति समीक्षा और आवश्यक सामान्य सभा प्रक्रिया पूरी करें।' });
      const decisionType = String(b.decisionType || '').trim();
      if (!['no_action', 'advisory', 'warning', 'role_change_approved', 'membership_termination_approved', 'other'].includes(decisionType) || !String(b.decisionText || '').trim()) return res.status(400).json({ message: 'अंतिम निर्णय का प्रकार और पूरा आदेश दर्ज करें।' });
      if (['role_change_approved', 'membership_termination_approved'].includes(decisionType) && (row.status !== 'general_body_review' || !String(b.generalBodyMeetingReference || '').trim())) return res.status(400).json({ message: 'पद/सदस्यता समाप्ति दर्ज करने से पहले सामान्य सभा की विधिवत कार्यवाही और प्रस्ताव संदर्भ आवश्यक है।' });
      if (decisionType === 'role_change_approved' && row.actionScope !== 'office_bearer_role_review') return res.status(400).json({ message: 'यह रिकॉर्ड पदाधिकारी पद की समीक्षा के लिए नहीं है।' });
      if (decisionType === 'membership_termination_approved' && row.actionScope !== 'membership_review') return res.status(400).json({ message: 'यह रिकॉर्ड सदस्यता समीक्षा के लिए नहीं है।' });
      await row.update({ decisionType, decisionText: String(b.decisionText).trim(), decisionAt: new Date(), status: 'closed', generalBodyMeetingReference: String(b.generalBodyMeetingReference || row.generalBodyMeetingReference || '').trim() || null, committeeMeetingReference: String(b.committeeMeetingReference || row.committeeMeetingReference || '').trim() || null, updatedBy: 'Admin Portal' });
    } else if (b.action !== 'save_draft') return res.status(400).json({ message: 'अमान्य कार्रवाई।' });
    return res.json({ status: 'success', record: publicRecord(row) });
  } catch (e) { console.error('Member action update:', e); res.status(500).json({ message: 'नोटिस प्रक्रिया अपडेट नहीं हो सकी।' }); }
});

router.get('/member-action-response/:token', async (req, res) => {
  try {
    const row = await MemberAction.findOne({ where: { responseTokenHash: hashToken(req.params.token), status: ['notice_issued', 'reply_received', 'hearing_scheduled', 'committee_review', 'general_body_review'] } });
    if (!row) return res.status(404).json({ message: 'यह जवाब लिंक अमान्य या बंद है। संस्था से संपर्क करें।' });
    res.json({ personName: row.personName, bylawClause: row.bylawClause, grounds: row.grounds, factualSummary: row.factualSummary, noticeText: row.noticeText, replyDueAt: row.replyDueAt, status: row.status, replyReceivedAt: row.replyReceivedAt });
  } catch (e) { console.error('Member action response lookup:', e); res.status(500).json({ message: 'नोटिस लोड नहीं हो सका।' }); }
});

router.post('/member-action-response/:token', async (req, res) => {
  try {
    const row = await MemberAction.findOne({ where: { responseTokenHash: hashToken(req.params.token), status: 'notice_issued' } });
    if (!row) return res.status(404).json({ message: 'यह जवाब लिंक अमान्य है या जवाब पहले ही जमा हो चुका है।' });
    if (Date.now() > new Date(row.replyDueAt).getTime()) return res.status(410).json({ message: 'जवाब की अंतिम तारीख निकल चुकी है। अपना पक्ष रखने के लिए संस्था से संपर्क करें।' });
    const reply = String(req.body?.replyText || '').trim();
    if (reply.length < 20) return res.status(400).json({ message: 'कृपया कम से कम 20 अक्षरों में अपना जवाब लिखें।' });
    await row.update({ replyText: reply, replyReceivedAt: new Date(), status: 'reply_received' });
    res.json({ status: 'success', message: 'आपका जवाब सुरक्षित रूप से प्राप्त हो गया है। अंतिम निर्णय से पहले इसे रिकॉर्ड में लिया जाएगा।' });
  } catch (e) { console.error('Member action reply:', e); res.status(500).json({ message: 'जवाब जमा नहीं हो सका।' }); }
});

module.exports = router;
