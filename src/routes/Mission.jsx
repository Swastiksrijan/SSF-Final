import { createFileRoute } from "@tanstack/react-router";
import MissionPage from "../pages/MissionPage";

export const Route = createFileRoute("/Mission")({
    component: MissionPage,
});

