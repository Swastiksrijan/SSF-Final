// Person 360: everything about one person, gathered from linked records.
const { models } = require('../../models/ims');
const { relationsOf } = require('./audit');

async function person360(personId) {
  const person = await models.ImsPerson.findByPk(personId);
  if (!person) return null;
  const pid = person.id;
  const [roles, memberships, meetingsAttended, donors, volunteer, employee,
         cases, communications, actions] = await Promise.all([
    models.ImsPersonRole.findAll({ where: { personId: pid } }),
    models.ImsMembership.findAll({ where: { personId: pid } }),
    models.ImsMeetingAttendee.findAll({ where: { personId: pid } }),
    models.ImsDonor.findAll({ where: { personId: pid } }),
    models.ImsVolunteer.findOne({ where: { personId: pid } }),
    models.ImsEmployee.findOne({ where: { personId: pid } }),
    models.ImsCase.findAll({ where: { personId: pid } }),
    models.ImsCommunication.findAll({ where: { personId: pid }, limit: 50 }),
    models.ImsAction.findAll({ where: { responsiblePersonId: pid } }),
  ]);

  // donations for this person's donor profile(s)
  const donorIds = donors.map(d => d.id);
  const donations = donorIds.length
    ? await models.ImsDonation.findAll({ where: { donorId: donorIds } })
    : [];

  // meeting details for attended meetings
  const meetingIds = meetingsAttended.map(a => a.meetingId).filter(Boolean);
  const meetings = meetingIds.length
    ? await models.ImsMeeting.findAll({ where: { id: meetingIds } })
    : [];

  return {
    person: person.toJSON(),
    roles: roles.map(r => r.roleCode),
    memberships,
    donors,
    donations,
    meetings: meetings.map(m => m.toJSON()),
    attendance: meetingsAttended,
    volunteer,
    employee,
    cases,
    communications,
    actions,
    relations: await relationsOf('persons', person.recordId),
  };
}

module.exports = { person360 };
