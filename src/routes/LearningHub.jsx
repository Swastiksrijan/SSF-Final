import { createFileRoute, Outlet } from "@tanstack/react-router";
import LearningHubNav from "../components/learning/LearningHubNav";

function LearningHubLayout() {
  return <div className="min-h-screen bg-[#f6f8fb] font-inria text-zinc-900">
    <div className="pt-20 md:pt-[116px]">
      <LearningHubNav />
    </div>
    <Outlet />
  </div>;
}

export const Route = createFileRoute("/LearningHub")({
  component: LearningHubLayout,
});
