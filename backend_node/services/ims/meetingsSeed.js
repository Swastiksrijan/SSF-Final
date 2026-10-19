// Seed the Meetings & Minutes register from data/meetingsRegister.js.
//
// Idempotent and additive, exactly like the member/committee seeds: a meeting
// already present (matched by date + title) is refreshed, never duplicated, and
// nothing is ever deleted. Attendance rows are attached for the committee
// members present, and one resolution per meeting records the decision, so the
// Agenda / Attendance / Minutes / Decisions tabs of the Meetings workspace all
// have real content.
const { models } = require('../../models/ims');
const { nextId } = require('./ids');
const { MEETINGS_REGISTER } = require('../../data/meetingsRegister');
const { MANAGING_COMMITTEE } = require('../../data/managingCommittee');

async function ensureAttendees(meeting, mode) {
  const joinedMode = mode === 'online' ? 'online' : (mode === 'hybrid' ? 'online' : 'offline');
  let created = 0;
  for (const m of MANAGING_COMMITTEE) {
    const person = await models.ImsPerson.findOne({ where: { fullName: m.name } });
    if (!person) continue;
    const [, made] = await models.ImsMeetingAttendee.findOrCreate({
      where: { meetingId: meeting.id, personId: person.id },
      defaults: {
        recordId: await nextId('ATT', undefined, models.ImsMeetingAttendee),
        meetingId: meeting.id, personId: person.id,
        invited: true, acknowledged: true, attendance: 'present', joinedMode,
        createdBy: 'meetings-seed', createdByName: 'Meetings Register Seed',
      },
    });
    if (made) created++;
  }
  return created;
}

async function ensureResolution(meeting, seq) {
  const [row, created] = await models.ImsResolution.findOrCreate({
    where: { meetingId: meeting.id, resolutionNo: 'RES-' + String(seq).padStart(2, '0') },
    defaults: {
      recordId: await nextId('RES', undefined, models.ImsResolution),
      meetingId: meeting.id,
      resolutionNo: 'RES-' + String(seq).padStart(2, '0'),
      title: meeting.title,
      body: meeting.minutes || meeting.agenda || null,
      votingResult: 'passed',
      isSpecial: meeting.meetingType === 'Special General Body',
      status: 'approved',
      createdBy: 'meetings-seed', createdByName: 'Meetings Register Seed',
    },
  });
  return created ? 1 : 0;
}

async function seedMeetings() {
  const out = { meetings: 0, updated: 0, attendees: 0, resolutions: 0 };
  const ordered = [...MEETINGS_REGISTER].sort((a, b) => String(a.meetingDate).localeCompare(String(b.meetingDate)));
  let seq = 0;
  for (const m of ordered) {
    seq += 1;
    const fields = {
      meetingType: m.meetingType,
      title: m.title,
      meetingDate: m.meetingDate || null,
      startTime: m.startTime || null,
      endTime: m.endTime || null,
      mode: m.mode || 'offline',
      venue: m.venue || null,
      meetingLink: m.meetingLink || null,
      platform: m.platform || null,
      noticeDate: m.noticeDate || null,
      noticeDeadline: m.noticeDeadline || null,
      agenda: m.agenda || null,
      quorumRequired: m.quorumRequired || '3/5',
      quorumAchieved: m.quorumAchieved !== undefined ? m.quorumAchieved : true,
      chairman: m.chairman || null,
      minutesStatus: m.minutesStatus || 'approved',
      minutes: m.minutes || null,
      nextMeetingDate: m.nextMeetingDate || null,
      status: 'active',
    };
    let meeting = await models.ImsMeeting.findOne({ where: { meetingDate: m.meetingDate, title: m.title } });
    if (!meeting) {
      meeting = await models.ImsMeeting.create({
        ...fields,
        recordId: await nextId('MEET', undefined, models.ImsMeeting),
        data: { sourcePage: m.sourcePage, source: 'scanned meeting register' },
        createdBy: 'meetings-seed', createdByName: 'Meetings Register Seed',
      });
      out.meetings++;
    } else {
      const patch = {};
      for (const [k, v] of Object.entries(fields)) if (meeting[k] !== v) patch[k] = v;
      if (Object.keys(patch).length) { await meeting.update(patch); out.updated++; }
    }
    out.attendees += await ensureAttendees(meeting, meeting.mode);
    out.resolutions += await ensureResolution(meeting, seq);
  }
  return out;
}

module.exports = { seedMeetings };
