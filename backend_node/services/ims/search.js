// Universal search across the whole SSF-IMS.
// Design rule: ENTER ONCE -> FIND EVERYWHERE. Every module is searchable; the
// frontend never has to know the schema, it just renders the result contract:
//   { type, module, resource, id, recordId, title, subtitle, date, amount,
//     status, personId }
const { models } = require('../../models/ims');
const { Op } = require('sequelize');

const active = { status: { [Op.ne]: 'archived' } };
const MONEY = (n) => Number(n || 0);

/**
 * Per-model search spec.
 *  - model:    Sequelize model
 *  - module:   sidebar/module group used by the Module filter (bilingual via i18n)
 *  - resource: generic /ims/:resource key, used to Open Record in its register
 *  - fields:   real columns matched against the query
 *  - title:    column used as the result heading (falls back to recordId)
 *  - subtitle: column used as the secondary line
 *  - date:     column used for the Date filter / result date
 *  - amount:   column used for the result amount
 *  - status:   column used for the Status filter (defaults to `status`)
 *  - person:   column linking to a Person; when a person name matches the query
 *              we also return that person's linked records (e.g. a donor's
 *              donations), which is what makes "Ramesh" find his transactions.
 */
const MODULES = [
  // ---- Organisation ----
  { key: 'persons', model: models.ImsPerson, module: 'organisation', resource: 'persons', type: 'Person', title: 'fullName', subtitle: 'occupation', date: 'createdAt', person: 'id', fields: ['fullName', 'fullNameHi', 'mobile', 'altMobile', 'email', 'city', 'state', 'occupation', 'idNumber', 'pan', 'recordId'] },
  { key: 'members', model: models.ImsMembership, module: 'organisation', resource: 'members', type: 'Member', title: 'memberNo', subtitle: 'category', date: 'admissionDate', amount: 'feeAmount', status: 'applicationStatus', person: 'personId', fields: ['memberNo', 'category', 'receiptNumber', 'approvedBy', 'recordId'] },
  { key: 'donors', model: models.ImsDonor, module: 'organisation', resource: 'donors', type: 'Donor', title: 'donorType', subtitle: 'pan', date: 'createdAt', person: 'personId', fields: ['donorType', 'pan', 'recordId'] },
  { key: 'volunteers', model: models.ImsVolunteer, module: 'organisation', resource: 'volunteers', type: 'Volunteer', title: 'fullName', subtitle: 'roleApplied', date: 'joinDate', person: 'personId', fields: ['fullName', 'fullNameHi', 'mobile', 'email', 'city', 'skills', 'volunteerType', 'roleApplied', 'recordId'] },
  { key: 'employees', model: models.ImsEmployee, module: 'organisation', resource: 'employees', type: 'Employee', title: 'designation', subtitle: 'department', date: 'joinDate', amount: 'salary', person: 'personId', fields: ['designation', 'department', 'recordId'] },
  { key: 'beneficiaries', model: models.ImsBeneficiary, module: 'organisation', resource: 'beneficiaries', type: 'Beneficiary', title: 'household', subtitle: 'services', date: 'createdAt', person: 'personId', fields: ['household', 'services', 'caseNotes', 'recordId'] },
  { key: 'committeeMembers', model: models.ImsCommitteeMember, module: 'organisation', resource: 'committeeMembers', type: 'Committee Member', title: 'position', subtitle: 'responsibility', date: 'fromDate', person: 'personId', fields: ['position', 'responsibility', 'recordId'] },
  { key: 'committees', model: models.ImsCommittee, module: 'organisation', resource: 'committees', type: 'Committee', title: 'name', subtitle: 'remarks', date: 'formedOn', fields: ['name', 'remarks', 'recordId'] },
  { key: 'officeHistory', model: models.ImsOfficeHistory, module: 'organisation', resource: 'officeHistory', type: 'Office History', title: 'fullName', subtitle: 'recordType', date: 'recordDate', fields: ['fullName', 'recordType', 'changeType', 'previousRole', 'newRole', 'referenceNo', 'resolutionNo', 'details', 'recordId'] },

  // ---- Governance ----
  { key: 'meetings', model: models.ImsMeeting, module: 'governance', resource: 'meetings', type: 'Meeting', title: 'title', subtitle: 'meetingType', date: 'meetingDate', status: 'minutesStatus', fields: ['title', 'meetingType', 'venue', 'agenda', 'chairman', 'platform', 'recordId'] },
  { key: 'resolutions', model: models.ImsResolution, module: 'governance', resource: 'resolutions', type: 'Resolution', title: 'title', subtitle: 'resolutionNo', date: 'createdAt', fields: ['title', 'resolutionNo', 'body', 'votingResult', 'recordId'] },
  { key: 'actions', model: models.ImsAction, module: 'governance', resource: 'actions', type: 'Action', title: 'title', subtitle: 'description', date: 'dueDate', status: 'actionStatus', fields: ['title', 'description', 'department', 'priority', 'remarks', 'recordId'] },
  { key: 'cases', model: models.ImsCase, module: 'governance', resource: 'cases', type: 'Case', title: 'title', subtitle: 'caseType', date: 'deadline', status: 'stage', person: 'personId', fields: ['title', 'description', 'caseType', 'decision', 'response', 'recordId'] },
  { key: 'notices', model: models.ImsNotice, module: 'governance', resource: 'notices', type: 'Notice', title: 'subject', subtitle: 'noticeType', date: 'createdAt', status: 'deliveryStatus', fields: ['subject', 'body', 'noticeType', 'recordId'] },
  { key: 'agreements', model: models.ImsAgreement, module: 'governance', resource: 'agreements', type: 'Agreement', title: 'title', subtitle: 'agreementType', date: 'fromDate', fields: ['title', 'agreementType', 'terms', 'recordId'] },

  // ---- Finance ----
  { key: 'transactions', model: models.ImsTransaction, module: 'finance', resource: 'transactions', type: 'Transaction', title: 'transactionNo', subtitle: 'transactionType', date: 'txnDate', amount: 'amount', person: 'personId', fields: ['transactionNo', 'transactionType', 'paymentMode', 'sourceModule', 'maker', 'checker', 'recordId'] },
  { key: 'vouchers', model: models.ImsVoucher, module: 'finance', resource: 'vouchers', type: 'Voucher', title: 'voucherNo', subtitle: 'voucherType', date: 'voucherDate', amount: 'amount', fields: ['voucherNo', 'voucherType', 'narration', 'approvedBy', 'recordId'] },
  { key: 'donations', model: models.ImsDonation, module: 'finance', resource: 'donations', type: 'Donation', title: 'receiptNo', subtitle: 'mode', date: 'donationDate', amount: 'amount', person: 'donorId', personRef: 'donor', fields: ['receiptNo', 'mode', 'recordId'] },
  { key: 'grants', model: models.ImsGrant, module: 'finance', resource: 'grants', type: 'Grant', title: 'utilisationCertNo', subtitle: 'conditions', date: 'agreementDate', amount: 'amount', status: 'grantStatus', person: 'donorId', personRef: 'donor', fields: ['utilisationCertNo', 'conditions', 'recordId'] },
  { key: 'funds', model: models.ImsFund, module: 'finance', resource: 'funds', type: 'Fund', title: 'name', subtitle: 'fundType', date: 'createdAt', fields: ['name', 'fundType', 'purpose', 'recordId'] },
  { key: 'budgets', model: models.ImsBudget, module: 'finance', resource: 'budgets', type: 'Budget', title: 'period', subtitle: 'notes', date: 'createdAt', amount: 'amount', fields: ['period', 'notes', 'recordId'] },
  { key: 'accounts', model: models.ImsAccount, module: 'finance', resource: 'accounts', type: 'Account', title: 'name', subtitle: 'accountType', date: 'createdAt', fields: ['name', 'code', 'accountType', 'recordId'] },
  { key: 'costCentres', model: models.ImsCostCentre, module: 'finance', resource: 'costCentres', type: 'Cost Centre', title: 'name', subtitle: 'category', date: 'startDate', amount: 'approvedBudget', fields: ['name', 'nameHi', 'shortCode', 'category', 'department', 'location', 'district', 'state', 'budgetHead', 'recordId'] },
  { key: 'parties', model: models.ImsParty, module: 'finance', resource: 'parties', type: 'Party', title: 'name', subtitle: 'partyType', date: 'createdAt', person: 'personId', fields: ['name', 'partyType', 'gstin', 'contact', 'recordId'] },
  { key: 'bankAccounts', model: models.ImsBankAccount, module: 'finance', resource: 'bankAccounts', type: 'Bank Account', title: 'bankName', subtitle: 'accountNo', date: 'createdAt', fields: ['bankName', 'accountNo', 'ifsc', 'branch', 'recordId'] },
  { key: 'cashAccounts', model: models.ImsCashAccount, module: 'finance', resource: 'cashAccounts', type: 'Cash Account', title: 'name', subtitle: 'recordId', date: 'createdAt', fields: ['name', 'recordId'] },
  { key: 'financialYears', model: models.ImsFinancialYear, module: 'finance', resource: 'financialYears', type: 'Financial Year', title: 'label', subtitle: 'recordId', date: 'startDate', fields: ['label', 'recordId'] },

  // ---- Programmes ----
  { key: 'programmes', model: models.ImsProgramme, module: 'programmes', resource: 'programmes', type: 'Programme', title: 'name', subtitle: 'theme', date: 'createdAt', fields: ['name', 'theme', 'objective', 'recordId'] },
  { key: 'projects', model: models.ImsProject, module: 'programmes', resource: 'projects', type: 'Project', title: 'name', subtitle: 'objective', date: 'startDate', amount: 'budget', status: 'projectStatus', fields: ['name', 'objective', 'results', 'risks', 'recordId'] },
  { key: 'activities', model: models.ImsActivity, module: 'programmes', resource: 'activities', type: 'Activity', title: 'title', subtitle: 'activityType', date: 'activityDate', fields: ['title', 'activityType', 'outcome', 'recordId'] },

  // ---- HR & Attendance ----
  { key: 'attendance', model: models.ImsAttendance, module: 'hr', resource: 'attendance', type: 'Attendance', title: 'attStatus', subtitle: 'remarks', date: 'attDate', status: 'attStatus', person: 'personId', fields: ['attStatus', 'remarks', 'refType', 'recordId'] },

  // ---- Compliance / Audit / Risk ----
  { key: 'compliance', model: models.ImsCompliance, module: 'compliance', resource: 'compliance', type: 'Compliance', title: 'obligation', subtitle: 'legalSource', date: 'dueDate', status: 'complianceStatus', person: 'responsiblePersonId', fields: ['obligation', 'legalSource', 'evidence', 'acknowledgement', 'recordId'] },
  { key: 'audits', model: models.ImsAudit, module: 'compliance', resource: 'audits', type: 'Audit', title: 'auditor', subtitle: 'auditType', date: 'periodEnd', fields: ['auditor', 'auditType', 'scope', 'observation', 'managementResponse', 'correctiveAction', 'recordId'] },
  { key: 'risks', model: models.ImsRisk, module: 'compliance', resource: 'risks', type: 'Risk', title: 'title', subtitle: 'category', date: 'dueDate', status: 'rating', person: 'ownerPersonId', fields: ['title', 'category', 'likelihood', 'impact', 'rating', 'mitigation', 'recordId'] },

  // ---- Documents / Communication / Assets ----
  { key: 'documents', model: models.ImsDocument, module: 'documents', resource: 'documents', type: 'Document', title: 'title', subtitle: 'category', date: 'issueDate', fields: ['title', 'category', 'docType', 'owner', 'source', 'recordId'] },
  { key: 'communications', model: models.ImsCommunication, module: 'documents', resource: 'communications', type: 'Communication', title: 'subject', subtitle: 'channel', date: 'sentAt', status: 'deliveryStatus', person: 'personId', fields: ['subject', 'message', 'recipient', 'sender', 'channel', 'recordId'] },
  { key: 'policies', model: models.ImsPolicy, module: 'documents', resource: 'policies', type: 'Policy', title: 'title', subtitle: 'category', date: 'effectiveDate', fields: ['title', 'category', 'body', 'approvedBy', 'recordId'] },
  { key: 'assets', model: models.ImsAsset, module: 'assets', resource: 'assets', type: 'Asset', title: 'name', subtitle: 'category', date: 'purchaseDate', amount: 'cost', status: 'assetStatus', person: 'custodianPersonId', fields: ['name', 'category', 'recordId'] },
  { key: 'inventory', model: models.ImsInventoryItem, module: 'assets', resource: 'inventory', type: 'Inventory Item', title: 'name', subtitle: 'unit', date: 'createdAt', fields: ['name', 'unit', 'recordId'] },

  // ---- Masters / Config ----
  { key: 'orgProfile', model: models.ImsOrgProfile, module: 'masters', resource: 'orgProfile', type: 'Organisation Profile', title: 'organizationName', subtitle: 'section', date: 'createdAt', fields: ['organizationName', 'shortName', 'registrationNumber', 'section', 'city', 'state', 'email', 'recordId'] },
  { key: 'organisations', model: models.ImsOrganisation, module: 'masters', resource: 'organisations', type: 'Organisation', title: 'name', subtitle: 'legalName', date: 'regDate', fields: ['name', 'legalName', 'regNumber', 'pan', 'website', 'recordId'] },
  { key: 'governanceRules', model: models.ImsGovernanceRule, module: 'masters', resource: 'governanceRules', type: 'Governance Rule', title: 'key', subtitle: 'value', date: 'effectiveDate', fields: ['key', 'value', 'ruleText', 'source', 'recordId'] },
  { key: 'institutionalHistory', model: models.ImsInstitutionHistory, module: 'masters', resource: 'institutionalHistory', type: 'Institution History', title: 'sectionName', subtitle: 'recordType', date: 'recordDate', fields: ['sectionName', 'section', 'recordType', 'recordId'] },
  { key: 'users', model: models.ImsUser, module: 'masters', resource: 'users', type: 'User', title: 'username', subtitle: 'displayName', date: 'createdAt', fields: ['username', 'email', 'displayName', 'roleCode', 'recordId'] },
];

