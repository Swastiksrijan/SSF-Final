// src/routes/members.jsx
import { createFileRoute } from "@tanstack/react-router";
import Members from "../pages/Members";

export const Route = createFileRoute("/Members")({
  component: Members,
});
