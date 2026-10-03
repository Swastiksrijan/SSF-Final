import { createFileRoute } from "@tanstack/react-router";
import LearningHubV2 from "../../pages/LearningHubV2";

export const Route = createFileRoute("/LearningHub/my-learning")({
  component: () => <LearningHubV2 view="my-learning" />,
});
