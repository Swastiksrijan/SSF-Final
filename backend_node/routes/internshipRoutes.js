const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendMail, emailConfigured } = require('../services/mailer');
const InternshipApplication = require('../models/InternshipApplication');
const { databaseUnavailableResponse } = require('../services/dbHealth');
const { Op } = require('sequelize');
const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads', 'internships');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: (_req, _file, cb) => cb(null, uploadDir), filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${path.extname(file.originalname).toLowerCase()}`) });

// One multipart pass carries the resume, an optional profile photo and an
// optional identity document. The resume stays mandatory (it is the basis of
// the application); the photo and ID proof are optional so a candidate without
// a scanned document on hand is never blocked from applying.
const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.fieldname === 'resume') return RESUME_TYPES.includes(file.mimetype) ? cb(null, true) : cb(new Error('Resume must be PDF, DOC or DOCX.'));
        if (file.fieldname === 'profile_photo') return IMAGE_TYPES.includes(file.mimetype) ? cb(null, true) : cb(new Error('Profile photo must be JPG, PNG or WebP.'));
        if (file.fieldname === 'id_document') return (IMAGE_TYPES.includes(file.mimetype) || file.mimetype === 'application/pdf') ? cb(null, true) : cb(new Error('Identity document must be JPG, PNG, WebP or PDF.'));
        return cb(new Error('Unexpected upload field.'));
    }
});

const removeFile = (file) => { if (file?.path) fs.unlink(file.path, () => {}); };
const publicUrl = (file) => (file ? `/uploads/internships/${file.filename}` : null);

const notifyAdmin = async (application) => { if (!emailConfigured()) return; const recipients=(process.env.ADMIN_EMAILS||process.env.ADMIN_EMAIL||'swastiksrijanfoundation@gmail.com').split(',').map(v=>v.trim()).filter(Boolean).join(','); try { await sendMail({from:'"SSF Internship"',to:recipients,subject:`New Internship Application: ${application.fullName}`,text:`New internship application received.\n\nName: ${application.fullName}\nEmail: ${application.email}\nPhone: ${application.phone}\nCollege: ${application.college}\nCourse: ${application.course}\nArea: ${application.internshipType}\nDuration: ${application.duration}\nStart Date: ${application.startDate||'Not specified'}\nResume: ${application.resumePath}\nIdentity proof: ${application.idDocumentPath||'Not provided'}`}); } catch(error){console.error('⚠️ Internship notification failed:',error.message);} };
const requireAdminAuth=(req,res,next)=>{const authHeader=req.headers.authorization||'';const token=authHeader.startsWith('Bearer ')?authHeader.slice(7).trim():'';const expected=process.env.ADMIN_PORTAL_TOKEN||'ssf-admin-portal-token';if(!token||token!==expected)return res.status(401).json({message:'Unauthorized admin access'});next();};
const nextNumber=async()=> (await InternshipApplication.count({where:{internId:{[Op.ne]:null}}}))+1;
const code=(prefix,number,date=new Date())=>`${prefix}-${String(date.getMonth()+1).padStart(2,'0')}${String(date.getFullYear()).slice(-2)}-${String(number).padStart(4,'0')}`;

router.post('/internship', (req, res) => {
    upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profile_photo', maxCount: 1 }, { name: 'id_document', maxCount: 1 }])(req, res, async (uploadError) => {
        const resume = req.files?.resume?.[0];
        const profilePhoto = req.files?.profile_photo?.[0];
        const idDocument = req.files?.id_document?.[0];
        const cleanup = () => { removeFile(resume); removeFile(profilePhoto); removeFile(idDocument); };
        try {
            if (uploadError) return res.status(400).json({ message: uploadError.message || 'Invalid upload.' });
            const { fullName, email, phone, college, course, internshipType, duration, startDate, message, id_type, identity_number } = req.body || {};
            const clean = { fullName: String(fullName || '').trim(), email: String(email || '').trim().toLowerCase(), phone: String(phone || '').trim(), college: String(college || '').trim(), course: String(course || '').trim(), internshipType: String(internshipType || '').trim(), duration: String(duration || '').trim(), startDate: String(startDate || '').trim() || null, message: String(message || '').trim() || null };
            if (clean.fullName.length < 3) { cleanup(); return res.status(400).json({ message: 'Please enter your full name.' }); }
            if (!/^\S+@\S+\.\S+$/.test(clean.email)) { cleanup(); return res.status(400).json({ message: 'Please enter a valid email address.' }); }
            if (clean.phone.replace(/\D/g, '').length < 7) { cleanup(); return res.status(400).json({ message: 'Please enter a valid mobile number.' }); }
            if (!clean.college || !clean.course || !clean.internshipType || !clean.duration) { cleanup(); return res.status(400).json({ message: 'Please complete all required application fields.' }); }
            if (!resume) { cleanup(); return res.status(400).json({ message: 'Please upload your resume.' }); }
            if (profilePhoto && profilePhoto.size > 2 * 1024 * 1024) { cleanup(); return res.status(400).json({ message: 'Profile photo must be 2MB or smaller.' }); }
            const application = await InternshipApplication.create({ ...clean, resumePath: publicUrl(resume), profilePhotoPath: publicUrl(profilePhoto), idDocumentPath: publicUrl(idDocument), idType: String(id_type || '').trim() || null, identityNumber: String(identity_number || '').trim() || null, status: 'pending' });
            await notifyAdmin(application);
            return res.status(201).json({ status: 'success', message: 'Internship application submitted successfully.', data: { id: application.id } });
        } catch (error) {
            cleanup();
            console.error('❌ Internship submission error:', error);
            if (databaseUnavailableResponse(res, error)) return;
            return res.status(500).json({ message: 'Unable to submit right now. Please try again.' });
        }
    });
});

