import { createFileRoute } from "@tanstack/react-router";
import UserPortal from "../pages/UserPortal";

export const Route = createFileRoute("/UserPortal")({
  component: UserPortal,
});
