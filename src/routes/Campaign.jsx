import { createFileRoute } from "@tanstack/react-router";
import CampaignPage from "../pages/CampaignPage";

function CampaignSafe() {
  return (
    <div className="ssf-campaign-detail-safe">
      <style>{`
        .ssf-campaign-detail-safe [class*="text-2xl"],
        .ssf-campaign-detail-safe [class*="text-3xl"] { }
        .ssf-campaign-detail-safe div:has(> span.text-zinc-500) { display: none !important; }
      `}</style>
      <CampaignPage />
    </div>
  );
}

export const Route = createFileRoute("/Campaign")({
  component: CampaignSafe,
});
