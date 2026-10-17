// Official identity numbers (member / volunteer / donor IDs and their
// certificates).
//
// Two rules drive everything here:
//   1. A number is never reused. The next number is the highest already issued
//      plus one, never "how many rows exist plus one" — that count-based scheme
//      mints a duplicate as soon as a record is rejected or deleted.
//   2. The member series continues the offline register (`data/membersRegister.js`),
//      so a person who was already a member keeps one continuous number instead
//      of getting a second, parallel website ID.
const { Op } = require('sequelize');

const MEMBER_REGISTER_PREFIX = 'SSF-MBR-';
const MEMBER_SITE_PREFIX = 'SSF-MEM-';
const VOLUNTEER_PREFIX = 'SSF-VOL-';
const VOLUNTEER_CERT_PREFIX = 'SSF-VCERT-';
const DONOR_PREFIX = 'SSF-DON-';
const DONOR_CERT_PREFIX = 'SSF-DONCERT-';

const MEMBER_REGISTER_PATTERN = /^SSF-MBR-\d{5}$/;
const MEMBER_SITE_PATTERN = /^SSF-MEM-\d{4}-\d{4}$/;
const VOLUNTEER_PATTERN = /^SSF-VOL-\d{4}-\d{4}$/;
const DONOR_PATTERN = /^SSF-DON-\d{4}-\d{4}$/;

const registerEntries = () => {
  try {
    const { MEMBERS_REGISTER } = require('../data/membersRegister');
    return Array.isArray(MEMBERS_REGISTER) ? MEMBERS_REGISTER : [];
  } catch {
    return [];
  }
};

