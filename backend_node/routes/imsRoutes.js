// SSF-IMS API. One generic resource engine + specialised endpoints.
const express = require('express');
const router = express.Router();
const { models } = require('../models/ims');
const { Op } = require('sequelize');
const res = require('../services/ims/resource');
const { mainDashboard, moduleDashboard } = require('../services/ims/dashboard');
const { person360 } = require('../services/ims/person360');
const { meetingDossier, member360 } = require('../services/ims/workspaces');
const { seedGovernance } = require('../services/ims/seed');
const { seedPolicy } = require('../services/ims/policySeed');
const { seedOrgProfile } = require('../services/ims/orgProfileSeed');
const { seedOfficeHistory } = require('../services/ims/officeHistorySeed');
const { migrateLegacy } = require('../services/ims/migrateLegacy');
const { universalSearch, meta: searchMeta } = require('../services/ims/search');
const { volunteerDashboard } = require('../services/ims/volunteerNetwork');
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
// Pan-India volunteer network: chapters, leadership ladder, tasks and funds.
router.get('/ims/volunteer-network', wrap(async (_req, r) => r.json(await volunteerDashboard())));
router.get('/ims/roles', (_req, r) => r.json({ roles: ROLES, grants: DEFAULT_GRANTS }));

// ---- seed ------------------------------------------------------------------
router.post('/ims/seed', wrap(async (_req, r) => {
  const governance = await seedGovernance();
  const policy = await seedPolicy();
  const orgProfile = await seedOrgProfile();
  const officeHistory = await seedOfficeHistory();
  r.json({ ...governance, policy, orgProfile, officeHistory });
}));

// ---- organisation profile (master identity, seeded) ------------------------
router.post('/ims/org-profile/seed', wrap(async (_req, r) => r.json(await seedOrgProfile())));

// ---- managing committee history (seeded from real office data) -------------
router.post('/ims/office-history/seed', wrap(async (_req, r) => r.json(await seedOfficeHistory())));

// ---- person 360 ------------------------------------------------------------
router.get('/ims/person360/:id', wrap(async (req, r) => {
  const out = await person360(req.params.id);
  if (!out) return r.status(404).json({ message: 'Person not found' });
  r.json(out);
}));

// ---- meeting dossier + member 360 -----------------------------------------
router.get('/ims/meeting-dossier/:id', wrap(async (req, r) => {
  const out = await meetingDossier(req.params.id);
  if (!out) return r.status(404).json({ message: 'Meeting not found' });
  r.json(out);
}));

router.get('/ims/member360/:id', wrap(async (req, r) => {
  const out = await member360(req.params.id);
  if (!out) return r.status(404).json({ message: 'Member not found' });
  r.json(out);
}));

// ---- global search (universal, across every module) ------------------------
// Filters: q, module, type, status, dateFrom, dateTo.
// `type=persons` / `type=meetings` also work, so older links stay valid.
router.get('/ims/search', wrap(async (req, r) => {
  const filters = {
    module: req.query.module || '',
    type: req.query.type || req.query.recordType || '',
    status: req.query.status || '',
    dateFrom: req.query.dateFrom || '',
    dateTo: req.query.dateTo || '',
  };
  // Legacy type aliases (resource plural -> search key) so old links never 404.
  const ALIAS = { persons: 'persons', members: 'members', donors: 'donors', volunteers: 'volunteers', employees: 'employees', beneficiaries: 'beneficiaries', meetings: 'meetings', resolutions: 'resolutions', actions: 'actions', documents: 'documents', cases: 'cases', transactions: 'transactions', projects: 'projects', donations: 'donations', grants: 'grants' };
  if (filters.type && ALIAS[filters.type]) filters.type = ALIAS[filters.type];
  r.json(await universalSearch(req.query.q || '', filters));
}));

// Filter metadata for the Global Search UI (modules + record types).
router.get('/ims/search/meta', wrap(async (_req, r) => r.json(searchMeta())));


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

