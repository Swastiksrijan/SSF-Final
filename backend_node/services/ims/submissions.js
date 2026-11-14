// Unified Submissions register.
//
// Every public form already stores its data in its own table. This service does
// NOT copy that data anywhere — it reads each source table live and normalises
// the rows into one shape, so a new submission appears in the register the
// moment it is saved. Office-side extras (a remark and a follow-up status) are
// kept in the ImsSubmissionNote sidecar, keyed by source type + row id, so the
// original application data is never mutated.
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { models } = require('../../models/ims');

const Interest = require('../../models/Interest');
const Member = require('../../models/Member');
const Volunteer = require('../../models/Volunteer');
const Donor = require('../../models/Donor');
const InternshipApplication = require('../../models/InternshipApplication');
const ContactMessage = require('../../models/ContactMessage');
const Complaint = require('../../models/Complaint');

const FOLLOW_UP = ['new', 'contacted', 'follow_up', 'closed'];

// Each source: how to fetch rows, its name column, and how to shape a row into
// the register. `name` may be a string (a column) or a function (composed).
const SOURCES = {
  interest: {
    label: { en: 'Join / Interest', hi: 'जुड़ाव / रुचि' },
    model: Interest,
    name: (r) => r.fullName,
    detail: (r) => [r.category, r.message].filter(Boolean).join(' — '),
    fields: ['fullName', 'email', 'phone', 'interestType', 'category', 'message', 'status'],
  },
  member: {
    label: { en: 'Membership', hi: 'सदस्यता' },
    model: Member,
    name: (r) => r.fullName,
    detail: (r) => [r.memberType, r.city, r.state].filter(Boolean).join(', '),
    fields: ['fullName', 'email', 'phone', 'memberType', 'designation', 'city', 'state', 'message', 'status', 'paymentStatus'],
  },
  volunteer: {
    label: { en: 'Volunteer', hi: 'स्वयंसेवा' },
    model: Volunteer,
    name: (r) => r.fullName,
    detail: (r) => [r.volunteerType, r.position].filter(Boolean).join(' — '),
    fields: ['fullName', 'email', 'phone', 'volunteerType', 'position', 'message', 'status', 'isVerified'],
  },
  donor: {
    label: { en: 'Donor', hi: 'दानदाता' },
    model: Donor,
    name: (r) => r.fullName,
    detail: (r) => [r.donationPurpose, r.amount ? `₹${r.amount}` : '', r.city].filter(Boolean).join(', '),
    fields: ['fullName', 'email', 'phone', 'city', 'state', 'donationPurpose', 'amount', 'pan', 'paymentStatus', 'status'],
  },
  internship: {
    label: { en: 'Internship', hi: 'इंटर्नशिप' },
    model: InternshipApplication,
    name: (r) => r.fullName,
    detail: (r) => [r.internshipType, r.college, r.course].filter(Boolean).join(' — '),
    fields: ['fullName', 'email', 'phone', 'college', 'course', 'internshipType', 'duration', 'message', 'status'],
  },
  contact: {
    label: { en: 'Contact', hi: 'संपर्क' },
    model: ContactMessage,
    name: (r) => [r.firstName, r.lastName].filter(Boolean).join(' '),
    detail: (r) => r.message,
    fields: ['firstName', 'lastName', 'email', 'phone', 'message', 'status'],
  },
  complaint: {
    label: { en: 'Complaint / Grievance', hi: 'शिकायत / निवारण' },
    model: Complaint,
    name: (r) => r.fullName,
    detail: (r) => [r.reference, r.category, r.subject].filter(Boolean).join(' — '),
    fields: ['reference', 'fullName', 'email', 'phone', 'category', 'subject', 'description', 'status'],
  },
};

const SOURCE_TYPES = Object.keys(SOURCES);

function normalise(sourceType, row) {
  const src = SOURCES[sourceType];
  const plain = typeof row.get === 'function' ? row.get({ plain: true }) : { ...row };
  const data = {};
  for (const f of src.fields) {
    if (plain[f] !== undefined && plain[f] !== null && plain[f] !== '') data[f] = plain[f];
  }
  return {
    id: `${sourceType}:${plain.id}`,
    sourceType,
    sourceId: String(plain.id),
    name: src.name(plain) || '(no name)',
    email: plain.email || '',
    phone: plain.phone || '',
    detail: src.detail(plain) || '',
    status: plain.status || '',
    createdAt: plain.createdAt || null,
    data,
    remark: '',
    followUp: 'new',
    updatedBy: '',
  };
}

/** Notes for a set of `${type}:${id}` keys, as a lookup map. */
async function notesFor(keys) {
  if (!keys.length) return {};
  const where = keys.map((k) => {
    const [sourceType, id] = k.split(':');
    return { sourceType, sourceId: String(id) };
  });
  const rows = await models.ImsSubmissionNote.findAll({ where: { [Op.or]: where } });
  const map = {};
  for (const n of rows) {
    map[`${n.sourceType}:${n.sourceId}`] = {
      remark: n.remark || '',
      followUp: n.followUp || 'new',
      updatedBy: n.updatedBy || '',
    };
  }
  return map;
}

