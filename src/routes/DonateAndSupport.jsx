import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL retained for bookmarks and search engines; Donate is the canonical page.
export const Route = createFileRoute("/DonateAndSupport")({
  beforeLoad: () => {
    throw redirect({ to: "/Donate", replace: true });
  },
});
