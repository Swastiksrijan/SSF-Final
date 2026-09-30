import { createFileRoute } from "@tanstack/react-router";
import Internship from "../pages/Internship";

export const Route = createFileRoute("/Internship")({
  component: Internship,
});