const MODULE_LABELS = {
  organisation: { en: 'Organisation', hi: 'संस्था' },
  governance: { en: 'Governance', hi: 'शासन' },
  finance: { en: 'Finance', hi: 'वित्त' },
  programmes: { en: 'Programmes', hi: 'कार्यक्रम' },
  hr: { en: 'HR', hi: 'मानव संसाधन' },
  compliance: { en: 'Compliance & Audit', hi: 'अनुपालन एवं लेखा-परीक्षा' },
  documents: { en: 'Documents & Communication', hi: 'दस्तावेज़ एवं संचार' },
  assets: { en: 'Assets & Inventory', hi: 'संपत्ति एवं स्टॉक' },
  masters: { en: 'Masters & Config', hi: 'मास्टर एवं कॉन्फ़िग' },
};

/** Column actually used for the status filter (falls back to `status`). */
function statusField(spec) { return spec.status || 'status'; }
function dateField(spec) { return spec.date || 'createdAt'; }

/** Distinct record types (for the Record Type filter) + module list (for the UI). */
function meta() {
  const types = MODULES.map((s) => ({ value: s.key, type: s.type, module: s.module }));
  const seen = new Set();
  const modules = [];
  for (const s of MODULES) {
    if (seen.has(s.module)) continue;
    seen.add(s.module);
    modules.push({ value: s.module, ...MODULE_LABELS[s.module] });
  }
  return { modules, types, moduleLabels: MODULE_LABELS };
}