// ---- FINANCE: one entry point + professional accounting --------------------
// "Receipts & Payments" records a financial transaction ONCE; the engine posts
// balanced double-entry ledger lines so Ledger/Journal/Trial Balance follow.
const accounting = require('../services/ims/accounting');
const { financeSeed } = require('../services/ims/financeSeed');
const { financeDashboard } = require('../services/ims/financeDashboard');

router.post('/ims/finance/seed', wrap(async (_req, r) => r.json(await financeSeed())));
router.get('/ims/finance/dashboard', wrap(async (_req, r) => r.json(await financeDashboard())));

// Single entry point: create a receipt / payment / journal voucher.
router.post('/ims/finance/receipts-payments', wrap(async (req, r) => {
  const out = await accounting.postVoucher(req.body || {}, req);
  r.status(201).json({
    voucher: out.voucher,
    transaction: out.transaction,
    entries: out.entries,
  });
}));

// List vouchers + their single-entry transactions (the Receipts & Payments register).
router.get('/ims/finance/receipts-payments', wrap(async (req, r) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const rows = await models.ImsTransaction.findAll({
    where: { status: { [Op.ne]: 'archived' } },
    order: [['id', 'DESC']],
    limit,
  });
  r.json({ records: rows, total: rows.length });
}));

router.get('/ims/finance/trial-balance', wrap(async (req, r) => r.json(await accounting.trialBalance({
  asOf: req.query.asOf, financialYearId: req.query.financialYearId,
}))));

router.get('/ims/finance/day-book', wrap(async (req, r) => r.json(await accounting.dayBook({
  from: req.query.from, to: req.query.to, voucherType: req.query.voucherType,
  voucherNo: req.query.voucherNo, transactionNo: req.query.transactionNo, limit: req.query.limit,
}))));

router.get('/ims/finance/cash-book', wrap(async (req, r) => r.json(await accounting.book('cash', {
  cashAccountId: req.query.cashAccountId, from: req.query.from, to: req.query.to,
}))));

router.get('/ims/finance/bank-book', wrap(async (req, r) => r.json(await accounting.book('bank', {
  bankAccountId: req.query.bankAccountId, from: req.query.from, to: req.query.to,
}))));

router.get('/ims/finance/budget-variance', wrap(async (req, r) => r.json(await accounting.budgetVariance({
  financialYearId: req.query.financialYearId, costCentreId: req.query.costCentreId,
}))));

router.get('/ims/finance/ledger/:accountId', wrap(async (req, r) => r.json(await accounting.accountLedger(
  req.params.accountId, { from: req.query.from, to: req.query.to, limit: req.query.limit },
))));

// ---- COST CENTRES (classification & reporting dimension) -------------------
const cc = require('../services/ims/costCentre');
const { seedCostCentres } = require('../services/ims/costCentreSeed');
const { seedVolunteers } = require('../services/ims/volunteerSeed');

router.post('/ims/volunteers/seed', wrap(async (req, r) => r.json(await seedVolunteers(req))));
router.post('/ims/finance/cost-centres/seed', wrap(async (_req, r) => r.json(await seedCostCentres())));
router.get('/ims/finance/cost-centres/meta', (_req, r) => r.json({ types: cc.COST_CENTRE_TYPES, categories: cc.COST_CENTRE_CATEGORIES }));
router.get('/ims/finance/cost-centres/dashboard', wrap(async (req, r) => r.json(await cc.costCentreDashboard({
  financialYearId: req.query.financialYearId,
}))));
router.get('/ims/finance/cost-centres/reports/annual', wrap(async (req, r) => r.json(await cc.annualReport({
  financialYearId: req.query.financialYearId,
}))));
router.get('/ims/finance/cost-centres', wrap(async (req, r) => r.json({ records: await cc.listCostCentres({
  financialYearId: req.query.financialYearId, centreType: req.query.centreType, category: req.query.category,
  programmeId: req.query.programmeId, projectId: req.query.projectId, status: req.query.status,
  location: req.query.location, from: req.query.from, to: req.query.to,
}) })));
router.get('/ims/finance/cost-centres/:id', wrap(async (req, r) => r.json(await cc.costCentre360(req.params.id))));
router.get('/ims/finance/cost-centres/:id/monthly', wrap(async (req, r) => r.json(await cc.monthlyReport(req.params.id, { financialYearId: req.query.financialYearId }))));
router.get('/ims/finance/cost-centres/:id/quarterly', wrap(async (req, r) => r.json(await cc.quarterlyReport(req.params.id, { financialYearId: req.query.financialYearId }))));
router.get('/ims/finance/cost-centres/:id/close-check', wrap(async (req, r) => r.json(await cc.costCentreCloseCheck(req.params.id))));
router.post('/ims/finance/cost-centres/:id/status', wrap(async (req, r) => r.json(await cc.setCostCentreStatus(req.params.id, (req.body || {}).status, req))));


