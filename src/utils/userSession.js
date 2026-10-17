// One place for the logged-in user's session and the requests that need it.
//
// The account UUID is no longer enough to read or change a portal record: the
// backend now demands a signed token that proves the caller owns that account.
// The token arrives on login/signup, is kept next to the session, and is
// attached to every portal request (and to the official-document links, which
// open in a new tab and therefore carry it in the query string).
const SESSION_KEY = 'ssf_user_session';

export const readSession = () => {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
};

export const writeSession = (user) => {
  if (!user) { clearSession(); return null; }
  // Merge so a refreshed profile keeps the token issued at login.
  const merged = { ...(readSession() || {}), ...user };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(merged));
  // A persisted copy would silently re-authenticate after the tab closes.
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('ssf-auth-changed', { detail: merged }));
  return merged;
};

export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('ssf-auth-changed', { detail: null }));
};

export const getToken = () => readSession()?.token || '';

export const authHeaders = (extra = {}) => {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
};

// For <a href> / window.open targets, where a header cannot be set.
export const withToken = (url, accountId) => {
  if (!url) return url;
  const token = getToken();
  if (!token) return url;
  const [base, hash] = String(url).split('#');
  const separator = base.includes('?') ? '&' : '?';
  const accountPart = accountId && !base.includes('account=') ? `account=${encodeURIComponent(accountId)}&` : '';
  return `${base}${separator}${accountPart}token=${encodeURIComponent(token)}${hash ? `#${hash}` : ''}`;
};
