import { createFileRoute } from "@tanstack/react-router";
import MembershipHardcopy from "../pages/MembershipHardcopy";

export const Route = createFileRoute("/MembershipHardcopy")({
  component: MembershipHardcopy,
});
