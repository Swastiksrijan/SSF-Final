import { createFileRoute } from "@tanstack/react-router";
import PremiumJoinPage from "../pages/PremiumJoinPage";

export const Route = createFileRoute("/Join")({
  component: PremiumJoinPage,
});
