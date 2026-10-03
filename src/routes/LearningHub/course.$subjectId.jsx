import { createFileRoute, useParams } from "@tanstack/react-router";
import LearningHubV2 from "../../pages/LearningHubV2";

function CourseRoute() {
  const { subjectId } = useParams({ from: "/LearningHub/course/$subjectId" });
  return <LearningHubV2 view="course" subjectIdParam={subjectId} />;
}

export const Route = createFileRoute("/LearningHub/course/$subjectId")({
  component: CourseRoute,
});
