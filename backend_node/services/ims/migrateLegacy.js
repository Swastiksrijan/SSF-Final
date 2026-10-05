// Legacy -> SSF-IMS migration.
//
// Rules (hard):
//   * ADDITIVE ONLY. Nothing in the legacy tables is ever modified or deleted
//     ("kuch hatana nhi"). We only create rows in the IMS masters.
//   * IDEMPOTENT. Every legacy row we import is stamped with an ImsRelation
//     (fromType 'legacy', fromId '<module>:<recordId>'); re-running skips it.
//   * SAFE BY DEFAULT. dryRun=true only reports what *would* happen.
//
// Legacy sources handled:
//   Member / Volunteer / Donor        -> Person (+ role record)
//   FinanceTransaction                -> Transaction (+ Donation for credits)
//   DigitalOfficeRecord (module map)  -> the matching IMS master
const { models } = require('../../models/ims');
const { nextId } = require('./ids');
const { logAudit, link } = require('./audit');

const LEGACY_MARK = 'legacy';

// ---- helpers ---------------------------------------------------------------
const s = (v) => (v === undefined || v === null ? undefined : String(v).trim() || undefined);
const num = (v) => (v === undefined || v === null || v === '' ? undefined : Number(v));
const day = (v) => {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
};

async function alreadyMigrated(module, recordId) {
  const key = `${module}:${recordId}`;
  const hit = await models.ImsRelation.findOne({ where: { fromType: LEGACY_MARK, fromId: key } });
  return hit ? { toType: hit.toType, toId: hit.toId } : null;
}

async function markMigrated(module, recordId, toType, toId) {
  await models.ImsRelation.findOrCreate({
    where: { fromType: LEGACY_MARK, fromId: `${module}:${recordId}`, toType, toId: String(toId) },
    defaults: { fromType: LEGACY_MARK, fromId: `${module}:${recordId}`, toType, toId: String(toId), relation: 'migrated-from' },
  });
}

/** Find an existing Person by mobile/email, else create one. */
async function ensurePerson(src, stats) {
  const mobile = s(src.mobile || src.phone);
  const email = s(src.email);
  if (mobile || email) {
    const { Op } = require('sequelize');
    const ors = [];
    if (mobile) ors.push({ mobile });
    if (email) ors.push({ email });
    const found = await models.ImsPerson.findOne({ where: { [Op.or]: ors } });
    if (found) { stats.personsReused++; return found; }
  }
  const recordId = await nextId('PERSON', null, models.ImsPerson);
  const row = await models.ImsPerson.create({
    recordId,
    fullName: s(src.fullName || src.name) || 'Unknown',
    mobile, email,
    address: s(src.address), city: s(src.city), state: s(src.state),
    gender: s(src.gender), dob: day(src.dob),
    occupation: s(src.occupation),
    data: { legacySource: src.__source || null },
    createdBy: 'migration', createdByName: 'Legacy Import',
  });
  await logAudit({ entityType: 'persons', entityId: recordId, action: 'create', newValue: row.toJSON(), actor: 'migration' });
  stats.personsCreated++;
  return row;
}

async function grantRole(personId, roleCode, refType, refId) {
  await models.ImsPersonRole.findOrCreate({
    where: { personId, roleCode, refId },
    defaults: {
      personId, roleCode, refType, refId,
      recordId: `PR-${refId}-${roleCode}`, status: 'active',
    },
  });
}

// ---- module map: legacy DigitalOfficeRecord.module -> IMS resource ----------
const MODULE_MAP = {
  meetings: 'meetings', meeting: 'meetings', agmMinutes: 'meetings', ecMinutes: 'meetings',
  resolution: 'resolutions', resolutions: 'resolutions',
  members: 'members', memberRegister: 'members',
  officeBearer: 'committeeMembers', managingCommittee: 'committeeMembers', officeHistory: 'committeeMembers',
  volunteers: 'volunteers', volunteerIntern: 'volunteers',
  donors: 'donors', donorMaster: 'donors', foreignDonor: 'donors',
  donations: 'donations', contribution: 'donations', corpusDonation: 'donations',
  anonymousDonation: 'donations', donor80g: 'donations', inKind: 'donations',
  expenses: 'transactions', programmeExpense: 'transactions', capitalExpenditure: 'transactions',
  rent: 'transactions', travel: 'transactions', advance: 'transactions', bankCharges: 'transactions',
  pettyCash: 'transactions', cash: 'transactions', bank: 'transactions', cashbank: 'transactions',
  ledger: 'transactions', transfer: 'transactions', adjustment: 'transactions',
  vouchers: 'vouchers', paymentVoucher: 'vouchers',
  projects: 'projects', events: 'activities', activities: 'activities',
  beneficiaries: 'beneficiaries',
  assets: 'assets', fixedAssets: 'assets', inventory: 'inventory',
  employees: 'employees', employeeMaster: 'employees', payroll: 'employees', honorarium: 'employees',
  attendance: 'attendance',
  mou: 'agreements', grantAgreement: 'agreements',
  documents: 'documents', officialDocuments: 'documents', documentIndex: 'documents',
  grant: 'grants', utilisationCertificate: 'grants',
  compliance: 'compliance', complianceCalendar: 'compliance', statutoryRegistrations: 'compliance',
  licence: 'compliance', legalCase: 'compliance', fcra: 'compliance', taxReturns: 'compliance',
  audits: 'audits', internalAudit: 'audits', auditedStatements: 'audits', auditObservations: 'audits',
  risk: 'risks', policy: 'policies', notifications: 'notices',
};

