// SSF-IMS API. One generic resource engine + specialised endpoints.
const express = require('express');
const router = express.Router();
const { models } = require('../models/ims');
const { Op } = require('sequelize');
const res = require('../services/ims/resource');
const { mainDashboard, moduleDashboard } = require('../services/ims/dashboard');
const { person360 } = require('../services/ims/person360');
const { seedGovernance } = require('../services/ims/seed');
const { migrateLegacy } = require('../services/ims/migrateLegacy');
const { ROLES, DEFAULT_GRANTS } = require('../services/ims/rbac');

// Auth: reuse the office bearer token so the existing admin session works.
const requireImsAuth = (req, r, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
  if (!token || token !== expected) return r.status(401).json({ message: 'Unauthorized SSF-IMS access' });
  next();
};
router.use('/ims', requireImsAuth);

const wrap = (fn) => (req, r) => fn(req, r).catch(e => {
  const status = e.status || 500;
  r.status(status).json({ message: e.message || 'IMS error', duplicates: e.duplicates });
});

// ---- dashboards ------------------------------------------------------------
router.get('/ims/main-dashboard', wrap(async (_req, r) => r.json(await mainDashboard())));
router.get('/ims/module-dashboard/:module', wrap(async (req, r) => r.json(await moduleDashboard(req.params.module))));
router.get('/ims/roles', (_req, r) => r.json({ roles: ROLES, grants: DEFAULT_GRANTS }));

// ---- seed ------------------------------------------------------------------
router.post('/ims/seed', wrap(async (_req, r) => r.json(await seedGovernance())));

// ---- person 360 ------------------------------------------------------------
router.get('/ims/person360/:id', wrap(async (req, r) => {
  const out = await person360(req.params.id);
  if (!out) return r.status(404).json({ message: 'Person not found' });
  r.json(out);
}));

// ---- global search ---------------------------------------------------------
router.get('/ims/search', wrap(async (req, r) => {
  const q = String(req.query.q || '').trim();
  if (!q) return r.json({ results: [] });
  const like = { [Op.iLike]: '%' + q + '%' };
  const searches = [
    ['person', models.ImsPerson, ['fullName', 'mobile', 'email', 'recordId']],
    ['member', models.ImsMembership, ['memberNo', 'recordId']],
    ['donor', models.ImsDonor, ['donorType', 'recordId']],
    ['project', models.ImsProject, ['name', 'recordId']],
    ['meeting', models.ImsMeeting, ['title', 'recordId']],
    ['resolution', models.ImsResolution, ['title', 'recordId']],
    ['action', models.ImsAction, ['title', 'recordId']],
    ['document', models.ImsDocument, ['title', 'recordId']],
    ['case', models.ImsCase, ['title', 'recordId']],
    ['transaction', models.ImsTransaction, ['transactionNo', 'recordId']],
  ];
  const results = [];
  for (const [type, model, fields] of searches) {
    const rows = await model.findAll({ where: { [Op.or]: fields.map(f => ({ [f]: like })) }, limit: 5 });
    for (const row of rows) results.push({ type, id: row.id, recordId: row.recordId, title: row[fields[0]] || row.recordId });
  }
  r.json({ results });
}));

// ---- relationship linking (must precede the generic POST /ims/:resource) ----
router.post('/ims/link', wrap(async (req, r) => {
  const { fromType, fromId, toType, toId, relation, meta } = req.body || {};
  await res.link(fromType, fromId, toType, toId, relation, meta);
  r.json({ status: 'success' });
}));

// ---- audit trail -----------------------------------------------------------
router.get('/ims/audit-trail', wrap(async (req, r) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const where = {};
  if (req.query.entityType) where.entityType = req.query.entityType;
  if (req.query.entityId) where.entityId = req.query.entityId;
  const rows = await models.ImsAuditTrail.findAll({ where, order: [['id', 'DESC']], limit });
  r.json({ records: rows });
}));

// ---- data integrity checks -------------------------------------------------
router.get('/ims/integrity', wrap(async (_req, r) => {
  const { Op } = require('sequelize');
  const checks = [
    { key: 'person_no_mobile', label: 'Person without mobile', model: models.ImsPerson, where: { [Op.or]: [{ mobile: null }, { mobile: '' }] } },
    { key: 'txn_no_fy', label: 'Transaction without financial year', model: models.ImsTransaction, where: { financialYearId: null } },
    { key: 'txn_no_account', label: 'Transaction without account', model: models.ImsTransaction, where: { accountId: null } },
    { key: 'txn_needs_review', label: 'Transaction needs review', model: models.ImsTransaction, where: { needsReview: true } },
    { key: 'action_no_owner', label: 'Action without responsible person', model: models.ImsAction, where: { responsiblePersonId: null } },
    { key: 'compliance_no_due', label: 'Compliance without due date', model: models.ImsCompliance, where: { dueDate: null } },
    { key: 'asset_no_custodian', label: 'Asset without custodian', model: models.ImsAsset, where: { custodianPersonId: null } },
    { key: 'resolution_no_meeting', label: 'Resolution without meeting', model: models.ImsResolution, where: { meetingId: null } },
    { key: 'doc_no_relation', label: 'Document not linked to any record', model: models.ImsDocument, where: {} },
  ];
  const out = [];
  for (const c of checks) {
    let count;
    if (c.key === 'doc_no_relation') {
      count = await models.ImsDocument.count();
      const linked = await models.ImsRelation.findAll({ where: { fromType: 'documents' }, attributes: ['fromId'] });
      const linkedIds = new Set(linked.map(x => x.fromId));
      const docs = await models.ImsDocument.findAll({ attributes: ['recordId'] });
      count = docs.filter(d => !linkedIds.has(d.recordId)).length;
    } else {
      count = await c.model.count({ where: { ...c.where, status: { [Op.ne]: 'archived' } } });
    }
    out.push({ key: c.key, label: c.label, count });
  }
  r.json({ checks: out, totalIssues: out.reduce((s, x) => s + x.count, 0) });
}));

