import { createFileRoute } from "@tanstack/react-router";
import LegalPolicies from "../pages/LegalPolicies";

export const Route = createFileRoute("/LegalPolicies")({
    component: LegalPolicies,
});
