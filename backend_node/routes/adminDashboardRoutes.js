// Admin command-centre data: the numbers and the trail behind them.
//
// Everything here is read-only reporting plus the audit feed, so the admin
// dashboard can show a truthful overview without guessing. Counts are computed
// from the real tables; a missing optional table degrades to zero rather than
// failing the whole response.
const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const router = express.Router();
const sequelize = require('../config/database');
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');
const Interest = require('../models/Interest');
const ContactMessage = require('../models/ContactMessage');
const AuditLog = require('../models/AuditLog');
const { getAdminToken } = require('../services/userAuth');

const requireAdminAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token || token !== getAdminToken()) return res.status(401).json({ message: 'Unauthorized admin access' });
  next();
};

const safeCount = async (model, where) => {
  try { return await model.count(where ? { where } : undefined); }
  catch (error) { console.warn('Dashboard count skipped:', error.message); return 0; }
};

const PAID_TYPES = ['general', 'active', 'life'];
const REAL_TYPES = ['general', 'active', 'life', 'advisory'];
const accountOnly = { [Op.or]: [{ memberType: 'website_signup' }, { message: 'Signup from website' }] };

// GET /api/admin/dashboard -> headline KPIs, the pending queue and recent activity.
router.get('/admin/dashboard', requireAdminAuth, async (_req, res) => {
  try {
    const [totalAccounts, realMembers, pendingMembers, approvedMembers, paidMembers] = await Promise.all([
      safeCount(Member),
      safeCount(Member, { memberType: { [Op.in]: REAL_TYPES } }),
      safeCount(Member, { memberType: { [Op.in]: REAL_TYPES }, status: 'pending' }),
      safeCount(Member, { memberType: { [Op.in]: REAL_TYPES }, status: 'approved' }),
      safeCount(Member, { memberType: { [Op.in]: PAID_TYPES }, paymentStatus: 'paid' }),
    ]);
    const [totalVolunteers, pendingVolunteers, approvedVolunteers] = await Promise.all([
      safeCount(Volunteer),
      safeCount(Volunteer, { status: 'pending' }),
      safeCount(Volunteer, { status: 'approved' }),
    ]);
    const [totalInternships, pendingInternships, selectedInternships] = await Promise.all([
      safeCount(InternshipApplication),
      safeCount(InternshipApplication, { status: 'pending' }),
      safeCount(InternshipApplication, { status: { [Op.in]: ['selected', 'completed'] } }),
    ]);
    const [totalDonors, confirmedDonations, pendingDonations] = await Promise.all([
      safeCount(Donor),
      safeCount(Donor, { paymentStatus: { [Op.in]: ['paid', 'offline'] } }),
      safeCount(Donor, { paymentStatus: { [Op.notIn]: ['paid', 'offline'] } }),
    ]);
    const [totalInterests, openInterests, totalContacts, openContacts, correctionsRequested] = await Promise.all([
      safeCount(Interest),
      safeCount(Interest, { status: { [Op.in]: ['new', 'contacted'] } }),
      safeCount(ContactMessage),
      safeCount(ContactMessage, { status: { [Op.in]: ['new', 'contacted'] } }),
      safeCount(Member, { status: 'changes_requested' }),
    ]);

    let donationTotal = 0;
    try {
      const sum = await Donor.sum('amount', { where: { paymentStatus: { [Op.in]: ['paid', 'offline'] } } });
      donationTotal = Number(sum || 0);
    } catch (error) { console.warn('Donation sum skipped:', error.message); }

    // The single work queue an admin actually acts on: anything waiting on them.
    const pendingQueue = [];
    try {
      const [pendingMemberRows, pendingVolunteerRows, pendingInternshipRows] = await Promise.all([
        Member.findAll({ where: { memberType: { [Op.in]: REAL_TYPES }, status: { [Op.in]: ['pending', 'changes_requested'] } }, attributes: ['id', 'fullName', 'email', 'memberType', 'status', 'paymentStatus', 'createdAt'], order: [['createdAt', 'DESC']], limit: 25 }),
        Volunteer.findAll({ where: { status: { [Op.in]: ['pending', 'changes_requested'] } }, attributes: ['id', 'fullName', 'email', 'volunteerType', 'status', 'createdAt'], order: [['createdAt', 'DESC']], limit: 25 }),
        InternshipApplication.findAll({ where: { status: { [Op.in]: ['pending', 'reviewed'] } }, attributes: ['id', 'fullName', 'email', 'internshipType', 'status', 'createdAt'], order: [['createdAt', 'DESC']], limit: 25 }),
      ]);
      for (const m of pendingMemberRows) pendingQueue.push({ kind: 'member', id: m.id, name: m.fullName, email: m.email, detail: m.memberType, status: m.status, paymentStatus: m.paymentStatus, at: m.createdAt });
      for (const v of pendingVolunteerRows) pendingQueue.push({ kind: 'volunteer', id: v.id, name: v.fullName, email: v.email, detail: v.volunteerType, status: v.status, at: v.createdAt });
      for (const i of pendingInternshipRows) pendingQueue.push({ kind: 'internship', id: i.id, name: i.fullName, email: i.email, detail: i.internshipType, status: i.status, at: i.createdAt });
      pendingQueue.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
    } catch (error) { console.warn('Pending queue skipped:', error.message); }

    let recentActivity = [];
    try {
      const rows = await AuditLog.findAll({ order: [['createdAt', 'DESC']], limit: 15 });
      recentActivity = rows.map((r) => ({ id: r.id, actor: r.actor, action: r.action, entityType: r.entityType, entityName: r.entityName, summary: r.summary, at: r.createdAt }));
    } catch (error) { console.warn('Recent activity skipped:', error.message); }

    return res.json({
      members: { totalAccounts, realMembers, pending: pendingMembers, approved: approvedMembers, paid: paidMembers, correctionsRequested },
      volunteers: { total: totalVolunteers, pending: pendingVolunteers, approved: approvedVolunteers },
      internships: { total: totalInternships, pending: pendingInternships, selected: selectedInternships },
      donations: { totalRecords: totalDonors, confirmed: confirmedDonations, pending: pendingDonations, confirmedAmount: donationTotal },
      interests: { total: totalInterests, open: openInterests },
      contacts: { total: totalContacts, open: openContacts },
      pendingQueue: pendingQueue.slice(0, 40),
      recentActivity,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ message: 'Unable to build the dashboard summary.' });
  }
});

