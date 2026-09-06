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
    CONTACT: `${API_BASE_URL}/api/contact`,
    INTERNSHIP: `${API_BASE_URL}/api/internship`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
    ADMIN_VOLUNTEERS: `${API_BASE_URL}/api/admin/volunteers`,
    ADMIN_MEMBERS: `${API_BASE_URL}/api/admin/members`,
    ADMIN_APPROVE: (id) => `${API_BASE_URL}/api/admin/approve/${id}`,
    ADMIN_MEMBER_APPROVE: (id) => `${API_BASE_URL}/api/admin/member-approve/${id}`,
    ADMIN_DELETE_VOLUNTEER: (id) => `${API_BASE_URL}/api/admin/volunteers/${id}`,
    ADMIN_DELETE_MEMBER: (id) => `${API_BASE_URL}/api/admin/members/${id}`,
    VERIFY_CERT: (code) => `${API_BASE_URL}/api/verify/${code}`
};
