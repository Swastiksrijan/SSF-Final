import { createFileRoute } from "@tanstack/react-router";
import OrganizationPage from "../pages/OrganizationPage";

export const Route = createFileRoute("/Organization")({
  component: OrganizationPage,
});
