// src/routes/admin.jsx
import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "../pages/AdminDashboard";
import AdminPortal from "../pages/AdminPortal";

const TOKEN_KEY = "ssf_admin_token";

function AdminAuthGate() {
    const token = localStorage.getItem(TOKEN_KEY) || "";
    return token ? <AdminDashboard /> : <AdminPortal />;
}

export const Route = createFileRoute("/admin")({
    component: AdminAuthGate,
});
