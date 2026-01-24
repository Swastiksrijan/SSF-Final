import { createFileRoute } from "@tanstack/react-router";
import GetInvolvedPage from "../pages/GetInvolvedPage";

export const Route = createFileRoute("/GetInvolved")({
  component: GetInvolvedPage,
});
