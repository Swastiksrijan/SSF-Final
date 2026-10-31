import { createFileRoute } from "@tanstack/react-router";
import PartnerOutreachPage from "../pages/PartnerOutreachPage";

export const Route = createFileRoute("/PartnerOutreach")({
  component: PartnerOutreachPage,
});
