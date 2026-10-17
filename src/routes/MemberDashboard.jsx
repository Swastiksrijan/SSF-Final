// Legacy route. The old member dashboard was a second, thinner copy of the user
// portal; everything it did now lives in /UserPortal. Old links (including the
// Razorpay payment callback) still land here, so the visitor is forwarded to the
// one real dashboard.
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/MemberDashboard")({
  beforeLoad: () => {
    throw redirect({ to: "/UserPortal", replace: true });
  },
});
