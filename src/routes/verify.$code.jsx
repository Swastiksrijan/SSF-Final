import { createFileRoute } from "@tanstack/react-router";
import VerifyDocument from "../pages/VerifyDocument";

export const Route = createFileRoute("/verify/$code")({
  component: VerifyDocument,
});
