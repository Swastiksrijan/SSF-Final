import { createFileRoute } from "@tanstack/react-router";
import FundingOutreachAdminPage from "../pages/FundingOutreachAdminPage";

export const Route = createFileRoute("/AdminFundingOutreach")({
  component: FundingOutreachAdminPage,
});
