const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');
const Interest = require('../models/Interest');

// Account portal: only records matching the logged-in account email are returned.
router.get('/user-portal/:id', async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });
        if (!member) return res.status(404).json({ message: 'Account not found' });
        const email = String(member.email || '').trim().toLowerCase();
        const [volunteers, donors, internships, interests] = await Promise.all([
            Volunteer.findAll({ where: { email }, attributes: ['id', 'fullName', 'email', 'phone', 'volunteerType', 'position', 'status', 'isVerified', 'volunteerId', 'certId', 'approvedAt', 'createdAt'], order: [['createdAt', 'DESC']] }),
            Donor.findAll({ where: { email }, attributes: ['id', 'donorId', 'fullName', 'email', 'amount', 'donationPurpose', 'paymentMode', 'paymentStatus', 'status', 'createdAt'], order: [['createdAt', 'DESC']] }),
            InternshipApplication.findAll({ where: { email }, attributes: ['id', 'fullName', 'email', 'college', 'course', 'internshipType', 'duration', 'startDate', 'status', 'createdAt'], order: [['createdAt', 'DESC']] }),
            Interest.findAll({ where: { email }, attributes: ['id', 'interestType', 'fullName', 'email', 'phone', 'message', 'status', 'createdAt'], order: [['createdAt', 'DESC']] })
        ]);
        return res.json({
            account: { id: member.id, fullName: member.fullName, email: member.email, phone: member.phone, memberType: member.memberType, status: member.status, memberId: member.memberId, certId: member.certId, certificateType: member.certificateType, certificateIssuedAt: member.certificateIssuedAt, createdAt: member.createdAt },
            activities: { volunteers, donors, internships, interests }
        });
    } catch (error) {
        console.error('❌ User portal error:', error);
        return res.status(500).json({ message: 'Unable to load account portal data.' });
    }
});
module.exports = router;
