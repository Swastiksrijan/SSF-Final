import { createFileRoute } from "@tanstack/react-router";
import CSRPartnershipWithForm from "../pages/CSRPartnershipWithForm";

export const Route = createFileRoute("/CSRPartnership")({
    component: CSRPartnershipWithForm,
});