/**
 * Ids of the persons whose name/mobile/email matches the query.
 */
async function matchedPersonIds(q) {
  const like = { [Op.iLike]: '%' + q + '%' };
  const rows = await models.ImsPerson.findAll({
    where: { ...active, [Op.or]: [
      { fullName: like }, { fullNameHi: like }, { mobile: like }, { email: like }, { recordId: like },
    ] },
    attributes: ['id'], limit: 50,
  });
  return rows.map((r) => r.id);
}

/**
 * Run one module's search.
 * A record matches when its own fields OR its linked person's name match.
 * `personRef: 'donor'` means the person column stores donor ids, not person ids.
 */
async function searchModule(spec, q, personIds, donorIds) {
  const like = { [Op.iLike]: '%' + q + '%' };
  const or = spec.fields.map((f) => ({ [f]: like }));
  const linked = spec.personRef === 'donor' ? donorIds : personIds;
  if (linked.length && spec.person) or.push({ [spec.person]: { [Op.in]: linked } });
  const where = { ...active, [Op.or]: or };
  return spec.model.findAll({ where, order: [[dateField(spec), 'DESC NULLS LAST']], limit: 40 });
}

/** Build the display contract for one row. */
function shape(spec, row) {
  const title = row[spec.title] || row.recordId;
  const dv = row[dateField(spec)];
  let date = null;
  if (dv) { const d = new Date(dv); date = Number.isNaN(d.getTime()) ? String(dv).slice(0, 10) : d.toISOString().slice(0, 10); }
  return {
    key: spec.key,
    type: spec.type,
    module: spec.module,
    resource: spec.resource,
    id: row.id,
    recordId: row.recordId,
    title: String(title),
    subtitle: spec.subtitle && row[spec.subtitle] ? String(row[spec.subtitle]) : '',
    date,
    amount: spec.amount && row[spec.amount] != null ? MONEY(row[spec.amount]) : null,
    status: row[statusField(spec)] || null,
    personId: null,
    personName: null,
  };
}

