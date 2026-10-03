import { createFileRoute } from "@tanstack/react-router";
import LearningHubV2 from "../../pages/LearningHubV2";

export const Route = createFileRoute("/LearningHub/")({
  component: () => <LearningHubV2 view="home" />,
});
