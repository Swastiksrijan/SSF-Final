// Seed SSF-IMS with organisation profile, governance rules (from SSF bylaws),
// roles, the member register and the current Managing Committee.
//
// Members and committee are seeded from two dedicated data files
// (data/membersRegister.js and data/managingCommittee.js) — one source of truth
// each — so the registers can never drift apart or be overwritten by a stale
// seed. Add a person to the relevant file and it appears on the next boot.
const { Op } = require('sequelize');
const { models } = require('../../models/ims');
const { nextId } = require('./ids');
const { MEMBERS_REGISTER } = require('../../data/membersRegister');
const { TERM, MANAGING_COMMITTEE } = require('../../data/managingCommittee');

const GOVERNANCE_RULES = [
  { key: 'gb_frequency', value: 'Yearly', ruleText: 'General Body meets at least once every year.', ruleTextHi: 'आम सभा वर्ष में कम से कम एक बार।' },
  { key: 'gb_notice_days', value: '15', ruleText: 'General Body notice: 15 days.', ruleTextHi: 'आम सभा सूचना: 15 दिन।' },
  { key: 'gb_quorum', value: '3/5', ruleText: 'General Body quorum: 3/5 members.', ruleTextHi: 'आम सभा कोरम: 3/5 सदस्य।' },
  { key: 'mc_frequency', value: 'Monthly', ruleText: 'Managing Committee meets monthly.', ruleTextHi: 'प्रबंधकारिणी समिति मासिक बैठक।' },
  { key: 'mc_notice_days', value: '7', ruleText: 'Managing Committee notice: 7 days.', ruleTextHi: 'प्रबंधकारिणी सूचना: 7 दिन।' },
  { key: 'mc_quorum', value: '1/2', ruleText: 'Managing Committee quorum: 1/2 members.', ruleTextHi: 'प्रबंधकारिणी कोरम: 1/2 सदस्य।' },
  { key: 'special_gb_request', value: '2/3', ruleText: 'Special General Body on 2/3 members written request.', ruleTextHi: 'विशेष आम सभा 2/3 सदस्यों के लिखित अनुरोध पर।' },
  { key: 'committee_size', value: '9', ruleText: 'Managing Committee has 9 positions.', ruleTextHi: 'प्रबंधकारिणी समिति में 9 पद।' },
  { key: 'committee_term_years', value: '3', ruleText: 'Committee term: 3 years.', ruleTextHi: 'समिति कार्यकाल: 3 वर्ष।' },
  { key: 'committee_extension_max_months', value: '6', ruleText: 'Extension up to 6 months with General Body approval.', ruleTextHi: 'आम सभा अनुमोदन से 6 माह तक विस्तार।' },
  { key: 'secretary_expense_limit', value: '5000', ruleText: 'Secretary may incur expenditure up to Rs 5,000 at one time.', ruleTextHi: 'सचिव एक बार में अधिकतम ₹5,000 व्यय कर सकते हैं।' },
  { key: 'treasurer_cash_limit', value: '4500', ruleText: 'Treasurer daily cash holding limit: Rs 4,500.', ruleTextHi: 'कोषाध्यक्ष दैनिक रोकड़ सीमा: ₹4,500।' },
  { key: 'registrar_filing_days', value: '45', ruleText: 'Registrar filing within 45 days after annual General Body.', ruleTextHi: 'वार्षिक आम सभा के 45 दिनों में रजिस्ट्रार को फाइलिंग।' },
  { key: 'special_resolution_copy_days', value: '45', ruleText: 'Special resolution copy to Registrar within 45 days.', ruleTextHi: 'विशेष संकल्प की प्रति 45 दिनों में रजिस्ट्रार को।' },
  { key: 'patron_fee', value: '10000', ruleText: 'Guardian/Patron: Rs 10,000+ one-time OR 12 instalments in one year.', ruleTextHi: 'संरक्षक/पैट्रन: ₹10,000+ एकमुश्त या एक वर्ष में 12 किस्तें।' },
  { key: 'lifetime_fee', value: '8000', ruleText: 'Lifetime: Rs 8,000+.', ruleTextHi: 'आजीवन: ₹8,000+।' },
  { key: 'lifetime_to_patron_fee', value: '2000', ruleText: 'Lifetime member may become Patron with Rs 2,000+.', ruleTextHi: 'आजीवन सदस्य ₹2,000+ पर पैट्रन बन सकते हैं।' },
  { key: 'ordinary_fee', value: '100/1200', ruleText: 'Ordinary: Rs 100/month or Rs 1,200/year.', ruleTextHi: 'साधारण: ₹100/माह या ₹1,200/वर्ष।' },
  { key: 'ordinary_unpaid_months', value: '6', ruleText: 'Ordinary membership may end after 6 months unpaid without satisfactory reason.', ruleTextHi: '6 माह बिना भुगतान पर साधारण सदस्यता समाप्त हो सकती है।' },
];

