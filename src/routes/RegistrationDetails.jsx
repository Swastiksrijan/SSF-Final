// src/routes/RegistrationDetails.jsx
import { createFileRoute } from "@tanstack/react-router";
import RegistrationDetails from "../pages/RegistrationDetails";

export const Route = createFileRoute("/RegistrationDetails")({
  component: RegistrationDetails,
});
