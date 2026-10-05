// Generic SSF-IMS resource engine.
// Every module reuses this: permanent id, audit trail, soft-archive, duplicate check.
const { models } = require('../../models/ims');
const { nextId } = require('./ids');
const { logAudit, link, relationsOf } = require('./audit');

// module key -> { model, prefix, nameField, duplicateKeys }
const RESOURCES = {
  persons:      { model: models.ImsPerson,        prefix: 'PERSON',  name: 'fullName', dup: ['mobile', 'email'] },
  members:      { model: models.ImsMembership,    prefix: 'MEM',     name: 'memberNo', dup: [] },
  organisations:{ model: models.ImsOrganisation,  prefix: 'ORG',     name: 'name', dup: [] },
  committees:   { model: models.ImsCommittee,     prefix: 'CMT',     name: 'name', dup: [] },
  committeeMembers: { model: models.ImsCommitteeMember, prefix: 'CMM', name: 'position', dup: [] },
  meetings:     { model: models.ImsMeeting,       prefix: 'MEET',    name: 'title', dup: [] },
  attendees:    { model: models.ImsMeetingAttendee, prefix: 'ATT',   name: 'attendance', dup: [] },
  resolutions:  { model: models.ImsResolution,    prefix: 'RES',     name: 'title', dup: [] },
  actions:      { model: models.ImsAction,        prefix: 'ACTION',  name: 'title', dup: [] },
  notices:      { model: models.ImsNotice,        prefix: 'NTC',     name: 'subject', dup: [] },
  cases:        { model: models.ImsCase,          prefix: 'CASE',    name: 'title', dup: [] },
  programmes:   { model: models.ImsProgramme,     prefix: 'PROGRAM', name: 'name', dup: [] },
  projects:     { model: models.ImsProject,       prefix: 'PROJECT', name: 'name', dup: [] },
  activities:   { model: models.ImsActivity,      prefix: 'ACT',     name: 'title', dup: [] },
  beneficiaries:{ model: models.ImsBeneficiary,   prefix: 'BEN',     name: 'household', dup: [] },
  financialYears:{ model: models.ImsFinancialYear, prefix: 'FY',     name: 'label', dup: [] },
  funds:        { model: models.ImsFund,          prefix: 'FUND',    name: 'name', dup: [] },
  costCentres:  { model: models.ImsCostCentre,    prefix: 'CC',      name: 'name', dup: [] },
  accounts:     { model: models.ImsAccount,       prefix: 'COA',     name: 'name', dup: ['code'] },
  parties:      { model: models.ImsParty,         prefix: 'PTY',     name: 'name', dup: [] },
  bankAccounts: { model: models.ImsBankAccount,   prefix: 'BNK',     name: 'accountNo', dup: [] },
  cashAccounts: { model: models.ImsCashAccount,   prefix: 'CSH',     name: 'name', dup: [] },
  transactions: { model: models.ImsTransaction,   prefix: 'TXN',     name: 'transactionNo', dup: [] },
  vouchers:     { model: models.ImsVoucher,       prefix: 'VCH',     name: 'voucherNo', dup: [] },
  ledger:       { model: models.ImsLedgerEntry,   prefix: 'LED',     name: 'entryNo', dup: [] },
  budgets:      { model: models.ImsBudget,        prefix: 'BUD',     name: 'period', dup: [] },
  donors:       { model: models.ImsDonor,         prefix: 'DON',     name: 'donorType', dup: [] },
  donations:    { model: models.ImsDonation,      prefix: 'DONATION',name: 'receiptNo', dup: [] },
  grants:       { model: models.ImsGrant,         prefix: 'GRANT',   name: 'utilisationCertNo', dup: [] },
  assets:       { model: models.ImsAsset,         prefix: 'ASSET',   name: 'name', dup: [] },
  inventory:    { model: models.ImsInventoryItem, prefix: 'INV',     name: 'name', dup: [] },
  employees:    { model: models.ImsEmployee,      prefix: 'EMP',     name: 'designation', dup: [] },
  volunteers:   { model: models.ImsVolunteer,     prefix: 'VOL',     name: 'skills', dup: [] },
  attendance:   { model: models.ImsAttendance,    prefix: 'ATD',     name: 'attStatus', dup: [] },
  compliance:   { model: models.ImsCompliance,    prefix: 'CMP',     name: 'obligation', dup: [] },
  agreements:   { model: models.ImsAgreement,     prefix: 'AGR',     name: 'title', dup: [] },
  audits:       { model: models.ImsAudit,         prefix: 'AUDIT',   name: 'auditor', dup: [] },
  risks:        { model: models.ImsRisk,          prefix: 'RSK',     name: 'title', dup: [] },
  documents:    { model: models.ImsDocument,      prefix: 'DOC',     name: 'title', dup: [] },
  communications:{ model: models.ImsCommunication,prefix: 'COM',     name: 'subject', dup: [] },
  policies:     { model: models.ImsPolicy,        prefix: 'POL',     name: 'title', dup: [] },
  governanceRules:{ model: models.ImsGovernanceRule, prefix: 'RULE', name: 'key', dup: [] },
  users:        { model: models.ImsUser,          prefix: 'USR',     name: 'username', dup: ['username', 'email'] },
};

function getResource(key) {
  const r = RESOURCES[key];
  if (!r) throw new Error('Unknown IMS resource: ' + key);
  return r;
}

