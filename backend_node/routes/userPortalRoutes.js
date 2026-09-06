const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');

// Public account portal data. The member UUID is required and records are matched
// to the account email so volunteer, donor and internship activity stays attached
// to the same website account without exposing unrelated records.
router.get('/user-portal/:id', async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, {
            attributes: { exclude: ['passwordHash'] }
        });

        if (!member) return res.status(404).json({ message: 'Account not found' });

        const email = String(member.email || '').trim().toLowerCase();
        const [volunteers, donors, internships] = await Promise.all([
            Volunteer.findAll({
                where: { email },
                attributes: ['id', 'fullName', 'email', 'phone', 'volunteerType', 'position', 'status', 'isVerified', 'volunteerId', 'certId', 'approvedAt', 'createdAt'],
                order: [['createdAt', 'DESC']]
            }),
            Donor.findAll({
                where: { email },
                attributes: ['id', 'donorId', 'fullName', 'email', 'amount', 'donationPurpose', 'paymentMode', 'paymentStatus', 'status', 'createdAt'],
                order: [['createdAt', 'DESC']]
            }),
            InternshipApplication.findAll({
                where: { email },
                attributes: ['id', 'fullName', 'email', 'college', 'course', 'internshipType', 'duration', 'startDate', 'status', 'createdAt'],
                order: [['createdAt', 'DESC']]
            })
        ]);

        return res.json({
            account: {
                id: member.id,
                fullName: member.fullName,
                email: member.email,
                phone: member.phone,
                memberType: member.memberType,
                status: member.status,
                memberId: member.memberId,
                certId: member.certId,
                certificateType: member.certificateType,
                certificateIssuedAt: member.certificateIssuedAt,
                createdAt: member.createdAt
            },
            activities: {
                volunteers,
                donors,
                internships
            }
        });
    } catch (error) {
        console.error('❌ User portal error:', error);
        return res.status(500).json({ message: 'Unable to load account portal data.' });
    }
});

module.exports = router;
