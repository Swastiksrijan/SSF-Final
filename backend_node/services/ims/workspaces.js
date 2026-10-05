// SSF-IMS deep workspaces: one meeting's full dossier, and one member's 360 view.
// Nothing here invents new data — it gathers linked records so a single screen
// shows the whole story (notice -> agenda -> attendance -> minutes -> decisions
// -> resolutions -> actions -> follow-up), or (person -> membership -> dues ->
// payments -> attendance -> committee -> notices -> cases -> documents -> history).
const { models } = require('../../models/ims');
const { Op } = require('sequelize');
const { relationsOf } = require('./audit');

const notArchived = { status: { [Op.ne]: 'archived' } };

/** Full dossier for one meeting. */
async function meetingDossier(meetingId) {
  const meeting = await models.ImsMeeting.findByPk(meetingId);
  if (!meeting) return null;
  const mid = meeting.id;

  const [attendees, resolutions, actions, notices, comms] = await Promise.all([
    models.ImsMeetingAttendee.findAll({ where: { meetingId: mid } }),
    models.ImsResolution.findAll({ where: { meetingId: mid } }),
    models.ImsAction.findAll({ where: { sourceMeetingId: mid } }),
    models.ImsNotice.findAll({ where: { meetingId: mid } }),
    models.ImsCommunication.findAll({ where: { relatedType: 'meetings', relatedId: mid }, limit: 100 }),
  ]);

  // Resolve attendee names.
  const personIds = [...new Set(attendees.map((a) => a.personId).filter(Boolean))];
  const people = personIds.length ? await models.ImsPerson.findAll({ where: { id: personIds } }) : [];
  const nameOf = (id) => {
    const p = people.find((x) => x.id === id);
    return p ? (p.fullName || p.recordId) : (id ? `#${id}` : '—');
  };
  const attendance = attendees.map((a) => ({ ...a.toJSON(), personName: nameOf(a.personId) }));

  const invited = attendees.filter((a) => a.invited).length;
  const present = attendees.filter((a) => a.attendance === 'present' || a.attendance === 'online').length;
  const absent = attendees.filter((a) => a.attendance === 'absent').length;
  const apology = attendees.filter((a) => a.attendance === 'apology').length;

  return {
    meeting: meeting.toJSON(),
    attendance,
    attendanceSummary: { invited: invited || attendees.length, present, absent, apology },
    resolutions,
    actions,
    notices,
    communications: comms,
    relations: await relationsOf('meetings', meeting.recordId),
  };
}

/** Add months to a YYYY-MM-DD date. */
function addMonths(dateStr, months) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

/** Full 360 view for one membership. */
async function member360(memberId) {
  const membership = await models.ImsMembership.findByPk(memberId);
  if (!membership) return null;
  const pid = membership.personId;

  const [person, committeeRoles, attendance, cases, comms, actions, payments] = await Promise.all([
    pid ? models.ImsPerson.findByPk(pid) : null,
    pid ? models.ImsCommitteeMember.findAll({ where: { personId: pid } }) : [],
    pid ? models.ImsMeetingAttendee.findAll({ where: { personId: pid } }) : [],
    pid ? models.ImsCase.findAll({ where: { personId: pid } }) : [],
    pid ? models.ImsCommunication.findAll({ where: { personId: pid }, limit: 100 }) : [],
    pid ? models.ImsAction.findAll({ where: { responsiblePersonId: pid } }) : [],
    pid ? models.ImsTransaction.findAll({ where: { personId: pid, direction: 'in' }, order: [['id', 'DESC']] }) : [],
  ]);

  const [notices, relations] = await Promise.all([
    pid ? models.ImsNotice.findAll({ where: { recipientIds: { [Op.contains]: [pid] } } }) : [],
    relationsOf('members', membership.recordId),
  ]);

  // Meeting details for attendance.
  const meetingIds = [...new Set(attendance.map((a) => a.meetingId).filter(Boolean))];
  const meetings = meetingIds.length ? await models.ImsMeeting.findAll({ where: { id: meetingIds } }) : [];
  const attendanceFull = attendance.map((a) => ({
    ...a.toJSON(),
    meetingTitle: (meetings.find((m) => m.id === a.meetingId) || {}).title || `#${a.meetingId}`,
    meetingDate: (meetings.find((m) => m.id === a.meetingId) || {}).meetingDate || null,
  }));

  // Dues: expected periods since admission vs recorded payments.
  const fee = Number(membership.feeAmount || 0);
  const freq = String(membership.feeFrequency || '').toLowerCase();
  const stepMonths = freq === 'monthly' ? 1 : freq === 'yearly' ? 12 : freq === 'one-time' ? 0 : 0;
  let expectedPeriods = 0;
  if (stepMonths > 0 && membership.admissionDate) {
    const start = new Date(membership.admissionDate + 'T00:00:00Z');
    const now = new Date();
    const months = (now.getUTCFullYear() - start.getUTCFullYear()) * 12 + (now.getUTCMonth() - start.getUTCMonth());
    expectedPeriods = Math.max(1, Math.floor(months / stepMonths) + 1);
  } else if (freq === 'one-time' || stepMonths === 0) {
    expectedPeriods = membership.admissionDate ? 1 : 0;
  }
  const paidCount = payments.length;
  const duePeriods = Math.max(0, expectedPeriods - paidCount);
  const amountDue = duePeriods * fee;

  // The dues recovery chain (shown as a lifecycle on the UI).
  const dueChain = [
    { id: 'due', en: 'Due', hi: 'देय' },
    { id: 'reminder', en: 'Reminder', hi: 'अनुस्मारक' },
    { id: 'notice', en: 'Notice', hi: 'सूचना' },
    { id: 'response', en: 'Response', hi: 'उत्तर' },
    { id: 'review', en: 'Review', hi: 'समीक्षा' },
    { id: 'decision', en: 'Decision', hi: 'निर्णय' },
    { id: 'action', en: 'Action', hi: 'कार्य' },
    { id: 'closure', en: 'Closure', hi: 'समापन' },
  ];
  // Current stage of the chain: if nothing is due -> closure; else inferred from open cases.
  const openCase = cases.find((c) => c.stage && c.stage !== 'closed');
  let dueStage = 'due';
  if (amountDue <= 0) dueStage = 'closure';
  else if (openCase) dueStage = openCase.stage === 'notified' ? 'notice' : openCase.stage === 'response' ? 'response' : openCase.stage === 'review' ? 'review' : openCase.stage === 'decision' ? 'decision' : openCase.stage === 'action' ? 'action' : 'due';

  // Documents linked to this member/person.
  const documents = [];
  if (pid) {
    const personRels = await relationsOf('persons', (person && person.recordId) || '');
    const docIds = personRels.filter((r) => r.type === 'documents').map((r) => r.id);
    if (docIds.length) {
      const docs = await models.ImsDocument.findAll({ where: { recordId: { [Op.in]: docIds } } });
      documents.push(...docs);
    }
  }

  const history = await models.ImsAuditTrail.findAll({
    where: { entityType: 'members', entityId: membership.recordId },
    order: [['id', 'DESC']],
    limit: 100,
  });

  return {
    membership: membership.toJSON(),
    person: person ? person.toJSON() : null,
    committeeRoles,
    attendance: attendanceFull,
    cases,
    communications: comms,
    actions,
    notices,
    payments,
    documents,
    relations,
    history,
    dues: { fee, frequency: freq, expectedPeriods, paidCount, duePeriods, amountDue, chain: dueChain, stage: dueStage },
  };
}

module.exports = { meetingDossier, member360 };
