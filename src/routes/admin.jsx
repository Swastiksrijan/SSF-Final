// src/routes/admin.jsx
import { createFileRoute } from "@tanstack/react-router";
import AdminPortal from "../pages/AdminPortal";

export const Route = createFileRoute("/admin")({
    component: AdminPortal,
});