// GET /api/admin/audit-logs?limit=&entityType=&action= -> the audit trail.
router.get('/admin/audit-logs', requireAdminAuth, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    const where = {};
    if (req.query.entityType) where.entityType = String(req.query.entityType);
    if (req.query.action) where.action = String(req.query.action);
    const rows = await AuditLog.findAll({ where, order: [['createdAt', 'DESC']], limit });
    return res.json(rows.map((r) => ({ id: r.id, actor: r.actor, action: r.action, entityType: r.entityType, entityId: r.entityId, entityName: r.entityName, summary: r.summary, detail: r.detail, ip: r.ip, at: r.createdAt })));
  } catch (error) {
    console.warn('Audit log unavailable:', error.message);
    return res.json([]);
  }
});

// GET /api/admin/overview.csv?type=members|volunteers|donors|internships
// A plain CSV so the admin can keep a local record without a spreadsheet app.
router.get('/admin/overview.csv', requireAdminAuth, async (req, res) => {
  const type = String(req.query.type || 'members').toLowerCase();
  const csvCell = (value) => {
    const text = value == null ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const toCsv = (headers, rows) => [headers.join(','), ...rows.map((row) => headers.map((h) => csvCell(row[h])).join(','))].join('\n');

  try {
    let csv = '';
    let filename = `${type}.csv`;
    if (type === 'volunteers') {
      const rows = (await Volunteer.findAll({ order: [['createdAt', 'DESC']] })).map((v) => ({ id: v.id, fullName: v.fullName, email: v.email, phone: v.phone, type: v.volunteerType, status: v.status, volunteerId: v.volunteerId, certId: v.certId, createdAt: v.createdAt }));
      csv = toCsv(['id', 'fullName', 'email', 'phone', 'type', 'status', 'volunteerId', 'certId', 'createdAt'], rows);
    } else if (type === 'donors') {
      const rows = (await Donor.findAll({ order: [['createdAt', 'DESC']] })).map((d) => ({ id: d.id, fullName: d.fullName, email: d.email, phone: d.phone, amount: d.amount, purpose: d.donationPurpose, paymentMode: d.paymentMode, paymentStatus: d.paymentStatus, donorId: d.donorId, createdAt: d.createdAt }));
      csv = toCsv(['id', 'fullName', 'email', 'phone', 'amount', 'purpose', 'paymentMode', 'paymentStatus', 'donorId', 'createdAt'], rows);
    } else if (type === 'internships') {
      const rows = (await InternshipApplication.findAll({ order: [['createdAt', 'DESC']] })).map((i) => ({ id: i.id, fullName: i.fullName, email: i.email, phone: i.phone, college: i.college, course: i.course, internshipType: i.internshipType, duration: i.duration, status: i.status, internId: i.internId, createdAt: i.createdAt }));
      csv = toCsv(['id', 'fullName', 'email', 'phone', 'college', 'course', 'internshipType', 'duration', 'status', 'internId', 'createdAt'], rows);
    } else {
      filename = 'members.csv';
      const rows = (await Member.findAll({ order: [['createdAt', 'DESC']], attributes: { exclude: ['passwordHash', 'profilePhotoData'] } })).map((m) => ({ id: m.id, fullName: m.fullName, email: m.email, phone: m.phone, memberType: m.memberType, status: m.status, paymentStatus: m.paymentStatus, memberId: m.memberId, certId: m.certId, createdAt: m.createdAt }));
      csv = toCsv(['id', 'fullName', 'email', 'phone', 'memberType', 'status', 'paymentStatus', 'memberId', 'certId', 'createdAt'], rows);
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="ssf-${filename}"`);
    return res.send(csv);
  } catch (error) {
    console.error('CSV export error:', error);
    return res.status(500).json({ message: 'Unable to export that record set.' });
  }
});

module.exports = router;
