import { createFileRoute, redirect } from "@tanstack/react-router";

// Preserve the old public URL while directing visitors to the new section.
export const Route = createFileRoute("/SustainableLivelihood")({
  beforeLoad: () => { throw redirect({ to: "/SocialEnterprises" }); },
});
