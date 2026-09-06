// src/routes/admin.jsx
import { createFileRoute } from "@tanstack/react-router";
import AdminPortalV2 from "../pages/AdminPortalV2";

export const Route = createFileRoute("/admin")({
    component: AdminPortalV2,
});
