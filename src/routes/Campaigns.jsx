import { createFileRoute } from "@tanstack/react-router";
import CampaignsPage from "../pages/CampaignsPage";
import WorkEvidenceBanner from "../components/WorkEvidenceBanner";

function CampaignsWithEvidence() {
  return (
    <div className="ssf-campaigns-safe">
      <style>{`
        .ssf-campaigns-safe div:has(> span.text-zinc-600.font-semibold.text-sm) { display: none !important; }
      `}</style>
      <WorkEvidenceBanner page="campaigns" />
      <CampaignsPage />
    </div>
  );
}

export const Route = createFileRoute("/Campaigns")({
  component: CampaignsWithEvidence,
});
