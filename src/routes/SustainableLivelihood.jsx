import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/SustainableLivelihood")({
  beforeLoad: () => {
    throw redirect({ to: "/FundingPartnerships" });
  },
});
