// src/routes/TermsAndConditions.jsx
import { createFileRoute } from "@tanstack/react-router";
import TermsAndConditions from "../pages/TermsAndConditions";

export const Route = createFileRoute("/TermsAndConditions")({
  component: TermsAndConditions,
});
