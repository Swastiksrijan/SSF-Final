// Tells apart "this request was bad" from "the database itself is down".
//
// When the production Postgres is unreachable or has hit its provider quota,
// EVERY query throws, so a generic "Server Error" blames the visitor for an
// outage that is not their fault. These helpers let the routes answer with an
// honest 503 and a message that says what actually happened.
const sequelize = require('../config/database');

const QUOTA_PATTERNS = [
    /exceeded the quota/i,
    /quota.*exceeded/i,
    /upgrade your plan/i,
];

const DOWN_PATTERNS = [
    /ECONNREFUSED/,
    /ETIMEDOUT/,
    /ENOTFOUND/,
    /EHOSTUNREACH/,
    /ECONNRESET/,
    /Connection terminated/,
    /terminating connection due to administrator command/,
    /the database system is (starting up|shutting down)/,
    /too many (clients|connections)/,
    /password authentication failed/,
    /getaddrinfo/,
];

// SQLSTATEs that mean the server/connection is the problem, not the query.
const DOWN_CODES = ['57P01', '53300', '08000', '08001', '08003', '08006', '08004', '3D000'];

const messageOf = (error) => {
    if (!error) return '';
    const parts = [
        error.message,
        error.parent && error.parent.message,
        error.original && error.original.message,
        typeof error === 'string' ? error : '',
    ];
    return parts.filter(Boolean).join(' | ');
};

const isQuotaError = (error) => QUOTA_PATTERNS.some((re) => re.test(messageOf(error)));

const isDatabaseDown = (error) => {
    if (!error) return false;
    if (isQuotaError(error)) return true;
    if (DOWN_PATTERNS.some((re) => re.test(messageOf(error)))) return true;
    const code = error.code || (error.parent && error.parent.code) || (error.original && error.original.code);
    return DOWN_CODES.includes(code);
};

const SERVICE_MESSAGE = 'Our database is temporarily unavailable, so this could not be saved. Your details are safe — please try again in a few minutes or contact SSF support.';

// Sends the 503 and returns true when the failure is a database outage.
// Returns false for ordinary application errors, so the caller keeps its own
// status/message for those.
const databaseUnavailableResponse = (res, error) => {
    if (!isDatabaseDown(error)) return false;
    res.status(503).json({ status: 'error', code: 'DATABASE_UNAVAILABLE', message: SERVICE_MESSAGE });
    return true;
};

// Live probe for the /api/health/db endpoint.
const databaseStatus = async () => {
    try {
        await sequelize.query('SELECT 1');
        return { ok: true, reachable: true };
    } catch (error) {
        return {
            ok: false,
            reachable: false,
            reason: isQuotaError(error) ? 'quota_exceeded' : 'unreachable',
            detail: messageOf(error),
        };
    }
};

module.exports = { isDatabaseDown, isQuotaError, databaseUnavailableResponse, databaseStatus, SERVICE_MESSAGE };
