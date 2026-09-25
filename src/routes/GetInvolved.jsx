import { createFileRoute } from "@tanstack/react-router";
import GetInvolvedPage from "../pages/GetInvolvedPage";
import WorkEvidenceBanner from "../components/WorkEvidenceBanner";

function GetInvolvedWithEvidence() {
  return <><GetInvolvedPage /><WorkEvidenceBanner page="involvement" /></>
}

export const Route = createFileRoute("/GetInvolved")({
  component: GetInvolvedWithEvidence,
});