// Some resources need a required-ish text field derived from legacy JSON.
const TEXT_FIELD = {
  meetings: ['title', ['title', 'subject', 'agenda', 'purpose']],
  resolutions: ['title', ['title', 'subject', 'resolution']],
  activities: ['title', ['title', 'name', 'event', 'activity']],
  agreements: ['title', ['title', 'name', 'party']],
  documents: ['title', ['title', 'name', 'document', 'subject']],
  policies: ['title', ['title', 'name', 'policy']],
  risks: ['title', ['title', 'name', 'risk']],
  notices: ['subject', ['subject', 'title', 'message']],
  projects: ['name', ['name', 'title', 'project']],
  beneficiaries: ['household', ['household', 'name', 'family']],
  employees: ['designation', ['designation', 'role', 'position']],
  volunteers: ['skills', ['skills', 'skill', 'work']],
  compliance: ['obligation', ['obligation', 'title', 'name']],
  audits: ['auditor', ['auditor', 'name', 'agency']],
  grants: ['utilisationCertNo', ['utilisationCertNo', 'ucNo', 'certNo']],
  vouchers: ['voucherNo', ['voucherNo', 'number', 'no']],
};

function pickText(module, data) {
  const spec = TEXT_FIELD[module];
  if (!spec) return {};
  const [field, keys] = spec;
  for (const k of keys) if (data && data[k]) return { [field]: String(data[k]).slice(0, 250) };
  return {};
}

async function importDigitalOfficeRecord(rec, stats, dryRun) {
  const module = rec.module;
  const resource = MODULE_MAP[module];
  if (!resource) { stats.unmapped.push(`${module}:${rec.recordId}`); return; }
  const done = await alreadyMigrated('digital-office', rec.recordId);
  if (done) { stats.skipped++; return; }

  const data = rec.data || {};
  const payload = {
    ...pickText(resource, data),
    status: rec.status === 'active' ? 'active' : (rec.status || 'active'),
    data: { ...data, _legacyModule: module, _legacyRecordId: rec.recordId },
    createdBy: 'migration', createdByName: 'Legacy Import',
  };
  if (rec.recordDate) payload.meetingDate = payload.meetingDate || day(rec.recordDate);
  if (resource === 'transactions') {
    payload.txnDate = day(rec.recordDate);
    payload.amount = num(rec.amount);
    payload.direction = rec.direction === 'in' || rec.direction === 'credit' ? 'in' : 'out';
    payload.paymentMode = s(rec.paymentMode);
    payload.sourceModule = module;
    payload.sourceRecordId = rec.recordId;
  }
  if (resource === 'donations') {
    payload.donationDate = day(rec.recordDate);
    payload.amount = num(rec.amount);
    payload.mode = s(rec.paymentMode);
  }
  if (dryRun) { stats.wouldCreate[resource] = (stats.wouldCreate[resource] || 0) + 1; return; }

  const r = require('./resource');
  const row = await r.create(resource, payload, null, { skipDuplicateCheck: true, allowDuplicate: true });
  await markMigrated('digital-office', rec.recordId, resource, row.recordId);
  stats.created[resource] = (stats.created[resource] || 0) + 1;
}