// ---- NOTIFICATION & ACTION CENTRE ------------------------------------------
// A notification is an alert about a real event; reading it never completes the
// underlying task. Alerts are derived (evidence-based, deduplicated) from the
// source registers. See services/ims/notifications.js.
const notif = require('../services/ims/notifications');

// List alerts (filters: status=unread|read, category, search, limit).
router.get('/ims/notifications', wrap(async (req, r) => r.json(await notif.listNotifications(req.query))));

// Unread count only (for the header badge).
router.get('/ims/notifications/unread-count', wrap(async (_req, r) => r.json({ unread: await notif.unreadCount() })));

// What the centre is watching: per-source monitored/due counts + connectivity.
router.get('/ims/notifications/sources', wrap(async (_req, r) => r.json(await notif.sourceSummary())));

// Derive any new alerts from the connected source registers (idempotent), then
// send out anything not yet sent on email / WhatsApp / SMS (no-op unless a
// provider for that channel is configured).
router.post('/ims/notifications/sync', wrap(async (_req, r) => {
  const sync = await notif.syncNotifications();
  let delivery = { configured: false, sent: 0 };
  try { delivery = await notif.deliverNotifications(); } catch (e) { delivery = { error: e.message }; }
  r.json({ ...sync, delivery });
}));

// Which delivery channels are usable right now (email / whatsapp / sms).
router.get('/ims/notifications/channels', wrap(async (_req, r) => r.json(notif.channelsStatus())));

// Delivery log for an alert (evidence of what was actually sent, per channel).
router.get('/ims/notifications/:id/deliveries', wrap(async (req, r) => r.json(await notif.listDeliveries(req.params.id))));

// Deliberate single-alert test send — bypasses the once-only gate so an admin
// can verify a freshly configured channel. Body: { channels: ['whatsapp'] }.
router.post('/ims/notifications/:id/test', wrap(async (req, r) => {
  const channels = Array.isArray((req.body || {}).channels) ? req.body.channels : ['email'];
  r.json(await notif.sendTest(req.params.id, channels));
}));

// Mark one alert read (per-user; never touches the source record).
router.post('/ims/notifications/:id/read', wrap(async (req, r) => r.json(await notif.markRead(req.params.id, req))));

// Mark every eligible alert read (eligible = not dismissed; applies to this user).
router.post('/ims/notifications/read-all', wrap(async (req, r) => r.json({ updated: await notif.markAllRead(req) })));

// ---- contact & email directory ---------------------------------------------
// Lists every person with their email status and bulk-fills emails, so the
// Action Centre always knows who to notify.
const contacts = require('../services/ims/contacts');
router.get('/ims/contacts/emails', wrap(async (req, r) => r.json(await contacts.listContactEmails({
  onlyMissing: req.query.onlyMissing === 'true', search: req.query.search || '',
}))));
router.post('/ims/contacts/emails', wrap(async (req, r) => r.status(200).json(await contacts.importContactEmails((req.body || {}).rows))));
// Pull people out of the members + managing-committee registers into the
// directory (additive, idempotent). Safe to call repeatedly.
router.post('/ims/contacts/sync-registers', wrap(async (_req, r) => r.status(200).json(await contacts.syncPeopleFromRegisters())));

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