const ROLES = [
  ['member', 'Member', 'सदस्य'], ['donor', 'Donor', 'दानदाता'], ['volunteer', 'Volunteer', 'स्वयंसेवक'],
  ['employee', 'Employee', 'कर्मचारी'], ['beneficiary', 'Beneficiary', 'लाभार्थी'],
  ['committee', 'Committee Member', 'समिति सदस्य'], ['officeBearer', 'Office Bearer', 'पदाधिकारी'],
];

const ORG = {
  name: 'Swastik Srijan Foundation Samiti', legalName: 'Swastik Srijan Foundation Samiti (SSF)',
  regNumber: '05/22/03/11448/13', regAuthority: 'Madhya Pradesh Societies Registration Act, 1973',
  regDate: '2013-12-30', pan: 'AAKAS7123H',
  address: 'Ward No. 1, Dadar, Post Rahat, Dist. Rewa, Madhya Pradesh - 486446',
  areaOfOperation: 'Pan India', website: 'https://swastiksrijan.in',
  contactEmail: 'swastiksrijanfoundation@gmail.com', contactPhone: '9718346691',
};

async function seedGovernance() {
  const out = { rules: 0, roles: 0, org: false, committee: false, committeeMembers: 0 };
  for (const r of GOVERNANCE_RULES) {
    const [, created] = await models.ImsGovernanceRule.findOrCreate({
      where: { key: r.key },
      defaults: { ...r, source: 'SSF Bylaws / Memorandum & Rules', effectiveDate: '2013-12-30', version: 1 },
    });
    if (created) out.rules++;
  }
  for (const [code, en, hi] of ROLES) {
    const [, created] = await models.ImsRole.findOrCreate({
      where: { code }, defaults: { code, labelEn: en, labelHi: hi },
    });
    if (created) out.roles++;
  }
  const orgCount = await models.ImsOrganisation.count();
  if (!orgCount) { await models.ImsOrganisation.create(ORG); out.org = true; }

  await seedCommittee(out);
  return out;
}

