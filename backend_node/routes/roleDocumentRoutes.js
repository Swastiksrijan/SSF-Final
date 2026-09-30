const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const RoleDocument = require('../models/RoleDocument');

const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdminAuth = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

const roleCodes = {
    donor: 'DON', intern: 'INT', student: 'STU', volunteer_teacher: 'EDU', skill_volunteer: 'SKV', ambassador: 'AMB'
};
const documentCodes = {
    identity_card: 'ID', certificate: 'CERT', joining_letter: 'JOIN', completion_certificate: 'CCERT',
    participation_certificate: 'PCERT', training_certificate: 'TCERT', appreciation_certificate: 'ACERT',
    outstanding_contribution_certificate: 'OCERT', partner_recognition: 'PREC'
};

const period = (date = new Date()) => `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
const nextNumber = async (role, documentType) => {
    const count = await RoleDocument.count({ where: { role, documentType } });
    return String(count + 1).padStart(4, '0');
};

router.post('/admin/role-documents', requireAdminAuth, async (req, res) => {
    try {
        const { personId, fullName, email, role, documentType, issueDate, validUntil, metadata } = req.body || {};
        if (!personId || !fullName || !role || !documentType) return res.status(400).json({ message: 'personId, fullName, role and documentType are required.' });
        if (!roleCodes[role] || !documentCodes[documentType]) return res.status(400).json({ message: 'Unsupported role or document type.' });
        const now = issueDate ? new Date(issueDate) : new Date();
        if (Number.isNaN(now.getTime())) return res.status(400).json({ message: 'Invalid issueDate.' });
        const number = await nextNumber(role, documentType);
        const documentNumber = `SSF-${roleCodes[role]}-${documentCodes[documentType]}-${period(now)}-${number}`;
        const verificationCode = crypto.randomBytes(12).toString('hex');
        const document = await RoleDocument.create({ personId: String(personId), fullName: String(fullName).trim(), email: email ? String(email).trim().toLowerCase() : null, role, documentType, documentNumber, issueDate: now, validUntil: validUntil || null, metadata: metadata || null, verificationCode, status: 'active' });
        const frontendUrl = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
        return res.status(201).json({ status: 'success', document: document.toJSON(), verificationUrl: `${frontendUrl}/verify/${documentNumber}` });
    } catch (error) {
        console.error('❌ Role document issuance error:', error);
        return res.status(500).json({ message: 'Unable to issue document.' });
    }
});

router.get('/admin/role-documents', requireAdminAuth, async (_req, res) => {
    try {
        const documents = await RoleDocument.findAll({ order: [['createdAt', 'DESC']] });
        return res.json(documents);
    } catch (error) {
        console.error('❌ Role document list error:', error);
        return res.status(500).json({ message: 'Unable to load role documents.' });
    }
});

router.patch('/admin/role-documents/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const document = await RoleDocument.findByPk(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found.' });
        const status = String(req.body?.status || '').trim().toLowerCase();
        if (!['active', 'revoked', 'expired'].includes(status)) return res.status(400).json({ message: 'Invalid document status.' });
        await document.update({ status });
        return res.json({ status: 'success', document: document.toJSON() });
    } catch (error) {
        console.error('❌ Role document status error:', error);
        return res.status(500).json({ message: 'Unable to update document status.' });
    }
});

router.get('/verify/:documentNumber', async (req, res, next) => {
    const documentNumber = String(req.params.documentNumber || '').trim();
    if (!documentNumber.startsWith('SSF-')) return next();
    try {
        const document = await RoleDocument.findOne({ where: { documentNumber } });
        if (!document) return res.status(404).json({ verified: false, message: 'Document not found.' });
        return res.json({ verified: document.status === 'active', documentNumber: document.documentNumber, fullName: document.fullName, role: document.role, documentType: document.documentType, issueDate: document.issueDate, validUntil: document.validUntil, status: document.status });
    } catch (error) {
        console.error('❌ Role document verification error:', error);
        return res.status(500).json({ message: 'Unable to verify document.' });
    }
});

module.exports = router;
