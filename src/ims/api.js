// SSF-IMS API client. Reuses the existing office bearer token.
import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'ssf_admin_token';

function headers(extra = {}) {
  const token = localStorage.getItem(TOKEN_KEY) || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}

async function handle(res) {
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  if (!res.ok) {
    const err = new Error((body && body.message) || `Request failed (${res.status})`);
    err.status = res.status;
    err.duplicates = body && body.duplicates;
    throw err;
  }
  return body;
}

export const ims = {
  mainDashboard: () => fetch(`${API_BASE_URL}/api/ims/main-dashboard`, { headers: headers() }).then(handle),
  moduleDashboard: (m) => fetch(`${API_BASE_URL}/api/ims/module-dashboard/${m}`, { headers: headers() }).then(handle),
  roles: () => fetch(`${API_BASE_URL}/api/ims/roles`, { headers: headers() }).then(handle),
  seed: () => fetch(`${API_BASE_URL}/api/ims/seed`, { method: 'POST', headers: headers() }).then(handle),
  search: (q, filters = {}) => {
    const params = new URLSearchParams({ q: q || '' });
    for (const [k, v] of Object.entries(filters)) if (v) params.set(k, v);
    return fetch(`${API_BASE_URL}/api/ims/search?${params.toString()}`, { headers: headers() }).then(handle);
  },
  searchMeta: () => fetch(`${API_BASE_URL}/api/ims/search/meta`, { headers: headers() }).then(handle),
  volunteerNetwork: () => fetch(`${API_BASE_URL}/api/ims/volunteer-network`, { headers: headers() }).then(handle),
  person360: (id) => fetch(`${API_BASE_URL}/api/ims/person360/${id}`, { headers: headers() }).then(handle),
  meetingDossier: (id) => fetch(`${API_BASE_URL}/api/ims/meeting-dossier/${id}`, { headers: headers() }).then(handle),
  member360: (id) => fetch(`${API_BASE_URL}/api/ims/member360/${id}`, { headers: headers() }).then(handle),

  // ---- FINANCE: one entry point + professional accounting ----
  financeSeed: () => fetch(`${API_BASE_URL}/api/ims/finance/seed`, { method: 'POST', headers: headers() }).then(handle),
  financeDashboard: () => fetch(`${API_BASE_URL}/api/ims/finance/dashboard`, { headers: headers() }).then(handle),
  receiptsPayments: () => fetch(`${API_BASE_URL}/api/ims/finance/receipts-payments`, { headers: headers() }).then(handle),
  postVoucher: (payload) => fetch(`${API_BASE_URL}/api/ims/finance/receipts-payments`, {
    method: 'POST', headers: headers(), body: JSON.stringify(payload),
  }).then(handle),
  trialBalance: (params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/trial-balance?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  dayBook: (params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/day-book?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  cashBook: (params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/cash-book?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  bankBook: (params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/bank-book?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  budgetVariance: (params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/budget-variance?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  accountLedger: (accountId, params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/ledger/${accountId}?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),

  // ---- COST CENTRES (classification & reporting dimension) ----
  costCentreMeta: () => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/meta`, { headers: headers() }).then(handle),
  costCentreSeed: () => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/seed`, { method: 'POST', headers: headers() }).then(handle),
  costCentreDashboard: (params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/dashboard?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  costCentres: (params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  costCentre: (id) => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/${id}`, { headers: headers() }).then(handle),
  costCentreMonthly: (id, params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/${id}/monthly?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  costCentreQuarterly: (id, params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/${id}/quarterly?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),
  costCentreCloseCheck: (id) => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/${id}/close-check`, { headers: headers() }).then(handle),
  costCentreSetStatus: (id, status) => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/${id}/status`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ status }),
  }).then(handle),
  costCentreAnnual: (params = {}) => fetch(`${API_BASE_URL}/api/ims/finance/cost-centres/reports/annual?${new URLSearchParams(params)}`, { headers: headers() }).then(handle),

  // ---- VOLUNTEERS: import from the Leadership / Volunteer form ----
  volunteerSeed: () => fetch(`${API_BASE_URL}/api/ims/volunteers/seed`, { method: 'POST', headers: headers() }).then(handle),

  // ---- ORGANISATION PROFILE: master identity (seeded) ----
  orgProfileSeed: () => fetch(`${API_BASE_URL}/api/ims/org-profile/seed`, { method: 'POST', headers: headers() }).then(handle),
  officeHistorySeed: () => fetch(`${API_BASE_URL}/api/ims/office-history/seed`, { method: 'POST', headers: headers() }).then(handle),

  // ---- NOTIFICATION & ACTION CENTRE ----
  notifications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/api/ims/notifications${qs ? '?' + qs : ''}`, { headers: headers() }).then(handle);
  },
  notificationUnread: () => fetch(`${API_BASE_URL}/api/ims/notifications/unread-count`, { headers: headers() }).then(handle),
  notificationSources: () => fetch(`${API_BASE_URL}/api/ims/notifications/sources`, { headers: headers() }).then(handle),
  notificationSync: () => fetch(`${API_BASE_URL}/api/ims/notifications/sync`, { method: 'POST', headers: headers() }).then(handle),
  notificationRead: (id) => fetch(`${API_BASE_URL}/api/ims/notifications/${id}/read`, { method: 'POST', headers: headers() }).then(handle),
  notificationReadAll: () => fetch(`${API_BASE_URL}/api/ims/notifications/read-all`, { method: 'POST', headers: headers() }).then(handle),

  list: (resource, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/api/ims/${resource}${qs ? '?' + qs : ''}`, { headers: headers() }).then(handle);
  },
  get: (resource, id) => fetch(`${API_BASE_URL}/api/ims/${resource}/${id}`, { headers: headers() }).then(handle),
  history: (resource, id) => fetch(`${API_BASE_URL}/api/ims/${resource}/${id}/history`, { headers: headers() }).then(handle),
  create: (resource, payload, allowDuplicate = false) =>
    fetch(`${API_BASE_URL}/api/ims/${resource}${allowDuplicate ? '?allowDuplicate=true' : ''}`, {
      method: 'POST', headers: headers(), body: JSON.stringify(payload),
    }).then(handle),
  update: (resource, id, payload) =>
    fetch(`${API_BASE_URL}/api/ims/${resource}/${id}`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(payload),
    }).then(handle),
  archive: (resource, id, reason = '') =>
    fetch(`${API_BASE_URL}/api/ims/${resource}/${id}?reason=${encodeURIComponent(reason)}`, {
      method: 'DELETE', headers: headers(),
    }).then(handle),
  link: (fromType, fromId, toType, toId, relation) =>
    fetch(`${API_BASE_URL}/api/ims/link`, {
      method: 'POST', headers: headers(), body: JSON.stringify({ fromType, fromId, toType, toId, relation }),
    }).then(handle),

  // ---- SOCIAL AWARENESS PUBLISHER ----
  socialDashboard: () => fetch(`${API_BASE_URL}/api/social/dashboard`, { headers: headers() }).then(handle),
  socialConfig: () => fetch(`${API_BASE_URL}/api/social/config`, { headers: headers() }).then(handle),
  socialSaveConfig: (payload) => fetch(`${API_BASE_URL}/api/social/config`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) }).then(handle),
  socialPlan: (rebuild = false) => fetch(`${API_BASE_URL}/api/social/plan`, { method: 'POST', headers: headers(), body: JSON.stringify({ rebuild }) }).then(handle),
  socialRun: (force = true) => fetch(`${API_BASE_URL}/api/social/run`, { method: 'POST', headers: headers(), body: JSON.stringify({ force }) }).then(handle),
  socialPostNow: () => fetch(`${API_BASE_URL}/api/social/post-now`, { method: 'POST', headers: headers() }).then(handle),
  socialEditPost: (id, payload) => fetch(`${API_BASE_URL}/api/social/posts/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(payload) }).then(handle),
  socialPublishPost: (id) => fetch(`${API_BASE_URL}/api/social/posts/${id}/publish`, { method: 'POST', headers: headers() }).then(handle),
  socialConnect: (platform, payload) => fetch(`${API_BASE_URL}/api/social/channels/${platform}`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) }).then(handle),
  socialDisconnect: (platform) => fetch(`${API_BASE_URL}/api/social/channels/${platform}`, { method: 'DELETE', headers: headers() }).then(handle),
  socialTestChannel: (platform) => fetch(`${API_BASE_URL}/api/social/channels/${platform}/test`, { method: 'POST', headers: headers() }).then(handle),
  socialFbExchange: (payload) => fetch(`${API_BASE_URL}/api/social/facebook/exchange`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) }).then(handle),
  socialIgResolve: (payload) => fetch(`${API_BASE_URL}/api/social/instagram/resolve`, { method: 'POST', headers: headers(), body: JSON.stringify(payload || {}) }).then(handle),
};

// Public (no auth) social feed for the website News/Blog section.
export const publicSocial = {
  posts: (limit = 20) => fetch(`${API_BASE_URL}/api/social/posts?limit=${limit}`).then(handle),
  imageUrl: (post) => `${API_BASE_URL}/api/social/image/daily?postId=${post.id}&format=png`,
};
