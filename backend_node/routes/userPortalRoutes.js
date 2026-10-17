const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');
const Interest = require('../models/Interest');
const { requireAccountAuth } = require('../services/userAuth');

const identity = require('../services/identityService');
const REAL_MEMBERSHIP_TYPES = identity.REAL_MEMBERSHIP_TYPES;
const isAccountOnly = (member) => identity.isAccountOnly(member);
const isRealMembership = (member) => identity.isRealMembership(member);
const backendUrl = (process.env.BACKEND_PUBLIC_URL || 'https://ngo-backend-03hq.onrender.com').replace(/\/$/, '');
// The document route now proves ownership with a signed token, so the links the
// portal hands back must carry the caller's own token with them.
const documentUrl = (type, id, accountId, token) => `${backendUrl}/api/user-document/${type}/${encodeURIComponent(id)}?account=${encodeURIComponent(accountId)}&token=${encodeURIComponent(token || '')}`;

router.get('/user-portal/:id', requireAccountAuth((req) => req.params.id), async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });
        if (!member) return res.status(404).json({ message: 'Account not found' });

        const email = String(member.email || '').trim().toLowerCase();
        const membershipAccount = isRealMembership(member);
        // `memberType` is the plan the person chose (general / active / life /
        // advisory) and the portal keys the fee logic off it, so it is sent
        // as-is. The register's own wording ("Founder Member", "Treasurer") is
        // a separate display field, so showing it never disturbs the fee card.
        const registerEntry = membershipAccount ? identity.registerEntryFor(member.memberId) : null;
        const memberCategory = membershipAccount
            ? (registerEntry?.memberType || (identity.hasAccountMarker(member) ? 'Member' : member.memberType))
            : null;
        const account = {
            id: member.id,
            fullName: member.fullName,
            email: member.email,
            phone: member.phone,
            memberType: membershipAccount ? member.memberType : 'general',
            memberCategory,
            designation: registerEntry?.designation || member.designation || null,
            status: member.status,
            memberId: membershipAccount ? member.memberId : null,
            certId: membershipAccount ? member.certId : null,
            certificateType: membershipAccount ? member.certificateType : null,
            certificateIssuedAt: membershipAccount ? member.certificateIssuedAt : null,
            reviewNote: member.reviewNote || null,
            idProofType: member.idProofType || null,
            identityNumber: member.identityNumber || null,
            profilePhotoPath: member.profilePhotoData || member.profilePhotoPath,
            paymentStatus: membershipAccount ? (member.paymentStatus || 'pending') : 'not_required',
            paymentMode: membershipAccount ? member.paymentMode : null,
            paymentReference: membershipAccount ? member.paymentReference : null,
            paymentAmount: membershipAccount ? member.paymentAmount : null,
            paymentPaidAt: membershipAccount ? member.paymentPaidAt : null,
            createdAt: member.createdAt
        };

        if (membershipAccount && member.status === 'approved' && member.memberId) {
            account.idCardUrl = documentUrl('membership-id', member.memberId, member.id, req.account.token);
            if (member.certId) account.certificateUrl = documentUrl('membership-certificate', member.certId, member.id, req.account.token);
        }

        // Account/profile data must never disappear just because an optional
        // activity table/query is unavailable. Load each activity independently.
        const [volunteersResult, donorsResult, internshipsResult, interestsResult] = await Promise.allSettled([
            Volunteer.findAll({ where: { email }, attributes: ['id','fullName','email','phone','volunteerType','position','status','isVerified','volunteerId','certId','approvedAt','reviewNote','idType','identityNumber','createdAt'], order: [['createdAt','DESC']] }),
            Donor.findAll({ where: { email }, attributes: ['id','donorId','fullName','email','amount','donationPurpose','paymentMode','paymentStatus','status','createdAt'], order: [['createdAt','DESC']] }),
            InternshipApplication.findAll({ where: { email }, attributes: ['id','fullName','email','college','course','internshipType','duration','startDate','status','internId','joiningLetterId','completionCertId','selectedAt','completedAt','createdAt'], order: [['createdAt','DESC']] }),
            Interest.findAll({ where: { email }, attributes: ['id','interestType','fullName','email','phone','category','message','status','createdAt'], order: [['createdAt','DESC']] })
        ]);

        const volunteers = volunteersResult.status === 'fulfilled' ? volunteersResult.value : [];
        const donors = donorsResult.status === 'fulfilled' ? donorsResult.value : [];
        const internships = internshipsResult.status === 'fulfilled' ? internshipsResult.value : [];
        const interests = interestsResult.status === 'fulfilled' ? interestsResult.value : [];

        if (volunteersResult.status === 'rejected') console.error('User portal volunteer query failed:', volunteersResult.reason);
        if (donorsResult.status === 'rejected') console.error('User portal donor query failed:', donorsResult.reason);
        if (internshipsResult.status === 'rejected') console.error('User portal internship query failed:', internshipsResult.reason);
        if (interestsResult.status === 'rejected') console.error('User portal interest query failed:', interestsResult.reason);

        const safeVolunteers = volunteers.map(v => ({ ...v.toJSON(), idCardUrl: v.status === 'approved' && v.volunteerId ? documentUrl('volunteer-id', v.volunteerId, member.id, req.account.token) : null, certificateUrl: v.status === 'approved' && v.certId ? documentUrl('volunteer-certificate', v.certId, member.id, req.account.token) : null }));
        const safeDonors = donors.map(d => ({ ...d.toJSON(), receiptUrl: ['paid','offline'].includes(String(d.paymentStatus).toLowerCase()) && d.donorId ? documentUrl('donation-receipt', d.donorId, member.id, req.account.token) : null, idCardUrl: ['paid','offline'].includes(String(d.paymentStatus).toLowerCase()) && d.donorId ? documentUrl('donor-id', d.donorId, member.id, req.account.token) : null, certificateUrl: ['paid','offline'].includes(String(d.paymentStatus).toLowerCase()) && (d.certId || d.donorId) ? documentUrl('donor-certificate', d.donorId, member.id, req.account.token) : null }));
        const safeInternships = internships.map(i => ({ ...i.toJSON(), idCardUrl: ['selected','completed'].includes(String(i.status).toLowerCase()) && i.internId ? documentUrl('intern-id', i.internId, member.id, req.account.token) : null, joiningLetterUrl: ['selected','completed'].includes(String(i.status).toLowerCase()) && i.joiningLetterId ? documentUrl('intern-letter', i.id, member.id, req.account.token) : null, completionCertificateUrl: String(i.status).toLowerCase() === 'completed' && i.completionCertId ? documentUrl('intern-certificate', i.id, member.id, req.account.token) : null }));

        return res.json({ account, activities: { volunteers: safeVolunteers, donors: safeDonors, internships: safeInternships, interests } });
    } catch (error) {
        console.error('❌ User portal error:', error);
        return res.status(500).json({ message: 'Unable to load account portal data.' });
    }
});
module.exports = router;