/**
 * Register rows across one source type (`all` = every type), newest first.
 * `q` filters by name/email/phone. `followUp` filters by office status.
 */
async function list({ type = 'all', q = '', followUp = '', limit = 400 } = {}) {
  const types = type && type !== 'all' ? [type] : SOURCE_TYPES;
  const out = [];
  for (const sourceType of types) {
    if (!SOURCES[sourceType]) continue;
    const rows = await SOURCES[sourceType].model.findAll({
      order: [['createdAt', 'DESC']],
      limit: Math.min(Number(limit) || 400, 1000),
    });
    for (const r of rows) out.push(normalise(sourceType, r));
  }

  const notes = await notesFor(out.map((r) => r.id));
  for (const r of out) {
    const n = notes[r.id];
    if (n) { r.remark = n.remark; r.followUp = n.followUp; r.updatedBy = n.updatedBy; }
  }

  out.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const needle = String(q || '').trim().toLowerCase();
  return out.filter((r) => {
    if (followUp && r.followUp !== followUp) return false;
    if (!needle) return true;
    return `${r.name} ${r.email} ${r.phone} ${r.detail}`.toLowerCase().includes(needle);
  });
}

/** KPI counts per source type (unfiltered). */
async function summary() {
  const counts = {};
  let total = 0;
  for (const sourceType of SOURCE_TYPES) {
    const c = await SOURCES[sourceType].model.count();
    counts[sourceType] = c;
    total += c;
  }
  const byFollowUp = {};
  for (const s of FOLLOW_UP) {
    byFollowUp[s] = await models.ImsSubmissionNote.count({ where: { followUp: s } });
  }
  return { total, counts, byFollowUp, labels: Object.fromEntries(SOURCE_TYPES.map((t) => [t, SOURCES[t].label])) };
}

/** Upsert the office-side note for one submission. */
async function updateNote(id, { remark, followUp, updatedBy } = {}) {
  const [sourceType, rawId] = String(id || '').split(':');
  if (!SOURCES[sourceType]) { const e = new Error('Unknown submission type'); e.status = 400; throw e; }
  const sourceId = String(rawId || '').trim();
  if (!sourceId) { const e = new Error('Invalid submission id'); e.status = 400; throw e; }

  const payload = {};
  if (remark !== undefined) payload.remark = String(remark || '');
  if (followUp !== undefined) {
    if (!FOLLOW_UP.includes(followUp)) { const e = new Error('Invalid follow-up status'); e.status = 400; throw e; }
    payload.followUp = followUp;
  }
  payload.updatedBy = updatedBy || 'admin';

  // findOrCreate uses a plpgsql helper that some drivers (and pg-mem) reject,
  // so upsert explicitly.
  let note = await models.ImsSubmissionNote.findOne({ where: { sourceType, sourceId } });
  if (note) await note.update(payload);
  else note = await models.ImsSubmissionNote.create({ sourceType, sourceId, ...payload });
  return { sourceType, sourceId, remark: note.remark || '', followUp: note.followUp, updatedBy: note.updatedBy };
}

// Uploaded files live under backend_node/uploads/<basename>; drop them with the
// row so a deleted application leaves nothing behind on disk.
function removeStoredFile(storedPath) {
  if (!storedPath) return;
  const filePath = path.join(__dirname, '..', '..', String(storedPath).replace(/^\/+/, ''));
  try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { console.warn('Submission upload cleanup failed:', e.message); }
}

// Columns that may hold an uploaded file, per source type.
const FILE_FIELDS = {
  member: ['profilePhotoPath', 'idDocumentPath'],
  volunteer: ['idDocumentPath', 'profilePhotoPath'],
  donor: ['idDocumentPath', 'profilePhotoPath'],
  internship: ['resumePath', 'profilePhotoPath', 'idDocumentPath'],
};

/**
 * Permanently delete one submission (source row + any uploaded file + its
 * office note). Mirrors the existing per-module admin delete, but reachable for
 * every type — including complaint, which had no delete anywhere before.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function remove(id) {
  const [sourceType, rawId] = String(id || '').split(':');
  if (!SOURCES[sourceType]) { const e = new Error('Unknown submission type'); e.status = 400; throw e; }
  const sourceId = String(rawId || '').trim();
  // Every source table keys on a UUID; a malformed id can never match a row.
  if (!sourceId) { const e = new Error('Invalid submission id'); e.status = 400; throw e; }
  if (!UUID_RE.test(sourceId)) { const e = new Error('Submission not found'); e.status = 404; throw e; }

  const row = await SOURCES[sourceType].model.findByPk(sourceId);
  if (!row) { const e = new Error('Submission not found'); e.status = 404; throw e; }

  for (const field of FILE_FIELDS[sourceType] || []) removeStoredFile(row[field]);
  await row.destroy();
  await models.ImsSubmissionNote.destroy({ where: { sourceType, sourceId } });
  return { sourceType, sourceId, deleted: true };
}

module.exports = { SOURCES, SOURCE_TYPES, FOLLOW_UP, list, summary, updateNote, remove };
