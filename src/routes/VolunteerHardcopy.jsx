import { createFileRoute } from "@tanstack/react-router";
import VolunteerHardcopy from "../pages/VolunteerHardcopy";

export const Route = createFileRoute("/VolunteerHardcopy")({
  component: VolunteerHardcopy,
});
