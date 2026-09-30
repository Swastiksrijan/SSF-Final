// src/routes/AdminPortal.jsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/AdminPortal")({
    beforeLoad: () => {
        throw redirect({
            to: "/Admin",
            replace: true,
        });
    },
});
