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
    recurring: false,
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
];

function sourceWhere(src) {
  const where = { [src.dateField]: { [Op.ne]: null }, status: { [Op.ne]: 'archived' } };
  if (src.statusField) {
    where[Op.or] = [
      { [src.statusField]: { [Op.is]: null } },
      { [src.statusField]: { [Op.notIn]: src.doneValues } },
    ];
  }
  // Source-specific guard (e.g. only years not yet closed).
  if (src.extraWhere) Object.assign(where, src.extraWhere);
  return where;
}

function alertRow(src, record, days, todayStr) {
  const due = toYmd(record[src.dateField]);
  // Stable identity: one alert per (source, record, kind) — plus the day for
  // recurring reminders so a still-overdue item raises one fresh alert a day.
  const eventKey = src.recurring
    ? `${src.key}:${record.recordId}:${todayStr}`
    : `${src.key}:${record.recordId}`;
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
    meta: { daysUntil: days, titleHi: src.hi },
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
      records = await src.model().findAll({ where: sourceWhere(src), limit: 1000 });
    } catch (e) {
      // A missing table must never break the sync.
      console.error(`Notification source ${src.key} skipped:`, e.message);
      continue;
    }
    scanned += records.length;
    for (const r of records) {
      const days = daysUntil(r[src.dateField], todayStr);
      if (days == null) continue;
      if (src.overdue ? days >= 0 : (days < 0 || days > (src.window || 0))) continue;
      const row = alertRow(src, r, days, todayStr);
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

const SRC_BY_RESOURCE = {};
for (const s of SOURCES) SRC_BY_RESOURCE[s.resource] = s;

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
  // Resolve responsible person names in one pass.
  const personIds = new Set();
  for (const map of Object.values(srcRecords)) {
    for (const rec of map.values()) {
      if (rec.responsiblePersonId) personIds.add(rec.responsiblePersonId);
      if (rec.ownerPersonId) personIds.add(rec.ownerPersonId);
    }
  }
  const people = new Map();
  if (personIds.size) {
    try {
      const found = await models.ImsPerson.findAll({ where: { id: [...personIds] } });
      for (const p of found) people.set(p.id, p.fullName || p.recordId);
    } catch { /* names are best-effort */ }
  }
  return rows.map((r) => {
    const o = typeof r.toJSON === 'function' ? r.toJSON() : { ...r };
    // Always hand the client a plain YYYY-MM-DD, whatever shape the driver used.
    o.dueDate = toYmd(o.dueDate);
    const src = SRC_BY_RESOURCE[r.sourceType];
    const rec = srcRecords[r.sourceType] && srcRecords[r.sourceType].get(String(r.sourceId));
    o.taskStatus = taskStatus(src, rec, todayStr);
    o.daysUntil = rec && src ? daysUntil(rec[src.dateField], todayStr) : (o.dueDate ? daysUntil(o.dueDate, todayStr) : null);
    o.responsiblePersonId = rec ? (rec.responsiblePersonId || rec.ownerPersonId || null) : null;
    o.responsibleName = o.responsiblePersonId ? (people.get(o.responsiblePersonId) || null) : null;
    return o;
  });
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
      const records = await src.model().findAll({ where: sourceWhere(src), limit: 2000 });
      monitored = records.length;
      for (const r of records) {
        const d = daysUntil(r[src.dateField], todayStr);
        if (d == null) continue;
        if (src.overdue ? d >= 0 : (d < 0 || d > (src.window || 0))) continue;
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

module.exports = { syncNotifications, istDate, daysUntil, SOURCES, listNotifications, markRead, markAllRead, unreadCount, enrich, statsSummary, sourceSummary };
