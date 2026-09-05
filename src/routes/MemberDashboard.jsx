import { createFileRoute } from "@tanstack/react-router";
import MemberDashboard from "../pages/MemberDashboard";

export const Route = createFileRoute("/MemberDashboard")({
  component: MemberDashboard,
});
