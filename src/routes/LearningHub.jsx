import { createFileRoute } from "@tanstack/react-router";
import LearningHub from "../pages/LearningHub";
import WorkEvidenceBanner from "../components/WorkEvidenceBanner";

function LearningHubWithEvidence() {
  return <><WorkEvidenceBanner page="learning" /><LearningHub /></>
}

export const Route = createFileRoute("/LearningHub")({
  component: LearningHubWithEvidence,
});
