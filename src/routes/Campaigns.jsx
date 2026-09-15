import { createFileRoute } from "@tanstack/react-router";
import CampaignsPage from "../pages/CampaignsPage";
import WorkEvidenceBanner from "../components/WorkEvidenceBanner";

function CampaignsWithEvidence() {
  return <><WorkEvidenceBanner page="campaigns" /><CampaignsPage /></>
}

export const Route = createFileRoute("/Campaigns")({
  component: CampaignsWithEvidence,
});
