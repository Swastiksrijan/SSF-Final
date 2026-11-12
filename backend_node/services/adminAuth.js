// The one place that decides whether a request is an authenticated SSF admin.
//
// Every admin route used to repeat
//   `process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token'`
// so when the deployment did not set a secret, the literal string
// 'ssf-admin-portal-token' (which lives in this public repository) became the
// admin key and unlocked the whole admin surface.
//
// There is now no fallback. Without ADMIN_PORTAL_TOKEN configured, no request is
// treated as an admin and the portal login refuses — a misconfigured deployment
// fails closed instead of open.
const crypto = require('crypto');

// The configured admin token, or '' when this deployment has not set one.
const configuredToken = () => String(process.env.ADMIN_PORTAL_TOKEN || '').trim();

// Constant-time comparison so the token cannot be guessed one byte at a time.
const isAdminToken = (token) => {
  const expected = configuredToken();
  if (!expected) return false;
  const supplied = String(token || '');
  if (supplied.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
};

const bearer = (req) => {
  const header = (req && req.headers && req.headers.authorization) || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
};

const isAdminRequest = (req) => isAdminToken(bearer(req));

module.exports = { configuredToken, isAdminToken, bearer, isAdminRequest };
