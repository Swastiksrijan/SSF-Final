// Correspondence & Communication Management (पत्राचार एवं संचार प्रबंधन).
//
// One master module (`communications`) holds both Outward and Inward entries;
// the two registers are filtered views of it. This service adds the pieces the
// generic resource engine does not: a human-readable reference number, the
// dashboard counts, follow-up queueing and Outward<->Inward reply linking.
const { models, sequelize } = require('../../models/ims');
const { Op } = require('sequelize');
const { logAudit } = require('./audit');
const { currentFyStartYear } = require('./ids');

const OUT = 'SSF/OUT';
const IN = 'SSF/IN';

function fyLabel(date = new Date()) {
  const y = currentFyStartYear(asDate(date));
  return `${y}-${String((y + 1) % 100).padStart(2, '0')}`;
}

// Callers pass the correspondence date as an ISO string (from the register form)
// or a Date; normalise so the FY maths never sees a string.
function asDate(v) {
  if (!v) return new Date();
  return v instanceof Date ? v : new Date(v);
}

/**
 * Next reference number, e.g. SSF/OUT/2026-27/001. Sequence is per prefix+Fy and
 * permanent (never reused); it also seeds itself from the highest number already
 * present so existing/imported records are never collided with.
 */
async function nextReference(direction, date) {
  const prefix = direction === 'inward' ? IN : OUT;
  const fy = fyLabel(date || new Date());
  return sequelize.transaction(async (t) => {
    const [rows] = await sequelize.query(
      `SELECT "referenceNo" FROM "ImsCommunications" WHERE "referenceNo" LIKE :like`,
      { replacements: { like: `${prefix}/${fy}/%` }, transaction: t },
    );
    let max = 0;
    for (const r of rows) {
      const m = String(r.referenceNo || '').match(/(\d+)$/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
    return `${prefix}/${fy}/${String(max + 1).padStart(3, '0')}`;
  });
}

const one = (v) => (v == null ? null : (Array.isArray(v) ? v[0] : v));

/** List communications with the filters the register exposes. */
async function list(query = {}) {
  const where = {};
  const status = one(query.status);
  where.status = status || { [Op.ne]: 'archived' };

  const direction = one(query.direction);
  if (direction) where.direction = direction;
  const mode = one(query.mode);
  if (mode) where.mode = mode;
  const communicationType = one(query.communicationType);
  if (communicationType) where.communicationType = communicationType;
  const deliveryStatus = one(query.deliveryStatus);
  if (deliveryStatus) where.deliveryStatus = deliveryStatus;
  const replyStatus = one(query.replyStatus);
  if (replyStatus) where.replyStatus = replyStatus;
  const followUpStatus = one(query.followUpStatus);
  if (followUpStatus) where.followUpStatus = followUpStatus;

  const from = one(query.fromDate);
  const to = one(query.toDate);
  if (from || to) {
    where.correspondenceDate = {};
    if (from) where.correspondenceDate[Op.gte] = from;
    if (to) where.correspondenceDate[Op.lte] = to;
  }

  const search = one(query.search);
  if (search) {
    const like = { [Op.iLike]: `%${search}%` };
    where[Op.or] = [
      { referenceNo: like }, { subject: like }, { department: like },
      { recipient: like }, { sender: like }, { recipientEmail: like },
      { senderEmail: like }, { toEmails: like }, { ccEmails: like },
      { recordId: like },
    ];
  }

  const limit = Math.min(Number(one(query.limit)) || 100, 1000);
  const offset = Number(one(query.offset)) || 0;
  const { rows, count } = await models.ImsCommunication.findAndCountAll({
    where, limit, offset, order: [['correspondenceDate', 'DESC'], ['id', 'DESC']],
  });
  return { records: rows, total: count };
}

const startOfToday = () => new Date().toISOString().slice(0, 10);

// A DATEONLY column comes back as 'YYYY-MM-DD' from Postgres but as a Date from
// some drivers; normalise before any string comparison.
function dateOnly(v) {
  if (!v) return null;
  if (typeof v === 'string') return v.slice(0, 10);
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

/** Real, database-backed dashboard counts. */
async function dashboard() {
  const M = models.ImsCommunication;
  const live = { status: { [Op.ne]: 'archived' } };
  const count = (w) => M.count({ where: { ...live, ...w } });
  const today = startOfToday();
  const [total, outward, inward, awaiting, received, failed, followUpDue, closed] = await Promise.all([
    count({}),
    count({ direction: 'outward' }),
    count({ direction: 'inward' }),
    count({ direction: 'outward', replyStatus: 'awaiting_reply' }),
    // "Replies received" = outward letters that have at least one linked reply.
    count({ direction: 'outward', replyCount: { [Op.gt]: 0 } }),
    count({ deliveryStatus: { [Op.in]: ['failed', 'returned'] } }),
    count({ followUpDate: { [Op.lte]: today }, followUpStatus: { [Op.notIn]: ['closed', 'follow_up_done', 'not_required'] } }),
    count({ status: 'closed' }),
  ]);
  return { total, outward, inward, awaitingReplies: awaiting, repliesReceived: received, failed, followUpDue, closed };
}

/** Follow-up / pending-reply queue. `overdue` = past the follow-up date. */
async function followUps({ scope = 'due' } = {}) {
  const where = { status: { [Op.ne]: 'archived' } };
  if (scope === 'pending') where.replyStatus = 'awaiting_reply';
  else if (scope === 'due') {
    where.followUpDate = { [Op.lte]: startOfToday() };
    where.followUpStatus = { [Op.notIn]: ['closed', 'follow_up_done', 'not_required'] };
  }
  const rows = await models.ImsCommunication.findAll({
    where, order: [['followUpDate', 'ASC'], ['id', 'DESC']], limit: 500,
  });
  const today = startOfToday();
  return {
    records: rows.map((r) => ({
      ...r.toJSON(),
      overdue: !!(dateOnly(r.followUpDate) && dateOnly(r.followUpDate) < today),
    })),
  };
}

/**
 * Link an Inward reply to the Outward it answers.
 * - the outward is never modified destructively (only its reply bookkeeping)
 * - multiple inward replies may point at one outward
 * - re-linking an inward away from a previous outward decrements that outward
 */
async function linkReply(inwardIdOrRef, outwardIdOrRef, req) {
  const find = (v) => (/^\d+$/.test(String(v)) ? { id: v } : { recordId: v });
  const inward = await models.ImsCommunication.findOne({ where: find(inwardIdOrRef) });
  if (!inward) { const e = new Error('Inward record not found'); e.status = 404; throw e; }
  if (inward.direction !== 'inward') { const e = new Error('Only an inward record can be linked as a reply'); e.status = 400; throw e; }

  const outward = await models.ImsCommunication.findOne({ where: find(outwardIdOrRef) });
  if (!outward) { const e = new Error('Outward record not found'); e.status = 404; throw e; }
  if (outward.direction !== 'outward') { const e = new Error('Reply must link to an outward record'); e.status = 400; throw e; }

  const prevId = inward.linkedOutwardId;
  const before = inward.toJSON();

  inward.linkedOutwardId = outward.id;
  inward.linkedOutwardRef = outward.referenceNo || outward.recordId;
  inward.replyStatus = 'reply_received';
  if (!inward.replyDate) inward.replyDate = inward.correspondenceDate || startOfToday();
  inward.updatedBy = (req && req.imsRole) || 'system';
  await inward.save();

  // Recompute the outward's reply bookkeeping (count + status).
  const replies = await models.ImsCommunication.count({
    where: { linkedOutwardId: outward.id, status: { [Op.ne]: 'archived' } },
  });
  const prevCount = prevId && prevId !== outward.id
    ? await models.ImsCommunication.count({ where: { linkedOutwardId: prevId, status: { [Op.ne]: 'archived' } } })
    : null;
  if (prevId && prevId !== outward.id) {
    const prev = await models.ImsCommunication.findByPk(prevId);
    if (prev) {
      prev.replyCount = prevCount;
      if (!prevCount) { prev.replyStatus = 'awaiting_reply'; prev.replyDate = null; }
      await prev.save();
    }
  }
  outward.replyCount = replies;
  outward.replyStatus = 'reply_received';
  outward.replyDate = inward.replyDate || startOfToday();
  await outward.save();

  await logAudit({ entityType: 'communications', entityId: inward.recordId, action: 'reply_link', oldValue: before, newValue: { linkedOutwardRef: inward.linkedOutwardRef }, req });
  await logAudit({ entityType: 'communications', entityId: outward.recordId, action: 'reply_received', newValue: { replyCount: replies }, req });
  return { inward, outward };
}

/** Remove a reply link (correction) — the outward row is preserved. */
async function unlinkReply(inwardIdOrRef, req) {
  const find = (v) => (/^\d+$/.test(String(v)) ? { id: v } : { recordId: v });
  const inward = await models.ImsCommunication.findOne({ where: find(inwardIdOrRef) });
  if (!inward) { const e = new Error('Inward record not found'); e.status = 404; throw e; }
  const before = inward.toJSON();
  const prevId = inward.linkedOutwardId;
  inward.linkedOutwardId = null;
  inward.linkedOutwardRef = null;
  inward.replyStatus = 'awaiting_reply';
  await inward.save();
  if (prevId) {
    const outward = await models.ImsCommunication.findByPk(prevId);
    if (outward) {
      const replies = await models.ImsCommunication.count({
        where: { linkedOutwardId: outward.id, status: { [Op.ne]: 'archived' } },
      });
      outward.replyCount = replies;
      if (!replies) { outward.replyStatus = 'awaiting_reply'; outward.replyDate = null; }
      await outward.save();
    }
  }
  await logAudit({ entityType: 'communications', entityId: inward.recordId, action: 'reply_unlink', oldValue: before, newValue: { linkedOutwardId: null }, req });
  return inward;
}

/** All replies linked to one outward (for the outward detail view). */
async function repliesOf(outwardIdOrRef) {
  const find = (v) => (/^\d+$/.test(String(v)) ? { id: v } : { recordId: v });
  const outward = await models.ImsCommunication.findOne({ where: find(outwardIdOrRef) });
  if (!outward) return { outward: null, replies: [] };
  const replies = await models.ImsCommunication.findAll({
    where: { linkedOutwardId: outward.id, status: { [Op.ne]: 'archived' } },
    order: [['correspondenceDate', 'ASC'], ['id', 'ASC']],
  });
  return { outward, replies };
}

/** Candidate outward records to link a reply to (search by ref/dept/subject). */
async function linkCandidates({ search = '', limit = 30 } = {}) {
  const where = { direction: 'outward', status: { [Op.ne]: 'archived' } };
  if (search) {
    const like = { [Op.iLike]: `%${search}%` };
    where[Op.or] = [{ referenceNo: like }, { department: like }, { subject: like }, { recipient: like }, { recordId: like }];
  }
  const rows = await models.ImsCommunication.findAll({
    where, order: [['correspondenceDate', 'DESC'], ['id', 'DESC']], limit: Math.min(Number(limit) || 30, 100),
  });
  return { records: rows };
}

/** Department-wise summary for the reports page. */
async function departmentWise() {
  const rows = await models.ImsCommunication.findAll({
    where: { status: { [Op.ne]: 'archived' } },
    attributes: ['department', 'direction'],
  });
  const map = new Map();
  for (const r of rows) {
    const key = r.department || '(not set)';
    const cur = map.get(key) || { department: key, outward: 0, inward: 0, total: 0 };
    if (r.direction === 'inward') cur.inward += 1; else cur.outward += 1;
    cur.total += 1;
    map.set(key, cur);
  }
  return { records: [...map.values()].sort((a, b) => b.total - a.total) };
}

module.exports = {
  nextReference, fyLabel, list, dashboard, followUps,
  linkReply, unlinkReply, repliesOf, linkCandidates, departmentWise,
};
