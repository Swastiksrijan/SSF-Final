import { createFileRoute } from "@tanstack/react-router";
import FundingOutreachAdminPage from "../../pages/FundingOutreachAdminPage";

export const Route = createFileRoute("/admin/funding-outreach")({
  component: FundingOutreachAdminPage,
});
