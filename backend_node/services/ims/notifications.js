// SSF-IMS Notification & Action Centre.
//
// A notification is an ALERT about a real event in an authoritative source
// record. It is never proof that the underlying task was completed — marking a
// notification read only clears the alert, never the source task.
//
// Design rules honoured here:
//   * ENTER ONCE: each alert carries a stable `eventKey`, so re-running the
//     sync (e.g. on every server boot) never creates duplicates.
//   * Evidence only: alerts are derived exclusively from source records that
//     genuinely exist and have a real date. Nothing is fabricated.
//   * IST: all "today"/"days left" reasoning is done in Asia/Kolkata, so a
//     notification flips from due-soon to overdue at local midnight.
//   * Never destructive: sync only inserts alerts; it never edits or deletes
//     the source records and never clears a task.

const { models } = require('../../models/ims');
const { Op } = require('sequelize');

const DAY_MS = 24 * 60 * 60 * 1000;

// ---- IST date helpers ------------------------------------------------------
// Return the calendar date (YYYY-MM-DD) as seen in Asia/Kolkata.
function istDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date);
}

// Normalise any date-ish value (YYYY-MM-DD string, ISO string, or Date object)
// to a plain YYYY-MM-DD. Sequelize returns DATEONLY as a string on Postgres but
// as a Date object under some drivers, so never assume the shape.
function toYmd(v) {
  if (v == null || v === '') return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString().slice(0, 10);
  const s = String(v);
  const m = s.match(/^\d{4}-\d{2}-\d{2}/);
  if (m) return m[0];
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

// Whole days from today (IST) to a YYYY-MM-DD date. Negative = overdue.
function daysUntil(dateStr, todayStr) {
  const d = toYmd(dateStr);
  if (!d) return null;
  const today = todayStr || istDate();
  const a = Date.parse(d + 'T00:00:00Z');
  const b = Date.parse(today + 'T00:00:00Z');
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((a - b) / DAY_MS);
}

// ---- source -> alert definitions ------------------------------------------
// Only sources that genuinely exist AND carry a real due/event date are used.
// `recurring: true` means the alert identity includes the calendar day, so a
// still-pending overdue item raises a fresh alert each day (the earlier ones
// stay in history, marked read). Non-recurring alerts are raised once.
const SOURCES = [
  {
    key: 'actionDue',
    resource: 'actions',
    model: () => models.ImsAction,
    dateField: 'dueDate',
    statusField: 'actionStatus',
    doneValues: ['completed', 'cancelled', 'deferred'],
    title: 'Action due soon',
    hi: 'कार्य नियत तिथि निकट',
    category: 'action',
    severity: 'warning',
    window: 7,
    recurring: false,
    link: (r) => `/ims/r/actions?open=${r.id}`,
    message: (r, n) => `“${r.title || r.recordId}” is due on ${toYmd(r.dueDate)}${n != null ? ` (in ${n} day${n === 1 ? '' : 's'})` : ''}.`,
  },
  {
    key: 'actionOverdue',
    resource: 'actions',
    model: () => models.ImsAction,
    dateField: 'dueDate',
    statusField: 'actionStatus',
    doneValues: ['completed', 'cancelled', 'deferred'],
    title: 'Action overdue',
    hi: 'कार्य विलंबित',
    category: 'action',
    severity: 'critical',
    overdue: true,
    // A still-overdue action re-raises weekly — steady pressure, not a storm.
    recurring: true,
    link: (r) => `/ims/r/actions?open=${r.id}`,
    message: (r, n) => `“${r.title || r.recordId}” was due on ${toYmd(r.dueDate)}${n != null ? ` (${Math.abs(n)} day${Math.abs(n) === 1 ? '' : 's'} overdue)` : ''}.`,
  },
  {
    key: 'complianceDue',
    resource: 'compliance',
    model: () => models.ImsCompliance,
    dateField: 'dueDate',
    statusField: 'complianceStatus',
    doneValues: ['completed', 'filed', 'cancelled', 'approved', 'closed'],
    title: 'Compliance due',
    hi: 'अनुपालन देय',
    category: 'compliance',
    severity: 'warning',
    window: 30,
    recurring: false,
    link: (r) => `/ims/r/compliance?open=${r.id}`,
    message: (r) => `${r.obligation || r.recordId} is due on ${toYmd(r.dueDate)}.`,
  },
  {
    key: 'complianceOverdue',
    resource: 'compliance',
    model: () => models.ImsCompliance,
    dateField: 'dueDate',
    statusField: 'complianceStatus',
    doneValues: ['completed', 'filed', 'cancelled', 'approved', 'closed'],
    title: 'Compliance overdue',
    hi: 'अनुपालन विलंबित',
    category: 'compliance',
    severity: 'critical',
    overdue: true,
    recurring: false,
    link: (r) => `/ims/r/compliance?open=${r.id}`,
    message: (r) => `${r.obligation || r.recordId} was due on ${toYmd(r.dueDate)}.`,
  },
  {
    key: 'auditDue',
    resource: 'audits',
    model: () => models.ImsAudit,
    dateField: 'dueDate',
    statusField: 'status',
    doneValues: ['completed', 'closed', 'cancelled', 'approved'],
    title: 'Audit action due',
    hi: 'लेखा-परीक्षण कार्य देय',
    category: 'compliance',
    severity: 'warning',
    window: 30,
    recurring: false,
    link: (r) => `/ims/r/audits?open=${r.id}`,
    message: (r) => `Audit ${r.recordId}${r.auditor ? ` (${r.auditor})` : ''} action due on ${toYmd(r.dueDate)}.`,
  },
  {
    key: 'yearClose',
    resource: 'financialYears',
    model: () => models.ImsFinancialYear,
    dateField: 'endDate',
    // A financial year that is not yet closed and is approaching its end date.
    extraWhere: { isClosed: { [Op.ne]: true } },
    title: 'Financial year closing',
    hi: 'वित्तीय वर्ष समापन',
    category: 'finance',
    severity: 'warning',
    window: 60,
    recurring: false,
    link: (r) => `/ims/r/financialYears?open=${r.id}`,
    message: (r) => `Financial year ${r.label || r.recordId} closes on ${toYmd(r.endDate)} — finalise books and audit.`,
  },

  // ---- date-driven governance: agreements / grants / documents ------------
  {
    key: 'agreementExpiry',
    resource: 'agreements',
    model: () => models.ImsAgreement,
    dateField: 'toDate',
    title: 'Agreement expiring',
    hi: 'अनुबंध समाप्त हो रहा',
    category: 'governance',
    severity: 'warning',
    window: 30,
    recurring: false,
    link: (r) => `/ims/r/agreements?open=${r.id}`,
    message: (r) => `${r.title || r.recordId}${r.agreementType ? ` (${r.agreementType})` : ''} expires on ${toYmd(r.toDate)} — review or renew.`,
  },
  {
    key: 'agreementExpired',
    resource: 'agreements',
    model: () => models.ImsAgreement,
    dateField: 'toDate',
    title: 'Agreement expired',
    hi: 'अनुबंध समाप्त',
    category: 'governance',
    severity: 'critical',
    overdue: true,
    recurring: false,
    link: (r) => `/ims/r/agreements?open=${r.id}`,
    message: (r) => `${r.title || r.recordId} expired on ${toYmd(r.toDate)} — renew or close it.`,
  },
  {
    key: 'grantReportDue',
    resource: 'grants',
    model: () => models.ImsGrant,
    dateField: 'reportDue',
    statusField: 'grantStatus',
    doneValues: ['closed', 'completed', 'cancelled', 'utilised'],
    title: 'Grant report due',
    hi: 'अनुदान रिपोर्ट देय',
    category: 'finance',
    severity: 'warning',
    window: 30,
    recurring: false,
    link: (r) => `/ims/r/grants?open=${r.id}`,
    message: (r) => `Utilisation report for grant ${r.recordId} is due on ${toYmd(r.reportDue)} — donors expect it on time.`,
  },
  {
    key: 'documentExpiry',
    resource: 'documents',
    model: () => models.ImsDocument,
    dateField: 'expiryDate',
    title: 'Document expiring',
    hi: 'दस्तावेज़ समाप्त हो रहा',
    category: 'records',
    severity: 'warning',
    window: 30,
    recurring: false,
    link: (r) => `/ims/r/documents?open=${r.id}`,
    message: (r) => `${r.title || r.recordId}${r.docType ? ` (${r.docType})` : ''} expires on ${toYmd(r.expiryDate)}.`,
  },
  {
    key: 'documentExpired',
    resource: 'documents',
    model: () => models.ImsDocument,
    dateField: 'expiryDate',
    title: 'Document expired',
    hi: 'दस्तावेज़ समाप्त',
    category: 'records',
    severity: 'critical',
    overdue: true,
    recurring: false,
    link: (r) => `/ims/r/documents?open=${r.id}`,
    message: (r) => `${r.title || r.recordId} expired on ${toYmd(r.expiryDate)} — replace or archive it.`,
  },
  {
    key: 'riskReview',
    resource: 'risks',
    model: () => models.ImsRisk,
    dateField: 'dueDate',
    title: 'Risk review due',
    hi: 'जोखिम समीक्षा देय',
    category: 'compliance',
    severity: 'warning',
    window: 30,
    recurring: false,
    link: (r) => `/ims/r/risks?open=${r.id}`,
    message: (r) => `Risk “${r.title || r.recordId}”${r.rating ? ` (${r.rating})` : ''} mitigation review is due on ${toYmd(r.dueDate)}.`,
  },

  // ---- behaviour-driven: patterns across the whole register ---------------
  // These do not watch one date. They look at how people actually behave and
  // raise an alert when a person's pattern crosses a threshold.
  {
    key: 'meetingAbsence',
    resource: 'meetings',
    model: () => models.ImsMeetingAttendee,
    category: 'governance',
    severity: 'warning',
    recurring: true,
    title: 'Repeated meeting absence',
    hi: 'बार-बार बैठक अनुपस्थिति',
    link: (r) => `/ims/r/meetings?open=${r.meta && r.meta.lastMeetingId ? r.meta.lastMeetingId : ''}`,
    message: (r) => `${r.fullName} has been absent from ${r.meta.absent} meeting${r.meta.absent === 1 ? '' : 's'} in the last 120 days — discuss responsibility.`,
    meta: (r) => ({ absent: r.meta.absent, lastMeetingId: r.meta.lastMeetingId }),
    baseWhere: () => ({ attendance: { [Op.in]: ['absent', 'apology'] } }),
    scan: ({ records, people, historical }) => {
      const cutoff = istDate(new Date(Date.now() - 120 * 864e5));
      const byPerson = new Map();
      for (const a of records) {
        if (!a.personId) continue;
        const d = toYmd(a.attDate || a.createdAt);
        if (!d || d < cutoff) continue;
        if (!byPerson.has(a.personId)) byPerson.set(a.personId, []);
        byPerson.get(a.personId).push(a);
      }
      const out = [];
      for (const [personId, rows] of byPerson) {
        if (rows.length < 3) continue;
        rows.sort((x, y) => String(toYmd(y.attDate)).localeCompare(String(toYmd(x.attDate))));
        const lastMeetingId = rows[0].meetingId;
        const recId = `PERSON:${personId}`;
        const prev = historical.get(recId);
        out.push({
          id: `person:${personId}`, recordId: recId, personId,
          responsiblePersonId: personId, fullName: (people && people.get(personId)) || `Person #${personId}`,
          absent: rows.length, lastMeetingId,
          _days: 0, _dueDate: istDate(),
          reminders: prev ? (prev.meta && prev.meta.reminders) || 1 : 0,
          _lastEventAt: prev ? prev.at : 0,
          meta: { absent: rows.length, total: rows.length, lastMeetingId },
        });
      }
      return out;
    },
  },
  {
    key: 'noticeUnanswered',
    resource: 'notices',
    model: () => models.ImsNotice,
    category: 'communication',
    severity: 'warning',
    recurring: true,
    title: 'Notice still not acknowledged',
    hi: 'सूचना की पुष्टि अभी नहीं',
    link: (r) => `/ims/r/notices?open=${r.id}`,
    message: (r) => `Notice “${r.subject || r.recordId}” has had no acknowledgement for ${r._days} days — follow up.`,
    baseWhere: () => ({ [Op.or]: [{ acknowledgement: { [Op.is]: null } }, { acknowledgement: '' }] }),
    scan: ({ records }) => {
      const out = [];
      for (const n of records) {
        const issued = toYmd(n.createdAt) || toYmd(n.noticeDate);
        if (!issued) continue;
        const days = Math.abs(daysUntil(issued, istDate()));
        if (days < 15) continue;
        out.push({
          id: n.id, recordId: n.recordId, subject: n.subject,
          noticeType: n.noticeType, _days: days, _dueDate: issued,
        });
      }
      return out;
    },
  },
  {
    key: 'membershipPending',
    resource: 'memberships',
    model: () => models.ImsMembership,
    category: 'governance',
    severity: 'info',
    recurring: true,
    title: 'Membership application awaiting decision',
    hi: 'सदस्यता आवेदन निर्णय हेतु लंबित',
    link: (r) => `/ims/r/memberships?open=${r.id}`,
    message: (r) => `${r.fullName} applied on ${toYmd(r.admissionDate)} — ${r._days} days without a decision.`,
    baseWhere: () => ({ applicationStatus: { [Op.in]: ['submitted', 'review'] } }),
    scan: ({ records, people, historical }) => {
      const out = [];
      for (const m of records) {
        const d = toYmd(m.admissionDate);
        if (!d) continue;
        const days = Math.abs(daysUntil(d, istDate()));
        if (days < 30) continue;
        const prev = historical.get(String(m.recordId));
        out.push({
          id: m.id, recordId: m.recordId, responsiblePersonId: m.personId,
          fullName: (m.personId && people && people.get(m.personId)) || m.recordId,
          admissionDate: d, _days: days, _dueDate: d,
          reminders: prev ? (prev.meta && prev.meta.reminders) || 1 : 0,
          _lastEventAt: prev ? prev.at : 0,
        });
      }
      return out;
    },
  },
];

// The date a source is keyed on. Most are a plain column; a few are derived
// (e.g. a membership anniversary), so a source may supply `dateOf(record)`.
function sourceDate(src, record) {
  if (record && record._dueDate) return record._dueDate; // synthetic scan record
  return src.dateOf ? src.dateOf(record) : record[src.dateField];
}

// A recurring source re-raises at most once every RECUR_MS while the condition
// persists (a nag, not a storm). Non-recurring sources raise once per record.
const RECUR_MS = 7 * 864e5;

// Rows a source should look at. Scan-based sources read one register and
// return synthetic records (e.g. a person who keeps missing meetings).
async function gatherRecords(src, limit = 2000) {
  if (src.scan) {
    const base = await src.model().findAll({ where: src.baseWhere ? src.baseWhere() : {}, limit: 5000 });
    const { Op } = require('sequelize');
    const historical = await models.ImsNotification.findAll({
      where: { eventType: src.key, dismissed: false, read: false },
      attributes: ['sourceRecordId', 'eventAt', 'meta'],
    }).catch(() => []);
    const seen = new Map();
    for (const n of historical) {
      const key = String(n.sourceRecordId);
      const at = n.eventAt ? new Date(n.eventAt).getTime() : 0;
      if (!seen.has(key) || at > seen.get(key).at) seen.set(key, { at, meta: n.meta || {} });
    }
    // People, so a behavioural alert can name the person, not "Person #5".
    const people = new Map();
    try {
      const rows = await models.ImsPerson.findAll({ attributes: ['id', 'fullName', 'recordId'] });
      for (const p of rows) people.set(p.id, p.fullName || p.recordId);
    } catch { /* names are best-effort */ }
    return src.scan({ records: base, historical: seen, Op, people });
  }
  return src.model().findAll({ where: sourceWhere(src), limit });
}

function sourceWhere(src) {
  if (src.scan) return {}; // scan-based sources fetch their own rows
  const and = [{ [src.dateField]: { [Op.ne]: null } }];
  // NULL status is a live row, not an archived one — never drop it silently.
  and.push({ [Op.or]: [{ status: { [Op.is]: null } }, { status: { [Op.ne]: 'archived' } }] });
  if (src.statusField) {
    and.push({ [Op.or]: [
      { [src.statusField]: { [Op.is]: null } },
      { [src.statusField]: { [Op.notIn]: src.doneValues } },
    ] });
  }
  // Source-specific guard (e.g. only years not yet closed).
  if (src.extraWhere) and.push(src.extraWhere);
  return { [Op.and]: and };
}

function alertRow(src, record, days, todayStr) {
  const due = toYmd(sourceDate(src, record));
  // Stable identity: one alert per (source, record, kind) — plus the day for
  // recurring reminders so a still-overdue item raises one fresh alert a day.
  const eventKey = src.recurring
    ? `${src.key}:${record.recordId}:${todayStr}`
    : `${src.key}:${record.recordId}`;
  const meta = { daysUntil: days, titleHi: src.hi };
  const ownerId = record.responsiblePersonId || record.ownerPersonId || null;
  if (ownerId) meta.personId = ownerId;
  if (src.meta) Object.assign(meta, src.meta(record, days) || {});
  return {
    eventKey,
    eventType: src.key,
    category: src.category,
    severity: src.severity,
    title: src.title,
    message: src.message(record, days),
    sourceType: src.resource,
    sourceId: String(record.id),
    sourceRecordId: record.recordId,
    sourceLink: src.link(record),
    recipientType: 'all',
    recipientId: null,
    dueDate: due,
    eventAt: record.updatedAt || record.createdAt || new Date(),
    read: false,
    dismissed: false,
    dedupeDay: src.recurring ? todayStr : null,
    meta,
  };
}

/**
 * Derive notifications from every connected source. Additive + idempotent:
 * only inserts alerts whose eventKey is not already present. Never touches the
 * source records. Returns counts for the sync report.
 */
async function syncNotifications() {
  const todayStr = istDate();
  const created = {};
  let scanned = 0;

  for (const src of SOURCES) {
    let records = [];
    try {
      records = await gatherRecords(src, 2000);
    } catch (e) {
      // A missing table must never break the sync.
      console.error(`Notification source ${src.key} skipped:`, e.message);
      continue;
    }
    scanned += records.length;
    for (const r of records) {
      const days = daysUntil(sourceDate(src, r), todayStr);
      if (days == null) continue;
      // Scan sources decide their own eligibility; date sources use the window.
      if (!src.scan && (src.overdue ? days >= 0 : (days < 0 || days > (src.window || 0)))) continue;
      // A recurring source re-raises only after RECUR_MS so a persisted
      // condition is a steady nag, never a daily storm.
      if (src.recurring && r._lastEventAt && (Date.now() - r._lastEventAt) < RECUR_MS) continue;
      const row = alertRow(src, r, days, todayStr);
      if (src.recurring) row.meta.reminders = (r.reminders || 0) + 1;
      try {
        // The unique eventKey makes this the dedupe gate: a concurrent or
        // repeated sync simply hits the constraint and is skipped.
        await models.ImsNotification.create(row);
        created[src.key] = (created[src.key] || 0) + 1;
      } catch (e) {
        if (!/unique|duplicate/i.test(e.message || '')) {
          console.error(`Notification insert failed (${row.eventKey}):`, e.message);
        }
      }
    }
  }
  return { scanned, created, totalCreated: Object.values(created).reduce((a, b) => a + b, 0), today: todayStr };
}

// Sources are unique by event key; several may share one resource (e.g. three
// action sources), so lookups by eventType must be exact.
const SRC_BY_RESOURCE = {};
for (const s of SOURCES) SRC_BY_RESOURCE[s.resource] = s;
const SRC_BY_EVENT = {};
for (const s of SOURCES) SRC_BY_EVENT[s.key] = s;

// Live status of the underlying task, read from the authoritative source record
// (never from the notification itself). This is what makes "reading ≠ done".
function taskStatus(src, rec, todayStr) {
  if (!rec) return 'missing';
  const st = src && src.statusField ? rec[src.statusField] : rec.status;
  const done = (src && src.doneValues) || [];
  if (st && done.includes(st)) return st === 'cancelled' ? 'cancelled' : 'completed';
  const d = src ? daysUntil(rec[src.dateField], todayStr) : null;
  if (d == null) return 'pending';
  if (d < 0) return 'overdue';
  if (d <= 3) return 'dueSoon';
  return 'pending';
}

// Attach responsible person, live task status and days-left to each alert.
async function enrich(rows) {
  const todayStr = istDate();
  const byType = {};
  for (const r of rows) {
    if (r.sourceType && r.sourceId) (byType[r.sourceType] = byType[r.sourceType] || []).push(r.sourceId);
  }
  const srcRecords = {};
  for (const [type, ids] of Object.entries(byType)) {
    const src = SRC_BY_RESOURCE[type];
    if (!src) continue;
    try {
      const found = await src.model().findAll({ where: { id: ids } });
      srcRecords[type] = new Map(found.map((x) => [String(x.id), x]));
    } catch { srcRecords[type] = new Map(); }
  }
  // Resolve responsible person names in one pass. Behavioural alerts carry the
  // person in their own meta (there is no single source record to read).
  const personIds = new Set();
  for (const map of Object.values(srcRecords)) {
    for (const rec of map.values()) {
      if (rec.responsiblePersonId) personIds.add(rec.responsiblePersonId);
      if (rec.ownerPersonId) personIds.add(rec.ownerPersonId);
    }
  }
  for (const r of rows) {
    const meta = (typeof r.toJSON === 'function' ? r.toJSON() : r).meta || {};
    if (meta.personId) personIds.add(meta.personId);
    if (meta.ownerPersonId) personIds.add(meta.ownerPersonId);
  }
  const people = new Map();
  if (personIds.size) {
    try {
      const found = await models.ImsPerson.findAll({ where: { id: [...personIds] } });
      for (const p of found) people.set(p.id, { name: p.fullName || p.recordId, email: p.email || null, mobile: p.mobile || p.altMobile || null });
    } catch { /* names are best-effort */ }
  }
  return rows.map((r) => {
    const o = typeof r.toJSON === 'function' ? r.toJSON() : { ...r };
    // Always hand the client a plain YYYY-MM-DD, whatever shape the driver used.
    o.dueDate = toYmd(o.dueDate);
    const meta = o.meta || {};
    const src = SRC_BY_EVENT[r.eventType] || SRC_BY_RESOURCE[r.sourceType];
    const rec = srcRecords[r.sourceType] && srcRecords[r.sourceType].get(String(r.sourceId));
    o.taskStatus = src && src.scan ? 'pending' : taskStatus(src, rec, todayStr);
    // Scan-based alerts keep their own day count; date sources read the record.
    o.daysUntil = meta.daysUntil != null ? meta.daysUntil
      : (rec && src ? daysUntil(sourceDate(src, rec), todayStr) : (o.dueDate ? daysUntil(o.dueDate, todayStr) : null));
    o.responsiblePersonId = rec ? (rec.responsiblePersonId || rec.ownerPersonId || null)
      : (meta.personId || meta.ownerPersonId || null);
    const person = o.responsiblePersonId ? people.get(o.responsiblePersonId) : null;
    o.responsibleName = person ? person.name : null;
    o.responsibleEmail = person ? person.email : null;
    o.responsibleMobile = person ? person.mobile : null;
    return o;
  });
}

// ---- delivery (email) ------------------------------------------------------
// Who receives an alert: the responsible person's email when we have it, else
// the configured admin mailbox(es). Nothing is invented — a missing email means
// the alert simply stays in-app for admins to see.
function adminRecipients() {
  return String(process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
}

function appBaseUrl() {
  return String(process.env.APP_BASE_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
}

function absoluteLink(link) {
  if (!link) return appBaseUrl();
  return /^https?:/i.test(link) ? link : appBaseUrl() + link;
}

function emailBody(alert) {
  const link = absoluteLink(alert.sourceLink);
  const lines = [
    alert.message,
    '',
    `Record: ${alert.sourceRecordId || '—'}`,
    `Due date: ${alert.dueDate || '—'}`,
    alert.responsibleName ? `Responsible: ${alert.responsibleName}` : null,
    '',
    `Open in SSF OneOffice: ${link}`,
    '',
    'SSF OneOffice · Notifications & Action Centre',
    'This is an automatic reminder. Completing the task in its register clears it.',
  ].filter((l) => l !== null);
  return lines.join('\n');
}

function emailHtml(alert) {
  const link = absoluteLink(alert.sourceLink);
  const color = alert.severity === 'critical' ? '#DC2626' : alert.severity === 'warning' ? '#D97706' : '#2563EB';
  return `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
    <div style="background:#002344;color:#fff;padding:16px 20px">
      <div style="font-size:12px;letter-spacing:.15em;color:#FFD166;font-weight:800">SSF ONEOFFICE</div>
      <div style="font-size:18px;font-weight:800;margin-top:2px">Notifications &amp; Action Centre</div>
    </div>
    <div style="padding:20px">
      <div style="display:inline-block;background:${color};color:#fff;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:800;text-transform:uppercase">${alert.severity || 'info'}</div>
      <h2 style="margin:10px 0 6px;color:#002344">${alert.title}</h2>
      <p style="color:#334155;line-height:1.5">${alert.message}</p>
      <table style="font-size:13px;color:#475569;margin-top:10px">
        <tr><td style="padding:2px 10px 2px 0"><b>Record</b></td><td>${alert.sourceRecordId || '—'}</td></tr>
        <tr><td style="padding:2px 10px 2px 0"><b>Due date</b></td><td>${alert.dueDate || '—'}</td></tr>
        ${alert.responsibleName ? `<tr><td style="padding:2px 10px 2px 0"><b>Responsible</b></td><td>${alert.responsibleName}</td></tr>` : ''}
      </table>
      <p style="margin-top:18px"><a href="${link}" style="background:#FF6600;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:700">Open the record</a></p>
      <p style="color:#94a3b8;font-size:12px;margin-top:16px">This is an automatic reminder. Completing the task in its register clears it.</p>
    </div>
  </div>`;
}

// Short phone-friendly text for WhatsApp / SMS.
function shortText(alert) {
  return `[SSF] ${alert.title}: ${alert.message} Open: ${absoluteLink(alert.sourceLink)}`;
}

/**
 * Send every alert that has not yet gone out on each channel. Idempotent per
 * channel: a successful delivery attempt for (alert, channel) is the gate, so
 * repeated boots/refreshes never spam. Never edits the source record.
 *
 *   email    — always attempted (provider-gated inside mailer.js)
 *   whatsapp — the responsible person's mobile (Meta Cloud API), if configured
 *   sms      — the responsible person's mobile (Twilio), if WHATSAPP_DISABLED
 *              is not set and no WhatsApp is configured (opt-in, costs money)
 *
 * opts.channels narrows the channels (e.g. ['whatsapp'] for a test send).
 */
async function deliverNotifications({ limit = 100, channels = null } = {}) {
  const { sendMail, emailConfigured } = require('../mailer');
  const msg = require('../messaging');

  const want = (c) => !channels || channels.includes(c);
  const explicit = Array.isArray(channels);
  const waConfigured = msg.whatsappConfigured();
  const active = {
    email: want('email') && emailConfigured(),
    whatsapp: want('whatsapp') && waConfigured,
    // Prefer WhatsApp (free); fall back to SMS only when it is off, or when a
    // channel is explicitly requested. Avoids paying twice for the same alert.
    sms: want('sms') && msg.smsConfigured() && (explicit || !waConfigured),
  };
  if (!active.email && !active.whatsapp && !active.sms) {
    return { configured: false, sent: 0, skipped: 0, failed: 0, channels: active };
  }

  const pending = await models.ImsNotification.findAll({ where: { dismissed: false }, order: [['dueDate', 'ASC']], limit });
  const enriched = await enrich(pending);

  // Alerts already delivered successfully on each channel.
  const done = { email: new Set(), whatsapp: new Set(), sms: new Set() };
  try {
    const attempts = await models.ImsDeliveryAttempt.findAll({ where: { status: 'sent' } });
    for (const a of attempts) if (done[a.channel]) done[a.channel].add(String(a.notificationId));
  } catch { /* table not ready — treat as nothing done */ }

  const logAttempt = (alert, channel, status, detail, reference) =>
    models.ImsDeliveryAttempt.create({
      notificationId: alert.id, channel, status, attemptedAt: new Date(),
      detail: String(detail).slice(0, 300), reference: reference ? String(reference) : null,
    }).catch(() => {});

  let sent = 0, skipped = 0, failed = 0;
  const byChannel = { email: 0, whatsapp: 0, sms: 0 };

  for (const alert of enriched) {
    // --- email ---
    if (active.email) {
      if (done.email.has(String(alert.id))) skipped++;
      else {
        const to = alert.responsibleEmail ? [alert.responsibleEmail] : adminRecipients();
        if (!to.length) skipped++;
        else {
          try {
            const out = await sendMail({
              from: `"SSF Action Centre" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'swastiksrijanfoundation@gmail.com'}>`,
              to: to.join(','),
              subject: `[SSF] ${alert.title} — ${alert.sourceRecordId || ''}`.trim(),
              text: emailBody(alert), html: emailHtml(alert),
            });
            await logAttempt(alert, 'email', 'sent', `to ${to.join(', ')}`, out && out.id);
            sent++; byChannel.email++;
          } catch (e) { failed++; await logAttempt(alert, 'email', 'failed', e.message); }
        }
      }
    }

    // --- whatsapp / sms: to the responsible person's own mobile only ---
    const mobile = alert.responsibleMobile;
    if (active.whatsapp) {
      if (done.whatsapp.has(String(alert.id))) skipped++;
      else if (!mobile) { skipped++; await logAttempt(alert, 'whatsapp', 'skipped', 'no mobile on responsible person'); }
      else {
        try {
          const out = await msg.sendWhatsApp({
            to: mobile,
            text: shortText(alert),
            params: [alert.title, alert.message, alert.dueDate || '—', absoluteLink(alert.sourceLink)],
          });
          await logAttempt(alert, 'whatsapp', 'sent', `to ${msg.normalizePhone(mobile)}`, out && out.id);
          sent++; byChannel.whatsapp++;
        } catch (e) { failed++; await logAttempt(alert, 'whatsapp', 'failed', `${mobile} — ${e.message}`); }
      }
    }
    if (active.sms) {
      if (done.sms.has(String(alert.id))) skipped++;
      else if (!mobile) { skipped++; await logAttempt(alert, 'sms', 'skipped', 'no mobile on responsible person'); }
      else {
        try {
          const out = await msg.sendSms({ to: mobile, text: shortText(alert) });
          await logAttempt(alert, 'sms', 'sent', `to ${msg.normalizePhone(mobile)}`, out && out.id);
          sent++; byChannel.sms++;
        } catch (e) { failed++; await logAttempt(alert, 'sms', 'failed', `${mobile} — ${e.message}`); }
      }
    }
  }
  return { configured: true, sent, skipped, failed, channels: active, byChannel };
}

/**
 * Send ONE alert by id on chosen channels, for an operational test. Unlike the
 * batch path this overwrites the once-only gate, so an admin can deliberately
 * re-send a single alert after configuring a new provider.
 */
async function sendTest(id, channelList = ['email']) {
  const row = await models.ImsNotification.findByPk(id);
  if (!row) throw new Error('Notification not found');
  const [alert] = await enrich([row]);
  const msg = require('../messaging');
  const results = [];
  for (const channel of channelList) {
    if (channel === 'email') {
      const to = alert.responsibleEmail ? [alert.responsibleEmail] : adminRecipients();
      const { sendMail } = require('../mailer');
      try {
        const out = await sendMail({
          from: `"SSF Action Centre" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'swastiksrijanfoundation@gmail.com'}>`,
          to: to.join(','), subject: `[SSF] ${alert.title} — ${alert.sourceRecordId || ''}`.trim(),
          text: emailBody(alert), html: emailHtml(alert),
        });
        results.push({ channel, ok: true, to: to.join(', '), id: out && out.id });
      } catch (e) { results.push({ channel, ok: false, error: e.message }); }
    } else if (channel === 'whatsapp') {
      if (!alert.responsibleMobile) { results.push({ channel, ok: false, error: 'no mobile on responsible person' }); continue; }
      try {
        const out = await msg.sendWhatsApp({ to: alert.responsibleMobile, text: shortText(alert), params: [alert.title, alert.message, alert.dueDate || '—', absoluteLink(alert.sourceLink)] });
        results.push({ channel, ok: true, to: msg.normalizePhone(alert.responsibleMobile), id: out && out.id });
      } catch (e) { results.push({ channel, ok: false, error: e.message }); }
    } else if (channel === 'sms') {
      if (!alert.responsibleMobile) { results.push({ channel, ok: false, error: 'no mobile on responsible person' }); continue; }
      try {
        const out = await msg.sendSms({ to: alert.responsibleMobile, text: shortText(alert) });
        results.push({ channel, ok: true, to: msg.normalizePhone(alert.responsibleMobile), id: out && out.id });
      } catch (e) { results.push({ channel, ok: false, error: e.message }); }
    } else results.push({ channel, ok: false, error: 'unknown channel' });
  }
  return { results };
}

// Delivery evidence for one alert (which channel went out, when, and to whom).
async function listDeliveries(id) {
  try {
    const rows = await models.ImsDeliveryAttempt.findAll({ where: { notificationId: id }, order: [['id', 'DESC']] });
    return { attempts: rows.map((r) => (typeof r.toJSON === 'function' ? r.toJSON() : r)) };
  } catch { return { attempts: [] }; }
}

// Which channels are actually usable right now — shown on the centre so an
// admin knows whether alerts will reach phones, and what still needs setting up.
function channelsStatus() {
  const msg = require('../messaging');
  const { emailConfigured } = require('../mailer');
  return {
    email: emailConfigured(),
    whatsapp: msg.whatsappConfigured(),
    sms: msg.smsConfigured(),
  };
}

async function unreadCount() {
  try {
    return await models.ImsNotification.count({ where: { read: false, dismissed: false } });
  } catch { return 0; }
}

async function listNotifications(query = {}) {
  const { Op } = require('sequelize');
  const where = { dismissed: false };
  const status = String(query.status || '').toLowerCase();
  if (status === 'unread') where.read = false;
  else if (status === 'read') where.read = true;
  if (query.category) where.category = query.category;
  if (query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: '%' + query.search + '%' } },
      { message: { [Op.iLike]: '%' + query.search + '%' } },
      { sourceRecordId: { [Op.iLike]: '%' + query.search + '%' } },
    ];
  }
  const limit = Math.min(Number(query.limit) || 100, 500);
  const { rows, count } = await models.ImsNotification.findAndCountAll({
    where,
    order: [['read', 'ASC'], ['dueDate', 'ASC'], ['id', 'DESC']],
    limit,
  });
  const records = await enrich(rows);
  return {
    records,
    total: count,
    unread: await unreadCount(),
    stats: await statsSummary(),
    today: istDate(),
  };
}

