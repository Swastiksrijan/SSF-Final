import { createFileRoute } from "@tanstack/react-router";
import MissionPageEnhanced from "../pages/MissionPageEnhanced";

export const Route = createFileRoute("/Mission")({
    component: MissionPageEnhanced,
});

