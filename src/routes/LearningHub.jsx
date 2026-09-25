import { createFileRoute } from "@tanstack/react-router";
import LearningHub from "../pages/LearningHub";

function LearningHubWithEvidence() {
  return <LearningHub />
}

export const Route = createFileRoute("/LearningHub")({
  component: LearningHubWithEvidence,
});
