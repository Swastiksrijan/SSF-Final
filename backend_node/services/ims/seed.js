// Seed SSF-IMS with organisation profile, governance rules (from SSF bylaws),
// roles and the current Managing Committee. Idempotent: safe to run repeatedly.
const { models } = require('../../models/ims');

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

const CURRENT_COMMITTEE = [
  { personName: 'Ramesh Pandey', position: 'President' },
  { personName: 'Preeti Shukla', position: 'Vice President' },
  { personName: 'Amit Kumar Pandey', position: 'Secretary' },
  { personName: 'Sanjay Kumar', position: 'Treasurer' },
  { personName: 'Anita Verma', position: 'Joint Secretary' },
  { personName: 'Member 1', position: 'Member' },
  { personName: 'Member 2', position: 'Member' },
  { personName: 'Member 3', position: 'Member' },
  { personName: 'Member 4', position: 'Member' },
];

async function seedGovernance() {
  const out = { rules: 0, roles: 0, org: false, committee: false };
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

  const committeeCount = await models.ImsCommittee.count();
  if (!committeeCount) {
    const committee = await models.ImsCommittee.create({
      recordId: 'CMT-' + new Date().getFullYear() + '-0001',
      name: 'Current Managing Committee',
      isCurrent: true, termStart: '2024-04-01', termEnd: '2027-03-31',
    });
    out.committee = true;
    let seq = 0;
    for (const m of CURRENT_COMMITTEE) {
      let person = await models.ImsPerson.findOne({ where: { fullName: m.personName } });
      if (!person) {
        seq++;
        person = await models.ImsPerson.create({
          recordId: 'PERSON-' + String(seq).padStart(6, '0'),
          fullName: m.personName, status: 'active',
        });
      }
      await models.ImsCommitteeMember.create({
        committeeId: committee.id, personId: person.id, position: m.position, status: 'active',
      });
      await models.ImsPersonRole.findOrCreate({
        where: { personId: person.id, roleCode: 'committee' },
        defaults: { personId: person.id, roleCode: 'committee', refType: 'committee', refId: committee.id, status: 'active' },
      });
    }
  }
  return out;
}

module.exports = { seedGovernance, GOVERNANCE_RULES, ROLES };
