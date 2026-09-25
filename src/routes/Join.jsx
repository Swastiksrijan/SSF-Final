import { createFileRoute } from "@tanstack/react-router";
import JoinFormPage from "../pages/JoinFormPage";

export const Route = createFileRoute("/Join")({
  component: JoinFormPage,
});
