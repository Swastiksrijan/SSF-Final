// src/routes/Media.jsx
import { createFileRoute } from "@tanstack/react-router";
import MediaGallery from "../pages/MediaGallery";
import WorkEvidenceBanner from "../components/WorkEvidenceBanner";

function MediaWithEvidence() {
  return <><WorkEvidenceBanner page="media" /><MediaGallery /></>
}

export const Route = createFileRoute("/Media")({
  component: MediaWithEvidence,
});