/** Which Person (if any) a row belongs to. Donations/grants link via donorId. */
function personLink(spec, row) {
  if (!spec.person) return null;
  if (spec.person === 'id') return { personId: row.id };
  if (spec.personRef === 'donor') return { donorId: row[spec.person] };
  return { personId: row[spec.person] };
}

/** Resolve every result's Person name (one batched query per master). */
async function attachPersonNames(results, links) {
  const directIds = [...new Set(links.filter((l) => l && l.personId).map((l) => l.personId))];
  const donorIds = [...new Set(links.filter((l) => l && l.donorId).map((l) => l.donorId))];
  const donorMap = donorIds.length
    ? Object.fromEntries((await models.ImsDonor.findAll({ where: { id: { [Op.in]: donorIds } }, attributes: ['id', 'personId'] })).map((d) => [d.id, d.personId]))
    : {};
  const allIds = [...new Set([...directIds, ...Object.values(donorMap).filter(Boolean)])];
  const persons = allIds.length
    ? await models.ImsPerson.findAll({ where: { id: { [Op.in]: allIds } }, attributes: ['id', 'fullName'] })
    : [];
  const nameById = Object.fromEntries(persons.map((p) => [p.id, p.fullName]));
  results.forEach((res, i) => {
    const l = links[i];
    const pid = l && l.donorId ? donorMap[l.donorId] : l && l.personId;
    res.personId = pid || null;
    res.personName = pid ? nameById[pid] || null : null;
  });
}

