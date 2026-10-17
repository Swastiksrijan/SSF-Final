// Best-effort audit writer.
//
// Auditing must never break the action it is recording: if the audit table is
// missing (a database that predates this feature and has not been migrated yet)
// or the insert fails for any reason, the failure is logged and swallowed so the
// approval / deletion / payment still completes.
const AuditLog = require('../models/AuditLog');

const MAX_SUMMARY = 400;

async function recordAudit({ actor = 'admin', action, entityType, entityId = null, entityName = null, summary = null, detail = null, req = null }) {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || null : null;
    return await AuditLog.create({
      actor: String(actor || 'admin').slice(0, 120),
      action: String(action || 'unknown').slice(0, 120),
      entityType: String(entityType || 'record').slice(0, 120),
      entityId: entityId ? String(entityId).slice(0, 120) : null,
      entityName: entityName ? String(entityName).slice(0, 240) : null,
      summary: summary ? String(summary).slice(0, MAX_SUMMARY) : null,
      detail: detail || null,
      ip: ip ? String(ip).slice(0, 120) : null,
    });
  } catch (error) {
    console.warn('Audit write skipped:', error.message);
    return null;
  }
}

module.exports = { recordAudit };
