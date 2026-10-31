import { createFileRoute } from "@tanstack/react-router";
import FundingPartnershipsPage from "../pages/FundingPartnershipsPage";

export const Route = createFileRoute("/FundingPartnerships")({
  component: FundingPartnershipsPage,
});
