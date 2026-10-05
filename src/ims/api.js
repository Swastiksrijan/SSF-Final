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
  search: (q) => fetch(`${API_BASE_URL}/api/ims/search?q=${encodeURIComponent(q)}`, { headers: headers() }).then(handle),
  person360: (id) => fetch(`${API_BASE_URL}/api/ims/person360/${id}`, { headers: headers() }).then(handle),

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
};
