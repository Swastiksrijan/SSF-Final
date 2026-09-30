import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

// Keep Learning Hub isolated so a course-module issue cannot blank the main site.

const LearningHub = lazy(() => import("../pages/LearningHubV2"));

function LearningHubWithEvidence() {
  return (
    <Suspense fallback={<div style={{ padding: 24, textAlign: "center" }}>Learning Hub loading…</div>}>
      <LearningHub />
    </Suspense>
  );
}

export const Route = createFileRoute("/LearningHub")({
  component: LearningHubWithEvidence,
});
