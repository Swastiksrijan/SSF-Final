// Seed the default Cost Centre master (spec §7). Idempotent and non-destructive:
// matches on the permanent id when present, otherwise on the name, so re-running
// never duplicates and never overwrites an edited record's status.
const { models } = require('../../models/ims');
const { Op } = require('sequelize');

// recordId, English name, Hindi name, type, category
const DEFAULT_COST_CENTRES = [
  ['SSF-CC-000001', 'General Administration', 'सामान्य प्रशासन', 'institutional', 'Administration'],
  ['SSF-CC-000002', 'Education & Learning', 'शिक्षा एवं अधिगम', 'programme', 'Education'],
  ['SSF-CC-000003', 'Skill Development', 'कौशल विकास', 'programme', 'Skill Development'],
  ['SSF-CC-000004', 'Livelihood & Employment', 'आजीविका एवं रोजगार', 'programme', 'Livelihood'],
  ['SSF-CC-000005', 'Health & Counselling', 'स्वास्थ्य एवं परामर्श', 'programme', 'Health'],
  ['SSF-CC-000006', 'Women & Child Welfare', 'महिला एवं बाल कल्याण', 'programme', 'Women Welfare'],
  ['SSF-CC-000007', 'Disability & Rehabilitation', 'दिव्यांगता एवं पुनर्वास', 'programme', 'Disability/Rehabilitation'],
  ['SSF-CC-000008', 'Elderly Welfare', 'वृद्धजन कल्याण', 'programme', 'Elderly Welfare'],
  ['SSF-CC-000009', 'Agriculture & Rural Development', 'कृषि एवं ग्रामीण विकास', 'programme', 'Rural Development'],
  ['SSF-CC-000010', 'Environment & Tree Plantation', 'पर्यावरण एवं वृक्षारोपण', 'programme', 'Environment'],
  ['SSF-CC-000011', 'Animal & Cattle Welfare', 'पशु एवं गोवंश कल्याण', 'programme', 'Animal Welfare'],
  ['SSF-CC-000012', 'Social Awareness & Community Development', 'सामाजिक जागरूकता एवं समुदाय विकास', 'programme', 'Social Awareness'],
  ['SSF-CC-000013', 'Cultural & Creative Activities', 'सांस्कृतिक एवं सृजनात्मक गतिविधियाँ', 'activity', 'Cultural Activities'],
  ['SSF-CC-000014', 'Training & Workshops', 'प्रशिक्षण एवं कार्यशालाएँ', 'activity', 'Skill Development'],
  ['SSF-CC-000015', 'IT & Digital Operations', 'आईटी एवं डिजिटल संचालन', 'department', 'IT/Digital'],
  ['SSF-CC-000016', 'Compliance, Audit & Legal', 'अनुपालन, लेखा-परीक्षण एवं विधिक', 'department', 'Compliance'],
  ['SSF-CC-000017', 'Fundraising & Donor Relations', 'निधि-संग्रहण एवं दाता संबंध', 'department', 'Fundraising'],
  ['SSF-CC-000018', 'Institutional Operations', 'संस्थागत संचालन', 'institutional', 'Administration'],
];

async function seedCostCentres() {
  const out = { created: 0, existing: 0 };
  // Pad the sequence so future nextId('CC') calls continue after the defaults.
  for (const [recordId, name, nameHi, centreType, category] of DEFAULT_COST_CENTRES) {
    const found = await models.ImsCostCentre.findOne({
      where: { [Op.or]: [{ recordId }, { name }] },
    });
    if (found) { out.existing++; continue; }
    await models.ImsCostCentre.create({
      recordId, name, nameHi, centreType, category, status: 'active',
      description: `${name} — ${nameHi}`, createdByName: 'Cost Centre Seed',
    });
    out.created++;
  }
  return out;
}

module.exports = { seedCostCentres, DEFAULT_COST_CENTRES };
