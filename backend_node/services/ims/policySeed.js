// Seed the SSF Integrated Institutional Policy & Procedure Manual as ONE
// master policy record (SSF-POL-MASTER-001) in Organisation -> Policies.
// The 29 policy areas are chapters of this single manual, not 29 documents.
// Idempotent: safe to run repeatedly; never overwrites an approved record.
const { models } = require('../../models/ims');

const POLICY_ID = 'SSF-POL-MASTER-001';

const POLICY_AREAS = [
  'Governance & Institutional Administration', 'Membership & Member Management',
  'Meetings, Resolutions & Decision Making', 'Finance & Accounts',
  'Cash, Bank & Payment Operations', 'Budget, Funds & Financial Planning',
  'Donations, Contributions & Fundraising', 'Grant Management',
  'Programme & Project Management', 'Education, Learning & Skill Development',
  'Livelihood, Employment & Community Development', 'Health, Well-being & Counselling',
  'Women, Child & Family Welfare', 'Disability, Elderly & Rehabilitation',
  'Agriculture, Environment & Natural Resources', 'Animal, Cattle & Wildlife Welfare',
  'Social Awareness, Inclusion & Community Participation', 'Cultural, Religious & Creative Activities',
  'Human Resources & Employee Management', 'Volunteer & Internship Management',
  'Procurement & Vendor Management', 'Asset, Property & Inventory Management',
  'Safeguarding, Child Protection & Vulnerable Persons', 'Conflict of Interest & Related Party Management',
  'Anti-Fraud, Anti-Corruption & Whistleblower', 'Records, Documents & Institutional Knowledge',
  'Data Protection, Privacy & Information Security', 'Communication, Public Information & Digital Media',
  'Compliance, Audit, Risk & Statutory Reporting',
];

const SUMMARY_EN = [
  'SSF Integrated Institutional Policy & Procedure Manual (SSF-POL-MASTER-001, v1.0).',
  'Status: Draft for Formal Approval. Owner: Managing Committee / Competent Authority.',
  'Review cycle: at least once every 3 years. Applicable area: All India.',
  'Core financial principle: ONE TRANSACTION = ONE PRIMARY ENTRY (SSF-IMS).',
  'One Source of Truth: each core entity has a single master record with a permanent ID.',
  'Important records are never hard-deleted; use Inactive / Cancelled / Archived / Superseded.',
].join(' ');

const SUMMARY_HI = [
  'समेकित संस्थागत नीति एवं प्रक्रिया नियमावली (SSF-POL-MASTER-001, v1.0)।',
  'स्थिति: औपचारिक अनुमोदन हेतु प्रारूप। स्वामी: प्रबंधकारिणी समिति / सक्षम प्राधिकारी।',
  'पुनरीक्षण: कम से कम प्रत्येक 3 वर्ष में। लागू क्षेत्र: सम्पूर्ण भारत।',
  'मूल वित्तीय सिद्धांत: एक लेनदेन = एक प्राथमिक प्रविष्टि (SSF-IMS)।',
  'एक सत्य-स्रोत: प्रत्येक मूल इकाई का एक ही मास्टर रिकॉर्ड एवं स्थायी ID।',
  'महत्वपूर्ण अभिलेख स्थायी रूप से delete नहीं किए जाएंगे; Inactive / Cancelled / Archived / Superseded प्रयुक्त होगा।',
].join(' ');

function buildBody() {
  return [
    'SSF-POL-MASTER-001 / v1.0 — Integrated Institutional Policy & Procedure Manual',
    '',
    SUMMARY_EN, '',
    SUMMARY_HI, '',
    'Chapters / Policy Areas (29):',
    ...POLICY_AREAS.map((a, i) => `${i + 1}. ${a}`),
    '',
    'Note: The full bilingual manual text is rendered in the SSF-IMS Policy Manual reader.',
  ].join('\n');
}

async function seedPolicy() {
  const out = { created: false, updated: false, policyId: POLICY_ID };
  const existing = await models.ImsPolicy.findOne({ where: { recordId: POLICY_ID } });
  if (existing) {
    // Never clobber a record once it has been formally approved.
    if (existing.status === 'approved') return out;
    await existing.update({
      title: 'SSF Integrated Institutional Policy & Procedure Manual',
      category: 'Integrated Master Policy Manual',
      version: 1,
      body: buildBody(),
      data: { ...(existing.data || {}), titleHi: 'समेकित संस्थागत नीति एवं प्रक्रिया नियमावली', policyId: POLICY_ID, chapters: POLICY_AREAS.length },
    });
    out.updated = true;
    return out;
  }
  await models.ImsPolicy.create({
    recordId: POLICY_ID,
    title: 'SSF Integrated Institutional Policy & Procedure Manual',
    category: 'Integrated Master Policy Manual',
    status: 'draft',
    version: 1,
    approvedBy: '',
    effectiveDate: null,
    body: buildBody(),
    data: { titleHi: 'समेकित संस्थागत नीति एवं प्रक्रिया नियमावली', policyId: POLICY_ID, chapters: POLICY_AREAS.length },
  });
  out.created = true;
  return out;
}

module.exports = { seedPolicy, POLICY_ID, POLICY_AREAS };