router.get('/admin/internships', requireAdminAuth, async (_req, res) => {
    try {
        const rows = await InternshipApplication.findAll({ order: [['createdAt', 'DESC']] });
        return res.json(rows.map((r) => ({ ...r.toJSON(), resumeUrl: r.resumePath, profilePhotoUrl: r.profilePhotoPath, idDocumentUrl: r.idDocumentPath })));
    } catch (error) { console.error('❌ Admin internships fetch error:', error); return res.status(500).json({ message: 'Unable to load internship applications.' }); }
});

router.patch('/admin/internships/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const status = String(req.body?.status || '');
        if (!['pending', 'reviewed', 'selected', 'completed', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
        const application = await InternshipApplication.findByPk(req.params.id);
        if (!application) return res.status(404).json({ message: 'Internship application not found.' });
        const now = new Date(); const updates = { status };
        if (status === 'selected' && !application.internId) { const number = await nextNumber(); updates.internId = code('SSF-INT', number, now); updates.joiningLetterId = code('SSF-ILTR', number, now); updates.selectedAt = now; }
        if (status === 'completed') { if (!application.internId) { const number = await nextNumber(); updates.internId = code('SSF-INT', number, now); updates.joiningLetterId = code('SSF-ILTR', number, now); } if (!application.completionCertId) { const number = await nextNumber(); updates.completionCertId = code('SSF-ICERT', number, now); } updates.completedAt = now; }
        await application.update(updates);
        return res.json({ status: 'success', data: application });
    } catch (error) { console.error('❌ Internship status update error:', error); return res.status(500).json({ message: 'Unable to update status.' }); }
});

// Edit the editable details of an application (not the issued IDs — those are
// managed by the status workflow).
router.patch('/admin/internships/:id', requireAdminAuth, async (req, res) => {
    try {
        const application = await InternshipApplication.findByPk(req.params.id);
        if (!application) return res.status(404).json({ message: 'Internship application not found.' });
        const allowed = ['fullName', 'email', 'phone', 'college', 'course', 'internshipType', 'duration', 'startDate', 'message', 'idType', 'identityNumber'];
        const updates = {};
        for (const field of allowed) if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) updates[field] = req.body[field];
        if (updates.email) { updates.email = String(updates.email).trim().toLowerCase(); if (!/^\S+@\S+\.\S+$/.test(updates.email)) return res.status(400).json({ message: 'Please enter a valid email address.' }); }
        if (updates.fullName !== undefined) { updates.fullName = String(updates.fullName || '').trim(); if (updates.fullName.length < 3) return res.status(400).json({ message: 'Please enter the applicant name.' }); }
        if (updates.startDate !== undefined) updates.startDate = String(updates.startDate || '').trim() || null;
        await application.update(updates);
        return res.json({ status: 'success', message: 'Internship application updated.', data: application });
    } catch (error) { console.error('❌ Internship update error:', error); return res.status(500).json({ message: 'Unable to update internship application.' }); }
});

const removeStoredFile = (storedPath) => { if (!storedPath) return; const filePath = path.join(__dirname, '..', String(storedPath).replace(/^\/+/, '')); try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (error) { console.warn('Internship upload cleanup failed:', error.message); } };
const deleteInternship = async (req, res) => {
    try {
        const application = await InternshipApplication.findByPk(req.params.id);
        if (!application) return res.status(404).json({ message: 'Internship application not found.' });
        removeStoredFile(application.resumePath); removeStoredFile(application.profilePhotoPath); removeStoredFile(application.idDocumentPath);
        await application.destroy();
        return res.json({ status: 'success', message: 'Internship application deleted permanently.' });
    } catch (error) { console.error('❌ Internship delete error:', error); return res.status(500).json({ message: 'Unable to delete internship application.' }); }
};
router.delete('/admin/internships/:id', requireAdminAuth, deleteInternship);
router.post('/admin/internships/:id/delete', requireAdminAuth, deleteInternship);
module.exports = router;
