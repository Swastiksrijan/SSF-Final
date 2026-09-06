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
    USER_PORTAL: (id) => `${API_BASE_URL}/api/user-portal/${id}`,
    MEMBER_PROFILE_PHOTO: (id) => `${API_BASE_URL}/api/member-profile/${encodeURIComponent(id)}/photo`,
    USER_DOCUMENT: (type, id, accountId) => `${API_BASE_URL}/api/user-document/${type}/${encodeURIComponent(id)}?account=${encodeURIComponent(accountId)}`,
    VERIFY: (code) => `${API_BASE_URL}/api/verify/${encodeURIComponent(code)}`,
    MEMBER_PAYMENT_LINK: `${API_BASE_URL}/api/member-payment-link`,
    CONTACT: `${API_BASE_URL}/api/contact`,
    INTERNSHIP: `${API_BASE_URL}/api/internship`,
    DONOR: `${API_BASE_URL}/api/donor`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
    ADMIN_VOLUNTEERS: `${API_BASE_URL}/api/admin/volunteers`,
    ADMIN_MEMBERS: `${API_BASE_URL}/api/admin/members`,
    ADMIN_CONTACTS: `${API_BASE_URL}/api/admin/contacts`,
    ADMIN_INTERESTS: `${API_BASE_URL}/api/admin/interests`,
    ADMIN_INTERNSHIPS: `${API_BASE_URL}/api/admin/internships`,
    ADMIN_CONTACT_STATUS: (id) => `${API_BASE_URL}/api/admin/contacts/${id}/status`,
    ADMIN_INTEREST_STATUS: (id) => `${API_BASE_URL}/api/admin/interests/${id}/status`,
    ADMIN_INTERNSHIP_STATUS: (id) => `${API_BASE_URL}/api/admin/internships/${id}/status`,
    ADMIN_APPROVE: (id) => `${API_BASE_URL}/api/admin/approve/${id}`,
    ADMIN_MEMBER_APPROVE: (id) => `${API_BASE_URL}/api/admin/member-approve/${id}`,
    ADMIN_DELETE_VOLUNTEER: (id) => `${API_BASE_URL}/api/admin/volunteers/${id}`,
    ADMIN_UPDATE_VOLUNTEER: (id) => `${API_BASE_URL}/api/admin/volunteers/${id}`,
    ADMIN_VOLUNTEER_STATUS: (id) => `${API_BASE_URL}/api/admin/volunteers/${id}/status`,
    ADMIN_DELETE_MEMBER: (id) => `${API_BASE_URL}/api/admin/members/${id}`,
    ADMIN_UPDATE_MEMBER: (id) => `${API_BASE_URL}/api/admin/members/${id}`,
    ADMIN_MEMBER_STATUS: (id) => `${API_BASE_URL}/api/admin/members/${id}/status`,
    ADMIN_DELETE_CONTACT: (id) => `${API_BASE_URL}/api/admin/contacts/${id}`,
    ADMIN_DELETE_INTEREST: (id) => `${API_BASE_URL}/api/admin/interests/${id}`,
    ADMIN_DELETE_INTERNSHIP: (id) => `${API_BASE_URL}/api/admin/internships/${id}`,
    VERIFY_CERT: (code) => `${API_BASE_URL}/api/verify/${encodeURIComponent(code)}`
};