const express = require('express');
const crypto = require('crypto');
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');

const router = express.Router();
const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const absolute = value => value ? (/^https?:\/\//i.test(value) ? value : `${(process.env.BACKEND_PUBLIC_URL || 'https://ngo-backend-03hq.onrender.com').replace(/\/$/, '')}${value.startsWith('/') ? '' : '/'}${value}`) : '';
const publicVerification = id => `${FRONTEND_URL}/verify/${encodeURIComponent(id)}`;
const requireAccount = async (req, res) => {
    const accountId = String(req.query.account || '').trim();
    if (!accountId) { res.status(400).json({ message: 'Account reference is required.' }); return null; }
    const member = await Member.findByPk(accountId, { attributes: ['id','fullName','email','phone','memberType','status','memberId','certId','certificateType','certificateIssuedAt','profilePhotoPath','createdAt'] });
    if (!member) { res.status(404).json({ message: 'Account not found.' }); return null; }
    return member;
};

const baseStyle = `body{font-family:Arial,Helvetica,sans-serif;background:#eef3f6;margin:0;color:#17324d}.sheet{width:900px;max-width:calc(100vw - 32px);margin:32px auto;background:#fff;border:1px solid #d9e2e8;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(0,35,68,.12)}.head{background:#002344;color:#fff;padding:28px 34px}.brand{font-size:13px;letter-spacing:2px;font-weight:800}.title{font-size:28px;font-weight:900;margin:8px 0}.body{padding:36px}.muted{color:#667788}.row{display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid #e7edf1;padding:13px 0}.value{font-weight:800;color:#002344}.footer{padding:20px 34px;background:#f7fafb;font-size:12px;color:#667788}.print{position:fixed;right:20px;top:20px;background:#ff6600;color:#fff;border:0;border-radius:10px;padding:12px 16px;font-weight:800;cursor:pointer}@media print{body{background:#fff}.sheet{width:100%;max-width:none;margin:0;border:0;box-shadow:none}.print{display:none}}`;
const htmlDocument = (title, body, verificationId) => `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${baseStyle}</style></head><body><button class="print" onclick="window.print()">Print / Save as PDF</button><main class="sheet"><header class="head"><div class="brand">SWASTIK SRIJAN FOUNDATION SAMITI</div><div class="title">${escapeHtml(title)}</div><div>Official document • Rewa, Madhya Pradesh, India</div></header><section class="body">${body}</section><footer class="footer">Document ID: <strong>${escapeHtml(verificationId || '—')}</strong><br>Verify authenticity: ${escapeHtml(publicVerification(verificationId || ''))}</footer></main></body></html>`;
const row = (label, value) => `<div class="row"><span class="muted">${escapeHtml(label)}</span><span class="value">${escapeHtml(value || '—')}</span></div>`;

router.get('/user-document/:type/:id', async (req, res) => {
    try {
        const member = await requireAccount(req, res); if (!member) return;
        const type = String(req.params.type || '').toLowerCase();
        const id = String(req.params.id || '').trim();
        const email = String(member.email || '').toLowerCase();
        let title = '', docId = id, body = '';

        if (type === 'membership-id' || type === 'membership-certificate') {
            if (member.status !== 'approved' || !member.memberId || (id !== member.memberId && id !== member.certId)) return res.status(403).send('Document is not available for this account.');
            const isId = type === 'membership-id'; title = isId ? 'Membership Identity Card' : 'Membership Certificate'; docId = isId ? member.memberId : member.certId;
            const photo = absolute(member.profilePhotoPath);
            if (isId) body = `<div style="display:flex;gap:28px;align-items:center"><div style="width:150px;height:180px;border-radius:14px;background:#edf2f5;overflow:hidden;display:flex;align-items:center;justify-content:center">${photo ? `<img src="${escapeHtml(photo)}" style="width:100%;height:100%;object-fit:cover">` : '<span class="muted">PHOTO</span>'}</div><div style="flex:1">${row('Name', member.fullName)}${row('Member ID', member.memberId)}${row('Membership Type', member.memberType)}${row('Certificate ID', member.certId)}${row('Issued', member.certificateIssuedAt ? new Date(member.certificateIssuedAt).toLocaleDateString('en-IN') : '')}</div></div>`;
            else body = `<h2 style="font-size:34px;margin-top:0">Certificate of Membership</h2><p>This is to certify that</p><h1 style="font-size:34px;color:#002344">${escapeHtml(member.fullName)}</h1><p>has been approved as a member of <strong>Swastik Srijan Foundation Samiti</strong>.</p>${row('Membership ID', member.memberId)}${row('Certificate ID', member.certId)}${row('Membership Type', member.memberType)}${row('Issue Date', member.certificateIssuedAt ? new Date(member.certificateIssuedAt).toLocaleDateString('en-IN') : '')}`;
        } else if (type === 'volunteer-id' || type === 'volunteer-certificate') {
            const volunteer = await Volunteer.findOne({ where: { email }, order: [['createdAt','DESC']] });
            if (!volunteer || volunteer.status !== 'approved' || (id !== volunteer.volunteerId && id !== volunteer.certId)) return res.status(403).send('Document is not available for this account.');
            const isId = type === 'volunteer-id'; title = isId ? 'Volunteer Identity Card' : 'Volunteer Certificate'; docId = isId ? volunteer.volunteerId : volunteer.certId;
            const photo = absolute(member.profilePhotoPath);
            if (isId) body = `<div style="display:flex;gap:28px;align-items:center"><div style="width:150px;height:180px;border-radius:14px;background:#edf2f5;overflow:hidden;display:flex;align-items:center;justify-content:center">${photo ? `<img src="${escapeHtml(photo)}" style="width:100%;height:100%;object-fit:cover">` : '<span class="muted">PHOTO</span>'}</div><div style="flex:1">${row('Name', volunteer.fullName)}${row('Volunteer ID', volunteer.volunteerId)}${row('Position', volunteer.position)}${row('Certificate ID', volunteer.certId)}${row('Approved', volunteer.approvedAt ? new Date(volunteer.approvedAt).toLocaleDateString('en-IN') : '')}</div></div>`;
            else body = `<h2 style="font-size:34px;margin-top:0">Certificate of Volunteering</h2><p>This is to certify that</p><h1 style="font-size:34px;color:#002344">${escapeHtml(volunteer.fullName)}</h1><p>has been approved as a volunteer with <strong>Swastik Srijan Foundation Samiti</strong>.</p>${row('Volunteer ID', volunteer.volunteerId)}${row('Certificate ID', volunteer.certId)}${row('Role / Position', volunteer.position)}${row('Approval Date', volunteer.approvedAt ? new Date(volunteer.approvedAt).toLocaleDateString('en-IN') : '')}`;
        } else if (type === 'donation-receipt') {
            const donor = await Donor.findOne({ where: { email, donorId: id } });
            if (!donor || !['paid','offline'].includes(String(donor.paymentStatus).toLowerCase())) return res.status(403).send('Donation receipt is available only after payment confirmation.');
            title = 'Donation Receipt'; docId = donor.donorId; body = `<h2 style="font-size:30px;margin-top:0">Thank You for Supporting the Mission</h2>${row('Donor', donor.fullName)}${row('Donor ID', donor.donorId)}${row('Amount', donor.amount ? `₹${donor.amount}` : '')}${row('Purpose', donor.donationPurpose || 'General donation')}${row('Payment Status', donor.paymentStatus)}${row('Payment Mode', donor.paymentMode)}${row('Date', new Date(donor.createdAt).toLocaleDateString('en-IN'))}<p class="muted" style="margin-top:28px">This receipt reflects the donation record maintained by Swastik Srijan Foundation Samiti. Please retain it for your records.</p>`;
        } else if (type === 'intern-id' || type === 'intern-letter' || type === 'intern-certificate') {
            const intern = await InternshipApplication.findOne({ where: { email, id } });
            if (!intern || !['selected','completed'].includes(String(intern.status).toLowerCase())) return res.status(403).send('Internship document is not available yet.');
            if (type === 'intern-id') { if (!intern.internId) return res.status(404).send('Intern ID has not been issued yet.'); title = 'Internship Identity Card'; docId = intern.internId; body = `<h2 style="font-size:30px;margin-top:0">Internship Identity</h2>${row('Name', intern.fullName)}${row('Intern ID', intern.internId)}${row('College', intern.college)}${row('Course', intern.course)}${row('Internship Area', intern.internshipType)}${row('Duration', intern.duration)}`; }
            if (type === 'intern-letter') { if (!intern.joiningLetterId) return res.status(404).send('Joining letter has not been issued yet.'); title = 'Internship Joining / Selection Letter'; docId = intern.joiningLetterId; body = `<h2 style="font-size:30px;margin-top:0">Internship Selection</h2><p>Dear <strong>${escapeHtml(intern.fullName)}</strong>,</p><p>We are pleased to record your selection for an internship with <strong>Swastik Srijan Foundation Samiti</strong>.</p>${row('Intern ID', intern.internId)}${row('Internship Area', intern.internshipType)}${row('Duration', intern.duration)}${row('Start Date', intern.startDate || '')}${row('Letter ID', intern.joiningLetterId)}`; }
            if (type === 'intern-certificate') { if (!intern.completionCertId || String(intern.status).toLowerCase() !== 'completed') return res.status(404).send('Completion certificate is issued only after completion is recorded.'); title = 'Internship Completion Certificate'; docId = intern.completionCertId; body = `<h2 style="font-size:30px;margin-top:0">Certificate of Internship Completion</h2><p>This is to certify that</p><h1 style="font-size:34px;color:#002344">${escapeHtml(intern.fullName)}</h1><p>has successfully completed the recorded internship with <strong>Swastik Srijan Foundation Samiti</strong>.</p>${row('Intern ID', intern.internId)}${row('Internship Area', intern.internshipType)}${row('Duration', intern.duration)}${row('Certificate ID', intern.completionCertId)}`; }
        } else return res.status(404).send('Unknown document type.');

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(htmlDocument(title, body, docId));
    } catch (error) { console.error('❌ User document error:', error); res.status(500).send('Unable to generate document.'); }
});

router.get('/verify/:id', async (req, res) => {
    try {
        const id = String(req.params.id || '').trim();
        let result = null;
        if (id.startsWith('SSF-MCERT-')) { const m = await Member.findOne({ where: { certId:id,status:'approved' }, attributes:['fullName','memberId','certId','certificateType','certificateIssuedAt','memberType'] }); if (m) result={valid:true,type:'Membership Certificate',name:m.fullName,officialId:m.memberId,documentId:m.certId,issuedAt:m.certificateIssuedAt,category:m.memberType}; }
        if (!result && id.startsWith('SSF-MEM-')) { const m = await Member.findOne({ where:{memberId:id,status:'approved'}, attributes:['fullName','memberId','certId','certificateIssuedAt','memberType'] }); if(m) result={valid:true,type:'Membership ID Card',name:m.fullName,officialId:m.memberId,documentId:m.memberId,issuedAt:m.certificateIssuedAt,category:m.memberType}; }
        if (!result && id.startsWith('SSF-VOL-')) { const v = await Volunteer.findOne({ where:{volunteerId:id,status:'approved'}, attributes:['fullName','volunteerId','certId','approvedAt','position'] }); if(v) result={valid:true,type:'Volunteer ID Card',name:v.fullName,officialId:v.volunteerId,documentId:v.volunteerId,issuedAt:v.approvedAt,category:v.position}; }
        if (!result && id.startsWith('SSF-VCERT-')) { const v = await Volunteer.findOne({ where:{certId:id,status:'approved'}, attributes:['fullName','volunteerId','certId','approvedAt','position'] }); if(v) result={valid:true,type:'Volunteer Certificate',name:v.fullName,officialId:v.volunteerId,documentId:v.certId,issuedAt:v.approvedAt,category:v.position}; }
        if (!result && id.startsWith('SSF-DON-')) { const d = await Donor.findOne({ where:{donorId:id,paymentStatus:['paid','offline']}, attributes:['fullName','donorId','amount','donationPurpose','createdAt'] }).catch(()=>null); if(d) result={valid:true,type:'Donation Receipt',name:d.fullName,officialId:d.donorId,documentId:d.donorId,issuedAt:d.createdAt,category:d.donationPurpose||'Donation'}; }
        if (!result) return res.status(404).json({valid:false,message:'No verified SSF document was found for this ID.'});
        res.json(result);
    } catch(error) { console.error('❌ Verification error:',error); res.status(500).json({valid:false,message:'Verification service unavailable.'}); }
});

module.exports = router;
