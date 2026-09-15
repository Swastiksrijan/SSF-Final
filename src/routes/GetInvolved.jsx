import { createFileRoute } from "@tanstack/react-router";
import GetInvolvedPage from "../pages/GetInvolvedPage";
import WorkEvidenceBanner from "../components/WorkEvidenceBanner";

function GetInvolvedWithEvidence() {
  return <><WorkEvidenceBanner page="involvement" /><GetInvolvedPage /></>
}

export const Route = createFileRoute("/GetInvolved")({
  component: GetInvolvedWithEvidence,
});
