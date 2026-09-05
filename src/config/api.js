// Centralized API Configuration
// Uses VITE_BACKEND_URL when configured; otherwise uses the live Render backend in production.
// Local development continues to use localhost:5000.

const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const defaultBackendUrl = import.meta.env.PROD
    ? 'https://ngo-backend-03hq.onrender.com'
    : 'http://localhost:5000';

export const API_BASE_URL = (configuredBackendUrl || defaultBackendUrl).replace(/\/$/, '');

export const ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/api/register`,
    MEMBER_SIGNUP: `${API_BASE_URL}/api/member-signup`,
    MEMBER_LOGIN: `${API_BASE_URL}/api/member-login`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
    ADMIN_VOLUNTEERS: `${API_BASE_URL}/api/admin/volunteers`,
    ADMIN_MEMBERS: `${API_BASE_URL}/api/admin/members`,
    ADMIN_APPROVE: (id) => `${API_BASE_URL}/api/admin/approve/${id}`,
    VERIFY_CERT: (code) => `${API_BASE_URL}/api/verify/${code}`
};
