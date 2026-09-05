// Centralized API Configuration
const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const defaultBackendUrl = import.meta.env.PROD ? 'https://ngo-backend-03hq.onrender.com' : 'http://localhost:5000';
export const API_BASE_URL = (configuredBackendUrl || defaultBackendUrl).replace(/\/$/, '');

export const ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/api/register`,
    MEMBER_SIGNUP: `${API_BASE_URL}/api/member-signup`,
    MEMBER_ACCOUNT_SIGNUP: `${API_BASE_URL}/api/member-account-signup`,
    MEMBER_LOGIN: `${API_BASE_URL}/api/member-login`,
    MEMBER_STATUS: (id) => `${API_BASE_URL}/api/member-status/${id}`,
    MEMBER_PAYMENT_LINK: `${API_BASE_URL}/api/member-payment-link`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
    ADMIN_VOLUNTEERS: `${API_BASE_URL}/api/admin/volunteers`,
    ADMIN_MEMBERS: `${API_BASE_URL}/api/admin/members`,
    ADMIN_APPROVE: (id) => `${API_BASE_URL}/api/admin/approve/${id}`,
    ADMIN_MEMBER_APPROVE: (id) => `${API_BASE_URL}/api/admin/member-approve/${id}`,
    VERIFY_CERT: (code) => `${API_BASE_URL}/api/verify/${code}`
};
