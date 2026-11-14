const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const MemberAction = require('../models/MemberAction');
const Member = require('../models/Member');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const identity = require('../services/identityService');
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

// Every recorded stage is announced to the member by email, and the outcome is
// stamped on the record so the register can show when each proceeding finished.
// A mail failure never rolls back the saved proceeding — it is logged instead.
const STAGE = {
  notice: { label: 'नोटिस जारी हुआ', en: 'Notice issued' },
  hearing: { label: 'सुनवाई पूर्ण हुई', en: 'Hearing concluded' },
  committee: { label: 'समिति की कार्यवाही पूर्ण हुई', en: 'Committee proceedings recorded' },
  general_body: { label: 'सामान्य सभा की कार्यवाही पूर्ण हुई', en: 'General Body proceedings recorded' },
  final: { label: 'अंतिम निर्णय जारी हुआ', en: 'Final decision issued' }
};

const stageEmailHtml = (row, stage, bodyLines) =>
  '<div style="max-width:720px;margin:0 auto;padding:28px;border:1px solid #d7dee8;color:#172b3a;font:15px/1.7 Arial,sans-serif">' +
  '<h2 style="color:#12345A;margin:0 0 6px">SWASTIK SRIJAN FOUNDATION SAMITI</h2>' +
  '<p style="color:#176447;font-weight:bold;margin-top:0">' + escapeHtml(STAGE[stage].label) + '</p><hr/>' +
  '<p>प्रति: <b>' + escapeHtml(row.personName) + '</b></p>' +
  '<p>नोटिस संदर्भ: <b>' + escapeHtml(row.noticeReference || '—') + '</b></p>' +
  bodyLines.map(line => '<p>' + line + '</p>').join('') +
  '<p style="margin-top:24px;color:#64748b;font-size:12px">यह सूचना आपके अभिलेख एवं जानकारी हेतु भेजी जा रही है। Swastik Srijan Foundation Samiti</p></div>';

async function recordStageEmail(row, stage, subject, bodyLines) {
  const entry = { type: 'email', stage, label: STAGE[stage].label, to: row.email, subject, at: new Date().toISOString(), status: 'pending' };
  let warning = null;
  try {
    if (!emailConfigured()) throw new Error('ईमेल सेवा कॉन्फ़िगर नहीं है।');
    const text = [
      'स्वास्तिक सृजन फाउंडेशन समिति',
      STAGE[stage].label,
      'प्रति: ' + row.personName,
      'नोटिस संदर्भ: ' + (row.noticeReference || '—'),
      ...bodyLines.map(line => line.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()),
      'Swastik Srijan Foundation Samiti'
    ].join('\n\n');
    await sendMail({ to: row.email, subject, text, html: stageEmailHtml(row, stage, bodyLines) });
    entry.status = 'sent';
  } catch (e) {
    console.error('Stage email (' + stage + ') failed:', e.message);
    entry.status = 'failed';
    entry.error = e.message;
    warning = 'रिकॉर्ड सुरक्षित है, पर सदस्य को ईमेल नहीं भेजा जा सका: ' + e.message;
  }
  const log = Array.isArray(row.emailLog) ? [...row.emailLog, entry] : [entry];
  await row.update({ emailLog: log });
  return warning;
}

function noticeFinancialYear(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit' }).formatToParts(date);
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  const y = Number(p.year), m = Number(p.month), start = m >= 4 ? y : y - 1;
  return start + '-' + String(start + 1).slice(-2);
}
async function nextNoticeReference(transaction) {
  const fy = noticeFinancialYear();
  const prefix = 'SSF/NOTICE/' + fy + '/';
  await sequelize.query('SELECT pg_advisory_xact_lock(hashtext(:lockKey))', { replacements: { lockKey: 'ssf-notice-' + fy }, transaction });
  const refs = await MemberAction.findAll({ attributes: ['noticeReference'], where: { noticeReference: { [Op.like]: prefix + '%' } }, transaction, raw: true });
  const highest = refs.reduce((n, item) => Math.max(n, Number(String(item.noticeReference || '').split('/').pop()) || 0), 0);
  return prefix + String(highest + 1).padStart(4, '0');
}


