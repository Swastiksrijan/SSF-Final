const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');
const Interest = require('../models/Interest');

const backendUrl = (process.env.BACKEND_PUBLIC_URL || 'https://ngo-backend-03hq.onrender.com').replace(/\/$/, '');
const documentUrl = (type, id, accountId) => `${backendUrl}/api/user-document/${type}/${encodeURIComponent(id)}?account=${encodeURIComponent(accountId)}`;

router.get('/user-portal/:id', async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });
        if (!member) return res.status(404).json({ message: 'Account not found' });
        const email = String(member.email || '').trim().toLowerCase();
        const [volunteers, donors, internships, interests] = await Promise.all([
            Volunteer.findAll({ where: { email }, attributes: ['id','fullName','email','phone','volunteerType','position','status','isVerified','volunteerId','certId','approvedAt','createdAt'], order: [['createdAt','DESC']] }),
            Donor.findAll({ where: { email }, attributes: ['id','donorId','fullName','email','amount','donationPurpose','paymentMode','paymentStatus','status','createdAt'], order: [['createdAt','DESC']] }),
            InternshipApplication.findAll({ where: { email }, attributes: ['id','fullName','email','college','course','internshipType','duration','startDate','status','internId','joiningLetterId','completionCertId','selectedAt','completedAt','createdAt'], order: [['createdAt','DESC']] }),
            Interest.findAll({ where: { email }, attributes: ['id','interestType','fullName','email','phone','message','status','createdAt'], order: [['createdAt','DESC']] })
        ]);

        const account = { id: member.id, fullName: member.fullName, email: member.email, phone: member.phone, memberType: member.memberType, status: member.status, memberId: member.memberId, certId: member.certId, certificateType: member.certificateType, certificateIssuedAt: member.certificateIssuedAt, profilePhotoPath: member.profilePhotoPath, createdAt: member.createdAt };
        if (member.status === 'approved' && member.memberId) {
            account.idCardUrl = documentUrl('membership-id', member.memberId, member.id);
            if (member.certId) account.certificateUrl = documentUrl('membership-certificate', member.certId, member.id);
        }
        const safeVolunteers = volunteers.map(v => ({ ...v.toJSON(), idCardUrl: v.status === 'approved' && v.volunteerId ? documentUrl('volunteer-id', v.volunteerId, member.id) : null, certificateUrl: v.status === 'approved' && v.certId ? documentUrl('volunteer-certificate', v.certId, member.id) : null }));
        const safeDonors = donors.map(d => ({ ...d.toJSON(), receiptUrl: ['paid','offline'].includes(String(d.paymentStatus).toLowerCase()) && d.donorId ? documentUrl('donation-receipt', d.donorId, member.id) : null }));
        const safeInternships = internships.map(i => ({ ...i.toJSON(), idCardUrl: ['selected','completed'].includes(i.status) && i.internId ? documentUrl('intern-id', i.id, member.id) : null, joiningLetterUrl: ['selected','completed'].includes(i.status) && i.joiningLetterId ? documentUrl('intern-letter', i.id, member.id) : null, completionCertificateUrl: i.status === 'completed' && i.completionCertId ? documentUrl('intern-certificate', i.id, member.id) : null }));
        return res.json({ account, activities: { volunteers: safeVolunteers, donors: safeDonors, internships: safeInternships, interests } });
    } catch (error) {
        console.error('❌ User portal error:', error);
        return res.status(500).json({ message: 'Unable to load account portal data.' });
    }
});
module.exports = router;