/** Duplicate detection before create. Returns array of likely matches. */
async function findDuplicates(key, payload) {
  const r = getResource(key);
  if (!r.dup || !r.dup.length) return [];
  const where = {};
  for (const f of r.dup) {
    if (payload[f]) where[f] = payload[f];
  }
  if (!Object.keys(where).length) return [];
  const { Op } = require('sequelize');
  const ors = Object.entries(where).map(([f, v]) => ({ [f]: v }));
  const rows = await r.model.findAll({
    where: { [Op.or]: ors, status: { [Op.ne]: 'archived' } },
    limit: 5,
  });
  return rows.map(x => ({ recordId: x.recordId, id: x.id, name: x[r.name], matched: Object.keys(where) }));
}

// Resources that grant a role to the linked Person automatically.
// key -> { roleCode, personField, refType }
const ROLE_HOOKS = {
  members:        { roleCode: 'member',        personField: 'personId', refType: 'members' },
  donors:         { roleCode: 'donor',         personField: 'personId', refType: 'donors' },
  volunteers:     { roleCode: 'volunteer',     personField: 'personId', refType: 'volunteers' },
  employees:      { roleCode: 'employee',      personField: 'personId', refType: 'employees' },
  beneficiaries:  { roleCode: 'beneficiary',   personField: 'personId', refType: 'beneficiaries' },
  committeeMembers: { roleCode: 'committee',   personField: 'personId', refType: 'committeeMembers' },
};

async function grantRole(key, row) {
  const hook = ROLE_HOOKS[key];
  if (!hook) return;
  const personId = row[hook.personField];
  if (!personId) return;
  await models.ImsPersonRole.findOrCreate({
    where: { personId, roleCode: hook.roleCode, refId: row.id },
    defaults: {
      personId, roleCode: hook.roleCode, refType: hook.refType, refId: row.id,
      recordId: 'PR-' + row.id + '-' + hook.roleCode, status: 'active',
    },
  });
}

async function create(key, payload, req, opts = {}) {
  const r = getResource(key);
  const dupes = opts.skipDuplicateCheck ? [] : await findDuplicates(key, payload);
  if (dupes.length && !opts.allowDuplicate) {
    const err = new Error('Possible existing record found.');
    err.status = 409;
    err.duplicates = dupes;
    throw err;
  }
  const recordId = payload.recordId || await nextId(r.prefix, opts.year, r.model);
  const row = await r.model.create({
    ...payload,
    recordId,
    createdBy: req && req.imsRole ? req.imsRole : (payload.createdBy || 'system'),
    createdByName: payload.createdByName || (req && req.headers && req.headers['x-office-actor-name']) || 'SSF Admin',
  });
  await logAudit({ entityType: key, entityId: recordId, action: 'create', newValue: row.toJSON(), req });
  await grantRole(key, row);
  return row;
}

async function update(key, idOrRecordId, payload, req) {
  const r = getResource(key);
  const where = /^\d+$/.test(String(idOrRecordId)) ? { id: idOrRecordId } : { recordId: idOrRecordId };
  const row = await r.model.findOne({ where });
  if (!row) { const e = new Error('Record not found'); e.status = 404; throw e; }
  const before = row.toJSON();
  Object.assign(row, payload);
  row.updatedBy = req && req.imsRole ? req.imsRole : 'system';
  await row.save();
  await logAudit({ entityType: key, entityId: row.recordId, action: 'update', oldValue: before, newValue: row.toJSON(), req });
  return row;
}

async function archive(key, idOrRecordId, req, reason) {
  const r = getResource(key);
  const where = /^\d+$/.test(String(idOrRecordId)) ? { id: idOrRecordId } : { recordId: idOrRecordId };
  const row = await r.model.findOne({ where });
  if (!row) { const e = new Error('Record not found'); e.status = 404; throw e; }
  const before = row.toJSON();
  row.status = 'archived';
  await row.save();
  await logAudit({ entityType: key, entityId: row.recordId, action: 'archive', oldValue: before, newValue: { status: 'archived' }, reason, req });
  return row;
}

async function list(key, query = {}) {
  const r = getResource(key);
  const { Op } = require('sequelize');
  const where = {};
  if (query.status) where.status = query.status;
  else where.status = { [Op.ne]: 'archived' };
  if (query.search) {
    where[Op.or] = [
      { [r.name]: { [Op.iLike]: '%' + query.search + '%' } },
      { recordId: { [Op.iLike]: '%' + query.search + '%' } },
    ];
  }
  const limit = Math.min(Number(query.limit) || 100, 500);
  const offset = Number(query.offset) || 0;
  const { rows, count } = await r.model.findAndCountAll({ where, limit, offset, order: [['id', 'DESC']] });
  return { records: rows, total: count };
}

async function getOne(key, idOrRecordId, withRelations = true) {
  const r = getResource(key);
  const where = /^\d+$/.test(String(idOrRecordId)) ? { id: idOrRecordId } : { recordId: idOrRecordId };
  const row = await r.model.findOne({ where });
  if (!row) return null;
  const out = row.toJSON();
  if (withRelations) out.relations = await relationsOf(key, row.recordId);
  return out;
}

module.exports = { RESOURCES, getResource, create, update, archive, list, getOne, findDuplicates, link, relationsOf };
