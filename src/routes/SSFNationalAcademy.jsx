import { createFileRoute } from "@tanstack/react-router";
import UpcomingProjects from "../pages/UpcomingProjects";

// Keep the legacy National Academy URL aligned with the current, accurate
// project-status page. The older page displayed an unsupported progress
// percentage and unapproved funding targets.
export const Route = createFileRoute("/SSFNationalAcademy")({
    component: UpcomingProjects,
});