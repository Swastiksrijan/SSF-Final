/**
 * Mock Database Utility using LocalStorage
 * This simulates a backend for the NGO Volunteer/Certificate system.
 */

const STORAGE_KEY = 'ssf_volunteer_applications';

export const mockDb = {
    // Save a new application
    saveApplication: (data) => {
        const applications = mockDb.getApplications();
        const newEntry = {
            id: crypto.randomUUID(),
            ...data,
            status: 'pending',
            certId: null,
            submittedAt: new Date().toISOString(),
        };
        applications.push(newEntry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
        return newEntry;
    },

    // Get all applications
    getApplications: () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    },

    // Approve an application
    approveApplication: (id) => {
        const applications = mockDb.getApplications();
        const index = applications.findIndex(app => app.id === id);
        if (index !== -1) {
            // Generate a unique Certificate ID
            const count = applications.filter(app => app.status === 'approved').length + 1;
            const certId = `SSF-VOL-2026-${String(count).padStart(4, '0')}`;

            applications[index].status = 'approved';
            applications[index].certId = certId;
            applications[index].approvedAt = new Date().toISOString();

            localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
            return applications[index];
        }
        return null;
    },

    // Reject an application
    rejectApplication: (id) => {
        const applications = mockDb.getApplications();
        const filtered = applications.filter(app => app.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    // Verify a certificate by ID
    verifyCertificate: (certId) => {
        const applications = mockDb.getApplications();
        return applications.find(app => app.certId === certId && app.status === 'approved');
    }
};
