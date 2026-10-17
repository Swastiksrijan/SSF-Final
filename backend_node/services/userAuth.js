// Signed session tokens for logged-in SSF users.
//
// The portal endpoints used to be addressed by a bare account UUID
// (/api/user-portal/:id, /api/member-profile/:id/photo, /api/member-status/:id,
// /api/user-document/...?account=<id>). Anyone who learned a UUID could read or
// change that person's data, so every one of those routes now requires a token
// that proves the caller IS that account.
//
// The token is a compact HMAC-signed envelope: base64url(payload).base64url(sig).
// It is deliberately stateless (no server-side session table) so it survives the
// free-tier Render restarts, and it carries an expiry so a leaked token is not
// valid forever.
const crypto = require('crypto');

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const TOKEN_VERSION = 'v1';

const secret = () =>
  process.env.AUTH_TOKEN_SECRET ||
  process.env.JWT_SECRET ||
  process.env.AUTH_PEPPER ||
  process.env.ADMIN_PORTAL_TOKEN ||
  'ssf-dev-insecure-token-secret';

const b64url = (buffer) => Buffer.from(buffer).toString('base64url');
const fromB64url = (value) => Buffer.from(String(value), 'base64url');

const sign = (payloadB64) => b64url(crypto.createHmac('sha256', secret()).update(payloadB64).digest());

function issueToken(member, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    v: TOKEN_VERSION,
    sub: String(member.id),
    email: String(member.email || '').trim().toLowerCase(),
    iat: now,
    exp: now + ttlSeconds,
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64)}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;
  const expected = sign(payloadB64);
  const supplied = String(signature);
  if (expected.length !== supplied.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied))) return null;
  let payload;
  try {
    payload = JSON.parse(fromB64url(payloadB64).toString('utf8'));
  } catch {
    return null;
  }
  if (!payload || payload.v !== TOKEN_VERSION || !payload.sub) return null;
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';

const bearer = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
};

// Resolves the account a request is allowed to act on.
//
// Returns { ok: true, accountId, admin: false } when a valid user token owns the
// requested id, { ok: true, admin: true } when an admin token is presented (so
// the admin portal can still open an applicant's official document), and
// { ok: false, status, message } otherwise.
function authorizeAccount(req, requestedId) {
  const token = bearer(req);
  if (!token) return { ok: false, status: 401, message: 'Please log in to continue.' };

  if (token === getAdminToken()) return { ok: true, admin: true, token };

  const payload = verifyToken(token);
  if (!payload) return { ok: false, status: 401, message: 'Your session has expired. Please log in again.' };

  if (requestedId && String(requestedId) !== payload.sub) {
    return { ok: false, status: 403, message: 'You can only access your own account.' };
  }
  return { ok: true, admin: false, accountId: payload.sub, email: payload.email, token };
}

// Express middleware for routes where the id lives in the path or query string.
// `pick(req)` returns the id the route is about; omitted -> id is optional.
function requireAccountAuth(pick) {
  return (req, res, next) => {
    const requestedId = typeof pick === 'function' ? pick(req) : undefined;
    const result = authorizeAccount(req, requestedId);
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    req.account = result;
    next();
  };
}

module.exports = {
  issueToken,
  verifyToken,
  authorizeAccount,
  requireAccountAuth,
  getAdminToken,
  DEFAULT_TTL_SECONDS,
};