/**
 * Universal search.
 * @param {string} q       query text
 * @param {object} filters { module, type, dateFrom, dateTo, status }
 */
async function universalSearch(q, filters = {}) {
  q = String(q || '').trim();
  const hasQuery = q.length > 0;
  if (!hasQuery && !filters.module && !filters.type && !filters.status && !filters.dateFrom && !filters.dateTo) {
    return { results: [], total: 0, counts: {}, query: q };
  }

  const specs = MODULES.filter((s) => {
    if (filters.module && s.module !== filters.module) return false;
    if (filters.type && s.key !== filters.type) return false;
    return true;
  });

  const personIds = hasQuery ? await matchedPersonIds(q) : [];
  // Donations/grants link to a Person through the donor master, not directly.
  const donorIds = personIds.length
    ? (await models.ImsDonor.findAll({ where: { personId: { [Op.in]: personIds } }, attributes: ['id'] })).map((d) => d.id)
    : [];

  const perType = await Promise.all(specs.map(async (spec) => {
    const rows = hasQuery
      ? await searchModule(spec, q, personIds, donorIds)
      : await spec.model.findAll({ where: active, order: [[dateField(spec), 'DESC NULLS LAST']], limit: 40 });
    return rows.map((row) => ({ spec, row }));
  }));

  let flat = [];
  for (const pairs of perType) {
    for (const { spec, row } of pairs) {
      const shaped = shape(spec, row);
      if (!applyFilters([shaped], filters).length) continue;
      flat.push({ shaped, link: personLink(spec, row) });
    }
  }
  flat = flat.slice(0, 300);
  await attachPersonNames(flat.map((f) => f.shaped), flat.map((f) => f.link));

  const results = flat.map((f) => f.shaped);
  results.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const counts = {};
  for (const r of results) counts[r.key] = (counts[r.key] || 0) + 1;
  return { results, total: results.length, counts, query: q, matchedPersons: personIds.length };
}

function applyFilters(rows, filters) {
  return rows.filter((r) => {
    if (filters.status && String(r.status || '').toLowerCase() !== String(filters.status).toLowerCase()) return false;
    if (filters.dateFrom && (!r.date || r.date < filters.dateFrom)) return false;
    if (filters.dateTo && (!r.date || r.date > filters.dateTo)) return false;
    return true;
  });
}

module.exports = { universalSearch, meta, MODULES, MODULE_LABELS };
