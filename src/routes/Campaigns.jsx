import { createFileRoute } from "@tanstack/react-router";
import CampaignsPage from "../pages/CampaignsPage";

export const Route = createFileRoute("/Campaigns")({
    component: CampaignsPage,
});
