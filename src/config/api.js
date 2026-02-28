// Centralized API Configuration
// Uses the environment variable VITE_BACKEND_URL if available (Production)
// Falls back to localhost:5000 (Development)

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/api/register`,
    MEMBER_SIGNUP: `${API_BASE_URL}/api/member-signup`,
    ADMIN_VOLUNTEERS: `${API_BASE_URL}/api/admin/volunteers`,
    ADMIN_APPROVE: (id) => `${API_BASE_URL}/api/admin/approve/${id}`,
    VERIFY_CERT: (code) => `${API_BASE_URL}/api/verify/${code}`
};
