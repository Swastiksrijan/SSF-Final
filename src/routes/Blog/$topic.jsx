import { createFileRoute, useParams } from "@tanstack/react-router";
import Blog from "../../pages/Blog";
import BlogShareEnhancer from "../components/BlogShareEnhancer";
import SingleKnowledgeStory from "../components/SingleKnowledgeStory";
import BlogKnowledgeStories from "../components/BlogKnowledgeStories";
import BlogHubHeader from "../components/BlogHubHeader";

function BlogTopicRoutePage() {
  const { topic } = useParams({ from: "/Blog/$topic" });
  return (
    <BlogShareEnhancer>
      <div className="pt-28 bg-black min-h-screen text-white px-4">
        <BlogHubHeader initialTopic={topic} />
        <BlogKnowledgeStories>
          <Blog />
        </BlogKnowledgeStories>
        <SingleKnowledgeStory />
      </div>
    </BlogShareEnhancer>
  );
}

export const Route = createFileRoute("/Blog/$topic")({
  component: BlogTopicRoutePage,
});
