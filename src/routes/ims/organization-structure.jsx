import { createFileRoute } from "@tanstack/react-router";
import ImsOrganizationStructure from "../../ims/pages/ImsOrganizationStructure";

export const Route = createFileRoute("/ims/organization-structure")({
  component: ImsOrganizationStructure,
});
