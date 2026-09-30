import { createFileRoute } from "@tanstack/react-router";
import JoinUsPage from "../pages/JoinUsPage";

export const Route = createFileRoute("/JoinUs")({
  component: JoinUsPage,
});