// Build (or repair) the current Managing Committee so it always matches
// data/managingCommittee.js. Idempotent and self-healing: a person who left the
// committee is marked 'former' (history kept), never deleted.
async function seedCommittee(out) {
  let committee = await models.ImsCommittee.findOne({ where: { isCurrent: true } });
  if (!committee) {
    committee = await models.ImsCommittee.create({
      recordId: 'CMT-' + new Date().getFullYear() + '-0001',
      name: TERM.name, isCurrent: true, formedOn: TERM.formedOn,
      termStart: TERM.termStart, termEnd: TERM.termEnd,
    });
    out.committee = true;
  }
  for (const m of MANAGING_COMMITTEE) {
    const person = await ensurePerson(m);
    const [member, created] = await models.ImsCommitteeMember.findOrCreate({
      where: { committeeId: committee.id, personId: person.id },
      defaults: { position: m.position, responsibility: m.responsibility || null, status: 'active', fromDate: TERM.termStart },
    });
    if (created) out.committeeMembers++;
    else {
      const patch = {};
      if (member.position !== m.position) patch.position = m.position;
      if ((member.responsibility || null) !== (m.responsibility || null)) patch.responsibility = m.responsibility || null;
      if (member.status !== 'active') patch.status = 'active';
      if (Object.keys(patch).length) await member.update(patch);
    }
    await models.ImsPersonRole.findOrCreate({
      where: { personId: person.id, roleCode: 'committee' },
      defaults: { personId: person.id, roleCode: 'committee', refType: 'committee', refId: committee.id, status: 'active' },
    });
  }
  // Anyone on the committee who is no longer listed becomes 'former'.
  const currentIds = [];
  for (const m of MANAGING_COMMITTEE) {
    const p = await models.ImsPerson.findOne({ where: { fullName: m.name } });
    if (p) currentIds.push(p.id);
  }
  await models.ImsCommitteeMember.update(
    { status: 'former', toDate: TERM.termEnd },
    { where: { committeeId: committee.id, personId: { [Op.notIn]: currentIds.length ? currentIds : [-1] } } },
  );
  out.committee = true;
}

// Create or update a Person from a member/committee row. Idempotent: an existing
// person (matched by name) is refreshed, never duplicated.
async function ensurePerson(src) {
  const row = {
    fullName: src.name,
    gender: src.gender || undefined,
    mobile: src.mobile || undefined,
    email: src.email || undefined,
    city: src.city || undefined,
    state: src.state || undefined,
    pinCode: src.pinCode || undefined,
    status: 'active',
  };
  const existing = await models.ImsPerson.findOne({ where: { fullName: src.name } });
  if (existing) {
    const patch = {};
    for (const [k, v] of Object.entries(row)) {
      if (v && existing[k] !== v) patch[k] = v;
    }
    if (Object.keys(patch).length) await existing.update(patch);
    return existing;
  }
  const recordId = await nextId('PERSON', null, models.ImsPerson);
  return models.ImsPerson.create({
    recordId, ...row,
    createdBy: 'register-seed', createdByName: 'Register Seed',
  });
}

// Seed the Member Register from data/membersRegister.js. Idempotent: the
// membership is keyed by the person, so re-running never duplicates a member.
async function seedMembers() {
  const out = { members: 0 };
  // Clean up placeholder people left behind by older seeds (e.g. "Member 1"),
  // which are not real people and must never appear in Contacts.
  try {
    const archived = await models.ImsPerson.update(
      { status: 'archived' },
      { where: { fullName: { [Op.regexp]: '^Member [0-9]+$' } } },
    );
    out.placeholdersArchived = Array.isArray(archived) ? archived[0] : archived;
  } catch { /* regexp unsupported: skip, nothing breaks */ }
  for (const m of MEMBERS_REGISTER) {
    const person = await ensurePerson(m);
    const [member, created] = await models.ImsMembership.findOrCreate({
      where: { personId: person.id },
      defaults: {
        recordId: await nextId('MEM', undefined, models.ImsMembership),
        personId: person.id, memberNo: m.memberId,
        category: m.memberType || 'Ordinary',
        admissionDate: m.joiningDate || undefined,
        applicationStatus: 'approved', approvedBy: 'Register Seed',
        feeFrequency: 'annual',
        createdBy: 'register-seed', createdByName: 'Register Seed',
      },
    });
    if (created) out.members++;
    else {
      const patch = {};
      if (member.memberNo !== m.memberId) patch.memberNo = m.memberId;
      if ((member.category || null) !== (m.memberType || null)) patch.category = m.memberType;
      if (Object.keys(patch).length) await member.update(patch);
    }
    await models.ImsPersonRole.findOrCreate({
      where: { personId: person.id, roleCode: 'member' },
      defaults: { personId: person.id, roleCode: 'member', refType: 'members', refId: member.id, status: 'active' },
    });
  }
  return out;
}

module.exports = { seedGovernance, seedMembers, GOVERNANCE_RULES, ROLES };
