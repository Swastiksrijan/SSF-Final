import { createFileRoute } from "@tanstack/react-router";
import DonationRefundPolicy from "../pages/DonationRefundPolicy";

export const Route = createFileRoute("/DonationRefundPolicy")({
  component: DonationRefundPolicy,
});
