import { createFileRoute } from "@tanstack/react-router";
import Donor from "../pages/Donor";

export const Route = createFileRoute("/Donor")({
  component: Donor,
});
