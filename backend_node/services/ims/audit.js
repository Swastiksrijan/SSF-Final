// SSF-IMS audit trail + universal relationship helpers.
const { models } = require('../../models/ims');

async function logAudit({ entityType, entityId, action, actor, oldValue, newValue, reason, req }) {
  try {
    await models.ImsAuditTrail.create({
      entityType, entityId, action,
      actor: actor || (req && req.headers && req.headers['x-office-actor']) || 'system',
      oldValue: oldValue || null,
      newValue: newValue || null,
      reason: reason || null,
      ip: req ? (req.ip || (req.headers && req.headers['x-forwarded-for'])) : null,
      userAgent: req ? (req.headers && req.headers['user-agent']) : null,
    });
  } catch (e) {
    // Audit must never break the main operation, but it must be visible.
    console.error('IMS audit log failed:', e.message);
  }
}

/** Link two records both ways so each side can show "Related Records". */
async function link(fromType, fromId, toType, toId, relation, meta) {
  if (!fromType || !fromId || !toType || !toId) return;
  const exists = await models.ImsRelation.findOne({
    where: { fromType, fromId: String(fromId), toType, toId: String(toId), relation },
  });
  if (exists) return exists;
  await models.ImsRelation.create({
    fromType, fromId: String(fromId), toType, toId: String(toId),
    relation: relation || 'related', meta: meta || null,
  });
  // reverse link (skip self-links)
  if (!(fromType === toType && String(fromId) === String(toId))) {
    await models.ImsRelation.create({
      fromType: toType, fromId: String(toId), toType: fromType, toId: String(fromId),
      relation: relation || 'related', meta: meta || null,
    });
  }
}

/** All relations for a record, grouped by related type. */
async function relationsOf(type, id) {
  const rows = await models.ImsRelation.findAll({
    where: { fromType: type, fromId: String(id) },
  });
  return rows.map(r => ({ type: r.toType, id: r.toId, relation: r.relation, meta: r.meta }));
}

module.exports = { logAudit, link, relationsOf };