// Aggregate picture for the dashboard header. Counts are taken from the whole
// set (not just the current page) so KPIs stay correct under filters.
async function statsSummary() {
  const { Op } = require('sequelize');
  const rows = await models.ImsNotification.findAll({ where: { dismissed: false } }).catch(() => []);
  const enriched = await enrich(rows);
  const s = { total: enriched.length, unread: 0, overdue: 0, dueSoon: 0, critical: 0, byCategory: {} };
  for (const r of enriched) {
    if (!r.read) s.unread++;
    if (r.taskStatus === 'overdue') s.overdue++;
    else if (r.taskStatus === 'dueSoon') s.dueSoon++;
    if (r.severity === 'critical' && !r.read) s.critical++;
    s.byCategory[r.category || 'other'] = (s.byCategory[r.category || 'other'] || 0) + 1;
  }
  return s;
}

// What this centre is watching: for each connected source, how many records are
// eligible to raise an alert right now. Lets the UI show it is alive even when
// no alert is currently due — and is honest when a source is not connected.
async function sourceSummary() {
  const todayStr = istDate();
  const out = [];
  for (const src of SOURCES) {
    let monitored = 0, due = 0, connected = true;
    try {
      const records = await gatherRecords(src, 2000);
      monitored = records.length;
      for (const r of records) {
        const d = daysUntil(sourceDate(src, r), todayStr);
        if (d == null) continue;
        if (!src.scan && (src.overdue ? d >= 0 : (d < 0 || d > (src.window || 0)))) continue;
        due++;
      }
    } catch { connected = false; }
    out.push({ key: src.key, resource: src.resource, category: src.category, connected, monitored, due });
  }
  return { sources: out, today: todayStr };
}

async function markRead(idOrRecordId, req) {
  const where = /^\d+$/.test(String(idOrRecordId)) ? { id: idOrRecordId } : { recordId: idOrRecordId };
  const row = await models.ImsNotification.findOne({ where });
  if (!row) { const e = new Error('Notification not found'); e.status = 404; throw e; }
  if (!row.read) {
    row.read = true;
    row.readAt = new Date();
    row.readBy = (req && req.headers && req.headers['x-office-actor']) || 'admin';
    await row.save();
  }
  return row;
}

async function markAllRead(req) {
  const [n] = await models.ImsNotification.update(
    { read: true, readAt: new Date(), readBy: (req && req.headers && req.headers['x-office-actor']) || 'admin' },
    { where: { read: false, dismissed: false } },
  );
  return n;
}

module.exports = { syncNotifications, deliverNotifications, sendTest, listDeliveries, channelsStatus, istDate, daysUntil, SOURCES, listNotifications, markRead, markAllRead, unreadCount, enrich, statsSummary, sourceSummary };