router.get('/admin/member-actions', requireAdmin, async (_req, res) => {
  try { const rows = await MemberAction.findAll({ order: [['createdAt', 'DESC']] }); res.json(rows.map(publicRecord)); }
  catch (e) { console.error('Member action list:', e); res.status(500).json({ message: 'नोटिस रजिस्टर लोड नहीं हो सका।' }); }
});

// Match an existing registered member by exact email/mobile or a name fragment.
// Multiple matches are returned for explicit selection; never guess an ID.
router.get('/admin/member-actions/member-lookup', requireAdmin, async (req, res) => {
  try {
    const name = String(req.query.name || '').trim().toLocaleLowerCase('en-IN');
    const email = String(req.query.email || '').trim().toLowerCase();
    const phone = String(req.query.phone || '').replace(/\D/g, '').slice(-10);
    if (!name && !email && !phone) return res.status(400).json({ message: 'नाम, ईमेल या मोबाइल दर्ज करें।' });
    const dbRows = await Member.findAll({ attributes: ['memberId', 'fullName', 'email', 'phone', 'designation'], raw: true });
    const byId = new Map();
    for (const entry of identity.registerEntries()) {
      byId.set(entry.memberId, { memberId: entry.memberId, fullName: entry.name, email: entry.email || '', phone: entry.mobile || '', designation: entry.designation || '' });
    }
    for (const member of dbRows) {
      if (!member.memberId) continue;
      const old = byId.get(member.memberId) || {};
      byId.set(member.memberId, { ...old, memberId: member.memberId, fullName: member.fullName || old.fullName || '', email: member.email || old.email || '', phone: member.phone || old.phone || '', designation: member.designation || old.designation || '' });
    }
    const digits = value => String(value || '').replace(/\D/g, '').slice(-10);
    const matches = [...byId.values()].filter(person =>
      (!name || String(person.fullName || '').toLocaleLowerCase('en-IN').includes(name)) &&
      (!email || String(person.email || '').trim().toLowerCase() === email) &&
      (!phone || digits(person.phone) === phone)
    ).slice(0, 20);
    return res.json({ matches });
  } catch (e) { console.error('Member lookup:', e); return res.status(500).json({ message: 'सदस्य रजिस्टर से मिलान नहीं हो सका।' }); }
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
    const row = await sequelize.transaction(async transaction => MemberAction.create({
      noticeReference: await nextNoticeReference(transaction),
      personName: String(b.personName).trim(), email: String(b.email).trim().toLowerCase(),
      phone: String(b.phone || '').trim() || null, memberId: String(b.memberId || '').trim() || null,
      currentDesignation: String(b.currentDesignation || '').trim() || null,
      actionScope: b.actionScope, bylawClause: String(b.bylawClause).trim(),
      grounds: String(b.grounds).trim(), factualSummary: String(b.factualSummary).trim(),
      noticeText: String(b.noticeText || '').trim() || null, replyDueAt: due, createdBy: 'Admin Portal'
    }, { transaction }));
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
      if (!row.noticeReference) await row.update({ noticeReference: await sequelize.transaction(t => nextNoticeReference(t)) });
      const rawToken = crypto.randomBytes(32).toString('hex');
      const baseUrl = (process.env.FRONTEND_PUBLIC_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
      const responseUrl = baseUrl + '/Members?notice=' + rawToken;
      const customNotice = String(row.noticeText || '').trim();
      const textBody = [
        'स्वास्तिक सृजन फाउंडेशन समिति',
        'कारण बताओ नोटिस',
        'दिनांक: ' + new Date().toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata' }),
        'प्रति: ' + row.personName,
        'सदस्य ID: ' + (row.memberId || 'रजिस्टर में उपलब्ध नहीं / पुष्टि अपेक्षित'),
        'वर्तमान पद: ' + (row.currentDesignation || 'रिकॉर्ड अनुसार'),
        'संपर्क ईमेल: ' + row.email,
        'नोटिस संदर्भ संख्या: ' + row.noticeReference,
        'विषय: अपना पक्ष/स्पष्टीकरण प्रस्तुत करने के संबंध में।',
        customNotice ? 'अतिरिक्त विवरण: ' + customNotice : '',
        'लागू नियम/उप-नियम: ' + row.bylawClause,
        'प्रस्तावित कार्रवाई का कारण: ' + row.grounds,
        'तथ्य एवं उपलब्ध रिकॉर्ड: ' + row.factualSummary,
        'आपसे अनुरोध है कि नीचे दी गई अंतिम तारीख तक अपना लिखित जवाब और यदि चाहें तो सहायक दस्तावेज प्रस्तुत करें: ' + new Date(row.replyDueAt).toLocaleString('hi-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata' }),
        'ऑनलाइन जवाब देने का लिंक: ' + responseUrl,
        'यदि आप व्यक्तिगत/ऑनलाइन सुनवाई चाहते हैं, तो जवाब में इसकी मांग और सुविधाजनक संपर्क विवरण लिखें।',
        'आपका जवाब और उपलब्ध रिकॉर्ड निष्पक्ष रूप से सक्षम समिति/निकाय के सामने रखा जाएगा।',
        'महत्वपूर्ण: यह नोटिस केवल आरोप/प्रस्तावित कार्रवाई की जानकारी देकर आपका पक्ष सुनने का अवसर है। इसे दोष सिद्धि, सदस्यता समाप्ति या पद से हटाने का अंतिम आदेश न माना जाए। अंतिम निर्णय केवल लागू नियमों और विधिवत प्रक्रिया के बाद ही लिया जा सकता है।'
      ].filter(Boolean).join('\n\n');
      const logoUrl = String(b.logoUrl || '').trim();
      let safeLogoUrl = '';
      try {
        const parsed = new URL(logoUrl);
        if (parsed.protocol === 'https:' && (parsed.hostname === 'swastiksrijan.in' || parsed.hostname.endsWith('.swastiksrijan.in') || parsed.hostname.endsWith('.vercel.app'))) safeLogoUrl = parsed.href;
      } catch { /* optional logo */ }
      const htmlBody = '<div style="max-width:760px;margin:0 auto;padding:30px 36px;border:1px solid #d7dee8;color:#172b3a;font-family:Arial,sans-serif;line-height:1.65;background:#fff">' +
        '<div style="display:flex;align-items:center;gap:18px;border-bottom:3px solid #176447;padding-bottom:18px;margin-bottom:22px">' +
        (safeLogoUrl ? '<img src="' + escapeHtml(safeLogoUrl) + '" alt="Swastik Srijan Foundation Samiti logo" style="width:86px;height:86px;object-fit:contain" />' : '') +
        '<div><div style="font-size:22px;font-weight:800;color:#12345A">SWASTIK SRIJAN FOUNDATION SAMITI</div><div style="font-size:16px;font-weight:700;color:#176447">स्वास्तिक सृजन फाउंडेशन समिति</div><div style="font-size:12px;color:#64748b">आधिकारिक सूचना / Official Communication</div></div></div>' +
        '<div style="display:flex;justify-content:space-between;gap:12px;font-size:13px"><b>नोटिस संदर्भ: ' + escapeHtml(row.noticeReference || '') + '</b><b>दिनांक: ' + escapeHtml(new Date().toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata' })) + '</b></div>' +
        '<h2 style="text-align:center;color:#12345A;font-size:19px;margin:24px 0 18px">कारण बताओ नोटिस</h2><div style="white-space:pre-wrap">' + escapeHtml(textBody) + '</div><p style="text-align:center;margin:26px 0"><a href="' + escapeHtml(responseUrl) + '" style="display:inline-block;background:#12345A;color:#fff;text-decoration:none;padding:12px 22px;border-radius:7px;font-weight:bold">ऑनलाइन जवाब दें</a></p>' +
        '<div style="margin-top:30px;padding-top:14px;border-top:1px solid #d7dee8;font-size:12px;color:#64748b">Swastik Srijan Foundation Samiti | यह नोटिस संस्था के अभिलेख हेतु जारी किया गया है।</div></div>';
      let delivery = 'not_sent';
      let emailWarning = null;
      if (['email', 'email_and_post'].includes(method)) {
        if (!emailConfigured()) return res.status(503).json({ message: 'ईमेल सेवा कॉन्फ़िगर नहीं है। पहले डाक से भेजें या ईमेल सेवा सेट करें।' });
        try {
          await sendMail({ to: row.email, subject: 'SSF कारण बताओ नोटिस — ' + row.noticeReference + ' — ' + row.personName, text: textBody, html: htmlBody });
          delivery = 'email_sent';
        } catch (emailError) {
          // Do not issue a notice or activate its reply link unless the required
          // email dispatch actually succeeds. Keep the draft retryable.
          console.error('⚠️ Notice email failed:', emailError.message);
          await row.update({
            dispatchMethod: method,
            dispatchReference: dispatchReference || null,
            emailDeliveryStatus: 'email_failed',
            updatedBy: 'Admin Portal'
          });
          return res.status(502).json({
            message: 'नोटिस जारी नहीं हुआ क्योंकि ईमेल भेजना विफल रहा। Sender email/Brevo सेटिंग ठीक करके इसी ड्राफ्ट से दोबारा जारी करें।',
            emailDeliveryStatus: 'email_failed'
          });
        }
      }
      await row.update({ noticeText: textBody, responseTokenHash: hashToken(rawToken), status: 'notice_issued', dispatchMethod: method, dispatchReference: dispatchReference || null, dispatchAt: new Date(), emailDeliveryStatus: delivery, updatedBy: 'Admin Portal' });
      return res.json({ status: 'success', record: publicRecord(row), responseUrl, emailWarning: null });
    }
    if (b.action === 'hearing') {
      const hearingAt = new Date(b.hearingAt);
      if (!Number.isFinite(hearingAt.getTime()) || !String(b.hearingNotes || '').trim()) return res.status(400).json({ message: 'सुनवाई की तारीख और विवरण आवश्यक हैं।' });
      const outcome = String(b.hearingOutcome || '').trim();
      await row.update({ hearingAt, hearingNotes: String(b.hearingNotes).trim(), hearingOutcome: outcome || null, hearingCompletedAt: new Date(), status: 'hearing_scheduled', updatedBy: 'Admin Portal' });
      const emailWarning = await recordStageEmail(row, 'hearing', 'SSF — सुनवाई पूर्ण | ' + (row.noticeReference || row.id), [
        'सुनवाई की तारीख: ' + hearingAt.toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' }),
        'सुनवाई का विवरण: ' + escapeHtml(String(b.hearingNotes).trim()),
        outcome ? 'सुनवाई का परिणाम/सार: ' + escapeHtml(outcome) : '',
        'अगला चरण: समिति की कार्यवाही दर्ज की जाएगी।'
      ].filter(Boolean));
      return res.json({ status: 'success', record: publicRecord(row), emailWarning });
    } else if (b.action === 'committee_review') {
      const mayReview = ['reply_received', 'hearing_scheduled'].includes(row.status) || (row.status === 'notice_issued' && Date.now() > new Date(row.replyDueAt).getTime());
      if (!mayReview) return res.status(409).json({ message: 'समिति समीक्षा से पहले जवाब की अवधि पूरी होने दें और प्राप्त जवाब/सुनवाई रिकॉर्ड करें।' });
      const meetingRef = String(b.committeeMeetingReference || '').trim();
      const decisionText = String(b.decisionText || '').trim();
      if (!meetingRef || !decisionText) return res.status(400).json({ message: 'समिति बैठक/प्रस्ताव संदर्भ और कार्यवाही दर्ज करें।' });
      await row.update({ committeeMeetingReference: meetingRef, committeeDecisionText: decisionText, committeeReviewCompletedAt: new Date(), status: 'committee_review', updatedBy: 'Admin Portal' });
      // The committee record is saved first. Then send the member an official
      // email copy; delivery failure must not erase the valid proceedings.
      const emailWarning = await recordStageEmail(row, 'committee', 'SSF — समिति की कार्यवाही पूर्ण | ' + (row.noticeReference || row.id), [
        'समिति बैठक/प्रस्ताव संदर्भ: ' + escapeHtml(meetingRef),
        'कार्यवाही पूर्ण दिनांक: ' + escapeHtml(new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' })),
        'दर्ज कार्यवाही: ' + escapeHtml(decisionText),
        'आगे की प्रक्रिया, यदि आवश्यक हो, तो अलग से सूचित की जाएगी।'
      ]);
      return res.json({ status: 'success', record: publicRecord(row), emailWarning });
    } else if (b.action === 'general_body_review') {
      if (row.status !== 'committee_review') return res.status(409).json({ message: 'पहले प्रबंध समिति की समीक्षा और कार्यवाही दर्ज करें।' });
      if (!String(b.generalBodyMeetingReference || '').trim() || !String(b.decisionText || '').trim()) return res.status(400).json({ message: 'सामान्य सभा की बैठक/प्रस्ताव संख्या और निर्णय दर्ज करें।' });
      const gbRef = String(b.generalBodyMeetingReference).trim();
      const gbText = String(b.decisionText).trim();
      await row.update({ generalBodyMeetingReference: gbRef, generalBodyDecisionText: gbText, generalBodyReviewCompletedAt: new Date(), status: 'general_body_review', updatedBy: 'Admin Portal' });
      const emailWarning = await recordStageEmail(row, 'general_body', 'SSF — सामान्य सभा की कार्यवाही पूर्ण | ' + (row.noticeReference || row.id), [
        'सामान्य सभा बैठक/प्रस्ताव संदर्भ: ' + escapeHtml(gbRef),
        'कार्यवाही पूर्ण दिनांक: ' + escapeHtml(new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' })),
        'दर्ज कार्यवाही: ' + escapeHtml(gbText),
        'अगला चरण: अंतिम निर्णय दर्ज किया जाएगा।'
      ]);
      return res.json({ status: 'success', record: publicRecord(row), emailWarning });
    } else if (b.action === 'close') {
      if (!['committee_review', 'general_body_review'].includes(row.status)) return res.status(409).json({ message: 'अंतिम निर्णय से पहले समिति समीक्षा और आवश्यक सामान्य सभा प्रक्रिया पूरी करें।' });
      const decisionType = String(b.decisionType || '').trim();
      if (!['no_action', 'advisory', 'warning', 'role_change_approved', 'membership_termination_approved', 'other'].includes(decisionType) || !String(b.decisionText || '').trim()) return res.status(400).json({ message: 'अंतिम निर्णय का प्रकार और पूरा आदेश दर्ज करें।' });
      if (['role_change_approved', 'membership_termination_approved'].includes(decisionType) && (row.status !== 'general_body_review' || !String(b.generalBodyMeetingReference || '').trim())) return res.status(400).json({ message: 'पद/सदस्यता समाप्ति दर्ज करने से पहले सामान्य सभा की विधिवत कार्यवाही और प्रस्ताव संदर्भ आवश्यक है।' });
      if (decisionType === 'role_change_approved' && row.actionScope !== 'office_bearer_role_review') return res.status(400).json({ message: 'यह रिकॉर्ड पदाधिकारी पद की समीक्षा के लिए नहीं है।' });
      if (decisionType === 'membership_termination_approved' && row.actionScope !== 'membership_review') return res.status(400).json({ message: 'यह रिकॉर्ड सदस्यता समीक्षा के लिए नहीं है।' });
      await row.update({ decisionType, decisionText: String(b.decisionText).trim(), decisionAt: new Date(), status: 'closed', generalBodyMeetingReference: String(b.generalBodyMeetingReference || row.generalBodyMeetingReference || '').trim() || null, committeeMeetingReference: String(b.committeeMeetingReference || row.committeeMeetingReference || '').trim() || null, updatedBy: 'Admin Portal' });
      const DECISION_LABEL = { no_action: 'कोई कार्रवाई नहीं', advisory: 'सलाह', warning: 'चेतावनी', role_change_approved: 'पद में परिवर्तन', membership_termination_approved: 'सदस्यता समाप्ति', other: 'अन्य निर्णय' };
      const emailWarning = await recordStageEmail(row, 'final', 'SSF — अंतिम निर्णय | ' + (row.noticeReference || row.id), [
        'निर्णय का प्रकार: ' + escapeHtml(DECISION_LABEL[decisionType] || decisionType),
        'निर्णय दिनांक: ' + escapeHtml(new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' })),
        'अंतिम आदेश/कारण: ' + escapeHtml(String(b.decisionText).trim()),
        'यह प्रक्रिया अब पूर्ण मानी जाती है।'
      ]);
      return res.json({ status: 'success', record: publicRecord(row), emailWarning });
    } else if (b.action === 'edit_details') {
      const personName = String(b.personName || '').trim();
      const email = String(b.email || '').trim().toLowerCase();
      const bylawClause = String(b.bylawClause || '').trim();
      const grounds = String(b.grounds || '').trim();
      const factualSummary = String(b.factualSummary || '').trim();
      if (!personName || !email || !bylawClause || !grounds || !factualSummary) return res.status(400).json({ message: 'नाम, ईमेल, लागू नियम, कारण और तथ्य आवश्यक हैं।' });
      const scope = String(b.actionScope || row.actionScope).trim();
      if (!['membership_review', 'office_bearer_role_review'].includes(scope)) return res.status(400).json({ message: 'कार्रवाई का सही दायरा चुनें।' });
      // A recorded final order constrains the scope it was decided under.
      if (row.decisionType === 'role_change_approved' && scope !== 'office_bearer_role_review') return res.status(400).json({ message: 'इस रिकॉर्ड का अंतिम निर्णय पद परिवर्तन का है — दायरा बदला नहीं जा सकता।' });
      if (row.decisionType === 'membership_termination_approved' && scope !== 'membership_review') return res.status(400).json({ message: 'इस रिकॉर्ड का अंतिम निर्णय सदस्यता समाप्ति का है — दायरा बदला नहीं जा सकता।' });
      const due = b.replyDueAt ? new Date(b.replyDueAt) : new Date(row.replyDueAt);
      if (!Number.isFinite(due.getTime())) return res.status(400).json({ message: 'जवाब की अंतिम तारीख सही नहीं है।' });
      const next = {
        personName, email,
        phone: String(b.phone || '').trim() || null,
        memberId: String(b.memberId || '').trim() || null,
        currentDesignation: String(b.currentDesignation || '').trim() || null,
        actionScope: scope, bylawClause, grounds, factualSummary, replyDueAt: due,
        updatedBy: 'Admin Portal'
      };
      // The issued copy of the notice is an institutional record: its stored text
      // is only editable while the record is still a draft.
      if (row.status === 'draft' && b.noticeText !== undefined) next.noticeText = String(b.noticeText || '').trim() || null;
      const changed = Object.keys(next).filter(k => k !== 'updatedBy' && String(row[k] ?? '') !== String(next[k] ?? ''));
      await row.update(next);
      const entry = { type: 'edit', stage: 'edit', label: 'विवरण संशोधित', at: new Date().toISOString(), status: 'recorded', fields: changed };
      const log = Array.isArray(row.emailLog) ? [...row.emailLog, entry] : [entry];
      await row.update({ emailLog: log });
      return res.json({ status: 'success', record: publicRecord(row) });
    } else if (b.action !== 'save_draft') return res.status(400).json({ message: 'अमान्य कार्रवाई।' });
    return res.json({ status: 'success', record: publicRecord(row) });
  } catch (e) { console.error('Member action update:', e); res.status(500).json({ message: 'कार्रवाई सुरक्षित नहीं हो सकी। कृपया कुछ क्षण बाद पुनः प्रयास करें; समस्या बनी रहे तो नोटिस Ref. No. बताकर संस्था से संपर्क करें।' }); }
});

// Remove a notice that was never issued — a test entry, a wrong person, or a
// mistake caught before dispatch. Once a notice has been issued to a real
// person (any status other than 'draft') it is part of the institution's
// record and is kept: to retire it, record a final 'no_action' decision.
router.delete('/admin/member-actions/:id', requireAdmin, async (req, res) => {
  try {
    const row = await MemberAction.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'नोटिस रिकॉर्ड नहीं मिला।' });
    // Drafts delete freely. An issued/closed record breaks the member's reply
    // link if removed, so it needs an explicit override (force=true) that the
    // portal only offers behind a warning naming the person.
    const force = String(req.query.force || '') === 'true';
    if (row.status !== 'draft' && !force) {
      return res.status(409).json({ message: 'जारी हो चुका नोटिस रिकॉर्ड सीधे हटाया नहीं जा सकता। सचेत रहते हुए हटाने के लिए पुष्टि करें।' });
    }
    await row.destroy();
    return res.json({ status: 'success' });
  } catch (e) { console.error('Member action delete:', e); return res.status(500).json({ message: 'रिकॉर्ड हटाया नहीं जा सका।' }); }
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
