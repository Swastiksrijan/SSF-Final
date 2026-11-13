import { createFileRoute } from "@tanstack/react-router";
import OrganizationStructureContent from "../components/OrganizationStructureContent";

export const Route = createFileRoute("/Organization")({
  component: OrganizationPage,
});

function OrganizationPage() {
  return <OrganizationStructureContent mode="public" />;
}
