import { createFileRoute, redirect } from "@tanstack/react-router";

// Keep the old URL working while sending visitors to the fuller Join Us page.
// Translate the older ?tab= form links to the canonical ?role= parameter.
export const Route = createFileRoute("/Join")({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/JoinUs",
      search: (previous) => ({
        ...previous,
        role: previous.role ?? previous.tab,
      }),
      replace: true,
    });
  },
});