// ---- run -------------------------------------------------------------------
async function migrateLegacy({ dryRun = true, limit = 5000 } = {}) {
  const stats = {
    dryRun, limit,
    personsCreated: 0, personsReused: 0,
    skipped: 0, created: {}, wouldCreate: {}, unmapped: [],
    sources: {},
  };

  // 1. Public Member accounts -> Person + Membership
  const legacyMembers = await require('../../models/Member').findAll({ limit });
  stats.sources.members = legacyMembers.length;
  for (const m of legacyMembers) {
    const done = await alreadyMigrated('member', m.id);
    if (done) { stats.skipped++; continue; }
    if (dryRun) { stats.wouldCreate.persons = (stats.wouldCreate.persons || 0) + 1; stats.wouldCreate.members = (stats.wouldCreate.members || 0) + 1; continue; }
    const person = await ensurePerson({ ...m.toJSON(), __source: 'members' }, stats);
    const recId = await nextId('MEM', undefined, models.ImsMembership);
    const row = await models.ImsMembership.create({
      recordId: recId, personId: person.id, memberNo: m.memberId || recId,
      category: m.memberType || 'Ordinary', admissionDate: day(m.createdAt),
      applicationStatus: m.status === 'approved' ? 'approved' : (m.status || 'submitted'),
      feeAmount: num(m.paymentAmount), feeFrequency: 'annual',
      createdBy: 'migration', createdByName: 'Legacy Import',
    });
    await grantRole(person.id, 'member', 'members', row.id);
    await logAudit({ entityType: 'members', entityId: recId, action: 'create', newValue: row.toJSON(), actor: 'migration' });
    await link('persons', person.recordId, 'members', recId, 'member-of');
    await markMigrated('member', m.id, 'persons', person.recordId);
    stats.created.members = (stats.created.members || 0) + 1;
  }

  // 2. Volunteers -> Person + Volunteer
  const legacyVols = await require('../../models/Volunteer').findAll({ limit });
  stats.sources.volunteers = legacyVols.length;
  for (const v of legacyVols) {
    const done = await alreadyMigrated('volunteer', v.id);
    if (done) { stats.skipped++; continue; }
    if (dryRun) { stats.wouldCreate.volunteers = (stats.wouldCreate.volunteers || 0) + 1; continue; }
    const person = await ensurePerson({ ...v.toJSON(), __source: 'volunteers' }, stats);
    const recId = await nextId('VOL', undefined, models.ImsVolunteer);
    const row = await models.ImsVolunteer.create({
      recordId: recId, personId: person.id, skills: v.volunteerType || v.interestArea || undefined,
      createdBy: 'migration', createdByName: 'Legacy Import',
    });
    await grantRole(person.id, 'volunteer', 'volunteers', row.id);
    await markMigrated('volunteer', v.id, 'persons', person.recordId);
    stats.created.volunteers = (stats.created.volunteers || 0) + 1;
  }

  // 3. Donors -> Person + Donor
  const legacyDonors = await require('../../models/Donor').findAll({ limit });
  stats.sources.donors = legacyDonors.length;
  for (const d of legacyDonors) {
    const done = await alreadyMigrated('donor', d.id);
    if (done) { stats.skipped++; continue; }
    if (dryRun) { stats.wouldCreate.donors = (stats.wouldCreate.donors || 0) + 1; continue; }
    const person = await ensurePerson({ ...d.toJSON(), __source: 'donors' }, stats);
    const recId = await nextId('DON', undefined, models.ImsDonor);
    const row = await models.ImsDonor.create({
      recordId: recId, personId: person.id, donorType: d.donorType || 'individual',
      pan: s(d.pan), createdBy: 'migration', createdByName: 'Legacy Import',
    });
    await grantRole(person.id, 'donor', 'donors', row.id);
    await markMigrated('donor', d.id, 'persons', person.recordId);
    stats.created.donors = (stats.created.donors || 0) + 1;
  }

  // 4. FinanceTransaction -> Transaction
  const legacyTxns = await require('../../models/FinanceTransaction').findAll({ limit });
  stats.sources.financeTransactions = legacyTxns.length;
  for (const t of legacyTxns) {
    const done = await alreadyMigrated('finance-txn', t.id);
    if (done) { stats.skipped++; continue; }
    if (dryRun) { stats.wouldCreate.transactions = (stats.wouldCreate.transactions || 0) + 1; continue; }
    const recId = await nextId('TXN', undefined, models.ImsTransaction);
    const row = await models.ImsTransaction.create({
      recordId: recId, transactionNo: t.transactionId || recId,
      txnDate: day(t.transactionDate), transactionType: t.transactionType,
      amount: num(t.amount), direction: t.direction || (t.transactionType === 'income' ? 'in' : 'out'),
      sourceModule: 'finance', sourceRecordId: t.transactionId,
      needsReview: !!t.needsReview,
      data: t.data || {},
      createdBy: 'migration', createdByName: 'Legacy Import',
    });
    await markMigrated('finance-txn', t.id, 'transactions', recId);
    stats.created.transactions = (stats.created.transactions || 0) + 1;
  }

  // 5. Flat DigitalOfficeRecords -> mapped IMS masters
  const legacyOffice = await require('../../models/DigitalOfficeRecord').findAll({ limit });
  stats.sources.digitalOfficeRecords = legacyOffice.length;
  for (const rec of legacyOffice) {
    await importDigitalOfficeRecord(rec, stats, dryRun);
  }

  stats.unmapped = [...new Set(stats.unmapped)];
  return stats;
}

module.exports = { migrateLegacy, MODULE_MAP };
