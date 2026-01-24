// src/routes/Media.jsx
import { createFileRoute } from "@tanstack/react-router";
import MediaGallery from "../pages/MediaGallery";

export const Route = createFileRoute("/Media")({
  component: MediaGallery,
});