const monthYearCode = (date = new Date()) =>
  `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;

// Highest numeric suffix seen for a prefix. When `period` is given the ID must
// carry that MMYY block (`SSF-VOL-2510-0007`); otherwise the suffix is read
// straight after the prefix (`SSF-MBR-00019`).
const highestSuffix = (values, prefix, period = null) => {
  const pattern = period
    ? new RegExp(`^${prefix}${period}-(\\d+)$`)
    : new RegExp(`^${prefix}(\\d+)$`);
  let highest = 0;
  for (const value of values) {
    const match = String(value || '').match(pattern);
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  return highest;
};

const issuedValues = async (model, field) => {
  const rows = await model.findAll({ attributes: [field], where: { [field]: { [Op.ne]: null } }, raw: true });
  return rows.map((row) => row[field]);
};

// Numbers already handed out, including ones whose record has since been
// deleted or revoked. Reading the ledger as well as the live rows is what stops
// a freed number from being issued a second time.
const ledgerValues = async (kind) => {
  try {
    const IdIssuance = require('../models/IdIssuance');
    const rows = await IdIssuance.findAll({ attributes: ['value'], where: { kind }, raw: true });
    return rows.map((row) => row.value);
  } catch {
    return [];
  }
};

const reserve = async ({ kind, value, certValue = null, recordId = null, holderName = null, holderEmail = null }) => {
  try {
    const IdIssuance = require('../models/IdIssuance');
    const existing = await IdIssuance.findOne({ where: { kind, value } });
    if (existing) return existing;
    return await IdIssuance.create({ kind, value, certValue, recordId, holderName, holderEmail, status: 'issued', issuedAt: new Date() });
  } catch (error) {
    console.warn('ID ledger write failed:', error.message);
    return null;
  }
};

// Mark every number a record holds as revoked. The ledger rows stay behind so
// the numbers can never be reused.
const revokeFor = async (kind, recordId, note = null) => {
  try {
    const IdIssuance = require('../models/IdIssuance');
    await IdIssuance.update({ status: 'revoked', revokedAt: new Date(), note }, { where: { kind, recordId, status: 'issued' } });
  } catch (error) {
    console.warn('ID ledger revoke failed:', error.message);
  }
};

const listIssuances = async (kind = null) => {
  try {
    const IdIssuance = require('../models/IdIssuance');
    const where = kind ? { kind } : {};
    return await IdIssuance.findAll({ where, order: [['issuedAt', 'DESC']], raw: true });
  } catch {
    return [];
  }
};

const pad = (value, size) => String(value).padStart(size, '0');

// Member numbers continue the register series: SSF-MBR-00019, SSF-MBR-00020…
// The register file, the live rows and the issuance ledger are all counted, so
// a hand-entered or revoked number can never be handed out twice.
const nextMemberId = async (Member) => {
  const fromDb = await issuedValues(Member, 'memberId');
  const fromRegister = registerEntries().map((entry) => entry.memberId);
  const highest = Math.max(
    highestSuffix(fromDb, MEMBER_REGISTER_PREFIX),
    highestSuffix(fromRegister, MEMBER_REGISTER_PREFIX),
    highestSuffix(await ledgerValues('member'), MEMBER_REGISTER_PREFIX),
  );
  return `${MEMBER_REGISTER_PREFIX}${pad(highest + 1, 5)}`;
};

const nextVolunteerId = async (Volunteer, date = new Date()) => {
  const period = monthYearCode(date);
  const highest = Math.max(
    highestSuffix(await issuedValues(Volunteer, 'volunteerId'), VOLUNTEER_PREFIX, period),
    highestSuffix(await ledgerValues('volunteer'), VOLUNTEER_PREFIX, period),
  );
  return `${VOLUNTEER_PREFIX}${period}-${pad(highest + 1, 4)}`;
};

const nextDonorId = async (Donor, date = new Date()) => {
  const period = monthYearCode(date);
  const highest = Math.max(
    highestSuffix(await issuedValues(Donor, 'donorId'), DONOR_PREFIX, period),
    highestSuffix(await ledgerValues('donor'), DONOR_PREFIX, period),
  );
  return `${DONOR_PREFIX}${period}-${pad(highest + 1, 4)}`;
};

// Certificate IDs mirror their identity number so the pair is always in step.
const memberCertIdFor = (memberId) => String(memberId || '').replace(MEMBER_REGISTER_PREFIX, 'SSF-MCERT-');
const volunteerCertIdFor = (volunteerId) => String(volunteerId || '').replace(VOLUNTEER_PREFIX, VOLUNTEER_CERT_PREFIX);
const donorCertIdFor = (donorId) => String(donorId || '').replace(DONOR_PREFIX, DONOR_CERT_PREFIX);

const isMemberId = (value) => MEMBER_REGISTER_PATTERN.test(String(value || '').trim()) || MEMBER_SITE_PATTERN.test(String(value || '').trim());
const isVolunteerId = (value) => VOLUNTEER_PATTERN.test(String(value || '').trim());
const isDonorId = (value) => DONOR_PATTERN.test(String(value || '').trim());

// True when another record already owns this number. `exceptId` lets a record
// keep the number it already has while its other fields are edited.
const isTaken = async (model, field, value, exceptId = null) => {
  const where = { [field]: String(value || '').trim() };
  if (exceptId) where.id = { [Op.ne]: exceptId };
  return Boolean(await model.count({ where }));
};

const digits = (value) => String(value || '').replace(/\D/g, '');

// --- Membership classification (one definition, used by every route) --------
//
// `memberType` only records the role a person picked in an online application.
// It is NOT proof of membership. A person who holds an official SSF member
// number has been admitted by the register, whatever the column still says.
// Keying membership on `memberType` alone is what made 7 registered members
// (Divya Sharma SSF-MBR-00003 and the rest) look like empty website accounts:
// their number was issued but the marker was never updated, so the portal
// withheld their ID card and the admin list labelled them "Account only".
const REAL_MEMBERSHIP_TYPES = ['general', 'active', 'life', 'advisory'];
const holdsOfficialMemberId = (member) => Boolean(String(member?.memberId || '').trim());
const hasAccountMarker = (member) => String(member?.memberType || '').trim().toLowerCase() === 'website_signup'
  || String(member?.message || '').trim().toLowerCase() === 'signup from website';
const isAccountOnly = (member) => !holdsOfficialMemberId(member) && hasAccountMarker(member);
const isRealMembership = (member) => holdsOfficialMemberId(member)
  || (!isAccountOnly(member) && REAL_MEMBERSHIP_TYPES.includes(String(member?.memberType || '').trim().toLowerCase()));

// The offline register row behind an official number, so the true category and
// post ("Founder Member", "Treasurer") can be shown instead of the raw column.
const registerEntryFor = (memberId) => {
  const wanted = String(memberId || '').trim();
  if (!wanted) return null;
  return registerEntries().find((entry) => entry.memberId === wanted) || null;
};

// A membership is billed on a PLAN (general / active / life / advisory), but the
// offline register records a ROLE ("Founder Member", "Executive Member").
// Anything that prices a membership — the portal fee card, the Razorpay amount —
// must read the plan, never the role. Writing the role into `memberType` is what
// stripped the fee amount off every registered member's Payments tab.
const MEMBERSHIP_PLANS = ['general', 'active', 'life', 'advisory'];
const isMembershipPlan = (value) => MEMBERSHIP_PLANS.includes(String(value || '').trim().toLowerCase());
const planFor = (member) => {
  const stored = String(member?.memberType || '').trim().toLowerCase();
  if (isMembershipPlan(stored)) return stored;
  const role = String(registerEntryFor(member?.memberId)?.memberType || '').toLowerCase();
  if (role.includes('life')) return 'life';
  if (role.includes('active')) return 'active';
  if (role.includes('advisory')) return 'advisory';
  return 'general';
};

// Repair rows left contradictory by an older approval: an account-only signup
// that was later given a register number, and rows whose `memberType` holds the
// register ROLE instead of the billing PLAN. Idempotent — a repaired row no
// longer matches, so re-running on every boot is safe.
const reconcileRegisterMembers = async (Member) => {
  const rows = await Member.findAll({ where: { memberId: { [Op.ne]: null } } });
  let promoted = 0;
  for (const row of rows) {
    const entry = registerEntryFor(row.memberId);
    const patch = {};
    const staleWebsiteMarker = hasAccountMarker(row);
    // A role ("Founder Member") or the website marker in `memberType` is not a
    // plan; restore the plan so the fee card can price the membership again.
    if (!isMembershipPlan(row.memberType)) {
      patch.memberType = planFor(row);
    }
    if (staleWebsiteMarker && String(row.message || '').trim().toLowerCase() === 'signup from website') patch.message = null;
    if (entry?.designation && !row.designation) patch.designation = entry.designation;
    if (!row.certId) patch.certId = memberCertIdFor(row.memberId);
    if (!row.certificateType) patch.certificateType = 'Membership Certificate';
    if (!row.certificateIssuedAt) patch.certificateIssuedAt = row.createdAt || new Date();
    if (!Object.keys(patch).length) continue;
    await row.update(patch);
    promoted += 1;
  }
  return { promoted };
};

// Find the register row that belongs to a person, matched on email or mobile.
// Used to adopt an existing member's original number on approval instead of
// minting a second one.
const matchRegisterEntry = ({ email, phone } = {}) => {
  const wantedEmail = String(email || '').trim().toLowerCase();
  const wantedPhone = digits(phone).slice(-10);
  if (!wantedEmail && !wantedPhone) return null;
  return registerEntries().find((entry) => {
    const entryEmail = String(entry.email || '').trim().toLowerCase();
    const entryPhone = digits(entry.mobile).slice(-10);
    if (wantedEmail && entryEmail && wantedEmail === entryEmail) return true;
    if (wantedPhone && entryPhone && wantedPhone === entryPhone) return true;
    return false;
  }) || null;
};

// The register as an admin sees it: every row with whether its number is
// already used, and which account (if any) it looks like it belongs to.
const registerOverview = async (Member) => {
  const members = await Member.findAll({ attributes: ['id', 'memberId', 'fullName', 'email', 'phone'], raw: true });
  const byNumber = new Map(members.filter((m) => m.memberId).map((m) => [m.memberId, m]));
  return registerEntries().map((entry) => {
    const owner = byNumber.get(entry.memberId) || null;
    const account = owner || members.find((m) =>
      String(m.email || '').trim().toLowerCase() === String(entry.email || '').trim().toLowerCase()
      || (digits(m.phone).slice(-10) && digits(m.phone).slice(-10) === digits(entry.mobile).slice(-10))) || null;
    return {
      memberId: entry.memberId,
      name: entry.name,
      memberType: entry.memberType,
      designation: entry.designation || null,
      email: entry.email || null,
      mobile: entry.mobile || null,
      joiningDate: entry.joiningDate || null,
      status: entry.status || 'active',
      claimed: Boolean(owner),
      accountId: account ? account.id : null,
    };
  });
};

module.exports = {
  MEMBER_REGISTER_PREFIX, MEMBER_SITE_PREFIX, VOLUNTEER_PREFIX, VOLUNTEER_CERT_PREFIX,
  DONOR_PREFIX, DONOR_CERT_PREFIX,
  MEMBER_REGISTER_PATTERN, MEMBER_SITE_PATTERN, VOLUNTEER_PATTERN, DONOR_PATTERN,
  monthYearCode, highestSuffix, nextMemberId, nextVolunteerId, nextDonorId,
  memberCertIdFor, volunteerCertIdFor, donorCertIdFor,
  isMemberId, isVolunteerId, isDonorId, isTaken, matchRegisterEntry, registerOverview,
  registerEntries, reserve, revokeFor, listIssuances,
  REAL_MEMBERSHIP_TYPES, holdsOfficialMemberId, hasAccountMarker, isAccountOnly, isRealMembership,
  MEMBERSHIP_PLANS, isMembershipPlan, planFor,
  registerEntryFor, reconcileRegisterMembers,
};