// ---- required registers map (per SSF Niyamavali) ---------------------------
// Maps each statutorily-required register to the SSF-IMS master(s) that hold it,
// with a live record count, so "how many registers are needed" is answered by the system itself.
const REQUIRED_REGISTERS = [
  { group: 'governance', rule: 'members_register', model: 'ImsMember', resource: 'members', basis: 'Bylaw — Members Register (सदस्य पंजिका)', en: 'Members Register', hi: 'सदस्य पंजिका' },
  { group: 'governance', rule: 'committee_register', model: 'ImsCommitteeMember', resource: 'committeeMembers', basis: 'Bylaw — Managing Committee (प्रबंधकारिणी)', en: 'Managing Committee Register', hi: 'प्रबंधकारिणी पंजिका' },
  { group: 'governance', rule: 'meetings_minutes', model: 'ImsMeeting', resource: 'meetings', basis: 'Bylaw — GB yearly, MC monthly; notice 15/7 days', en: 'Meetings & Minutes Register', hi: 'बैठक एवं कार्यवृत्त पंजिका' },
  { group: 'governance', rule: 'resolutions', model: 'ImsResolution', resource: 'resolutions', basis: 'Bylaw — Special resolution copy to Registrar in 45 days', en: 'Resolutions Register', hi: 'संकल्प पंजिका' },
  { group: 'governance', rule: 'action_taken', model: 'ImsAction', resource: 'actions', basis: 'Accountability — decision follow-up', en: 'Action-Taken Register', hi: 'कार्य-अनुपालन पंजिका' },
  { group: 'governance', rule: 'attendance', model: 'ImsAttendee', resource: 'attendees', basis: 'Bylaw — quorum 3/5 (GB) and 1/2 (MC)', en: 'Attendance Register', hi: 'उपस्थिति पंजिका' },
  { group: 'governance', rule: 'governance_rules', model: 'ImsGovernanceRule', resource: 'governanceRules', basis: 'Memorandum & Rules', en: 'Constitution & Bylaws', hi: 'संविधान एवं नियमावली' },
  { group: 'finance', rule: 'cash_book', model: 'ImsCashAccount', resource: 'cashAccounts', basis: 'Bylaw — Treasurer daily cash limit ₹4,500', en: 'Cash Book', hi: 'रोकड़ पंजिका' },
  { group: 'finance', rule: 'bank_book', model: 'ImsBankAccount', resource: 'bankAccounts', basis: 'Accountability — bank reconciliation', en: 'Bank Book', hi: 'बैंक पंजिका' },
  { group: 'finance', rule: 'voucher_register', model: 'ImsVoucher', resource: 'vouchers', basis: 'Bylaw — Secretary expense limit ₹5,000', en: 'Voucher Register', hi: 'वाउचर पंजिका' },
  { group: 'finance', rule: 'donation_register', model: 'ImsDonation', resource: 'donations', basis: 'Accountability — 80G receipts', en: 'Donation Register', hi: 'दान पंजिका' },
  { group: 'finance', rule: 'grant_register', model: 'ImsGrant', resource: 'grants', basis: 'Accountability — utilisation certificates', en: 'Grant Register', hi: 'अनुदान पंजिका' },
  { group: 'finance', rule: 'asset_register', model: 'ImsAsset', resource: 'assets', basis: 'Accountability — asset verification', en: 'Fixed Asset Register', hi: 'स्थायी संपत्ति पंजिका' },
  { group: 'finance', rule: 'ledger', model: 'ImsTransaction', resource: 'transactions', basis: 'Accountability — books of account', en: 'Ledger / Day Book', hi: 'बहीखाता / रोजनामा' },
  { group: 'programme', rule: 'project_register', model: 'ImsProject', resource: 'projects', basis: 'Accountability — project delivery', en: 'Project Register', hi: 'परियोजना पंजिका' },
  { group: 'programme', rule: 'activity_register', model: 'ImsActivity', resource: 'activities', basis: 'Accountability — activity evidence', en: 'Activity Register', hi: 'गतिविधि पंजिका' },
  { group: 'programme', rule: 'beneficiary_register', model: 'ImsBeneficiary', resource: 'beneficiaries', basis: 'Accountability — beneficiary consent', en: 'Beneficiary Register', hi: 'लाभार्थी पंजिका' },
  { group: 'programme', rule: 'document_register', model: 'ImsDocument', resource: 'documents', basis: 'Accountability — document control', en: 'Document Register', hi: 'दस्तावेज़ पंजिका' },
  { group: 'compliance', rule: 'compliance_register', model: 'ImsCompliance', resource: 'compliance', basis: 'Bylaw — Registrar filing in 45 days', en: 'Compliance Register', hi: 'अनुपालन पंजिका' },
  { group: 'compliance', rule: 'audit_register', model: 'ImsAudit', resource: 'audits', basis: 'Accountability — internal/external audit', en: 'Audit Register', hi: 'लेखा-परीक्षण पंजिका' },
  { group: 'compliance', rule: 'risk_register', model: 'ImsRisk', resource: 'risks', basis: 'Accountability — risk management', en: 'Risk Register', hi: 'जोखिम पंजिका' },
  { group: 'hr', rule: 'employee_register', model: 'ImsEmployee', resource: 'employees', basis: 'Accountability — payroll', en: 'Employee Register', hi: 'कर्मचारी पंजिका' },
  { group: 'hr', rule: 'volunteer_register', model: 'ImsVolunteer', resource: 'volunteers', basis: 'Accountability — volunteer coordination', en: 'Volunteer Register', hi: 'स्वयंसेवक पंजिका' },
];

