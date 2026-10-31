// src/routes/DonateAndSupport.jsx
import { createFileRoute } from "@tanstack/react-router";
import DonatePage from "../pages/DonatePage";

export const Route = createFileRoute("/DonateAndSupport")({
  component: DonatePage,
});
