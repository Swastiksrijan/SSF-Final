// Automatic audit trail for the admin API.
//
// Rather than sprinkling an audit call into every handler (and forgetting one
// whenever a route is added), this wraps the admin API. Every state-changing
// admin request — POST/PATCH/PUT/DELETE under /api/admin — writes exactly one
// audit row once the response finishes, including failures, so "who tried to do
// what, and did it work" is always answerable. Read-only GETs are not logged to
// keep the trail meaningful.
const { recordAudit } = require('../services/auditService');

const MUTATING = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);
// Login is a POST but is not an administrative change; it is noise in the trail.
const SKIP = [/^\/api\/admin\/login$/i];

const ACTION_VERBS = {
  approve: 'approved',
  'member-approve': 'approved',
  status: 'status-changed',
  delete: 'deleted',
  update: 'updated',
};

// Turn "/api/admin/members/<uuid>/status" into
// { entityType: 'member', entityId: '<uuid>', action: 'status' }.
const describePath = (pathname) => {
  const match = pathname.match(/^\/api\/admin\/([a-z-]+)(?:\/([^/]+))?(?:\/([a-z-]+))?/i);
  if (!match) return { entityType: 'admin', entityId: null, action: null };
  const [, collection, second, third] = match;
  const singular = collection.replace(/s$/, '');
  const looksLikeId = second && /^[0-9a-f-]{8,}$/i.test(second);
  const action = looksLikeId ? (third || 'update') : (second || 'update');
  return { entityType: singular, entityId: looksLikeId ? second : null, action };
};

function adminAuditTrail() {
  return (req, res, next) => {
    // `req.path` is relative to the mount point ("/admin/..."), so the full
    // request path has to come from originalUrl for these checks to match.
    const pathname = String(req.originalUrl || req.url || "").split("?")[0];
    if (!MUTATING.has(req.method) || !/^\/api\/admin\//i.test(pathname) || SKIP.some((re) => re.test(pathname))) {
      return next();
    }

    let responseBody = null;
    const originalJson = res.json.bind(res);
    res.json = (body) => { responseBody = body; return originalJson(body); };

    res.on('finish', () => {
      const { entityType, entityId, action } = describePath(pathname);
      const ok = res.statusCode >= 200 && res.statusCode < 300;
      const name = responseBody?.fullName || responseBody?.data?.fullName || null;
      const message = responseBody?.message || (ok ? 'Completed' : `Failed (HTTP ${res.statusCode})`);
      recordAudit({
        actor: 'admin',
        action: ACTION_VERBS[action] || action || 'changed',
        entityType,
        entityId,
        entityName: name,
        summary: `${req.method} ${pathname} — ${message}`,
        detail: { statusCode: res.statusCode, ok },
        req,
      });
    });

    return next();
  };
}

module.exports = { adminAuditTrail };
