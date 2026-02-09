// src/routes/learningHub.jsx
import { createFileRoute } from "@tanstack/react-router";
import LearningHub from "../pages/LearningHub";

export const Route = createFileRoute("/LearningHub")({
  component: LearningHub,
});
