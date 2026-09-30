import { createFileRoute } from "@tanstack/react-router";
import RefundAndCancellation from "../pages/RefundAndCancellation";

export const Route = createFileRoute("/RefundAndCancellation")({
  component: RefundAndCancellation,
});
