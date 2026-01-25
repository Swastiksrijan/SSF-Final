// src/routes/AdminPortal.jsx
import { createFileRoute } from "@tanstack/react-router";
import AdminPortal from "../pages/AdminPortal";

export const Route = createFileRoute("/AdminPortal")({
    component: AdminPortal,
});