router.get('/ims/register-map', wrap(async (_req, r) => {
  const out = [];
  for (const reg of REQUIRED_REGISTERS) {
    const M = models[reg.model];
    let count = 0;
    try { count = M ? await M.count() : 0; } catch { count = 0; }
    out.push({ ...reg, count });
  }
  const groups = [...new Set(out.map(x => x.group))];
  r.json({
    total: out.length,
    groups,
    byGroup: groups.map(g => ({ group: g, count: out.filter(x => x.group === g).length })),
    registers: out,
  });
}));

// ---- coverage vs the legacy flat registers ---------------------------------
router.get('/ims/coverage', wrap(async (_req, r) => {
  const { sequelize } = require('../models/ims');
  let legacy = 0, legacyModules = 0;
  try {
    const [rows] = await sequelize.query(
      'SELECT COUNT(DISTINCT module) AS modules, COUNT(*) AS rows FROM "DigitalOfficeRecords"',
    );
    legacy = Number(rows[0].rows || 0);
    legacyModules = Number(rows[0].modules || 0);
  } catch { /* legacy table absent */ }

  const required = REQUIRED_REGISTERS.length;
  const covered = [];
  for (const reg of REQUIRED_REGISTERS) {
    const M = models[reg.model];
    let count = 0;
    try { count = M ? await M.count() : 0; } catch { count = 0; }
    covered.push({ rule: reg.rule, en: reg.en, count });
  }
  r.json({
    requiredRegisters: required,
    legacy: { rows: legacy, distinctModules: legacyModules },
    covered,
    missing: covered.filter(c => c.count === 0).length,
  });
}));

// ---- legacy -> IMS migration (additive, idempotent) ------------------------
// GET  = dry run report (nothing written). POST = actual import.
router.get('/ims/migrate-legacy', wrap(async (req, r) => {
  const stats = await migrateLegacy({ dryRun: true, limit: Number(req.query.limit) || 5000 });
  r.json({ mode: 'dry-run', note: 'Nothing written. POST to this URL to import.', ...stats });
}));

router.post('/ims/migrate-legacy', wrap(async (req, r) => {
  const stats = await migrateLegacy({ dryRun: false, limit: Number((req.body && req.body.limit) || req.query.limit) || 5000 });
  r.json({ mode: 'import', ...stats });
}));

// ---- generic CRUD for every resource --------------------------------------
router.get('/ims/:resource', wrap(async (req, r) => r.json(await res.list(req.params.resource, req.query))));

router.post('/ims/:resource', wrap(async (req, r) => {
  const row = await res.create(req.params.resource, req.body || {}, req, {
    allowDuplicate: req.query.allowDuplicate === 'true',
  });
  r.status(201).json(row);
}));

router.get('/ims/:resource/:id', wrap(async (req, r) => {
  const out = await res.getOne(req.params.resource, req.params.id);
  if (!out) return r.status(404).json({ message: 'Not found' });
  r.json(out);
}));

router.put('/ims/:resource/:id', wrap(async (req, r) => r.json(await res.update(req.params.resource, req.params.id, req.body || {}, req))));

// Version history for a single record (who changed what, when).
router.get('/ims/:resource/:id/history', wrap(async (req, r) => {
  const row = await res.getOne(req.params.resource, req.params.id, false);
  if (!row) return r.status(404).json({ message: 'Not found' });
  const rows = await models.ImsAuditTrail.findAll({
    where: { entityType: req.params.resource, entityId: row.recordId },
    order: [['id', 'DESC']],
    limit: 100,
  });
  r.json({ recordId: row.recordId, history: rows });
}));

router.delete('/ims/:resource/:id', wrap(async (req, r) => r.json(await res.archive(req.params.resource, req.params.id, req, req.query.reason))));

module.exports = router;
