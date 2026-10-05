// Import the SSF "Leadership - Volunteer & Membership" Google-Form responses
// into the IMS Volunteer register. For every applicant we create (or reuse) the
// single-source Person master, then one linked Volunteer record, and grant the
// `volunteer` role. Idempotent: re-running never duplicates a person or volunteer.
const { models } = require('../../models/ims');
const { Op } = require('sequelize');
const resource = require('./resource');
const { VOLUNTEER_IMPORT } = require('./volunteerImportData');

const hasDevanagari = (s) => /[\u0900-\u097F]/.test(s || '');
const clean = (s) => (s == null ? '' : String(s).trim());

async function findPerson(v) {
  const mobile = clean(v.mobile);
  const email = clean(v.email).toLowerCase();
  const name = clean(v.fullName);
  // Mobile is the strongest key. Email alone can be shared by a family, so
  // combine it with the name to avoid merging two different applicants.
  if (mobile) {
    const byMobile = await models.ImsPerson.findOne({ where: { mobile, status: { [Op.ne]: 'archived' } } });
    if (byMobile) return byMobile;
  }
  if (email && name) {
    const byEmail = await models.ImsPerson.findOne({ where: { email, status: { [Op.ne]: 'archived' } } });
    if (byEmail && clean(byEmail.fullName).toLowerCase() === name.toLowerCase()) return byEmail;
  }
  if (name) {
    const byName = await models.ImsPerson.findOne({ where: { fullName: name, status: { [Op.ne]: 'archived' } } });
    if (byName) return byName;
  }
  return null;
}

async function seedVolunteers(req) {
  const created = [];
  const skipped = [];
  let personsCreated = 0;

  for (const v of VOLUNTEER_IMPORT) {
    const fullName = clean(v.fullName) || clean(v.email) || 'Volunteer';
    let person = await findPerson(v);
    if (!person) {
      person = await resource.create('persons', {
        fullName,
        fullNameHi: hasDevanagari(fullName) ? fullName : undefined,
        mobile: clean(v.mobile) || undefined,
        email: clean(v.email) || undefined,
        gender: clean(v.gender) || undefined,
        dob: clean(v.dob) || undefined,
        city: clean(v.city) || undefined,
        state: clean(v.state) || undefined,
        notes: 'Imported from Leadership - Volunteer & Membership form.',
      }, req, { skipDuplicateCheck: true });
      personsCreated += 1;
    }

    const existing = await models.ImsVolunteer.findOne({
      where: { personId: person.id, status: { [Op.ne]: 'archived' } },
    });
    if (existing) { skipped.push(fullName); continue; }

    const row = await resource.create('volunteers', {
      personId: person.id,
      fullName,
      fullNameHi: hasDevanagari(fullName) ? fullName : undefined,
      email: clean(v.email) || undefined,
      mobile: clean(v.mobile) || undefined,
      gender: clean(v.gender) || undefined,
      dob: clean(v.dob) || undefined,
      city: clean(v.city) || undefined,
      state: clean(v.state) || undefined,
      volunteerType: clean(v.volunteerType) || 'field',
      roleApplied: clean(v.roleApplied) || undefined,
      preferredArea: clean(v.preferredArea) || undefined,
      timeCommitment: clean(v.timeCommitment) || undefined,
      financiallyIndependent: clean(v.financiallyIndependent) || undefined,
      experienceCapacity: clean(v.experienceCapacity) || undefined,
      contribution: clean(v.contribution) || undefined,
      motivation: clean(v.motivation) || undefined,
      fundraisingSupport: clean(v.fundraisingSupport) || undefined,
      declaration: clean(v.declaration) || undefined,
      skills: clean(v.experienceCapacity) || clean(v.preferredArea) || undefined,
      availability: clean(v.timeCommitment) || undefined,
      source: 'Leadership - Volunteer & Membership form',
      sourceTimestamp: clean(v.sourceTimestamp) || undefined,
    }, req, { skipDuplicateCheck: true });
    created.push(row.recordId);
  }

  return {
    total: VOLUNTEER_IMPORT.length,
    personsCreated,
    volunteersCreated: created.length,
    skipped: skipped.length,
    recordIds: created,
  };
}

module.exports = { seedVolunteers };
