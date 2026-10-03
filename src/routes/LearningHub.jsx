import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import LearningHubNav from "../components/learning/LearningHubNav";

function LearningHubLayout() {
  const router = useRouter();
  const goSearch = () => router.navigate({ to: "/LearningHub/explore" });
  return <div className="min-h-screen bg-[#f6f8fb] font-inria text-zinc-900">
    <div className="pt-20 md:pt-[116px]">
      <LearningHubNav onSearch={goSearch} />
    </div>
    <Outlet />
  </div>;
}

export const Route = createFileRoute("/LearningHub")({
  component: LearningHubLayout,
});
