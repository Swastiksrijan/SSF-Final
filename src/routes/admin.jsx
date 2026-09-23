// src/routes/admin.jsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import AdminDashboard from "../pages/AdminDashboard";
import { ENDPOINTS } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";

export const Route = createFileRoute("/admin")({
    beforeLoad: async ({ location }) => {
        const token = localStorage.getItem(TOKEN_KEY) || "";
        if (!token) {
            throw redirect({
                to: "/AdminPortal",
                search: { redirect: location.href },
                replace: true,
            });
        }

        try {
            const response = await fetch(ENDPOINTS.DIGITAL_OFFICE_SUMMARY, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                localStorage.removeItem(TOKEN_KEY);
                throw redirect({
                    to: "/AdminPortal",
                    search: { redirect: location.href },
                    replace: true,
                });
            }
        } catch (error) {
            if (error && typeof error === "object" && "isRedirect" in error) throw error;
            localStorage.removeItem(TOKEN_KEY);
            throw redirect({
                to: "/AdminPortal",
                search: { redirect: location.href },
                replace: true,
            });
        }
    },
    component: AdminDashboard,
});
