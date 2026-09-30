const express = require('express');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const router = express.Router();
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');
const Interest = require('../models/Interest');
const ContactMessage = require('../models/ContactMessage');

const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
    if (!token || token !== expected) return res.status(401).json({ message: 'Unauthorized admin access' });
    next();
};

const removeFile = storedPath => {
    if (!storedPath) return;
    const raw = String(storedPath);
    const filename = path.basename(raw);
    const candidates = [
        path.join(__dirname, '..', 'uploads', filename),
        path.join(__dirname, '..', raw.replace(/^\/?uploads[\\/]/, ''))
    ];
    for (const filePath of candidates) {
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (error) { console.warn('User file cleanup failed:', error.message); }
    }
};

// Permanently remove one SSF account and every application/activity stored against its email.
// This is deliberately admin-only and irreversible.
router.delete('/admin/users/:id', requireAdminAuth, async (req, res) => {
    try {
        const account = await Member.findByPk(req.params.id);
        if (!account) return res.status(404).json({ message: 'User account not found.' });

        const email = String(account.email || '').trim().toLowerCase();
        const where = { email };

        const [members, volunteers, donors, internships, interests, contacts] = await Promise.all([
            Member.findAll({ where }),
            Volunteer.findAll({ where }),
            Donor.findAll({ where }),
            InternshipApplication.findAll({ where }),
            Interest.findAll({ where }),
            ContactMessage.findAll({ where })
        ]);

        members.forEach(item => { removeFile(item.idDocumentPath); removeFile(item.profilePhotoPath); });
        volunteers.forEach(item => { removeFile(item.idDocumentPath); removeFile(item.profilePhotoPath); });
        internships.forEach(item => removeFile(item.resumePath));

        await Promise.all([
            Member.destroy({ where }),
            Volunteer.destroy({ where }),
            Donor.destroy({ where }),
            InternshipApplication.destroy({ where }),
            Interest.destroy({ where }),
            ContactMessage.destroy({ where: { email } })
        ]);

        return res.json({
            status: 'success',
            message: 'User account and all associated SSF records were permanently deleted.',
            deleted: {
                accounts: members.length,
                volunteers: volunteers.length,
                donors: donors.length,
                internships: internships.length,
                interests: interests.length,
                contacts: contacts.length
            }
        });
    } catch (error) {
        console.error('❌ Complete user deletion error:', error);
        return res.status(500).json({ message: 'Unable to permanently delete the user and associated records.' });
    }
});

module.exports = router;
