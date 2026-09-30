// src/routes/volunteer.jsx
import { createFileRoute } from "@tanstack/react-router";
import Volunteer from "../pages/Volunteer";

export const Route = createFileRoute("/Volunteer")({
  component: Volunteer,
});
